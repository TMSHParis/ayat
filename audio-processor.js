// AudioWorklet processor for real-time audio capture
// Resamples from native sample rate to 16kHz mono
// Sends 300ms chunks (4800 samples at 16kHz)
class AudioStreamProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = [];
    this._bufferSize = 4800; // 300ms at 16kHz
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const channelData = input[0];
    const inputSampleRate = sampleRate; // global in AudioWorklet
    const outputSampleRate = 16000;
    const ratio = inputSampleRate / outputSampleRate;

    // Nearest-neighbor downsampling
    for (let i = 0; i < channelData.length; i += ratio) {
      this._buffer.push(channelData[Math.floor(i)]);
    }

    if (this._buffer.length >= this._bufferSize) {
      const chunk = new Float32Array(this._buffer);
      this.port.postMessage(chunk.buffer, [chunk.buffer]);
      this._buffer = [];
    }

    return true;
  }
}

registerProcessor('audio-stream-processor', AudioStreamProcessor);
