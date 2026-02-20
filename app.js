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
    if (freeReadMode) { goNextFreeRead(); return; }
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
  }

  function goPrev() {
    if (freeReadMode) { goPrevFreeRead(); return; }
    if (state.globalIndex <= 0) return;
    state.globalIndex--;
    state.todayReadCount = Math.max(0, state.todayReadCount - 1);
    saveState();
    fadeAndRender();
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
      showToast("Favori retiré");
    } else {
      bookmarks.push({
        key: key,
        surahNumber: ayah.surahNumber,
        surahNameFr: ayah.surahNameFr,
        ayahNumber: ayah.ayahNumber,
        text: ayah.text,
        date: getLocalDateStr()
      });
      showToast("Ajouté aux favoris");
    }
    saveBookmarks(bookmarks);
    updateBookmarkBtn();
  }

  function renderBookmarksList() {
    var list = $("bookmarks-list");
    var empty = $("bookmarks-empty");
    var bookmarks = loadBookmarks();
    list.innerHTML = "";
    if (bookmarks.length === 0) {
      list.appendChild(empty);
      return;
    }
    empty.remove();
    bookmarks.slice().reverse().forEach(function (b) {
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
      list.appendChild(item);
    });
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
      !$("search-overlay").classList.contains("hidden")
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
      !$("search-overlay").classList.contains("hidden")
    ) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown" || e.key === " ") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      goPrev();
    }
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

    document.addEventListener("keydown", onKeyDown);

    $("continue-btn").addEventListener("click", function () {
      goalDismissed = true;
      $("goal-reached").classList.add("hidden");
    });

    // ---- HAMBURGER → opens settings panel directly ----
    $("menu-btn").addEventListener("click", function () {
      render();
      updateReminderUI();
      renderStats();
      $("settings-overlay").classList.remove("hidden");
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

    // ---- BOTTOM BAR ICONS ----
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
