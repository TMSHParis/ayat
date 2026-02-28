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

  // ---- OVERLAY NAVIGATION STACK ----
  var _overlayHistory = [];
  function _closeBack(id, cleanup) {
    if (cleanup) cleanup();
    $(id).classList.add("hidden");
    if (_overlayHistory.length > 0) {
      $(_overlayHistory.pop()).classList.remove("hidden");
    }
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
    document.querySelectorAll("#minimal-color-buttons .setting-btn").forEach(function (btn) {
      btn.classList.toggle("active", (btn.dataset.minimalColors === "true") === !!state.minimalColors);
    });
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
    _renderBookmarksInto($("bookmarks-list"));
    var sl = $("settings-bookmarks-list");
    if (sl) _renderBookmarksInto(sl);
  }

  function _renderBookmarksInto(list) {
    if (!list) return;
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
      !$("recit-overlay").classList.contains("hidden") ||
      !$("shazam-overlay").classList.contains("hidden")
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
      !$("recit-overlay").classList.contains("hidden") ||
      !$("shazam-overlay").classList.contains("hidden")
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
  var qiblaCompassRot = 0; // tracks compass face rotation for smooth wraparound
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

  // Rotate compass face so N/E/S/W reflect real cardinal directions
  function setCompassRotation(targetDeg) {
    var diff = ((targetDeg - qiblaCompassRot) % 360 + 540) % 360 - 180;
    qiblaCompassRot += diff;
    var compass = $("qibla-compass");
    if (!compass) return;
    compass.style.transform = "rotate(" + qiblaCompassRot + "deg)";
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
    var compass = $("qibla-compass");
    if (needle && !needle.classList.contains("live")) {
      needle.classList.add("live");
      if (compass) compass.classList.add("live");
      // In live mode, needle stays fixed at qiblaBearing relative to compass face
      // (compass face rotates, so visually the needle shows correct direction)
      setNeedleRotation(qiblaBearing);
    }

    // Rotate compass face so N always points to geographic north
    setCompassRotation(-heading);

    // Check alignment (phone pointing toward Ka'ba)
    var rotation = qiblaBearing - heading;
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
    qiblaCompassRot = 0;
    qiblaIsAligned = false;
    stopQiblaOrientation();
    var compassEl = $("qibla-compass");
    if (compassEl) {
      compassEl.style.transform = "";
      compassEl.classList.remove("live");
    }

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
    qiblaCompassRot = 0;
    qiblaIsAligned = false;
    var compassEl = $("qibla-compass");
    if (compassEl) {
      compassEl.style.transform = "";
      compassEl.classList.remove("live");
    }
  }

  // ---- AUDIO PLAYER ----
  // listenBase: mp3quran.net base URL for full-surah listening ({surah3}.mp3)
  // id: everyayah.com reciter ID for per-verse reading audio (null = listen-only)
  var RECITERS = [
    { id: "Alafasy_128kbps",             name: "Mishary Al-Afasy",   nameAr: "مشاري العفاسي",        listenBase: "https://server8.mp3quran.net/afs" },
    { id: "Husary_128kbps",              name: "Al-Husary",          nameAr: "محمود خليل الحصري",     listenBase: "https://server13.mp3quran.net/husr" },
    { id: "Abdul_Basit_Murattal_192kbps",name: "Abdul Basit",        nameAr: "عبد الباسط عبد الصمد", listenBase: "https://server7.mp3quran.net/basit" },
    { id: "Minshawy_Murattal_128kbps",   name: "Al-Minshawi",        nameAr: "محمد صديق المنشاوي",   listenBase: "https://server10.mp3quran.net/minsh" },
    { id: "Saood_ash-Shuraym_128kbps",   name: "Al-Shuraym",         nameAr: "سعود الشريم",          listenBase: "https://server7.mp3quran.net/shur" },
    { id: "Muhammad_Ayyoub_128kbps",     name: "Muhammad Ayyub",     nameAr: "محمد أيوب",            listenBase: "https://server8.mp3quran.net/ayyub" },
    { id: null,                          name: "Hisham Al-Harraz",   nameAr: "هشام الهراز",          listenBase: "https://server16.mp3quran.net/H-Lharraz/Rewayat-Warsh-A-n-Nafi" },
    { id: null,                          name: "Al-Oyoun Al-Kouchi", nameAr: "العيون الكوشي",        listenBase: "https://server11.mp3quran.net/koshi" },
    { id: null,                          name: "Mokhtar Al-Hajj",    nameAr: "مختار الحاج",          listenBase: "https://server16.mp3quran.net/mukhtar_haj/Rewayat-Hafs-A-n-Assem" },
    { id: null,                          name: "Nourein Muhammad",   nameAr: "نورين محمد صديق",      listenBase: "https://server16.mp3quran.net/nourin_siddig/Rewayat-Aldori-A-n-Abi-Amr" },
    { id: null,                          name: "Younes Asoliss",     nameAr: "يونس اسويلص",          listenBase: "https://server16.mp3quran.net/souilass/Rewayat-Warsh-A-n-Nafi" },
    { id: null,                          name: "Abdulrahman Al-Sudais", nameAr: "عبد الرحمن السديس",  listenBase: "https://server11.mp3quran.net/sds" },
    { id: null,                          name: "Maher Al-Mueaqly",  nameAr: "ماهر المعيقلي",        listenBase: "https://server12.mp3quran.net/maher" },
    { id: null,                          name: "Nasser Al-Qatami",  nameAr: "ناصر القطامي",         listenBase: "https://server6.mp3quran.net/qtm" },
    { id: null,                          name: "Ahmad Al-Ajmi",     nameAr: "أحمد العجمي",          listenBase: "https://server10.mp3quran.net/ajm" },
    { id: null,                          name: "Yasser Al-Dosari",  nameAr: "ياسر الدوسري",         listenBase: "https://server11.mp3quran.net/yasser" },
    { id: null,                          name: "Bandar Baleela",    nameAr: "بندر بليلة",           listenBase: "https://server6.mp3quran.net/balilah" },
    { id: null,                          name: "Khalid Al-Jalil",   nameAr: "خالد الجليل",          listenBase: "https://server10.mp3quran.net/jleel" },
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
    RECITERS.filter(function (r) { return r.id; }).forEach(function (r) {
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

  // ---- ISLAM SOUNNAH LOCAL PRAYER ENGINE ----
  // Based on PrayTimes.js v2.3 (PrayTimes.org) + PrayerTimeFr interpolation for France
  var _ISDMath = {
    dtr: function(d) { return d * Math.PI / 180; },
    rtd: function(r) { return 180 * r / Math.PI; },
    sin: function(d) { return Math.sin(this.dtr(d)); },
    cos: function(d) { return Math.cos(this.dtr(d)); },
    tan: function(d) { return Math.tan(this.dtr(d)); },
    arcsin: function(v) { return this.rtd(Math.asin(v)); },
    arccos: function(v) { return this.rtd(Math.acos(v)); },
    arctan: function(v) { return this.rtd(Math.atan(v)); },
    arccot: function(v) { return this.rtd(Math.atan(1 / v)); },
    arctan2: function(y, x) { return this.rtd(Math.atan2(y, x)); },
    fixAngle: function(a) { return this.fix(a, 360); },
    fixHour: function(h) { return this.fix(h, 24); },
    fix: function(a, b) { a -= b * Math.floor(a / b); return a < 0 ? a + b : a; }
  };

  function _ISLatLon(lat, lon) {
    if (!(this instanceof _ISLatLon)) return new _ISLatLon(lat, lon);
    this.lat = Number(lat); this.lon = Number(lon);
  }
  _ISLatLon.prototype.distanceTo = function(p) {
    var R = 6371e3,
        f1 = this.lat * Math.PI / 180, f2 = p.lat * Math.PI / 180,
        df = (p.lat - this.lat) * Math.PI / 180,
        dl = (p.lon - this.lon) * Math.PI / 180,
        a = Math.sin(df/2)*Math.sin(df/2) + Math.cos(f1)*Math.cos(f2)*Math.sin(dl/2)*Math.sin(dl/2),
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  function _ISPrayTimes(method) {
    var _lat, _lng, _elv, _tz, _jdate, _iterations = 1, _offsets = {},
        _methods = {
          MWL: { name: "Muslim World League", params: { fajr: 18, isha: 17 } },
          ISNA: { name: "ISNA", params: { fajr: 15, isha: 15 } },
          Egypt: { name: "Egyptian", params: { fajr: 19.5, isha: 17.5 } },
          Makkah: { name: "Umm Al-Qura", params: { fajr: 18.5, isha: "90 min" } },
          Karachi: { name: "Karachi", params: { fajr: 18, isha: 18 } },
          Tehran: { name: "Tehran", params: { fajr: 17.7, isha: 14, maghrib: 4.5, midnight: "Jafari" } },
          Jafari: { name: "Jafari", params: { fajr: 16, isha: 14, maghrib: 4, midnight: "Jafari" } }
        },
        _defaults = { maghrib: "0 min", midnight: "Standard" },
        _currentMethod = "MWL",
        _setting = { imsak: "10 min", dhuhr: "0 min", asr: "Standard", highLats: "NightMiddle" },
        _format = "24h";

    // Fill defaults
    for (var m in _methods) {
      var p = _methods[m].params;
      for (var d in _defaults) if (typeof p[d] === "undefined") p[d] = _defaults[d];
    }
    _currentMethod = _methods[method] ? method : _currentMethod;
    var mp = _methods[_currentMethod].params;
    for (var k in mp) _setting[k] = mp[k];
    var tl = { imsak: 0, fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, sunset: 0, maghrib: 0, isha: 0, midnight: 0, lastThird: 0 };

    function _eval(v) { return 1 * (v + "").split(/[^0-9.+-]/)[0]; }
    function _isMin(v) { return (v + "").indexOf("min") !== -1; }
    function _timeDiff(a, b) { return _ISDMath.fixHour(b - a); }
    function _twoDigits(n) { return n < 10 ? "0" + n : n; }

    function _sunPosition(jd) {
      var D = jd - 2451545,
          g = _ISDMath.fixAngle(357.529 + 0.98560028 * D),
          q = _ISDMath.fixAngle(280.459 + 0.98564736 * D),
          L = _ISDMath.fixAngle(q + 1.915 * _ISDMath.sin(g) + 0.02 * _ISDMath.sin(2*g)),
          e = 23.439 - 3.6e-7 * D,
          RA = _ISDMath.arctan2(_ISDMath.cos(e) * _ISDMath.sin(L), _ISDMath.cos(L)) / 15,
          eqt = q / 15 - _ISDMath.fixHour(RA),
          decl = _ISDMath.arcsin(_ISDMath.sin(e) * _ISDMath.sin(L));
      return { declination: decl, equation: eqt };
    }
    function _julian(y, m, d) {
      if (m <= 2) { y -= 1; m += 12; }
      var A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
      return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
    }
    function _midDay(t) {
      var eq = _sunPosition(_jdate + t).equation;
      return _ISDMath.fixHour(12 - eq);
    }
    function _sunAngleTime(angle, t, ccw) {
      var decl = _sunPosition(_jdate + t).declination,
          noon = _midDay(t),
          s = 1/15 * _ISDMath.arccos((-_ISDMath.sin(angle) - _ISDMath.sin(decl)*_ISDMath.sin(_lat)) / (_ISDMath.cos(decl)*_ISDMath.cos(_lat)));
      return noon + (ccw ? -s : s);
    }
    function _asrTime(factor, t) {
      var decl = _sunPosition(_jdate + t).declination,
          angle = -_ISDMath.arccot(factor + _ISDMath.tan(Math.abs(_lat - decl)));
      return _sunAngleTime(angle, t);
    }
    function _riseSetAngle() { return 0.833 + 0.0347 * Math.sqrt(_elv); }
    function _asrFactor(v) { return ({ Standard: 1, Hanafi: 2 })[v] || _eval(v); }

    function _nightPortion(angle, night) {
      var m = _setting.highLats, p = 0.5;
      if (m === "AngleBased") p = 1/60 * angle;
      if (m === "OneSeventh") p = 1/7;
      return p * night;
    }
    function _adjustHLTime(time, base, angle, night, ccw) {
      var portion = _nightPortion(angle, night),
          diff = ccw ? _timeDiff(time, base) : _timeDiff(base, time);
      if (isNaN(time) || diff > portion) time = base + (ccw ? -portion : portion);
      return time;
    }

    function _computePrayerTimes(times) {
      for (var k in times) times[k] /= 24; // dayPortion
      var s = _setting;
      return {
        imsak: _sunAngleTime(_eval(s.imsak), times.imsak, true),
        fajr: _sunAngleTime(_eval(s.fajr), times.fajr, true),
        sunrise: _sunAngleTime(_riseSetAngle(), times.sunrise, true),
        dhuhr: _midDay(times.dhuhr),
        asr: _asrTime(_asrFactor(s.asr), times.asr),
        sunset: _sunAngleTime(_riseSetAngle(), times.sunset),
        maghrib: _sunAngleTime(_eval(s.maghrib), times.maghrib),
        isha: _sunAngleTime(_eval(s.isha), times.isha)
      };
    }

    return {
      adjust: function(params) { for (var k in params) _setting[k] = params[k]; },
      getTimes: function(date, coords, tz, dst) {
        _lat = 1 * coords[0]; _lng = 1 * coords[1]; _elv = coords[2] ? 1 * coords[2] : 0;
        _format = "24h";
        if (date.constructor === Date) date = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
        if (typeof tz === "undefined" || tz === "auto") tz = this.getTimeZone(date);
        if (typeof dst === "undefined" || dst === "auto") dst = this.getDst(date);
        _tz = 1 * tz + (1 * dst ? 1 : 0);
        _jdate = _julian(date[0], date[1], date[2]) - _lng / 360;

        var times = { imsak: 5, fajr: 5, sunrise: 6, dhuhr: 12, asr: 13, sunset: 18, maghrib: 18, isha: 18 };
        for (var i = 1; i <= _iterations; i++) times = _computePrayerTimes(times);

        // Adjust times
        times.sunset += 0.05;
        var s = _setting;
        for (var k in times) times[k] += _tz - _lng / 15;
        if (s.highLats !== "None") {
          var nightTime = _timeDiff(times.sunset, times.sunrise);
          times.imsak = _adjustHLTime(times.imsak, times.sunrise, _eval(s.imsak), nightTime, true);
          times.fajr = _adjustHLTime(times.fajr, times.sunrise, _eval(s.fajr), nightTime, true);
          times.isha = _adjustHLTime(times.isha, times.sunset, _eval(s.isha), nightTime);
          times.maghrib = _adjustHLTime(times.maghrib, times.sunset, _eval(s.maghrib), nightTime);
        }
        if (_isMin(s.imsak)) times.imsak = times.fajr - _eval(s.imsak) / 60;
        if (_isMin(s.maghrib)) times.maghrib = times.sunset + _eval(s.maghrib) / 60;
        if (_isMin(s.isha)) times.isha = times.maghrib + _eval(s.isha) / 60;
        times.dhuhr += _eval(s.dhuhr) / 60;

        // Midnight & LastThird
        times.midnight = (s.midnight === "Jafari")
          ? times.sunset + _timeDiff(times.sunset, times.fajr) / 2
          : times.sunset + _timeDiff(times.sunset, times.sunrise) / 2;
        times.lastThird = (s.midnight === "Jafari")
          ? times.sunset + _timeDiff(times.sunset, times.fajr) / 3 * 2
          : times.sunset + _timeDiff(times.sunset, times.sunrise) / 3 * 2;

        // Tune & format
        for (var t in times) times[t] += (tl[t] || 0) / 60;
        for (var f in times) {
          var v = times[f];
          if (isNaN(v)) { times[f] = "-----"; continue; }
          v = _ISDMath.fixHour(v + 0.5 / 60);
          var hh = Math.floor(v), mm = Math.floor(60 * (v - hh));
          times[f] = _twoDigits(hh) + ":" + _twoDigits(mm);
        }
        return times;
      },
      getTimeZone: function(d) {
        var jan = this._gmtOffset([d[0], 0, 1]), jul = this._gmtOffset([d[0], 6, 1]);
        return Math.min(jan, jul);
      },
      getDst: function(d) { return 1 * (this._gmtOffset(d) !== this.getTimeZone(d)); },
      _gmtOffset: function(d) {
        var local = new Date(d[0], d[1] - 1, d[2], 12, 0, 0, 0);
        var gmt = new Date(local.toGMTString().replace(/ GMT$/, "").replace(/ GMT\+.*$/, "").replace(/ UTC$/, ""));
        return (local - gmt) / 3.6e6;
      }
    };
  }

  // France Fajr data table (16 reference cities)
  var _IS_FR_DATA = [
    { city: "amiens", latitude: 49.90095321859007, longitude: 2.290074455386684, times: [["6h51","6h51","6h51","6h51","6h51","6h51","6h51","6h50","6h50","6h50","6h50","6h49","6h49","6h48","6h48","6h47","6h47","6h46","6h46","6h45","6h44","6h43","6h43","6h42","6h41","6h40","6h39","6h38","6h37","6h36","6h35"],["6h34","6h32","6h31","6h30","6h29","6h27","6h26","6h24","6h23","6h21","6h20","6h18","6h17","6h15","6h14","6h13","6h11","6h10","6h08","6h07","6h05","6h04","6h02","6h00","5h59","5h57","5h55","5h54","5h53"],["5h52","5h50","5h49","5h47","5h45","5h43","5h41","5h39","5h38","5h36","5h34","5h32","5h30","5h28","5h26","5h24","5h22","5h20","5h18","5h16","5h14","5h12","5h10","5h08","5h06","5h03","5h01","4h59","4h57","4h55","4h53"],["4h51","4h48","4h46","4h44","4h42","4h40","4h37","4h35","4h33","4h31","4h28","4h26","4h24","4h22","4h19","4h17","4h15","4h13","4h10","4h08","4h06","4h04","3h01","3h59","3h57","3h55","3h52","3h50","3h48","3h46"],["3h44","3h41","3h39","3h37","3h35","3h33","3h30","3h28","3h26","3h24","3h20","3h20","3h18","3h16","3h14","3h12","3h10","3h08","3h06","3h04","3h02","3h00","2h58","2h57","2h55","2h53","2h51","2h50","2h48","2h47","2h45"],["2h44","2h42","2h41","2h40","2h39","2h38","2h37","2h36","2h35","2h34","2h33","2h32","2h32","2h31","2h31","2h30","2h30","2h30","2h30","2h30","2h30","2h30","2h31","2h31","2h32","2h32","2h33","2h34","2h34","2h35"],["2h36","2h37","2h39","2h40","2h41","2h42","2h44","2h45","2h47","2h48","2h50","2h51","2h53","2h55","2h57","2h58","3h00","3h02","3h04","3h06","3h08","3h10","3h12","3h14","3h16","3h17","3h19","3h21","3h23","3h25","3h27"],["3h29","3h31","3h33","3h35","3h37","3h39","3h41","3h43","3h45","3h47","3h49","3h51","3h53","3h55","3h57","3h58","4h00","4h02","4h04","4h06","4h07","4h09","4h11","4h13","4h14","4h16","4h18","4h19","4h20","4h21","4h25"],["4h26","4h28","4h29","4h31","4h33","4h34","4h36","4h37","4h39","4h40","4h42","4h43","4h45","4h46","4h48","4h49","4h51","4h52","4h54","4h55","4h57","4h58","4h59","5h01","5h02","5h03","5h05","5h06","5h07","5h09"],["5h10","5h11","5h13","5h14","5h15","5h17","5h18","5h19","5h21","5h22","5h23","5h24","5h26","5h27","5h28","5h30","5h31","5h32","5h33","5h35","5h36","5h37","5h38","5h40","5h41","5h42","5h43","5h45","5h46","5h47","5h49"],["5h50","5h52","5h53","5h55","5h56","5h58","5h59","6h00","6h02","6h03","6h05","6h06","6h07","6h09","6h10","6h12","6h13","6h14","6h16","6h17","6h18","6h20","6h21","6h22","6h23","6h24","6h26","6h27","6h28","6h29"],["6h30","6h31","6h32","6h34","6h35","6h36","6h37","6h38","6h38","6h39","6h40","6h41","6h42","6h43","6h43","6h44","6h45","6h46","6h46","6h47","6h47","6h48","6h48","6h49","6h49","6h49","6h50","6h50","6h50","6h51","6h51"]] },
    { city: "besancon", latitude: 47.25538722494024, longitude: 6.0194869649423115, times: [["6h32","6h32","6h32","6h32","6h32","6h32","6h32","6h32","6h32","6h31","6h31","6h31","6h30","6h30","6h30","6h29","6h29","6h28","6h28","6h27","6h26","6h26","6h25","6h24","6h24","6h23","6h22","6h21","6h20","6h19","6h18"],["6h17","6h16","6h15","6h14","6h13","6h11","6h10","6h09","6h07","6h06","6h05","6h03","6h02","6h01","5h59","5h58","5h56","5h55","5h53","5h52","5h50","5h49","5h47","5h46","5h44","5h42","5h41","5h39","5h38"],["5h37","5h35","5h34","5h32","5h30","5h28","5h26","5h25","5h23","5h21","5h19","5h17","5h15","5h13","5h11","5h09","5h07","5h05","5h03","5h01","4h59","4h57","4h55","4h53","4h51","4h49","4h46","4h44","4h42","4h40","4h38"],["4h36","4h33","4h31","4h29","4h27","4h25","4h22","4h20","4h18","4h16","4h14","4h11","4h09","4h07","4h05","4h02","4h00","3h58","3h56","3h53","3h51","3h49","3h47","3h44","3h42","3h40","3h38","3h35","3h33","3h31"],["3h29","3h26","3h24","3h22","3h20","3h18","3h16","3h13","3h11","3h09","3h07","3h05","3h03","3h01","2h59","2h57","2h55","2h53","2h51","2h49","2h47","2h45","2h43","2h42","2h40","2h38","2h37","2h35","2h33","2h32","2h30"],["2h29","2h28","2h26","2h25","2h24","2h23","2h22","2h21","2h20","2h19","2h18","2h17","2h17","2h16","2h16","2h16","2h15","2h15","2h15","2h15","2h15","2h16","2h16","2h16","2h17","2h17","2h18","2h19","2h20","2h20"],["2h21","2h23","2h24","2h25","2h26","2h27","2h29","2h30","2h32","2h33","2h35","2h37","2h38","2h40","2h42","2h44","2h45","2h47","2h49","2h51","2h53","2h55","2h57","2h59","3h01","3h03","3h05","3h07","3h09","3h10","3h12"],["3h14","3h16","3h18","3h20","3h22","3h24","3h26","3h28","3h30","3h32","3h34","3h36","3h38","3h40","3h42","3h43","3h45","3h47","3h49","3h51","3h53","3h54","3h56","3h58","4h00","4h01","4h03","4h05","4h06","4h08","4h10"],["4h11","4h13","4h15","4h16","4h18","4h19","4h21","4h22","4h24","4h26","4h27","4h29","4h30","4h32","4h33","4h34","4h36","4h37","4h39","4h40","4h42","4h43","4h44","4h46","4h47","4h49","4h50","4h51","4h53","4h54"],["4h55","4h57","4h58","4h59","5h01","5h02","5h03","5h04","5h06","5h07","5h08","5h10","5h11","5h12","5h13","5h15","5h16","5h17","5h18","5h20","5h21","5h22","5h23","5h25","5h26","5h27","5h28","5h30","5h31","5h32","5h34"],["5h35","5h37","5h38","5h39","5h40","5h42","5h43","5h44","5h46","5h47","5h48","5h49","5h51","5h52","5h53","5h54","5h56","5h57","5h58","5h59","6h01","6h02","6h03","6h04","6h05","6h06","6h07","6h09","6h10","6h11"],["6h12","6h13","6h14","6h15","6h16","6h17","6h18","6h19","6h19","6h20","6h21","6h22","6h23","6h24","6h24","6h25","6h26","6h26","6h27","6h27","6h28","6h29","6h29","6h29","6h30","6h30","6h31","6h31","6h31","6h31","6h32"]] },
    { city: "bordeaux", latitude: 44.85724453514966, longitude: -0.5736967811598869, times: [["6h54","6h55","6h55","6h55","6h55","6h55","6h55","6h55","6h55","6h54","6h54","6h54","6h54","6h53","6h53","6h53","6h52","6h52","6h51","6h51","6h50","6h50","6h49","6h48","6h48","6h47","6h46","6h45","6h45","6h44","6h43"],["6h42","6h41","6h40","6h39","6h38","6h37","6h36","6h34","6h33","6h31","6h32","6h30","6h28","6h27","6h26","6h24","6h23","6h21","6h20","6h18","6h17","6h15","6h14","6h12","6h10","6h09","6h07","6h05","6h05"],["6h04","6h02","6h00","5h59","5h57","5h55","5h53","5h51","5h49","5h48","5h46","5h44","5h42","5h40","5h38","5h36","5h34","5h32","5h30","5h28","5h26","5h24","5h22","5h20","5h18","5h15","5h13","5h11","5h09","5h07","5h05"],["5h03","5h00","4h58","4h56","4h54","4h52","4h50","4h47","4h45","4h43","4h41","4h38","4h36","4h34","4h32","4h30","4h27","4h25","4h23","4h21","4h18","4h16","4h14","4h12","4h09","4h07","4h05","4h03","4h01","3h58"],["3h56","3h54","3h52","3h50","3h48","3h45","3h43","3h41","3h39","3h37","3h35","3h33","3h31","3h29","3h27","3h25","3h23","3h21","3h19","3h17","3h15","3h14","3h12","3h10","3h08","3h07","3h05","3h03","3h02","3h00","2h59"],["2h58","2h56","2h55","2h54","2h53","2h51","2h50","2h49","2h49","2h48","2h47","2h46","2h46","2h45","2h45","2h45","2h44","2h44","2h44","2h44","2h44","2h45","2h45","2h45","2h46","2h46","2h47","2h48","2h49","2h49"],["2h50","2h51","2h53","2h54","2h55","2h56","2h58","2h59","3h01","3h02","3h04","3h05","3h07","3h09","3h10","3h12","3h14","3h16","3h17","3h19","3h21","3h23","3h25","3h27","3h29","3h31","3h33","3h35","3h37","3h39","3h40"],["3h42","3h44","3h46","3h48","3h50","3h52","3h54","3h56","3h58","4h00","4h02","4h04","4h05","4h07","4h09","4h11","4h13","4h15","4h16","4h18","4h20","4h22","4h23","4h25","4h27","4h29","4h30","4h32","4h34","4h35","4h37"],["4h39","4h40","4h42","4h43","4h45","4h47","4h48","4h50","4h51","4h53","4h54","4h56","4h57","4h59","5h00","5h01","5h03","5h04","5h06","5h07","5h09","5h10","5h11","5h13","5h14","5h15","5h17","5h18","5h19","5h21"],["5h22","5h23","5h25","5h26","5h27","5h29","5h30","5h31","5h32","5h34","5h35","5h36","5h37","5h39","5h40","5h41","5h43","5h44","5h45","5h46","5h48","5h49","5h50","5h51","5h52","5h54","5h55","5h56","5h57","5h59","6h00"],["6h01","6h02","6h03","6h05","6h06","6h07","6h08","6h09","6h11","6h12","6h13","6h14","6h15","6h16","6h18","6h19","6h20","6h21","6h22","6h23","6h24","6h26","6h27","6h28","6h29","6h30","6h31","6h32","6h33","6h34"],["6h35","6h36","6h37","6h38","6h39","6h40","6h41","6h41","6h42","6h43","6h44","6h45","6h45","6h46","6h47","6h48","6h48","6h49","6h49","6h49","6h51","6h51","6h52","6h52","6h52","6h53","6h53","6h53","6h54","6h54","6h54"]] },
    { city: "clermont_ferrand", latitude: 45.785649299085584, longitude: 3.1155454290268803, times: [["6h41","6h41","6h41","6h41","6h41","6h41","6h41","6h41","6h41","6h41","6h41","6h41","6h40","6h40","6h40","6h39","6h39","6h38","6h38","6h37","6h37","6h36","6h35","6h35","6h34","6h33","6h32","6h32","6h31","6h30","6h29"],["6h28","6h27","6h26","6h25","6h24","6h22","6h21","6h20","6h19","6h18","6h16","6h15","6h14","6h12","6h11","6h09","6h08","6h06","6h05","6h03","6h02","6h00","5h59","5h57","5h56","5h54","5h52","5h51","5h50"],["5h49","5h47","5h45","5h44","5h42","5h40","5h38","5h36","5h34","5h33","5h31","5h29","5h27","5h25","5h23","5h21","5h19","5h17","5h15","5h13","5h11","5h09","5h07","5h04","5h02","5h00","4h58","4h56","4h54","4h52","4h50"],["4h47","4h45","4h43","4h41","4h39","4h36","4h34","4h32","4h30","4h27","4h25","4h23","4h21","4h19","4h16","4h14","4h12","4h10","4h07","4h05","4h03","4h01","3h58","3h56","3h54","3h52","3h49","3h47","3h45","3h43"],["3h40","3h38","3h36","3h34","3h32","3h29","3h27","3h25","3h23","3h21","3h19","3h17","3h15","3h13","3h11","3h09","3h07","3h05","3h03","3h01","2h59","2h57","2h55","2h53","2h52","2h50","2h48","2h47","2h45","2h44","2h42"],["2h41","2h39","2h38","2h37","2h36","2h34","2h33","2h32","2h31","2h31","2h30","2h29","2h29","2h28","2h28","2h27","2h27","2h27","2h27","2h27","2h27","2h27","2h28","2h28","2h28","2h29","2h30","2h30","2h31","2h32"],["2h33","2h34","2h35","2h37","2h38","2h39","2h41","2h42","2h44","2h45","2h47","2h48","2h50","2h52","2h53","2h55","2h57","2h59","3h01","3h03","3h05","3h07","3h08","3h10","3h12","3h14","3h16","3h18","3h20","3h22","3h24"],["3h26","3h28","3h30","3h32","3h34","3h36","3h38","3h40","3h42","3h44","3h46","3h48","3h50","3h51","3h53","3h55","3h57","3h59","4h01","4h02","4h04","4h06","4h08","4h10","4h11","4h13","4h15","4h16","4h18","4h20","4h21"],["4h23","4h25","4h26","4h28","4h30","4h31","4h33","4h34","4h36","4h37","4h39","4h40","4h42","4h43","4h45","4h46","4h48","4h49","4h51","4h52","4h53","4h55","4h56","4h58","4h59","5h00","5h02","5h03","5h04","5h06"],["5h07","5h08","5h10","5h11","5h12","5h14","5h15","5h16","5h17","5h19","5h20","5h21","5h23","5h24","5h25","5h26","5h28","5h29","5h30","5h31","5h33","5h34","5h35","5h36","5h38","5h39","5h40","5h41","5h43","5h44","5h45"],["5h46","5h48","5h49","5h50","5h51","5h53","5h54","5h55","5h56","5h58","5h59","6h00","6h01","6h03","6h04","6h05","6h06","6h07","6h08","6h10","6h11","6h12","6h13","6h14","6h15","6h16","6h17","6h18","6h19","6h21"],["6h22","6h23","6h24","6h24","6h25","6h26","6h27","6h28","6h29","6h30","6h31","6h31","6h32","6h33","6h34","6h34","6h35","6h36","6h36","6h37","6h37","6h38","6h38","6h39","6h39","6h40","6h40","6h40","6h41","6h41","6h41"]] },
    { city: "lille", latitude: 50.631718316778176, longitude: 3.0478327231208246, times: [["6h49","6h49","6h49","6h49","6h49","6h49","6h49","6h48","6h48","6h48","6h48","6h47","6h47","6h46","6h46","6h45","6h45","6h44","6h43","6h43","6h42","6h41","6h40","6h39","6h38","6h37","6h36","6h35","6h34","6h33","6h32"],["6h31","6h30","6h28","6h27","6h26","6h24","6h23","6h21","6h20","6h18","6h17","6h15","6h14","6h12","6h11","6h09","6h08","6h07","6h05","6h04","6h02","6h00","5h59","5h57","5h56","5h54","5h52","5h51","5h50"],["5h49","5h47","5h45","5h44","5h42","5h40","5h38","5h36","5h34","5h33","5h31","5h29","5h27","5h25","5h23","5h21","5h19","5h17","5h15","5h13","5h11","5h09","5h07","5h05","5h02","5h00","4h58","4h56","4h54","4h52","4h50"],["4h47","4h45","4h43","4h41","4h39","4h36","4h34","4h32","4h30","4h28","4h25","4h23","4h21","4h19","4h16","4h14","4h12","4h10","4h07","4h05","4h03","4h01","3h58","3h56","3h54","3h52","3h49","3h47","3h45","3h43"],["3h40","3h38","3h36","3h34","3h32","3h29","3h27","3h25","3h23","3h21","3h19","3h17","3h15","3h13","3h11","3h09","3h07","3h05","3h03","3h01","2h59","2h57","2h55","2h53","2h52","2h50","2h49","2h47","2h45","2h44","2h42"],["2h41","2h39","2h38","2h37","2h36","2h34","2h33","2h32","2h32","2h31","2h30","2h29","2h29","2h28","2h28","2h27","2h27","2h27","2h27","2h27","2h27","2h27","2h28","2h28","2h28","2h29","2h30","2h30","2h31","2h32"],["2h33","2h34","2h35","2h37","2h38","2h39","2h41","2h42","2h44","2h45","2h47","2h48","2h50","2h52","2h54","2h55","2h57","2h59","3h01","3h03","3h05","3h07","3h08","3h10","3h12","3h14","3h16","3h18","3h20","3h22","3h24"],["3h26","3h28","3h30","3h32","3h34","3h36","3h38","3h40","3h42","3h44","3h46","3h48","3h50","3h51","3h53","3h55","3h57","3h59","4h01","4h02","4h04","4h06","4h08","4h10","4h11","4h13","4h15","4h16","4h18","4h20","4h21"],["4h23","4h25","4h26","4h28","4h30","4h31","4h33","4h34","4h36","4h37","4h39","4h40","4h42","4h43","4h45","4h46","4h48","4h49","4h51","4h52","4h53","4h55","4h56","4h58","4h59","5h00","5h02","5h03","5h04","5h06"],["5h07","5h08","5h10","5h11","5h12","5h14","5h15","5h16","5h17","5h19","5h20","5h21","5h23","5h24","5h25","5h26","5h28","5h29","5h30","5h31","5h33","5h34","5h35","5h36","5h38","5h39","5h40","5h41","5h43","5h44","5h46"],["5h47","5h49","5h50","5h52","5h53","5h55","5h56","5h58","5h59","6h01","6h02","6h03","6h05","6h06","6h08","6h09","6h11","6h12","6h13","6h15","6h16","6h17","6h19","6h20","6h21","6h22","6h24","6h25","6h26","6h27"],["6h28","6h29","6h30","6h32","6h33","6h34","6h35","6h36","6h37","6h37","6h38","6h39","6h40","6h41","6h42","6h42","6h43","6h44","6h44","6h45","6h45","6h46","6h46","6h47","6h47","6h48","6h48","6h48","6h48","6h49","6h49"]] },
    { city: "lyon", latitude: 45.7699284396584, longitude: 4.829224649781766, times: [["6h34","6h34","6h34","6h36","6h34","6h34","6h34","6h34","6h34","6h34","6h33","6h33","6h33","6h33","6h32","6h32","6h31","6h31","6h30","6h30","6h29","6h29","6h28","6h27","6h27","6h26","6h25","6h24","6h23","6h22","6h21"],["6h20","6h19","6h18","6h17","6h16","6h15","6h14","6h13","6h11","6h10","6h09","6h08","6h06","6h05","6h03","6h02","6h01","5h59","5h58","5h56","5h55","5h53","5h52","5h50","5h48","5h47","5h45","5h43","5h43"],["5h42","5h40","5h38","5h36","5h34","5h33","5h31","5h29","5h27","5h25","5h23","5h21","5h19","5h18","5h16","5h14","5h12","5h10","5h07","5h05","5h03","5h01","4h59","4h57","4h55","4h53","4h51","4h49","3h47","4h44","4h42"],["4h40","4h38","4h36","4h33","4h31","4h29","4h27","4h25","4h22","4h20","4h18","4h16","4h13","4h11","4h09","4h07","4h04","4h02","4h00","3h58","3h55","3h53","3h51","3h49","3h46","3h44","3h42","3h40","3h38","3h35"],["3h33","3h31","3h29","3h26","3h24","3h22","3h20","3h18","3h16","3h14","3h11","3h09","3h07","3h05","3h03","3h01","2h59","2h57","2h55","2h53","2h52","2h50","2h48","2h46","2h44","2h43","2h41","2h39","2h38","2h36","2h35"],["2h33","2h32","2h31","2h29","2h28","2h27","2h26","2h25","2h24","2h23","2h23","2h22","2h21","2h21","2h20","2h20","2h20","2h20","2h20","2h20","2h20","2h20","2h20","2h21","2h21","2h22","2h22","2h23","2h24","2h25"],["2h26","2h27","2h28","2h29","2h31","2h32","2h33","2h35","2h36","2h38","2h39","2h41","2h43","2h44","2h46","2h48","2h50","2h52","2h53","2h55","2h57","2h59","3h01","3h03","3h05","3h07","3h09","3h11","3h13","3h15","3h17"],["3h19","3h21","3h23","3h25","3h27","3h29","3h31","3h33","3h35","3h36","3h38","3h40","3h42","3h44","3h46","3h48","3h50","3h51","3h53","3h55","3h57","3h59","4h00","4h02","4h04","4h06","4h07","4h09","4h11","4h12","4h14"],["4h16","4h17","4h19","4h21","4h22","4h24","4h25","4h27","4h28","4h30","4h31","4h33","4h34","4h36","4h37","4h39","4h40","4h42","4h43","4h45","4h46","4h47","4h49","4h50","4h52","4h53","4h54","4h56","4h57","4h58"],["5h00","5h01","5h02","5h04","5h05","5h06","5h08","5h09","5h10","5h11","5h13","5h14","5h15","5h17","5h18","5h17","5h18","5h20","5h22","5h23","5h24","5h25","5h27","5h28","5h29","5h30","5h32","5h33","5h35","5h37","5h38"],["5h39","5h40","5h42","5h43","5h44","5h45","5h47","5h48","5h49","5h50","5h52","5h53","5h54","5h55","5h56","5h58","5h59","6h00","6h01","6h02","6h03","6h04","6h06","6h07","6h08","6h09","6h10","6h11","6h12","6h13"],["6h14","6h15","6h12","6h17","6h18","6h19","6h20","6h21","6h22","6h22","6h23","6h24","6h25","6h26","6h26","6h27","6h28","6h28","6h29","6h29","6h30","6h30","6h31","6h31","6h32","6h32","6h33","6h33","6h33","6h33","6h34"]] },
    { city: "marseille", latitude: 43.29990094363675, longitude: 5.382278697952184, times: [["6h28","6h29","6h29","6h29","6h29","6h29","6h29","6h29","6h29","6h29","6h28","6h28","6h28","6h28","6h27","6h27","6h27","6h26","6h26","6h25","6h25","6h24","6h24","6h23","6h23","6h22","6h21","6h20","6h20","6h16","6h18"],["6h17","6h16","6h15","6h14","6h13","6h12","6h11","6h10","6h09","6h08","6h07","6h05","6h04","6h03","6h02","6h00","5h59","5h58","5h56","5h55","5h53","5h52","5h50","5h49","5h47","5h46","5h44","5h43","5h43"],["5h41","5h39","5h38","5h36","5h34","5h33","5h31","5h29","5h27","5h25","5h24","5h22","5h20","5h18","5h16","5h14","5h13","5h11","5h09","5h07","5h05","5h03","5h01","4h59","4h57","4h55","4h53","4h51","4h49","4h47","4h45"],["4h43","4h41","4h39","4h37","4h35","4h32","4h30","4h28","4h26","4h24","4h22","4h20","4h18","4h16","4h14","4h12","4h09","4h07","4h05","4h03","4h01","3h59","3h57","3h55","3h53","3h51","3h49","3h47","3h45","3h43"],["3h41","3h39","3h37","3h35","3h33","3h31","3h29","3h27","3h25","3h23","3h21","3h19","3h17","3h15","3h14","3h12","3h10","3h08","3h07","3h05","3h03","3h02","3h00","2h59","2h57","2h56","2h54","2h53","2h52","2h51","2h49"],["2h48","2h47","2h46","2h45","2h44","2h43","2h42","2h41","2h41","2h40","2h40","2h39","2h39","2h38","2h38","2h38","2h37","2h37","2h37","2h37","2h38","2h38","2h38","2h38","2h39","2h39","2h40","2h41","2h41","2h42"],["2h43","2h44","2h45","2h46","2h47","2h48","2h49","2h50","2h52","2h53","2h54","2h56","2h57","2h59","3h00","3h02","3h03","3h05","3h06","3h08","3h10","3h11","3h13","3h15","3h16","3h18","3h20","3h22","3h23","3h25","3h27"],["3h29","3h30","3h32","3h34","3h36","3h37","3h39","3h41","3h43","3h44","3h46","3h48","3h49","3h51","3h53","3h55","3h56","3h58","4h00","4h01","4h03","4h04","4h06","4h08","4h09","4h11","4h12","4h14","4h15","4h17","4h18"],["4h20","4h21","4h23","4h24","4h26","4h27","4h29","4h30","4h32","4h33","4h34","4h36","4h37","4h38","4h40","4h41","4h42","4h44","4h45","4h46","4h48","4h49","4h50","4h51","4h53","4h54","4h55","4h57","4h58","4h59"],["5h00","5h01","5h03","5h04","5h05","5h06","5h07","5h09","5h10","5h11","5h12","5h13","5h15","5h16","5h17","5h18","5h19","5h20","5h22","5h23","5h24","5h25","5h26","5h27","5h29","5h30","5h31","5h32","5h33","5h34","5h36"],["5h37","5h38","5h39","5h40","5h41","5h42","5h44","5h45","5h46","5h47","5h48","5h49","5h50","5h51","5h52","5h54","5h55","5h56","5h57","5h58","5h59","6h00","6h01","6h02","6h03","6h04","6h05","6h06","6h07","6h08"],["6h09","6h10","6h11","6h12","6h13","6h14","6h15","6h15","6h16","6h17","6h18","6h19","6h19","6h20","6h21","6h21","6h22","6h23","6h23","6h24","6h24","6h25","6h25","6h26","6h26","6h27","6h27","6h27","6h28","6h28","6h28"]] },
    { city: "metz", latitude: 49.10811332792492, longitude: 6.19552454210356, times: [["6h34","6h34","6h34","6h34","6h34","6h34","6h34","6h34","6h33","6h33","6h33","6h33","6h32","6h32","6h31","6h31","6h30","6h30","6h29","6h28","6h28","6h27","6h26","6h25","6h25","6h24","6h23","6h22","6h21","6h20","6h19"],["6h18","6h16","6h15","6h13","6h12","6h10","6h09","6h07","6h06","6h04","6h03","6h01","6h00","5h58","5h57","5h55","5h54","5h52","5h51","5h49","5h48","5h46","5h45","5h43","5h42","5h40","5h39","5h37","5h36"],["5h36","5h35","5h33","5h31","5h29","5h28","5h26","5h24","5h22","5h20","5h18","5h16","5h14","5h12","5h10","5h08","5h06","5h04","5h02","5h00","4h58","4h56","4h54","4h52","4h50","4h48","4h46","4h44","4h41","4h39","4h37"],["4h35","4h33","4h31","4h28","4h26","4h24","4h22","4h20","4h17","4h15","4h13","4h11","4h08","4h06","4h04","4h02","3h59","3h57","3h55","3h53","3h50","3h48","3h46","3h44","3h41","3h39","3h37","3h35","3h32","3h30"],["3h28","3h26","3h24","3h21","3h19","3h17","3h15","3h13","3h11","3h08","3h06","3h04","3h02","3h00","2h58","2h56","2h54","2h52","2h50","2h48","2h46","2h45","2h43","2h41","2h39","2h38","2h36","2h34","2h33","2h31","2h30"],["2h28","2h27","2h26","2h24","2h23","2h22","2h21","2h20","2h19","2h18","2h17","2h17","2h16","2h16","2h15","2h15","2h14","2h14","2h14","2h14","2h15","2h15","2h15","2h15","2h16","2h17","2h17","2h18","2h19","2h20"],["2h21","2h22","2h23","2h24","2h25","2h27","2h28","2h30","2h31","2h33","2h34","2h36","2h38","2h39","2h41","2h43","2h45","2h46","2h48","2h50","2h52","2h54","2h56","2h58","3h00","3h02","3h04","3h06","3h08","3h10","3h12"],["3h14","3h16","3h18","3h20","3h22","3h24","3h26","3h27","3h29","3h31","3h33","3h35","3h37","3h39","3h41","3h43","3h45","3h46","3h48","3h50","3h52","3h54","3h55","3h57","3h59","4h01","4h02","4h04","4h06","4h07","4h09"],["4h11","4h12","4h14","4h15","4h17","4h19","4h20","4h22","4h23","4h25","4h26","4h28","4h29","4h31","4h32","4h34","4h35","4h37","4h38","4h39","4h41","4h42","4h44","4h45","4h46","4h48","4h49","4h51","4h52","4h53"],["4h55","4h56","4h57","4h59","5h00","5h01","5h02","5h04","5h05","5h06","5h08","5h09","5h10","5h11","5h13","5h14","5h15","5h16","5h18","5h19","5h20","5h21","5h23","5h24","5h25","5h26","5h28","5h29","5h30","5h32","5h33"],["5h35","5h36","5h37","5h39","5h40","5h42","5h43","5h44","5h46","5h47","5h49","5h50","5h51","5h53","5h54","5h55","5h57","5h58","5h59","6h01","6h02","6h03","6h04","6h06","6h07","6h08","6h09","6h10","6h11","6h13"],["6h14","6h15","6h16","6h17","6h18","6h19","6h20","6h21","6h22","6h23","6h23","6h24","6h25","6h26","6h27","6h27","6h28","6h29","6h29","6h30","6h30","6h31","6h31","6h32","6h32","6h33","6h33","6h33","6h33","6h34","6h34"]] },
    { city: "mulhouse", latitude: 47.749163302979674, longitude: 7.325700475094066, times: [["6h27","6h27","6h27","6h27","6h27","6h27","6h27","6h27","6h27","6h27","6h27","6h26","6h26","6h26","6h25","6h25","6h24","6h24","6h23","6h22","6h22","6h21","6h20","6h20","6h19","6h18","6h17","6h16","6h15","6h14","6h13"],["6h12","6h11","6h10","6h09","6h08","6h06","6h05","6h04","6h02","6h01","6h00","5h58","5h57","5h55","5h54","5h52","5h51","5h50","5h48","5h47","5h45","5h44","5h42","5h40","5h39","5h37","5h35","5h34","5h33"],["5h32","5h30","5h28","5h27","5h25","5h23","5h21","5h19","5h18","5h16","5h14","5h12","5h10","5h08","5h06","5h04","5h02","5h00","4h58","4h56","4h54","4h52","4h50","4h48","4h48","4h45","4h43","4h41","4h39","4h35","4h33"],["4h30","4h28","4h26","4h24","4h22","4h19","4h17","4h15","4h13","4h11","4h08","4h06","4h04","4h02","3h59","3h57","3h55","3h53","3h50","3h48","3h46","3h44","3h41","3h39","3h37","3h35","3h32","3h30","3h28","3h26"],["3h23","3h21","3h19","3h17","3h15","3h13","3h10","3h08","3h06","3h04","3h02","3h00","2h58","2h56","2h54","2h52","2h50","2h48","2h46","2h44","2h42","2h40","2h38","2h37","2h35","2h33","2h31","2h30","2h28","2h27","2h25"],["2h24","2h22","2h21","2h20","2h19","2h18","2h16","2h15","2h15","2h14","2h13","2h12","2h12","2h11","2h11","2h10","2h10","2h10","2h10","2h10","2h10","2h10","2h11","2h11","2h12","2h12","2h13","2h13","2h14","2h15"],["2h16","2h17","2h18","2h20","2h21","2h22","2h24","2h25","2h27","2h28","2h30","2h31","2h33","2h35","2h37","2h38","2h40","2h42","2h44","2h46","2h48","2h50","2h51","2h53","2h55","2h57","2h59","3h01","3h03","3h05","3h07"],["3h09","3h11","3h13","3h15","3h17","3h19","3h21","3h23","3h25","3h27","3h29","3h31","3h33","3h34","3h36","3h38","3h40","3h42","3h44","3h45","3h47","3h49","3h51","3h53","3h54","3h56","3h58","3h59","4h01","4h03","4h05"],["4h06","4h08","4h09","4h11","4h13","4h14","4h16","4h17","4h19","4h20","4h22","4h23","4h25","4h26","4h28","4h29","4h31","4h32","4h34","4h35","4h36","4h38","4h39","4h41","4h42","4h43","4h45","4h46","4h47","4h49"],["4h50","4h51","4h53","4h54","4h55","4h57","4h58","4h59","5h01","5h02","5h03","5h04","5h06","5h07","5h08","5h09","5h11","5h12","5h13","5h14","5h16","5h17","5h18","5h19","5h21","5h22","5h23","5h24","5h26","5h27","5h29"],["5h30","5h31","5h33","5h34","5h35","5h37","5h38","5h39","5h41","5h42","5h43","5h45","5h46","5h47","5h48","5h50","5h51","5h52","5h53","5h55","5h56","5h57","5h58","5h59","6h01","6h02","6h03","6h04","6h05","6h06"],["6h07","6h08","6h09","6h10","6h11","6h12","6h13","6h14","6h15","6h16","6h17","6h18","6h18","6h19","6h20","6h21","6h21","6h22","6h22","6h23","6h24","6h24","6h25","6h25","6h25","6h26","6h26","6h26","6h27","6h27","6h27"]] },
    { city: "orleans", latitude: 47.882863421380264, longitude: 1.9161035747737603, times: [["6h49","6h49","6h49","6h49","6h49","6h49","6h49","6h49","6h49","6h49","6h48","6h48","6h48","6h47","6h47","6h46","6h46","6h45","6h45","6h44","6h44","6h43","6h42","6h41","6h41","6h40","6h39","6h38","6h37","6h36","6h35"],["6h34","6h32","6h31","6h29","6h28","6h27","6h25","6h24","6h22","6h21","6h19","6h18","6h17","6h15","6h14","6h12","6h11","6h10","6h08","6h07","6h05","6h04","6h02","6h01","6h00","5h58","5h57","5h55","5h55"],["5h54","5h52","5h50","5h48","5h46","5h45","5h43","5h41","5h39","5h37","5h35","5h33","5h31","5h29","5h27","5h25","5h23","5h21","5h19","5h17","5h15","5h13","5h11","5h09","5h07","5h05","5h03","5h01","4h58","4h56","4h54"],["4h52","4h50","4h48","4h45","4h43","4h41","4h39","4h37","4h34","4h32","4h30","4h28","4h25","4h23","4h21","4h19","4h16","4h14","4h12","4h10","4h07","4h05","4h03","4h01","3h58","3h56","3h54","3h52","3h49","3h47"],["3h45","3h43","3h41","3h38","3h36","3h34","3h32","3h30","3h28","3h25","3h23","3h21","3h19","3h17","3h15","3h13","3h11","3h09","3h07","3h05","3h03","3h02","3h00","2h58","2h56","2h55","2h53","2h51","2h50","2h48","2h47"],["2h45","2h44","2h43","2h41","2h40","2h39","2h38","2h37","2h36","2h35","2h35","2h34","2h33","2h33","2h32","2h32","2h32","2h32","2h32","2h32","2h32","2h32","2h32","2h33","2h33","2h34","2h34","2h35","2h36","2h37"],["2h38","2h39","2h40","2h41","2h42","2h44","2h45","2h47","2h48","2h50","2h51","2h53","2h55","2h56","2h58","3h00","3h02","3h04","3h05","3h07","3h09","3h11","3h13","3h15","3h17","3h19","3h21","3h23","3h25","3h27","3h29"],["3h31","3h33","3h35","3h37","3h39","3h41","3h43","3h45","3h47","3h48","3h50","3h52","3h54","3h56","3h58","4h00","4h02","4h03","4h05","4h07","4h09","4h11","4h12","4h14","4h16","4h18","4h19","4h21","4h23","4h24","4h26"],["4h28","4h29","4h31","4h33","4h34","4h36","4h37","4h39","4h40","4h42","4h43","4h45","4h46","4h48","4h49","4h51","4h52","4h54","4h55","4h57","4h58","4h59","5h01","5h02","5h04","5h05","5h06","5h08","5h09","5h10"],["5h12","5h13","5h14","5h16","5h17","5h18","5h20","5h21","5h22","5h23","5h25","5h26","5h27","5h28","5h30","5h31","5h32","5h34","5h35","5h36","5h37","5h39","5h40","5h41","5h42","5h44","5h45","5h46","5h47","5h49","5h50"],["5h52","5h53","5h54","5h56","5h57","5h58","6h00","6h01","6h02","6h04","6h05","6h06","6h08","6h09","6h10","6h11","6h13","6h14","6h15","6h16","6h18","6h19","6h20","6h21","6h22","6h24","6h25","6h26","6h27","6h28"],["6h29","6h30","6h31","6h32","6h33","6h34","6h35","6h36","6h37","6h38","6h39","6h39","6h40","6h41","6h42","6h42","6h43","6h44","6h44","6h45","6h45","6h46","6h46","6h47","6h47","6h48","6h48","6h48","6h49","6h49","6h49"]] },
    { city: "paris", latitude: 48.8626304851685, longitude: 2.3362934465505396, times: [["6h49","6h49","6h49","6h49","6h49","6h49","6h49","6h49","6h49","6h48","6h48","6h48","6h47","6h47","6h46","6h46","6h45","6h45","6h44","6h44","6h43","6h42","6h41","6h41","6h40","6h39","6h38","6h37","6h36","6h35","6h34"],["6h33","6h32","6h30","6h29","6h28","6h27","6h25","6h24","6h23","6h21","6h20","6h18","6h17","6h15","6h14","6h12","6h11","6h09","6h08","6h06","6h05","6h03","6h02","6h00","5h59","5h57","5h55","5h54","5h53"],["5h52","5h50","5h48","5h47","5h45","5h43","5h41","5h39","5h37","5h36","5h34","5h32","5h30","5h28","5h26","5h24","5h22","5h20","5h18","5h16","5h14","5h12","5h10","5h07","5h05","5h03","5h01","4h59","4h57","4h55","4h53"],["4h50","4h48","4h46","4h44","4h42","4h39","4h37","4h35","4h33","4h30","4h28","4h26","4h24","4h22","4h19","4h17","4h15","4h13","4h10","4h08","4h06","4h04","4h01","3h59","3h57","3h55","3h52","3h50","3h48","3h46"],["3h43","3h41","3h39","3h37","3h35","3h32","3h30","3h28","3h26","3h24","3h22","3h20","3h18","3h16","3h14","3h12","3h10","3h08","3h06","3h04","3h02","3h00","2h58","2h56","2h55","2h53","2h51","2h50","2h48","2h47","2h45"],["2h44","2h42","2h41","2h40","2h39","2h37","2h36","2h35","2h34","2h34","2h33","2h32","2h31","2h31","2h30","2h30","2h30","2h30","2h30","2h30","2h30","2h30","2h31","2h31","2h31","2h32","2h33","2h33","2h34","2h35"],["2h36","2h37","2h38","2h40","2h41","2h42","2h44","2h45","2h47","2h48","2h50","2h51","2h53","2h55","2h56","2h58","3h00","3h02","3h04","3h06","3h08","3h10","3h11","3h13","3h15","3h17","3h19","3h21","3h23","3h25","3h27"],["3h29","3h31","3h33","3h35","3h37","3h39","3h41","3h43","3h45","3h47","3h49","3h51","3h53","3h54","3h56","3h58","4h00","4h02","4h04","4h05","4h07","4h09","4h11","4h13","4h14","4h16","4h18","4h19","4h21","4h23","4h24"],["4h26","4h28","4h29","4h31","4h33","4h34","4h36","4h37","4h39","4h40","4h42","4h43","4h45","4h46","4h48","4h49","4h51","4h52","4h54","4h55","4h56","4h58","4h59","5h01","5h02","5h03","5h05","5h06","5h07","5h09"],["5h10","5h12","5h13","5h14","5h15","5h17","5h18","5h19","5h20","5h22","5h23","5h24","5h26","5h27","5h28","5h29","5h31","5h32","5h33","5h34","5h36","5h37","5h38","5h39","5h41","5h42","5h43","5h44","5h46","5h47","5h49"],["5h50","5h51","5h53","5h54","5h56","5h57","5h58","6h00","6h01","6h03","6h04","6h05","6h07","6h08","6h09","6h11","6h12","6h13","6h14","6h16","6h17","6h18","6h19","6h21","6h22","6h23","6h24","6h25","6h27","6h28"],["6h29","6h30","6h31","6h32","6h33","6h34","6h35","6h36","6h37","6h38","6h38","6h39","6h40","6h41","6h42","6h42","6h43","6h44","6h44","6h45","6h45","6h46","6h46","6h47","6h47","6h48","6h48","6h48","6h48","6h49","6h49"]] },
    { city: "poitiers", latitude: 46.583920772572576, longitude: 0.35994765300316445, times: [["6h54","6h54","6h54","6h54","6h54","6h54","6h54","6h54","6h53","6h53","6h53","6h53","6h52","6h52","6h52","6h51","6h51","6h50","6h50","6h49","6h49","6h48","6h47","6h46","6h46","6h45","6h44","6h43","6h42","6h41","6h40"],["6h39","6h38","6h37","6h36","6h35","6h34","6h33","6h31","6h30","6h29","6h27","6h26","6h25","6h23","6h22","6h20","6h19","6h18","6h16","6h15","6h13","6h11","6h10","6h08","6h07","6h05","6h03","6h02","6h01"],["6h00","5h58","5h56","5h55","5h53","5h51","5h49","5h47","5h45","5h44","5h42","5h40","5h38","5h36","5h34","5h32","5h30","5h28","5h26","5h24","5h22","5h20","5h18","5h16","5h13","5h11","5h09","5h07","5h05","5h03","5h01"],["4h58","4h56","4h54","4h52","4h50","4h47","4h45","4h43","4h41","4h39","4h36","4h34","4h32","4h30","4h27","4h25","4h23","4h21","4h18","4h16","4h14","4h12","4h09","4h07","4h05","4h03","4h00","3h58","3h56","3h54"],["3h51","3h49","3h47","3h45","3h43","3h40","3h38","3h36","3h34","3h32","3h30","3h28","3h26","3h24","3h22","3h20","3h18","3h16","3h14","3h12","3h10","3h08","3h06","3h04","3h03","3h01","2h59","2h58","2h56","2h55","2h53"],["2h52","2h50","2h49","2h48","2h47","2h45","2h44","2h43","2h43","2h42","2h41","2h40","2h40","2h39","2h39","2h38","2h38","2h38","2h38","2h38","2h38","2h38","2h39","2h39","2h40","2h40","2h41","2h42","2h42","2h43"],["2h44","2h45","2h46","2h48","2h49","2h50","2h52","2h53","2h55","2h56","2h58","2h59","3h01","3h03","3h05","3h06","3h08","3h10","3h12","3h14","3h16","3h18","3h20","3h21","3h23","3h25","3h27","3h29","3h31","3h33","3h35"],["3h37","3h39","3h41","3h43","3h45","3h47","3h49","3h51","3h53","3h55","3h57","3h59","4h01","4h02","4h04","4h06","4h08","4h10","4h12","4h14","4h15","4h17","4h19","4h21","4h22","4h24","4h26","4h28","4h29","4h31","4h33"],["4h34","4h36","4h37","4h39","4h41","4h42","4h44","4h45","4h47","4h48","4h50","4h51","4h53","4h54","4h56","4h57","4h59","5h00","5h02","5h03","5h04","5h06","5h07","5h09","5h10","5h11","5h13","5h14","5h15","5h17"],["5h18","5h19","5h21","5h22","5h23","5h25","5h26","5h27","5h29","5h30","5h31","5h32","5h34","5h35","5h36","5h37","5h39","5h40","5h41","5h43","5h44","5h45","5h46","5h48","5h50","5h51","5h53","5h54","5h55","5h56","5h56"],["5h58","5h59","6h00","6h02","6h03","6h04","6h05","6h07","6h08","6h09","6h10","6h12","6h13","6h14","6h15","6h17","6h18","6h19","6h20","6h21","6h23","6h24","6h25","6h26","6h27","6h28","6h29","6h31","6h32","6h33"],["6h34","6h35","6h36","6h37","6h38","6h39","6h39","6h40","6h41","6h42","6h43","6h44","6h45","6h45","6h46","6h47","6h47","6h48","6h49","6h49","6h50","6h50","6h51","6h51","6h52","6h52","6h52","6h53","6h53","6h53","6h53"]] },
    { city: "rouen", latitude: 49.44134601033831, longitude: 1.0925678427798247, times: [["6h55","6h55","6h55","6h55","6h55","6h55","6h55","6h55","6h54","6h54","6h54","6h53","6h53","6h53","6h52","6h52","6h51","6h50","6h50","6h49","6h48","6h48","6h47","6h46","6h45","6h44","6h43","6h42","6h41","6h40","6h39"],["6h38","6h37","6h36","6h34","6h33","6h32","6h30","6h29","6h28","6h26","6h25","6h23","6h22","6h20","6h19","6h17","6h16","6h14","6h13","6h11","6h10","6h08","6h07","6h05","6h04","6h02","6h00","5h59","5h58"],["5h57","5h55","5h53","5h52","5h50","5h48","5h46","5h44","5h42","5h40","5h39","5h37","5h35","5h33","5h31","5h29","5h27","5h25","5h23","5h21","5h19","5h17","5h15","5h12","5h10","5h08","5h06","5h04","5h02","5h00","4h57"],["4h55","4h53","4h51","4h49","4h47","4h44","4h42","4h40","4h38","4h35","4h33","4h31","4h29","4h26","4h24","4h22","4h20","4h17","4h15","4h13","4h11","4h08","4h06","4h04","4h02","3h59","3h57","3h55","3h53","3h51"],["3h48","3h46","3h44","3h42","3h40","3h37","3h35","3h33","3h31","3h29","3h27","3h25","3h23","3h21","3h18","3h16","3h14","3h13","3h11","3h09","3h07","3h05","3h03","3h01","3h00","2h58","2h56","2h55","2h53","2h52","2h50"],["2h49","2h47","2h46","2h45","2h43","2h42","2h41","2h40","2h39","2h39","2h38","2h37","2h37","2h36","2h36","2h35","2h35","2h35","2h35","2h35","2h35","2h35","2h36","2h36","2h36","2h37","2h38","2h38","2h39","2h40"],["2h41","2h42","2h43","2h45","2h46","2h47","2h49","2h50","2h51","2h53","2h55","2h56","2h58","3h00","3h01","3h03","3h05","3h07","3h09","3h11","3h13","3h14","3h16","3h18","3h20","3h22","3h24","3h26","3h28","3h30","3h32"],["3h34","3h36","3h38","3h40","3h42","3h44","3h46","3h48","3h50","3h52","3h54","3h56","3h57","3h59","4h01","4h03","4h05","4h07","4h09","4h10","4h12","4h14","4h16","4h18","4h19","4h21","4h23","4h24","4h26","4h28","4h29"],["4h31","4h33","4h34","4h36","4h37","4h39","4h41","4h42","4h44","4h45","4h47","4h48","4h50","4h51","4h53","4h54","4h56","4h57","4h58","5h00","5h01","5h03","5h04","5h05","5h07","5h08","5h10","5h11","5h12","5h14"],["5h15","5h16","5h18","5h19","5h20","5h22","5h23","5h24","5h25","5h27","5h28","5h29","5h31","5h32","5h33","5h34","5h36","5h37","5h38","5h39","5h41","5h42","5h43","5h44","5h46","5h47","5h48","5h49","5h51","5h52","5h54"],["5h55","5h57","5h58","5h59","6h01","6h02","6h04","6h05","6h06","6h08","6h09","6h11","6h12","6h13","6h15","6h16","6h17","6h19","6h20","6h21","6h23","6h24","6h25","6h26","6h27","6h29","6h30","6h31","6h32","6h33"],["6h34","6h36","6h37","6h38","6h39","6h40","6h41","6h42","6h43","6h43","6h44","6h45","6h46","6h47","6h47","6h48","6h49","6h50","6h50","6h51","6h51","6h52","6h52","6h53","6h53","6h53","6h54","6h54","6h54","6h55","6h55"]] },
    { city: "strasbourg", latitude: 48.571267984911756, longitude: 7.767526795169564, times: [["6h27","6h27","6h27","6h27","6h27","6h27","6h27","6h27","6h26","6h26","6h26","6h26","6h25","6h25","6h24","6h24","6h23","6h23","6h22","6h22","6h21","6h20","6h19","6h19","6h18","6h17","6h16","6h15","6h14","6h13","6h12"],["6h11","6h10","6h09","6h07","6h06","6h05","6h04","6h02","6h01","5h59","5h58","5h57","5h55","5h54","5h52","5h51","5h49","5h48","5h46","5h45","5h43","5h42","5h40","5h39","5h37","5h35","5h34","5h32","5h31"],["5h30","5h28","5h27","5h25","5h23","5h21","5h19","5h18","5h16","5h14","5h12","5h10","5h08","5h06","5h04","5h02","5h00","4h58","4h56","4h54","4h52","4h50","4h48","4h46","4h44","4h42","4h39","4h37","4h35","4h33","4h31"],["4h29","4h27","4h24","4h22","4h20","4h18","4h16","4h13","4h11","4h09","4h07","4h04","4h02","4h00","3h58","3h55","3h53","3h51","3h49","3h46","3h44","3h42","3h40","3h37","3h35","3h33","3h31","3h28","3h26","3h24"],["3h22","3h20","3h17","3h15","3h13","3h11","3h09","3h06","3h04","3h02","3h00","2h58","2h56","2h54","2h52","2h50","2h48","2h46","2h44","2h42","2h40","2h38","2h37","2h35","2h33","2h31","2h30","2h28","2h26","2h25","2h23"],["2h22","2h21","2h19","2h18","2h17","2h16","2h15","2h14","2h13","2h12","2h11","2h11","2h10","2h09","2h09","2h09","2h08","2h08","2h08","2h08","2h08","2h09","2h09","2h09","2h10","2h10","2h11","2h12","2h13","2h13"],["2h14","2h16","2h17","2h18","2h19","2h20","2h22","2h23","2h25","2h26","2h28","2h30","2h31","2h33","2h35","2h37","2h38","2h40","2h42","2h44","2h46","2h48","2h50","2h52","2h54","2h56","2h58","3h00","3h02","3h04","3h06"],["3h07","3h09","3h11","3h13","3h15","3h17","3h19","3h21","3h23","3h25","3h27","3h29","3h31","3h33","3h35","3h36","3h38","3h40","3h42","3h44","3h46","3h47","3h49","3h51","3h53","3h54","3h56","3h58","3h59","4h01","4h03"],["4h04","4h06","4h08","4h09","4h11","4h12","4h14","4h16","4h17","4h19","4h20","4h22","4h23","4h25","4h26","4h27","4h29","4h30","4h32","4h33","4h35","4h36","4h37","4h39","4h40","4h42","4h43","4h44","4h46","4h47"],["4h48","4h50","4h51","4h52","4h54","4h55","4h56","4h57","4h59","5h00","5h01","5h03","5h04","5h05","5h06","5h08","5h09","5h10","5h11","5h13","5h14","5h15","5h16","5h18","5h20","5h21","5h23","5h24","5h26","5h27","5h27"],["5h28","5h30","5h31","5h32","5h34","5h35","5h37","5h38","5h49","5h41","5h42","5h43","5h45","5h46","5h47","5h49","5h50","5h51","5h52","5h54","5h55","5h56","5h57","5h59","6h00","6h01","6h02","6h03","6h04","6h06"],["6h07","6h08","6h09","6h10","6h11","6h12","6h13","6h14","6h15","6h16","6h17","6h18","6h19","6h19","6h20","6h21","6h21","6h22","6h23","6h23","6h24","6h24","6h25","6h25","6h25","6h26","6h26","6h26","6h26","6h27","6h27"]] },
    { city: "toulouse", latitude: 43.59638143032458, longitude: 1.4316729336369596, times: [["6h45","6h45","6h45","6h45","6h45","6h45","6h45","6h45","6h45","6h45","6h45","6h44","6h44","6h44","6h44","6h43","6h43","6h42","6h42","6h42","6h41","6h40","6h40","6h39","6h39","6h38","6h37","6h36","6h36","6h35","6h34"],["6h33","6h32","6h31","6h30","6h29","6h28","6h27","6h26","6h25","6h24","6h22","6h21","6h20","6h19","6h17","6h16","6h15","6h13","6h12","6h10","6h09","6h08","6h06","6h04","6h03","6h01","6h00","5h58","5h58"],["5h57","5h55","5h53","5h51","5h50","5h48","5h46","5h45","5h43","5h41","5h39","5h37","5h35","5h34","5h32","5h30","5h28","5h26","5h24","5h22","5h20","5h18","5h16","5h14","5h12","5h10","5h08","5h06","5h04","5h02","5h00"],["4h58","4h56","4h54","4h52","4h50","4h47","4h45","4h43","4h41","4h39","4h37","4h35","4h33","4h31","4h28","4h26","4h24","4h22","4h20","4h18","4h16","4h14","4h11","4h09","4h07","4h05","4h03","4h01","3h59","3h57"],["3h55","3h53","3h51","3h49","3h47","3h45","3h43","3h41","3h39","3h37","3h35","3h33","3h31","3h29","3h28","3h26","3h24","3h22","3h20","3h19","3h17","3h15","3h14","3h12","3h11","3h09","3h08","3h06","3h05","3h04","3h03"],["3h01","3h00","2h59","2h58","2h57","2h56","2h55","2h54","2h54","2h53","2h52","2h52","2h51","2h51","2h51","2h50","2h50","2h50","2h50","2h50","2h50","2h51","2h51","2h51","2h52","2h52","2h53","2h53","2h54","2h55"],["2h56","2h57","2h58","2h59","3h00","3h01","3h02","3h04","3h05","3h06","3h08","3h09","3h10","3h12","3h14","3h15","3h17","3h18","3h20","3h22","3h23","3h25","3h27","3h28","3h30","3h32","3h34","3h36","3h37","3h39","3h41"],["3h43","3h44","3h46","3h48","3h50","3h52","3h53","3h55","3h57","3h59","4h00","4h02","4h04","4h06","4h07","4h09","4h11","4h12","4h14","4h16","4h17","4h19","4h21","4h22","4h24","4h25","4h27","4h29","4h30","4h32","4h33"],["4h35","4h36","4h38","4h39","4h41","4h42","4h44","4h45","4h47","4h48","4h49","4h51","4h52","4h54","4h55","4h56","4h58","4h59","5h00","5h02","5h03","5h04","5h06","5h07","5h08","5h09","5h11","5h12","5h13","5h14"],["5h16","5h17","5h18","5h19","5h21","5h22","5h23","5h24","5h25","5h27","5h28","5h29","5h30","5h31","5h33","5h34","5h35","5h36","5h37","5h39","5h40","5h41","5h42","5h43","6h44","5h46","5h47","5h48","5h49","5h50","5h51"],["5h53","5h54","5h55","5h56","5h57","5h58","6h00","6h01","6h02","6h03","6h04","6h05","6h06","6h07","6h08","6h09","6h10","6h12","6h13","6h14","6h15","6h16","6h17","6h18","6h19","6h20","6h21","6h22","6h23","6h24"],["6h25","6h26","6h27","6h28","6h29","6h30","6h31","6h32","6h32","6h33","6h34","6h35","6h36","6h36","6h37","6h38","6h38","6h39","6h39","6h40","6h41","6h41","6h42","6h42","6h42","6h43","6h43","6h44","6h44","6h44","6h44"]] },
    { city: "tours", latitude: 47.39863822805879, longitude: 0.6965263764166114, times: [["6h53","6h53","6h53","6h53","6h53","6h53","6h53","6h53","6h53","6h53","6h53","6h52","6h52","6h52","6h51","6h51","6h50","6h50","6h49","6h49","6h48","6h47","6h47","6h46","6h45","6h44","6h43","6h42","6h41","6h40","6h39"],["6h38","6h37","6h36","6h35","6h34","6h33","6h31","6h30","6h29","6h27","6h26","6h25","6h23","6h22","6h20","6h19","6h17","6h16","6h15","6h13","6h12","6h10","6h08","6h07","6h05","6h04","6h02","6h00","5h59"],["5h58","5h57","5h55","5h53","5h51","5h50","5h48","5h46","5h44","5h42","5h40","5h38","5h36","5h34","5h32","5h30","5h28","5h26","5h24","5h22","5h20","5h18","5h16","5h14","5h12","5h10","5h08","5h06","5h03","5h01","4h59"],["4h57","4h55","4h53","4h50","4h48","4h46","4h44","4h42","4h39","4h37","4h35","4h33","4h30","4h28","4h26","4h24","4h21","4h19","4h17","4h15","4h12","4h10","4h08","4h06","4h03","4h01","3h59","3h57","3h54","3h52"],["3h50","3h48","3h46","3h43","3h41","3h39","3h37","3h35","3h33","3h30","3h28","3h26","3h24","3h22","3h20","3h18","3h16","3h14","3h12","3h10","3h08","3h07","3h05","3h03","3h01","3h00","2h58","2h56","2h55","2h53","2h52"],["2h50","2h49","2h48","2h46","2h45","2h44","2h43","2h42","2h41","2h40","2h39","2h39","2h38","2h38","2h37","2h37","2h37","2h36","2h36","2h36","2h37","2h37","2h37","2h38","2h38","2h39","2h39","2h40","2h41","2h42"],["2h43","2h44","2h45","2h46","2h47","2h49","2h50","2h52","2h53","2h55","2h56","2h58","3h00","3h01","3h03","3h05","3h07","3h08","3h10","3h12","3h14","3h16","3h18","3h20","3h22","3h24","3h26","3h28","3h30","3h32","3h34"],["3h36","3h38","3h40","3h42","3h44","3h46","3h48","3h50","3h51","3h53","3h55","3h57","3h59","4h01","4h03","4h05","4h07","4h08","4h10","4h12","4h14","4h16","4h17","4h19","4h21","4h23","4h24","4h26","4h28","4h29","4h31"],["4h33","4h34","4h36","4h38","4h39","4h41","4h42","4h44","4h45","4h47","4h48","4h50","4h51","4h53","4h54","4h56","4h57","4h59","5h00","5h02","5h03","5h04","5h06","5h07","5h08","5h10","5h11","5h13","5h14","5h15"],["5h17","5h18","5h19","5h21","5h22","5h23","5h24","5h26","5h27","5h28","5h30","5h31","5h32","5h33","5h35","5h36","5h37","5h38","5h40","5h41","5h42","5h43","5h45","5h46","5h48","5h50","5h51","5h52","5h54","5h55","5h55"],["5h56","5h58","5h59","6h01","6h02","6h03","6h04","6h06","6h07","6h08","6h10","6h11","6h12","6h13","6h15","6h16","6h17","6h18","6h20","6h21","6h22","6h23","6h24","6h26","6h27","6h28","6h29","6h30","6h31","6h32"],["6h33","6h34","6h35","6h36","6h37","6h38","6h39","6h40","6h41","6h42","6h43","6h44","6h44","6h45","6h46","6h47","6h47","6h48","6h48","6h49","6h50","6h50","6h51","6h51","6h51","6h52","6h52","6h52","6h53","6h53","6h53"]] }
  ];

  // PrayerTimeFr: interpolates Fajr from reference cities, other prayers from astronomical calc
  function _ISPrayerTimeFr() {
    function _parseTime(s, sep) { sep = sep || "h"; var p = s.split(sep); return 1*p[0] + p[1]/60; }
    function _pad(n) { return n < 10 ? "0" + n : n; }
    function _formatTime(h, sep) {
      sep = sep || ":";
      var mins = Math.round(h % 1 * 60), hrs = h - h % 1;
      return _pad(hrs) + sep + _pad(mins);
    }
    function _isDST(d) {
      var mar = new Date(Date.UTC(d.getFullYear(), 2, 31)), oct = new Date(Date.UTC(d.getFullYear(), 9, 31));
      var i = 31; while (mar.getDay() !== 0) mar.setUTCDate(--i);
      var j = 31; while (oct.getDay() !== 0) oct.setUTCDate(--j);
      return d.getTime() >= mar.getTime() && d.getTime() < oct.getTime();
    }
    function _lonCorrection(dist, lat, isAfter) {
      var circ = 2 * Math.PI * Math.cos(lat * Math.PI / 180) * 6378;
      circ = 1000 * circ / 1440;
      return dist / circ * (isAfter ? 1 : -1);
    }
    function _latCorrection(sorted, date, userLat) {
      var northFirst = _IS_FR_DATA[sorted[0].index].latitude >= _IS_FR_DATA[sorted[1].index].latitude;
      var north = _IS_FR_DATA[sorted[northFirst ? 0 : 1].index];
      var south = _IS_FR_DATA[sorted[northFirst ? 1 : 0].index];
      var horizDist = new _ISLatLon(north.latitude, north.longitude).distanceTo(new _ISLatLon(north.latitude, south.longitude));
      var lonCorr = _lonCorrection(horizDist, north.latitude, south.longitude <= north.longitude);
      var tN = _parseTime(north.times[date.getUTCMonth()][date.getUTCDate()-1]);
      var tS = _parseTime(south.times[date.getUTCMonth()][date.getUTCDate()-1]) - lonCorr/60;
      var diffMin = 60 * (tN - tS);
      var vertDist = new _ISLatLon(north.latitude, north.longitude).distanceTo(new _ISLatLon(south.latitude, north.longitude));
      var rate = diffMin / vertDist;
      return rate * sorted[0].vertically * (userLat >= _IS_FR_DATA[sorted[0].index].latitude ? 1 : -1);
    }
    function _computeMidnightLastThird(times) {
      var sunset = _parseTime(times.sunset, ":"), fajr = _parseTime(times.fajr, ":") + 24;
      var mid = sunset + (fajr - sunset) / 2;
      var lt = sunset + (fajr - sunset) / 3 * 2;
      times.midnight = _formatTime(mid >= 24 ? mid - 24 : mid, ":");
      times.lastThird = _formatTime(lt >= 24 ? lt - 24 : lt, ":");
    }

    var _pt = new _ISPrayTimes("MWL");
    _pt.adjust({ imsak: "0 min", highLats: "AngleBased", midnight: "Jafari" });

    this.getTimes = function(date, lat, lon) {
      var dst = _isDST(date);
      var astro = _pt.getTimes(date, [lat, lon], 1, dst ? 1 : 0);
      var userPos = new _ISLatLon(lat, lon);
      var refs = [];
      for (var i = 0; i < _IS_FR_DATA.length; i++) {
        var ref = new _ISLatLon(_IS_FR_DATA[i].latitude, _IS_FR_DATA[i].longitude);
        refs.push({
          index: i,
          distance: ref.distanceTo(userPos),
          horizontally: new _ISLatLon(lat, _IS_FR_DATA[i].longitude).distanceTo(userPos),
          vertically: new _ISLatLon(_IS_FR_DATA[i].latitude, lon).distanceTo(userPos),
          after: _IS_FR_DATA[i].longitude <= lon
        });
      }
      refs.sort(function(a, b) { return a.vertically - b.vertically; });
      var lonMin = _lonCorrection(refs[0].horizontally, lat, !refs[0].after);
      var latMin = _latCorrection(refs, date, lat);
      var baseFajr = _parseTime(_IS_FR_DATA[refs[0].index].times[date.getUTCMonth()][date.getUTCDate()-1], "h") + (dst ? 1 : 0);
      astro.fajr = _formatTime(baseFajr + Math.round(lonMin)/60 + Math.round(latMin)/60, ":");
      _computeMidnightLastThird(astro);
      return astro;
    };
  }

  // Check if coordinates are within France metropolitan area (roughly)
  function _isInFrance(lat, lon) {
    return lat >= 41.3 && lat <= 51.1 && lon >= -5.2 && lon <= 9.6;
  }

  // ---- PRAYER TIMES ----
  var PRAYER_METHODS = [
    { id: "islamsounnah", name: "IslamSounnah" },
    { id: "mawaqit", name: "Mawaqit" },
  ];
  var PRAYER_NAMES = { Fajr: "Fajr", Sunrise: "Shourouq", Dhuhr: "Dhuhr", Asr: "Asr", Maghrib: "Maghrib", Isha: "Isha", Midnight: "Moiti\u00e9 de la nuit", LastThird: "Dernier tiers" };
  var PRAYER_NAMES_AR = { Fajr: "\u0627\u0644\u0641\u062C\u0631", Sunrise: "\u0627\u0644\u0634\u0631\u0648\u0642", Dhuhr: "\u0627\u0644\u0638\u0647\u0631", Asr: "\u0627\u0644\u0639\u0635\u0631", Maghrib: "\u0627\u0644\u0645\u063A\u0631\u0628", Isha: "\u0627\u0644\u0639\u0634\u0627\u0621", Midnight: "\u0645\u0646\u062A\u0635\u0641 \u0627\u0644\u0644\u064A\u0644", LastThird: "\u0627\u0644\u062B\u0644\u062B \u0627\u0644\u0623\u062E\u064A\u0631" };
  var PRAYER_METHOD_KEY   = "qurani-prayer-method";
  var PRAYER_LOCATION_KEY = "qurani-prayer-location";
  var MAWAQIT_MOSQUE_KEY  = "qurani-mawaqit-mosque";
  var prayerTimesCache = null;
  var prayerCountdownInterval = null;
  var _citySearchTimer = null;

  function getPrayerMethod() {
    var val = localStorage.getItem(PRAYER_METHOD_KEY);
    if (val === "mawaqit") return "mawaqit";
    return "islamsounnah"; // default + migration from any old numeric method
  }
  function setPrayerMethod(id) { localStorage.setItem(PRAYER_METHOD_KEY, String(id)); }

  function getSavedPrayerLocation() {
    try { var r = localStorage.getItem(PRAYER_LOCATION_KEY); return r ? JSON.parse(r) : null; }
    catch(e) { return null; }
  }
  function savePrayerLocation(loc) { localStorage.setItem(PRAYER_LOCATION_KEY, JSON.stringify(loc)); }
  function clearPrayerLocation() { localStorage.removeItem(PRAYER_LOCATION_KEY); }

  function getSavedMawaqitMosque() {
    try { var r = localStorage.getItem(MAWAQIT_MOSQUE_KEY); return r ? JSON.parse(r) : null; }
    catch(e) { return null; }
  }
  function saveMawaqitMosque(m) { localStorage.setItem(MAWAQIT_MOSQUE_KEY, JSON.stringify(m)); }
  function clearMawaqitMosque() { localStorage.removeItem(MAWAQIT_MOSQUE_KEY); }

  // Prayer background images
  var PRAYER_BG_IMAGES = [
    1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,
    21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,37,38,39,
    41,42,43,44,45,47,48,49,50,51
  ];
  var _lastPrayerBg = -1;

  function openPrayerOverlay() {
    var overlay = $("prayer-overlay");
    overlay.classList.remove("hidden");
    $("prayer-loading").classList.remove("hidden");
    $("prayer-error").classList.add("hidden");

    // Random background image (avoid repeating last)
    var idx;
    do { idx = Math.floor(Math.random() * PRAYER_BG_IMAGES.length); }
    while (idx === _lastPrayerBg && PRAYER_BG_IMAGES.length > 1);
    _lastPrayerBg = idx;
    var num = PRAYER_BG_IMAGES[idx];
    var ext = [20, 36, 40].indexOf(num) >= 0 ? "png" : "jpg";
    overlay.style.backgroundImage = "url('img/prayer/" + num + "." + ext + "')";

    // Day/night mode
    var hour = new Date().getHours();
    overlay.classList.remove("prayer-day", "prayer-night", "prayer-halo");
    overlay.classList.add(hour >= 6 && hour < 19 ? "prayer-day" : "prayer-night");
    setTimeout(function() { overlay.classList.add("prayer-halo"); }, 50);

    // Hide settings panel on open
    var settingsPanel = $("prayer-settings-panel");
    if (settingsPanel) settingsPanel.classList.remove("visible");

    renderPrayerMethodButtons();
    renderPrayerLocationBar();

    var saved = getSavedPrayerLocation();
    if (saved) {
      fetchPrayerTimes(saved.lat, saved.lon);
      return;
    }
    if (!navigator.geolocation) {
      $("prayer-loading").classList.add("hidden");
      $("prayer-error").classList.remove("hidden");
      $("prayer-error-msg").textContent = "G\u00e9olocalisation non disponible.";
      return;
    }
    navigator.geolocation.getCurrentPosition(function (pos) {
      fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude);
    }, function (err) {
      $("prayer-loading").classList.add("hidden");
      $("prayer-error").classList.remove("hidden");
      $("prayer-error-msg").textContent = err.code === 1
        ? "Autorisez la g\u00e9olocalisation pour les horaires."
        : "Impossible d'obtenir votre position.";
    }, { timeout: 12000, enableHighAccuracy: false });
  }

  // ---- CITY SEARCH ----
  function renderPrayerLocationBar() {
    var bar = $("prayer-location-bar");
    if (!bar) return;
    var saved = getSavedPrayerLocation();
    bar.innerHTML = "";
    var wrap = document.createElement("div");
    wrap.className = "prayer-search-wrap";

    var input = document.createElement("input");
    input.type = "text";
    input.className = "prayer-search-input";
    input.placeholder = saved ? saved.name : "Rechercher une ville…";
    input.setAttribute("autocomplete", "off");
    wrap.appendChild(input);

    if (saved) {
      var resetBtn = document.createElement("button");
      resetBtn.className = "prayer-search-reset";
      resetBtn.title = "Utiliser ma position GPS";
      resetBtn.innerHTML = "&times;";
      resetBtn.addEventListener("click", function() {
        clearPrayerLocation();
        openPrayerOverlay();
      });
      wrap.appendChild(resetBtn);
    }

    var dropdown = document.createElement("div");
    dropdown.className = "prayer-search-dropdown hidden";
    wrap.appendChild(dropdown);
    bar.appendChild(wrap);

    input.addEventListener("input", function() {
      clearTimeout(_citySearchTimer);
      var q = input.value.trim();
      if (q.length < 2) { dropdown.classList.add("hidden"); dropdown.innerHTML = ""; return; }
      _citySearchTimer = setTimeout(function() { _doSearchCity(q, dropdown); }, 450);
    });
  }

  function _doSearchCity(q, dropdown) {
    var url = "https://nominatim.openstreetmap.org/search?q=" + encodeURIComponent(q) +
              "&format=json&limit=5&addressdetails=1";
    fetch(url, { headers: { "Accept-Language": "fr,en" } })
      .then(function(r) { return r.json(); })
      .then(function(results) {
        dropdown.innerHTML = "";
        if (!results || !results.length) {
          dropdown.innerHTML = '<div class="prayer-search-item prayer-search-empty">Aucun r\u00e9sultat</div>';
          dropdown.classList.remove("hidden");
          return;
        }
        results.forEach(function(r) {
          var item = document.createElement("div");
          item.className = "prayer-search-item";
          var addr = r.address || {};
          var city = addr.city || addr.town || addr.village || addr.municipality || r.display_name.split(",")[0];
          var label = [city, addr.country].filter(Boolean).join(", ");
          item.textContent = label;
          item.addEventListener("click", function() {
            dropdown.classList.add("hidden");
            var loc = { lat: parseFloat(r.lat), lon: parseFloat(r.lon), name: label };
            savePrayerLocation(loc);
            renderPrayerLocationBar();
            $("prayer-loading").classList.remove("hidden");
            $("prayer-error").classList.add("hidden");
            fetchPrayerTimes(loc.lat, loc.lon);
          });
          dropdown.appendChild(item);
        });
        dropdown.classList.remove("hidden");
      })
      .catch(function() {
        dropdown.innerHTML = '<div class="prayer-search-item prayer-search-empty">Erreur de recherche</div>';
        dropdown.classList.remove("hidden");
      });
  }

  var _islamSounnahEngine = null;

  function fetchPrayerTimes(lat, lon) {
    var method = getPrayerMethod();
    if (method === "islamsounnah") return fetchPrayerTimesIslamSounnah(lat, lon);
    if (method === "mawaqit")      return fetchPrayerTimesMawaqit(lat, lon);
    var ts = Math.floor(Date.now() / 1000);
    var url = "https://api.aladhan.com/v1/timings/" + ts + "?latitude=" + lat + "&longitude=" + lon + "&method=" + method;
    fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      if (data.code !== 200 || !data.data) throw new Error("err");
      prayerTimesCache = data.data.timings;
      $("prayer-loading").classList.add("hidden");
      renderPrayerTimes();
      startPrayerCountdown();
      savePrayerTimesToBridge();
    }).catch(function () {
      $("prayer-loading").classList.add("hidden");
      $("prayer-error").classList.remove("hidden");
      $("prayer-error-msg").textContent = "Impossible de charger les horaires.";
    });
  }

  // ---- MAWAQIT ----
  function fetchPrayerTimesMawaqit(lat, lon) {
    var saved = getSavedMawaqitMosque();
    if (saved) {
      _loadMawaqitMosquePage(saved.slug, saved.name);
      return;
    }
    // Search nearest mosques
    var url = "https://mawaqit.net/api/2.0/mosque/search?lat=" + lat + "&lon=" + lon + "&nbrMosque=7";
    fetch(url, { headers: { "Accept": "application/json", "X-Requested-With": "XMLHttpRequest" } })
      .then(function(r) { return r.json(); })
      .then(function(mosques) {
        if (!mosques || !mosques.length) throw new Error("no mosques");
        $("prayer-loading").classList.add("hidden");
        _showMosqueSelector(mosques);
      })
      .catch(function() {
        $("prayer-loading").classList.add("hidden");
        $("prayer-error").classList.remove("hidden");
        $("prayer-error-msg").textContent = "Impossible de trouver des mosqu\u00e9es Mawaqit proches.";
      });
  }

  function _showMosqueSelector(mosques) {
    var panel = $("prayer-mosque-selector");
    if (!panel) return;
    panel.innerHTML = "";
    panel.classList.remove("hidden");

    var title = document.createElement("div");
    title.className = "mosque-selector-title";
    title.textContent = "Choisir une mosqu\u00e9e :";
    panel.appendChild(title);

    mosques.forEach(function(m) {
      var btn = document.createElement("button");
      btn.className = "mosque-selector-item";
      btn.textContent = m.name || m.slug;
      btn.addEventListener("click", function() {
        saveMawaqitMosque({ slug: m.slug, name: m.name || m.slug });
        panel.classList.add("hidden");
        panel.innerHTML = "";
        $("prayer-loading").classList.remove("hidden");
        _loadMawaqitMosquePage(m.slug, m.name || m.slug);
      });
      panel.appendChild(btn);
    });
  }

  function _loadMawaqitMosquePage(slug, mosqueName) {
    var url = "https://mawaqit.net/fr/" + slug;
    fetch(url)
      .then(function(r) { return r.text(); })
      .then(function(html) {
        var timesM  = html.match(/"times"\s*:\s*(\[[^\]]*\])/);
        var shuruqM = html.match(/"shuruq"\s*:\s*"([^"]+)"/);
        if (!timesM) throw new Error("parse");
        var times = JSON.parse(timesM[1]);
        // times = [Fajr, Dhuhr, Asr, Maghrib, Isha]
        prayerTimesCache = {
          Fajr:    times[0] || "",
          Sunrise: shuruqM ? shuruqM[1] : "",
          Dhuhr:   times[1] || "",
          Asr:     times[2] || "",
          Maghrib: times[3] || "",
          Isha:    times[4] || ""
        };
        $("prayer-loading").classList.add("hidden");
        var mosqueInfo = $("prayer-mosque-name");
        if (mosqueInfo) mosqueInfo.textContent = mosqueName;
        renderPrayerTimes();
        startPrayerCountdown();
        savePrayerTimesToBridge();
      })
      .catch(function() {
        $("prayer-loading").classList.add("hidden");
        $("prayer-error").classList.remove("hidden");
        $("prayer-error-msg").textContent = "Impossible de charger les horaires Mawaqit.";
      });
  }

  function fetchPrayerTimesIslamSounnah(lat, lon) {
    try {
      if (!_islamSounnahEngine) _islamSounnahEngine = new _ISPrayerTimeFr();
      var inFrance = _isInFrance(lat, lon);
      var times;
      if (inFrance) {
        // Use France-specific Fajr interpolation + astronomical calculation
        times = _islamSounnahEngine.getTimes(new Date(), lat, lon);
      } else {
        // Fallback: use MWL astronomical calculation for non-France locations
        var fallback = new _ISPrayTimes("MWL");
        fallback.adjust({ imsak: "0 min", highLats: "AngleBased", midnight: "Jafari" });
        var isDST = function(d) {
          var mar = new Date(Date.UTC(d.getFullYear(), 2, 31)), oct = new Date(Date.UTC(d.getFullYear(), 9, 31));
          var i = 31; while (mar.getDay() !== 0) mar.setUTCDate(--i);
          var j = 31; while (oct.getDay() !== 0) oct.setUTCDate(--j);
          return d.getTime() >= mar.getTime() && d.getTime() < oct.getTime();
        };
        var now = new Date();
        // Use device's actual UTC offset — reliable on all browsers/iOS (already includes DST)
        var tzOffset = -now.getTimezoneOffset() / 60;
        times = fallback.getTimes(now, [lat, lon], tzOffset, 0);
      }
      prayerTimesCache = {
        Fajr: times.fajr,
        Sunrise: times.sunrise,
        Dhuhr: times.dhuhr,
        Asr: times.asr,
        Maghrib: times.maghrib,
        Isha: times.isha,
        Midnight: times.midnight,
        LastThird: times.lastThird
      };
      $("prayer-loading").classList.add("hidden");
      renderPrayerTimes();
      startPrayerCountdown();
      savePrayerTimesToBridge();
    } catch (e) {
      console.error("IslamSounnah error:", e);
      $("prayer-loading").classList.add("hidden");
      $("prayer-error").classList.remove("hidden");
      $("prayer-error-msg").textContent = "Erreur de calcul des horaires IslamSounnah.";
    }
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
    var mainPrayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var now = new Date();
    var nextPrayer = null;
    var prevPrayer = null;

    // Parse times and find next/prev
    var prayerDates = [];
    mainPrayers.forEach(function (key) {
      var time = prayerTimesCache[key];
      if (!time) return;
      var parts = time.split(":");
      var d = new Date();
      d.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);
      var isPast = d < now;
      var isNext = !isPast && !nextPrayer;
      if (isNext) nextPrayer = { key: key, date: d, time: time };
      if (isPast) prevPrayer = { key: key, date: d, time: time };
      prayerDates.push({ key: key, date: d, time: time, isPast: isPast, isNext: isNext });
    });

    // Render timeline row (prayer names + times in a horizontal row)
    var timesRow = $("prayer-times-row");
    if (timesRow) {
      timesRow.innerHTML = "";
      prayerDates.forEach(function (p) {
        var col = document.createElement("div");
        col.className = "prayer-time-col" + (p.isNext ? " prayer-active" : "") + (p.isPast ? " prayer-past" : "");
        col.innerHTML = '<div class="prayer-time-col-name">' + PRAYER_NAMES[p.key] + '</div>' +
          '<div class="prayer-time-col-time">' + p.time.substring(0, 5) + '</div>';
        timesRow.appendChild(col);
      });
    }

    // Countdown overlay
    var countdownName = $("prayer-countdown-name");
    var countdownTime = $("prayer-countdown-time");
    var countdownLabel = $("prayer-countdown-label");
    if (countdownName && countdownTime) {
      if (nextPrayer) {
        var diff = nextPrayer.date - now;
        var h = Math.floor(diff / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);
        countdownName.textContent = PRAYER_NAMES[nextPrayer.key];
        countdownTime.textContent = (h > 0 ? h + "h " : "") + m + "min " + s + "s";
        if (countdownLabel) countdownLabel.textContent = "Prochaine prière";
      } else {
        countdownName.textContent = "Fajr";
        countdownTime.textContent = "demain in shaa Allah";
        if (countdownLabel) countdownLabel.textContent = "Prochaine prière";
      }
    }

    // Night info (IslamSounnah)
    var isSounnah = getPrayerMethod() === "islamsounnah";
    var nightInfo = $("prayer-night-info");
    if (nightInfo) {
      if (isSounnah && prayerTimesCache.Midnight) {
        nightInfo.classList.remove("hidden");
        var midVal = $("prayer-midnight-val");
        var thirdVal = $("prayer-lastthird-val");
        if (midVal) midVal.textContent = (prayerTimesCache.Midnight || "--:--").substring(0, 5);
        if (thirdVal) thirdVal.textContent = (prayerTimesCache.LastThird || "--:--").substring(0, 5);
      } else {
        nightInfo.classList.add("hidden");
      }
    }

    // Show loading done
    $("prayer-loading").classList.add("hidden");
  }

  function startPrayerCountdown() {
    if (prayerCountdownInterval) clearInterval(prayerCountdownInterval);
    prayerCountdownInterval = setInterval(renderPrayerTimes, 1000);
  }

  function closePrayerOverlay() {
    _closeBack("prayer-overlay", function() {
      if (prayerCountdownInterval) { clearInterval(prayerCountdownInterval); prayerCountdownInterval = null; }
      // Refresh dashboard prayer bar with updated data
      if (prayerTimesCache) {
        renderDashPrayer();
        startDashPrayerCountdown();
      }
    });
  }

  // ===========================================================
  //  DASHBOARD — Compact Prayer Bar + Emotion Wheel
  // ===========================================================

  var dashPrayerInterval = null;

  function initDashboardPrayer() {
    // Fetch prayer times silently for the dashboard bar
    var saved = getSavedPrayerLocation();
    if (saved) {
      _fetchDashPrayer(saved.lat, saved.lon);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (pos) {
        _fetchDashPrayer(pos.coords.latitude, pos.coords.longitude);
      }, function () {
        // Silently fail — dashboard prayer bar stays empty
      }, { timeout: 12000, enableHighAccuracy: false });
    }
  }

  function _fetchDashPrayer(lat, lon) {
    var method = getPrayerMethod();
    if (method === "islamsounnah") {
      try {
        if (!_islamSounnahEngine) _islamSounnahEngine = new _ISPrayerTimeFr();
        var inFrance = _isInFrance(lat, lon);
        var times;
        if (inFrance) {
          times = _islamSounnahEngine.getTimes(new Date(), lat, lon);
        } else {
          var fallback = new _ISPrayTimes("MWL");
          fallback.adjust({ imsak: "0 min", highLats: "AngleBased", midnight: "Jafari" });
          var now = new Date();
          var tzOffset = -now.getTimezoneOffset() / 60;
          times = fallback.getTimes(now, [lat, lon], tzOffset, 0);
        }
        prayerTimesCache = {
          Fajr: times.fajr, Sunrise: times.sunrise, Dhuhr: times.dhuhr,
          Asr: times.asr, Maghrib: times.maghrib, Isha: times.isha,
          Midnight: times.midnight, LastThird: times.lastThird
        };
        renderDashPrayer();
        startDashPrayerCountdown();
      } catch (e) { /* silent */ }
      return;
    }
    if (method === "mawaqit") {
      var mosque = getSavedMawaqitMosque();
      if (mosque) {
        var url = "https://mawaqit.net/fr/" + mosque.slug;
        fetch(url).then(function(r) { return r.text(); }).then(function(html) {
          var timesM = html.match(/"times"\s*:\s*(\[[^\]]*\])/);
          var shuruqM = html.match(/"shuruq"\s*:\s*"([^"]+)"/);
          if (!timesM) return;
          var t = JSON.parse(timesM[1]);
          prayerTimesCache = {
            Fajr: t[0] || "", Sunrise: shuruqM ? shuruqM[1] : "",
            Dhuhr: t[1] || "", Asr: t[2] || "", Maghrib: t[3] || "", Isha: t[4] || ""
          };
          renderDashPrayer();
          startDashPrayerCountdown();
        }).catch(function() {});
      }
      return;
    }
    // Aladhan fallback
    var ts = Math.floor(Date.now() / 1000);
    var apiUrl = "https://api.aladhan.com/v1/timings/" + ts + "?latitude=" + lat + "&longitude=" + lon + "&method=" + method;
    fetch(apiUrl).then(function(r) { return r.json(); }).then(function(data) {
      if (data.code !== 200 || !data.data) return;
      prayerTimesCache = data.data.timings;
      renderDashPrayer();
      startDashPrayerCountdown();
    }).catch(function() {});
  }

  function renderDashPrayer() {
    if (!prayerTimesCache) return;
    var timeline = $("dash-prayer-timeline");
    var dayNameEl = $("dash-day-name");
    var countdownEl = $("dash-prayer-countdown");
    if (!timeline) return;

    var keys = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var now = new Date();

    // Parse prayer times into Date objects
    var prayerDates = [];
    keys.forEach(function (key) {
      var t = prayerTimesCache[key];
      if (!t) return;
      var parts = t.split(":");
      var d = new Date();
      d.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);
      prayerDates.push({ key: key, date: d, time: t });
    });

    // Find next and previous prayer
    var nextIdx = -1;
    for (var i = 0; i < prayerDates.length; i++) {
      if (prayerDates[i].date > now) { nextIdx = i; break; }
    }

    // Build timeline dots
    timeline.innerHTML = "";

    // Start cap
    var capL = document.createElement("div");
    capL.className = "dash-timeline-cap";
    timeline.appendChild(capL);

    prayerDates.forEach(function (p, idx) {
      var dot = document.createElement("div");
      dot.className = "dash-timeline-dot";
      if (idx === nextIdx) dot.classList.add("next");
      else if (nextIdx === -1 || idx < nextIdx) dot.classList.add("past");
      timeline.appendChild(dot);
    });

    // End cap
    var capR = document.createElement("div");
    capR.className = "dash-timeline-cap";
    timeline.appendChild(capR);

    // Cursor: position between previous and next prayer
    if (nextIdx > 0) {
      var prev = prayerDates[nextIdx - 1];
      var next = prayerDates[nextIdx];
      var total = next.date - prev.date;
      var elapsed = now - prev.date;
      var frac = Math.min(1, Math.max(0, elapsed / total));

      // Calculate position between the two dots
      // Each dot is evenly distributed. Total items = 2 caps + N dots
      var totalItems = prayerDates.length + 2; // +2 for caps
      var prevPos = (nextIdx) / (totalItems - 1); // +1 for left cap offset
      var nextPos = (nextIdx + 1) / (totalItems - 1);
      var cursorPos = prevPos + frac * (nextPos - prevPos);

      var cursor = document.createElement("div");
      cursor.className = "dash-timeline-cursor";
      cursor.style.left = (cursorPos * 100) + "%";
      timeline.appendChild(cursor);
    } else if (nextIdx === 0) {
      // Before Fajr — cursor at start
      var cursor0 = document.createElement("div");
      cursor0.className = "dash-timeline-cursor";
      cursor0.style.left = "0%";
      timeline.appendChild(cursor0);
    } else {
      // After Isha — cursor at end
      var cursorEnd = document.createElement("div");
      cursorEnd.className = "dash-timeline-cursor";
      cursorEnd.style.left = "100%";
      timeline.appendChild(cursorEnd);
    }

    // Day name
    var dayNames = ["Al-Ahad", "Al-Ithnayn", "Ath-Thulatha", "Al-Arbi'a", "Al-Khamis", "Al-Jumu'a", "As-Sabt"];
    if (dayNameEl) dayNameEl.textContent = dayNames[now.getDay()];

    // Countdown text
    if (countdownEl) {
      if (nextIdx >= 0) {
        var diff = prayerDates[nextIdx].date - now;
        var h = Math.floor(diff / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        countdownEl.textContent = PRAYER_NAMES[prayerDates[nextIdx].key] + " dans " + (h > 0 ? h + "h " : "") + m + "min";
      } else {
        countdownEl.textContent = "Fajr demain in shaa Allah";
      }
    }

    // Ambient glow — warm tones based on time of day
    var glowEl = $("dash-ambient-glow");
    if (glowEl) {
      var hour = now.getHours() + now.getMinutes() / 60;
      var gradient;
      if (hour < 5 || hour >= 21) {
        // Night — deep dark blue glow
        gradient = "radial-gradient(ellipse 120% 60% at 50% -10%, rgba(30,40,70,0.35) 0%, transparent 70%)";
      } else if (hour < 7) {
        // Dawn — soft warm orange
        gradient = "radial-gradient(ellipse 120% 60% at 50% -10%, rgba(180,100,40,0.2) 0%, transparent 70%)";
      } else if (hour < 12) {
        // Morning — warm gold
        gradient = "radial-gradient(ellipse 120% 60% at 50% -10%, rgba(200,150,50,0.18) 0%, transparent 70%)";
      } else if (hour < 16) {
        // Afternoon — soft white-yellow
        gradient = "radial-gradient(ellipse 120% 60% at 50% -10%, rgba(220,200,120,0.15) 0%, transparent 70%)";
      } else if (hour < 19) {
        // Golden hour — rich orange
        gradient = "radial-gradient(ellipse 120% 60% at 50% -10%, rgba(200,100,30,0.25) 0%, transparent 70%)";
      } else {
        // Dusk — purple-blue
        gradient = "radial-gradient(ellipse 120% 60% at 50% -10%, rgba(80,50,100,0.3) 0%, transparent 70%)";
      }
      glowEl.style.background = gradient;
    }
  }

  function startDashPrayerCountdown() {
    if (dashPrayerInterval) clearInterval(dashPrayerInterval);
    dashPrayerInterval = setInterval(renderDashPrayer, 60000);
  }

  var DAILY_LABELS = [
    "INVOCATIONS DU MATIN", "INVOCATIONS DU SOIR",
    "INVOCATIONS DU MATIN", "INVOCATIONS DU SOIR"
  ];

  function initDashboardCards() {
    var now = new Date();
    var hour = now.getHours();
    var labelEl = $("dash-card-label");
    if (labelEl) {
      labelEl.textContent = hour < 12 ? "INVOCATIONS DU MATIN" : "INVOCATIONS DU SOIR";
    }
    // Reading subtitle
    var subEl = $("dash-reading-subtitle");
    if (subEl) {
      var ayah = getAyahByGlobalIndex(state.globalIndex);
      if (ayah) {
        subEl.textContent = "Sourate " + ayah.surahNameFr + " — Verset " + ayah.ayahNumber;
      }
    }
  }

  // ---- TAB BAR SWITCHING ----
  function initTabBar() {
    var tabBar = $("tab-bar");
    if (!tabBar) return;
    var btns = tabBar.querySelectorAll(".tab-bar-btn");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tab = btn.dataset.tab;
        btns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        document.querySelectorAll(".tab-panel").forEach(function (p) {
          p.classList.add("hidden");
        });
        var panel = $("tab-" + tab);
        if (panel) panel.classList.remove("hidden");
      });
    });
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
    // If Mawaqit is active and a mosque is saved, show mosque name + change button
    if (current === "mawaqit") {
      var saved = getSavedMawaqitMosque();
      var info = $("prayer-mosque-row");
      if (info) {
        if (saved) {
          info.classList.remove("hidden");
          var nameEl = $("prayer-mosque-name");
          if (nameEl) nameEl.textContent = saved.name;
        } else {
          info.classList.add("hidden");
        }
      }
    } else {
      var info2 = $("prayer-mosque-row");
      if (info2) info2.classList.add("hidden");
    }
  }

  // ---- HELPERS: coloring in hifz / recit ----
  // Build word char offsets from raw text (whitespace-separated)
  function _buildWordOffsets(fullText) {
    var words = []; var offsets = [];
    var i = 0; var n = fullText.length;
    while (i < n) {
      while (i < n && /\s/.test(fullText[i])) i++;
      if (i >= n) break;
      var start = i;
      while (i < n && !/\s/.test(fullText[i])) i++;
      words.push(fullText.slice(start, i));
      offsets.push(start);
    }
    return { words: words, offsets: offsets };
  }

  // Fill a span with tajwid-colored sub-spans for chars [charOffset, charOffset+wordLen)
  function _applyColorSegmentsToSpan(span, wordText, allSegments, charOffset) {
    var wordEnd = charOffset + wordText.length;
    var pos = 0; var added = false;
    allSegments.forEach(function (seg) {
      var segStart = pos; var segEnd = pos + seg.chars.length;
      pos = segEnd;
      if (segEnd <= charOffset || segStart >= wordEnd) return;
      var oStart = Math.max(segStart, charOffset);
      var oEnd   = Math.min(segEnd, wordEnd);
      var chars  = seg.chars.substring(oStart - segStart, oEnd - segStart);
      if (!chars) return;
      var s = document.createElement("span");
      s.textContent = chars;
      if (seg.rule) s.className = "tajwid-" + seg.rule;
      span.appendChild(s); added = true;
    });
    if (!added) span.textContent = wordText;
  }

  // Get all segments for a verse (or null if colors are off)
  function _getHifzColorSegments(surahNum, ayahIdx, fullText) {
    var useColors = (state.readingMode === "tajwid") ||
                   (state.readingMode === "minimal" && state.minimalColors);
    if (!useColors) return null;
    var ayahNumber = ayahIdx + 1;
    var key = surahNum + ":" + ayahNumber;
    var overlays = (tajwidData && tajwidData[key]) ? tajwidData[key] : null;
    return getSegmentsForAyah(key, fullText, overlays);
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

    // Compute color segments for visible words (respects reading mode settings)
    var fullText = surah.ayahs[hifzAyahIdx];
    var allSegments = _getHifzColorSegments(surah.surahNumber, hifzAyahIdx, fullText);
    var wordOffsets = _buildWordOffsets(fullText).offsets;

    hifzWords.forEach(function (word, idx) {
      var span = document.createElement("span");
      var isHidden = hifzHiddenSet.has(idx);
      if (isHidden) {
        span.className = "hifz-word hifz-hidden";
        span.textContent = word;
        span.addEventListener("click", function () {
          if (span.classList.contains("hifz-hidden")) {
            // Reveal hidden word
            span.classList.remove("hifz-hidden");
            span.classList.add("hifz-revealed");
          } else {
            // Toggle back to hidden
            span.classList.remove("hifz-revealed");
            span.classList.add("hifz-hidden");
          }
        });
      } else {
        span.className = "hifz-word";
        span.textContent = word;
        // Visible words can also be manually hidden by tapping
        span.addEventListener("click", function () {
          if (span.classList.contains("hifz-hidden")) {
            span.classList.remove("hifz-hidden");
            span.classList.add("hifz-revealed");
          } else {
            span.classList.remove("hifz-revealed");
            span.classList.add("hifz-hidden");
          }
        });
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
    _closeBack("hifz-overlay", function() { hifzMode = false; });
  }

  // ---- RECITATION VERIFICATION (REAL-TIME) ----
  var recitSurahIdx = 0;
  var recitAyahIdx = 0;
  var recitIsListening = false;
  var recitWords = [];
  var recitWordsNorm = [];
  var recitMatchedCount = 0;
  var recitSpokenCount = 0;   // how many spoken words consumed in current ASR session
  var recitWordStates = [];
  var recitListener = null;
  var recitLastTranscript = "";
  var recitAutoAdvance = true;
  var recitIsNative = false;
  var recitIsWeb = false;
  var recitWebRecognition = null;
  var recitWatchdogTimer = null; // iOS auto-restart watchdog

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
    recitSpokenCount = 0;
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
    // Color segments from reading mode settings (for pending words)
    var surah = surahs[recitSurahIdx];
    var fullText = surah.ayahs[recitAyahIdx];
    var allSegments = _getHifzColorSegments(surah.surahNumber, recitAyahIdx, fullText);
    var wordOffsets = _buildWordOffsets(fullText).offsets;

    recitWords.forEach(function (word, idx) {
      var span = document.createElement("span");
      span.id = "recit-w-" + idx;
      var wState = recitWordStates[idx];
      var stateClass = wState === "correct" ? " recit-word-correct" :
                       wState === "error"   ? " recit-word-error" :
                       wState === "skipped" ? " recit-word-skipped" :
                       idx === recitMatchedCount ? " recit-word-active" : "";
      span.className = "recit-word" + stateClass;
      // Apply color segments only to pending/active words (not already matched)
      if (!stateClass && allSegments && wordOffsets[idx] !== undefined) {
        _applyColorSegmentsToSpan(span, word, allSegments, wordOffsets[idx]);
      } else {
        span.textContent = word;
      }
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
    var norm = normalizeArabic(transcript);
    var spoken = norm.split(/\s+/).filter(Boolean);
    if (!spoken.length) return;

    // Show what ASR heard in real-time
    var tEl = $("recit-transcript");
    if (tEl) tEl.textContent = transcript;

    // Helper: similarity between two normalized Arabic words
    function getSim(a, b) {
      if (!a || !b) return 0;
      var dist = levenshtein(a, b);
      var maxLen = Math.max(a.length, b.length);
      return maxLen > 0 ? (1 - dist / maxLen) : 0;
    }
    // Adaptive threshold: short words need higher similarity to avoid false positives
    function getThresh(word) {
      return word.length <= 3 ? 0.80 : 0.65;
    }

    // If ASR produced fewer words than we've already consumed (re-evaluation),
    // reset the spoken cursor to 0 — only try to advance, never downgrade
    var si = (spoken.length < recitSpokenCount) ? 0 : recitSpokenCount;
    var wi = recitMatchedCount;
    var verseSkips = 0; // limit consecutive skipped verse words

    while (wi < recitWords.length && si < spoken.length) {
      var expected = recitWordsNorm[wi];
      var word = spoken[si];
      var thresh = getThresh(expected);
      var sim = getSim(expected, word);

      if (sim >= thresh) {
        // Good match
        if (recitWordStates[wi] !== "correct") recitUpdateWord(wi, "correct");
        recitMatchedCount = wi + 1;
        recitSpokenCount = si + 1;
        verseSkips = 0;
        wi++;
        si++;

      } else {
        // Check: maybe next spoken word is a better match (current is noise/filler)
        if (si + 1 < spoken.length) {
          var simNextSpoken = getSim(expected, spoken[si + 1]);
          if (simNextSpoken >= thresh && simNextSpoken > sim + 0.10) {
            si++; // discard noisy spoken word, retry same verse word
            continue;
          }
        }

        // Check: maybe next verse word matches (user skipped/mispronounced current)
        if (verseSkips < 2 && wi + 1 < recitWordsNorm.length) {
          var simNextVerse = getSim(recitWordsNorm[wi + 1], word);
          if (simNextVerse >= thresh) {
            if (recitWordStates[wi] !== "correct") recitUpdateWord(wi, "skipped");
            verseSkips++;
            wi++;
            continue; // retry same spoken word against next verse word
          }
        }

        // No match found — stop here; wait for more speech
        verseSkips = 0;
        break;
      }
    }

    // Highlight the next expected word
    if (recitMatchedCount < recitWords.length) {
      var activeSpan = document.getElementById("recit-w-" + recitMatchedCount);
      if (activeSpan && recitWordStates[recitMatchedCount] === "pending") {
        activeSpan.className = "recit-word recit-word-active";
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

  // ---- iOS watchdog: auto-restart recognition after silence ----
  function recitClearWatchdog() {
    if (recitWatchdogTimer) { clearTimeout(recitWatchdogTimer); recitWatchdogTimer = null; }
  }
  function recitStartWatchdog() {
    recitClearWatchdog();
    if (!recitIsListening || !recitIsNative) return;
    recitWatchdogTimer = setTimeout(async function () {
      if (!recitIsListening || !recitIsNative) return;
      // iOS recognition stopped due to silence — restart silently
      console.log("Recit watchdog: restarting recognition after silence");
      try {
        var SR = window.Capacitor.Plugins.SpeechRecognition;
        if (recitListener) { recitListener.remove(); recitListener = null; }
        try { await SR.stop(); } catch (e) {}
        recitSpokenCount = 0; // new session, transcript resets
        recitLastTranscript = "";
        await new Promise(function (r) { setTimeout(r, 250); });
        recitListener = await SR.addListener("partialResults", function (event) {
          if (!event.matches || !event.matches.length) return;
          // Try all alternatives, use first that is non-empty
          var best = event.matches[0];
          for (var i = 0; i < event.matches.length; i++) {
            if (event.matches[i] && event.matches[i].length > 0) { best = event.matches[i]; break; }
          }
          if (best && best !== recitLastTranscript) {
            recitLastTranscript = best;
            recitProcessPartial(best);
            recitStartWatchdog(); // reset watchdog on any activity
          }
        });
        await SR.start({ language: "ar-SA", partialResults: true, maxResults: 3, popup: false });
        recitStartWatchdog();
      } catch (e) { console.error("Watchdog restart error:", e); }
    }, 8000); // restart after 8 s of inactivity
  }

  async function recitStartListening() {
    if (recitIsListening || (!recitIsNative && !recitIsWeb)) return;
    try {
      if (recitIsNative) {
        // --- Capacitor (iOS native) ---
        var SR = window.Capacitor.Plugins.SpeechRecognition;
        if (recitListener) { recitListener.remove(); recitListener = null; }
        recitSpokenCount = 0;   // new ASR session — transcript resets to ""
        recitLastTranscript = "";
        recitListener = await SR.addListener("partialResults", function (event) {
          if (!event.matches || !event.matches.length) return;
          var best = event.matches[0];
          for (var i = 0; i < event.matches.length; i++) {
            if (event.matches[i] && event.matches[i].length > 0) { best = event.matches[i]; break; }
          }
          if (best && best !== recitLastTranscript) {
            recitLastTranscript = best;
            recitProcessPartial(best);
            recitStartWatchdog(); // reset watchdog on speech activity
          }
        });
        await SR.start({ language: "ar-SA", partialResults: true, maxResults: 3, popup: false });
        recitStartWatchdog(); // start watchdog to handle silence timeouts
      } else {
        // --- Web Speech API (browser) ---
        var WSR = window.SpeechRecognition || window.webkitSpeechRecognition;
        recitWebRecognition = new WSR();
        recitWebRecognition.lang = "ar-SA";
        recitWebRecognition.interimResults = true;
        recitWebRecognition.continuous = true;
        recitWebRecognition.onresult = function (event) {
          var transcript = "";
          for (var i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript + " ";
          }
          transcript = transcript.trim();
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
          // Auto-restart if still listening (browser stops after silence)
          if (recitIsListening) {
            recitIsListening = false; // reset flag so recitStartListening can proceed
            recitWebRecognition = null;
            setTimeout(recitStartListening, 300);
          }
        };
        recitWebRecognition.start();
      }
      recitIsListening = true;
      $("recit-mic-btn").classList.add("recording");
      $("recit-mic-label").textContent = "Écoute en cours... Appuyez pour arrêter";
      $("recit-status").textContent = "Récitez le verset...";
      var tEl = $("recit-transcript");
      if (tEl) tEl.textContent = "";
    } catch (err) {
      console.error("Recit start error:", err);
      showToast("Erreur reconnaissance vocale");
    }
  }

  async function recitStopListening() {
    if (!recitIsListening) return;
    recitIsListening = false;
    recitClearWatchdog();
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
    _closeBack("recit-overlay", function() {
      if (recitIsListening) recitStopListening();
    });
  }

  // ===========================================================
  // ============  ÉCOUTER LE CORAN  ===========================
  // ===========================================================

  var listenReciterIdx = 0;
  var listenSurahIdx   = 0;    // index into surahs[]
  var listenAudio      = null;
  var listenIsPlaying  = false;
  var listenSeeking    = false;

  function listenGetUrl(reciterIdx, surahNum) {
    var r = RECITERS[reciterIdx];
    if (!r || !r.listenBase) return null;
    return r.listenBase + "/" + String(surahNum).padStart(3, "0") + ".mp3";
  }

  function listenFormatTime(sec) {
    if (!sec || !isFinite(sec)) return "0:00";
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function openListenOverlay() {
    $("listen-overlay").classList.remove("hidden");
    listenRenderReciterSelect();
    listenRenderSurahs();
    listenUpdatePlayerBar();
  }

  function closeListenOverlay() {
    listenPause();
    _closeBack("listen-overlay", null);
  }

  function listenRenderReciterSelect() {
    var sel = $("listen-reciter-select");
    if (!sel) return;
    sel.innerHTML = "";
    // Group: reciters with per-verse audio (id != null)
    var grpRead = document.createElement("optgroup");
    grpRead.label = "Lecture & Écoute";
    var grpListen = document.createElement("optgroup");
    grpListen.label = "Écoute uniquement";
    RECITERS.forEach(function (r, idx) {
      if (!r.listenBase) return;
      var opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = r.name + " \u2013 " + r.nameAr;
      if (idx === listenReciterIdx) opt.selected = true;
      if (r.id) grpRead.appendChild(opt);
      else grpListen.appendChild(opt);
    });
    if (grpRead.children.length) sel.appendChild(grpRead);
    if (grpListen.children.length) sel.appendChild(grpListen);
  }

  function listenRenderSurahs() {
    var list = $("listen-surah-list");
    if (!list) return;
    list.innerHTML = "";
    surahs.forEach(function (s, idx) {
      var item = document.createElement("div");
      item.className = "listen-surah-item" + (idx === listenSurahIdx ? " active" : "");
      item.id = "listen-si-" + idx;
      var nameFr = SURAH_NAMES_FR[s.surahNumber] || "";
      item.innerHTML =
        '<span class="listen-surah-num-badge">' + s.surahNumber + '</span>' +
        '<span class="listen-surah-fr">' + nameFr + '</span>' +
        '<span class="listen-surah-ar">' + s.surahNameAr + '</span>';
      item.addEventListener("click", function () {
        listenSelectSurah(idx);
      });
      list.appendChild(item);
    });
  }

  function listenSelectReciter(idx) {
    var wasPlaying = listenIsPlaying;
    listenPause();
    listenReciterIdx = idx;
    listenUpdatePlayerBar();
    if (wasPlaying) listenPlay();
  }

  function listenSelectSurah(idx) {
    listenPause();
    listenSurahIdx = idx;
    document.querySelectorAll(".listen-surah-item").forEach(function (el, i) {
      el.classList.toggle("active", i === idx);
    });
    listenUpdatePlayerBar();
    listenPlay();
  }

  function listenUpdatePlayerBar() {
    var surah = surahs[listenSurahIdx];
    var reciter = RECITERS[listenReciterIdx];
    var elAr = $("listen-player-surah-ar");
    var elFr = $("listen-player-surah-fr");
    var elRec = $("listen-player-reciter");
    if (elAr) elAr.textContent = surah ? surah.surahNameAr : "--";
    if (elFr) elFr.textContent = surah ? (SURAH_NAMES_FR[surah.surahNumber] || "") : "Choisir une sourate";
    if (elRec) elRec.textContent = reciter ? reciter.name : "";
    listenUpdatePlayIcon();
    listenSetProgress(0, 0);
  }

  function listenUpdatePlayIcon() {
    var icon = $("listen-play-icon");
    if (!icon) return;
    if (listenIsPlaying) {
      icon.innerHTML = '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>';
    } else {
      icon.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
    }
  }

  function listenSetProgress(currentTime, duration) {
    var pct = duration > 0 ? (currentTime / duration) * 100 : 0;
    pct = Math.min(100, Math.max(0, pct));
    var fill = $("listen-progress-fill");
    var knob = $("listen-progress-knob");
    var timeCur = $("listen-time-cur");
    var timeDur = $("listen-time-dur");
    if (fill) fill.style.width = pct + "%";
    if (knob) knob.style.left = pct + "%";
    if (timeCur) timeCur.textContent = listenFormatTime(currentTime);
    if (timeDur) timeDur.textContent = listenFormatTime(duration);
  }

  function listenSeek(e) {
    var bar = $("listen-progress-bar");
    if (!bar || !listenAudio || !listenAudio.duration) return;
    var rect = bar.getBoundingClientRect();
    var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    var pct = Math.max(0, Math.min(1, x / rect.width));
    listenAudio.currentTime = pct * listenAudio.duration;
    listenSetProgress(listenAudio.currentTime, listenAudio.duration);
  }

  function listenInitSeekEvents() {
    var bar = $("listen-progress-bar");
    if (!bar) return;
    bar.addEventListener("click", listenSeek);
    bar.addEventListener("touchstart", function (e) {
      listenSeeking = true;
      bar.classList.add("seeking");
      listenSeek(e);
    }, { passive: true });
    document.addEventListener("touchmove", function (e) {
      if (listenSeeking) listenSeek(e);
    }, { passive: true });
    document.addEventListener("touchend", function () {
      if (listenSeeking) {
        listenSeeking = false;
        bar.classList.remove("seeking");
      }
    });
  }

  function listenPlay() {
    var url = listenGetUrl(listenReciterIdx, surahs[listenSurahIdx].surahNumber);
    if (!url) { showToast("Audio non disponible pour ce récitateur"); return; }

    if (listenAudio) {
      listenAudio.pause();
      listenAudio.ontimeupdate = null;
      listenAudio.onended = null;
      listenAudio.onerror = null;
    }
    listenAudio = new Audio(url);
    listenAudio.ontimeupdate = function () {
      if (!listenSeeking && listenAudio.duration) {
        listenSetProgress(listenAudio.currentTime, listenAudio.duration);
      }
    };
    listenAudio.onended = function () {
      listenIsPlaying = false;
      listenUpdatePlayIcon();
      listenSetProgress(0, 0);
      // Auto-advance to next surah
      if (listenSurahIdx < surahs.length - 1) {
        setTimeout(function () { listenSelectSurah(listenSurahIdx + 1); }, 600);
      }
    };
    listenAudio.onerror = function () {
      listenIsPlaying = false;
      listenUpdatePlayIcon();
      showToast("Audio non disponible");
    };
    listenAudio.play().then(function () {
      listenIsPlaying = true;
      listenUpdatePlayIcon();
      var el = document.getElementById("listen-si-" + listenSurahIdx);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }).catch(function () {
      listenIsPlaying = false;
      listenUpdatePlayIcon();
    });
  }

  function listenPause() {
    if (listenAudio) listenAudio.pause();
    listenIsPlaying = false;
    listenUpdatePlayIcon();
  }

  function listenToggle() {
    if (listenIsPlaying) listenPause();
    else listenPlay();
  }

  function listenNextSurah() {
    if (listenSurahIdx < surahs.length - 1) listenSelectSurah(listenSurahIdx + 1);
  }

  function listenPrevSurah() {
    if (listenSurahIdx > 0) listenSelectSurah(listenSurahIdx - 1);
  }

  // ===========================================================
  // ============  SHAZAM — Identifier un verset  ==============
  // ===========================================================

  var SHAZAM_PROXY = "https://ayat-theta.vercel.app/api/hf"; // Vercel proxy (token kept server-side)
  var SHAZAM_DURATION = 15; // seconds of recording

  var shazamIsRecording = false;
  var shazamStream = null;
  var shazamAudioCtx = null;
  var shazamScriptNode = null;
  var shazamChunks = [];
  var shazamTimer = null;
  var shazamCountdown = 0;
  var shazamResultSurah = -1;
  var shazamResultAyah = -1;
  var shazamNormalizedCache = null; // lazy cache of all normalized verses

  var shazamWordCache = null; // lazy cache of normalized verse words

  function shazamBuildCache() {
    if (shazamNormalizedCache) return;
    shazamNormalizedCache = [];
    shazamWordCache = [];
    for (var s = 0; s < surahs.length; s++) {
      var arrNorm = [];
      var arrWords = [];
      for (var a = 0; a < surahs[s].ayahs.length; a++) {
        var norm = normalizeArabic(surahs[s].ayahs[a]);
        arrNorm.push(norm);
        arrWords.push(norm.split(/\s+/).filter(function (w) { return w.length > 1; }));
      }
      shazamNormalizedCache.push(arrNorm);
      shazamWordCache.push(arrWords);
    }
  }

  function openShazamOverlay() {
    shazamBuildCache();
    $("shazam-overlay").classList.remove("hidden");
    shazamSetState("idle");
  }

  function closeShazamOverlay() {
    if (shazamIsRecording) shazamStopListening(true);
    $("shazam-overlay").classList.add("hidden");
  }

  function shazamSetState(state) {
    var btnWrap = $("shazam-btn-wrap");
    var btn = $("shazam-btn");
    var rings = $("shazam-rings");
    var waves = $("shazam-waves");
    var scrollBg = $("shazam-scroll-bg");
    var status = $("shazam-status");
    var timer = $("shazam-timer");
    var found = $("shazam-found");
    var result = $("shazam-result");
    var error = $("shazam-error");

    btn.className = "shazam-btn";
    rings.className = "shazam-rings";
    btnWrap.classList.remove("hidden");
    waves.classList.add("hidden");
    waves.classList.remove("active");
    scrollBg.classList.add("hidden");
    timer.classList.add("hidden");
    found.classList.add("hidden");
    found.classList.remove("playing");
    result.classList.add("hidden");
    error.classList.add("hidden");

    if (state === "idle") {
      status.textContent = "Récitez un verset ou laissez écouter une récitation pour retrouver la sourate et le verset";
    } else if (state === "listening") {
      btn.classList.add("listening");
      rings.classList.add("active");
      waves.classList.remove("hidden");
      waves.classList.add("active");
      scrollBg.classList.remove("hidden");
      timer.classList.remove("hidden");
      status.textContent = "Écoute en cours…";
    } else if (state === "analyzing") {
      btn.classList.add("analyzing");
      scrollBg.classList.remove("hidden");
      status.textContent = "Analyse en cours…";
    } else if (state === "found") {
      btnWrap.classList.add("hidden");
      found.classList.remove("hidden");
      found.classList.remove("playing");
      void found.offsetWidth; // force reflow to restart animations
      found.classList.add("playing");
      status.textContent = "";
    } else if (state === "result") {
      btnWrap.classList.add("hidden");
      scrollBg.classList.remove("hidden");
      result.classList.remove("hidden");
      status.textContent = "";
    } else if (state === "error") {
      error.classList.remove("hidden");
      status.textContent = "";
    }
  }

  async function shazamStartListening() {
    if (shazamIsRecording) return;
    try {
      shazamStream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, sampleRate: 16000 }
      });
    } catch (err) {
      showToast("Accès au micro refusé");
      return;
    }

    shazamIsRecording = true;
    shazamChunks = [];
    shazamAudioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
    var source = shazamAudioCtx.createMediaStreamSource(shazamStream);
    shazamScriptNode = shazamAudioCtx.createScriptProcessor(4096, 1, 1);

    shazamScriptNode.onaudioprocess = function (e) {
      if (!shazamIsRecording) return;
      var data = e.inputBuffer.getChannelData(0);
      shazamChunks.push(new Float32Array(data));
    };

    source.connect(shazamScriptNode);
    shazamScriptNode.connect(shazamAudioCtx.destination);

    shazamSetState("listening");

    // Countdown timer
    shazamCountdown = SHAZAM_DURATION;
    $("shazam-timer").textContent = shazamCountdown + "s";
    shazamTimer = setInterval(function () {
      shazamCountdown--;
      $("shazam-timer").textContent = shazamCountdown + "s";
      if (shazamCountdown <= 0) {
        shazamStopListening(false);
      }
    }, 1000);
  }

  function shazamStopListening(cancelled) {
    if (!shazamIsRecording) return;
    shazamIsRecording = false;

    if (shazamTimer) { clearInterval(shazamTimer); shazamTimer = null; }
    if (shazamScriptNode) { shazamScriptNode.disconnect(); shazamScriptNode = null; }
    if (shazamAudioCtx) { shazamAudioCtx.close().catch(function(){}); shazamAudioCtx = null; }
    if (shazamStream) {
      shazamStream.getTracks().forEach(function (t) { t.stop(); });
      shazamStream = null;
    }

    if (cancelled) {
      shazamSetState("idle");
      return;
    }

    // Merge chunks into one Float32Array
    var totalLen = 0;
    for (var i = 0; i < shazamChunks.length; i++) totalLen += shazamChunks[i].length;
    var merged = new Float32Array(totalLen);
    var off = 0;
    for (var j = 0; j < shazamChunks.length; j++) {
      merged.set(shazamChunks[j], off);
      off += shazamChunks[j].length;
    }
    shazamChunks = [];

    if (totalLen < 8000) { // less than 0.5s of audio
      shazamSetState("idle");
      showToast("Enregistrement trop court");
      return;
    }

    // Convert to WAV blob
    var wavBlob = shazamFloat32ToWav(merged, 16000);
    shazamAnalyze(wavBlob);
  }

  function shazamFloat32ToWav(samples, sampleRate) {
    var numSamples = samples.length;
    var buffer = new ArrayBuffer(44 + numSamples * 2);
    var view = new DataView(buffer);

    function writeStr(offset, str) {
      for (var i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    }

    writeStr(0, "RIFF");
    view.setUint32(4, 36 + numSamples * 2, true);
    writeStr(8, "WAVE");
    writeStr(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // byte rate
    view.setUint16(32, 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample

    writeStr(36, "data");
    view.setUint32(40, numSamples * 2, true);

    for (var i = 0; i < numSamples; i++) {
      var s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return new Blob([buffer], { type: "audio/wav" });
  }

  async function shazamAnalyze(wavBlob) {
    shazamSetState("analyzing");
    try {
      // Convert WAV blob to base64 — required for Capacitor iOS (CapacitorHttp cannot serialize Blob bodies)
      var arrayBuffer = await wavBlob.arrayBuffer();
      var uint8 = new Uint8Array(arrayBuffer);
      var binary = "";
      for (var i = 0; i < uint8.length; i++) binary += String.fromCharCode(uint8[i]);
      var base64Audio = btoa(binary);

      var resp = await fetch(SHAZAM_PROXY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio: base64Audio })
      });

      if (resp.status === 503) {
        $("shazam-status").textContent = "Chargement du modèle… veuillez patienter";
        await new Promise(function (r) { setTimeout(r, 5000); });
        resp = await fetch(SHAZAM_PROXY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audio: base64Audio })
        });
      }

      if (!resp.ok) {
        var errText = await resp.text();
        throw new Error("Erreur serveur " + resp.status + ": " + errText.substring(0, 100));
      }

      var data = await resp.json();
      var transcription = "";
      if (data && data.text) {
        transcription = data.text;
      } else if (Array.isArray(data) && data[0] && data[0].text) {
        transcription = data[0].text;
      }

      if (!transcription || transcription.trim().length < 3) {
        shazamShowError("Aucune récitation détectée. Réessayez dans un endroit moins bruyant.");
        return;
      }

      // Log transcription for debugging (hidden from user)
      console.log("[Shazam] Transcription brute:", transcription);

      shazamMatchVerse(transcription);

    } catch (err) {
      shazamShowError("Erreur : " + (err.message || "Connexion échouée"));
    }
  }

  function shazamMatchVerse(transcription) {
    var normTranscript = normalizeArabic(transcription);
    var tWords = normTranscript.split(/\s+/).filter(function (w) { return w.length > 1; });
    var tLen = normTranscript.length;

    console.log("[Shazam] Normalisée:", normTranscript);
    console.log("[Shazam] Mots:", tWords.length, "| Caractères:", tLen);

    if (tLen < 5 || tWords.length < 1) {
      shazamShowError("Transcription trop courte. Réessayez plus longtemps.");
      return;
    }

    $("shazam-status").textContent = "Recherche du verset…";

    // Build transcript word set for fast lookup
    var tWordSet = {};
    for (var i = 0; i < tWords.length; i++) {
      tWordSet[tWords[i]] = (tWordSet[tWords[i]] || 0) + 1;
    }

    // ---- STAGE 1: Fast word-overlap screening on ALL verses ----
    var candidates = [];

    for (var s = 0; s < shazamWordCache.length; s++) {
      var surahWords = shazamWordCache[s];
      for (var a = 0; a < surahWords.length; a++) {
        var vWords = surahWords[a];
        if (vWords.length < 1) continue;

        // Count how many transcript words appear in the verse
        var matchCount = 0;
        for (var w = 0; w < tWords.length; w++) {
          for (var v = 0; v < vWords.length; v++) {
            if (tWords[w] === vWords[v]) { matchCount++; break; }
          }
        }

        if (matchCount === 0) continue;

        // Containment: what fraction of transcript words are in this verse
        var containment = matchCount / tWords.length;
        // Jaccard: overlap / union
        var unionSize = tWords.length + vWords.length - matchCount;
        var jaccard = unionSize > 0 ? matchCount / unionSize : 0;
        // Pre-score: weighted blend
        var preScore = containment * 0.6 + jaccard * 0.4;

        candidates.push({ s: s, a: a, pre: preScore });
      }
    }

    // Sort by pre-score and keep top 50
    candidates.sort(function (a, b) { return b.pre - a.pre; });
    candidates = candidates.slice(0, 50);

    console.log("[Shazam] Stage 1:", candidates.length, "candidats | Top:", (candidates[0] ? candidates[0].pre.toFixed(3) : "N/A"));

    // ---- STAGE 2: Levenshtein on top candidates ----
    var bestScore = -1;
    var bestSurah = -1;
    var bestAyah = -1;

    for (var c = 0; c < candidates.length; c++) {
      var cand = candidates[c];
      var normVerse = shazamNormalizedCache[cand.s][cand.a];
      var vLen = normVerse.length;
      var dist, levScore;

      // Length filter: skip very mismatched lengths
      if (vLen < tLen * 0.15 || tLen < vLen * 0.15) continue;

      if (tLen <= vLen * 1.5 && tLen >= vLen * 0.5) {
        // Similar length — direct Levenshtein
        dist = levenshtein(normTranscript, normVerse);
        levScore = 1 - (dist / Math.max(tLen, vLen));
      } else if (tLen < vLen) {
        // Transcript shorter than verse — slide window
        var bestWin = 0;
        var wSize = tLen;
        var step = Math.max(1, Math.floor(wSize / 4));
        for (var w = 0; w <= vLen - wSize; w += step) {
          dist = levenshtein(normTranscript, normVerse.substring(w, w + wSize));
          var ws = 1 - (dist / wSize);
          if (ws > bestWin) bestWin = ws;
          if (bestWin > 0.9) break;
        }
        levScore = bestWin;
      } else {
        // Transcript longer than verse — slide verse window over transcript
        var bestWin2 = 0;
        var wSize2 = vLen;
        var step2 = Math.max(1, Math.floor(wSize2 / 4));
        for (var w2 = 0; w2 <= tLen - wSize2; w2 += step2) {
          dist = levenshtein(normTranscript.substring(w2, w2 + wSize2), normVerse);
          var ws2 = 1 - (dist / wSize2);
          if (ws2 > bestWin2) bestWin2 = ws2;
          if (bestWin2 > 0.9) break;
        }
        levScore = bestWin2;
      }

      // Final score: blend word-overlap pre-score with Levenshtein
      var finalScore = levScore * 0.65 + cand.pre * 0.35;

      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestSurah = cand.s;
        bestAyah = cand.a;
      }
    }

    console.log("[Shazam] Résultat: Surah", bestSurah + 1, "Ayah", bestAyah + 1, "Score:", bestScore.toFixed(3));

    if (bestScore >= 0.30 && bestSurah >= 0) {
      shazamShowResult(bestSurah, bestAyah, bestScore);
    } else {
      shazamShowError("Verset non identifié (score: " + (bestScore * 100).toFixed(0) + "%). Réessayez avec un enregistrement plus long ou plus clair.");
    }
  }

  var shazamResultScore = 0;

  function shazamShowResult(surahIdx, ayahIdx, score) {
    shazamResultSurah = surahIdx;
    shazamResultAyah = ayahIdx;
    shazamResultScore = score;

    // Step 1: Show "found" animation with checkmark
    shazamSetState("found");

    // Step 2: After animation, populate and show result card
    setTimeout(function () {
      shazamPopulateResult();
      shazamSetState("result");
    }, 1300);
  }

  function shazamPopulateResult() {
    var surah = surahs[shazamResultSurah];
    var surahNum = surah.surahNumber;
    var surahNameFr = SURAH_NAMES_FR[surahNum] || "";
    var surahNameAr = surah.surahNameAr || "";
    var verseNum = shazamResultAyah + 1;
    var verseText = surah.ayahs[shazamResultAyah];
    var pct = Math.round(shazamResultScore * 100);

    $("shazam-result-surah-fr").textContent = surahNameFr;
    $("shazam-result-surah-ar").textContent = surahNameAr;
    $("shazam-result-num").textContent = "Sourate " + surahNum;
    $("shazam-result-verse-num").textContent = "Verset " + verseNum;
    $("shazam-result-pct").textContent = pct + "%";
    $("shazam-result-text").textContent = "\uFD3F " + verseText + " \uFD3E";

    // Update nav button visibility
    $("shazam-prev").style.visibility = shazamResultAyah > 0 ? "visible" : "hidden";
    $("shazam-next").style.visibility = shazamResultAyah < surah.ayahs.length - 1 ? "visible" : "hidden";
  }

  function shazamNavVerse(dir) {
    var surah = surahs[shazamResultSurah];
    var newAyah = shazamResultAyah + dir;
    if (newAyah < 0 || newAyah >= surah.ayahs.length) return;
    shazamResultAyah = newAyah;

    // Animate text change
    var textEl = $("shazam-result-text");
    var verseEl = $("shazam-result-verse-num");
    textEl.style.opacity = "0";
    textEl.style.transform = dir > 0 ? "translateX(-12px)" : "translateX(12px)";

    setTimeout(function () {
      verseEl.textContent = "Verset " + (newAyah + 1);
      textEl.textContent = "\uFD3F " + surah.ayahs[newAyah] + " \uFD3E";
      textEl.style.transform = dir > 0 ? "translateX(12px)" : "translateX(-12px)";

      // Trigger reflow then animate in
      void textEl.offsetWidth;
      textEl.style.opacity = "1";
      textEl.style.transform = "translateX(0)";

      // Update nav visibility
      $("shazam-prev").style.visibility = newAyah > 0 ? "visible" : "hidden";
      $("shazam-next").style.visibility = newAyah < surah.ayahs.length - 1 ? "visible" : "hidden";
    }, 150);
  }

  function shazamShowError(msg) {
    $("shazam-error-msg").textContent = msg || "Verset non identifié";
    shazamSetState("error");
  }

  function shazamToggle() {
    if (shazamIsRecording) {
      shazamStopListening(false);
    } else {
      // Reset UI if was showing result/error
      shazamStartListening();
    }
  }

  function shazamGoToVerse() {
    if (shazamResultSurah >= 0 && shazamResultAyah >= 0) {
      closeShazamOverlay();
      jumpToPosition(shazamResultSurah, shazamResultAyah);
    }
  }

  function normalizeArabic(text) {
    return text
      // Remove all diacritics, Quranic marks and extended Arabic annotation signs
      .replace(/[\u064B-\u065F\u0610-\u061A\u06D6-\u06ED\u0670]/g, "")
      // Remove tatweel / kashida
      .replace(/\u0640/g, "")
      // Normalize all alef variants (madda, hamza above, hamza below, wasla, superscript) → plain alef
      .replace(/[\u0622\u0623\u0625\u0671\u0672\u0673\u0675]/g, "\u0627")
      // Standalone hamza → alef
      .replace(/\u0621/g, "\u0627")
      // Waw with hamza above → waw
      .replace(/\u0624/g, "\u0648")
      // Ya with hamza above → ya
      .replace(/\u0626/g, "\u064A")
      // Alef maqsura → ya
      .replace(/\u0649/g, "\u064A")
      // Taa marbuta → ha
      .replace(/\u0629/g, "\u0647")
      // Normalize lam-alef ligature variants
      .replace(/[\uFEFB\uFEFC\uFEF5\uFEF6\uFEF7\uFEF8]/g, "\u0644\u0627")
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


  // ============================================================
  // EMOTION WHEEL — DATA & FUNCTIONS
  // ============================================================
  var EMOTION_WORDS = ["Gratitude","Tristesse","Col\u00e8re","Solitude","Doute","Amour","Joie","Repentir","Paresse","Angoisse","Peur","D\u00e9tresse","Espoir","Regret","Honte","Envie","Haine","Orgueil"];
  var emotionIndex = 0;
  var wheelOffset = 0;

  var EMOTION_DATA = {
    "Gratitude": {
      gradient: "linear-gradient(165deg, #1a2a3a 0%, #15253a 30%, #102035 60%, #0f1f2f 100%)",
      articleBg: "rgba(10,20,30,0.95)",
      quote: "Celui qui ne remercie pas les gens ne remercie pas Allah.",
      turnTowards: [
        "Le dhikr et la louange d\u2019Allah en tout temps",
        "La pri\u00e8re de gratitude (sujud ash-shukr)",
        "Le partage de ses bienfaits avec les autres",
        "La contemplation des bienfaits d\u2019Allah",
        "La patience dans l\u2019\u00e9preuve comme forme de gratitude"
      ],
      guardAgainst: [
        "L\u2019ing\u00e9ratitude et l\u2019oubli des bienfaits",
        "La comparaison envieuse avec autrui",
        "L\u2019orgueil de croire m\u00e9riter ses bienfaits",
        "La plainte excessive",
        "Le gaspillage des ressources"
      ],
      article: {
        title: "Versets et hadiths sur la gratitude",
        entries: [
          {type:"verset",ref:"Ibrahim 14:7",ar:"\u0648\u0625\u0650\u0630\u0652 \u062a\u0623\u0630\u0651\u0646 \u0631\u0628\u0651\u0643\u0645 \u0644\u0626\u0650\u0646 \u0634\u0643\u0631\u062a\u0645 \u0644\u0623\u0632\u064a\u062f\u0646\u0651\u0643\u0645 \u0648\u0644\u0626\u0650\u0646 \u0643\u0641\u0631\u062a\u0645 \u0625\u0650\u0646\u0651 \u0639\u0630\u0627\u0628\u064a \u0644\u0634\u062f\u064a\u062f",fr:"Et lorsque votre Seigneur proclama : \u00abSi vous \u00eates reconnaissants, tr\u00e8s certainement J\u2019augmenterai Mes bienfaits pour vous.\u00bb",commentary:"Allah lie directement l\u2019augmentation des bienfaits \u00e0 la gratitude. Le shukr (reconnaissance) est la cl\u00e9 de l\u2019abondance divine."},
          {type:"verset",ref:"An-Nahl 16:18",ar:"\u0648\u0625\u0650\u0646 \u062a\u0639\u062f\u0651\u0648\u0627 \u0646\u0639\u0645\u0629 \u0627\u0644\u0644\u0651\u0647 \u0644\u0627 \u062a\u062d\u0635\u0648\u0647\u0627 \u0625\u0650\u0646\u0651 \u0627\u0644\u0644\u0651\u0647 \u0644\u063a\u0641\u0648\u0631 \u0631\u062d\u064a\u0645",fr:"Et si vous comptiez les bienfaits d\u2019Allah, vous ne sauriez les d\u00e9nombrer. Allah est Pardonneur et Mis\u00e9ricordieux.",commentary:"Les bienfaits d\u2019Allah sont innombrables. Cette prise de conscience est le fondement de la gratitude."},
          {type:"verset",ref:"Al-Baqarah 2:152",ar:"\u0641\u0627\u0630\u0643\u0631\u0648\u0646\u064a \u0623\u0630\u0643\u0631\u0643\u0645 \u0648\u0627\u0634\u0643\u0631\u0648\u0627 \u0644\u064a \u0648\u0644\u0627 \u062a\u0643\u0641\u0631\u0648\u0646",fr:"Souvenez-vous de Moi, Je me souviendrai de vous. Soyez reconnaissants envers Moi et ne Me reniez pas.",commentary:"Le dhikr et le shukr sont indissociables. Se souvenir d\u2019Allah m\u00e8ne \u00e0 la gratitude."},
          {type:"hadith",ref:"Muslim 2999",ar:"\u0639\u062c\u0628\u0627 \u0644\u0623\u0645\u0631 \u0627\u0644\u0645\u0624\u0645\u0646 \u0625\u0650\u0646\u0651 \u0623\u0645\u0631\u0647 \u0643\u0644\u0651\u0647 \u062e\u064a\u0631",fr:"Comme l\u2019affaire du croyant est \u00e9tonnante ! Tout ce qui lui arrive est un bien.",commentary:"Le Proph\u00e8te \u2014 paix et salut sur lui \u2014 nous enseigne que le croyant est reconnaissant dans l\u2019ais\u00e9 et patient dans l\u2019\u00e9preuve."},
          {type:"hadith",ref:"Tirmidhi 2517",ar:"\u0627\u0646\u0638\u0631\u0648\u0627 \u0625\u0650\u0644\u0649 \u0645\u0646 \u0647\u0648 \u0623\u0633\u0641\u0644 \u0645\u0646\u0643\u0645 \u0648\u0644\u0627 \u062a\u0646\u0638\u0631\u0648\u0627 \u0625\u0650\u0644\u0649 \u0645\u0646 \u0647\u0648 \u0641\u0648\u0642\u0643\u0645",fr:"Regardez ceux qui sont en dessous de vous et ne regardez pas ceux qui sont au-dessus.",commentary:"Cette parole proph\u00e9tique est une cl\u00e9 pratique pour cultiver la gratitude au quotidien."}
        ]
      }
    },
    "Tristesse": {
      gradient: "linear-gradient(165deg, #1a1a2e 0%, #16162a 30%, #111125 60%, #0f0f1a 100%)",
      articleBg: "rgba(12,12,22,0.95)",
      quote: "Apr\u00e8s la difficult\u00e9, vient la facilit\u00e9.",
      turnTowards: [
        "La pri\u00e8re et la prosternation sinc\u00e8re",
        "La lecture et la m\u00e9ditation du Coran",
        "L\u2019invocation d\u2019Allah avec humilit\u00e9",
        "La compagnie des vertueux",
        "La confiance en la sagesse du d\u00e9cret divin"
      ],
      guardAgainst: [
        "L\u2019isolement prolong\u00e9 et le repli sur soi",
        "Le d\u00e9sespoir de la mis\u00e9ricorde d\u2019Allah",
        "La plainte aupr\u00e8s des cr\u00e9atures au lieu du Cr\u00e9ateur",
        "La n\u00e9gligence de la pri\u00e8re",
        "La recherche de consolation dans le haram"
      ],
      article: {
        title: "Versets et hadiths sur la tristesse",
        entries: [
          {type:"verset",ref:"Ash-Sharh 94:5-6",ar:"\u0641\u0625\u0650\u0646\u0651 \u0645\u0639 \u0627\u0644\u0639\u0633\u0631 \u064a\u0633\u0631\u0627 \u0625\u0650\u0646\u0651 \u0645\u0639 \u0627\u0644\u0639\u0633\u0631 \u064a\u0633\u0631\u0627",fr:"Car apr\u00e8s la difficult\u00e9, il y a certes une facilit\u00e9. Oui, apr\u00e8s la difficult\u00e9, il y a certes une facilit\u00e9.",commentary:"Allah r\u00e9p\u00e8te cette promesse deux fois pour renforcer l\u2019espoir. La difficult\u00e9 est toujours suivie d\u2019une facilit\u00e9."},
          {type:"verset",ref:"Al-Baqarah 2:286",ar:"\u0644\u0627 \u064a\u0643\u0644\u0651\u0641 \u0627\u0644\u0644\u0651\u0647 \u0646\u0641\u0633\u0627 \u0625\u0650\u0644\u0651\u0627 \u0648\u0633\u0639\u0647\u0627",fr:"Allah n\u2019impose \u00e0 aucune \u00e2me une charge sup\u00e9rieure \u00e0 sa capacit\u00e9.",commentary:"Chaque \u00e9preuve est \u00e0 la mesure de nos forces. Allah sait ce que nous pouvons endurer."},
          {type:"verset",ref:"Yusuf 12:86",ar:"\u0625\u0650\u0646\u0651\u0645\u0627 \u0623\u0634\u0643\u0648 \u0628\u062b\u0651\u064a \u0648\u062d\u0632\u0646\u064a \u0625\u0650\u0644\u0649 \u0627\u0644\u0644\u0651\u0647",fr:"Je ne me plains de ma tristesse et de mon chagrin qu\u2019\u00e0 Allah.",commentary:"Le prophète Ya\u2019qub nous enseigne que la plainte doit \u00eatre adress\u00e9e \u00e0 Allah seul."},
          {type:"hadith",ref:"Bukhari 5641",ar:"\u0645\u0627 \u064a\u0635\u064a\u0628 \u0627\u0644\u0645\u0633\u0644\u0645 \u0645\u0646 \u0646\u0635\u0628 \u0648\u0644\u0627 \u0648\u0635\u0628 \u0648\u0644\u0627 \u0647\u0645\u0651 \u0648\u0644\u0627 \u062d\u0632\u0646",fr:"Aucune fatigue, maladie, souci ou tristesse n\u2019atteint le musulman sans qu\u2019Allah ne lui efface par cela une partie de ses p\u00e9ch\u00e9s.",commentary:"Chaque difficult\u00e9 est une expiation. La tristesse elle-m\u00eame peut devenir source de purification."},
          {type:"hadith",ref:"Muslim 2999",ar:"\u0625\u0650\u0646\u0651 \u0639\u0638\u0645 \u0627\u0644\u062c\u0632\u0627\u0621 \u0645\u0639 \u0639\u0638\u0645 \u0627\u0644\u0628\u0644\u0627\u0621",fr:"La grandeur de la r\u00e9compense est proportionnelle \u00e0 la grandeur de l\u2019\u00e9preuve.",commentary:"Plus l\u2019\u00e9preuve est grande, plus la r\u00e9compense d\u2019Allah est immense pour celui qui patiente."}
        ]
      }
    },
    "Col\u00e8re": {
      gradient: "linear-gradient(165deg, #2a1a1a 0%, #251515 30%, #1f1010 60%, #1a0f0f 100%)",
      articleBg: "rgba(22,10,10,0.95)",
      quote: "Le fort n\u2019est pas celui qui terrasse, mais celui qui se ma\u00eetrise.",
      turnTowards: [
        "La demande de refuge aupr\u00e8s d\u2019Allah (a\u2019udhu billah)",
        "Le changement de position (s\u2019asseoir, s\u2019allonger)",
        "Les ablutions \u00e0 l\u2019eau fra\u00eeche",
        "Le silence jusqu\u2019au retour au calme",
        "Le rappel des cons\u00e9quences de la col\u00e8re"
      ],
      guardAgainst: [
        "Les paroles et d\u00e9cisions prises sous la col\u00e8re",
        "La violence physique ou verbale",
        "La destruction des liens familiaux",
        "L\u2019injustice envers les faibles",
        "L\u2019orgueil qui refuse de pardonner"
      ],
      article: {
        title: "Versets et hadiths sur la col\u00e8re",
        entries: [
          {type:"verset",ref:"Al Imran 3:134",ar:"\u0627\u0644\u0643\u0627\u0638\u0645\u064a\u0646 \u0627\u0644\u063a\u064a\u0638 \u0648\u0627\u0644\u0639\u0627\u0641\u064a\u0646 \u0639\u0646 \u0627\u0644\u0646\u0651\u0627\u0633 \u0648\u0627\u0644\u0644\u0651\u0647 \u064a\u062d\u0628\u0651 \u0627\u0644\u0645\u062d\u0633\u0646\u064a\u0646",fr:"Ceux qui dominent leur col\u00e8re et pardonnent aux gens. Allah aime les bienfaisants.",commentary:"Ma\u00eetriser sa col\u00e8re est un acte d\u2019ihsan (excellence). Allah aime celui qui s\u2019y efforce."},
          {type:"verset",ref:"Ash-Shura 42:37",ar:"\u0648\u0627\u0644\u0651\u0630\u064a\u0646 \u064a\u062c\u062a\u0646\u0628\u0648\u0646 \u0643\u0628\u0627\u0626\u0631 \u0627\u0644\u0625\u0650\u062b\u0645 \u0648\u0627\u0644\u0641\u0648\u0627\u062d\u0634 \u0648\u0625\u0650\u0630\u0627 \u0645\u0627 \u063a\u0636\u0628\u0648\u0627 \u0647\u0645 \u064a\u063a\u0641\u0631\u0648\u0646",fr:"Ceux qui \u00e9vitent les grands p\u00e9ch\u00e9s et les turpitudes, et qui pardonnent lorsqu\u2019ils sont en col\u00e8re.",commentary:"Le pardon dans la col\u00e8re est une caract\u00e9ristique des croyants que le Coran loue."},
          {type:"verset",ref:"Al-A\u2019raf 7:199",ar:"\u062e\u0630 \u0627\u0644\u0639\u0641\u0648 \u0648\u0623\u0645\u0631 \u0628\u0627\u0644\u0639\u0631\u0641 \u0648\u0623\u0639\u0631\u0636 \u0639\u0646 \u0627\u0644\u062c\u0627\u0647\u0644\u064a\u0646",fr:"Accepte ce qu\u2019on t\u2019offre de raisonnable, commande le bien et \u00e9loigne-toi des ignorants.",commentary:"Allah ordonne de se d\u00e9tourner de ce qui provoque la col\u00e8re plut\u00f4t que de r\u00e9pondre."},
          {type:"hadith",ref:"Bukhari 6116",ar:"\u0644\u064a\u0633 \u0627\u0644\u0634\u0651\u062f\u064a\u062f \u0628\u0627\u0644\u0635\u0651\u0631\u0639\u0629 \u0625\u0650\u0646\u0651\u0645\u0627 \u0627\u0644\u0634\u0651\u062f\u064a\u062f \u0627\u0644\u0651\u0630\u064a \u064a\u0645\u0644\u0643 \u0646\u0641\u0633\u0647 \u0639\u0646\u062f \u0627\u0644\u063a\u0636\u0628",fr:"Le fort n\u2019est pas celui qui terrasse les gens, mais celui qui se domine lorsqu\u2019il est en col\u00e8re.",commentary:"Le Proph\u00e8te red\u00e9finit la force v\u00e9ritable : c\u2019est la ma\u00eetrise de soi, non la puissance physique."},
          {type:"hadith",ref:"Abu Dawud 4782",ar:"\u0625\u0650\u0630\u0627 \u063a\u0636\u0628 \u0623\u062d\u062f\u0643\u0645 \u0648\u0647\u0648 \u0642\u0627\u0626\u0645 \u0641\u0644\u064a\u062c\u0644\u0633 \u0641\u0625\u0650\u0646 \u0644\u0645 \u064a\u0630\u0647\u0628 \u0639\u0646\u0647 \u0641\u0644\u064a\u0636\u0637\u062c\u0639",fr:"Lorsque l\u2019un de vous se met en col\u00e8re et qu\u2019il est debout, qu\u2019il s\u2019assoie. Si cela ne passe pas, qu\u2019il s\u2019allonge.",commentary:"Le Proph\u00e8te donne un rem\u00e8de concret et physique pour apaiser la col\u00e8re."}
        ]
      }
    },
    "Solitude": {
      gradient: "linear-gradient(165deg, #1a1a2a 0%, #161628 30%, #101022 60%, #0f0f1e 100%)",
      articleBg: "rgba(12,12,25,0.95)",
      quote: "Allah est avec ceux qui patientent.",
      turnTowards: [
        "L\u2019intimit\u00e9 avec Allah dans la pri\u00e8re de nuit",
        "La fr\u00e9quentation de la mosqu\u00e9e",
        "Le maintien des liens de parent\u00e9",
        "L\u2019aide aux n\u00e9cessiteux",
        "Le dhikr abondant pour apaiser le c\u0153ur"
      ],
      guardAgainst: [
        "L\u2019isolement volontaire excessif",
        "Le sentiment d\u2019\u00eatre abandonn\u00e9 par Allah",
        "La d\u00e9pendance affective aux cr\u00e9atures",
        "Les fr\u00e9quentations n\u00e9fastes par d\u00e9sespoir",
        "La n\u00e9gligence des obligations communautaires"
      ],
      article: {
        title: "Versets et hadiths sur la solitude",
        entries: [
          {type:"verset",ref:"Al-Baqarah 2:186",ar:"\u0648\u0625\u0650\u0630\u0627 \u0633\u0623\u0644\u0643 \u0639\u0628\u0627\u062f\u064a \u0639\u0646\u0651\u064a \u0641\u0625\u0650\u0646\u0651\u064a \u0642\u0631\u064a\u0628 \u0623\u062c\u064a\u0628 \u062f\u0639\u0648\u0629 \u0627\u0644\u062f\u0651\u0627\u0639\u064a \u0625\u0650\u0630\u0627 \u062f\u0639\u0627\u0646\u064a",fr:"Et quand Mes serviteurs t\u2019interrogent sur Moi, Je suis tout proche. Je r\u00e9ponds \u00e0 l\u2019appel de celui qui M\u2019invoque.",commentary:"Allah est proche de chacun. La solitude est une illusion quand on se tourne vers Lui."},
          {type:"verset",ref:"At-Tawbah 9:40",ar:"\u0644\u0627 \u062a\u062d\u0632\u0646 \u0625\u0650\u0646\u0651 \u0627\u0644\u0644\u0651\u0647 \u0645\u0639\u0646\u0627",fr:"Ne sois pas triste, car Allah est avec nous.",commentary:"Parole d\u2019Abu Bakr au Proph\u00e8te dans la grotte. M\u00eame dans la solitude la plus totale, Allah est pr\u00e9sent."},
          {type:"verset",ref:"Al-Hadid 57:4",ar:"\u0648\u0647\u0648 \u0645\u0639\u0643\u0645 \u0623\u064a\u0646\u0645\u0627 \u0643\u0646\u062a\u0645",fr:"Et Il est avec vous o\u00f9 que vous soyez.",commentary:"La compagnie d\u2019Allah (ma\u2019iyyah) est permanente et universelle."},
          {type:"hadith",ref:"Bukhari 6502 (hadith qudsi)",ar:"\u0645\u0627 \u064a\u0632\u0627\u0644 \u0639\u0628\u062f\u064a \u064a\u062a\u0642\u0631\u0651\u0628 \u0625\u0650\u0644\u064a\u0651 \u0628\u0627\u0644\u0646\u0651\u0648\u0627\u0641\u0644 \u062d\u062a\u0651\u0649 \u0623\u062d\u0628\u0651\u0647",fr:"Mon serviteur ne cesse de se rapprocher de Moi par les \u0153uvres surr\u00e9rogatoires jusqu\u2019\u00e0 ce que Je l\u2019aime.",commentary:"La proximit\u00e9 divine se cultive par les actes volontaires d\u2019adoration."},
          {type:"hadith",ref:"Tirmidhi 2516",ar:"\u0627\u062d\u0641\u0638 \u0627\u0644\u0644\u0651\u0647 \u064a\u062d\u0641\u0638\u0643 \u0627\u062d\u0641\u0638 \u0627\u0644\u0644\u0651\u0647 \u062a\u062c\u062f\u0647 \u062a\u062c\u0627\u0647\u0643",fr:"Pr\u00e9serve Allah, Il te pr\u00e9servera. Pr\u00e9serve Allah, tu Le trouveras face \u00e0 toi.",commentary:"Celui qui reste fid\u00e8le \u00e0 Allah ne sera jamais v\u00e9ritablement seul."}
        ]
      }
    },
    "Doute": {
      gradient: "linear-gradient(165deg, #1e1e28 0%, #1a1a24 30%, #15151e 60%, #121218 100%)",
      articleBg: "rgba(14,14,20,0.95)",
      quote: "Demandez \u00e0 Allah la certitude et la s\u00e9r\u00e9nit\u00e9.",
      turnTowards: [
        "La qu\u00eate de science religieuse authentique",
        "La compagnie des savants et des vertueux",
        "La m\u00e9ditation profonde sur la cr\u00e9ation",
        "La demande de guidance dans la pri\u00e8re",
        "La lecture r\u00e9guli\u00e8re du Coran avec compr\u00e9hension"
      ],
      guardAgainst: [
        "Les d\u00e9bats st\u00e9riles sur la foi",
        "La fr\u00e9quentation de ceux qui s\u00e8ment le doute",
        "L\u2019exc\u00e8s de philosophie sans ancrage spirituel",
        "Le waswas (chuchotements sataniques)",
        "La pr\u00e9tention de tout comprendre par la raison seule"
      ],
      article: {
        title: "Versets et hadiths sur le doute et la certitude",
        entries: [
          {type:"verset",ref:"Al-Baqarah 2:2",ar:"\u0630\u0644\u0643 \u0627\u0644\u0643\u062a\u0627\u0628 \u0644\u0627 \u0631\u064a\u0628 \u0641\u064a\u0647 \u0647\u062f\u0649 \u0644\u0644\u0645\u062a\u0651\u0642\u064a\u0646",fr:"C\u2019est le Livre au sujet duquel il n\u2019y a aucun doute, guide pour les pieux.",commentary:"Le Coran est pr\u00e9sent\u00e9 comme la r\u00e9ponse absolue au doute."},
          {type:"verset",ref:"Al-Hujurat 49:15",ar:"\u0625\u0650\u0646\u0651\u0645\u0627 \u0627\u0644\u0645\u0624\u0645\u0646\u0648\u0646 \u0627\u0644\u0651\u0630\u064a\u0646 \u0622\u0645\u0646\u0648\u0627 \u0628\u0627\u0644\u0644\u0651\u0647 \u0648\u0631\u0633\u0648\u0644\u0647 \u062b\u0645\u0651 \u0644\u0645 \u064a\u0631\u062a\u0627\u0628\u0648\u0627",fr:"Les vrais croyants sont ceux qui croient en Allah et en Son Messager, puis ne doutent point.",commentary:"La foi v\u00e9ritable est celle qui d\u00e9passe le doute et atteint la certitude (yaqin)."},
          {type:"verset",ref:"Ar-Ra\u2019d 13:28",ar:"\u0623\u0644\u0627 \u0628\u0630\u0643\u0631 \u0627\u0644\u0644\u0651\u0647 \u062a\u0637\u0645\u0626\u0646\u0651 \u0627\u0644\u0642\u0644\u0648\u0628",fr:"N\u2019est-ce point par le rappel d\u2019Allah que se tranquillisent les c\u0153urs ?",commentary:"Le dhikr est le rem\u00e8de au doute et \u00e0 l\u2019anxi\u00e9t\u00e9 du c\u0153ur."},
          {type:"hadith",ref:"Muslim 132",ar:"\u064a\u0623\u062a\u064a \u0627\u0644\u0634\u0651\u064a\u0637\u0627\u0646 \u0623\u062d\u062f\u0643\u0645 \u0641\u064a\u0642\u0648\u0644 \u0645\u0646 \u062e\u0644\u0642 \u0643\u0630\u0627 \u0641\u0625\u0650\u0630\u0627 \u0628\u0644\u063a\u0647 \u0641\u0644\u064a\u0633\u062a\u0639\u0630 \u0628\u0627\u0644\u0644\u0651\u0647 \u0648\u0644\u064a\u0646\u062a\u0647",fr:"Le diable vient \u00e0 l\u2019un de vous et dit : \u00abQui a cr\u00e9\u00e9 ceci ?\u00bb Qu\u2019il cherche refuge aupr\u00e8s d\u2019Allah et qu\u2019il cesse.",commentary:"Le Proph\u00e8te enseigne que le doute satanique se combat par l\u2019isti\u2019adha (demande de refuge)."},
          {type:"hadith",ref:"Muslim 133",ar:"\u0630\u0627\u0643 \u0635\u0631\u064a\u062d \u0627\u0644\u0625\u064a\u0645\u0627\u0646",fr:"Cela est la preuve de la foi sinc\u00e8re.",commentary:"Le fait de d\u00e9tester le doute et de le rejeter est en soi un signe de foi v\u00e9ritable."}
        ]
      }
    },
    "Amour": {
      gradient: "linear-gradient(165deg, #2a1a2a 0%, #251528 30%, #1f1022 60%, #1a0f1a 100%)",
      articleBg: "rgba(22,10,22,0.95)",
      quote: "Aimez Allah pour les bienfaits dont Il vous comble.",
      turnTowards: [
        "L\u2019amour d\u2019Allah par l\u2019ob\u00e9issance",
        "Le suivi du Proph\u00e8te comme preuve d\u2019amour",
        "L\u2019amour fr\u00e8res et s\u0153urs en Allah",
        "La bienveillance envers les parents",
        "L\u2019amour du bien pour autrui"
      ],
      guardAgainst: [
        "L\u2019amour excessif des biens de ce monde",
        "L\u2019attachement aux cr\u00e9atures au d\u00e9triment du Cr\u00e9ateur",
        "L\u2019amour interdit et les relations illicites",
        "La jalousie et la possessivit\u00e9",
        "L\u2019id\u00e9alisation des \u00eatres humains"
      ],
      article: {
        title: "Versets et hadiths sur l\u2019amour",
        entries: [
          {type:"verset",ref:"Al-Baqarah 2:165",ar:"\u0648\u0627\u0644\u0651\u0630\u064a\u0646 \u0622\u0645\u0646\u0648\u0627 \u0623\u0634\u062f\u0651 \u062d\u0628\u0651\u0627 \u0644\u0644\u0651\u0647",fr:"Ceux qui croient sont les plus ardents dans l\u2019amour d\u2019Allah.",commentary:"L\u2019amour du croyant pour Allah surpasse tout autre amour."},
          {type:"verset",ref:"Al Imran 3:31",ar:"\u0642\u0644 \u0625\u0650\u0646 \u0643\u0646\u062a\u0645 \u062a\u062d\u0628\u0651\u0648\u0646 \u0627\u0644\u0644\u0651\u0647 \u0641\u0627\u062a\u0651\u0628\u0639\u0648\u0646\u064a \u064a\u062d\u0628\u0628\u0643\u0645 \u0627\u0644\u0644\u0651\u0647",fr:"Dis : \u00abSi vous aimez Allah, suivez-moi, Allah vous aimera.\u00bb",commentary:"L\u2019amour d\u2019Allah se prouve par le suivi du Proph\u00e8te. C\u2019est le test de l\u2019amour v\u00e9ritable."},
          {type:"verset",ref:"Al-Maidah 5:54",ar:"\u064a\u062d\u0628\u0651\u0647\u0645 \u0648\u064a\u062d\u0628\u0651\u0648\u0646\u0647 \u0623\u0630\u0644\u0651\u0629 \u0639\u0644\u0649 \u0627\u0644\u0645\u0624\u0645\u0646\u064a\u0646",fr:"Il les aime et ils L\u2019aiment. Humbles envers les croyants.",commentary:"L\u2019amour d\u2019Allah pour Ses serviteurs se manifeste par leur humilit\u00e9 et leur douceur entre eux."},
          {type:"hadith",ref:"Bukhari 6171",ar:"\u0644\u0627 \u064a\u0624\u0645\u0646 \u0623\u062d\u062f\u0643\u0645 \u062d\u062a\u0651\u0649 \u0623\u0643\u0648\u0646 \u0623\u062d\u0628\u0651 \u0625\u0650\u0644\u064a\u0647 \u0645\u0646 \u0648\u0627\u0644\u062f\u0647 \u0648\u0648\u0644\u062f\u0647 \u0648\u0627\u0644\u0646\u0651\u0627\u0633 \u0623\u062c\u0645\u0639\u064a\u0646",fr:"Nul d\u2019entre vous ne croit v\u00e9ritablement jusqu\u2019\u00e0 ce que je sois plus aim\u00e9 de lui que son p\u00e8re, son fils et tous les gens.",commentary:"L\u2019amour du Proph\u00e8te est une condition de la foi compl\u00e8te."},
          {type:"hadith",ref:"Muslim 2567",ar:"\u0648\u0627\u0644\u0651\u0630\u064a \u0646\u0641\u0633\u064a \u0628\u064a\u062f\u0647 \u0644\u0627 \u062a\u062f\u062e\u0644\u0648\u0627 \u0627\u0644\u062c\u0646\u0651\u0629 \u062d\u062a\u0651\u0649 \u062a\u0624\u0645\u0646\u0648\u0627 \u0648\u0644\u0627 \u062a\u0624\u0645\u0646\u0648\u0627 \u062d\u062a\u0651\u0649 \u062a\u062d\u0627\u0628\u0651\u0648\u0627",fr:"Vous n\u2019entrerez pas au Paradis tant que vous ne croirez pas, et vous ne croirez pas tant que vous ne vous aimerez pas.",commentary:"L\u2019amour fr\u00e8res en foi est un pilier de la communaut\u00e9 musulmane."}
        ]
      }
    },
    "Joie": {
      gradient: "linear-gradient(165deg, #1a2a20 0%, #152a1e 30%, #101f18 60%, #0f1f18 100%)",
      articleBg: "rgba(10,22,15,0.95)",
      quote: "Dis : par la gr\u00e2ce d\u2019Allah et Sa mis\u00e9ricorde, qu\u2019ils s\u2019en r\u00e9jouissent.",
      turnTowards: [
        "Le remerciement d\u2019Allah pour chaque joie",
        "Le partage de la joie avec les proches",
        "La prosternation de gratitude",
        "L\u2019aum\u00f4ne par reconnaissance",
        "Le rappel que toute joie vient d\u2019Allah"
      ],
      guardAgainst: [
        "L\u2019arrogance n\u00e9e du succ\u00e8s",
        "L\u2019oubli d\u2019Allah dans les moments de bonheur",
        "L\u2019attachement excessif aux plaisirs temporaires",
        "La vantardise et l\u2019ostentation",
        "La joie tir\u00e9e du malheur d\u2019autrui"
      ],
      article: {
        title: "Versets et hadiths sur la joie",
        entries: [
          {type:"verset",ref:"Yunus 10:58",ar:"\u0642\u0644 \u0628\u0641\u0636\u0644 \u0627\u0644\u0644\u0651\u0647 \u0648\u0628\u0631\u062d\u0645\u062a\u0647 \u0641\u0628\u0630\u0644\u0643 \u0641\u0644\u064a\u0641\u0631\u062d\u0648\u0627 \u0647\u0648 \u062e\u064a\u0631 \u0645\u0645\u0651\u0627 \u064a\u062c\u0645\u0639\u0648\u0646",fr:"Dis : \u00abC\u2019est par la gr\u00e2ce d\u2019Allah et par Sa mis\u00e9ricorde qu\u2019ils devraient se r\u00e9jouir.\u00bb Cela vaut mieux que tout ce qu\u2019ils amassent.",commentary:"La joie l\u00e9gitime est celle li\u00e9e \u00e0 la gr\u00e2ce et \u00e0 la guidance d\u2019Allah."},
          {type:"verset",ref:"Ar-Rum 30:4-5",ar:"\u064a\u0648\u0645\u0626\u0630 \u064a\u0641\u0631\u062d \u0627\u0644\u0645\u0624\u0645\u0646\u0648\u0646 \u0628\u0646\u0635\u0631 \u0627\u0644\u0644\u0651\u0647",fr:"Ce jour-l\u00e0, les croyants se r\u00e9jouiront du secours d\u2019Allah.",commentary:"La plus grande joie est celle de la victoire d\u2019Allah pour les croyants."},
          {type:"verset",ref:"Al-Inshirah 94:5-6",ar:"\u0641\u0625\u0650\u0646\u0651 \u0645\u0639 \u0627\u0644\u0639\u0633\u0631 \u064a\u0633\u0631\u0627",fr:"Apr\u00e8s la difficult\u00e9 vient certes la facilit\u00e9.",commentary:"La joie apr\u00e8s l\u2019\u00e9preuve est une promesse divine r\u00e9p\u00e9t\u00e9e."},
          {type:"hadith",ref:"Muslim 2675",ar:"\u0644\u0644\u0651\u0647 \u0623\u0634\u062f\u0651 \u0641\u0631\u062d\u0627 \u0628\u062a\u0648\u0628\u0629 \u0639\u0628\u062f\u0647 \u0645\u0646 \u0623\u062d\u062f\u0643\u0645 \u0633\u0642\u0637 \u0639\u0644\u0649 \u0628\u0639\u064a\u0631\u0647",fr:"Allah se r\u00e9jouit davantage du repentir de Son serviteur que l\u2019un de vous qui retrouve son chameau perdu.",commentary:"Allah Lui-m\u00eame se r\u00e9jouit ! La joie divine \u00e0 notre repentir est un motif de bonheur immense."},
          {type:"hadith",ref:"Tirmidhi 2698",ar:"\u062a\u0628\u0633\u0651\u0645\u0643 \u0641\u064a \u0648\u062c\u0647 \u0623\u062e\u064a\u0643 \u0635\u062f\u0642\u0629",fr:"Ton sourire \u00e0 ton fr\u00e8re est une aum\u00f4ne.",commentary:"La joie partag\u00e9e est un acte de charit\u00e9. Le Proph\u00e8te \u00e9tait le plus souriant des hommes."}
        ]
      }
    },
    "Repentir": {
      gradient: "linear-gradient(165deg, #1e2428 0%, #1a2024 30%, #141a1e 60%, #0f1820 100%)",
      articleBg: "rgba(12,18,22,0.95)",
      quote: "Revenez tous \u00e0 Allah, \u00f4 croyants, afin que vous r\u00e9ussissiez.",
      turnTowards: [
        "L\u2019istighfar abondant matin et soir",
        "La pri\u00e8re de repentir (salat at-tawbah)",
        "L\u2019abandon imm\u00e9diat du p\u00e9ch\u00e9",
        "La r\u00e9paration des torts envers autrui",
        "Le renouvellement de l\u2019intention sinc\u00e8re"
      ],
      guardAgainst: [
        "Le report du repentir au lendemain",
        "Le d\u00e9sespoir de la mis\u00e9ricorde d\u2019Allah",
        "La persistance d\u00e9lib\u00e9r\u00e9e dans le p\u00e9ch\u00e9",
        "Le repentir de la langue sans celui du c\u0153ur",
        "La r\u00e9cidive volontaire apr\u00e8s le repentir"
      ],
      article: {
        title: "Versets et hadiths sur le repentir",
        entries: [
          {type:"verset",ref:"Az-Zumar 39:53",ar:"\u0642\u0644 \u064a\u0627 \u0639\u0628\u0627\u062f\u064a \u0627\u0644\u0651\u0630\u064a\u0646 \u0623\u0633\u0631\u0641\u0648\u0627 \u0639\u0644\u0649 \u0623\u0646\u0641\u0633\u0647\u0645 \u0644\u0627 \u062a\u0642\u0646\u0637\u0648\u0627 \u0645\u0646 \u0631\u062d\u0645\u0629 \u0627\u0644\u0644\u0651\u0647 \u0625\u0650\u0646\u0651 \u0627\u0644\u0644\u0651\u0647 \u064a\u063a\u0641\u0631 \u0627\u0644\u0630\u0651\u0646\u0648\u0628 \u062c\u0645\u064a\u0639\u0627",fr:"Dis : \u00abO Mes serviteurs qui avez commis des exc\u00e8s \u00e0 votre propre d\u00e9triment, ne d\u00e9sesp\u00e9rez pas de la mis\u00e9ricorde d\u2019Allah. Car Allah pardonne tous les p\u00e9ch\u00e9s.\u00bb",commentary:"Le verset le plus porteur d\u2019espoir du Coran. Aucun p\u00e9ch\u00e9 n\u2019est trop grand pour le pardon d\u2019Allah."},
          {type:"verset",ref:"At-Tahrim 66:8",ar:"\u064a\u0627 \u0623\u064a\u0651\u0647\u0627 \u0627\u0644\u0651\u0630\u064a\u0646 \u0622\u0645\u0646\u0648\u0627 \u062a\u0648\u0628\u0648\u0627 \u0625\u0650\u0644\u0649 \u0627\u0644\u0644\u0651\u0647 \u062a\u0648\u0628\u0629 \u0646\u0635\u0648\u062d\u0627",fr:"\u00d4 vous qui avez cru ! Repentez-vous \u00e0 Allah d\u2019un repentir sinc\u00e8re.",commentary:"La tawbah nasuh est le repentir sinc\u00e8re, complet et d\u00e9finitif."},
          {type:"verset",ref:"Al-Baqarah 2:222",ar:"\u0625\u0650\u0646\u0651 \u0627\u0644\u0644\u0651\u0647 \u064a\u062d\u0628\u0651 \u0627\u0644\u062a\u0651\u0648\u0651\u0627\u0628\u064a\u0646 \u0648\u064a\u062d\u0628\u0651 \u0627\u0644\u0645\u062a\u0637\u0647\u0651\u0631\u064a\u0646",fr:"Certes Allah aime ceux qui se repentent et ceux qui se purifient.",commentary:"Le repentir est aim\u00e9 d\u2019Allah. Celui qui revient \u00e0 Allah est aim\u00e9 de Lui."},
          {type:"hadith",ref:"Muslim 2702",ar:"\u064a\u0627 \u0623\u064a\u0651\u0647\u0627 \u0627\u0644\u0646\u0651\u0627\u0633 \u062a\u0648\u0628\u0648\u0627 \u0625\u0650\u0644\u0649 \u0627\u0644\u0644\u0651\u0647 \u0641\u0625\u0650\u0646\u0651\u064a \u0623\u062a\u0648\u0628 \u0625\u0650\u0644\u064a\u0647 \u0641\u064a \u0627\u0644\u064a\u0648\u0645 \u0645\u0627\u0626\u0629 \u0645\u0631\u0651\u0629",fr:"\u00d4 gens ! Repentez-vous \u00e0 Allah, car moi-m\u00eame je me repens \u00e0 Lui cent fois par jour.",commentary:"Si le Proph\u00e8te, le meilleur des hommes, se repentait cent fois par jour, nous en avons encore plus besoin."},
          {type:"hadith",ref:"Tirmidhi 3540",ar:"\u0643\u0644\u0651 \u0628\u0646\u064a \u0622\u062f\u0645 \u062e\u0637\u0651\u0627\u0621 \u0648\u062e\u064a\u0631 \u0627\u0644\u062e\u0637\u0651\u0627\u0626\u064a\u0646 \u0627\u0644\u062a\u0651\u0648\u0651\u0627\u0628\u0648\u0646",fr:"Tout fils d\u2019Adam est p\u00e9cheur, et les meilleurs p\u00e9cheurs sont ceux qui se repentent.",commentary:"L\u2019erreur est humaine ; ce qui nous distingue, c\u2019est le repentir sinc\u00e8re."}
        ]
      }
    },
    "Paresse": {
      gradient: "linear-gradient(165deg, #1e1e22 0%, #1a1a1e 30%, #151518 60%, #121215 100%)",
      articleBg: "rgba(14,14,16,0.95)",
      quote: "Cherche refuge aupr\u00e8s d\u2019Allah contre la faiblesse et la paresse.",
      turnTowards: [
        "L\u2019invocation proph\u00e9tique contre la paresse",
        "La compagnie de gens actifs et motivants",
        "La fixation d\u2019objectifs spirituels quotidiens",
        "La pri\u00e8re de Fajr \u00e0 l\u2019heure comme discipline",
        "Le souvenir de la mort et de l\u2019au-del\u00e0"
      ],
      guardAgainst: [
        "L\u2019exc\u00e8s de sommeil et de repos",
        "La procrastination des bonnes \u0153uvres",
        "L\u2019abandon de la pri\u00e8re en congr\u00e9gation",
        "L\u2019addiction aux \u00e9crans et divertissements",
        "La n\u00e9gligence de la science et de l\u2019apprentissage"
      ],
      article: {
        title: "Versets et hadiths sur la paresse",
        entries: [
          {type:"verset",ref:"At-Tawbah 9:54",ar:"\u0648\u0644\u0627 \u064a\u0623\u062a\u0648\u0646 \u0627\u0644\u0635\u0651\u0644\u0627\u0629 \u0625\u0650\u0644\u0651\u0627 \u0648\u0647\u0645 \u0643\u0633\u0627\u0644\u0649",fr:"Et ils ne viennent \u00e0 la pri\u00e8re que paresseusement.",commentary:"La paresse dans la pri\u00e8re est un trait des hypocrites. Le croyant s\u2019efforce de prier avec \u00e9nergie."},
          {type:"verset",ref:"An-Nisa 4:142",ar:"\u0648\u0625\u0650\u0630\u0627 \u0642\u0627\u0645\u0648\u0627 \u0625\u0650\u0644\u0649 \u0627\u0644\u0635\u0651\u0644\u0627\u0629 \u0642\u0627\u0645\u0648\u0627 \u0643\u0633\u0627\u0644\u0649 \u064a\u0631\u0627\u0626\u0648\u0646 \u0627\u0644\u0646\u0651\u0627\u0633",fr:"Et quand ils se l\u00e8vent pour la pri\u00e8re, ils se l\u00e8vent avec paresse, pour \u00eatre vus des gens.",commentary:"La paresse est li\u00e9e \u00e0 l\u2019insincrit\u00e9. L\u2019\u00e9lan sinc\u00e8re vers Allah chasse la paresse."},
          {type:"verset",ref:"Al-Muddathir 74:42-43",ar:"\u0645\u0627 \u0633\u0644\u0643\u0643\u0645 \u0641\u064a \u0633\u0642\u0631 \u0642\u0627\u0644\u0648\u0627 \u0644\u0645 \u0646\u0643 \u0645\u0646 \u0627\u0644\u0645\u0635\u0644\u0651\u064a\u0646",fr:"Qu\u2019est-ce qui vous a amen\u00e9s en Enfer ? Ils diront : Nous n\u2019\u00e9tions pas de ceux qui priaient.",commentary:"Abandonner la pri\u00e8re par paresse a des cons\u00e9quences gravissimes dans l\u2019au-del\u00e0."},
          {type:"hadith",ref:"Bukhari 6369",ar:"\u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0625\u0650\u0646\u0651\u064a \u0623\u0639\u0648\u0630 \u0628\u0643 \u0645\u0646 \u0627\u0644\u0639\u062c\u0632 \u0648\u0627\u0644\u0643\u0633\u0644",fr:"O Allah, je cherche refuge aupr\u00e8s de Toi contre la faiblesse et la paresse.",commentary:"Le Proph\u00e8te demandait r\u00e9guli\u00e8rement protection contre la paresse, montrant sa gravit\u00e9."},
          {type:"hadith",ref:"Muslim 2664",ar:"\u0627\u0644\u0645\u0624\u0645\u0646 \u0627\u0644\u0642\u0648\u064a\u0651 \u062e\u064a\u0631 \u0648\u0623\u062d\u0628\u0651 \u0625\u0650\u0644\u0649 \u0627\u0644\u0644\u0651\u0647 \u0645\u0646 \u0627\u0644\u0645\u0624\u0645\u0646 \u0627\u0644\u0636\u0651\u0639\u064a\u0641",fr:"Le croyant fort est meilleur et plus aim\u00e9 d\u2019Allah que le croyant faible.",commentary:"La force ici inclut l\u2019\u00e9nergie spirituelle et la d\u00e9termination dans l\u2019adoration."}
        ]
      }
    },
    "Angoisse": {
      gradient: "linear-gradient(165deg, #1a1e2a 0%, #161a28 30%, #101520 60%, #0f121e 100%)",
      articleBg: "rgba(10,14,22,0.95)",
      quote: "N\u2019est-ce point par le rappel d\u2019Allah que se tranquillisent les c\u0153urs ?",
      turnTowards: [
        "Le dhikr abondant et la r\u00e9p\u00e9tition de \u00abla hawla wa la quwwata illa billah\u00bb",
        "La pri\u00e8re de nuit et la prosternation prolong\u00e9e",
        "La lecture apaisante du Coran (sourate Ya-Sin, Al-Mulk)",
        "L\u2019invocation du Proph\u00e8te contre l\u2019anxi\u00e9t\u00e9",
        "La remise totale de ses affaires \u00e0 Allah (tawakkul)"
      ],
      guardAgainst: [
        "La r\u00e9flexion obsessionnelle sur l\u2019avenir",
        "La n\u00e9gligence de la pri\u00e8re et du dhikr",
        "La solitude prolong\u00e9e sans rappel d\u2019Allah",
        "La consommation excessive de contenus anxiog\u00e8nes",
        "Le manque de confiance en la sagesse divine"
      ],
      article: {
        title: "Versets et hadiths sur l\u2019angoisse",
        entries: [
          {type:"verset",ref:"Ar-Ra\u2019d 13:28",ar:"\u0623\u0644\u0627 \u0628\u0630\u0643\u0631 \u0627\u0644\u0644\u0651\u0647 \u062a\u0637\u0645\u0626\u0646\u0651 \u0627\u0644\u0642\u0644\u0648\u0628",fr:"N\u2019est-ce point par le rappel d\u2019Allah que se tranquillisent les c\u0153urs ?",commentary:"Le dhikr est le rem\u00e8de divin contre l\u2019angoisse. Le c\u0153ur ne trouve sa paix que dans le souvenir d\u2019Allah."},
          {type:"verset",ref:"Ta-Ha 20:1-2",ar:"\u0637\u0647 \u0645\u0627 \u0623\u0646\u0632\u0644\u0646\u0627 \u0639\u0644\u064a\u0643 \u0627\u0644\u0642\u0631\u0622\u0646 \u0644\u062a\u0634\u0642\u0649",fr:"Ta-Ha. Nous n\u2019avons pas fait descendre sur toi le Coran pour que tu sois malheureux.",commentary:"Le Coran est une source de paix, pas de tourment. Sa r\u00e9citation apaise l\u2019angoisse."},
          {type:"verset",ref:"Al-Inshirah 94:1-4",ar:"\u0623\u0644\u0645 \u0646\u0634\u0631\u062d \u0644\u0643 \u0635\u062f\u0631\u0643 \u0648\u0648\u0636\u0639\u0646\u0627 \u0639\u0646\u0643 \u0648\u0632\u0631\u0643 \u0627\u0644\u0651\u0630\u064a \u0623\u0646\u0642\u0636 \u0638\u0647\u0631\u0643",fr:"N\u2019avons-Nous pas ouvert pour toi ta poitrine, et d\u00e9pos\u00e9 le fardeau qui pesait sur ton dos ?",commentary:"Allah \u00e9largit la poitrine de Son serviteur et all\u00e8ge ses fardeaux. L\u2019angoisse n\u2019est pas \u00e9ternelle."},
          {type:"hadith",ref:"Ahmad 3528",ar:"\u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0625\u0650\u0646\u0651\u064a \u0623\u0639\u0648\u0630 \u0628\u0643 \u0645\u0646 \u0627\u0644\u0647\u0645\u0651 \u0648\u0627\u0644\u062d\u0632\u0646",fr:"O Allah, je cherche refuge aupr\u00e8s de Toi contre le souci et la tristesse.",commentary:"Le Proph\u00e8te nous a enseign\u00e9 cette invocation compl\u00e8te contre toutes les formes d\u2019angoisse."},
          {type:"hadith",ref:"Bukhari 6346",ar:"\u0644\u0627 \u062d\u0648\u0644 \u0648\u0644\u0627 \u0642\u0648\u0651\u0629 \u0625\u0650\u0644\u0651\u0627 \u0628\u0627\u0644\u0644\u0651\u0647",fr:"Il n\u2019y a de force ni de puissance qu\u2019en Allah.",commentary:"Cette parole est un tr\u00e9sor du Paradis. Elle lib\u00e8re le c\u0153ur de l\u2019angoisse en remettant toute chose \u00e0 Allah."}
        ]
      }
    },
    "Peur": {
      gradient: "linear-gradient(165deg, #1e1a2a 0%, #1a1628 30%, #151020 60%, #120f1e 100%)",
      articleBg: "rgba(14,10,22,0.95)",
      quote: "Ne crains rien, Allah est avec nous.",
      turnTowards: [
        "La confiance en Allah et Son d\u00e9cret (tawakkul)",
        "La r\u00e9citation des sourates protectrices (Al-Falaq, An-Nas)",
        "Le rappel que seul Allah m\u00e9rite d\u2019\u00eatre craint",
        "L\u2019invocation de protection matin et soir",
        "La m\u00e9ditation sur la toute-puissance d\u2019Allah"
      ],
      guardAgainst: [
        "La crainte excessive des cr\u00e9atures au lieu du Cr\u00e9ateur",
        "Les superstitions et croyances infond\u00e9es",
        "La l\u00e2chet\u00e9 qui emp\u00eache de faire le bien",
        "L\u2019anxi\u00e9t\u00e9 paralysante face \u00e0 l\u2019avenir",
        "L\u2019abandon de la v\u00e9rit\u00e9 par peur des gens"
      ],
      article: {
        title: "Versets et hadiths sur la peur",
        entries: [
          {type:"verset",ref:"Yunus 10:62",ar:"\u0623\u0644\u0627 \u0625\u0650\u0646\u0651 \u0623\u0648\u0644\u064a\u0627\u0621 \u0627\u0644\u0644\u0651\u0647 \u0644\u0627 \u062e\u0648\u0641 \u0639\u0644\u064a\u0647\u0645 \u0648\u0644\u0627 \u0647\u0645 \u064a\u062d\u0632\u0646\u0648\u0646",fr:"En v\u00e9rit\u00e9, les alli\u00e9s d\u2019Allah n\u2019auront aucune crainte et ne seront point afflig\u00e9s.",commentary:"La proximit\u00e9 d\u2019Allah dissipe toute peur. Ses alli\u00e9s sont sous Sa protection totale."},
          {type:"verset",ref:"Al Imran 3:175",ar:"\u0625\u0650\u0646\u0651\u0645\u0627 \u0630\u0644\u0643\u0645 \u0627\u0644\u0634\u0651\u064a\u0637\u0627\u0646 \u064a\u062e\u0648\u0651\u0641 \u0623\u0648\u0644\u064a\u0627\u0621\u0647 \u0641\u0644\u0627 \u062a\u062e\u0627\u0641\u0648\u0647\u0645 \u0648\u062e\u0627\u0641\u0648\u0646\u064a",fr:"C\u2019est le diable qui vous fait peur de ses alli\u00e9s. N\u2019ayez donc pas peur d\u2019eux, mais ayez peur de Moi.",commentary:"La peur des cr\u00e9atures vient du shaytan. Le croyant ne craint qu\u2019Allah."},
          {type:"verset",ref:"At-Tawbah 9:40",ar:"\u0644\u0627 \u062a\u062d\u0632\u0646 \u0625\u0650\u0646\u0651 \u0627\u0644\u0644\u0651\u0647 \u0645\u0639\u0646\u0627",fr:"Ne sois pas triste, car Allah est avec nous.",commentary:"Dans la grotte, le Proph\u00e8te rassure Abu Bakr. Avec Allah, il n\u2019y a rien \u00e0 craindre."},
          {type:"hadith",ref:"Tirmidhi 2516",ar:"\u0627\u062d\u0641\u0638 \u0627\u0644\u0644\u0651\u0647 \u064a\u062d\u0641\u0638\u0643",fr:"Pr\u00e9serve Allah, Il te pr\u00e9servera.",commentary:"Celui qui respecte les limites d\u2019Allah n\u2019a rien \u00e0 craindre, car Allah le prot\u00e8ge."},
          {type:"hadith",ref:"Tirmidhi 2341",ar:"\u0644\u0648 \u0623\u0646\u0651\u0643\u0645 \u062a\u062a\u0648\u0643\u0651\u0644\u0648\u0646 \u0639\u0644\u0649 \u0627\u0644\u0644\u0651\u0647 \u062d\u0642\u0651 \u062a\u0648\u0643\u0651\u0644\u0647 \u0644\u0631\u0632\u0642\u0643\u0645 \u0643\u0645\u0627 \u064a\u0631\u0632\u0642 \u0627\u0644\u0637\u0651\u064a\u0631",fr:"Si vous placiez votre confiance en Allah comme il se doit, Il vous nourrirait comme Il nourrit les oiseaux.",commentary:"Le tawakkul lib\u00e8re de la peur. Les oiseaux partent le ventre vide et reviennent rassasi\u00e9s."}
        ]
      }
    },
    "D\u00e9tresse": {
      gradient: "linear-gradient(165deg, #1a1a28 0%, #161625 30%, #101020 60%, #0e0e1a 100%)",
      articleBg: "rgba(10,10,20,0.95)",
      quote: "Certes, avec la difficult\u00e9 vient la facilit\u00e9.",
      turnTowards: [
        "L\u2019invocation de Yunus : \u00abLa ilaha illa Anta, Subhanaka, inni kuntu min adh-dhalimin\u00bb",
        "La pri\u00e8re du besoin (salat al-hajah)",
        "Le retour sinc\u00e8re \u00e0 Allah dans l\u2019\u00e9preuve",
        "La patience et l\u2019acceptation du d\u00e9cret divin",
        "La recherche de l\u2019aide d\u2019Allah avant celle des hommes"
      ],
      guardAgainst: [
        "Le d\u00e9sespoir de la mis\u00e9ricorde d\u2019Allah",
        "Les solutions illicites par d\u00e9sespoir",
        "La col\u00e8re contre le d\u00e9cret divin",
        "L\u2019abandon de la pri\u00e8re dans l\u2019\u00e9preuve",
        "La plainte excessive aupr\u00e8s des cr\u00e9atures"
      ],
      article: {
        title: "Versets et hadiths sur la d\u00e9tresse",
        entries: [
          {type:"verset",ref:"Al-Anbiya 21:87",ar:"\u0644\u0627 \u0625\u0650\u0644\u0647 \u0625\u0650\u0644\u0651\u0627 \u0623\u0646\u062a \u0633\u0628\u062d\u0627\u0646\u0643 \u0625\u0650\u0646\u0651\u064a \u0643\u0646\u062a \u0645\u0646 \u0627\u0644\u0638\u0651\u0627\u0644\u0645\u064a\u0646",fr:"Il n\u2019y a de divinit\u00e9 que Toi ! Gloire \u00e0 Toi ! J\u2019\u00e9tais du nombre des injustes.",commentary:"L\u2019invocation de Yunus dans le ventre de la baleine. Aucun musulman n\u2019invoque par elle sans qu\u2019Allah ne le d\u00e9livre."},
          {type:"verset",ref:"At-Talaq 65:2-3",ar:"\u0648\u0645\u0646 \u064a\u062a\u0651\u0642 \u0627\u0644\u0644\u0651\u0647 \u064a\u062c\u0639\u0644 \u0644\u0647 \u0645\u062e\u0631\u062c\u0627 \u0648\u064a\u0631\u0632\u0642\u0647 \u0645\u0646 \u062d\u064a\u062b \u0644\u0627 \u064a\u062d\u062a\u0633\u0628",fr:"Quiconque craint Allah, Il lui donnera une issue favorable et lui accordera Ses dons par des moyens insoup\u00e7onn\u00e9s.",commentary:"La taqwa est la cl\u00e9 de toute sortie de crise. Allah ouvre des portes l\u00e0 o\u00f9 on ne les attend pas."},
          {type:"verset",ref:"Al-Baqarah 2:214",ar:"\u0623\u0645 \u062d\u0633\u0628\u062a\u0645 \u0623\u0646 \u062a\u062f\u062e\u0644\u0648\u0627 \u0627\u0644\u062c\u0646\u0651\u0629 \u0648\u0644\u0645\u0651\u0627 \u064a\u0623\u062a\u0643\u0645 \u0645\u062b\u0644 \u0627\u0644\u0651\u0630\u064a\u0646 \u062e\u0644\u0648\u0627 \u0645\u0646 \u0642\u0628\u0644\u0643\u0645",fr:"Pensez-vous entrer au Paradis sans qu\u2019il ne vous arrive ce qui est arriv\u00e9 \u00e0 ceux avant vous ?",commentary:"L\u2019\u00e9preuve est le chemin vers le Paradis. Les meilleurs des hommes ont \u00e9t\u00e9 les plus \u00e9prouv\u00e9s."},
          {type:"hadith",ref:"Tirmidhi 3505",ar:"\u062f\u0639\u0648\u0629 \u0630\u064a \u0627\u0644\u0646\u0651\u0648\u0646 \u0625\u0650\u0630 \u062f\u0639\u0627 \u0648\u0647\u0648 \u0641\u064a \u0628\u0637\u0646 \u0627\u0644\u062d\u0648\u062a \u0644\u0645 \u064a\u062f\u0639 \u0628\u0647\u0627 \u0631\u062c\u0644 \u0645\u0633\u0644\u0645 \u0625\u0650\u0644\u0651\u0627 \u0627\u0633\u062a\u062c\u0627\u0628 \u0627\u0644\u0644\u0651\u0647 \u0644\u0647",fr:"L\u2019invocation de Dh\u00fb n-N\u00fbn dans le ventre de la baleine : aucun musulman n\u2019invoque par elle sans qu\u2019Allah ne lui r\u00e9ponde.",commentary:"Cette invocation est une cl\u00e9 pour sortir de toute d\u00e9tresse."},
          {type:"hadith",ref:"Bukhari 6346",ar:"\u0645\u0627 \u0623\u0635\u0627\u0628 \u0639\u0628\u062f\u0627 \u0647\u0645\u0651 \u0648\u0644\u0627 \u062d\u0632\u0646 \u0641\u0642\u0627\u0644 \u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0625\u0650\u0646\u0651\u064a \u0639\u0628\u062f\u0643 \u0627\u0628\u0646 \u0639\u0628\u062f\u0643",fr:"Tout serviteur touch\u00e9 par le souci ou la tristesse qui dit : \u00abO Allah, je suis Ton serviteur, fils de Ton serviteur\u2026\u00bb Allah remplacera sa tristesse par la joie.",commentary:"Le Proph\u00e8te nous a enseign\u00e9 cette longue invocation qui transforme la d\u00e9tresse en joie."}
        ]
      }
    },
    "Espoir": {
      gradient: "linear-gradient(165deg, #1a2a25 0%, #152a22 30%, #10201a 60%, #0f1f18 100%)",
      articleBg: "rgba(10,22,18,0.95)",
      quote: "Ne d\u00e9sesp\u00e9rez pas de la mis\u00e9ricorde d\u2019Allah.",
      turnTowards: [
        "La confiance en la promesse d\u2019Allah",
        "La m\u00e9ditation sur les attributs de mis\u00e9ricorde d\u2019Allah",
        "L\u2019invocation avec certitude d\u2019\u00eatre exauc\u00e9",
        "La lecture des histoires des proph\u00e8tes et leur patience",
        "L\u2019\u00e9quilibre entre crainte et espoir en Allah"
      ],
      guardAgainst: [
        "Le d\u00e9sespoir de la mis\u00e9ricorde d\u2019Allah (p\u00e9ch\u00e9 majeur)",
        "L\u2019espoir sans effort ni action",
        "La fausse s\u00e9curit\u00e9 qui m\u00e8ne \u00e0 la n\u00e9gligence",
        "L\u2019attachement aux moyens en oubliant Celui qui d\u00e9cr\u00e8te",
        "Le pessimisme et la pens\u00e9e n\u00e9gative sur Allah"
      ],
      article: {
        title: "Versets et hadiths sur l\u2019espoir",
        entries: [
          {type:"verset",ref:"Yusuf 12:87",ar:"\u0648\u0644\u0627 \u062a\u064a\u0623\u0633\u0648\u0627 \u0645\u0646 \u0631\u0648\u062d \u0627\u0644\u0644\u0651\u0647 \u0625\u0650\u0646\u0651\u0647 \u0644\u0627 \u064a\u064a\u0623\u0633 \u0645\u0646 \u0631\u0648\u062d \u0627\u0644\u0644\u0651\u0647 \u0625\u0650\u0644\u0651\u0627 \u0627\u0644\u0642\u0648\u0645 \u0627\u0644\u0643\u0627\u0641\u0631\u0648\u0646",fr:"Ne d\u00e9sesp\u00e9rez pas de la mis\u00e9ricorde d\u2019Allah. Seuls les m\u00e9cr\u00e9ants d\u00e9sesp\u00e8rent de la mis\u00e9ricorde d\u2019Allah.",commentary:"Le d\u00e9sespoir est incompatible avec la foi. L\u2019espoir en Allah est un pilier du croyant."},
          {type:"verset",ref:"Az-Zumar 39:53",ar:"\u0642\u0644 \u064a\u0627 \u0639\u0628\u0627\u062f\u064a \u0627\u0644\u0651\u0630\u064a\u0646 \u0623\u0633\u0631\u0641\u0648\u0627 \u0639\u0644\u0649 \u0623\u0646\u0641\u0633\u0647\u0645 \u0644\u0627 \u062a\u0642\u0646\u0637\u0648\u0627 \u0645\u0646 \u0631\u062d\u0645\u0629 \u0627\u0644\u0644\u0651\u0647",fr:"Dis : \u00abO Mes serviteurs qui avez commis des exc\u00e8s, ne d\u00e9sesp\u00e9rez pas de la mis\u00e9ricorde d\u2019Allah.\u00bb",commentary:"M\u00eame apr\u00e8s les pires exc\u00e8s, la porte de la mis\u00e9ricorde reste ouverte."},
          {type:"verset",ref:"Al-Hijr 15:56",ar:"\u0648\u0645\u0646 \u064a\u0642\u0646\u0637 \u0645\u0646 \u0631\u062d\u0645\u0629 \u0631\u0628\u0651\u0647 \u0625\u0650\u0644\u0651\u0627 \u0627\u0644\u0636\u0651\u0627\u0644\u0651\u0648\u0646",fr:"Qui d\u00e9sesp\u00e8re de la mis\u00e9ricorde de son Seigneur sinon les \u00e9gar\u00e9s ?",commentary:"Ibrahim rappelle que le d\u00e9sespoir est une forme d\u2019\u00e9garement."},
          {type:"hadith",ref:"Muslim 2877 (hadith qudsi)",ar:"\u0623\u0646\u0627 \u0639\u0646\u062f \u0638\u0646\u0651 \u0639\u0628\u062f\u064a \u0628\u064a",fr:"Je suis selon l\u2019opinion que Mon serviteur a de Moi.",commentary:"Si tu penses bien d\u2019Allah, tu recevras le bien. L\u2019espoir en Allah attire Sa mis\u00e9ricorde."},
          {type:"hadith",ref:"Muslim 2755",ar:"\u0644\u0648 \u064a\u0639\u0644\u0645 \u0627\u0644\u0645\u0624\u0645\u0646 \u0645\u0627 \u0639\u0646\u062f \u0627\u0644\u0644\u0651\u0647 \u0645\u0646 \u0627\u0644\u0639\u0642\u0648\u0628\u0629 \u0645\u0627 \u0637\u0645\u0639 \u0628\u062c\u0646\u0651\u062a\u0647 \u0623\u062d\u062f \u0648\u0644\u0648 \u064a\u0639\u0644\u0645 \u0627\u0644\u0643\u0627\u0641\u0631 \u0645\u0627 \u0639\u0646\u062f \u0627\u0644\u0644\u0651\u0647 \u0645\u0646 \u0627\u0644\u0631\u062d\u0645\u0629 \u0645\u0627 \u0642\u0646\u0637 \u0645\u0646 \u062c\u0646\u0651\u062a\u0647 \u0623\u062d\u062f",fr:"Si le m\u00e9cr\u00e9ant savait toute la mis\u00e9ricorde d\u2019Allah, personne ne d\u00e9sesp\u00e9rerait de Son Paradis.",commentary:"La mis\u00e9ricorde d\u2019Allah est si vaste qu\u2019elle d\u00e9passe toute imagination humaine."}
        ]
      }
    },
    "Regret": {
      gradient: "linear-gradient(165deg, #22202a 0%, #1e1c26 30%, #181620 60%, #14121a 100%)",
      articleBg: "rgba(16,14,22,0.95)",
      quote: "Le regret est repentir.",
      turnTowards: [
        "La transformation du regret en repentir sinc\u00e8re",
        "La r\u00e9paration des torts commis envers autrui",
        "L\u2019engagement ferme de ne pas r\u00e9cidiver",
        "L\u2019istighfar abondant et les bonnes \u0153uvres r\u00e9paratrices",
        "L\u2019acceptation du pass\u00e9 et la concentration sur le pr\u00e9sent"
      ],
      guardAgainst: [
        "Le regret st\u00e9rile qui ne m\u00e8ne \u00e0 aucun changement",
        "L\u2019auto-flagellation et la d\u00e9pr\u00e9ciation de soi",
        "Le d\u00e9sespoir de se r\u00e9former",
        "La rumination excessive sur les erreurs pass\u00e9es",
        "Le report du repentir malgr\u00e9 la prise de conscience"
      ],
      article: {
        title: "Versets et hadiths sur le regret",
        entries: [
          {type:"verset",ref:"Al-Furqan 25:27-28",ar:"\u0648\u064a\u0648\u0645 \u064a\u0639\u0636\u0651 \u0627\u0644\u0638\u0651\u0627\u0644\u0645 \u0639\u0644\u0649 \u064a\u062f\u064a\u0647 \u064a\u0642\u0648\u0644 \u064a\u0627 \u0644\u064a\u062a\u0646\u064a \u0627\u062a\u0651\u062e\u0630\u062a \u0645\u0639 \u0627\u0644\u0631\u0651\u0633\u0648\u0644 \u0633\u0628\u064a\u0644\u0627",fr:"Le jour o\u00f9 l\u2019injuste se mordra les mains en disant : \u00abH\u00e9las ! Si seulement j\u2019avais suivi le chemin du Messager !\u00bb",commentary:"Le pire regret est celui du Jour Dernier. Il faut agir avant qu\u2019il ne soit trop tard."},
          {type:"verset",ref:"Al-Hashr 59:18",ar:"\u064a\u0627 \u0623\u064a\u0651\u0647\u0627 \u0627\u0644\u0651\u0630\u064a\u0646 \u0622\u0645\u0646\u0648\u0627 \u0627\u062a\u0651\u0642\u0648\u0627 \u0627\u0644\u0644\u0651\u0647 \u0648\u0644\u062a\u0646\u0638\u0631 \u0646\u0641\u0633 \u0645\u0627 \u0642\u062f\u0651\u0645\u062a \u0644\u063a\u062f",fr:"\u00d4 croyants ! Craignez Allah et que chaque \u00e2me regarde ce qu\u2019elle a pr\u00e9par\u00e9 pour demain.",commentary:"L\u2019examen de conscience (muhasaba) transforme le regret en pr\u00e9paration pour l\u2019avenir."},
          {type:"verset",ref:"Az-Zumar 39:56",ar:"\u0623\u0646 \u062a\u0642\u0648\u0644 \u0646\u0641\u0633 \u064a\u0627 \u062d\u0633\u0631\u062a\u0649 \u0639\u0644\u0649 \u0645\u0627 \u0641\u0631\u0651\u0637\u062a \u0641\u064a \u062c\u0646\u0628 \u0627\u0644\u0644\u0651\u0647",fr:"Que l\u2019\u00e2me ne dise pas : \u00abMalheur \u00e0 moi pour ce que j\u2019ai n\u00e9glig\u00e9 envers Allah.\u00bb",commentary:"Le regret le plus douloureux est d\u2019avoir n\u00e9glig\u00e9 sa relation avec Allah. Agis maintenant."},
          {type:"hadith",ref:"Ahmad 3568, Ibn Majah 4252",ar:"\u0627\u0644\u0646\u0651\u062f\u0645 \u062a\u0648\u0628\u0629",fr:"Le regret est repentir.",commentary:"Le Proph\u00e8te a d\u00e9fini le c\u0153ur du repentir : c\u2019est le regret sinc\u00e8re. Celui qui regrette a d\u00e9j\u00e0 commenc\u00e9 \u00e0 se repentir."},
          {type:"hadith",ref:"Muslim 2702",ar:"\u062a\u0648\u0628\u0648\u0627 \u0625\u0650\u0644\u0649 \u0627\u0644\u0644\u0651\u0647 \u0641\u0625\u0650\u0646\u0651\u064a \u0623\u062a\u0648\u0628 \u0625\u0650\u0644\u064a\u0647 \u0641\u064a \u0627\u0644\u064a\u0648\u0645 \u0645\u0627\u0626\u0629 \u0645\u0631\u0651\u0629",fr:"Repentez-vous \u00e0 Allah, car moi-m\u00eame je me repens \u00e0 Lui cent fois par jour.",commentary:"Le meilleur des hommes se repentait constamment. Le regret suivi de tawbah est la voie du croyant."}
        ]
      }
    },
    "Honte": {
      gradient: "linear-gradient(165deg, #2a1e22 0%, #261a1e 30%, #1f1418 60%, #1a1015 100%)",
      articleBg: "rgba(22,12,16,0.95)",
      quote: "La pudeur fait partie de la foi.",
      turnTowards: [
        "La pudeur (al-haya) comme vertu morale",
        "Le repentir sinc\u00e8re et la r\u00e9paration",
        "La pudeur envers Allah qui voit tout",
        "La couverture des p\u00e9ch\u00e9s d\u2019autrui",
        "La recherche du pardon divin avec confiance"
      ],
      guardAgainst: [
        "La honte paralysante qui \u00e9loigne du repentir",
        "L\u2019exposition publique de ses propres p\u00e9ch\u00e9s",
        "La honte de pratiquer sa religion devant les gens",
        "Le jugement excessif envers soi-m\u00eame",
        "La honte qui emp\u00eache de demander le savoir"
      ],
      article: {
        title: "Versets et hadiths sur la honte et la pudeur",
        entries: [
          {type:"verset",ref:"Al-A\u2019raf 7:26",ar:"\u0648\u0644\u0628\u0627\u0633 \u0627\u0644\u062a\u0651\u0642\u0648\u0649 \u0630\u0644\u0643 \u062e\u064a\u0631",fr:"Et le v\u00eatement de la pi\u00e9t\u00e9, voil\u00e0 qui est meilleur.",commentary:"La meilleure couverture est la taqwa. Elle prot\u00e8ge le croyant de la honte dans ce monde et dans l\u2019au-del\u00e0."},
          {type:"verset",ref:"An-Nur 24:19",ar:"\u0625\u0650\u0646\u0651 \u0627\u0644\u0651\u0630\u064a\u0646 \u064a\u062d\u0628\u0651\u0648\u0646 \u0623\u0646 \u062a\u0634\u064a\u0639 \u0627\u0644\u0641\u0627\u062d\u0634\u0629 \u0641\u064a \u0627\u0644\u0651\u0630\u064a\u0646 \u0622\u0645\u0646\u0648\u0627 \u0644\u0647\u0645 \u0639\u0630\u0627\u0628 \u0623\u0644\u064a\u0645",fr:"Ceux qui aiment que la turpitude se r\u00e9pande parmi les croyants auront un ch\u00e2timent douloureux.",commentary:"L\u2019islam prot\u00e8ge la dignit\u00e9 des gens. Exposer les fautes d\u2019autrui est s\u00e9v\u00e8rement condamn\u00e9."},
          {type:"verset",ref:"Az-Zumar 39:53",ar:"\u0644\u0627 \u062a\u0642\u0646\u0637\u0648\u0627 \u0645\u0646 \u0631\u062d\u0645\u0629 \u0627\u0644\u0644\u0651\u0647 \u0625\u0650\u0646\u0651 \u0627\u0644\u0644\u0651\u0647 \u064a\u063a\u0641\u0631 \u0627\u0644\u0630\u0651\u0646\u0648\u0628 \u062c\u0645\u064a\u0639\u0627",fr:"Ne d\u00e9sesp\u00e9rez pas de la mis\u00e9ricorde d\u2019Allah. Allah pardonne tous les p\u00e9ch\u00e9s.",commentary:"Quelle que soit la honte ressentie, le pardon d\u2019Allah est plus grand que tout p\u00e9ch\u00e9."},
          {type:"hadith",ref:"Bukhari 24, Muslim 36",ar:"\u0627\u0644\u062d\u064a\u0627\u0621 \u0645\u0646 \u0627\u0644\u0625\u064a\u0645\u0627\u0646",fr:"La pudeur fait partie de la foi.",commentary:"La haya (pudeur) est une branche de la foi. Elle prot\u00e8ge le croyant du p\u00e9ch\u00e9."},
          {type:"hadith",ref:"Muslim 2590",ar:"\u0645\u0646 \u0633\u062a\u0631 \u0645\u0633\u0644\u0645\u0627 \u0633\u062a\u0631\u0647 \u0627\u0644\u0644\u0651\u0647 \u0641\u064a \u0627\u0644\u062f\u0651\u0646\u064a\u0627 \u0648\u0627\u0644\u0622\u062e\u0631\u0629",fr:"Quiconque couvre les fautes d\u2019un musulman, Allah le couvrira dans ce monde et dans l\u2019au-del\u00e0.",commentary:"Allah aime la discr\u00e9tion. Couvrir ses propres fautes et celles d\u2019autrui est une vertu."}
        ]
      }
    },
    "Envie": {
      gradient: "linear-gradient(165deg, #222a1a 0%, #1e2616 30%, #181f10 60%, #141a0f 100%)",
      articleBg: "rgba(16,20,10,0.95)",
      quote: "Ne convoitez pas ce par quoi Allah a favoris\u00e9 certains d\u2019entre vous.",
      turnTowards: [
        "La satisfaction du d\u00e9cret divin (ridha)",
        "La gratitude pour ses propres bienfaits",
        "L\u2019invocation de b\u00e9n\u00e9diction pour celui qu\u2019on envie",
        "La comp\u00e9tition dans les bonnes \u0153uvres (munafasah)",
        "Le rappel que les biens de ce monde sont \u00e9ph\u00e9m\u00e8res"
      ],
      guardAgainst: [
        "Le souhait de voir dispara\u00eetre les bienfaits d\u2019autrui",
        "La comparaison constante avec les autres",
        "La m\u00e9disance et la calomnie par jalousie",
        "L\u2019ingratitude envers ses propres bienfaits",
        "La rancune et l\u2019hostilit\u00e9 envers les favoris\u00e9s"
      ],
      article: {
        title: "Versets et hadiths sur l\u2019envie",
        entries: [
          {type:"verset",ref:"An-Nisa 4:32",ar:"\u0648\u0644\u0627 \u062a\u062a\u0645\u0646\u0651\u0648\u0627 \u0645\u0627 \u0641\u0636\u0651\u0644 \u0627\u0644\u0644\u0651\u0647 \u0628\u0647 \u0628\u0639\u0636\u0643\u0645 \u0639\u0644\u0649 \u0628\u0639\u0636",fr:"Ne convoitez pas ce par quoi Allah a favoris\u00e9 certains d\u2019entre vous par rapport aux autres.",commentary:"Allah interdit la convoitise de ce qu\u2019Il a donn\u00e9 aux autres. Chacun a sa part dans le d\u00e9cret divin."},
          {type:"verset",ref:"Al-Falaq 113:1-5",ar:"\u0642\u0644 \u0623\u0639\u0648\u0630 \u0628\u0631\u0628\u0651 \u0627\u0644\u0641\u0644\u0642 \u0645\u0646 \u0634\u0631\u0651 \u0645\u0627 \u062e\u0644\u0642 \u0648\u0645\u0646 \u0634\u0631\u0651 \u062d\u0627\u0633\u062f \u0625\u0650\u0630\u0627 \u062d\u0633\u062f",fr:"Dis : Je me r\u00e9fugie aupr\u00e8s du Seigneur de l\u2019aube\u2026 contre le mal de l\u2019envieux quand il envie.",commentary:"Allah nous ordonne de chercher refuge contre le mal de l\u2019envie, signe de sa gravit\u00e9."},
          {type:"verset",ref:"Al-Baqarah 2:109",ar:"\u0648\u062f\u0651 \u0643\u062b\u064a\u0631 \u0645\u0646 \u0623\u0647\u0644 \u0627\u0644\u0643\u062a\u0627\u0628 \u0644\u0648 \u064a\u0631\u062f\u0651\u0648\u0646\u0643\u0645 \u0645\u0646 \u0628\u0639\u062f \u0625\u064a\u0645\u0627\u0646\u0643\u0645 \u0643\u0641\u0651\u0627\u0631\u0627 \u062d\u0633\u062f\u0627",fr:"Beaucoup de Gens du Livre aimeraient, par envie, vous faire redevenir m\u00e9cr\u00e9ants apr\u00e8s votre foi.",commentary:"L\u2019envie est si destructrice qu\u2019elle pousse \u00e0 vouloir enlever la guidance m\u00eame des croyants."},
          {type:"hadith",ref:"Abu Dawud 4903",ar:"\u0625\u0650\u064a\u0651\u0627\u0643\u0645 \u0648\u0627\u0644\u062d\u0633\u062f \u0641\u0625\u0650\u0646\u0651 \u0627\u0644\u062d\u0633\u062f \u064a\u0623\u0643\u0644 \u0627\u0644\u062d\u0633\u0646\u0627\u062a \u0643\u0645\u0627 \u062a\u0623\u0643\u0644 \u0627\u0644\u0646\u0651\u0627\u0631 \u0627\u0644\u062d\u0637\u0628",fr:"Prenez garde \u00e0 l\u2019envie, car l\u2019envie d\u00e9vore les bonnes \u0153uvres comme le feu d\u00e9vore le bois.",commentary:"L\u2019envie an\u00e9antit les bonnes actions de l\u2019envieux. C\u2019est un poison pour le c\u0153ur et les \u0153uvres."},
          {type:"hadith",ref:"Bukhari 73, Muslim 816",ar:"\u0644\u0627 \u062d\u0633\u062f \u0625\u0650\u0644\u0651\u0627 \u0641\u064a \u0627\u062b\u0646\u062a\u064a\u0646",fr:"Il n\u2019y a d\u2019envie permise que dans deux cas : un homme \u00e0 qui Allah a donn\u00e9 le Coran, et un homme \u00e0 qui Allah a donn\u00e9 une richesse qu\u2019il d\u00e9pense dans le bien.",commentary:"La seule \u00abenvie\u00bb permise est la ghibtah : souhaiter avoir le m\u00eame bien sans vouloir qu\u2019il disparaisse chez l\u2019autre."}
        ]
      }
    },
    "Haine": {
      gradient: "linear-gradient(165deg, #2a1a1a 0%, #281515 30%, #201010 60%, #1a0e0e 100%)",
      articleBg: "rgba(22,10,10,0.95)",
      quote: "Ne vous ha\u00efssez pas, ne vous enviez pas, ne vous tournez pas le dos.",
      turnTowards: [
        "Le pardon et la r\u00e9conciliation",
        "L\u2019invocation pour celui qu\u2019on d\u00e9teste",
        "La recherche des excuses pour autrui",
        "L\u2019amour en Allah et la d\u00e9testation du p\u00e9ch\u00e9 (non du p\u00e9cheur)",
        "Le rappel du lien de fraternit\u00e9 en islam"
      ],
      guardAgainst: [
        "La haine entre musulmans (grand p\u00e9ch\u00e9)",
        "La m\u00e9disance et la calomnie",
        "La rupture des liens de parent\u00e9",
        "La vengeance personnelle",
        "Le boycott injustifi\u00e9 de plus de trois jours"
      ],
      article: {
        title: "Versets et hadiths sur la haine",
        entries: [
          {type:"verset",ref:"Al-Hujurat 49:10",ar:"\u0625\u0650\u0646\u0651\u0645\u0627 \u0627\u0644\u0645\u0624\u0645\u0646\u0648\u0646 \u0625\u0650\u062e\u0648\u0629 \u0641\u0623\u0635\u0644\u062d\u0648\u0627 \u0628\u064a\u0646 \u0623\u062e\u0648\u064a\u0643\u0645",fr:"Les croyants ne sont que des fr\u00e8res. R\u00e9tablissez la paix entre vos fr\u00e8res.",commentary:"La fraternit\u00e9 en islam est un lien sacr\u00e9. La haine entre croyants d\u00e9chire ce lien."},
          {type:"verset",ref:"Al-Hujurat 49:12",ar:"\u0627\u062c\u062a\u0646\u0628\u0648\u0627 \u0643\u062b\u064a\u0631\u0627 \u0645\u0646 \u0627\u0644\u0638\u0651\u0646\u0651 \u0625\u0650\u0646\u0651 \u0628\u0639\u0636 \u0627\u0644\u0638\u0651\u0646\u0651 \u0625\u0650\u062b\u0645",fr:"\u00c9vitez de trop conjecturer, car une partie des conjectures est p\u00e9ch\u00e9.",commentary:"La suspicion nourrit la haine. Le croyant pense bien de ses fr\u00e8res."},
          {type:"verset",ref:"Fussilat 41:34",ar:"\u0627\u062f\u0641\u0639 \u0628\u0627\u0644\u0651\u062a\u064a \u0647\u064a \u0623\u062d\u0633\u0646 \u0641\u0625\u0650\u0630\u0627 \u0627\u0644\u0651\u0630\u064a \u0628\u064a\u0646\u0643 \u0648\u0628\u064a\u0646\u0647 \u0639\u062f\u0627\u0648\u0629 \u0643\u0623\u0646\u0651\u0647 \u0648\u0644\u064a\u0651 \u062d\u0645\u064a\u0645",fr:"Repousse le mal par ce qui est meilleur, et voil\u00e0 que celui avec qui tu avais une inimiti\u00e9 devient tel un ami chaleureux.",commentary:"R\u00e9pondre au mal par le bien transforme l\u2019ennemi en ami. C\u2019est le rem\u00e8de divin contre la haine."},
          {type:"hadith",ref:"Muslim 2559",ar:"\u0644\u0627 \u062a\u0628\u0627\u063a\u0636\u0648\u0627 \u0648\u0644\u0627 \u062a\u062d\u0627\u0633\u062f\u0648\u0627 \u0648\u0644\u0627 \u062a\u062f\u0627\u0628\u0631\u0648\u0627 \u0648\u0643\u0648\u0646\u0648\u0627 \u0639\u0628\u0627\u062f \u0627\u0644\u0644\u0651\u0647 \u0625\u0650\u062e\u0648\u0627\u0646\u0627",fr:"Ne vous ha\u00efssez pas, ne vous enviez pas, ne vous tournez pas le dos, et soyez des serviteurs d\u2019Allah, des fr\u00e8res.",commentary:"Le Proph\u00e8te interdit clairement la haine entre musulmans et appelle \u00e0 la fraternit\u00e9."},
          {type:"hadith",ref:"Muslim 2565",ar:"\u062a\u0641\u062a\u062d \u0623\u0628\u0648\u0627\u0628 \u0627\u0644\u062c\u0646\u0651\u0629 \u064a\u0648\u0645 \u0627\u0644\u0627\u062b\u0646\u064a\u0646 \u0648\u0627\u0644\u062e\u0645\u064a\u0633 \u0641\u064a\u063a\u0641\u0631 \u0644\u0643\u0644\u0651 \u0639\u0628\u062f \u0625\u0650\u0644\u0651\u0627 \u0631\u062c\u0644\u064a\u0646 \u0628\u064a\u0646\u0647\u0645\u0627 \u0634\u062d\u0646\u0627\u0621",fr:"Les portes du Paradis s\u2019ouvrent le lundi et le jeudi, et tout serviteur est pardonn\u00e9 sauf deux personnes entre lesquelles il y a une inimiti\u00e9.",commentary:"La haine emp\u00eache le pardon d\u2019Allah. La r\u00e9conciliation est une urgence spirituelle."}
        ]
      }
    },
    "Orgueil": {
      gradient: "linear-gradient(165deg, #2a2218 0%, #262014 30%, #1f1a0f 60%, #1a160e 100%)",
      articleBg: "rgba(22,18,10,0.95)",
      quote: "N\u2019entrera pas au Paradis celui qui a dans son c\u0153ur le poids d\u2019un atome d\u2019orgueil.",
      turnTowards: [
        "L\u2019humilit\u00e9 devant Allah et Ses cr\u00e9atures",
        "Le service des plus humbles",
        "Le rappel de son origine (argile, goutte d\u2019eau)",
        "La m\u00e9ditation sur la grandeur d\u2019Allah",
        "L\u2019\u00e9coute et l\u2019acceptation de la v\u00e9rit\u00e9 d\u2019o\u00f9 qu\u2019elle vienne"
      ],
      guardAgainst: [
        "Le rejet de la v\u00e9rit\u00e9 (premier signe d\u2019orgueil)",
        "Le m\u00e9pris des gens",
        "La vantardise et l\u2019ostentation",
        "Le refus du conseil et de la correction",
        "La recherche de la c\u00e9l\u00e9brit\u00e9 et du pouvoir"
      ],
      article: {
        title: "Versets et hadiths sur l\u2019orgueil",
        entries: [
          {type:"verset",ref:"Luqman 31:18",ar:"\u0648\u0644\u0627 \u062a\u0635\u0639\u0651\u0631 \u062e\u062f\u0651\u0643 \u0644\u0644\u0646\u0651\u0627\u0633 \u0648\u0644\u0627 \u062a\u0645\u0634 \u0641\u064a \u0627\u0644\u0623\u0631\u0636 \u0645\u0631\u062d\u0627 \u0625\u0650\u0646\u0651 \u0627\u0644\u0644\u0651\u0647 \u0644\u0627 \u064a\u062d\u0628\u0651 \u0643\u0644\u0651 \u0645\u062e\u062a\u0627\u0644 \u0641\u062e\u0648\u0631",fr:"Ne d\u00e9tourne pas ton visage des gens et ne foule pas la terre avec arrogance. Allah n\u2019aime pas le pr\u00e9somptueux plein de gloriole.",commentary:"Luqman enseigne \u00e0 son fils l\u2019humilit\u00e9. L\u2019arrogance dans la d\u00e9marche et le regard est d\u00e9test\u00e9e d\u2019Allah."},
          {type:"verset",ref:"Al-Isra 17:37",ar:"\u0648\u0644\u0627 \u062a\u0645\u0634 \u0641\u064a \u0627\u0644\u0623\u0631\u0636 \u0645\u0631\u062d\u0627 \u0625\u0650\u0646\u0651\u0643 \u0644\u0646 \u062a\u062e\u0631\u0642 \u0627\u0644\u0623\u0631\u0636 \u0648\u0644\u0646 \u062a\u0628\u0644\u063a \u0627\u0644\u062c\u0628\u0627\u0644 \u0637\u0648\u0644\u0627",fr:"Ne foule pas la terre avec orgueil, car tu ne pourras ni fendre la terre, ni atteindre les montagnes en hauteur.",commentary:"L\u2019homme orgueilleux oublie sa petitesse face \u00e0 la cr\u00e9ation d\u2019Allah."},
          {type:"verset",ref:"Al-A\u2019raf 7:13",ar:"\u0642\u0627\u0644 \u0645\u0627 \u0645\u0646\u0639\u0643 \u0623\u0644\u0651\u0627 \u062a\u0633\u062c\u062f \u0625\u0650\u0630 \u0623\u0645\u0631\u062a\u0643 \u0642\u0627\u0644 \u0623\u0646\u0627 \u062e\u064a\u0631 \u0645\u0646\u0647",fr:"Qu\u2019est-ce qui t\u2019emp\u00eache de te prosterner quand Je te l\u2019ai ordonn\u00e9 ? Il dit : Je suis meilleur que lui.",commentary:"L\u2019orgueil est le premier p\u00e9ch\u00e9 de l\u2019histoire. Iblis a refus\u00e9 de se prosterner par arrogance."},
          {type:"hadith",ref:"Muslim 91",ar:"\u0644\u0627 \u064a\u062f\u062e\u0644 \u0627\u0644\u062c\u0646\u0651\u0629 \u0645\u0646 \u0643\u0627\u0646 \u0641\u064a \u0642\u0644\u0628\u0647 \u0645\u062b\u0642\u0627\u0644 \u0630\u0631\u0651\u0629 \u0645\u0646 \u0643\u0628\u0631",fr:"N\u2019entrera pas au Paradis celui qui a dans son c\u0153ur le poids d\u2019un atome d\u2019orgueil.",commentary:"Le Proph\u00e8te a d\u00e9fini l\u2019orgueil : rejeter la v\u00e9rit\u00e9 et m\u00e9priser les gens. M\u00eame un atome suffit."},
          {type:"hadith",ref:"Muslim 2620",ar:"\u0645\u0627 \u0646\u0642\u0635\u062a \u0635\u062f\u0642\u0629 \u0645\u0646 \u0645\u0627\u0644 \u0648\u0645\u0627 \u0632\u0627\u062f \u0627\u0644\u0644\u0651\u0647 \u0639\u0628\u062f\u0627 \u0628\u0639\u0641\u0648 \u0625\u0650\u0644\u0651\u0627 \u0639\u0632\u0651\u0627 \u0648\u0645\u0627 \u062a\u0648\u0627\u0636\u0639 \u0623\u062d\u062f \u0644\u0644\u0651\u0647 \u0625\u0650\u0644\u0651\u0627 \u0631\u0641\u0639\u0647 \u0627\u0644\u0644\u0651\u0647",fr:"Personne ne fait preuve d\u2019humilit\u00e9 pour Allah sans qu\u2019Allah ne l\u2019\u00e9l\u00e8ve.",commentary:"L\u2019humilit\u00e9 \u00e9l\u00e8ve tandis que l\u2019orgueil rabaisse. C\u2019est une loi divine immuable."}
        ]
      }
    }
  };


  function initEmotionWheel() {
    var wheel = $("dash-emotion-wheel");
    if (!wheel) return;
    var count = EMOTION_WORDS.length;
    var step = 16;
    var fadeStart = 40;
    var fadeEnd = 75;

    var saved = localStorage.getItem("qurani-emotion");
    if (saved) {
      var idx = EMOTION_WORDS.indexOf(saved);
      if (idx >= 0) emotionIndex = idx;
    }

    wheel.innerHTML = "";
    var wordEls = [];
    EMOTION_WORDS.forEach(function(word) {
      var span = document.createElement("span");
      span.className = "dash-emotion-word";
      span.textContent = word;
      wordEls.push(span);
      wheel.appendChild(span);
    });

    function opacityForAngle(angle) {
      var a = Math.abs(angle);
      if (a <= 1) return 0.85;
      if (a <= fadeStart) return 0.35;
      if (a >= fadeEnd) return 0;
      return 0.35 * (1 - (a - fadeStart) / (fadeEnd - fadeStart));
    }

    function applyPositions(animated, extra) {
      var ex = extra || 0;
      wordEls.forEach(function(el, i) {
        var angle = (i - emotionIndex) * step + ex;
        el.style.transition = animated
          ? "transform 0.4s cubic-bezier(.4,0,.2,1), opacity 0.4s ease"
          : "none";
        el.style.transform = "rotate(" + (angle - 90) + "deg) translateX(55px)";
        el.style.opacity = String(opacityForAngle(angle));
      });
    }

    function syncTitle() {
      $("dash-emotion-selected").textContent = EMOTION_WORDS[emotionIndex];
      localStorage.setItem("qurani-emotion", EMOTION_WORDS[emotionIndex]);
    }

    applyPositions(false);
    syncTitle();

    var tX = 0, active = false, drift = 0, velocity = 0, lastX = 0, lastTime = 0;
    var PX_PER_STEP = 50; // pixels to swipe for one emotion step

    wheel.addEventListener("touchstart", function(e) {
      tX = e.touches[0].clientX;
      lastX = tX;
      lastTime = Date.now();
      active = true;
      drift = 0;
      velocity = 0;
    }, { passive: true });

    wheel.addEventListener("touchmove", function(e) {
      if (!active) return;
      var cx = e.touches[0].clientX;
      var now = Date.now();
      var dt = now - lastTime;
      if (dt > 0) velocity = (cx - lastX) / dt;
      lastX = cx;
      lastTime = now;
      drift = (cx - tX) / PX_PER_STEP * step;
      applyPositions(false, drift);
    }, { passive: true });

    wheel.addEventListener("touchend", function() {
      if (!active) return;
      active = false;
      // Add momentum: velocity in px/ms, convert to steps
      var momentum = velocity * 80 / PX_PER_STEP * step;
      var totalDrift = drift + momentum;
      var off = Math.round(-totalDrift / step);
      emotionIndex = Math.max(0, Math.min(count - 1, emotionIndex + off));
      drift = 0;
      velocity = 0;
      applyPositions(true);
      syncTitle();
    });

    wheel.addEventListener("click", function(e) {
      var t = e.target;
      if (!t.classList.contains("dash-emotion-word")) return;
      var idx = wordEls.indexOf(t);
      if (idx < 0 || idx === emotionIndex) return;
      emotionIndex = idx;
      applyPositions(true);
      syncTitle();
    });
  }

  function openEmotionDetail() {
    var word = EMOTION_WORDS[emotionIndex];
    var data = EMOTION_DATA[word];
    if (!data) return;
    var overlay = $("emotion-overlay");
    overlay.style.background = data.gradient;
    $("emotion-title").textContent = word;
    $("emotion-quote").textContent = data.quote;
    var turnList = $("emotion-turn-towards");
    turnList.innerHTML = "";
    data.turnTowards.forEach(function(item) {
      var li = document.createElement("li");
      li.textContent = item;
      turnList.appendChild(li);
    });
    var guardList = $("emotion-guard-against");
    guardList.innerHTML = "";
    data.guardAgainst.forEach(function(item) {
      var li = document.createElement("li");
      li.textContent = item;
      guardList.appendChild(li);
    });
    var art = data.article;
    $("emotion-article").style.background = data.articleBg;
    $("emotion-article-title").textContent = art.title;
    var entriesEl = $("emotion-article-entries");
    entriesEl.innerHTML = "";
    art.entries.forEach(function(entry) {
      var block = document.createElement("div");
      block.className = "emotion-entry";
      var badge = document.createElement("span");
      badge.className = "emotion-entry-badge " + entry.type;
      badge.textContent = entry.type === "verset" ? "VERSET" : "HADITH";
      block.appendChild(badge);
      if (entry.ar) {
        var ar = document.createElement("p");
        ar.className = "emotion-entry-ar";
        ar.dir = "rtl";
        ar.textContent = entry.ar;
        block.appendChild(ar);
      }
      if (entry.fr) {
        var fr = document.createElement("p");
        fr.className = "emotion-entry-fr";
        fr.textContent = entry.fr;
        block.appendChild(fr);
      }
      var ref = document.createElement("p");
      ref.className = "emotion-entry-ref";
      ref.textContent = entry.ref;
      block.appendChild(ref);
      if (entry.commentary) {
        var comm = document.createElement("p");
        comm.className = "emotion-entry-commentary";
        comm.textContent = entry.commentary;
        block.appendChild(comm);
      }
      entriesEl.appendChild(block);
    });
    var scroll = overlay.querySelector(".emotion-overlay-scroll");
    if (scroll) scroll.scrollTop = 0;
    overlay.classList.remove("hidden");
  }

  function closeEmotionDetail() {
    _closeBack("emotion-overlay");
  }


  // ============================================================
  // DU'A / INVOCATIONS — DATA & FUNCTIONS
  // ============================================================
  var DUA_CATEGORIES = [
    {
      id: "matin",
      name: "Invocations du matin",
      icon: "\u2600\uFE0F",
      gradient: "linear-gradient(165deg, #1a2535 0%, #152030 30%, #101a28 60%, #0c1520 100%)",
      articleBg: "rgba(10,16,25,0.95)",
      quote: "Les adhkar du matin, bouclier du croyant jusqu\u2019au soir.",
      articleTitle: "Adhkar as-Sabah",
      entries: [
        {type:"dua",ref:"Al-Baqarah 2:255 (Ayat al-Kursi)",ar:"\u0627\u0644\u0644\u0651\u0647 \u0644\u0627 \u0625\u0650\u0644\u0647 \u0625\u0650\u0644\u0651\u0627 \u0647\u0648 \u0627\u0644\u062d\u064a\u0651 \u0627\u0644\u0642\u064a\u0651\u0648\u0645 \u0644\u0627 \u062a\u0623\u062e\u0630\u0647 \u0633\u0646\u0629 \u0648\u0644\u0627 \u0646\u0648\u0645",fr:"Allah ! Point de divinit\u00e9 \u00e0 part Lui, le Vivant, Celui qui subsiste par Lui-m\u00eame. Ni somnolence ni sommeil ne Le saisissent."},
        {type:"dua",ref:"Muslim 2723",ar:"\u0623\u0635\u0628\u062d\u0646\u0627 \u0648\u0623\u0635\u0628\u062d \u0627\u0644\u0645\u0644\u0643 \u0644\u0644\u0651\u0647 \u0648\u0627\u0644\u062d\u0645\u062f \u0644\u0644\u0651\u0647 \u0644\u0627 \u0625\u0650\u0644\u0647 \u0625\u0650\u0644\u0651\u0627 \u0627\u0644\u0644\u0651\u0647 \u0648\u062d\u062f\u0647 \u0644\u0627 \u0634\u0631\u064a\u0643 \u0644\u0647",fr:"Nous voil\u00e0 au matin et le royaume appartient \u00e0 Allah. Louange \u00e0 Allah. Nulle divinit\u00e9 except\u00e9 Allah, Seul, sans associ\u00e9."},
        {type:"dua",ref:"Abu Dawud 5068",ar:"\u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0628\u0643 \u0623\u0635\u0628\u062d\u0646\u0627 \u0648\u0628\u0643 \u0623\u0645\u0633\u064a\u0646\u0627 \u0648\u0628\u0643 \u0646\u062d\u064a\u0627 \u0648\u0628\u0643 \u0646\u0645\u0648\u062a \u0648\u0625\u0650\u0644\u064a\u0643 \u0627\u0644\u0646\u0651\u0634\u0648\u0631",fr:"O Allah, c\u2019est par Toi que nous arrivons au matin, par Toi au soir, par Toi nous vivons, par Toi nous mourons, et vers Toi est la r\u00e9surrection."},
        {type:"dua",ref:"Abu Dawud 5069",ar:"\u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0645\u0627 \u0623\u0635\u0628\u062d \u0628\u064a \u0645\u0646 \u0646\u0639\u0645\u0629 \u0623\u0648 \u0628\u0623\u062d\u062f \u0645\u0646 \u062e\u0644\u0642\u0643 \u0641\u0645\u0646\u0643 \u0648\u062d\u062f\u0643 \u0644\u0627 \u0634\u0631\u064a\u0643 \u0644\u0643 \u0641\u0644\u0643 \u0627\u0644\u062d\u0645\u062f \u0648\u0644\u0643 \u0627\u0644\u0634\u0651\u0643\u0631",fr:"O Allah, tout bienfait qui m\u2019atteint ou atteint l\u2019une de Tes cr\u00e9atures vient de Toi Seul, sans associ\u00e9. A Toi la louange et la gratitude."},
        {type:"dua",ref:"Bukhari 6306 (Sayyid al-Istighfar)",ar:"\u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0623\u0646\u062a \u0631\u0628\u0651\u064a \u0644\u0627 \u0625\u0650\u0644\u0647 \u0625\u0650\u0644\u0651\u0627 \u0623\u0646\u062a \u062e\u0644\u0642\u062a\u0646\u064a \u0648\u0623\u0646\u0627 \u0639\u0628\u062f\u0643 \u0648\u0623\u0646\u0627 \u0639\u0644\u0649 \u0639\u0647\u062f\u0643 \u0648\u0648\u0639\u062f\u0643 \u0645\u0627 \u0627\u0633\u062a\u0637\u0639\u062a",fr:"O Allah, Tu es mon Seigneur, il n\u2019y a de divinit\u00e9 que Toi. Tu m\u2019as cr\u00e9\u00e9 et je suis Ton serviteur. Je m\u2019en tiens \u00e0 Ton pacte et \u00e0 Ta promesse autant que je le peux."},
        {type:"dua",ref:"Muslim 2692",ar:"\u0644\u0627 \u0625\u0650\u0644\u0647 \u0625\u0650\u0644\u0651\u0627 \u0627\u0644\u0644\u0651\u0647 \u0648\u062d\u062f\u0647 \u0644\u0627 \u0634\u0631\u064a\u0643 \u0644\u0647 \u0644\u0647 \u0627\u0644\u0645\u0644\u0643 \u0648\u0644\u0647 \u0627\u0644\u062d\u0645\u062f \u0648\u0647\u0648 \u0639\u0644\u0649 \u0643\u0644\u0651 \u0634\u064a\u0621 \u0642\u062f\u064a\u0631",fr:"Nulle divinit\u00e9 except\u00e9 Allah, Seul sans associ\u00e9. A Lui le royaume, \u00e0 Lui la louange et Il est capable de toute chose. (10 fois)"},
        {type:"dua",ref:"Muslim 2691",ar:"\u0633\u0628\u062d\u0627\u0646 \u0627\u0644\u0644\u0651\u0647 \u0648\u0628\u062d\u0645\u062f\u0647",fr:"Gloire \u00e0 Allah et louange \u00e0 Lui. (100 fois le matin : efface les p\u00e9ch\u00e9s m\u00eame s\u2019ils \u00e9galaient l\u2019\u00e9cume de la mer)"},
        {type:"dua",ref:"Abu Dawud 5088",ar:"\u0628\u0633\u0645 \u0627\u0644\u0644\u0651\u0647 \u0627\u0644\u0651\u0630\u064a \u0644\u0627 \u064a\u0636\u0631\u0651 \u0645\u0639 \u0627\u0633\u0645\u0647 \u0634\u064a\u0621 \u0641\u064a \u0627\u0644\u0623\u0631\u0636 \u0648\u0644\u0627 \u0641\u064a \u0627\u0644\u0633\u0651\u0645\u0627\u0621 \u0648\u0647\u0648 \u0627\u0644\u0633\u0651\u0645\u064a\u0639 \u0627\u0644\u0639\u0644\u064a\u0645",fr:"Au nom d\u2019Allah, avec le nom de Qui rien ne peut nuire sur terre ni au ciel, et Il est l\u2019Audient, l\u2019Omniscient. (3 fois)"}
      ]
    },
    {
      id: "soir",
      name: "Invocations du soir",
      icon: "\uD83C\uDF19",
      gradient: "linear-gradient(165deg, #141428 0%, #101024 30%, #0c0c1e 60%, #080818 100%)",
      articleBg: "rgba(8,8,18,0.95)",
      quote: "Les adhkar du soir, protection du croyant jusqu\u2019\u00e0 l\u2019aube.",
      articleTitle: "Adhkar al-Massa",
      entries: [
        {type:"dua",ref:"Al-Baqarah 2:255 (Ayat al-Kursi)",ar:"\u0627\u0644\u0644\u0651\u0647 \u0644\u0627 \u0625\u0650\u0644\u0647 \u0625\u0650\u0644\u0651\u0627 \u0647\u0648 \u0627\u0644\u062d\u064a\u0651 \u0627\u0644\u0642\u064a\u0651\u0648\u0645 \u0644\u0627 \u062a\u0623\u062e\u0630\u0647 \u0633\u0646\u0629 \u0648\u0644\u0627 \u0646\u0648\u0645",fr:"Allah ! Point de divinit\u00e9 \u00e0 part Lui, le Vivant, Celui qui subsiste par Lui-m\u00eame."},
        {type:"dua",ref:"Muslim 2723",ar:"\u0623\u0645\u0633\u064a\u0646\u0627 \u0648\u0623\u0645\u0633\u0649 \u0627\u0644\u0645\u0644\u0643 \u0644\u0644\u0651\u0647 \u0648\u0627\u0644\u062d\u0645\u062f \u0644\u0644\u0651\u0647 \u0644\u0627 \u0625\u0650\u0644\u0647 \u0625\u0650\u0644\u0651\u0627 \u0627\u0644\u0644\u0651\u0647 \u0648\u062d\u062f\u0647 \u0644\u0627 \u0634\u0631\u064a\u0643 \u0644\u0647",fr:"Nous voil\u00e0 au soir et le royaume appartient \u00e0 Allah. Louange \u00e0 Allah. Nulle divinit\u00e9 except\u00e9 Allah, Seul, sans associ\u00e9."},
        {type:"dua",ref:"Abu Dawud 5071",ar:"\u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0628\u0643 \u0623\u0645\u0633\u064a\u0646\u0627 \u0648\u0628\u0643 \u0623\u0635\u0628\u062d\u0646\u0627 \u0648\u0628\u0643 \u0646\u062d\u064a\u0627 \u0648\u0628\u0643 \u0646\u0645\u0648\u062a \u0648\u0625\u0650\u0644\u064a\u0643 \u0627\u0644\u0645\u0635\u064a\u0631",fr:"O Allah, c\u2019est par Toi que nous arrivons au soir, par Toi au matin, par Toi nous vivons, par Toi nous mourons et vers Toi est le devenir."},
        {type:"dua",ref:"Abu Dawud 5069",ar:"\u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0645\u0627 \u0623\u0645\u0633\u0649 \u0628\u064a \u0645\u0646 \u0646\u0639\u0645\u0629 \u0623\u0648 \u0628\u0623\u062d\u062f \u0645\u0646 \u062e\u0644\u0642\u0643 \u0641\u0645\u0646\u0643 \u0648\u062d\u062f\u0643 \u0644\u0627 \u0634\u0631\u064a\u0643 \u0644\u0643",fr:"O Allah, tout bienfait qui m\u2019atteint ce soir ou atteint l\u2019une de Tes cr\u00e9atures vient de Toi Seul."},
        {type:"dua",ref:"Bukhari 6306 (Sayyid al-Istighfar)",ar:"\u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0623\u0646\u062a \u0631\u0628\u0651\u064a \u0644\u0627 \u0625\u0650\u0644\u0647 \u0625\u0650\u0644\u0651\u0627 \u0623\u0646\u062a \u062e\u0644\u0642\u062a\u0646\u064a \u0648\u0623\u0646\u0627 \u0639\u0628\u062f\u0643",fr:"O Allah, Tu es mon Seigneur, il n\u2019y a de divinit\u00e9 que Toi. Tu m\u2019as cr\u00e9\u00e9 et je suis Ton serviteur."},
        {type:"dua",ref:"Muslim 2709",ar:"\u0623\u0639\u0648\u0630 \u0628\u0643\u0644\u0645\u0627\u062a \u0627\u0644\u0644\u0651\u0647 \u0627\u0644\u062a\u0651\u0627\u0645\u0651\u0627\u062a \u0645\u0646 \u0634\u0631\u0651 \u0645\u0627 \u062e\u0644\u0642",fr:"Je cherche refuge dans les paroles parfaites d\u2019Allah contre le mal de ce qu\u2019Il a cr\u00e9\u00e9. (3 fois le soir)"},
        {type:"dua",ref:"Abu Dawud 5088",ar:"\u0628\u0633\u0645 \u0627\u0644\u0644\u0651\u0647 \u0627\u0644\u0651\u0630\u064a \u0644\u0627 \u064a\u0636\u0631\u0651 \u0645\u0639 \u0627\u0633\u0645\u0647 \u0634\u064a\u0621 \u0641\u064a \u0627\u0644\u0623\u0631\u0636 \u0648\u0644\u0627 \u0641\u064a \u0627\u0644\u0633\u0651\u0645\u0627\u0621",fr:"Au nom d\u2019Allah avec le nom de Qui rien ne peut nuire sur terre ni au ciel. (3 fois)"}
      ]
    },
    {
      id: "dormir",
      name: "Avant de dormir",
      icon: "\uD83D\uDCA4",
      gradient: "linear-gradient(165deg, #12121e 0%, #0e0e1a 30%, #0a0a16 60%, #060612 100%)",
      articleBg: "rgba(6,6,14,0.95)",
      quote: "En Ton nom, \u00f4 Allah, je vis et je meurs.",
      articleTitle: "Adhkar an-Nawm",
      entries: [
        {type:"dua",ref:"Bukhari 6314",ar:"\u0628\u0627\u0633\u0645\u0643 \u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0623\u0645\u0648\u062a \u0648\u0623\u062d\u064a\u0627",fr:"En Ton nom, \u00f4 Allah, je meurs et je vis."},
        {type:"dua",ref:"Bukhari 7393",ar:"\u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0625\u0650\u0646\u0651\u064a \u0623\u0633\u0644\u0645\u062a \u0646\u0641\u0633\u064a \u0625\u0650\u0644\u064a\u0643 \u0648\u0641\u0648\u0651\u0636\u062a \u0623\u0645\u0631\u064a \u0625\u0650\u0644\u064a\u0643 \u0648\u0648\u062c\u0651\u0647\u062a \u0648\u062c\u0647\u064a \u0625\u0650\u0644\u064a\u0643",fr:"O Allah, je me suis soumis \u00e0 Toi, je T\u2019ai confi\u00e9 mon affaire, j\u2019ai tourn\u00e9 mon visage vers Toi."},
        {type:"dua",ref:"Abu Dawud 5051",ar:"\u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0642\u0646\u064a \u0639\u0630\u0627\u0628\u0643 \u064a\u0648\u0645 \u062a\u0628\u0639\u062b \u0639\u0628\u0627\u062f\u0643",fr:"O Allah, pr\u00e9serve-moi de Ton ch\u00e2timent le jour o\u00f9 Tu ressusciteras Tes serviteurs."},
        {type:"dua",ref:"Al-Mulk 67:1-2 (Sourate al-Mulk)",ar:"\u062a\u0628\u0627\u0631\u0643 \u0627\u0644\u0651\u0630\u064a \u0628\u064a\u062f\u0647 \u0627\u0644\u0645\u0644\u0643 \u0648\u0647\u0648 \u0639\u0644\u0649 \u0643\u0644\u0651 \u0634\u064a\u0621 \u0642\u062f\u064a\u0631",fr:"B\u00e9ni soit Celui dans la main de Qui est la royaut\u00e9 et qui est Omnipotent. (Lire sourate al-Mulk avant de dormir)"},
        {type:"dua",ref:"Bukhari 5017",ar:"\u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0631\u0628\u0651 \u0627\u0644\u0633\u0651\u0645\u0627\u0648\u0627\u062a \u0627\u0644\u0633\u0651\u0628\u0639 \u0648\u0631\u0628\u0651 \u0627\u0644\u0639\u0631\u0634 \u0627\u0644\u0639\u0638\u064a\u0645 \u0631\u0628\u0651\u0646\u0627 \u0648\u0631\u0628\u0651 \u0643\u0644\u0651 \u0634\u064a\u0621",fr:"O Allah, Seigneur des sept cieux et du Tr\u00f4ne immense, notre Seigneur et le Seigneur de toute chose."},
        {type:"dua",ref:"Muslim 2712 (Tasbi7 avant le sommeil)",ar:"\u0633\u0628\u062d\u0627\u0646 \u0627\u0644\u0644\u0651\u0647 \u0663\u0663 \u0648\u0627\u0644\u062d\u0645\u062f \u0644\u0644\u0651\u0647 \u0663\u0663 \u0648\u0627\u0644\u0644\u0651\u0647 \u0623\u0643\u0628\u0631 \u0663\u0664",fr:"SubhanAllah 33 fois, Alhamdulillah 33 fois, Allahu Akbar 34 fois."}
      ]
    },
    {
      id: "protection",
      name: "Protection",
      icon: "\uD83D\uDEE1\uFE0F",
      gradient: "linear-gradient(165deg, #1a2228 0%, #151d24 30%, #10181e 60%, #0c1418 100%)",
      articleBg: "rgba(10,15,20,0.95)",
      quote: "Cherche refuge aupr\u00e8s du Seigneur de l\u2019aube naissante.",
      articleTitle: "Invocations de protection",
      entries: [
        {type:"dua",ref:"Muslim 2709",ar:"\u0623\u0639\u0648\u0630 \u0628\u0643\u0644\u0645\u0627\u062a \u0627\u0644\u0644\u0651\u0647 \u0627\u0644\u062a\u0651\u0627\u0645\u0651\u0627\u062a \u0645\u0646 \u0634\u0631\u0651 \u0645\u0627 \u062e\u0644\u0642",fr:"Je cherche refuge dans les paroles parfaites d\u2019Allah contre le mal de ce qu\u2019Il a cr\u00e9\u00e9."},
        {type:"dua",ref:"Abu Dawud 5088",ar:"\u0628\u0633\u0645 \u0627\u0644\u0644\u0651\u0647 \u0627\u0644\u0651\u0630\u064a \u0644\u0627 \u064a\u0636\u0631\u0651 \u0645\u0639 \u0627\u0633\u0645\u0647 \u0634\u064a\u0621 \u0641\u064a \u0627\u0644\u0623\u0631\u0636 \u0648\u0644\u0627 \u0641\u064a \u0627\u0644\u0633\u0651\u0645\u0627\u0621 \u0648\u0647\u0648 \u0627\u0644\u0633\u0651\u0645\u064a\u0639 \u0627\u0644\u0639\u0644\u064a\u0645",fr:"Au nom d\u2019Allah, avec le nom de Qui rien ne peut nuire sur terre ni au ciel, et Il est l\u2019Audient, l\u2019Omniscient. (3 fois)"},
        {type:"dua",ref:"Al-Falaq 113:1-5",ar:"\u0642\u0644 \u0623\u0639\u0648\u0630 \u0628\u0631\u0628\u0651 \u0627\u0644\u0641\u0644\u0642 \u0645\u0646 \u0634\u0631\u0651 \u0645\u0627 \u062e\u0644\u0642",fr:"Dis : \u00abJe cherche refuge aupr\u00e8s du Seigneur de l\u2019aube naissante, contre le mal de ce qu\u2019Il a cr\u00e9\u00e9.\u00bb (Sourate al-Falaq)"},
        {type:"dua",ref:"An-Nas 114:1-6",ar:"\u0642\u0644 \u0623\u0639\u0648\u0630 \u0628\u0631\u0628\u0651 \u0627\u0644\u0646\u0651\u0627\u0633 \u0645\u0644\u0643 \u0627\u0644\u0646\u0651\u0627\u0633 \u0625\u0650\u0644\u0647 \u0627\u0644\u0646\u0651\u0627\u0633",fr:"Dis : \u00abJe cherche refuge aupr\u00e8s du Seigneur des hommes, le Roi des hommes, le Dieu des hommes.\u00bb (Sourate an-Nas)"},
        {type:"dua",ref:"Tirmidhi 3528",ar:"\u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0625\u0650\u0646\u0651\u064a \u0623\u0639\u0648\u0630 \u0628\u0643 \u0645\u0646 \u0634\u0631\u0651 \u0633\u0645\u0639\u064a \u0648\u0645\u0646 \u0634\u0631\u0651 \u0628\u0635\u0631\u064a \u0648\u0645\u0646 \u0634\u0631\u0651 \u0644\u0633\u0627\u0646\u064a \u0648\u0645\u0646 \u0634\u0631\u0651 \u0642\u0644\u0628\u064a",fr:"O Allah, je cherche refuge aupr\u00e8s de Toi contre le mal de mon ou\u00efe, de ma vue, de ma langue et de mon c\u0153ur."}
      ]
    },
    {
      id: "tristesse",
      name: "Tristesse & angoisse",
      icon: "\uD83D\uDCA7",
      gradient: "linear-gradient(165deg, #1a1a2e 0%, #161628 30%, #111122 60%, #0d0d1a 100%)",
      articleBg: "rgba(10,10,20,0.95)",
      quote: "O Allah, je suis Ton serviteur, mon sort est dans Ta main.",
      articleTitle: "Du\u2019as contre la tristesse",
      entries: [
        {type:"dua",ref:"Ahmad 3712",ar:"\u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0625\u0650\u0646\u0651\u064a \u0639\u0628\u062f\u0643 \u0627\u0628\u0646 \u0639\u0628\u062f\u0643 \u0627\u0628\u0646 \u0623\u0645\u062a\u0643 \u0646\u0627\u0635\u064a\u062a\u064a \u0628\u064a\u062f\u0643 \u0645\u0627\u0636 \u0641\u064a\u0651 \u062d\u0643\u0645\u0643 \u0639\u062f\u0644 \u0641\u064a\u0651 \u0642\u0636\u0627\u0624\u0643",fr:"O Allah, je suis Ton serviteur, fils de Ton serviteur, fils de Ta servante. Mon sort est dans Ta main. Ton jugement s\u2019accomplit sur moi. Ton d\u00e9cret est juste \u00e0 mon \u00e9gard."},
        {type:"dua",ref:"Al-Anbiya 21:87",ar:"\u0644\u0627 \u0625\u0650\u0644\u0647 \u0625\u0650\u0644\u0651\u0627 \u0623\u0646\u062a \u0633\u0628\u062d\u0627\u0646\u0643 \u0625\u0650\u0646\u0651\u064a \u0643\u0646\u062a \u0645\u0646 \u0627\u0644\u0638\u0651\u0627\u0644\u0645\u064a\u0646",fr:"Point de divinit\u00e9 \u00e0 part Toi ! Puret\u00e9 \u00e0 Toi ! J\u2019ai \u00e9t\u00e9 du nombre des injustes. (L\u2019invocation de Yunus)"},
        {type:"dua",ref:"Abu Dawud 1525",ar:"\u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0625\u0650\u0646\u0651\u064a \u0623\u0639\u0648\u0630 \u0628\u0643 \u0645\u0646 \u0627\u0644\u0647\u0645\u0651 \u0648\u0627\u0644\u062d\u0632\u0646 \u0648\u0627\u0644\u0639\u062c\u0632 \u0648\u0627\u0644\u0643\u0633\u0644 \u0648\u0627\u0644\u0628\u062e\u0644 \u0648\u0627\u0644\u062c\u0628\u0646 \u0648\u0636\u0644\u0639 \u0627\u0644\u062f\u0651\u064a\u0646 \u0648\u063a\u0644\u0628\u0629 \u0627\u0644\u0631\u0651\u062c\u0627\u0644",fr:"O Allah, je cherche refuge aupr\u00e8s de Toi contre le souci, la tristesse, l\u2019impuissance, la paresse, l\u2019avarice, la l\u00e2chet\u00e9, le fardeau des dettes et la domination des hommes."},
        {type:"dua",ref:"Muslim 2721",ar:"\u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0631\u062d\u0645\u062a\u0643 \u0623\u0631\u062c\u0648 \u0641\u0644\u0627 \u062a\u0643\u0644\u0646\u064a \u0625\u0650\u0644\u0649 \u0646\u0641\u0633\u064a \u0637\u0631\u0641\u0629 \u0639\u064a\u0646 \u0648\u0623\u0635\u0644\u062d \u0644\u064a \u0634\u0623\u0646\u064a \u0643\u0644\u0651\u0647",fr:"O Allah, c\u2019est Ta mis\u00e9ricorde que j\u2019esp\u00e8re. Ne me laisse pas \u00e0 moi-m\u00eame un seul instant et am\u00e9liore toute ma situation."}
      ]
    },
    {
      id: "voyage",
      name: "Du voyageur",
      icon: "\u2708\uFE0F",
      gradient: "linear-gradient(165deg, #1e2830 0%, #1a242c 30%, #151e26 60%, #101820 100%)",
      articleBg: "rgba(12,18,24,0.95)",
      quote: "Trois invocations ne sont pas rejet\u00e9es, dont celle du voyageur.",
      articleTitle: "Du\u2019as du voyage",
      entries: [
        {type:"dua",ref:"Muslim 1342",ar:"\u0633\u0628\u062d\u0627\u0646 \u0627\u0644\u0651\u0630\u064a \u0633\u062e\u0651\u0631 \u0644\u0646\u0627 \u0647\u0630\u0627 \u0648\u0645\u0627 \u0643\u0646\u0651\u0627 \u0644\u0647 \u0645\u0642\u0631\u0646\u064a\u0646 \u0648\u0625\u0650\u0646\u0651\u0627 \u0625\u0650\u0644\u0649 \u0631\u0628\u0651\u0646\u0627 \u0644\u0645\u0646\u0642\u0644\u0628\u0648\u0646",fr:"Gloire \u00e0 Celui qui a mis ceci \u00e0 notre service alors que nous n\u2019\u00e9tions pas capables de le faire. Et c\u2019est vers notre Seigneur que nous retournerons."},
        {type:"dua",ref:"Muslim 1342",ar:"\u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0625\u0650\u0646\u0651\u0627 \u0646\u0633\u0623\u0644\u0643 \u0641\u064a \u0633\u0641\u0631\u0646\u0627 \u0647\u0630\u0627 \u0627\u0644\u0628\u0631\u0651 \u0648\u0627\u0644\u062a\u0651\u0642\u0648\u0649 \u0648\u0645\u0646 \u0627\u0644\u0639\u0645\u0644 \u0645\u0627 \u062a\u0631\u0636\u0649",fr:"O Allah, nous Te demandons dans ce voyage la pi\u00e9t\u00e9, la crainte, et les \u0153uvres dont Tu es satisfait."},
        {type:"dua",ref:"Muslim 1342",ar:"\u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0647\u0648\u0651\u0646 \u0639\u0644\u064a\u0646\u0627 \u0633\u0641\u0631\u0646\u0627 \u0647\u0630\u0627 \u0648\u0627\u0637\u0648\u0650 \u0639\u0646\u0651\u0627 \u0628\u0639\u062f\u0647",fr:"O Allah, facilite-nous ce voyage et rapproche-nous de sa destination."}
      ]
    },
    {
      id: "istikhara",
      name: "Salat al-Istikhara",
      icon: "\uD83E\uDD32",
      gradient: "linear-gradient(165deg, #1e2428 0%, #1a2024 30%, #151a1e 60%, #101518 100%)",
      articleBg: "rgba(12,16,18,0.95)",
      quote: "Consulte ton Seigneur avant toute d\u00e9cision importante.",
      articleTitle: "Pri\u00e8re de consultation",
      entries: [
        {type:"dua",ref:"Bukhari 1166",ar:"\u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0625\u0650\u0646\u0651\u064a \u0623\u0633\u062a\u062e\u064a\u0631\u0643 \u0628\u0639\u0644\u0645\u0643 \u0648\u0623\u0633\u062a\u0642\u062f\u0631\u0643 \u0628\u0642\u062f\u0631\u062a\u0643 \u0648\u0623\u0633\u0623\u0644\u0643 \u0645\u0646 \u0641\u0636\u0644\u0643 \u0627\u0644\u0639\u0638\u064a\u0645 \u0641\u0625\u0650\u0646\u0651\u0643 \u062a\u0642\u062f\u0631 \u0648\u0644\u0627 \u0623\u0642\u062f\u0631 \u0648\u062a\u0639\u0644\u0645 \u0648\u0644\u0627 \u0623\u0639\u0644\u0645 \u0648\u0623\u0646\u062a \u0639\u0644\u0651\u0627\u0645 \u0627\u0644\u063a\u064a\u0648\u0628",fr:"O Allah, je Te consulte par Ta science et je Te demande de m\u2019accorder le pouvoir par Ta puissance, et je Te demande de Ta gr\u00e2ce immense. Car Tu es capable et je ne suis pas capable, Tu sais et je ne sais pas, et Tu es le Grand Connaisseur de l\u2019invisible."},
        {type:"dua",ref:"Bukhari 1166 (suite)",ar:"\u0627\u0644\u0644\u0651\u0647\u0645\u0651 \u0625\u0650\u0646 \u0643\u0646\u062a \u062a\u0639\u0644\u0645 \u0623\u0646\u0651 \u0647\u0630\u0627 \u0627\u0644\u0623\u0645\u0631 \u062e\u064a\u0631 \u0644\u064a \u0641\u064a \u062f\u064a\u0646\u064a \u0648\u0645\u0639\u0627\u0634\u064a \u0648\u0639\u0627\u0642\u0628\u0629 \u0623\u0645\u0631\u064a \u0641\u0627\u0642\u062f\u0631\u0647 \u0644\u064a \u0648\u064a\u0633\u0651\u0631\u0647 \u0644\u064a \u062b\u0645\u0651 \u0628\u0627\u0631\u0643 \u0644\u064a \u0641\u064a\u0647",fr:"O Allah, si Tu sais que cette affaire est un bien pour ma religion, ma vie et ma destin\u00e9e, d\u00e9cr\u00e8te-la pour moi, facilite-la moi et b\u00e9nis-la moi."}
      ]
    },
    {
      id: "rabbana",
      name: "Les 40 Rabbana",
      icon: "\uD83D\uDCD6",
      gradient: "linear-gradient(165deg, #1a2530 0%, #15202b 30%, #101a24 60%, #0c151e 100%)",
      articleBg: "rgba(8,14,22,0.95)",
      quote: "Notre Seigneur, accorde-nous le bien ici-bas et dans l\u2019au-del\u00e0.",
      articleTitle: "Les Rabbana du Coran",
      entries: [
        {type:"verset",ref:"Al-Baqarah 2:127",ar:"\u0631\u0628\u0651\u0646\u0627 \u062a\u0642\u0628\u0651\u0644 \u0645\u0646\u0651\u0627 \u0625\u0650\u0646\u0651\u0643 \u0623\u0646\u062a \u0627\u0644\u0633\u0651\u0645\u064a\u0639 \u0627\u0644\u0639\u0644\u064a\u0645",fr:"Notre Seigneur, accepte ceci de notre part, car c\u2019est Toi l\u2019Audient, l\u2019Omniscient."},
        {type:"verset",ref:"Al-Baqarah 2:128",ar:"\u0631\u0628\u0651\u0646\u0627 \u0648\u0627\u062c\u0639\u0644\u0646\u0627 \u0645\u0633\u0644\u0645\u064a\u0646 \u0644\u0643 \u0648\u0645\u0646 \u0630\u0631\u0651\u064a\u062a\u0646\u0627 \u0623\u0645\u0651\u0629 \u0645\u0633\u0644\u0645\u0629 \u0644\u0643",fr:"Notre Seigneur, fais de nous des soumis \u00e0 Toi et de notre descendance une communaut\u00e9 soumise \u00e0 Toi."},
        {type:"verset",ref:"Al-Baqarah 2:201",ar:"\u0631\u0628\u0651\u0646\u0627 \u0622\u062a\u0646\u0627 \u0641\u064a \u0627\u0644\u062f\u0651\u0646\u064a\u0627 \u062d\u0633\u0646\u0629 \u0648\u0641\u064a \u0627\u0644\u0622\u062e\u0631\u0629 \u062d\u0633\u0646\u0629 \u0648\u0642\u0646\u0627 \u0639\u0630\u0627\u0628 \u0627\u0644\u0646\u0651\u0627\u0631",fr:"Notre Seigneur, accorde-nous un bien ici-bas et un bien dans l\u2019au-del\u00e0, et pr\u00e9serve-nous du ch\u00e2timent du Feu."},
        {type:"verset",ref:"Al-Baqarah 2:250",ar:"\u0631\u0628\u0651\u0646\u0627 \u0623\u0641\u0631\u063a \u0639\u0644\u064a\u0646\u0627 \u0635\u0628\u0631\u0627 \u0648\u062b\u0628\u0651\u062a \u0623\u0642\u062f\u0627\u0645\u0646\u0627 \u0648\u0627\u0646\u0635\u0631\u0646\u0627 \u0639\u0644\u0649 \u0627\u0644\u0642\u0648\u0645 \u0627\u0644\u0643\u0627\u0641\u0631\u064a\u0646",fr:"Notre Seigneur, d\u00e9verse sur nous la patience, affermis nos pas et donne-nous la victoire."},
        {type:"verset",ref:"Al-Baqarah 2:286",ar:"\u0631\u0628\u0651\u0646\u0627 \u0644\u0627 \u062a\u0624\u0627\u062e\u0630\u0646\u0627 \u0625\u0650\u0646 \u0646\u0633\u064a\u0646\u0627 \u0623\u0648 \u0623\u062e\u0637\u0623\u0646\u0627",fr:"Notre Seigneur, ne nous ch\u00e2tie pas s\u2019il nous arrive d\u2019oublier ou de commettre une erreur."},
        {type:"verset",ref:"Al Imran 3:8",ar:"\u0631\u0628\u0651\u0646\u0627 \u0644\u0627 \u062a\u0632\u063a \u0642\u0644\u0648\u0628\u0646\u0627 \u0628\u0639\u062f \u0625\u0650\u0630 \u0647\u062f\u064a\u062a\u0646\u0627 \u0648\u0647\u0628 \u0644\u0646\u0627 \u0645\u0646 \u0644\u062f\u0646\u0643 \u0631\u062d\u0645\u0629",fr:"Notre Seigneur, ne fais pas d\u00e9vier nos c\u0153urs apr\u00e8s nous avoir guid\u00e9s, et accorde-nous Ta mis\u00e9ricorde."},
        {type:"verset",ref:"Al Imran 3:16",ar:"\u0631\u0628\u0651\u0646\u0627 \u0625\u0650\u0646\u0651\u0646\u0627 \u0622\u0645\u0646\u0651\u0627 \u0641\u0627\u063a\u0641\u0631 \u0644\u0646\u0627 \u0630\u0646\u0648\u0628\u0646\u0627 \u0648\u0642\u0646\u0627 \u0639\u0630\u0627\u0628 \u0627\u0644\u0646\u0651\u0627\u0631",fr:"Notre Seigneur, nous avons cru. Pardonne-nous nos p\u00e9ch\u00e9s et pr\u00e9serve-nous du ch\u00e2timent du Feu."},
        {type:"verset",ref:"Al Imran 3:53",ar:"\u0631\u0628\u0651\u0646\u0627 \u0622\u0645\u0646\u0651\u0627 \u0628\u0645\u0627 \u0623\u0646\u0632\u0644\u062a \u0648\u0627\u062a\u0651\u0628\u0639\u0646\u0627 \u0627\u0644\u0631\u0651\u0633\u0648\u0644 \u0641\u0627\u0643\u062a\u0628\u0646\u0627 \u0645\u0639 \u0627\u0644\u0634\u0651\u0627\u0647\u062f\u064a\u0646",fr:"Notre Seigneur, nous avons cru en ce que Tu as r\u00e9v\u00e9l\u00e9 et suivi le messager. Inscris-nous parmi les t\u00e9moins."},
        {type:"verset",ref:"Al Imran 3:147",ar:"\u0631\u0628\u0651\u0646\u0627 \u0627\u063a\u0641\u0631 \u0644\u0646\u0627 \u0630\u0646\u0648\u0628\u0646\u0627 \u0648\u0625\u0650\u0633\u0631\u0627\u0641\u0646\u0627 \u0641\u064a \u0623\u0645\u0631\u0646\u0627 \u0648\u062b\u0628\u0651\u062a \u0623\u0642\u062f\u0627\u0645\u0646\u0627",fr:"Notre Seigneur, pardonne-nous nos p\u00e9ch\u00e9s et nos exc\u00e8s, affermis nos pas."},
        {type:"verset",ref:"Al Imran 3:191",ar:"\u0631\u0628\u0651\u0646\u0627 \u0645\u0627 \u062e\u0644\u0642\u062a \u0647\u0630\u0627 \u0628\u0627\u0637\u0644\u0627 \u0633\u0628\u062d\u0627\u0646\u0643 \u0641\u0642\u0646\u0627 \u0639\u0630\u0627\u0628 \u0627\u0644\u0646\u0651\u0627\u0631",fr:"Notre Seigneur, Tu n\u2019as pas cr\u00e9\u00e9 cela en vain. Gloire \u00e0 Toi ! Pr\u00e9serve-nous du ch\u00e2timent du Feu."},
        {type:"verset",ref:"Al-A\u2019raf 7:23",ar:"\u0631\u0628\u0651\u0646\u0627 \u0638\u0644\u0645\u0646\u0627 \u0623\u0646\u0641\u0633\u0646\u0627 \u0648\u0625\u0650\u0646 \u0644\u0645 \u062a\u063a\u0641\u0631 \u0644\u0646\u0627 \u0648\u062a\u0631\u062d\u0645\u0646\u0627 \u0644\u0646\u0643\u0648\u0646\u0646\u0651 \u0645\u0646 \u0627\u0644\u062e\u0627\u0633\u0631\u064a\u0646",fr:"Notre Seigneur, nous nous sommes fait du tort. Si Tu ne nous pardonnes pas et ne nous fais pas mis\u00e9ricorde, nous serons des perdants."},
        {type:"verset",ref:"Al-Hashr 59:10",ar:"\u0631\u0628\u0651\u0646\u0627 \u0627\u063a\u0641\u0631 \u0644\u0646\u0627 \u0648\u0644\u0625\u0650\u062e\u0648\u0627\u0646\u0646\u0627 \u0627\u0644\u0651\u0630\u064a\u0646 \u0633\u0628\u0642\u0648\u0646\u0627 \u0628\u0627\u0644\u0625\u064a\u0645\u0627\u0646 \u0648\u0644\u0627 \u062a\u062c\u0639\u0644 \u0641\u064a \u0642\u0644\u0648\u0628\u0646\u0627 \u063a\u0644\u0651\u0627 \u0644\u0644\u0651\u0630\u064a\u0646 \u0622\u0645\u0646\u0648\u0627",fr:"Notre Seigneur, pardonne-nous ainsi qu\u2019\u00e0 nos fr\u00e8res qui nous ont pr\u00e9c\u00e9d\u00e9s dans la foi, et ne mets pas dans nos c\u0153urs de rancune envers les croyants."},
        {type:"verset",ref:"At-Tahrim 66:8",ar:"\u0631\u0628\u0651\u0646\u0627 \u0623\u062a\u0645\u0645 \u0644\u0646\u0627 \u0646\u0648\u0631\u0646\u0627 \u0648\u0627\u063a\u0641\u0631 \u0644\u0646\u0627 \u0625\u0650\u0646\u0651\u0643 \u0639\u0644\u0649 \u0643\u0644\u0651 \u0634\u064a\u0621 \u0642\u062f\u064a\u0631",fr:"Notre Seigneur, parfais-nous notre lumi\u00e8re et pardonne-nous, car Tu es Omnipotent."},
        {type:"verset",ref:"Al-Furqan 25:74",ar:"\u0631\u0628\u0651\u0646\u0627 \u0647\u0628 \u0644\u0646\u0627 \u0645\u0646 \u0623\u0632\u0648\u0627\u062c\u0646\u0627 \u0648\u0630\u0631\u0651\u064a\u0651\u0627\u062a\u0646\u0627 \u0642\u0631\u0651\u0629 \u0623\u0639\u064a\u0646 \u0648\u0627\u062c\u0639\u0644\u0646\u0627 \u0644\u0644\u0645\u062a\u0651\u0642\u064a\u0646 \u0625\u0650\u0645\u0627\u0645\u0627",fr:"Notre Seigneur, fais que nos \u00e9pouses et nos descendants soient la joie de nos yeux, et fais de nous des mod\u00e8les pour les pieux."},
        {type:"verset",ref:"Ibrahim 14:40",ar:"\u0631\u0628\u0651 \u0627\u062c\u0639\u0644\u0646\u064a \u0645\u0642\u064a\u0645 \u0627\u0644\u0635\u0651\u0644\u0627\u0629 \u0648\u0645\u0646 \u0630\u0631\u0651\u064a\u062a\u064a \u0631\u0628\u0651\u0646\u0627 \u0648\u062a\u0642\u0628\u0651\u0644 \u062f\u0639\u0627\u0621",fr:"Seigneur ! Fais que j\u2019accomplisse assid\u00fbment la pri\u00e8re ainsi qu\u2019une partie de ma descendance. Notre Seigneur, exauce ma pri\u00e8re."},
        {type:"verset",ref:"Ibrahim 14:41",ar:"\u0631\u0628\u0651\u0646\u0627 \u0627\u063a\u0641\u0631 \u0644\u064a \u0648\u0644\u0648\u0627\u0644\u062f\u064a\u0651 \u0648\u0644\u0644\u0645\u0624\u0645\u0646\u064a\u0646 \u064a\u0648\u0645 \u064a\u0642\u0648\u0645 \u0627\u0644\u062d\u0633\u0627\u0628",fr:"Notre Seigneur, pardonne-moi, \u00e0 mes parents et aux croyants le jour o\u00f9 se dressera le Compte."}
      ]
    }
  ];


  function initDuaGrid() {
    var grid = $("dua-grid");
    if (!grid) return;
    grid.innerHTML = "";
    DUA_CATEGORIES.forEach(function(cat, idx) {
      var card = document.createElement("div");
      card.className = "dua-card";
      card.innerHTML = '<div class="dua-card-icon">' + cat.icon + '</div>' +
        '<div class="dua-card-name">' + cat.name + '</div>' +
        '<div class="dua-card-count">' + cat.entries.length + ' invocations</div>';
      card.addEventListener("click", function() { openDuaDetail(idx); });
      grid.appendChild(card);
    });
  }

  function openDuaDetail(idx) {
    var cat = DUA_CATEGORIES[idx];
    if (!cat) return;
    var overlay = $("dua-overlay");
    overlay.style.background = cat.gradient;
    $("dua-title").textContent = cat.name;
    $("dua-quote").textContent = cat.quote;
    $("dua-article").style.background = cat.articleBg;
    $("dua-article-title").textContent = cat.articleTitle;
    var entriesEl = $("dua-entries");
    entriesEl.innerHTML = "";
    cat.entries.forEach(function(entry) {
      var block = document.createElement("div");
      block.className = "emotion-entry";
      var badge = document.createElement("span");
      badge.className = "emotion-entry-badge " + (entry.type === "verset" ? "verset" : "dua");
      badge.textContent = entry.type === "verset" ? "VERSET" : "DU\u2019A";
      block.appendChild(badge);
      if (entry.ar) {
        var ar = document.createElement("p");
        ar.className = "emotion-entry-ar";
        ar.dir = "rtl";
        ar.textContent = entry.ar;
        block.appendChild(ar);
      }
      if (entry.fr) {
        var fr = document.createElement("p");
        fr.className = "emotion-entry-fr";
        fr.textContent = entry.fr;
        block.appendChild(fr);
      }
      var ref = document.createElement("p");
      ref.className = "emotion-entry-ref";
      ref.textContent = entry.ref;
      block.appendChild(ref);
      entriesEl.appendChild(block);
    });
    var scroll = overlay.querySelector(".emotion-overlay-scroll");
    if (scroll) scroll.scrollTop = 0;
    overlay.classList.remove("hidden");
  }

  function closeDuaDetail() {
    _closeBack("dua-overlay");
  }

  // ---- INIT ----
  async function init() {
    var splashBar = $("splash-bar");
    var splashEl = $("splash");

    // Apply theme early so splash matches user's theme
    state = loadState();
    applyTheme();

    // Animate progress bar during load
    var splashStart = Date.now();
    if (splashBar) splashBar.style.width = "30%";

    try {
      var results = await Promise.all([
        fetch("quran.json").then(function (r) { return r.json(); }),
        fetch("quran-fr.json").then(function (r) { return r.json(); })
      ]);

      if (splashBar) splashBar.style.width = "70%";

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

    if (splashBar) splashBar.style.width = "100%";

    applyMode();  // apply reading mode before showing UI

    $("app").classList.remove("hidden");

    // Ensure splash stays at least 3s total so user can read the verse
    var elapsed = Date.now() - splashStart;
    var remaining = Math.max(0, 3000 - elapsed);
    await new Promise(function (resolve) { setTimeout(resolve, remaining); });
    if (splashEl) {
      splashEl.classList.add("splash-hide");
      // Remove from DOM after fade transition
      setTimeout(function () { splashEl.remove(); }, 700);
    }

    render();

    // ---- DASHBOARD INIT ----
    initTabBar();
    initDashboardPrayer();
    initDashboardCards();

    // Whole prayer bar + expand button opens full prayer overlay
    var prayerBar = $("dash-prayer-bar");
    if (prayerBar) {
      prayerBar.addEventListener("click", function () {
        openPrayerOverlay();
      });
      prayerBar.style.cursor = "pointer";
    }
    // Invocations card click
    var invocBtn = $("dash-invocation-btn");
    if (invocBtn) {
      invocBtn.addEventListener("click", function () {
        // Switch to invocation tab
        var tabBar = $("tab-bar");
        if (tabBar) {
          tabBar.querySelectorAll(".tab-bar-btn").forEach(function (b) { b.classList.remove("active"); });
          var invTab = tabBar.querySelector('[data-tab="invocation"]');
          if (invTab) invTab.classList.add("active");
        }
        document.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.add("hidden"); });
        var panel = $("tab-invocation");
        if (panel) panel.classList.remove("hidden");
      });
    }
    // Reading card click — go to Coran tab
    var readingCard = $("dash-reading-card");
    if (readingCard) {
      readingCard.addEventListener("click", function () {
        var tabBar = $("tab-bar");
        if (tabBar) {
          tabBar.querySelectorAll(".tab-bar-btn").forEach(function (b) { b.classList.remove("active"); });
          var coranTab = tabBar.querySelector('[data-tab="coran"]');
          if (coranTab) coranTab.classList.add("active");
        }
        document.querySelectorAll(".tab-panel").forEach(function (p) { p.classList.add("hidden"); });
        var panel = $("tab-coran");
        if (panel) panel.classList.remove("hidden");
      });
    }
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
    // Helper: open an overlay from the menu (pushes menu to history for back-navigation)
    function _fromMenu(fn) {
      $("menu-overlay").classList.add("hidden");
      _overlayHistory.push("menu-overlay");
      fn();
    }
    $("menu-settings").addEventListener("click", function (e) {
      e.preventDefault();
      _fromMenu(function() { render(); updateReminderUI(); $("settings-overlay").classList.remove("hidden"); });
    });
    $("menu-browse").addEventListener("click", function (e) {
      e.preventDefault();
      _fromMenu(function() { $("surah-overlay").classList.remove("hidden"); });
    });
    $("menu-bookmarks").addEventListener("click", function (e) {
      e.preventDefault();
      _fromMenu(function() { renderBookmarksList(); $("bookmarks-overlay").classList.remove("hidden"); });
    });
    $("menu-stats").addEventListener("click", function (e) {
      e.preventDefault();
      _fromMenu(function() { renderStats(); $("stats-overlay").classList.remove("hidden"); });
    });
    $("menu-about").addEventListener("click", function (e) {
      e.preventDefault();
      _fromMenu(function() { $("about-overlay").classList.remove("hidden"); });
    });
    $("menu-help").addEventListener("click", function (e) {
      e.preventDefault();
      _fromMenu(function() { $("help-overlay").classList.remove("hidden"); });
    });
    $("menu-prayer").addEventListener("click", function (e) {
      e.preventDefault();
      _fromMenu(openPrayerOverlay);
    });
    $("menu-hifz").addEventListener("click", function (e) {
      e.preventDefault();
      _fromMenu(openHifzFromCurrent);
    });
    $("menu-listen").addEventListener("click", function (e) {
      e.preventDefault();
      _fromMenu(openListenOverlay);
    });
    $("menu-shazam").addEventListener("click", function (e) {
      e.preventDefault();
      _fromMenu(openShazamOverlay);
    });
    $("menu-qibla").addEventListener("click", function (e) {
      e.preventDefault();
      _fromMenu(openQiblaOverlay);
    });
    // Close buttons → retour au menu (ou écran précédent)
    $("stats-close").addEventListener("click", function () { _closeBack("stats-overlay"); });
    $("about-close").addEventListener("click", function () { _closeBack("about-overlay"); });
    $("help-close").addEventListener("click", function () { _closeBack("help-overlay"); });

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
    $("prayer-mosque-change").addEventListener("click", function() {
      clearMawaqitMosque();
      openPrayerOverlay();
    });

    // Prayer overlay: settings & qibla buttons
    if ($("prayer-settings-btn")) {
      $("prayer-settings-btn").addEventListener("click", function () {
        var panel = $("prayer-settings-panel");
        if (panel) {
          panel.classList.remove("hidden");
          // Small delay so CSS transition triggers
          setTimeout(function () { panel.classList.add("visible"); }, 20);
          renderPrayerMethodButtons();
          renderPrayerLocationBar();
        }
      });
    }
    if ($("prayer-settings-close")) {
      $("prayer-settings-close").addEventListener("click", function () {
        var panel = $("prayer-settings-panel");
        panel.classList.remove("visible");
        setTimeout(function () { panel.classList.add("hidden"); }, 350);
      });
    }
    if ($("prayer-qibla-btn")) {
      $("prayer-qibla-btn").addEventListener("click", function () {
        closePrayerOverlay();
        openQiblaOverlay();
      });
    }

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


    // ---- LISTEN ----
    $("listen-close").addEventListener("click", closeListenOverlay);
    $("listen-play-btn").addEventListener("click", listenToggle);
    $("listen-prev-btn").addEventListener("click", listenPrevSurah);
    $("listen-next-btn").addEventListener("click", listenNextSurah);
    $("listen-reciter-select").addEventListener("change", function () {
      listenSelectReciter(parseInt(this.value, 10));
    });
    listenInitSeekEvents();

    // ---- SHAZAM ----
    $("shazam-close").addEventListener("click", closeShazamOverlay);
    $("shazam-btn").addEventListener("click", shazamToggle);
    $("shazam-goto").addEventListener("click", shazamGoToVerse);
    $("shazam-prev").addEventListener("click", function () { shazamNavVerse(-1); });
    $("shazam-next").addEventListener("click", function () { shazamNavVerse(1); });
    $("shazam-retry").addEventListener("click", function () {
      shazamSetState("idle");
    });
    $("shazam-new").addEventListener("click", function () {
      shazamSetState("idle");
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
    $("settings-close").addEventListener("click", function () {
      _closeBack("settings-overlay");
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
        // Show color sub-group for the selected mode
        var minG = $("minimal-color-group");
        var tajG = $("tajwid-color-group");
        if (minG) minG.classList.toggle("hidden", btn.dataset.mode !== "minimal");
        if (tajG) tajG.classList.toggle("hidden", btn.dataset.mode !== "tajwid");
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

    // reset-btn removed from settings HTML (kept for safety)
    if ($("reset-btn")) {
      $("reset-btn").addEventListener("click", function () {
        if (confirm("Tout réinitialiser ? Cette action est irréversible.")) {
          state = defaultState();
          goalDismissed = false;
          saveState();
          render();
          $("settings-overlay").classList.add("hidden");
        }
      });
    }

    // ---- RECITER SELECT (SETTINGS) ----
    var settingsReciterSelect = $("settings-reciter-select");
    if (settingsReciterSelect) {
      RECITERS.filter(function (r) { return r.id; }).forEach(function (r) {
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
    // stats-bookmarks-link removed from HTML (bookmarks now inline in settings)
    if ($("stats-bookmarks-link")) {
      $("stats-bookmarks-link").addEventListener("click", function (e) {
        e.preventDefault();
        renderBookmarksList();
        $("bookmarks-overlay").classList.remove("hidden");
      });
    }

    // ---- BOOKMARKS ----
    $("bookmarks-close").addEventListener("click", function () {
      _closeBack("bookmarks-overlay");
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
      _closeBack("surah-overlay");
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
      $("search-overlay").classList.add("hidden");
    });
    $("search-browse-btn").addEventListener("click", function () {
      $("search-overlay").classList.add("hidden");
      $("surah-overlay").classList.remove("hidden");
    });
    $("search-input").addEventListener("input", function () {
      var val = this.value.trim();
      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        performSearch(val);
      }, 300);
    });


    // ---- EMOTION WHEEL ----
    initEmotionWheel();
    $("dash-emotion-plus").addEventListener("click", openEmotionDetail);
    $("emotion-close").addEventListener("click", closeEmotionDetail);
    $("emotion-share").addEventListener("click", function() {
      var word = EMOTION_WORDS[emotionIndex];
      var data = EMOTION_DATA[word];
      if (!data) return;
      var text = word + "\n\n" + data.quote + "\n\nQurani App";
      if (navigator.share) {
        navigator.share({ title: word, text: text }).catch(function(){});
      } else {
        navigator.clipboard.writeText(text).catch(function(){});
      }
    });

    // ---- DU'A TAB ----
    initDuaGrid();
    $("dua-close").addEventListener("click", closeDuaDetail);
    $("dua-share").addEventListener("click", function() {
      var title = $("dua-title").textContent;
      var text = title + "\n\nQurani App";
      if (navigator.share) {
        navigator.share({ title: title, text: text }).catch(function(){});
      } else {
        navigator.clipboard.writeText(text).catch(function(){});
      }
    });

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(function () {});

      // Auto-reload when a new service worker takes over (ensures users always get latest version)
      var refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", function () {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    }
  }

  init();
})();
