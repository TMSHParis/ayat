/* ============================================
   QURANI — app.js
   Pure vanilla JS, zero dependencies
   ============================================ */

(function () {
  "use strict";

  // ---- SURAH NAMES IN FRENCH ----
  var SURAH_NAMES_FR = [
    "", // index 0 unused
    "L'Ouverture", "La Vache", "La Famille d'Imran", "Les Femmes",
    "La Table Servie", "Les Bestiaux", "Al-A'raf", "Le Butin",
    "Le Repentir", "Jonas", "Houd", "Joseph",
    "Le Tonnerre", "Abraham", "Al-Hijr", "Les Abeilles",
    "Le Voyage Nocturne", "La Caverne", "Marie", "Ta-Ha",
    "Les Prophètes", "Le Pèlerinage", "Les Croyants", "La Lumière",
    "Le Critère", "Les Poètes", "Les Fourmis", "Le Récit",
    "L'Araignée", "Les Romains", "Louqman", "La Prosternation",
    "Les Coalisés", "Saba", "Le Créateur", "Ya-Sin",
    "Les Rangés", "Sad", "Les Groupes", "Le Pardonneur",
    "Les Versets Détaillés", "La Consultation", "L'Ornement", "La Fumée",
    "L'Agenouillée", "Al-Ahqaf", "Mouhammad", "La Victoire Éclatante",
    "Les Appartements", "Qaf", "Les Vents", "Le Mont",
    "L'Étoile", "La Lune", "Le Tout Miséricordieux", "L'Événement",
    "Le Fer", "La Discussion", "L'Exode", "L'Éprouvée",
    "Le Rang", "Le Vendredi", "Les Hypocrites", "La Grande Perte",
    "Le Divorce", "L'Interdiction", "La Royauté", "La Plume",
    "Celle qui Montre la Vérité", "Les Voies d'Ascension", "Noé", "Les Djinns",
    "L'Enveloppé", "Le Revêtu d'un Manteau", "La Résurrection", "L'Homme",
    "Les Envoyés", "La Nouvelle", "Les Anges qui Arrachent", "Il S'est Renfrogné",
    "L'Obscurcissement", "La Rupture", "Les Fraudeurs", "La Déchirure",
    "Les Constellations", "L'Astre Nocturne", "Le Très-Haut", "L'Enveloppante",
    "L'Aube", "La Cité", "Le Soleil", "La Nuit",
    "Le Jour Montant", "L'Ouverture de la Poitrine", "Le Figuier", "L'Adhérence",
    "La Destinée", "La Preuve", "Le Tremblement de Terre", "Les Coursiers",
    "Le Fracas", "La Course aux Richesses", "Le Temps", "Le Calomniateur",
    "L'Éléphant", "Quraych", "L'Ustensile", "L'Abondance",
    "Les Infidèles", "Le Secours", "Les Fibres", "Le Monothéisme Pur",
    "L'Aube Naissante", "Les Hommes"
  ];

  // ---- DATA ----
  var surahs = [];
  var surahsFr = []; // French translation (parallel structure)
  var totalAyat = 0;
  var BASMALA = ""; // extracted from surah 1, verse 1
  var BASMALA_FR = "Au nom d'Allah, le Tout Mis\u00e9ricordieux, le Tr\u00e8s Mis\u00e9ricordieux.";

  // ---- STATE ----
  var STORAGE_KEY = "qurani-app-state";
  // Migrate from old storage key (Verset → Qurani)
  (function migrateStorage() {
    var OLD_KEY = "verset-app-state";
    if (!localStorage.getItem(STORAGE_KEY) && localStorage.getItem(OLD_KEY)) {
      localStorage.setItem(STORAGE_KEY, localStorage.getItem(OLD_KEY));
      localStorage.removeItem(OLD_KEY);
    }
  })();
  var state = null;
  var goalDismissed = false;

  // ---- BOOKMARKS ----
  var BOOKMARKS_KEY = "qurani-bookmarks";
  function loadBookmarks() {
    try {
      var raw = localStorage.getItem(BOOKMARKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function saveBookmarks(bookmarks) {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }

  // ---- FOLDERS ----
  var FOLDERS_KEY = "qurani-folders";
  function loadFolders() {
    try {
      var raw = localStorage.getItem(FOLDERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function saveFolders(folders) {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  }
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  function getFolderName(folderId) {
    if (!folderId) return null;
    var folders = loadFolders();
    for (var i = 0; i < folders.length; i++) {
      if (folders[i].id === folderId) return folders[i].name;
    }
    return null;
  }

  var pendingBookmarkAyah = null;

  // ---- STATS ----
  var STATS_KEY = "qurani-stats";
  function loadStats() {
    try {
      var raw = localStorage.getItem(STATS_KEY);
      if (!raw) return { totalVersesRead: 0, readDates: [], streak: 0 };
      return JSON.parse(raw);
    } catch (e) { return { totalVersesRead: 0, readDates: [], streak: 0 }; }
  }
  function saveStats(stats) {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }
  function recordReading() {
    var stats = loadStats();
    stats.totalVersesRead++;
    var today = getLocalDateStr();
    if (stats.readDates.indexOf(today) === -1) {
      stats.readDates.push(today);
      // Keep only last 365 days
      if (stats.readDates.length > 365) stats.readDates = stats.readDates.slice(-365);
    }
    // Calculate streak
    stats.streak = computeStreak(stats.readDates);
    saveStats(stats);
  }
  function computeStreak(dates) {
    if (!dates || dates.length === 0) return 0;
    var sorted = dates.slice().sort().reverse();
    var today = getLocalDateStr();
    // If today is not in the list, check yesterday
    var checkDate = today;
    if (sorted[0] !== today) {
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      var yStr = yesterday.getFullYear() + "-" + String(yesterday.getMonth() + 1).padStart(2, "0") + "-" + String(yesterday.getDate()).padStart(2, "0");
      if (sorted[0] !== yStr) return 0;
      checkDate = yStr;
    }
    var streak = 0;
    var d = new Date(checkDate + "T12:00:00");
    for (var i = 0; i < 365; i++) {
      var dStr = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      if (sorted.indexOf(dStr) !== -1) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  // ---- TOAST ----
  var toastTimer = null;
  function showToast(msg) {
    var existing = document.querySelector(".toast");
    if (existing) existing.remove();
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(function () {
      el.classList.add("show");
    });
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove("show");
      setTimeout(function () { el.remove(); }, 300);
    }, 2000);
  }

  // ---- TAJWID OVERLAY (lazy-loaded) ----
  var tajwidData = null;
  var tajwidLoading = false;
  var segmentCache = new Map();

  // Waqf / pause marks and non-recitation structural signs.
  // Removed in Minimal mode; kept in Tajwid mode.
  // Range covers: U+0615 (small high tah), U+06D6-U+06E4 (pause/sajda/hizb marks),
  // U+06E7-U+06ED (superscript recitation annotations).
  // Excludes U+06E5-U+06E6 (small waw/yeh — actual letter shapes in Uthmani text).
  var WAQF_REGEX = /[\u0615\u06D6-\u06E4\u06E7-\u06ED]/g;

  function stripWaqfMarks(text) {
    return text.replace(WAQF_REGEX, "");
  }

  // Split text into colored segments using tajwid overlay markers.
  // Returns array of { chars: string, rule: string|null }.
  function segmentAyah(text, overlays) {
    if (!overlays || overlays.length === 0) {
      return [{ chars: text, rule: null }];
    }
    var sorted = overlays.slice().sort(function (a, b) { return a.start - b.start; });
    var segments = [];
    var pos = 0;
    var len = text.length;
    for (var i = 0; i < sorted.length; i++) {
      var ov = sorted[i];
      var start = Math.min(Math.max(ov.start, pos), len);
      var end   = Math.min(ov.end, len);
      if (start >= len) break;
      if (pos < start) {
        segments.push({ chars: text.slice(pos, start), rule: null });
      }
      if (start < end) {
        segments.push({ chars: text.slice(start, end), rule: ov.rule });
      }
      pos = end;
    }
    if (pos < len) {
      segments.push({ chars: text.slice(pos), rule: null });
    }
    return segments;
  }

  // ---- ALGORITHMIC TAJWID DETECTION ----
  // Detects basic tajweed rules from raw Arabic text when no curated overlay exists.
  // Covers: qalqalah, ghunnah, madd, idgham, ikhfaa, iqlab, izhar.
  function detectTajwidOverlays(text) {
    var overlays = [];
    var n = text.length;
    var SUKUN = 0x0652, SHADDA = 0x0651, FATHA = 0x064E, DAMMA = 0x064F, KASRA = 0x0650;
    var TANWIN_F = 0x064B, TANWIN_D = 0x064C, TANWIN_K = 0x064D;
    var MADDA_ABV = 0x0653, SMALL_ALEF = 0x0670;
    var NUN = 0x0646, MEEM = 0x0645;
    var ALEF = 0x0627, ALEF_W = 0x0671, WAW = 0x0648, YAH = 0x064A, ALEF_M = 0x0649;
    var QALQALAH = new Set([0x0642, 0x0637, 0x0628, 0x062C, 0x062F]); // ق ط ب ج د
    var IDGHAM   = new Set([YAH, ALEF_M, 0x0631, MEEM, 0x0644, WAW, NUN]); // ي ى ر م ل و ن
    var IKHFAA   = new Set([0x062A,0x062B,0x062C,0x062F,0x0630,0x0632,0x0633,0x0634,0x0635,0x0636,0x0637,0x0638,0x0641,0x0642,0x0643]);
    var IZHAR    = new Set([0x062D,0x062E,0x0639,0x063A,0x0647,0x0621,0x0623,0x0624,0x0625,0x0626]);

    function isDiac(cp) {
      return (cp >= 0x064B && cp <= 0x065F) || cp === SMALL_ALEF || cp === MADDA_ABV ||
             (cp >= 0x06D6 && cp <= 0x06ED) || cp === 0x0615;
    }
    function hasDiac(pos, dc) {
      for (var k = pos + 1; k < n; k++) {
        var c = text.codePointAt(k);
        if (!isDiac(c)) break;
        if (c === dc) return true;
      }
      return false;
    }
    function getEnd(pos) {
      var e = pos + 1;
      while (e < n && isDiac(text.codePointAt(e))) e++;
      return e;
    }
    function nextBase(from) {
      var i = from;
      while (i < n) {
        var c = text.codePointAt(i);
        if (c !== 0x20 && c !== 0x200C && !isDiac(c)) return i;
        i++;
      }
      return -1;
    }

    var i = 0;
    while (i < n) {
      var c = text.codePointAt(i);
      if (isDiac(c) || c === 0x20 || c === 0x200C) { i++; continue; }
      var end = getEnd(i);

      // Qalqalah: ق ط ب ج د + sukun
      if (QALQALAH.has(c) && hasDiac(i, SUKUN)) {
        overlays.push({ start: i, end: end, rule: 'qalqalah' }); i = end; continue;
      }
      // Ghunnah: ن or م + shadda
      if ((c === NUN || c === MEEM) && hasDiac(i, SHADDA)) {
        overlays.push({ start: i, end: end, rule: 'ghunnah' }); i = end; continue;
      }
      // Madd: letter with explicit madda sign or small high alef
      if (hasDiac(i, MADDA_ABV) || hasDiac(i, SMALL_ALEF)) {
        overlays.push({ start: i, end: end, rule: 'madd' }); i = end; continue;
      }
      // Madd: bare alef/waw/yah/alef-maqsura after appropriate vowel
      if (end === i + 1 && (c === ALEF || c === ALEF_W || c === WAW || c === YAH || c === ALEF_M)) {
        var pv = -1;
        for (var kk = i - 1; kk >= 0; kk--) {
          var pc = text.codePointAt(kk);
          if (!isDiac(pc)) break;
          if (pc === FATHA || pc === DAMMA || pc === KASRA) { pv = pc; break; }
        }
        var isMadd = ((c === ALEF || c === ALEF_W) && pv === FATHA) ||
                     (c === WAW && pv === DAMMA) ||
                     ((c === YAH || c === ALEF_M) && pv === KASRA);
        if (isMadd) { overlays.push({ start: i, end: end, rule: 'madd' }); i = end; continue; }
      }
      // Noon sakin / tanwin rules (idgham, ikhfaa, iqlab, izhar)
      var noonSakin = (c === NUN && hasDiac(i, SUKUN));
      var tanwin = hasDiac(i, TANWIN_F) || hasDiac(i, TANWIN_D) || hasDiac(i, TANWIN_K);
      if (noonSakin || tanwin) {
        var nxtPos = nextBase(end);
        if (nxtPos >= 0) {
          var nxtC = text.codePointAt(nxtPos);
          var rule = null;
          if (nxtC === 0x0628) rule = 'iqlab';
          else if (IDGHAM.has(nxtC)) rule = 'idgham';
          else if (IKHFAA.has(nxtC)) rule = 'ikhfaa';
          else if (IZHAR.has(nxtC)) rule = 'izhar';
          if (rule) { overlays.push({ start: i, end: end, rule: rule }); i = end; continue; }
        }
      }
      i = end;
    }
    return overlays;
  }

  function getSegmentsForAyah(cacheKey, text, overlays) {
    if (!segmentCache.has(cacheKey)) {
      // Use curated overlay if available, otherwise fall back to algorithmic detection
      var effectiveOverlays = (overlays !== null) ? overlays : detectTajwidOverlays(text);
      segmentCache.set(cacheKey, segmentAyah(text, effectiveOverlays));
    }
    return segmentCache.get(cacheKey);
  }

  function loadTajwidOverlay() {
    if (tajwidData || tajwidLoading) return;
    tajwidLoading = true;
    fetch("quran-tajwid.json")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        tajwidData = data;
        tajwidLoading = false;
        segmentCache.clear();
        if (state.readingMode === "tajwid") {
          if (freeReadMode) renderFreeReading();
          else render();
        }
      })
      .catch(function () {
        tajwidLoading = false;
        // Overlay unavailable — tajwid mode shows plain text without colors
      });
  }

  function applyMode() {
    document.body.classList.toggle("mode-tajwid", state.readingMode === "tajwid");
    document.body.classList.toggle("mode-minimal", state.readingMode !== "tajwid");
    document.body.classList.toggle("tajwid-no-colors", state.readingMode === "tajwid" && !state.tajwidColors);
    document.body.classList.toggle("minimal-no-colors", state.readingMode !== "tajwid" && !state.minimalColors);
  }

  function setReadingMode(mode) {
    state.readingMode = mode;
    segmentCache.clear();
    applyMode();
    saveState();
    // Load curated tajwid overlay in background to enhance algorithmic detection.
    // We no longer wait for it — algorithmic detection renders colors immediately.
    if ((mode === "tajwid" || (mode === "minimal" && state.minimalColors)) && !tajwidData && !tajwidLoading) {
      loadTajwidOverlay();
    }
    if (freeReadMode) renderFreeReading();
    else render();
  }

  // ---- FREE READING (ephemeral, not persisted) ----
  var freeReadMode = false;
  var freeReadSurahIdx = 0;
  var freeReadAyahIdx = 0;

  // ---- DOM refs ----
  var $ = function (id) { return document.getElementById(id); };

  // ---- UTILS ----
  function getLocalDateStr() {
    var d = new Date();
    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0")
    );
  }

  function defaultState() {
    var today = getLocalDateStr();
    return {
      startDate: today,
      globalIndex: 0,
      cycleCount: 0,
      lastReadDate: today,
      todayReadCount: 0,
      khatmaGoal: 1,
      textSize: "M",
      theme: "light",
      displayLang: "ar",
      readingMode: "minimal",
      tajwidColors: true,
      minimalColors: false,
    };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      var parsed = JSON.parse(raw);
      var s = Object.assign(defaultState(), parsed);
      var today = getLocalDateStr();
      if (s.lastReadDate !== today) {
        s.todayReadCount = 0;
        s.lastReadDate = today;
      }
      return s;
    } catch (e) {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getDayIndex(startDate) {
    var start = new Date(startDate + "T00:00:00");
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var diffMs = today.getTime() - start.getTime();
    var diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    var dayIndex = diffDays + 1;
    if (dayIndex < 1) return 1;
    if (dayIndex > 30) return ((dayIndex - 1) % 30) + 1;
    return dayIndex;
  }

  function computeDayTargets(totalToRead) {
    var base = Math.floor(totalToRead / 30);
    var remainder = totalToRead % 30;
    var targets = [];
    for (var i = 0; i < 30; i++) {
      targets.push(i < remainder ? base + 1 : base);
    }
    return targets;
  }

  // ---- THEME ----
  function getEffectiveTheme() {
    if (state.theme === "auto") {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return state.theme;
  }

  function applyTheme() {
    document.body.classList.remove("dark", "sepia");
    var meta = document.querySelector('meta[name="theme-color"]');
    var effective = getEffectiveTheme();
    if (effective === "dark") {
      document.body.classList.add("dark");
      meta.content = "#111111";
    } else if (effective === "sepia") {
      document.body.classList.add("sepia");
      meta.content = "#fdf9f4";
    } else {
      meta.content = "#ffffff";
    }
  }

  // ---- ONESIGNAL NOTIFICATIONS ----
  var ONESIGNAL_APP_ID = "b1374251-9424-431b-8d66-6921b1fa7185";

  function initOneSignal() {
    if (typeof OneSignalDeferred === "undefined") return;
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    OneSignalDeferred.push(function (OneSignal) {
      OneSignal.init({
        appId: ONESIGNAL_APP_ID,
        allowLocalhostAsSecureOrigin: true,
        serviceWorkerParam: { scope: "/ayat/" },
        serviceWorkerPath: "/ayat/OneSignalSDKWorker.js",
      });
    });
  }

  function updateReminderUI() {
    var confirmEl = $("reminder-confirm");
    if (typeof OneSignalDeferred === "undefined") {
      $("reminder-toggle-btn").textContent = "Activer les notifications";
      $("reminder-toggle-btn").classList.remove("hidden");
      $("reminder-status").classList.add("hidden");
      if (confirmEl) confirmEl.classList.add("hidden");
      return;
    }

    OneSignalDeferred.push(function (OneSignal) {
      OneSignal.Notifications.isPushSupported().then(function (supported) {
        if (!supported) {
          $("reminder-toggle-btn").textContent = "Non disponible sur cet appareil";
          $("reminder-toggle-btn").disabled = true;
          return;
        }
      });
      var permission = OneSignal.Notifications.permission;
      if (permission) {
        $("reminder-toggle-btn").classList.add("hidden");
        $("reminder-status").classList.remove("hidden");
        if (confirmEl) confirmEl.classList.add("hidden");
      } else {
        $("reminder-toggle-btn").classList.remove("hidden");
        $("reminder-status").classList.add("hidden");
        if (confirmEl) confirmEl.classList.add("hidden");
      }
    });
  }

  function requestOneSignalPermission() {
    if (typeof OneSignalDeferred === "undefined") return;
    OneSignalDeferred.push(function (OneSignal) {
      OneSignal.Notifications.requestPermission().then(function (accepted) {
        if (accepted) {
          var confirmEl = $("reminder-confirm");
          if (confirmEl) confirmEl.classList.remove("hidden");
          setTimeout(function () {
            updateReminderUI();
          }, 2500);
        } else {
          updateReminderUI();
        }
      });
    });
  }

  // ---- FREE READING FUNCTIONS ----
  function getFreeReadAyah() {
    var surah = surahs[freeReadSurahIdx];
    var ayahIdx = freeReadAyahIdx;
    var isBasmala = false;
    var displayNumber = ayahIdx + 1;

    if (surah.surahNumber !== 1 && surah.surahNumber !== 9) {
      if (ayahIdx === 0) {
        isBasmala = true;
        displayNumber = 0;
      } else {
        displayNumber = ayahIdx;
      }
    }

    var frSurah = surahsFr[freeReadSurahIdx];
    var frText = frSurah && frSurah.ayahs[ayahIdx] ? frSurah.ayahs[ayahIdx] : "";

    return {
      surahNumber: surah.surahNumber,
      surahNameAr: surah.surahNameAr,
      surahNameFr: SURAH_NAMES_FR[surah.surahNumber] || "Sourate " + surah.surahNumber,
      ayahNumber: displayNumber,
      isBasmala: isBasmala,
      text: surah.ayahs[ayahIdx],
      textFr: frText,
    };
  }

  function renderFreeReading() {
    var surah = surahs[freeReadSurahIdx];
    var ayahData = getFreeReadAyah();

    // Header
    $("header-title").textContent = "Lecture libre";
    $("menu-btn").classList.add("hidden");
    $("back-btn").classList.remove("hidden");

    // Ayah reference
    if (ayahData.isBasmala) {
      $("ayah-ref").textContent =
        "Sourate " + ayahData.surahNameFr + " \u2014 Basmala";
    } else {
      $("ayah-ref").textContent =
        "Sourate " + ayahData.surahNameFr + " \u2014 Verset " + ayahData.ayahNumber;
    }

    // Ayah text
    var ayahEl = $("ayah-text");
    renderAyahText(ayahEl, ayahData);

    // Progress: surah progress (green bar)
    var surahPct = ((freeReadAyahIdx + 1) / surah.ayahs.length) * 100;
    $("today-fill").style.width = surahPct + "%";
    $("today-fill").className = "progress-fill-free";
    $("today-label").textContent = (freeReadAyahIdx + 1) + "/" + surah.ayahs.length;
    document.querySelector(".progress-row:first-child .progress-labels span:first-child")
      .textContent = "Versets de la sourate";

    // Hide khatma bar
    $("khatma-fill").style.width = "0%";
    $("khatma-label").textContent = "";
    document.querySelector(".progress-row:last-child .progress-labels span:first-child")
      .textContent = "";

    // Always hide goal-reached in free reading
    $("goal-reached").classList.add("hidden");
  }

  function enterFreeReading(surahArrayIndex, ayahIdx) {
    freeReadMode = true;
    freeReadSurahIdx = surahArrayIndex;
    freeReadAyahIdx = ayahIdx || 0;
    $("surah-overlay").classList.add("hidden");
    renderFreeReading();
    $("ayah-scroll").scrollTop = 0;
  }

  function exitFreeReading() {
    stopAudio();
    freeReadMode = false;
    freeReadSurahIdx = 0;
    freeReadAyahIdx = 0;

    // Restore header
    $("back-btn").classList.add("hidden");
    $("menu-btn").classList.remove("hidden");

    // Restore progress bar classes and labels
    $("today-fill").className = "progress-fill-today";
    document.querySelector(".progress-row:first-child .progress-labels span:first-child")
      .textContent = "Versets du jour";
    document.querySelector(".progress-row:last-child .progress-labels span:first-child")
      .textContent = "Lecture compl\u00e8te";

    render();
  }

  function goNextFreeRead() {
    var surah = surahs[freeReadSurahIdx];
    if (freeReadAyahIdx < surah.ayahs.length - 1) {
      freeReadAyahIdx++;
    } else if (freeReadSurahIdx < surahs.length - 1) {
      freeReadSurahIdx++;
      freeReadAyahIdx = 0;
    } else {
      return;
    }
    fadeAndRenderFreeRead();
  }

  function goPrevFreeRead() {
    if (freeReadAyahIdx > 0) {
      freeReadAyahIdx--;
    } else if (freeReadSurahIdx > 0) {
      freeReadSurahIdx--;
      freeReadAyahIdx = surahs[freeReadSurahIdx].ayahs.length - 1;
    } else {
      return;
    }
    fadeAndRenderFreeRead();
  }

  function fadeAndRenderFreeRead() {
    var el = $("ayah-text");
    el.classList.add("fade-out");
    setTimeout(function () {
      renderFreeReading();
      el.classList.remove("fade-out");
      $("ayah-scroll").scrollTop = 0;
    }, 150);
  }

  // ---- GLOBAL INDEX HELPER ----
  function getGlobalIndexForSurahAyah(surahArrayIndex, ayahIdx) {
    var count = 0;
    for (var i = 0; i < surahArrayIndex; i++) {
      count += surahs[i].ayahs.length;
    }
    return count + ayahIdx;
  }

  function jumpToPosition(surahArrayIndex, ayahIdx) {
    var newGlobalIndex = getGlobalIndexForSurahAyah(surahArrayIndex, ayahIdx);
    // Account for multiple khatma cycles
    var currentCycle = Math.floor(state.globalIndex / totalAyat);
    state.globalIndex = (currentCycle * totalAyat) + newGlobalIndex;
    state.lastReadDate = getLocalDateStr();
    saveState();

    // Exit free reading if active
    if (freeReadMode) {
      freeReadMode = false;
      freeReadSurahIdx = 0;
      freeReadAyahIdx = 0;
      $("back-btn").classList.add("hidden");
      $("menu-btn").classList.remove("hidden");
      $("today-fill").className = "progress-fill-today";
      document.querySelector(".progress-row:first-child .progress-labels span:first-child")
        .textContent = "Versets du jour";
      document.querySelector(".progress-row:last-child .progress-labels span:first-child")
        .textContent = "Lecture compl\u00e8te";
    }

    $("surah-overlay").classList.add("hidden");
    render();
    $("ayah-scroll").scrollTop = 0;
    showToast("Progression mise \u00e0 jour");
  }

  // ---- QURAN ACCESS ----
  function getAyahByGlobalIndex(globalIndex) {
    var idx = ((globalIndex % totalAyat) + totalAyat) % totalAyat;
    var count = 0;
    for (var i = 0; i < surahs.length; i++) {
      var surah = surahs[i];
      if (idx < count + surah.ayahs.length) {
        var ayahIdx = idx - count;
        var isBasmala = false;
        var displayNumber = ayahIdx + 1;

        if (surah.surahNumber !== 1 && surah.surahNumber !== 9) {
          if (ayahIdx === 0) {
            isBasmala = true;
            displayNumber = 0;
          } else {
            displayNumber = ayahIdx;
          }
        }

        var frText = surahsFr[i] && surahsFr[i].ayahs[ayahIdx] ? surahsFr[i].ayahs[ayahIdx] : "";

        return {
          surahNumber: surah.surahNumber,
          surahNameAr: surah.surahNameAr,
          surahNameFr: SURAH_NAMES_FR[surah.surahNumber] || "Sourate " + surah.surahNumber,
          ayahNumber: displayNumber,
          isBasmala: isBasmala,
          text: surah.ayahs[ayahIdx],
          textFr: frText,
        };
      }
      count += surah.ayahs.length;
    }
    return {
      surahNumber: 1,
      surahNameAr: surahs[0].surahNameAr,
      surahNameFr: SURAH_NAMES_FR[1],
      ayahNumber: 1,
      isBasmala: false,
      text: surahs[0].ayahs[0],
      textFr: surahsFr[0] ? surahsFr[0].ayahs[0] : "",
    };
  }

  // ---- DISPLAY TEXT HELPER ----
  function renderAyahText(ayahEl, ayah) {
    ayahEl.innerHTML = "";
    var lang = state.displayLang;
    var mode = state.readingMode;

    if (lang === "ar" || lang === "ar-fr") {
      var arSpan = document.createElement("span");
      arSpan.className = "ayah-arabic";
      arSpan.setAttribute("dir", "rtl");

      if (mode === "tajwid" || (mode === "minimal" && state.minimalColors)) {
        // Tajwid mode or minimal+colors: render colored segments.
        // Uses curated overlay from tajwidData when available, otherwise algorithmic detection.
        var key = ayah.surahNumber + ":" + ayah.ayahNumber;
        var overlays = (tajwidData && tajwidData[key]) ? tajwidData[key] : null;
        var segments = getSegmentsForAyah(key, ayah.text, overlays);
        var frag = document.createDocumentFragment();
        for (var s = 0; s < segments.length; s++) {
          var seg = segments[s];
          var segSpan = document.createElement("span");
          // In minimal mode, strip waqf marks from each segment's chars
          var segText = (mode === "minimal") ? stripWaqfMarks(seg.chars) : seg.chars;
          if (!segText) continue;
          segSpan.textContent = segText;
          if (seg.rule) segSpan.className = "tajwid-" + seg.rule;
          frag.appendChild(segSpan);
        }
        arSpan.appendChild(frag);
      } else {
        // Minimal mode without colors: keep harakat, remove waqf / pause marks
        arSpan.textContent = stripWaqfMarks(ayah.text);
      }

      ayahEl.appendChild(arSpan);
    }

    if (lang === "ar-fr" || lang === "fr") {
      if (lang === "ar-fr") {
        var br = document.createElement("div");
        br.className = "ayah-separator";
        ayahEl.appendChild(br);
      }
      var frSpan = document.createElement("span");
      frSpan.className = "ayah-french";
      frSpan.setAttribute("dir", "ltr");
      frSpan.textContent = ayah.textFr || "";
      ayahEl.appendChild(frSpan);
    }

    // Set direction based on lang
    if (lang === "fr") {
      ayahEl.setAttribute("dir", "ltr");
    } else {
      ayahEl.setAttribute("dir", "rtl");
    }
    ayahEl.className = "ayah-text size-" + state.textSize;
  }

  // ---- RENDER ----
  function render() {
    var totalToRead = totalAyat * state.khatmaGoal;
    var dayTargets = computeDayTargets(totalToRead);
    var dayIndex = getDayIndex(state.startDate);
    var todayTarget = dayTargets[dayIndex - 1];
    var ayah = getAyahByGlobalIndex(state.globalIndex);

    // Header title
    $("header-title").textContent = "QURANI";

    // Ayah reference — in French
    if (ayah.isBasmala) {
      $("ayah-ref").textContent = "Sourate " + ayah.surahNameFr + " \u2014 Basmala";
    } else {
      $("ayah-ref").textContent =
        "Sourate " + ayah.surahNameFr + " \u2014 Verset " + ayah.ayahNumber;
    }

    // Ayah text
    var ayahEl = $("ayah-text");
    renderAyahText(ayahEl, ayah);

    // Bridge: save current verse to shared UserDefaults (widgets)
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SharedData) {
      window.Capacitor.Plugins.SharedData.saveCurrentVerse({
        surah: ayah.surahNumber,
        ayah: ayah.ayahNumber,
        text: ayah.text,
        surahName: ayah.surahNameAr
      });
    }

    // Progress: today
    var todayPct = Math.min(
      (state.todayReadCount / Math.max(todayTarget, 1)) * 100,
      100
    );
    $("today-fill").style.width = todayPct + "%";
    $("today-label").textContent = state.todayReadCount + "/" + todayTarget;

    // Progress: khatma
    var cycleBase = state.khatmaGoal === 1 ? totalAyat : totalToRead;
    var currentCycleIndex = state.globalIndex % cycleBase;
    var khatmaPct = Math.min((currentCycleIndex / cycleBase) * 100, 100);
    $("khatma-fill").style.width = khatmaPct + "%";
    $("khatma-label").textContent = Math.round(khatmaPct) + "%";

    // Goal reached
    var goalReached = state.todayReadCount >= todayTarget;
    if (goalReached && !goalDismissed) {
      $("goal-reached").classList.remove("hidden");
    } else {
      $("goal-reached").classList.add("hidden");
    }

    // Update bookmark button
    updateBookmarkBtn();

    // Settings sync
    $("cycle-count").textContent = state.cycleCount;
    document.querySelectorAll("#goal-buttons .setting-btn").forEach(function (btn) {
      btn.classList.toggle("active", Number(btn.dataset.goal) === state.khatmaGoal);
    });
    document.querySelectorAll("#size-buttons .setting-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.size === state.textSize);
    });
    document.querySelectorAll("#theme-buttons .setting-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.theme === state.theme);
    });
    document.querySelectorAll("#lang-buttons .setting-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.lang === state.displayLang);
    });
    document.querySelectorAll("#mode-buttons .setting-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.mode === state.readingMode);
    });
    var minimalColorGroup = $("minimal-color-group");
    if (minimalColorGroup) {
      minimalColorGroup.classList.toggle("hidden", state.readingMode !== "minimal");
    }
    document.querySelectorAll("#minimal-color-buttons .setting-btn").forEach(function (btn) {
      btn.classList.toggle("active", (btn.dataset.minimalColors === "true") === !!state.minimalColors);
    });
    var tajwidColorGroup = $("tajwid-color-group");
    if (tajwidColorGroup) {
      tajwidColorGroup.classList.toggle("hidden", state.readingMode !== "tajwid");
    }
    document.querySelectorAll("#tajwid-color-buttons .setting-btn").forEach(function (btn) {
      btn.classList.toggle("active", (btn.dataset.tajwidColors === "true") === !!state.tajwidColors);
    });
    var modeHint = $("mode-hint");
    if (modeHint) {
      if (state.readingMode === "tajwid") {
        modeHint.textContent = state.tajwidColors
          ? "Couleurs tajwid activ\u00e9es \u2014 les signes de waqf sont affich\u00e9s."
          : "Mode tajwid sans couleurs \u2014 les signes de waqf sont affich\u00e9s.";
      } else {
        modeHint.textContent = state.minimalColors
          ? "Couleurs tajwid activ\u00e9es \u2014 voyelles conserv\u00e9es, signes de waqf masqu\u00e9s."
          : "Texte pur \u2014 voyelles conserv\u00e9es, signes de waqf masqu\u00e9s.";
      }
    }
    applyTheme();
    applyMode();
  }

  // ---- NAVIGATION ----
  function goNext() {
    if (isAudioPlaying && !audioAutoNext) stopAudio();
    if (freeReadMode) { goNextFreeRead(); showDock(); return; }
    var newIndex = state.globalIndex + 1;
    if (newIndex > 0 && newIndex % totalAyat === 0) {
      state.cycleCount++;
    }
    state.globalIndex = newIndex;
    state.todayReadCount++;
    state.lastReadDate = getLocalDateStr();
    saveState();
    recordReading();
    updateBookmarkBtn();
    fadeAndRender();
    showDock();
  }

  function goPrev() {
    stopAudio();
    if (freeReadMode) { goPrevFreeRead(); showDock(); return; }
    if (state.globalIndex <= 0) return;
    state.globalIndex--;
    state.todayReadCount = Math.max(0, state.todayReadCount - 1);
    saveState();
    fadeAndRender();
    showDock();
  }

  function fadeAndRender() {
    var el = $("ayah-text");
    el.classList.add("fade-out");
    setTimeout(function () {
      render();
      el.classList.remove("fade-out");
      $("ayah-scroll").scrollTop = 0;
    }, 150);
  }

  // ---- SWIPE ----
  var touchStartX = null;
  var touchStartY = null;
  var didSwipe = false;

  function onTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    didSwipe = false;
  }

  function onTouchEnd(e) {
    if (touchStartX === null) return;
    // Ignore touches that originate from nav buttons (play/pause, arrows)
    if (e.target.closest && e.target.closest(".nav-arrows")) {
      touchStartX = null;
      touchStartY = null;
      return;
    }
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    touchStartX = null;
    touchStartY = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      didSwipe = true;
      if (dx < 0) goNext();
      else goPrev();
    }
  }

  // ---- BOOKMARK BUTTON STATE ----
  function getCurrentAyahKey() {
    if (freeReadMode) {
      var fa = getFreeReadAyah();
      return fa.surahNumber + ":" + fa.ayahNumber;
    }
    var a = getAyahByGlobalIndex(state.globalIndex);
    return a.surahNumber + ":" + a.ayahNumber;
  }

  function updateBookmarkBtn() {
    var btn = $("bookmark-btn");
    if (!btn) return;
    var key = getCurrentAyahKey();
    var bookmarks = loadBookmarks();
    var isBookmarked = bookmarks.some(function (b) { return b.key === key; });
    btn.classList.toggle("bookmarked", isBookmarked);
  }

  function toggleBookmark() {
    var ayah = freeReadMode ? getFreeReadAyah() : getAyahByGlobalIndex(state.globalIndex);
    var key = ayah.surahNumber + ":" + ayah.ayahNumber;
    var bookmarks = loadBookmarks();
    var idx = -1;
    for (var i = 0; i < bookmarks.length; i++) {
      if (bookmarks[i].key === key) { idx = i; break; }
    }
    if (idx >= 0) {
      bookmarks.splice(idx, 1);
      saveBookmarks(bookmarks);
      updateBookmarkBtn();
      showToast("Favori retiré");
    } else {
      showFolderPicker(ayah);
    }
  }

  function addBookmarkToFolder(ayah, folderId) {
    var bookmarks = loadBookmarks();
    bookmarks.push({
      key: ayah.surahNumber + ":" + ayah.ayahNumber,
      surahNumber: ayah.surahNumber,
      surahNameFr: ayah.surahNameFr,
      ayahNumber: ayah.ayahNumber,
      text: ayah.text,
      date: getLocalDateStr(),
      folderId: folderId || null
    });
    saveBookmarks(bookmarks);
    updateBookmarkBtn();
    var name = getFolderName(folderId);
    showToast(name ? "Ajout\u00e9 dans \u00ab\u00a0" + name + "\u00a0\u00bb" : "Ajout\u00e9 aux favoris");
  }

  function showFolderPicker(ayah) {
    var folders = loadFolders();
    var listEl = $("folder-picker-list");
    listEl.innerHTML = "";

    function makeOption(iconPath, label, onClick) {
      var btn = document.createElement("button");
      btn.className = "folder-option";
      btn.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
        iconPath + '</svg>' +
        '<span>' + label + '</span>';
      btn.addEventListener("click", onClick);
      return btn;
    }

    var PAGE_ICON = '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>';
    var FOLDER_ICON = '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>';

    listEl.appendChild(makeOption(PAGE_ICON, "Général", function () {
      addBookmarkToFolder(ayah, null);
      hideFolderPicker();
    }));

    folders.forEach(function (folder) {
      var safe = folder.name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      listEl.appendChild(makeOption(FOLDER_ICON, safe, function () {
        addBookmarkToFolder(ayah, folder.id);
        hideFolderPicker();
      }));
    });

    $("folder-new-row").classList.add("hidden");
    $("folder-new-input").value = "";
    $("folder-new-btn").classList.remove("hidden");
    pendingBookmarkAyah = ayah;
    $("folder-picker-wrap").classList.remove("hidden");
  }

  function hideFolderPicker() {
    $("folder-picker-wrap").classList.add("hidden");
    pendingBookmarkAyah = null;
  }

  function renderBookmarksList() {
    var list = $("bookmarks-list");
    var bookmarks = loadBookmarks();
    var folders = loadFolders();
    list.innerHTML = "";

    if (bookmarks.length === 0) {
      var emptyMsg = document.createElement("p");
      emptyMsg.className = "bookmarks-empty";
      emptyMsg.textContent = "Aucun favori pour le moment. Appuyez sur le signet pendant la lecture pour en ajouter.";
      list.appendChild(emptyMsg);
      return;
    }

    function createBookmarkItem(b) {
      var item = document.createElement("div");
      item.className = "bookmark-item";

      var ref = document.createElement("div");
      ref.className = "bookmark-item-ref";
      ref.textContent = "Sourate " + b.surahNameFr + " — Verset " + b.ayahNumber;

      var text = document.createElement("div");
      text.className = "bookmark-item-text";
      text.textContent = b.text;

      var actions = document.createElement("div");
      actions.className = "bookmark-item-actions";
      var delBtn = document.createElement("button");
      delBtn.className = "bookmark-action-btn";
      delBtn.textContent = "Supprimer";
      delBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        var bms = loadBookmarks();
        var filtered = bms.filter(function (x) { return x.key !== b.key; });
        saveBookmarks(filtered);
        renderBookmarksList();
        updateBookmarkBtn();
      });
      actions.appendChild(delBtn);

      item.appendChild(ref);
      item.appendChild(text);
      item.appendChild(actions);
      return item;
    }

    var FOLDER_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>';
    var PAGE_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/></svg>';

    function appendSectionHeader(iconSvg, title) {
      var hdr = document.createElement("div");
      hdr.className = "folder-section-header";
      hdr.innerHTML = iconSvg + "<span>" + title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</span>";
      list.appendChild(hdr);
    }

    if (folders.length === 0) {
      bookmarks.slice().reverse().forEach(function (b) {
        list.appendChild(createBookmarkItem(b));
      });
      return;
    }

    folders.forEach(function (folder) {
      var inFolder = bookmarks.filter(function (b) { return b.folderId === folder.id; });
      if (inFolder.length === 0) return;
      appendSectionHeader(FOLDER_SVG, folder.name);
      inFolder.slice().reverse().forEach(function (b) {
        list.appendChild(createBookmarkItem(b));
      });
    });

    var ungrouped = bookmarks.filter(function (b) { return !b.folderId; });
    if (ungrouped.length > 0) {
      appendSectionHeader(PAGE_SVG, "Général");
      ungrouped.slice().reverse().forEach(function (b) {
        list.appendChild(createBookmarkItem(b));
      });
    }
  }

  function renderStats() {
    var stats = loadStats();
    $("stat-streak").textContent = stats.streak || 0;
    $("stat-total-verses").textContent = stats.totalVersesRead || 0;
    $("stat-khatmas").textContent = state ? state.cycleCount : 0;
    if (state && state.startDate) {
      var parts = state.startDate.split("-");
      $("stat-start-date").textContent = parts[2] + "/" + parts[1] + "/" + parts[0];
    } else {
      $("stat-start-date").textContent = "—";
    }
  }

  // ---- TAP TO NAVIGATE ----
  function onTapNavigate(e) {
    // Ignore if a swipe just happened
    if (didSwipe) return;
    // Ignore if an overlay is open
    if (
      !$("settings-overlay").classList.contains("hidden") ||
      !$("surah-overlay").classList.contains("hidden") ||
      !$("bookmarks-overlay").classList.contains("hidden") ||
      !$("search-overlay").classList.contains("hidden") ||
      !$("qibla-overlay").classList.contains("hidden") ||
      !$("menu-overlay").classList.contains("hidden") ||
      !$("audio-overlay").classList.contains("hidden") ||
      !$("prayer-overlay").classList.contains("hidden") ||
      !$("hifz-overlay").classList.contains("hidden") ||
      !$("recit-overlay").classList.contains("hidden")
    ) return;
    // Ignore clicks on buttons, links, and interactive elements
    var tag = e.target.tagName.toLowerCase();
    if (tag === "button" || tag === "a" || tag === "input" || tag === "svg" || tag === "polyline" || tag === "line" || tag === "path") return;
    if (e.target.closest("button") || e.target.closest("a") || e.target.closest(".nav-arrows")) return;
    var containerRect = $("ayah-container").getBoundingClientRect();
    var clickX = e.clientX;
    var midX = containerRect.left + containerRect.width / 2;
    if (clickX >= midX) {
      goNext();
    } else {
      goPrev();
    }
  }

  // ---- KEYBOARD ----
  function onKeyDown(e) {
    if (
      !$("settings-overlay").classList.contains("hidden") ||
      !$("surah-overlay").classList.contains("hidden") ||
      !$("bookmarks-overlay").classList.contains("hidden") ||
      !$("search-overlay").classList.contains("hidden") ||
      !$("qibla-overlay").classList.contains("hidden") ||
      !$("menu-overlay").classList.contains("hidden") ||
      !$("audio-overlay").classList.contains("hidden") ||
      !$("prayer-overlay").classList.contains("hidden") ||
      !$("hifz-overlay").classList.contains("hidden") ||
      !$("recit-overlay").classList.contains("hidden")
    ) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown" || e.key === " ") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      goPrev();
    }
  }

  // ---- TAFSIR (long-press) ----
  var TAFSIR_HOLD_MS = 1200;
  var tafsirTimer = null;
  var tafsirTouchStartX = 0;
  var tafsirTouchStartY = 0;

  function getCurrentAyahForTafsir() {
    var ayah = freeReadMode ? getFreeReadAyah() : getAyahByGlobalIndex(state.globalIndex);
    var surah = ayah.surahNumber;
    var aya = ayah.ayahNumber;
    if (ayah.isBasmala) aya = 1;
    return { surah: surah, aya: aya, ref: ayah.surahNameFr + " \u2014 Verset " + aya };
  }

  function fetchTafsir() {
    var info = getCurrentAyahForTafsir();
    $("tafsir-overlay").classList.remove("hidden");
    $("tafsir-loading").classList.remove("hidden");
    $("tafsir-error").classList.add("hidden");
    $("tafsir-content").classList.add("hidden");
    $("tafsir-header-title").textContent = "Tafsir";
    $("tafsir-ayah-ref").textContent = info.ref;

    fetch("https://quranenc.com/api/v1/translation/aya/french_rashid/" + info.surah + "/" + info.aya)
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        $("tafsir-loading").classList.add("hidden");
        $("tafsir-content").classList.remove("hidden");

        var entry = data.result && typeof data.result === "object" ? data.result : data;
        var text = entry.translation || entry.text || "";

        // Strip leading verse number (e.g. "255 Allah…" → "Allah…")
        var div = document.createElement("div");
        div.innerHTML = text;
        var clean = (div.textContent || div.innerText || text).replace(/^\d+\s+/, "").trim();

        // Footnotes — parse each [N] item as a separate note
        var footnotes = entry.footnotes || "";
        var fnHtml = "";
        if (footnotes && typeof footnotes === "string") {
          var fnDiv = document.createElement("div");
          fnDiv.innerHTML = footnotes;
          var fnClean = (fnDiv.textContent || fnDiv.innerText || footnotes).trim();
          if (fnClean) {
            // Split on newlines, each line is one note
            var notes = fnClean.split(/\n+/).filter(Boolean);
            fnHtml = '<div class="tafsir-notes-header">Notes</div>'
              + notes.map(function (n) {
                  // Bold the [N] reference number
                  var noteLine = n.replace(/^\[(\d+)\]\s*/, function(_, num) {
                    return '<span class="tafsir-note-num">[' + num + ']</span> ';
                  });
                  return '<p class="tafsir-note">' + noteLine + '</p>';
                }).join("");
          }
        }

        if (!clean) {
          $("tafsir-content").classList.add("hidden");
          $("tafsir-error").classList.remove("hidden");
          return;
        }

        // Main translation text — highlight inline [N] references
        var mainHtml = '<p class="tafsir-translation">'
          + clean.replace(/\[(\d+)\]/g, '<sup class="tafsir-ref">[$1]</sup>')
          + '</p>';

        $("tafsir-text").innerHTML = mainHtml + fnHtml;
      })
      .catch(function () {
        $("tafsir-loading").classList.add("hidden");
        $("tafsir-error").classList.remove("hidden");
      });
  }

  function onTafsirTouchStart(e) {
    tafsirTouchStartX = e.touches[0].clientX;
    tafsirTouchStartY = e.touches[0].clientY;
    clearTimeout(tafsirTimer);
    tafsirTimer = setTimeout(function () {
      if (navigator.vibrate) navigator.vibrate(30);
      fetchTafsir();
    }, TAFSIR_HOLD_MS);
  }

  function onTafsirTouchMove(e) {
    if (!tafsirTimer) return;
    var dx = Math.abs(e.touches[0].clientX - tafsirTouchStartX);
    var dy = Math.abs(e.touches[0].clientY - tafsirTouchStartY);
    if (dx > 10 || dy > 10) {
      clearTimeout(tafsirTimer);
      tafsirTimer = null;
    }
  }

  function onTafsirTouchEnd() {
    clearTimeout(tafsirTimer);
    tafsirTimer = null;
  }

  // ---- DOCK AUTO-HIDE ----
  var dockTimer = null;
  var DOCK_HIDE_DELAY = 3000; // ms

  function showDock() {
    var dock = $("nav-arrows");
    if (!dock) return;
    dock.classList.remove("dock-hidden");
    clearTimeout(dockTimer);
    dockTimer = setTimeout(hideDock, DOCK_HIDE_DELAY);
  }

  function hideDock() {
    var dock = $("nav-arrows");
    if (!dock) return;
    dock.classList.add("dock-hidden");
  }

  function initDockAutoHide() {
    // Start hidden after initial delay
    dockTimer = setTimeout(hideDock, DOCK_HIDE_DELAY);

    // Show on any touch/click on the ayah area
    $("ayah-container").addEventListener("touchstart", showDock, { passive: true });
    $("ayah-container").addEventListener("click", showDock);

    // Keep dock visible while interacting with it
    var dock = $("nav-arrows");
    if (dock) {
      dock.addEventListener("touchstart", function (e) {
        clearTimeout(dockTimer);
        dock.classList.remove("dock-hidden");
      }, { passive: true });
      dock.addEventListener("mouseover", function () {
        clearTimeout(dockTimer);
        dock.classList.remove("dock-hidden");
      });
      dock.addEventListener("mouseleave", function () {
        dockTimer = setTimeout(hideDock, DOCK_HIDE_DELAY);
      });
      dock.addEventListener("touchend", function () {
        dockTimer = setTimeout(hideDock, DOCK_HIDE_DELAY);
      });
    }
  }

  // ---- QIBLA ----
  var MECCA_LAT = 21.4225;
  var MECCA_LON = 39.8262;
  var ALIGN_THRESHOLD = 10; // degrees
  var qiblaBearing = null;
  var qiblaCurrentRot = 0; // tracks accumulated rotation for smooth wraparound
  var qiblaHasAbsolute = false; // prefer absolute orientation when available
  var qiblaOrientListeners = [];
  var qiblaIsAligned = false;

  function toRad(deg) { return deg * Math.PI / 180; }

  function calcQiblaBearing(lat, lon) {
    var p1 = toRad(lat), p2 = toRad(MECCA_LAT);
    var dl = toRad(MECCA_LON - lon);
    var y = Math.sin(dl) * Math.cos(p2);
    var x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
    return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
  }

  function calcDistance(lat, lon) {
    var R = 6371;
    var dp = toRad(MECCA_LAT - lat), dl = toRad(MECCA_LON - lon);
    var a = Math.sin(dp / 2) * Math.sin(dp / 2) +
            Math.cos(toRad(lat)) * Math.cos(toRad(MECCA_LAT)) *
            Math.sin(dl / 2) * Math.sin(dl / 2);
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  // Shortest-path rotation to avoid 360→0 jumps
  function setNeedleRotation(targetDeg) {
    var diff = ((targetDeg - qiblaCurrentRot) % 360 + 540) % 360 - 180;
    qiblaCurrentRot += diff;
    var needle = $("qibla-needle");
    if (!needle) return;
    needle.style.transform = "translateX(-50%) rotate(" + qiblaCurrentRot + "deg)";
  }

  function updateAlignedState(rotationDeg) {
    // rotationDeg is how far the needle is from pointing straight up (0 = aligned)
    var normalised = ((rotationDeg % 360) + 360) % 360;
    var isAligned = normalised < ALIGN_THRESHOLD || normalised > (360 - ALIGN_THRESHOLD);
    if (isAligned !== qiblaIsAligned) {
      qiblaIsAligned = isAligned;
      var compass = $("qibla-compass");
      var badge = $("qibla-aligned-badge");
      if (compass) compass.classList.toggle("aligned", isAligned);
      if (badge) badge.classList.toggle("visible", isAligned);
    }
  }

  function fetchQiblaLocation(lat, lon) {
    var url = "https://nominatim.openstreetmap.org/reverse?lat=" + lat + "&lon=" + lon + "&format=json&accept-language=fr&zoom=10";
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var addr = data.address || {};
        var city = addr.city || addr.town || addr.village || addr.municipality || "";
        var country = addr.country || "";
        var locEl = $("qibla-location");
        if (locEl && (city || country)) {
          var parts = [city, country].filter(Boolean).join(", ");
          locEl.textContent = "Actuellement \u00e0 " + parts;
        }
      })
      .catch(function () {});
  }

  function stopQiblaOrientation() {
    qiblaOrientListeners.forEach(function (info) {
      window.removeEventListener(info.event, info.fn, true);
    });
    qiblaOrientListeners = [];
    qiblaHasAbsolute = false;
  }

  function handleQiblaOrientation(e) {
    if (qiblaBearing === null) return;
    var heading = null;

    // iOS Safari: webkitCompassHeading (geographic north, clockwise)
    if (e.webkitCompassHeading !== undefined && e.webkitCompassHeading !== null) {
      heading = e.webkitCompassHeading;
    }
    // Absolute orientation (Android Chrome): geographic north
    else if (e.absolute === true && e.alpha !== null) {
      if (!qiblaHasAbsolute) qiblaHasAbsolute = true;
      heading = (360 - e.alpha) % 360;
    }
    // Fallback: relative alpha (not calibrated but rotates)
    else if (!qiblaHasAbsolute && e.alpha !== null) {
      heading = (360 - e.alpha) % 360;
    }

    if (heading === null) return;

    // Switch to live mode (no CSS transition delay)
    var needle = $("qibla-needle");
    if (needle && !needle.classList.contains("live")) {
      needle.classList.add("live");
    }

    var rotation = qiblaBearing - heading;
    setNeedleRotation(rotation);
    updateAlignedState(rotation);

    // Show live badge once
    var liveEl = $("qibla-live-status");
    if (liveEl && liveEl.classList.contains("hidden")) {
      liveEl.classList.remove("hidden");
    }
  }

  function startQiblaOrientation() {
    if (typeof DeviceOrientationEvent === "undefined") return;

    // iOS 13+ requires explicit permission
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      $("qibla-orient-prompt").classList.remove("hidden");
      return;
    }

    // Listen on both events; handleQiblaOrientation picks the best source
    window.addEventListener("deviceorientationabsolute", handleQiblaOrientation, true);
    window.addEventListener("deviceorientation", handleQiblaOrientation, true);
    qiblaOrientListeners.push({ event: "deviceorientationabsolute", fn: handleQiblaOrientation });
    qiblaOrientListeners.push({ event: "deviceorientation", fn: handleQiblaOrientation });
  }

  function openQiblaOverlay() {
    $("qibla-overlay").classList.remove("hidden");
    $("qibla-loading").classList.remove("hidden");
    $("qibla-error").classList.add("hidden");
    $("qibla-compass-view").classList.add("hidden");
    $("qibla-orient-prompt").classList.add("hidden");
    $("qibla-live-status").classList.add("hidden");
    $("qibla-aligned-badge").classList.remove("visible");
    var locEl = $("qibla-location");
    if (locEl) locEl.textContent = "";
    var compass = $("qibla-compass");
    if (compass) compass.classList.remove("aligned");
    qiblaBearing = null;
    qiblaCurrentRot = 0;
    qiblaIsAligned = false;
    stopQiblaOrientation();

    if (!navigator.geolocation) {
      $("qibla-loading").classList.add("hidden");
      $("qibla-error").classList.remove("hidden");
      $("qibla-error-msg").textContent = "La g\u00e9olocalisation n'est pas disponible sur cet appareil.";
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function (pos) {
        var lat = pos.coords.latitude, lon = pos.coords.longitude;
        qiblaBearing = calcQiblaBearing(lat, lon);
        qiblaCurrentRot = qiblaBearing; // init rotation to static bearing
        var dist = calcDistance(lat, lon);

        $("qibla-loading").classList.add("hidden");
        $("qibla-compass-view").classList.remove("hidden");
        $("qibla-bearing-val").textContent = Math.round(qiblaBearing);
        $("qibla-dist").textContent = dist.toLocaleString("fr-FR") + "\u202fkm";
        fetchQiblaLocation(lat, lon);

        // Remove live class for initial static positioning
        var needle = $("qibla-needle");
        if (needle) needle.classList.remove("live");
        setNeedleRotation(qiblaBearing);

        startQiblaOrientation();
      },
      function (err) {
        $("qibla-loading").classList.add("hidden");
        $("qibla-error").classList.remove("hidden");
        $("qibla-error-msg").textContent = err.code === 1
          ? "Acc\u00e8s \u00e0 la localisation refus\u00e9. V\u00e9rifiez les permissions de l'application."
          : "Impossible d'acc\u00e9der \u00e0 votre position. R\u00e9essayez.";
      },
      { timeout: 12000, enableHighAccuracy: false }
    );
  }

  function closeQiblaOverlay() {
    $("qibla-overlay").classList.add("hidden");
    stopQiblaOrientation();
    qiblaBearing = null;
    qiblaCurrentRot = 0;
    qiblaIsAligned = false;
  }

  // ---- AUDIO PLAYER ----
  var RECITERS = [
    { id: "Alafasy_128kbps", name: "Mishary Al-Afasy", nameAr: "مشاري العفاسي" },
    { id: "Husary_128kbps", name: "Al-Husary", nameAr: "محمود خليل الحصري" },
    { id: "Abdul_Basit_Murattal_192kbps", name: "Abdul Basit", nameAr: "عبد الباسط عبد الصمد" },
    { id: "Minshawy_Murattal_128kbps", name: "Al-Minshawi", nameAr: "محمد صديق المنشاوي" },
    { id: "Saood_ash-Shuraym_128kbps", name: "Al-Shuraym", nameAr: "سعود الشريم" },
  ];
  var audioPlayer = null;
  var isAudioPlaying = false;
  var audioAutoNext = false;
  var AUDIO_RECITER_KEY = "qurani-reciter";

  function getReciter() {
    return localStorage.getItem(AUDIO_RECITER_KEY) || "Alafasy_128kbps";
  }
  function setReciter(id) {
    localStorage.setItem(AUDIO_RECITER_KEY, id);
  }

  function getAudioUrl(surahNum, ayahNum) {
    if (ayahNum === 0) return "https://everyayah.com/data/" + getReciter() + "/001001.mp3";
    var s = String(surahNum).padStart(3, "0");
    var a = String(ayahNum).padStart(3, "0");
    return "https://everyayah.com/data/" + getReciter() + "/" + s + a + ".mp3";
  }

  function getCurrentAyahInfo() {
    return freeReadMode ? getFreeReadAyah() : getAyahByGlobalIndex(state.globalIndex);
  }

  function playCurrentAyah() {
    var ayah = getCurrentAyahInfo();
    var url = getAudioUrl(ayah.surahNumber, ayah.ayahNumber);
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.removeEventListener("ended", onAudioEnded);
    }
    audioPlayer = new Audio(url);
    audioPlayer.addEventListener("ended", onAudioEnded);
    audioPlayer.addEventListener("error", function () {
      isAudioPlaying = false;
      updateAudioUI();
      showToast("Audio non disponible");
    });
    audioPlayer.play().then(function () {
      isAudioPlaying = true;
      updateAudioUI();
    }).catch(function () {
      isAudioPlaying = false;
      updateAudioUI();
    });
  }

  function pauseAudio() {
    if (audioPlayer) { audioPlayer.pause(); }
    isAudioPlaying = false;
    updateAudioUI();
  }

  function toggleAudio() {
    if (isAudioPlaying) pauseAudio();
    else playCurrentAyah();
  }

  function onAudioEnded() {
    isAudioPlaying = false;
    if (audioAutoNext) {
      goNext();
      setTimeout(playCurrentAyah, 300);
    } else {
      updateAudioUI();
    }
  }

  function stopAudio() {
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.removeEventListener("ended", onAudioEnded);
      audioPlayer = null;
    }
    isAudioPlaying = false;
    updateAudioUI();
  }

  function updateAudioUI() {
    var btn = $("audio-btn");
    if (!btn) return;
    var svg = btn.querySelector("svg");
    if (isAudioPlaying) {
      btn.classList.add("audio-playing");
      if (svg) svg.innerHTML = '<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>';
    } else {
      btn.classList.remove("audio-playing");
      if (svg) svg.innerHTML = '<polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none"/>';
    }
    var autoBtn = $("audio-auto-btn");
    if (autoBtn) autoBtn.classList.toggle("active", audioAutoNext);
  }

  function renderReciterList() {
    var list = $("reciter-list");
    if (!list) return;
    list.innerHTML = "";
    var current = getReciter();
    RECITERS.forEach(function (r) {
      var item = document.createElement("div");
      item.className = "reciter-item" + (r.id === current ? " active" : "");
      item.innerHTML = '<div><div class="reciter-item-name">' + r.name + '</div>' +
        '<div class="reciter-item-name-ar">' + r.nameAr + '</div></div>' +
        '<span class="reciter-item-check">✓</span>';
      item.addEventListener("click", function () {
        setReciter(r.id);
        if (isAudioPlaying) { stopAudio(); playCurrentAyah(); }
        renderReciterList();
      });
      list.appendChild(item);
    });
  }

  // ---- PRAYER TIMES ----
  var PRAYER_METHODS = [
    { id: "sounnah", name: "Institut Sounnah" },
    { id: 12, name: "UOIF (France)" },
    { id: 3, name: "MWL (Ligue Mondiale)" },
    { id: 2, name: "ISNA (Amérique)" },
    { id: 5, name: "Égypte" },
    { id: 4, name: "Umm Al-Qura" },
  ];
  var PRAYER_NAMES = { Fajr: "Fajr", Sunrise: "Shourouq", Dhuhr: "Dhuhr", Asr: "Asr", Maghrib: "Maghrib", Isha: "Isha", Midnight: "Moiti\u00e9 de la nuit", LastThird: "Dernier tiers" };
  var PRAYER_NAMES_AR = { Fajr: "\u0627\u0644\u0641\u062C\u0631", Sunrise: "\u0627\u0644\u0634\u0631\u0648\u0642", Dhuhr: "\u0627\u0644\u0638\u0647\u0631", Asr: "\u0627\u0644\u0639\u0635\u0631", Maghrib: "\u0627\u0644\u0645\u063A\u0631\u0628", Isha: "\u0627\u0644\u0639\u0634\u0627\u0621", Midnight: "\u0645\u0646\u062A\u0635\u0641 \u0627\u0644\u0644\u064A\u0644", LastThird: "\u0627\u0644\u062B\u0644\u062B \u0627\u0644\u0623\u062E\u064A\u0631" };
  var PRAYER_METHOD_KEY = "qurani-prayer-method";
  var prayerTimesCache = null;
  var prayerCountdownInterval = null;

  function getPrayerMethod() {
    var val = localStorage.getItem(PRAYER_METHOD_KEY);
    if (val === "sounnah") return "sounnah";
    var num = parseInt(val, 10);
    return isNaN(num) ? 12 : num;
  }
  function setPrayerMethod(id) {
    localStorage.setItem(PRAYER_METHOD_KEY, String(id));
  }

  function openPrayerOverlay() {
    $("prayer-overlay").classList.remove("hidden");
    $("prayer-loading").classList.remove("hidden");
    $("prayer-error").classList.add("hidden");
    $("prayer-content").classList.add("hidden");
    renderPrayerMethodButtons();
    if (!navigator.geolocation) {
      $("prayer-loading").classList.add("hidden");
      $("prayer-error").classList.remove("hidden");
      $("prayer-error-msg").textContent = "Géolocalisation non disponible.";
      return;
    }
    navigator.geolocation.getCurrentPosition(function (pos) {
      fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude);
    }, function (err) {
      $("prayer-loading").classList.add("hidden");
      $("prayer-error").classList.remove("hidden");
      $("prayer-error-msg").textContent = err.code === 1
        ? "Autorisez la géolocalisation pour les horaires."
        : "Impossible d'obtenir votre position.";
    }, { timeout: 12000, enableHighAccuracy: false });
  }

  function fetchPrayerTimes(lat, lon) {
    if (getPrayerMethod() === "sounnah") {
      return fetchPrayerTimesSounnah(lat, lon);
    }
    var ts = Math.floor(Date.now() / 1000);
    var url = "https://api.aladhan.com/v1/timings/" + ts + "?latitude=" + lat + "&longitude=" + lon + "&method=" + getPrayerMethod();
    fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      if (data.code !== 200 || !data.data) throw new Error("err");
      prayerTimesCache = data.data.timings;
      $("prayer-loading").classList.add("hidden");
      $("prayer-content").classList.remove("hidden");
      renderPrayerTimes();
      startPrayerCountdown();
      savePrayerTimesToBridge();
    }).catch(function () {
      $("prayer-loading").classList.add("hidden");
      $("prayer-error").classList.remove("hidden");
      $("prayer-error-msg").textContent = "Impossible de charger les horaires.";
    });
  }

  function fetchPrayerTimesSounnah(lat, lon) {
    var ts = Math.floor(Date.now() / 1000);
    var url = "https://api.institutsounnah.com/prayer-times?latitude=" + lat + "&longitude=" + lon + "&timestamp=" + ts;
    fetch(url).then(function (r) {
      if (!r.ok) throw new Error("http_" + r.status);
      return r.json();
    }).then(function (data) {
      if (!data.times || !data.times.length) throw new Error("empty");
      // Map API response to internal format
      var nameMap = { "Fajr": "Fajr", "Chourouq": "Sunrise", "Dhohr": "Dhuhr", "Assr": "Asr", "Maghrib": "Maghrib", "'Ish\u00e2": "Isha", "Moiti\u00e9 de la nuit": "Midnight", "Dernier tiers de la nuit": "LastThird" };
      var timings = {};
      data.times.forEach(function (entry) {
        var key = nameMap[entry.french_name];
        if (key) timings[key] = entry.time;
      });
      prayerTimesCache = timings;
      $("prayer-loading").classList.add("hidden");
      $("prayer-content").classList.remove("hidden");
      renderPrayerTimes();
      startPrayerCountdown();
      savePrayerTimesToBridge();
    }).catch(function (err) {
      $("prayer-loading").classList.add("hidden");
      $("prayer-error").classList.remove("hidden");
      var msg = (err && err.message && err.message.indexOf("http_") === 0)
        ? "Institut Sounnah temporairement indisponible. Choisissez une autre méthode ci-dessous."
        : "Impossible de charger les horaires Institut Sounnah.";
      $("prayer-error-msg").textContent = msg;
    });
  }

  function savePrayerTimesToBridge() {
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SharedData && prayerTimesCache) {
      var t = prayerTimesCache;
      window.Capacitor.Plugins.SharedData.savePrayerTimes({
        fajr: t.Fajr || "", sunrise: t.Sunrise || "", dhuhr: t.Dhuhr || "",
        asr: t.Asr || "", maghrib: t.Maghrib || "", isha: t.Isha || "",
        midnight: t.Midnight || "", lastThird: t.LastThird || "",
        date: "", nextPrayer: "", nextTime: "",
        method: getPrayerMethod(), city: ""
      });
    }
  }

  function renderPrayerTimes() {
    if (!prayerTimesCache) return;
    var prayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var isSounnah = getPrayerMethod() === "sounnah";
    // Add night info lines for Institut Sounnah method
    if (isSounnah && prayerTimesCache.Midnight) prayers.push("Midnight");
    if (isSounnah && prayerTimesCache.LastThird) prayers.push("LastThird");
    var listEl = $("prayer-times-list");
    listEl.innerHTML = "";
    var now = new Date();
    var nextPrayer = null;
    var infoKeys = { Midnight: true, LastThird: true };
    prayers.forEach(function (key) {
      var time = prayerTimesCache[key];
      if (!time) return;
      var isInfo = !!infoKeys[key];
      var parts = time.split(":");
      var pDate = new Date(); pDate.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);
      // Midnight/LastThird are after midnight, treat as next day for comparison
      if (isInfo && parseInt(parts[0], 10) < 12) {
        pDate.setDate(pDate.getDate() + 1);
      }
      var isPast = pDate < now;
      // Info lines don't participate in "next prayer" countdown
      var isNext = !isInfo && !isPast && !nextPrayer;
      if (isNext) nextPrayer = { key: key, date: pDate };
      var item = document.createElement("div");
      item.className = "prayer-time-item" + (isNext ? " prayer-next" : "") + (isPast && !isInfo ? " prayer-past" : "") + (isInfo ? " prayer-info" : "");
      item.innerHTML = '<div class="prayer-time-name"><span class="prayer-name-fr">' + PRAYER_NAMES[key] +
        '</span><span class="prayer-name-ar">' + PRAYER_NAMES_AR[key] + '</span></div>' +
        '<div class="prayer-time-value">' + time.substring(0, 5) + '</div>';
      listEl.appendChild(item);
    });
    if (nextPrayer) {
      $("prayer-next-name").textContent = PRAYER_NAMES[nextPrayer.key];
      var diff = nextPrayer.date - now;
      var h = Math.floor(diff / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      $("prayer-countdown").textContent = "dans " + (h > 0 ? h + "h " : "") + m + "min";
    } else {
      $("prayer-next-name").textContent = "Fajr (demain)";
      $("prayer-countdown").textContent = "";
    }
  }

  function startPrayerCountdown() {
    if (prayerCountdownInterval) clearInterval(prayerCountdownInterval);
    prayerCountdownInterval = setInterval(renderPrayerTimes, 60000);
  }

  function closePrayerOverlay() {
    $("prayer-overlay").classList.add("hidden");
    if (prayerCountdownInterval) { clearInterval(prayerCountdownInterval); prayerCountdownInterval = null; }
  }

  function renderPrayerMethodButtons() {
    var container = $("prayer-method-buttons");
    if (!container) return;
    container.innerHTML = "";
    var current = getPrayerMethod();
    PRAYER_METHODS.forEach(function (m) {
      var btn = document.createElement("button");
      btn.className = "setting-btn" + (m.id === current ? " active" : "");
      btn.textContent = m.name;
      btn.addEventListener("click", function () {
        setPrayerMethod(m.id);
        renderPrayerMethodButtons();
        openPrayerOverlay();
      });
      container.appendChild(btn);
    });
  }

  // ---- HIFZ (MEMORIZATION) ----
  var HIFZ_KEY = "qurani-hifz";
  var hifzMode = false;
  var hifzLevel = 0;
  var hifzSurahIdx = 0;
  var hifzAyahIdx = 0;
  var hifzWords = [];
  var hifzHiddenSet = new Set();

  function loadHifzData() {
    try { var raw = localStorage.getItem(HIFZ_KEY); return raw ? JSON.parse(raw) : {}; }
    catch (e) { return {}; }
  }
  function saveHifzData(data) { localStorage.setItem(HIFZ_KEY, JSON.stringify(data)); }

  function openHifzFromCurrent() {
    var ayah = getCurrentAyahInfo();
    // Find the surah array index from surahNumber
    var surahIdx = 0;
    for (var i = 0; i < surahs.length; i++) {
      if (surahs[i].surahNumber === ayah.surahNumber) { surahIdx = i; break; }
    }
    // Find ayah index in the surah
    var ayahIdx = 0;
    if (ayah.isBasmala) { ayahIdx = 0; }
    else if (ayah.surahNumber === 1 || ayah.surahNumber === 9) {
      ayahIdx = ayah.ayahNumber - 1;
    } else {
      ayahIdx = ayah.ayahNumber; // index 0 is basmala
    }
    enterHifzMode(surahIdx, ayahIdx);
  }

  function enterHifzMode(surahIdx, ayahIdx) {
    hifzMode = true;
    hifzSurahIdx = surahIdx;
    hifzAyahIdx = ayahIdx;
    hifzLevel = 0;
    // Populate surah select if needed
    var select = $("hifz-surah-select");
    if (select.options.length === 0) {
      surahs.forEach(function (s, idx) {
        var opt = document.createElement("option");
        opt.value = idx;
        opt.textContent = s.surahNumber + ". " + (SURAH_NAMES_FR[s.surahNumber] || "") + " — " + s.surahNameAr;
        select.appendChild(opt);
      });
    }
    select.value = surahIdx;
    var text = surahs[surahIdx].ayahs[ayahIdx];
    hifzWords = text.replace(/^\s+|\s+$/g, "").split(/\s+/).filter(Boolean);
    hifzHiddenSet = new Set();
    renderHifz();
    $("hifz-overlay").classList.remove("hidden");
  }

  function renderHifz() {
    var container = $("hifz-words");
    container.className = "hifz-words size-" + state.textSize;
    container.innerHTML = "";
    var surah = surahs[hifzSurahIdx];
    var isBasmala = hifzAyahIdx === 0 && surah.surahNumber !== 1 && surah.surahNumber !== 9;
    var displayNum = isBasmala ? "Basmala" : (surah.surahNumber === 1 || surah.surahNumber === 9 ? hifzAyahIdx + 1 : hifzAyahIdx);
    var nameFr = SURAH_NAMES_FR[surah.surahNumber] || "Sourate " + surah.surahNumber;
    $("hifz-ref").textContent = nameFr + " — " + (isBasmala ? "Basmala" : "Verset " + displayNum);
    $("hifz-level").textContent = hifzLevel + " / 4";

    var total = hifzWords.length;
    var hideCount = Math.round(total * (hifzLevel * 0.25));
    // Build deterministic hide set based on level
    hifzHiddenSet = new Set();
    if (hideCount > 0 && total > 0) {
      var step = total / hideCount;
      for (var i = 0; i < hideCount; i++) {
        hifzHiddenSet.add(Math.min(Math.floor(i * step), total - 1));
      }
    }

    hifzWords.forEach(function (word, idx) {
      var span = document.createElement("span");
      var isHidden = hifzHiddenSet.has(idx);
      if (isHidden) {
        span.className = "hifz-word hifz-hidden";
        span.textContent = word;
        span.addEventListener("click", function () {
          span.className = "hifz-word hifz-revealed";
        });
      } else {
        span.className = "hifz-word";
        span.textContent = word;
      }
      container.appendChild(span);
      container.appendChild(document.createTextNode(" "));
    });

    // Save best level
    var key = surah.surahNumber + ":" + hifzAyahIdx;
    var data = loadHifzData();
    if (hifzLevel > (data[key] || 0)) { data[key] = hifzLevel; saveHifzData(data); }
  }

  function hifzNextLevel() {
    if (hifzLevel < 4) { hifzLevel++; renderHifz(); }
  }
  function hifzPrevLevel() {
    if (hifzLevel > 0) { hifzLevel--; renderHifz(); }
  }
  function hifzNextVerse() {
    var surah = surahs[hifzSurahIdx];
    if (hifzAyahIdx < surah.ayahs.length - 1) { hifzAyahIdx++; }
    else if (hifzSurahIdx < surahs.length - 1) { hifzSurahIdx++; hifzAyahIdx = 0; $("hifz-surah-select").value = hifzSurahIdx; }
    else return;
    hifzLevel = 0;
    hifzWords = surahs[hifzSurahIdx].ayahs[hifzAyahIdx].replace(/^\s+|\s+$/g, "").split(/\s+/).filter(Boolean);
    renderHifz();
  }
  function hifzPrevVerse() {
    if (hifzAyahIdx > 0) { hifzAyahIdx--; }
    else if (hifzSurahIdx > 0) { hifzSurahIdx--; hifzAyahIdx = surahs[hifzSurahIdx].ayahs.length - 1; $("hifz-surah-select").value = hifzSurahIdx; }
    else return;
    hifzLevel = 0;
    hifzWords = surahs[hifzSurahIdx].ayahs[hifzAyahIdx].replace(/^\s+|\s+$/g, "").split(/\s+/).filter(Boolean);
    renderHifz();
  }
  function closeHifzOverlay() {
    hifzMode = false;
    $("hifz-overlay").classList.add("hidden");
  }

  // ---- RECITATION VERIFICATION (REAL-TIME) ----
  var recitSurahIdx = 0;
  var recitAyahIdx = 0;
  var recitIsListening = false;
  var recitWords = [];
  var recitWordsNorm = [];
  var recitMatchedCount = 0;
  var recitWordStates = [];
  var recitListener = null;
  var recitLastTranscript = "";
  var recitAutoAdvance = true;
  var recitIsNative = false;
  var recitIsWeb = false;
  var recitWebRecognition = null;

  function recitCheckSupport() {
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SpeechRecognition) {
      recitIsNative = true;
    } else if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      recitIsWeb = true;
    }
  }

  function openRecitOverlay() {
    recitCheckSupport();
    $("recit-overlay").classList.remove("hidden");

    if (!recitIsNative && !recitIsWeb) {
      $("recit-fallback").classList.remove("hidden");
      $("recit-verse-area").classList.add("hidden");
      $("recit-status").classList.add("hidden");
      $("recit-mic-btn").parentElement.classList.add("hidden");
      return;
    }

    $("recit-fallback").classList.add("hidden");
    $("recit-verse-area").classList.remove("hidden");
    $("recit-status").classList.remove("hidden");
    $("recit-mic-btn").parentElement.classList.remove("hidden");

    var select = $("recit-surah-select");
    if (select.options.length === 0) {
      surahs.forEach(function (s, idx) {
        var opt = document.createElement("option");
        opt.value = idx;
        opt.textContent = s.surahNumber + ". " + (SURAH_NAMES_FR[s.surahNumber] || "") + " — " + s.surahNameAr;
        select.appendChild(opt);
      });
    }

    var ayah = getCurrentAyahInfo();
    var surahIdx = 0;
    for (var i = 0; i < surahs.length; i++) {
      if (surahs[i].surahNumber === ayah.surahNumber) { surahIdx = i; break; }
    }
    var ayahIdx = 0;
    if (ayah.isBasmala) { ayahIdx = 0; }
    else if (ayah.surahNumber === 1 || ayah.surahNumber === 9) { ayahIdx = ayah.ayahNumber - 1; }
    else { ayahIdx = ayah.ayahNumber; }

    recitSurahIdx = surahIdx;
    recitAyahIdx = ayahIdx;
    select.value = surahIdx;
    recitLoadVerse();
    if (recitIsNative) recitRequestPermissions();
  }

  async function recitRequestPermissions() {
    try {
      var SR = window.Capacitor.Plugins.SpeechRecognition;
      var perm = await SR.checkPermissions();
      if (perm.speechRecognition !== "granted" || perm.microphone !== "granted") {
        await SR.requestPermissions();
      }
    } catch (err) { console.error("Recit permission error:", err); }
  }

  function recitLoadVerse() {
    var surah = surahs[recitSurahIdx];
    var text = surah.ayahs[recitAyahIdx];
    $("recit-verse-area").className = "recit-verse-area size-" + state.textSize;
    recitWords = text.replace(/^\s+|\s+$/g, "").split(/\s+/).filter(Boolean);
    recitWordsNorm = recitWords.map(function (w) { return normalizeArabic(w); });
    recitMatchedCount = 0;
    recitWordStates = recitWords.map(function () { return "pending"; });
    recitLastTranscript = "";

    var isBasmala = recitAyahIdx === 0 && surah.surahNumber !== 1 && surah.surahNumber !== 9;
    var displayNum = isBasmala ? "Basmala" : (surah.surahNumber === 1 || surah.surahNumber === 9 ? recitAyahIdx + 1 : recitAyahIdx);
    $("recit-verse-label").textContent = isBasmala ? "Basmala" : "Verset " + displayNum;
    $("recit-score-card").classList.add("hidden");
    $("recit-status").textContent = "";
    recitRenderWords();
  }

  function recitRenderWords() {
    var container = $("recit-verse-area");
    container.innerHTML = "";
    recitWords.forEach(function (word, idx) {
      var span = document.createElement("span");
      span.id = "recit-w-" + idx;
      var state = recitWordStates[idx];
      span.className = "recit-word" +
        (state === "correct" ? " recit-word-correct" :
         state === "error" ? " recit-word-error" :
         state === "skipped" ? " recit-word-skipped" :
         idx === recitMatchedCount ? " recit-word-active" : "");
      span.textContent = word;
      container.appendChild(span);
      if (idx < recitWords.length - 1) container.appendChild(document.createTextNode(" "));
    });
  }

  function recitUpdateWord(idx, newState) {
    recitWordStates[idx] = newState;
    var span = document.getElementById("recit-w-" + idx);
    if (!span) return;
    span.className = "recit-word" +
      (newState === "correct" ? " recit-word-correct" :
       newState === "error" ? " recit-word-error" :
       newState === "skipped" ? " recit-word-skipped" : "");
  }

  function recitProcessPartial(transcript) {
    var transcriptNorm = normalizeArabic(transcript);
    var spokenWords = transcriptNorm.split(/\s+/).filter(Boolean);
    var si = 0;
    var startFrom = recitMatchedCount;

    for (var matchIdx = 0; matchIdx < recitWords.length && si < spokenWords.length; matchIdx++) {
      if (matchIdx < startFrom) { si++; continue; }

      var expected = recitWordsNorm[matchIdx];
      var spoken = spokenWords[si];
      if (!spoken) break;

      var dist = levenshtein(expected, spoken);
      var maxLen = Math.max(expected.length, spoken.length);
      var similarity = maxLen > 0 ? 1 - (dist / maxLen) : 0;

      if (similarity >= 0.50) {
        recitUpdateWord(matchIdx, "correct");
        recitMatchedCount = matchIdx + 1;
        si++;
      } else {
        // Look ahead: user might have skipped this word
        if (matchIdx + 1 < recitWordsNorm.length) {
          var skipDist = levenshtein(recitWordsNorm[matchIdx + 1], spoken);
          var skipMax = Math.max(recitWordsNorm[matchIdx + 1].length, spoken.length);
          if (skipMax > 0 && (1 - skipDist / skipMax) >= 0.50) {
            recitUpdateWord(matchIdx, "error");
            recitUpdateWord(matchIdx + 1, "correct");
            recitMatchedCount = matchIdx + 2;
            si++;
            matchIdx++;
            continue;
          }
        }
        recitUpdateWord(matchIdx, "error");
        recitMatchedCount = matchIdx + 1;
        si++;
      }
    }

    // Update active word indicator
    if (recitMatchedCount < recitWords.length) {
      var nextSpan = document.getElementById("recit-w-" + recitMatchedCount);
      if (nextSpan && recitWordStates[recitMatchedCount] === "pending") {
        nextSpan.className = "recit-word recit-word-active";
      }
    }

    // Check verse complete
    if (recitMatchedCount >= recitWords.length) {
      recitOnVerseComplete();
    }
  }

  function recitOnVerseComplete() {
    if (recitIsListening) recitStopListening();
    var correct = 0;
    recitWordStates.forEach(function (s) { if (s === "correct") correct++; });
    var total = recitWords.length;
    var score = total > 0 ? Math.round((correct / total) * 100) : 0;
    $("recit-score").textContent = score + "%";
    $("recit-score-detail").textContent = correct + " / " + total + " mots corrects";
    $("recit-score-card").classList.remove("hidden");
    $("recit-status").textContent = "Verset terminé";

    if (recitAutoAdvance) {
      setTimeout(function () {
        if (!$("recit-overlay").classList.contains("hidden")) {
          recitGoNextVerse();
          recitStartListening();
        }
      }, 2500);
    }
  }

  async function recitStartListening() {
    if (recitIsListening || (!recitIsNative && !recitIsWeb)) return;
    try {
      if (recitIsNative) {
        // --- Capacitor (iOS native) ---
        var SR = window.Capacitor.Plugins.SpeechRecognition;
        if (recitListener) { recitListener.remove(); recitListener = null; }
        recitListener = await SR.addListener("partialResults", function (event) {
          if (event.matches && event.matches.length > 0) {
            var transcript = event.matches[0];
            if (transcript !== recitLastTranscript) {
              recitLastTranscript = transcript;
              recitProcessPartial(transcript);
            }
          }
        });
        await SR.start({ language: "ar-SA", partialResults: true, maxResults: 1, popup: false });
      } else {
        // --- Web Speech API (navigateur) ---
        var WSR = window.SpeechRecognition || window.webkitSpeechRecognition;
        recitWebRecognition = new WSR();
        recitWebRecognition.lang = "ar-SA";
        recitWebRecognition.interimResults = true;
        recitWebRecognition.continuous = true;
        recitWebRecognition.onresult = function (event) {
          var transcript = "";
          for (var i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript !== recitLastTranscript) {
            recitLastTranscript = transcript;
            recitProcessPartial(transcript);
          }
        };
        recitWebRecognition.onerror = function (e) {
          console.error("Web SR error:", e.error);
          if (e.error !== "aborted") showToast("Erreur micro : " + e.error);
        };
        recitWebRecognition.onend = function () {
          // Auto-restart if still supposed to be listening (Chrome stops after silence)
          if (recitIsListening) {
            try { recitWebRecognition.start(); } catch(e) {}
          }
        };
        recitWebRecognition.start();
      }
      recitIsListening = true;
      $("recit-mic-btn").classList.add("recording");
      $("recit-mic-label").textContent = "Écoute en cours... Appuyez pour arrêter";
      $("recit-status").textContent = "Récitez le verset...";
    } catch (err) {
      console.error("Recit start error:", err);
      showToast("Erreur reconnaissance vocale");
    }
  }

  async function recitStopListening() {
    if (!recitIsListening) return;
    recitIsListening = false;
    if (recitIsNative) {
      try {
        var SR = window.Capacitor.Plugins.SpeechRecognition;
        await SR.stop();
      } catch (err) { console.error("Recit stop error:", err); }
      if (recitListener) { recitListener.remove(); recitListener = null; }
    } else if (recitWebRecognition) {
      try { recitWebRecognition.stop(); } catch (e) {}
      recitWebRecognition = null;
    }
    $("recit-mic-btn").classList.remove("recording");
    $("recit-mic-label").textContent = "Commencer la récitation";
    if (recitMatchedCount < recitWords.length && recitMatchedCount > 0) {
      $("recit-status").textContent = "En pause — appuyez pour reprendre";
    }
  }

  function recitToggleListening() {
    if (recitIsListening) { recitStopListening(); }
    else {
      if (recitMatchedCount >= recitWords.length) recitLoadVerse();
      recitStartListening();
    }
  }

  function recitGoNextVerse() {
    var wasListening = recitIsListening;
    if (recitIsListening) recitStopListening();
    var surah = surahs[recitSurahIdx];
    if (recitAyahIdx < surah.ayahs.length - 1) { recitAyahIdx++; }
    else if (recitSurahIdx < surahs.length - 1) { recitSurahIdx++; recitAyahIdx = 0; $("recit-surah-select").value = recitSurahIdx; }
    else { return; }
    recitLoadVerse();
    if (wasListening) setTimeout(recitStartListening, 300);
  }

  function recitGoPrevVerse() {
    var wasListening = recitIsListening;
    if (recitIsListening) recitStopListening();
    if (recitAyahIdx > 0) { recitAyahIdx--; }
    else if (recitSurahIdx > 0) { recitSurahIdx--; recitAyahIdx = surahs[recitSurahIdx].ayahs.length - 1; $("recit-surah-select").value = recitSurahIdx; }
    else { return; }
    recitLoadVerse();
    if (wasListening) setTimeout(recitStartListening, 300);
  }

  function closeRecitOverlay() {
    if (recitIsListening) recitStopListening();
    $("recit-overlay").classList.add("hidden");
  }

  function normalizeArabic(text) {
    return text
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0615\u0616\u0617\u0618\u0619\u061A]/g, "")
      .replace(/[\u0622\u0623\u0625]/g, "\u0627")
      .replace(/\u0649/g, "\u064A")
      .replace(/\u0629/g, "\u0647")
      .replace(/\s+/g, " ").trim();
  }

  function levenshtein(a, b) {
    var m = a.length, n = b.length;
    var dp = [];
    for (var i = 0; i <= m; i++) {
      dp[i] = [i];
      for (var j = 1; j <= n; j++) {
        dp[i][j] = i === 0 ? j : Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    }
    return dp[m][n];
  }

  // ---- INIT ----
  async function init() {
    try {
      var results = await Promise.all([
        fetch("quran.json").then(function (r) { return r.json(); }),
        fetch("quran-fr.json").then(function (r) { return r.json(); })
      ]);
      var rawSurahs = results[0];
      var rawSurahsFr = results[1];

      // Extract the Basmala from surah 1 verse 1 (remove BOM if present)
      BASMALA = rawSurahs[0].ayahs[0].replace(/^\uFEFF/, "");

      // For every surah except 1 (Al-Fatiha) and 9 (At-Tawba):
      // Split the Basmala out of verse 1 into its own separate verse.
      surahs = rawSurahs.map(function (s) {
        if (s.surahNumber === 1 || s.surahNumber === 9) return s;
        var v1 = s.ayahs[0];
        if (v1.startsWith(BASMALA)) {
          var rest = v1.substring(BASMALA.length).trim();
          return {
            surahNumber: s.surahNumber,
            surahNameAr: s.surahNameAr,
            ayahs: [BASMALA].concat(rest ? [rest] : []).concat(s.ayahs.slice(1)),
          };
        }
        return s;
      });

      // Same structure for French: add basmala entry for surahs that have it
      surahsFr = rawSurahsFr.map(function (s) {
        if (s.surahNumber === 1 || s.surahNumber === 9) return s;
        // Add basmala as first entry to keep indices aligned with Arabic
        return {
          surahNumber: s.surahNumber,
          ayahs: [BASMALA_FR].concat(s.ayahs),
        };
      });

      totalAyat = surahs.reduce(function (sum, s) { return sum + s.ayahs.length; }, 0);
    } catch (err) {
      document.body.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:100dvh;font-size:14px;color:#999;">Impossible de charger les donn\u00e9es du Coran</div>';
      return;
    }

    state = loadState();
    applyTheme(); // apply theme before showing UI to avoid flash
    applyMode();  // apply reading mode before showing UI

    $("loading").classList.add("hidden");
    $("app").classList.remove("hidden");

    render();

    // ---- EVENT LISTENERS ----
    $("next-btn").addEventListener("click", goNext);
    $("prev-btn").addEventListener("click", goPrev);

    $("ayah-container").addEventListener("touchstart", onTouchStart, { passive: true });
    $("ayah-container").addEventListener("touchend", onTouchEnd);
    $("ayah-container").addEventListener("click", onTapNavigate);

    // Tafsir long-press
    $("ayah-container").addEventListener("touchstart", onTafsirTouchStart, { passive: true });
    $("ayah-container").addEventListener("touchmove", onTafsirTouchMove, { passive: true });
    $("ayah-container").addEventListener("touchend", onTafsirTouchEnd);
    $("tafsir-close").addEventListener("click", function () {
      $("tafsir-overlay").classList.add("hidden");
    });

    document.addEventListener("keydown", onKeyDown);

    $("continue-btn").addEventListener("click", function () {
      goalDismissed = true;
      $("goal-reached").classList.add("hidden");
    });

    // ---- HAMBURGER → opens MENU overlay ----
    $("menu-btn").addEventListener("click", function () {
      $("menu-overlay").classList.remove("hidden");
    });
    $("menu-close").addEventListener("click", function () {
      $("menu-overlay").classList.add("hidden");
    });
    $("menu-settings").addEventListener("click", function (e) {
      e.preventDefault();
      $("menu-overlay").classList.add("hidden");
      render(); updateReminderUI(); renderStats();
      $("settings-overlay").classList.remove("hidden");
    });
    $("menu-browse").addEventListener("click", function (e) {
      e.preventDefault();
      $("menu-overlay").classList.add("hidden");
      $("surah-overlay").classList.remove("hidden");
    });
    $("menu-stats").addEventListener("click", function (e) {
      e.preventDefault();
      $("menu-overlay").classList.add("hidden");
      render(); renderStats();
      $("settings-overlay").classList.remove("hidden");
    });
    $("menu-about").addEventListener("click", function (e) {
      e.preventDefault();
      $("menu-overlay").classList.add("hidden");
      render();
      $("settings-overlay").classList.remove("hidden");
    });
    $("menu-help").addEventListener("click", function (e) {
      e.preventDefault();
      $("menu-overlay").classList.add("hidden");
      render();
      $("settings-overlay").classList.remove("hidden");
    });
    // New menu items
    $("menu-prayer").addEventListener("click", function (e) {
      e.preventDefault();
      $("menu-overlay").classList.add("hidden");
      openPrayerOverlay();
    });
    $("menu-hifz").addEventListener("click", function (e) {
      e.preventDefault();
      $("menu-overlay").classList.add("hidden");
      openHifzFromCurrent();
    });
    $("menu-recitation").addEventListener("click", function (e) {
      e.preventDefault();
      $("menu-overlay").classList.add("hidden");
      openRecitOverlay();
    });
    $("menu-qibla").addEventListener("click", function (e) {
      e.preventDefault();
      $("menu-overlay").classList.add("hidden");
      openQiblaOverlay();
    });

    // ---- BACK BUTTON (free reading) ----
    $("back-btn").addEventListener("click", function () {
      exitFreeReading();
    });

    // ---- HEADER ACTION ICONS ----
    $("search-btn").addEventListener("click", function () {
      var overlay = $("search-overlay");
      overlay.classList.remove("hidden");
      overlay.classList.remove("has-results");
      $("search-input").value = "";
      $("search-results").innerHTML = "";
      $("search-hint").classList.remove("hidden");
      setTimeout(function () { $("search-input").focus(); }, 100);
    });

    // ---- AUDIO ----
    $("audio-btn").addEventListener("click", toggleAudio);
    // Long press on audio button → reciter picker
    (function () {
      var lt = null;
      $("audio-btn").addEventListener("touchstart", function () {
        lt = setTimeout(function () { lt = "fired"; renderReciterList(); $("audio-overlay").classList.remove("hidden"); }, 600);
      }, { passive: true });
      $("audio-btn").addEventListener("touchend", function (e) {
        if (lt === "fired") { e.preventDefault(); }
        if (lt !== "fired") clearTimeout(lt);
        lt = null;
      });
      $("audio-btn").addEventListener("touchmove", function () { if (lt !== "fired") clearTimeout(lt); }, { passive: true });
    })();
    $("audio-overlay-close").addEventListener("click", function () { $("audio-overlay").classList.add("hidden"); });
    $("audio-auto-btn").addEventListener("click", function () {
      audioAutoNext = !audioAutoNext;
      updateAudioUI();
    });

    // ---- PRAYER ----
    $("prayer-close").addEventListener("click", closePrayerOverlay);
    $("prayer-retry").addEventListener("click", openPrayerOverlay);

    // ---- HIFZ ----
    $("hifz-close").addEventListener("click", closeHifzOverlay);
    $("hifz-next-level").addEventListener("click", hifzNextLevel);
    $("hifz-prev-level").addEventListener("click", hifzPrevLevel);
    $("hifz-next-verse").addEventListener("click", hifzNextVerse);
    $("hifz-prev-verse").addEventListener("click", hifzPrevVerse);

    // ---- HIFZ SURAH SELECT ----
    $("hifz-surah-select").addEventListener("change", function () {
      hifzSurahIdx = parseInt(this.value, 10);
      hifzAyahIdx = 0;
      hifzLevel = 0;
      hifzWords = surahs[hifzSurahIdx].ayahs[0].replace(/^\s+|\s+$/g, "").split(/\s+/).filter(Boolean);
      renderHifz();
    });

    // ---- RECITATION VERIFICATION ----
    $("recit-close").addEventListener("click", closeRecitOverlay);
    $("recit-mic-btn").addEventListener("click", recitToggleListening);
    $("recit-prev-verse").addEventListener("click", recitGoPrevVerse);
    $("recit-next-verse").addEventListener("click", recitGoNextVerse);
    $("recit-surah-select").addEventListener("change", function () {
      var wasListening = recitIsListening;
      if (recitIsListening) recitStopListening();
      recitSurahIdx = parseInt(this.value, 10);
      recitAyahIdx = 0;
      recitLoadVerse();
      if (wasListening) setTimeout(recitStartListening, 300);
    });

    // ---- BOTTOM BAR ICONS ----
    $("qibla-close").addEventListener("click", closeQiblaOverlay);
    $("qibla-retry").addEventListener("click", openQiblaOverlay);
    $("qibla-orient-btn").addEventListener("click", function () {
      DeviceOrientationEvent.requestPermission().then(function (res) {
        if (res === "granted") {
          $("qibla-orient-prompt").classList.add("hidden");
          window.addEventListener("deviceorientation", handleQiblaOrientation, true);
          qiblaOrientListeners.push({ event: "deviceorientation", fn: handleQiblaOrientation });
        }
      }).catch(function () {});
    });
    $("bookmark-btn").addEventListener("click", toggleBookmark);
    updateBookmarkBtn();
    $("share-btn").addEventListener("click", function () {
      var ayah = freeReadMode ? getFreeReadAyah() : getAyahByGlobalIndex(state.globalIndex);
      var ref = "Sourate " + ayah.surahNameFr + " — Verset " + ayah.ayahNumber;
      var text = ayah.text + "\n\n" + ref;
      if (navigator.share) {
        navigator.share({ title: "Qurani", text: text }).catch(function () {});
      } else {
        navigator.clipboard.writeText(text).then(function () {
          showToast("Verset copié");
        }).catch(function () {
          showToast("Impossible de copier");
        });
      }
    });

    // ---- DOCK AUTO-HIDE ----
    initDockAutoHide();

    // ---- OVERLAY CLOSE BUTTONS ----
    function closeOverlay(overlayId) {
      $(overlayId).classList.add("hidden");
    }
    // openOverlayFromMenu kept for surah overlay (opened from search, stats-link, etc.)
    function openOverlayFromMenu(overlayId) {
      $(overlayId).classList.remove("hidden");
    }
    $("settings-close").addEventListener("click", function () {
      closeOverlay("settings-overlay");
    });

    document.querySelectorAll("#goal-buttons .setting-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.khatmaGoal = Number(btn.dataset.goal);
        saveState();
        render();
      });
    });

    document.querySelectorAll("#size-buttons .setting-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.textSize = btn.dataset.size;
        saveState();
        render();
      });
    });

    document.querySelectorAll("#theme-buttons .setting-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.theme = btn.dataset.theme;
        saveState();
        render();
      });
    });

    document.querySelectorAll("#lang-buttons .setting-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.displayLang = btn.dataset.lang;
        saveState();
        if (freeReadMode) renderFreeReading();
        else render();
      });
    });

    document.querySelectorAll("#mode-buttons .setting-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setReadingMode(btn.dataset.mode);
      });
    });

    document.querySelectorAll("#minimal-color-buttons .setting-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.minimalColors = btn.dataset.minimalColors === "true";
        if (state.minimalColors && !tajwidData && !tajwidLoading) {
          loadTajwidOverlay();
        }
        segmentCache.clear();
        applyMode();
        saveState();
        render();
      });
    });

    document.querySelectorAll("#tajwid-color-buttons .setting-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.tajwidColors = btn.dataset.tajwidColors === "true";
        applyMode();
        saveState();
        render();
      });
    });

    $("reset-btn").addEventListener("click", function () {
      if (confirm("Tout réinitialiser ? Cette action est irréversible.")) {
        state = defaultState();
        goalDismissed = false;
        saveState();
        render();
        $("settings-overlay").classList.add("hidden");
      }
    });

    // ---- RECITER SELECT (SETTINGS) ----
    var settingsReciterSelect = $("settings-reciter-select");
    if (settingsReciterSelect) {
      RECITERS.forEach(function (r) {
        var opt = document.createElement("option");
        opt.value = r.id;
        opt.textContent = r.name + " — " + r.nameAr;
        settingsReciterSelect.appendChild(opt);
      });
      settingsReciterSelect.value = getReciter();
      settingsReciterSelect.addEventListener("change", function () {
        setReciter(this.value);
        // Sync reciter list in audio overlay if it's open
        document.querySelectorAll("#reciter-list .reciter-btn").forEach(function (btn) {
          btn.classList.toggle("active", btn.dataset.reciter === this.value);
        }.bind(this));
      });
    }

    // ---- STATS (now inside settings panel) ----
    $("stats-bookmarks-link").addEventListener("click", function (e) {
      e.preventDefault();
      renderBookmarksList();
      $("bookmarks-overlay").classList.remove("hidden");
    });

    // ---- BOOKMARKS ----
    $("bookmarks-close").addEventListener("click", function () {
      $("bookmarks-overlay").classList.add("hidden");
    });

    // ---- FOLDER PICKER ----
    $("folder-picker-backdrop").addEventListener("click", hideFolderPicker);
    $("folder-new-btn").addEventListener("click", function () {
      $("folder-new-btn").classList.add("hidden");
      $("folder-new-row").classList.remove("hidden");
      $("folder-new-input").focus();
    });
    function createFolderAndAddBookmark() {
      var name = $("folder-new-input").value.trim();
      if (!name) return;
      var folders = loadFolders();
      var newFolder = { id: generateId(), name: name };
      folders.push(newFolder);
      saveFolders(folders);
      if (pendingBookmarkAyah) {
        addBookmarkToFolder(pendingBookmarkAyah, newFolder.id);
      }
      hideFolderPicker();
    }
    $("folder-new-confirm").addEventListener("click", createFolderAndAddBookmark);
    $("folder-new-input").addEventListener("keydown", function (e) {
      if (e.key === "Enter") createFolderAndAddBookmark();
    });

    // ---- SURAH SEARCH ----
    $("surah-search").addEventListener("input", function () {
      var query = this.value.toLowerCase().trim();
      var items = surahListEl.children;
      for (var i = 0; i < items.length; i++) {
        var wrapper = items[i];
        var frName = wrapper.querySelector(".surah-name-fr");
        var arName = wrapper.querySelector(".surah-name-ar");
        var num = wrapper.querySelector(".surah-num");
        if (!frName) { wrapper.classList.remove("hidden"); continue; }
        var text = (frName.textContent + " " + arName.textContent + " " + num.textContent).toLowerCase();
        if (!query || text.indexOf(query) !== -1) {
          wrapper.classList.remove("hidden");
        } else {
          wrapper.classList.add("hidden");
        }
      }
    });

    // ---- AUTO THEME: listen for system changes ----
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
        if (state.theme === "auto") {
          applyTheme();
        }
      });
    }

    // ---- NOTIFICATIONS (OneSignal) ----
    $("reminder-toggle-btn").addEventListener("click", function () {
      requestOneSignalPermission();
    });

    initOneSignal();

    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) {
        var today = getLocalDateStr();
        if (state.lastReadDate !== today) {
          state.todayReadCount = 0;
          state.lastReadDate = today;
          goalDismissed = false;
          saveState();
          if (!freeReadMode) render();
        }
      }
    });

    // ---- SURAH LIST ----
    var surahListEl = $("surah-list");
    var activeVersePicker = null; // track which picker is open

    surahs.forEach(function (s, surahArrayIndex) {
      var wrapper = document.createElement("div");

      var item = document.createElement("div");
      item.className = "surah-item";

      var left = document.createElement("div");
      left.className = "surah-item-left";

      var num = document.createElement("span");
      num.className = "surah-num";
      num.textContent = s.surahNumber;

      var nameFr = document.createElement("span");
      nameFr.className = "surah-name-fr";
      nameFr.textContent = SURAH_NAMES_FR[s.surahNumber] || "Sourate " + s.surahNumber;

      left.appendChild(num);
      left.appendChild(nameFr);

      var nameAr = document.createElement("span");
      nameAr.className = "surah-name-ar";
      nameAr.textContent = s.surahNameAr;

      item.appendChild(left);
      item.appendChild(nameAr);

      // Verse count (excluding Basmala for display)
      var realVerseCount = s.ayahs.length;
      if (s.surahNumber !== 1 && s.surahNumber !== 9) {
        realVerseCount = s.ayahs.length - 1; // minus Basmala
      }

      // Verse picker (hidden by default)
      var picker = document.createElement("div");
      picker.className = "verse-picker hidden";

      var pickerLabel = document.createElement("span");
      pickerLabel.className = "verse-picker-label";
      pickerLabel.textContent = "Verset (1\u2013" + realVerseCount + ")";

      var pickerInput = document.createElement("input");
      pickerInput.type = "number";
      pickerInput.className = "verse-picker-input";
      pickerInput.min = 1;
      pickerInput.max = realVerseCount;
      pickerInput.value = 1;
      pickerInput.placeholder = "1";

      var pickerBtn = document.createElement("button");
      pickerBtn.className = "verse-picker-btn";
      pickerBtn.textContent = "Lecture libre";

      var jumpBtn = document.createElement("button");
      jumpBtn.className = "verse-picker-btn verse-picker-btn-jump";
      jumpBtn.textContent = "Mon plan 30 jours";

      picker.appendChild(pickerLabel);
      picker.appendChild(pickerInput);
      picker.appendChild(pickerBtn);
      picker.appendChild(jumpBtn);

      wrapper.appendChild(item);
      wrapper.appendChild(picker);

      item.addEventListener("click", function (e) {
        e.stopPropagation();
        if (activeVersePicker && activeVersePicker !== picker) {
          activeVersePicker.classList.add("hidden");
        }
        picker.classList.toggle("hidden");
        activeVersePicker = picker.classList.contains("hidden") ? null : picker;
        if (!picker.classList.contains("hidden")) {
          pickerInput.value = 1;
          pickerInput.focus();
        }
      });

      pickerBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        var verseNum = parseInt(pickerInput.value, 10);
        if (isNaN(verseNum) || verseNum < 1) verseNum = 1;
        if (verseNum > realVerseCount) verseNum = realVerseCount;

        // Convert verse number to ayah index in the processed array
        var ayahIdx;
        if (s.surahNumber === 1 || s.surahNumber === 9) {
          ayahIdx = verseNum - 1;
        } else {
          ayahIdx = verseNum; // index 0 = Basmala, index 1 = verse 1, etc.
        }
        enterFreeReading(surahArrayIndex, ayahIdx);
      });

      jumpBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        var verseNum = parseInt(pickerInput.value, 10);
        if (isNaN(verseNum) || verseNum < 1) verseNum = 1;
        if (verseNum > realVerseCount) verseNum = realVerseCount;

        var ayahIdx;
        if (s.surahNumber === 1 || s.surahNumber === 9) {
          ayahIdx = verseNum - 1;
        } else {
          ayahIdx = verseNum;
        }
        jumpToPosition(surahArrayIndex, ayahIdx);
      });

      // Allow pressing Enter in the input
      pickerInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          pickerBtn.click();
        }
      });

      surahListEl.appendChild(wrapper);
    });

    $("ayah-ref").addEventListener("click", function () {
      $("surah-overlay").classList.remove("hidden");
    });
    $("surah-close").addEventListener("click", function () {
      closeOverlay("surah-overlay");
    });

    // ---- QURAN SEARCH ----
    var searchTimer = null;
    var MAX_RESULTS = 50;

    function performSearch(query) {
      var resultsEl = $("search-results");
      var hintEl = $("search-hint");
      var overlay = $("search-overlay");
      resultsEl.innerHTML = "";

      if (!query || query.length < 2) {
        hintEl.classList.remove("hidden");
        overlay.classList.remove("has-results");
        return;
      }
      hintEl.classList.add("hidden");

      var q = query.toLowerCase();
      var results = [];

      for (var i = 0; i < surahs.length; i++) {
        var s = surahs[i];
        var sFr = surahsFr[i];
        for (var j = 0; j < s.ayahs.length; j++) {
          // Skip basmala entries for search
          var isBasmala = false;
          var displayNum = j + 1;
          if (s.surahNumber !== 1 && s.surahNumber !== 9) {
            if (j === 0) { isBasmala = true; displayNum = 0; }
            else { displayNum = j; }
          }
          if (isBasmala) continue;

          var arText = s.ayahs[j];
          var frText = sFr && sFr.ayahs[j] ? sFr.ayahs[j] : "";
          var matchAr = arText.indexOf(query) !== -1;
          var matchFr = frText.toLowerCase().indexOf(q) !== -1;

          if (matchAr || matchFr) {
            results.push({
              surahIdx: i,
              ayahIdx: j,
              surahNumber: s.surahNumber,
              surahNameFr: SURAH_NAMES_FR[s.surahNumber] || "Sourate " + s.surahNumber,
              ayahNumber: displayNum,
              arText: arText,
              frText: frText
            });
            if (results.length >= MAX_RESULTS) break;
          }
        }
        if (results.length >= MAX_RESULTS) break;
      }

      overlay.classList.add("has-results");

      if (results.length === 0) {
        var noRes = document.createElement("p");
        noRes.className = "search-no-results";
        noRes.textContent = "Aucun résultat pour « " + query + " »";
        resultsEl.appendChild(noRes);
        return;
      }

      var countEl = document.createElement("p");
      countEl.className = "search-result-count";
      countEl.textContent = results.length >= MAX_RESULTS
        ? MAX_RESULTS + "+ résultats"
        : results.length + " résultat" + (results.length > 1 ? "s" : "");
      resultsEl.appendChild(countEl);

      results.forEach(function (r) {
        var item = document.createElement("div");
        item.className = "search-result-item";

        var ref = document.createElement("div");
        ref.className = "search-result-ref";
        ref.textContent = "Sourate " + r.surahNameFr + " — Verset " + r.ayahNumber;

        var arDiv = document.createElement("div");
        arDiv.className = "search-result-ar";
        arDiv.textContent = r.arText;

        item.appendChild(ref);
        item.appendChild(arDiv);

        if (r.frText) {
          var frDiv = document.createElement("div");
          frDiv.className = "search-result-fr";
          frDiv.textContent = r.frText;
          item.appendChild(frDiv);
        }

        item.addEventListener("click", function () {
          $("search-overlay").classList.add("hidden");
          enterFreeReading(r.surahIdx, r.ayahIdx);
        });

        resultsEl.appendChild(item);
      });
    }

    $("search-close").addEventListener("click", function () {
      closeOverlay("search-overlay");
    });
    $("search-browse-btn").addEventListener("click", function () {
      closeOverlay("search-overlay");
      $("surah-overlay").classList.remove("hidden");
    });
    $("search-input").addEventListener("input", function () {
      var val = this.value.trim();
      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        performSearch(val);
      }, 300);
    });

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    }
  }

  init();
})();
