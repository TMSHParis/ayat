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

  function openPrayerOverlay() {
    $("prayer-overlay").classList.remove("hidden");
    $("prayer-loading").classList.remove("hidden");
    $("prayer-error").classList.add("hidden");
    $("prayer-content").classList.add("hidden");
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
            $("prayer-content").classList.add("hidden");
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
        $("prayer-content").classList.remove("hidden");
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
      $("prayer-content").classList.remove("hidden");
      renderPrayerTimes();
      startPrayerCountdown();
      savePrayerTimesToBridge();
    } catch (e) {
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
    var prayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var isSounnah = getPrayerMethod() === "islamsounnah";
    // Add night info lines for IslamSounnah method
    if (isSounnah && prayerTimesCache.Midnight) prayers.push("Midnight");
    if (isSounnah && prayerTimesCache.LastThird) prayers.push("LastThird");
    var listEl = $("prayer-times-list");
    listEl.innerHTML = "";
    var now = new Date();
    var nextPrayer = null;
    var prevPrayer = null;
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
      if (!isInfo && isPast) prevPrayer = { key: key, date: pDate };
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
    // ---- Progress bar between prev and next prayer ----
    var fillEl = $("prayer-progress-fill");
    var prevLbl = $("prayer-progress-prev");
    var nextLbl = $("prayer-progress-next");
    if (fillEl) {
      if (nextPrayer && prevPrayer) {
        var total = nextPrayer.date - prevPrayer.date;
        var elapsed = now - prevPrayer.date;
        var pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
        fillEl.style.width = pct + "%";
        if (prevLbl) prevLbl.textContent = PRAYER_NAMES[prevPrayer.key];
        if (nextLbl) nextLbl.textContent = PRAYER_NAMES[nextPrayer.key];
      } else if (!prevPrayer && nextPrayer) {
        // Before Fajr — no previous prayer today
        fillEl.style.width = "0%";
        if (prevLbl) prevLbl.textContent = "";
        if (nextLbl) nextLbl.textContent = PRAYER_NAMES[nextPrayer.key];
      } else {
        // After Isha
        fillEl.style.width = "100%";
        if (prevLbl) prevLbl.textContent = prevPrayer ? PRAYER_NAMES[prevPrayer.key] : "";
        if (nextLbl) nextLbl.textContent = "Fajr";
      }
    }
  }

  function startPrayerCountdown() {
    if (prayerCountdownInterval) clearInterval(prayerCountdownInterval);
    prayerCountdownInterval = setInterval(renderPrayerTimes, 60000);
  }

  function closePrayerOverlay() {
    _closeBack("prayer-overlay", function() {
      if (prayerCountdownInterval) { clearInterval(prayerCountdownInterval); prayerCountdownInterval = null; }
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
          span.className = "hifz-word hifz-revealed";
        });
      } else {
        span.className = "hifz-word";
        if (allSegments && wordOffsets[idx] !== undefined) {
          _applyColorSegmentsToSpan(span, word, allSegments, wordOffsets[idx]);
        } else {
          span.textContent = word;
        }
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
      status.textContent = "Appuyez pour écouter la récitation";
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

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    }
  }

  init();
})();
