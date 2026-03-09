// ============================================
// follow-worker.js — Qurani Recitation Follow Worker
// ONNX-based Arabic speech recognition (offline)
// Ported from offline-tarteel (yazinsai/offline-tarteel)
// ============================================

// ONNX Runtime Web loaded lazily inside init()
var ortLoaded = false;

// ========== CONSTANTS ==========
var SAMPLE_RATE = 16000;
var N_FFT = 512;
var HOP_LENGTH = 160;
var WIN_LENGTH = 400;
var N_MELS = 80;
var PREEMPH = 0.97;
var DITHER = 1e-5;
var LOG_GUARD = 1e-5;
var MEL_FLOOR = 1e-10;

var TRIGGER_SECONDS = 0.75;
var TRIGGER_SAMPLES = SAMPLE_RATE * TRIGGER_SECONDS; // 12000 samples
var MAX_WINDOW_SECONDS = 5.0;
var MAX_WINDOW_SAMPLES = SAMPLE_RATE * MAX_WINDOW_SECONDS; // 80000 samples

var MODEL_URL = '/api/model';
var MODEL_SIZE = 131652337; // 125.6 Mo
var DB_NAME = 'qurani-models';
var STORE_NAME = 'models';
var MODEL_KEY = 'fastconformer-ar-ctc-v1';

// ========== STATE ==========
var session = null;
var decoder = null;
var audioBuffer = new Float32Array(0);
var newAudioCount = 0;
var isProcessing = false;
var processingStartTime = 0;     // timestamp when isProcessing was set to true
var PROCESSING_TIMEOUT_MS = 8000; // max 8s for one inference cycle
var totalChunksReceived = 0;
var totalInferenceDone = 0;
var lastTranscriptTime = 0;
var hannWin = null;
var melFilters = null;

// ========== UTILITIES ==========
function post(msg) { self.postMessage(msg); }

function concatFloat32(a, b) {
  var result = new Float32Array(a.length + b.length);
  result.set(a);
  result.set(b, a.length);
  return result;
}

// ========== HANN WINDOW (periodic) ==========
function createHannWindow(length) {
  var win = new Float64Array(length);
  for (var i = 0; i < length; i++) {
    win[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / length));
  }
  return win;
}

// ========== FFT (Radix-2 Cooley-Tukey, in-place) ==========
function fft(re, im) {
  var N = re.length;
  // Bit-reversal permutation
  for (var i = 1, j = 0; i < N; i++) {
    var bit = N >> 1;
    while (j & bit) { j ^= bit; bit >>= 1; }
    j ^= bit;
    if (i < j) {
      var tmp = re[i]; re[i] = re[j]; re[j] = tmp;
      tmp = im[i]; im[i] = im[j]; im[j] = tmp;
    }
  }
  // Butterfly computation
  for (var len = 2; len <= N; len *= 2) {
    var halfLen = len / 2;
    var angle = -2 * Math.PI / len;
    var wRe = Math.cos(angle);
    var wIm = Math.sin(angle);
    for (var i = 0; i < N; i += len) {
      var curRe = 1, curIm = 0;
      for (var j = 0; j < halfLen; j++) {
        var idx1 = i + j;
        var idx2 = i + j + halfLen;
        var tRe = curRe * re[idx2] - curIm * im[idx2];
        var tIm = curRe * im[idx2] + curIm * re[idx2];
        re[idx2] = re[idx1] - tRe;
        im[idx2] = im[idx1] - tIm;
        re[idx1] += tRe;
        im[idx1] += tIm;
        var newCurRe = curRe * wRe - curIm * wIm;
        curIm = curRe * wIm + curIm * wRe;
        curRe = newCurRe;
      }
    }
  }
}

// ========== MEL FILTERBANK (HTK scale, Slaney norm) ==========
function hzToMel(f) { return 2595.0 * Math.log10(1.0 + f / 700.0); }
function melToHz(m) { return 700.0 * (Math.pow(10, m / 2595.0) - 1.0); }

function createMelFilterBank(numFreqBins, numMelFilters, minFreq, maxFreq, sr) {
  var minMel = hzToMel(minFreq);
  var maxMel = hzToMel(maxFreq);
  var melPoints = new Array(numMelFilters + 2);
  for (var i = 0; i < numMelFilters + 2; i++) {
    melPoints[i] = minMel + (maxMel - minMel) * i / (numMelFilters + 1);
  }
  var hzPoints = [];
  for (var i = 0; i < melPoints.length; i++) { hzPoints.push(melToHz(melPoints[i])); }
  var fftFreqs = new Float64Array(numFreqBins);
  for (var i = 0; i < numFreqBins; i++) {
    fftFreqs[i] = i * sr / (2 * (numFreqBins - 1));
  }
  var filters = [];
  for (var m = 0; m < numMelFilters; m++) {
    var filter = new Float64Array(numFreqBins);
    var left = hzPoints[m];
    var center = hzPoints[m + 1];
    var right = hzPoints[m + 2];
    for (var i = 0; i < numFreqBins; i++) {
      var f = fftFreqs[i];
      if (f >= left && f < center) {
        filter[i] = (f - left) / (center - left);
      } else if (f >= center && f <= right) {
        filter[i] = (right - f) / (right - center);
      }
    }
    // Slaney normalization
    var enorm = 2.0 / (right - left);
    for (var i = 0; i < numFreqBins; i++) { filter[i] *= enorm; }
    filters.push(filter);
  }
  return filters;
}

// ========== MEL SPECTROGRAM ==========
function computeMelSpectrogram(audio) {
  // 1. Dither
  var dithered = new Float32Array(audio.length);
  for (var i = 0; i < audio.length; i++) {
    dithered[i] = audio[i] + DITHER * (Math.random() * 2 - 1);
  }
  // 2. Preemphasis (right-to-left like HuggingFace)
  for (var i = dithered.length - 1; i >= 1; i--) {
    dithered[i] -= PREEMPH * dithered[i - 1];
  }
  // 3. Initialize window and mel filters (once)
  if (!hannWin) hannWin = createHannWindow(WIN_LENGTH);
  if (!melFilters) melFilters = createMelFilterBank(N_FFT / 2 + 1, N_MELS, 0, 8000, SAMPLE_RATE);
  // 4. Frame the signal (center=false)
  var numFrames = Math.floor((dithered.length - WIN_LENGTH) / HOP_LENGTH) + 1;
  if (numFrames <= 0) return null;
  var numFreqBins = N_FFT / 2 + 1; // 257
  // 5. Process each frame: window → FFT → power → mel
  var melSpec = new Float32Array(N_MELS * numFrames);
  for (var frame = 0; frame < numFrames; frame++) {
    var start = frame * HOP_LENGTH;
    var re = new Float64Array(N_FFT); // zero-padded to N_FFT
    var im = new Float64Array(N_FFT);
    for (var i = 0; i < WIN_LENGTH; i++) {
      re[i] = dithered[start + i] * hannWin[i];
    }
    fft(re, im);
    // Power spectrum + mel filterbank
    for (var m = 0; m < N_MELS; m++) {
      var sum = 0;
      var filter = melFilters[m];
      for (var i = 0; i < numFreqBins; i++) {
        sum += filter[i] * (re[i] * re[i] + im[i] * im[i]);
      }
      melSpec[m * numFrames + frame] = Math.max(sum, MEL_FLOOR);
    }
  }
  // 6. Log with guard
  for (var i = 0; i < melSpec.length; i++) {
    melSpec[i] = Math.log(melSpec[i] + LOG_GUARD);
  }
  // 7. Per-feature normalization (per mel bin)
  for (var m = 0; m < N_MELS; m++) {
    var sum = 0;
    for (var t = 0; t < numFrames; t++) sum += melSpec[m * numFrames + t];
    var mean = sum / numFrames;
    var sumSq = 0;
    for (var t = 0; t < numFrames; t++) {
      var diff = melSpec[m * numFrames + t] - mean;
      sumSq += diff * diff;
    }
    var std = Math.sqrt(sumSq / numFrames) || 1e-10;
    for (var t = 0; t < numFrames; t++) {
      melSpec[m * numFrames + t] = (melSpec[m * numFrames + t] - mean) / std;
    }
  }
  return { features: melSpec, timeFrames: numFrames };
}

// ========== CTC DECODER ==========
function CTCDecoder(vocabJson) {
  this.vocab = {};
  var maxId = 0;
  for (var id in vocabJson) {
    if (vocabJson.hasOwnProperty(id)) {
      var numId = parseInt(id);
      this.vocab[numId] = vocabJson[id];
      if (numId > maxId) maxId = numId;
    }
  }
  this.blankId = maxId;
}
CTCDecoder.prototype.decode = function(logprobs, timeSteps, vocabSize) {
  var ids = [];
  for (var t = 0; t < timeSteps; t++) {
    var maxIdx = 0;
    var maxVal = logprobs[t * vocabSize];
    for (var v = 1; v < vocabSize; v++) {
      var val = logprobs[t * vocabSize + v];
      if (val > maxVal) { maxVal = val; maxIdx = v; }
    }
    ids.push(maxIdx);
  }
  var tokens = [];
  var prev = -1;
  for (var i = 0; i < ids.length; i++) {
    var id = ids[i];
    if (id !== prev && id !== this.blankId) {
      tokens.push(this.vocab[id] || '');
    }
    prev = id;
  }
  return tokens.join('').replace(/\u2581/g, ' ').trim();
};

// ========== MODEL CACHE (IndexedDB) ==========
function openModelDB() {
  return new Promise(function(resolve, reject) {
    var req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = function() { req.result.createObjectStore(STORE_NAME); };
    req.onsuccess = function() { resolve(req.result); };
    req.onerror = function() { reject(req.error); };
  });
}

function getModelFromCache() {
  return openModelDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(STORE_NAME, 'readonly');
      var req = tx.objectStore(STORE_NAME).get(MODEL_KEY);
      req.onsuccess = function() { resolve(req.result || null); };
      req.onerror = function() { reject(req.error); };
    });
  });
}

function saveModelToCache(data) {
  return openModelDB().then(function(db) {
    return new Promise(function(resolve, reject) {
      var tx = db.transaction(STORE_NAME, 'readwrite');
      var req = tx.objectStore(STORE_NAME).put(data, MODEL_KEY);
      req.onsuccess = function() { resolve(); };
      req.onerror = function() { reject(req.error); };
    });
  });
}

function loadModel(url, onProgress) {
  return getModelFromCache().then(function(cached) {
    if (cached && cached.byteLength > 1000000) {
      console.log('[follow-worker] Model loaded from cache (' + (cached.byteLength / 1048576).toFixed(1) + ' Mo)');
      if (onProgress) onProgress(1, 1);
      return cached;
    }
    if (cached) {
      console.warn('[follow-worker] Cached model too small (' + cached.byteLength + ' bytes), re-downloading');
    }
    console.log('[follow-worker] Fetching model from: ' + url);
    return fetch(url).then(function(response) {
      console.log('[follow-worker] Model response: status=' + response.status + ' ok=' + response.ok);
      if (!response.ok) {
        throw new Error('Model download failed: HTTP ' + response.status);
      }
      if (!response.body) {
        throw new Error('Model response has no body (streaming not supported)');
      }
      var total = parseInt(response.headers.get('content-length') || '0') || MODEL_SIZE;
      console.log('[follow-worker] Model size: ' + total + ' bytes, starting stream read...');
      var reader = response.body.getReader();
      var chunks = [];
      var loaded = 0;
      function read() {
        return reader.read().then(function(result) {
          if (result.done) {
            console.log('[follow-worker] Download complete: ' + loaded + ' bytes in ' + chunks.length + ' chunks');
            var buffer = new Uint8Array(loaded);
            var offset = 0;
            for (var i = 0; i < chunks.length; i++) {
              buffer.set(chunks[i], offset);
              offset += chunks[i].length;
            }
            return saveModelToCache(buffer.buffer).then(function() {
              console.log('[follow-worker] Model saved to IndexedDB');
              return buffer.buffer;
            });
          }
          chunks.push(result.value);
          loaded += result.value.length;
          if (onProgress) onProgress(loaded, total);
          return read();
        });
      }
      return read();
    });
  }).catch(function(err) {
    console.error('[follow-worker] loadModel error:', err);
    throw err;
  });
}

// ========== ONNX SESSION ==========
function createOnnxSession(modelBuffer) {
  ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.0/dist/';
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.simd = true;
  return ort.InferenceSession.create(modelBuffer, {
    executionProviders: ['wasm']
  }).then(function(s) {
    session = s;
  });
}

function runInference(melFeatures, numMels, timeFrames) {
  if (!session) throw new Error('Session not initialized');
  var inputTensor = new ort.Tensor('float32', melFeatures, [1, numMels, timeFrames]);
  var lengthTensor = new ort.Tensor('int64', BigInt64Array.from([BigInt(timeFrames)]), [1]);
  var feeds = {};
  feeds[session.inputNames[0]] = inputTensor;
  feeds[session.inputNames[1]] = lengthTensor;
  return session.run(feeds).then(function(results) {
    var outputTensor = results[session.outputNames[0]];
    return {
      logprobs: outputTensor.data,
      timeSteps: outputTensor.dims[1],
      vocabSize: outputTensor.dims[2]
    };
  });
}

// ========== TRANSCRIBE ==========
function transcribe(audio) {
  var mel = computeMelSpectrogram(audio);
  if (!mel) return Promise.resolve('');
  return runInference(mel.features, N_MELS, mel.timeFrames).then(function(result) {
    return decoder.decode(result.logprobs, result.timeSteps, result.vocabSize);
  });
}

// ========== INIT ==========
function init() {
  console.log('[follow-worker] init() called');
  try {
    // 1. Load ONNX Runtime Web (lazy, first time only)
    if (!ortLoaded) {
      post({ type: 'status', message: 'Chargement du moteur vocal...' });
      console.log('[follow-worker] Loading ONNX Runtime Web...');
      importScripts('https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.0/dist/ort.min.js');
      ortLoaded = true;
      console.log('[follow-worker] ONNX Runtime loaded OK, ort version:', typeof ort !== 'undefined' ? 'present' : 'missing');
    }
  } catch (e) {
    console.error('[follow-worker] ONNX load failed:', e);
    post({ type: 'error', message: 'Erreur chargement ONNX: ' + (e.message || String(e)) });
    return Promise.resolve();
  }

  // 2. Load vocab + model + session
  post({ type: 'status', message: 'Chargement du vocabulaire...' });
  console.log('[follow-worker] Fetching vocab.json...');
  return fetch('vocab.json').then(function(res) {
    if (!res.ok) throw new Error('vocab.json: ' + res.status);
    return res.json();
  }).then(function(vocabJson) {
    console.log('[follow-worker] Vocab loaded, ' + Object.keys(vocabJson).length + ' tokens');
    decoder = new CTCDecoder(vocabJson);
    post({ type: 'status', message: 'T\u00e9l\u00e9chargement du mod\u00e8le vocal...' });
    return loadModel(MODEL_URL, function(loaded, total) {
      post({ type: 'progress', loaded: loaded, total: total });
    });
  }).then(function(modelBuffer) {
    console.log('[follow-worker] Model buffer ready: ' + modelBuffer.byteLength + ' bytes');
    post({ type: 'status', message: 'Initialisation du mod\u00e8le...' });
    return createOnnxSession(modelBuffer);
  }).then(function() {
    console.log('[follow-worker] ONNX session created — ready!');
    post({ type: 'ready' });
  }).catch(function(err) {
    console.error('[follow-worker] init failed:', err);
    post({ type: 'error', message: err.message || String(err) });
  });
}

// ========== AUDIO PROCESSING ==========
function processAudio() {
  if (!session || !decoder) return Promise.resolve();

  // Safety: if isProcessing has been stuck for too long, force-reset it
  if (isProcessing) {
    var elapsed = Date.now() - processingStartTime;
    if (elapsed > PROCESSING_TIMEOUT_MS) {
      console.warn('[follow-worker] isProcessing stuck for ' + (elapsed / 1000).toFixed(1) + 's — force resetting');
      isProcessing = false;
      // Also post a heartbeat so main thread knows we recovered
      post({ type: 'heartbeat', status: 'recovered', inferences: totalInferenceDone, chunks: totalChunksReceived });
    } else {
      return Promise.resolve();
    }
  }

  if (audioBuffer.length < TRIGGER_SAMPLES) return Promise.resolve();
  isProcessing = true;
  processingStartTime = Date.now();
  newAudioCount = 0;
  if (audioBuffer.length > MAX_WINDOW_SAMPLES) {
    audioBuffer = audioBuffer.slice(-MAX_WINDOW_SAMPLES);
  }
  var audioCopy = audioBuffer.slice();
  return transcribe(audioCopy).then(function(text) {
    totalInferenceDone++;
    isProcessing = false;
    if (text && text.trim().length > 2) {
      lastTranscriptTime = Date.now();
      post({ type: 'transcript', text: text.trim() });
    }
    // Periodic health log every 10 inferences
    if (totalInferenceDone % 10 === 0) {
      console.log('[follow-worker] health: inferences=' + totalInferenceDone + ' chunks=' + totalChunksReceived + ' buffer=' + audioBuffer.length);
    }
  }).catch(function(err) {
    console.error('[follow-worker] Transcription error:', err);
    isProcessing = false;
  });
}

// ========== MESSAGE HANDLER ==========
self.onmessage = function(e) {
  var msg = e.data;
  if (msg.type === 'init') {
    init();
  } else if (msg.type === 'audio') {
    var samples = new Float32Array(msg.samples);
    totalChunksReceived++;
    audioBuffer = concatFloat32(audioBuffer, samples);
    newAudioCount += samples.length;
    if (newAudioCount >= TRIGGER_SAMPLES) {
      processAudio();
    }
  } else if (msg.type === 'advance') {
    // Soft reset: keep last 0.5s of audio for continuity
    var keepSamples = SAMPLE_RATE / 2; // 8000 samples = 0.5s
    if (audioBuffer.length > keepSamples) {
      audioBuffer = audioBuffer.slice(-keepSamples);
    }
    newAudioCount = audioBuffer.length; // so trigger fires sooner
    isProcessing = false;
    processingStartTime = 0;
  } else if (msg.type === 'reset') {
    audioBuffer = new Float32Array(0);
    newAudioCount = 0;
    isProcessing = false;
    processingStartTime = 0;
    totalChunksReceived = 0;
    totalInferenceDone = 0;
  } else if (msg.type === 'ping') {
    // Health check from main thread
    post({
      type: 'pong',
      isProcessing: isProcessing,
      processingAge: isProcessing ? (Date.now() - processingStartTime) : 0,
      bufferLen: audioBuffer.length,
      chunks: totalChunksReceived,
      inferences: totalInferenceDone
    });
  }
};
