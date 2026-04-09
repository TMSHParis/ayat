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

  // ---- SURAH TRANSLITERATIONS ----
  var SURAH_TRANSLIT = [
    "", // 0 unused
    "Al-Fatiha","Al-Baqara","Ali 'Imran","An-Nisa'",
    "Al-Ma'ida","Al-An'am","Al-A'raf","Al-Anfal",
    "At-Tawba","Yunus","Hud","Yusuf",
    "Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl",
    "Al-Isra'","Al-Kahf","Maryam","Ta-Ha",
    "Al-Anbiya'","Al-Hajj","Al-Mu'minun","An-Nur",
    "Al-Furqan","Ash-Shu'ara'","An-Naml","Al-Qasas",
    "Al-'Ankabut","Ar-Rum","Luqman","As-Sajda",
    "Al-Ahzab","Saba'","Fatir","Ya-Sin",
    "As-Saffat","Sad","Az-Zumar","Ghafir",
    "Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan",
    "Al-Jathiya","Al-Ahqaf","Muhammad","Al-Fath",
    "Al-Hujurat","Qaf","Adh-Dhariyat","At-Tur",
    "An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'a",
    "Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahana",
    "As-Saf","Al-Jumu'a","Al-Munafiqun","At-Taghabun",
    "At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam",
    "Al-Haqqa","Al-Ma'arij","Nuh","Al-Jinn",
    "Al-Muzzammil","Al-Muddaththir","Al-Qiyama","Al-Insan",
    "Al-Mursalat","An-Naba'","An-Nazi'at","'Abasa",
    "At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq",
    "Al-Buruj","At-Tariq","Al-A'la","Al-Ghashiya",
    "Al-Fajr","Al-Balad","Ash-Shams","Al-Layl",
    "Ad-Duha","Ash-Sharh","At-Tin","Al-'Alaq",
    "Al-Qadr","Al-Bayyina","Az-Zalzala","Al-'Adiyat",
    "Al-Qari'a","At-Takathur","Al-'Asr","Al-Humaza",
    "Al-Fil","Quraysh","Al-Ma'un","Al-Kawthar",
    "Al-Kafirun","An-Nasr","Al-Masad","Al-Ikhlas",
    "Al-Falaq","An-Nas"
  ];

  // Surah background images (50 landscape photos, cycling for 114 surahs)
  var PRAYER_IMGS = [
    "1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","8.jpg","9.jpg","10.jpg",
    "11.jpg","12.jpg","13.jpg","14.jpg","15.jpg","16.jpg","17.jpg","18.jpg","19.jpg","20.png",
    "21.jpg","22.jpg","23.jpg","24.jpg","25.jpg","26.jpg","27.jpg","28.jpg","29.jpg","30.jpg",
    "31.jpg","32.jpg","33.jpg","34.jpg","35.jpg","36.png","37.jpg","38.jpg","39.jpg","40.png",
    "41.jpg","42.jpg","43.jpg","44.jpg","45.jpg","47.jpg","48.jpg","49.jpg","50.jpg","51.jpg",
    "52.jpg","53.jpg","54.jpg","55.jpg","56.jpg","57.jpg","58.jpg","59.jpg","60.jpg",
    "61.jpg","62.jpg","63.jpg","64.png","65.jpg","66.jpg","67.jpg","68.jpg","69.jpg","70.jpg",
    "71.jpg","72.jpg","73.jpg","74.jpg","75.jpg","76.jpg","77.jpg","78.jpg","79.jpg","80.jpg",
    "81.jpg","82.jpg","83.jpg","84.jpg","85.jpg","86.jpg","87.jpg","88.jpg","89.jpg","90.jpg",
    "91.jpg","92.jpg","93.jpg","94.jpg","95.jpg","96.jpg","97.jpg","98.jpg","99.jpg","100.jpg",
    "101.jpg","102.jpg","103.jpg","104.jpg","105.jpg","106.jpg","108.jpg","109.jpg","110.jpg",
    "111.jpg","112.jpg","113.jpg","114.jpg","115.jpg","116.jpg","117.jpg"
  ];
  function getSurahImg(surahNum) {
    return "img/prayer/" + PRAYER_IMGS[(surahNum - 1) % PRAYER_IMGS.length];
  }

  // ---- DATA ----
  var surahs = [];
  var surahsFr = []; // French translation (parallel structure)
  var surahsEn = []; // English translation (Sahih International)
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
  function _safeJson(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  var state = null;
  var goalDismissed = false;

  // ---- DUA FAVORITES ----
  var DUA_FAV_KEY = "qurani-dua-favorites";
  function loadDuaFavorites() {
    try { var raw = localStorage.getItem(DUA_FAV_KEY); return raw ? JSON.parse(raw) : []; }
    catch (e) { return []; }
  }
  function saveDuaFavorites(favs) {
    localStorage.setItem(DUA_FAV_KEY, JSON.stringify(favs));
    if (typeof debouncedSync === "function") debouncedSync();
  }
  function isDuaFavorite(catId, entryIdx) {
    return loadDuaFavorites().some(function(f) { return f.catId === catId && f.entryIdx === entryIdx; });
  }
  function toggleDuaFavorite(catId, entryIdx, entry) {
    var favs = loadDuaFavorites();
    var idx = -1;
    for (var i = 0; i < favs.length; i++) {
      if (favs[i].catId === catId && favs[i].entryIdx === entryIdx) { idx = i; break; }
    }
    if (idx >= 0) {
      favs.splice(idx, 1);
      saveDuaFavorites(favs);
      showToast("Favori retiré");
      return false;
    } else {
      var cat = null;
      for (var c = 0; c < DUA_CATEGORIES.length; c++) {
        if (DUA_CATEGORIES[c].id === catId) { cat = DUA_CATEGORIES[c]; break; }
      }
      favs.push({
        catId: catId,
        entryIdx: entryIdx,
        catName: cat ? cat.name : "",
        type: entry.type,
        ref: entry.ref,
        ar: entry.ar || "",
        fr: entry.fr || "",
        ph: entry.ph || "",
        date: getLocalDateStr()
      });
      saveDuaFavorites(favs);
      showToast("Ajouté aux favoris");
      return true;
    }
  }

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
    if (typeof debouncedSync === "function") debouncedSync();
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
    if (typeof debouncedSync === "function") debouncedSync();
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

  // Count Arabic letters only (exclude tashkeel/diacritics, spaces, non-Arabic)
  // Based on hadith: each letter = 10 hassanates
  function countArabicLetters(text) {
    if (!text) return 0;
    var count = 0;
    for (var i = 0; i < text.length; i++) {
      var c = text.charCodeAt(i);
      if (c < 0x0620 || c > 0x06FF) continue; // non-Arabic
      if (c >= 0x064B && c <= 0x065F) continue; // harakat (fatha, kasra, damma, sukun, shadda…)
      if (c >= 0x0610 && c <= 0x061A) continue; // Quranic signs
      if (c >= 0x06D6 && c <= 0x06ED) continue; // Quranic ornamental marks
      if (c >= 0x0660 && c <= 0x0669) continue; // Arabic-Indic digits
      count++;
    }
    return count;
  }

  // Get letter count for a specific verse
  function getVerseLetters(surahIdx, ayahIdx) {
    if (surahs[surahIdx] && surahs[surahIdx].ayahs[ayahIdx]) {
      return countArabicLetters(surahs[surahIdx].ayahs[ayahIdx]);
    }
    return 0;
  }

  function loadStats() {
    try {
      var raw = localStorage.getItem(STATS_KEY);
      if (!raw) return { totalVersesRead: 0, readDates: [], streak: 0, totalReadingSeconds: 0, totalHassanates: 0 };
      var s = JSON.parse(raw);
      if (!s.totalReadingSeconds) s.totalReadingSeconds = 0;
      if (!s.totalHassanates) s.totalHassanates = 0;
      return s;
    } catch (e) { return { totalVersesRead: 0, readDates: [], streak: 0, totalReadingSeconds: 0, totalHassanates: 0 }; }
  }
  function saveStats(stats) {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    if (typeof debouncedSync === "function") debouncedSync();
  }
  function recordReading(count, letters) {
    var n = count || 1;
    var stats = loadStats();
    stats.totalVersesRead += n;
    if (letters && letters > 0) {
      stats.totalHassanates += letters * 10;
    }
    var today = getLocalDateStr();
    if (stats.readDates.indexOf(today) === -1) {
      stats.readDates.push(today);
      // Keep only last 365 days
      if (stats.readDates.length > 365) stats.readDates = stats.readDates.slice(-365);
    }
    // Calculate streak
    stats.streak = computeStreak(stats.readDates);
    saveStats(stats);
    // Refresh dashboard stats if visible
    if (typeof updateDashStats === "function") {
      try { updateDashStats(); } catch(e) {}
    }
    if (typeof updateDashGoalWidget === "function") {
      try { updateDashGoalWidget(); } catch(e) {}
    }
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

  // ---- READING TIME TRACKER ----
  var _readingStartTs = 0;
  function startReadingTimer() {
    if (!_readingStartTs) _readingStartTs = Date.now();
  }
  function stopReadingTimer() {
    if (_readingStartTs) {
      var elapsed = Math.round((Date.now() - _readingStartTs) / 1000);
      _readingStartTs = 0;
      if (elapsed > 2 && elapsed < 7200) {
        var stats = loadStats();
        stats.totalReadingSeconds += elapsed;
        saveStats(stats);
      }
    }
  }

  // ---- NOTES ----
  var NOTES_KEY = "qurani-notes";
  function loadNotes() {
    try {
      var raw = localStorage.getItem(NOTES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function saveNotes(notes) {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    if (typeof debouncedSync === "function") debouncedSync();
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
        // Re-render khatm reader if open and in color mode
        var krMode = khatm && khatm.krMode;
        if (krMode && (krMode === "minimal-color" || krMode === "tajwid-color") && $("khatm-reader") && !$("khatm-reader").classList.contains("hidden")) {
          rerenderKrReader();
        }
        // Re-render surah player if open and in color mode
        var spModeNow = getSpMode();
        if ((spModeNow === "minimal-color" || spModeNow === "tajwid-color") && $("surah-player") && !$("surah-player").classList.contains("hidden")) {
          spRenderReader(spCurrentSurahIdx);
        }
      })
      .catch(function () {
        tajwidLoading = false;
        // Overlay unavailable — tajwid mode shows plain text without colors
      });
  }

  // ---- Phonétique — données locales (quran-phonetic.json) ----
  var phoneticData = null;    // { "1": [...], "2": [...], ... } chargé une seule fois
  var _phoneticDataLoading = false;
  var _phoneticCallbacks = []; // callbacks en attente du chargement

  function loadPhoneticData(callback) {
    if (phoneticData) { callback(phoneticData); return; }
    _phoneticCallbacks.push(callback);
    if (_phoneticDataLoading) return; // déjà en cours
    _phoneticDataLoading = true;
    fetch("quran-phonetic.json")
      .then(function(r) { return r.json(); })
      .then(function(data) {
        phoneticData = data;
        _phoneticDataLoading = false;
        var cbs = _phoneticCallbacks.splice(0);
        cbs.forEach(function(cb) { cb(phoneticData); });
      })
      .catch(function() {
        _phoneticDataLoading = false;
        var cbs = _phoneticCallbacks.splice(0);
        cbs.forEach(function(cb) { cb(null); });
      });
  }

  // Alias pour la compatibilité avec les appels existants (surahNum ignoré, tout est local)
  function loadPhoneticForSurah(surahNum, callback) {
    loadPhoneticData(function(data) {
      callback(data ? (data[surahNum] || null) : null);
    });
  }

  function preloadPhoneticForSurahs(surahNums, callback) {
    loadPhoneticData(function() { callback(); });
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

  // ---- HIJRI DATE (approximate Umm al-Qura style) ----
  var HIJRI_MONTHS = [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' ath-Thani",
    "Jumada al-Ula", "Jumada ath-Thaniya", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
  ];
  function _getHijriDate(date) {
    // Use Intl if available for accurate Hijri
    try {
      var fmt = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
        day: "numeric", month: "numeric", year: "numeric"
      });
      var parts = fmt.formatToParts(date);
      var day = "", month = "", year = "";
      parts.forEach(function(p) {
        if (p.type === "day") day = p.value;
        if (p.type === "month") month = p.value;
        if (p.type === "year") year = p.value;
      });
      var monthIdx = parseInt(month, 10) - 1;
      return { day: parseInt(day, 10), month: monthIdx + 1, monthName: HIJRI_MONTHS[monthIdx] || month, year: parseInt(year, 10) };
    } catch(e) {
      // Fallback: rough approximation
      var epoch = new Date(622, 6, 16).getTime();
      var msPerHijriYear = 354.36667 * 86400000;
      var diff = date.getTime() - epoch;
      var hijriYear = Math.floor(diff / msPerHijriYear) + 1;
      var dayInYear = Math.floor((diff % msPerHijriYear) / 86400000);
      var m = Math.floor(dayInYear / 29.5);
      var d = Math.floor(dayInYear % 29.5) + 1;
      if (m > 11) m = 11;
      return { day: d, month: m + 1, monthName: HIJRI_MONTHS[m], year: hijriYear };
    }
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
      showHassanates: true,
      showDashStats: false,
      riwaya: "hafs",
      _sv: 2,
      minTheme: 'dark',
      minLang: 'ar',
      minMode: 'minimal',
      minSize: 100,
      minSurahIdx: 0,
      minAyahIdx: 0,
    };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      var parsed = JSON.parse(raw);
      var s = Object.assign(defaultState(), parsed);
      // Migration v2 : forcer showDashStats à false pour tous les utilisateurs existants
      if (!parsed._sv || parsed._sv < 2) {
        s.showDashStats = false;
        s._sv = 2;
      }
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
    if (typeof debouncedSync === "function") debouncedSync();
  }

  function getDayIndex(startDate, goalDays) {
    var gd = goalDays || 30;
    var start = new Date(startDate + "T00:00:00");
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var diffMs = today.getTime() - start.getTime();
    var diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    var dayIndex = diffDays + 1;
    if (dayIndex < 1) return 1;
    if (dayIndex > gd) return ((dayIndex - 1) % gd) + 1;
    return dayIndex;
  }

  function computeDayTargets(totalToRead, goalDays) {
    var gd = goalDays || 30;
    var base = Math.floor(totalToRead / gd);
    var remainder = totalToRead % gd;
    var targets = [];
    for (var i = 0; i < gd; i++) {
      targets.push(i < remainder ? base + 1 : base);
    }
    return targets;
  }

  // ---- KHATM VERSE COUNTING HELPERS ----
  function countRecitableVerses(surahIdx) {
    var s = surahs[surahIdx];
    if (!s) return 0;
    var count = s.ayahs.length;
    if (s.surahNumber !== 1 && s.surahNumber !== 9) count -= 1; // exclude basmala
    return count;
  }

  function countTotalRecitableVerses() {
    var total = 0;
    for (var i = 0; i < surahs.length; i++) total += countRecitableVerses(i);
    return total;
  }

  // Convert (surahIdx, ayahIdx) to absolute linear position (recitable verses from start)
  function positionToLinear(surahIdx, ayahIdx) {
    var linear = 0;
    for (var i = 0; i < surahIdx; i++) linear += countRecitableVerses(i);
    var s = surahs[surahIdx];
    if (s && s.surahNumber !== 1 && s.surahNumber !== 9) {
      linear += Math.max(0, ayahIdx - 1); // ayah 0 = basmala, doesn't count
    } else {
      linear += ayahIdx; // surahs 1&9: no basmala, all count
    }
    return linear;
  }

  // Convert absolute linear position back to (surahIdx, ayahIdx)
  function linearToPosition(linear) {
    if (linear <= 0) return { surahIdx: 0, ayahIdx: 0 };
    var remaining = linear;
    for (var i = 0; i < surahs.length; i++) {
      var count = countRecitableVerses(i);
      if (remaining < count) {
        var s = surahs[i];
        var ayahIdx = (s.surahNumber !== 1 && s.surahNumber !== 9) ? remaining + 1 : remaining;
        return { surahIdx: i, ayahIdx: ayahIdx };
      }
      remaining -= count;
      if (remaining === 0 && i + 1 < surahs.length) {
        // Exactly at the start of the next surah
        return { surahIdx: i + 1, ayahIdx: 0 };
      }
    }
    // Exactly at the end of the Quran
    var lastSi = surahs.length - 1;
    return { surahIdx: lastSi, ayahIdx: surahs[lastSi].ayahs.length };
  }

  // Calculate today's reading portion based on khatm progress
  function getTodayPortion() {
    if (!khatm || !khatm.active || !surahs.length) return null;
    var gd = khatm.goalDays || 30;
    var totalVerses = countTotalRecitableVerses();
    var startLinear = positionToLinear(khatm.startSurahIdx, khatm.startAyahIdx);
    var currentLinear = positionToLinear(khatm.surahIdx, khatm.ayahIdx);

    // Verses read since khatm start
    var versesRead = currentLinear - startLinear;
    if (versesRead < 0) versesRead += totalVerses; // wrap-around

    // Which "day" are we on? Based on progress, not calendar
    var targets = computeDayTargets(totalVerses, gd);
    var dayIdx = 0;
    var cumulative = 0;
    for (var d = 0; d < targets.length; d++) {
      if (versesRead < cumulative + targets[d]) { dayIdx = d; break; }
      cumulative += targets[d];
      if (d === targets.length - 1) dayIdx = d;
    }

    // Day start = khatm start + sum of all previous days
    var dayStartLinear = startLinear;
    for (var d2 = 0; d2 < dayIdx; d2++) dayStartLinear += targets[d2];
    if (dayStartLinear >= totalVerses) dayStartLinear = dayStartLinear % totalVerses;

    // Day end = start + today's quota
    var dayEndLinear = dayStartLinear + targets[dayIdx];
    var finished = dayEndLinear >= startLinear + totalVerses;
    var wraps = !finished && dayEndLinear > totalVerses;
    if (dayEndLinear > totalVerses) dayEndLinear = dayEndLinear % totalVerses;

    var startPos = linearToPosition(dayStartLinear);
    var endPos;
    if (finished) {
      // Last day: endPos must point to the actual end of the Quran, not wrap to (0,0)
      var lastSi = surahs.length - 1;
      endPos = { surahIdx: lastSi, ayahIdx: surahs[lastSi].ayahs.length };
    } else if (wraps) {
      // Portion wraps around end of Quran — endPos is in early surahs
      endPos = linearToPosition(dayEndLinear);
    } else {
      endPos = linearToPosition(dayEndLinear);
    }

    return {
      dayIdx: dayIdx,
      dayNumber: dayIdx + 1,
      totalDays: gd,
      versesForToday: targets[dayIdx],
      versesReadToday: versesRead - cumulative,
      startPos: startPos,
      endPos: endPos,
      endLinear: dayEndLinear,
      finished: finished,
      wraps: wraps
    };
  }

  // ---- THEME ----
  function getEffectiveTheme() {
    if (state.theme === "auto") {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    if (state.theme === "prayer") {
      if (typeof _getPrayerThemeEffective === "function") return _getPrayerThemeEffective();
      var h = new Date().getHours();
      return (h >= 19 || h < 5) ? "dark" : "light";
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
    $("freeread-follow-btn").classList.remove("hidden");
  }

  function exitFreeReading() {
    followCleanup();
    $("freeread-follow-btn").classList.add("hidden");
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
    // Track hassanates + stats for free reading
    var ayahText = surahs[freeReadSurahIdx] && surahs[freeReadSurahIdx].ayahs[freeReadAyahIdx];
    if (ayahText) recordReading(1, countArabicLetters(ayahText));
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
        var overlays = (state.riwaya !== "warsh" && tajwidData && tajwidData[key]) ? tajwidData[key] : null;
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
    // Hassanates visibility
    var showH = state.showHassanates !== false;
    var hassWrap = $("stat-hassanates-wrap");
    if (hassWrap) hassWrap.classList.toggle("hidden", !showH);
    var dashHassBlock = $("dash-hassanates-block");
    var dashHassDivider = $("dash-hassanates-divider");
    var dashHassProgress = $("dash-hassanates-progress-line");
    if (dashHassBlock) dashHassBlock.classList.toggle("hidden", !showH);
    if (dashHassDivider) dashHassDivider.classList.toggle("hidden", !showH);
    // Dashboard stats section visibility
    var showDS = state.showDashStats !== false;
    var dashStatsSec = $("dash-stats-section");
    if (dashStatsSec) dashStatsSec.classList.toggle("hidden", !showDS);
    // La ligne de progression des stats se cache si stats cachées OU hassanates cachés
    if (dashHassProgress) dashHassProgress.classList.toggle("hidden", !showH || !showDS);
    if (dashHassBlock) dashHassBlock.classList.toggle("hidden", !showH);
    if (dashHassDivider) dashHassDivider.classList.toggle("hidden", !showH);
    // Sync stats-overlay toggles iOS
    var hassToggle = $("stats-hassanates-toggle");
    if (hassToggle) hassToggle.setAttribute("aria-checked", String(state.showHassanates !== false));
    var dashToggle = $("stats-dashstats-toggle");
    if (dashToggle) dashToggle.setAttribute("aria-checked", String(state.showDashStats !== false));
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
    startReadingTimer(); // Track reading time for swipe reader
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
    var ayah = getAyahByGlobalIndex(newIndex);
    recordReading(1, ayah ? countArabicLetters(ayah.text) : 0);
    updateBookmarkBtn();
    fadeAndRender();
    showDock();
  }

  function goPrev() {
    startReadingTimer(); // Track reading time for swipe reader
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
    list.innerHTML = "";

    if (bookmarks.length === 0 && loadDuaFavorites().length === 0) {
      var emptyMsg = document.createElement("p");
      emptyMsg.className = "bookmarks-empty";
      emptyMsg.textContent = "Aucun favori pour le moment. Appuyez longuement sur un verset pour en ajouter.";
      list.appendChild(emptyMsg);
      return;
    }
    if (bookmarks.length === 0) {
      _renderDuaFavoritesInto(list);
      return;
    }

    // Flat list, reverse-chrono (most recent first)
    bookmarks.slice().reverse().forEach(function (b) {
      var item = document.createElement("div");
      item.className = "fav-item";
      item.dataset.key = b.key;

      // Thumbnail
      var img = document.createElement("img");
      img.className = "fav-thumb";
      img.src = getSurahImg(b.surahNumber);
      img.alt = "";

      // Info block
      var info = document.createElement("div");
      info.className = "fav-info";
      var title = document.createElement("span");
      title.className = "fav-title";
      title.textContent = b.surahNumber + "." + b.ayahNumber + " Surah " + (SURAH_TRANSLIT[b.surahNumber] || "");
      var sub = document.createElement("span");
      sub.className = "fav-sub";
      sub.textContent = "AYAH " + b.ayahNumber;
      info.appendChild(title);
      info.appendChild(sub);

      // Menu button (···)
      var menuBtn = document.createElement("button");
      menuBtn.className = "fav-menu";
      menuBtn.textContent = "\u00B7\u00B7\u00B7";
      menuBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        if (confirm("Supprimer ce favori ?")) {
          var bms = loadBookmarks();
          bms = bms.filter(function(x) { return x.key !== b.key; });
          saveBookmarks(bms);
          _renderBookmarksInto(list);
          showToast("Favori supprim\u00e9");
        }
      });

      // Click → open modern reader at this verse
      item.addEventListener("click", function() {
        var surahIdx = -1;
        for (var i = 0; i < surahs.length; i++) {
          if (surahs[i].surahNumber === b.surahNumber) { surahIdx = i; break; }
        }
        if (surahIdx < 0) return;

        // Close bookmarks overlay
        $("bookmarks-overlay").classList.add("hidden");

        // Open modern surah player
        openSurahPlayer(surahIdx);

        // Scroll to the specific verse after rendering
        setTimeout(function() {
          var num = b.surahNumber;
          var ayahIdx = (num !== 1 && num !== 9) ? b.ayahNumber : b.ayahNumber - 1;
          var target = document.querySelector("#sp-reader-content .sp-verse[data-i='" + ayahIdx + "']");
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
            target.classList.add("sp-verse-active");
            setTimeout(function() { target.classList.remove("sp-verse-active"); }, 3000);
          }
        }, 300);
      });

      item.appendChild(img);
      item.appendChild(info);
      item.appendChild(menuBtn);
      list.appendChild(item);
    });

    // Du'a favorites section
    _renderDuaFavoritesInto(list);
  }

  function _renderDuaFavoritesInto(list) {
    var duaFavs = loadDuaFavorites();
    if (duaFavs.length === 0) return;

    var heading = document.createElement("div");
    heading.className = "fav-section-heading";
    heading.textContent = "Invocations favorites";
    list.appendChild(heading);

    duaFavs.slice().reverse().forEach(function(f) {
      var item = document.createElement("div");
      item.className = "fav-item fav-dua-item";

      // Heart icon as thumbnail
      var icon = document.createElement("div");
      icon.className = "fav-dua-icon";
      icon.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="#e74c5e" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';

      var info = document.createElement("div");
      info.className = "fav-info";
      var title = document.createElement("span");
      title.className = "fav-title";
      title.textContent = f.catName || "Invocation";
      var sub = document.createElement("span");
      sub.className = "fav-sub";
      sub.textContent = f.ref;
      info.appendChild(title);
      info.appendChild(sub);

      var menuBtn = document.createElement("button");
      menuBtn.className = "fav-menu";
      menuBtn.textContent = "\u00B7\u00B7\u00B7";
      (function(fav) {
        menuBtn.addEventListener("click", function(e) {
          e.stopPropagation();
          if (confirm("Supprimer ce favori ?")) {
            var favs = loadDuaFavorites();
            favs = favs.filter(function(x) { return !(x.catId === fav.catId && x.entryIdx === fav.entryIdx); });
            saveDuaFavorites(favs);
            // Re-render entire list
            var parentList = list;
            parentList.innerHTML = "";
            var bookmarks = loadBookmarks();
            if (bookmarks.length === 0 && loadDuaFavorites().length === 0) {
              var emptyMsg = document.createElement("p");
              emptyMsg.className = "bookmarks-empty";
              emptyMsg.textContent = "Aucun favori pour le moment.";
              parentList.appendChild(emptyMsg);
            } else {
              _renderBookmarksInto(parentList);
            }
            showToast("Favori supprimé");
          }
        });
      })(f);

      // Click → open du'a detail
      (function(fav) {
        item.addEventListener("click", function() {
          for (var c = 0; c < DUA_CATEGORIES.length; c++) {
            if (DUA_CATEGORIES[c].id === fav.catId) {
              $("bookmarks-overlay").classList.add("hidden");
              openDuaDetail(c);
              break;
            }
          }
        });
      })(f);

      item.appendChild(icon);
      item.appendChild(info);
      item.appendChild(menuBtn);
      list.appendChild(item);
    });
  }

  function renderStats() {
    var stats = loadStats();
    var streakEl = $("stat-streak");
    if (streakEl) streakEl.textContent = stats.streak || 0;
    var versesEl = $("stat-total-verses");
    if (versesEl) versesEl.textContent = (stats.totalVersesRead || 0).toLocaleString("fr-FR");
    // Reading time
    var timeEl = $("stat-reading-time");
    if (timeEl) {
      var totalSec = stats.totalReadingSeconds || 0;
      if (totalSec < 60) timeEl.textContent = "< 1 min";
      else if (totalSec < 3600) timeEl.textContent = Math.floor(totalSec / 60) + " min";
      else {
        var h = Math.floor(totalSec / 3600);
        var m = Math.floor((totalSec % 3600) / 60);
        timeEl.textContent = h + "h " + (m > 0 ? m + "m" : "");
      }
    }
    // Khatms completed
    var khatmsEl = $("stat-khatmas");
    if (khatmsEl) {
      try {
        var raw = localStorage.getItem(KHATM_HISTORY_KEY);
        var hist = raw ? JSON.parse(raw) : [];
        var completed = 0;
        for (var i = 0; i < hist.length; i++) {
          if (hist[i].type === "complete") completed++;
        }
        khatmsEl.textContent = completed;
      } catch (e) { khatmsEl.textContent = "0"; }
    }
    // Hassanates
    var hassEl = $("stat-hassanates");
    if (hassEl) {
      var h = stats.totalHassanates || 0;
      hassEl.textContent = h.toLocaleString("fr-FR");
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
                  var noteLine = _escapeHtml(n).replace(/^\[(\d+)\]\s*/, function(_, num) {
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
          + _escapeHtml(clean).replace(/\[(\d+)\]/g, '<sup class="tafsir-ref">[$1]</sup>')
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

  // Rotate qibla pointer SVG group (shortest-path to avoid 360→0 jumps)
  function setQiblaPointerRotation(targetDeg) {
    var diff = ((targetDeg - qiblaCurrentRot) % 360 + 540) % 360 - 180;
    qiblaCurrentRot += diff;
    var pointer = $("qibla-pointer");
    if (!pointer) return;
    pointer.setAttribute("transform", "rotate(" + qiblaCurrentRot + " 150 185)");
  }

  function updateAlignedState(rotationDeg) {
    var normalised = ((rotationDeg % 360) + 360) % 360;
    var isAligned = normalised < ALIGN_THRESHOLD || normalised > (360 - ALIGN_THRESHOLD);
    var dirEl = $("qibla-direction");
    var arrowEl = $("qibla-dir-arrow");
    var textEl = $("qibla-dir-text");
    if (!dirEl || !arrowEl || !textEl) return;
    if (isAligned) {
      dirEl.classList.add("aligned");
      arrowEl.classList.add("aligned");
      textEl.textContent = "Vous faites face \u00e0 la Qibla";
    } else {
      dirEl.classList.remove("aligned");
      arrowEl.classList.remove("aligned");
      if (normalised > 180) {
        arrowEl.classList.add("flip");
        textEl.textContent = "Tournez \u00e0 gauche";
      } else {
        arrowEl.classList.remove("flip");
        textEl.textContent = "Tournez \u00e0 droite";
      }
    }
    qiblaIsAligned = isAligned;
  }

  function fetchQiblaLocation(lat, lon) {
    var url = "/api/geocode/reverse?lat=" + lat + "&lon=" + lon + "&format=json&accept-language=fr&zoom=10";
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var addr = data.address || {};
        var city = addr.suburb || addr.city || addr.town || addr.village || addr.municipality || "";
        var country = addr.country || "";
        var locEl = $("qibla-location");
        if (locEl && (city || country)) {
          var parts = [city, country].filter(Boolean).join(", ");
          locEl.textContent = parts;
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

    // Switch pointer to live mode (no CSS transition)
    var pointer = $("qibla-pointer");
    if (pointer && !pointer.classList.contains("live")) {
      pointer.classList.add("live");
    }

    // Relative angle: how far qibla is from where phone faces
    var relativeAngle = qiblaBearing - heading;
    setQiblaPointerRotation(relativeAngle);
    updateAlignedState(relativeAngle);
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
    var locEl = $("qibla-location");
    if (locEl) locEl.textContent = "\u2014";
    qiblaBearing = null;
    qiblaCurrentRot = 0;
    qiblaIsAligned = false;
    stopQiblaOrientation();
    var pointer = $("qibla-pointer");
    if (pointer) {
      pointer.setAttribute("transform", "rotate(0 150 185)");
      pointer.classList.remove("live");
    }
    // Reset direction text
    var dirEl = $("qibla-direction");
    var arrowEl = $("qibla-dir-arrow");
    var textEl = $("qibla-dir-text");
    if (dirEl) dirEl.classList.remove("aligned");
    if (arrowEl) { arrowEl.classList.remove("aligned"); arrowEl.classList.remove("flip"); }
    if (textEl) textEl.textContent = "Recherche de la Qibla\u2026";

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
        qiblaCurrentRot = qiblaBearing;
        var dist = calcDistance(lat, lon);

        $("qibla-loading").classList.add("hidden");
        $("qibla-compass-view").classList.remove("hidden");
        $("qibla-bearing-val").textContent = Math.round(qiblaBearing);
        $("qibla-dist").textContent = dist.toLocaleString("fr-FR") + "\u202fkm";
        fetchQiblaLocation(lat, lon);

        // Static positioning: show pointer at bearing angle
        var ptr = $("qibla-pointer");
        if (ptr) ptr.classList.remove("live");
        setQiblaPointerRotation(qiblaBearing);

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
    var pointer = $("qibla-pointer");
    if (pointer) {
      pointer.setAttribute("transform", "rotate(0 150 185)");
      pointer.classList.remove("live");
    }
  }

  // ---- AUDIO PLAYER ----
  // listenBase: mp3quran.net base URL for full-surah listening ({surah3}.mp3)
  // id: everyayah.com reciter ID for per-verse reading audio (null = listen-only)
  var RECITERS = [
    { id: "Alafasy_128kbps",             name: "Mishary Al-Afasy",      nameAr: "مشاري العفاسي",        listenBase: "https://server8.mp3quran.net/afs" },
    { id: "Husary_128kbps",              name: "Al-Husary",             nameAr: "محمود خليل الحصري",     listenBase: "https://server13.mp3quran.net/husr" },
    { id: "Abdul_Basit_Murattal_192kbps",name: "Abdul Basit",           nameAr: "عبد الباسط عبد الصمد", listenBase: "https://server7.mp3quran.net/basit" },
    { id: "Minshawy_Murattal_128kbps",   name: "Al-Minshawi",           nameAr: "محمد صديق المنشاوي",   listenBase: "https://server10.mp3quran.net/minsh" },
    { id: "Saood_ash-Shuraym_128kbps",   name: "Al-Shuraym",            nameAr: "سعود الشريم",          listenBase: "https://server7.mp3quran.net/shur" },
    { id: "Muhammad_Ayyoub_128kbps",     name: "Muhammad Ayyub",        nameAr: "محمد أيوب",            listenBase: "https://server8.mp3quran.net/ayyub" },
    { id: "Hudhaify_128kbps",            name: "Al-Hudhaifi",           nameAr: "علي الحذيفي",          listenBase: "https://server9.mp3quran.net/hthfi" },
    { id: "mp3q_hlarraz",                name: "Hisham Al-Harraz",      nameAr: "هشام الهراز",          listenBase: "https://server16.mp3quran.net/H-Lharraz/Rewayat-Warsh-A-n-Nafi", riwaya: "warsh" },
    { id: "mp3q_koshi",                  name: "Al-Oyoun Al-Kouchi",    nameAr: "العيون الكوشي",        listenBase: "https://server11.mp3quran.net/koshi" },
    { id: "mp3q_mukhtar",                name: "Mokhtar Al-Hajj",       nameAr: "مختار الحاج",          listenBase: "https://server16.mp3quran.net/mukhtar_haj/Rewayat-Hafs-A-n-Assem" },
    { id: "mp3q_nourin",                 name: "Nourein Muhammad",      nameAr: "نورين محمد صديق",      listenBase: "https://server16.mp3quran.net/nourin_siddig/Rewayat-Aldori-A-n-Abi-Amr" },
    { id: "mp3q_souilass",               name: "Younes Asoliss",        nameAr: "يونس اسويلص",          listenBase: "https://server16.mp3quran.net/souilass/Rewayat-Warsh-A-n-Nafi", riwaya: "warsh" },
    { id: "mp3q_sds",                    name: "Abdulrahman Al-Sudais", nameAr: "عبد الرحمن السديس",    listenBase: "https://server11.mp3quran.net/sds", everyayahId: "Abdurrahmaan_As-Sudais_192kbps" },
    { id: "mp3q_maher",                  name: "Maher Al-Mueaqly",     nameAr: "ماهر المعيقلي",        listenBase: "https://server12.mp3quran.net/maher", everyayahId: "MaherAlMuaiqly128kbps" },
    { id: "mp3q_qtm",                    name: "Nasser Al-Qatami",     nameAr: "ناصر القطامي",         listenBase: "https://server6.mp3quran.net/qtm", everyayahId: "Nasser_Alqatami_128kbps" },
    { id: "mp3q_ajm",                    name: "Ahmad Al-Ajmi",        nameAr: "أحمد العجمي",          listenBase: "https://server10.mp3quran.net/ajm", everyayahId: "ahmed_ibn_ali_al_ajamy_128kbps" },
    { id: "mp3q_yasser",                 name: "Yasser Al-Dosari",     nameAr: "ياسر الدوسري",         listenBase: "https://server11.mp3quran.net/yasser", everyayahId: "Yasser_Ad-Dussary_128kbps" },
    { id: "mp3q_balilah",                name: "Bandar Baleela",       nameAr: "بندر بليلة",           listenBase: "https://server6.mp3quran.net/balilah" },
    { id: "mp3q_jleel",                  name: "Khalid Al-Jalil",      nameAr: "خالد الجليل",          listenBase: "https://server10.mp3quran.net/jleel" },
    { id: "mp3q_lhdan",                  name: "Mohamed Luhaydan",     nameAr: "محمد اللحيدان",         listenBase: "https://server8.mp3quran.net/lhdan" },
    { id: "mp3q_budair",                 name: "Salah Al-Budair",     nameAr: "صلاح البدير",           listenBase: "https://server6.mp3quran.net/s_bud", everyayahId: "Salah_Al_Budair_128kbps" },
    // Récitateur français — traduction récitée (verset par verset via cdn.islamic.network)
    { id: "fr.leclerc",   name: "Jean-Louis Leclerc",   nameAr: "ترجمة فرنسية", listenBase: null, lang: "fr", cdnEdition: "fr.leclerc" },
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

  function getReciterObj() {
    var id = getReciter();
    return RECITERS.find(function(r) { return r.id === id; }) || RECITERS[0];
  }

  // Nombre de versets par sourate (1-114) pour calculer le numéro absolu
  var AYAH_COUNTS = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];

  function surahAyahToAbsolute(surahNum, ayahNum) {
    var abs = 0;
    for (var i = 0; i < surahNum - 1; i++) abs += AYAH_COUNTS[i];
    return abs + ayahNum;
  }

  function getAudioUrl(surahNum, ayahNum) {
    var rec = getReciterObj();

    // Récitateur français via cdn.islamic.network (numérotation absolue)
    if (rec.cdnEdition) {
      var absNum = (ayahNum === 0) ? 1 : surahAyahToAbsolute(surahNum, ayahNum);
      return "https://cdn.islamic.network/quran/audio/128/" + rec.cdnEdition + "/" + absNum + ".mp3";
    }

    // Récitateur arabe avec everyayah.com (verset par verset)
    var evId = rec.everyayahId || rec.id;
    if (evId && evId.indexOf("mp3q_") !== 0) {
      if (ayahNum === 0) return "https://everyayah.com/data/" + evId + "/001001.mp3";
      var s = String(surahNum).padStart(3, "0");
      var a = String(ayahNum).padStart(3, "0");
      return "https://everyayah.com/data/" + evId + "/" + s + a + ".mp3";
    }

    // mp3q_ sans everyayahId → pas d'audio verset par verset, retourne null (fallback sourate dans playCurrentAyah)
    return null;
  }

  function getCurrentAyahInfo() {
    return freeReadMode ? getFreeReadAyah() : getAyahByGlobalIndex(state.globalIndex);
  }

  function playCurrentAyah() {
    var ayah = getCurrentAyahInfo();
    var url = getAudioUrl(ayah.surahNumber, ayah.ayahNumber);
    // Fallback: récitateur sans audio verset-par-verset → sourate complète
    if (!url) {
      var rec = getReciterObj();
      if (rec.listenBase) {
        url = rec.listenBase + "/" + String(ayah.surahNumber).padStart(3, "0") + ".mp3";
      } else {
        showToast("Audio non disponible pour ce récitateur");
        return;
      }
    }
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
      var at = $("ayah-text");
      if (at) at.classList.add("audio-glow");
    }).catch(function () {
      isAudioPlaying = false;
      updateAudioUI();
    });
  }

  function pauseAudio() {
    if (audioPlayer) { audioPlayer.pause(); }
    isAudioPlaying = false;
    updateAudioUI();
    var at = $("ayah-text");
    if (at) at.classList.remove("audio-glow");
  }

  function toggleAudio() {
    if (isAudioPlaying) pauseAudio();
    else playCurrentAyah();
  }

  function onAudioEnded() {
    isAudioPlaying = false;
    var at = $("ayah-text");
    if (at) at.classList.remove("audio-glow");
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
    var at = $("ayah-text");
    if (at) at.classList.remove("audio-glow");
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
    var activeRiwaya = state.riwaya || "hafs";
    RECITERS.filter(function (r) {
      if (!r.id) return false;
      var rr = r.riwaya || "hafs";
      return rr === activeRiwaya || r.lang === "fr";
    }).forEach(function (r) {
      var item = document.createElement("div");
      item.className = "reciter-item" + (r.id === current ? " active" : "");
      var hasPerVerse = !!(r.cdnEdition || r.everyayahId || (r.id && r.id.indexOf("mp3q_") !== 0 && r.id.indexOf("fr.") !== 0));
      var badge = hasPerVerse
        ? '<div class="reciter-item-badge reciter-badge-verse">verset par verset</div>'
        : '<div class="reciter-item-badge">sourate complète</div>';
      item.innerHTML = '<div><div class="reciter-item-name">' + _escapeHtml(r.name) + '</div>' +
        '<div class="reciter-item-name-ar">' + _escapeHtml(r.nameAr || '') + '</div>' + badge + '</div>' +
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
  var PRAYER_NOTIF_KEY    = "qurani-prayer-notif";
  var PRAYER_NOTIF_PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  var prayerTimesCache = null;
  var prayerDayOffset = 0; // 0 = today, -1 = yesterday, +1 = tomorrow
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

  // ---- Prayer Notifications (Local) ----
  function getPrayerNotifEnabled() { return localStorage.getItem(PRAYER_NOTIF_KEY) === "true"; }
  function setPrayerNotifEnabled(v) { localStorage.setItem(PRAYER_NOTIF_KEY, v ? "true" : "false"); }

  function _getLocalNotifPlugin() {
    return (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications) || null;
  }

  function updatePrayerNotifUI() {
    var section = $("prayer-notif-section");
    var toggle  = $("prayer-notif-toggle");
    var plugin  = _getLocalNotifPlugin();
    if (section) section.style.display = plugin ? "" : "none";
    if (toggle) {
      if (getPrayerNotifEnabled()) toggle.classList.add("active");
      else toggle.classList.remove("active");
    }
  }

  function togglePrayerNotifications() {
    var plugin = _getLocalNotifPlugin();
    if (!plugin) return;
    if (getPrayerNotifEnabled()) {
      // Disable
      cancelPrayerNotifications();
      setPrayerNotifEnabled(false);
      updatePrayerNotifUI();
    } else {
      // Enable: check permissions first
      plugin.checkPermissions().then(function(res) {
        if (res.display === "granted") {
          setPrayerNotifEnabled(true);
          updatePrayerNotifUI();
          schedulePrayerNotifications();
        } else {
          return plugin.requestPermissions().then(function(res2) {
            if (res2.display === "granted") {
              setPrayerNotifEnabled(true);
              updatePrayerNotifUI();
              schedulePrayerNotifications();
            }
          });
        }
      }).catch(function(e) { console.warn("[prayer-notif] permission error", e); });
    }
  }

  // Textes personnalisés par prière
  var PRAYER_NOTIF_TEXTS = {
    "Fajr": {
      atTitle:     "C'est l'heure du Fajr",
      atBody:      "Et [fais] aussi la Lecture à l'aube, car la Lecture à l'aube a des témoins. [17:78]",
      beforeTitle: "Fajr dans 15 min",
      beforeBody:  "La Prière est meilleure que le sommeil."
    },
    "Dhuhr": {
      atTitle:     "C'est l'heure du Dhuhr",
      atBody:      "Réponds à l'appel d'Allah.",
      beforeTitle: "Dhuhr dans 15 min",
      beforeBody:  "Invoquez-Moi, Je vous répondrai. [40:60]"
    },
    "Asr": {
      atTitle:     "C'est l'heure de l'Asr",
      atBody:      "Trouve la Paix auprès d'Allah au milieu de l'agitation.",
      beforeTitle: "Asr dans 15 min",
      beforeBody:  "Par le Temps ! L'homme est en perdition. [103:1-2]"
    },
    "Maghrib": {
      atTitle:     "C'est l'heure du Maghrib",
      atBody:      "Le soleil s'est couché.",
      beforeTitle: "Maghrib dans 15 min",
      beforeBody:  "Accomplis la Salat au déclin du soleil jusqu'à l'obscurité de la nuit. [17:78]"
    },
    "Isha": {
      atTitle:     "C'est l'heure de l'Isha",
      atBody:      "Clôture ta journée par la prière.",
      beforeTitle: "Isha dans 15 min",
      beforeBody:  "Accomplis la Salat au déclin du soleil jusqu'à l'obscurité de la nuit. [17:78]"
    }
  };

  function schedulePrayerNotifications() {
    var plugin = _getLocalNotifPlugin();
    if (!plugin || !getPrayerNotifEnabled() || !prayerTimesCache) return;

    cancelPrayerNotifications().then(function() {
      var now = new Date();
      var notifs = [];

      PRAYER_NOTIF_PRAYERS.forEach(function(key, i) {
        var timeStr = prayerTimesCache[key];
        if (!timeStr) return;
        var parts = timeStr.split(":");
        var h = parseInt(parts[0], 10);
        var m = parseInt(parts[1], 10);
        var texts = PRAYER_NOTIF_TEXTS[key] || {};

        // ── À l'heure exacte (IDs 106-110) ──
        var exact = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
        if (exact > now) {
          notifs.push({
            id: 106 + i,
            title: texts.atTitle || key,
            body: texts.atBody || ("C\u2019est l\u2019heure du " + key),
            schedule: { at: exact },
            sound: "default"
          });
        }

        // ── 15 min avant (IDs 101-105) ──
        var before = new Date(exact.getTime() - 15 * 60 * 1000);
        if (before > now) {
          notifs.push({
            id: 101 + i,
            title: texts.beforeTitle || key,
            body: (texts.beforeBody || (key + " dans 15 min")) + " \u00B7 " + timeStr,
            schedule: { at: before },
            sound: "default"
          });
        }
      });

      if (notifs.length > 0) {
        plugin.schedule({ notifications: notifs }).catch(function(e) {
          console.warn("[prayer-notif] schedule error", e);
        });
      }
    });
  }

  function cancelPrayerNotifications() {
    var plugin = _getLocalNotifPlugin();
    if (!plugin) return Promise.resolve();
    var ids = [];
    for (var i = 0; i < 5; i++) { ids.push({ id: 101 + i }); ids.push({ id: 106 + i }); }
    return plugin.cancel({ notifications: ids }).catch(function() {});
  }

  // Prayer background images
  var PRAYER_BG_IMAGES = [
    1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
    21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,
    41,42,43,44,45,47,48,49,50,51,52,53,54,55,56,57,58,59,60,
    61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,
    81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,
    101,102,103,104,105,106,108,109,110,111,112,113,114,115,116,117
  ];
  var _lastPrayerBg = -1;

  function getPrayerTargetDate() {
    var d = new Date();
    d.setDate(d.getDate() + prayerDayOffset);
    return d;
  }

  function updatePrayerDateLabel() {
    var label = $("prayer-date-gregorian");
    if (!label) return;
    if (prayerDayOffset === 0) { label.textContent = "Aujourd\u2019hui"; return; }
    if (prayerDayOffset === -1) { label.textContent = "Hier"; return; }
    if (prayerDayOffset === 1) { label.textContent = "Demain"; return; }
    var d = getPrayerTargetDate();
    label.textContent = d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  }

  function refetchPrayerTimes() {
    $("prayer-loading").classList.remove("hidden");
    $("prayer-error").classList.add("hidden");
    var saved = getSavedPrayerLocation();
    if (saved) fetchPrayerTimes(saved.lat, saved.lon);
  }

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
    var ext = [20, 36, 40, 64].indexOf(num) >= 0 ? "png" : "jpg";
    overlay.style.backgroundImage = "url('img/prayer/" + num + "." + ext + "')";

    // Day/night mode
    var hour = new Date().getHours();
    overlay.classList.remove("prayer-day", "prayer-night", "prayer-halo");
    overlay.classList.add(hour >= 6 && hour < 19 ? "prayer-day" : "prayer-night");
    setTimeout(function() { overlay.classList.add("prayer-halo"); }, 50);

    // Hide settings panel on open
    var settingsPanel = $("prayer-settings-panel");
    if (settingsPanel) settingsPanel.classList.remove("visible");

    prayerDayOffset = 0;
    renderPrayerMethodButtons();
    renderPrayerLocationBar();
    updatePrayerDateLabel();

    // Wire up day navigation arrows
    var isMawaqit = getPrayerMethod() === "mawaqit";
    var prevBtn = $("prayer-date-prev");
    var nextBtn = $("prayer-date-next");
    if (prevBtn) {
      prevBtn.style.visibility = isMawaqit ? "hidden" : "visible";
      prevBtn.onclick = isMawaqit ? null : function() {
        prayerDayOffset--;
        updatePrayerDateLabel();
        refetchPrayerTimes();
      };
    }
    if (nextBtn) {
      nextBtn.style.visibility = isMawaqit ? "hidden" : "visible";
      nextBtn.onclick = isMawaqit ? null : function() {
        prayerDayOffset++;
        updatePrayerDateLabel();
        refetchPrayerTimes();
      };
    }

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
      var loc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      savePrayerLocation(loc);
      fetchPrayerTimes(loc.lat, loc.lon);
      // Reverse geocode pour obtenir le nom de ville
      _reverseGeocode(loc.lat, loc.lon);
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
    input.placeholder = (saved && saved.name) ? saved.name : "Entrez votre ville…";
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
    var url = "/api/geocode/search?q=" + encodeURIComponent(q) +
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
          var city = r.name || addr.city || addr.town || addr.village || addr.municipality || r.display_name.split(",")[0];
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
    var targetDate = getPrayerTargetDate();
    var ts = Math.floor(targetDate.getTime() / 1000);
    var url = "/api/aladhan/v1/timings/" + ts + "?latitude=" + lat + "&longitude=" + lon + "&method=" + method;
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
    var url = "/api/mawaqit/api/2.0/mosque/search?lat=" + lat + "&lon=" + lon + "&nbrMosque=7";
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
    var url = "/api/mawaqit/fr/" + slug;
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
      var targetDate = getPrayerTargetDate();
      var times;
      if (inFrance) {
        // Use France-specific Fajr interpolation + astronomical calculation
        times = _islamSounnahEngine.getTimes(targetDate, lat, lon);
      } else {
        // Fallback: use MWL astronomical calculation for non-France locations
        var fallback = new _ISPrayTimes("MWL");
        fallback.adjust({ imsak: "0 min", highLats: "AngleBased", midnight: "Jafari" });
        // Use device's actual UTC offset — reliable on all browsers/iOS (already includes DST)
        var tzOffset = -targetDate.getTimezoneOffset() / 60;
        times = fallback.getTimes(targetDate, [lat, lon], tzOffset, 0);
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
      // Strip timezone suffix (ex: "05:35 (EET)" → "05:35") pour compatibilité Watch/widgets
      function ct(v) { return (v || "").substring(0, 5); }
      window.Capacitor.Plugins.SharedData.savePrayerTimes({
        fajr: ct(t.Fajr), sunrise: ct(t.Sunrise), dhuhr: ct(t.Dhuhr),
        asr: ct(t.Asr), maghrib: ct(t.Maghrib), isha: ct(t.Isha),
        midnight: ct(t.Midnight), lastThird: ct(t.LastThird),
        date: "", nextPrayer: "", nextTime: "",
        method: getPrayerMethod(), city: (getSavedPrayerLocation() || {}).name || ""
      });
    }
    // Schedule prayer notifications if enabled
    if (prayerDayOffset === 0) schedulePrayerNotifications();
  }

  function renderPrayerTimes() {
    if (!prayerTimesCache) return;
    // Refresh morning/evening label now that we have accurate Maghrib time
    initDashboardCards();
    var mainPrayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var now = new Date();
    var nextPrayer = null;
    var prevPrayer = null;

    // Parse times and find next/prev (offset-aware)
    var prayerDates = [];
    mainPrayers.forEach(function (key) {
      var time = prayerTimesCache[key];
      if (!time) return;
      var parts = time.split(":");
      var d = new Date();
      d.setDate(d.getDate() + prayerDayOffset);
      d.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);
      var isPast = prayerDayOffset < 0 ? true  : (prayerDayOffset > 0 ? false : d < now);
      var isNext = prayerDayOffset > 0 ? (!nextPrayer) : (prayerDayOffset < 0 ? false : (!isPast && !nextPrayer));
      if (isNext) nextPrayer = { key: key, date: d, time: time };
      if (isPast) prevPrayer = { key: key, date: d, time: time };
      prayerDates.push({ key: key, date: d, time: time, isPast: isPast, isNext: isNext });
    });

    // Collapse old separate timeline div (dots are now inline in each column)
    var timeline = $("prayer-timeline");
    if (timeline) { timeline.innerHTML = ""; timeline.style.height = "0"; }

    // Render prayer columns with dot centered above each name
    var timesRow = $("prayer-times-row");
    if (timesRow) {
      timesRow.innerHTML = "";
      prayerDates.forEach(function (p) {
        var col = document.createElement("div");
        col.className = "prayer-time-col" + (p.isNext ? " prayer-active" : "") + (p.isPast ? " prayer-past" : "");
        col.innerHTML =
          '<div class="prayer-dot"></div>' +
          '<div class="prayer-time-col-name">' + PRAYER_NAMES[p.key] + '</div>' +
          '<div class="prayer-time-col-time">' + p.time.substring(0, 5) + '</div>';
        timesRow.appendChild(col);
      });

      // Moving cursor dot between previous and next prayer
      if (prayerDayOffset === 0 && prevPrayer && nextPrayer) {
        var total = nextPrayer.date - prevPrayer.date;
        var elapsed = now - prevPrayer.date;
        var frac = Math.min(1, Math.max(0, elapsed / total));

        var cursorDot = document.createElement("div");
        cursorDot.className = "prayer-cursor-dot";
        timesRow.appendChild(cursorDot);

        // Position using actual DOM dot positions
        requestAnimationFrame(function() {
          var dots = timesRow.querySelectorAll(".prayer-dot");
          var prevIdx = -1, nextIdx = -1;
          prayerDates.forEach(function(p, i) {
            if (p.key === prevPrayer.key) prevIdx = i;
            if (p.key === nextPrayer.key) nextIdx = i;
          });
          if (prevIdx >= 0 && nextIdx >= 0 && dots[prevIdx] && dots[nextIdx]) {
            var prevDot = dots[prevIdx];
            var nextDot = dots[nextIdx];
            // Get center X of each dot relative to timesRow
            var prevCx = prevDot.getBoundingClientRect().left + prevDot.offsetWidth / 2 - timesRow.getBoundingClientRect().left;
            var nextCx = nextDot.getBoundingClientRect().left + nextDot.offsetWidth / 2 - timesRow.getBoundingClientRect().left;
            var cursorCx = prevCx + frac * (nextCx - prevCx);
            var rowRect = timesRow.getBoundingClientRect();
            var dotCy = prevDot.getBoundingClientRect().top + prevDot.offsetHeight / 2 - rowRect.top;
            cursorDot.style.left = cursorCx + "px";
            cursorDot.style.top = dotCy + "px";
          }
        });
      }
    }

    // Countdown overlay
    var countdownName = $("prayer-countdown-name");
    var countdownTime = $("prayer-countdown-time");
    var countdownLabel = $("prayer-countdown-label");
    if (countdownName && countdownTime) {
      if (prayerDayOffset !== 0) {
        // For past/future days: show first or last prayer, no live countdown
        var refPrayer = prayerDayOffset < 0 ? prayerDates[prayerDates.length - 1] : prayerDates[0];
        if (refPrayer) countdownName.textContent = PRAYER_NAMES[refPrayer.key];
        countdownTime.textContent = prayerDayOffset < 0 ? "Journ\u00e9e pass\u00e9e" : "Journ\u00e9e \u00e0 venir";
        if (countdownLabel) countdownLabel.textContent = prayerDayOffset < 0 ? "Hier" : "Demain";
      } else if (nextPrayer) {
        var diff = nextPrayer.date - now;
        var h = Math.floor(diff / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);
        countdownName.textContent = PRAYER_NAMES[nextPrayer.key];
        countdownTime.textContent = (h > 0 ? h + "h " : "") + m + "min " + s + "s";
        if (countdownLabel) countdownLabel.textContent = "Prochaine pri\u00e8re";
      } else {
        countdownName.textContent = "Fajr";
        countdownTime.textContent = "demain in shaa Allah";
        if (countdownLabel) countdownLabel.textContent = "Prochaine pri\u00e8re";
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

    // Afficher la localisation
    var locEl = $("prayer-bottom-location");
    var savedLoc = getSavedPrayerLocation();
    if (locEl) {
      locEl.textContent = (savedLoc && savedLoc.name) ? savedLoc.name : "";
    }

    // Show loading done
    $("prayer-loading").classList.add("hidden");
  }

  function startPrayerCountdown() {
    if (prayerCountdownInterval) clearInterval(prayerCountdownInterval);
    prayerCountdownInterval = setInterval(renderPrayerTimes, 1000);
  }

  function _reverseGeocode(lat, lon) {
    fetch("/api/geocode/reverse?lat=" + lat + "&lon=" + lon + "&format=json&zoom=10&addressdetails=1",
      { headers: { "Accept-Language": "fr,en" } })
      .then(function(r) { return r.json(); })
      .then(function(result) {
        if (!result || result.error) return;
        var addr = result.address || {};
        var city = addr.suburb || addr.city || addr.town || addr.village || addr.municipality || "";
        if (!city && result.display_name) city = result.display_name.split(",")[0];
        if (city) {
          var loc = getSavedPrayerLocation();
          if (loc) { loc.name = city; savePrayerLocation(loc); }
          var locEl = $("prayer-bottom-location");
          if (locEl) { locEl.textContent = city; }
        }
      })
      .catch(function() {});
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
        savePrayerTimesToBridge(); // sync Watch + widgets dès le démarrage
      } catch (e) { /* silent */ }
      return;
    }
    if (method === "mawaqit") {
      var mosque = getSavedMawaqitMosque();
      if (mosque) {
        var url = "/api/mawaqit/fr/" + mosque.slug;
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
          savePrayerTimesToBridge(); // sync Watch + widgets dès le démarrage
        }).catch(function() {});
      }
      return;
    }
    // Aladhan fallback
    var ts = Math.floor(Date.now() / 1000);
    var apiUrl = "/api/aladhan/v1/timings/" + ts + "?latitude=" + lat + "&longitude=" + lon + "&method=" + method;
    fetch(apiUrl).then(function(r) { return r.json(); }).then(function(data) {
      if (data.code !== 200 || !data.data) return;
      prayerTimesCache = data.data.timings;
      renderDashPrayer();
      startDashPrayerCountdown();
      savePrayerTimesToBridge(); // sync Watch + widgets dès le démarrage
    }).catch(function() {});
  }

  function renderDashPrayer() {
    var hintEl = $("dash-prayer-hint");
    var prayerLeft = document.querySelector(".dash-prayer-left");
    if (!prayerTimesCache) {
      if (hintEl) hintEl.classList.remove("hidden");
      if (prayerLeft) prayerLeft.style.display = "none";
      return;
    }
    if (hintEl) hintEl.classList.add("hidden");
    if (prayerLeft) prayerLeft.style.display = "";
    var timeline = $("dash-prayer-timeline");
    var dayNameEl = $("dash-day-name");
    var countdownEl = $("dash-prayer-countdown");
    if (!timeline) return;

    var keys = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var now = new Date();

    // Parse prayer times into Date objects + minutes since midnight
    var prayerDates = [];
    keys.forEach(function (key) {
      var t = prayerTimesCache[key];
      if (!t) return;
      var parts = t.split(":");
      var h = parseInt(parts[0], 10);
      var m = parseInt(parts[1], 10);
      var d = new Date();
      d.setHours(h, m, 0, 0);
      prayerDates.push({ key: key, date: d, time: t, minutes: h * 60 + m });
    });
    if (prayerDates.length < 2) return;

    // Find next prayer (skip Sunrise for countdown but keep for timeline)
    var nextIdx = -1;
    for (var i = 0; i < prayerDates.length; i++) {
      if (prayerDates[i].date > now) { nextIdx = i; break; }
    }

    // Proportional positions: Fajr at 0%, Isha at 100%
    var firstMin = prayerDates[0].minutes;
    var lastMin = prayerDates[prayerDates.length - 1].minutes;
    var spanMin = lastMin - firstMin;
    if (spanMin <= 0) spanMin = 1;

    // Build timeline
    timeline.innerHTML = "";
    var dotW = 5; // dot width in px — must match CSS
    var timelineW = timeline.offsetWidth || timeline.clientWidth || 300;

    prayerDates.forEach(function (p, idx) {
      var pct = (p.minutes - firstMin) / spanMin; // 0..1
      var dot = document.createElement("div");
      dot.className = "dash-timeline-dot";
      if (idx === nextIdx) dot.classList.add("next");
      else if (nextIdx === -1 || idx < nextIdx) dot.classList.add("past");
      // Position: left percentage, account for dot width at edges
      dot.style.left = "calc(" + (pct * 100) + "% - " + Math.round(pct * dotW) + "px)";
      dot.dataset.pct = pct;
      timeline.appendChild(dot);
    });

    // Cursor
    var cursor = document.createElement("div");
    cursor.className = "dash-timeline-cursor";
    timeline.appendChild(cursor);

    // Position cursor proportionally
    var nowMin = now.getHours() * 60 + now.getMinutes();
    if (nextIdx === 0) {
      // Before Fajr — cursor at Fajr (left edge)
      cursor.style.left = "calc(0% - " + dotW + "px)";
    } else if (nextIdx === -1) {
      // After Isha — cursor stays at Isha (left of dot to form full circle)
      cursor.style.left = "calc(100% - " + (dotW * 2) + "px)";
    } else {
      // Between two prayers — interpolate
      var prev = prayerDates[nextIdx - 1];
      var next = prayerDates[nextIdx];
      var total = next.minutes - prev.minutes;
      var elapsed = nowMin - prev.minutes;
      var frac = Math.min(1, Math.max(0, elapsed / total));
      var prevPct = (prev.minutes - firstMin) / spanMin;
      var nextPct = (next.minutes - firstMin) / spanMin;
      var cursorPct = prevPct + frac * (nextPct - prevPct);
      // Cursor right edge touches the dot's left edge at frac=1
      // At frac=0, cursor right edge touches prev dot's right edge
      cursor.style.left = "calc(" + (cursorPct * 100) + "% - " + Math.round(cursorPct * dotW + dotW) + "px)";
    }

    // Day name + Hijri date
    var dayNames = ["Al-Ahad", "Al-Ithnayn", "Ath-Thulatha", "Al-Arbi'a", "Al-Khamis", "Al-Jumu'a", "As-Sabt"];
    var hijri = _getHijriDate(now);
    if (dayNameEl) dayNameEl.textContent = dayNames[now.getDay()] + "  ·  " + hijri.monthName + " " + hijri.day;

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

  function _isDashMorning() {
    var now = new Date();
    var nowMin = now.getHours() * 60 + now.getMinutes();
    if (prayerTimesCache && prayerTimesCache.Asr) {
      var parts = (prayerTimesCache.Asr + "").split(":");
      var asrMin = parseInt(parts[0]) * 60 + (parseInt(parts[1]) || 0);
      if (!isNaN(asrMin)) return nowMin < asrMin;
    }
    return nowMin < 15 * 60;
  }

  function updateDashKhatmCard() {
    loadKhatm();
    var card = $("dash-reading-card");
    var labelEl = card ? card.querySelector(".dash-khatm-label") : null;
    var titleEl = card ? card.querySelector(".dash-verse-title") : null;
    var subEl = $("dash-reading-subtitle");
    var thumbEl = $("dash-khatm-thumb");
    if (!subEl) return;
    var p = getKhatmProgress();
    var progressFill = $("dash-khatm-progress-fill");
    if (p) {
      if (labelEl) labelEl.textContent = "KHATM EN COURS";
      if (titleEl) titleEl.textContent = p.translit + " · " + p.ayahNum;
      if (thumbEl) thumbEl.style.backgroundImage = "url(" + getSurahImg(p.surahNum) + ")";
      subEl.textContent = p.pct + "% · " + p.remaining + " JOUR" + (p.remaining !== 1 ? "S" : "") + " REST.";
      if (progressFill) {
        setTimeout(function() { progressFill.style.width = Math.max(p.pct, 0.5) + "%"; }, 100);
      }
    } else {
      if (labelEl) labelEl.textContent = "MON KHATM";
      if (titleEl) titleEl.textContent = "Commencer mon Khatm";
      if (thumbEl) {
        var rIdx = PRAYER_BG_IMAGES[Math.floor(Math.random() * PRAYER_BG_IMAGES.length)];
        var rExt = [20, 36, 40, 64].indexOf(rIdx) >= 0 ? "png" : "jpg";
        thumbEl.style.backgroundImage = "url(img/prayer/" + rIdx + "." + rExt + ")";
      }
      subEl.textContent = "Lire le Coran en 30 ou 60 jours";
      if (progressFill) progressFill.style.width = "0%";
    }
  }

  function updateDashStats() {
    var stats = loadStats();
    var versesEl = $("dash-stat-verses");
    var hassEl = $("dash-stat-hassanates");
    if (versesEl) versesEl.textContent = (stats.totalVersesRead || 0).toLocaleString("fr-FR");
    if (hassEl) hassEl.textContent = (stats.totalHassanates || 0).toLocaleString("fr-FR");
    // Stats progress bar — shows total Quran letters read as percentage (total Quran ≈ 330,733 letters → 3,307,330 hassanates)
    var progressEl = $("dash-stats-progress-fill");
    if (progressEl) {
      var totalQuranLetters = 330733;
      var lettersRead = Math.floor((stats.totalHassanates || 0) / 10);
      var pct = Math.min((lettersRead / totalQuranLetters) * 100, 100);
      setTimeout(function() { progressEl.style.width = Math.max(pct, 0) + "%"; }, 200);
    }
    // Click to open full stats overlay
    var section = $("dash-stats-section");
    if (section && !section._dashStatsBound) {
      section._dashStatsBound = true;
      section.addEventListener("click", function() {
        openStatsOverlay();
      });
    }
  }

  var _lastDashBg = -1;
  function setDashBg() {
    var dashBg = document.getElementById("dash-bg");
    if (!dashBg) return;
    // Pick a random image, avoid repeating last
    var idx;
    do { idx = Math.floor(Math.random() * PRAYER_BG_IMAGES.length); }
    while (idx === _lastDashBg && PRAYER_BG_IMAGES.length > 1);
    _lastDashBg = idx;
    var num = PRAYER_BG_IMAGES[idx];
    var ext = [20, 36, 40, 64].indexOf(num) >= 0 ? "png" : "jpg";
    dashBg.style.backgroundImage = "url('img/prayer/" + num + "." + ext + "')";
  }

  function _isIslamicFriday() {
    // En Islam, le vendredi commence au coucher du soleil du jeudi
    // et se termine au coucher du soleil du vendredi
    var now = new Date();
    var day = now.getDay(); // 0=Sun … 4=Thu 5=Fri 6=Sat
    var nowMin = now.getHours() * 60 + now.getMinutes();
    var maghribMin = 18 * 60; // fallback 18h
    if (prayerTimesCache && prayerTimesCache.Maghrib) {
      var parts = (prayerTimesCache.Maghrib + "").split(":");
      var m = parseInt(parts[0]) * 60 + (parseInt(parts[1]) || 0);
      if (!isNaN(m)) maghribMin = m;
    }
    // Jeudi après Maghrib → vendredi islamique
    if (day === 4 && nowMin >= maghribMin) return true;
    // Vendredi avant Maghrib → vendredi islamique
    if (day === 5 && nowMin < maghribMin) return true;
    return false;
  }

  function getDailySurahIdx() {
    // Vendredi islamique (jeudi Maghrib → vendredi Maghrib) → Al-Kahf
    if (_isIslamicFriday()) return 17; // Al-Kahf (surah 18, index 17)
    // Autres jours : aléatoire déterministe basé sur la date (change chaque jour)
    var now = new Date();
    var seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    var idx = seed % 114;
    if (idx === 17) idx = 16; // éviter Al-Kahf les autres jours
    return idx;
  }

  function updateDashSuratCard() {
    var nameEl = $("dash-surat-name");
    if (!nameEl || !surahs || !surahs.length) return;
    var idx = getDailySurahIdx();
    // Update label: vendredi islamique → "SOURATE DU VENDREDI", sinon "SOURATE DU JOUR"
    var suratLabelEl = $("dash-surat-label");
    if (suratLabelEl) suratLabelEl.textContent = _isIslamicFriday() ? "SOURATE DU VENDREDI" : "SOURATE DU JOUR";
    var surah = surahs[idx];
    if (!surah) return;
    var nameFr = SURAH_NAMES_FR[surah.surahNumber] || ("Sourate " + surah.surahNumber);
    var translit = SURAH_TRANSLIT[surah.surahNumber] || "";
    nameEl.textContent = translit + " \u2014 " + nameFr;

    // Daily surah progress
    var totalVerses = surah.ayahs.length;
    var num = surah.surahNumber;
    // Real verse count (excluding basmala)
    var realCount = (num !== 1 && num !== 9) ? totalVerses - 1 : totalVerses;
    var progress = _spGetDailyProgress();
    var versesRead = 0;
    if (progress && progress.surahIdx === idx && progress.highWater >= 0) {
      versesRead = progress.highWater + 1; // highWater is 0-based index
    }
    var remaining = Math.max(0, totalVerses - versesRead);
    var pct = totalVerses > 0 ? Math.min(versesRead / totalVerses * 100, 100) : 0;

    // Remaining label
    var remEl = $("dash-surat-remaining");
    if (remEl) {
      if (versesRead > 0 && remaining > 0) {
        remEl.textContent = remaining + " verset" + (remaining > 1 ? "s" : "") + " restant" + (remaining > 1 ? "s" : "");
      } else if (remaining === 0 && versesRead > 0) {
        remEl.textContent = "\u2713 Termin\u00e9e";
      } else {
        remEl.textContent = realCount + " versets";
      }
    }

    // Progress on button fill
    var btnFill = $("dash-surat-btn-fill");
    if (btnFill) {
      btnFill.style.width = pct + "%";
    }
  }

  var _dashCarouselIdx = 0;

  function _initDashCarousel() {
    var track = $("dash-carousel-track");
    var dots = document.querySelectorAll("#dash-carousel-dots .dash-carousel-dot");
    if (!track || !dots.length) return;

    function goTo(idx) {
      _dashCarouselIdx = idx;
      track.style.transform = "translateX(-" + (idx * 100) + "%)";
      dots.forEach(function(d, i) { d.classList.toggle("active", i === idx); });
    }

    // Swipe handling
    var startX = 0, startY = 0, dx = 0, swiping = false;
    track.addEventListener("touchstart", function(e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      dx = 0;
      swiping = false;
      track.style.transition = "none";
    }, { passive: true });

    track.addEventListener("touchmove", function(e) {
      var mx = e.touches[0].clientX - startX;
      var my = e.touches[0].clientY - startY;
      if (!swiping && Math.abs(mx) > Math.abs(my) && Math.abs(mx) > 8) swiping = true;
      if (swiping) {
        dx = mx;
        var offset = -_dashCarouselIdx * 100 + (dx / track.offsetWidth) * 100;
        track.style.transform = "translateX(" + offset + "%)";
      }
    }, { passive: true });

    track.addEventListener("touchend", function() {
      track.style.transition = "";
      if (swiping) {
        var threshold = track.offsetWidth * 0.2;
        if (dx < -threshold && _dashCarouselIdx < dots.length - 1) goTo(_dashCarouselIdx + 1);
        else if (dx > threshold && _dashCarouselIdx > 0) goTo(_dashCarouselIdx - 1);
        else goTo(_dashCarouselIdx);
      }
      swiping = false;
    }, { passive: true });

    // Dot click
    dots.forEach(function(d, i) {
      d.addEventListener("click", function() { goTo(i); });
    });

    // Subtle hint animation — always on app open
    setTimeout(function() {
      track.style.transition = "transform 0.4s ease";
      track.style.transform = "translateX(-12%)";
      setTimeout(function() {
        track.style.transform = "translateX(0%)";
        setTimeout(function() { track.style.transition = ""; }, 400);
      }, 500);
    }, 2000);

    goTo(0);
  }

  function initDashboardCards() {
    var labelEl = $("dash-card-label");
    if (labelEl) {
      labelEl.textContent = _isDashMorning() ? "INVOCATIONS DU MATIN" : "INVOCATIONS DU SOIR";
    }
    setDashBg();
    updateDashKhatmCard();
    updateDashStats();
    updateDashSuratCard();
    // Dash carousel (sourate du jour + invocations)
    _initDashCarousel();
    // New features: daily verse, hijri, goal widget
    if (typeof updateDailyVerse === "function") try { updateDailyVerse(); } catch(e) {}
    if (typeof updateHijriCard === "function") try { updateHijriCard(); } catch(e) {}
    if (typeof updateDashGoalWidget === "function") try { updateDashGoalWidget(); } catch(e) {}

    // Ramadan block — hidden (Ramadan 1447 terminé)
    var ramadanBlock = $("dash-ramadan");
    if (ramadanBlock) ramadanBlock.classList.add("hidden");
  }

  // ---- TAB BAR SWITCHING ----
  function initTabBar() {
    var tabBar = $("tab-bar");
    if (!tabBar) return;
    var btns = tabBar.querySelectorAll(".tab-bar-btn");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var tab = btn.dataset.tab;
        // Close video overlay if open
        var vidOverlay = $("videos-overlay");
        if (vidOverlay && !vidOverlay.classList.contains("hidden")) {
          $("video-iframe-state").innerHTML = "";
          vidOverlay.classList.add("hidden");
        }
        // Stop reading timer when leaving any reading context
        stopReadingTimer();
        btns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        document.querySelectorAll(".tab-panel").forEach(function (p) {
          p.classList.add("hidden");
        });
        var panel = $("tab-" + tab);
        if (panel) panel.classList.remove("hidden");
        // Rafraîchir le fond flouté de l'accueil à chaque visite
        if (tab === "accueil") {
          setDashBg();
        }
        // Rafraîchir l'image du hero Invocations à chaque visite
        if (tab === "invocation") {
          var heroBg = document.getElementById("dua-hero-bg");
          if (heroBg) {
            var img = PRAYER_IMGS[Math.floor(Math.random() * PRAYER_IMGS.length)];
            heroBg.style.backgroundImage = "url('img/prayer/" + img + "')";
          }
        }
        // Rafraîchir les compteurs MOI à chaque visite
        if (tab === "ayati") {
          refreshMoiCounts();
        }
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
        if (m.id === current) return; // already active
        setPrayerMethod(m.id);
        renderPrayerMethodButtons();
        // Close settings panel so user sees the result
        var sp = $("prayer-settings-panel");
        if (sp) { sp.classList.remove("visible"); sp.classList.add("hidden"); }
        // Update day nav arrows (hidden for Mawaqit)
        var isMawaqit = m.id === "mawaqit";
        var prevBtn = $("prayer-date-prev"), nextBtn = $("prayer-date-next");
        if (prevBtn) { prevBtn.style.visibility = isMawaqit ? "hidden" : "visible"; prevBtn.onclick = isMawaqit ? null : function() { prayerDayOffset--; updatePrayerDateLabel(); refetchPrayerTimes(); }; }
        if (nextBtn) { nextBtn.style.visibility = isMawaqit ? "hidden" : "visible"; nextBtn.onclick = isMawaqit ? null : function() { prayerDayOffset++; updatePrayerDateLabel(); refetchPrayerTimes(); }; }
        // Hide mosque selector from previous method
        var ms = $("prayer-mosque-selector");
        if (ms) { ms.classList.add("hidden"); ms.innerHTML = ""; }
        prayerDayOffset = 0;
        updatePrayerDateLabel();
        refetchPrayerTimes();
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
    var overlays = (state.riwaya !== "warsh" && tajwidData && tajwidData[key]) ? tajwidData[key] : null;
    return getSegmentsForAyah(key, fullText, overlays);
  }

  // ---- HIFZ (MEMORIZATION) v2 — Verse-by-verse ----
  var HIFZ_KEY = "qurani-hifz";
  var HIFZ_MODE_KEY = "qurani-hifz-mode";
  var HIFZ_RECITER_KEY = "qurani-hifz-reciter";
  var HIFZ_LAST_KEY = "qurani-hifz-last";
  var hifzMode = false;
  var hifzHidePercent = 0;        // 0-100, steps of 10
  var hifzSurahIdx = 0;
  var hifzAyahIdx = 0;            // current verse index
  var hifzManualHide = new Set();  // wordIdx integers — manually hidden
  var hifzManualShow = new Set();  // wordIdx integers — manually revealed (overrides auto)
  var hifzAudioEl = null;
  var hifzIsPlaying = false;
  var hifzMenuOpen = false;
  var hifzReadingMode = "tajwid";

  function loadHifzData() {
    try { var raw = localStorage.getItem(HIFZ_KEY); return raw ? JSON.parse(raw) : {}; }
    catch (e) { return {}; }
  }
  function saveHifzData(data) { localStorage.setItem(HIFZ_KEY, JSON.stringify(data)); if (typeof debouncedSync === "function") debouncedSync(); }

  function getHifzReadingMode() { return localStorage.getItem(HIFZ_MODE_KEY) || "tajwid"; }
  function setHifzReadingMode(mode) { hifzReadingMode = mode; localStorage.setItem(HIFZ_MODE_KEY, mode); }
  function getHifzReciter() { return localStorage.getItem(HIFZ_RECITER_KEY) || getReciter(); }
  function setHifzReciter(id) { localStorage.setItem(HIFZ_RECITER_KEY, id); }
  function saveHifzLast() { localStorage.setItem(HIFZ_LAST_KEY, hifzSurahIdx + ":" + hifzAyahIdx); }
  function getHifzLast() {
    var raw = localStorage.getItem(HIFZ_LAST_KEY);
    if (!raw) return null;
    var parts = raw.split(":");
    return { surahIdx: parseInt(parts[0], 10), ayahIdx: parseInt(parts[1], 10) };
  }

  function _toArabicNum(n) {
    return String(n).replace(/[0-9]/g, function (d) {
      return String.fromCharCode(0x0660 + parseInt(d));
    });
  }

  function openHifzFromCurrent() {
    var ayah = getCurrentAyahInfo();
    var surahIdx = 0;
    for (var i = 0; i < surahs.length; i++) {
      if (surahs[i].surahNumber === ayah.surahNumber) { surahIdx = i; break; }
    }
    enterHifzMode(surahIdx, 0);
  }

  function openHifzFromMoi() {
    var last = getHifzLast();
    if (last && surahs[last.surahIdx]) {
      enterHifzMode(last.surahIdx, last.ayahIdx || 0);
    } else {
      enterHifzMode(0, 0);
    }
  }

  function enterHifzMode(surahIdx, ayahIdx) {
    hifzMode = true;
    hifzSurahIdx = surahIdx;
    hifzAyahIdx = ayahIdx || 0;
    hifzHidePercent = 0;
    hifzManualHide = new Set();
    hifzManualShow = new Set();
    hifzReadingMode = getHifzReadingMode();

    // Populate surah select (French only, no Arabic)
    var select = $("hifz-surah-select");
    if (select && select.options.length === 0) {
      surahs.forEach(function (s, idx) {
        var opt = document.createElement("option");
        opt.value = idx;
        opt.textContent = s.surahNumber + ". " + (SURAH_NAMES_FR[s.surahNumber] || "Sourate " + s.surahNumber);
        select.appendChild(opt);
      });
    }
    if (select) select.value = surahIdx;

    _hifzPopulateAyahSelect();
    _hifzUpdateModeChecks();
    renderHifz();
    $("hifz-overlay").classList.remove("hidden");
    saveHifzLast();
  }

  function _hifzPopulateAyahSelect() {
    var ayahSel = $("hifz-ayah-select");
    if (!ayahSel) return;
    ayahSel.innerHTML = "";
    var surah = surahs[hifzSurahIdx];
    if (!surah) return;
    surah.ayahs.forEach(function (_, idx) {
      var opt = document.createElement("option");
      opt.value = idx;
      var isBasmala = idx === 0 && surah.surahNumber !== 1 && surah.surahNumber !== 9;
      opt.textContent = isBasmala ? "Basmala" : "Verset " + (surah.surahNumber === 1 || surah.surahNumber === 9 ? idx + 1 : idx);
      ayahSel.appendChild(opt);
    });
    ayahSel.value = hifzAyahIdx;
  }

  function _hifzUpdateModeChecks() {
    ["tajwid", "tajwid-color", "minimal", "minimal-color"].forEach(function (m) {
      var el = $("hm-check-" + m);
      if (el) el.classList.toggle("active", hifzReadingMode === m);
    });
  }

  function _hifzGetColorSegments(surahNum, ayahIdx, fullText) {
    var useColors = (hifzReadingMode === "tajwid-color") || (hifzReadingMode === "minimal-color");
    if (!useColors) return null;
    var ayahNumber = ayahIdx + 1;
    var key = surahNum + ":" + ayahNumber;
    var overlays = (state.riwaya !== "warsh" && tajwidData && tajwidData[key]) ? tajwidData[key] : null;
    return getSegmentsForAyah(key, fullText, overlays);
  }

  function _hifzGetVerseLabel() {
    var surah = surahs[hifzSurahIdx];
    if (!surah) return "Verset 1";
    var isBasmala = hifzAyahIdx === 0 && surah.surahNumber !== 1 && surah.surahNumber !== 9;
    if (isBasmala) return "Basmala";
    var num = (surah.surahNumber === 1 || surah.surahNumber === 9) ? hifzAyahIdx + 1 : hifzAyahIdx;
    return "Verset " + num;
  }

  function renderHifz() {
    var container = $("hifz-words");
    if (!container) return;
    container.innerHTML = "";
    var surah = surahs[hifzSurahIdx];
    if (!surah) return;

    // Update header
    var translit = SURAH_TRANSLIT[surah.surahNumber] || ("Sourate " + surah.surahNumber);
    var nameFr = SURAH_NAMES_FR[surah.surahNumber] || "";
    if ($("hifz-surah-name")) $("hifz-surah-name").textContent = translit;
    if ($("hifz-surah-meaning")) $("hifz-surah-meaning").textContent = nameFr.toUpperCase();

    // Update verse nav ref
    if ($("hifz-nav-ref")) $("hifz-nav-ref").textContent = _hifzGetVerseLabel();
    var ayahSel = $("hifz-ayah-select");
    if (ayahSel) ayahSel.value = hifzAyahIdx;

    // Get current verse text
    var text = surah.ayahs[hifzAyahIdx];
    if (!text) return;
    var words = text.replace(/^\s+|\s+$/g, "").split(/\s+/).filter(Boolean);

    // Calculate auto-hidden words
    var hideCount = Math.round(words.length * hifzHidePercent / 100);
    var autoHidden = new Set();
    if (hideCount > 0 && words.length > 0) {
      var count = Math.min(hideCount, words.length);
      var step = words.length / count;
      for (var i = 0; i < count; i++) {
        autoHidden.add(Math.min(Math.floor(i * step), words.length - 1));
      }
    }

    // Apply manual overrides
    var finalHidden = new Set(autoHidden);
    hifzManualHide.forEach(function (wIdx) { finalHidden.add(wIdx); });
    hifzManualShow.forEach(function (wIdx) { finalHidden.delete(wIdx); });

    // Color segments
    var allSegments = _hifzGetColorSegments(surah.surahNumber, hifzAyahIdx, text);
    var wordOffsets = _buildWordOffsets(text).offsets;

    // Render words
    words.forEach(function (word, idx) {
      var span = document.createElement("span");
      var isHidden = finalHidden.has(idx);
      span.className = "hifz-word" + (isHidden ? " hifz-hidden" : "");
      span.dataset.idx = idx;

      if (!isHidden && allSegments && wordOffsets[idx] !== undefined) {
        _applyColorSegmentsToSpan(span, word, allSegments, wordOffsets[idx]);
      } else {
        span.textContent = word;
      }

      // Tap to toggle
      span.addEventListener("click", function () {
        var wIdx = parseInt(span.dataset.idx, 10);
        if (span.classList.contains("hifz-hidden")) {
          span.classList.remove("hifz-hidden");
          span.classList.add("hifz-revealed");
          hifzManualHide.delete(wIdx);
          hifzManualShow.add(wIdx);
          if (allSegments && wordOffsets[wIdx] !== undefined) {
            span.innerHTML = "";
            _applyColorSegmentsToSpan(span, word, allSegments, wordOffsets[wIdx]);
          }
        } else if (span.classList.contains("hifz-revealed")) {
          span.classList.remove("hifz-revealed");
          span.classList.add("hifz-hidden");
          span.innerHTML = "";
          span.textContent = word;
          hifzManualShow.delete(wIdx);
          hifzManualHide.add(wIdx);
        } else {
          span.classList.add("hifz-hidden");
          span.innerHTML = "";
          span.textContent = word;
          hifzManualHide.add(wIdx);
        }
        // Update counter
        var hidden = container.querySelectorAll(".hifz-hidden").length;
        var total = container.querySelectorAll(".hifz-word").length;
        var lvl = $("hifz-level");
        if (lvl) lvl.textContent = hifzHidePercent + "% — " + hidden + " / " + total + " mots cachés";
      });

      container.appendChild(span);
      container.appendChild(document.createTextNode(" "));
    });

    // Add verse number marker (Arabic-Indic numerals)
    var isBasmala = hifzAyahIdx === 0 && surah.surahNumber !== 1 && surah.surahNumber !== 9;
    if (!isBasmala) {
      var verseNum = (surah.surahNumber === 1 || surah.surahNumber === 9) ? hifzAyahIdx + 1 : hifzAyahIdx;
      var mark = document.createElement("span");
      mark.className = "hifz-ayah-mark";
      mark.textContent = "\uFD3F" + _toArabicNum(verseNum) + "\uFD3E";
      container.appendChild(mark);
    }

    // Update level display
    var levelEl = $("hifz-level");
    if (levelEl) levelEl.textContent = hifzHidePercent + "% — " + finalHidden.size + " / " + words.length + " mots cachés";
    var countEl = $("hifz-hide-count");
    if (countEl) countEl.textContent = hifzHidePercent + "%";

    saveHifzLast();
  }

  // ---- Hifz Verse Navigation ----
  function _hifzLoadVerse(ayahIdx) {
    var surah = surahs[hifzSurahIdx];
    if (!surah || ayahIdx < 0 || ayahIdx >= surah.ayahs.length) return;
    hifzAyahIdx = ayahIdx;
    hifzManualHide = new Set();
    hifzManualShow = new Set();
    renderHifz();
  }

  function hifzNextVerse() {
    var surah = surahs[hifzSurahIdx];
    if (!surah) return;
    if (hifzAyahIdx < surah.ayahs.length - 1) {
      _hifzLoadVerse(hifzAyahIdx + 1);
    }
  }

  function hifzPrevVerse() {
    if (hifzAyahIdx > 0) {
      _hifzLoadVerse(hifzAyahIdx - 1);
    }
  }

  function hifzHideMore() {
    if (hifzHidePercent < 100) {
      hifzHidePercent = Math.min(100, hifzHidePercent + 10);
      hifzManualHide.clear(); hifzManualShow.clear();
      renderHifz();
    }
  }
  function hifzHideLess() {
    if (hifzHidePercent > 0) {
      hifzHidePercent = Math.max(0, hifzHidePercent - 10);
      hifzManualHide.clear(); hifzManualShow.clear();
      renderHifz();
    }
  }
  function hifzHideAll() {
    hifzHidePercent = 100;
    hifzManualHide.clear(); hifzManualShow.clear();
    renderHifz();
  }
  function hifzShowAll() {
    hifzHidePercent = 0;
    hifzManualHide.clear(); hifzManualShow.clear();
    renderHifz();
  }

  // ---- Hifz Audio ----
  function hifzGetAudioUrl(ayahIdx) {
    var surah = surahs[hifzSurahIdx];
    var surahNum = surah.surahNumber;
    var ayahNum = ayahIdx;
    if (surahNum === 1 || surahNum === 9) ayahNum = ayahIdx + 1;

    var recId = getHifzReciter();
    var rec = RECITERS.find(function(r) { return r.id === recId; }) || RECITERS[0];

    // Récitateur français via cdn.islamic.network
    if (rec.cdnEdition) {
      var absNum = (surahNum !== 1 && surahNum !== 9 && ayahIdx === 0) ? 1 : surahAyahToAbsolute(surahNum, ayahNum);
      return "https://cdn.islamic.network/quran/audio/128/" + rec.cdnEdition + "/" + absNum + ".mp3";
    }

    // everyayah.com
    var evId = rec.everyayahId || rec.id;
    if (evId && evId.indexOf("mp3q_") !== 0) {
      if (surahNum !== 1 && surahNum !== 9 && ayahIdx === 0) {
        return "https://everyayah.com/data/" + evId + "/001001.mp3";
      }
      var s = String(surahNum).padStart(3, "0");
      var a = String(ayahNum).padStart(3, "0");
      return "https://everyayah.com/data/" + evId + "/" + s + a + ".mp3";
    }

    // Fallback sourate complète
    if (rec.listenBase) {
      return rec.listenBase + "/" + String(surahNum).padStart(3, "0") + ".mp3";
    }
    return null;
  }

  function _hifzPlayVerse(ayahIdx) {
    var url = hifzGetAudioUrl(ayahIdx);
    if (!url) { showToast("Audio non disponible pour ce récitateur"); return; }
    if (hifzAudioEl) { hifzAudioEl.pause(); hifzAudioEl = null; }
    hifzAudioEl = new Audio(url);
    hifzAudioEl.addEventListener("ended", function () {
      hifzIsPlaying = false;
      _hifzUpdatePlayBtn();
    });
    hifzAudioEl.addEventListener("error", function () {
      hifzIsPlaying = false;
      _hifzUpdatePlayBtn();
      showToast("Audio non disponible");
    });
    hifzAudioEl.play().then(function () {
      hifzIsPlaying = true;
      _hifzUpdatePlayBtn();
    }).catch(function () {
      hifzIsPlaying = false;
      _hifzUpdatePlayBtn();
    });
  }

  function hifzToggleAudio() {
    if (hifzIsPlaying) { hifzStopAudio(); return; }
    _hifzPlayVerse(hifzAyahIdx);
  }

  function hifzStopAudio() {
    if (hifzAudioEl) { hifzAudioEl.pause(); hifzAudioEl = null; }
    hifzIsPlaying = false;
    _hifzUpdatePlayBtn();
  }

  function _hifzUpdatePlayBtn() {
    var playIcon = $("hifz-play-icon");
    var pauseIcon = $("hifz-pause-icon");
    if (playIcon) playIcon.classList.toggle("hidden", hifzIsPlaying);
    if (pauseIcon) pauseIcon.classList.toggle("hidden", !hifzIsPlaying);
  }

  // ---- Hifz Menu ----
  function hifzToggleMenu() {
    var menu = $("hifz-menu");
    if (!menu) return;
    hifzMenuOpen = !hifzMenuOpen;
    menu.classList.toggle("hidden", !hifzMenuOpen);
    if (hifzMenuOpen) {
      var btn = $("hifz-menu-btn");
      if (btn) {
        var rect = btn.getBoundingClientRect();
        menu.style.top = (rect.bottom + 8) + "px";
      }
    }
  }
  function hifzCloseMenu() {
    hifzMenuOpen = false;
    var menu = $("hifz-menu");
    if (menu) menu.classList.add("hidden");
  }

  // ---- Hifz Reciter Sheet (French names only) ----
  function hifzOpenReciterSheet() {
    hifzCloseMenu();
    var list = $("hifz-reciter-list");
    if (!list) return;
    list.innerHTML = "";
    var currentReciter = getHifzReciter();
    RECITERS.forEach(function (r) {
      if (r.lang === "fr") return;
      if (!r.id) return;
      var rr = r.riwaya || "hafs";
      var activeRiwaya = state.riwaya || "hafs";
      if (rr !== activeRiwaya) return;
      var hasPerVerse = !!(r.everyayahId || (r.id.indexOf("mp3q_") !== 0));
      var item = document.createElement("button");
      item.className = "hifz-reciter-item";
      var badge = hasPerVerse
        ? '<span class="reciter-item-badge reciter-badge-verse" style="margin-left:6px">verset</span>'
        : '<span class="reciter-item-badge" style="margin-left:6px">sourate</span>';
      item.innerHTML = '<div><div class="name">' + _escapeHtml(r.name) + badge + '</div></div>' +
        (r.id === currentReciter ? '<span class="check">✓</span>' : '');
      item.addEventListener("click", function () {
        setHifzReciter(r.id);
        $("hifz-reciter-sheet").classList.add("hidden");
        if (hifzIsPlaying) { hifzStopAudio(); hifzToggleAudio(); }
      });
      list.appendChild(item);
    });
    $("hifz-reciter-sheet").classList.remove("hidden");
  }

  function closeHifzOverlay() {
    hifzCloseMenu();
    hifzStopAudio();
    $("hifz-overlay").classList.add("hidden");
    hifzMode = false;
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
  // ============  SUIVI DE RÉCITATION (AUTO-SCROLL)  ==========
  // ===========================================================

  var followMode = false;
  var followIsListening = false;
  var followContext = null;        // "khatm" or "freeread"
  var followVerseQueue = [];       // [{si, ai, words, wordsNorm, text}]
  var followCurrentIdx = 0;
  var followMatchedCount = 0;
  var followWorker = null;
  var followWorkerReady = false;
  var followAudioCtx = null;
  var followMicStream = null;
  var followWatchdogTimer = null;
  var followLastTranscriptTime = 0;
  var followAudioChunksSent = 0;
  var followUserScrolling = false;       // true while user is manually scrolling
  var followUserScrollTimer = null;      // debounce timer to clear flag
  var followScrollListenerBound = false; // to avoid binding multiple times

  /** Build the verse queue starting from the current position */
  function followLoadVerseQueue() {
    followVerseQueue = [];
    followCurrentIdx = 0;
    followMatchedCount = 0;

    if (followContext === "khatm") {
      // Gather visible + upcoming verses from #kr-scroll
      var allVerses = krScrollEl.querySelectorAll(".kr-verse");
      for (var i = 0; i < allVerses.length; i++) {
        var si = parseInt(allVerses[i].dataset.si, 10);
        var ai = parseInt(allVerses[i].dataset.ai, 10);
        var text = surahs[si].ayahs[ai];
        var words = text.replace(/^\s+|\s+$/g, "").split(/\s+/).filter(Boolean);
        followVerseQueue.push({
          si: si, ai: ai, text: text,
          words: words,
          wordsNorm: words.map(function(w) { return normalizeArabic(w); }),
          el: allVerses[i]
        });
      }
      // Find current verse (the one closest to the top of viewport)
      if (allVerses.length > 0) {
        var scrollRect = krScrollEl.getBoundingClientRect();
        var midY = scrollRect.top + scrollRect.height * 0.35;
        for (var j = 0; j < followVerseQueue.length; j++) {
          var rect = followVerseQueue[j].el.getBoundingClientRect();
          if (rect.bottom >= midY) {
            followCurrentIdx = j;
            break;
          }
        }
      }
    } else if (followContext === "freeread") {
      // Load all verses from the Surah Player's reader
      var spContainer = $("sp-reader-content");
      if (!spContainer) return;
      var spVerses = spContainer.querySelectorAll(".sp-verse");
      for (var k = 0; k < spVerses.length; k++) {
        var spSi = spCurrentSurahIdx;
        var spAi = parseInt(spVerses[k].dataset.i, 10);
        var text2 = surahs[spSi].ayahs[spAi];
        var words2 = text2.replace(/^\s+|\s+$/g, "").split(/\s+/).filter(Boolean);
        followVerseQueue.push({
          si: spSi, ai: spAi, text: text2,
          words: words2,
          wordsNorm: words2.map(function(w) { return normalizeArabic(w); }),
          el: spVerses[k]
        });
      }
      // Find current verse (closest to top of viewport)
      var spScrollEl = $("sp-reader-scroll");
      if (spScrollEl && spVerses.length > 0) {
        var spRect = spScrollEl.getBoundingClientRect();
        var spMidY = spRect.top + spRect.height * 0.35;
        for (var m = 0; m < followVerseQueue.length; m++) {
          var mRect = followVerseQueue[m].el.getBoundingClientRect();
          if (mRect.bottom >= spMidY) {
            followCurrentIdx = m;
            break;
          }
        }
      }
    }
    followHighlightCurrent();
  }

  function followHighlightCurrent() {
    // Remove previous highlights (both contexts)
    var prev = document.querySelector(".kr-verse-follow-active");
    if (prev) prev.classList.remove("kr-verse-follow-active");
    var prev2 = document.querySelector(".sp-verse-follow-active");
    if (prev2) prev2.classList.remove("sp-verse-follow-active");

    if (followVerseQueue[followCurrentIdx]) {
      var el = followVerseQueue[followCurrentIdx].el;
      if (el) {
        if (followContext === "khatm") el.classList.add("kr-verse-follow-active");
        else if (followContext === "freeread") el.classList.add("sp-verse-follow-active");
      }
    }
  }

  // Helpers for follow matching
  function _followSim(a, b) {
    if (!a || !b) return 0;
    var dist = levenshtein(a, b);
    var mx = Math.max(a.length, b.length);
    return mx > 0 ? (1 - dist / mx) : 0;
  }
  function _followThresh(word) {
    return word.length <= 3 ? 0.75 : 0.55;
  }

  /** Scan-based matching: find best alignment of verse words anywhere in spoken words */
  function _followScanMatch(wordsNorm, spoken) {
    var bestCount = 0;
    var limit = Math.min(spoken.length, 40); // don't scan too far
    for (var start = 0; start < limit; start++) {
      var matched = 0;
      var si = start;
      var wi = 0;
      var skips = 0;
      while (wi < wordsNorm.length && si < spoken.length) {
        var sim = _followSim(wordsNorm[wi], spoken[si]);
        if (sim >= _followThresh(wordsNorm[wi])) {
          matched++;
          wi++; si++; skips = 0;
        } else {
          si++; skips++;
          if (skips > 3) break; // too many consecutive misses
        }
      }
      if (matched > bestCount) bestCount = matched;
      if (bestCount >= wordsNorm.length) break; // perfect match, stop early
    }
    return bestCount;
  }

  // ---- SUIVI VOCAL — Progressive scroll during recitation ----
  // Teleprompter-style: scroll to keep reading position at ~35% from top.
  // Gradually reveals next verse before highlight moves.
  // Respects manual user scroll without breaking the pipeline.

  /** Bind touch/wheel listeners on scrollEl to detect manual scrolls */
  function followBindScrollListeners(scrollEl) {
    if (!scrollEl || followScrollListenerBound) return;
    followScrollListenerBound = true;

    var markUserScroll = function() {
      if (!followIsListening) return;
      followUserScrolling = true;
      if (followUserScrollTimer) clearTimeout(followUserScrollTimer);
      followUserScrollTimer = setTimeout(function() {
        followUserScrolling = false;
      }, 1500); // resume auto-scroll 1.5s after user stops touching
    };

    scrollEl.addEventListener("touchstart", markUserScroll, { passive: true });
    scrollEl.addEventListener("touchmove", markUserScroll, { passive: true });
    scrollEl.addEventListener("wheel", markUserScroll, { passive: true });

    // Store cleanup function
    scrollEl._followCleanup = function() {
      scrollEl.removeEventListener("touchstart", markUserScroll);
      scrollEl.removeEventListener("touchmove", markUserScroll);
      scrollEl.removeEventListener("wheel", markUserScroll);
      followScrollListenerBound = false;
    };
  }

  function followProgressiveScroll(pct) {
    // Don't fight manual scrolling
    if (followUserScrolling) return;

    var scrollEl, verseEl;

    if (followContext === "khatm") {
      scrollEl = krScrollEl;
      var verse = followVerseQueue[followCurrentIdx];
      if (!verse || !verse.el) return;
      verseEl = verse.el;
    } else if (followContext === "freeread") {
      scrollEl = $("sp-reader-scroll");
      var spVerse = followVerseQueue[followCurrentIdx];
      if (!spVerse || !spVerse.el) return;
      verseEl = spVerse.el;
    } else {
      return;
    }
    if (!scrollEl) return;

    // Bind scroll listeners on first call
    followBindScrollListeners(scrollEl);

    var scrollRect = scrollEl.getBoundingClientRect();
    var verseRect = verseEl.getBoundingClientRect();
    var verseHeight = verseEl.offsetHeight;
    var containerH = scrollEl.clientHeight;

    // Reading position ON SCREEN (relative to scroll container top)
    var readScreenY = (verseRect.top - scrollRect.top) + pct * verseHeight;

    // Boost: when past 40% of current verse, gradually reveal the next verse
    var boost = 0;
    if (pct > 0.4 && followCurrentIdx + 1 < followVerseQueue.length) {
      var nextEl = followVerseQueue[followCurrentIdx + 1].el;
      if (nextEl) {
        // From 40%→100%, boost goes from 0 → 40% of next verse height
        var boostPct = (pct - 0.4) / 0.6;
        boost = boostPct * nextEl.offsetHeight * 0.4;
      }
    }

    var targetZone = containerH * 0.35;
    var effectiveReadY = readScreenY + boost;

    // Only scroll FORWARD — never scroll back
    if (effectiveReadY > targetZone + 5) {
      var targetScrollTop = scrollEl.scrollTop + (effectiveReadY - targetZone);
      if (targetScrollTop > scrollEl.scrollTop) {
        scrollEl.scrollTo({ top: targetScrollTop, behavior: "smooth" });
      }
    }
  }

  /** Process partial speech recognition transcript */
  function followProcessPartial(transcript) {
    var norm = normalizeArabic(transcript);
    var spoken = norm.split(/\s+/).filter(Boolean);
    if (!spoken.length) return;

    var verse = followVerseQueue[followCurrentIdx];
    if (!verse) return;

    var wordsNorm = verse.wordsNorm;

    // Scan-based matching: find verse words anywhere in transcript
    var matchCount = _followScanMatch(wordsNorm, spoken);

    // Keep best match count across calls (transcript grows over time)
    if (matchCount > followMatchedCount) followMatchedCount = matchCount;

    var pct = wordsNorm.length > 0 ? followMatchedCount / wordsNorm.length : 0;
    console.log("[follow] v" + followCurrentIdx + " | match=" + followMatchedCount + "/" + wordsNorm.length + " (" + Math.round(pct * 100) + "%) | spoken=" + spoken.length + " mots | «" + spoken.slice(-6).join(" ") + "»");

    // Progressive scroll: smoothly scroll as user reads through the verse
    followProgressiveScroll(pct);

    if (pct >= 0.65) {
      followAdvance();
      return;
    }

    // Lookahead: check if spoken words already match the START of the next verse
    if (followCurrentIdx + 1 < followVerseQueue.length) {
      var nextVerse = followVerseQueue[followCurrentIdx + 1];
      var nextNorm = nextVerse.wordsNorm;
      var nextCount = _followScanMatch(nextNorm.slice(0, 4), spoken.slice(-8));
      if (nextCount >= 2) {
        console.log("[follow] next verse lookahead: " + nextCount + " mots → advance");
        followAdvance();
        return;
      }
    }
  }

  /** Advance to the next verse */
  function followAdvance() {
    followMatchedCount = 0;
    // Soft reset: keep recent audio for faster next detection
    if (followWorker) followWorker.postMessage({ type: "advance" });
    console.log("[follow] ▶ ADVANCE to verse " + (followCurrentIdx + 1));

    if (followContext === "khatm") {
      followCurrentIdx++;
      if (followCurrentIdx >= followVerseQueue.length) {
        // End of loaded verses
        followStopListening();
        return;
      }
      followHighlightCurrent();
      // Smooth scroll to bring the new verse into starting position
      followProgressiveScroll(0);

    } else if (followContext === "freeread") {
      // Advance to next verse in the Surah Player
      followCurrentIdx++;
      if (followCurrentIdx >= followVerseQueue.length) {
        // End of surah
        followStopListening();
        return;
      }
      followHighlightCurrent();
      followProgressiveScroll(0);
    }
  }

  /** Start audio capture after worker is ready */
  async function followStartAudioCapture() {
    if (!followMicStream) return;
    followWorker.postMessage({ type: "reset" });
    followAudioChunksSent = 0;
    followLastTranscriptTime = Date.now();

    // Create AudioContext — explicitly request 16kHz if supported
    followAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    console.log("[follow] AudioContext created, state=" + followAudioCtx.state + " sampleRate=" + followAudioCtx.sampleRate);

    // Handle AudioContext suspension (iOS puts it to sleep)
    followAudioCtx.onstatechange = function() {
      console.log("[follow] AudioContext state changed to: " + followAudioCtx.state);
      if (followAudioCtx.state === "suspended" || followAudioCtx.state === "interrupted") {
        console.warn("[follow] AudioContext suspended — attempting resume...");
        followAudioCtx.resume().then(function() {
          console.log("[follow] AudioContext resumed OK, state=" + followAudioCtx.state);
        }).catch(function(err) {
          console.error("[follow] AudioContext resume failed:", err);
        });
      }
    };

    // Ensure it's running (may be suspended on mobile without gesture)
    if (followAudioCtx.state !== "running") {
      await followAudioCtx.resume();
      console.log("[follow] AudioContext after resume: state=" + followAudioCtx.state);
    }

    await followAudioCtx.audioWorklet.addModule("audio-processor.js");
    var source = followAudioCtx.createMediaStreamSource(followMicStream);
    var workletNode = new AudioWorkletNode(followAudioCtx, "audio-stream-processor");
    workletNode.port.onmessage = function(e) {
      if (followWorker && followWorkerReady) {
        followAudioChunksSent++;
        followWorker.postMessage({ type: "audio", samples: e.data }, [e.data]);
      }
    };
    source.connect(workletNode);
    // Silent output to keep processing chain alive
    var silencer = followAudioCtx.createGain();
    silencer.gain.value = 0;
    workletNode.connect(silencer);
    silencer.connect(followAudioCtx.destination);

    // Start watchdog timer to detect stalled pipeline
    followStartWatchdog();
  }

  /** Watchdog: periodically check that the audio pipeline is still alive */
  function followStartWatchdog() {
    followStopWatchdog();
    followWatchdogTimer = setInterval(function() {
      if (!followIsListening) { followStopWatchdog(); return; }

      // 1. Check AudioContext state — resume if suspended
      if (followAudioCtx && followAudioCtx.state !== "running") {
        console.warn("[follow-watchdog] AudioContext is " + followAudioCtx.state + " — resuming...");
        followAudioCtx.resume().catch(function() {});
      }

      // 2. Check mic stream is still active
      if (followMicStream) {
        var tracks = followMicStream.getAudioTracks();
        if (tracks.length === 0 || tracks[0].readyState === "ended") {
          console.error("[follow-watchdog] Mic stream ended! Restarting...");
          followStopListening();
          showToast("Le micro s'est arr\u00eat\u00e9. Relancez le suivi.");
          return;
        }
      }

      // 3. Check we're still getting transcripts (log diagnostics every 10s)
      var timeSinceTranscript = Date.now() - followLastTranscriptTime;
      if (timeSinceTranscript > 15000 && followAudioChunksSent > 0) {
        console.warn("[follow-watchdog] No transcript for " + (timeSinceTranscript / 1000).toFixed(0) + "s (chunks=" + followAudioChunksSent + ") — pinging worker");
        // Send ping to worker to check its health
        if (followWorker) followWorker.postMessage({ type: "ping" });
      }
    }, 5000); // Check every 5 seconds
  }

  function followStopWatchdog() {
    if (followWatchdogTimer) {
      clearInterval(followWatchdogTimer);
      followWatchdogTimer = null;
    }
  }

  /** Start listening for recitation (ONNX-based) */
  async function followStartListening() {
    if (followIsListening) return;
    try {
      // 1. Request mic
      followMicStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 2. Init worker if needed
      if (!followWorker) {
        followWorker = new Worker("follow-worker.js");
        followWorker.onmessage = function(e) {
          var msg = e.data;
          if (msg.type === "ready") {
            followWorkerReady = true;
            // Cancel delayed overlay timer + hide overlay if shown
            if (followWorker._overlayTimer) { clearTimeout(followWorker._overlayTimer); followWorker._overlayTimer = null; }
            var overlay = $("follow-progress-overlay");
            if (overlay) overlay.classList.add("hidden");
            followStartAudioCapture();
          } else if (msg.type === "progress") {
            var bar = $("follow-progress-bar");
            var txt = $("follow-progress-text");
            if (msg.total > 0) {
              var pct = Math.round(msg.loaded / msg.total * 100);
              if (bar) bar.style.width = pct + "%";
              if (txt) txt.textContent = pct + "%";
            } else {
              var mb = (msg.loaded / 1048576).toFixed(1);
              if (bar) bar.style.width = Math.min(msg.loaded / 120000000 * 100, 95) + "%";
              if (txt) txt.textContent = mb + " Mo";
            }
          } else if (msg.type === "status") {
            var st = $("follow-progress-status");
            if (st) st.textContent = msg.message;
          } else if (msg.type === "transcript") {
            followLastTranscriptTime = Date.now();
            followProcessPartial(msg.text);
          } else if (msg.type === "pong") {
            console.log("[follow-watchdog] Worker pong: processing=" + msg.isProcessing + " age=" + msg.processingAge + "ms chunks=" + msg.chunks + " inferences=" + msg.inferences + " buffer=" + msg.bufferLen);
          } else if (msg.type === "heartbeat") {
            console.log("[follow-watchdog] Worker heartbeat: " + msg.status + " inferences=" + msg.inferences);
          } else if (msg.type === "error") {
            showToast("Erreur mod\u00e8le vocal : " + msg.message);
            followStopListening();
          }
        };
      }

      followIsListening = true;
      followLoadVerseQueue();
      var kBtn = $("kr-follow-btn");
      var spBtn = $("sp-follow-btn");
      if (followContext === "khatm" && kBtn) kBtn.classList.add("follow-active");
      if (followContext === "freeread" && spBtn) spBtn.classList.add("follow-active");

      if (!followWorkerReady) {
        // Init worker — only show overlay if init takes >1.5s (= model download needed)
        followWorker._overlayTimer = setTimeout(function() {
          var overlay = $("follow-progress-overlay");
          if (overlay && !followWorkerReady) overlay.classList.remove("hidden");
        }, 1500);
        followWorker.postMessage({ type: "init" });
        // Audio capture starts when 'ready' is received
      } else {
        // Worker already ready, start audio directly
        followStartAudioCapture();
      }
    } catch (err) {
      console.error("Follow start error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        showToast("Acc\u00e8s au micro refus\u00e9");
      } else {
        showToast("Erreur micro");
      }
    }
  }

  function followStopListening() {
    if (!followIsListening) return;
    followIsListening = false;
    // Stop watchdog
    followStopWatchdog();
    // Stop audio capture
    if (followAudioCtx) {
      try { followAudioCtx.close(); } catch (e) {}
      followAudioCtx = null;
    }
    if (followMicStream) {
      followMicStream.getTracks().forEach(function(t) { t.stop(); });
      followMicStream = null;
    }
    // Hide progress overlay + cancel timer
    if (followWorker && followWorker._overlayTimer) { clearTimeout(followWorker._overlayTimer); followWorker._overlayTimer = null; }
    var overlay = $("follow-progress-overlay");
    if (overlay) overlay.classList.add("hidden");
    // Reset worker audio buffer (keep worker alive for next use)
    if (followWorker) { followWorker.postMessage({ type: "reset" }); }
    // Clean up scroll listeners
    followUserScrolling = false;
    if (followUserScrollTimer) { clearTimeout(followUserScrollTimer); followUserScrollTimer = null; }
    var cleanScrollEl = (followContext === "khatm") ? krScrollEl : $("sp-reader-scroll");
    if (cleanScrollEl && cleanScrollEl._followCleanup) { cleanScrollEl._followCleanup(); }
    // Remove highlights
    var prev = document.querySelector(".kr-verse-follow-active");
    if (prev) prev.classList.remove("kr-verse-follow-active");
    var prev2 = document.querySelector(".sp-verse-follow-active");
    if (prev2) prev2.classList.remove("sp-verse-follow-active");
    // Update UI
    var kBtn = $("kr-follow-btn");
    var spBtn = $("sp-follow-btn");
    if (kBtn) kBtn.classList.remove("follow-active");
    if (spBtn) spBtn.classList.remove("follow-active");
    followMode = false;
  }

  function followToggle(context) {
    if (followIsListening) {
      followStopListening();
    } else {
      followContext = context;
      followMode = true;
      followStartListening();
    }
  }

  function followCleanup() {
    if (followIsListening) followStopListening();
    followMode = false;
    followVerseQueue = [];
    followCurrentIdx = 0;
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
    // Set random blurred background image
    var bg = $("lp-bg");
    if (bg) bg.style.backgroundImage = "url('img/prayer/" + PRAYER_IMGS[Math.floor(Math.random() * PRAYER_IMGS.length)] + "')";
    listenRenderReciterSelect();
    listenRenderSurahs();
    listenUpdatePlayerBar();
  }

  function closeListenOverlay() {
    // Don't pause — keep playing, show mini-player instead
    if (listenIsPlaying) miniPlayerShow();
    _closeBack("listen-overlay", null);
  }

  function listenRenderReciterSelect() {
    // Keep hidden select in sync for JS compat
    var sel = $("listen-reciter-select");
    if (sel) {
      sel.innerHTML = "";
      RECITERS.forEach(function (r, idx) {
        if (!r.listenBase) return;
        var opt = document.createElement("option");
        opt.value = idx;
        opt.textContent = r.name;
        if (idx === listenReciterIdx) opt.selected = true;
        sel.appendChild(opt);
      });
    }
    // Render visual reciter list
    var list = $("lp-reciter-list");
    if (!list) return;
    list.innerHTML = "";
    RECITERS.forEach(function (r, idx) {
      if (!r.listenBase) return;
      var item = document.createElement("div");
      item.className = "lp-reciter-item" + (idx === listenReciterIdx ? " lp-reciter-active" : "");
      item.innerHTML = _escapeHtml(r.name) + (idx === listenReciterIdx ? ' \u2713' : '');
      item.addEventListener("click", function () {
        listenSelectReciter(idx);
        listenRenderReciterSelect();
      });
      list.appendChild(item);
    });
  }

  function listenRenderSurahs() {
    var list = $("listen-surah-list");
    if (!list) return;
    list.innerHTML = "";
    surahs.forEach(function (s, idx) {
      var item = document.createElement("div");
      item.className = "lp-track" + (idx === listenSurahIdx ? " lp-track-active" : "");
      item.id = "listen-si-" + idx;
      var nameFr = SURAH_NAMES_FR[s.surahNumber] || "";
      var verseCount = s.ayahs ? s.ayahs.length : "";
      item.innerHTML =
        '<span class="lp-track-num">' + s.surahNumber + '</span>' +
        '<div class="lp-track-info">' +
          '<span class="lp-track-title">' + nameFr + '</span>' +
          '<span class="lp-track-sub">' + verseCount + ' versets</span>' +
        '</div>';
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
    document.querySelectorAll(".lp-track").forEach(function (el, i) {
      el.classList.toggle("lp-track-active", i === idx);
    });
    listenUpdatePlayerBar();
    listenPlay();
  }

  // Reciter avatar colors (warm palette, distinct per reciter)
  var RECITER_COLORS = [
    "#8B5E3C","#5C6BC0","#26A69A","#AB47BC","#EF5350",
    "#42A5F5","#66BB6A","#FFA726","#EC407A","#7E57C2",
    "#29B6F6","#D4E157","#78909C","#FF7043","#26C6DA",
    "#9CCC65","#5C6BC0","#FFCA28","#8D6E63","#AED581",
    "#4DB6AC","#BA68C8"
  ];

  function reciterInitials(name) {
    if (!name) return "?";
    var parts = name.replace(/^(Al-|Al |El-)/i, "").split(/[\s-]+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  function reciterAvatarHtml(reciterIdx, size) {
    var r = RECITERS[reciterIdx];
    if (!r) return "";
    var img = PRAYER_IMGS[(reciterIdx * 7) % PRAYER_IMGS.length];
    var rad = Math.round(size * 0.22);
    return '<div style="width:' + size + 'px;height:' + size + 'px;border-radius:' + rad + 'px;' +
      'position:relative;overflow:hidden;flex-shrink:0;">' +
      '<div style="position:absolute;inset:-30%;background:url(img/prayer/' + img + ') center/cover;' +
      'filter:blur(8px);transform:scale(1.3);"></div>' +
      '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.25);"></div>' +
      '</div>';
  }

  function listenUpdatePlayerBar() {
    var surah = surahs[listenSurahIdx];
    var reciter = RECITERS[listenReciterIdx];
    var elAr = $("listen-player-surah-ar");
    var elFr = $("listen-player-surah-fr");
    var elRec = $("listen-player-reciter");
    if (elAr) elAr.textContent = surah ? (SURAH_NAMES_FR[surah.surahNumber] || surah.surahNameAr) : "Choisir une sourate";
    if (elFr) elFr.textContent = surah ? (surah.ayahs ? surah.ayahs.length + " versets" : "") : "";
    if (elRec) elRec.textContent = reciter ? reciter.name : "";
    // Update artwork with surah image (sharp)
    var art = $("lp-art");
    if (art && surah) art.style.backgroundImage = "url('" + getSurahImg(surah.surahNumber) + "')";
    art.style.backgroundSize = "cover";
    art.style.backgroundPosition = "center";
    listenUpdatePlayIcon();
    listenSetProgress(0, 0);
  }

  function listenUpdatePlayIcon() {
    var icon = $("listen-play-icon");
    if (!icon) return;
    if (listenIsPlaying) {
      icon.innerHTML = '<line x1="9" y1="6" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="18"/>';
    } else {
      icon.innerHTML = '<polygon points="9 6 18 12 9 18 9 6"/>';
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

    // If same URL is already loaded and just paused, resume instead of recreating
    if (listenAudio && listenAudio._lpUrl === url && listenAudio.paused && listenAudio.currentTime > 0) {
      listenAudio.play().then(function () {
        listenIsPlaying = true;
        listenUpdatePlayIcon();
      }).catch(function () {});
      return;
    }

    if (listenAudio) {
      listenAudio.pause();
      listenAudio.ontimeupdate = null;
      listenAudio.onended = null;
      listenAudio.onerror = null;
    }
    var seekTo = listenResumeTime;
    listenResumeTime = 0;
    listenAudio = new Audio(url);
    listenAudio._lpUrl = url;
    listenAudio.ontimeupdate = function () {
      if (!listenSeeking && listenAudio.duration) {
        listenSetProgress(listenAudio.currentTime, listenAudio.duration);
      }
    };
    listenAudio.onended = function () {
      listenIsPlaying = false;
      listenResumeTime = 0;
      listenUpdatePlayIcon();
      listenSetProgress(0, 0);
      listenSavePosition();
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
    // Seek to saved position once metadata is loaded
    if (seekTo > 0) {
      listenAudio.addEventListener("loadedmetadata", function () {
        if (seekTo < listenAudio.duration) listenAudio.currentTime = seekTo;
      }, { once: true });
    }
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
  // ============  MINI-PLAYER FLOTTANT  ======================
  // ===========================================================

  var LISTEN_POS_KEY = "qurani-listen-pos";

  function miniPlayerShow() {
    var mp = $("mini-player");
    if (mp) mp.classList.remove("hidden");
    miniPlayerSync();
  }

  function miniPlayerHide() {
    var mp = $("mini-player");
    if (mp) mp.classList.add("hidden");
  }

  function miniPlayerSync() {
    var surah = surahs[listenSurahIdx];
    var reciter = RECITERS[listenReciterIdx];
    var title = $("mini-player-title");
    var sub = $("mini-player-sub");
    if (title) title.textContent = surah ? (SURAH_NAMES_FR[surah.surahNumber] || surah.surahNameAr) : "--";
    if (sub) sub.textContent = reciter ? reciter.name : "";
    // Update mini-player thumb with surah image
    var thumb = $("mp-thumb");
    if (thumb && surah) thumb.style.backgroundImage = "url('" + getSurahImg(surah.surahNumber) + "')";
    miniPlayerUpdateIcon();
    miniPlayerUpdateProgress();
  }

  function miniPlayerUpdateIcon() {
    var icon = $("mini-player-play-icon");
    if (!icon) return;
    if (listenIsPlaying) {
      icon.innerHTML = '<line x1="9" y1="6" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="18"/>';
    } else {
      icon.innerHTML = '<polygon points="9 6 18 12 9 18 9 6"/>';
    }
  }

  function miniPlayerUpdateProgress() {
    var bar = $("mini-player-progress");
    if (!bar || !listenAudio) { if (bar) bar.style.width = "0%"; return; }
    var pct = listenAudio.duration > 0 ? (listenAudio.currentTime / listenAudio.duration) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, pct)) + "%";
    var mpTime = $("mp-time");
    if (mpTime) mpTime.textContent = listenFormatTime(listenAudio.currentTime);
  }

  function miniPlayerStop() {
    listenPause();
    miniPlayerHide();
    // Reset position
    var mp = $("mini-player");
    if (mp) { mp.style.left = ""; mp.style.right = ""; mp.style.top = ""; mp.style.bottom = ""; }
    listenSavePosition();
  }

  // ---- DRAG ----
  (function () {
    var mp, startX, startY, startLeft, startTop, dragging = false, moved = false;
    function initDrag() {
      mp = $("mini-player");
      if (!mp) return;
      mp.addEventListener("touchstart", onStart, { passive: true });
      mp.addEventListener("touchmove", onMove, { passive: false });
      mp.addEventListener("touchend", onEnd, { passive: true });
    }
    function onStart(e) {
      var t = e.touches[0];
      var r = mp.getBoundingClientRect();
      startX = t.clientX; startY = t.clientY;
      startLeft = r.left; startTop = r.top;
      dragging = true; moved = false;
      mp.style.transition = "none";
    }
    function onMove(e) {
      if (!dragging) return;
      var t = e.touches[0];
      var dx = t.clientX - startX, dy = t.clientY - startY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) moved = true;
      if (!moved) return;
      e.preventDefault();
      var x = startLeft + dx, y = startTop + dy;
      var w = mp.offsetWidth, h = mp.offsetHeight;
      var vw = window.innerWidth, vh = window.innerHeight;
      x = Math.max(4, Math.min(vw - w - 4, x));
      y = Math.max(4, Math.min(vh - h - 4, y));
      mp.style.position = "fixed";
      mp.style.left = x + "px"; mp.style.top = y + "px";
      mp.style.bottom = "auto"; mp.style.right = "auto";
      mp.style.margin = "0";
    }
    function onEnd() {
      if (!dragging) return;
      dragging = false;
      mp.style.transition = "";
      if (moved) {
        // Swallow the tap so buttons don't fire after drag
        var swallow = function (ev) { ev.stopPropagation(); ev.preventDefault(); };
        mp.addEventListener("click", swallow, { capture: true, once: true });
      }
    }
    // Init after DOM ready
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initDrag);
    else setTimeout(initDrag, 0);
  })();

  // Save / restore position for resume
  function listenSavePosition() {
    try {
      var data = { surah: listenSurahIdx, reciter: listenReciterIdx, time: listenAudio ? listenAudio.currentTime : 0 };
      localStorage.setItem(LISTEN_POS_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  var listenResumeTime = 0; // Time to seek to when play starts

  function listenRestorePosition() {
    try {
      var raw = localStorage.getItem(LISTEN_POS_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (typeof data.surah === "number" && data.surah >= 0 && data.surah < surahs.length) {
        listenSurahIdx = data.surah;
      }
      if (typeof data.reciter === "number" && data.reciter >= 0 && data.reciter < RECITERS.length) {
        listenReciterIdx = data.reciter;
      }
      if (typeof data.time === "number" && data.time > 0) {
        listenResumeTime = data.time;
      }
    } catch (e) {}
  }

  // Auto-save position when app goes to background, restore when coming back
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (listenAudio) listenSavePosition();
    } else {
      // If audio was lost (iOS kills background audio), restore position for next play
      if (!listenAudio || (listenAudio.paused && !listenIsPlaying)) {
        listenRestorePosition();
      }
    }
  });
  window.addEventListener("beforeunload", function () {
    if (listenAudio) listenSavePosition();
  });
  // Save position every 5 seconds during playback
  setInterval(function () {
    if (listenIsPlaying && listenAudio) listenSavePosition();
  }, 5000);

  // Patch listen functions to keep mini-player in sync
  var _origListenPlay = listenPlay;
  listenPlay = function () {
    _origListenPlay();
    miniPlayerShow();
  };

  var _origListenPause = listenPause;
  listenPause = function () {
    _origListenPause();
    miniPlayerUpdateIcon();
    listenSavePosition();
  };

  var _origListenUpdatePlayIcon = listenUpdatePlayIcon;
  listenUpdatePlayIcon = function () {
    _origListenUpdatePlayIcon();
    miniPlayerUpdateIcon();
  };

  var _origListenSelectSurah = listenSelectSurah;
  listenSelectSurah = function (idx) {
    _origListenSelectSurah(idx);
    miniPlayerSync();
  };

  var _origListenSelectReciter = listenSelectReciter;
  listenSelectReciter = function (idx) {
    _origListenSelectReciter(idx);
    miniPlayerSync();
  };

  var _origListenSetProgress = listenSetProgress;
  listenSetProgress = function (cur, dur) {
    _origListenSetProgress(cur, dur);
    miniPlayerUpdateProgress();
  };

  // Normalize for fuzzy search (remove accents, dashes, al-, etc.)
  function lpNormalize(str) {
    return str.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[''`\-]/g, " ")
      .replace(/\b(al |el |le |la |les |l |d |du )/g, "")
      .replace(/\s+/g, " ").trim();
  }

  function lpFuzzyMatch(text, query) {
    var t = lpNormalize(text), q = lpNormalize(query);
    if (!q) return true;
    if (t.indexOf(q) !== -1) return true;
    // Check each query word
    var words = q.split(" ");
    return words.every(function (w) { return t.indexOf(w) !== -1; });
  }

  function listenFilterReciters(query) {
    document.querySelectorAll(".lp-reciter-item").forEach(function (el) {
      el.style.display = lpFuzzyMatch(el.textContent, query) ? "" : "none";
    });
  }

  function listenFilterSurahs(query) {
    document.querySelectorAll(".lp-track").forEach(function (el) {
      var title = el.querySelector(".lp-track-title");
      var num = el.querySelector(".lp-track-num");
      var text = (title ? title.textContent : "") + " " + (num ? num.textContent : "");
      el.style.display = lpFuzzyMatch(text, query) ? "" : "none";
    });
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
  var shazamRecordedRate = 16000;
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

  var _shazamPrayerImages = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,37,38,39,41,42,43,44,45,47,48,49,50,51];
  function openShazamOverlay() {
    shazamBuildCache();
    var idx = _shazamPrayerImages[Math.floor(Math.random() * _shazamPrayerImages.length)];
    var bg = $("shazam-bg");
    if (bg) bg.style.backgroundImage = "url('img/prayer/" + idx + ".jpg')";
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
    var scrollBg = $("shazam-scroll-bg");
    var status = $("shazam-status");
    var timer = $("shazam-timer");
    var found = $("shazam-found");
    var result = $("shazam-result");
    var error = $("shazam-error");

    btn.className = "shazam-btn";
    rings.className = "shazam-rings";
    btnWrap.classList.remove("hidden");
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
      // On Android WebView, sampleRate constraint is not supported and causes failure.
      // Request mic with minimal constraints, handle resampling via AudioContext.
      shazamStream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: false, noiseSuppression: false }
      });
    } catch (err) {
      console.error("[shazam] mic error:", err.name, err.message);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        showToast("Accès au micro refusé. Vérifiez les paramètres.");
      } else if (err.name === "NotFoundError") {
        showToast("Aucun micro détecté");
      } else {
        showToast("Erreur micro");
      }
      return;
    }

    shazamIsRecording = true;
    shazamChunks = [];
    // Try 16kHz AudioContext; fallback to device default if unsupported
    try {
      shazamAudioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
    } catch (e) {
      shazamAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    shazamRecordedRate = shazamAudioCtx.sampleRate;
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
    var ctxRate = shazamRecordedRate || 16000;
    shazamChunks = [];

    // Resample to 16kHz if AudioContext was running at a different rate
    if (ctxRate !== 16000 && ctxRate > 0) {
      var ratio = ctxRate / 16000;
      var newLen = Math.round(totalLen / ratio);
      var resampled = new Float32Array(newLen);
      for (var r = 0; r < newLen; r++) {
        resampled[r] = merged[Math.min(Math.round(r * ratio), totalLen - 1)];
      }
      merged = resampled;
      totalLen = newLen;
    }

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
      var surahIdx = shazamResultSurah;
      var ayahIdx = shazamResultAyah;
      closeShazamOverlay();
      // Open the modern surah player
      openSurahPlayer(surahIdx);
      // Scroll to the specific verse after a short delay for rendering
      setTimeout(function() {
        var target = document.querySelector("#sp-reader-content .sp-verse[data-i='" + ayahIdx + "']");
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          // Briefly highlight the verse
          target.classList.add("sp-verse-active");
          setTimeout(function() { target.classList.remove("sp-verse-active"); }, 3000);
        }
      }, 300);
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
  var EMOTION_WORDS = ["Gratitude","Tristesse","Col\u00e8re","Solitude","Doute","Amour","Joie","Repentir","Paresse","Angoisse","Peur","D\u00e9tresse","Espoir","Regret","Honte","Envie","Haine","Orgueil","Arrogance","Ingratitude","Pauvret\u00e9","Richesse","Pudeur","Mis\u00e9ricorde","Compassion","Ghayrah"];
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
          {type:"verset",ref:"Al-Anbiya 21:87",ar:"\u0644\u064e\u0627 \u0625\u0650\u0644\u064e\u0647\u064e \u0625\u0650\u0644\u0651\u064e\u0627 \u0623\u064e\u0646\u0652\u062a\u064e \u0633\u064f\u0628\u0652\u062d\u064e\u0627\u0646\u064e\u0643\u064e \u0625\u0650\u0646\u0650\u0651\u064a \u0643\u064f\u0646\u0652\u062a\u064f \u0645\u0650\u0646\u064e \u0627\u0644\u0638\u0651\u064e\u0627\u0644\u0650\u0645\u0650\u064a\u0646\u064e",fr:"Il n\u2019y a de divinit\u00e9 que Toi ! Gloire \u00e0 Toi ! J\u2019\u00e9tais du nombre des injustes.",commentary:"L\u2019invocation de Yunus dans le ventre de la baleine. Aucun musulman n\u2019invoque par elle sans qu\u2019Allah ne le d\u00e9livre."},
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
          {type:"verset",ref:"Al-Falaq 113:1-5",ar:"\u0642\u064f\u0644\u0652 \u0623\u064e\u0639\u064f\u0648\u0630\u064f \u0628\u0650\u0631\u064e\u0628\u0651\u0650 \u0627\u0644\u0652\u0641\u064e\u0644\u064e\u0642\u0650 \u06de \u0645\u0650\u0646\u0652 \u0634\u064e\u0631\u0651\u0650 \u0645\u064e\u0627 \u062e\u064e\u0644\u064e\u0642\u064e \u06de \u0648\u064e\u0645\u0650\u0646\u0652 \u0634\u064e\u0631\u0651\u0650 \u063a\u064e\u0627\u0633\u0650\u0642\u0613 \u0625\u0650\u0630\u064e\u0627 \u0648\u064e\u0642\u064e\u0628\u064e \u06de \u0648\u064e\u0645\u0650\u0646\u0652 \u0634\u064e\u0631\u0651\u0650 \u0627\u0644\u0646\u0651\u064e\u0641\u0651\u064e\u0627\u062b\u064e\u0627\u062a\u0650 \u0641\u0650\u064a \u0627\u0644\u0652\u0639\u064f\u0642\u064e\u062f\u0650 \u06de \u0648\u064e\u0645\u0650\u0646\u0652 \u0634\u064e\u0631\u0651\u0650 \u062d\u064e\u0627\u0633\u0650\u062f\u0613 \u0625\u0650\u0630\u064e\u0627 \u062d\u064e\u0633\u064e\u062f\u064e \u0648\u0645\u0646 \u0634\u0631\u0651 \u062d\u0627\u0633\u062f \u0625\u0650\u0630\u0627 \u062d\u0633\u062f",fr:"Dis : Je me r\u00e9fugie aupr\u00e8s du Seigneur de l\u2019aube\u2026 contre le mal de l\u2019envieux quand il envie.",commentary:"Allah nous ordonne de chercher refuge contre le mal de l\u2019envie, signe de sa gravit\u00e9."},
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
    },
    "Arrogance": {
      gradient: "linear-gradient(165deg, #2a1218 0%, #260f18 30%, #1f0c14 60%, #1a0a10 100%)",
      articleBg: "rgba(20,8,12,0.95)",
      quote: "Allah n\u2019aime pas le pr\u00e9somptueux plein de gloriole.",
      turnTowards: [
        "L\u2019humilit\u00e9 sincère (tawadu\u2019) dans les actes et la parole",
        "Le service des humbles et des d\u00e9munis",
        "La m\u00e9ditation sur l\u2019origine de l\u2019homme (argile, goutte d\u2019eau)",
        "L\u2019acceptation de la correction et du conseil d\u2019autrui",
        "Le rappel constant de la grandeur infinie d\u2019Allah"
      ],
      guardAgainst: [
        "Le rejet de la v\u00e9rit\u00e9 par orgueil",
        "Le m\u00e9pris et le d\u00e9dain envers les autres",
        "La vantardise de ses qualit\u00e9s et de ses œuvres",
        "L\u2019admiration excessive de soi-m\u00eame (\u2018ujb)",
        "La recherche de l\u2019\u00e9l\u00e9vation sur les cr\u00e9atures"
      ],
      article: {
        title: "Versets et hadiths sur l\u2019arrogance",
        entries: [
          {type:"verset",ref:"An-Nahl 16:23",ar:"إِنَّهُ لَا يُحِبُّ الْمُسْتَكْبِرِينَ",fr:"En v\u00e9rit\u00e9, Il n\u2019aime pas les arrogants.",commentary:"Allah d\u00e9tourne Son amour de ceux qui s\u2019enflent d\u2019orgueil. L\u2019arrogance est un voile entre le serviteur et la mis\u00e9ricorde divine."},
          {type:"verset",ref:"Al-Hadid 57:23",ar:"وَاللَّهُ لَا يُحِبُّ كُلَّ مُخْتَالٍ فَخُورٍ",fr:"Allah n\u2019aime pas le pr\u00e9somptueux plein de gloriole.",commentary:"Le mukhtal est celui qui se pavane d\u2019orgueil. Le fakhour est celui qui ne cesse de se vanter. Les deux sont d\u00e9test\u00e9s d\u2019Allah."},
          {type:"verset",ref:"Al-Mu\u2019min 40:35",ar:"كَذَلِكَ يَطْبَعُ اللَّهُ عَلَى كُلِّ قَلْبِ مُتَكَبِّرٍ جَبَّارٍ",fr:"C\u2019est ainsi qu\u2019Allah scelle tout c\u0153ur arrogant et tyran.",commentary:"L\u2019arrogance obstrue le c\u0153ur jusqu\u2019\u00e0 ce qu\u2019Allah y appose Son sceau. Plus aucune v\u00e9rit\u00e9 ne peut y entrer."},
          {type:"verset",ref:"Az-Zumar 39:60",ar:"أَلَيْسَ فِي جَهَنَّمَ مَثْوًى لِلْمُتَكَبِّرِينَ",fr:"La G\u00e9henne n\u2019est-elle pas la demeure des arrogants ?",commentary:"Allah pose la question de mani\u00e8re rh\u00e9torique. L\u2019arrogance conduit in\u00e9vitablement \u00e0 l\u2019Enfer. Nulle excuse ne sera accept\u00e9e."},
          {type:"hadith",ref:"Muslim 91",ar:"لَا يَدْخُلُ الْجَنَّةَ مَنْ كَانَ فِي قَلْبِهِ مِثْقَالُ ذَرَّةٍ مِنْ كِبْرٍ",fr:"N\u2019entrera pas au Paradis celui qui a dans son c\u0153ur le poids d\u2019un atome d\u2019orgueil.",commentary:"Le Proph\u00e8te a d\u00e9fini le kibr : rejeter la v\u00e9rit\u00e9 et m\u00e9priser les gens. Ces deux attitudes suffisent \u00e0 fermer les portes du Paradis."}
        ]
      }
    },
    "Ingratitude": {
      gradient: "linear-gradient(165deg, #181820 0%, #141520 30%, #10121a 60%, #0e1018 100%)",
      articleBg: "rgba(10,10,18,0.95)",
      quote: "Si vous \u00eates ingrats, sachez qu\u2019Allah Se passe de vous.",
      turnTowards: [
        "Compter chaque bienfait d\u2019Allah, m\u00eame le plus infime",
        "Le sujud ash-shukr \u00e0 chaque bienfait re\u00e7u",
        "Exprimer sa gratitude aux gens qui nous font du bien",
        "Partager ses bienfaits avec ceux qui en ont besoin",
        "Cultiver la m\u00e9moire des bienfaits pass\u00e9s dans l\u2019\u00e9preuve"
      ],
      guardAgainst: [
        "La plainte excessive et l\u2019oubli des bienfaits",
        "Consid\u00e9rer ses bienfaits comme m\u00e9rit\u00e9s ou acquis",
        "Le kufr an-ni\u2019ma : nier les bienfaits d\u2019Allah",
        "Attribuer ses succ\u00e8s \u00e0 sa seule force ou intelligence",
        "L\u2019ingratitude envers les gens, porte de l\u2019ingratitude envers Allah"
      ],
      article: {
        title: "Versets et hadiths sur l\u2019ingratitude",
        entries: [
          {type:"verset",ref:"Ibrahim 14:7",ar:"لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ",fr:"Si vous \u00eates reconnaissants, J\u2019augmenterai Mes bienfaits. Mais si vous \u00eates ingrats, Mon ch\u00e2timent est assur\u00e9ment s\u00e9v\u00e8re.",commentary:"La gratitude est une loi divine : elle multiplie les bienfaits. L\u2019ingratitude, elle, appelle le ch\u00e2timent. Ce choix appartient \u00e0 chaque \u00e2me."},
          {type:"verset",ref:"Az-Zumar 39:7",ar:"وَإِن تَكْفُرُوا فَإِنَّ اللَّهَ غَنِيٌّ عَنكُمْ وَلَا يَرْضَى لِعِبَادِهِ الْكُفْرَ",fr:"Si vous \u00eates ingrats, Allah Se passe de vous. Il n\u2019agr\u00e9e pas l\u2019ingratitude de Ses serviteurs.",commentary:"Allah n\u2019a pas besoin de notre reconnaissance. Mais Il ne l\u2019agr\u00e9e pas. L\u2019ingratitude blesse le serviteur, non son Seigneur."},
          {type:"verset",ref:"Al-Baqara 2:152",ar:"فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",fr:"Souvenez-vous de Moi, Je Me souviendrai de vous. Soyez-Moi reconnaissants et ne soyez pas ingrats.",commentary:"Allah lie le dhikr et le shukr. Se souvenir d\u2019Allah et Lui \u00eatre reconnaissant sont deux actes fondamentaux du serviteur."},
          {type:"verset",ref:"Ibrahim 14:34",ar:"إِنَّ الْإِنسَانَ لَظَلُومٌ كَفَّارٌ",fr:"En v\u00e9rit\u00e9, l\u2019homme est tr\u00e8s injuste et tr\u00e8s ingrat.",commentary:"Allah d\u00e9crit la tendance naturelle de l\u2019homme \u00e0 l\u2019ingratitude. Reconnaître cette faiblesse est la premi\u00e8re \u00e9tape vers la gu\u00e9rison."},
          {type:"hadith",ref:"Tirmidhi 1954",ar:"مَنْ لَا يَشْكُرُ النَّاسَ لَا يَشْكُرُ اللَّهَ",fr:"Celui qui ne remercie pas les gens ne remercie pas Allah.",commentary:"La gratitude est un tout. Celui qui m\u00e9prise les bienfaits humains manque de la v\u00e9ritable gratitude envers son Cr\u00e9ateur."}
        ]
      }
    },
    "Pauvret\u00e9": {
      gradient: "linear-gradient(165deg, #1e1810 0%, #1a1508 30%, #15100a 60%, #120e08 100%)",
      articleBg: "rgba(14,10,6,0.95)",
      quote: "La v\u00e9ritable richesse est la richesse de l\u2019\u00e2me.",
      turnTowards: [
        "La confiance totale en Allah le Pourvoyeur (Al-Razzaq)",
        "La patience dans l\u2019\u00e9preuve et l\u2019attente du soulagement",
        "La pri\u00e8re de l\u2019aube (Fajr) et le dhikr du matin",
        "Chercher le halal avec ardeur et sans d\u00e9couragement",
        "Contempler ceux plus d\u00e9munis pour relativiser"
      ],
      guardAgainst: [
        "Le d\u00e9sespoir de la mis\u00e9ricorde d\u2019Allah",
        "La jalousie envers les plus ais\u00e9s",
        "Recourir \u00e0 l\u2019ill\u00e9gal pour sortir de la pauvret\u00e9",
        "Croire que la pauvret\u00e9 est un signe de m\u00e9pris divin",
        "N\u00e9gliger ses obligations religieuses par d\u00e9couragement"
      ],
      article: {
        title: "Versets et hadiths sur la pauvret\u00e9",
        entries: [
          {type:"verset",ref:"Ad-Duha 93:8",ar:"وَوَجَدَكَ عَائِلًا فَأَغْنَى",fr:"Il t\u2019a trouv\u00e9 pauvre et Il t\u2019a enrichi.",commentary:"Allah rappelle au Proph\u00e8te \u2605 Ses bienfaits. M\u00eame la pauvret\u00e9 pass\u00e9e \u00e9tait un d\u00e9but de chemin. Aucune situation n\u2019est d\u00e9finitive pour Allah."},
          {type:"verset",ref:"Al-Baqara 2:268",ar:"الشَّيْطَانُ يَعِدُكُمُ الْفَقْرَ وَيَأْمُرُكُم بِالْفَحْشَاءِ وَاللَّهُ يَعِدُكُم مَّغْفِرَةً مِّنْهُ وَفَضْلًا",fr:"Satan vous promet la pauvret\u00e9 et vous commande la turpitude. Mais Allah vous promet Son pardon et Sa gr\u00e2ce.",commentary:"La peur de la pauvret\u00e9 est une arme de Satan pour pousser l\u2019homme au p\u00e9ch\u00e9. Allah promet le contraire : pardon et abondance."},
          {type:"verset",ref:"Ash-Sharh 94:5-6",ar:"فَإِنَّ مَعَ الْعُسْرِ يُسْرًا إِنَّ مَعَ الْعُسْرِ يُسْرًا",fr:"Avec la difficult\u00e9 vient l\u2019aisance. Avec la difficult\u00e9 vient l\u2019aisance.",commentary:"Allah r\u00e9p\u00e8te deux fois la m\u00eame promesse. Un seul 'usr (difficult\u00e9) avec deux yusr (aisances). La promesse divine est double."},
          {type:"verset",ref:"At-Talaq 65:7",ar:"سَيَجْعَلُ اللَّهُ بَعْدَ عُسْرٍ يُسْرًا",fr:"Allah accordera l\u2019aisance apr\u00e8s la g\u00eane.",commentary:"Ce 'apr\u00e8s' est une promesse divine. La g\u00eane actuelle ne d\u00e9finit pas l\u2019avenir. Allah est Celui qui transforme les situations."},
          {type:"hadith",ref:"Bukhari 6446",ar:"لَيْسَ الْغِنَى عَنْ كَثْرَةِ الْعَرَضِ وَلَكِنَّ الْغِنَى غِنَى النَّفْسِ",fr:"La richesse n\u2019est pas l\u2019abondance des biens, mais la richesse de l\u2019\u00e2me.",commentary:"La pauvret\u00e9 mat\u00e9rielle ne d\u00e9finit pas le rang spirituel. L\u2019homme le plus riche mat\u00e9riellement peut \u00eatre int\u00e9rieurement vide."}
        ]
      }
    },
    "Richesse": {
      gradient: "linear-gradient(165deg, #1e1a06 0%, #1c1804 30%, #181402 60%, #141200 100%)",
      articleBg: "rgba(14,12,2,0.95)",
      quote: "La richesse et les enfants sont l\u2019ornement de la vie d\u2019ici-bas.",
      turnTowards: [
        "La zakat et la sadaqa comme purification du bien",
        "La gratitude constante pour les bienfaits re\u00e7us",
        "D\u00e9penser dans le chemin d\u2019Allah sans craindre la pauvret\u00e9",
        "Utiliser la richesse pour aider les vuln\u00e9rables",
        "Se rappeler que la richesse est un test, non une r\u00e9compense"
      ],
      guardAgainst: [
        "L\u2019attachement au dunya et l\u2019oubli de l\u2019Au-del\u00e0",
        "L\u2019avarice et la th\u00e9saurisation du bien",
        "L\u2019orgueil li\u00e9 aux possessions mat\u00e9rielles",
        "N\u00e9gliger ses obligations spirituelles par occupation",
        "Croire que la richesse t\u00e9moigne de la faveur divine"
      ],
      article: {
        title: "Versets et hadiths sur la richesse",
        entries: [
          {type:"verset",ref:"Al-Kahf 18:46",ar:"الْمَالُ وَالْبَنُونَ زِينَةُ الْحَيَاةِ الدُّنْيَا وَالْبَاقِيَاتُ الصَّالِحَاتُ خَيْرٌ عِندَ رَبِّكَ ثَوَابًا وَخَيْرٌ أَمَلًا",fr:"La richesse et les enfants sont l\u2019ornement de la vie d\u2019ici-bas. Mais les bonnes œuvres durables valent mieux aupr\u00e8s de ton Seigneur.",commentary:"La richesse n\u2019est qu\u2019un ornement temporaire. Les b\u00e2qiy\u00e2t \u015f\u00e2li\u1e25\u00e2t (bonnes œuvres durables) sont le v\u00e9ritable investissement."},
          {type:"verset",ref:"At-Tawba 9:34",ar:"وَالَّذِينَ يَكْنِزُونَ الذَّهَبَ وَالْفِضَّةَ وَلَا يُنفِقُونَهَا فِي سَبِيلِ اللَّهِ فَبَشِّرْهُم بِعَذَابٍ أَلِيمٍ",fr:"Ceux qui th\u00e9saurisent l\u2019or et l\u2019argent sans les d\u00e9penser dans le chemin d\u2019Allah, annonce-leur un ch\u00e2timent douloureux.",commentary:"La th\u00e9saurisation est l\u2019un des grands p\u00e9ch\u00e9s. La richesse immobilis\u00e9e br\u00fblera son propri\u00e9taire le Jour du Jugement."},
          {type:"verset",ref:"Al-Baqara 2:261",ar:"مَثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ",fr:"Ceux qui d\u00e9pensent leurs biens dans le chemin d\u2019Allah ressemblent \u00e0 un grain qui produit sept \u00e9pis.",commentary:"Chaque dirham d\u00e9pens\u00e9 pour Allah est multipli\u00e9 par sept cents. La g\u00e9n\u00e9rosit\u00e9 est le meilleur des investissements."},
          {type:"verset",ref:"Saba 34:39",ar:"وَمَا أَنفَقْتُم مِّن شَيْءٍ فَهُوَ يُخْلِفُهُ وَهُوَ خَيْرُ الرَّازِقِينَ",fr:"Tout ce que vous d\u00e9pensez, Il le remplace. Il est le meilleur des Pourvoyeurs.",commentary:"Allah garantit le remplacement de ce qui est d\u00e9pens\u00e9 pour Sa cause. La g\u00e9n\u00e9rosit\u00e9 n\u2019appauvrit jamais."},
          {type:"hadith",ref:"Ahmad 17452",ar:"نِعْمَ الْمَالُ الصَّالِحُ لِلرَّجُلِ الصَّالِحِ",fr:"Quel excellent bien que le bien l\u00e9gitime pour l\u2019homme pieux !",commentary:"Le Proph\u00e8te ne condamne pas la richesse en soi. Entre les mains d\u2019un homme pieux, elle devient un instrument de bien."}
        ]
      }
    },
    "Pudeur": {
      gradient: "linear-gradient(165deg, #201520 0%, #1c121a 30%, #180e18 60%, #140c14 100%)",
      articleBg: "rgba(14,8,14,0.95)",
      quote: "La pudeur fait enti\u00e8rement partie de la foi.",
      turnTowards: [
        "Baisser le regard devant ce qu\u2019Allah a interdit",
        "Soigner son apparence et son habillement selon la Sunnah",
        "Cultiver la modestie dans la parole et la d\u00e9marche",
        "Prot\u00e9ger ce qu\u2019Allah a rendu sacr\u00e9 (chastet\u00e9, honneur)",
        "Ressentir de la honte devant Allah avant devant les hommes"
      ],
      guardAgainst: [
        "Tout ce qui est expos\u00e9 sans pudeur sur les r\u00e9seaux sociaux",
        "Les regards interdits et les fr\u00e9quentations mixtes non n\u00e9cessaires",
        "Perdre la honte devant Allah \u00e0 force de p\u00e9ch\u00e9s r\u00e9p\u00e9t\u00e9s",
        "La trivialit\u00e9 et l\u2019impudeur dans le langage",
        "S\u2019habiller de mani\u00e8re \u00e0 attirer l\u2019attention d\u2019autrui"
      ],
      article: {
        title: "Versets et hadiths sur la pudeur",
        entries: [
          {type:"verset",ref:"An-Nur 24:30",ar:"قُل لِّلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ وَيَحْفَظُوا فُرُوجَهُمْ ذَلِكَ أَزْكَى لَهُمْ",fr:"Dis aux croyants de baisser leurs regards et de garder leur chastet\u00e9. C\u2019est plus pur pour eux.",commentary:"Baisser le regard est un acte de foi. \u2018Azk\u00e2 lahum\u2019 : cela les purifie int\u00e9rieurement. La pudeur est une protection de l\u2019\u00e2me."},
          {type:"verset",ref:"An-Nur 24:31",ar:"وَقُل لِّلْمُؤْمِنَاتِ يَغْضُضْنَ مِنْ أَبْصَارِهِنَّ وَيَحْفَظْنَ فُرُوجَهُنَّ",fr:"Dis aux croyantes de baisser leurs regards et de garder leur chastet\u00e9.",commentary:"La pudeur est exig\u00e9e des deux genres. Ce n\u2019est pas une oppression mais une protection de la dignit\u00e9 de l\u2019\u00e2me."},
          {type:"verset",ref:"Al-A\u2019raf 7:26",ar:"وَلِبَاسُ التَّقْوَى ذَلِكَ خَيْرٌ",fr:"Le v\u00eatement de la pi\u00e9t\u00e9, voil\u00e0 qui est meilleur.",commentary:"Le meilleur v\u00eatement n\u2019est pas celui qui couvre le corps mais celui qui couvre le c\u0153ur : la taqwa, la conscience permanente d\u2019Allah."},
          {type:"verset",ref:"Al-Mu\u2019minun 23:5",ar:"وَالَّذِينَ هُمْ لِفُرُوجِهِمْ حَافِظُونَ",fr:"Ceux qui pr\u00e9servent leur chastet\u00e9.",commentary:"Parmi les attributs des vrais croyants figure la pr\u00e9servation de la chastet\u00e9. C\u2019est un pilier du succ\u00e8s dans l\u2019Au-del\u00e0."},
          {type:"hadith",ref:"Tirmidhi 2009",ar:"الْحَيَاءُ شُعْبَةٌ مِنَ الْإِيمَانِ",fr:"La pudeur est une branche de la foi.",commentary:"La foi a des branches. La pudeur en est une essentielle. Sa disparition progressive affaiblit la foi tout enti\u00e8re."}
        ]
      }
    },
    "Mis\u00e9ricorde": {
      gradient: "linear-gradient(165deg, #0a1e20 0%, #081a1c 30%, #061618 60%, #051214 100%)",
      articleBg: "rgba(4,14,16,0.95)",
      quote: "Ma mis\u00e9ricorde embrasse toute chose.",
      turnTowards: [
        "Invoquer les Noms d\u2019Allah Ar-Rahman et Ar-Rahim",
        "La tawba (repentir) sans jamais d\u00e9sesp\u00e9rer du pardon",
        "Faire mis\u00e9ricorde aux cr\u00e9atures d\u2019Allah (hommes, animaux)",
        "La dou\u2019a pour les autres, vivants et d\u00e9c\u00e9d\u00e9s",
        "Rappeler aux gens la Mis\u00e9ricorde d\u2019Allah face au d\u00e9sespoir"
      ],
      guardAgainst: [
        "Le d\u00e9sespoir du pardon d\u2019Allah (qunut)",
        "Sous-estimer la gravit\u00e9 des p\u00e9ch\u00e9s en comptant sur la mis\u00e9ricorde",
        "Priver les autres de mis\u00e9ricorde tout en l\u2019attendant d\u2019Allah",
        "Croire qu\u2019Allah ne pardonne pas certains p\u00e9ch\u00e9s",
        "L\u2019exc\u00e8s de rigueur envers soi-m\u00eame au point du d\u00e9sespoir"
      ],
      article: {
        title: "Versets et hadiths sur la mis\u00e9ricorde",
        entries: [
          {type:"verset",ref:"Al-A\u2019raf 7:156",ar:"وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ",fr:"Ma mis\u00e9ricorde embrasse toute chose.",commentary:"La Rahma d\u2019Allah est sans limites. Elle pr\u00e9c\u00e8de Sa col\u00e8re, elle couvre tout p\u00e9ch\u00e9 pour qui revient \u00e0 Lui avec sinc\u00e9rit\u00e9."},
          {type:"verset",ref:"Az-Zumar 39:53",ar:"لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ",fr:"Ne d\u00e9sesp\u00e9rez pas de la mis\u00e9ricorde d\u2019Allah. Allah pardonne tous les p\u00e9ch\u00e9s.",commentary:"Ce verset est l\u2019un des plus beaux du Coran. \u2018Jami\u2018an\u2019 : tous les p\u00e9ch\u00e9s. Aucune exception. Seul le d\u00e9sespoir ferme cette porte."},
          {type:"verset",ref:"Al-An\u2019am 6:12",ar:"كَتَبَ عَلَى نَفْسِهِ الرَّحْمَةَ",fr:"Il S\u2019est prescrit \u00e0 Lui-m\u00eame la mis\u00e9ricorde.",commentary:"Allah a fait de la Mis\u00e9ricorde une obligation qu\u2019Il S\u2019impose \u00e0 Lui-m\u00eame. C\u2019est une promesse divine inalt\u00e9rable."},
          {type:"verset",ref:"Al-Anbiya 21:107",ar:"وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ",fr:"Nous ne t\u2019avons envoy\u00e9 qu\u2019en mis\u00e9ricorde pour les mondes.",commentary:"Le Proph\u00e8te Muhammad \u2605 est lui-m\u00eame une rahma pour toute l\u2019humanit\u00e9, croyants et non-croyants confondus."},
          {type:"hadith",ref:"Bukhari 5999",ar:"اللَّهُ أَرْحَمُ بِعِبَادِهِ مِنَ الْأُمِّ بِوَلَدِهَا",fr:"Allah a plus de mis\u00e9ricorde envers Ses serviteurs qu\u2019une m\u00e8re envers son enfant.",commentary:"Une m\u00e8re est l\u2019image m\u00eame de la tendresse. Allah est encore plus tendrement mis\u00e9ricordieux que cela. Quel apaisement pour celui qui souffre."}
        ]
      }
    },
    "Compassion": {
      gradient: "linear-gradient(165deg, #18102a 0%, #150d26 30%, #110920 60%, #0d071a 100%)",
      articleBg: "rgba(10,6,18,0.95)",
      quote: "Ceux qui font mis\u00e9ricorde seront trait\u00e9s avec mis\u00e9ricorde par le Tout-Mis\u00e9ricordieux.",
      turnTowards: [
        "Nourrir les pauvres et les orphelins r\u00e9guli\u00e8rement",
        "Visiter les malades et les endeuill\u00e9s",
        "Intercession (shafa\u2019a) en faveur de ceux dans le besoin",
        "Sourire \u00e0 son fr\u00e8re comme acte de sadaqa",
        "Soulager la souffrance des cr\u00e9atures d\u2019Allah sans exception"
      ],
      guardAgainst: [
        "L\u2019indiff\u00e9rence face \u00e0 la souffrance d\u2019autrui",
        "Rejeter l\u2019orphelin et n\u00e9gliger le pauvre",
        "La duret\u00e9 de c\u0153ur acquise par les p\u00e9ch\u00e9s r\u00e9p\u00e9t\u00e9s",
        "Agir par charit\u00e9 uniquement en public (riy\u00e2\u2019)",
        "Manger \u00e0 sa faim en ignorant celui qui a faim"
      ],
      article: {
        title: "Versets et hadiths sur la compassion",
        entries: [
          {type:"verset",ref:"Al-Insan 76:8",ar:"وَيُطْعِمُونَ الطَّعَامَ عَلَى حُبِّهِ مِسْكِينًا وَيَتِيمًا وَأَسِيرًا",fr:"Ils donnent la nourriture, malgr\u00e9 leur amour pour elle, au pauvre, \u00e0 l\u2019orphelin et au prisonnier.",commentary:"\u2018Ala hubbihi : malgr\u00e9 leur besoin personnel. La compassion v\u00e9ritable donne m\u00eame ce qu\u2019on aime. Elle ne calcule pas."},
          {type:"verset",ref:"Al-Insan 76:9",ar:"إِنَّمَا نُطْعِمُكُمْ لِوَجْهِ اللَّهِ لَا نُرِيدُ مِنكُمْ جَزَاءً وَلَا شُكُورًا",fr:"Nous ne vous nourrissons que pour le visage d\u2019Allah. Nous n\u2019attendons de vous ni r\u00e9compense ni gratitude.",commentary:"La compassion islamique est purement pour Allah. Pas de reconnaissance humaine attendue, pas de publicit\u00e9 recherch\u00e9e."},
          {type:"verset",ref:"Al-Balad 90:13-14",ar:"فَكُّ رَقَبَةٍ أَوْ إِطْعَامٌ فِي يَوْمٍ ذِي مَسْغَبَةٍ",fr:"Affranchir un esclave, ou nourrir un jour de famine.",commentary:"Allah d\u00e9finit l\u2019escalade vers le bien. La compassion concr\u00e8te envers les oppress\u00e9s et les affam\u00e9s est la voie du salut."},
          {type:"verset",ref:"Al-Ma\u2019un 107:2-3",ar:"فَذَلِكَ الَّذِي يَدُعُّ الْيَتِيمَ وَلَا يَحُضُّ عَلَى طَعَامِ الْمِسْكِينِ",fr:"C\u2019est celui qui repousse l\u2019orphelin et n\u2019encourage pas \u00e0 nourrir le pauvre.",commentary:"Allah d\u00e9finit le d\u00e9menteur de la religion non par ses croyances mais par son manque de compassion. L\u2019acte prime."},
          {type:"hadith",ref:"Tirmidhi 1924",ar:"الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ ارْحَمُوا مَنْ فِي الْأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ",fr:"Ceux qui font mis\u00e9ricorde re\u00e7oivent la mis\u00e9ricorde du Tout-Mis\u00e9ricordieux. Ayez compassion pour ceux sur terre et Celui dans le ciel aura compassion de vous.",commentary:"Une loi divine parfaite : la compassion descend du ciel en proportion de celle qu\u2019on accorde sur terre."}
        ]
      }
    },
    "Ghayrah": {
      gradient: "linear-gradient(165deg, #0c2018 0%, #0a1c14 30%, #081810 60%, #06140c 100%)",
      articleBg: "rgba(4,14,8,0.95)",
      quote: "Allah est ghay\u00fbr, et Sa ghayrah est viol\u00e9e lorsque ce qu\u2019Il a interdit est commis.",
      turnTowards: [
        "Prot\u00e9ger l\u2019honneur de sa famille avec sagesse et dignit\u00e9",
        "Maintenir les limites d\u2019Allah (hud\u00fbd) avec fermet\u00e9",
        "Canaliser la ghayrah vers la jalousie positive (al-ghibtah)",
        "Refuser ce qu\u2019Allah a interdit par amour pour Lui",
        "D\u00e9velopper la ghayrah pour Allah avant celle pour soi"
      ],
      guardAgainst: [
        "La ghayrah non fond\u00e9e sur des pr\u00e9somptions injustes",
        "Laisser la ghayrah d\u00e9g\u00e9n\u00e9rer en violence injustifi\u00e9e",
        "La jalousie destructrice envers les bienfaits d\u2019autrui (hasad)",
        "Ignorer ses obligations de protection par faiblesse",
        "Confondre la ghayrah saine et la possessivit\u00e9 maladive"
      ],
      article: {
        title: "Versets et hadiths sur la ghayrah",
        entries: [
          {type:"verset",ref:"Al-Isra 17:32",ar:"وَلَا تَقْرَبُوا الزِّنَا إِنَّهُ كَانَ فَاحِشَةً وَسَاءَ سَبِيلًا",fr:"N\u2019approchez pas la fornication. C\u2019est une turpitude et une mauvaise voie.",commentary:"La ghayrah divine est viol\u00e9e par le zin\u00e2. Allah interdit m\u00eame de s\u2019en approcher. La protection des sanctuaires commence par l\u2019\u00e9loignement."},
          {type:"verset",ref:"An-Nur 24:2",ar:"الزَّانِيَةُ وَالزَّانِي فَاجْلِدُوا كُلَّ وَاحِدٍ مِّنْهُمَا مِائَةَ جَلْدَةٍ",fr:"La fornicatrice et le fornicateur, fouettez chacun d\u2019eux de cent coups.",commentary:"La rigueur de la loi sur ce point t\u00e9moigne de l\u2019importance de la ghayrah collective. Prot\u00e9ger l\u2019honneur est un devoir communautaire."},
          {type:"verset",ref:"An-Nisa 4:34",ar:"الرِّجَالُ قَوَّامُونَ عَلَى النِّسَاءِ بِمَا فَضَّلَ اللَّهُ بَعْضَهُمْ عَلَى بَعْضٍ",fr:"Les hommes sont responsables des femmes en raison de ce par quoi Allah a favoris\u00e9 les uns sur les autres.",commentary:"La qiwama implique la protection. La ghayrah du mari envers son \u00e9pouse est une expression de cette responsabilit\u00e9 divine."},
          {type:"hadith",ref:"Bukhari 5220",ar:"إِنَّ اللَّهَ يَغَارُ وَغَيْرَةُ اللَّهِ أَنْ يَأْتِيَ الْمُؤْمِنُ مَا حَرَّمَ اللَّهُ",fr:"Allah est ghay\u00fbr, et Sa ghayrah est viol\u00e9e lorsque le croyant commet ce qu\u2019Allah a interdit.",commentary:"Allah Lui-m\u00eame est d\u00e9crit comme ayant une ghayrah. Toute violation de Ses limites touche cette ghayrah divine."},
          {type:"hadith",ref:"Bukhari 7416",ar:"لَا أَحَدَ أَغْيَرُ مِنَ اللَّهِ",fr:"Personne n\u2019est plus ghay\u00fbr qu\u2019Allah.",commentary:"La ghayrah d\u2019Allah surpasse celle de toute cr\u00e9ature. Elle se manifeste dans Ses interdictions qui prot\u00e8gent la dignit\u00e9 humaine."}
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
    var hint = $("emotion-scroll-hint");
    if (hint) {
      hint.classList.remove("hidden");
      hint.style.animation = "none";
      hint.offsetHeight;
      hint.style.animation = "";
    }
  }

  function closeEmotionDetail() {
    _closeBack("emotion-overlay");
  }


  // ============================================================
  // DU'A / INVOCATIONS — DATA & FUNCTIONS
  // ============================================================

  var HISNII_BASE = "https://hisnii.com/wp-content/uploads/";
  var EVERYAYAH = "https://everyayah.com/data/Alafasy_128kbps/";
  var ARCHIVE = "https://archive.org/download/HisnulMuslimAudio_201510/";
  // Multi-verse Quranic entries: [surah, startVerse, endVerse]
  var DUA_MULTI_AUDIO = {
    "matin:1":[112,1,4],"matin:2":[113,1,5],"matin:3":[114,1,6],
    "soir:1":[112,1,4],"soir:2":[113,1,5],"soir:3":[114,1,6],
    "protection:2":[113,1,5],"protection:3":[114,1,6]
  };
  var DUA_AUDIO_MAP = {
    // MATIN — Quranic entries via everyayah (verified by surah:verse)
    "matin:0":EVERYAYAH+"002255.mp3",
    "matin:1":EVERYAYAH+"112001.mp3","matin:2":EVERYAYAH+"113001.mp3",
    "matin:3":EVERYAYAH+"114001.mp3",
    // MATIN — non-Quranic adhkar (hisnii — no archive.org alt available)
    "matin:4":"audio/dua/Invocation-du-matin-bismillah-ladhi-la-yaduru.mp3","matin:5":"audio/dua/allahumma-bika-asbahna.mp3",
    "matin:6":"audio/dua/asbahna-alhamdullillah.mp3","matin:7":"audio/dua/asbahna-rabbi.mp3",
    "matin:8":"audio/dua/Allahoumma-anta-rabbi.mp3",
    "matin:9":"audio/dua/allahoumma-inni-as-alouka.mp3",
    "matin:10":"audio/dua/ya-hayyou-ya-qayyoum.mp3",
    "matin:11":"audio/dua/allahoumma-alima-l-ghaybi.mp3",
    "matin:12":"audio/dua/la-ilaha-illallahu-wahdahu.mp3",
    "matin:13":"audio/dua/subhanallahi-wa-bihamdih.mp3",
    "matin:14":"audio/dua/allahumma-ma-asbaha.mp3",
    "matin:15":"audio/dua/la-ilaha-illallahu-yuhyi-wa-yumit.mp3",
    "matin:17":"2017/02/3_18.mp3",
    // SOIR — Quranic entries via everyayah
    "soir:0":EVERYAYAH+"002255.mp3",
    "soir:1":EVERYAYAH+"112001.mp3","soir:2":EVERYAYAH+"113001.mp3",
    "soir:3":EVERYAYAH+"114001.mp3",
    // SOIR — non-Quranic adhkar (hisnii)
    "soir:4":"2017/02/2_8.mp3","soir:5":"2017/02/3_18.mp3",
    // DORMIR — verified archive.org + everyayah for Quranic
    "dormir:0":"2017/02/1_1_1.mp3",
    "dormir:1":"http://www.hisnmuslim.com/audio/ar/111.mp3","dormir:2":"http://www.hisnmuslim.com/audio/ar/104.mp3",
    "dormir:3":EVERYAYAH+"067001.mp3",
    "dormir:4":"http://www.hisnmuslim.com/audio/ar/107.mp3","dormir:5":"2017/02/1_1_13.mp3",
    // PROTECTION — everyayah for Quranic
    "protection:0":"http://www.hisnmuslim.com/audio/ar/97.mp3",
    "protection:1":"http://www.hisnmuslim.com/audio/ar/86.mp3",
    "protection:2":EVERYAYAH+"113001.mp3","protection:3":EVERYAYAH+"114001.mp3",
    // protection:4 (Tirmidhi 3528) — no audio available
    // TRISTESSE — hisnmuslim.com direct (pages 34+35)
    "tristesse:0":"http://www.hisnmuslim.com/audio/ar/120.mp3",
    "tristesse:1":"http://www.hisnmuslim.com/audio/ar/124.mp3",
    "tristesse:2":"http://www.hisnmuslim.com/audio/ar/121.mp3",
    "tristesse:3":"http://www.hisnmuslim.com/audio/ar/123.mp3",
    // VOYAGE — hisnii.com du'a complet du voyageur (confirmed working)
    "voyage:0":"2016/10/23_6_1.mp3",
    "voyage:1":"2016/10/23_6_1.mp3",
    "voyage:2":"2016/10/23_6_1.mp3",
    // ISTIKHARA — hisnmuslim p.26 (74)
    "istikhara:0":"http://www.hisnmuslim.com/audio/ar/74.mp3",
    "istikhara:1":"http://www.hisnmuslim.com/audio/ar/74.mp3",
    // REVEIL — hisnmuslim p.28 (1,2,3)
    "reveil:0":"http://www.hisnmuslim.com/audio/ar/1.mp3",
    "reveil:1":"http://www.hisnmuslim.com/audio/ar/2.mp3",
    "reveil:2":"http://www.hisnmuslim.com/audio/ar/3.mp3",
    // REPAS — hisnmuslim p.69 avant (178,179) + p.70 après (180,181)
    "repas:0":"http://www.hisnmuslim.com/audio/ar/178.mp3",
    "repas:1":"http://www.hisnmuslim.com/audio/ar/179.mp3",
    "repas:2":"http://www.hisnmuslim.com/audio/ar/180.mp3",
    "repas:3":"http://www.hisnmuslim.com/audio/ar/181.mp3",
    "repas:4":"http://www.hisnmuslim.com/audio/ar/181.mp3",
    // MAISON — hisnmuslim p.11 entrer (18) + p.10 sortir (16,17)
    "maison:0":"http://www.hisnmuslim.com/audio/ar/18.mp3",
    "maison:1":"http://www.hisnmuslim.com/audio/ar/16.mp3",
    "maison:2":"http://www.hisnmuslim.com/audio/ar/17.mp3",
    // MOSQUEE — hisnmuslim p.13 entrer (20) + p.14 sortir (21)
    "mosquee:0":"http://www.hisnmuslim.com/audio/ar/20.mp3",
    "mosquee:1":"http://www.hisnmuslim.com/audio/ar/21.mp3",
    // TOILETTES — hisnmuslim p.6 entrer (10) + p.7 sortir (11)
    "toilettes:0":"http://www.hisnmuslim.com/audio/ar/10.mp3",
    "toilettes:1":"http://www.hisnmuslim.com/audio/ar/11.mp3",
    // VETEMENT — hisnmuslim p.2 (5) + p.4 (7)
    "vetement:0":"http://www.hisnmuslim.com/audio/ar/5.mp3",
    "vetement:1":"http://www.hisnmuslim.com/audio/ar/7.mp3",
    // APRES-PRIERE — hisnmuslim p.25 (66,68,70,72,73)
    "apres-priere:0":"http://www.hisnmuslim.com/audio/ar/66.mp3",
    "apres-priere:1":"http://www.hisnmuslim.com/audio/ar/68.mp3",
    "apres-priere:2":"http://www.hisnmuslim.com/audio/ar/70.mp3",
    "apres-priere:3":"http://www.hisnmuslim.com/audio/ar/72.mp3",
    "apres-priere:4":"http://www.hisnmuslim.com/audio/ar/73.mp3",
    // SUJUD — hisnmuslim p.19 (41,42,43,44,47)
    "sujud:0":"http://www.hisnmuslim.com/audio/ar/41.mp3",
    "sujud:1":"http://www.hisnmuslim.com/audio/ar/42.mp3",
    "sujud:2":"http://www.hisnmuslim.com/audio/ar/43.mp3",
    "sujud:3":"http://www.hisnmuslim.com/audio/ar/44.mp3",
    "sujud:4":"http://www.hisnmuslim.com/audio/ar/47.mp3",
    // PROSTERNATIONS — hisnmuslim p.20 (48,49)
    "prosternations:0":"http://www.hisnmuslim.com/audio/ar/48.mp3",
    "prosternations:1":"http://www.hisnmuslim.com/audio/ar/49.mp3",
    // TASHAHUD — hisnmuslim p.22 (52) + p.23 (53) + p.24 (55)
    "tashahud:0":"http://www.hisnmuslim.com/audio/ar/52.mp3",
    "tashahud:1":"http://www.hisnmuslim.com/audio/ar/53.mp3",
    "tashahud:2":"http://www.hisnmuslim.com/audio/ar/55.mp3",
    // COLERE — hisnmuslim p.82 (193)
    "colere:0":"http://www.hisnmuslim.com/audio/ar/193.mp3",
    "colere:1":"http://www.hisnmuslim.com/audio/ar/193.mp3",
    // PEUR — hisnmuslim p.36 (126) + p.34 (121)
    "peur:0":"http://www.hisnmuslim.com/audio/ar/126.mp3",
    "peur:1":"http://www.hisnmuslim.com/audio/ar/126.mp3",
    "peur:2":"http://www.hisnmuslim.com/audio/ar/121.mp3",
    // ANXIETE — hisnmuslim p.34 (120) + p.35 (122,123)
    "anxiete:0":"http://www.hisnmuslim.com/audio/ar/120.mp3",
    "anxiete:1":"http://www.hisnmuslim.com/audio/ar/122.mp3",
    "anxiete:2":"https://everyayah.com/data/Alafasy_128kbps/021087.mp3",
    "anxiete:3":"http://www.hisnmuslim.com/audio/ar/123.mp3",
    // DETTE — hisnmuslim p.41 (136,137)
    "dette:0":"http://www.hisnmuslim.com/audio/ar/136.mp3",
    "dette:1":"http://www.hisnmuslim.com/audio/ar/137.mp3",
    // MALADE — hisnmuslim p.49 (147,148)
    "malade:0":"http://www.hisnmuslim.com/audio/ar/147.mp3",
    "malade:1":"http://www.hisnmuslim.com/audio/ar/148.mp3",
    "malade:2":"http://www.hisnmuslim.com/audio/ar/148.mp3",
    // PLUIE — hisnmuslim p.62 (168) + p.63 (169,170) + p.64 (172) + p.65 (173)
    "pluie:0":"http://www.hisnmuslim.com/audio/ar/172.mp3",
    "pluie:1":"http://www.hisnmuslim.com/audio/ar/173.mp3",
    "pluie:2":"http://www.hisnmuslim.com/audio/ar/168.mp3",
    "pluie:3":"http://www.hisnmuslim.com/audio/ar/169.mp3",
    "pluie:4":"http://www.hisnmuslim.com/audio/ar/170.mp3",
    // IFTAR — hisnmuslim p.68 (176,177)
    "iftar:0":"http://www.hisnmuslim.com/audio/ar/176.mp3",
    "iftar:1":"http://www.hisnmuslim.com/audio/ar/177.mp3",
    // MARIAGE — hisnmuslim p.79 (190) + p.80 (191) + p.81 (192)
    "mariage:0":"http://www.hisnmuslim.com/audio/ar/190.mp3",
    "mariage:1":"http://www.hisnmuslim.com/audio/ar/191.mp3",
    "mariage:2":"http://www.hisnmuslim.com/audio/ar/192.mp3",
    // DEFUNT — hisnmuslim p.55 (156,157,158)
    "defunt:0":"http://www.hisnmuslim.com/audio/ar/156.mp3",
    "defunt:1":"http://www.hisnmuslim.com/audio/ar/157.mp3",
    "defunt:2":"http://www.hisnmuslim.com/audio/ar/158.mp3",
    // MARCHE — hisnmuslim p.98 (209)
    "marche:0":"http://www.hisnmuslim.com/audio/ar/209.mp3",
    "soir:6":"https://archive.org/download/azkar-al-masa-1425/9-azkar-al-masa-1425-4.mp3",
    "soir:7":"https://archive.org/download/azkar-al-masa-1425/9-azkar-al-masa-1425-3.mp3",
    "soir:8":"http://www.hisnmuslim.com/audio/ar/79.mp3",
    "soir:9":"http://www.hisnmuslim.com/audio/ar/92.mp3",
    "soir:10":"http://www.hisnmuslim.com/audio/ar/91.mp3",
    "soir:11":"https://archive.org/download/azkar-al-masa-1425/9-azkar-al-masa-1425-7.mp3",
    "soir:14":"audio/dua/allahoumma-inni-as-alouka.mp3","soir:15":"audio/dua/ya-hayyou-ya-qayyoum.mp3",
    "soir:16":"audio/dua/allahoumma-alima-l-ghaybi.mp3","soir:17":"audio/dua/la-ilaha-illallahu-yuhyi-wa-yumit.mp3",
    "taajjub:0":"http://www.hisnmuslim.com/audio/ar/240.mp3",
    "taajjub:1":"http://www.hisnmuslim.com/audio/ar/241.mp3",
    // SALAWAT — static.lifewithallah.com (184–192)
    "salawat:0":"https://static.lifewithallah.com/file/LifeWithAllah/main/4-Salawat/184.mp3",
    "salawat:1":"https://static.lifewithallah.com/file/LifeWithAllah/main/4-Salawat/185.mp3",
    "salawat:2":"https://static.lifewithallah.com/file/LifeWithAllah/main/4-Salawat/186.mp3",
    "salawat:3":"https://static.lifewithallah.com/file/LifeWithAllah/main/4-Salawat/187.mp3",
    "salawat:4":"https://static.lifewithallah.com/file/LifeWithAllah/main/4-Salawat/188.mp3",
    "salawat:5":"https://static.lifewithallah.com/file/LifeWithAllah/main/4-Salawat/189.mp3",
    "salawat:6":"https://static.lifewithallah.com/file/LifeWithAllah/main/4-Salawat/190.mp3",
    "salawat:7":"https://static.lifewithallah.com/file/LifeWithAllah/main/4-Salawat/191.mp3",
    "salawat:8":"https://static.lifewithallah.com/file/LifeWithAllah/main/4-Salawat/192.mp3"
  };

  function _everyAyahUrl(surah, verse) {
    return EVERYAYAH + String(surah).padStart(3,"0") + String(verse).padStart(3,"0") + ".mp3";
  }

  function getDuaAudioUrl(catId, entryIdx, ref) {
    var key = catId + ":" + entryIdx;
    // Check single-file map first
    if (DUA_AUDIO_MAP[key]) {
      var val = DUA_AUDIO_MAP[key];
      return (val.indexOf("http") === 0 || val.indexOf("audio/") === 0) ? val : HISNII_BASE + val;
    }
    // Check multi-audio map (return first verse URL)
    if (DUA_MULTI_AUDIO[key]) {
      var m = DUA_MULTI_AUDIO[key];
      return _everyAyahUrl(m[0], m[1]);
    }
    // Rabbana (Quranic verses via ref)
    if (catId === "rabbana" && ref) {
      var rm = ref.match(/(\d+):(\d+)/);
      if (rm) return _everyAyahUrl(parseInt(rm[1],10), parseInt(rm[2],10));
    }
    return null;
  }

  var duaAudio = null;
  var duaAudioCurrentKey = null;
  var duaPreloadCache = {};

  function preloadDuaAudio(catId, entries) {
    duaPreloadCache = {};
    entries.forEach(function(entry, idx) {
      var url = getDuaAudioUrl(catId, idx, entry.ref);
      if (url) {
        var a = new Audio();
        a.preload = "none"; // "auto" activait la session audio iOS même sans play() → coupait la musique de fond
        a.src = url;
        duaPreloadCache[catId + ":" + idx] = a;
      }
    });
  }

  var _duaPlaylist = null; // array of URLs for multi-verse playback
  var _duaPlaylistIdx = 0;

  function _buildPlaylist(catId, entryIdx, ref) {
    var key = catId + ":" + entryIdx;
    if (DUA_MULTI_AUDIO[key]) {
      var m = DUA_MULTI_AUDIO[key];
      var urls = [];
      for (var v = m[1]; v <= m[2]; v++) urls.push(_everyAyahUrl(m[0], v));
      return urls;
    }
    var url = getDuaAudioUrl(catId, entryIdx, ref);
    return url ? [url] : null;
  }

  function _playTrack(idx, btn) {
    if (!_duaPlaylist || idx >= _duaPlaylist.length) {
      duaAudioCurrentKey = null;
      updateDuaAudioBtn(btn, false);
      return;
    }
    _duaPlaylistIdx = idx;
    duaAudio = new Audio(_duaPlaylist[idx]);
    duaAudio.addEventListener("ended", function() { _playTrack(idx + 1, btn); });
    duaAudio.addEventListener("error", function() {
      duaAudioCurrentKey = null;
      updateDuaAudioBtn(btn, false);
    });
    duaAudio.play().catch(function() {
      duaAudioCurrentKey = null;
      updateDuaAudioBtn(btn, false);
    });
  }

  var _duaActiveBtn = null; // track current playing button globally

  function playDuaAudio(catId, entryIdx, ref, btn) {
    var key = catId + ":" + entryIdx;
    var urls = _buildPlaylist(catId, entryIdx, ref);
    if (!urls || !urls.length) return;
    // Toggle pause/resume for same entry
    if (duaAudioCurrentKey === key && duaAudio) {
      if (!duaAudio.paused) {
        duaAudio.pause();
        updateDuaAudioBtn(btn, false);
        return;
      } else {
        duaAudio.play();
        updateDuaAudioBtn(btn, true);
        return;
      }
    }
    stopDuaAudio();
    if (typeof stopAudio === "function") stopAudio();
    duaAudioCurrentKey = key;
    _duaActiveBtn = btn;
    _duaPlaylist = urls;
    // Create a fresh Audio to avoid cache corruption & listener accumulation
    var url = urls.length === 1 && duaPreloadCache[key] ? duaPreloadCache[key].src : urls[0];
    if (urls.length === 1) {
      duaAudio = new Audio(url);
      duaAudio.addEventListener("ended", function() {
        duaAudioCurrentKey = null;
        if (_duaActiveBtn) updateDuaAudioBtn(_duaActiveBtn, false);
        _duaActiveBtn = null;
      });
      duaAudio.addEventListener("error", function() {
        duaAudioCurrentKey = null;
        if (_duaActiveBtn) updateDuaAudioBtn(_duaActiveBtn, false);
        _duaActiveBtn = null;
      });
      duaAudio.play().then(function() {
        updateDuaAudioBtn(btn, true);
      }).catch(function() {
        duaAudioCurrentKey = null;
        updateDuaAudioBtn(btn, false);
        _duaActiveBtn = null;
      });
    } else {
      // Multi-track: play sequentially
      updateDuaAudioBtn(btn, true);
      _playTrack(0, btn);
    }
  }

  function stopDuaAudio() {
    if (duaAudio) {
      duaAudio.pause();
      duaAudio.removeAttribute("src");
      duaAudio.load();
      duaAudio = null;
    }
    duaAudioCurrentKey = null;
    _duaActiveBtn = null;
    var btns = document.querySelectorAll(".dua-play-btn");
    for (var i = 0; i < btns.length; i++) updateDuaAudioBtn(btns[i], false);
  }

  function updateDuaAudioBtn(btn, isPlaying) {
    if (!btn) return;
    var svg = btn.querySelector("svg");
    if (!svg) return;
    if (isPlaying) {
      btn.classList.add("dua-playing");
      svg.innerHTML = '<rect x="7" y="6" width="3" height="12" rx="1" fill="currentColor"/><rect x="14" y="6" width="3" height="12" rx="1" fill="currentColor"/>';
    } else {
      btn.classList.remove("dua-playing");
      svg.innerHTML = '<polygon points="9 6 19 12 9 18" fill="currentColor"/>';
    }
  }

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
        {type:"dua",ref:"Al-Baqarah 2:255 — Sahîh Al-Kalim At-Tayyib n° 22",ar:"اللهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ وَلاَ يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",ph:"Allahu la ilaha illa Huwa, al-Hayyul-Qayyum. La ta'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa'u 'indahu illa bi-idhnih. Ya'lamu ma bayna aydihim wa ma khalfahum. Wa la yuhituna bi-shay'in min 'ilmihi illa bi ma sha'. Wasi'a Kursiyyuhus-samawati wal-ard. Wa la ya'uduhu hifdhuhuma wa Huwal-'Aliyyul-'Adhim.",fr:"Allah ! Point de divinité digne d'adoration à part Lui, le Vivant, Celui qui n'a besoin de rien et dont toute chose dépend. Ni somnolence ni sommeil ne Le saisissent. Lui appartient tout ce qui est dans les cieux et sur terre. Qui peut intercéder auprès de Lui sans Sa permission ? Il sait ce qui est devant eux et derrière eux. Ils n'embrassent de Sa science que ce qu'Il veut. Son Trône s'étend sur les cieux et la terre dont la garde ne Lui pèse aucunement. Il est le Très-Haut, le Très-Grand.",reward:"Celui qui la récite le matin sera protégé contre les djinns jusqu\u2019au soir, et celui qui la récite le soir sera protégé jusqu\u2019au matin."},
        {type:"verset",ref:"Sourate 112 (Al-Ikhlas) — 3 fois — Sahîh At-Tirmidhî n° 3575",ar:"قُلْ هُوَ اللهُ أَحَدٌ ۞ اللهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",ph:"Qul Huwa Allahu Ahad. Allahus-Samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.",fr:"Dis : Il est Allah, Unique ۞ Allah, le Seul à être imploré et dont tout le monde dépend ۞ Il n'a pas engendré et n'a pas été engendré ۞ Et nul n'est égal à Lui. (3 fois)",reward:"Récitées 3 fois le matin et le soir, ces trois sourates (Al-Ikhlas, Al-Falaq, An-Nas) te suffiront contre toute chose."},
        {type:"verset",ref:"Sourate 113 (Al-Falaq) — 3 fois — Sahîh At-Tirmidhî n° 3575",ar:"قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِنْ شَرِّ مَا خَلَقَ ۞ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۞ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",ph:"Qul a'udhu bi Rabbil-Falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-'uqad. Wa min sharri hasidin idha hasad.",fr:"Dis : Je cherche protection auprès du Seigneur de l'aube naissante ۞ Contre le mal de ce qu'Il a créé ۞ Contre le mal de l'obscurité quand elle s'étend ۞ Contre le mal des souffleuses dans les nœuds ۞ Et contre le mal de l'envieux quand il envie. (3 fois)",reward:"Protection contre la sorcellerie, le mauvais œil et tout mal. Le Prophète ﷺ les récitait chaque nuit en soufflant dans ses mains."},
        {type:"verset",ref:"Sourate 114 (An-Nas) — 3 fois — Sahîh At-Tirmidhî n° 3575",ar:"قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلَهِ النَّاسِ ۞ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۞ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۞ مِنَ الْجِنَّةِ وَالنَّاسِ",ph:"Qul a'udhu bi Rabbin-Nas. Malikin-Nas. Ilahin-Nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fi sudurin-nas. Minal-jinnati wan-nas.",fr:"Dis : Je cherche protection auprès du Seigneur des hommes ۞ Le Souverain des hommes ۞ La divinité des hommes ۞ Contre le mal du tentateur sournois ۞ Qui murmure dans les poitrines des hommes ۞ Qu'il soit parmi les djinns ou les hommes. (3 fois)",reward:"Protection contre les insufflations de Satan et ses murmures. Avec Al-Falaq et Al-Ikhlas, elles forment le bouclier complet du croyant."},
        {type:"dua",ref:"Sahîh At-Tirmidhî n° 3388 — 3 fois",ar:"بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",ph:"Bismillahi alladhi la yadurru ma'a ismihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim.",fr:"Au nom d'Allah, tel qu'en compagnie de Son Nom rien sur Terre ni au ciel ne peut nuire, Lui l'Audient, l'Omniscient. (3 fois)",reward:"Celui qui la récite 3 fois le matin, rien ne lui nuira jusqu\u2019au soir, et celui qui la récite 3 fois le soir, rien ne lui nuira jusqu\u2019au matin."},
        {type:"dua",ref:"As-Sahîhah n° 262",ar:"اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",ph:"Allahumma bika asbahna wa bika amsayna, wa bika nahya wa bika namutu wa ilaykan-nushur.",fr:"Ô Allah ! C'est par Toi que nous nous retrouvons au matin et c'est par Toi que nous nous retrouvons au soir ; c'est par Toi que nous vivons, c'est par Toi que nous mourons, et c'est vers Toi que sera la résurrection.",reward:"Renouvellement quotidien du lien avec Allah : reconnaître que chaque instant de vie et de mort Lui appartient. Le Prophète ﷺ ne manquait jamais de la réciter."},
        {type:"dua",ref:"Sahîh Muslim n° 2723",ar:"أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ للهِ وَالْحَمْدُ للهِ لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ وَأَعُوذُ بِكَ مِنْ شَرِّ هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",ph:"Asbahna wa asbahal-mulku lillahi wal-hamdu lillah. La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in Qadir. Rabbi as'aluka khayra ma fi hadhal-yawmi wa khayra ma ba'dahu, wa a'udhu bika min sharri hadhal-yawmi wa sharri ma ba'dah. Rabbi a'udhu bika minal-kasali wa su'il-kibar. Rabbi a'udhu bika min 'adhabin fin-nari wa 'adhabin fil-qabr.",fr:"Nous voilà au matin et le règne appartient à Allah. Louange à Allah. Il n'y a aucune divinité digne d'adoration en dehors d'Allah, Seul, sans associé. À Lui le règne et à Lui la louange. Il est Omnipotent. Ô mon Seigneur ! Je Te demande le bien de ce jour et le bien de ce qui vient après. Je cherche Ta protection contre le mal de ce jour et de ce qui vient après. Mon Seigneur, je cherche Ta protection contre la paresse et la déchéance de la vieillesse. Mon Seigneur, je cherche Ta protection contre le châtiment du Feu et contre le châtiment de la tombe.",reward:"Invocation complète qui combine le tawhid, la demande du bien de la journée et la protection contre le châtiment de la tombe et de l\u2019Enfer."},
        {type:"dua",ref:"Sahîh Al-Jâmi' n° 352",ar:"أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ للهِ رَبِّ الْعَالَمِينَ اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ فَتْحَهُ وَنَصْرَهُ وَنُورَهُ وَبَرَكَتَهُ وَهُدَاهُ وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ",ph:"Asbahna wa asbahal-mulku lillahi Rabbil-'alamin. Allahumma inni as'aluka khayra hadhal-yawm, fat-hahu wa nasrahu wa nurahu wa barakatahu wa hudahu, wa a'udhu bika min sharri ma fihi wa sharri ma ba'dah.",fr:"Nous voilà au matin et la royauté appartient à Allah, le Seigneur de l'Univers. Ô Allah ! Je Te demande le bien de ce jour : ses conquêtes, ses victoires, sa lumière, sa bénédiction et sa guidée. Et je cherche Ta protection contre le mal de ce qui se trouve en ce jour et le mal de ce qui vient après lui.",reward:"Demande de 5 bénédictions pour la journée : la conquête, la victoire, la lumière, la baraka et la guidée. Une ouverture complète de la journée sur le bien."},
        {type:"dua",ref:"Sahîh Al-Bukhârî n° 5947 — Sayyid al-Istighfar",ar:"اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ",ph:"Allahumma Anta Rabbi la ilaha illa Ant. Khalaqtani wa ana 'abduk, wa ana 'ala 'ahdika wa wa'dika mastata't. A'udhu bika min sharri ma sana't. Abu'u laka bi ni'matika 'alayya wa abu'u bi dhanbi, faghfir li fa innahu la yaghfirudh-dhunuba illa Ant.",fr:"Ô Allah ! Tu es mon Seigneur. Il n'y a aucune divinité digne d'adoration en dehors de Toi. Tu m'as créé et je suis Ton serviteur. Je m'en tiens à Ton pacte et à Ta promesse autant que je le peux. Je cherche Ta protection contre le mal de ce que j'ai commis. Je reconnais Tes bienfaits sur moi et je reconnais mes péchés ; pardonne-moi, car nul ne pardonne les péchés en dehors de Toi.",reward:"La meilleure formule de demande de pardon (Sayyid al-Istighfar). Celui qui la dit le matin avec conviction et meurt dans la journée sera parmi les gens du Paradis."},
        {type:"dua",ref:"Sahîh Abu Dawud n° 5074",ar:"اللَّهُمَّ إِنِّي أَسْأَلُكَ العَافِيةَ فِي الدُّنْيَا وَ الآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ العَفْوَ وَ العَافِيةَ فِي دِينِي وَ دُنْيَايَ وَ أَهْلِي وَ مَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَ آمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَ مِنْ خَلْفِي وَ عَنْ يَمِينِي وَ عَنْ شِمَالِي، وَ مِنْ فَوْقِي، وَ أَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي",ph:"Allâhumma innî as'aluka-l-'âfiyata fi-d-dunyâ wa-l-âkhirah. Allâhumma innî as'aluka-l-'afwa wa-l-'âfiyata fî dînî, wa dunyâya, wa ahlî, wa mâlî. Allâhumma stur 'awrâtî, wa âmin raw'âtî. Allâhumma hfadhnî min bayni yadayya, wa min khalfî, wa 'an yamînî, wa 'an shimâlî, wa min fawqî. Wa a'ûdhu bi-'adhamatika an ughtâla min tahtî.",fr:"Ô Allah ! Je Te demande le salut dans cette vie et dans l'au-delà. Ô Allah ! Je Te demande le pardon et le salut dans ma religion, ma vie, ma famille et mes biens. Ô Allah ! Cache mes défauts et mets-moi à l'abri de toutes mes craintes. Ô Allah ! Protège-moi par devant, par derrière, sur ma droite, sur ma gauche et au-dessus de moi. Je me mets sous la protection de Ta grandeur pour ne pas être enseveli.",reward:"Le Prophète ﷺ ne manquait jamais de réciter cette invocation. Elle demande la protection des 6 directions et la préservation dans la religion, la famille et les biens."},
        {type:"dua",ref:"Sahîh Al-Hâkim n° 1/545",ar:"يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَ لاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",ph:"Yâ Hayyû yâ Qayyûmu bi-rahmatika astaghîth. Aslih lî sha'nî kullah, wa lâ takilnî ilâ nafsî tarfata 'ayn.",fr:"Ô Toi le Vivant, Celui qui n'a besoin de rien et dont toute chose dépend, j'implore secours auprès de Ta miséricorde. Améliore ma situation en tout point et ne me laisse pas à mon propre sort ne serait-ce le temps d'un clin d'œil.",reward:"Invocation par les deux plus grands Noms d\u2019Allah (Al-Hayy, Al-Qayyum). Allah améliore toutes les affaires de celui qui la prononce et ne le laisse pas à lui-même."},
        {type:"dua",ref:"Sahîh At-Tirmidhî n° 3392",ar:"اللَّهُمَّ عَالِمَ الغَيْبِ وَ الشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَ الأَرْضِ رَبَّ كُلِّ شَيْءٍ وَ مَلِيكَهُ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَ مِنْ شَرِّ الشَّيْطَانِ وَ شِرْكِهِ، وَ أَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ",ph:"Allâhumma 'Âlima-l-ghaybi wa-sh-shahâdah, Fâtira-s-samâwâti wa-l-ard, Rabba kulli shay'in wa Malîkah. Ash-hadu an lâ ilâha illâ ant. A'ûdhu bika min sharri nafsî, wa min sharri-sh-shaytâni wa shirkih, wa an aqtarifa 'alâ nafsî sû'an aw ajurrahu ilâ muslim.",fr:"Ô Allah ! Connaisseur de l'invisible et de l'apparent, Créateur des cieux et de la Terre, Seigneur et Possesseur de toute chose, j'atteste qu'il n'y a aucune divinité digne d'adoration en dehors de Toi, je cherche refuge auprès de Toi contre le mal de mon âme, contre le mal de Satan et de son polythéisme et contre le fait de me faire du mal à moi-même ou d'en faire à un musulman.",reward:"Le Prophète ﷺ a ordonné à Abu Bakr as-Siddîq de la réciter matin et soir. Elle protège contre le mal de son propre ego et contre Satan."},
        {type:"dua",ref:"Sahîh Muslim n° 2692 — 10 fois",ar:"لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",ph:"La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in Qadir.",fr:"Nulle divinité digne d'adoration excepté Allah, Seul sans associé. À Lui le royaume, à Lui la louange et Il est Omnipotent. (10 fois)",reward:"10 fois le matin : équivalent de l\u2019affranchissement de 4 esclaves parmi les descendants d\u2019Ismaïl, 10 bonnes actions inscrites, 10 péchés effacés, 10 degrés élevés, et protection contre Satan jusqu\u2019au soir."},
        {type:"dua",ref:"Sahîh Muslim n° 2691 — 100 fois",ar:"سُبْحَانَ اللهِ وَبِحَمْدِهِ",ph:"SubhanAllahi wa bihamdih.",fr:"Gloire à Allah et louange à Lui. (100 fois le matin : efface les péchés même s'ils égalaient l'écume de la mer)",reward:"100 fois par jour : ses péchés seront effacés même s\u2019ils étaient aussi nombreux que l\u2019écume de la mer. Ce sont deux paroles légères sur la langue, lourdes dans la balance, aimées du Tout-Miséricordieux."},
        {type:"dua",ref:"Abu Dawud 5069",ar:"اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لاَ شَرِيكَ لَكَ فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",ph:"Allahumma ma asbaha bi min ni'matin aw bi ahadin min khalqika faminka wahdaka la sharika lak, falakal-hamdu wa lakash-shukr.",fr:"Ô Allah, tout bienfait qui m'atteint ce matin ou atteint l'une de Tes créatures vient de Toi Seul, sans associé. À Toi la louange et à Toi la gratitude.",reward:"Celui qui la dit le matin a accompli le devoir de gratitude de sa journée, et celui qui la dit le soir a accompli le devoir de gratitude de sa nuit."},
        {type:"dua",ref:"Sahîh At-Tirmidhî n° 3474 — 10 fois",ar:"لاَ إِلَهَ إِلاَّ اللهُ، وَحْدَهُ لاَشَرِيكَ لَهُ، لَهُ المُلْكُ وَ لَهُ الحَمْدُ، يُحْيِي وَ يُمِيتُ وَ هُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",ph:"Lâ ilâha illa-llâhu wahdahu lâ sharîka lah. Lahu-l-mulku wa lahu-l-hamd, yuhyî wa yumît, wa huwa 'alâ kulli shay'in Qadîr.",fr:"Il n'y a aucune divinité digne d'adoration en dehors d'Allah, Seul, sans associé. À Lui la royauté, à Lui la louange, Il donne la vie et la mort et Il est capable de toute chose. (10 fois)",reward:"10 fois après le Fajr : 10 bonnes actions inscrites, 10 péchés effacés, 10 degrés élevés, protection contre tout mal et contre Satan toute la journée."},
        {type:"dua",ref:"Ahmad 3/406 — Sahîh Al-Jâmi' n° 4674",ar:"أَصْبَحْنَا عَلَى فِطْرَةِ الإِسْلاَمِ وَعَلَى كَلِمَةِ الإِخْلاَصِ وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ",ph:"Asbahna 'ala fitratil-Islam, wa 'ala kalimatil-ikhlas, wa 'ala dini nabiyyina Muhammadin ﷺ, wa 'ala millati abina Ibrahima, hanifan musliman, wa ma kana minal-mushrikin.",fr:"Nous nous retrouvons au matin sur la nature première de l'Islam, sur la parole de sincérité, sur la religion de notre Prophète Muhammad ﷺ, et sur la voie de notre père Ibrahim, monothéiste et soumis, et il n'était pas du nombre des associateurs.",reward:"Réaffirmation de l\u2019identité musulmane chaque matin : ancrage dans la fitra (nature première), le tawhid et la voie prophétique. Elle renforce la foi au début de chaque journée."},
        {type:"dua",ref:"Sahîh Muslim n° 2709 — 3 fois",ar:"أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",ph:"A'udhu bi kalimati Allahit-tammati min sharri ma khalaq.",fr:"Je me mets sous la protection des paroles parfaites d'Allah contre le mal de ce qu'Il a créé. (3 fois)",reward:"Celui qui la récite 3 fois le soir, aucune piqûre venimeuse ne lui nuira cette nuit-là. Elle constitue une protection contre tout mal créé."},
        {type:"dua",ref:"Sahîh Abu Dawud n° 5072 — 3 fois",ar:"رَضِيتُ بِاللهِ رَبًّا وَبِالإِسْلاَمِ دِينًا وَبِمُحَمَّدٍ ﷺ نَبِيًّا",ph:"Raditu billahi Rabba, wa bil-Islami dina, wa bi Muhammadin ﷺ nabiyya.",fr:"J'ai agréé Allah comme Seigneur, l'Islam comme religion et Muhammad ﷺ comme Prophète. (3 fois)",reward:"Celui qui la dit 3 fois le matin et 3 fois le soir, c\u2019est un droit sur Allah de le satisfaire le Jour du Jugement."},
        {type:"dua",ref:"Sahîh Muslim n° 2726 — 3 fois",ar:"سُبْحَانَ اللهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ",ph:"SubhanAllahi wa bihamdihi, 'adada khalqihi, wa rida nafsihi, wa zinata 'arshihi, wa midada kalimatih.",fr:"Gloire à Allah et louange à Lui, autant que le nombre de Ses créatures, autant qu'Il agrée, autant que pèse Son Trône et autant que l'encre de Ses paroles. (3 fois)",reward:"Le Prophète ﷺ a dit à Juwayriyah que ces paroles, dites 3 fois, surpassent en récompense tout le dhikr qu\u2019elle avait fait depuis le matin."},
        {type:"dua",ref:"Sahîh Ibn Mâjah n° 925 — après le Fajr",ar:"اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلاً مُتَقَبَّلاً",ph:"Allahumma inni as'aluka 'ilman nafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan.",fr:"Ô Allah ! Je Te demande une science utile, une subsistance bonne et licite, et des œuvres agréées.",reward:"Invocation que le Prophète ﷺ faisait après la prière du Fajr. Elle réunit les 3 piliers d\u2019une journée bénie : le savoir, la subsistance licite et les œuvres acceptées."},
        {type:"dua",ref:"Sahîh Al-Bukhârî n° 6307 — Sahîh Muslim n° 2702 — 100 fois",ar:"أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ",ph:"Astaghfirullaha wa atubu ilayh.",fr:"Je demande pardon à Allah et je me repens à Lui. (100 fois par jour)",reward:"Le Prophète ﷺ demandait pardon à Allah plus de 100 fois par jour. L\u2019istighfar ouvre les portes de la subsistance, dissipe les soucis et offre une issue à toute difficulté."}
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
        {type:"dua",ref:"Al-Baqarah 2:255 — Sahîh Al-Kalim At-Tayyib n° 22",ar:"اللهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضَ وَلاَ يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",ph:"Allahu la ilaha illa Huwa, al-Hayyul-Qayyum. La ta'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa'u 'indahu illa bi-idhnih. Ya'lamu ma bayna aydihim wa ma khalfahum. Wa la yuhituna bi-shay'in min 'ilmihi illa bi ma sha'. Wasi'a Kursiyyuhus-samawati wal-ard. Wa la ya'uduhu hifdhuhuma wa Huwal-'Aliyyul-'Adhim.",fr:"Allah ! Point de divinité digne d'adoration à part Lui, le Vivant, Celui qui n'a besoin de rien et dont toute chose dépend. Ni somnolence ni sommeil ne Le saisissent. Lui appartient tout ce qui est dans les cieux et sur terre. Qui peut intercéder auprès de Lui sans Sa permission ? Il sait ce qui est devant eux et derrière eux. Ils n'embrassent de Sa science que ce qu'Il veut. Son Trône s'étend sur les cieux et la terre dont la garde ne Lui pèse aucunement. Il est le Très-Haut, le Très-Grand.",reward:"Celui qui la récite le soir sera protégé par Allah contre les djinns et les démons jusqu'au matin."},
        {type:"verset",ref:"Sourate 112 (Al-Ikhlas) — 3 fois — Sahîh At-Tirmidhî n° 3575",ar:"قُلْ هُوَ اللهُ أَحَدٌ ۞ اللهُ الصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",ph:"Qul Huwa Allahu Ahad. Allahus-Samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.",fr:"Dis : Il est Allah, Unique ۞ Allah, le Seul à être imploré et dont tout le monde dépend ۞ Il n'a pas engendré et n'a pas été engendré ۞ Et nul n'est égal à Lui. (3 fois)",reward:"Les trois dernières sourates récitées 3 fois matin et soir suffisent comme protection contre tout mal."},
        {type:"verset",ref:"Sourate 113 (Al-Falaq) — 3 fois — Sahîh At-Tirmidhî n° 3575",ar:"قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۞ مِنْ شَرِّ مَا خَلَقَ ۞ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۞ وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",ph:"Qul a'udhu bi Rabbil-Falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-'uqad. Wa min sharri hasidin idha hasad.",fr:"Dis : Je cherche protection auprès du Seigneur de l'aube naissante ۞ Contre le mal de ce qu'Il a créé ۞ Contre le mal de l'obscurité quand elle s'étend ۞ Contre le mal des souffleuses dans les nœuds ۞ Et contre le mal de l'envieux quand il envie. (3 fois)",reward:"Protection contre la sorcellerie, le mauvais œil et tout mal. Le Prophète ﷺ les récitait chaque soir en soufflant dans ses mains."},
        {type:"verset",ref:"Sourate 114 (An-Nas) — 3 fois — Sahîh At-Tirmidhî n° 3575",ar:"قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۞ مَلِكِ النَّاسِ ۞ إِلَهِ النَّاسِ ۞ مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۞ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۞ مِنَ الْجِنَّةِ وَالنَّاسِ",ph:"Qul a'udhu bi Rabbin-Nas. Malikin-Nas. Ilahin-Nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fi sudurin-nas. Minal-jinnati wan-nas.",fr:"Dis : Je cherche protection auprès du Seigneur des hommes ۞ Le Souverain des hommes ۞ La divinité des hommes ۞ Contre le mal du tentateur sournois ۞ Qui murmure dans les poitrines des hommes ۞ Qu'il soit parmi les djinns ou les hommes. (3 fois)",reward:"Protection contre les chuchotements de Satan et les tentations des djinns et des hommes."},
        {type:"dua",ref:"Sahîh At-Tirmidhî n° 3388 — 3 fois",ar:"بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",ph:"Bismillahi alladhi la yadurru ma'a ismihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim.",fr:"Au nom d'Allah, tel qu'en compagnie de Son Nom rien sur Terre ni au ciel ne peut nuire, Lui l'Audient, l'Omniscient. (3 fois)",reward:"Celui qui la récite 3 fois le soir ne sera frappé par aucune calamité soudaine jusqu'au matin."},
        {type:"dua",ref:"Sahîh Muslim n° 2709 — 3 fois",ar:"أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",ph:"A'udhu bi kalimati Allahit-tammati min sharri ma khalaq.",fr:"Je me mets sous la protection des paroles parfaites d'Allah contre le mal de ce qu'Il a créé. (3 fois)",reward:"Celui qui la récite 3 fois le soir, aucune piqûre venimeuse ne lui nuira cette nuit-là."},
        {type:"dua",ref:"As-Sahîhah n° 262",ar:"اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",ph:"Allahumma bika amsayna wa bika asbahna, wa bika nahya wa bika namutu wa ilaykal-masir.",fr:"Ô Allah ! C'est par Toi que nous nous retrouvons au soir et c'est par Toi que nous nous retrouvons au matin ; c'est par Toi que nous vivons, c'est par Toi que nous mourons, et c'est vers Toi que sera le retour.",reward:"Reconnaissance envers Allah pour le bienfait de la vie et du temps. Elle rappelle au croyant sa dépendance totale envers son Seigneur."},
        {type:"dua",ref:"Sahîh Muslim n° 2723",ar:"أَمْسَيْنَا وَأَمْسَى الْمُلْكُ للهِ وَالْحَمْدُ للهِ لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا وَأَعُوذُ بِكَ مِنْ شَرِّ هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",ph:"Amsayna wa amsal-mulku lillahi wal-hamdu lillah. La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in Qadir. Rabbi as'aluka khayra ma fi hadhihil-laylati wa khayra ma ba'daha, wa a'udhu bika min sharri hadhihil-laylati wa sharri ma ba'daha. Rabbi a'udhu bika minal-kasali wa su'il-kibar. Rabbi a'udhu bika min 'adhabin fin-nari wa 'adhabin fil-qabr.",fr:"Nous voilà au soir et le règne appartient à Allah. Louange à Allah. Il n'y a aucune divinité digne d'adoration en dehors d'Allah, Seul, sans associé. À Lui le règne et à Lui la louange. Il est Omnipotent. Ô mon Seigneur ! Je Te demande le bien de cette nuit et le bien de ce qui vient après. Je cherche Ta protection contre le mal de cette nuit et de ce qui vient après. Mon Seigneur, je cherche Ta protection contre la paresse et la déchéance de la vieillesse. Mon Seigneur, je cherche Ta protection contre le châtiment du Feu et contre le châtiment de la tombe.",reward:"Invocation complète du soir qui rassemble le tawhid, la demande du bien et la protection contre tout mal de la nuit."},
        {type:"dua",ref:"Sahîh Al-Bukhârî n° 5947 — Sayyid al-Istighfar",ar:"اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ",ph:"Allahumma Anta Rabbi la ilaha illa Ant. Khalaqtani wa ana 'abduk, wa ana 'ala 'ahdika wa wa'dika mastata't. A'udhu bika min sharri ma sana't. Abu'u laka bi ni'matika 'alayya wa abu'u bi dhanbi, faghfir li fa innahu la yaghfirudh-dhunuba illa Ant.",fr:"Ô Allah ! Tu es mon Seigneur. Il n'y a aucune divinité digne d'adoration en dehors de Toi. Tu m'as créé et je suis Ton serviteur. Je m'en tiens à Ton pacte et à Ta promesse autant que je le peux. Je cherche Ta protection contre le mal de ce que j'ai commis. Je reconnais Tes bienfaits sur moi et je reconnais mes péchés ; pardonne-moi, car nul ne pardonne les péchés en dehors de Toi.",reward:"Le maître de l'istighfar : celui qui la dit le soir avec conviction et meurt cette nuit-là entrera au Paradis."},
        {type:"dua",ref:"Sahîh Muslim n° 2692 — 10 fois",ar:"لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",ph:"La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in Qadir.",fr:"Nulle divinité digne d'adoration excepté Allah, Seul sans associé. À Lui le royaume, à Lui la louange et Il est Omnipotent. (10 fois)",reward:"Celui qui la dit 10 fois le soir obtient la récompense de l'affranchissement de 4 esclaves de la descendance d'Ismaël."},
        {type:"dua",ref:"Sahîh Muslim n° 2691 — 100 fois",ar:"سُبْحَانَ اللهِ وَبِحَمْدِهِ",ph:"SubhanAllahi wa bihamdih.",fr:"Gloire à Allah et louange à Lui. (100 fois le soir : efface les péchés même s'ils égalaient l'écume de la mer)",reward:"Celui qui la dit 100 fois le soir voit ses péchés effacés même s'ils étaient aussi nombreux que l'écume de la mer."},
        {type:"dua",ref:"Abu Dawud 5069",ar:"اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لاَ شَرِيكَ لَكَ فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",ph:"Allahumma ma amsa bi min ni'matin aw bi ahadin min khalqika faminka wahdaka la sharika lak, falakal-hamdu wa lakash-shukr.",fr:"Ô Allah, tout bienfait qui m'atteint ce soir ou atteint l'une de Tes créatures vient de Toi Seul, sans associé. À Toi la louange et à Toi la gratitude.",reward:"Celui qui la dit le soir a accompli le devoir de gratitude de cette nuit envers Allah."},
        {type:"dua",ref:"Ahmad 3/406 — Sahîh Al-Jâmi' n° 4674",ar:"أَمْسَيْنَا عَلَى فِطْرَةِ الإِسْلاَمِ وَعَلَى كَلِمَةِ الإِخْلاَصِ وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ",ph:"Amsayna 'ala fitratil-Islam, wa 'ala kalimatil-ikhlas, wa 'ala dini nabiyyina Muhammadin ﷺ, wa 'ala millati abina Ibrahima, hanifan musliman, wa ma kana minal-mushrikin.",fr:"Nous nous retrouvons au soir sur la nature première de l'Islam, sur la parole de sincérité, sur la religion de notre Prophète Muhammad ﷺ, et sur la voie de notre père Ibrahim, monothéiste et soumis, et il n'était pas du nombre des associateurs.",reward:"Réaffirmation de la fitra (nature originelle) et du tawhid chaque soir, renforçant l'attachement à l'Islam pur."},
        {type:"dua",ref:"Sahîh Abu Dawud n° 5072 — 3 fois",ar:"رَضِيتُ بِاللهِ رَبًّا وَبِالإِسْلاَمِ دِينًا وَبِمُحَمَّدٍ ﷺ نَبِيًّا",ph:"Raditu billahi Rabba, wa bil-Islami dina, wa bi Muhammadin ﷺ nabiyya.",fr:"J'ai agréé Allah comme Seigneur, l'Islam comme religion et Muhammad ﷺ comme Prophète. (3 fois)",reward:"Celui qui la dit 3 fois le soir, c'est un droit sur Allah de le satisfaire le Jour du Jugement."},
        {type:"dua",ref:"Sahîh Abu Dawud n° 5074",ar:"اللَّهُمَّ إِنِّي أَسْأَلُكَ العَافِيةَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ العَفْوَ وَالعَافِيةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي",ph:"Allahumma inni as'alukal-'afiyata fid-dunya wal-akhirah. Allahumma inni as'alukal-'afwa wal-'afiyata fi dini wa dunyaya wa ahli wa mali. Allahumma-stur 'awrati wa amin raw'ati. Allahumma-hfadhni min bayni yadayya wa min khalfi wa 'an yamini wa 'an shimali wa min fawqi, wa a'udhu bi 'adhamatika an ughtala min tahti.",fr:"Ô Allah ! Je Te demande le salut dans cette vie et dans l'au-delà. Ô Allah ! Je Te demande le pardon et le salut dans ma religion, ma vie, ma famille et mes biens. Ô Allah ! Cache mes défauts et mets-moi à l'abri de toutes mes craintes. Ô Allah ! Protège-moi par devant, par derrière, sur ma droite, sur ma gauche et au-dessus de moi. Je me mets sous la protection de Ta grandeur pour ne pas être enseveli.",reward:"Le Prophète ﷺ ne manquait jamais cette invocation matin et soir. Elle demande la protection totale de toutes les directions."},
        {type:"dua",ref:"Sahîh Al-Hâkim n° 1/545",ar:"يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",ph:"Ya Hayyu ya Qayyum, bi rahmatika astaghith. Aslih li sha'ni kullah, wa la takilni ila nafsi tarfata 'ayn.",fr:"Ô Toi le Vivant, Celui qui n'a besoin de rien et dont toute chose dépend, j'implore secours auprès de Ta miséricorde. Améliore ma situation en tout point et ne me laisse pas à mon propre sort ne serait-ce le temps d'un clin d'œil.",reward:"Invocation qui exprime le besoin absolu du serviteur envers Allah et le recours à Sa miséricorde en tout temps."},
        {type:"dua",ref:"Sahîh At-Tirmidhî n° 3392",ar:"اللَّهُمَّ عَالِمَ الغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالأَرْضِ رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ",ph:"Allahumma 'Alimal-ghaybi wash-shahadah, Fatiras-samawati wal-ard, Rabba kulli shay'in wa Malikah. Ash-hadu an la ilaha illa Ant. A'udhu bika min sharri nafsi, wa min sharrish-shaytani wa shirkih, wa an aqtarifa 'ala nafsi su'an aw ajurrahu ila muslim.",fr:"Ô Allah ! Connaisseur de l'invisible et de l'apparent, Créateur des cieux et de la Terre, Seigneur et Possesseur de toute chose, j'atteste qu'il n'y a aucune divinité digne d'adoration en dehors de Toi, je cherche refuge auprès de Toi contre le mal de mon âme, contre le mal de Satan et de son polythéisme et contre le fait de me faire du mal à moi-même ou d'en faire à un musulman.",reward:"Le Prophète ﷺ a recommandé à Abu Bakr de la dire matin et soir et au coucher. Elle protège contre le mal de l'âme et de Satan."},
        {type:"dua",ref:"Sahîh At-Tirmidhî n° 3474 — 10 fois",ar:"لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",ph:"La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, yuhyi wa yumit, wa Huwa 'ala kulli shay'in Qadir.",fr:"Il n'y a aucune divinité digne d'adoration en dehors d'Allah, Seul, sans associé. À Lui la royauté, à Lui la louange, Il donne la vie et la mort et Il est capable de toute chose. (10 fois)",reward:"Celui qui la dit 10 fois le soir aura l'équivalent de la récompense de l'affranchissement de 4 esclaves parmi les descendants d'Ismaël."},
        {type:"dua",ref:"Sahîh Muslim n° 2726 — 3 fois",ar:"سُبْحَانَ اللهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ",ph:"SubhanAllahi wa bihamdihi, 'adada khalqihi, wa rida nafsihi, wa zinata 'arshihi, wa midada kalimatih.",fr:"Gloire à Allah et louange à Lui, autant que le nombre de Ses créatures, autant qu'Il agrée, autant que pèse Son Trône et autant que l'encre de Ses paroles. (3 fois)",reward:"Ces paroles dites 3 fois surpassent en récompense tout le dhikr fait depuis le matin, comme le Prophète ﷺ l'a enseigné."},
        {type:"dua",ref:"Sahîh Al-Bukhârî n° 6307 — Sahîh Muslim n° 2702 — 100 fois",ar:"أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ",ph:"Astaghfirullaha wa atubu ilayh.",fr:"Je demande pardon à Allah et je me repens à Lui. (100 fois par jour)",reward:"Le Prophète ﷺ demandait pardon à Allah plus de 100 fois par jour. L'istighfar dissipe les soucis et offre une issue à toute difficulté."}
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
        {type:"dua",ref:"Bukhari 6314",ar:"\u0628\u0650\u0627\u0633\u0652\u0645\u0650\u0643\u064e \u0627\u0644\u0644\u0651\u064e\u0647\u064f\u0645\u0651\u064e \u0623\u064e\u0645\u064f\u0648\u062a\u064f \u0648\u064e\u0623\u064e\u062d\u0652\u064a\u064e\u0627",ph:"Bismika Allahumma amutu wa ahya.",fr:"En Ton nom, \u00f4 Allah, je meurs et je vis.",reward:"Invocation enseign\u00e9e par le Proph\u00e8te \u00e0 dire en posant la t\u00eate sur l\u2019oreiller. Le sommeil est compar\u00e9 \u00e0 une petite mort."},
        {type:"dua",ref:"Bukhari 7393",ar:"\u0627\u0644\u0644\u0651\u064e\u0647\u064f\u0645\u0651\u064e \u0625\u0650\u0646\u0651\u0650\u064a \u0623\u064e\u0633\u0652\u0644\u064e\u0645\u0652\u062a\u064f \u0646\u064e\u0641\u0652\u0633\u0650\u064a \u0625\u0650\u0644\u064e\u064a\u0652\u0643\u064e \u0648\u064e\u0641\u064e\u0648\u0651\u064e\u0636\u0652\u062a\u064f \u0623\u064e\u0645\u0652\u0631\u0650\u064a \u0625\u0650\u0644\u064e\u064a\u0652\u0643\u064e \u0648\u064e\u0648\u064e\u062c\u0651\u064e\u0647\u0652\u062a\u064f \u0648\u064e\u062c\u0652\u0647\u0650\u064a \u0625\u0650\u0644\u064e\u064a\u0652\u0643\u064e \u0648\u064e\u0623\u064e\u0644\u0652\u062c\u064e\u0623\u0652\u062a\u064f \u0638\u064e\u0647\u0652\u0631\u0650\u064a \u0625\u0650\u0644\u064e\u064a\u0652\u0643\u064e \u0631\u064e\u0647\u0652\u0628\u064e\u0629\u064b \u0648\u064e\u0631\u064e\u063a\u0652\u0628\u064e\u0629\u064b \u0625\u0650\u0644\u064e\u064a\u0652\u0643\u064e \u0644\u064e\u0627 \u0645\u064e\u0644\u0652\u062c\u064e\u0623\u064e \u0648\u064e\u0644\u064e\u0627 \u0645\u064e\u0646\u0652\u062c\u064e\u0627 \u0645\u0650\u0646\u0652\u0643\u064e \u0625\u0650\u0644\u0651\u064e\u0627 \u0625\u0650\u0644\u064e\u064a\u0652\u0643\u064e \u0627\u0644\u0644\u0651\u064e\u0647\u064f\u0645\u0651\u064e \u0622\u0645\u064e\u0646\u0652\u062a\u064f \u0628\u0650\u0643\u0650\u062a\u064e\u0627\u0628\u0650\u0643\u064e \u0627\u0644\u0651\u064e\u0630\u0650\u064a \u0623\u064e\u0646\u0652\u0632\u064e\u0644\u0652\u062a\u064e \u0648\u064e\u0628\u0650\u0646\u064e\u0628\u0650\u064a\u0651\u0650\u0643\u064e \u0627\u0644\u0651\u064e\u0630\u0650\u064a \u0623\u064e\u0631\u0652\u0633\u064e\u0644\u0652\u062a\u064e",ph:"Allahumma inni aslamtu nafsi ilayk, wa fawwadtu amri ilayk, wa wajjahtu wajhi ilayk, wa alja'tu dhahri ilayk, raghbatan wa rahbatan ilayk. La malja'a wa la manja minka illa ilayk. Allahumma amantu bi kitabikal-ladhi anzalt, wa bi nabiyyikal-ladhi arsalt.",fr:"O Allah, je me suis soumis \u00e0 Toi, je T\u2019ai confi\u00e9 mon affaire, j\u2019ai tourn\u00e9 mon visage vers Toi, j\u2019ai appuy\u00e9 mon dos contre Toi, par d\u00e9sir et par crainte de Toi. Il n\u2019y a de refuge ni d\u2019\u00e9chappatoire loin de Toi qu\u2019aupr\u00e8s de Toi. O Allah, j\u2019ai cru en Ton Livre que Tu as r\u00e9v\u00e9l\u00e9 et en Ton Proph\u00e8te que Tu as envoy\u00e9.",reward:"Le Proph\u00e8te \uFEDF a dit : si tu meurs cette nuit-l\u00e0, tu mourras sur la fitra (nature saine). Que ce soient les derni\u00e8res paroles avant de dormir."},
        {type:"dua",ref:"Abu Dawud 5051",ar:"\u0627\u0644\u0644\u0651\u064e\u0647\u064f\u0645\u0651\u064e \u0642\u0650\u0646\u0650\u064a \u0639\u064e\u0630\u064e\u0627\u0628\u064e\u0643\u064e \u064a\u064e\u0648\u0652\u0645\u064e \u062a\u064e\u0628\u0652\u0639\u064e\u062b\u064f \u0639\u0650\u0628\u064e\u0627\u062f\u064e\u0643\u064e",ph:"Allahumma qini 'adhabaka yawma tab'athu 'ibadak.",fr:"O Allah, pr\u00e9serve-moi de Ton ch\u00e2timent le jour o\u00f9 Tu ressusciteras Tes serviteurs.",reward:"Le Proph\u00e8te \uFEDF la r\u00e9citait en pla\u00e7ant sa main droite sous sa joue. Elle rappelle le Jour du Jugement avant le sommeil."},
        {type:"dua",ref:"Al-Mulk 67:1-2 (Sourate al-Mulk)",ar:"\u062a\u064e\u0628\u064e\u0627\u0631\u064e\u0643\u064e \u0627\u0644\u0651\u064e\u0630\u0650\u064a \u0628\u0650\u064a\u064e\u062f\u0650\u0647\u0650 \u0627\u0644\u0652\u0645\u064f\u0644\u0652\u0643\u064f \u0648\u064e\u0647\u064f\u0648\u064e \u0639\u064e\u0644\u064e\u0649 \u0643\u064f\u0644\u0651\u0650 \u0634\u064e\u064a\u0652\u0621\u0613 \u0642\u064e\u062f\u0650\u064a\u0631\u064c",ph:"Tabarakal-ladhi bi yadihi al-mulku wa Huwa 'ala kulli shay'in Qadir.",fr:"B\u00e9ni soit Celui dans la main de Qui est la royaut\u00e9 et qui est Omnipotent. (Lire sourate al-Mulk avant de dormir)",reward:"La sourate al-Mulk intercède pour celui qui la r\u00e9cite jusqu\u2019\u00e0 ce qu\u2019il soit pardonn\u00e9. Elle prot\u00e8ge du ch\u00e2timent de la tombe."},
        {type:"dua",ref:"Bukhari 5017",ar:"\u0627\u0644\u0644\u0651\u064e\u0647\u064f\u0645\u0651\u064e \u0631\u064e\u0628\u0651\u064e \u0627\u0644\u0633\u0651\u064e\u0645\u064e\u0627\u0648\u064e\u0627\u062a\u0650 \u0627\u0644\u0633\u0651\u064e\u0628\u0652\u0639\u0650 \u0648\u064e\u0631\u064e\u0628\u0651\u064e \u0627\u0644\u0652\u0639\u064e\u0631\u0652\u0634\u0650 \u0627\u0644\u0652\u0639\u064e\u0638\u0650\u064a\u0645\u0650 \u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0648\u064e\u0631\u064e\u0628\u0651\u064e \u0643\u064f\u0644\u0651\u0650 \u0634\u064e\u064a\u0652\u0621\u0613 \u0641\u064e\u0627\u0644\u0650\u0642\u064e \u0627\u0644\u0652\u062d\u064e\u0628\u0651\u0650 \u0648\u064e\u0627\u0644\u0646\u0651\u064e\u0648\u064e\u0649 \u0645\u064f\u0646\u064e\u0632\u0651\u0650\u0644\u064e \u0627\u0644\u062a\u0651\u064e\u0648\u0652\u0631\u064e\u0627\u0629\u0650 \u0648\u064e\u0627\u0644\u0652\u0625\u0650\u0646\u0652\u062c\u0650\u064a\u0644\u0650 \u0648\u064e\u0627\u0644\u0652\u0641\u064f\u0631\u0652\u0642\u064e\u0627\u0646\u0650 \u0623\u064e\u0639\u064f\u0648\u0630\u064f \u0628\u0650\u0643\u064e \u0645\u0650\u0646\u0652 \u0634\u064e\u0631\u0651\u0650 \u0643\u064f\u0644\u0651\u0650 \u0634\u064e\u064a\u0652\u0621\u0613 \u0623\u064e\u0646\u0652\u062a\u064e \u0622\u062e\u0650\u0630\u064c \u0628\u0650\u0646\u064e\u0627\u0635\u0650\u064a\u064e\u062a\u0650\u0647\u0650 \u0627\u0644\u0644\u0651\u064e\u0647\u064f\u0645\u0651\u064e \u0623\u064e\u0646\u0652\u062a\u064e \u0627\u0644\u0652\u0623\u064e\u0648\u0651\u064e\u0644\u064f \u0641\u064e\u0644\u064e\u064a\u0652\u0633\u064e \u0642\u064e\u0628\u0652\u0644\u064e\u0643\u064e \u0634\u064e\u064a\u0652\u0621\u064c \u0648\u064e\u0623\u064e\u0646\u0652\u062a\u064e \u0627\u0644\u0652\u0622\u062e\u0650\u0631\u064f \u0641\u064e\u0644\u064e\u064a\u0652\u0633\u064e \u0628\u064e\u0639\u0652\u062f\u064e\u0643\u064e \u0634\u064e\u064a\u0652\u0621\u064c \u0648\u064e\u0623\u064e\u0646\u0652\u062a\u064e \u0627\u0644\u0638\u0651\u064e\u0627\u0647\u0650\u0631\u064f \u0641\u064e\u0644\u064e\u064a\u0652\u0633\u064e \u0641\u064e\u0648\u0652\u0642\u064e\u0643\u064e \u0634\u064e\u064a\u0652\u0621\u064c \u0648\u064e\u0623\u064e\u0646\u0652\u062a\u064e \u0627\u0644\u0652\u0628\u064e\u0627\u0637\u0650\u0646\u064f \u0641\u064e\u0644\u064e\u064a\u0652\u0633\u064e \u062f\u064f\u0648\u0646\u064e\u0643\u064e \u0634\u064e\u064a\u0652\u0621\u064c \u0627\u0642\u0652\u0636\u0650 \u0639\u064e\u0646\u0651\u064e\u0627 \u0627\u0644\u062f\u0651\u064e\u064a\u0652\u0646\u064e \u0648\u064e\u0623\u064e\u063a\u0652\u0646\u0650\u0646\u064e\u0627 \u0645\u0650\u0646\u064e \u0627\u0644\u0652\u0641\u064e\u0642\u0652\u0631\u0650",ph:"Allahumma Rabbas-samawatis-sab'i wa Rabbal-'Arshil-'Adhim. Rabbana wa Rabba kulli shay'in, faliqal-habbi wan-nawa, munazzilat-Tawrati wal-Injili wal-Furqan. A'udhu bika min sharri kulli shay'in Anta akhidhun bi nasiyatih. Allahumma Antal-Awwalu falaysa qablaka shay', wa Antal-Akhiru falaysa ba'daka shay', wa Antadh-Dhahiru falaysa fawqaka shay', wa Antal-Batinu falaysa dunaka shay'. Iqdi 'annad-dayna wa aghnina minal-faqr.",fr:"O Allah, Seigneur des sept cieux et du Tr\u00f4ne immense, notre Seigneur et le Seigneur de toute chose, Celui qui fend la graine et le noyau, qui a r\u00e9v\u00e9l\u00e9 la Torah, l\u2019\u00c9vangile et le Coran. Je cherche refuge aupr\u00e8s de Toi contre le mal de toute chose dont Tu tiens le toupet. O Allah, Tu es le Premier, rien n\u2019est avant Toi, Tu es le Dernier, rien n\u2019est apr\u00e8s Toi, Tu es l\u2019Apparent, rien n\u2019est au-dessus de Toi, Tu es le Cach\u00e9, rien n\u2019est en dessous de Toi. R\u00e8gle notre dette et enrichis-nous contre la pauvret\u00e9.",reward:"Invocation compl\u00e8te du coucher mentionnant les Noms sublimes d\u2019Allah. Elle demande la protection et le r\u00e8glement des dettes."},
        {type:"dua",ref:"Muslim 2712 (Tasbi7 avant le sommeil)",ar:"\u0633\u064f\u0628\u0652\u062d\u064e\u0627\u0646\u064e \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \u0663\u0663 \u0648\u064e\u0627\u0644\u0652\u062d\u064e\u0645\u0652\u062f\u064f \u0644\u0650\u0644\u0644\u0651\u064e\u0647\u0650 \u0663\u0663 \u0648\u064e\u0627\u0644\u0644\u0651\u064e\u0647\u064f \u0623\u064e\u0643\u0652\u0628\u064e\u0631\u064f \u0663\u0664",ph:"SubhanAllah (33), Alhamdulillah (33), Allahu Akbar (34).",fr:"SubhanAllah 33 fois, Alhamdulillah 33 fois, Allahu Akbar 34 fois.",reward:"Ali rapporte que F\u00e2tima se plaignait de la fatigue ; le Proph\u00e8te \uFEDF lui enseigna ce dhikr avant le sommeil, meilleur qu\u2019un serviteur."}
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
        {type:"dua",ref:"Muslim 2709",ar:"\u0623\u064e\u0639\u064f\u0648\u0630\u064f \u0628\u0650\u0643\u064e\u0644\u0650\u0645\u064e\u0627\u062a\u0650 \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \u0627\u0644\u062a\u0651\u064e\u0627\u0645\u0651\u064e\u0627\u062a\u0650 \u0645\u0650\u0646\u0652 \u0634\u064e\u0631\u0651\u0650 \u0645\u064e\u0627 \u062e\u064e\u0644\u064e\u0642\u064e",ph:"A'udhu bi kalimati Allahit-tammati min sharri ma khalaq.",fr:"Je cherche refuge dans les paroles parfaites d\u2019Allah contre le mal de ce qu\u2019Il a cr\u00e9\u00e9.",reward:"Celui qui fait halte et r\u00e9cite cette invocation, rien ne lui nuira jusqu\u2019\u00e0 son d\u00e9part de cet endroit."},
        {type:"dua",ref:"Abu Dawud 5088",ar:"\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \u0627\u0644\u0651\u064e\u0630\u0650\u064a \u0644\u064e\u0627 \u064a\u064e\u0636\u064f\u0631\u0651\u064f \u0645\u064e\u0639\u064e \u0627\u0633\u0652\u0645\u0650\u0647\u0650 \u0634\u064e\u064a\u0652\u0621\u064c \u0641\u0650\u064a \u0627\u0644\u0652\u0623\u064e\u0631\u0652\u0636\u0650 \u0648\u064e\u0644\u064e\u0627 \u0641\u0650\u064a \u0627\u0644\u0633\u0651\u064e\u0645\u064e\u0627\u0621\u0650 \u0648\u064e\u0647\u064f\u0648\u064e \u0627\u0644\u0633\u0651\u064e\u0645\u0650\u064a\u0639\u064f \u0627\u0644\u0652\u0639\u064e\u0644\u0650\u064a\u0645\u064f",ph:"Bismillahi alladhi la yadurru ma'a ismihi shay'un fil-ardi wa la fis-sama'i wa Huwas-Sami'ul-'Alim.",fr:"Au nom d\u2019Allah, avec le nom de Qui rien ne peut nuire sur terre ni au ciel, et Il est l\u2019Audient, l\u2019Omniscient. (3 fois)",reward:"Celui qui la r\u00e9cite 3 fois matin et soir ne sera frapp\u00e9 par aucune calamit\u00e9 soudaine."},
        {type:"dua",ref:"Al-Falaq 113:1-5",ar:"\u0642\u0644 \u0623\u0639\u0648\u0630 \u0628\u0631\u0628\u0651 \u0627\u0644\u0641\u0644\u0642 \u0645\u0646 \u0634\u0631\u0651 \u0645\u0627 \u062e\u0644\u0642",ph:"Qul a'udhu bi Rabbil-Falaq, min sharri ma khalaq.",fr:"Dis : \u00abJe cherche refuge aupr\u00e8s du Seigneur de l\u2019aube naissante, contre le mal de ce qu\u2019Il a cr\u00e9\u00e9.\u00bb (Sourate al-Falaq)",reward:"Le Proph\u00e8te \uFEDF a dit que les Mu\u2019awwidhat (sourates de protection) sont les meilleures pour chercher refuge aupr\u00e8s d\u2019Allah."},
        {type:"dua",ref:"An-Nas 114:1-6",ar:"\u0642\u064f\u0644\u0652 \u0623\u064e\u0639\u064f\u0648\u0630\u064f \u0628\u0650\u0631\u064e\u0628\u0651\u0650 \u0627\u0644\u0646\u0651\u064e\u0627\u0633\u0650 \u06de \u0645\u064e\u0644\u0650\u0643\u0650 \u0627\u0644\u0646\u0651\u064e\u0627\u0633\u0650 \u06de \u0625\u0650\u0644\u064e\u0647\u0650 \u0627\u0644\u0646\u0651\u064e\u0627\u0633\u0650 \u06de \u0645\u0650\u0646\u0652 \u0634\u064e\u0631\u0651\u0650 \u0627\u0644\u0652\u0648\u064e\u0633\u0652\u0648\u064e\u0627\u0633\u0650 \u0627\u0644\u0652\u062e\u064e\u0646\u0651\u064e\u0627\u0633\u0650 \u06de \u0627\u0644\u0651\u064e\u0630\u0650\u064a \u064a\u064f\u0648\u064e\u0633\u0652\u0648\u0650\u0633\u064f \u0641\u0650\u064a \u0635\u064f\u062f\u064f\u0648\u0631\u0650 \u0627\u0644\u0646\u0651\u064e\u0627\u0633\u0650 \u06de \u0645\u0650\u0646\u064e \u0627\u0644\u0652\u062c\u0650\u0646\u0651\u064e\u0629\u0650 \u0648\u064e\u0627\u0644\u0646\u0651\u064e\u0627\u0633\u0650",ph:"Qul a'udhu bi Rabbin-Nas. Malikin-Nas. Ilahin-Nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fi sudurin-nas. Minal-jinnati wan-nas.",fr:"Dis : \u00abJe cherche refuge aupr\u00e8s du Seigneur des hommes, le Roi des hommes, le Dieu des hommes.\u00bb (Sourate an-Nas)",reward:"Protection contre les chuchotements de Satan qui se retire quand on invoque Allah."},
        {type:"dua",ref:"Tirmidhi 3528",ar:"\u0627\u0644\u0644\u0651\u064e\u0647\u064f\u0645\u0651\u064e \u0625\u0650\u0646\u0650\u0651\u064a \u0623\u064e\u0639\u064f\u0648\u0630\u064f \u0628\u0650\u0643\u064e \u0645\u0650\u0646\u0652 \u0634\u064e\u0631\u0651\u0650 \u0633\u064e\u0645\u0652\u0639\u0650\u064a \u0648\u064e\u0645\u0650\u0646\u0652 \u0634\u064e\u0631\u0651\u0650 \u0628\u064e\u0635\u064e\u0631\u0650\u064a \u0648\u064e\u0645\u0650\u0646\u0652 \u0634\u064e\u0631\u0651\u0650 \u0644\u0650\u0633\u064e\u0627\u0646\u0650\u064a \u0648\u064e\u0645\u0650\u0646\u0652 \u0634\u064e\u0631\u0651\u0650 \u0642\u064e\u0644\u0652\u0628\u0650\u064a \u0648\u064e\u0645\u0650\u0646\u0652 \u0634\u064e\u0631\u0651\u0650 \u0645\u064e\u0646\u0650\u064a\u0651\u0650\u064a",ph:"Allahumma inni a'udhu bika min sharri sam'i, wa min sharri basari, wa min sharri lisani, wa min sharri qalbi, wa min sharri maniyyi.",fr:"O Allah, je cherche refuge aupr\u00e8s de Toi contre le mal de mon ou\u00efe, de ma vue, de ma langue et de mon c\u0153ur.",reward:"Demande de protection contre le mal qui peut provenir de nos propres sens et organes, source fr\u00e9quente de p\u00e9ch\u00e9s."}
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
        {type:"dua",ref:"Ahmad 3712",ar:"\u0627\u0644\u0644\u0651\u064e\u0647\u064f\u0645\u0651\u064e \u0625\u0650\u0646\u0650\u0651\u064a \u0639\u064e\u0628\u0652\u062f\u064f\u0643\u064e \u0627\u0628\u0652\u0646\u064f \u0639\u064e\u0628\u0652\u062f\u0650\u0643\u064e \u0627\u0628\u0652\u0646\u064f \u0623\u064e\u0645\u064e\u062a\u0650\u0643\u064e \u0646\u064e\u0627\u0635\u0650\u064a\u064e\u062a\u0650\u064a \u0628\u0650\u064a\u064e\u062f\u0650\u0643\u064e \u0645\u064e\u0627\u0636\u0613 \u0641\u0650\u064a\u064e\u0651 \u062d\u064f\u0643\u0652\u0645\u064f\u0643\u064e \u0639\u064e\u062f\u0652\u0644\u064c \u0641\u0650\u064a\u064e\u0651 \u0642\u064e\u0636\u064e\u0627\u0624\u064f\u0643\u064e \u0623\u064e\u0633\u0652\u0623\u064e\u0644\u064f\u0643\u064e \u0628\u0650\u0643\u064f\u0644\u0651\u0650 \u0627\u0633\u0652\u0645\u0613 \u0647\u064f\u0648\u064e \u0644\u064e\u0643\u064e \u0633\u064e\u0645\u0651\u064e\u064a\u0652\u062a\u064e \u0628\u0650\u0647\u0650 \u0646\u064e\u0641\u0652\u0633\u064e\u0643\u064e \u0623\u064e\u0648\u0652 \u0623\u064e\u0646\u0652\u0632\u064e\u0644\u0652\u062a\u064e\u0647\u064f \u0641\u0650\u064a \u0643\u0650\u062a\u064e\u0627\u0628\u0650\u0643\u064e \u0623\u064e\u0648\u0652 \u0639\u064e\u0644\u0651\u064e\u0645\u0652\u062a\u064e\u0647\u064f \u0623\u064e\u062d\u064e\u062f\u064b\u0627 \u0645\u0650\u0646\u0652 \u062e\u064e\u0644\u0652\u0642\u0650\u0643\u064e \u0623\u064e\u0648\u0650 \u0627\u0633\u0652\u062a\u064e\u0623\u0652\u062b\u064e\u0631\u0652\u062a\u064e \u0628\u0650\u0647\u0650 \u0641\u0650\u064a \u0639\u0650\u0644\u0652\u0645\u0650 \u0627\u0644\u0652\u063a\u064e\u064a\u0652\u0628\u0650 \u0639\u0650\u0646\u0652\u062f\u064e\u0643\u064e \u0623\u064e\u0646\u0652 \u062a\u064e\u062c\u0652\u0639\u064e\u0644\u064e \u0627\u0644\u0652\u0642\u064f\u0631\u0652\u0622\u0646\u064e \u0631\u064e\u0628\u0650\u064a\u0639\u064e \u0642\u064e\u0644\u0652\u0628\u0650\u064a \u0648\u064e\u0646\u064f\u0648\u0631\u064e \u0635\u064e\u062f\u0652\u0631\u0650\u064a \u0648\u064e\u062c\u064e\u0644\u064e\u0627\u0621\u064e \u062d\u064f\u0632\u0652\u0646\u0650\u064a \u0648\u064e\u0630\u064e\u0647\u064e\u0627\u0628\u064e \u0647\u064e\u0645\u0651\u0650\u064a",ph:"Allahumma inni 'abduka, ibnu 'abdik, ibnu amatik. Nasiyati bi yadik, madin fiyya hukmuk, 'adlun fiyya qada'uk. As'aluka bi kulli ismin huwa lak, sammayta bihi nafsak, aw anzaltahu fi kitabik, aw 'allamtahu ahadan min khalqik, aw ista'tharta bihi fi 'ilmil-ghaybi 'indak, an taj'alal-Qur'ana rabi'a qalbi, wa nura sadri, wa jala'a huzni, wa dhahaba hammi.",fr:"O Allah, je suis Ton serviteur, fils de Ton serviteur, fils de Ta servante. Mon sort est dans Ta main. Ton jugement s\u2019accomplit sur moi. Ton d\u00e9cret est juste \u00e0 mon \u00e9gard. Je Te demande par chaque nom qui T\u2019appartient, par lequel Tu T\u2019es nomm\u00e9, ou que Tu as r\u00e9v\u00e9l\u00e9 dans Ton Livre, ou que Tu as enseign\u00e9 \u00e0 l\u2019une de Tes cr\u00e9atures, ou que Tu as gard\u00e9 dans la science de l\u2019invisible aupr\u00e8s de Toi, de faire du Coran le printemps de mon c\u0153ur, la lumi\u00e8re de ma poitrine, la dissipation de ma tristesse et la disparition de mon souci.",reward:"Le Proph\u00e8te \uFEDF a dit : quiconque la r\u00e9cite, Allah remplacera sa tristesse par de la joie. C\u2019est l\u2019invocation la plus puissante contre le chagrin."},
        {type:"dua",ref:"Al-Anbiya 21:87",ar:"\u0644\u0627 \u0625\u0650\u0644\u0647 \u0625\u0650\u0644\u0651\u0627 \u0623\u0646\u062a \u0633\u0628\u062d\u0627\u0646\u0643 \u0625\u0650\u0646\u0651\u064a \u0643\u0646\u062a \u0645\u0646 \u0627\u0644\u0638\u0651\u0627\u0644\u0645\u064a\u0646",ph:"La ilaha illa Anta, Subhanaka inni kuntu minadh-dhalimin.",fr:"Point de divinit\u00e9 \u00e0 part Toi ! Puret\u00e9 \u00e0 Toi ! J\u2019ai \u00e9t\u00e9 du nombre des injustes. (L\u2019invocation de Yunus)",reward:"L\u2019invocation de Yunus dans le ventre de la baleine. Le Proph\u00e8te \uFEDF a dit qu\u2019aucun musulman n\u2019invoque avec elle sans qu\u2019Allah ne lui r\u00e9ponde."},
        {type:"dua",ref:"Abu Dawud 1525",ar:"\u0627\u0644\u0644\u0651\u064e\u0647\u064f\u0645\u0651\u064e \u0625\u0650\u0646\u0650\u0651\u064a \u0623\u064e\u0639\u064f\u0648\u0630\u064f \u0628\u0650\u0643\u064e \u0645\u0650\u0646\u064e \u0627\u0644\u0652\u0647\u064e\u0645\u0651\u0650 \u0648\u064e\u0627\u0644\u0652\u062d\u064e\u0632\u064e\u0646\u0650 \u0648\u064e\u0627\u0644\u0652\u0639\u064e\u062c\u0652\u0632\u0650 \u0648\u064e\u0627\u0644\u0652\u0643\u064e\u0633\u064e\u0644\u0650 \u0648\u064e\u0627\u0644\u0652\u0628\u064f\u062e\u0652\u0644\u0650 \u0648\u064e\u0627\u0644\u0652\u062c\u064f\u0628\u0652\u0646\u0650 \u0648\u064e\u0636\u064e\u0644\u064e\u0639\u0650 \u0627\u0644\u062f\u0651\u064e\u064a\u0652\u0646\u0650 \u0648\u064e\u063a\u064e\u0644\u064e\u0628\u064e\u0629\u0650 \u0627\u0644\u0631\u0651\u0650\u062c\u064e\u0627\u0644\u0650",ph:"Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-bukhli wal-jubn, wa dala'id-dayni wa ghalabatir-rijal.",fr:"O Allah, je cherche refuge aupr\u00e8s de Toi contre le souci, la tristesse, l\u2019impuissance, la paresse, l\u2019avarice, la l\u00e2chet\u00e9, le fardeau des dettes et la domination des hommes.",reward:"Invocation fr\u00e9quente du Proph\u00e8te \uFEDF qui couvre les 8 maux majeurs de l\u2019\u00e2me : elle prot\u00e8ge contre tout ce qui paralyse le serviteur."},
        {type:"dua",ref:"Muslim 2721",ar:"\u0627\u0644\u0644\u0651\u064e\u0647\u064f\u0645\u0651\u064e \u0631\u064e\u062d\u0652\u0645\u064e\u062a\u064e\u0643\u064e \u0623\u064e\u0631\u0652\u062c\u064f\u0648 \u0641\u064e\u0644\u064e\u0627 \u062a\u064e\u0643\u0650\u0644\u0652\u0646\u0650\u064a \u0625\u0650\u0644\u064e\u0649 \u0646\u064e\u0641\u0652\u0633\u0650\u064a \u0637\u064e\u0631\u0652\u0641\u064e\u0629\u064e \u0639\u064e\u064a\u0652\u0646\u0613 \u0648\u064e\u0623\u064e\u0635\u0652\u0644\u0650\u062d\u0652 \u0644\u0650\u064a \u0634\u064e\u0623\u0652\u0646\u0650\u064a \u0643\u064f\u0644\u0651\u064e\u0647\u064f",ph:"Allahumma rahmataka arju, fa la takilni ila nafsi tarfata 'ayn, wa aslih li sha'ni kullah.",fr:"O Allah, c\u2019est Ta mis\u00e9ricorde que j\u2019esp\u00e8re. Ne me laisse pas \u00e0 moi-m\u00eame un seul instant et am\u00e9liore toute ma situation.",reward:"Le serviteur reconna\u00eet qu\u2019il ne peut se passer d\u2019Allah ne serait-ce un clin d\u2019\u0153il. C\u2019est l\u2019essence du tawakkul."}
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
        {type:"dua",ref:"Muslim 1342",ar:"\u0633\u064f\u0628\u0652\u062d\u064e\u0627\u0646\u064e \u0627\u0644\u0651\u064e\u0630\u0650\u064a \u0633\u064e\u062e\u0651\u064e\u0631\u064e \u0644\u064e\u0646\u064e\u0627 \u0647\u064e\u0630\u064e\u0627 \u0648\u064e\u0645\u064e\u0627 \u0643\u064f\u0646\u0651\u064e\u0627 \u0644\u064e\u0647\u064f \u0645\u064f\u0642\u0652\u0631\u0650\u0646\u0650\u064a\u0646\u064e \u0648\u064e\u0625\u0650\u0646\u0651\u064e\u0627 \u0625\u0650\u0644\u064e\u0649 \u0631\u064e\u0628\u0651\u0650\u0646\u064e\u0627 \u0644\u064e\u0645\u064f\u0646\u0652\u0642\u064e\u0644\u0650\u0628\u064f\u0648\u0646\u064e",ph:"Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun.",fr:"Gloire \u00e0 Celui qui a mis ceci \u00e0 notre service alors que nous n\u2019\u00e9tions pas capables de le faire. Et c\u2019est vers notre Seigneur que nous retournerons.",reward:"Verset coranique (Az-Zukhruf 43:13-14) que le Proph\u00e8te \uFEDF r\u00e9citait \u00e0 chaque d\u00e9but de voyage. Il rappelle que toute monture est un bienfait d\u2019Allah."},
        {type:"dua",ref:"Muslim 1342",ar:"\u0627\u0644\u0644\u0651\u064e\u0647\u064f\u0645\u0651\u064e \u0625\u0650\u0646\u0651\u064e\u0627 \u0646\u064e\u0633\u0652\u0623\u064e\u0644\u064f\u0643\u064e \u0641\u0650\u064a \u0633\u064e\u0641\u064e\u0631\u0650\u0646\u064e\u0627 \u0647\u064e\u0630\u064e\u0627 \u0627\u0644\u0652\u0628\u0650\u0631\u0651\u064e \u0648\u064e\u0627\u0644\u062a\u0651\u064e\u0642\u0652\u0648\u064e\u0649 \u0648\u064e\u0645\u0650\u0646\u064e \u0627\u0644\u0652\u0639\u064e\u0645\u064e\u0644\u0650 \u0645\u064e\u0627 \u062a\u064e\u0631\u0652\u0636\u064e\u0649",ph:"Allahumma inna nas'aluka fi safarina hadhal-birra wat-taqwa, wa minal-'amali ma tarda.",fr:"O Allah, nous Te demandons dans ce voyage la pi\u00e9t\u00e9, la crainte, et les \u0153uvres dont Tu es satisfait.",reward:"L\u2019invocation du voyageur est exauc\u00e9e. Le Proph\u00e8te \uFEDF demandait la pi\u00e9t\u00e9 et les bonnes \u0153uvres pendant le voyage."},
        {type:"dua",ref:"Muslim 1342",ar:"\u0627\u0644\u0644\u0651\u064e\u0647\u064f\u0645\u0651\u064e \u0647\u064e\u0648\u0651\u0650\u0646\u0652 \u0639\u064e\u0644\u064e\u064a\u0652\u0646\u064e\u0627 \u0633\u064e\u0641\u064e\u0631\u064e\u0646\u064e\u0627 \u0647\u064e\u0630\u064e\u0627 \u0648\u064e\u0627\u0637\u0652\u0648\u0650 \u0639\u064e\u0646\u0651\u064e\u0627 \u0628\u064f\u0639\u0652\u062f\u064e\u0647\u064f",ph:"Allahumma hawwin 'alayna safarana hadha watwi 'anna bu'dah.",fr:"O Allah, facilite-nous ce voyage et rapproche-nous de sa destination.",reward:"Le Proph\u00e8te \uFEDF demandait \u00e0 Allah de faciliter la distance et de rendre le voyage ais\u00e9. Trois invocations ne sont pas rejet\u00e9es, dont celle du voyageur."}
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
        {type:"dua",ref:"Bukhari 1166",ar:"\u0627\u0644\u0644\u0651\u064e\u0647\u064f\u0645\u0651\u064e \u0625\u0650\u0646\u0650\u0651\u064a \u0623\u064e\u0633\u0652\u062a\u064e\u062e\u0650\u064a\u0631\u064f\u0643\u064e \u0628\u0650\u0639\u0650\u0644\u0652\u0645\u0650\u0643\u064e \u0648\u064e\u0623\u064e\u0633\u0652\u062a\u064e\u0642\u0652\u062f\u0650\u0631\u064f\u0643\u064e \u0628\u0650\u0642\u064f\u062f\u0652\u0631\u064e\u062a\u0650\u0643\u064e \u0648\u064e\u0623\u064e\u0633\u0652\u0623\u064e\u0644\u064f\u0643\u064e \u0645\u0650\u0646\u0652 \u0641\u064e\u0636\u0652\u0644\u0650\u0643\u064e \u0627\u0644\u0652\u0639\u064e\u0638\u0650\u064a\u0645\u0650 \u0641\u064e\u0625\u0650\u0646\u0651\u064e\u0643\u064e \u062a\u064e\u0642\u0652\u062f\u0650\u0631\u064f \u0648\u064e\u0644\u064e\u0627 \u0623\u064e\u0642\u0652\u062f\u0650\u0631\u064f \u0648\u064e\u062a\u064e\u0639\u0652\u0644\u064e\u0645\u064f \u0648\u064e\u0644\u064e\u0627 \u0623\u064e\u0639\u0652\u0644\u064e\u0645\u064f \u0648\u064e\u0623\u064e\u0646\u0652\u062a\u064e \u0639\u064e\u0644\u0651\u064e\u0627\u0645\u064f \u0627\u0644\u0652\u063a\u064f\u064a\u064f\u0648\u0628\u0650",ph:"Allahumma inni astakhiruka bi 'ilmik, wa astaqdiruka bi qudratik, wa as'aluka min fadlikal-'adhim. Fa innaka taqdiru wa la aqdir, wa ta'lamu wa la a'lam, wa Anta 'Allamul-Ghuyub.",fr:"O Allah, je Te consulte par Ta science et je Te demande de m\u2019accorder le pouvoir par Ta puissance, et je Te demande de Ta gr\u00e2ce immense. Car Tu es capable et je ne suis pas capable, Tu sais et je ne sais pas, et Tu es le Grand Connaisseur de l\u2019invisible.",reward:"La salat al-Istikhara est une Sunna pour toute d\u00e9cision importante. Le Proph\u00e8te \uFEDF l\u2019enseignait comme il enseignait les sourates du Coran."},
        {type:"dua",ref:"Bukhari 1166 (suite)",ar:"\u0627\u0644\u0644\u0651\u064e\u0647\u064f\u0645\u0651\u064e \u0625\u0650\u0646\u0652 \u0643\u064f\u0646\u0652\u062a\u064e \u062a\u064e\u0639\u0652\u0644\u064e\u0645\u064f \u0623\u064e\u0646\u0651\u064e \u0647\u064e\u0630\u064e\u0627 \u0627\u0644\u0652\u0623\u064e\u0645\u0652\u0631\u064e \u062e\u064e\u064a\u0652\u0631\u064c \u0644\u0650\u064a \u0641\u0650\u064a \u062f\u0650\u064a\u0646\u0650\u064a \u0648\u064e\u0645\u064e\u0639\u064e\u0627\u0634\u0650\u064a \u0648\u064e\u0639\u064e\u0627\u0642\u0650\u0628\u064e\u0629\u0650 \u0623\u064e\u0645\u0652\u0631\u0650\u064a \u0641\u064e\u0627\u0642\u0652\u062f\u064f\u0631\u0652\u0647\u064f \u0644\u0650\u064a \u0648\u064e\u064a\u064e\u0633\u0651\u0650\u0631\u0652\u0647\u064f \u0644\u0650\u064a \u062b\u064f\u0645\u0651\u064e \u0628\u064e\u0627\u0631\u0650\u0643\u0652 \u0644\u0650\u064a \u0641\u0650\u064a\u0647\u0650 \u0648\u064e\u0625\u0650\u0646\u0652 \u0643\u064f\u0646\u0652\u062a\u064e \u062a\u064e\u0639\u0652\u0644\u064e\u0645\u064f \u0623\u064e\u0646\u0651\u064e \u0647\u064e\u0630\u064e\u0627 \u0627\u0644\u0652\u0623\u064e\u0645\u0652\u0631\u064e \u0634\u064e\u0631\u064c \u0644\u0650\u064a \u0641\u0650\u064a \u062f\u0650\u064a\u0646\u0650\u064a \u0648\u064e\u0645\u064e\u0639\u064e\u0627\u0634\u0650\u064a \u0648\u064e\u0639\u064e\u0627\u0642\u0650\u0628\u064e\u0629\u0650 \u0623\u064e\u0645\u0652\u0631\u0650\u064a \u0641\u064e\u0627\u0635\u0652\u0631\u0650\u0641\u0652\u0647\u064f \u0639\u064e\u0646\u0651\u0650\u064a \u0648\u064e\u0627\u0635\u0652\u0631\u0650\u0641\u0652\u0646\u0650\u064a \u0639\u064e\u0646\u0652\u0647\u064f \u0648\u064e\u0627\u0642\u0652\u062f\u064f\u0631\u0652 \u0644\u0650\u064a \u0627\u0644\u0652\u062e\u064e\u064a\u0652\u0631\u064e \u062d\u064e\u064a\u0652\u062b\u064f \u0643\u064e\u0627\u0646\u064e \u062b\u064f\u0645\u0651\u064e \u0623\u064e\u0631\u0652\u0636\u0650\u0646\u0650\u064a \u0628\u0650\u0647\u0650",ph:"Allahumma in kunta ta'lamu anna hadhal-amra khayrun li fi dini wa ma'ashi wa 'aqibati amri, faqdurhu li wa yassirhu li thumma barik li fih. Wa in kunta ta'lamu anna hadhal-amra sharrun li fi dini wa ma'ashi wa 'aqibati amri, fasrifhu 'anni wasrifni 'anhu, waqdur liyal-khayra haythu kana thumma ardini bih.",fr:"O Allah, si Tu sais que cette affaire est un bien pour ma religion, ma vie et ma destin\u00e9e, d\u00e9cr\u00e8te-la pour moi, facilite-la moi et b\u00e9nis-la moi.",reward:"Suite de l\u2019Istikhara : on remet l\u2019affaire \u00e0 Allah et on Lui demande de l\u2019\u00e9carter si elle est un mal. Le croyant n\u2019est jamais d\u00e9\u00e7u apr\u00e8s l\u2019Istikhara."}
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
        {type:"verset",ref:"Al-Baqarah 2:127",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u062a\u064e\u0642\u064e\u0628\u0651\u064e\u0644\u0652 \u0645\u0650\u0646\u0651\u064e\u0627 \u0625\u0650\u0646\u0651\u064e\u0643\u064e \u0623\u064e\u0646\u0652\u062a\u064e \u0627\u0644\u0633\u0651\u064e\u0645\u0650\u064a\u0639\u064f \u0627\u0644\u0652\u0639\u064e\u0644\u0650\u064a\u0645\u064f",ph:"Rabbana taqabbal minna innaka Antas-Sami'ul-'Alim.",fr:"Notre Seigneur, accepte ceci de notre part, car c\u2019est Toi l\u2019Audient, l\u2019Omniscient.",reward:"Du\u2019a d\u2019Ibrahim et Isma\u2019il en \u00e9levant les fondations de la Ka\u2019ba. Mod\u00e8le d\u2019humilit\u00e9 : m\u00eame une grande \u0153uvre a besoin d\u2019\u00eatre accept\u00e9e."},
        {type:"verset",ref:"Al-Baqarah 2:128",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0648\u064e\u0627\u062c\u0652\u0639\u064e\u0644\u0652\u0646\u064e\u0627 \u0645\u064f\u0633\u0652\u0644\u0650\u0645\u064e\u064a\u0652\u0646\u0650 \u0644\u064e\u0643\u064e \u0648\u064e\u0645\u0650\u0646\u0652 \u0630\u064f\u0631\u0651\u0650\u064a\u0651\u064e\u062a\u0650\u0646\u064e\u0627 \u0623\u064f\u0645\u0651\u064e\u0629\u064b \u0645\u064f\u0633\u0652\u0644\u0650\u0645\u064e\u0629\u064b \u0644\u064e\u0643\u064e \u0648\u064e\u0623\u064e\u0631\u0650\u0646\u064e\u0627 \u0645\u064e\u0646\u064e\u0627\u0633\u0650\u0643\u064e\u0646\u064e\u0627 \u0648\u064e\u062a\u064f\u0628\u0652 \u0639\u064e\u0644\u064e\u064a\u0652\u0646\u064e\u0627 \u0625\u0650\u0646\u0651\u064e\u0643\u064e \u0623\u064e\u0646\u0652\u062a\u064e \u0627\u0644\u062a\u0651\u064e\u0648\u0651\u064e\u0627\u0628\u064f \u0627\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u064f",ph:"Rabbana waj'alna Muslimayni laka wa min dhurriyyatina ummatan Muslimatan lak, wa arina manasikana wa tub 'alayna innaka Antat-Tawwabur-Rahim.",fr:"Notre Seigneur, fais de nous des soumis \u00e0 Toi et de notre descendance une communaut\u00e9 soumise \u00e0 Toi.",reward:"Du\u2019a d\u2019Ibrahim pour sa descendance. Elle montre le souci des proph\u00e8tes pour la pi\u00e9t\u00e9 de leurs enfants et de la Oumma."},
        {type:"verset",ref:"Al-Baqarah 2:201",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0622\u062a\u0650\u0646\u064e\u0627 \u0641\u0650\u064a \u0627\u0644\u062f\u0651\u064f\u0646\u0652\u064a\u064e\u0627 \u062d\u064e\u0633\u064e\u0646\u064e\u0629\u064b \u0648\u064e\u0641\u0650\u064a \u0627\u0644\u0652\u0622\u062e\u0650\u0631\u064e\u0629\u0650 \u062d\u064e\u0633\u064e\u0646\u064e\u0629\u064b \u0648\u064e\u0642\u0650\u0646\u064e\u0627 \u0639\u064e\u0630\u064e\u0627\u0628\u064e \u0627\u0644\u0646\u0651\u064e\u0627\u0631\u0650",ph:"Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-Nar.",fr:"Notre Seigneur, accorde-nous un bien ici-bas et un bien dans l\u2019au-del\u00e0, et pr\u00e9serve-nous du ch\u00e2timent du Feu.",reward:"L\u2019invocation la plus fr\u00e9quente du Proph\u00e8te \uFEDF. Elle rassemble tout le bien de ce monde et de l\u2019au-del\u00e0 en une seule demande."},
        {type:"verset",ref:"Al-Baqarah 2:250",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0623\u064e\u0641\u0652\u0631\u0650\u063a\u0652 \u0639\u064e\u0644\u064e\u064a\u0652\u0646\u064e\u0627 \u0635\u064e\u0628\u0652\u0631\u064b\u0627 \u0648\u064e\u062b\u064e\u0628\u0651\u0650\u062a\u0652 \u0623\u064e\u0642\u0652\u062f\u064e\u0627\u0645\u064e\u0646\u064e\u0627 \u0648\u064e\u0627\u0646\u0652\u0635\u064f\u0631\u0652\u0646\u064e\u0627 \u0639\u064e\u0644\u064e\u0649 \u0627\u0644\u0652\u0642\u064e\u0648\u0652\u0645\u0650 \u0627\u0644\u0652\u0643\u064e\u0627\u0641\u0650\u0631\u0650\u064a\u0646\u064e",ph:"Rabbana afrigh 'alayna sabran wa thabbit aqdamana wansurna 'alal-qawmil-kafirin.",fr:"Notre Seigneur, d\u00e9verse sur nous la patience, affermis nos pas et donne-nous la victoire.",reward:"Du\u2019a des compagnons de Talut (Sa\u00fcl) face \u00e0 Jalut (Goliath). Invocation de fermet\u00e9 dans les moments d\u2019\u00e9preuve."},
        {type:"verset",ref:"Al-Baqarah 2:286",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0644\u064e\u0627 \u062a\u064f\u0624\u064e\u0627\u062e\u0650\u0630\u0652\u0646\u064e\u0627 \u0625\u0650\u0646\u0652 \u0646\u064e\u0633\u0650\u064a\u0646\u064e\u0627 \u0623\u064e\u0648\u0652 \u0623\u064e\u062e\u0652\u0637\u064e\u0623\u0652\u0646\u064e\u0627 \u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0648\u064e\u0644\u064e\u0627 \u062a\u064e\u062d\u0652\u0645\u0650\u0644\u0652 \u0639\u064e\u0644\u064e\u064a\u0652\u0646\u064e\u0627 \u0625\u0650\u0635\u0652\u0631\u064b\u0627 \u0643\u064e\u0645\u064e\u0627 \u062d\u064e\u0645\u064e\u0644\u0652\u062a\u064e\u0647\u064f \u0639\u064e\u0644\u064e\u0649 \u0627\u0644\u0651\u064e\u0630\u0650\u064a\u0646\u064e \u0645\u0650\u0646\u0652 \u0642\u064e\u0628\u0652\u0644\u0650\u0646\u064e\u0627 \u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0648\u064e\u0644\u064e\u0627 \u062a\u064f\u062d\u064e\u0645\u0651\u0650\u0644\u0652\u0646\u064e\u0627 \u0645\u064e\u0627 \u0644\u064e\u0627 \u0637\u064e\u0627\u0642\u064e\u0629\u064e \u0644\u064e\u0646\u064e\u0627 \u0628\u0650\u0647\u0650 \u0648\u064e\u0627\u0639\u0652\u0641\u064f \u0639\u064e\u0646\u0651\u064e\u0627 \u0648\u064e\u0627\u063a\u0652\u0641\u0650\u0631\u0652 \u0644\u064e\u0646\u064e\u0627 \u0648\u064e\u0627\u0631\u0652\u062d\u064e\u0645\u0652\u0646\u064e\u0627 \u0623\u064e\u0646\u0652\u062a\u064e \u0645\u064e\u0648\u0652\u0644\u064e\u0627\u0646\u064e\u0627 \u0641\u064e\u0627\u0646\u0652\u0635\u064f\u0631\u0652\u0646\u064e\u0627 \u0639\u064e\u0644\u064e\u0649 \u0627\u0644\u0652\u0642\u064e\u0648\u0652\u0645\u0650 \u0627\u0644\u0652\u0643\u064e\u0627\u0641\u0650\u0631\u0650\u064a\u0646\u064e",ph:"Rabbana la tu'akhidhna in nasina aw akhta'na. Rabbana wa la tahmil 'alayna isran kama hamaltahu 'alal-ladhina min qablina. Rabbana wa la tuhammilna ma la taqata lana bih. Wa'fu 'anna waghfir lana warhamna, Anta Mawlana fansurna 'alal-qawmil-kafirin.",fr:"Notre Seigneur, ne nous ch\u00e2tie pas s\u2019il nous arrive d\u2019oublier ou de commettre une erreur.",reward:"Derniers versets de Sourate al-Baqarah. Le Proph\u00e8te \uFEDF a dit que celui qui les r\u00e9cite la nuit, ils lui suffisent. Allah a r\u00e9pondu \u00ab Oui \u00bb \u00e0 chaque demande."},
        {type:"verset",ref:"Al Imran 3:8",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0644\u064e\u0627 \u062a\u064f\u0632\u0650\u063a\u0652 \u0642\u064f\u0644\u064f\u0648\u0628\u064e\u0646\u064e\u0627 \u0628\u064e\u0639\u0652\u062f\u064e \u0625\u0650\u0630\u0652 \u0647\u064e\u062f\u064e\u064a\u0652\u062a\u064e\u0646\u064e\u0627 \u0648\u064e\u0647\u064e\u0628\u0652 \u0644\u064e\u0646\u064e\u0627 \u0645\u0650\u0646\u0652 \u0644\u064e\u062f\u064f\u0646\u0652\u0643\u064e \u0631\u064e\u062d\u0652\u0645\u064e\u0629\u064b \u0625\u0650\u0646\u0651\u064e\u0643\u064e \u0623\u064e\u0646\u0652\u062a\u064e \u0627\u0644\u0652\u0648\u064e\u0647\u0651\u064e\u0627\u0628\u064f",ph:"Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmatan innaka Antal-Wahhab.",fr:"Notre Seigneur, ne fais pas d\u00e9vier nos c\u0153urs apr\u00e8s nous avoir guid\u00e9s, et accorde-nous Ta mis\u00e9ricorde.",reward:"Du\u2019a des gens de science fermes dans la foi. Elle rappelle que la guidanc\u00e9e est un don d\u2019Allah qu\u2019il faut prot\u00e9ger."},
        {type:"verset",ref:"Al Imran 3:16",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0625\u0650\u0646\u0651\u064e\u0646\u064e\u0627 \u0622\u0645\u064e\u0646\u0651\u064e\u0627 \u0641\u064e\u0627\u063a\u0652\u0641\u0650\u0631\u0652 \u0644\u064e\u0646\u064e\u0627 \u0630\u064f\u0646\u064f\u0648\u0628\u064e\u0646\u064e\u0627 \u0648\u064e\u0642\u0650\u0646\u064e\u0627 \u0639\u064e\u0630\u064e\u0627\u0628\u064e \u0627\u0644\u0646\u0651\u064e\u0627\u0631\u0650",ph:"Rabbana innana amanna faghfir lana dhunubana wa qina 'adhaban-Nar.",fr:"Notre Seigneur, nous avons cru. Pardonne-nous nos p\u00e9ch\u00e9s et pr\u00e9serve-nous du ch\u00e2timent du Feu.",reward:"Du\u2019a de ceux qui sont patients, v\u00e9ridiques et ob\u00e9issants, qui d\u00e9pensent dans le chemin d\u2019Allah et demandent pardon \u00e0 l\u2019aube."},
        {type:"verset",ref:"Al Imran 3:53",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0622\u0645\u064e\u0646\u0651\u064e\u0627 \u0628\u0650\u0645\u064e\u0627 \u0623\u064e\u0646\u0652\u0632\u064e\u0644\u0652\u062a\u064e \u0648\u064e\u0627\u062a\u0651\u064e\u0628\u064e\u0639\u0652\u0646\u064e\u0627 \u0627\u0644\u0631\u0651\u064e\u0633\u064f\u0648\u0644\u064e \u0641\u064e\u0627\u0643\u0652\u062a\u064f\u0628\u0652\u0646\u064e\u0627 \u0645\u064e\u0639\u064e \u0627\u0644\u0634\u0651\u064e\u0627\u0647\u0650\u062f\u0650\u064a\u0646\u064e",ph:"Rabbana amanna bi ma anzalta wattaba'nar-Rasula faktubna ma'ash-shahidin.",fr:"Notre Seigneur, nous avons cru en ce que Tu as r\u00e9v\u00e9l\u00e9 et suivi le messager. Inscris-nous parmi les t\u00e9moins.",reward:"Du\u2019a des disciples de \u2019Issa (J\u00e9sus). Ils demandent \u00e0 \u00eatre inscrits parmi ceux qui attestent de la v\u00e9rit\u00e9."},
        {type:"verset",ref:"Al Imran 3:147",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0627\u063a\u0652\u0641\u0650\u0631\u0652 \u0644\u064e\u0646\u064e\u0627 \u0630\u064f\u0646\u064f\u0648\u0628\u064e\u0646\u064e\u0627 \u0648\u064e\u0625\u0650\u0633\u0652\u0631\u064e\u0627\u0641\u064e\u0646\u064e\u0627 \u0641\u0650\u064a \u0623\u064e\u0645\u0652\u0631\u0650\u0646\u064e\u0627 \u0648\u064e\u062b\u064e\u0628\u0651\u0650\u062a\u0652 \u0623\u064e\u0642\u0652\u062f\u064e\u0627\u0645\u064e\u0646\u064e\u0627 \u0648\u064e\u0627\u0646\u0652\u0635\u064f\u0631\u0652\u0646\u064e\u0627 \u0639\u064e\u0644\u064e\u0649 \u0627\u0644\u0652\u0642\u064e\u0648\u0652\u0645\u0650 \u0627\u0644\u0652\u0643\u064e\u0627\u0641\u0650\u0631\u0650\u064a\u0646\u064e",ph:"Rabbanagh-fir lana dhunubana wa israfana fi amrina wa thabbit aqdamana wansurna 'alal-qawmil-kafirin.",fr:"Notre Seigneur, pardonne-nous nos p\u00e9ch\u00e9s et nos exc\u00e8s, affermis nos pas.",reward:"Du\u2019a des combattants pour la cause d\u2019Allah. Allah leur accorda la r\u00e9compense d\u2019ici-bas et la meilleure r\u00e9compense de l\u2019au-del\u00e0."},
        {type:"verset",ref:"Al Imran 3:191",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0645\u064e\u0627 \u062e\u064e\u0644\u064e\u0642\u0652\u062a\u064e \u0647\u064e\u0630\u064e\u0627 \u0628\u064e\u0627\u0637\u0650\u0644\u064b\u0627 \u0633\u064f\u0628\u0652\u062d\u064e\u0627\u0646\u064e\u0643\u064e \u0641\u064e\u0642\u0650\u0646\u064e\u0627 \u0639\u064e\u0630\u064e\u0627\u0628\u064e \u0627\u0644\u0646\u0651\u064e\u0627\u0631\u0650",ph:"Rabbana ma khalaqta hadha batilan, Subhanaka faqina 'adhaban-Nar.",fr:"Notre Seigneur, Tu n\u2019as pas cr\u00e9\u00e9 cela en vain. Gloire \u00e0 Toi ! Pr\u00e9serve-nous du ch\u00e2timent du Feu.",reward:"Du\u2019a des gens dou\u00e9s d\u2019intelligence qui m\u00e9ditent sur la cr\u00e9ation des cieux et de la terre, debout, assis et couch\u00e9s."},
        {type:"verset",ref:"Al-A\u2019raf 7:23",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0638\u064e\u0644\u064e\u0645\u0652\u0646\u064e\u0627 \u0623\u064e\u0646\u0652\u0641\u064f\u0633\u064e\u0646\u064e\u0627 \u0648\u064e\u0625\u0650\u0646\u0652 \u0644\u064e\u0645\u0652 \u062a\u064e\u063a\u0652\u0641\u0650\u0631\u0652 \u0644\u064e\u0646\u064e\u0627 \u0648\u064e\u062a\u064e\u0631\u0652\u062d\u064e\u0645\u0652\u0646\u064e\u0627 \u0644\u064e\u0646\u064e\u0643\u064f\u0648\u0646\u064e\u0646\u0651\u064e \u0645\u0650\u0646\u064e \u0627\u0644\u0652\u062e\u064e\u0627\u0633\u0650\u0631\u0650\u064a\u0646\u064e",ph:"Rabbana dhalamna anfusana wa in lam taghfir lana wa tarhamna lanakunanna minal-khasirin.",fr:"Notre Seigneur, nous nous sommes fait du tort. Si Tu ne nous pardonnes pas et ne nous fais pas mis\u00e9ricorde, nous serons des perdants.",reward:"Premi\u00e8re du\u2019a de l\u2019humanit\u00e9 : celle d\u2019Adam et Hawwa apr\u00e8s leur faute. Mod\u00e8le parfait du repentir sinc\u00e8re."},
        {type:"verset",ref:"Al-Hashr 59:10",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0627\u063a\u0652\u0641\u0650\u0631\u0652 \u0644\u064e\u0646\u064e\u0627 \u0648\u064e\u0644\u0650\u0625\u0650\u062e\u0652\u0648\u064e\u0627\u0646\u0650\u0646\u064e\u0627 \u0627\u0644\u0651\u064e\u0630\u0650\u064a\u0646\u064e \u0633\u064e\u0628\u064e\u0642\u064f\u0648\u0646\u064e\u0627 \u0628\u0650\u0627\u0644\u0652\u0625\u0650\u064a\u0645\u064e\u0627\u0646\u0650 \u0648\u064e\u0644\u064e\u0627 \u062a\u064e\u062c\u0652\u0639\u064e\u0644\u0652 \u0641\u0650\u064a \u0642\u064f\u0644\u064f\u0648\u0628\u0650\u0646\u064e\u0627 \u063a\u0650\u0644\u0651\u064b\u0627 \u0644\u0650\u0644\u0651\u064e\u0630\u0650\u064a\u0646\u064e \u0622\u0645\u064e\u0646\u064f\u0648\u0627 \u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0625\u0650\u0646\u0651\u064e\u0643\u064e \u0631\u064e\u0621\u064f\u0648\u0641\u064c \u0631\u064e\u062d\u0650\u064a\u0645\u064c",ph:"Rabbanagh-fir lana wa li ikhwaninal-ladhina sabaquna bil-iman, wa la taj'al fi qulubina ghillan lil-ladhina amanu. Rabbana innaka Ra'ufun Rahim.",fr:"Notre Seigneur, pardonne-nous ainsi qu\u2019\u00e0 nos fr\u00e8res qui nous ont pr\u00e9c\u00e9d\u00e9s dans la foi, et ne mets pas dans nos c\u0153urs de rancune envers les croyants.",reward:"Du\u2019a pour la fraternit\u00e9 entre croyants de toutes les g\u00e9n\u00e9rations et la purification du c\u0153ur de toute rancune."},
        {type:"verset",ref:"At-Tahrim 66:8",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0623\u064e\u062a\u0652\u0645\u0650\u0645\u0652 \u0644\u064e\u0646\u064e\u0627 \u0646\u064f\u0648\u0631\u064e\u0646\u064e\u0627 \u0648\u064e\u0627\u063a\u0652\u0641\u0650\u0631\u0652 \u0644\u064e\u0646\u064e\u0627 \u0625\u0650\u0646\u0651\u064e\u0643\u064e \u0639\u064e\u0644\u064e\u0649 \u0643\u064f\u0644\u0651\u0650 \u0634\u064e\u064a\u0652\u0621\u0613 \u0642\u064e\u062f\u0650\u064a\u0631\u064c",ph:"Rabbana atmim lana nurana waghfir lana innaka 'ala kulli shay'in Qadir.",fr:"Notre Seigneur, parfais-nous notre lumi\u00e8re et pardonne-nous, car Tu es Omnipotent.",reward:"Du\u2019a des croyants le Jour du Jugement quand leur lumi\u00e8re courra devant eux et \u00e0 leur droite sur le Sirat."},
        {type:"verset",ref:"Al-Furqan 25:74",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0647\u064e\u0628\u0652 \u0644\u064e\u0646\u064e\u0627 \u0645\u0650\u0646\u0652 \u0623\u064e\u0632\u0652\u0648\u064e\u0627\u062c\u0650\u0646\u064e\u0627 \u0648\u064e\u0630\u064f\u0631\u0651\u0650\u064a\u0651\u064e\u0627\u062a\u0650\u0646\u064e\u0627 \u0642\u064f\u0631\u0651\u064e\u0629\u064e \u0623\u064e\u0639\u0652\u064a\u064f\u0646\u0613 \u0648\u064e\u0627\u062c\u0652\u0639\u064e\u0644\u0652\u0646\u064e\u0627 \u0644\u0650\u0644\u0652\u0645\u064f\u062a\u0651\u064e\u0642\u0650\u064a\u0646\u064e \u0625\u0650\u0645\u064e\u0627\u0645\u064b\u0627",ph:"Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama.",fr:"Notre Seigneur, fais que nos \u00e9pouses et nos descendants soient la joie de nos yeux, et fais de nous des mod\u00e8les pour les pieux.",reward:"Du\u2019a des serviteurs du Tr\u00e8s Mis\u00e9ricordieux (Ibad ar-Rahman). La plus belle invocation pour la famille pieuse."},
        {type:"verset",ref:"Ibrahim 14:40",ar:"\u0631\u064e\u0628\u0651\u0650 \u0627\u062c\u0652\u0639\u064e\u0644\u0652\u0646\u0650\u064a \u0645\u064f\u0642\u0650\u064a\u0645\u064e \u0627\u0644\u0635\u0651\u064e\u0644\u064e\u0627\u0629\u0650 \u0648\u064e\u0645\u0650\u0646\u0652 \u0630\u064f\u0631\u0651\u0650\u064a\u0651\u064e\u062a\u0650\u064a \u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0648\u064e\u062a\u064e\u0642\u064e\u0628\u0651\u064e\u0644\u0652 \u062f\u064f\u0639\u064e\u0627\u0621\u0650",ph:"Rabbij-'alni muqimas-salati wa min dhurriyyati, Rabbana wa taqabbal du'a'.",fr:"Seigneur ! Fais que j\u2019accomplisse assid\u00fbment la pri\u00e8re ainsi qu\u2019une partie de ma descendance. Notre Seigneur, exauce ma pri\u00e8re.",reward:"Du\u2019a d\u2019Ibrahim pour la pers\u00e9v\u00e9rance dans la pri\u00e8re. Il demande cette gr\u00e2ce pour lui et sa descendance."},
        {type:"verset",ref:"Ibrahim 14:41",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0627\u063a\u0652\u0641\u0650\u0631\u0652 \u0644\u0650\u064a \u0648\u064e\u0644\u0650\u0648\u064e\u0627\u0644\u0650\u062f\u064e\u064a\u064e\u0651 \u0648\u064e\u0644\u0650\u0644\u0652\u0645\u064f\u0624\u0652\u0645\u0650\u0646\u0650\u064a\u0646\u064e \u064a\u064e\u0648\u0652\u0645\u064e \u064a\u064e\u0642\u064f\u0648\u0645\u064f \u0627\u0644\u0652\u062d\u0650\u0633\u064e\u0627\u0628\u064f",ph:"Rabbanagh-fir li wa li walidayya wa lil-mu'minina yawma yaqumul-hisab.",fr:"Notre Seigneur, pardonne-moi, \u00e0 mes parents et aux croyants le jour o\u00f9 se dressera le Compte.",reward:"Du\u2019a d\u2019Ibrahim englobant le pardon pour soi, ses parents et tous les croyants. Invocation universelle de mis\u00e9ricorde."},
        {type:"verset",ref:"Al-Kahf 18:10",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0622\u062a\u0650\u0646\u064e\u0627 \u0645\u0650\u0646\u0652 \u0644\u064e\u062f\u064f\u0646\u0652\u0643\u064e \u0631\u064e\u062d\u0652\u0645\u064e\u0629\u064b \u0648\u064e\u0647\u064e\u064a\u0651\u0650\u0626\u0652 \u0644\u064e\u0646\u064e\u0627 \u0645\u0650\u0646\u0652 \u0623\u064e\u0645\u0652\u0631\u0650\u0646\u064e\u0627 \u0631\u064e\u0634\u064e\u062f\u064b\u0627",ph:"Rabbana atina min ladunka rahmatan wa hayyi' lana min amrina rashada.",fr:"Notre Seigneur, accorde-nous de Ta part une mis\u00e9ricorde et assure-nous la droiture dans notre affaire.",reward:"Du\u2019a des Gens de la Caverne (Ahl al-Kahf) avant de s\u2019endormir 309 ans. Allah leur accorda Sa mis\u00e9ricorde et guida leur affaire."},
        {type:"verset",ref:"Ta-Ha 20:45",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0625\u0650\u0646\u0651\u064e\u0646\u064e\u0627 \u0646\u064e\u062e\u064e\u0627\u0641\u064f \u0623\u064e\u0646\u0652 \u064a\u064e\u0641\u0652\u0631\u064f\u0637\u064e \u0639\u064e\u0644\u064e\u064a\u0652\u0646\u064e\u0627 \u0623\u064e\u0648\u0652 \u0623\u064e\u0646\u0652 \u064a\u064e\u0637\u0652\u063a\u064e\u0649",ph:"Rabbana innana nakhafu an yafruta 'alayna aw an yatgha.",fr:"Notre Seigneur, nous craignons qu\u2019il ne nous maltraite ou qu\u2019il ne transgresse.",reward:"Du\u2019a de Moussa et Haroun envoy\u00e9s \u00e0 Pharaon. Allah les rassura : \u00ab Ne craignez rien, Je suis avec vous. \u00bb"},
        {type:"verset",ref:"Al-Mu\u2019minun 23:109",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0622\u0645\u064e\u0646\u0651\u064e\u0627 \u0641\u064e\u0627\u063a\u0652\u0641\u0650\u0631\u0652 \u0644\u064e\u0646\u064e\u0627 \u0648\u064e\u0627\u0631\u0652\u062d\u064e\u0645\u0652\u0646\u064e\u0627 \u0648\u064e\u0623\u064e\u0646\u0652\u062a\u064e \u062e\u064e\u064a\u0652\u0631\u064f \u0627\u0644\u0631\u0651\u064e\u0627\u062d\u0650\u0645\u0650\u064a\u0646\u064e",ph:"Rabbana amanna faghfir lana warhamna wa Anta khayrur-rahimin.",fr:"Notre Seigneur, nous avons cru. Pardonne-nous et accorde-nous Ta mis\u00e9ricorde, car Tu es le Meilleur des mis\u00e9ricordieux.",reward:"Du\u2019a des croyants qui subissaient les moqueries. Allah les r\u00e9compensa pour leur patience."},
        {type:"verset",ref:"Al-Mu\u2019minun 23:118",ar:"\u0631\u064e\u0628\u0651\u0650 \u0627\u063a\u0652\u0641\u0650\u0631\u0652 \u0648\u064e\u0627\u0631\u0652\u062d\u064e\u0645\u0652 \u0648\u064e\u0623\u064e\u0646\u0652\u062a\u064e \u062e\u064e\u064a\u0652\u0631\u064f \u0627\u0644\u0631\u0651\u064e\u0627\u062d\u0650\u0645\u0650\u064a\u0646\u064e",ph:"Rabbighfir warham wa Anta khayrur-rahimin.",fr:"Seigneur, pardonne et accorde Ta mis\u00e9ricorde, car Tu es le Meilleur des mis\u00e9ricordieux.",reward:"Dernier verset de Sourate al-Mu\u2019minun. Du\u2019a concise qui r\u00e9sume l\u2019essentiel : le pardon et la mis\u00e9ricorde d\u2019Allah."},
        {type:"verset",ref:"Al-Furqan 25:65-66",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0627\u0635\u0652\u0631\u0650\u0641\u0652 \u0639\u064e\u0646\u0651\u064e\u0627 \u0639\u064e\u0630\u064e\u0627\u0628\u064e \u062c\u064e\u0647\u064e\u0646\u0651\u064e\u0645\u064e \u0625\u0650\u0646\u0651\u064e \u0639\u064e\u0630\u064e\u0627\u0628\u064e\u0647\u064e\u0627 \u0643\u064e\u0627\u0646\u064e \u063a\u064e\u0631\u064e\u0627\u0645\u064b\u0627 \u0625\u0650\u0646\u0651\u064e\u0647\u064e\u0627 \u0633\u064e\u0627\u0621\u064e\u062a\u0652 \u0645\u064f\u0633\u0652\u062a\u064e\u0642\u064e\u0631\u0651\u064b\u0627 \u0648\u064e\u0645\u064f\u0642\u064e\u0627\u0645\u064b\u0627",ph:"Rabbanasrif 'anna 'adhaba Jahannama inna 'adhabaha kana gharama. Innaha sa'at mustaqarran wa muqama.",fr:"Notre Seigneur, \u00e9carte de nous le ch\u00e2timent de l\u2019Enfer, car son ch\u00e2timent est permanent. Quel mauvais g\u00eete et quelle mauvaise demeure !",reward:"Du\u2019a des serviteurs du Tr\u00e8s Mis\u00e9ricordieux (Ibad ar-Rahman) qui craignent l\u2019Enfer et d\u00e9pensent avec mod\u00e9ration."},
        {type:"verset",ref:"Al-Baqarah 2:129",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0648\u064e\u0627\u0628\u0652\u0639\u064e\u062b\u0652 \u0641\u0650\u064a\u0647\u0650\u0645\u0652 \u0631\u064e\u0633\u064f\u0648\u0644\u064b\u0627 \u0645\u0650\u0646\u0652\u0647\u064f\u0645\u0652 \u064a\u064e\u062a\u0652\u0644\u064f\u0648 \u0639\u064e\u0644\u064e\u064a\u0652\u0647\u0650\u0645\u0652 \u0622\u064a\u064e\u0627\u062a\u0650\u0643\u064e \u0648\u064e\u064a\u064f\u0639\u064e\u0644\u0651\u0650\u0645\u064f\u0647\u064f\u0645\u064f \u0627\u0644\u0652\u0643\u0650\u062a\u064e\u0627\u0628\u064e \u0648\u064e\u0627\u0644\u0652\u062d\u0650\u0643\u0652\u0645\u064e\u0629\u064e \u0648\u064e\u064a\u064f\u0632\u064e\u0643\u0651\u0650\u064a\u0647\u0650\u0645\u0652 \u0625\u0650\u0646\u0651\u064e\u0643\u064e \u0623\u064e\u0646\u0652\u062a\u064e \u0627\u0644\u0652\u0639\u064e\u0632\u0650\u064a\u0632\u064f \u0627\u0644\u0652\u062d\u064e\u0643\u0650\u064a\u0645\u064f",ph:"Rabbana wab'ath fihim Rasulan minhum yatlu 'alayhim ayatika wa yu'allimuhumul-Kitaba wal-Hikmata wa yuzakkihim, innaka Antal-'Azizul-Hakim.",fr:"Notre Seigneur, envoie-leur un messager issu d\u2019eux qui leur r\u00e9citera Tes versets, leur enseignera le Livre et la Sagesse, et les purifiera. Tu es le Puissant, le Sage.",reward:"Du\u2019a d\u2019Ibrahim exauc\u00e9e par l\u2019envoi du Proph\u00e8te Muhammad \uFEDF, qui a dit : \u00ab Je suis l\u2019invocation de mon p\u00e8re Ibrahim. \u00bb"},
        {type:"verset",ref:"Al Imran 3:9",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0625\u0650\u0646\u0651\u064e\u0643\u064e \u062c\u064e\u0627\u0645\u0650\u0639\u064f \u0627\u0644\u0646\u0651\u064e\u0627\u0633\u0650 \u0644\u0650\u064a\u064e\u0648\u0652\u0645\u0613 \u0644\u064e\u0627 \u0631\u064e\u064a\u0652\u0628\u064e \u0641\u0650\u064a\u0647\u0650 \u0625\u0650\u0646\u0651\u064e \u0627\u0644\u0644\u0651\u064e\u0647\u064e \u0644\u064e\u0627 \u064a\u064f\u062e\u0652\u0644\u0650\u0641\u064f \u0627\u0644\u0652\u0645\u0650\u064a\u0639\u064e\u0627\u062f\u064e",ph:"Rabbana innaka Jami'un-nasi li yawmin la rayba fih, innallaha la yukhliful-mi'ad.",fr:"Notre Seigneur, Tu es Celui qui rassemblera les gens en un Jour au sujet duquel il n\u2019y a aucun doute. Allah ne manque jamais \u00e0 Sa promesse.",reward:"Affirmation de la foi au Jour du Rassemblement. Les gens de science fermes affirment la promesse certaine d\u2019Allah."},
        {type:"verset",ref:"Al Imran 3:38",ar:"\u0631\u064e\u0628\u0651\u0650 \u0647\u064e\u0628\u0652 \u0644\u0650\u064a \u0645\u0650\u0646\u0652 \u0644\u064e\u062f\u064f\u0646\u0652\u0643\u064e \u0630\u064f\u0631\u0651\u0650\u064a\u0651\u064e\u0629\u064b \u0637\u064e\u064a\u0651\u0650\u0628\u064e\u0629\u064b \u0625\u0650\u0646\u0651\u064e\u0643\u064e \u0633\u064e\u0645\u0650\u064a\u0639\u064f \u0627\u0644\u062f\u0651\u064f\u0639\u064e\u0627\u0621\u0650",ph:"Rabbi hab li min ladunka dhurriyyatan tayyibah, innaka Sami'ud-du'a'.",fr:"Seigneur, accorde-moi de Ta part une descendance b\u00e9nie. Tu es Celui qui entend les pri\u00e8res.",reward:"Du\u2019a de Zakariya exauc\u00e9e par la naissance de Yahya. Elle montre qu\u2019Allah r\u00e9pond m\u00eame quand tout semble impossible."},
        {type:"verset",ref:"Al Imran 3:192",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0625\u0650\u0646\u0651\u064e\u0643\u064e \u0645\u064e\u0646\u0652 \u062a\u064f\u062f\u0652\u062e\u0650\u0644\u0650 \u0627\u0644\u0646\u0651\u064e\u0627\u0631\u064e \u0641\u064e\u0642\u064e\u062f\u0652 \u0623\u064e\u062e\u0652\u0632\u064e\u064a\u0652\u062a\u064e\u0647\u064f \u0648\u064e\u0645\u064e\u0627 \u0644\u0650\u0644\u0638\u0651\u064e\u0627\u0644\u0650\u0645\u0650\u064a\u0646\u064e \u0645\u0650\u0646\u0652 \u0623\u064e\u0646\u0652\u0635\u064e\u0627\u0631\u0613",ph:"Rabbana innaka man tudkhilin-Nara faqad akhzaytah, wa ma lidh-dhalimina min ansar.",fr:"Notre Seigneur, celui que Tu fais entrer dans le Feu, Tu l\u2019as couvert d\u2019ignominie. Et pour les injustes, il n\u2019y a pas de secoureurs.",reward:"Rappel de la gravit\u00e9 de l\u2019Enfer pour \u00e9veiller la crainte d\u2019Allah et motiver les bonnes \u0153uvres."},
        {type:"verset",ref:"Al Imran 3:193",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0625\u0650\u0646\u0651\u064e\u0646\u064e\u0627 \u0633\u064e\u0645\u0650\u0639\u0652\u0646\u064e\u0627 \u0645\u064f\u0646\u064e\u0627\u062f\u0650\u064a\u064b\u0627 \u064a\u064f\u0646\u064e\u0627\u062f\u0650\u064a \u0644\u0650\u0644\u0652\u0625\u0650\u064a\u0645\u064e\u0627\u0646\u0650 \u0623\u064e\u0646\u0652 \u0622\u0645\u0650\u0646\u064f\u0648\u0627 \u0628\u0650\u0631\u064e\u0628\u0651\u0650\u0643\u064f\u0645\u0652 \u0641\u064e\u0622\u0645\u064e\u0646\u0651\u064e\u0627 \u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0641\u064e\u0627\u063a\u0652\u0641\u0650\u0631\u0652 \u0644\u064e\u0646\u064e\u0627 \u0630\u064f\u0646\u064f\u0648\u0628\u064e\u0646\u064e\u0627 \u0648\u064e\u0643\u064e\u0641\u0651\u0650\u0631\u0652 \u0639\u064e\u0646\u0651\u064e\u0627 \u0633\u064e\u064a\u0651\u0650\u0626\u064e\u0627\u062a\u0650\u0646\u064e\u0627 \u0648\u064e\u062a\u064e\u0648\u064e\u0641\u0651\u064e\u0646\u064e\u0627 \u0645\u064e\u0639\u064e \u0627\u0644\u0652\u0623\u064e\u0628\u0652\u0631\u064e\u0627\u0631\u0650",ph:"Rabbana innana sami'na munadiyan yunadi lil-imani an aminu bi Rabbikum fa amanna. Rabbana faghfir lana dhunubana wa kaffir 'anna sayyi'atina wa tawaffana ma'al-abrar.",fr:"Notre Seigneur, nous avons entendu un appeleur appeler \u00e0 la foi : \u00ab Croyez en votre Seigneur ! \u00bb et nous avons cru. Pardonne-nous nos p\u00e9ch\u00e9s, efface nos m\u00e9faits et fais-nous mourir avec les vertueux.",reward:"Du\u2019a de ceux qui m\u00e9ditent la cr\u00e9ation. Ils r\u00e9pondirent \u00e0 l\u2019appel de la foi et demandent une bonne fin."},
        {type:"verset",ref:"Al Imran 3:194",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0648\u064e\u0622\u062a\u0650\u0646\u064e\u0627 \u0645\u064e\u0627 \u0648\u064e\u0639\u064e\u062f\u0652\u062a\u064e\u0646\u064e\u0627 \u0639\u064e\u0644\u064e\u0649 \u0631\u064f\u0633\u064f\u0644\u0650\u0643\u064e \u0648\u064e\u0644\u064e\u0627 \u062a\u064f\u062e\u0652\u0632\u0650\u0646\u064e\u0627 \u064a\u064e\u0648\u0652\u0645\u064e \u0627\u0644\u0652\u0642\u0650\u064a\u064e\u0627\u0645\u064e\u0629\u0650 \u0625\u0650\u0646\u0651\u064e\u0643\u064e \u0644\u064e\u0627 \u062a\u064f\u062e\u0652\u0644\u0650\u0641\u064f \u0627\u0644\u0652\u0645\u0650\u064a\u0639\u064e\u0627\u062f\u064e",ph:"Rabbana wa atina ma wa'adtana 'ala rusulika wa la tukhzina yawmal-qiyamah, innaka la tukhliful-mi'ad.",fr:"Notre Seigneur, accorde-nous ce que Tu nous as promis par Tes messagers et ne nous couvre pas d\u2019ignominie le Jour de la R\u00e9surrection. Tu ne manques jamais \u00e0 Ta promesse.",reward:"Demande de r\u00e9alisation des promesses divines et de protection contre la honte au Jour dernier."},
        {type:"verset",ref:"An-Nisa 4:75",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0623\u064e\u062e\u0652\u0631\u0650\u062c\u0652\u0646\u064e\u0627 \u0645\u0650\u0646\u0652 \u0647\u064e\u0630\u0650\u0647\u0650 \u0627\u0644\u0652\u0642\u064e\u0631\u0652\u064a\u064e\u0629\u0650 \u0627\u0644\u0638\u0651\u064e\u0627\u0644\u0650\u0645\u0650 \u0623\u064e\u0647\u0652\u0644\u064f\u0647\u064e\u0627 \u0648\u064e\u0627\u062c\u0652\u0639\u064e\u0644\u0652 \u0644\u064e\u0646\u064e\u0627 \u0645\u0650\u0646\u0652 \u0644\u064e\u062f\u064f\u0646\u0652\u0643\u064e \u0648\u064e\u0644\u0650\u064a\u0651\u064b\u0627 \u0648\u064e\u0627\u062c\u0652\u0639\u064e\u0644\u0652 \u0644\u064e\u0646\u064e\u0627 \u0645\u0650\u0646\u0652 \u0644\u064e\u062f\u064f\u0646\u0652\u0643\u064e \u0646\u064e\u0635\u0650\u064a\u0631\u064b\u0627",ph:"Rabbana akhrijna min hadhihil-qaryatidh-dhalimi ahluha, waj'al lana min ladunka waliyyan waj'al lana min ladunka nasira.",fr:"Notre Seigneur, fais-nous sortir de cette cit\u00e9 dont les gens sont injustes, et assigne-nous de Ta part un alli\u00e9 et un secoureur.",reward:"Du\u2019a des opprim\u00e9s de La Mecque. Elle exprime le recours \u00e0 Allah contre l\u2019injustice et la pers\u00e9cution."},
        {type:"verset",ref:"Al-Ma\u2019idah 5:83",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0622\u0645\u064e\u0646\u0651\u064e\u0627 \u0641\u064e\u0627\u0643\u0652\u062a\u064f\u0628\u0652\u0646\u064e\u0627 \u0645\u064e\u0639\u064e \u0627\u0644\u0634\u0651\u064e\u0627\u0647\u0650\u062f\u0650\u064a\u0646\u064e",ph:"Rabbana amanna faktubna ma'ash-shahidin.",fr:"Notre Seigneur, nous avons cru. Inscris-nous parmi les t\u00e9moins.",reward:"Du\u2019a de ceux qui \u00e9coutent la R\u00e9v\u00e9lation et dont les yeux d\u00e9bordent de larmes en reconnaissant la v\u00e9rit\u00e9."},
        {type:"verset",ref:"Al-Ma\u2019idah 5:114",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0623\u064e\u0646\u0652\u0632\u0650\u0644\u0652 \u0639\u064e\u0644\u064e\u064a\u0652\u0646\u064e\u0627 \u0645\u064e\u0627\u0626\u0650\u062f\u064e\u0629\u064b \u0645\u0650\u0646\u064e \u0627\u0644\u0633\u0651\u064e\u0645\u064e\u0627\u0621\u0650 \u062a\u064e\u0643\u064f\u0648\u0646\u064f \u0644\u064e\u0646\u064e\u0627 \u0639\u0650\u064a\u062f\u064b\u0627 \u0644\u0650\u0623\u064e\u0648\u0651\u064e\u0644\u0650\u0646\u064e\u0627 \u0648\u064e\u0622\u062e\u0650\u0631\u0650\u0646\u064e\u0627 \u0648\u064e\u0622\u064a\u064e\u0629\u064b \u0645\u0650\u0646\u0652\u0643\u064e \u0648\u064e\u0627\u0631\u0652\u0632\u064f\u0642\u0652\u0646\u064e\u0627 \u0648\u064e\u0623\u064e\u0646\u0652\u062a\u064e \u062e\u064e\u064a\u0652\u0631\u064f \u0627\u0644\u0631\u0651\u064e\u0627\u0632\u0650\u0642\u0650\u064a\u0646\u064e",ph:"Rabbana anzil 'alayna ma'idatan minas-sama'i takunu lana 'idan li awwalina wa akhirina wa ayatan minka warzuqna wa Anta khayrur-raziqin.",fr:"Notre Seigneur, fais descendre du ciel sur nous une table servie qui soit une f\u00eate pour les premiers comme pour les derniers, et un signe de Ta part. Nourris-nous, Tu es le Meilleur des pourvoyeurs.",reward:"Du\u2019a de \u2019Issa (J\u00e9sus) demandant la table c\u00e9leste. Allah la fit descendre comme signe et \u00e9preuve."},
        {type:"verset",ref:"Al-A\u2019raf 7:47",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0644\u064e\u0627 \u062a\u064e\u062c\u0652\u0639\u064e\u0644\u0652\u0646\u064e\u0627 \u0645\u064e\u0639\u064e \u0627\u0644\u0652\u0642\u064e\u0648\u0652\u0645\u0650 \u0627\u0644\u0638\u0651\u064e\u0627\u0644\u0650\u0645\u0650\u064a\u0646\u064e",ph:"Rabbana la taj'alna ma'al-qawmidh-dhalimin.",fr:"Notre Seigneur, ne nous mets pas avec les gens injustes.",reward:"Du\u2019a des gens d\u2019al-A\u2019raf qui voient les gens de l\u2019Enfer et implorent Allah de ne pas les y mettre."},
        {type:"verset",ref:"Al-A\u2019raf 7:126",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0623\u064e\u0641\u0652\u0631\u0650\u063a\u0652 \u0639\u064e\u0644\u064e\u064a\u0652\u0646\u064e\u0627 \u0635\u064e\u0628\u0652\u0631\u064b\u0627 \u0648\u064e\u062a\u064e\u0648\u064e\u0641\u0651\u064e\u0646\u064e\u0627 \u0645\u064f\u0633\u0652\u0644\u0650\u0645\u0650\u064a\u0646\u064e",ph:"Rabbana afrigh 'alayna sabran wa tawaffana muslimin.",fr:"Notre Seigneur, d\u00e9verse sur nous la patience et fais-nous mourir en \u00e9tat de soumission \u00e0 Toi.",reward:"Du\u2019a des magiciens de Pharaon apr\u00e8s avoir cru en Moussa. Ils pr\u00e9f\u00e9r\u00e8rent la mort en musulmans aux menaces de Pharaon."},
        {type:"verset",ref:"Yunus 10:85-86",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0644\u064e\u0627 \u062a\u064e\u062c\u0652\u0639\u064e\u0644\u0652\u0646\u064e\u0627 \u0641\u0650\u062a\u0652\u0646\u064e\u0629\u064b \u0644\u0650\u0644\u0652\u0642\u064e\u0648\u0652\u0645\u0650 \u0627\u0644\u0638\u0651\u064e\u0627\u0644\u0650\u0645\u0650\u064a\u0646\u064e \u0648\u064e\u0646\u064e\u062c\u0651\u0650\u0646\u064e\u0627 \u0628\u0650\u0631\u064e\u062d\u0652\u0645\u064e\u062a\u0650\u0643\u064e \u0645\u0650\u0646\u064e \u0627\u0644\u0652\u0642\u064e\u0648\u0652\u0645\u0650 \u0627\u0644\u0652\u0643\u064e\u0627\u0641\u0650\u0631\u0650\u064a\u0646\u064e",ph:"Rabbana la taj'alna fitnatan lil-qawmidh-dhalimin. Wa najjina bi rahmatika minal-qawmil-kafirin.",fr:"Notre Seigneur, ne fais pas de nous un objet de tentation pour les gens injustes, et sauve-nous par Ta mis\u00e9ricorde des gens m\u00e9cr\u00e9ants.",reward:"Du\u2019a de Moussa et de son peuple face \u00e0 la pers\u00e9cution de Pharaon. Demande de ne pas devenir un argument contre la foi."},
        {type:"verset",ref:"Ibrahim 14:38",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0625\u0650\u0646\u0651\u064e\u0643\u064e \u062a\u064e\u0639\u0652\u0644\u064e\u0645\u064f \u0645\u064e\u0627 \u0646\u064f\u062e\u0652\u0641\u0650\u064a \u0648\u064e\u0645\u064e\u0627 \u0646\u064f\u0639\u0652\u0644\u0650\u0646\u064f \u0648\u064e\u0645\u064e\u0627 \u064a\u064e\u062e\u0652\u0641\u064e\u0649 \u0639\u064e\u0644\u064e\u0649 \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \u0645\u0650\u0646\u0652 \u0634\u064e\u064a\u0652\u0621\u0613 \u0641\u0650\u064a \u0627\u0644\u0652\u0623\u064e\u0631\u0652\u0636\u0650 \u0648\u064e\u0644\u064e\u0627 \u0641\u0650\u064a \u0627\u0644\u0633\u0651\u064e\u0645\u064e\u0627\u0621\u0650",ph:"Rabbana innaka ta'lamu ma nukhfi wa ma nu'lin, wa ma yakhfa 'alallahi min shay'in fil-ardi wa la fis-sama'.",fr:"Notre Seigneur, Tu sais ce que nous cachons et ce que nous divulguons. Rien sur terre ni au ciel ne se cache \u00e0 Allah.",reward:"Du\u2019a d\u2019Ibrahim reconnaissant la science absolue d\u2019Allah. Rien n\u2019\u00e9chappe \u00e0 Allah, ni en secret ni en public."},
        {type:"verset",ref:"Ghafir 40:7",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0648\u064e\u0633\u0650\u0639\u0652\u062a\u064e \u0643\u064f\u0644\u0651\u064e \u0634\u064e\u064a\u0652\u0621\u0613 \u0631\u064e\u062d\u0652\u0645\u064e\u0629\u064b \u0648\u064e\u0639\u0650\u0644\u0652\u0645\u064b\u0627 \u0641\u064e\u0627\u063a\u0652\u0641\u0650\u0631\u0652 \u0644\u0650\u0644\u0651\u064e\u0630\u0650\u064a\u0646\u064e \u062a\u064e\u0627\u0628\u064f\u0648\u0627 \u0648\u064e\u0627\u062a\u0651\u064e\u0628\u064e\u0639\u064f\u0648\u0627 \u0633\u064e\u0628\u0650\u064a\u0644\u064e\u0643\u064e \u0648\u064e\u0642\u0650\u0647\u0650\u0645\u0652 \u0639\u064e\u0630\u064e\u0627\u0628\u064e \u0627\u0644\u0652\u062c\u064e\u062d\u0650\u064a\u0645\u0650",ph:"Rabbana wasi'ta kulla shay'in rahmatan wa 'ilman, faghfir lilladhina tabu wattaba'u sabilaka wa qihim 'adhabal-Jahim.",fr:"Notre Seigneur, Tu embrasses toute chose de Ta mis\u00e9ricorde et de Ta science. Pardonne \u00e0 ceux qui se repentent et suivent Ton chemin, et prot\u00e8ge-les du ch\u00e2timent de l\u2019Enfer.",reward:"Du\u2019a des anges porteurs du Tr\u00f4ne en faveur des croyants. Les anges implorent le pardon pour ceux qui se repentent."},
        {type:"verset",ref:"Ghafir 40:8-9",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0648\u064e\u0623\u064e\u062f\u0652\u062e\u0650\u0644\u0652\u0647\u064f\u0645\u0652 \u062c\u064e\u0646\u0651\u064e\u0627\u062a\u0650 \u0639\u064e\u062f\u0652\u0646\u0613 \u0627\u0644\u0651\u064e\u062a\u0650\u064a \u0648\u064e\u0639\u064e\u062f\u0652\u062a\u064e\u0647\u064f\u0645\u0652 \u0648\u064e\u0645\u064e\u0646\u0652 \u0635\u064e\u0644\u064e\u062d\u064e \u0645\u0650\u0646\u0652 \u0622\u0628\u064e\u0627\u0626\u0650\u0647\u0650\u0645\u0652 \u0648\u064e\u0623\u064e\u0632\u0652\u0648\u064e\u0627\u062c\u0650\u0647\u0650\u0645\u0652 \u0648\u064e\u0630\u064f\u0631\u0651\u0650\u064a\u0651\u064e\u0627\u062a\u0650\u0647\u0650\u0645\u0652 \u0625\u0650\u0646\u0651\u064e\u0643\u064e \u0623\u064e\u0646\u0652\u062a\u064e \u0627\u0644\u0652\u0639\u064e\u0632\u0650\u064a\u0632\u064f \u0627\u0644\u0652\u062d\u064e\u0643\u0650\u064a\u0645\u064f \u0648\u064e\u0642\u0650\u0647\u0650\u0645\u064f \u0627\u0644\u0633\u0651\u064e\u064a\u0651\u0650\u0626\u064e\u0627\u062a\u0650",ph:"Rabbana wa adkhilhum Jannati 'adninillati wa'adtahum wa man salaha min aba'ihim wa azwajihim wa dhurriyyatihim, innaka Antal-'Azizul-Hakim. Wa qihimus-sayyi'at.",fr:"Notre Seigneur, fais-les entrer dans les Jardins d\u2019\u00c9den que Tu leur as promis, ainsi que les vertueux parmi leurs anc\u00eatres, leurs \u00e9pouses et leurs descendants. Tu es le Puissant, le Sage. Et prot\u00e8ge-les des m\u00e9faits.",reward:"Suite de la du\u2019a des anges du Tr\u00f4ne. Ils demandent le Paradis pour les croyants et leurs familles vertueuses."},
        {type:"verset",ref:"Al-Mumtahanah 60:4",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0639\u064e\u0644\u064e\u064a\u0652\u0643\u064e \u062a\u064e\u0648\u064e\u0643\u0651\u064e\u0644\u0652\u0646\u064e\u0627 \u0648\u064e\u0625\u0650\u0644\u064e\u064a\u0652\u0643\u064e \u0623\u064e\u0646\u064e\u0628\u0652\u0646\u064e\u0627 \u0648\u064e\u0625\u0650\u0644\u064e\u064a\u0652\u0643\u064e \u0627\u0644\u0652\u0645\u064e\u0635\u0650\u064a\u0631\u064f",ph:"Rabbana 'alayka tawakkalna wa ilayka anabna wa ilaykal-masir.",fr:"Notre Seigneur, c\u2019est en Toi que nous pla\u00e7ons notre confiance, c\u2019est vers Toi que nous revenons repentants, et c\u2019est vers Toi le retour final.",reward:"Du\u2019a d\u2019Ibrahim et de ceux qui le suivaient. Mod\u00e8le de tawakkul (confiance totale en Allah)."},
        {type:"verset",ref:"Al-Mumtahanah 60:5",ar:"\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0644\u064e\u0627 \u062a\u064e\u062c\u0652\u0639\u064e\u0644\u0652\u0646\u064e\u0627 \u0641\u0650\u062a\u0652\u0646\u064e\u0629\u064b \u0644\u0650\u0644\u0651\u064e\u0630\u0650\u064a\u0646\u064e \u0643\u064e\u0641\u064e\u0631\u064f\u0648\u0627 \u0648\u064e\u0627\u063a\u0652\u0641\u0650\u0631\u0652 \u0644\u064e\u0646\u064e\u0627 \u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627 \u0625\u0650\u0646\u0651\u064e\u0643\u064e \u0623\u064e\u0646\u0652\u062a\u064e \u0627\u0644\u0652\u0639\u064e\u0632\u0650\u064a\u0632\u064f \u0627\u0644\u0652\u062d\u064e\u0643\u0650\u064a\u0645\u064f",ph:"Rabbana la taj'alna fitnatan lilladhina kafaru, waghfir lana Rabbana innaka Antal-'Azizul-Hakim.",fr:"Notre Seigneur, ne fais pas de nous un objet de tentation pour ceux qui ont m\u00e9cru. Pardonne-nous, car Tu es le Puissant, le Sage.",reward:"Demande de ne pas \u00eatre une cause de tentation pour les m\u00e9cr\u00e9ants, ni par notre faiblesse ni par notre \u00e9chec."},
        {type:"verset",ref:"At-Tahrim 66:11",ar:"\u0631\u064e\u0628\u0651\u0650 \u0627\u0628\u0652\u0646\u0650 \u0644\u0650\u064a \u0639\u0650\u0646\u0652\u062f\u064e\u0643\u064e \u0628\u064e\u064a\u0652\u062a\u064b\u0627 \u0641\u0650\u064a \u0627\u0644\u0652\u062c\u064e\u0646\u0651\u064e\u0629\u0650 \u0648\u064e\u0646\u064e\u062c\u0651\u0650\u0646\u0650\u064a \u0645\u0650\u0646\u0652 \u0641\u0650\u0631\u0652\u0639\u064e\u0648\u0652\u0646\u064e \u0648\u064e\u0639\u064e\u0645\u064e\u0644\u0650\u0647\u0650 \u0648\u064e\u0646\u064e\u062c\u0651\u0650\u0646\u0650\u064a \u0645\u0650\u0646\u064e \u0627\u0644\u0652\u0642\u064e\u0648\u0652\u0645\u0650 \u0627\u0644\u0638\u0651\u064e\u0627\u0644\u0650\u0645\u0650\u064a\u0646\u064e",ph:"Rabbibni li 'indaka baytan fil-Jannati wa najjini min Fir'awna wa 'amalih, wa najjini minal-qawmidh-dhalimin.",fr:"Seigneur, construis-moi aupr\u00e8s de Toi une maison au Paradis, sauve-moi de Pharaon et de ses \u0153uvres, et sauve-moi des gens injustes.",reward:"Du\u2019a de la femme de Pharaon (Assia), cit\u00e9e par Allah comme mod\u00e8le pour les croyants. Elle pr\u00e9f\u00e9ra le Paradis au palais."},
        {type:"verset",ref:"Nuh 71:28",ar:"\u0631\u064e\u0628\u0651\u0650 \u0627\u063a\u0652\u0641\u0650\u0631\u0652 \u0644\u0650\u064a \u0648\u064e\u0644\u0650\u0648\u064e\u0627\u0644\u0650\u062f\u064e\u064a\u0651\u064e \u0648\u064e\u0644\u0650\u0645\u064e\u0646\u0652 \u062f\u064e\u062e\u064e\u0644\u064e \u0628\u064e\u064a\u0652\u062a\u0650\u064a\u064e \u0645\u064f\u0624\u0652\u0645\u0650\u0646\u064b\u0627 \u0648\u064e\u0644\u0650\u0644\u0652\u0645\u064f\u0624\u0652\u0645\u0650\u0646\u0650\u064a\u0646\u064e \u0648\u064e\u0627\u0644\u0652\u0645\u064f\u0624\u0652\u0645\u0650\u0646\u064e\u0627\u062a\u0650 \u0648\u064e\u0644\u064e\u0627 \u062a\u064e\u0632\u0650\u062f\u0650 \u0627\u0644\u0638\u0651\u064e\u0627\u0644\u0650\u0645\u0650\u064a\u0646\u064e \u0625\u0650\u0644\u0651\u064e\u0627 \u062a\u064e\u0628\u064e\u0627\u0631\u064b\u0627",ph:"Rabbighfir li wa liwalidayya wa liman dakhala baytiya mu'minan wa lil-mu'minina wal-mu'minat, wa la tazididh-dhalimina illa tabara.",fr:"Seigneur, pardonne-moi, \u00e0 mes parents, \u00e0 celui qui entre dans ma maison en croyant, ainsi qu\u2019aux croyants et croyantes. Et ne fais cro\u00eetre les injustes qu\u2019en perdition.",reward:"Du\u2019a de Nuh (No\u00e9) \u00e0 la fin de sa mission. Elle englobe le pardon pour soi, ses parents et tous les croyants."}
      ]
    },
    {
      id: "reveil",
      name: "Au r\u00e9veil",
      icon: "\uD83C\uDF05",
      gradient: "linear-gradient(165deg, #1a2a2a 0%, #152525 30%, #101e1e 60%, #0c1818 100%)",
      articleBg: "rgba(12,24,24,0.95)",
      quote: "Le premier souffle du jour est un don d\u2019Allah.",
      articleTitle: "Adhkar al-Istiqadh",
      entries: [
        {type:"dua",ref:"Al-Bukhari 11/113, Muslim 4/2083",ar:"اَلْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",ph:"Al-hamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.",fr:"Louange \u00e0 Allah qui nous a rendu la vie apr\u00e8s nous avoir fait mourir, et c\u2019est vers Lui la r\u00e9surrection.",reward:"Premi\u00e8re parole \u00e0 dire au r\u00e9veil. Le Proph\u00e8te \uFEDF la r\u00e9citait d\u00e8s qu\u2019il ouvrait les yeux, remerciant Allah pour un nouveau jour."},
        {type:"dua",ref:"Al-Bukhari 3/144",ar:"لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، سُبْحَانَ اللهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللهُ، وَاللهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ الْعَلِيِّ الْعَظِيمِ، رَبِّ اغْفِرْ لِي",ph:"La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in Qadir. SubhanAllah, wal-hamdu lillah, wa la ilaha illallah, wallahu Akbar, wa la hawla wa la quwwata illa billahil-'Aliyyil-'Adhim. Rabbigh-fir li.",fr:"Il n\u2019y a de divinit\u00e9 qu\u2019Allah, Unique, sans associ\u00e9. \u00c0 Lui appartient la royaut\u00e9 et \u00e0 Lui la louange. Il est capable de toute chose. Gloire \u00e0 Allah. Louange \u00e0 Allah. Il n\u2019y a de divinit\u00e9 qu\u2019Allah. Allah est le Plus Grand. Il n\u2019y a de force ni de puissance qu\u2019en Allah, le Tr\u00e8s-Haut, le Tr\u00e8s-Grand. Seigneur, pardonne-moi.",reward:"Celui qui se r\u00e9veille la nuit et dit cette invocation puis invoque Allah, sa du\u2019a sera exauc\u00e9e, et s\u2019il prie, sa pri\u00e8re sera accept\u00e9e."},
        {type:"dua",ref:"At-Tirmidhi 5/473",ar:"اَلْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي، وَرَدَّ عَلَيَّ رُوحِي، وَأَذِنَ لِي بِذِكْرِهِ",ph:"Al-hamdu lillahil-ladhi 'afani fi jasadi, wa radda 'alayya ruhi, wa adhina li bi dhikrih.",fr:"Louange \u00e0 Allah qui m\u2019a accord\u00e9 la sant\u00e9 dans mon corps, m\u2019a rendu mon \u00e2me et m\u2019a permis de L\u2019\u00e9voquer.",reward:"Gratitude pour trois bienfaits au r\u00e9veil : la sant\u00e9 du corps, le retour de l\u2019\u00e2me et la capacit\u00e9 de faire le dhikr."}
      ]
    },
    {
      id: "repas",
      name: "Repas",
      icon: "\uD83C\uDF7D\uFE0F",
      gradient: "linear-gradient(165deg, #2a2218 0%, #262014 30%, #1f1a0f 60%, #1a160c 100%)",
      articleBg: "rgba(26,22,12,0.95)",
      quote: "Commence et termine ton repas par le nom d\u2019Allah.",
      articleTitle: "Avant et apr\u00e8s le repas",
      entries: [
        {type:"dua",ref:"Abu Dawud 3/347, At-Tirmidhi 4/288",ar:"بِسْمِ اللهِ",ph:"Bismillah.",fr:"Au nom d\u2019Allah.",reward:"Le Proph\u00e8te \uFEDF a dit : quand l\u2019un de vous mange, qu\u2019il mentionne le nom d\u2019Allah. Satan ne participe pas au repas o\u00f9 l\u2019on dit Bismillah."},
        {type:"dua",ref:"Abu Dawud 3/347, At-Tirmidhi 4/288",ar:"بِسْمِ اللهِ فِي أَوَّلِهِ وَآخِرِهِ",ph:"Bismillahi fi awwalihi wa akhirih.",fr:"Au nom d\u2019Allah au d\u00e9but et \u00e0 la fin.",reward:"\u00c0 dire si l\u2019on a oubli\u00e9 Bismillah au d\u00e9but du repas. Elle rattrape l\u2019oubli et emp\u00eache Satan de profiter du repas."},
        {type:"dua",ref:"At-Tirmidhi 3458, Abu Dawud 4023, Ahmad 18233",ar:"الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",ph:"Al-hamdu lillahil-ladhi at'amani hadha wa razaqanih, min ghayri hawlin minni wa la quwwah.",fr:"Louange \u00e0 Allah qui m\u2019a accord\u00e9 cette nourriture et me l\u2019a octroy\u00e9e sans pouvoir ni force de ma part.",reward:"Celui qui la dit apr\u00e8s avoir mang\u00e9 verra ses p\u00e9ch\u00e9s ant\u00e9rieurs pardonn\u00e9s."},
        {type:"dua",ref:"Al-Bukhari 5458",ar:"الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ",ph:"Al-hamdu lillahi hamdan kathiran tayyiban mubarakan fih.",fr:"Louange \u00e0 Allah, une louange abondante, agr\u00e9able et b\u00e9nie.",reward:"Le Proph\u00e8te \uFEDF a dit que cette parole pla\u00eet \u00e0 Allah. Il ne faut pas la d\u00e9laisser ni s\u2019en passer."},
        {type:"dua",ref:"Abu Dawud 3851",ar:"الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَ وَسَقَى وَسَوَّغَهُ وَجَعَلَ لَهُ مَخْرَجًا",ph:"Al-hamdu lillahil-ladhi at'ama wa saqa wa sawwaghahu wa ja'ala lahu makhraja.",fr:"Louange \u00e0 Allah qui a nourri, abreuv\u00e9, rendu facile \u00e0 avaler et lui a pr\u00e9par\u00e9 une issue.",reward:"Gratitude envers Allah pour le processus complet de la nourriture : de l\u2019ingestion \u00e0 l\u2019\u00e9vacuation."}
      ]
    },
    {
      id: "maison",
      name: "Maison",
      icon: "\uD83C\uDFE0",
      gradient: "linear-gradient(165deg, #1e2228 0%, #1a1e24 30%, #15181e 60%, #101418 100%)",
      articleBg: "rgba(16,20,24,0.95)",
      quote: "La maison du croyant est un refuge b\u00e9ni.",
      articleTitle: "Entrer et sortir de la maison",
      entries: [
        {type:"dua",ref:"Abu Dawud 4/325, Hisn al-Muslim 18",ar:"بِسْمِ اللهِ وَلَجْنَا، وَبِسْمِ اللهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا",ph:"Bismillahi walajna, wa bismillahi kharajna, wa 'ala Rabbina tawakkalna.",fr:"Au nom d\u2019Allah nous entrons et au nom d\u2019Allah nous sortons, et sur notre Seigneur nous comptons.",reward:"Quand on entre chez soi en mentionnant le nom d\u2019Allah, Satan dit aux siens : pas de g\u00eete ni de repas ici pour vous."},
        {type:"dua",ref:"Abu Dawud 4/325, At-Tirmidhi 5/490",ar:"بِسْمِ اللهِ، تَوَكَّلْتُ عَلَى اللهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ",ph:"Bismillah, tawakkaltu 'alallah, wa la hawla wa la quwwata illa billah.",fr:"Au nom d\u2019Allah, je place ma confiance en Allah. Il n\u2019y a de force ni de puissance qu\u2019en Allah.",reward:"Celui qui la dit en sortant de chez lui, on lui dit : tu es guid\u00e9, prot\u00e9g\u00e9 et pr\u00e9serv\u00e9, et Satan s\u2019\u00e9carte de lui."},
        {type:"dua",ref:"Abu Dawud 4/325, At-Tirmidhi 5/490, An-Nasa\u2019i 8/268, Ibn Majah 3884",ar:"اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أَضِلَّ أَوْ أُضَلَّ، أَوْ أَزِلَّ أَوْ أُزَلَّ، أَوْ أَظْلِمَ أَوْ أُظْلَمَ، أَوْ أَجْهَلَ أَوْ يُجْهَلَ عَلَيَّ",ph:"Allahumma inni a'udhu bika an adilla aw udall, aw azilla aw uzall, aw adhlima aw udhlam, aw ajhala aw yujhala 'alayy.",fr:"\u00d4 Allah, je cherche refuge aupr\u00e8s de Toi contre le fait de m\u2019\u00e9garer ou d\u2019\u00eatre \u00e9gar\u00e9, de tr\u00e9bucher ou d\u2019\u00eatre fait tr\u00e9bucher, d\u2019opprimer ou d\u2019\u00eatre opprim\u00e9, d\u2019agir avec ignorance ou que l\u2019on agisse avec ignorance envers moi.",reward:"Invocation compl\u00e8te de protection en sortant de la maison, couvrant l\u2019\u00e9garement, les chutes, l\u2019injustice et l\u2019ignorance."}
      ]
    },
    {
      id: "mosquee",
      name: "Mosqu\u00e9e",
      icon: "\uD83D\uDD4C",
      gradient: "linear-gradient(165deg, #182530 0%, #14202b 30%, #101a24 60%, #0c151e 100%)",
      articleBg: "rgba(12,21,30,0.95)",
      quote: "Les mosqu\u00e9es sont les maisons d\u2019Allah sur terre.",
      articleTitle: "Entrer et sortir de la mosqu\u00e9e",
      entries: [
        {type:"dua",ref:"Abu Dawud 1/126, Muslim 1/494",ar:"أَعُوذُ بِاللهِ الْعَظِيمِ، وَبِوَجْهِهِ الْكَرِيمِ، وَسُلْطَانِهِ الْقَدِيمِ، مِنَ الشَّيْطَانِ الرَّجِيمِ. بِسْمِ اللهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللهِ. اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",ph:"A'udhu billahil-'Adhim, wa bi wajhihil-Karim, wa sultanihil-qadim, minash-shaytanir-rajim. Bismillah, was-salatu was-salamu 'ala Rasulillah. Allahummaf-tah li abwaba rahmatik.",fr:"Je cherche refuge aupr\u00e8s d\u2019Allah le Tr\u00e8s-Grand, aupr\u00e8s de Son Noble Visage et de Son autorit\u00e9 \u00e9ternelle contre Satan le maudit. Au nom d\u2019Allah, que la pri\u00e8re et le salut soient sur le Messager d\u2019Allah. \u00d4 Allah, ouvre-moi les portes de Ta mis\u00e9ricorde.",reward:"Du\u2019a d\u2019entr\u00e9e \u00e0 la mosqu\u00e9e. Celui qui la dit est prot\u00e9g\u00e9 de Satan durant toute sa pr\u00e9sence dans la mosqu\u00e9e."},
        {type:"dua",ref:"Muslim 1/494, Abu Dawud",ar:"بِسْمِ اللهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللهِ. اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ. اللَّهُمَّ اعْصِمْنِي مِنَ الشَّيْطَانِ الرَّجِيمِ",ph:"Bismillah, was-salatu was-salamu 'ala Rasulillah. Allahumma inni as'aluka min fadlik. Allahumma'simni minash-shaytanir-rajim.",fr:"Au nom d\u2019Allah, que la pri\u00e8re et le salut soient sur le Messager d\u2019Allah. \u00d4 Allah, je Te demande de Ta gr\u00e2ce. \u00d4 Allah, prot\u00e8ge-moi de Satan le maudit.",reward:"Du\u2019a de sortie de la mosqu\u00e9e. On demande la gr\u00e2ce d\u2019Allah en sortant, car le croyant retrouve le monde ext\u00e9rieur."}
      ]
    },
    {
      id: "toilettes",
      name: "Toilettes",
      icon: "\uD83D\uDEBF",
      gradient: "linear-gradient(165deg, #1e1e24 0%, #1a1a20 30%, #15151a 60%, #101015 100%)",
      articleBg: "rgba(16,16,21,0.95)",
      quote: "Le croyant se souvient d\u2019Allah en tout lieu.",
      articleTitle: "Entrer et sortir des toilettes",
      entries: [
        {type:"dua",ref:"Al-Bukhari 1/45, Muslim 1/283",ar:"بِسْمِ اللهِ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",ph:"Bismillah. Allahumma inni a'udhu bika minal-khubuthi wal-khaba'ith.",fr:"Au nom d\u2019Allah. \u00d4 Allah, je cherche refuge aupr\u00e8s de Toi contre les d\u00e9mons m\u00e2les et femelles.",reward:"Les lieux d\u2019aisance sont fr\u00e9quent\u00e9s par les d\u00e9mons. Cette invocation prot\u00e8ge le croyant avant d\u2019y entrer."},
        {type:"dua",ref:"Abu Dawud 1/30, At-Tirmidhi 1/12, Ibn Majah 1/110",ar:"غُفْرَانَكَ",ph:"Ghufranaka.",fr:"Je Te demande Ton pardon.",reward:"\u00c0 dire en sortant des toilettes. Le Proph\u00e8te \uFEDF demandait pardon car il n\u2019avait pu faire le dhikr dans ce lieu."}
      ]
    },
    {
      id: "vetement",
      name: "V\u00eatement neuf",
      icon: "\uD83D\uDC54",
      gradient: "linear-gradient(165deg, #221e2a 0%, #1e1a26 30%, #181520 60%, #14101a 100%)",
      articleBg: "rgba(20,16,26,0.95)",
      quote: "Allah aime voir l\u2019effet de Ses bienfaits sur Son serviteur.",
      articleTitle: "Du\u2019a du v\u00eatement neuf",
      entries: [
        {type:"dua",ref:"Abu Dawud 4/41, At-Tirmidhi 5/543",ar:"اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ كَسَوْتَنِيهِ، أَسْأَلُكَ مِنْ خَيْرِهِ وَخَيْرِ مَا صُنِعَ لَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّهِ وَشَرِّ مَا صُنِعَ لَهُ",ph:"Allahumma lakal-hamdu Anta kasawtanih, as'aluka min khayrihi wa khayri ma suni'a lah, wa a'udhu bika min sharrihi wa sharri ma suni'a lah.",fr:"\u00d4 Allah, \u00e0 Toi la louange. C\u2019est Toi qui m\u2019en as v\u00eatu. Je Te demande le bien de ce v\u00eatement et le bien pour lequel il a \u00e9t\u00e9 fait, et je cherche refuge aupr\u00e8s de Toi contre son mal et le mal pour lequel il a \u00e9t\u00e9 fait.",reward:"Sunna \u00e0 dire en portant un v\u00eatement neuf. Le croyant remercie Allah pour le bienfait du v\u00eatement et demande sa b\u00e9n\u00e9diction."},
        {type:"dua",ref:"Abu Dawud 4/41",ar:"تُبْلِي وَيُخْلِفُ اللهُ تَعَالَى",ph:"Tubli wa yukhliful-lahu ta'ala.",fr:"Puisses-tu le porter jusqu\u2019\u00e0 l\u2019user et qu\u2019Allah le remplace.",reward:"Invocation \u00e0 dire pour celui qui porte un v\u00eatement neuf. On lui souhaite de l\u2019user et qu\u2019Allah lui en accorde un meilleur."}
      ]
    },
    {
      id: "apres-priere",
      name: "Apr\u00e8s la pri\u00e8re",
      icon: "\uD83E\uDD32",
      gradient: "linear-gradient(165deg, #1a1e2e 0%, #161a28 30%, #101522 60%, #0c101a 100%)",
      articleBg: "rgba(12,16,26,0.95)",
      quote: "Le dhikr apr\u00e8s la pri\u00e8re est un tr\u00e9sor du croyant.",
      articleTitle: "Adhkar ba\u2019da as-Salat",
      entries: [
        {type:"dua",ref:"Muslim 591",ar:"أَسْتَغْفِرُ اللهَ (ثَلَاثًا)",ph:"Astaghfirullah (thalathan).",fr:"Je demande pardon \u00e0 Allah. (trois fois)",reward:"Le Proph\u00e8te \uFEDF demandait pardon 3 fois apr\u00e8s le salam, reconnaissant les manquements possibles dans la pri\u00e8re."},
        {type:"dua",ref:"Al-Bukhari 844, Muslim 593",ar:"لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ",ph:"La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in Qadir. Allahumma la mani'a lima a'tayt, wa la mu'tiya lima mana't, wa la yanfa'u dhal-jaddi minkal-jadd.",fr:"Il n\u2019y a de divinit\u00e9 qu\u2019Allah, Unique, sans associ\u00e9. \u00c0 Lui la royaut\u00e9, \u00e0 Lui la louange et Il est capable de toute chose. \u00d4 Allah, nul ne peut emp\u00eacher ce que Tu donnes et nul ne peut donner ce que Tu emp\u00eaches. Et la fortune ne profite \u00e0 personne devant Toi.",reward:"Dhikr enseign\u00e9 par le Proph\u00e8te \uFEDF apr\u00e8s chaque pri\u00e8re obligatoire. Il affirme le tawhid et la souverainet\u00e9 absolue d\u2019Allah."},
        {type:"dua",ref:"Muslim 595",ar:"سُبْحَانَ اللهِ (٣٣) وَالْحَمْدُ لِلَّهِ (٣٣) وَاللهُ أَكْبَرُ (٣٣) ثُمَّ: لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",ph:"SubhanAllah (33), Alhamdulillah (33), Allahu Akbar (33), thumma: La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa Huwa 'ala kulli shay'in Qadir.",fr:"Gloire \u00e0 Allah (33 fois), Louange \u00e0 Allah (33 fois), Allah est le Plus Grand (33 fois), puis : Il n\u2019y a de divinit\u00e9 qu\u2019Allah, Unique, sans associ\u00e9. \u00c0 Lui la royaut\u00e9, \u00e0 Lui la louange, et Il est capable de toute chose.",reward:"Celui qui fait ce dhikr apr\u00e8s chaque pri\u00e8re verra ses p\u00e9ch\u00e9s pardonn\u00e9s m\u00eame s\u2019ils \u00e9taient comme l\u2019\u00e9cume de la mer."},
        {type:"dua",ref:"Abu Dawud 1522, An-Nasa\u2019i 1303, Ahmad",ar:"اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",ph:"Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik.",fr:"\u00d4 Allah, aide-moi \u00e0 T\u2019\u00e9voquer, \u00e0 Te remercier et \u00e0 T\u2019adorer de la meilleure mani\u00e8re.",reward:"Le Proph\u00e8te \uFEDF a recommand\u00e9 \u00e0 Mu\u2019adh ibn Jabal de ne jamais d\u00e9laisser cette invocation apr\u00e8s chaque pri\u00e8re."},
        {type:"dua",ref:"Ibn Majah 925",ar:"اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا",ph:"Allahumma inni as'aluka 'ilman nafi'an, wa rizqan tayyiban, wa 'amalan mutaqabbalan.",fr:"\u00d4 Allah, je Te demande une science utile, une subsistance agr\u00e9able et une \u0153uvre accept\u00e9e.",reward:"Invocation r\u00e9unissant les trois piliers d\u2019une vie r\u00e9ussie : le savoir b\u00e9n\u00e9fique, la subsistance licite et les \u0153uvres agr\u00e9\u00e9es."}
      ]
    },
    {
      id: "sujud",
      name: "Pendant le sujud",
      icon: "\uD83D\uDE47",
      gradient: "linear-gradient(165deg, #12182a 0%, #0e1426 30%, #0a1020 60%, #060c1a 100%)",
      articleBg: "rgba(6,12,26,0.95)",
      quote: "Le serviteur est le plus proche de son Seigneur quand il est prostern\u00e9.",
      articleTitle: "Du\u2019a dans la prosternation",
      entries: [
        {type:"dua",ref:"Abu Dawud, At-Tirmidhi, An-Nasa\u2019i, Ibn Majah",ar:"سُبْحَانَ رَبِّيَ الْأَعْلَى (ثَلَاثًا)",ph:"Subhana Rabbiyal-A'la (thalathan).",fr:"Gloire \u00e0 mon Seigneur le Tr\u00e8s-Haut. (trois fois)",reward:"Pilier obligatoire du sujud. Le Proph\u00e8te \uFEDF la r\u00e9p\u00e9tait au minimum 3 fois dans chaque prosternation."},
        {type:"dua",ref:"Al-Bukhari 1/99, Muslim 1/350",ar:"سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ، اللَّهُمَّ اغْفِرْ لِي",ph:"Subhanakal-lahumma Rabbana wa bihamdik. Allahummagh-fir li.",fr:"Gloire \u00e0 Toi, \u00d4 Allah notre Seigneur, et louange \u00e0 Toi. \u00d4 Allah, pardonne-moi.",reward:"Le Proph\u00e8te \uFEDF multipliait cette invocation dans ses ruku\u2019 et sujud en application du verset \u00ab Glorifie ton Seigneur et demande-Lui pardon \u00bb."},
        {type:"dua",ref:"Muslim 1/353",ar:"سُبُّوحٌ قُدُّوسٌ، رَبُّ الْمَلَائِكَةِ وَالرُّوحِ",ph:"Subbuhun Quddusun, Rabbul-mala'ikati war-Ruh.",fr:"Tr\u00e8s Glorifi\u00e9, Tr\u00e8s Saint, Seigneur des anges et de l\u2019Esprit.",reward:"Le Proph\u00e8te \uFEDF la r\u00e9citait dans ses prosternations et inclinaisons de la pri\u00e8re de nuit (qiyam al-layl)."},
        {type:"dua",ref:"Muslim 1/534",ar:"اللَّهُمَّ لَكَ سَجَدْتُ، وَبِكَ آمَنْتُ، وَلَكَ أَسْلَمْتُ، سَجَدَ وَجْهِيَ لِلَّذِي خَلَقَهُ وَصَوَّرَهُ وَشَقَّ سَمْعَهُ وَبَصَرَهُ، تَبَارَكَ اللهُ أَحْسَنُ الْخَالِقِينَ",ph:"Allahumma laka sajadtu, wa bika amantu, wa laka aslamtu. Sajada wajhi lilladhi khalaqahu wa sawwarahu wa shaqqa sam'ahu wa basarah. Tabarakallahu ahsanul-khaliqin.",fr:"\u00d4 Allah, c\u2019est devant Toi que je me suis prostern\u00e9, en Toi que j\u2019ai cru et \u00e0 Toi que je me suis soumis. Mon visage se prosterne devant Celui qui l\u2019a cr\u00e9\u00e9, l\u2019a fa\u00e7onn\u00e9 et a ouvert son ou\u00efe et sa vue. B\u00e9ni soit Allah le Meilleur des cr\u00e9ateurs.",reward:"Soumission totale du visage \u2014 la partie la plus noble du corps \u2014 devant son Cr\u00e9ateur. Le sujud est le moment le plus proche d\u2019Allah."},
        {type:"dua",ref:"Muslim 1/350",ar:"اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ",ph:"Allahummagh-fir li dhanbi kullah, diqqahu wa jillah, wa awwalahu wa akhirah, wa 'alaniyatahu wa sirrah.",fr:"\u00d4 Allah, pardonne-moi tous mes p\u00e9ch\u00e9s, les petits et les grands, les premiers et les derniers, les apparents et les cach\u00e9s.",reward:"Demande exhaustive de pardon couvrant tout type de p\u00e9ch\u00e9. Le sujud est le meilleur moment pour implorer le pardon."}
      ]
    },
    {
      id: "prosternations",
      name: "Entre les prosternations",
      icon: "\uD83D\uDCFF",
      gradient: "linear-gradient(165deg, #1a1a22 0%, #16161e 30%, #111118 60%, #0e0e14 100%)",
      articleBg: "rgba(14,14,20,0.95)",
      quote: "Demandez le pardon d\u2019Allah entre chaque prosternation.",
      articleTitle: "Du\u2019a entre les deux prosternations",
      entries: [
        {type:"dua",ref:"Abu Dawud 1/231, Sahih Ibn Majah 1/148",ar:"رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي",ph:"Rabbigh-fir li, Rabbigh-fir li.",fr:"Seigneur, pardonne-moi. Seigneur, pardonne-moi.",reward:"Sunna du Proph\u00e8te \uFEDF entre les deux prosternations. La r\u00e9p\u00e9tition montre l\u2019insistance dans la demande de pardon."},
        {type:"dua",ref:"At-Tirmidhi 284, Ibn Majah 897",ar:"اللَّهُمَّ اغْفِرْ لِي، وَارْحَمْنِي، وَاجْبُرْنِي، وَاهْدِنِي، وَارْزُقْنِي",ph:"Allahummagh-fir li, warhamni, wajburni, wahdini, warzuqni.",fr:"\u00d4 Allah, pardonne-moi, accorde-moi Ta mis\u00e9ricorde, aide-moi, guide-moi et accorde-moi ma subsistance.",reward:"Du\u2019a compl\u00e8te entre les deux prosternations regroupant cinq demandes essentielles : pardon, mis\u00e9ricorde, soutien, guidance et subsistance."}
      ]
    },
    {
      id: "tashahud",
      name: "Tashahud",
      icon: "\u261D\uFE0F",
      gradient: "linear-gradient(165deg, #1e1a28 0%, #1a1624 30%, #15101e 60%, #100c18 100%)",
      articleBg: "rgba(16,12,24,0.95)",
      quote: "L\u2019assise finale est un moment de recueillement sacr\u00e9.",
      articleTitle: "At-Tashahud et pri\u00e8re Ibrahimique",
      entries: [
        {type:"dua",ref:"Al-Bukhari 6265, Muslim 402",ar:"التَّحِيَّاتُ لِلَّهِ، وَالصَّلَوَاتُ، وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",ph:"At-tahiyyatu lillahi was-salawatu wat-tayyibat. As-salamu 'alayka ayyuhan-Nabiyyu wa rahmatullahi wa barakatuh. As-salamu 'alayna wa 'ala 'ibadillahis-salihin. Ash-hadu an la ilaha illallah, wa ash-hadu anna Muhammadan 'abduhu wa Rasuluh.",fr:"Les salutations sont \u00e0 Allah, ainsi que les pri\u00e8res et les bonnes \u0153uvres. Que la paix soit sur toi, \u00d4 Proph\u00e8te, ainsi que la mis\u00e9ricorde d\u2019Allah et Ses b\u00e9n\u00e9dictions. Que la paix soit sur nous et sur les vertueux serviteurs d\u2019Allah. J\u2019atteste qu\u2019il n\u2019y a de divinit\u00e9 qu\u2019Allah et j\u2019atteste que Muhammad est Son serviteur et Son Messager.",reward:"Le tashahud est un pilier de la pri\u00e8re. Le Proph\u00e8te \uFEDF l\u2019enseignait comme il enseignait les sourates du Coran."},
        {type:"dua",ref:"Al-Bukhari 3370",ar:"اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",ph:"Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad, kama sallayta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hamidun Majid. Allahumma barik 'ala Muhammadin wa 'ala ali Muhammad, kama barakta 'ala Ibrahima wa 'ala ali Ibrahim, innaka Hamidun Majid.",fr:"\u00d4 Allah, prie sur Muhammad et sur la famille de Muhammad, comme Tu as pri\u00e9 sur Ibrahim et sur la famille d\u2019Ibrahim, Tu es certes Digne de louange et de gloire. \u00d4 Allah, b\u00e9nis Muhammad et la famille de Muhammad comme Tu as b\u00e9ni Ibrahim et la famille d\u2019Ibrahim, Tu es certes Digne de louange et de gloire.",reward:"La pri\u00e8re ibrahimique : celui qui envoie une salutation sur le Proph\u00e8te \uFEDF, Allah lui en accorde dix."},
        {type:"dua",ref:"Al-Bukhari 1377, Muslim 588",ar:"اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَمِنْ عَذَابِ جَهَنَّمَ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ",ph:"Allahumma inni a'udhu bika min 'adhabil-qabr, wa min 'adhabi Jahannam, wa min fitnatil-mahya wal-mamat, wa min sharri fitnatil-Masihid-Dajjal.",fr:"\u00d4 Allah, je cherche refuge aupr\u00e8s de Toi contre le ch\u00e2timent de la tombe, contre le ch\u00e2timent de l\u2019Enfer, contre les \u00e9preuves de la vie et de la mort, et contre le mal de l\u2019\u00e9preuve de l\u2019Ant\u00e9christ.",reward:"Le Proph\u00e8te \uFEDF a ordonn\u00e9 de chercher refuge contre ces quatre choses dans le dernier tashahud avant le salam."}
      ]
    },
    {
      id: "colere",
      name: "Contre la col\u00e8re",
      icon: "\uD83D\uDE24",
      gradient: "linear-gradient(165deg, #2a1818 0%, #261414 30%, #1f1010 60%, #1a0c0c 100%)",
      articleBg: "rgba(26,12,12,0.95)",
      quote: "Le fort n\u2019est pas celui qui terrasse, mais celui qui se ma\u00eetrise lors de la col\u00e8re.",
      articleTitle: "Ma\u00eetriser la col\u00e8re",
      entries: [
        {type:"dua",ref:"Al-Bukhari 6/337, Muslim 4/2015",ar:"أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",ph:"A'udhu billahi minash-shaytanir-rajim.",fr:"Je cherche refuge aupr\u00e8s d\u2019Allah contre Satan le maudit.",reward:"Le Proph\u00e8te \uFEDF a dit : si l\u2019un de vous se met en col\u00e8re, qu\u2019il dise cette parole. La col\u00e8re est un souffle de Satan."},
        {type:"dua",ref:"Musnad Ahmad, Tabarani",ar:"اللَّهُمَّ اغْفِرْ لِي ذَنْبِي، وَأَذْهِبْ غَيْظَ قَلْبِي، وَأَجِرْنِي مِنَ الشَّيْطَانِ",ph:"Allahummagh-fir li dhanbi, wa adh-hib ghaytha qalbi, wa ajirni minash-shaytan.",fr:"\u00d4 Allah, pardonne-moi mon p\u00e9ch\u00e9, dissipe la col\u00e8re de mon c\u0153ur et prot\u00e8ge-moi de Satan.",reward:"Demande sp\u00e9cifique pour apaiser le c\u0153ur en col\u00e8re. Le Proph\u00e8te \uFEDF a dit que le vrai fort est celui qui se ma\u00eetrise lors de la col\u00e8re."}
      ]
    },
    {
      id: "peur",
      name: "Contre la peur",
      icon: "\uD83D\uDE28",
      gradient: "linear-gradient(165deg, #181828 0%, #141424 30%, #10101e 60%, #0c0c18 100%)",
      articleBg: "rgba(12,12,24,0.95)",
      quote: "Ne crains rien, Allah est avec les croyants.",
      articleTitle: "Invocations contre la peur",
      entries: [
        {type:"dua",ref:"Abu Dawud 2/89, Hisn al-Muslim",ar:"اللَّهُمَّ إِنَّا نَجْعَلُكَ فِي نُحُورِهِمْ، وَنَعُوذُ بِكَ مِنْ شُرُورِهِمْ",ph:"Allahumma inna naj'aluka fi nuhurihim, wa na'udhu bika min shururihim.",fr:"\u00d4 Allah, nous Te pla\u00e7ons face \u00e0 eux et nous cherchons refuge aupr\u00e8s de Toi contre leurs maux.",reward:"Du\u2019a \u00e0 dire face \u00e0 un ennemi ou un tyran que l\u2019on craint. Allah prot\u00e8ge celui qui se r\u00e9fugie aupr\u00e8s de Lui."},
        {type:"dua",ref:"Muslim 4/2081",ar:"أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",ph:"A'udhu bi kalimati Allahit-tammati min sharri ma khalaq.",fr:"Je cherche refuge dans les paroles parfaites d\u2019Allah contre le mal de ce qu\u2019Il a cr\u00e9\u00e9.",reward:"Protection g\u00e9n\u00e9rale contre tout mal cr\u00e9\u00e9. Le Proph\u00e8te \uFEDF la r\u00e9citait en cas de peur ou de danger."},
        {type:"dua",ref:"Al-Bukhari 7/158, Hisn al-Muslim 121",ar:"اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",ph:"Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-bukhli wal-jubn, wa dala'id-dayni wa ghalabatir-rijal.",fr:"\u00d4 Allah, je cherche refuge aupr\u00e8s de Toi contre le souci et la tristesse, contre l\u2019incapacit\u00e9 et la paresse, contre l\u2019avarice et la l\u00e2chet\u00e9, contre le fardeau des dettes et la domination des hommes.",reward:"Invocation compl\u00e8te du Proph\u00e8te \uFEDF couvrant les 8 maux qui paralysent l\u2019\u00e2me et emp\u00eachent l\u2019action vertueuse."}
      ]
    },
    {
      id: "anxiete",
      name: "Contre l\u2019anxi\u00e9t\u00e9",
      icon: "\uD83D\uDCAD",
      gradient: "linear-gradient(165deg, #1a1828 0%, #161424 30%, #11101e 60%, #0e0c18 100%)",
      articleBg: "rgba(14,12,24,0.95)",
      quote: "Par l\u2019\u00e9vocation d\u2019Allah les c\u0153urs se tranquillisent.",
      articleTitle: "Invocations contre l\u2019anxi\u00e9t\u00e9",
      entries: [
        {type:"dua",ref:"Ahmad 1/391, authentifi\u00e9 par Al-Albani",ar:"اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ، سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ، أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ، أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي",ph:"Allahumma inni 'abduka, ibnu 'abdik, ibnu amatik. Nasiyati bi yadik, madin fiyya hukmuk, 'adlun fiyya qada'uk. As'aluka bi kulli ismin huwa lak, sammayta bihi nafsak, aw anzaltahu fi kitabik, aw 'allamtahu ahadan min khalqik, aw ista'tharta bihi fi 'ilmil-ghaybi 'indak, an taj'alal-Qur'ana rabi'a qalbi, wa nura sadri, wa jala'a huzni, wa dhahaba hammi.",fr:"\u00d4 Allah, je suis Ton serviteur, fils de Ton serviteur, fils de Ta servante. Mon toupet est dans Ta main. Ton jugement s\u2019applique \u00e0 moi. Ton d\u00e9cret me concernant est juste. Je Te demande par chaque nom qui T\u2019appartient, par lequel Tu T\u2019es nomm\u00e9, ou que Tu as r\u00e9v\u00e9l\u00e9 dans Ton Livre, ou que Tu as enseign\u00e9 \u00e0 l\u2019une de Tes cr\u00e9atures, ou que Tu as gard\u00e9 dans la science de l\u2019invisible aupr\u00e8s de Toi, de faire du Coran le printemps de mon c\u0153ur, la lumi\u00e8re de ma poitrine, la dissipation de ma tristesse et la disparition de mon souci.",reward:"Le Proph\u00e8te \uFEDF a dit : quiconque la r\u00e9cite, Allah remplacera son anxi\u00e9t\u00e9 par de la joie. C\u2019est le rem\u00e8de par excellence contre l\u2019angoisse."},
        {type:"dua",ref:"Al-Bukhari 6345, Muslim 2730",ar:"لَا إِلَهَ إِلَّا اللهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",ph:"La ilaha illallahul-'Adhimul-Halim. La ilaha illallahu Rabbul-'Arshil-'Adhim. La ilaha illallahu Rabbus-samawati wa Rabbul-ardi wa Rabbul-'Arshil-Karim.",fr:"Il n\u2019y a de divinit\u00e9 qu\u2019Allah le Tr\u00e8s-Grand, le Tr\u00e8s-Cl\u00e9ment. Il n\u2019y a de divinit\u00e9 qu\u2019Allah le Seigneur du Tr\u00f4ne immense. Il n\u2019y a de divinit\u00e9 qu\u2019Allah le Seigneur des cieux, le Seigneur de la terre et le Seigneur du Noble Tr\u00f4ne.",reward:"Du\u2019a du Proph\u00e8te \uFEDF dans les moments de d\u00e9tresse. Elle invoque Allah par Ses attributs de grandeur et de cl\u00e9mence."},
        {type:"verset",ref:"Al-Anbiya 21:87 \u2014 At-Tirmidhi 5/529",ar:"لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",ph:"La ilaha illa Anta, Subhanaka inni kuntu minadh-dhalimin.",fr:"Il n\u2019y a de divinit\u00e9 que Toi, Gloire \u00e0 Toi, j\u2019\u00e9tais certes parmi les injustes.",reward:"L\u2019invocation de Yunus dans le ventre de la baleine. Le Proph\u00e8te \uFEDF a dit qu\u2019aucun musulman n\u2019invoque par elle sans qu\u2019Allah ne r\u00e9ponde."},
        {type:"dua",ref:"Abu Dawud 4/324, Ahmad 5/42",ar:"اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ، لَا إِلَهَ إِلَّا أَنْتَ",ph:"Allahumma rahmataka arju, fa la takilni ila nafsi tarfata 'ayn. Wa aslih li sha'ni kullah. La ilaha illa Ant.",fr:"\u00d4 Allah, c\u2019est Ta mis\u00e9ricorde que j\u2019esp\u00e8re. Ne me laisse pas \u00e0 moi-m\u00eame le temps d\u2019un clin d\u2019\u0153il. Am\u00e9liore toute ma situation. Il n\u2019y a de divinit\u00e9 que Toi.",reward:"Recours total \u00e0 la mis\u00e9ricorde d\u2019Allah. Le serviteur reconna\u00eet qu\u2019il ne peut se suffire \u00e0 lui-m\u00eame un seul instant."}
      ]
    },
    {
      id: "dette",
      name: "En cas de dette",
      icon: "\uD83D\uDCB0",
      gradient: "linear-gradient(165deg, #1e2220 0%, #1a1e1c 30%, #151818 60%, #101414 100%)",
      articleBg: "rgba(16,20,20,0.95)",
      quote: "Allah suffit \u00e0 celui qui place sa confiance en Lui.",
      articleTitle: "Du\u2019a pour la dette",
      entries: [
        {type:"dua",ref:"At-Tirmidhi 5/560, Hisn al-Muslim 136",ar:"اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",ph:"Allahummak-fini bi halalika 'an haramik, wa aghnini bi fadlika 'amman siwak.",fr:"\u00d4 Allah, accorde-moi une suffisance par ce qui est licite de Toi pour m\u2019\u00e9pargner l\u2019illicite, et enrichis-moi par Ta gr\u00e2ce pour que je me passe de tout autre que Toi.",reward:"Le Proph\u00e8te \uFEDF a enseign\u00e9 cette du\u2019a \u00e0 Ali. M\u00eame avec une dette grosse comme une montagne, Allah la r\u00e8glerait."},
        {type:"dua",ref:"Al-Bukhari 7/158",ar:"اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",ph:"Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-bukhli wal-jubn, wa dala'id-dayni wa ghalabatir-rijal.",fr:"\u00d4 Allah, je cherche refuge aupr\u00e8s de Toi contre le souci et la tristesse, contre l\u2019incapacit\u00e9 et la paresse, contre l\u2019avarice et la l\u00e2chet\u00e9, contre le fardeau des dettes et la domination des hommes.",reward:"Protection contre le fardeau de la dette et tous les maux qui emp\u00eachent le serviteur d\u2019\u00eatre libre et actif dans l\u2019ob\u00e9issance \u00e0 Allah."}
      ]
    },
    {
      id: "malade",
      name: "Pour le malade",
      icon: "\uD83C\uDFE5",
      gradient: "linear-gradient(165deg, #1a2228 0%, #161d24 30%, #10181e 60%, #0c1418 100%)",
      articleBg: "rgba(12,20,24,0.95)",
      quote: "La gu\u00e9rison vient d\u2019Allah, le Gu\u00e9risseur.",
      articleTitle: "Invocations pour la gu\u00e9rison",
      entries: [
        {type:"dua",ref:"At-Tirmidhi 2083, Abu Dawud 3106",ar:"أَسْأَلُ اللهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ",ph:"As'alullaha al-'Adhima Rabbal-'Arshil-'Adhimi an yashfiyak.",fr:"Je demande \u00e0 Allah le Tr\u00e8s-Grand, Seigneur du Tr\u00f4ne immense, de te gu\u00e9rir. (sept fois)",reward:"Le Proph\u00e8te \uFEDF a dit : celui qui la dit 7 fois au malade, Allah le gu\u00e9rira, sauf si son terme est arriv\u00e9."},
        {type:"dua",ref:"Al-Bukhari 5675, Muslim 2191",ar:"اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا",ph:"Allahumma Rabban-nas, adh-hibil-ba's. Ishfi Antash-Shafi, la shifa'a illa shifa'uk, shifa'an la yughadiru saqama.",fr:"\u00d4 Allah, Seigneur des hommes, dissipe le mal, gu\u00e9ris car Tu es le Gu\u00e9risseur. Il n\u2019y a de gu\u00e9rison que Ta gu\u00e9rison, une gu\u00e9rison qui ne laisse aucune maladie.",reward:"Ruqya du Proph\u00e8te \uFEDF. Il posait sa main sur le malade et r\u00e9citait cette invocation pour demander la gu\u00e9rison totale."},
        {type:"dua",ref:"Muslim 4/1728",ar:"بِسْمِ اللهِ (ثَلَاثًا) وَقُلْ سَبْعَ مَرَّاتٍ: أَعُوذُ بِاللهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ",ph:"Bismillah (thalathan), wa qul sab'a marratin: A'udhu billahi wa qudratihi min sharri ma ajidu wa uhadhir.",fr:"Au nom d\u2019Allah (trois fois), puis dire sept fois : Je cherche refuge aupr\u00e8s d\u2019Allah et de Sa puissance contre le mal de ce que je ressens et de ce que je redoute.",reward:"Poser la main sur l\u2019endroit douloureux, dire Bismillah 3 fois puis cette du\u2019a 7 fois. Rem\u00e8de proph\u00e9tique contre la douleur."}
      ]
    },
    {
      id: "pluie",
      name: "Pluie & orage",
      icon: "\uD83C\uDF27\uFE0F",
      gradient: "linear-gradient(165deg, #141e2a 0%, #101a26 30%, #0c1620 60%, #08121a 100%)",
      articleBg: "rgba(8,18,26,0.95)",
      quote: "Allah envoie Sa pluie comme une mis\u00e9ricorde.",
      articleTitle: "Invocations de la pluie",
      entries: [
        {type:"dua",ref:"Al-Bukhari 1032",ar:"اللَّهُمَّ صَيِّبًا نَافِعًا",ph:"Allahumma sayyiban nafi'an.",fr:"\u00d4 Allah, fais-en une pluie utile et b\u00e9n\u00e9fique.",reward:"Du\u2019a du Proph\u00e8te \uFEDF en voyant les nuages de pluie. Il demandait que la pluie soit b\u00e9n\u00e9fique et non destructrice."},
        {type:"dua",ref:"Al-Bukhari 846, Muslim 71",ar:"مُطِرْنَا بِفَضْلِ اللهِ وَرَحْمَتِهِ",ph:"Mutirna bi fadlillahi wa rahmatih.",fr:"Nous avons re\u00e7u la pluie par la gr\u00e2ce d\u2019Allah et Sa mis\u00e9ricorde.",reward:"Attribuer la pluie \u00e0 Allah et non aux \u00e9toiles. Le Proph\u00e8te \uFEDF a dit que celui qui l\u2019attribue \u00e0 Allah a cru en Lui."},
        {type:"dua",ref:"Al-Muwatta\u2019 2/992",ar:"سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ، وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ",ph:"Subhanal-ladhi yusabbihur-ra'du bi hamdih, wal-mala'ikatu min khifatih.",fr:"Gloire \u00e0 Celui dont le tonnerre Le glorifie par Sa louange, et les anges Le glorifient par crainte de Lui.",reward:"\u00c0 dire en entendant le tonnerre. Abdallah ibn az-Zubayr s\u2019arr\u00eatait de parler pour r\u00e9citer cette invocation."},
        {type:"dua",ref:"Abu Dawud 1/303",ar:"اللَّهُمَّ اسْقِنَا غَيْثًا مُغِيثًا مَرِيئًا مُرِيعًا، نَافِعًا غَيْرَ ضَارٍّ، عَاجِلًا غَيْرَ آجِلٍ",ph:"Allahumma asqina ghaythan mughithan mari'an muri'an, nafi'an ghayra darrin, 'ajilan ghayra ajilin.",fr:"\u00d4 Allah, accorde-nous une pluie secourable, agr\u00e9able, abondante, utile et non nuisible, prompte et non retard\u00e9e.",reward:"Du\u2019a de la pri\u00e8re de l\u2019istisqa (demande de pluie). Le Proph\u00e8te \uFEDF levait les mains vers le ciel en la r\u00e9citant."},
        {type:"dua",ref:"Al-Bukhari 1/224, Muslim 897",ar:"اللَّهُمَّ حَوَالَيْنَا وَلَا عَلَيْنَا، اللَّهُمَّ عَلَى الْآكَامِ وَالظِّرَابِ وَبُطُونِ الْأَوْدِيَةِ وَمَنَابِتِ الشَّجَرِ",ph:"Allahumma hawalayna wa la 'alayna. Allahumma 'alal-akami wadh-dhirabi wa butun al-awdiyati wa manabiti ash-shajar.",fr:"\u00d4 Allah, autour de nous et non sur nous. \u00d4 Allah, sur les buttes, les collines, le fond des vall\u00e9es et l\u00e0 o\u00f9 poussent les arbres.",reward:"\u00c0 dire quand la pluie est excessive. Le Proph\u00e8te \uFEDF l\u2019a dite et les nuages se sont dispers\u00e9s autour de M\u00e9dine."}
      ]
    },
    {
      id: "iftar",
      name: "Rupture du je\u00fbne",
      icon: "\uD83C\uDF19",
      gradient: "linear-gradient(165deg, #2a221a 0%, #262016 30%, #1f1a10 60%, #1a160e 100%)",
      articleBg: "rgba(26,22,14,0.95)",
      quote: "Le je\u00fbneur a une invocation exauc\u00e9e au moment de la rupture.",
      articleTitle: "Du\u2019a de l\u2019Iftar",
      entries: [
        {type:"dua",ref:"Abu Dawud 2357",ar:"ذَهَبَ الظَّمَأُ، وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللهُ",ph:"Dhahabadh-dhama'u wabtallatil-'uruqu wa thabatal-ajru in sha'Allah.",fr:"La soif a disparu, les veines se sont humect\u00e9es et la r\u00e9compense est assur\u00e9e si Allah le veut.",reward:"Du\u2019a sp\u00e9cifique du Proph\u00e8te \uFEDF au moment de la rupture du je\u00fbne. Le je\u00fbneur a une invocation exauc\u00e9e \u00e0 cet instant."},
        {type:"dua",ref:"Ibn Majah",ar:"اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ أَنْ تَغْفِرَ لِي",ph:"Allahumma inni as'aluka bi rahmatika allati wasi'at kulla shay'in an taghfira li.",fr:"\u00d4 Allah, je Te demande par Ta mis\u00e9ricorde qui englobe toute chose de me pardonner.",reward:"Invoquer Allah par Sa mis\u00e9ricorde qui embrasse toute chose. Le moment de l\u2019iftar est l\u2019un des meilleurs pour la du\u2019a."}
      ]
    },
    {
      id: "mariage",
      name: "Mariage",
      icon: "\uD83D\uDC8D",
      gradient: "linear-gradient(165deg, #221a28 0%, #1e1624 30%, #18101e 60%, #140c18 100%)",
      articleBg: "rgba(20,12,24,0.95)",
      quote: "Et parmi Ses signes, Il a cr\u00e9\u00e9 pour vous des \u00e9pouses.",
      articleTitle: "Invocations du mariage",
      entries: [
        {type:"dua",ref:"Abu Dawud 2/248, At-Tirmidhi 1091, Ibn Majah 1/617",ar:"بَارَكَ اللهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",ph:"Barakallahu lak, wa baraka 'alayk, wa jama'a baynakuma fi khayr.",fr:"Qu\u2019Allah te b\u00e9nisse, r\u00e9pande sur toi Ses b\u00e9n\u00e9dictions et vous rassemble dans le bien.",reward:"F\u00e9licitations proph\u00e9tiques pour les mari\u00e9s. Le Proph\u00e8te \uFEDF la disait au lieu des f\u00e9licitations de la jahiliya."},
        {type:"dua",ref:"Abu Dawud 2/248, Ibn Majah 1/617",ar:"اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا وَخَيْرَ مَا جَبَلْتَهَا عَلَيْهِ، وَأَعُوذُ بِكَ مِنْ شَرِّهَا وَشَرِّ مَا جَبَلْتَهَا عَلَيْهِ",ph:"Allahumma inni as'aluka khayraha wa khayra ma jabaltaha 'alayh, wa a'udhu bika min sharriha wa sharri ma jabaltaha 'alayh.",fr:"\u00d4 Allah, je Te demande son bien et le bien de ce sur quoi Tu l\u2019as cr\u00e9\u00e9e, et je cherche refuge aupr\u00e8s de Toi contre son mal et le mal de ce sur quoi Tu l\u2019as cr\u00e9\u00e9e.",reward:"\u00c0 dire en prenant la main de son \u00e9pouse lors de la nuit de noces. On demande le bien de son caract\u00e8re et de sa nature."},
        {type:"dua",ref:"Al-Bukhari 6/141, Muslim 2/1028",ar:"بِسْمِ اللهِ، اللَّهُمَّ جَنِّبْنَا الشَّيْطَانَ وَجَنِّبِ الشَّيْطَانَ مَا رَزَقْتَنَا",ph:"Bismillah. Allahumma jannibna ash-shaytana wa jannibish-shaytana ma razaqtana.",fr:"Au nom d\u2019Allah. \u00d4 Allah, \u00e9carte de nous Satan et \u00e9carte Satan de ce que Tu nous accorderas.",reward:"Le Proph\u00e8te \uFEDF a dit : si un enfant est con\u00e7u apr\u00e8s cette invocation, Satan ne lui nuira jamais."}
      ]
    },
    {
      id: "defunt",
      name: "Pour le d\u00e9funt",
      icon: "\uD83D\uDD6F\uFE0F",
      gradient: "linear-gradient(165deg, #181818 0%, #141414 30%, #101010 60%, #0c0c0c 100%)",
      articleBg: "rgba(12,12,12,0.95)",
      quote: "Demandez le pardon pour votre fr\u00e8re, il est maintenant interrog\u00e9.",
      articleTitle: "Pri\u00e8re pour le d\u00e9funt",
      entries: [
        {type:"dua",ref:"Muslim 963",ar:"اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ، وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ، وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِ مِنَ الْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ الْأَبْيَضَ مِنَ الدَّنَسِ، وَأَبْدِلْهُ دَارًا خَيْرًا مِنْ دَارِهِ، وَأَهْلًا خَيْرًا مِنْ أَهْلِهِ، وَزَوْجًا خَيْرًا مِنْ زَوْجِهِ، وَأَدْخِلْهُ الْجَنَّةَ، وَأَعِذْهُ مِنْ عَذَابِ الْقَبْرِ وَعَذَابِ النَّارِ",ph:"Allahummagh-fir lahu warhamh, wa 'afihi wa'fu 'anh, wa akrim nuzulah, wa wassi' mudkhalah, waghsilhu bil-ma'i wath-thalji wal-barad. Wa naqqihi minal-khataya kama naqqaytath-thawbal-abyada minad-danas. Wa abdilhu daran khayran min darih, wa ahlan khayran min ahlih, wa zawjan khayran min zawjih. Wa adkhilhul-Jannah, wa a'idhhu min 'adhabil-qabri wa 'adhabin-Nar.",fr:"\u00d4 Allah, pardonne-lui et accorde-lui Ta mis\u00e9ricorde. Pr\u00e9serve-le et absous-le. Honore son accueil et \u00e9largis sa demeure. Lave-le avec l\u2019eau, la neige et la gr\u00eale. Purifie-le de ses p\u00e9ch\u00e9s comme Tu purifies le v\u00eatement blanc de la souillure. Accorde-lui une demeure meilleure que la sienne, une famille meilleure que la sienne, une \u00e9pouse meilleure que la sienne. Fais-le entrer au Paradis et prot\u00e8ge-le du ch\u00e2timent de la tombe et du ch\u00e2timent du Feu.",reward:"Du\u2019a compl\u00e8te de la pri\u00e8re fun\u00e9raire enseign\u00e9e par le Proph\u00e8te \uFEDF. Elle couvre le pardon, la purification et l\u2019entr\u00e9e au Paradis."},
        {type:"dua",ref:"Ibn Majah 1/480, Ahmad 2/368",ar:"اللَّهُمَّ اغْفِرْ لِحَيِّنَا وَمَيِّتِنَا، وَشَاهِدِنَا وَغَائِبِنَا، وَصَغِيرِنَا وَكَبِيرِنَا، وَذَكَرِنَا وَأُنْثَانَا. اللَّهُمَّ مَنْ أَحْيَيْتَهُ مِنَّا فَأَحْيِهِ عَلَى الْإِسْلَامِ، وَمَنْ تَوَفَّيْتَهُ مِنَّا فَتَوَفَّهُ عَلَى الْإِيمَانِ. اللَّهُمَّ لَا تَحْرِمْنَا أَجْرَهُ وَلَا تُضِلَّنَا بَعْدَهُ",ph:"Allahummagh-fir li hayyina wa mayyitina, wa shahidina wa gha'ibina, wa saghirina wa kabirina, wa dhakarana wa unthana. Allahumma man ahyaytahu minna fa ahyihi 'alal-Islam, wa man tawaffaytahu minna fa tawaffahu 'alal-iman. Allahumma la tahrimna ajrahu wa la tudillana ba'dah.",fr:"\u00d4 Allah, pardonne \u00e0 nos vivants et \u00e0 nos morts, \u00e0 ceux qui sont pr\u00e9sents parmi nous et \u00e0 ceux qui sont absents, \u00e0 nos jeunes et \u00e0 nos vieux, \u00e0 nos hommes et \u00e0 nos femmes. \u00d4 Allah, celui d\u2019entre nous que Tu maintiens en vie, fais-le vivre dans l\u2019Islam, et celui d\u2019entre nous que Tu rappelles \u00e0 Toi, fais-le mourir dans la foi. \u00d4 Allah, ne nous prive pas de sa r\u00e9compense et ne nous \u00e9gare pas apr\u00e8s lui.",reward:"Invocation englobant toute la communaut\u00e9 : vivants et morts, pr\u00e9sents et absents, jeunes et vieux."},
        {type:"dua",ref:"Abu Dawud 3/211, Ibn Majah",ar:"اللَّهُمَّ إِنَّ فُلَانَ بْنَ فُلَانٍ فِي ذِمَّتِكَ وَحَبْلِ جِوَارِكَ، فَقِهِ مِنْ فِتْنَةِ الْقَبْرِ وَعَذَابِ النَّارِ، وَأَنْتَ أَهْلُ الْوَفَاءِ وَالْحَقِّ، فَاغْفِرْ لَهُ وَارْحَمْهُ، إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ",ph:"Allahumma inna fulana bna fulanin fi dhimmatika wa habli jiwarik. Faqihi min fitnatil-qabri wa 'adhabin-Nar. Wa Anta ahlul-wafa'i wal-haqq. Faghfir lahu warhamhu innaka Antal-Ghafurur-Rahim.",fr:"\u00d4 Allah, Untel fils d\u2019Untel est sous Ta protection et au voisinage de Ta garde. Prot\u00e8ge-le de l\u2019\u00e9preuve de la tombe et du ch\u00e2timent du Feu. Tu es Fid\u00e8le et V\u00e9ridique. Pardonne-lui et accorde-lui Ta mis\u00e9ricorde. Tu es certes le Pardonneur, le Mis\u00e9ricordieux.",reward:"Du\u2019a personnalis\u00e9e pour le d\u00e9funt qu\u2019on place sous la protection d\u2019Allah, invoquant Sa fid\u00e9lit\u00e9 \u00e0 Ses promesses."}
      ]
    },
    {
      id: "marche",
      name: "Entrer au march\u00e9",
      icon: "\uD83C\uDFEA",
      gradient: "linear-gradient(165deg, #1e2420 0%, #1a201c 30%, #151a18 60%, #101614 100%)",
      articleBg: "rgba(16,22,20,0.95)",
      quote: "Celui qui dit cette invocation au march\u00e9, Allah lui inscrit un million de bonnes actions.",
      articleTitle: "Du\u2019a du march\u00e9",
      entries: [
        {type:"dua",ref:"At-Tirmidhi 5/291, Al-Hakim 1/538",ar:"لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ، وَهُوَ حَيٌّ لَا يَمُوتُ، بِيَدِهِ الْخَيْرُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",ph:"La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, yuhyi wa yumit, wa Huwa Hayyun la yamut, bi yadihil-khayr, wa Huwa 'ala kulli shay'in Qadir.",fr:"Il n\u2019y a de divinit\u00e9 qu\u2019Allah, Unique, sans associ\u00e9. \u00c0 Lui la royaut\u00e9 et \u00e0 Lui la louange. Il fait vivre et fait mourir. Il est Vivant et ne meurt pas. Le bien est dans Sa main et Il est capable de toute chose.",reward:"Celui qui la dit en entrant au march\u00e9, Allah lui inscrit un million de bonnes actions, lui efface un million de p\u00e9ch\u00e9s et lui \u00e9l\u00e8ve un million de degr\u00e9s."}
      ]
    },
    {
      id: "taajjub",
      name: "\u00c9merveillement et bonne nouvelle",
      icon: "\u2728",
      gradient: "linear-gradient(165deg, #2a1f35 0%, #221a30 30%, #1a1428 60%, #140e20 100%)",
      articleBg: "rgba(20,14,32,0.95)",
      quote: "Glorifier Allah devant ce qui nous \u00e9merveille et devant toute bonne nouvelle.",
      articleTitle: "Du\u2019a at-Ta\u2019ajjub",
      entries: [
        {type:"dua",ref:"Hisn al-Muslim n\u00b0 240",ar:"\u0633\u064F\u0628\u0652\u062D\u064E\u0627\u0646\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u0650",ph:"SubhanAllah !",fr:"Gloire \u00e0 Allah ! (Se dit lorsque l\u2019on est \u00e9merveill\u00e9 ou \u00e9tonn\u00e9 par quelque chose.)",reward:"Glorifier Allah devant ce qui nous \u00e9merveille. Les deux mots SubhanAllah et Alhamdulillah remplissent la balance des bonnes \u0153uvres."},
        {type:"dua",ref:"Hisn al-Muslim n\u00b0 241",ar:"\u0627\u0644\u0644\u0651\u064E\u0647\u064F \u0623\u064E\u0643\u0652\u0628\u064E\u0631\u064F",ph:"Allahu Akbar !",fr:"Allah est le Plus Grand ! (Se dit lorsque l\u2019on re\u00e7oit une bonne nouvelle.)",reward:"Proclamer la grandeur d\u2019Allah devant toute bonne nouvelle. C\u2019est la parole du takbir qui accompagne la joie du croyant."}
      ]
    },
    {
      id: "salawat",
      name: "Salawat sur le Prophète ﷺ",
      icon: "🌿",
      gradient: "linear-gradient(165deg, #0d2218 0%, #0a1c14 30%, #071610 60%, #041008 100%)",
      articleBg: "rgba(4,10,8,0.95)",
      quote: "Celui qui invoque la bénédiction sur moi une fois, Allah lui en accordera dix. (Muslim 408)",
      articleTitle: "As-Salawat 'ala an-Nabi ﷺ",
      entries: [
        {type:"dua",ref:"Boukhârî 3370",ar:"اَللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَّعَلَىٰ اٰلِ مُحَمَّدٍ ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيْمَ وَعَلَىٰ اٰلِ إِبْرَاهِيْمَ ، إِنَّكَ حَمِيْدٌ مَّجِيْدٌ ، اَللّٰهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَّعَلَىٰ اٰلِ مُحَمَّدٍ ، كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيْمَ وَعَلَىٰ اٰلِ إِبْرَاهِيْمَ ، إِنَّكَ حَمِيْدٌ مَّجِيْدٌ.",ph:"Allāhumma ṣalli ʿalā Muḥammad wa ʿalā āli Muḥammad, kamā ṣallayta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, innaka Ḥamīdu-m-Majīd, Allāhumma bārik ʿalā Muḥammad, wa ʿalā āli Muḥammad, kamā bārakta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, innaka Ḥamīdu-m-Majīd.",fr:"Ô Allah, envoie les salutations sur Mouḥammad ﷺ et sur la famille de Mouḥammad ﷺ, comme Tu as envoyé les salutations sur Ibrāhīm ﷺ et sur la famille d'Ibrāhīm ﷺ ; certes, Tu es Digne de louanges, Le Très Glorieux. Ô Allah, bénis Mouḥammad ﷺ et la famille de Mouḥammad ﷺ, comme Tu as béni Ibrāhīm ﷺ et la famille d'Ibrāhīm ﷺ ; certes, Tu es Digne de louanges, Le Très Glorieux.",reward:"La formule la plus compl\u00e8te des salawat ibrahimiques. Celui qui envoie une salutation sur le Proph\u00e8te \uFEDF, Allah lui en accorde dix."},
        {type:"dua",ref:"Dâraqoutnî 1338",ar:"اَللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَّعَلَىٰ اٰلِ بَيْتِهِ ، كَمَا صَلَّيْتَ عَلَىٰ اٰلِ إِبْرَاهِيْمَ ، إِنَّكَ حَمِيْدٌ مَّجِيْدٌ ، اَللّٰهُمَّ صَلِّ عَلَيْنَا مَعَهُمْ ، اَللّٰهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَّعَلَىٰ اٰلِ بَيْتِهِ ، كَمَا بَارَكْتَ عَلَىٰ اٰلِ إِبْرَاهِيْمَ ، إِنَّكَ حَمِيْدٌ مَّجِيْدٌ ، اَللّٰهُمَّ بَارِكْ عَلَيْنَا مَعَهُمْ ، صَلَوَاتُ اللّٰهِ وَصَلَاةُ الْمُؤْمِنِيْنَ عَلَىٰ مُحَمَّدٍ النَّبيِّ الْأُمِّيِّ.",ph:"Allāhumma ṣalli ʿalā Muḥammad wa ʿalā āli baytih, kamā ṣallayta ʿalā āli Ibrāhīm, innaka Ḥamīdu-m-Majīd, Allāhumma ṣalli ʿalayna maʿahum, Allāhumma bārik ʿalā Muḥammad wa ʿalā āli baytih, kamā bārakta ʿalā āli Ibrāhīm, innaka Ḥamīdu-m-Majīd, Allāhumma bārik ʿalaynā maʿahum, ṣalawātu-llāhi wa ṣalātul-mu'minīna ʿalā Muḥammadi-nin-Nabiyyil-ummiyy.",fr:"Ô Allah, envoie les salutations sur Mouḥammad ﷺ et sur Sa famille, comme Tu as envoyé les salutations sur la famille d'Ibrāhīm ﷺ ; certes, Tu es Digne de louanges, Le Très Glorieux. Ô Allah, accorde-nous cette miséricorde avec eux. Ô Allah, bénis Mouḥammad ﷺ et Sa famille, comme Tu as béni la famille d'Ibrāhīm ﷺ ; certes, Tu es Digne de louanges, Le Très Glorieux. Ô Allah, bénis-nous avec eux. Que les bénédictions d'Allah et les salutations des croyants soient sur Mouḥammad ﷺ, le Prophète.",reward:"Variante qui demande \u00e0 \u00eatre inclus dans la mis\u00e9ricorde et la b\u00e9n\u00e9diction accord\u00e9es au Proph\u00e8te \uFEDF et sa famille."},
        {type:"dua",ref:"Boukhârî 3369",ar:"اَللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَّأَزْوَاجِهِ وَذُرِّيَّتِهِ ، كَمَا صَلَّيْتَ عَلَىٰ اٰلِ إِبْرَاهِيْمَ ، وَبَارِكْ عَلَىٰ مُحَمَّدٍ وَّأَزْوَاجِهِ وَذُرِّيَّتِهِ ، كَمَا بَارَكْتَ عَلَىٰ اٰلِ إِبْرَاهِيْمَ ، إِنَّكَ حَمِيْدٌ مَّجِيْدٌ.",ph:"Allāhumma ṣalli ʿalā Muḥammadiw-wa azwājihī wa dhurriy-yatih, kamā ṣallayta ʿalā āli Ibrāhīm, wa bārik ʿalā Muḥammadi-w-wa azwājihī wa dhurriyyatih, kamā bārakta ʿalā āli Ibrāhīm, innaka Ḥamīdu-m-Majīd.",fr:"Ô Allah, envoie les salutations sur Mouḥammad ﷺ, sur Ses épouses et sur Sa descendance, comme Tu as envoyé les salutations sur la famille d'Ibrāhīm ﷺ ; et bénis Mouḥammad ﷺ, Ses épouses et Sa descendance, comme Tu as béni la famille d'Ibrāhīm ﷺ ; certes, Tu es Digne de louanges, Le Très Glorieux.",reward:"Variante incluant explicitement les \u00e9pouses et la descendance du Proph\u00e8te \uFEDF dans les b\u00e9n\u00e9dictions."},
        {type:"dua",ref:"Muslim 405",ar:"اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَّعَلَىٰ اٰلِ مُحَمَّدٍ ، كَمَا صَلَّيْتَ عَلَىٰ اٰلِ إِبْرَاهِيْمَ ، وَبَارِكْ عَلَىٰ مُحَمَّدٍ وَّعَلَىٰ اٰلِ مُحَمَّدٍ ، كَمَا بَارَكْتَ عَلَىٰ اٰلِ إِبْرَاهِيْمَ فِي الْعَالَمِيْنَ ، إِنَّكَ حَمِيْدٌ مَّجِيْدٌ.",ph:"Allāhumma ṣalli ʿalā Muḥammad wa ʿalā āli Muḥammad, kamā ṣallayta ʿalā āli Ibrāhīm, wa bārik ʿalā Muḥammad, wa ʿalā āli Muḥammad, kamā bārakta ʿalā āli Ibrāhīma fi-l-ʿālamīn, innaka Ḥamīdu-m-Majīd.",fr:"Ô Allah, envoie les salutations sur Mouḥammad ﷺ et sur la famille de Mouḥammad ﷺ, comme Tu as envoyé les salutations sur la famille d'Ibrāhīm ﷺ ; et bénis Mouḥammad ﷺ et la famille de Mouḥammad ﷺ, comme Tu as béni la famille d'Ibrāhīm ﷺ dans les mondes ; certes, Tu es Digne de louanges, Le Très Glorieux.",reward:"Formule pr\u00e9cisant \u00ab dans les mondes \u00bb, soulignant la port\u00e9e universelle des b\u00e9n\u00e9dictions sur le Proph\u00e8te \uFEDF."},
        {type:"dua",ref:"Ahmad 17067",ar:"اَللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَّعَلَىٰ اٰلِ مُحَمَّدٍ ، وَبَارِكْ عَلَىٰ مُحَمَّدٍ وَّعَلَىٰ اٰلِ مُحَمَّدٍ ، كَمَا بَارَكْتَ عَلَىٰ إبْرَاهِيْمَ فِي الْعَالَمِيْنَ ، إِنَّكَ حَمِيْدٌ مَجِيْدٌ.",ph:"Allāhumma ṣalli ʿalā Muḥammad wa ʿalā āli Muḥammad, wa bārik ʿalā Muḥammad wa ʿalā āli Muḥammad, kamā bārakta ʿalā Ibrāhīma fi-l-ʿālamīn, innaka Ḥamīdu-m-Majīd.",fr:"Ô Allah, envoie les salutations sur Mouḥammad ﷺ et sur la famille de Mouḥammad ﷺ ; et bénis Mouḥammad ﷺ et la famille de Mouḥammad ﷺ, comme Tu as béni Ibrāhīm ﷺ dans les mondes ; certes, Tu es Digne de louanges, Le Très Glorieux.",reward:"Les salawat rapprochent du Proph\u00e8te \uFEDF le Jour du Jugement. Plus on envoie de salutations, plus on est proche de lui."},
        {type:"dua",ref:"Boukhârî 4798",ar:"اَللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ عَبْدِكَ وَرَسُوْلِكَ ، كَمَا صَلَّيْتَ عَلَىٰ اٰلِ إبْراهِيْمَ ، وَبَارِكْ عَلَىٰ مُحَمَّدٍ وَّعَلَىٰ اٰلِ مُحَمَّدٍ ، كَمَا بَارَكْتَ عَلَىٰ إبْرَاهِيْمَ.",ph:"Allāhumma ṣalli ʿalā Muḥammad ʿabdika wa rasulik, kamā ṣallayta ʿalā āli Ibrāhīm, wa bārik ʿalā Muḥammad wa ʿalā āli Muḥammad, kamā bārakta ʿalā Ibrāhīm.",fr:"Ô Allah, envoie les salutations sur Ton Serviteur et Messager Mouḥammad ﷺ, comme Tu as envoyé les salutations sur la famille d'Ibrāhīm ﷺ ; et bénis Mouḥammad ﷺ et la famille de Mouḥammad ﷺ, comme Tu as béni Ibrāhīm ﷺ.",reward:"Variante qui qualifie Muhammad \uFEDF de \u00ab Ton Serviteur et Messager \u00bb, rappelant sa double qualit\u00e9 d\u2019adoration et de mission."},
        {type:"dua",ref:"Boukhârî 4797",ar:"اَللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَّعَلَىٰ اٰلِ مُحَمَّدٍ ، كَما صَلَّيْتَ عَلَىٰ اٰلِ إبْراهِيْمَ إنَّكَ حَمِيْدٌ مَّجِيْدٌ ، اَللّٰهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَّعَلَىٰ اٰلِ مُحَمَّدٍ ، كَمَا بارَكْتَ عَلَىٰ اٰلِ إِبْرَاهِيْمَ ، إِنَّكَ حَمِيْدٌ مَّجِيْدٌ.",ph:"Allāhumma ṣalli ʿalā Muḥammad wa ʿalā āli Muḥammad, kamā ṣallayta ʿalā āli Ibrāhīm, innaka Ḥamīdu-m-Majīd, Allāhumma bārik ʿalā Muḥammad wa ʿalā āli Muḥammad, kamā bārakta ʿalā āli Ibrāhīm, innaka Ḥamīdu-m-Majīd.",fr:"Ô Allah, envoie les salutations sur Mouḥammad ﷺ et sur la famille de Mouḥammad ﷺ, comme Tu as envoyé les salutations sur la famille d'Ibrāhīm ﷺ ; certes, Tu es Digne de louanges, Le Très Glorieux. Ô Allah, bénis Mouḥammad ﷺ et la famille de Mouḥammad ﷺ, comme Tu as béni la famille d'Ibrāhīm ﷺ ; certes, Tu es Digne de louanges, Le Très Glorieux.",reward:"Le vendredi est le meilleur jour pour multiplier les salawat. Le Proph\u00e8te \uFEDF a dit : multipliez les salutations sur moi le vendredi."},
        {type:"dua",ref:"Ahmad 17072",ar:"اَللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ النَّبِيِّ الأُمِّيِّ وَعَلَىٰ اٰلِ مُحَمَّدٍ ، كَمَا صَلَّيْتَ عَلَىٰ إبْرَاهِيْمَ وَاٰلِ إبْرَاهِيْمَ ، وَبَارِكْ عَلَىٰ مُحَمَّدٍ النَّبِيِّ الأُمِّيِّ ، كَمَا بارَكْتَ عَلَىٰ إبْرَاهِيْمَ وَعَلَىٰ اٰلِ إِبْرَاهِيْمَ ، إِنَّكَ حَمِيْدٌ مَّجِيْدٌ.",ph:"Allāhumma ṣalli ʿalā Muḥammadi-nin-Nabiyyil-ummiyy wa ʿalā āli Muḥammad, kamā ṣallayta ʿalā Ibrāhīm, wa āli Ibrāhīma, wa bārik ʿalā Muḥammadi-nin-Nabiyyil-ummiyy, kamā bārakta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīma, innaka Ḥamīdu-m-Majīd.",fr:"Ô Allah, envoie les salutations sur Mouḥammad ﷺ, le Prophète et sur la famille de Mouḥammad ﷺ, comme Tu as envoyé les salutations sur Ibrāhīm ﷺ et la famille d'Ibrāhīm ﷺ ; et bénis Mouḥammad ﷺ, le Prophète, comme Tu as béni Ibrāhīm ﷺ et la famille d'Ibrāhīm ﷺ ; certes, Tu es Digne de louanges, Le Très Glorieux.",reward:"L\u2019avare est celui devant qui mon nom est mentionn\u00e9 et qui n\u2019envoie pas de salutations sur moi (Tirmidhi)."},
        {type:"dua",ref:"Nasâ'î 1292",ar:"اَللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَّعَلَىٰ اٰلِ مُحَمَّدٍ.",ph:"Allāhumma ṣalli ʿalā Muḥammad wa ʿalā āli Muḥammad.",fr:"Ô Allah, envoie les salutations sur Mouḥammad ﷺ et sur la famille de Mouḥammad ﷺ.",reward:"La forme la plus concise des salawat. Le Proph\u00e8te \uFEDF a dit : \u00ab Celui qui prie sur moi une fois, Allah priera sur lui dix fois. \u00bb"}
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
      var num = String(idx + 1).padStart(2, "0");
      card.innerHTML =
        '<span class="dua-card-num">' + num + '</span>' +
        '<div class="dua-card-body">' +
          '<div class="dua-card-name">' + cat.name + '</div>' +
          '<div class="dua-card-count">' + cat.entries.length + ' invocations</div>' +
        '</div>' +
        '<span class="dua-card-arrow"><svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
      card.addEventListener("click", function() { openDuaDetail(idx); });
      grid.appendChild(card);
    });
    // Image initiale du hero (aléatoire au chargement)
    var heroBg = document.getElementById("dua-hero-bg");
    if (heroBg) {
      var img = PRAYER_IMGS[Math.floor(Math.random() * PRAYER_IMGS.length)];
      heroBg.style.backgroundImage = "url('img/prayer/" + img + "')";
    }
    // Search button listeners
    var searchBtn = $("dua-search-btn");
    if (searchBtn) searchBtn.addEventListener("click", toggleDuaSearch);
    var searchClose = $("dua-search-close");
    if (searchClose) searchClose.addEventListener("click", toggleDuaSearch);
  }

  function openDuaDetail(idx, scrollToEntry) {
    var cat = DUA_CATEGORIES[idx];
    if (!cat) return;
    stopDuaAudio();
    preloadDuaAudio(cat.id, cat.entries);
    var overlay = $("dua-overlay");
    overlay.style.background = cat.gradient;
    $("dua-title").textContent = cat.name;
    $("dua-quote").textContent = cat.quote;
    $("dua-article").style.background = cat.articleBg;
    $("dua-article-title").textContent = cat.articleTitle;
    var entriesEl = $("dua-entries");
    entriesEl.innerHTML = "";
    cat.entries.forEach(function(entry, entryIdx) {
      var block = document.createElement("div");
      block.className = "emotion-entry";
      block.id = "dua-entry-" + idx + "-" + entryIdx;

      var headerRow = document.createElement("div");
      headerRow.className = "dua-entry-header";

      var badge = document.createElement("span");
      badge.className = "emotion-entry-badge " + (entry.type === "verset" ? "verset" : "dua");
      badge.textContent = entry.type === "verset" ? "VERSET" : "DU\u2019A";
      headerRow.appendChild(badge);

      var audioUrl = getDuaAudioUrl(cat.id, entryIdx, entry.ref);
      if (audioUrl) {
        var playBtn = document.createElement("button");
        playBtn.className = "dua-play-btn";
        playBtn.setAttribute("aria-label", "\u00c9couter");
        playBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><polygon points="9 6 19 12 9 18" fill="currentColor"/></svg>';
        (function(cid, eidx, eref, btn) {
          btn.addEventListener("click", function(e) {
            e.stopPropagation();
            playDuaAudio(cid, eidx, eref, btn);
          });
        })(cat.id, entryIdx, entry.ref, playBtn);
        headerRow.appendChild(playBtn);
      }

      // Heart / favorite button
      var heartBtn = document.createElement("button");
      heartBtn.className = "dua-fav-btn" + (isDuaFavorite(cat.id, entryIdx) ? " active" : "");
      heartBtn.setAttribute("aria-label", "Favori");
      heartBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      (function(cid, eidx, ent, btn) {
        btn.addEventListener("click", function(e) {
          e.stopPropagation();
          var on = toggleDuaFavorite(cid, eidx, ent);
          btn.classList.toggle("active", on);
        });
      })(cat.id, entryIdx, entry, heartBtn);
      headerRow.appendChild(heartBtn);

      block.appendChild(headerRow);

      if (entry.ar) {
        var ar = document.createElement("p");
        ar.className = "emotion-entry-ar";
        ar.dir = "rtl";
        ar.textContent = entry.ar;
        block.appendChild(ar);
      }
      if (entry.ph) {
        var ph = document.createElement("p");
        ph.className = "emotion-entry-ph";
        ph.textContent = entry.ph;
        block.appendChild(ph);
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
      if (entry.reward) {
        var rw = document.createElement("div");
        rw.className = "dua-entry-reward";
        rw.textContent = entry.reward;
        block.appendChild(rw);
      }
      entriesEl.appendChild(block);
    });
    var scroll = overlay.querySelector(".emotion-overlay-scroll");
    if (scroll) scroll.scrollTop = 0;
    overlay.classList.remove("hidden");
    // Scroll to specific entry if requested (from search)
    if (typeof scrollToEntry === "number") {
      setTimeout(function() {
        var target = document.getElementById("dua-entry-" + idx + "-" + scrollToEntry);
        if (target && scroll) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          // Brief highlight animation
          target.classList.add("dua-entry-highlight");
          setTimeout(function() { target.classList.remove("dua-entry-highlight"); }, 1800);
        }
      }, 120);
    }
    // Scroll hint: reset and show
    var hint = $("dua-scroll-hint");
    if (hint) {
      hint.classList.remove("hidden");
      // Force CSS animation restart
      hint.style.animation = "none";
      hint.offsetHeight; // reflow
      hint.style.animation = "";
    }
  }

  function closeDuaDetail() {
    stopDuaAudio();
    _closeBack("dua-overlay");
  }

  // ---- DU'A SEARCH ----
  var _duaSearchOpen = false;
  var _duaSearchDebounce = null;

  function toggleDuaSearch() {
    var panel = $("dua-search-panel");
    var input = $("dua-search-input");
    var grid = $("dua-grid");
    _duaSearchOpen = !_duaSearchOpen;
    if (_duaSearchOpen) {
      panel.classList.remove("hidden");
      if (grid) grid.style.display = "none";
      setTimeout(function() { input.focus(); }, 80);
      input.value = "";
      $("dua-search-results").innerHTML = '<div class="dua-search-empty">Tapez un mot pour rechercher dans toutes les invocations</div>';
      input.addEventListener("input", _onDuaSearchInput);
    } else {
      panel.classList.add("hidden");
      if (grid) grid.style.display = "";
      input.removeEventListener("input", _onDuaSearchInput);
      input.value = "";
      $("dua-search-results").innerHTML = "";
    }
  }

  function _onDuaSearchInput() {
    clearTimeout(_duaSearchDebounce);
    _duaSearchDebounce = setTimeout(_executeDuaSearch, 200);
  }

  function _normalizeDuaSearch(str) {
    if (!str) return "";
    return str.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[\u064B-\u065F\u0670]/g, "") // arabic diacritics
      .replace(/[''`\u2018\u2019\u2032]/g, "'")
      .replace(/\s+/g, " ").trim();
  }

  function _executeDuaSearch() {
    var input = $("dua-search-input");
    var resultsEl = $("dua-search-results");
    var query = _normalizeDuaSearch(input.value);
    if (query.length < 2) {
      resultsEl.innerHTML = '<div class="dua-search-empty">Tapez au moins 2 caractères</div>';
      return;
    }
    var results = [];
    var queryWords = query.split(" ").filter(function(w) { return w.length > 0; });
    DUA_CATEGORIES.forEach(function(cat, catIdx) {
      cat.entries.forEach(function(entry, entryIdx) {
        var fields = [
          _normalizeDuaSearch(entry.ar),
          _normalizeDuaSearch(entry.ph),
          _normalizeDuaSearch(entry.fr),
          _normalizeDuaSearch(entry.ref),
          _normalizeDuaSearch(cat.name)
        ];
        var combined = fields.join(" ");
        var allMatch = queryWords.every(function(w) { return combined.indexOf(w) !== -1; });
        if (allMatch) {
          results.push({ cat: cat, catIdx: catIdx, entry: entry, entryIdx: entryIdx });
        }
      });
    });
    if (results.length === 0) {
      resultsEl.innerHTML = '<div class="dua-search-empty">Aucun r\u00e9sultat pour \u00ab\u00a0' + _escapeHtml(input.value) + '\u00a0\u00bb</div>';
      return;
    }
    var html = '<div class="dua-search-count">' + results.length + ' r\u00e9sultat' + (results.length > 1 ? 's' : '') + '</div>';
    results.forEach(function(r) {
      var badgeClass = r.entry.type === "verset" ? "verset" : "dua";
      var badgeText = r.entry.type === "verset" ? "VERSET" : "DU\u2019A";
      var arText = r.entry.ar || "";
      var frText = r.entry.fr || "";
      var frHighlighted = _highlightDuaMatch(frText, queryWords);
      html += '<div class="dua-search-result" data-cat="' + r.catIdx + '" data-entry="' + r.entryIdx + '">';
      html += '<div class="dua-sr-cat"><span class="dua-sr-badge ' + badgeClass + '">' + badgeText + '</span> ' + _escapeHtml(r.cat.name) + '</div>';
      if (arText) html += '<div class="dua-sr-ar">' + _escapeHtml(arText) + '</div>';
      if (frText) html += '<div class="dua-sr-fr">' + frHighlighted + '</div>';
      html += '<div class="dua-sr-ref">' + _escapeHtml(r.entry.ref) + '</div>';
      html += '</div>';
    });
    resultsEl.innerHTML = html;
    // Bind click to open detail
    var items = resultsEl.querySelectorAll(".dua-search-result");
    for (var i = 0; i < items.length; i++) {
      (function(item) {
        item.addEventListener("click", function() {
          var catIdx = parseInt(item.getAttribute("data-cat"));
          var entryIdx = parseInt(item.getAttribute("data-entry"));
          openDuaDetail(catIdx, entryIdx);
        });
      })(items[i]);
    }
  }

  function _highlightDuaMatch(text, queryWords) {
    var escaped = _escapeHtml(text);
    queryWords.forEach(function(w) {
      if (w.length < 2) return;
      var safeW = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      var re = new RegExp("(" + safeW + ")", "gi");
      escaped = escaped.replace(re, '<span class="dua-sr-highlight">$1</span>');
    });
    return escaped;
  }

  function _escapeHtml(str) {
    var d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  // ---- RAMADAN — COMPTE À REBOURS ----
  var _ramadanCountdownInterval = null;

  function updateRamadanCountdown() {
    var el = $("dash-ramadan-countdown");
    if (!el) return;
    var hijri = _getHijriDate(new Date());
    if (hijri.month !== 9 || hijri.day < 20) { el.textContent = ""; return; }
    // 30 jours = durée max de Ramadan. Jours restants après aujourd'hui.
    var daysLeft = 30 - hijri.day;
    var now = new Date();
    var end = new Date(now);
    end.setDate(end.getDate() + daysLeft + 1);
    end.setHours(0, 0, 0, 0);
    var diff = end - now;
    if (diff <= 0) { el.textContent = ""; return; }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var timeStr = d + "j " + h + "h " + m + "min";
    el.textContent = "\u00b7 " + timeStr;
  }

  // ---- RAMADAN — 10 DERNIÈRES NUITS OVERLAY ----
  function openRamadanOverlay() {
    var overlay = $("ramadan-overlay");
    if (!overlay) return;
    var scroll = overlay.querySelector(".ramadan-overlay-scroll");
    if (scroll) scroll.scrollTop = 0;
    overlay.classList.remove("hidden");
    var hint = $("ramadan-scroll-hint");
    if (hint) {
      hint.classList.remove("hidden");
      hint.style.animation = "none";
      hint.offsetHeight;
      hint.style.animation = "";
    }
  }

  function closeRamadanOverlay() {
    _closeBack("ramadan-overlay");
  }

  // ---- DUA CONTACT OVERLAY ----
  var EMAILJS_SERVICE_ID  = "service_0jg9o2t";
  var EMAILJS_TEMPLATE_ID = "template_1sj7c8o";
  var EMAILJS_PUBLIC_KEY  = "FWZ2FYri9Vf9xeko3";

  function openDuaContact() {
    var overlay = $("dua-contact-overlay");
    if (!overlay) return;
    // Fond photo aléatoire
    var bg = $("dua-contact-bg");
    if (bg && PRAYER_IMGS && PRAYER_IMGS.length) {
      var idx = Math.floor(Math.random() * PRAYER_IMGS.length);
      var img = PRAYER_IMGS[idx];
      var ext = img.indexOf(".") !== -1 ? "" : ".jpg";
      bg.style.backgroundImage = "url('img/prayer/" + img + ext + "')";
    }
    // Reset form
    var email = $("dc-email"), besoin = $("dc-besoin"), msg = $("dc-message");
    if (email) email.value = "";
    if (besoin) besoin.value = "";
    if (msg) msg.value = "";
    var err = $("dua-contact-error"), suc = $("dua-contact-success"), sub = $("dua-contact-submit");
    if (err) err.classList.add("hidden");
    if (suc) suc.classList.add("hidden");
    if (sub) { sub.classList.remove("hidden"); sub.disabled = false; sub.textContent = "Envoyer"; }
    // Reset chips
    document.querySelectorAll(".dc-chip").forEach(function(c) { c.classList.remove("active"); });
    var sc = overlay.querySelector(".dua-contact-scroll");
    if (sc) sc.scrollTop = 0;
    overlay.classList.remove("hidden");
  }

  function closeDuaContact() {
    var overlay = $("dua-contact-overlay");
    if (overlay) overlay.classList.add("hidden");
  }

  function submitDuaContact() {
    var emailEl = $("dc-email"), besoinEl = $("dc-besoin"), msgEl = $("dc-message");
    var email = emailEl ? emailEl.value.trim() : "";
    var besoin = besoinEl ? besoinEl.value : "";
    var message = msgEl ? msgEl.value.trim() : "";
    var err = $("dua-contact-error");
    if (!email || !besoin || !message) {
      if (err) { err.textContent = "Veuillez remplir tous les champs."; err.classList.remove("hidden"); }
      return;
    }
    if (err) err.classList.add("hidden");
    var sub = $("dua-contact-submit");
    if (sub) { sub.disabled = true; sub.textContent = "Envoi\u2026"; }

    // Utilise le fetch original (pas le patch CapacitorHttp) pour que
    // EmailJS reconnaisse un vrai navigateur et accepte la requête.
    var _fetch = window.CapacitorWebFetch || window.fetch;
    _fetch.call(window, "https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id:  EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id:     EMAILJS_PUBLIC_KEY,
        template_params: {
          from_email: email,
          besoin:     besoin,
          message:    message
        }
      })
    }).then(function(res) {
      if (res.ok) {
        var suc = $("dua-contact-success");
        if (suc) suc.classList.remove("hidden");
        if (sub) sub.classList.add("hidden");
      } else {
        if (err) { err.textContent = "Erreur d'envoi. Réessayez."; err.classList.remove("hidden"); }
        if (sub) { sub.disabled = false; sub.textContent = "Envoyer"; }
      }
    }).catch(function() {
      if (err) { err.textContent = "Pas de connexion. Réessayez."; err.classList.remove("hidden"); }
      if (sub) { sub.disabled = false; sub.textContent = "Envoyer"; }
    });
  }

  // ============================================================
  // KHATM SYSTEM
  // ============================================================

  var KHATM_KEY = "qurani-khatm";
  var KHATM_HISTORY_KEY = "qurani-khatm-history";
  var khatm = null;
  var _khatmLandingRefresh = null; // set by initKhatmLanding, called after completeKhatmDay
  var kwFromStart = true;
  var kwStartSurahIdx = 0;
  var kwSelectedSurahIdx = -1;
  var kwFromMinimal = false; // true when wizard opened from Mode Concentration

  // =====================================================================

  function loadKhatm() {
    try {
      var raw = localStorage.getItem(KHATM_KEY);
      if (raw) { khatm = JSON.parse(raw); return; }
    } catch(e) {}
    khatm = null;
  }
  function saveKhatm() {
    if (khatm) {
      localStorage.setItem(KHATM_KEY, JSON.stringify(khatm));
      // Sync khatm progress to Watch complication via App Group
      try {
        var p = getKhatmProgress();
        if (p && window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SharedData) {
          window.Capacitor.Plugins.SharedData.saveKhatm({ percent: p.pct, surahNum: p.surahNum, ayahNum: p.ayahNum });
        }
      } catch(e) {}
    }
    if (typeof debouncedSync === "function") debouncedSync();
  }

  // ---- PROGRESS HELPERS ----
  function getKhatmProgress() {
    if (!khatm || !khatm.active || !surahs.length) return null;
    var totalVerses = 0;
    var doneVerses = 0;
    surahs.forEach(function(s, i) {
      var count = s.ayahs.length;
      if (s.surahNumber !== 1 && s.surahNumber !== 9) count -= 1;
      totalVerses += count;
      if (i < khatm.surahIdx) {
        doneVerses += count;
      } else if (i === khatm.surahIdx) {
        doneVerses += khatm.ayahIdx;
      }
    });
    var pct = totalVerses > 0 ? Math.round((doneVerses / totalVerses) * 1000) / 10 : 0;
    var remaining = totalVerses > 0
    ? Math.max(0, Math.round(khatm.goalDays * (1 - doneVerses / totalVerses)))
    : khatm.goalDays;
    var surah = surahs[khatm.surahIdx];
    var surahNum = surah ? surah.surahNumber : 1;
    var translit = SURAH_TRANSLIT[surahNum] || ("Sourate " + surahNum);
    var nameFr = SURAH_NAMES_FR[surahNum] || "";
    var ayahNum = khatm.ayahIdx + 1;
    return { pct: pct, remaining: remaining, translit: translit, nameFr: nameFr, surahNum: surahNum, ayahNum: ayahNum };
  }

  function renderKhatmProgress() {
    var card = $("khatm-progress-card");
    if (!card) return;
    var p = getKhatmProgress();
    if (!p) { card.classList.add("hidden"); return; }
    card.classList.remove("hidden");
    var pctLabel = $("kp-pct-label");
    var locLabel = $("kp-loc-label");
    var daysNum = $("kp-days-num");
    if (pctLabel) pctLabel.textContent = p.pct + "% complété";
    if (locLabel) locLabel.textContent = p.translit.toUpperCase() + " · " + p.ayahNum;
    if (daysNum) daysNum.textContent = p.remaining;
    var arc = $("kp-arc");
    if (arc) {
      var circ = 2 * Math.PI * 17;
      arc.style.strokeDasharray = circ;
      arc.style.strokeDashoffset = circ * (1 - p.pct / 100);
    }
  }

  // ---- LANDING ----
  function initKhatmLanding() {
    loadKhatm();
    // Hero background — use current khatm surah if active, else surah 1
    var heroBg = $("khatm-hero-bg");
    var _heroSurahNum = (khatm && khatm.active && surahs.length > 0 && surahs[khatm.surahIdx])
      ? surahs[khatm.surahIdx].surahNumber : 1;
    if (heroBg) heroBg.style.backgroundImage = "url('" + getSurahImg(_heroSurahNum) + "')";

    // Update hero button label
    var heroBtn = $("khatm-hero-btn");
    var heroMenu = $("khatm-hero-menu");
    var heroDrop = $("khatm-hero-dropdown");
    var resetBtn = $("khatm-reset-btn");

    function updateHeroState() {
      // Update hero bg to match current khatm surah
      var _hNum = (khatm && khatm.active && surahs.length > 0 && surahs[khatm.surahIdx])
        ? surahs[khatm.surahIdx].surahNumber : 1;
      if (heroBg) heroBg.style.backgroundImage = "url('" + getSurahImg(_hNum) + "')";

      var activeHeader = $("kh-active-header");
      var noKhatm = $("kh-no-khatm");

      if (khatm && khatm.active) {
        // Show "X jours jusqu'au khatm ···"
        var daysEl = $("kh-days-title");
        if (daysEl && khatm.goalDays) {
          var p2 = getKhatmProgress();
          var left = p2 ? Math.max(0, Math.round(khatm.goalDays * (1 - p2.pct / 100))) : khatm.goalDays;
          daysEl.innerHTML = '<span class="kh-days-num">' + left + '</span><span class="kh-days-label">JOUR' + (left !== 1 ? 'S' : '') + ' JUSQU\u2019AU KHATM</span>';
        }
        if (activeHeader) activeHeader.classList.remove("hidden");
        if (noKhatm) noKhatm.classList.add("hidden");
        heroBtn.innerHTML = 'CONTINUER MA LECTURE<span class="dash-btn-arrow">\u2192</span>';
        if (heroMenu) heroMenu.classList.add("visible");
      } else {
        if (activeHeader) activeHeader.classList.add("hidden");
        if (noKhatm) noKhatm.classList.remove("hidden");
        heroBtn.innerHTML = 'COMMENCER MON KHATM<span class="dash-btn-arrow">\u2192</span>';
        heroBtn.classList.remove("has-khatm");
        if (heroMenu) heroMenu.classList.remove("visible");
        if (heroDrop) heroDrop.classList.remove("visible");
      }
      renderKhatmProgress();
    }
    _khatmLandingRefresh = updateHeroState; // expose for completeKhatmDay

    if (heroBtn) {
      updateHeroState();
      heroBtn.addEventListener("click", function() {
        loadKhatm(); // toujours relire depuis localStorage
        if (khatm && khatm.active) {
          openKhatmReader(khatm.surahIdx, khatm.ayahIdx, khatm.goalDays);
        } else {
          openKhatmWizard();
        }
      });
    }

    if (heroMenu && heroDrop) {
      heroMenu.addEventListener("click", function(e) {
        e.stopPropagation();
        if (!heroDrop.classList.contains("visible")) {
          // Position dropdown below the ··· button, clamp inside viewport
          var rect = heroMenu.getBoundingClientRect();
          heroDrop.style.top = (rect.bottom + 8) + "px";
          var dleft = rect.left;
          var dw = 190; // min-width
          if (dleft + dw > window.innerWidth - 16) dleft = window.innerWidth - dw - 16;
          if (dleft < 16) dleft = 16;
          heroDrop.style.left = dleft + "px";
        }
        heroDrop.classList.toggle("visible");
      });
      document.addEventListener("click", function(e) {
        if (heroDrop && !heroDrop.contains(e.target) && e.target !== heroMenu) {
          heroDrop.classList.remove("visible");
        }
      });
    }

    // Historique button
    var histBtn = $("kh-history-btn");
    if (histBtn) {
      histBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        if (heroDrop) heroDrop.classList.remove("visible");
        openKhatmHistory();
      });
    }

    // Supprimer button → open delete sheet (NOT directly delete)
    if (resetBtn) {
      resetBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        if (heroDrop) heroDrop.classList.remove("visible");
        openKhatmDeleteSheet(updateHeroState);
      });
    }

    // Progress card click → open reader
    var progressCard = $("khatm-progress-card");
    if (progressCard) {
      progressCard.addEventListener("click", function() {
        if (khatm && khatm.active) {
          openKhatmReader(khatm.surahIdx, khatm.ayahIdx, khatm.goalDays);
        }
      });
    }

    // Build surah list
    var wrap = $("khatm-surah-wrap");
    if (!wrap || !surahs.length) return;
    surahs.forEach(function(s, idx) {
      var num = s.surahNumber;
      var item = document.createElement("div");
      item.className = "kh-surah-item";
      // Image as background — makes connection to reader background obvious
      item.style.backgroundImage = "url('" + getSurahImg(num) + "')";

      // Number badge
      var numEl = document.createElement("span");
      numEl.className = "kh-surah-num";
      numEl.textContent = num;

      var info = document.createElement("div");
      info.className = "kh-surah-info";

      var name = document.createElement("span");
      name.className = "kh-surah-name";
      name.textContent = SURAH_TRANSLIT[num] || ("Sourate " + num);

      var meta = document.createElement("span");
      meta.className = "kh-surah-meta";
      var vc = s.ayahs.length;
      if (num !== 1 && num !== 9) vc -= 1;
      meta.textContent = (SURAH_NAMES_FR[num] || "").toUpperCase() + " · " + vc + " VERSETS";

      var chev = document.createElement("span");
      chev.className = "kh-surah-chevron";
      chev.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>';

      info.appendChild(name);
      info.appendChild(meta);
      item.appendChild(numEl);
      item.appendChild(info);
      item.appendChild(chev);

      item.addEventListener("click", function() {
        openSurahPlayer(idx);
      });
      wrap.appendChild(item);
    });

    // Chevron "Lecture libre" → smooth scroll to first surah
    var sectionChevron = document.querySelector(".khatm-section-chevron");
    if (sectionChevron && !sectionChevron._scrollSet) {
      sectionChevron._scrollSet = true;
      sectionChevron.parentElement.style.cursor = "pointer";
      sectionChevron.parentElement.addEventListener("click", function() {
        var target = $("khatm-surah-wrap");
        var container = $("khatm-landing");
        if (!target || !container) return;
        // Safe-area offset (~50px for iPhone notch/dynamic island)
        var safeTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sat") || "0") || 50;
        var destY = Math.max(0, target.offsetTop - safeTop);
        // Custom slow scroll (~1.4s, ease-in-out)
        var startY = container.scrollTop;
        var dist = destY - startY;
        var duration = 1400;
        var startTime = null;
        function ease(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
        function step(ts) {
          if (!startTime) startTime = ts;
          var p = Math.min((ts - startTime) / duration, 1);
          container.scrollTop = startY + dist * ease(p);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
  }

  // ---- WIZARD ----
  function openKhatmWizard() {
    var w = $("khatm-wizard");
    w.classList.remove("hidden");
    showKwStep("start");
  }
  function closeKhatmWizard() {
    $("khatm-wizard").classList.add("hidden");
  }
  function showKwStep(step) {
    ["kw-step-start","kw-step-ayah","kw-step-goal"].forEach(function(id) {
      $(id).classList.add("hidden");
    });
    $("kw-step-" + step).classList.remove("hidden");
  }
  function updateKwGoalSub() {
    var sub = $("kw-goal-sub");
    if (!sub) return;
    if (kwFromStart) {
      sub.textContent = "Vous commencez depuis le début";
    } else {
      var s = surahs[kwStartSurahIdx];
      if (!s) return;
      var ayahNum = parseInt(($("kw-ayah-input") || {}).value, 10) || 1;
      sub.textContent = "Vous commencez depuis " +
        (SURAH_TRANSLIT[s.surahNumber] || "Sourate " + s.surahNumber) +
        " " + s.surahNumber + "." + ayahNum;
    }
  }
  function initKwSurahPicker() {
    var list = $("kw-picker-list");
    if (!list) return;
    surahs.forEach(function(s, idx) {
      var item = document.createElement("div");
      item.className = "kw-picker-item";
      var left = document.createElement("div");
      var nm = document.createElement("span");
      nm.className = "kw-picker-name";
      nm.textContent = SURAH_TRANSLIT[s.surahNumber] || "Sourate " + s.surahNumber;
      var sb = document.createElement("span");
      sb.className = "kw-picker-sub";
      sb.textContent = s.surahNumber + ". " + (SURAH_NAMES_FR[s.surahNumber] || "");
      left.appendChild(nm);
      left.appendChild(sb);
      var chev = document.createElement("span");
      chev.style.color = "rgba(255,255,255,0.25)";
      chev.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>';
      item.appendChild(left);
      item.appendChild(chev);
      item.addEventListener("click", function() {
        kwSelectedSurahIdx = idx;
        kwStartSurahIdx = idx;
        var disp = $("kw-surah-display");
        if (disp) {
          disp.textContent = s.surahNumber + ". " + (SURAH_TRANSLIT[s.surahNumber] || "Sourate " + s.surahNumber);
          disp.classList.add("selected");
        }
        var ayahInput = $("kw-ayah-input");
        if (ayahInput) {
          var maxV = s.ayahs.length;
          if (s.surahNumber !== 1 && s.surahNumber !== 9) maxV -= 1;
          ayahInput.max = maxV;
          ayahInput.value = 1;
        }
        $("kw-ayah-row").classList.remove("hidden");
        $("kw-surah-picker").classList.add("hidden");
      });
      list.appendChild(item);
    });
  }
  function initKhatmWizard() {
    $("kw-close").addEventListener("click", closeKhatmWizard);
    $("kw-from-start").addEventListener("click", function() {
      kwFromStart = true;
      kwStartSurahIdx = 0;
      updateKwGoalSub();
      showKwStep("goal");
    });
    $("kw-from-specific").addEventListener("click", function() {
      kwFromStart = false;
      kwSelectedSurahIdx = -1;
      $("kw-surah-display").textContent = "Choisir une sourate";
      $("kw-surah-display").classList.remove("selected");
      $("kw-ayah-row").classList.add("hidden");
      showKwStep("ayah");
    });
    $("kw-ayah-back").addEventListener("click", function() { showKwStep("start"); });
    $("kw-surah-row").addEventListener("click", function() {
      $("kw-surah-picker").classList.remove("hidden");
    });
    $("kw-ayah-continue").addEventListener("click", function() {
      if (kwSelectedSurahIdx < 0) return;
      updateKwGoalSub();
      showKwStep("goal");
    });
    $("kw-goal-back").addEventListener("click", function() {
      if (kwFromStart) showKwStep("start");
      else showKwStep("ayah");
    });
    document.querySelectorAll(".kw-goal-opt").forEach(function(el) {
      el.addEventListener("click", function() {
        startKhatm(parseInt(el.dataset.days, 10));
      });
    });
    initKwSurahPicker();
  }
  function startKhatm(goalDays) {
    var surahIdx = kwStartSurahIdx;
    var ayahIdx = 0;
    if (!kwFromStart) {
      var ayahNum = parseInt(($("kw-ayah-input") || {}).value, 10) || 1;
      var s = surahs[surahIdx];
      if (s) {
        ayahIdx = (s.surahNumber === 1 || s.surahNumber === 9) ? ayahNum - 1 : ayahNum;
      }
    }
    khatm = {
      active: true,
      surahIdx: surahIdx,
      ayahIdx: ayahIdx,
      startSurahIdx: surahIdx,
      startAyahIdx: ayahIdx,
      goalDays: goalDays,
      startDate: getLocalDateStr(),
      lang: "ar+fr",
      textScale: 100
    };
    saveKhatm();
    closeKhatmWizard();
    if (kwFromMinimal) {
      kwFromMinimal = false;
      state.minContext = 'khatm';
      state.minSurahIdx = surahIdx;
      state.minAyahIdx = ayahIdx;
      saveState();
      openMinReader(surahIdx, ayahIdx);
    } else {
      openKhatmReader(surahIdx, ayahIdx, goalDays);
    }
    // Update hero button
    var heroBtn = $("khatm-hero-btn");
    var heroMenu = $("khatm-hero-menu");
    if (heroBtn) {
      heroBtn.textContent = "CONTINUER MON KHATM";
      heroBtn.classList.add("has-khatm");
    }
    if (heroMenu) heroMenu.classList.add("visible");
  }

  // ---- READER ----
  var krCurrentSurahIdx = 0;
  var krLoadedUpTo = 0;
  var krScrollEl = null;
  var krScrollTimer = null;
  var krSurahSections = [];
  var krObserver = null;
  var krCompleting = false; // Guard flag: prevents saveKrProgress from overwriting state during COMPLÉTER
  var _krHighWaterMark = 0; // highest verse count scrolled past
  var _krResumeTarget = null; // {si, ai} — resume scroll target for rerenderKrReader race condition
  var _krLastFlushed = 0; // last flushed count to stats
  var _krStatsTimer = null;
  var _krPortionLetters = []; // pre-computed letter counts per verse in order

  function _krTrackVersesRead(scrolledCount) {
    if (scrolledCount > _krHighWaterMark) {
      _krHighWaterMark = scrolledCount;
      clearTimeout(_krStatsTimer);
      _krStatsTimer = setTimeout(_krFlushVersesRead, 2000);
    }
  }
  function _krFlushVersesRead() {
    var diff = _krHighWaterMark - _krLastFlushed;
    if (diff > 0) {
      // Sum letters for flushed verse range
      var letters = 0;
      for (var i = _krLastFlushed; i < _krHighWaterMark && i < _krPortionLetters.length; i++) {
        letters += _krPortionLetters[i];
      }
      recordReading(diff, letters);
      _krLastFlushed = _krHighWaterMark;
    }
  }

  function openKhatmReader(surahIdx, ayahIdx, goalDays) {
    loadKhatm(); // refresh from storage
    var overlay = $("khatm-reader");
    overlay.classList.remove("hidden");
    startReadingTimer();
    // Reset verse counting for this session
    _krHighWaterMark = 0;
    _krLastFlushed = 0;
    _krResumeTarget = null;
    clearTimeout(_krStatsTimer);
    krScrollEl = $("kr-scroll");
    krScrollEl.innerHTML = "";
    krScrollEl.scrollTop = 0; // Reset scroll position from previous session
    krSurahSections = [];

    // Calculate today's reading portion
    krDailyPortion = getTodayPortion();

    if (krDailyPortion) {
      var startPos = krDailyPortion.startPos;
      krCurrentSurahIdx = startPos.surahIdx;

      // Pre-set resume target for rerenderKrReader race condition
      // (tajwid fetch may complete before the 80ms scroll timeout)
      if (khatm.surahIdx !== startPos.surahIdx || khatm.ayahIdx !== startPos.ayahIdx) {
        _krResumeTarget = { si: khatm.surahIdx, ai: khatm.ayahIdx, off: khatm.scrollOffset || 0 };
      }

      updateKrHeader(startPos.surahIdx);
      updateKrBg(startPos.surahIdx);
      updateKrPanel(goalDays);
      updateKrLangDisplay();
      updateKrModeDisplay();
      updateKrRiwayaDisplay();

      // Render the entire daily portion (multi-surah)
      appendKrDailyPortion(krDailyPortion);
      krLoadedUpTo = surahs.length - 1; // no lazy-loading

      updateKrProgressBar();
      startKhatmSession(startPos.surahIdx, startPos.ayahIdx);

      setTimeout(function() {
        // Scroll to current reading position if resuming mid-portion
        var curSi = khatm.surahIdx;
        var curAi = khatm.ayahIdx;
        if (curSi !== startPos.surahIdx || curAi !== startPos.ayahIdx) {
          var target = krScrollEl.querySelector(
            "[data-si=\"" + curSi + "\"][data-ai=\"" + curAi + "\"]"
          );
          if (target) {
            // Use saved pixel offset for precise restore (falls back to 0 = verse at top)
            var savedOff = typeof khatm.scrollOffset === "number" ? khatm.scrollOffset : 0;
            krScrollEl.scrollTop = Math.max(0, target.offsetTop - savedOff);
          }
          // Set high water mark to already-read verses so they aren't re-counted
          var verses = krScrollEl.querySelectorAll(".kr-verse");
          var containerRect = krScrollEl.getBoundingClientRect();
          var visibleTop = containerRect.top + 20;
          var alreadyRead = 0;
          for (var vi = 0; vi < verses.length; vi++) {
            if (verses[vi].getBoundingClientRect().bottom < visibleTop) alreadyRead++;
            else break;
          }
          _krHighWaterMark = alreadyRead;
          _krLastFlushed = alreadyRead;
        }
        krScrollEl.addEventListener("scroll", onKrScroll);
        setupKrObserver();
      }, 80);
    }
  }

  function updateKrProgressBar() {
    var bar = $("kr-progress-bar");
    if (!bar) return;
    var prog = getKhatmProgress();
    var pct = prog ? prog.pct : 0;
    bar.style.width = Math.max(pct, 0.5) + "%"; // min 0.5% so bar is always visible
  }

  function updateKrHeader(surahIdx) {
    var s = surahs[surahIdx];
    if (!s) return;
    $("kr-surah-name").textContent = SURAH_TRANSLIT[s.surahNumber] || ("Sourate " + s.surahNumber);
    $("kr-surah-sub").textContent = (SURAH_NAMES_FR[s.surahNumber] || "").toUpperCase();
  }

  function updateKrBg(surahIdx) {
    var s = surahs[surahIdx];
    if (!s) return;
    $("kr-bg").style.backgroundImage = "url('" + getSurahImg(s.surahNumber) + "')";
  }

  function updateKrPanel(goalDays) {
    if (!goalDays) {
      $("kr-panel-title").textContent = "Lecture libre";
      $("kr-panel-days").textContent = "";
      return;
    }
    $("kr-panel-title").textContent = "Mon Khatm";
    // Calculate remaining days based on actual reading progress
    var prog = getKhatmProgress();
    if (prog) {
      var left = prog.remaining;
      $("kr-panel-days").textContent = left + " jour" + (left !== 1 ? "s" : "") + " restant" + (left !== 1 ? "s" : "");
    } else {
      $("kr-panel-days").textContent = goalDays + " jours restants";
    }
  }

  function updateKrLangDisplay() {
    var lang = (khatm && khatm.lang) || "ar+fr";
    var labels = { "ar": "ARABE", "fr": "FRANÇAIS", "ar+fr": "ARABE & FRANÇAIS", "ph": "PHONÉTIQUE", "ar+ph": "ARABE & PHONÉTIQUE", "fr+ph": "FRANÇAIS & PHONÉTIQUE", "en": "ANGLAIS", "ar+en": "ARABE & ANGLAIS", "en+ph": "ANGLAIS & PHONÉTIQUE" };
    $("kr-lang-val").textContent = labels[lang] || lang;
    document.querySelectorAll(".kr-lang-opt").forEach(function(o) {
      o.classList.toggle("active", o.dataset.lang === lang);
    });
  }

  function updateKrModeDisplay() {
    var mode = (khatm && khatm.krMode) || "minimal";
    var labels = {
      "minimal": "MINIMAL",
      "minimal-color": "MINIMAL · COULEURS",
      "tajwid": "TAJWID",
      "tajwid-color": "TAJWID · COULEURS"
    };
    var el = $("kr-mode-val");
    if (el) el.textContent = labels[mode] || mode.toUpperCase();
    document.querySelectorAll(".kr-mode-opt").forEach(function(o) {
      o.classList.toggle("active", o.dataset.mode === mode);
    });
  }

  function updateKrRiwayaDisplay() {
    var r = state.riwaya || "hafs";
    var el = $("kr-riwaya-val");
    if (el) el.textContent = r === "warsh" ? "WARSH" : "HAFS";
    document.querySelectorAll(".kr-riwaya-opt").forEach(function(o) {
      o.classList.toggle("active", o.dataset.riwaya === r);
    });
  }

  // Render verses of a surah section (fromAyahIdx to toAyahIdx exclusive)
  // toAyahIdx defaults to all ayahs if not provided
  function appendKrSurahSection(surahIdx, fromAyahIdx, toAyahIdx) {
    var s = surahs[surahIdx];
    var sFr = surahsFr[surahIdx];
    var sEn = surahsEn[surahIdx];
    if (!s) return;
    var lang = (khatm && khatm.lang) || "ar+fr";
    var scale = (khatm && khatm.textScale) || 100;
    var arFontSize = (1.7 * scale / 100).toFixed(2) + "rem";
    var krMode = (khatm && khatm.krMode) || "minimal";
    var useColors = (krMode === "minimal-color" || krMode === "tajwid-color");
    var useTajwid = (krMode === "tajwid" || krMode === "tajwid-color");
    var endIdx = (typeof toAyahIdx === "number") ? toAyahIdx : s.ayahs.length;

    var section = document.createElement("div");
    section.className = "kr-surah-section";
    section.dataset.sectionSurahIdx = surahIdx;

    // Separator between surahs
    if (fromAyahIdx === 0 && krSurahSections.length > 0) {
      var sep = document.createElement("div");
      sep.className = "kr-separator";
      section.appendChild(sep);
    }

    // Surah banner header
    if (fromAyahIdx === 0) {
      var banner = document.createElement("div");
      banner.className = "kr-surah-banner";
      var bName = document.createElement("span");
      bName.className = "kr-surah-banner-name";
      bName.textContent = SURAH_TRANSLIT[s.surahNumber] || ("Sourate " + s.surahNumber);
      var bSub = document.createElement("span");
      bSub.className = "kr-surah-banner-sub";
      bSub.textContent = SURAH_NAMES_FR[s.surahNumber] || "";
      banner.appendChild(bName);
      banner.appendChild(bSub);
      section.appendChild(banner);
    }

    // Verses
    var ayahs = s.ayahs;
    var ayahsFr = sFr ? sFr.ayahs : null;
    var ayahsEn = sEn ? sEn.ayahs : null;
    for (var i = fromAyahIdx; i < endIdx; i++) {
      var verse = document.createElement("div");
      verse.className = "kr-verse";
      verse.dataset.si = surahIdx;
      verse.dataset.ai = i;

      var ref = document.createElement("div");
      ref.className = "kr-verse-ref";
      if (i === 0 && s.surahNumber !== 1 && s.surahNumber !== 9) {
        ref.textContent = "\u2022"; // basmala bullet
      } else {
        var dispNum = (s.surahNumber === 1 || s.surahNumber === 9) ? i + 1 : i;
        ref.textContent = s.surahNumber + "." + dispNum;
      }
      verse.appendChild(ref);

      if (lang === "ar" || lang === "ar+fr" || lang === "ar+ph" || lang === "ar+en") {
        var ar = document.createElement("div");
        ar.className = "kr-verse-ar";
        ar.style.fontSize = arFontSize;
        var rawText = ayahs[i];
        if (useColors) {
          var ayahNum = (s.surahNumber === 1 || s.surahNumber === 9) ? (i + 1) : i;
          var cacheKey = s.surahNumber + ":" + ayahNum;
          var overlays = (state.riwaya !== "warsh" && tajwidData && tajwidData[cacheKey]) ? tajwidData[cacheKey] : null;
          var segments = getSegmentsForAyah(cacheKey, rawText, overlays);
          segments.forEach(function(seg) {
            var segText = useTajwid ? seg.chars : stripWaqfMarks(seg.chars);
            var sp = document.createElement("span");
            if (seg.rule) sp.className = "tajwid-" + seg.rule;
            sp.textContent = segText;
            ar.appendChild(sp);
          });
          if (!tajwidData && !tajwidLoading) loadTajwidOverlay();
        } else {
          ar.textContent = useTajwid ? rawText : stripWaqfMarks(rawText);
        }
        verse.appendChild(ar);
      }
      if ((lang === "fr" || lang === "ar+fr" || lang === "fr+ph") && ayahsFr && ayahsFr[i]) {
        var fr = document.createElement("div");
        fr.className = "kr-verse-fr" + (lang === "fr+ph" ? " kr-verse-bright" : "");
        fr.textContent = ayahsFr[i];
        verse.appendChild(fr);
      }
      if (lang === "ph" || lang === "ar+ph" || lang === "fr+ph") {
        var ph = document.createElement("div");
        ph.className = "kr-verse-ph";
        var phData = phoneticData ? phoneticData[s.surahNumber] : null;
        if (phData) {
          ph.textContent = phData[i] || "";
        } else {
          ph.textContent = "\u2026";
          loadPhoneticForSurah(s.surahNumber, function() {
            var l = khatm && khatm.lang;
            if (l === "ph" || l === "ar+ph" || l === "fr+ph" || l === "en+ph") rerenderKrReader();
          });
        }
        verse.appendChild(ph);
      }
      if ((lang === "en" || lang === "ar+en" || lang === "en+ph") && ayahsEn && ayahsEn[i]) {
        var en = document.createElement("div");
        en.className = "kr-verse-en" + (lang === "en+ph" ? " kr-verse-bright" : "");
        en.textContent = ayahsEn[i];
        verse.appendChild(en);
      }
      // Long-press to show action bar
      (function(verseEl, si, ai) {
        var lpTimer = null;
        var lpFired = false;
        function krShowActionBar() {
          window.getSelection().removeAllRanges();
          krSelectedSurahIdx = si;
          krSelectedAyahIdx = ai;
          if (navigator.vibrate) navigator.vibrate(15);
          var bar = $("kr-action-bar");
          if (bar) bar.classList.remove("hidden");
          updateKrActionHeartState();
        }
        var lpStartX = 0, lpStartY = 0;
        verseEl.addEventListener("touchstart", function(e) {
          lpFired = false;
          lpStartX = e.touches[0].clientX;
          lpStartY = e.touches[0].clientY;
          lpTimer = setTimeout(function() {
            lpTimer = null;
            lpFired = true;
            krShowActionBar();
          }, 500);
        }, { passive: true });
        verseEl.addEventListener("touchend", function(e) {
          if (lpTimer) clearTimeout(lpTimer);
          if (lpFired) { e.preventDefault(); window.getSelection().removeAllRanges(); lpFired = false; }
        });
        verseEl.addEventListener("touchmove", function(e) {
          if (!lpTimer) return;
          var dx = e.touches[0].clientX - lpStartX;
          var dy = e.touches[0].clientY - lpStartY;
          if (Math.sqrt(dx*dx + dy*dy) > 8) { clearTimeout(lpTimer); lpTimer = null; }
        });
        verseEl.addEventListener("mousedown", function(e) {
          if (e.button !== 0) return;
          lpFired = false;
          lpTimer = setTimeout(function() {
            lpTimer = null;
            lpFired = true;
            krShowActionBar();
          }, 500);
        });
        verseEl.addEventListener("mouseup", function() {
          if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; }
        });
        verseEl.addEventListener("mouseleave", function() {
          if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; }
        });
        verseEl.addEventListener("contextmenu", function(e) { e.preventDefault(); });
      })(verse, surahIdx, i);

      section.appendChild(verse);
    }

    krScrollEl.appendChild(section);
    krSurahSections.push({ surahIdx: surahIdx, el: section });
    if (krObserver) krObserver.observe(section);
  }

  var krSelectedSurahIdx = -1;
  var krSelectedAyahIdx = -1;
  var krDailyPortion = null; // current day's reading portion

  // Render entire daily reading portion (multi-surah) with COMPLÉTER at the end
  function appendKrDailyPortion(portion) {
    var startSi = portion.startPos.surahIdx;
    var startAi = portion.startPos.ayahIdx;
    var endSi = portion.endPos.surahIdx;
    var endAi = portion.endPos.ayahIdx;
    var wraps = !!portion.wraps;

    // Build segment list: if wraps, we have 2 segments (start→end of Quran, then 0→endPos)
    var segments = [];
    if (wraps) {
      // Segment 1: from startPos to end of Quran (sourate 114)
      segments.push({ fromSi: startSi, fromAi: startAi, toSi: surahs.length - 1, toAi: surahs[surahs.length - 1].ayahs.length });
      // Segment 2: from sourate 1 to endPos
      segments.push({ fromSi: 0, fromAi: 0, toSi: endSi, toAi: endAi });
    } else {
      segments.push({ fromSi: startSi, fromAi: startAi, toSi: endSi, toAi: endAi });
    }

    // Pre-compute letter counts for each verse in order (for hassanates)
    _krPortionLetters = [];
    segments.forEach(function(seg) {
      for (var pi = seg.fromSi; pi <= seg.toSi && pi < surahs.length; pi++) {
        var ps = surahs[pi];
        if (!ps) continue;
        var pFrom = (pi === seg.fromSi) ? seg.fromAi : 0;
        var pTo = (pi === seg.toSi) ? seg.toAi : ps.ayahs.length;
        if (pTo === 0 && pi === seg.toSi && pi !== seg.fromSi) break;
        for (var pa = pFrom; pa < pTo; pa++) {
          _krPortionLetters.push(countArabicLetters(ps.ayahs[pa] || ""));
        }
      }
    });

    // Render each segment
    segments.forEach(function(seg) {
      for (var si = seg.fromSi; si <= seg.toSi && si < surahs.length; si++) {
        var s = surahs[si];
        if (!s) continue;

        var fromAyah = (si === seg.fromSi) ? seg.fromAi : 0;
        var toAyah;

        if (si === seg.toSi) {
          toAyah = seg.toAi;
          if (toAyah === 0 && si !== seg.fromSi) break;
          if (toAyah === 0 && si === seg.fromSi) break;
        } else {
          toAyah = s.ayahs.length;
        }

        if (fromAyah >= toAyah) continue;
        appendKrSurahSection(si, fromAyah, toAyah);
      }
    });

    // COMPLÉTER button at the end of the daily portion (NOT per surah)
    var completeWrap = document.createElement("div");
    completeWrap.className = "kr-complete-wrap";
    var completeBtn = document.createElement("button");
    completeBtn.className = "kr-complete-btn";
    completeBtn.textContent = "COMPL\u00C9TER JOUR " + portion.dayNumber;
    completeBtn.addEventListener("click", function() {
      completeKhatmDay(portion, completeBtn);
    });
    completeWrap.appendChild(completeBtn);
    krScrollEl.appendChild(completeWrap);
  }

  function completeKhatmDay(portion, btn) {
    // Cancel any pending debounced save to prevent race condition
    clearTimeout(krScrollTimer);
    krCompleting = true; // Block saveKrProgress from overwriting state

    // Flush already-tracked verses + count remaining unscrolled verses
    _krFlushVersesRead();
    clearTimeout(_krStatsTimer);
    var totalForDay = portion.versesForToday || 0;
    var remaining = totalForDay - _krHighWaterMark;
    if (remaining > 0) {
      // Sum letters for remaining verses
      var remLetters = 0;
      for (var ri = _krHighWaterMark; ri < totalForDay && ri < _krPortionLetters.length; ri++) {
        remLetters += _krPortionLetters[ri];
      }
      recordReading(remaining, remLetters);
    }

    // ✅ Save state IMMEDIATELY — advance to end of daily portion
    var khatmFinished = !!portion.finished;
    var prevGoalDays = khatm.goalDays || 30;
    if (khatmFinished) {
      // Log a "complete" entry in history before resetting
      finalizeKhatmSession();
      try {
        var raw = localStorage.getItem(KHATM_HISTORY_KEY);
        var hist = raw ? JSON.parse(raw) : [];
        hist.unshift({ type: "complete", timestamp: Date.now(), goalDays: prevGoalDays });
        if (hist.length > 50) hist = hist.slice(0, 50);
        localStorage.setItem(KHATM_HISTORY_KEY, JSON.stringify(hist));
      } catch(e) {}
      // Auto-create a new khatm from surah 1 with same goalDays
      khatm = {
        active: true,
        surahIdx: 0,
        ayahIdx: 0,
        startSurahIdx: 0,
        startAyahIdx: 0,
        goalDays: prevGoalDays,
        startDate: getLocalDateStr(),
        lang: "ar+fr",
        textScale: 100
      };
    } else {
      khatm.surahIdx = portion.endPos.surahIdx;
      khatm.ayahIdx = portion.endPos.ayahIdx;
    }
    saveKhatm();
    if (!khatmFinished) finalizeKhatmSession();

    // 1. Show loading spinner in button
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="kr-complete-loading"><span></span><span></span><span></span></span>';
    }

    // 2. After short delay → close reader, go to QURAN tab (state already saved above)
    setTimeout(function() {
      // Close reader
      if (krObserver) { krObserver.disconnect(); krObserver = null; }
      if (krScrollEl) krScrollEl.removeEventListener("scroll", onKrScroll);
      $("khatm-reader").classList.add("hidden");
      $("kr-panel").classList.add("hidden");
      $("kr-lang-picker").classList.add("hidden");

      // Navigate to QURAN tab
      var tabBar = $("tab-bar");
      if (tabBar) {
        tabBar.querySelectorAll(".tab-bar-btn").forEach(function(b) { b.classList.remove("active"); });
        var coranTab = tabBar.querySelector('[data-tab="coran"]');
        if (coranTab) coranTab.classList.add("active");
      }
      document.querySelectorAll(".tab-panel").forEach(function(p) { p.classList.add("hidden"); });
      var coranPanel = $("tab-coran");
      if (coranPanel) coranPanel.classList.remove("hidden");

      // Update progress card + dashboard card
      renderKhatmProgress();
      updateDashKhatmCard();

      // Refresh hero state (bg image + button label + progress circle)
      if (_khatmLandingRefresh) _khatmLandingRefresh();

      // Show congratulations toast if khatm was completed
      if (khatmFinished) {
        showToast("Khatm terminé ! Un nouveau khatm a commencé automatiquement.");
      }

      krDailyPortion = null;
      krCompleting = false; // Unlock saveKrProgress
    }, 900);
  }

  function onKrScroll() {
    // Clear resume target once user has started scrolling (initial scroll done)
    _krResumeTarget = null;
    // Update header + background based on topmost visible section
    updateKrCurrentSection();
    // Update progress bar live while scrolling
    updateKrProgressBarFromScroll();
    // Debounced progress save
    clearTimeout(krScrollTimer);
    krScrollTimer = setTimeout(saveKrProgress, 1200);
  }

  // Detect which surah section is at the top of the scroll and update header + bg
  function updateKrCurrentSection() {
    if (!krSurahSections.length || !krScrollEl) return;
    var scrollTop = krScrollEl.scrollTop + 120; // offset below header
    var newIdx = krSurahSections[0].surahIdx;
    for (var i = 0; i < krSurahSections.length; i++) {
      if (krSurahSections[i].el.offsetTop <= scrollTop) {
        newIdx = krSurahSections[i].surahIdx;
      }
    }
    if (newIdx !== krCurrentSurahIdx) {
      krCurrentSurahIdx = newIdx;
      updateKrHeader(newIdx);
      updateKrBg(newIdx);
    }
  }

  function updateKrProgressBarFromScroll() {
    var bar = $("kr-progress-bar");
    if (!bar) return;

    if (krDailyPortion) {
      // Daily portion mode: progress = verses scrolled / total verses for today
      var verses = krScrollEl ? krScrollEl.querySelectorAll(".kr-verse") : [];
      var scrolledCount = 0;
      if (verses.length) {
        var containerRect = krScrollEl.getBoundingClientRect();
        var visibleTop = containerRect.top + 20;
        for (var i = 0; i < verses.length; i++) {
          if (verses[i].getBoundingClientRect().bottom < visibleTop) scrolledCount++;
          else break;
        }
      }
      // Track verses read in real-time (high water mark)
      _krTrackVersesRead(scrolledCount);
      var total = krDailyPortion.versesForToday;
      var pct = total > 0 ? Math.min(100, Math.round((scrolledCount / total) * 100)) : 0;
      bar.style.width = Math.max(pct, 0.5) + "%";
    } else {
      // Fallback: global progress
      var prog = getKhatmProgress();
      var pctG = prog ? prog.pct : 0;
      bar.style.width = Math.max(pctG, 0.5) + "%";
    }
  }

  function setupKrObserver() {
    if (krObserver) krObserver.disconnect();
    krObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var idx = parseInt(entry.target.dataset.sectionSurahIdx, 10);
          if (!isNaN(idx) && idx !== krCurrentSurahIdx) {
            krCurrentSurahIdx = idx;
            updateKrHeader(idx);
            updateKrBg(idx);
          }
        }
      });
    }, { root: krScrollEl, threshold: 0.15, rootMargin: "-100px 0px 0px 0px" });
    krSurahSections.forEach(function(b) { krObserver.observe(b.el); });
  }

  function saveKrProgress() {
    if (krCompleting) return; // Don't overwrite state during COMPLÉTER flow
    if (_krResumeTarget) return; // Don't save during initial scroll restore (race condition guard)
    if (!khatm || !khatm.active) return;
    var overlay = $("khatm-reader");
    if (!overlay || overlay.classList.contains("hidden")) return; // Don't save if reader closed
    var verses = krScrollEl ? krScrollEl.querySelectorAll(".kr-verse") : [];
    if (!verses.length) return;
    // Use getBoundingClientRect for robust verse detection across all font sizes & languages.
    // Find the first verse whose TOP edge is within 20px above the container's top edge.
    var containerRect = krScrollEl.getBoundingClientRect();
    var threshold = containerRect.top - 20;
    var foundSi = khatm.surahIdx;
    var foundAi = khatm.ayahIdx;
    var foundOffset = 0;
    var found = false;
    for (var i = 0; i < verses.length; i++) {
      var rect = verses[i].getBoundingClientRect();
      if (rect.top >= threshold) {
        foundSi = parseInt(verses[i].dataset.si, 10);
        foundAi = parseInt(verses[i].dataset.ai, 10);
        // Save precise pixel offset: how far the verse top is from the scroll viewport top
        // Positive = verse top below viewport top, negative = verse top above (partially scrolled off)
        foundOffset = verses[i].offsetTop - krScrollEl.scrollTop;
        found = true;
        break;
      }
    }
    if (!found) {
      var last = verses[verses.length - 1];
      foundSi = parseInt(last.dataset.si, 10);
      foundAi = parseInt(last.dataset.ai, 10);
      foundOffset = 0;
    }
    khatm.surahIdx = foundSi;
    khatm.ayahIdx = foundAi;
    khatm.scrollOffset = foundOffset; // precise pixel offset for exact restore
    saveKhatm();
  }

  function closeKhatmReader() {
    followCleanup();
    stopReadingTimer();
    stopKrAudio();
    _krFlushVersesRead(); // Flush any pending verse count to stats
    clearTimeout(_krStatsTimer);
    clearTimeout(krScrollTimer); // Cancel any pending debounced save
    if (!krCompleting) saveKrProgress(); // Don't overwrite state if COMPLÉTER is in progress
    finalizeKhatmSession(); // log session end
    if (krObserver) { krObserver.disconnect(); krObserver = null; }
    if (krScrollEl) krScrollEl.removeEventListener("scroll", onKrScroll);
    $("khatm-reader").classList.add("hidden");
    $("kr-panel").classList.add("hidden");
    $("kr-lang-picker").classList.add("hidden");
    $("kr-mode-picker").classList.add("hidden");
    renderKhatmProgress();
    updateDashKhatmCard();
  }

  // ---- KHATM HISTORY ----
  var _krSessionStart = null; // { surahIdx, ayahIdx, timestamp }

  function startKhatmSession(surahIdx, ayahIdx) {
    _krSessionStart = { surahIdx: surahIdx, ayahIdx: ayahIdx, timestamp: Date.now() };
  }

  function finalizeKhatmSession() {
    if (!_krSessionStart || !khatm) return;
    // Get current position using accurate getBoundingClientRect
    var endSurahIdx = krCurrentSurahIdx;
    var endAyahIdx = 0;
    if (krScrollEl) {
      var verses = krScrollEl.querySelectorAll(".kr-verse");
      var containerRect = krScrollEl.getBoundingClientRect();
      var visibleTop = containerRect.top + 20;
      for (var i = 0; i < verses.length; i++) {
        var rect = verses[i].getBoundingClientRect();
        if (rect.bottom > visibleTop) {
          endSurahIdx = parseInt(verses[i].dataset.si, 10);
          endAyahIdx = parseInt(verses[i].dataset.ai, 10);
          break;
        }
      }
    }
    var session = {
      startSurahIdx: _krSessionStart.surahIdx,
      startAyahIdx: _krSessionStart.ayahIdx,
      endSurahIdx: endSurahIdx,
      endAyahIdx: endAyahIdx,
      timestamp: _krSessionStart.timestamp
    };
    try {
      var raw = localStorage.getItem(KHATM_HISTORY_KEY);
      var hist = raw ? JSON.parse(raw) : [];
      hist.unshift(session); // most recent first
      if (hist.length > 50) hist = hist.slice(0, 50); // cap
      localStorage.setItem(KHATM_HISTORY_KEY, JSON.stringify(hist));
    } catch(e) {}
    _krSessionStart = null;
  }

  function openKhatmHistory() {
    var overlay = $("khatm-history-overlay");
    if (!overlay) return;
    overlay.classList.remove("hidden");
    var list = $("kh-hist-list");
    if (!list) return;
    list.innerHTML = "";
    var hist = [];
    try {
      var raw = localStorage.getItem(KHATM_HISTORY_KEY);
      if (raw) hist = JSON.parse(raw);
    } catch(e) {}
    if (!hist.length) {
      list.innerHTML = '<p style="padding:28px 24px;color:rgba(255,255,255,0.35);font-size:0.85rem;">Aucune session enregistrée.</p>';
      return;
    }
    var MONTHS_FR = ["JAN","FÉV","MAR","AVR","MAI","JUN","JUL","AOÛ","SEP","OCT","NOV","DÉC"];
    hist.forEach(function(s) {
      var d = new Date(s.timestamp);
      var day = d.getDate();
      var mon = MONTHS_FR[d.getMonth()];
      var hh = String(d.getHours()).padStart(2, "0");
      var mm = String(d.getMinutes()).padStart(2, "0");
      var ampm = d.getHours() >= 12 ? "PM" : "AM";
      var h12 = d.getHours() % 12 || 12;
      var fromSurah = surahs[s.startSurahIdx];
      var toSurah = surahs[s.endSurahIdx];
      if (!fromSurah || !toSurah) return;
      var fromName = SURAH_TRANSLIT[fromSurah.surahNumber] || ("Sourate " + fromSurah.surahNumber);
      var toName = SURAH_TRANSLIT[toSurah.surahNumber] || ("Sourate " + toSurah.surahNumber);
      var fromAyah = s.startAyahIdx + 1;
      var toAyah = s.endAyahIdx + 1;

      var item = document.createElement("div");
      item.className = "kh-hist-item";
      item.innerHTML =
        '<div class="kh-hist-date">' + day + " " + mon + "<br>" + String(h12).padStart(2,"0") + ":" + mm + " " + ampm + "</div>" +
        '<div class="kh-hist-info">' +
          '<span class="kh-hist-from">' + fromName + " " + fromSurah.surahNumber + ":" + fromAyah + "</span>" +
          '<span class="kh-hist-to">jusqu\'à ' + toName + " " + toSurah.surahNumber + ":" + toAyah + "</span>" +
        "</div>" +
        '<div class="kh-hist-chev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg></div>';
      list.appendChild(item);
    });
  }

  function openKhatmDeleteSheet(onDeleteCallback) {
    var sheet = $("khatm-delete-sheet");
    if (!sheet) return;
    // Update days in subtitle
    var daysSpan = $("kds-days");
    if (daysSpan && khatm && khatm.startDate && khatm.goalDays) {
      var elapsed = Math.floor((Date.now() - new Date(khatm.startDate).getTime()) / 86400000);
      var left = Math.max(0, khatm.goalDays - elapsed);
      daysSpan.textContent = left;
    }
    sheet.classList.remove("hidden");
    // Cancel
    var cancelBtn = $("kds-cancel");
    if (cancelBtn) {
      cancelBtn.onclick = function() { sheet.classList.add("hidden"); };
    }
    // Backdrop tap closes
    var backdrop = $("kds-backdrop");
    if (backdrop) {
      backdrop.onclick = function() { sheet.classList.add("hidden"); };
    }
    // Confirm delete
    var confirmBtn = $("kds-confirm");
    if (confirmBtn) {
      confirmBtn.onclick = function() {
        khatm = null;
        localStorage.removeItem(KHATM_KEY);
        localStorage.removeItem(KHATM_HISTORY_KEY);
        sheet.classList.add("hidden");
        if (onDeleteCallback) onDeleteCallback();
      };
    }
  }

  function rerenderKrReader() {
    // Save current scroll position to restore after re-render
    var savedSurahIdx = krCurrentSurahIdx;
    var savedAyahIdx = 0;
    var savedOffset = 0;

    // If we have a resume target (set by openKhatmReader), use it instead of
    // scanning the DOM — fixes race condition where rerenderKrReader fires
    // before the initial scroll timeout and saves scrollTop=0 as the position.
    if (_krResumeTarget) {
      savedSurahIdx = _krResumeTarget.si;
      savedAyahIdx = _krResumeTarget.ai;
      savedOffset = _krResumeTarget.off || 0;
    } else if (krScrollEl) {
      var verses = krScrollEl.querySelectorAll(".kr-verse");
      var st = krScrollEl.scrollTop + 130;
      for (var i = 0; i < verses.length; i++) {
        if (verses[i].offsetTop <= st) {
          savedSurahIdx = parseInt(verses[i].dataset.si, 10);
          savedAyahIdx = parseInt(verses[i].dataset.ai, 10);
          savedOffset = verses[i].offsetTop - krScrollEl.scrollTop;
        } else break;
      }
    }
    if (krObserver) { krObserver.disconnect(); krObserver = null; }
    krScrollEl.innerHTML = "";
    krSurahSections = [];
    krCurrentSurahIdx = savedSurahIdx;
    krLoadedUpTo = surahs.length - 1;

    if (krDailyPortion) {
      // Re-render the daily portion
      appendKrDailyPortion(krDailyPortion);
    } else {
      // Fallback: single surah (should not happen with active khatm)
      appendKrSurahSection(savedSurahIdx, savedAyahIdx);
    }
    setupKrObserver();

    // Restore scroll to saved verse with precise pixel offset
    setTimeout(function() {
      var target = krScrollEl.querySelector(
        "[data-si=\"" + savedSurahIdx + "\"][data-ai=\"" + savedAyahIdx + "\"]"
      );
      if (target) {
        krScrollEl.scrollTop = Math.max(0, target.offsetTop - savedOffset);
      }
    }, 50);
  }

  function initKhatmReader() {
    $("kr-back").addEventListener("click", closeKhatmReader);
    if ($("kr-follow-btn")) $("kr-follow-btn").addEventListener("click", function() { followToggle("khatm"); });
    // Khatm audio controls
    $("kr-audio-btn").addEventListener("click", toggleKrAudio);
    $("kr-audio-auto-btn").addEventListener("click", function() {
      krAudioAutoNext = !krAudioAutoNext;
      updateKrAudioUI();
    });
    // History overlay back button
    var histBack = $("kh-hist-back");
    if (histBack) {
      histBack.addEventListener("click", function() {
        var ov = $("khatm-history-overlay");
        if (ov) ov.classList.add("hidden");
      });
    }
    $("kr-menu-btn").addEventListener("click", function() {
      $("kr-panel").classList.toggle("hidden");
      $("kr-lang-picker").classList.add("hidden");
      $("kr-mode-picker").classList.add("hidden");
    });
    // Tap on scroll area closes panel
    $("kr-scroll").addEventListener("click", function() {
      if (!$("kr-panel").classList.contains("hidden")) {
        $("kr-panel").classList.add("hidden");
        $("kr-lang-picker").classList.add("hidden");
        $("kr-mode-picker").classList.add("hidden");
      }
    });
    // Language
    $("kr-lang-row").addEventListener("click", function() {
      $("kr-lang-picker").classList.toggle("hidden");
      $("kr-mode-picker").classList.add("hidden");
    });
    document.querySelectorAll(".kr-lang-opt").forEach(function(el) {
      el.addEventListener("click", function() {
        var lang = el.dataset.lang;
        if (!khatm) khatm = { lang: lang, textScale: 100, active: false };
        khatm.lang = lang;
        saveKhatm();
        updateKrLangDisplay();
        $("kr-lang-picker").classList.add("hidden");
        if (lang === "ph" || lang === "ar+ph" || lang === "fr+ph" || lang === "en+ph") {
          var nums = krSurahSections.map(function(sec) { return surahs[sec.surahIdx].surahNumber; });
          if (!nums.length && surahs[krCurrentSurahIdx]) nums = [surahs[krCurrentSurahIdx].surahNumber];
          preloadPhoneticForSurahs(nums, function() { rerenderKrReader(); });
        } else {
          rerenderKrReader();
        }
      });
    });
    // Mode de lecture
    $("kr-mode-row").addEventListener("click", function() {
      $("kr-mode-picker").classList.toggle("hidden");
      $("kr-lang-picker").classList.add("hidden");
    });
    document.querySelectorAll(".kr-mode-opt").forEach(function(el) {
      el.addEventListener("click", function() {
        var mode = el.dataset.mode;
        if (!khatm) khatm = { krMode: mode, textScale: 100, active: false };
        khatm.krMode = mode;
        saveKhatm();
        updateKrModeDisplay();
        $("kr-mode-picker").classList.add("hidden");
        // Preload tajwid data if needed
        if ((mode === "minimal-color" || mode === "tajwid" || mode === "tajwid-color") && !tajwidData && !tajwidLoading) {
          loadTajwidOverlay();
        }
        rerenderKrReader();
      });
    });
    // Riwaya (Hafs / Warsh) — KR
    if ($("kr-riwaya-row")) {
      $("kr-riwaya-row").addEventListener("click", function() {
        $("kr-riwaya-picker").classList.toggle("hidden");
        $("kr-mode-picker").classList.add("hidden");
        $("kr-lang-picker").classList.add("hidden");
      });
    }
    document.querySelectorAll(".kr-riwaya-opt").forEach(function(el) {
      el.addEventListener("click", function() {
        state.riwaya = el.dataset.riwaya;
        saveState();
        switchRiwaya(state.riwaya).then(function() {
          updateKrRiwayaDisplay();
          rerenderKrReader();
        });
        $("kr-riwaya-picker").classList.add("hidden");
      });
    });
    // Text size
    $("kr-size-minus").addEventListener("click", function() {
      if (!khatm) return;
      khatm.textScale = Math.max(60, (khatm.textScale || 100) - 10);
      saveKhatm();
      updateKrSizeDisplay();
      applyKrTextScale();
    });
    $("kr-size-plus").addEventListener("click", function() {
      if (!khatm) return;
      khatm.textScale = Math.min(180, (khatm.textScale || 100) + 10);
      saveKhatm();
      updateKrSizeDisplay();
      applyKrTextScale();
    });

    // ---- Khatm Action Bar (long-press) ----
    var krActClose = $("kr-action-close");
    if (krActClose) krActClose.addEventListener("click", function() {
      $("kr-action-bar").classList.add("hidden");
      krSelectedSurahIdx = -1;
      krSelectedAyahIdx = -1;
    });

    var krActCopy = $("kr-action-copy");
    if (krActCopy) krActCopy.addEventListener("click", function() {
      if (krSelectedSurahIdx < 0 || krSelectedAyahIdx < 0) return;
      var s = surahs[krSelectedSurahIdx];
      if (!s) return;
      var num = s.surahNumber;
      var isBasmalaFirst = (num !== 1 && num !== 9);
      var ayahNum = isBasmalaFirst ? krSelectedAyahIdx : krSelectedAyahIdx + 1;
      var arText = s.ayahs[krSelectedAyahIdx] || "";
      var frText = (surahsFr[krSelectedSurahIdx] && surahsFr[krSelectedSurahIdx].ayahs[krSelectedAyahIdx]) || "";
      var ref = SURAH_TRANSLIT[num] + " — " + (SURAH_NAMES_FR[num] || "") + " · Verset " + ayahNum;
      var text = arText + (frText ? "\n" + frText : "") + "\n\n" + ref;
      if (navigator.share) {
        navigator.share({ title: "Qurani", text: text }).catch(function(){});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() { showToast("Verset copié"); }).catch(function() { showToast("Impossible de copier"); });
      }
      $("kr-action-bar").classList.add("hidden");
    });

    var krActHeart = $("kr-action-heart");
    if (krActHeart) krActHeart.addEventListener("click", function() {
      if (krSelectedSurahIdx < 0 || krSelectedAyahIdx < 0) return;
      var s = surahs[krSelectedSurahIdx];
      if (!s) return;
      var num = s.surahNumber;
      var isBasmalaFirst = (num !== 1 && num !== 9);
      if (krSelectedAyahIdx === 0 && isBasmalaFirst) return;
      var ayahNum = isBasmalaFirst ? krSelectedAyahIdx : krSelectedAyahIdx + 1;
      var key = num + ":" + ayahNum;
      var bms = loadBookmarks();
      var idx = -1;
      for (var i = 0; i < bms.length; i++) {
        if (bms[i].key === key) { idx = i; break; }
      }
      if (idx >= 0) {
        bms.splice(idx, 1);
        saveBookmarks(bms);
        showToast("Favori retiré");
      } else {
        bms.push({ key: key, surahNumber: num, ayahNumber: ayahNum, surahNameFr: s.surahNameFr || "", text: "", date: getLocalDateStr() });
        saveBookmarks(bms);
        showToast("Ajouté aux favoris");
      }
      updateKrActionHeartState();
    });

    var krActNote = $("kr-action-note");
    if (krActNote) krActNote.addEventListener("click", function() {
      if (krSelectedSurahIdx < 0 || krSelectedAyahIdx < 0) return;
      var s = surahs[krSelectedSurahIdx];
      if (!s) return;
      var num = s.surahNumber;
      var isBasmalaFirst = (num !== 1 && num !== 9);
      var ayahNum = isBasmalaFirst ? krSelectedAyahIdx : krSelectedAyahIdx + 1;
      var key = num + ":" + ayahNum;
      var notes = loadNotes();
      var existing = "";
      for (var i = 0; i < notes.length; i++) {
        if (notes[i].key === key) { existing = notes[i].text; break; }
      }
      var input = prompt("Note pour " + key, existing);
      if (input === null) return;
      if (input.trim() === "") {
        notes = notes.filter(function(n) { return n.key !== key; });
        saveNotes(notes);
        showToast("Note supprimée");
      } else {
        var found = false;
        for (var j = 0; j < notes.length; j++) {
          if (notes[j].key === key) { notes[j].text = input; notes[j].ts = Date.now(); found = true; break; }
        }
        if (!found) notes.push({ key: key, surahNumber: num, surahNameFr: s.surahNameFr || "", ayahNumber: ayahNum, text: input, date: getLocalDateStr(), ts: Date.now() });
        saveNotes(notes);
        showToast("Note enregistrée");
      }
      $("kr-action-bar").classList.add("hidden");
    });

    var krActPlay = $("kr-action-play");
    if (krActPlay) krActPlay.addEventListener("click", function() {
      if (krSelectedSurahIdx < 0 || krSelectedAyahIdx < 0) return;
      var targetSurahIdx = krSelectedSurahIdx;
      var targetVerseI = krSelectedAyahIdx;
      $("kr-action-bar").classList.add("hidden");
      // Open Surah Player and auto-play from this verse
      spSelectedVerseI = targetVerseI;
      openSurahPlayer(targetSurahIdx);
      setTimeout(function() {
        if (spPlaylist.length > 0) {
          var plIdx = spPlaylistVerseIndices.indexOf(targetVerseI);
          if (plIdx < 0) plIdx = 0;
          spPlaylistIdx = plIdx;
          spAudioEl.src = spPlaylist[plIdx];
          spCurrentVerseI = targetVerseI;
        }
        spSetActiveVerse(targetVerseI);
        if (spAudioEl) {
          spAudioEl.play().then(function() {
            spIsPlaying = true;
            spUpdatePlayBtn();
          }).catch(function() {
            spIsPlaying = false;
            spUpdatePlayBtn();
          });
        }
      }, 600);
    });
  }

  function updateKrActionHeartState() {
    if (krSelectedSurahIdx < 0 || krSelectedAyahIdx < 0) return;
    var s = surahs[krSelectedSurahIdx];
    if (!s) return;
    var num = s.surahNumber;
    var isBasmalaFirst = (num !== 1 && num !== 9);
    var ayahNum = isBasmalaFirst ? krSelectedAyahIdx : krSelectedAyahIdx + 1;
    var key = num + ":" + ayahNum;
    var bms = loadBookmarks();
    var isFav = bms.some(function(b) { return b.key === key; });
    var btn = $("kr-action-heart");
    if (btn) btn.classList.toggle("kr-heart-active", isFav);
  }

  function updateKrSizeDisplay() {
    var scale = (khatm && khatm.textScale) || 100;
    $("kr-size-val").textContent = scale === 100 ? "100% (PAR DÉFAUT)" : scale + "%";
  }

  function applyKrTextScale() {
    var scale = (khatm && khatm.textScale) || 100;
    var sz = (1.5 * scale / 100).toFixed(2) + "rem";
    document.querySelectorAll(".kr-verse-ar").forEach(function(el) {
      el.style.fontSize = sz;
    });
  }

  // ---- KHATM READER AUDIO ----
  var krAudioPlayer = null;
  var krIsAudioPlaying = false;
  var krAudioAutoNext = false;
  var krCurrentAudioSurahIdx = -1;
  var krCurrentAudioAyahIdx = -1;

  function getKrVisibleVerse() {
    if (!krScrollEl) return null;
    var scrollRect = krScrollEl.getBoundingClientRect();
    var centerY = scrollRect.top + scrollRect.height / 2;
    var verses = krScrollEl.querySelectorAll(".kr-verse");
    var best = null;
    var bestDist = Infinity;
    for (var v = 0; v < verses.length; v++) {
      var rect = verses[v].getBoundingClientRect();
      var vCenter = rect.top + rect.height / 2;
      var dist = Math.abs(vCenter - centerY);
      if (dist < bestDist) {
        bestDist = dist;
        best = verses[v];
      }
    }
    if (!best) return null;
    return {
      surahIdx: parseInt(best.dataset.si, 10),
      ayahIdx: parseInt(best.dataset.ai, 10),
      element: best
    };
  }

  function krPlayVerse(surahIdx, ayahIdx) {
    var s = surahs[surahIdx];
    if (!s) return;
    var num = s.surahNumber;
    var isBasmalaFirst = (num !== 1 && num !== 9);
    var ayahNum;
    if (ayahIdx === 0 && isBasmalaFirst) {
      ayahNum = 0; // basmala
    } else {
      ayahNum = (num === 1 || num === 9) ? (ayahIdx + 1) : ayahIdx;
    }
    var url = getAudioUrl(num, ayahNum);
    // Fallback: récitateur sans audio verset-par-verset → sourate complète
    if (!url) {
      var rec = getReciterObj();
      if (rec.listenBase) {
        url = rec.listenBase + "/" + String(num).padStart(3, "0") + ".mp3";
      } else {
        showToast("Audio non disponible pour ce récitateur");
        return;
      }
    }
    if (krAudioPlayer) {
      krAudioPlayer.pause();
      krAudioPlayer.removeEventListener("ended", onKrAudioEnded);
    }
    krAudioPlayer = new Audio(url);
    krCurrentAudioSurahIdx = surahIdx;
    krCurrentAudioAyahIdx = ayahIdx;
    krAudioPlayer.addEventListener("ended", onKrAudioEnded);
    krAudioPlayer.addEventListener("error", function() {
      krIsAudioPlaying = false;
      updateKrAudioUI();
      showToast("Audio non disponible");
    });
    krAudioPlayer.play().then(function() {
      krIsAudioPlaying = true;
      updateKrAudioUI();
      krSetGlowVerse(surahIdx, ayahIdx);
    }).catch(function() {
      krIsAudioPlaying = false;
      updateKrAudioUI();
    });
  }

  function onKrAudioEnded() {
    krClearGlow();
    if (krAudioAutoNext) {
      var nextVerse = findNextKrVerse(krCurrentAudioSurahIdx, krCurrentAudioAyahIdx);
      if (nextVerse) {
        krPlayVerse(nextVerse.surahIdx, nextVerse.ayahIdx);
        var el = krScrollEl.querySelector(
          '.kr-verse[data-si="' + nextVerse.surahIdx + '"][data-ai="' + nextVerse.ayahIdx + '"]'
        );
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        krIsAudioPlaying = false;
        updateKrAudioUI();
      }
    } else {
      krIsAudioPlaying = false;
      updateKrAudioUI();
    }
  }

  function findNextKrVerse(si, ai) {
    var allVerses = krScrollEl.querySelectorAll(".kr-verse");
    var found = false;
    for (var v = 0; v < allVerses.length; v++) {
      if (found) {
        return {
          surahIdx: parseInt(allVerses[v].dataset.si, 10),
          ayahIdx: parseInt(allVerses[v].dataset.ai, 10)
        };
      }
      if (parseInt(allVerses[v].dataset.si, 10) === si &&
          parseInt(allVerses[v].dataset.ai, 10) === ai) {
        found = true;
      }
    }
    return null;
  }

  function toggleKrAudio() {
    if (krIsAudioPlaying) {
      if (krAudioPlayer) krAudioPlayer.pause();
      krIsAudioPlaying = false;
      krClearGlow();
      updateKrAudioUI();
    } else {
      var verse = getKrVisibleVerse();
      if (verse) krPlayVerse(verse.surahIdx, verse.ayahIdx);
    }
  }

  function stopKrAudio() {
    if (krAudioPlayer) {
      krAudioPlayer.pause();
      krAudioPlayer.removeEventListener("ended", onKrAudioEnded);
      krAudioPlayer = null;
    }
    krIsAudioPlaying = false;
    krClearGlow();
    updateKrAudioUI();
  }

  function updateKrAudioUI() {
    var btn = $("kr-audio-btn");
    if (!btn) return;
    var svg = btn.querySelector("svg");
    if (krIsAudioPlaying) {
      btn.classList.add("kr-playing");
      if (svg) svg.innerHTML = '<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>';
    } else {
      btn.classList.remove("kr-playing");
      if (svg) svg.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
    }
    var autoBtn = $("kr-audio-auto-btn");
    if (autoBtn) autoBtn.classList.toggle("kr-auto-active", krAudioAutoNext);
  }

  // ---- AUDIO GLOW EFFECT ----
  function krSetGlowVerse(si, ai) {
    krClearGlow();
    var el = krScrollEl.querySelector(
      '.kr-verse[data-si="' + si + '"][data-ai="' + ai + '"] .kr-verse-ar'
    );
    if (el) el.classList.add("audio-glow");
  }

  function krClearGlow() {
    document.querySelectorAll(".kr-verse-ar.audio-glow").forEach(function(el) {
      el.classList.remove("audio-glow");
    });
  }

  // ---- SURAH PLAYER (Lecteur Libre + Audio) ----
  var SP_LANG_KEY = "qurani-sp-lang";
  var SP_MODE_KEY = "qurani-sp-mode";
  var SP_SCALE_KEY = "qurani-sp-scale";

  function getSpMode() { return localStorage.getItem(SP_MODE_KEY) || "minimal"; }
  function setSpMode(m) { localStorage.setItem(SP_MODE_KEY, m); }
  function getSpScale() { return parseInt(localStorage.getItem(SP_SCALE_KEY) || "100", 10); }
  function setSpScale(s) { localStorage.setItem(SP_SCALE_KEY, String(s)); }
  var spCurrentSurahIdx = 0;
  var spAudioEl = null;
  var spIsPlaying = false;
  var spMenuOpen = false;
  var spLangOpen = false;
  var spPlaylist = [];             // verse-by-verse URLs (French reciters)
  var spPlaylistVerseIndices = []; // maps playlist index → ayah i in surahs[].ayahs
  var spPlaylistIdx = 0;
  var spCurrentVerseI = -1;        // current highlighted ayah index in reader
  var spAutoNext = false;           // auto-advance to next verse (off by default)

  function getSpLang() {
    return localStorage.getItem(SP_LANG_KEY) || "ar-fr";
  }
  function setSpLang(lang) {
    localStorage.setItem(SP_LANG_KEY, lang);
  }

  function spGetCurrentReciter() {
    var id = getReciter();
    for (var i = 0; i < RECITERS.length; i++) {
      if (RECITERS[i].id === id) return RECITERS[i];
    }
    return RECITERS[0];
  }

  function spIsFrenchReciter(reciter) {
    return reciter && reciter.lang === "fr";
  }

  // Compute global ayah number (1-based, 1–6236) for cdn.islamic.network
  function spGetGlobalAyahNum(surahIdx, ayahOneBased) {
    var offset = 0;
    for (var i = 0; i < surahIdx; i++) {
      var s2 = surahs[i];
      var count = (s2.surahNumber === 1 || s2.surahNumber === 9)
        ? s2.ayahs.length : s2.ayahs.length - 1;
      offset += count;
    }
    return offset + ayahOneBased;
  }

  // Build verse-by-verse playlist for verse-tracking reciters
  // cdn.islamic.network (French) / everyayah.com (Arabic with per-verse support)
  function spBuildFrPlaylist(surahIdx) {
    var s = surahs[surahIdx];
    var num = s.surahNumber;
    var rec = spGetCurrentReciter();
    var isBasmalaFirst = (num !== 1 && num !== 9);
    var startI = isBasmalaFirst ? 1 : 0;
    var urls = [];
    var verseIndices = [];
    var surah3 = String(num).padStart(3, "0");
    s.ayahs.forEach(function(text, i) {
      if (i < startI) return;
      var ayahOneBased = isBasmalaFirst ? i : (i + 1);
      var url;
      if (rec.cdnEdition) {
        // cdn.islamic.network (French reciters) — global ayah number
        var globalN = spGetGlobalAyahNum(surahIdx, ayahOneBased);
        url = "https://cdn.islamic.network/quran/audio/128/" + rec.cdnEdition + "/" + globalN + ".mp3";
      } else {
        // everyayah.com — surah/ayah numbering
        var evId = rec.everyayahId || rec.id;
        var ayah3 = String(ayahOneBased).padStart(3, "0");
        url = "https://everyayah.com/data/" + evId + "/" + surah3 + ayah3 + ".mp3";
      }
      urls.push(url);
      verseIndices.push(i);
    });
    return { urls: urls, verseIndices: verseIndices };
  }

  function spFmtTime(sec) {
    if (!sec || isNaN(sec)) return "00:00";
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  function updateSpmModeDisplay() {
    var mode = getSpMode();
    var labels = {
      "minimal": "MINIMAL",
      "minimal-color": "MINIMAL + COULEURS",
      "tajwid": "TAJWID",
      "tajwid-color": "TAJWID + COULEURS"
    };
    var val = $("spm-mode-val");
    if (val) val.textContent = labels[mode] || "MINIMAL";
    document.querySelectorAll(".spm-mode-opt").forEach(function(o) {
      o.classList.toggle("spm-mode-active", o.dataset.mode === mode);
    });
  }

  function updateSpmRiwayaDisplay() {
    var r = state.riwaya || "hafs";
    var val = $("spm-riwaya-val");
    if (val) val.textContent = r === "warsh" ? "WARSH" : "HAFS";
    document.querySelectorAll(".spm-riwaya-opt").forEach(function(o) {
      o.classList.toggle("spm-mode-active", o.dataset.riwaya === r);
    });
  }

  function updateSpmSizeDisplay() {
    var s = getSpScale();
    var el = $("spm-size-val");
    if (el) el.textContent = s === 100 ? "100%" : s + "%";
  }

  function applySpmScale() {
    var scale = getSpScale();
    var sz = (1.75 * scale / 100).toFixed(2) + "rem";
    document.querySelectorAll(".sp-verse-ar").forEach(function(el) {
      el.style.fontSize = sz;
    });
  }

  function spRenderReader(surahIdx) {
    var s = surahs[surahIdx];
    if (!s) return;
    var container = $("sp-reader-content");
    container.innerHTML = "";
    var lang = getSpLang();
    var sFr = surahsFr[surahIdx];
    var ayahsFr = sFr ? sFr.ayahs : null;
    var sEn = surahsEn[surahIdx];
    var ayahsEn = sEn ? sEn.ayahs : null;
    var num = s.surahNumber;
    var isBasmalaFirst = (num !== 1 && num !== 9);
    var spMode = getSpMode();
    var useColors = (spMode === "minimal-color" || spMode === "tajwid-color");
    var useTajwid = (spMode === "tajwid" || spMode === "tajwid-color");
    var scale = getSpScale();
    var arFontSize = (1.75 * scale / 100).toFixed(2) + "rem";

    s.ayahs.forEach(function(text, i) {
      var isBasmala = (i === 0 && isBasmalaFirst);
      var block = document.createElement("div");
      block.className = "sp-verse";
      block.dataset.i = i;

      // Verse reference
      var ref = document.createElement("p");
      ref.className = "sp-verse-ref";
      if (isBasmala) {
        ref.textContent = "Basmala";
      } else {
        var displayNum = isBasmalaFirst ? i : i + 1;
        ref.textContent = num + ":" + displayNum;
        // Heart icon if favorited
        var vKey = num + ":" + displayNum;
        var bmsCheck = loadBookmarks();
        if (bmsCheck.some(function(b) { return b.key === vKey; })) {
          var heartSpan = document.createElement("span");
          heartSpan.className = "sp-verse-heart";
          heartSpan.textContent = "\u2764";
          ref.appendChild(heartSpan);
        }
      }
      block.appendChild(ref);

      // Arabic
      if (lang === "ar" || lang === "ar-fr" || lang === "ar-ph" || lang === "ar-en") {
        var ar = document.createElement("p");
        ar.className = "sp-verse-ar";
        ar.dir = "rtl";
        ar.style.fontSize = arFontSize;
        if (useColors) {
          var ayahNum = (num === 1 || num === 9) ? (i + 1) : i;
          var cacheKey = num + ":" + ayahNum;
          var overlays = (state.riwaya !== "warsh" && tajwidData && tajwidData[cacheKey]) ? tajwidData[cacheKey] : null;
          var segments = getSegmentsForAyah(cacheKey, text, overlays);
          segments.forEach(function(seg) {
            var segText = useTajwid ? seg.chars : stripWaqfMarks(seg.chars);
            var sp = document.createElement("span");
            if (seg.rule) sp.className = "tajwid-" + seg.rule;
            sp.textContent = segText;
            ar.appendChild(sp);
          });
          if (!tajwidData && !tajwidLoading) loadTajwidOverlay();
        } else {
          ar.textContent = useTajwid ? text : stripWaqfMarks(text);
        }
        block.appendChild(ar);
      }

      // French
      if ((lang === "fr" || lang === "ar-fr" || lang === "fr-ph") && !isBasmala && ayahsFr) {
        // For non-basmala surahs, ayahsFr[0] is basmala (French placeholder), ayahsFr[i] aligns
        var frText = ayahsFr[i] || "";
        if (frText) {
          var fr = document.createElement("p");
          fr.className = "sp-verse-fr" + (lang === "fr-ph" ? " sp-verse-bright" : "");
          fr.textContent = frText;
          block.appendChild(fr);
        }
      }

      // Phonetic
      if ((lang === "ph" || lang === "ar-ph" || lang === "fr-ph" || lang === "en-ph") && !isBasmala) {
        var ph = document.createElement("p");
        ph.className = "sp-verse-ph";
        var phData = phoneticData ? phoneticData[num] : null;
        if (phData) {
          ph.textContent = phData[i] || "";
        } else {
          ph.textContent = "\u2026";
          loadPhoneticForSurah(num, function() {
            var l = getSpLang();
            if (l === "ph" || l === "ar-ph" || l === "fr-ph" || l === "en-ph") spRenderReader(spCurrentSurahIdx);
          });
        }
        block.appendChild(ph);
      }

      // English
      if ((lang === "en" || lang === "ar-en" || lang === "en-ph") && !isBasmala && ayahsEn) {
        var enText = ayahsEn[i] || "";
        if (enText) {
          var en = document.createElement("p");
          en.className = "sp-verse-en" + (lang === "en-ph" ? " sp-verse-bright" : "");
          en.textContent = enText;
          block.appendChild(en);
        }
      }

      // Long-press to show action bar for this verse
      (function(verseBlock, verseI) {
        var lpTimer = null;
        var lpFired = false;
        function spShowActionBar() {
          window.getSelection().removeAllRanges();
          spSelectedVerseI = verseI;
          if (navigator.vibrate) navigator.vibrate(15);
          var bar = $("sp-action-bar");
          if (bar) bar.classList.remove("hidden");
          updateSpActionHeartState();
        }
        var lpStartX = 0, lpStartY = 0;
        verseBlock.addEventListener("touchstart", function(e) {
          lpFired = false;
          lpStartX = e.touches[0].clientX;
          lpStartY = e.touches[0].clientY;
          lpTimer = setTimeout(function() {
            lpTimer = null;
            lpFired = true;
            spShowActionBar();
          }, 500);
        }, { passive: true });
        verseBlock.addEventListener("touchend", function(e) {
          if (lpTimer) clearTimeout(lpTimer);
          if (lpFired) {
            e.preventDefault();
            window.getSelection().removeAllRanges();
            lpFired = false;
          }
        });
        verseBlock.addEventListener("touchmove", function(e) {
          if (!lpTimer) return;
          var dx = e.touches[0].clientX - lpStartX;
          var dy = e.touches[0].clientY - lpStartY;
          if (Math.sqrt(dx*dx + dy*dy) > 8) { clearTimeout(lpTimer); lpTimer = null; }
        });
        verseBlock.addEventListener("mousedown", function(e) {
          if (e.button !== 0) return;
          lpFired = false;
          lpTimer = setTimeout(function() {
            lpTimer = null;
            lpFired = true;
            spShowActionBar();
          }, 500);
        });
        verseBlock.addEventListener("mouseup", function() {
          if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; }
        });
        verseBlock.addEventListener("mouseleave", function() {
          if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; }
        });
        // Block native context menu on verses
        verseBlock.addEventListener("contextmenu", function(e) { e.preventDefault(); });
      })(block, i);

      container.appendChild(block);
    });

    // Hide action bar when rendering new reader content
    var bar = $("sp-action-bar");
    if (bar) bar.classList.add("hidden");
    spSelectedVerseI = -1;

    // Scroll to top
    var scroll = $("sp-reader-scroll");
    if (scroll) scroll.scrollTop = 0;
  }

  function spUpdatePlayBtn() {
    var playIcon = $("sp-play-icon");
    var pauseIcon = $("sp-pause-icon");
    if (playIcon) playIcon.classList.toggle("hidden", spIsPlaying);
    if (pauseIcon) pauseIcon.classList.toggle("hidden", !spIsPlaying);
    // Header play button
    var hdrPlay = $("sp-hdr-play-icon");
    var hdrPause = $("sp-hdr-pause-icon");
    if (hdrPlay) hdrPlay.classList.toggle("hidden", spIsPlaying);
    if (hdrPause) hdrPause.classList.toggle("hidden", !spIsPlaying);
    var hdrBtn = $("sp-play-btn");
    if (hdrBtn) hdrBtn.classList.toggle("sp-playing", spIsPlaying);
  }

  var _spLastCountedVerse = -1;
  function spSetActiveVerse(verseI) {
    spCurrentVerseI = verseI;
    // Count verse as read when highlighted by audio (dedup by verse index)
    if (verseI >= 0 && verseI !== _spLastCountedVerse) {
      _spLastCountedVerse = verseI;
      var letters = getVerseLetters(spCurrentSurahIdx, verseI);
      recordReading(1, letters);
      _spSaveDailyProgress(verseI);
    }
    var verses = document.querySelectorAll("#sp-reader-content .sp-verse");
    verses.forEach(function(el) {
      el.classList.remove("sp-verse-active");
      var ar = el.querySelector(".sp-verse-ar");
      if (ar) ar.classList.remove("audio-glow");
    });
    var target = document.querySelector("#sp-reader-content .sp-verse[data-i='" + verseI + "']");
    if (target) {
      target.classList.add("sp-verse-active");
      var ar = target.querySelector(".sp-verse-ar");
      if (ar) ar.classList.add("audio-glow");
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function spUpdateSeekUI() {
    if (!spAudioEl) return;
    var seek = $("sp-seek");
    var dur = spAudioEl.duration;
    var cur = spAudioEl.currentTime;
    if (seek && dur && !isNaN(dur) && dur > 0) {
      seek.value = Math.round((cur / dur) * 1000);
    }
    var timeCur = $("sp-time-cur");
    var timeTot = $("sp-time-tot");
    if (timeCur) timeCur.textContent = spFmtTime(cur);
    if (timeTot) timeTot.textContent = spFmtTime(dur);
  }

  function spSetupAudio(surahNum) {
    spAudioEl = $("sp-audio-el");
    if (!spAudioEl) return;
    spAudioEl.pause();
    spAudioEl.src = "";
    spIsPlaying = false;
    spPlaylist = [];
    spPlaylistVerseIndices = [];
    spPlaylistIdx = 0;
    spCurrentVerseI = -1;
    spUpdatePlayBtn();
    var timeCur = $("sp-time-cur");
    var timeTot = $("sp-time-tot");
    var seek = $("sp-seek");
    if (timeCur) timeCur.textContent = "00:00";
    if (timeTot) timeTot.textContent = "00:00";
    if (seek) seek.value = 0;

    var rec = spGetCurrentReciter();
    // Update reciter label
    var recLabel = $("sp-audio-reciter");
    if (recLabel) recLabel.textContent = rec.name.toUpperCase();

    // Déterminer si le récitateur supporte le verset par verset
    var hasPerVerse = !!(rec.cdnEdition || rec.everyayahId || (rec.id && rec.id.indexOf("mp3q_") !== 0 && rec.id.indexOf("fr.") !== 0));

    if (rec.listenBase) {
      // Sourate complète disponible → toujours l'utiliser comme source audio principale
      var s3 = String(surahNum).padStart(3, "0");
      spAudioEl.src = rec.listenBase + "/" + s3 + ".mp3";
      spAudioEl.load();
      // Si per-verse dispo aussi, charger la playlist pour le suivi verset (highlighting)
      if (hasPerVerse) {
        var siIdx = surahs.findIndex(function(s) { return s.surahNumber === surahNum; });
        if (siIdx < 0) siIdx = spCurrentSurahIdx;
        var plResult = spBuildFrPlaylist(siIdx);
        spPlaylist = plResult.urls;
        spPlaylistVerseIndices = plResult.verseIndices;
        spPlaylistIdx = 0;
      }
    } else if (hasPerVerse) {
      // Pas de listenBase (ex: Leclerc) → lecture verset par verset
      var siIdx2 = surahs.findIndex(function(s) { return s.surahNumber === surahNum; });
      if (siIdx2 < 0) siIdx2 = spCurrentSurahIdx;
      var plResult2 = spBuildFrPlaylist(siIdx2);
      spPlaylist = plResult2.urls;
      spPlaylistVerseIndices = plResult2.verseIndices;
      spPlaylistIdx = 0;
      if (spPlaylist.length > 0) {
        spAudioEl.src = spPlaylist[0];
        spAudioEl.load();
      }
    }
  }

  function spGetVisibleVerse() {
    var scroll = $("sp-reader-scroll");
    if (!scroll) return -1;
    var verses = scroll.querySelectorAll(".sp-verse[data-i]");
    if (!verses.length) return -1;
    var scrollRect = scroll.getBoundingClientRect();
    var centerY = scrollRect.top + scrollRect.height / 2;
    var best = -1, bestDist = Infinity;
    verses.forEach(function(v) {
      var r = v.getBoundingClientRect();
      var mid = r.top + r.height / 2;
      var d = Math.abs(mid - centerY);
      if (d < bestDist) { bestDist = d; best = parseInt(v.getAttribute("data-i"), 10); }
    });
    return best;
  }

  function spPlayPause() {
    if (!spAudioEl) return;
    if (spIsPlaying) {
      spAudioEl.pause();
      spIsPlaying = false;
      spUpdatePlayBtn();
    } else {
      // Always detect visible verse and jump to it (like Khatm)
      if (spPlaylist.length > 0) {
        var visI = spGetVisibleVerse();
        if (visI >= 0 && visI !== spCurrentVerseI) {
          var plIdx = spPlaylistVerseIndices.indexOf(visI);
          if (plIdx >= 0) {
            spPlaylistIdx = plIdx;
            spAudioEl.src = spPlaylist[plIdx];
            spCurrentVerseI = visI;
          }
        }
      }
      spAudioEl.play().then(function() {
        spIsPlaying = true;
        spUpdatePlayBtn();
        // Highlight current verse if verse-by-verse
        if (spPlaylist.length > 0 && spPlaylistVerseIndices[spPlaylistIdx] !== undefined) {
          spSetActiveVerse(spPlaylistVerseIndices[spPlaylistIdx]);
        }
      }).catch(function() {
        spIsPlaying = false;
        spUpdatePlayBtn();
        showToast("Audio non disponible");
      });
    }
  }

  function spLoadSurah(surahIdx) {
    spCurrentSurahIdx = surahIdx;
    var s = surahs[surahIdx];
    if (!s) return;
    var num = s.surahNumber;
    var translit = SURAH_TRANSLIT[num] || ("Sourate " + num);
    var meaning = (SURAH_NAMES_FR[num] || "").toUpperCase();

    // Background
    $("sp-bg").style.backgroundImage = "url('" + getSurahImg(num) + "')";

    // Names (reader tab)
    var rName = $("sp-reader-name");
    var rMean = $("sp-reader-meaning");
    if (rName) rName.textContent = translit;
    if (rMean) rMean.textContent = meaning;

    // Names (audio tab)
    var aName = $("sp-audio-name");
    if (aName) aName.textContent = translit;

    // Render reader content
    spRenderReader(surahIdx);

    // Setup audio
    spSetupAudio(num);
  }

  function spSwitchPage(pageIdx) {
    var readerPage = $("sp-reader-page");
    var audioPage = $("sp-audio-page");
    var tabReader = $("sp-tab-reader");
    var tabAudio = $("sp-tab-audio");
    var dots = document.querySelectorAll(".sp-dot");

    var container = $("surah-player");
    var actionBar = $("sp-action-bar");
    if (pageIdx === 0) {
      if (readerPage) readerPage.classList.remove("hidden");
      if (audioPage) audioPage.classList.add("hidden");
      if (tabReader) tabReader.classList.add("sp-tab-active");
      if (tabAudio) tabAudio.classList.remove("sp-tab-active");
      if (container) container.classList.add("sp-reader-mode");
      // Action bar stays hidden until long-press
      // Scroll to active verse if playing
      if (spCurrentVerseI >= 0) {
        setTimeout(function() { spSetActiveVerse(spCurrentVerseI); }, 80);
      }
    } else {
      if (readerPage) readerPage.classList.add("hidden");
      if (audioPage) audioPage.classList.remove("hidden");
      if (tabReader) tabReader.classList.remove("sp-tab-active");
      if (tabAudio) tabAudio.classList.add("sp-tab-active");
      if (container) container.classList.remove("sp-reader-mode");
      if (actionBar) actionBar.classList.add("hidden");
    }
    dots.forEach(function(d, i) {
      d.classList.toggle("sp-dot-active", i === pageIdx);
    });
  }

  // --- Sourate du jour progress tracking ---
  function _spDailyKey() {
    var d = new Date();
    return "sp-daily-" + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function _spSaveDailyProgress(verseIdx) {
    var dailyIdx = getDailySurahIdx();
    if (spCurrentSurahIdx !== dailyIdx) return;
    var key = _spDailyKey();
    var surah = surahs[dailyIdx];
    if (!surah) return;
    var total = surah.ayahs.length;
    try {
      var existing = JSON.parse(localStorage.getItem(key) || "{}");
      var prev = existing.highWater || -1;
      if (verseIdx > prev) {
        existing.surahIdx = dailyIdx;
        existing.highWater = verseIdx;
        existing.total = total;
        localStorage.setItem(key, JSON.stringify(existing));
      }
    } catch (e) {}
  }
  function _spGetDailyProgress() {
    var key = _spDailyKey();
    try {
      var data = JSON.parse(localStorage.getItem(key) || "null");
      if (!data || data.surahIdx == null) return null;
      return data;
    } catch (e) { return null; }
  }

  // SP scroll-based verse counting (for manual reading without audio)
  var _spScrollCountTimer = null;
  var _spHighWaterVerse = -1;
  var _spSavePositionTimer = null;
  function _spOnReaderScroll() {
    if (spIsPlaying) return; // Audio mode already counts via spSetActiveVerse
    clearTimeout(_spScrollCountTimer);
    _spScrollCountTimer = setTimeout(function() {
      var visI = spGetVisibleVerse();
      if (visI >= 0 && visI > _spHighWaterVerse) {
        var fromI = _spHighWaterVerse < 0 ? visI : (_spHighWaterVerse + 1);
        var diff = visI - (_spHighWaterVerse < 0 ? visI - 1 : _spHighWaterVerse);
        // Sum letters for all verses in range
        var totalLetters = 0;
        for (var vi = fromI; vi <= visI; vi++) {
          totalLetters += getVerseLetters(spCurrentSurahIdx, vi);
        }
        recordReading(diff, totalLetters);
        _spHighWaterVerse = visI;
        _spSaveDailyProgress(visI);
      }
    }, 800); // debounce 800ms — count when user pauses scrolling

    // Save reading position (debounced)
    clearTimeout(_spSavePositionTimer);
    _spSavePositionTimer = setTimeout(function() {
      var visI = spGetVisibleVerse();
      if (visI >= 0 && spCurrentSurahIdx >= 0) {
        var scrollEl = $("sp-reader-scroll");
        var scrollTop = scrollEl ? scrollEl.scrollTop : 0;
        try {
          localStorage.setItem("sp-pos-" + spCurrentSurahIdx, JSON.stringify({
            verseIdx: visI,
            scrollTop: scrollTop,
            ts: Date.now()
          }));
        } catch (e) {}
      }
    }, 500);
  }
  /** Restore saved reading position for a surah (if recent) */
  function _spRestorePosition(surahIdx) {
    try {
      var raw = localStorage.getItem("sp-pos-" + surahIdx);
      if (!raw) return null;
      var data = JSON.parse(raw);
      // Expire after 30 days
      if (Date.now() - data.ts > 30 * 86400000) {
        localStorage.removeItem("sp-pos-" + surahIdx);
        return null;
      }
      return data;
    } catch (e) { return null; }
  }

  function openSurahPlayer(surahIdx) {
    var overlay = $("surah-player");
    if (!overlay) return;
    spCurrentSurahIdx = surahIdx;
    _spLastCountedVerse = -1; // Reset verse counter for new surah
    _spHighWaterVerse = -1; // Reset scroll counter
    spLoadSurah(surahIdx);
    spSwitchPage(0);
    overlay.classList.remove("hidden");
    startReadingTimer();
    // Attach scroll listener for verse counting
    var scrollEl = $("sp-reader-scroll");
    if (scrollEl) {
      scrollEl.removeEventListener("scroll", _spOnReaderScroll);
      scrollEl.addEventListener("scroll", _spOnReaderScroll, { passive: true });
    }
    // Update lang opts display
    spRefreshLangOpts();
    updateSpmModeDisplay();
    updateSpmRiwayaDisplay();
    updateSpmSizeDisplay();
    // Restore saved reading position (if any)
    var savedPos = _spRestorePosition(surahIdx);
    if (savedPos && savedPos.verseIdx > 0) {
      setTimeout(function() {
        var scrollEl2 = $("sp-reader-scroll");
        if (!scrollEl2) return;
        // Try scrolling to the saved verse element
        var verseEl = scrollEl2.querySelector('.sp-verse[data-i="' + savedPos.verseIdx + '"]');
        if (verseEl) {
          verseEl.scrollIntoView({ block: "start" });
          // Set high water mark so we don't re-count already-read verses
          _spHighWaterVerse = savedPos.verseIdx;
        } else if (savedPos.scrollTop > 0) {
          scrollEl2.scrollTop = savedPos.scrollTop;
        }
      }, 150);
    }
    // Long-press hint tooltip
    _showLongPressHint();
  }

  var _lpHintShownThisSession = false;
  function _showLongPressHint() {
    // Once per session (app launch)
    if (_lpHintShownThisSession) return;
    // If user dismissed with X → never show again
    if (localStorage.getItem("qurani-lp-hint-dismissed")) return;
    // Show for 3 days after first seen, then stop (unless dismissed earlier)
    var HINT_KEY = "qurani-lp-hint-start";
    var startStr = localStorage.getItem(HINT_KEY);
    var now = Date.now();
    if (!startStr) {
      localStorage.setItem(HINT_KEY, String(now));
    } else {
      var elapsed = now - parseInt(startStr, 10);
      if (elapsed > 3 * 24 * 60 * 60 * 1000) return;
    }
    _lpHintShownThisSession = true;
    setTimeout(function() {
      var existing = document.getElementById("sp-longpress-hint");
      if (existing) existing.remove();
      var hint = document.createElement("div");
      hint.id = "sp-longpress-hint";
      hint.className = "sp-lp-hint";
      hint.innerHTML =
        '<div class="sp-lp-hint-icon">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M12 18c4-2.5 7-5.5 7-9a5 5 0 0 0-7-4.5A5 5 0 0 0 5 9c0 3.5 3 6.5 7 9z"/>' +
          '</svg>' +
        '</div>' +
        '<div class="sp-lp-hint-text">' +
          '<span class="sp-lp-hint-title">Astuce</span>' +
          '<span class="sp-lp-hint-desc">Maintenez un verset pour l\u2019ajouter en favori, noter ou \u00e9couter.<br><span class="sp-lp-hint-contact">Un bug\u00a0? Contactez-nous dans Vous\u00a0\u203a\u00a0Contact</span></span>' +
        '</div>' +
        '<button class="sp-lp-hint-close" aria-label="Fermer">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>';
      hint.querySelector(".sp-lp-hint-close").addEventListener("click", function(e) { e.stopPropagation(); localStorage.setItem("qurani-lp-hint-dismissed", "1"); hint.classList.add("sp-lp-hint-out"); setTimeout(function() { hint.remove(); }, 500); });
      var reader = $("surah-player");
      if (reader) reader.appendChild(hint);
      // Auto-dismiss after 8s
      setTimeout(function() {
        if (hint.parentNode) { hint.classList.add("sp-lp-hint-out"); setTimeout(function() { hint.remove(); }, 500); }
      }, 8000);
    }, 1000);
  }

  /** Save current reading position immediately */
  function _spSavePositionNow() {
    if (spCurrentSurahIdx < 0) return;
    var scrollEl = $("sp-reader-scroll");
    var visI = spGetVisibleVerse();
    if (visI >= 0) {
      try {
        localStorage.setItem("sp-pos-" + spCurrentSurahIdx, JSON.stringify({
          verseIdx: visI,
          scrollTop: scrollEl ? scrollEl.scrollTop : 0,
          ts: Date.now()
        }));
      } catch (e) {}
    }
  }

  function closeSurahPlayer() {
    // Stop Suivi Vocal if active
    followCleanup();
    // Save reading position before closing
    _spSavePositionNow();
    // Minimize: hide the full-screen overlay but keep audio playing
    var overlay = $("surah-player");
    if (!overlay) return;
    var menu = $("surah-player-menu");
    if (menu) menu.classList.add("hidden");
    overlay.classList.add("hidden");
    stopReadingTimer();
    // Show mini player if audio is playing
    if (spIsPlaying) spShowMiniPlayer();
    // Refresh dashboard sourate du jour progress
    updateDashSuratCard();
  }

  function spFullClose() {
    // Stop Suivi Vocal if active
    followCleanup();
    // Save reading position before fully closing
    _spSavePositionNow();
    // Fully stop and close everything
    if (spAudioEl) { spAudioEl.pause(); spIsPlaying = false; spAudioEl.src = ""; }
    spUpdatePlayBtn();
    var menu = $("surah-player-menu");
    if (menu) menu.classList.add("hidden");
    var overlay = $("surah-player");
    if (overlay) overlay.classList.add("hidden");
    spHideMiniPlayer();
  }

  function spShowMiniPlayer() {
    var mini = $("sp-mini");
    if (!mini) return;
    var s = surahs[spCurrentSurahIdx];
    var name = s ? (SURAH_TRANSLIT[s.surahNumber] || ("Sourate " + s.surahNumber)) : "Sourate";
    var nameEl = $("sp-mini-name");
    var bgEl = $("sp-mini-bg");
    if (nameEl) nameEl.textContent = name;
    if (bgEl && s) bgEl.style.backgroundImage = "url('" + getSurahImg(s.surahNumber) + "')";
    spUpdateMiniPlayBtn();
    mini.classList.remove("hidden");
  }

  function spHideMiniPlayer() {
    var mini = $("sp-mini");
    if (mini) mini.classList.add("hidden");
  }

  function spUpdateMiniPlayBtn() {
    var playIcon = $("sp-mini-play-icon");
    var pauseIcon = $("sp-mini-pause-icon");
    if (playIcon) playIcon.classList.toggle("hidden", spIsPlaying);
    if (pauseIcon) pauseIcon.classList.toggle("hidden", !spIsPlaying);
  }

  function spRefreshLangOpts() {
    var lang = getSpLang();
    document.querySelectorAll(".spm-lang-opt").forEach(function(el) {
      el.classList.toggle("spm-lang-active", el.dataset.lang === lang);
    });
  }

  function spCloseSpmMenu() {
    var menu = $("surah-player-menu");
    if (menu) menu.classList.add("hidden");
    spMenuOpen = false;
    spLangOpen = false;
    var langOpts = $("spm-lang-opts");
    var langRow = $("spm-lang-row");
    if (langOpts) langOpts.classList.add("hidden");
    if (langRow) langRow.classList.remove("spm-open");
    var modeOpts = $("spm-mode-opts");
    var modeChev = $("spm-mode-chev");
    if (modeOpts) modeOpts.classList.add("hidden");
    if (modeChev) modeChev.style.transform = "";
  }

  function initSurahPlayer() {
    spAudioEl = $("sp-audio-el");

    // Close button
    var closeBtn = $("sp-close");
    if (closeBtn) closeBtn.addEventListener("click", closeSurahPlayer);

    // Suivi Vocal mic button
    var spFollowBtn = $("sp-follow-btn");
    if (spFollowBtn) spFollowBtn.addEventListener("click", function() { followToggle("freeread"); });

    // Tab switching
    var tabReader = $("sp-tab-reader");
    var tabAudio = $("sp-tab-audio");
    if (tabReader) tabReader.addEventListener("click", function() { spSwitchPage(0); });
    if (tabAudio) tabAudio.addEventListener("click", function() { spSwitchPage(1); });

    // Page dots switching
    document.querySelectorAll(".sp-dot").forEach(function(dot, i) {
      dot.addEventListener("click", function() { spSwitchPage(i); });
    });

    // ··· menu button
    var menuBtn = $("sp-menu-btn");
    if (menuBtn) {
      menuBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        var menu = $("surah-player-menu");
        if (!menu) return;
        if (spMenuOpen) {
          spCloseSpmMenu();
          return;
        }
        // Position menu near the button, clamped to viewport
        var rect = menuBtn.getBoundingClientRect();
        menu.style.top = (rect.bottom + 8) + "px";
        var mr = window.innerWidth - rect.right;
        if (mr < 16) mr = 16;
        menu.style.right = mr + "px";
        menu.style.left = "auto";
        menu.classList.remove("hidden");
        spMenuOpen = true;
        spRefreshLangOpts();
      });
    }

    // Close menu when clicking outside
    document.addEventListener("click", function(e) {
      if (spMenuOpen) {
        var menu = $("surah-player-menu");
        if (menu && !menu.contains(e.target)) {
          spCloseSpmMenu();
        }
      }
    });

    // Language toggle
    var langRow = $("spm-lang-row");
    if (langRow) {
      langRow.addEventListener("click", function(e) {
        e.stopPropagation();
        var opts = $("spm-lang-opts");
        spLangOpen = !spLangOpen;
        langRow.classList.toggle("spm-open", spLangOpen);
        if (opts) opts.classList.toggle("hidden", !spLangOpen);
      });
    }

    // Language options
    document.querySelectorAll(".spm-lang-opt").forEach(function(el) {
      el.addEventListener("click", function(e) {
        e.stopPropagation();
        setSpLang(el.dataset.lang);
        spRefreshLangOpts();
        spCloseSpmMenu();
        // Re-render reader with new lang
        var needsPh = (el.dataset.lang === "ph" || el.dataset.lang === "ar-ph" || el.dataset.lang === "fr-ph" || el.dataset.lang === "en-ph");
        if (needsPh) {
          var num = surahs[spCurrentSurahIdx] ? surahs[spCurrentSurahIdx].surahNumber : null;
          if (num) {
            loadPhoneticForSurah(num, function() { spRenderReader(spCurrentSurahIdx); });
            return;
          }
        }
        spRenderReader(spCurrentSurahIdx);
      });
    });

    // AirPlay
    var airplayBtn = $("spm-airplay");
    if (airplayBtn) {
      airplayBtn.addEventListener("click", function() {
        spCloseSpmMenu();
        if (!spAudioEl) return;
        if (spAudioEl.webkitShowPlaybackTargetPicker) {
          spAudioEl.webkitShowPlaybackTargetPicker();
        } else if (spAudioEl.remote && spAudioEl.remote.prompt) {
          spAudioEl.remote.prompt().catch(function() {});
        } else {
          showToast("AirPlay non disponible");
        }
      });
    }

    // About surah
    var aboutSurahBtn = $("spm-about-surah");
    if (aboutSurahBtn) {
      aboutSurahBtn.addEventListener("click", function() {
        spCloseSpmMenu();
        var s = surahs[spCurrentSurahIdx];
        if (!s) return;
        var num = s.surahNumber;
        var vc = s.ayahs.length;
        if (num !== 1 && num !== 9) vc -= 1;
        showToast(SURAH_TRANSLIT[num] + " · " + SURAH_NAMES_FR[num] + " · " + vc + " versets");
      });
    }

    // About translation
    var aboutTranslBtn = $("spm-about-transl");
    if (aboutTranslBtn) {
      aboutTranslBtn.addEventListener("click", function() {
        spCloseSpmMenu();
        showToast("Traduction : Le Noble Coran (IslamSounnah)");
      });
    }

    // Mode de lecture toggle
    var spmModeRow = $("spm-mode-row");
    if (spmModeRow) {
      spmModeRow.addEventListener("click", function(e) {
        e.stopPropagation();
        var opts = $("spm-mode-opts");
        if (opts) opts.classList.toggle("hidden");
        var chev = $("spm-mode-chev");
        if (chev) chev.style.transform = opts.classList.contains("hidden") ? "" : "rotate(90deg)";
      });
    }
    document.querySelectorAll(".spm-mode-opt").forEach(function(el) {
      el.addEventListener("click", function(e) {
        e.stopPropagation();
        setSpMode(el.dataset.mode);
        updateSpmModeDisplay();
        var opts = $("spm-mode-opts");
        if (opts) opts.classList.add("hidden");
        var chev = $("spm-mode-chev");
        if (chev) chev.style.transform = "";
        if ((el.dataset.mode === "minimal-color" || el.dataset.mode === "tajwid" || el.dataset.mode === "tajwid-color") && !tajwidData && !tajwidLoading) {
          loadTajwidOverlay();
        }
        spRenderReader(spCurrentSurahIdx);
      });
    });
    // Riwaya (Hafs / Warsh) — SPM
    var spmRiwayaRow = $("spm-riwaya-row");
    if (spmRiwayaRow) {
      spmRiwayaRow.addEventListener("click", function(e) {
        e.stopPropagation();
        var opts = $("spm-riwaya-opts");
        if (opts) opts.classList.toggle("hidden");
        var chev = $("spm-riwaya-chev");
        if (chev) chev.style.transform = opts.classList.contains("hidden") ? "" : "rotate(90deg)";
      });
    }
    document.querySelectorAll(".spm-riwaya-opt").forEach(function(el) {
      el.addEventListener("click", function(e) {
        e.stopPropagation();
        state.riwaya = el.dataset.riwaya;
        saveState();
        switchRiwaya(state.riwaya).then(function() {
          updateSpmRiwayaDisplay();
          spRenderReader(spCurrentSurahIdx);
        });
        var opts = $("spm-riwaya-opts");
        if (opts) opts.classList.add("hidden");
        var chev = $("spm-riwaya-chev");
        if (chev) chev.style.transform = "";
      });
    });
    // Text size controls
    var spmSizeMinus = $("spm-size-minus");
    var spmSizePlus = $("spm-size-plus");
    if (spmSizeMinus) {
      spmSizeMinus.addEventListener("click", function(e) {
        e.stopPropagation();
        var s = Math.max(60, getSpScale() - 10);
        setSpScale(s);
        updateSpmSizeDisplay();
        applySpmScale();
      });
    }
    if (spmSizePlus) {
      spmSizePlus.addEventListener("click", function(e) {
        e.stopPropagation();
        var s = Math.min(180, getSpScale() + 10);
        setSpScale(s);
        updateSpmSizeDisplay();
        applySpmScale();
      });
    }

    // Close player
    var closePBtn = $("spm-close-player");
    if (closePBtn) {
      closePBtn.addEventListener("click", function() {
        spCloseSpmMenu();
      });
    }

    // Audio events
    if (spAudioEl) {
      spAudioEl.addEventListener("timeupdate", spUpdateSeekUI);
      spAudioEl.addEventListener("loadedmetadata", spUpdateSeekUI);
      spAudioEl.addEventListener("ended", function() {
        // Verse-by-verse chaining
        if (spAutoNext && spPlaylist.length > 0 && spPlaylistIdx < spPlaylist.length - 1) {
          spPlaylistIdx++;
          spAudioEl.src = spPlaylist[spPlaylistIdx];
          spAudioEl.play().catch(function() {});
          // Highlight next verse
          if (spPlaylistVerseIndices[spPlaylistIdx] !== undefined) {
            spSetActiveVerse(spPlaylistVerseIndices[spPlaylistIdx]);
          }
        } else {
          spIsPlaying = false;
          spUpdatePlayBtn();
          spCurrentVerseI = -1;
          // Clear glow when playback ends
          document.querySelectorAll(".sp-verse-ar.audio-glow").forEach(function(el) {
            el.classList.remove("audio-glow");
          });
        }
      });
      spAudioEl.addEventListener("error", function() {
        spIsPlaying = false;
        spUpdatePlayBtn();
        showToast("Audio non disponible");
        document.querySelectorAll(".sp-verse-ar.audio-glow").forEach(function(el) {
          el.classList.remove("audio-glow");
        });
      });
    }

    // Play/Pause button
    var ppBtn = $("sp-playpause");
    if (ppBtn) ppBtn.addEventListener("click", spPlayPause);

    // Header Play button (same as Audio tab play)
    var spHdrPlay = $("sp-play-btn");
    if (spHdrPlay) spHdrPlay.addEventListener("click", spPlayPause);

    // Header Auto-next button
    var spAutoBtn = $("sp-auto-btn");
    if (spAutoBtn) {
      spAutoBtn.classList.toggle("sp-auto-active", spAutoNext);
      spAutoBtn.addEventListener("click", function() {
        spAutoNext = !spAutoNext;
        spAutoBtn.classList.toggle("sp-auto-active", spAutoNext);
      });
    }

    // Rewind -10s
    var rewBtn = $("sp-rew");
    if (rewBtn) {
      rewBtn.addEventListener("click", function() {
        if (spAudioEl) spAudioEl.currentTime = Math.max(0, spAudioEl.currentTime - 10);
      });
    }

    // Forward +10s
    var fwdBtn = $("sp-fwd");
    if (fwdBtn) {
      fwdBtn.addEventListener("click", function() {
        if (spAudioEl) spAudioEl.currentTime = Math.min(spAudioEl.duration || 0, spAudioEl.currentTime + 10);
      });
    }

    // Previous surah
    var prevBtn = $("sp-prev-surah");
    if (prevBtn) {
      prevBtn.addEventListener("click", function() {
        var idx = spCurrentSurahIdx - 1;
        if (idx < 0) idx = surahs.length - 1;
        spLoadSurah(idx);
      });
    }

    // Next surah
    var nextBtn = $("sp-next-surah");
    if (nextBtn) {
      nextBtn.addEventListener("click", function() {
        var idx = spCurrentSurahIdx + 1;
        if (idx >= surahs.length) idx = 0;
        spLoadSurah(idx);
      });
    }

    // Seek bar
    var seekBar = $("sp-seek");
    if (seekBar) {
      seekBar.addEventListener("input", function() {
        if (spAudioEl && spAudioEl.duration && !isNaN(spAudioEl.duration)) {
          spAudioEl.currentTime = (seekBar.value / 1000) * spAudioEl.duration;
        }
      });
    }

    // Récitateur menu item
    var reciterMenuItem = $("spm-reciter");
    if (reciterMenuItem) {
      reciterMenuItem.addEventListener("click", function() {
        spCloseSpmMenu();
        openSpReciterSheet();
      });
    }

    // Reciter sheet backdrop & close
    var recBack = $("sp-reciter-backdrop");
    var recClose = $("sp-reciter-close");
    if (recBack) recBack.addEventListener("click", closeSpReciterSheet);
    if (recClose) recClose.addEventListener("click", closeSpReciterSheet);

  // Mini player buttons
  var miniBar = $("sp-mini");
  var miniPp = $("sp-mini-pp");
  var miniClose = $("sp-mini-close-btn");
  if (miniBar) {
    miniBar.addEventListener("click", function() {
      // Tap mini player → reopen full screen player
      spHideMiniPlayer();
      var overlay = $("surah-player");
      if (overlay) overlay.classList.remove("hidden");
    });
  }
  if (miniPp) {
    miniPp.addEventListener("click", function(e) {
      e.stopPropagation();
      spPlayPause();
      spUpdateMiniPlayBtn();
    });
  }
  if (miniClose) {
    miniClose.addEventListener("click", function(e) {
      e.stopPropagation();
      spFullClose();
    });
  }
}

  function openSpReciterSheet() {
    var sheet = $("sp-reciter-sheet");
    if (!sheet) return;
    spBuildReciterList();
    sheet.classList.remove("hidden");
  }

  function closeSpReciterSheet() {
    var sheet = $("sp-reciter-sheet");
    if (sheet) sheet.classList.add("hidden");
  }

  function spBuildReciterList() {
    var list = $("sp-reciter-list");
    if (!list) return;
    list.innerHTML = "";
    var currentId = getReciter();
    var arReciters = RECITERS.filter(function(r) { return r.lang !== "fr" && (r.listenBase || r.id); });
    var frReciters = RECITERS.filter(function(r) { return r.lang === "fr"; });

    // Arabic section
    var arLabel = document.createElement("div");
    arLabel.className = "spr-section-label";
    arLabel.textContent = "RÉCITATEURS ARABES";
    list.appendChild(arLabel);
    arReciters.forEach(function(r) {
      var item = spMakeReciterItem(r, currentId);
      list.appendChild(item);
    });

    // French section
    if (frReciters.length > 0) {
      var frLabel = document.createElement("div");
      frLabel.className = "spr-section-label";
      frLabel.textContent = "TRADUCTION FRANÇAISE";
      list.appendChild(frLabel);
      frReciters.forEach(function(r) {
        var item = spMakeReciterItem(r, currentId);
        list.appendChild(item);
      });
    }
  }

  function spMakeReciterItem(reciter, currentId) {
    var item = document.createElement("div");
    item.className = "spr-item" + (reciter.id === currentId ? " spr-active" : "");
    var info = document.createElement("div");
    info.className = "spr-item-info";
    var name = document.createElement("span");
    name.className = "spr-item-name";
    name.textContent = reciter.name;
    var lang = document.createElement("span");
    lang.className = "spr-item-lang";
    lang.textContent = reciter.lang === "fr" ? "FRANÇAIS" : "ARABE";
    info.appendChild(name);
    info.appendChild(lang);
    var check = document.createElement("span");
    check.className = "spr-item-check";
    check.textContent = reciter.id === currentId ? "✓" : "";
    item.appendChild(info);
    item.appendChild(check);
    item.addEventListener("click", function() {
      setReciter(reciter.id);
      closeSpReciterSheet();
      // Reload audio for current surah
      var s = surahs[spCurrentSurahIdx];
      if (s) spSetupAudio(s.surahNumber);
    });
    return item;
  }

  // ---- RIWAYA (Hafs / Warsh) ----
  function _processRawSurahs(rawSurahs) {
    // Extract the Basmala from surah 1 verse 1 (remove BOM if present)
    BASMALA = rawSurahs[0].ayahs[0].replace(/^\uFEFF/, "");

    // For every surah except 1 (Al-Fatiha) and 9 (At-Tawba):
    // Split the Basmala out of verse 1 into its own separate verse.
    surahs = rawSurahs.map(function (s) {
      if (s.surahNumber === 1 || s.surahNumber === 9) return s;
      var v1 = s.ayahs[0];
      if (v1.startsWith(BASMALA)) {
        // Hafs: basmala embedded in v1 — split it out
        var rest = v1.substring(BASMALA.length).trim();
        return {
          surahNumber: s.surahNumber,
          surahNameAr: s.surahNameAr,
          ayahs: [BASMALA].concat(rest ? [rest] : []).concat(s.ayahs.slice(1)),
        };
      }
      // Warsh: verses already split, no basmala in v1 — prepend it to align indices with surahsFr
      return {
        surahNumber: s.surahNumber,
        surahNameAr: s.surahNameAr,
        ayahs: [BASMALA].concat(s.ayahs),
      };
    });

    totalAyat = surahs.reduce(function (sum, s) { return sum + s.ayahs.length; }, 0);
  }

  async function switchRiwaya(riwaya) {
    var quranFile = riwaya === "warsh" ? "quran-warsh.json" : "quran.json";
    var rawSurahs = await fetch(quranFile).then(function (r) { return r.json(); });
    _processRawSurahs(rawSurahs);

    // Auto-switch reciter to match riwaya
    var currentReciter = getReciter();
    var currentR = RECITERS.find(function (r) { return r.id === currentReciter; });
    var currentRiwaya = (currentR && currentR.riwaya) || "hafs";
    if (currentRiwaya !== riwaya) {
      var defaultReciter = riwaya === "warsh" ? "mp3q_hlarraz" : "Alafasy_128kbps";
      setReciter(defaultReciter);
      var settingsReciterSelect = $("settings-reciter-select");
      if (settingsReciterSelect) settingsReciterSelect.value = defaultReciter;
    }

    // Update reciter dropdown to show only matching reciters
    _filterRecitersByRiwaya(riwaya);

    render();
  }

  function _filterRecitersByRiwaya(riwaya) {
    var settingsReciterSelect = $("settings-reciter-select");
    if (!settingsReciterSelect) return;
    // Clear and repopulate
    settingsReciterSelect.innerHTML = "";
    RECITERS.filter(function (r) {
      if (!r.id) return false;
      var rr = r.riwaya || "hafs";
      // French reciters (lang: "fr") are always shown
      return rr === riwaya || r.lang === "fr";
    }).forEach(function (r) {
      var opt = document.createElement("option");
      opt.value = r.id;
      opt.textContent = r.name + " \u2014 " + r.nameAr;
      settingsReciterSelect.appendChild(opt);
    });
    settingsReciterSelect.value = getReciter();
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
      var quranFile = state.riwaya === "warsh" ? "quran-warsh.json" : "quran.json";
      var results = await Promise.all([
        fetch(quranFile).then(function (r) { return r.json(); }),
        fetch("quran-fr.json").then(function (r) { return r.json(); }),
        fetch("quran-en.json").then(function (r) { return r.json(); })
      ]);

      if (splashBar) splashBar.style.width = "70%";

      var rawSurahs = results[0];
      var rawSurahsFr = results[1];
      var rawSurahsEn = results[2];

      // Process Arabic surahs (Hafs or Warsh)
      _processRawSurahs(rawSurahs);

      // Same structure for French: add basmala entry for surahs that have it
      surahsFr = rawSurahsFr.map(function (s) {
        if (s.surahNumber === 1 || s.surahNumber === 9) return s;
        // Add basmala as first entry to keep indices aligned with Arabic
        return {
          surahNumber: s.surahNumber,
          ayahs: [BASMALA_FR].concat(s.ayahs),
        };
      });

      // quran-en.json already has bismillah as ayahs[0] — use as-is
      surahsEn = rawSurahsEn;
    } catch (err) {
      document.body.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:100dvh;font-size:14px;color:#999;">Impossible de charger les donn\u00e9es du Coran</div>';
      return;
    }

    if (splashBar) splashBar.style.width = "100%";

    applyMode();  // apply reading mode before showing UI

    $("app").classList.remove("hidden");

    // Ensure splash stays long enough for logo fill animation (3.5s + 0.4s delay + buffer)
    var elapsed = Date.now() - splashStart;
    var remaining = Math.max(0, 4200 - elapsed);
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
        var id = _isDashMorning() ? "matin" : "soir";
        var idx = DUA_CATEGORIES.findIndex(function(c) { return c.id === id; });
        if (idx >= 0) openDuaDetail(idx);
      });
    }
    // Ramadan 10 dernières nuits card click + countdown
    var ramadanBtn = $("dash-ramadan-btn");
    if (ramadanBtn) {
      ramadanBtn.addEventListener("click", openRamadanOverlay);
    }
    updateRamadanCountdown();
    if (_ramadanCountdownInterval) clearInterval(_ramadanCountdownInterval);
    _ramadanCountdownInterval = setInterval(updateRamadanCountdown, 60000);
    // Surat du jour click — lecture libre
    var suratBtn = $("dash-surat-btn");
    if (suratBtn) {
      suratBtn.addEventListener("click", function () {
        openSurahPlayer(getDailySurahIdx());
      });
    }
    // Reading card click — go to Coran tab or open khatm reader if active
    var readingCard = $("dash-reading-card");
    if (readingCard) {
      readingCard.addEventListener("click", function () {
        loadKhatm();
        if (khatm && khatm.active) {
          openKhatmReader(khatm.surahIdx, khatm.ayahIdx, khatm.goalDays);
          return;
        }
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
    $("freeread-follow-btn").addEventListener("click", function() { followToggle("freeread"); });

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
      openQuranSearch();
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
    // Prayer notification toggle
    if ($("prayer-notif-toggle")) {
      $("prayer-notif-toggle").addEventListener("click", togglePrayerNotifications);
    }
    updatePrayerNotifUI();

    // ---- HIFZ v2 (verse-by-verse) ----
    $("hifz-close").addEventListener("click", closeHifzOverlay);
    $("hifz-play-btn").addEventListener("click", hifzToggleAudio);
    $("hifz-menu-btn").addEventListener("click", function (e) { e.stopPropagation(); hifzToggleMenu(); });
    $("hifz-hide-more").addEventListener("click", hifzHideMore);
    $("hifz-hide-less").addEventListener("click", hifzHideLess);
    $("hifz-show-all").addEventListener("click", function () { hifzShowAll(); });
    $("hifz-hide-all").addEventListener("click", function () { hifzHideAll(); });
    $("hifz-menu-reciter").addEventListener("click", hifzOpenReciterSheet);
    $("hifz-reciter-close").addEventListener("click", function () { $("hifz-reciter-sheet").classList.add("hidden"); });
    $("hifz-prev-verse").addEventListener("click", hifzPrevVerse);
    $("hifz-next-verse").addEventListener("click", hifzNextVerse);

    // Reading mode items
    document.querySelectorAll("[data-hifz-mode]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var mode = btn.getAttribute("data-hifz-mode");
        setHifzReadingMode(mode);
        _hifzUpdateModeChecks();
        if (mode.indexOf("tajwid") !== -1 || mode.indexOf("color") !== -1) {
          loadTajwidOverlay().then(function () { renderHifz(); });
        } else {
          renderHifz();
        }
      });
    });

    // Surah select — loads new surah at verse 0
    $("hifz-surah-select").addEventListener("change", function () {
      hifzSurahIdx = parseInt(this.value, 10);
      hifzAyahIdx = 0;
      hifzHidePercent = 0;
      hifzManualHide.clear(); hifzManualShow.clear();
      _hifzPopulateAyahSelect();
      hifzStopAudio();
      renderHifz();
    });

    // Ayah select — loads the selected verse
    $("hifz-ayah-select").addEventListener("change", function () {
      _hifzLoadVerse(parseInt(this.value, 10));
    });

    // Close menu on tap outside
    document.addEventListener("click", function (e) {
      if (hifzMenuOpen) {
        var menu = $("hifz-menu");
        var btn = $("hifz-menu-btn");
        if (menu && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
          hifzCloseMenu();
        }
      }
    });

    // Moi → Mémorisation
    var moiHifz = $("moi-hifz");
    if (moiHifz) moiHifz.addEventListener("click", openHifzFromMoi);

    // ---- LISTEN ----
    listenRestorePosition();
    $("listen-close").addEventListener("click", closeListenOverlay);
    $("listen-play-btn").addEventListener("click", listenToggle);
    $("listen-prev-btn").addEventListener("click", listenPrevSurah);
    $("listen-next-btn").addEventListener("click", listenNextSurah);
    $("listen-reciter-select").addEventListener("change", function () {
      listenSelectReciter(parseInt(this.value, 10));
    });
    listenInitSeekEvents();

    // ---- MINI-PLAYER ----
    $("mini-player-play").addEventListener("click", listenToggle);
    $("mini-player-prev").addEventListener("click", listenPrevSurah);
    $("mini-player-next").addEventListener("click", listenNextSurah);
    $("mini-player-close").addEventListener("click", miniPlayerStop);
    $("mini-player-open").addEventListener("click", function () {
      openListenOverlay();
    });

    // ---- RECITER SEARCH ----
    $("lp-reciter-search-btn").addEventListener("click", function () {
      var wrap = $("lp-reciter-search");
      var inp = $("lp-reciter-search-input");
      wrap.classList.toggle("hidden");
      if (!wrap.classList.contains("hidden")) {
        inp.value = "";
        inp.focus();
        listenFilterReciters("");
      }
    });
    $("lp-reciter-search-input").addEventListener("input", function () {
      listenFilterReciters(this.value);
    });

    // ---- SCROLL TO TOP ----
    $("lp-scroll-top").addEventListener("click", function () {
      var body = document.querySelector(".lp-body");
      if (body) body.scrollTo({ top: 0, behavior: "smooth" });
    });

    // ---- SURAH SEARCH ----
    $("lp-surah-search-btn").addEventListener("click", function () {
      var wrap = $("lp-surah-search");
      var inp = $("lp-surah-search-input");
      wrap.classList.toggle("hidden");
      if (!wrap.classList.contains("hidden")) {
        inp.value = "";
        inp.focus();
        listenFilterSurahs("");
      } else {
        listenFilterSurahs("");
      }
    });
    $("lp-surah-search-input").addEventListener("input", function () {
      listenFilterSurahs(this.value);
    });

    // ---- DASH LISTEN CARD ----
    var dashListenCard = $("dash-listen-card");
    if (dashListenCard) dashListenCard.addEventListener("click", function () {
      openListenOverlay();
    });

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
    // Qibla bottom bar: PRIÈRES → close qibla, open prayer overlay
    var qGotoPrayers = $("qibla-goto-prayers");
    if (qGotoPrayers) qGotoPrayers.addEventListener("click", function () {
      closeQiblaOverlay();
      openPrayerOverlay();
    });
    // Qibla bottom bar: RÉGLAGES → close qibla, open prayer overlay + settings panel
    var qGotoSettings = $("qibla-goto-settings");
    if (qGotoSettings) qGotoSettings.addEventListener("click", function () {
      closeQiblaOverlay();
      openPrayerOverlay();
      setTimeout(function () {
        var panel = $("prayer-settings-panel");
        if (panel) {
          panel.classList.remove("hidden");
          setTimeout(function () { panel.classList.add("visible"); }, 20);
          renderPrayerMethodButtons();
          renderPrayerLocationBar();
        }
      }, 300);
    });
    $("bookmark-btn").addEventListener("click", toggleBookmark);
    updateBookmarkBtn();
    $("share-btn").addEventListener("click", function () {
      _shareAyahCache = freeReadMode ? getFreeReadAyah() : getAyahByGlobalIndex(state.globalIndex);
      _openShareChoice();
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

    // ---- TAJWID LEGEND ----
    var tjLegendBtn = $("tajwid-legend-btn");
    if (tjLegendBtn) tjLegendBtn.addEventListener("click", function () {
      $("tajwid-legend-sheet").classList.remove("hidden");
    });
    var tjLegendClose = $("tajwid-legend-close");
    if (tjLegendClose) tjLegendClose.addEventListener("click", function () {
      $("tajwid-legend-sheet").classList.add("hidden");
    });
    var tjLegendBd = $("tajwid-legend-backdrop");
    if (tjLegendBd) tjLegendBd.addEventListener("click", function () {
      $("tajwid-legend-sheet").classList.add("hidden");
    });

    var hassToggleBtn = $("stats-hassanates-toggle");
    if (hassToggleBtn) {
      hassToggleBtn.addEventListener("click", function () {
        state.showHassanates = !(state.showHassanates !== false);
        saveState();
        render();
      });
    }
    var dashToggleBtn = $("stats-dashstats-toggle");
    if (dashToggleBtn) {
      dashToggleBtn.addEventListener("click", function () {
        state.showDashStats = !(state.showDashStats !== false);
        saveState();
        render();
      });
    }

    // Stats reset button
    var statsResetBtn = $("stats-reset-btn");
    if (statsResetBtn) {
      statsResetBtn.addEventListener("click", function() {
        var sheet = $("stats-reset-sheet");
        if (!sheet) return;
        sheet.classList.remove("hidden");
        var cancelBtn = $("srs-cancel");
        var confirmBtn = $("srs-confirm");
        var backdrop = $("srs-backdrop");
        function closeSheet() { sheet.classList.add("hidden"); }
        if (cancelBtn) cancelBtn.onclick = closeSheet;
        if (backdrop) backdrop.onclick = closeSheet;
        if (confirmBtn) confirmBtn.onclick = function() {
          stats = { totalVersesRead: 0, readDates: [], streak: 0, totalReadingSeconds: 0, totalHassanates: 0 };
          saveStats(stats);
          closeSheet();
          renderStats();
          renderDashStats();
        };
      });
    }

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

    // ---- RIWAYA SELECT (SETTINGS) ----
    var settingsRiwayaSelect = $("settings-riwaya-select");
    if (settingsRiwayaSelect) {
      settingsRiwayaSelect.value = state.riwaya || "hafs";
      settingsRiwayaSelect.addEventListener("change", function () {
        state.riwaya = this.value;
        saveState();
        switchRiwaya(state.riwaya);
      });
    }

    // ---- RECITER SELECT (SETTINGS) ----
    var settingsReciterSelect = $("settings-reciter-select");
    if (settingsReciterSelect) {
      // Populate filtered by current riwaya
      _filterRecitersByRiwaya(state.riwaya || "hafs");
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
      if (document.hidden) {
        // Stop reading timer when app goes to background
        stopReadingTimer();
      } else {
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

    // ---- KHATM SYSTEM INIT ----
    initKhatmLanding();
    initKhatmWizard();
    initKhatmReader();
    initSurahPlayer();

    // ---- QURAN SEARCH ----
    var searchTimer = null;
    var MAX_RESULTS = 50;

    var _performSearch; // exposed for thematic search
    function performSearch(query) {
      var resultsEl = $("search-results");
      var hintEl = $("search-hint");
      var overlay = $("search-overlay");
      resultsEl.innerHTML = "";

      if (!query || query.length < 2) {
        overlay.classList.remove("has-results");
        return;
      }

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
        item.className = "qs-result-card";
        item.style.backgroundImage = "url('" + getSurahImg(r.surahNumber) + "')";

        var num = document.createElement("span");
        num.className = "qs-result-num";
        num.textContent = r.surahNumber;

        var info = document.createElement("div");
        info.className = "qs-result-info";

        var translit = SURAH_TRANSLIT[r.surahNumber] || r.surahNameFr;
        var nameEl = document.createElement("span");
        nameEl.className = "qs-result-name";
        nameEl.textContent = translit;

        var meta = document.createElement("div");
        meta.className = "qs-result-meta";
        meta.textContent = (r.surahNameFr || "").toUpperCase() + "  ·  VERSET " + r.ayahNumber;

        var frDiv = document.createElement("div");
        frDiv.className = "qs-result-fr";
        frDiv.textContent = r.frText || "";

        info.appendChild(nameEl);
        info.appendChild(meta);
        info.appendChild(frDiv);

        var chevron = document.createElement("span");
        chevron.className = "qs-result-chevron";
        chevron.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 6 15 12 9 18"/></svg>';

        item.appendChild(num);
        item.appendChild(info);
        item.appendChild(chevron);

        item.addEventListener("click", function () {
          $("search-overlay").classList.add("hidden");
          openSurahPlayer(r.surahIdx);
          // Scroll to the specific verse after render
          setTimeout(function () {
            var target = document.querySelector("#sp-reader-content [data-i=\"" + r.ayahIdx + "\"]");
            if (target) {
              target.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 150);
        });

        resultsEl.appendChild(item);
      });
    }

    $("search-close").addEventListener("click", function () {
      $("search-overlay").classList.add("hidden");
    });
    $("search-input").addEventListener("input", function () {
      var val = this.value.trim();
      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        performSearch(val);
      }, 300);
    });

    _performSearch = performSearch; // expose for thematic search

    // Keyword pill shortcuts
    document.querySelectorAll(".qs-pill[data-qs-word]").forEach(function (pill) {
      pill.addEventListener("click", function () {
        var word = this.dataset.qsWord;
        $("search-input").value = word;
        performSearch(word);
      });
    });

    // Search icon on khatm hero
    var khSearchBtn = $("kh-search-btn");
    if (khSearchBtn) {
      khSearchBtn.addEventListener("click", function () {
        openQuranSearch();
      });
    }

    function openQuranSearch() {
      var overlay = $("search-overlay");
      overlay.classList.remove("hidden");
      overlay.classList.remove("has-results");
      $("search-input").value = "";
      $("search-results").innerHTML = "";
      populateSearchSuggestions();
      setTimeout(function () { $("search-input").focus(); }, 100);
    }

    var QS_KEYWORDS = [
      { name: "Miséricorde", q: "miséricorde", surah: 1 },
      { name: "Patience", q: "patience", surah: 2 },
      { name: "Paradis", q: "paradis", surah: 55 },
      { name: "Enfer", q: "enfer", surah: 74 },
      { name: "Lumière", q: "lumière", surah: 24 },
      { name: "Justice", q: "justice", surah: 4 },
      { name: "Repentir", q: "repentir", surah: 9 },
      { name: "Prophètes", q: "prophète", surah: 21 },
      { name: "Jugement", q: "jugement", surah: 82 },
      { name: "Cieux", q: "cieux", surah: 67 },
      { name: "Terre", q: "terre", surah: 13 },
      { name: "Mort", q: "mort", surah: 3 },
      { name: "Âme", q: "âme", surah: 91 },
      { name: "Foi", q: "foi", surah: 49 },
      { name: "Anges", q: "anges", surah: 35 }
    ];

    function populateSearchSuggestions() {
      var list = $("qs-suggest-list");
      if (!list) return;
      list.innerHTML = "";
      // Pick 3 random keywords
      var shuffled = QS_KEYWORDS.slice().sort(function() { return 0.5 - Math.random(); });
      for (var i = 0; i < 3 && i < shuffled.length; i++) {
        (function(kw) {
          addSuggestItem(list, "MOT-CLÉ", kw.name, kw.surah, function () {
            $("search-input").value = kw.q;
            performSearch(kw.q);
          });
        })(shuffled[i]);
      }
    }

    function addSuggestItem(list, cat, name, surahNum, onClick) {
      var item = document.createElement("div");
      item.className = "qs-suggest-item";
      item.innerHTML =
        '<div class="qs-suggest-thumb" style="background-image:url(\'' + getSurahImg(surahNum) + '\')"></div>' +
        '<div class="qs-suggest-info">' +
          '<div class="qs-suggest-cat">' + cat + '</div>' +
          '<div class="qs-suggest-name">' + name + '</div>' +
        '</div>' +
        '<svg class="qs-suggest-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 6 15 12 9 18"/></svg>';
      item.addEventListener("click", onClick);
      list.appendChild(item);
    }


    // ---- EMOTION WHEEL ----
    initEmotionWheel();
    $("dash-emotion-plus").addEventListener("click", openEmotionDetail);
    $("emotion-close").addEventListener("click", closeEmotionDetail);

    // Floating back button + scroll hint — emotion overlay
    (function() {
      var fab = $("emotion-float-back");
      var hint = $("emotion-scroll-hint");
      var scroll = document.querySelector("#emotion-overlay .emotion-overlay-scroll");
      if (fab && scroll) {
        // Flèche < → remonte en haut (hero + texte) au lieu de fermer l'overlay
        fab.addEventListener("click", function() {
          scroll.scrollTo({ top: 0, behavior: "smooth" });
        });
        scroll.addEventListener("scroll", function() {
          // Affiche la flèche < dès qu'on est dans les versets/hadiths
          if (scroll.scrollTop > 220) fab.classList.add("visible");
          else fab.classList.remove("visible");
          if (hint && scroll.scrollTop > 40) hint.classList.add("hidden");
        });
      }
      if (hint && scroll) {
        hint.addEventListener("click", function() {
          var article = document.querySelector("#emotion-overlay .emotion-article");
          if (article) {
            scroll.scrollTo({ top: article.offsetTop, behavior: "smooth" });
          } else {
            scroll.scrollBy({ top: Math.round(scroll.clientHeight * 0.65), behavior: "smooth" });
          }
          hint.classList.add("hidden");
        });
      }
    })();
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

    // Floating back button + scroll hint — dua overlay
    (function() {
      var fab = $("dua-float-back");
      var hint = $("dua-scroll-hint");
      var scroll = document.querySelector("#dua-overlay .dua-overlay-scroll");
      if (fab && scroll) {
        // Flèche < → remonte en haut (titre + citation) au lieu de fermer
        fab.addEventListener("click", function() {
          scroll.scrollTo({ top: 0, behavior: "smooth" });
        });
        scroll.addEventListener("scroll", function() {
          // Back FAB
          if (scroll.scrollTop > 220) fab.classList.add("visible");
          else fab.classList.remove("visible");
          // Scroll hint: hide once user starts scrolling
          if (hint && scroll.scrollTop > 40) hint.classList.add("hidden");
        });
      }
      // Scroll hint click → smooth scroll to articles
      if (hint && scroll) {
        hint.addEventListener("click", function() {
          var article = document.getElementById("dua-article");
          if (article) {
            scroll.scrollTo({ top: article.offsetTop - 16, behavior: "smooth" });
          } else {
            scroll.scrollBy({ top: Math.round(scroll.clientHeight * 0.65), behavior: "smooth" });
          }
          hint.classList.add("hidden");
        });
      }
    })();
    // Floating back button + scroll hint — ramadan overlay
    (function() {
      var ramClose = $("ramadan-close");
      var ramFab   = $("ramadan-float-back");
      var ramHint  = $("ramadan-scroll-hint");
      var ramScroll = document.querySelector("#ramadan-overlay .ramadan-overlay-scroll");
      if (ramClose) ramClose.addEventListener("click", closeRamadanOverlay);
      if (ramFab && ramScroll) {
        ramFab.addEventListener("click", closeRamadanOverlay);
        ramScroll.addEventListener("scroll", function() {
          if (ramScroll.scrollTop > 220) ramFab.classList.add("visible");
          else ramFab.classList.remove("visible");
          if (ramHint && ramScroll.scrollTop > 40) ramHint.classList.add("hidden");
        });
      }
      if (ramHint && ramScroll) {
        ramHint.addEventListener("click", function() {
          var article = document.querySelector("#ramadan-overlay .emotion-article");
          if (article) {
            ramScroll.scrollTo({ top: article.offsetTop, behavior: "smooth" });
          } else {
            ramScroll.scrollBy({ top: Math.round(ramScroll.clientHeight * 0.65), behavior: "smooth" });
          }
          ramHint.classList.add("hidden");
        });
      }
    })();

    $("dua-share").addEventListener("click", function() {
      var title = $("dua-title").textContent;
      // Collect all invocation texts from the article entries
      var entries = document.querySelectorAll("#dua-entries .emotion-entry");
      var parts = [];
      entries.forEach(function(entry) {
        var ar = entry.querySelector(".emotion-entry-ar, .emotion-entry-text");
        var fr = entry.querySelector(".emotion-entry-fr, .emotion-entry-trans");
        if (ar && ar.textContent.trim()) parts.push(ar.textContent.trim());
        if (fr && fr.textContent.trim()) parts.push(fr.textContent.trim());
      });
      var text = title + "\n\n" + (parts.length ? parts.join("\n\n") : "") + "\n\n— Qurani App";
      if (navigator.share) {
        navigator.share({ title: title, text: text }).catch(function(){});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() { showToast("Invocation copiée"); }).catch(function() { showToast("Impossible de copier"); });
      }
    });
    // ---- Contact overlay ----
    var dcClose = $("dua-contact-close");
    if (dcClose) dcClose.addEventListener("click", closeDuaContact);
    var dcSubmit = $("dua-contact-submit");
    if (dcSubmit) dcSubmit.addEventListener("click", submitDuaContact);
    // Suggestion chips
    document.querySelectorAll(".dc-chip").forEach(function(chip) {
      chip.addEventListener("click", function() {
        var msg = $("dc-message");
        if (msg) msg.value = chip.dataset.text || chip.textContent;
        document.querySelectorAll(".dc-chip").forEach(function(c) { c.classList.remove("active"); });
        chip.classList.add("active");
        if (msg) msg.focus();
      });
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

    // ---- MOI TAB ----
    initMoiTab();
    initNoteEditor();
    initSpActionBar();

    // ---- SHOOTING STARS (dashboard) ----
    initShootingStars();
  }

  // ================================================================
  //  VIDEOS — Vidéo du Jour (IslamSounnah)
  // ================================================================
  var VIDEOS_LIST = [
    // ── @IslamSounnah — vérifié depuis la chaîne YouTube ──
    { id: "2v4Nh19Yc8s", title: "Pourquoi les sermons du Prophète ne nous sont-ils pas parvenus ?", sheikh: "Sheikh 'Abd as-Salam ach-Chou'ayr", duration: "2 MIN" },
    { id: "TWuwiElCpTk", title: "Le jeûne et la foi en Allah", sheikh: "Sheikh Khalid Isma'il", duration: "18 MIN" },
    { id: "ODpVrdiGe2M", title: "Le traitement du trouble obsessionnel compulsif", sheikh: "Sheikh Soulaymane Ar-Rouhayli", duration: "6 MIN" },
    { id: "7UyqEbVK5w0", title: "Comment aimer Allah d'un amour sincère ?", sheikh: "Sheikh Khalid Isma'il", duration: "15 MIN" },
    { id: "hkdK_fcwEeo", title: "Le Falaq : ce danger dont Allah nous a avertis", sheikh: "Sheikh Khalid Isma'il", duration: "26 MIN" },
    { id: "1aCfi6mqI84", title: "Comment satisfaire tes désirs sans commettre le Haram ?", sheikh: "Sheikh Khalid Isma'il", duration: "14 MIN" },
    { id: "AbvFLE4W95U", title: "Le remède prophétique contre l'insomnie et l'angoisse", sheikh: "Sheikh Al Fawzan", duration: "4 MIN" },
    { id: "smcFuhMsABo", title: "Comment revenir vers Allah après l'insouciance ?", sheikh: "Sheikh Khalid Isma'il", duration: "28 MIN" },
    { id: "JRTjPYSTh9Y", title: "Peut-on prendre l'argent de son père sans permission ?", sheikh: "Sheikh Al Fawzan", duration: "1 MIN" },
    { id: "v1fo3PvgioI", title: "L'histoire entre le Prophète et deux de ses épouses", sheikh: "Sheikh Al Fawzan", duration: "3 MIN" },
    { id: "25lGAjMS1AM", title: "Quelle invocation pour un nourrisson décédé ?", sheikh: "Sheikh Al Fawzan", duration: "1 MIN" },
    { id: "1TKppFcWuq4", title: "Les chameaux sont-ils créés à partir des Djinns ?", sheikh: "Sheikh Al Fawzan", duration: "1 MIN" },
    { id: "8wgyBS7OSTk", title: "Règles du passage devant celui qui prie", sheikh: "Sheikh Al Fawzan", duration: "1 MIN" },
    { id: "Dghyo9gqsoU", title: "Magnifique explication de Ayat al-Kursi", sheikh: "Sheikh Al Fawzan", duration: "4 MIN" },
    { id: "W3tPtxN8fw4", title: "Erreur fréquente en voyage durant Ramadan", sheikh: "Sheikh Al Fawzan", duration: "1 MIN" },
    { id: "MPfc6G-7hNM", title: "L'expiation du serment aggravé", sheikh: "Sheikh Al Fawzan", duration: "1 MIN" },
    { id: "rbEaho1Ecoc", title: "L'âme est-elle retenue par la dette ?", sheikh: "Sheikh Al Fawzan", duration: "1 MIN" },
    { id: "Uz5FCSfMvis", title: "Retarder la prière pour le travail", sheikh: "Sheikh Al Fawzan", duration: "1 MIN" },
    { id: "NMbrPXwG27s", title: "Mariage croisé : est-ce Halal ?", sheikh: "Sheikh Al Fawzan", duration: "1 MIN" },
    { id: "Oq8K1xx5zBI", title: "Les chats affectent-ils la fertilité ?", sheikh: "Sheikh Al Fawzan", duration: "1 MIN" },
    { id: "QTw8DGmerQw", title: "Puis-je rattraper ma prière ?", sheikh: "Sheikh Al Fawzan", duration: "1 MIN" },
    { id: "BHg9LYrYkyA", title: "Le divorce sous la colère comporte 3 cas", sheikh: "Sheikh Al Fawzan", duration: "1 MIN" },
    { id: "o__Y7MUdS4Y", title: "La lecture du Coran pour une femme menstruée", sheikh: "Sheikh Al Fawzan", duration: "1 MIN" },
    { id: "hN-zgaVEd-M", title: "L'eau sur tout le corps suffit pour le Ghusl ?", sheikh: "Sheikh Al Fawzan", duration: "1 MIN" },
    { id: "1JugE0y7Jks", title: "Lequel est le plus grave ?", sheikh: "Sheikh Al Fawzan", duration: "1 MIN" },
    { id: "fBVYUyCM9RQ", title: "Série de Fatawas avec Sheikh Sâlih al-Fawzan", sheikh: "Sheikh Al Fawzan", duration: "26 MIN" },
    { id: "UhORSOEqTMY", title: "Réconcilie et ne divise pas !", sheikh: "Sheikh Al Fawzan", duration: "1 MIN" },
    { id: "FmXeOE-ZYkQ", title: "Le Prophète Youssouf : Une femme l'a tenté, mais il a choisi Allah", sheikh: "Sheikh Al Fawzan", duration: "6 MIN" },
    { id: "sqr-YwBD9qI", title: "Quand un ignorant prétend réviser le Sahih d'Al-Bukhari", sheikh: "Sheikh Salih al-'Oussaymi", duration: "2 MIN" },
    { id: "gX6zPRzFkQM", title: "Quel est notre devoir envers le Messager ?", sheikh: "Sheikh Al Fawzan", duration: "2 MIN" },
    { id: "FuvfkNNHh_c", title: "Le jour où Aïcha fut innocentée par Allah", sheikh: "Sheikh Ibn Baz", duration: "4 MIN" },
    { id: "rmwKJ-bNT3E", title: "Le jugement en Islam du divorce de la femme enceinte", sheikh: "Sheikh Ibn Baz", duration: "6 MIN" },
    { id: "hAXmLkmmcZg", title: "La passion et la négligence sont deux armées parmi les armées d'Iblis", sheikh: "Sheikh 'Abd ar-Razzaq al-Badr", duration: "20 MIN" },
    { id: "PFtRZEtRZ5w", title: "Le repentir et les récits des repentants qui ont fait pleurer les cœurs", sheikh: "Sheikh 'Abd ar-Razzaq al-Badr", duration: "39 MIN" },
    { id: "4vKK7lGupWg", title: "Pourquoi échoues-tu dans la droiture malgré tes efforts ?", sheikh: "Sheikh 'Abd ar-Razzaq al-Badr", duration: "51 MIN" },
    { id: "f_doKojt3a4", title: "L'acte oublié qui mène au Paradis", sheikh: "Sheikh 'Abd ar-Razzaq al-Badr", duration: "3 MIN" },
    { id: "qS8DASnm6-o", title: "Duha : l'heure choisie pour vaincre les sorciers", sheikh: "Sheikh 'Abd ar-Razzaq al-Badr", duration: "4 MIN" },
    { id: "wWlOjuVvBWY", title: "Histoires touchantes sur la douceur du Prophète", sheikh: "Sheikh 'Abd ar-Razzaq al-Badr", duration: "12 MIN" },
    { id: "4tvYZMrfeX4", title: "La voix de la femme musulmane est-elle une Awra en Islam ?", sheikh: "Sheikh Ibn 'Uthaymin", duration: "1 MIN" },
    { id: "wM6rMfbojN0", title: "Conseil aux femmes qui ne respectent pas la pudeur vestimentaire", sheikh: "Sheikh Ibn 'Uthaymin", duration: "3 MIN" }
  ];

  var _currentVideoIdx = 0;

  function getVideoOfDay() {
    var start = new Date(2026, 2, 1);
    var now = new Date();
    var days = Math.floor((now - start) / 86400000);
    return days % VIDEOS_LIST.length;
  }

  var _preloadedIframe = null;

  function loadVideoAtIndex(idx) {
    _currentVideoIdx = idx;
    var v = VIDEOS_LIST[idx];
    $("video-title").textContent = v.title;
    $("video-meta").textContent = v.sheikh + "  \u00b7  " + v.duration;
    // Show thumbnail + play button
    $("video-thumb-img").src = "https://img.youtube.com/vi/" + v.id + "/hqdefault.jpg";
    $("video-thumb-state").classList.remove("hidden");
    $("video-iframe-state").classList.add("hidden");
    $("video-iframe-state").innerHTML = "";
    var scrollEl = $("videos-scroll");
    if (scrollEl) scrollEl.scrollTop = 0;
  }

  function playCurrentVideo() {
    var v = VIDEOS_LIST[_currentVideoIdx];
    // Show iframe player via hosted proxy (fixes YouTube embed in WKWebView)
    $("video-thumb-state").classList.add("hidden");
    $("video-iframe-state").classList.remove("hidden");
    var iframeWrap = $("video-iframe-state");
    iframeWrap.innerHTML = "";
    var iframe = document.createElement("iframe");
    iframe.src = "https://tmshparis.github.io/qurani-player/?v=" + v.id;
    iframe.setAttribute("allow", "autoplay; encrypted-media; fullscreen; picture-in-picture");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.style.cssText = "width:100%;height:100%;border:none;";
    iframeWrap.appendChild(iframe);
  }

  var _videoThumbObserver = null;

  function renderUpNextList(startIdx) {
    var list = $("video-upnext-list");
    if (!list) return;
    list.innerHTML = "";

    // Clean up previous observer
    if (_videoThumbObserver) { _videoThumbObserver.disconnect(); _videoThumbObserver = null; }

    // Create IntersectionObserver for lazy loading thumbnails
    if (window.IntersectionObserver) {
      _videoThumbObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var thumb = entry.target;
            var src = thumb.dataset.bg;
            if (src) {
              thumb.style.backgroundImage = "url('" + src + "')";
              thumb.dataset.bg = "";
            }
            _videoThumbObserver.unobserve(thumb);
          }
        });
      }, { root: $("videos-scroll"), rootMargin: "200px" });
    }

    for (var i = 1; i < VIDEOS_LIST.length; i++) {
      var idx = (startIdx + i) % VIDEOS_LIST.length;
      var v = VIDEOS_LIST[idx];
      var card = document.createElement("div");
      card.className = "video-upnext-card";
      var thumbUrl = "https://img.youtube.com/vi/" + v.id + "/mqdefault.jpg";
      card.innerHTML = '<div class="video-upnext-thumb" data-bg="' + thumbUrl + '"></div>' +
        '<div class="video-upnext-info"><p class="video-upnext-title">' + v.title + '</p>' +
        '<p class="video-upnext-meta">' + v.sheikh + '  \u00b7  ' + v.duration + '</p></div>';

      // Observe thumb for lazy loading
      var thumb = card.querySelector(".video-upnext-thumb");
      if (_videoThumbObserver && thumb) {
        _videoThumbObserver.observe(thumb);
      } else if (thumb) {
        // Fallback: load immediately if no IntersectionObserver
        thumb.style.backgroundImage = "url('" + thumbUrl + "')";
      }

      (function(cardIdx) {
        card.addEventListener("click", function() {
          loadVideoAtIndex(cardIdx);
          renderUpNextList(cardIdx);
        });
      })(idx);
      list.appendChild(card);
    }
  }

  function openVideosOverlay() {
    var idx = getVideoOfDay();
    loadVideoAtIndex(idx);
    renderUpNextList(idx);
    var backBtn = $("video-back-center");
    if (backBtn) backBtn.classList.remove("visible");
    $("videos-overlay").classList.remove("hidden");
  }

  function closeVideosOverlay() {
    $("video-iframe-state").innerHTML = "";
    $("video-thumb-state").classList.remove("hidden");
    $("video-iframe-state").classList.add("hidden");
    $("videos-overlay").classList.add("hidden");
    var backBtn = $("video-back-center");
    if (backBtn) backBtn.classList.remove("visible");
  }

  // ================================================================
  //  PODCAST — Podcast du Jour (@IslamInstitut)
  // ================================================================
  var PODCAST_LIST = [
    { id: "jLhJ2B--liI", title: "Leçons tirées du Coran — Épisode 5", sheikh: "Collectif d'étudiants de Médine", duration: "28 MIN" },
    { id: "_-VnJ5JsgW8", title: "Leçons tirées du Coran — Épisode 4", sheikh: "Collectif d'étudiants de Médine", duration: "25 MIN" },
    { id: "RAmEXUYjxsk", title: "Leçons tirées du Coran — Épisode 3", sheikh: "Collectif d'étudiants de Médine", duration: "30 MIN" },
    { id: "JXORC1L_z4c", title: "Leçons tirées du Coran — Épisode 2", sheikh: "Collectif d'étudiants de Médine", duration: "27 MIN" },
    { id: "htZB3jyuEZ4", title: "Leçons tirées du Coran — Épisode 1", sheikh: "Collectif d'étudiants de Médine", duration: "32 MIN" },
    { id: "laj9iFN27lk", title: "La recherche de pardon pendant Ramadan", sheikh: "Collectif d'étudiants de Médine", duration: "20 MIN" },
    { id: "yfoPRx1kNdM", title: "Qu'est-ce que la source du Tawhid ?", sheikh: "Collectif d'étudiants de Médine", duration: "18 MIN" },
    { id: "xnDiAKg4db8", title: "Ne crains personne : Allah te suffit !", sheikh: "Collectif d'étudiants de Médine", duration: "22 MIN" },
    { id: "hsVXfrWeKMM", title: "Le consensus en Islam", sheikh: "Collectif d'étudiants de Médine", duration: "15 MIN" },
    { id: "3V5fB9pXycM", title: "Qu'est-ce que al-Murabaha ?", sheikh: "Collectif d'étudiants de Médine", duration: "12 MIN" },
    { id: "BSlW8zg-hNM", title: "L'interdiction du Riba vient d'Allah", sheikh: "Collectif d'étudiants de Médine", duration: "14 MIN" },
    { id: "tXrvZPgpv2Y", title: "Les méfaits du Riba", sheikh: "Collectif d'étudiants de Médine", duration: "16 MIN" },
    { id: "cSuRofoujvI", title: "La subsistance illicite est de deux types", sheikh: "Collectif d'étudiants de Médine", duration: "10 MIN" },
    { id: "L4LPZbAUyT8", title: "L'importance des règles du commerce", sheikh: "Collectif d'étudiants de Médine", duration: "19 MIN" },
    { id: "FaTx-0-vNQ8", title: "Podcast : Le Riba", sheikh: "Collectif d'étudiants de Médine", duration: "1H14" },
    { id: "hrYcASYhhKc", title: "Podcast : Le Tawhid", sheikh: "Collectif d'étudiants de Médine", duration: "1H15" },
    { id: "xdhIZG_68N4", title: "L'insouciance due aux réseaux sociaux", sheikh: "Collectif d'étudiants de Médine", duration: "11 MIN" },
    { id: "G7V3WpnwC-w", title: "Les épreuves et le bonheur", sheikh: "Collectif d'étudiants de Médine", duration: "13 MIN" },
    { id: "4lJV5HK1oa0", title: "Le Coran est une source de bonheur", sheikh: "Collectif d'étudiants de Médine", duration: "9 MIN" },
    { id: "DoiLJw2zEfk", title: "Adorer Allah pour une vie épanouie", sheikh: "Collectif d'étudiants de Médine", duration: "17 MIN" },
    { id: "kPTZvKl0joo", title: "Le patient possédé par un Djinn", sheikh: "Collectif d'étudiants de Médine", duration: "21 MIN" },
    { id: "Maj-PJdigZI", title: "Podcast : Djinns et Possession", sheikh: "Collectif d'étudiants de Médine", duration: "1H49" },
    { id: "aSEtsBcYUSU", title: "Le paradis sur terre", sheikh: "Collectif d'étudiants de Médine", duration: "8 MIN" },
    { id: "LlTtU-dcADg", title: "Podcast : Le Paradis sur Terre", sheikh: "Collectif d'étudiants de Médine", duration: "1H07" },
    { id: "JJeyHjupY88", title: "Les Djinns sont de véritables créatures", sheikh: "Collectif d'étudiants de Médine", duration: "14 MIN" },
    { id: "0ge9t486-4E", title: "Podcast : Le Monde des Djinns", sheikh: "Collectif d'étudiants de Médine", duration: "51 MIN" },
    { id: "-0OcaFV_9Co", title: "Prendre conscience du bienfait d'Allah", sheikh: "Collectif d'étudiants de Médine", duration: "10 MIN" },
    { id: "8-avm5nBMdQ", title: "Réformer sa personne par la prière", sheikh: "Collectif d'étudiants de Médine", duration: "15 MIN" },
    { id: "AQWfndVl8-w", title: "Ce qu'il restera au serviteur après Ramadan", sheikh: "Collectif d'étudiants de Médine", duration: "12 MIN" },
    { id: "U1XeJKbvcrI", title: "Podcast : Ramadan", sheikh: "Collectif d'étudiants de Médine", duration: "1H58" }
  ];

  var _currentPodIdx = 0;
  var _preloadedPodIframe = null;

  function getPodOfDay() {
    var start = new Date(2026, 2, 1);
    var now = new Date();
    var days = Math.floor((now - start) / 86400000);
    return days % PODCAST_LIST.length;
  }

  function loadPodAtIndex(idx) {
    _currentPodIdx = idx;
    var v = PODCAST_LIST[idx];
    $("pod-title").textContent = v.title;
    $("pod-meta").textContent = v.sheikh + "  \u00b7  " + v.duration;
    $("pod-thumb-img").src = "https://img.youtube.com/vi/" + v.id + "/hqdefault.jpg";
    $("pod-thumb-state").classList.remove("hidden");
    $("pod-iframe-state").classList.add("hidden");
    $("pod-iframe-state").innerHTML = "";
    var scrollEl = $("pod-scroll");
    if (scrollEl) scrollEl.scrollTop = 0;
  }

  function playCurrentPod() {
    var v = PODCAST_LIST[_currentPodIdx];
    // Show iframe player via hosted proxy (fixes YouTube embed in WKWebView)
    $("pod-thumb-state").classList.add("hidden");
    $("pod-iframe-state").classList.remove("hidden");
    var iframeWrap = $("pod-iframe-state");
    iframeWrap.innerHTML = "";
    var iframe = document.createElement("iframe");
    iframe.src = "https://tmshparis.github.io/qurani-player/?v=" + v.id;
    iframe.setAttribute("allow", "autoplay; encrypted-media; fullscreen; picture-in-picture");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.style.cssText = "width:100%;height:100%;border:none;";
    iframeWrap.appendChild(iframe);
  }

  function renderPodUpNextList(startIdx) {
    var list = $("pod-upnext-list");
    if (!list) return;
    list.innerHTML = "";
    for (var i = 1; i < PODCAST_LIST.length; i++) {
      var idx = (startIdx + i) % PODCAST_LIST.length;
      var v = PODCAST_LIST[idx];
      var card = document.createElement("div");
      card.className = "video-upnext-card";
      card.innerHTML = '<div class="video-upnext-thumb" style="background-image:url(\'https://img.youtube.com/vi/' + v.id + '/mqdefault.jpg\')"></div>' +
        '<div class="video-upnext-info"><p class="video-upnext-title">' + v.title + '</p>' +
        '<p class="video-upnext-meta">' + v.sheikh + '  \u00b7  ' + v.duration + '</p></div>';
      (function(cardIdx) {
        card.addEventListener("click", function() {
          loadPodAtIndex(cardIdx);
          renderPodUpNextList(cardIdx);
        });
      })(idx);
      list.appendChild(card);
    }
  }

  function openPodcastOverlay() {
    var idx = getPodOfDay();
    loadPodAtIndex(idx);
    renderPodUpNextList(idx);
    var backBtn = $("pod-back-center");
    if (backBtn) backBtn.classList.remove("visible");
    $("podcast-overlay").classList.remove("hidden");
  }

  function closePodcastOverlay() {
    $("pod-iframe-state").innerHTML = "";
    $("pod-thumb-state").classList.remove("hidden");
    $("pod-iframe-state").classList.add("hidden");
    $("podcast-overlay").classList.add("hidden");
    var backBtn = $("pod-back-center");
    if (backBtn) backBtn.classList.remove("visible");
  }

  // ================================================================
  //  MOI TAB — Profile
  // ================================================================
  function initMoiTab() {
    // Favoris → open existing bookmarks overlay
    var moiFav = $("moi-favoris");
    if (moiFav) moiFav.addEventListener("click", function() {
      renderBookmarksList();
      $("bookmarks-overlay").classList.remove("hidden");
    });

    // Notes → open notes overlay
    var moiNotes = $("moi-notes");
    if (moiNotes) moiNotes.addEventListener("click", function() {
      openNotesOverlay();
    });

    // Khatms → open khatms history overlay
    var moiKhatms = $("moi-khatms");
    if (moiKhatms) moiKhatms.addEventListener("click", function() {
      openMoiKhatmsOverlay();
    });

    // Statistiques
    var moiStats = $("moi-stats");
    if (moiStats) moiStats.addEventListener("click", openStatsOverlay);
    var statsClose = $("stats-close");
    if (statsClose) statsClose.addEventListener("click", function() {
      $("stats-overlay").classList.add("hidden");
    });

    // Vidéos → open videos overlay
    var moiVideos = $("moi-videos");
    if (moiVideos) moiVideos.addEventListener("click", function() {
      openVideosOverlay();
    });

    // Video play button → load iframe with autoplay
    var videoPlayBtn = $("video-play-btn");
    if (videoPlayBtn) videoPlayBtn.addEventListener("click", function() {
      playCurrentVideo();
    });

    // Videos close
    var videosClose = $("videos-close");
    if (videosClose) videosClose.addEventListener("click", function() {
      closeVideosOverlay();
    });
    var videoTopBack = $("video-top-back");
    if (videoTopBack) videoTopBack.addEventListener("click", function() {
      closeVideosOverlay();
    });

    // Videos back button — show on scroll, hide at top
    var videosScroll = $("videos-scroll");
    var videoBackBtn = $("video-back-center");
    if (videosScroll && videoBackBtn) {
      videosScroll.addEventListener("scroll", function() {
        if (videosScroll.scrollTop > 80) {
          videoBackBtn.classList.add("visible");
        } else {
          videoBackBtn.classList.remove("visible");
        }
      });
    }

    // Podcast → open podcast overlay
    var moiPod = $("moi-podcast");
    if (moiPod) moiPod.addEventListener("click", function() {
      openPodcastOverlay();
    });

    // Podcast play button
    var podPlayBtn = $("pod-play-btn");
    if (podPlayBtn) podPlayBtn.addEventListener("click", function() {
      playCurrentPod();
    });

    // Podcast close
    var podClose = $("pod-close");
    if (podClose) podClose.addEventListener("click", function() {
      closePodcastOverlay();
    });
    var podTopBack = $("pod-top-back");
    if (podTopBack) podTopBack.addEventListener("click", function() {
      closePodcastOverlay();
    });

    // Podcast back button — show on scroll
    var podScroll = $("pod-scroll");
    var podBackBtn = $("pod-back-center");
    if (podScroll && podBackBtn) {
      podScroll.addEventListener("scroll", function() {
        if (podScroll.scrollTop > 80) {
          podBackBtn.classList.add("visible");
        } else {
          podBackBtn.classList.remove("visible");
        }
      });
    }

    // IslamSounnah → open overlay with random prayer bg
    var _isPrayerImages = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,37,38,39,41,42,43,44,45,47,48,49,50,51];
    var moiIs = $("moi-islamsounnah");
    if (moiIs) moiIs.addEventListener("click", function() {
      var idx = _isPrayerImages[Math.floor(Math.random() * _isPrayerImages.length)];
      var bg = $("is-bg");
      if (bg) bg.style.backgroundImage = "url('img/prayer/" + idx + ".jpg')";
      $("islamsounnah-overlay").classList.remove("hidden");
    });

    // IslamSounnah close
    var isClose = $("islamsounnah-close");
    if (isClose) isClose.addEventListener("click", function() {
      $("islamsounnah-overlay").classList.add("hidden");
    });

    // Ayati → open existing shazam overlay
    var moiAyati = $("moi-ayati");
    if (moiAyati) moiAyati.addEventListener("click", function() {
      openShazamOverlay();
    });

    // Contact → open contact form overlay
    var moiHeritage = $("moi-heritage");
    if (moiHeritage) moiHeritage.addEventListener("click", openHeritageOverlay);
    var moiTestament = $("moi-testament");
    if (moiTestament) moiTestament.addEventListener("click", openTestamentOverlay);
    var moiZakat = $("moi-zakat");
    if (moiZakat) moiZakat.addEventListener("click", openZakatOverlay);

    var moiContact = $("moi-contact");
    if (moiContact) moiContact.addEventListener("click", openDuaContact);

    // IslamSounnah button → open promo site in-app
    var islamSounnahBtn = $("moi-islamsounnah-btn");
    if (islamSounnahBtn) islamSounnahBtn.addEventListener("click", function() {
      var url = "https://app.islamsounnah.com/app";
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Browser) {
        window.Capacitor.Plugins.Browser.open({ url: url, presentationStyle: "popover" });
      } else {
        window.open(url, "_blank");
      }
    });

    // Settings button → open Behold-style settings overlay
    var settingsBtn = $("moi-settings-btn");
    if (settingsBtn) settingsBtn.addEventListener("click", function() {
      $("moi-settings-overlay").classList.remove("hidden");
      var bg = $("moi-settings-hero-bg");
      if (bg && PRAYER_IMGS && PRAYER_IMGS.length) {
        var idx = Math.floor(Math.random() * PRAYER_IMGS.length);
        bg.style.backgroundImage = "url('img/prayer/" + PRAYER_IMGS[idx] + "')";
      }
    });

    // Moi settings items
    var setBack = $("moi-settings-back");
    if (setBack) setBack.addEventListener("click", function() {
      $("moi-settings-overlay").classList.add("hidden");
    });
    var setAbout = $("moi-set-about");
    if (setAbout) setAbout.addEventListener("click", function() {
      $("about-overlay").classList.remove("hidden");
    });
    var setHelp = $("moi-set-help");
    if (setHelp) setHelp.addEventListener("click", function() {
      $("help-overlay").classList.remove("hidden");
    });
    var setMethod = $("moi-set-method");
    if (setMethod) setMethod.addEventListener("click", function() {
      $("method-overlay").classList.remove("hidden");
    });
    // Method overlay close
    var methodClose = $("method-close");
    if (methodClose) methodClose.addEventListener("click", function() {
      $("method-overlay").classList.add("hidden");
    });

    // Khatms overlay close
    var khatmsClose = $("moi-khatms-close");
    if (khatmsClose) khatmsClose.addEventListener("click", function() {
      $("moi-khatms-overlay").classList.add("hidden");
    });

    // Notes overlay close
    var notesClose = $("notes-close");
    if (notesClose) notesClose.addEventListener("click", function() {
      $("notes-overlay").classList.add("hidden");
    });

    // Heritage close
    var heritageClose = $("heritage-close");
    if (heritageClose) heritageClose.addEventListener("click", function() {
      $("heritage-overlay").classList.add("hidden");
    });

    // Testament close
    var testamentClose = $("testament-close");
    if (testamentClose) testamentClose.addEventListener("click", function() {
      $("testament-overlay").classList.add("hidden");
    });

    // Zakat close
    var zakatClose = $("zakat-close");
    if (zakatClose) zakatClose.addEventListener("click", function() {
      $("zakat-overlay").classList.add("hidden");
    });

    // Testament document viewer — close + print
    var tdvClose = $("tdv-close-btn");
    if (tdvClose) tdvClose.addEventListener("click", function() {
      $("testament-doc-viewer").classList.add("hidden");
    });
    var tdvPrint = $("tdv-print-btn");
    if (tdvPrint) tdvPrint.addEventListener("click", function() { window.print(); });

    // Initial count refresh
    refreshMoiCounts();
  }

  // ============================================================
  // HERITAGE — Calculateur Faraidh
  // ============================================================

  var _heritageGender = "m"; // m = homme, f = femme

  var HERITAGE_HEIRS = [
    { id: "epoux",    label: "Époux",                  onlyFor: "f" },
    { id: "epouse",   label: "Épouse(s)",               onlyFor: "m", maxCount: 4 },
    { id: "fils",     label: "Fils",                    onlyFor: null },
    { id: "filles",   label: "Filles",                  onlyFor: null },
    { id: "fils_fils",  label: "Fils du fils (petit-fils)", onlyFor: null },
    { id: "filles_fils", label: "Fille du fils (petite-fille)", onlyFor: null },
    { id: "pere",     label: "Père",                    onlyFor: null, maxCount: 1 },
    { id: "mere",     label: "Mère",                    onlyFor: null, maxCount: 1 },
    { id: "gd_pere",  label: "Grand-père paternel",     onlyFor: null, maxCount: 1 },
    { id: "gd_mere_p", label: "Grand-mère paternelle",  onlyFor: null, maxCount: 1 },
    { id: "gd_mere_m", label: "Grand-mère maternelle",  onlyFor: null, maxCount: 1 },
    { id: "fr_germain", label: "Frère germain",         onlyFor: null },
    { id: "sr_germaine", label: "Sœur germaine",        onlyFor: null },
    { id: "fr_consanguin", label: "Frère consanguin",   onlyFor: null },
    { id: "sr_consanguine", label: "Sœur consanguine",  onlyFor: null },
    { id: "fr_uterin", label: "Frère utérin",           onlyFor: null },
    { id: "sr_uterine", label: "Sœur utérine",          onlyFor: null }
  ];

  var _heirCounts = {};

  function openHeritageOverlay() {
    _heritageGender = "m";
    _heirCounts = {};
    $("heritage-overlay").classList.remove("hidden");
    renderHeritageHeirsGrid();
    updateHeritageGenderUI();
    calcAndRenderHeritage();

    var btnM = $("heritage-gender-m");
    var btnF = $("heritage-gender-f");
    if (btnM) btnM.onclick = function() {
      _heritageGender = "m";
      updateHeritageGenderUI();
      renderHeritageHeirsGrid();
      calcAndRenderHeritage();
    };
    if (btnF) btnF.onclick = function() {
      _heritageGender = "f";
      updateHeritageGenderUI();
      renderHeritageHeirsGrid();
      calcAndRenderHeritage();
    };
    var amountInput = $("heritage-amount");
    if (amountInput) amountInput.oninput = calcAndRenderHeritage;
  }

  function updateHeritageGenderUI() {
    var btnM = $("heritage-gender-m"), btnF = $("heritage-gender-f");
    if (!btnM || !btnF) return;
    if (_heritageGender === "m") {
      btnM.classList.add("active"); btnF.classList.remove("active");
    } else {
      btnF.classList.add("active"); btnM.classList.remove("active");
    }
  }

  function renderHeritageHeirsGrid() {
    var grid = $("heritage-heirs-grid");
    if (!grid) return;
    grid.innerHTML = "";
    HERITAGE_HEIRS.forEach(function(heir) {
      if (heir.onlyFor && heir.onlyFor !== _heritageGender) return;
      // epoux uniquement si défunt est femme, epouse si homme
      var count = _heirCounts[heir.id] || 0;
      var row = document.createElement("div");
      row.className = "heritage-heir-row";
      row.dataset.heirid = heir.id;
      row.innerHTML =
        '<span class="heritage-heir-label">' + heir.label + '</span>' +
        '<div class="heritage-heir-counter">' +
        '<button class="heritage-counter-btn" data-action="minus" data-heirid="' + heir.id + '">−</button>' +
        '<span class="heritage-counter-val" id="hc-' + heir.id + '">' + count + '</span>' +
        '<button class="heritage-counter-btn" data-action="plus" data-heirid="' + heir.id + '">+</button>' +
        '</div>';
      grid.appendChild(row);
    });
    grid.onclick = function(e) {
      var btn = e.target.closest("[data-action]");
      if (!btn) return;
      var id = btn.dataset.heirid;
      var heir = HERITAGE_HEIRS.filter(function(h) { return h.id === id; })[0];
      var max = (heir && heir.maxCount) ? heir.maxCount : 20;
      if (btn.dataset.action === "plus") {
        _heirCounts[id] = Math.min((_heirCounts[id] || 0) + 1, max);
      } else {
        _heirCounts[id] = Math.max((_heirCounts[id] || 0) - 1, 0);
      }
      var val = document.getElementById("hc-" + id);
      if (val) val.textContent = _heirCounts[id] || 0;
      calcAndRenderHeritage();
    };
  }

  // ---- Faraidh engine (fractions exactes) ----
  function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
  function frac(n, d) { if (d === 0) return { n: 0, d: 1 }; var g = gcd(Math.abs(n), Math.abs(d)); return { n: n / g, d: d / g }; }
  function addF(a, b) { return frac(a.n * b.d + b.n * a.d, a.d * b.d); }
  function subF(a, b) { return frac(a.n * b.d - b.n * a.d, a.d * b.d); }
  function mulF(a, b) { return frac(a.n * b.n, a.d * b.d); }
  function cmpF(a, b) { return a.n * b.d - b.n * a.d; } // >0 a>b
  function fracStr(f) { if (f.d === 1) return "" + f.n; return f.n + "/" + f.d; }
  function pctStr(f) { return (f.n / f.d * 100).toFixed(1) + "%"; }

  function calcHeritageShares(h, gender) {
    // h = object with counts per heir id
    // Returns array of { label, frac, blocked, blockReason }
    var c = function(id) { return (h[id] || 0); };

    var hasFils    = c("fils") > 0;
    var hasFilles  = c("filles") > 0;
    var hasFilsFils  = c("fils_fils") > 0;
    var hasFillesFils = c("filles_fils") > 0;
    var hasPere    = c("pere") > 0;
    var hasMere    = c("mere") > 0;
    var hasGdPere  = c("gd_pere") > 0;
    var hasGdMereP = c("gd_mere_p") > 0;
    var hasGdMereM = c("gd_mere_m") > 0;
    var hasFrG     = c("fr_germain") > 0;
    var hasSrG     = c("sr_germaine") > 0;
    var hasFrC     = c("fr_consanguin") > 0;
    var hasSrC     = c("sr_consanguine") > 0;
    var hasFrU     = c("fr_uterin") > 0;
    var hasSrU     = c("sr_uterine") > 0;

    var hasEnfants = hasFils || hasFilles;
    var hasDescendants = hasEnfants || hasFilsFils || hasFillesFils;
    var hasFrGouC  = hasFrG || hasSrG || hasFrC || hasSrC;
    var nbFrGouC   = c("fr_germain") + c("sr_germaine") + c("fr_consanguin") + c("sr_consanguine");
    var nbFrU      = c("fr_uterin") + c("sr_uterine");
    var nb2FreresSoeurs = (c("fr_germain") + c("sr_germaine") + c("fr_consanguin") + c("sr_consanguine") + c("fr_uterin") + c("sr_uterine")) >= 2;

    var results = [];
    var totalFard = { n: 0, d: 1 };
    var asabaPool = []; // héritiers asaba

    function addResult(label, count, share, blocked, reason, expl) {
      results.push({ label: label, count: count, share: blocked ? { n: 0, d: 1 } : share, blocked: !!blocked, reason: reason || "", explanation: expl || "" });
      if (!blocked && share) totalFard = addF(totalFard, mulF(share, frac(1, 1)));
    }

    // ---- ÉPOUX / ÉPOUSE ----
    if (gender === "f" && c("epoux") > 0) {
      var shareEpoux = hasDescendants ? frac(1, 4) : frac(1, 2);
      addResult("Époux", 1, shareEpoux, false, "", hasDescendants ? "reçoit 1/4 en présence de descendants" : "reçoit 1/2 en l'absence de descendants");
    }
    if (gender === "m" && c("epouse") > 0) {
      var nbEpouses = c("epouse");
      var shareEpousesTot = hasDescendants ? frac(1, 8) : frac(1, 4);
      addResult("Épouse" + (nbEpouses > 1 ? "s ×" + nbEpouses : ""), nbEpouses, shareEpousesTot, false, "", hasDescendants ? "reçoivent 1/8 en présence de descendants" : "reçoivent 1/4 en l'absence de descendants");
    }

    // ---- MÈRE ----
    if (hasMere) {
      var shareMere;
      if (hasDescendants || nb2FreresSoeurs) {
        shareMere = frac(1, 6);
      } else {
        shareMere = frac(1, 3);
      }
      addResult("Mère", 1, shareMere, false, "", (hasDescendants || nb2FreresSoeurs) ? "reçoit 1/6 — présence de descendants ou 2+ frères/sœurs" : "reçoit 1/3 — part fixe en l'absence de descendants");
    }

    // ---- GRAND-MÈRE PATERNELLE ----
    if (hasGdMereP) {
      var blocGdMereP = hasMere || hasPere;
      addResult("Grand-mère paternelle", 1, frac(1, 6), blocGdMereP, blocGdMereP ? (hasMere ? "bloquée par la mère" : "bloquée par le père") : "", blocGdMereP ? "" : "reçoit 1/6 en l'absence de la mère et du père");
    }

    // ---- GRAND-MÈRE MATERNELLE ----
    if (hasGdMereM) {
      var blocGdMereM = hasMere;
      addResult("Grand-mère maternelle", 1, frac(1, 6), blocGdMereM, blocGdMereM ? "bloquée par la mère" : "", blocGdMereM ? "" : "reçoit 1/6 en l'absence de la mère");
    }

    // ---- PÈRE ----
    if (hasPere) {
      if (hasFils || hasFilsFils) {
        // Père : fard 1/6, pas d'asaba
        addResult("Père", 1, frac(1, 6), false, "", "reçoit 1/6 (fard) en présence de fils");
      } else if (hasFilles || hasFillesFils) {
        // Père : fard 1/6 + asaba (résidu)
        addResult("Père", 1, frac(1, 6), false, "", "reçoit 1/6 + le résidu en présence de filles sans fils");
        asabaPool.push({ label: "Père (résidu)", weight: 1, explanation: "résidu après la part fixe de 1/6" });
      } else {
        // Père : asaba pur
        asabaPool.push({ label: "Père", weight: 1, explanation: "hérite du résidu (عصبة) en l'absence de descendants" });
      }
    }

    // ---- GRAND-PÈRE PATERNEL (bloqué par père) ----
    if (hasGdPere) {
      var blocGdPere = hasPere;
      if (!blocGdPere) {
        if (hasFils || hasFilsFils) {
          addResult("Grand-père paternel", 1, frac(1, 6), false, "", "reçoit 1/6 en présence de fils, en l'absence du père");
        } else if (hasFilles || hasFillesFils) {
          addResult("Grand-père paternel", 1, frac(1, 6), false, "", "reçoit 1/6 + le résidu en présence de filles, en l'absence du père");
          asabaPool.push({ label: "Grand-père (résidu)", weight: 1, explanation: "résidu après la part fixe de 1/6" });
        } else {
          asabaPool.push({ label: "Grand-père paternel", weight: 1, explanation: "hérite du résidu (عصبة) en l'absence du père et des descendants" });
        }
      } else {
        addResult("Grand-père paternel", 1, null, true, "bloqué par le père", "");
      }
    }

    // ---- FILS ----
    if (hasFils) {
      asabaPool.push({ label: "Fils ×" + c("fils"), count: c("fils"), weight: 2, isFils: true, explanation: "héritent du résidu (عصبة) — un fils reçoit le double d'une fille" });
    }

    // ---- FILLES ----
    if (hasFilles && !hasFils) {
      // Filles seules sans fils
      var shareFilles = c("filles") === 1 ? frac(1, 2) : frac(2, 3);
      addResult("Filles ×" + c("filles"), c("filles"), shareFilles, false, "", c("filles") === 1 ? "reçoit 1/2 — une fille unique sans fils" : "reçoivent 2/3 — " + c("filles") + " filles sans fils");
    } else if (hasFilles && hasFils) {
      // Filles avec fils → asaba (2:1)
      asabaPool.push({ label: "Filles ×" + c("filles"), count: c("filles"), weight: 1, isFilles: true, explanation: "héritent du résidu avec les fils — une fille reçoit la moitié d'un fils" });
    }

    // ---- FILS DU FILS ----
    if (hasFilsFils && !hasFils) {
      asabaPool.push({ label: "Fils du fils ×" + c("fils_fils"), count: c("fils_fils"), weight: 2, isFils: true, explanation: "héritent du résidu (عصبة) en l'absence de fils" });
    } else if (hasFilsFils && hasFils) {
      addResult("Fils du fils ×" + c("fils_fils"), c("fils_fils"), null, true, "bloqué par les fils", "");
    }

    // ---- FILLE DU FILS ----
    if (hasFillesFils) {
      if (hasFils) {
        addResult("Fille du fils ×" + c("filles_fils"), c("filles_fils"), null, true, "bloquée par les fils", "");
      } else if (hasFilsFils) {
        asabaPool.push({ label: "Fille du fils ×" + c("filles_fils"), count: c("filles_fils"), weight: 1, isFilles: true, explanation: "hérite du résidu avec le fils du fils (عصبة)" });
      } else if (hasFilles) {
        var partRestante = subF(frac(2, 3), results.filter(function(r){ return r.label.indexOf("Filles") === 0; })[0] ? results.filter(function(r){ return r.label.indexOf("Filles") === 0; })[0].share : frac(0,1));
        if (cmpF(partRestante, frac(0,1)) > 0) {
          addResult("Fille du fils ×" + c("filles_fils"), c("filles_fils"), frac(1, 6), false, "", "reçoit 1/6 pour compléter le plafond des 2/3 avec les filles");
        } else {
          addResult("Fille du fils ×" + c("filles_fils"), c("filles_fils"), null, true, "bloquée (plafond 2/3 atteint par les filles)", "");
        }
      } else {
        var nFdf = c("filles_fils");
        var shareFdf = nFdf === 1 ? frac(1, 2) : frac(2, 3);
        addResult("Fille du fils ×" + nFdf, nFdf, shareFdf, false, "", nFdf === 1 ? "reçoit 1/2 — seule en l'absence de fils et fils du fils" : "reçoivent 2/3 en l'absence de fils et fils du fils");
      }
    }

    // ---- FRÈRES/SŒURS UTÉRINS ----
    if (hasFrU || hasSrU) {
      var blocUterin = hasDescendants || hasPere || hasGdPere;
      if (blocUterin) {
        if (hasFrU) addResult("Frère utérin ×" + c("fr_uterin"), c("fr_uterin"), null, true, "bloqué par les descendants / père / grand-père", "");
        if (hasSrU) addResult("Sœur utérine ×" + c("sr_uterine"), c("sr_uterine"), null, true, "bloquée par les descendants / père / grand-père", "");
      } else {
        var nbU = c("fr_uterin") + c("sr_uterine");
        var shareUterinTot = nbU === 1 ? frac(1, 6) : frac(1, 3);
        var explUterin = nbU === 1 ? "reçoit 1/6 — seul héritier utérin" : "reçoivent 1/3 à partager entre " + nbU + " frères/sœurs utérins";
        if (hasFrU) addResult("Frère utérin ×" + c("fr_uterin"), c("fr_uterin"), mulF(shareUterinTot, frac(c("fr_uterin"), nbU)), false, "", explUterin);
        if (hasSrU) addResult("Sœur utérine ×" + c("sr_uterine"), c("sr_uterine"), mulF(shareUterinTot, frac(c("sr_uterine"), nbU)), false, "", explUterin);
      }
    }

    // ---- FRÈRES/SŒURS GERMAINS ----
    if (hasFrG || hasSrG) {
      var blocGermain = hasDescendants || hasPere;
      if (blocGermain) {
        if (hasFrG) addResult("Frère germain ×" + c("fr_germain"), c("fr_germain"), null, true, "bloqué par les descendants / père", "");
        if (hasSrG) addResult("Sœur germaine ×" + c("sr_germaine"), c("sr_germaine"), null, true, "bloquée par les descendants / père", "");
      } else {
        if (hasFrG) {
          asabaPool.push({ label: "Frère germain ×" + c("fr_germain"), count: c("fr_germain"), weight: 2, explanation: "hérite du résidu (عصبة) — un frère reçoit le double d'une sœur" });
          if (hasSrG) asabaPool.push({ label: "Sœur germaine ×" + c("sr_germaine"), count: c("sr_germaine"), weight: 1, explanation: "hérite du résidu avec le frère germain — une sœur reçoit la moitié d'un frère" });
        } else {
          // Sœurs germaines seules
          if (!hasGdPere) {
            var nbSrG = c("sr_germaine");
            var shareSrG = nbSrG === 1 ? frac(1, 2) : frac(2, 3);
            addResult("Sœur germaine ×" + nbSrG, nbSrG, shareSrG, false, "", nbSrG === 1 ? "reçoit 1/2 — une sœur germaine unique" : "reçoivent 2/3 — " + nbSrG + " sœurs germaines");
          }
        }
      }
    }

    // ---- FRÈRES/SŒURS CONSANGUINS (bloqués par frère germain) ----
    if (hasFrC || hasSrC) {
      var blocConsanguin = hasDescendants || hasPere || hasFrG;
      if (blocConsanguin) {
        if (hasFrC) addResult("Frère consanguin ×" + c("fr_consanguin"), c("fr_consanguin"), null, true, "bloqué par les descendants / père / frère germain", "");
        if (hasSrC) addResult("Sœur consanguine ×" + c("sr_consanguine"), c("sr_consanguine"), null, true, "bloquée par les descendants / père / frère germain", "");
      } else {
        if (hasFrC) {
          asabaPool.push({ label: "Frère consanguin ×" + c("fr_consanguin"), count: c("fr_consanguin"), weight: 2, explanation: "hérite du résidu (عصبة) en l'absence de frère germain" });
          if (hasSrC) asabaPool.push({ label: "Sœur consanguine ×" + c("sr_consanguine"), count: c("sr_consanguine"), weight: 1, explanation: "hérite du résidu avec le frère consanguin — une sœur reçoit la moitié d'un frère" });
        } else {
          var nbSrC = c("sr_consanguine");
          if (hasSrG) {
            // Sœur consanguine avec sœur germaine : 1/6 de complément si total < 2/3
            addResult("Sœur consanguine ×" + nbSrC, nbSrC, frac(1, 6), false, "", "reçoit 1/6 pour compléter le plafond des 2/3 avec la sœur germaine");
          } else {
            var shareSrC = nbSrC === 1 ? frac(1, 2) : frac(2, 3);
            addResult("Sœur consanguine ×" + nbSrC, nbSrC, shareSrC, false, "", nbSrC === 1 ? "reçoit 1/2 — une sœur consanguine unique" : "reçoivent 2/3 — " + nbSrC + " sœurs consanguines");
          }
        }
      }
    }

    // ---- CALCUL ASABA (résidu) ----
    if (asabaPool.length > 0) {
      var residue = subF(frac(1, 1), totalFard);
      if (cmpF(residue, frac(0, 1)) > 0) {
        // Calculer poids total
        var totalWeight = 0;
        asabaPool.forEach(function(a) {
          totalWeight += (a.count || 1) * a.weight;
        });
        asabaPool.forEach(function(a) {
          var cnt = a.count || 1;
          var shareA = mulF(residue, frac(cnt * a.weight, totalWeight));
          results.push({ label: a.label, count: cnt, share: shareA, blocked: false, reason: "", isAsaba: true, explanation: a.explanation || "" });
        });
      }
    }

    // ---- AWL : si total > 1, réduction proportionnelle ----
    var total = { n: 0, d: 1 };
    results.forEach(function(r) { if (!r.blocked) total = addF(total, r.share); });
    if (cmpF(total, frac(1, 1)) > 0) {
      results.forEach(function(r) {
        if (!r.blocked) r.share = mulF(r.share, frac(total.d, total.n));
      });
      total = { n: 1, d: 1 };
    }

    // ---- RADD : si total < 1 et pas d'asaba ni d'époux ----
    var hasEpoux = (gender === "f" && c("epoux") > 0) || (gender === "m" && c("epouse") > 0);
    var totalAfterAsaba = { n: 0, d: 1 };
    results.forEach(function(r) { if (!r.blocked) totalAfterAsaba = addF(totalAfterAsaba, r.share); });
    if (cmpF(totalAfterAsaba, frac(1, 1)) < 0 && asabaPool.length === 0) {
      var residueRadd = subF(frac(1, 1), totalAfterAsaba);
      // Radd aux héritiers fard sauf époux/épouse
      var raddEligible = results.filter(function(r) {
        return !r.blocked && !r.label.startsWith("Épou");
      });
      if (raddEligible.length > 0) {
        var raddTotal = { n: 0, d: 1 };
        raddEligible.forEach(function(r) { raddTotal = addF(raddTotal, r.share); });
        raddEligible.forEach(function(r) {
          var raddPart = mulF(residueRadd, mulF(r.share, frac(raddTotal.d, raddTotal.n)));
          r.share = addF(r.share, raddPart);
        });
      }
    }

    return results;
  }

  function calcAndRenderHeritage() {
    var results = calcHeritageShares(_heirCounts, _heritageGender);
    var section = $("heritage-results-section");
    var container = $("heritage-results");
    if (!section || !container) return;

    var hasAny = Object.keys(_heirCounts).some(function(k) { return _heirCounts[k] > 0; });
    if (!hasAny) { section.classList.add("hidden"); return; }
    section.classList.remove("hidden");

    var amountVal = parseFloat($("heritage-amount") ? $("heritage-amount").value : 0) || 0;
    var hasAsaba = results.some(function(r) { return !r.blocked && r.isAsaba; });
    var hasFard  = results.some(function(r) { return !r.blocked && !r.isAsaba; });

    var html = "";

    // Legend
    if (hasAsaba || hasFard) {
      html += '<div class="heritage-legend">';
      if (hasFard)  html += '<span class="heritage-legend-item"><span class="heritage-legend-dot heritage-legend-fard-dot"></span>Prescrite (فرض)</span>';
      if (hasAsaba) html += '<span class="heritage-legend-item"><span class="heritage-legend-dot heritage-legend-asaba-dot"></span>Résiduelle (عصبة)</span>';
      html += '</div>';
    }

    results.forEach(function(r) {
      if (r.blocked) {
        html += '<div class="heritage-result-row heritage-blocked">' +
          '<div class="heritage-result-main">' +
          '<span class="heritage-result-label">' + r.label + '</span>' +
          '<span class="heritage-result-blocked-reason">— ' + r.reason + '</span>' +
          '</div></div>';
      } else {
        var pctNum = r.share.n / r.share.d * 100;
        var pctFormatted = pctNum.toFixed(1) + "%";
        var fstr = fracStr(r.share);
        var amtStr = amountVal > 0 ? ' <span class="heritage-result-amount">· ' + Math.round(amountVal * r.share.n / r.share.d).toLocaleString("fr-FR") + ' €</span>' : "";
        var barClass = r.isAsaba ? "heritage-bar-asaba" : "heritage-bar-fard";
        var expl = r.explanation || "";
        html += '<div class="heritage-result-row">' +
          '<div class="heritage-result-main">' +
          '<span class="heritage-result-label">' + r.label + '</span>' +
          '<span class="heritage-result-share"><strong>' + fstr + '</strong> <span class="heritage-result-pct">(' + pctFormatted + ')</span>' + amtStr + '</span>' +
          '</div>' +
          '<div class="heritage-result-bar-track">' +
          '<div class="heritage-result-bar-fill ' + barClass + '" style="width:' + Math.min(pctNum, 100).toFixed(2) + '%"></div>' +
          '</div>' +
          (expl ? '<p class="heritage-result-explanation">' + expl + '</p>' : '') +
          '</div>';
      }
    });

    // Total line
    var tot = { n: 0, d: 1 };
    results.forEach(function(r) { if (!r.blocked) tot = addF(tot, r.share); });
    html += '<div class="heritage-result-total"><span>Total</span><span>' + (tot.n / tot.d * 100).toFixed(1) + '%</span></div>';
    container.innerHTML = html;

    // Wire share button
    var shareBtn = $("heritage-share-btn");
    if (shareBtn) {
      shareBtn.onclick = exportHeritagePDF;
      shareBtn.style.display = "";
    }
  }

  function exportHeritagePDF() {
    var results = calcHeritageShares(_heirCounts, _heritageGender);
    var amountVal = parseFloat($("heritage-amount") ? $("heritage-amount").value : 0) || 0;
    var genderLabel = _heritageGender === "m" ? "Homme" : "Femme";
    var today = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

    // Fill subtitle
    var sub = $("hpd-subtitle");
    if (sub) {
      var subText = "Défunt : " + genderLabel;
      if (amountVal > 0) subText += " — Succession : " + amountVal.toLocaleString("fr-FR") + " €";
      sub.textContent = subText;
    }
    var dateEl = $("hpd-date");
    if (dateEl) dateEl.textContent = today;

    // Build table
    var body = '<table class="hpd-table"><thead><tr><th>Héritier</th><th>Part</th><th>%</th>' +
      (amountVal > 0 ? '<th>Montant</th>' : '') + '</tr></thead><tbody>';
    results.forEach(function(r) {
      if (r.blocked) {
        body += '<tr class="hpd-blocked"><td colspan="' + (amountVal > 0 ? 4 : 3) + '">' + r.label + ' — ' + r.reason + '</td></tr>';
      } else {
        var pctNum = (r.share.n / r.share.d * 100).toFixed(1);
        var fstr = fracStr(r.share);
        var typeLabel = r.isAsaba ? "عصبة" : "فرض";
        body += '<tr><td>' + r.label + ' <span class="hpd-type">(' + typeLabel + ')</span></td><td>' + fstr + '</td><td>' + pctNum + '%</td>';
        if (amountVal > 0) body += '<td>' + Math.round(amountVal * r.share.n / r.share.d).toLocaleString("fr-FR") + ' €</td>';
        body += '</tr>';
      }
    });
    // Total
    var tot = { n: 0, d: 1 };
    results.forEach(function(r) { if (!r.blocked) tot = addF(tot, r.share); });
    body += '<tr class="hpd-total"><td>Total</td><td></td><td>' + (tot.n / tot.d * 100).toFixed(1) + '%</td>';
    if (amountVal > 0) body += '<td>' + Math.round(amountVal * tot.n / tot.d).toLocaleString("fr-FR") + ' €</td>';
    body += '</tr></tbody></table>';

    var bodyEl = $("hpd-body");
    if (bodyEl) bodyEl.innerHTML = body;

    // Show in doc viewer (reuse testament viewer)
    var printDoc = $("heritage-print-doc");
    var tdvDoc = $("tdv-doc");
    if (tdvDoc && printDoc) tdvDoc.innerHTML = printDoc.innerHTML;
    var viewer = $("testament-doc-viewer");
    if (viewer) {
      viewer.classList.remove("hidden");
      var scroll = viewer.querySelector(".tdv-scroll");
      if (scroll) scroll.scrollTop = 0;
    }

    // PDF share button
    var printBtn = $("tdv-print-btn");
    if (printBtn) {
      printBtn.textContent = "PARTAGER →";
      printBtn.onclick = function() { _htmlDocPDFAndShare("heritage-islamique.pdf", "Répartition de l'héritage"); };
      var closeBtn = $("tdv-close-btn");
      if (closeBtn) {
        closeBtn.onclick = function() {
          viewer.classList.add("hidden");
          printBtn.textContent = "PARTAGER →";
        };
      }
    }
  }

  // ============================================================
  // TESTAMENT — Générateur Wasiyya
  // ============================================================

  function openTestamentOverlay() {
    $("testament-overlay").classList.remove("hidden");
    var btn = $("testament-generate-btn");
    if (btn) btn.onclick = generateTestament;
    // Date input mask (auto-insert /)
    var ddnInput = $("t-ddn");
    if (ddnInput && !ddnInput._maskSet) {
      ddnInput._maskSet = true;
      ddnInput.addEventListener("input", function() {
        var v = this.value.replace(/[^\d]/g, "").slice(0, 8);
        if (v.length > 4) v = v.slice(0,2) + "/" + v.slice(2,4) + "/" + v.slice(4);
        else if (v.length > 2) v = v.slice(0,2) + "/" + v.slice(2);
        this.value = v;
      });
    }
  }

  function generateTestament() {
    var nom    = ($("t-nom") ? $("t-nom").value.trim() : "") || "_______________";
    var ddn    = ($("t-ddn") ? $("t-ddn").value : "") || "";
    var ville  = ($("t-ville") ? $("t-ville").value.trim() : "") || "_______________";
    var execNom = ($("t-exec-nom") ? $("t-exec-nom").value.trim() : "") || "_______________";
    var execRel = ($("t-exec-rel") ? $("t-exec-rel").value.trim() : "") || "";
    var tutNom  = ($("t-tut-nom") ? $("t-tut-nom").value.trim() : "");
    var tutRel  = ($("t-tut-rel") ? $("t-tut-rel").value.trim() : "");
    var dettes  = ($("t-dettes") ? $("t-dettes").value.trim() : "") || "Aucune dette connue à ce jour.";
    var legsBenef = ($("t-legs-benef") ? $("t-legs-benef").value.trim() : "");
    var legsDesc  = ($("t-legs-desc") ? $("t-legs-desc").value.trim() : "");
    var divers  = ($("t-divers") ? $("t-divers").value.trim() : "");

    // Format date (text input, use as-is)
    var ddnFmt = ddn || "";

    var today = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

    // Fill identity
    var idEl = $("tpd-identity");
    if (idEl) idEl.textContent = nom + (ddnFmt ? ", né(e) le " + ddnFmt : "") + (ville !== "_______________" ? " — " + ville : "");

    var villeEl = $("tpd-ville-sig");
    if (villeEl) villeEl.textContent = ville !== "_______________" ? ville : "_________";
    var dateEl = $("tpd-date-sig");
    if (dateEl) dateEl.textContent = today;

    // Build body
    var body = "";

    body += '<div class="tpd-section">';
    body += '<h2 class="tpd-section-title">I. EXÉCUTEUR TESTAMENTAIRE</h2>';
    body += '<p>Je désigne <strong>' + execNom + '</strong>' + (execRel ? ' (' + execRel + ')' : '') + ' comme exécuteur testamentaire de ce testament. Je lui confie la responsabilité de faire respecter mes volontés et de veiller à la distribution de mes biens conformément aux règles islamiques.</p>';
    body += '</div>';

    if (tutNom) {
      body += '<div class="tpd-section">';
      body += '<h2 class="tpd-section-title">II. TUTEUR DES ENFANTS MINEURS</h2>';
      body += '<p>Je désigne <strong>' + tutNom + '</strong>' + (tutRel ? ' (' + tutRel + ')' : '') + ' comme tuteur de mes enfants mineurs, en cas de décès de leurs deux parents.</p>';
      body += '</div>';
    }

    body += '<div class="tpd-section">';
    body += '<h2 class="tpd-section-title">' + (tutNom ? "III" : "II") + '. DETTES ET OBLIGATIONS</h2>';
    body += '<p>Je demande que les dettes suivantes soient remboursées en priorité, avant tout legs et avant toute distribution aux héritiers&nbsp;:</p>';
    body += '<p class="tpd-body-text">' + dettes.replace(/\n/g, "<br>") + '</p>';
    body += '</div>';

    var secNum = tutNom ? 4 : 3;
    body += '<div class="tpd-section">';
    body += '<h2 class="tpd-section-title">' + toRoman(secNum) + '. LEGS (dans la limite du tiers de la succession)</h2>';
    if (legsBenef) {
      body += '<p>Je lègue à <strong>' + legsBenef + '</strong> ce qui suit&nbsp;:</p>';
      body += '<p class="tpd-body-text">' + (legsDesc || "À préciser.").replace(/\n/g, "<br>") + '</p>';
      body += '<p><em>Ce legs ne doit pas dépasser le tiers (1/3) de ma succession nette, conformément à la Sunna du Prophète ﷺ.</em></p>';
    } else {
      body += '<p>Je ne désigne pas de legs particulier. La totalité de ma succession sera distribuée selon les règles islamiques du partage successoral (Faraidh).</p>';
    }
    body += '</div>';

    secNum++;
    if (divers) {
      body += '<div class="tpd-section">';
      body += '<h2 class="tpd-section-title">' + toRoman(secNum) + '. DISPOSITIONS PARTICULIÈRES</h2>';
      body += '<p class="tpd-body-text">' + divers.replace(/\n/g, "<br>") + '</p>';
      body += '</div>';
      secNum++;
    }

    body += '<div class="tpd-section">';
    body += '<h2 class="tpd-section-title">' + toRoman(secNum) + '. DISTRIBUTION DE LA SUCCESSION</h2>';
    body += '<p>Le reste de ma succession (après règlement des dettes et du legs) sera distribué entre mes héritiers légaux selon les règles islamiques du partage successoral (Faraidh), conformément au Coran et à la Sunna du Prophète ﷺ.</p>';
    body += '</div>';

    var bodyEl = $("tpd-body");
    if (bodyEl) bodyEl.innerHTML = body;

    // Show in-app document viewer
    var printDoc = $("testament-print-doc");
    var tdvDoc = $("tdv-doc");
    if (tdvDoc && printDoc) tdvDoc.innerHTML = printDoc.innerHTML;
    var viewer = $("testament-doc-viewer");
    if (viewer) {
      viewer.classList.remove("hidden");
      var scroll = viewer.querySelector(".tdv-scroll");
      if (scroll) scroll.scrollTop = 0;
    }

    // PDF share button
    var printBtn = $("tdv-print-btn");
    if (printBtn) {
      printBtn.textContent = "PARTAGER →";
      printBtn.onclick = function() { _htmlDocPDFAndShare("testament-islamique.pdf", "Testament islamique (Wasiyya)"); };
    }
  }

  function toRoman(n) {
    var vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
    var syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
    var r = "";
    vals.forEach(function(v, i) { while (n >= v) { r += syms[i]; n -= v; } });
    return r;
  }

  // ============================================================
  // ZAKAT — Calculateur de Zakat al-Mal
  // ============================================================

  var _zakatNisabMode = "or"; // "or" ou "argent"
  var ZAKAT_DATA_KEY    = "qurani_zakat_data";
  var ZAKAT_HISTORY_KEY = "qurani_zakat_history";
  var ZAKAT_NISAB_OR_GRAMS = 85;
  var ZAKAT_NISAB_ARGENT_GRAMS = 595;
  var ZAKAT_DEFAULT_PRIX_OR = 85; // €/g fallback
  var ZAKAT_DEFAULT_PRIX_ARGENT = 1; // €/g fallback
  var ZAKAT_RATE = 0.025; // 2.5%

  function gregorianToHijri(date) {
    try {
      var fmt = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
        day: "numeric", month: "long", year: "numeric"
      });
      var parts = fmt.formatToParts(date);
      var day = "", month = "", year = "";
      parts.forEach(function(p) {
        if (p.type === "day") day = p.value;
        if (p.type === "month") month = p.value;
        if (p.type === "year") year = p.value;
      });
      return { day: day, month: month, year: year, full: day + " " + month + " " + year + " هـ" };
    } catch (e) {
      return null;
    }
  }

  function hijriMonthName(date) {
    try {
      var fmt = new Intl.DateTimeFormat("fr-FR-u-ca-islamic-umalqura", {
        day: "numeric", month: "long", year: "numeric"
      });
      return fmt.format(date);
    } catch (e) {
      return "";
    }
  }

  function openZakatOverlay() {
    _zakatNisabMode = "or";
    $("zakat-overlay").classList.remove("hidden");

    // Restaurer les données sauvegardées
    _restoreZakatData();

    // Display current Hijri date
    var now = new Date();
    var hijri = gregorianToHijri(now);
    var hijriEl = $("zakat-hijri-date");
    var hijriLabel = $("zakat-hijri-label");
    if (hijriEl && hijri) hijriEl.textContent = hijri.full;
    if (hijriLabel) hijriLabel.textContent = hijriMonthName(now);

    // Set default gold price (seulement si pas de donnée restaurée)
    var prixInput = $("zakat-prix-gramme");
    if (prixInput && !prixInput.value) prixInput.value = ZAKAT_DEFAULT_PRIX_OR;

    // Restore saved hawl date
    var savedHawl = localStorage.getItem("qurani_zakat_hawl");
    var hawlInput = $("zakat-hawl-date");
    if (hawlInput && savedHawl) hawlInput.value = savedHawl;

    // Nisab toggle — refléter le mode restauré
    var btnOr = $("zakat-nisab-or");
    var btnAg = $("zakat-nisab-argent");
    if (btnOr && btnAg) {
      if (_zakatNisabMode === "argent") {
        btnAg.classList.add("active"); btnOr.classList.remove("active");
      } else {
        btnOr.classList.add("active"); btnAg.classList.remove("active");
      }
    }
    if (btnOr) btnOr.onclick = function() {
      _zakatNisabMode = "or";
      btnOr.classList.add("active"); btnAg.classList.remove("active");
      if (prixInput) prixInput.value = ZAKAT_DEFAULT_PRIX_OR;
      calcZakat();
    };
    if (btnAg) btnAg.onclick = function() {
      _zakatNisabMode = "argent";
      btnAg.classList.add("active"); btnOr.classList.remove("active");
      if (prixInput) prixInput.value = ZAKAT_DEFAULT_PRIX_ARGENT;
      calcZakat();
    };

    // Bind all inputs to recalculate
    var allInputs = document.querySelectorAll("#zakat-overlay input");
    allInputs.forEach(function(inp) {
      inp.oninput = calcZakat;
    });

    // Hawl date save
    if (hawlInput) {
      hawlInput.addEventListener("change", function() {
        if (this.value) localStorage.setItem("qurani_zakat_hawl", this.value);
      });
    }

    // Save button
    var saveBtn = $("zakat-save-btn");
    if (saveBtn) saveBtn.onclick = saveZakatFiche;

    // Render history
    renderZakatHistory();

    calcZakat();
  }

  function calcZakat() {
    // Nisab calculation
    var prixGramme = parseFloat(($("zakat-prix-gramme") || {}).value) || 0;
    var nisabGrams = _zakatNisabMode === "or" ? ZAKAT_NISAB_OR_GRAMS : ZAKAT_NISAB_ARGENT_GRAMS;
    var nisabValue = prixGramme * nisabGrams;

    var nisabEl = $("zakat-nisab-result");
    if (nisabEl) {
      var metalLabel = _zakatNisabMode === "or" ? "or" : "argent";
      nisabEl.innerHTML = '<span class="zakat-nisab-label">Nisab actuel</span>' +
        '<span class="zakat-nisab-value">' + nisabGrams + 'g ' + metalLabel + ' × ' + prixGramme.toFixed(2) + ' € = <strong>' + Math.round(nisabValue).toLocaleString("fr-FR") + ' €</strong></span>';
    }

    // Hawl status
    var hawlInput = $("zakat-hawl-date");
    var hawlStatus = $("zakat-hawl-status");
    var hawlComplete = true;
    if (hawlInput && hawlInput.value && hawlStatus) {
      var hawlStart = new Date(hawlInput.value);
      var now = new Date();
      // Lunar year ≈ 354.37 days
      var lunarYearMs = 354.37 * 24 * 60 * 60 * 1000;
      var hawlEnd = new Date(hawlStart.getTime() + lunarYearMs);
      var remaining = hawlEnd.getTime() - now.getTime();

      hawlStatus.classList.remove("hidden");
      if (remaining <= 0) {
        var hijriEnd = gregorianToHijri(hawlEnd);
        hawlStatus.innerHTML = '<span class="zakat-hawl-complete">✓ HAWL COMPLET</span>' +
          '<span class="zakat-hawl-detail">Le cycle lunaire est terminé. Votre Zakat est due.</span>';
        hawlComplete = true;
      } else {
        var daysLeft = Math.ceil(remaining / (24 * 60 * 60 * 1000));
        var pct = Math.min(100, ((now - hawlStart) / lunarYearMs) * 100);
        hawlStatus.innerHTML =
          '<span class="zakat-hawl-pending">' + daysLeft + ' jours restants</span>' +
          '<span class="zakat-hawl-detail">Échéance : ' + hawlEnd.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) + '</span>' +
          '<div class="zakat-hawl-bar-track"><div class="zakat-hawl-bar-fill" style="width:' + pct.toFixed(1) + '%"></div></div>';
        hawlComplete = false;
      }
    } else if (hawlStatus) {
      hawlStatus.classList.add("hidden");
    }

    // Sum all wealth
    var ids = ["zakat-epargne", "zakat-or", "zakat-argent-metal", "zakat-invest", "zakat-commerce", "zakat-crypto", "zakat-autres"];
    var biens = [];
    var labels = ["Épargne & Liquidités", "Or", "Argent (métal)", "Investissements", "Marchandises", "Crypto-monnaies", "Autres"];
    var totalBiens = 0;
    ids.forEach(function(id, i) {
      var v = parseFloat(($(id) || {}).value) || 0;
      biens.push({ label: labels[i], value: v });
      totalBiens += v;
    });

    var dettes = parseFloat(($("zakat-dettes") || {}).value) || 0;
    var netWealth = Math.max(0, totalBiens - dettes);

    // Results
    var section = $("zakat-results-section");
    var container = $("zakat-results");
    if (!section || !container) return;

    var hasAny = totalBiens > 0;
    if (!hasAny) { section.classList.add("hidden"); return; }
    section.classList.remove("hidden");

    var aboveNisab = netWealth >= nisabValue;
    var zakatDue = aboveNisab ? netWealth * ZAKAT_RATE : 0;

    var html = '';

    // Breakdown
    html += '<div class="zakat-breakdown">';
    biens.forEach(function(b) {
      if (b.value > 0) {
        html += '<div class="zakat-breakdown-row">' +
          '<span class="zakat-breakdown-label">' + b.label + '</span>' +
          '<span class="zakat-breakdown-value">' + Math.round(b.value).toLocaleString("fr-FR") + ' €</span></div>';
      }
    });
    if (dettes > 0) {
      html += '<div class="zakat-breakdown-row zakat-breakdown-deduct">' +
        '<span class="zakat-breakdown-label">− Dettes</span>' +
        '<span class="zakat-breakdown-value">−' + Math.round(dettes).toLocaleString("fr-FR") + ' €</span></div>';
    }
    html += '<div class="zakat-breakdown-row zakat-breakdown-total">' +
      '<span class="zakat-breakdown-label">Patrimoine net zakatable</span>' +
      '<span class="zakat-breakdown-value">' + Math.round(netWealth).toLocaleString("fr-FR") + ' €</span></div>';
    html += '</div>';

    // Nisab comparison
    html += '<div class="zakat-comparison">';
    if (aboveNisab) {
      html += '<div class="zakat-comparison-badge zakat-above-nisab">AU-DESSUS DU NISAB (' + Math.round(nisabValue).toLocaleString("fr-FR") + ' €)</div>';
    } else {
      html += '<div class="zakat-comparison-badge zakat-below-nisab">EN DESSOUS DU NISAB (' + Math.round(nisabValue).toLocaleString("fr-FR") + ' €)</div>';
      html += '<p class="zakat-no-zakat">Votre patrimoine net est inférieur au Nisab. Pas de Zakat due.</p>';
    }
    html += '</div>';

    // Zakat amount
    if (aboveNisab) {
      html += '<div class="zakat-final">';
      html += '<div class="zakat-final-label">ZAKAT DUE (2,5%)</div>';
      html += '<div class="zakat-final-amount">' + Math.round(zakatDue).toLocaleString("fr-FR") + ' €</div>';
      if (!hawlComplete && hawlInput && hawlInput.value) {
        html += '<p class="zakat-hawl-note">Le Hawl n\'est pas encore terminé. Ce montant sera dû à l\'échéance du cycle lunaire.</p>';
      }
      html += '</div>';

      // Bar visualization
      var barPct = Math.min((zakatDue / netWealth) * 100 * 10, 100); // scale for visibility
      html += '<div class="zakat-bar-container">' +
        '<div class="zakat-bar-track"><div class="zakat-bar-fill" style="width:' + barPct.toFixed(1) + '%"></div></div>' +
        '<div class="zakat-bar-labels"><span>0 €</span><span>' + Math.round(netWealth).toLocaleString("fr-FR") + ' €</span></div></div>';
    }

    // Quranic reference
    html += '<p class="zakat-reference">﴿ خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا ﴾<br><span class="zakat-ref-fr">« Prélève de leurs biens une aumône par laquelle tu les purifies et les bénis. » — At-Tawba 9:103</span></p>';

    container.innerHTML = html;
    _saveZakatData();
  }

  function _saveZakatData() {
    try {
      var data = {};
      ["zakat-epargne", "zakat-or", "zakat-argent-metal", "zakat-invest",
       "zakat-commerce", "zakat-crypto", "zakat-autres", "zakat-dettes",
       "zakat-prix-gramme"].forEach(function(id) {
        var el = $(id);
        if (el && el.value) data[id] = el.value;
      });
      data.nisabMode = _zakatNisabMode;
      localStorage.setItem(ZAKAT_DATA_KEY, JSON.stringify(data));
    } catch(e) {}
  }

  function _restoreZakatData() {
    try {
      var saved = JSON.parse(localStorage.getItem(ZAKAT_DATA_KEY));
      if (!saved) return;
      Object.keys(saved).forEach(function(id) {
        if (id === "nisabMode") return;
        var el = $(id);
        if (el) el.value = saved[id];
      });
      if (saved.nisabMode) _zakatNisabMode = saved.nisabMode;
    } catch(e) {}
  }

  // ---- Zakat History (multiple named fiches) ----
  function loadZakatHistory() {
    try { return JSON.parse(localStorage.getItem(ZAKAT_HISTORY_KEY)) || []; } catch(e) { return []; }
  }
  function saveZakatHistory(arr) {
    localStorage.setItem(ZAKAT_HISTORY_KEY, JSON.stringify(arr));
  }

  function saveZakatFiche() {
    // Read current input values
    function v(id) { var el = $(id); return el ? parseFloat(el.value) || 0 : 0; }
    var epargne  = v("zakat-epargne");
    var or       = v("zakat-or");
    var argent   = v("zakat-argent-metal");
    var invest   = v("zakat-invest");
    var commerce = v("zakat-commerce");
    var crypto   = v("zakat-crypto");
    var autres   = v("zakat-autres");
    var dettes   = v("zakat-dettes");
    var prix     = v("zakat-prix-gramme");
    var hawlEl   = $("zakat-hawl-date");
    var hawlDate = hawlEl ? hawlEl.value : "";

    var total    = epargne + or + argent + invest + commerce + crypto + autres;
    var net      = Math.max(0, total - dettes);
    var nisabGrams = _zakatNisabMode === "argent" ? ZAKAT_NISAB_ARGENT_GRAMS : ZAKAT_NISAB_OR_GRAMS;
    var nisab    = prix * nisabGrams;
    var aboveNisab = net >= nisab;
    var zakatDue = aboveNisab ? Math.round(net * ZAKAT_RATE * 100) / 100 : 0;

    // Hawl end = start + 354.37 days
    var hawlEnd = "";
    if (hawlDate) {
      var d = new Date(hawlDate);
      d.setTime(d.getTime() + 354.37 * 24 * 3600 * 1000);
      hawlEnd = d.toISOString().split("T")[0];
    }

    var today = new Date().toISOString().split("T")[0];
    var hijriObj = gregorianToHijri(new Date());
    var yearHijri = (hijriObj && hijriObj.year) ? hijriObj.year : new Date().getFullYear();
    var defaultTitle = "Zakat " + yearHijri;
    var title = (prompt("Nom de cette fiche :", defaultTitle) || "").trim() || defaultTitle;

    var fiche = {
      id: Date.now().toString(36),
      title: title,
      savedAt: today,
      hawlDate: hawlDate,
      hawlEnd: hawlEnd,
      nisabMode: _zakatNisabMode,
      prixGramme: prix,
      epargne: epargne, or: or, argent: argent,
      invest: invest, commerce: commerce, crypto: crypto, autres: autres,
      dettes: dettes,
      netWealth: net,
      zakatDue: zakatDue,
      aboveNisab: aboveNisab
    };

    var arr = loadZakatHistory();
    arr.unshift(fiche); // newest first
    saveZakatHistory(arr);
    renderZakatHistory();
    if (hawlEnd) scheduleZakatHawlNotif(fiche);
  }

  function deleteZakatFiche(id) {
    var arr = loadZakatHistory().filter(function(f) { return f.id !== id; });
    saveZakatHistory(arr);
    cancelZakatHawlNotif(id);
    renderZakatHistory();
  }

  function renderZakatHistory() {
    var section = $("zakat-history-section");
    var list    = $("zakat-history-list");
    if (!section || !list) return;
    var arr = loadZakatHistory();
    if (arr.length === 0) { section.classList.add("hidden"); return; }
    section.classList.remove("hidden");

    var html = "";
    arr.forEach(function(f) {
      var hawlLabel = f.hawlEnd
        ? "Versement : " + new Date(f.hawlEnd).toLocaleDateString("fr-FR", { day:"2-digit", month:"long", year:"numeric" })
        : "";
      var amtLabel = f.zakatDue > 0
        ? f.zakatDue.toLocaleString("fr-FR") + " €"
        : f.aboveNisab ? "À calculer" : "En dessous du Nisab";

      html += '<div class="zakat-fiche">' +
        '<div class="zakat-fiche-header">' +
        '<div>' +
        '<div class="zakat-fiche-title">' + f.title + '</div>' +
        '<div class="zakat-fiche-meta">Sauvegardé le ' + new Date(f.savedAt).toLocaleDateString("fr-FR") +
        (hawlLabel ? ' · ' + hawlLabel : '') + '</div>' +
        '</div>' +
        '<div class="zakat-fiche-amount">' + amtLabel + '</div>' +
        '</div>' +
        '<div class="zakat-fiche-actions">' +
        '<button class="zakat-fiche-pdf-btn" data-id="' + f.id + '">PDF / PARTAGER</button>' +
        '<button class="zakat-fiche-del-btn" data-id="' + f.id + '" aria-label="Supprimer">×</button>' +
        '</div>' +
        '</div>';
    });
    list.innerHTML = html;

    list.querySelectorAll(".zakat-fiche-pdf-btn").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var id = this.getAttribute("data-id");
        var fiche = loadZakatHistory().find(function(f) { return f.id === id; });
        if (fiche) exportZakatPDF(fiche);
      });
    });
    list.querySelectorAll(".zakat-fiche-del-btn").forEach(function(btn) {
      btn.addEventListener("click", function() {
        if (confirm("Supprimer cette fiche ?")) deleteZakatFiche(this.getAttribute("data-id"));
      });
    });
  }

  // ─── PDF helpers : html2canvas + jsPDF (lazy-loaded) ────────────────────
  function _loadJsPDF(cb) {
    if (window.jspdf) { cb(window.jspdf); return; }
    var s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload = function() { cb(window.jspdf); };
    s.onerror = function() { showToast("Erreur chargement PDF"); cb(null); };
    document.head.appendChild(s);
  }

  function _loadHtml2Canvas(cb) {
    if (window.html2canvas) { cb(window.html2canvas); return; }
    var s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload = function() { cb(window.html2canvas); };
    s.onerror = function() { showToast("Erreur chargement PDF"); cb(null); };
    document.head.appendChild(s);
  }

  // Capture le rendu HTML de #tdv-doc (aperçu déjà affiché) → PDF → share
  function _htmlDocPDFAndShare(filename, shareTitle) {
    var el = document.getElementById("tdv-doc");
    if (!el) return;
    showToast("Génération du PDF…");

    _loadHtml2Canvas(function(h2c) {
      if (!h2c) return;
      var w = el.scrollWidth || el.offsetWidth || 375;
      var h = el.scrollHeight || el.offsetHeight || 600;
      h2c(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: w,
        height: h,
        windowWidth: w,
        windowHeight: h
      }).then(function(canvas) {
        _loadJsPDF(function(jspdfLib) {
          if (!jspdfLib) { showToast("Erreur PDF"); return; }
          var imgData = canvas.toDataURL("image/jpeg", 0.95);
          var pdf = new jspdfLib.jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
          var margin = 8;
          var pdfW = 210 - margin * 2;
          var pdfH = (canvas.height / canvas.width) * pdfW;
          var pageH = 297 - margin * 2;

          if (pdfH <= pageH) {
            pdf.addImage(imgData, "JPEG", margin, margin, pdfW, pdfH);
          } else {
            // Contenu multi-pages : découpe l'image en tranches
            var pages = Math.ceil(pdfH / pageH);
            for (var i = 0; i < pages; i++) {
              if (i > 0) pdf.addPage();
              pdf.addImage(imgData, "JPEG", margin, margin - i * pageH, pdfW, pdfH);
            }
          }

          var blob = pdf.output("blob");
          var file = new File([blob], filename, { type: "application/pdf" });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({ files: [file], title: shareTitle }).catch(function(e) {
              if (e.name !== "AbortError") _pdfDownload(blob, filename);
            });
          } else {
            _pdfDownload(blob, filename);
          }
        });
      }).catch(function() { showToast("Erreur PDF"); });
    });
  }

  function _pdfDownload(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    setTimeout(function() { URL.revokeObjectURL(url); }, 5000);
  }
  // ─────────────────────────────────────────────────────────────────────────

  function exportZakatPDF(fiche) {
    var today = new Date(fiche.savedAt).toLocaleDateString("fr-FR", { day:"2-digit", month:"long", year:"numeric" });
    var sub = $("zpd-subtitle");
    if (sub) sub.textContent = fiche.title + " — " + today;
    var dateEl = $("zpd-date");
    if (dateEl) dateEl.textContent = today;

    var rows = [
      ["Épargne & liquidités", fiche.epargne],
      ["Or", fiche.or],
      ["Argent métal", fiche.argent],
      ["Investissements", fiche.invest],
      ["Commerce", fiche.commerce],
      ["Crypto-monnaies", fiche.crypto],
      ["Autres biens", fiche.autres]
    ].filter(function(r) { return r[1] > 0; });

    var body = '<table class="hpd-table"><thead><tr><th>Catégorie</th><th>Montant</th></tr></thead><tbody>';
    rows.forEach(function(r) {
      body += '<tr><td>' + r[0] + '</td><td style="text-align:right">' + r[1].toLocaleString("fr-FR") + ' €</td></tr>';
    });
    if (fiche.dettes > 0) {
      body += '<tr><td style="color:#e88">Dettes déductibles</td><td style="text-align:right;color:#e88">− ' + fiche.dettes.toLocaleString("fr-FR") + ' €</td></tr>';
    }
    body += '<tr class="hpd-total"><td>Patrimoine net zakatable</td><td style="text-align:right">' + fiche.netWealth.toLocaleString("fr-FR") + ' €</td></tr>';
    body += '</tbody></table>';

    var nisabLabel = fiche.nisabMode === "argent" ? "Argent (595g)" : "Or (85g)";
    body += '<div class="zpd-summary">';
    body += '<div class="zpd-summary-row"><span>Référence Nisab</span><span>' + nisabLabel + ' — ' + (fiche.prixGramme || "--") + ' €/g</span></div>';
    body += '<div class="zpd-summary-row"><span>Statut</span><span class="zpd-badge ' + (fiche.aboveNisab ? "zpd-badge-ok" : "zpd-badge-no") + '">' + (fiche.aboveNisab ? "Au-dessus du Nisab" : "En dessous du Nisab") + '</span></div>';
    if (fiche.hawlDate) {
      body += '<div class="zpd-summary-row"><span>Début du Hawl</span><span>' + new Date(fiche.hawlDate).toLocaleDateString("fr-FR") + '</span></div>';
    }
    if (fiche.hawlEnd) {
      body += '<div class="zpd-summary-row"><span>Date de versement</span><span>' + new Date(fiche.hawlEnd).toLocaleDateString("fr-FR") + '</span></div>';
    }
    if (fiche.zakatDue > 0) {
      body += '<div class="zpd-summary-row zpd-zakat-due"><span>ZAKAT DUE (2,5%)</span><span>' + fiche.zakatDue.toLocaleString("fr-FR") + ' €</span></div>';
    }
    body += '</div>';

    var bodyEl = $("zpd-body");
    if (bodyEl) bodyEl.innerHTML = body;

    var printDoc = $("zakat-print-doc");
    var tdvDoc   = $("tdv-doc");
    if (tdvDoc && printDoc) tdvDoc.innerHTML = printDoc.innerHTML;

    var viewer = $("testament-doc-viewer");
    if (viewer) {
      viewer.classList.remove("hidden");
      var printBtn = $("tdv-print-btn");
      if (printBtn) {
        printBtn.textContent = "PARTAGER →";
        var _fname = "zakat-" + (fiche.title || "calcul").replace(/[^a-zA-Z0-9]/g, "-") + ".pdf";
        var _ftitle = "Zakat — " + (fiche.title || "calcul");
        printBtn.onclick = function() { _htmlDocPDFAndShare(_fname, _ftitle); };
      }
      var closeBtn = $("tdv-close-btn");
      if (closeBtn) closeBtn.onclick = function() { viewer.classList.add("hidden"); if (printBtn) printBtn.textContent = "PARTAGER →"; };
      var scroll = viewer.querySelector(".tdv-scroll");
      if (scroll) scroll.scrollTop = 0;
    }
  }

  // Hawl notification (ID 300 + hash)
  function _zakatNotifId(ficheId) {
    // Simple hash: sum of char codes mod 900 + 300 → range 300-1199
    var h = 0;
    for (var i = 0; i < ficheId.length; i++) h = (h * 31 + ficheId.charCodeAt(i)) & 0xffff;
    return 300 + (h % 900);
  }

  function scheduleZakatHawlNotif(fiche) {
    var plugin = _getLocalNotifPlugin();
    if (!plugin || !fiche.hawlEnd) return;
    var at = new Date(fiche.hawlEnd + "T09:00:00");
    if (at <= new Date()) return; // already past
    plugin.schedule({ notifications: [{
      id: _zakatNotifId(fiche.id),
      title: "Qurani — Zakat",
      body: "Votre Hawl est complet · " + fiche.title + " · Pensez à verser votre Zakat.",
      schedule: { at: at },
      sound: "default"
    }]}).catch(function(e) { console.warn("[zakat-notif]", e); });
  }

  function cancelZakatHawlNotif(ficheId) {
    var plugin = _getLocalNotifPlugin();
    if (!plugin) return;
    plugin.cancel({ notifications: [{ id: _zakatNotifId(ficheId) }] }).catch(function() {});
  }

  function refreshMoiCounts() {
    // Favoris
    var bms = loadBookmarks();
    var favCount = $("moi-favoris-count");
    if (favCount) favCount.textContent = bms.length || "AUCUN";
    var thumb = $("moi-favoris-thumb");
    if (thumb) {
      if (bms.length > 0) {
        var last = bms[bms.length - 1];
        thumb.style.backgroundImage = "url('" + getSurahImg(last.surahNumber) + "')";
      } else {
        thumb.style.backgroundImage = "";
      }
    }

    // Notes
    var notes = loadNotes();
    var noteCount = $("moi-notes-count");
    if (noteCount) noteCount.textContent = notes.length || "AUCUNE";

    // Khatms
    var hist = [];
    try {
      var raw = localStorage.getItem(KHATM_HISTORY_KEY);
      if (raw) hist = JSON.parse(raw);
    } catch(e) {}
    var khatmCount = $("moi-khatms-count");
    if (khatmCount) khatmCount.textContent = hist.length ? hist.length + " SESSION" + (hist.length > 1 ? "S" : "") : "AUCUN";
  }

  // ================================================================
  //  NOTES — Editor + Overlay
  // ================================================================
  var _noteEditorContext = null;

  function initNoteEditor() {
    var cancelBtn = $("note-editor-cancel");
    if (cancelBtn) cancelBtn.addEventListener("click", closeNoteEditor);
    var backdrop = $("note-editor-backdrop");
    if (backdrop) backdrop.addEventListener("click", closeNoteEditor);
    var saveBtn = $("note-editor-save");
    if (saveBtn) saveBtn.addEventListener("click", saveCurrentNote);
  }

  function openNoteEditor(surahNumber, ayahNumber, surahNameFr) {
    _noteEditorContext = { surahNumber: surahNumber, ayahNumber: ayahNumber, surahNameFr: surahNameFr };
    var translit = SURAH_TRANSLIT[surahNumber] || ("Sourate " + surahNumber);
    var refEl = $("note-editor-ref");
    if (refEl) refEl.textContent = translit.toUpperCase() + " \u00b7 " + surahNumber + ":" + ayahNumber;

    // Load existing note for this verse
    var notes = loadNotes();
    var key = surahNumber + ":" + ayahNumber;
    var existing = null;
    for (var i = 0; i < notes.length; i++) {
      if (notes[i].key === key) { existing = notes[i]; break; }
    }
    var input = $("note-editor-input");
    if (input) input.value = existing ? existing.text : "";

    $("note-editor-wrap").classList.remove("hidden");
    setTimeout(function() { if (input) input.focus(); }, 150);
  }

  function closeNoteEditor() {
    $("note-editor-wrap").classList.add("hidden");
    _noteEditorContext = null;
  }

  function saveCurrentNote() {
    if (!_noteEditorContext) return;
    var input = $("note-editor-input");
    var text = input ? input.value.trim() : "";
    var key = _noteEditorContext.surahNumber + ":" + _noteEditorContext.ayahNumber;
    var notes = loadNotes();

    // Remove existing note for this verse
    notes = notes.filter(function(n) { return n.key !== key; });

    if (text) {
      notes.push({
        key: key,
        surahNumber: _noteEditorContext.surahNumber,
        surahNameFr: _noteEditorContext.surahNameFr || SURAH_NAMES_FR[_noteEditorContext.surahNumber] || "",
        ayahNumber: _noteEditorContext.ayahNumber,
        text: text,
        date: getLocalDateStr()
      });
    }
    saveNotes(notes);
    closeNoteEditor();
    showToast(text ? "Note enregistr\u00e9e" : "Note supprim\u00e9e");
    refreshMoiCounts();
  }

  function openNotesOverlay() {
    renderNotesList();
    $("notes-overlay").classList.remove("hidden");
  }

  function renderNotesList() {
    var list = $("notes-list");
    if (!list) return;
    var notes = loadNotes();
    list.innerHTML = "";

    if (notes.length === 0) {
      list.innerHTML = '<p class="bookmarks-empty">Aucune note pour le moment.<br>Ajoutez des notes depuis le lecteur de sourate.</p>';
      return;
    }

    notes.slice().reverse().forEach(function(n) {
      var item = document.createElement("div");
      item.className = "note-list-item";

      var thumbEl = document.createElement("div");
      thumbEl.className = "note-list-thumb";
      thumbEl.style.backgroundImage = "url('" + getSurahImg(n.surahNumber) + "')";

      var info = document.createElement("div");
      info.className = "note-list-info";

      var refEl = document.createElement("div");
      refEl.className = "note-list-ref";
      var translit = SURAH_TRANSLIT[n.surahNumber] || ("Sourate " + n.surahNumber);
      refEl.textContent = n.surahNumber + "." + n.ayahNumber + " " + translit;

      var textEl = document.createElement("div");
      textEl.className = "note-list-text";
      textEl.textContent = n.text;

      var dateEl = document.createElement("div");
      dateEl.className = "note-list-date";
      dateEl.textContent = n.date;

      info.appendChild(refEl);
      info.appendChild(textEl);
      info.appendChild(dateEl);

      item.appendChild(thumbEl);
      item.appendChild(info);

      // Click to navigate to verse in surah player
      item.addEventListener("click", function() {
        $("notes-overlay").classList.add("hidden");
        var sIdx = -1;
        for (var j = 0; j < surahs.length; j++) {
          if (surahs[j].surahNumber === n.surahNumber) { sIdx = j; break; }
        }
        if (sIdx >= 0) openSurahPlayer(sIdx);
      });

      list.appendChild(item);
    });
  }

  // ================================================================
  //  STATS OVERLAY
  // ================================================================
  var _lastStatsBg = -1;
  function openStatsOverlay() {
    renderStats();
    var ov = $("stats-overlay");
    if (ov) {
      // Random background image (same pool as prayer) — appliqué sur #stats-bg pour le blur
      var imgs = PRAYER_BG_IMAGES;
      var idx;
      do { idx = Math.floor(Math.random() * imgs.length); }
      while (idx === _lastStatsBg && imgs.length > 1);
      _lastStatsBg = idx;
      var num = imgs[idx];
      var ext = [20, 36, 40, 64].indexOf(num) >= 0 ? "png" : "jpg";
      var statsBg = $("stats-bg");
      if (statsBg) statsBg.style.backgroundImage = "url('img/prayer/" + num + "." + ext + "')";
      ov.classList.remove("hidden");
    }
  }

  // ================================================================
  //  MOI KHATMS OVERLAY
  // ================================================================
  function openMoiKhatmsOverlay() {
    var overlay = $("moi-khatms-overlay");
    if (!overlay) return;
    overlay.classList.remove("hidden");
    // Set blurred background image based on current khatm surah
    var bg = $("moi-khatms-bg");
    if (bg) {
      loadKhatm();
      var sNum = (khatm && khatm.active && surahs.length > 0 && surahs[khatm.surahIdx])
        ? surahs[khatm.surahIdx].surahNumber : 1;
      bg.style.backgroundImage = "url('" + getSurahImg(sNum) + "')";
    }
    renderMoiKhatmsList();
  }

  function renderMoiKhatmsList() {
    var list = $("moi-khatms-list");
    if (!list) return;
    list.innerHTML = "";

    // Active khatm card
    loadKhatm();
    if (khatm && khatm.active) {
      var p = getKhatmProgress();
      if (p) {
        var activeCard = document.createElement("div");
        activeCard.className = "moi-khatm-active-card";
        activeCard.innerHTML =
          '<div class="moi-khatm-active-info">' +
            '<div class="moi-khatm-status">EN COURS</div>' +
            '<div class="moi-khatm-title">' + p.translit + '</div>' +
            '<div class="moi-khatm-progress">' + p.pct + '% \u00b7 ' + p.remaining + ' jour' + (p.remaining > 1 ? 's' : '') + ' restant' + (p.remaining > 1 ? 's' : '') + '</div>' +
          '</div>' +
          '<svg class="moi-khatm-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>';
        activeCard.style.cursor = "pointer";
        activeCard.addEventListener("click", function() {
          $("moi-khatms-overlay").classList.add("hidden");
          loadKhatm();
          openKhatmReader(khatm.surahIdx, khatm.ayahIdx, khatm.goalDays);
        });
        list.appendChild(activeCard);
      }
    }

    // History sessions
    var hist = [];
    try {
      var raw = localStorage.getItem(KHATM_HISTORY_KEY);
      if (raw) hist = JSON.parse(raw);
    } catch(e) {}

    if (!hist.length && !(khatm && khatm.active)) {
      list.innerHTML = '<p class="bookmarks-empty">Aucun khatm pour le moment.<br>Commencez votre premier khatm depuis l\u2019onglet Quran.</p>';
      return;
    }

    if (hist.length > 0) {
      var hdr = document.createElement("div");
      hdr.className = "moi-khatm-section-header";
      hdr.textContent = "HISTORIQUE DES SESSIONS";
      list.appendChild(hdr);
    }

    var MONTHS_FR = ["JAN","F\u00c9V","MAR","AVR","MAI","JUN","JUL","AO\u00db","SEP","OCT","NOV","D\u00c9C"];
    hist.forEach(function(s) {
      var d = new Date(s.timestamp);
      var day = d.getDate();
      var mon = MONTHS_FR[d.getMonth()];
      var h12 = d.getHours() % 12 || 12;
      var mm = String(d.getMinutes()).padStart(2, "0");
      var ampm = d.getHours() >= 12 ? "PM" : "AM";
      var fromSurah = surahs[s.startSurahIdx];
      var toSurah = surahs[s.endSurahIdx];
      if (!fromSurah || !toSurah) return;
      var fromName = SURAH_TRANSLIT[fromSurah.surahNumber] || ("Sourate " + fromSurah.surahNumber);
      var toName = SURAH_TRANSLIT[toSurah.surahNumber] || ("Sourate " + toSurah.surahNumber);
      var fromAyah = s.startAyahIdx + 1;
      var toAyah = s.endAyahIdx + 1;

      var item = document.createElement("div");
      item.className = "moi-khatm-session";

      var infoDiv = document.createElement("div");
      infoDiv.className = "moi-khatm-session-info";
      var rangeEl = document.createElement("div");
      rangeEl.className = "moi-khatm-session-range";
      rangeEl.textContent = fromName + " " + fromSurah.surahNumber + ":" + fromAyah + " \u2192 " + toName + " " + toSurah.surahNumber + ":" + toAyah;
      var dateEl = document.createElement("div");
      dateEl.className = "moi-khatm-session-date";
      dateEl.textContent = day + " " + mon + " \u00b7 " + String(h12).padStart(2,"0") + ":" + mm + " " + ampm;
      infoDiv.appendChild(rangeEl);
      infoDiv.appendChild(dateEl);
      item.appendChild(infoDiv);
      list.appendChild(item);
    });
  }

  // ================================================================
  //  SURAH PLAYER ACTION BAR
  // ================================================================
  var spSelectedVerseI = -1;

  function initSpActionBar() {
    // Close button
    var closeBtn = $("sp-action-close");
    if (closeBtn) closeBtn.addEventListener("click", function() {
      closeSurahPlayer();
    });

    // Helper: get verse index for action bar (long-pressed > playing > default)
    function _spActionVerseI() {
      if (spSelectedVerseI >= 0) return spSelectedVerseI;
      if (spCurrentVerseI >= 0) return spCurrentVerseI;
      if (spCurrentSurahIdx < 0) return -1;
      var s = surahs[spCurrentSurahIdx];
      var num = s ? s.surahNumber : 0;
      return (num !== 1 && num !== 9) ? 1 : 0;
    }

    // Copy button
    var copyBtn = $("sp-action-copy");
    if (copyBtn) copyBtn.addEventListener("click", function() {
      if (spCurrentSurahIdx < 0) return;
      var s = surahs[spCurrentSurahIdx];
      if (!s) return;
      var num = s.surahNumber;
      var isBasmalaFirst = (num !== 1 && num !== 9);
      var verseI = _spActionVerseI();
      if (verseI < 0) return;
      var ayahNum = isBasmalaFirst ? verseI : verseI + 1;
      var arText = s.ayahs[verseI] || "";
      var frText = (surahsFr[spCurrentSurahIdx] && surahsFr[spCurrentSurahIdx].ayahs[verseI]) || "";
      var ref = SURAH_TRANSLIT[num] + " — " + (SURAH_NAMES_FR[num] || "") + " · Verset " + ayahNum;
      var text = arText + (frText ? "\n" + frText : "") + "\n\n" + ref;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() { showToast("Verset copié"); }).catch(function() { showToast("Impossible de copier"); });
      }
      var bar = $("sp-action-bar");
      if (bar) bar.classList.add("hidden");
      spSelectedVerseI = -1;
    });

    // Share button (Texte / Image choice)
    var spShareBtn = $("sp-action-share");
    if (spShareBtn) spShareBtn.addEventListener("click", function() {
      if (spCurrentSurahIdx < 0) return;
      var s = surahs[spCurrentSurahIdx];
      if (!s) return;
      var num = s.surahNumber;
      var isBasmalaFirst = (num !== 1 && num !== 9);
      var verseI = _spActionVerseI();
      if (verseI < 0) return;
      var ayahNum = isBasmalaFirst ? verseI : verseI + 1;
      _shareAyahCache = {
        surahNumber: num,
        surahNameFr: SURAH_NAMES_FR[num] || "",
        ayahNumber: ayahNum,
        text: s.ayahs[verseI] || "",
        textFr: (surahsFr[spCurrentSurahIdx] && surahsFr[spCurrentSurahIdx].ayahs[verseI]) || ""
      };
      _openShareChoice();
      var bar = $("sp-action-bar");
      if (bar) bar.classList.add("hidden");
      spSelectedVerseI = -1;
    });

    // Heart/favorite button
    var heartBtn = $("sp-action-heart");
    if (heartBtn) heartBtn.addEventListener("click", function() {
      if (spCurrentSurahIdx < 0) return;
      var s = surahs[spCurrentSurahIdx];
      if (!s) return;
      var num = s.surahNumber;
      var isBasmalaFirst = (num !== 1 && num !== 9);
      var verseI = _spActionVerseI();
      if (verseI < 0) return;
      var ayahNum = isBasmalaFirst ? verseI : verseI + 1;
      if (verseI === 0 && isBasmalaFirst) return;

      var key = num + ":" + ayahNum;
      var bms = loadBookmarks();
      var idx = -1;
      for (var i = 0; i < bms.length; i++) {
        if (bms[i].key === key) { idx = i; break; }
      }
      if (idx >= 0) {
        bms.splice(idx, 1);
        saveBookmarks(bms);
        showToast("Favori retir\u00e9");
      } else {
        bms.push({
          key: key,
          surahNumber: num,
          surahNameFr: SURAH_NAMES_FR[num] || "",
          ayahNumber: ayahNum,
          text: s.ayahs[verseI],
          date: getLocalDateStr(),
          folderId: null
        });
        saveBookmarks(bms);
        showToast("Ajout\u00e9 aux favoris");
      }
      updateSpActionHeartState();
      // Update heart icon on the verse without re-rendering (avoids scroll reset)
      var verseEl = document.querySelector("#sp-reader-content .sp-verse[data-i='" + verseI + "']");
      if (verseEl) {
        var refEl = verseEl.querySelector(".sp-verse-ref");
        if (refEl) {
          var existingHeart = refEl.querySelector(".sp-verse-heart");
          if (idx >= 0) {
            // Removed bookmark — remove heart
            if (existingHeart) existingHeart.remove();
          } else {
            // Added bookmark — add heart if not already there
            if (!existingHeart) {
              var hs = document.createElement("span");
              hs.className = "sp-verse-heart";
              hs.textContent = "\u2764";
              refEl.appendChild(hs);
            }
          }
        }
      }
    });

    // Note button
    // Play from selected verse button
    var playFromBtn = $("sp-action-play");
    if (playFromBtn) playFromBtn.addEventListener("click", function() {
      if (spCurrentSurahIdx < 0 || !spAudioEl) return;
      var verseI = spSelectedVerseI >= 0 ? spSelectedVerseI : 0;
      var bar = $("sp-action-bar");
      if (bar) bar.classList.add("hidden");
      spSelectedVerseI = -1;
      if (spPlaylist.length > 0) {
        var plIdx = spPlaylistVerseIndices.indexOf(verseI);
        if (plIdx < 0) plIdx = 0;
        spPlaylistIdx = plIdx;
        spAudioEl.src = spPlaylist[plIdx];
        spCurrentVerseI = verseI;
      }
      spAudioEl.play().then(function() {
        spIsPlaying = true;
        spUpdatePlayBtn();
        if (spPlaylist.length > 0 && spPlaylistVerseIndices[spPlaylistIdx] !== undefined) {
          spSetActiveVerse(spPlaylistVerseIndices[spPlaylistIdx]);
        }
      }).catch(function() {
        spIsPlaying = false;
        spUpdatePlayBtn();
        showToast("Audio non disponible");
      });
    });

    var noteBtn = $("sp-action-note");
    if (noteBtn) noteBtn.addEventListener("click", function() {
      if (spCurrentSurahIdx < 0) return;
      var s = surahs[spCurrentSurahIdx];
      if (!s) return;
      var num = s.surahNumber;
      var isBasmalaFirst = (num !== 1 && num !== 9);
      var verseI = _spActionVerseI();
      if (verseI < 0) return;
      var ayahNum = isBasmalaFirst ? verseI : verseI + 1;
      if (verseI === 0 && isBasmalaFirst) return;

      openNoteEditor(num, ayahNum, SURAH_NAMES_FR[num] || "");
    });

    // Dismiss action bar on scroll
    var readerScroll = $("sp-reader-scroll");
    if (readerScroll) {
      readerScroll.addEventListener("scroll", function() {
        var bar = $("sp-action-bar");
        if (bar && !bar.classList.contains("hidden")) {
          bar.classList.add("hidden");
          spSelectedVerseI = -1;
        }
      }, { passive: true });
    }
  }

  function updateSpActionHeartState() {
    var heartBtn = $("sp-action-heart");
    if (!heartBtn || spCurrentSurahIdx < 0) return;
    var s = surahs[spCurrentSurahIdx];
    if (!s) return;
    var num = s.surahNumber;
    var isBasmalaFirst = (num !== 1 && num !== 9);
    var verseI = spSelectedVerseI >= 0 ? spSelectedVerseI : (spCurrentVerseI >= 0 ? spCurrentVerseI : (isBasmalaFirst ? 1 : 0));
    var ayahNum = isBasmalaFirst ? verseI : verseI + 1;
    var key = num + ":" + ayahNum;
    var bms = loadBookmarks();
    var isBookmarked = bms.some(function(b) { return b.key === key; });
    heartBtn.classList.toggle("sp-heart-active", isBookmarked);
  }

  // ---- FIREBASE AUTH & CLOUD SYNC ----
  var firebaseReady = false;
  var db = null;
  var auth = null;
  var currentUser = null;
  var syncInProgress = false;
  var _syncTimer = null;

  function initFirebase() {
    if (typeof firebase === "undefined") return;
    try {
      firebase.initializeApp({
        apiKey: "AIzaSyDk8bHjmkjqhOUf0SvHl_jRq5sDlb3OMpw",
        authDomain: "qurani-28307.firebaseapp.com",
        projectId: "qurani-28307",
        storageBucket: "qurani-28307.firebasestorage.app",
        messagingSenderId: "76374898417",
        appId: "1:76374898417:web:5cbc49ca65d5bae1e71b50"
      });
      db = firebase.firestore();
      auth = firebase.auth();
      firebaseReady = true;

      // Handle redirect result (for Capacitor iOS)
      auth.getRedirectResult().then(function(result) {
        if (result && result.user) {
          currentUser = result.user;
          closeAuthOverlay();
          updateAuthUI();
          syncFromCloud();
        }
      }).catch(function(err) {
        if (err.code !== "auth/credential-already-in-use") {
          showToast("Erreur connexion : " + err.message);
        }
      });

      auth.onAuthStateChanged(function(user) {
        currentUser = user;
        updateAuthUI();
        if (user) {
          closeAuthOverlay();
          syncFromCloud();
        }
      });

      // Event listeners
      var googleBtn = $("auth-google-btn");
      var appleBtn = $("auth-apple-btn");
      var logoutBtn = $("auth-logout-btn");

      if (googleBtn) googleBtn.addEventListener("click", signInWithGoogle);
      if (appleBtn) appleBtn.addEventListener("click", signInWithApple);
      if (logoutBtn) logoutBtn.addEventListener("click", signOutUser);

      // Auto-sync quand l'app revient au premier plan
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
        window.Capacitor.Plugins.App.addListener("appStateChange", function(state) {
          if (state.isActive && currentUser) {
            syncFromCloud();
          }
        });
      }

      var authToggle = $("auth-toggle-btn");
      if (authToggle) authToggle.addEventListener("click", function() {
        openAuthOverlay();
      });

      var authClose = $("auth-overlay-close");
      var authBackdrop = $("auth-overlay-backdrop");
      if (authClose) authClose.addEventListener("click", closeAuthOverlay);
      if (authBackdrop) authBackdrop.addEventListener("click", closeAuthOverlay);
    } catch (e) {
      console.warn("Firebase init failed:", e);
    }
  }

  function openAuthOverlay() {
    var ov = $("auth-overlay");
    if (!ov) return;
    ov.classList.remove("hidden", "fade-out");
    document.body.style.overflow = "hidden";
  }

  function closeAuthOverlay() {
    var ov = $("auth-overlay");
    if (!ov) return;
    ov.classList.add("fade-out");
    setTimeout(function() {
      ov.classList.add("hidden");
      ov.classList.remove("fade-out");
      document.body.style.overflow = "";
    }, 300);
  }

  function _isNativeApp() {
    return window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
  }

  function signInWithGoogle() {
    if (!auth) return;
    if (_isNativeApp()) return _signInNative("google");
    var btn = $("auth-google-btn");
    var originalHTML = btn ? btn.innerHTML : "";
    if (btn) { btn.disabled = true; btn.textContent = "Connexion..."; }
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(function(result) {
      currentUser = result.user;
      localStorage.setItem("qurani-auth-provider", "google");
      closeAuthOverlay();
      updateAuthUI();
      syncFromCloud();
    }).catch(function(err) {
      if (btn) { btn.disabled = false; btn.innerHTML = originalHTML; }
      if (err.code === "auth/popup-closed-by-user") return;
      if (err.code === "auth/cancelled-popup-request") return;
      showToast("Erreur : " + (err.message || err.code));
    });
  }

  function signInWithApple() {
    if (!auth) return;
    if (_isNativeApp()) return _signInNative("apple");
    var btn = $("auth-apple-btn");
    var originalHTML = btn ? btn.innerHTML : "";
    if (btn) { btn.disabled = true; btn.textContent = "Connexion..."; }
    var provider = new firebase.auth.OAuthProvider("apple.com");
    provider.addScope("email");
    provider.addScope("name");
    auth.signInWithPopup(provider).then(function(result) {
      currentUser = result.user;
      closeAuthOverlay();
      updateAuthUI();
      syncFromCloud();
    }).catch(function(err) {
      if (btn) { btn.disabled = false; btn.innerHTML = originalHTML; }
      if (err.code === "auth/popup-closed-by-user") return;
      if (err.code === "auth/cancelled-popup-request") return;
      showToast("Erreur : " + (err.message || err.code));
    });
  }

  // Helpers nonce pour Apple Sign-In natif
  function _genNonce(len) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(function(b) { return chars[b % chars.length]; }).join("");
  }
  function _sha256Hex(str) {
    if (typeof crypto === "undefined" || !crypto.subtle) {
      return Promise.resolve(null); // pas de crypto.subtle en HTTP (dev local)
    }
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(str)).then(function(hash) {
      return Array.from(new Uint8Array(hash)).map(function(b) {
        return b.toString(16).padStart(2, "0");
      }).join("");
    });
  }

  // Apple Sign-In natif via AppleSignInPlugin
  function _signInAppleNative() {
    var cap = window.Capacitor;
    if (!cap) { showToast("Capacitor non disponible"); return; }

    var available = cap.isPluginAvailable ? cap.isPluginAvailable("AppleSignIn") : false;
    if (!available) { showToast("Plugin Apple non disponible"); return; }
    closeAuthOverlay();

    // Le SDK Firebase JS attend aud=service_id, mais le token natif a aud=bundle_id.
    // On passe par /api/apple-auth (Vercel) qui vérifie le token Apple
    // et retourne un Firebase custom token.
    cap.nativePromise("AppleSignIn", "authorize", {}).then(function(result) {
      var resp = result.response || {};
      var identityToken = resp.identityToken;
      if (!identityToken) throw new Error("Pas d'identityToken dans la réponse");
      var displayName = [resp.givenName, resp.familyName].filter(Boolean).join(" ");
      if (displayName) localStorage.setItem("qurani-apple-name", displayName);
      var savedName = localStorage.getItem("qurani-apple-name") || "";
      return fetch("https://ayat-theta.vercel.app/api/apple-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: identityToken, displayName: displayName })
      }).then(function(r) {
        if (!r.ok) return r.text().then(function(t) { throw new Error("Serveur: " + t); });
        return r.json();
      }).then(function(data) {
        if (data.error) throw new Error(data.error);
        return auth.signInWithCustomToken(data.customToken).then(function(cred) {
          // Mettre à jour le profil Firebase avec le nom Apple (seulement si disponible)
          var name = data.displayName || displayName || savedName;
          if (name && cred.user && !cred.user.displayName) {
            return cred.user.updateProfile({ displayName: name }).then(function() { return cred; });
          }
          return cred;
        });
      });
    }).then(function(result) {
      currentUser = result.user;
      localStorage.setItem("qurani-auth-provider", "apple");
      updateAuthUI();
      syncFromCloud();
      showToast("Connexion réussie !");
    }).catch(function(err) {
      console.error("[Apple Auth] ERREUR:", err);
      var msg = (err && (err.message || err.code || "")) + "";
      if (msg.indexOf("1001") >= 0 || msg.indexOf("cancel") >= 0) return;
      showToast("Erreur Apple : " + msg);
    });
  }

  // Google Sign-In via @capacitor/browser (SFSafariViewController)
  function _signInNative(providerName) {
    if (!window.Capacitor || !window.Capacitor.Plugins) return;

    // Apple : utiliser le plugin natif (pas SFSafariViewController)
    if (providerName === "apple") {
      _signInAppleNative();
      return;
    }

    var Browser = window.Capacitor.Plugins.Browser;
    var App = window.Capacitor.Plugins.App;
    if (!Browser) { showToast("Navigateur non disponible"); return; }

    closeAuthOverlay();
    showToast("Ouverture de la connexion...");

    Browser.open({
      url: "https://qurani.fr/auth-native.html?provider=" + providerName,
      presentationStyle: "popover"
    });

    if (!window._authCallbackRegistered) {
      window._authCallbackRegistered = true;
      App.addListener("appUrlOpen", function(event) {
        var url = event.url || "";
        var isAuthCallback = url.indexOf("com.tmshparis.qurani://auth-callback") >= 0 ||
                             url.indexOf("ayat-theta.vercel.app/auth-callback") >= 0;
        if (!isAuthCallback) return;

        Browser.close().catch(function() {});

        var qs = url.split("?")[1] || "";
        var params = {};
        qs.split("&").forEach(function(pair) {
          var parts = pair.split("=");
          if (parts.length === 2) params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
        });

        if (!params.idToken && !params.accessToken) { showToast("Erreur de connexion"); return; }

        var credential;
        if (params.provider === "google.com" && params.idToken) {
          credential = firebase.auth.GoogleAuthProvider.credential(params.idToken, params.accessToken || null);
        }

        if (credential && auth) {
          auth.signInWithCredential(credential).then(function(result) {
            currentUser = result.user;
            localStorage.setItem("qurani-auth-provider", "google");
            updateAuthUI();
            syncFromCloud();
            showToast("Connexion réussie !");
          }).catch(function(err) {
            console.error("signInWithCredential error:", err);
            showToast("Erreur : " + (err.message || err.code));
          });
        }
      });
    }
  }

  function signOutUser() {
    if (!auth) return;
    auth.signOut().then(function() {
      currentUser = null;
      localStorage.removeItem("qurani-auth-provider");
      updateAuthUI();
      showToast("Déconnexion réussie");
    });
  }

  function _nameFromEmail(email) {
    if (!email) return "";
    if (email.indexOf("privaterelay.appleid.com") >= 0) return "";
    var prefix = email.split("@")[0];
    return prefix.replace(/[._\-+]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); })
      .join(" ")
      .slice(0, 24);
  }

  function updateAuthUI() {
    var loggedOut = $("auth-logged-out");
    var loggedIn = $("auth-logged-in");
    if (!loggedOut || !loggedIn) return;
    if (currentUser) {
      loggedOut.classList.add("hidden");
      loggedIn.classList.remove("hidden");
      var nameEl = $("auth-name");
      var emailEl = $("auth-email");
      var avatarEl = $("auth-avatar");
      var initialsEl = $("auth-initials");
      var badgeEl = $("auth-provider-badge");
      var displayName = localStorage.getItem("qurani-display-name")
        || currentUser.displayName
        || localStorage.getItem("qurani-apple-name")
        || _nameFromEmail(currentUser.email)
        || "Moi";
      if (nameEl) nameEl.textContent = displayName;
      if (emailEl) {
        var emailVal = currentUser.email || "";
        emailEl.textContent = emailVal.indexOf("privaterelay.appleid.com") >= 0 ? "Apple ID privé" : emailVal;
      }
      // Avatar ou initiales colorées
      if (currentUser.photoURL) {
        if (avatarEl) { avatarEl.src = currentUser.photoURL; avatarEl.style.display = ""; }
        if (initialsEl) initialsEl.style.display = "none";
      } else {
        if (avatarEl) avatarEl.style.display = "none";
        if (initialsEl) {
          var parts = displayName.split(" ").filter(Boolean);
          initialsEl.textContent = parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : displayName.slice(0, 2).toUpperCase();
          // Couleur dérivée du UID
          var palette = ["#7C6AF5","#E0916D","#6DB4E0","#6DE09A","#D4A843","#E06D9A"];
          var uidSum = (currentUser.uid || "").split("").reduce(function(a, c) { return a + c.charCodeAt(0); }, 0);
          var col = palette[uidSum % palette.length];
          initialsEl.style.background = col + "22";
          initialsEl.style.color = col;
          initialsEl.style.borderColor = col + "55";
          initialsEl.style.display = "";
        }
      }
      // Bouton édition nom
      var editBtn = $("auth-name-edit-btn");
      if (editBtn && !editBtn._hasListener) {
        editBtn._hasListener = true;
        editBtn.addEventListener("click", function() {
          var el = $("auth-name");
          if (!el) return;
          var cur = localStorage.getItem("qurani-display-name") || el.textContent;
          var inp = document.createElement("input");
          inp.type = "text";
          inp.value = (cur === "Moi") ? "" : cur;
          inp.placeholder = "Votre prénom";
          inp.className = "auth-name-input";
          el.textContent = "";
          el.appendChild(inp);
          inp.focus();
          inp.select();
          function saveEditName() {
            var val = inp.value.trim();
            if (val) {
              localStorage.setItem("qurani-display-name", val);
              if (currentUser) currentUser.updateProfile({ displayName: val }).catch(function(){});
            }
            updateAuthUI();
          }
          inp.addEventListener("blur", saveEditName);
          inp.addEventListener("keydown", function(e) {
            if (e.key === "Enter") inp.blur();
            if (e.key === "Escape") updateAuthUI();
          });
        });
      }
      // Badge provider
      if (badgeEl) {
        var provider = localStorage.getItem("qurani-auth-provider") || "";
        if (!provider && currentUser.providerData && currentUser.providerData[0]) {
          provider = currentUser.providerData[0].providerId === "google.com" ? "google" : "";
        }
        badgeEl.textContent = provider === "google" ? "Google" : provider === "apple" ? "Apple" : "";
      }
      // Restore last sync timestamp
      var timeEl2 = $("auth-sync-time");
      if (timeEl2) {
        var savedTs = localStorage.getItem("qurani-last-sync-ts");
        if (savedTs) {
          var d2 = new Date(savedTs);
          var today2 = new Date();
          var sameDay2 = d2.toDateString() === today2.toDateString();
          var label2 = sameDay2
            ? d2.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
            : d2.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }) + " " + d2.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
          timeEl2.textContent = "· " + label2;
        }
      }
    } else {
      loggedOut.classList.remove("hidden");
      loggedIn.classList.add("hidden");
    }
  }

  function getDeviceId() {
    var id = localStorage.getItem("qurani-device-id");
    if (!id) {
      id = "device-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("qurani-device-id", id);
    }
    return id;
  }

  function collectSyncData() {
    return {
      appState: _safeJson(STORAGE_KEY, {}),
      bookmarks: _safeJson(BOOKMARKS_KEY, []),
      folders: _safeJson(FOLDERS_KEY, []),
      stats: _safeJson(STATS_KEY, {}),
      notes: _safeJson(NOTES_KEY, []),
      khatm: _safeJson(KHATM_KEY, null),
      khatmHistory: _safeJson(KHATM_HISTORY_KEY, []),
      hifz: _safeJson(HIFZ_KEY, {}),
      duaFavorites: _safeJson(DUA_FAV_KEY, []),
      preferences: {
        reciter: localStorage.getItem(AUDIO_RECITER_KEY) || "Alafasy_128kbps",
        spLang: localStorage.getItem(SP_LANG_KEY) || "ar-fr",
        spMode: localStorage.getItem(SP_MODE_KEY) || "minimal",
        spScale: localStorage.getItem(SP_SCALE_KEY) || "100",
        hifzMode: localStorage.getItem(HIFZ_MODE_KEY) || "tajwid",
        hifzReciter: localStorage.getItem(HIFZ_RECITER_KEY) || ""
      },
      _deviceId: getDeviceId()
    };
  }

  function syncToCloud() {
    if (!firebaseReady || !currentUser || syncInProgress) return;
    syncInProgress = true;
    updateSyncStatus("EN COURS...");
    var data = collectSyncData();
    data._lastModified = firebase.firestore.FieldValue.serverTimestamp();
    var timeout = setTimeout(function() {
      if (syncInProgress) {
        syncInProgress = false;
        updateSyncStatus("ERREUR");
        console.warn("[Sync] syncToCloud timeout après 20s");
      }
    }, 20000);
    db.collection("users").doc(currentUser.uid).set(
      { syncData: data },
      { merge: true }
    ).then(function() {
      clearTimeout(timeout);
      syncInProgress = false;
      updateSyncStatus("TERMINÉ ✓");
    }).catch(function(err) {
      clearTimeout(timeout);
      syncInProgress = false;
      updateSyncStatus("ERREUR");
      showToast("Erreur de synchronisation");
      console.error("[Sync] syncToCloud erreur:", err);
    });
  }

  function syncFromCloud() {
    if (!firebaseReady || !currentUser || syncInProgress) return;
    syncInProgress = true;
    updateSyncStatus("EN COURS...");
    var timeout = setTimeout(function() {
      if (syncInProgress) {
        syncInProgress = false;
        updateSyncStatus("ERREUR");
        console.warn("[Sync] syncFromCloud timeout après 20s");
      }
    }, 20000);
    db.collection("users").doc(currentUser.uid).get().then(function(doc) {
      clearTimeout(timeout);
      syncInProgress = false;
      if (doc.exists && doc.data().syncData) {
        resolveAndApplySync(doc.data().syncData);
        updateSyncStatus("TERMINÉ ✓");
      } else {
        syncToCloud();
      }
    }).catch(function(err) {
      clearTimeout(timeout);
      syncInProgress = false;
      updateSyncStatus("ERREUR");
      console.error("[Sync] syncFromCloud erreur:", err);
    });
  }

  function resolveAndApplySync(cloud) {
    // appState: take the one with more reading progress
    if (cloud.appState) {
      var localState = _safeJson(STORAGE_KEY, {});
      if ((cloud.appState.globalIndex || 0) > (localState.globalIndex || 0)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloud.appState));
        state = loadState();
        applyMode();
      }
    }

    // bookmarks: merge by key (normalize property names from old format)
    if (cloud.bookmarks) {
      var localBms = loadBookmarks();
      cloud.bookmarks = cloud.bookmarks.map(normalizeBookmarkOrNote);
      var merged = mergeArraysByKey(localBms.map(normalizeBookmarkOrNote), cloud.bookmarks, "key");
      saveBookmarks(merged);
    }

    // folders: merge by id
    if (cloud.folders) {
      var localFolders = _safeJson(FOLDERS_KEY, []);
      var mergedFolders = mergeArraysByKey(localFolders, cloud.folders, "id");
      saveFolders(mergedFolders);
    }

    // stats: merge taking max values, union of dates, recalculate streak
    if (cloud.stats) {
      var localStats = loadStats();
      var mergedDates = mergeReadDates(localStats.readDates || [], cloud.stats.readDates || []);
      var mergedStats = {
        totalVersesRead: Math.max(localStats.totalVersesRead || 0, cloud.stats.totalVersesRead || 0),
        totalHassanates: Math.max(localStats.totalHassanates || 0, cloud.stats.totalHassanates || 0),
        totalReadingSeconds: Math.max(localStats.totalReadingSeconds || 0, cloud.stats.totalReadingSeconds || 0),
        readDates: mergedDates,
        streak: computeStreak(mergedDates)
      };
      saveStats(mergedStats);
    }

    // notes: merge by key (normalize property names from old format)
    if (cloud.notes) {
      var localNotes = _safeJson(NOTES_KEY, []);
      cloud.notes = cloud.notes.map(normalizeBookmarkOrNote);
      var mergedNotes = mergeArraysByKey(localNotes.map(normalizeBookmarkOrNote), cloud.notes, "key");
      saveNotes(mergedNotes);
    }

    // khatm: take more advanced one
    if (cloud.khatm) {
      localStorage.setItem(KHATM_KEY, JSON.stringify(cloud.khatm));
    }
    if (cloud.khatmHistory) {
      var localHist = _safeJson(KHATM_HISTORY_KEY, []);
      var mergedHist = mergeArraysByTimestamp(localHist, cloud.khatmHistory);
      localStorage.setItem(KHATM_HISTORY_KEY, JSON.stringify(mergedHist));
    }

    // hifz: cloud wins (object merge)
    if (cloud.hifz && typeof cloud.hifz === "object") {
      var localHifz = _safeJson(HIFZ_KEY, {});
      var mergedHifz = Object.assign({}, localHifz, cloud.hifz);
      localStorage.setItem(HIFZ_KEY, JSON.stringify(mergedHifz));
    }

    // duaFavorites: merge by catId+entryIdx, cloud wins duplicates
    if (cloud.duaFavorites && Array.isArray(cloud.duaFavorites)) {
      var localDF = loadDuaFavorites();
      var merged = localDF.slice();
      cloud.duaFavorites.forEach(function(cf) {
        var exists = merged.some(function(m) { return m.catId === cf.catId && m.entryIdx === cf.entryIdx; });
        if (!exists) merged.push(cf);
      });
      saveDuaFavorites(merged);
    }

    // preferences: cloud wins
    if (cloud.preferences) {
      if (cloud.preferences.reciter) localStorage.setItem(AUDIO_RECITER_KEY, cloud.preferences.reciter);
      if (cloud.preferences.spLang) localStorage.setItem(SP_LANG_KEY, cloud.preferences.spLang);
      if (cloud.preferences.spMode) localStorage.setItem(SP_MODE_KEY, cloud.preferences.spMode);
      if (cloud.preferences.spScale) localStorage.setItem(SP_SCALE_KEY, cloud.preferences.spScale);
      if (cloud.preferences.hifzMode) localStorage.setItem(HIFZ_MODE_KEY, cloud.preferences.hifzMode);
      if (cloud.preferences.hifzReciter) localStorage.setItem(HIFZ_RECITER_KEY, cloud.preferences.hifzReciter);
    }

    // Refresh all UI components with merged data
    refreshAllAfterSync();

    // Push merged data back
    syncToCloud();
  }

  // Normalize bookmark/note objects: ensure surahNumber & ayahNumber exist
  // Fixes data saved with old property names (surah/ayah instead of surahNumber/ayahNumber)
  function normalizeBookmarkOrNote(item) {
    if (!item) return item;
    // If surahNumber is missing, try to extract from key ("2:255") or from old "surah" field
    if (item.surahNumber === undefined || item.surahNumber === null) {
      if (item.surah !== undefined) {
        item.surahNumber = item.surah;
      } else if (item.key) {
        var parts = item.key.split(":");
        item.surahNumber = parseInt(parts[0], 10) || 0;
      }
    }
    if (item.ayahNumber === undefined || item.ayahNumber === null) {
      if (item.ayah !== undefined) {
        item.ayahNumber = item.ayah;
      } else if (item.key) {
        var parts = item.key.split(":");
        item.ayahNumber = parseInt(parts[1], 10) || 0;
      }
    }
    // Fill surahNameFr if missing
    if (!item.surahNameFr && item.surahNumber && typeof SURAH_NAMES_FR !== "undefined") {
      item.surahNameFr = SURAH_NAMES_FR[item.surahNumber] || "";
    }
    return item;
  }

  function refreshAllAfterSync() {
    try { state = loadState(); applyMode(); render(); } catch(e) {}
    try { updateDashStats(); } catch(e) {}
    try { updateDashKhatmCard(); } catch(e) {}
    try { refreshMoiCounts(); } catch(e) {}
    try { renderBookmarksList(); } catch(e) {}
    try { renderStats(); } catch(e) {}
    try { loadKhatm(); } catch(e) {}
  }

  function mergeArraysByKey(local, cloud, keyField) {
    var map = {};
    local.forEach(function(item) { if (item[keyField]) map[item[keyField]] = item; });
    cloud.forEach(function(item) {
      if (item[keyField] && !map[item[keyField]]) map[item[keyField]] = item;
    });
    return Object.keys(map).map(function(k) { return map[k]; });
  }

  function mergeReadDates(local, cloud) {
    if (Array.isArray(local) && Array.isArray(cloud)) {
      var set = {};
      local.forEach(function(d) { set[d] = true; });
      cloud.forEach(function(d) { set[d] = true; });
      return Object.keys(set).sort().slice(-365);
    }
    return local || cloud || [];
  }

  function mergeArraysByTimestamp(local, cloud) {
    var map = {};
    local.forEach(function(item) {
      var key = (item.timestamp || "") + ":" + (item.surahIdx || 0);
      map[key] = item;
    });
    cloud.forEach(function(item) {
      var key = (item.timestamp || "") + ":" + (item.surahIdx || 0);
      if (!map[key]) map[key] = item;
    });
    return Object.keys(map).map(function(k) { return map[k]; });
  }

  var _syncStatusTimer;
  function updateSyncStatus(text) {
    var el = $("auth-sync-status");
    var bar = $("auth-sync-bar");
    var timeEl = $("auth-sync-time");
    if (!el) return;
    el.textContent = text;
    el.classList.remove("auth-sync-status--ok", "auth-sync-status--err");
    var loading = (text === "EN COURS...");
    if (bar) bar.classList.toggle("auth-sync-bar--hidden", !loading);
    if (text === "TERMINÉ ✓" || text === "À JOUR") {
      el.classList.add("auth-sync-status--ok");
      if (text === "TERMINÉ ✓") {
        var now = new Date();
        var ts = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
        localStorage.setItem("qurani-last-sync-ts", now.toISOString());
        if (timeEl) timeEl.textContent = "· " + ts;
        clearTimeout(_syncStatusTimer);
        _syncStatusTimer = setTimeout(function() { updateSyncStatus("À JOUR"); }, 3000);
      } else if (text === "À JOUR" && timeEl && !timeEl.textContent) {
        // Restore timestamp from localStorage on page reload
        var saved = localStorage.getItem("qurani-last-sync-ts");
        if (saved) {
          var d = new Date(saved);
          var today = new Date();
          var sameDay = d.toDateString() === today.toDateString();
          var label = sameDay
            ? d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
            : d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }) + " " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
          timeEl.textContent = "· " + label;
        }
      }
    } else if (text === "ERREUR") {
      el.classList.add("auth-sync-status--err");
    }
  }

  function debouncedSync() {
    if (!firebaseReady || !currentUser) return;
    clearTimeout(_syncTimer);
    _syncTimer = setTimeout(syncToCloud, 5000);
  }

  // ============================================================
  //  SHOOTING STARS — Dashboard hero
  // ============================================================
  function initShootingStars() {
    var container = $("dash-shooting-stars");
    if (!container) return;

    function createStar() {
      var tabEl = $("tab-accueil");
      if (tabEl && tabEl.offsetParent === null) return; // not on dashboard
      var star = document.createElement("div");
      star.className = "shooting-star";
      star.style.left = (25 + Math.random() * 65) + "vw";
      star.style.top  = (4  + Math.random() * 48) + "vh";
      var len = 70 + Math.random() * 90;
      star.style.width = len + "px";
      container.appendChild(star);
      setTimeout(function() { if (star.parentNode) star.remove(); }, 900);
    }

    // First star shortly after load, then every 3 s
    setTimeout(createStar, 1600);
    setInterval(function() {
      createStar();
      if (Math.random() > 0.5) setTimeout(createStar, 380 + Math.random() * 300);
    }, 3000);
  }

  // ================================================================
  // MIN READER — Mode Concentration (lecture verset par verset)
  // ================================================================

  function applyMinThemeToHub() {
    var hubOv = $('min-hub-overlay');
    if (!hubOv) return;
    hubOv.classList.remove('min-t-light', 'min-t-sepia', 'min-t-dark');
    hubOv.classList.add('min-t-' + (state.minTheme || 'dark'));
  }

  function openMinHub() {
    renderMinHubPrefs();
    updateMinHubItems();
    applyMinThemeToHub();
    // Always show the main hub screen (reset pickers)
    var picker = $('min-surah-picker');
    var vpicker = $('min-verse-picker');
    var inner = $('min-hub-inner');
    if (picker) picker.classList.add('hidden');
    if (vpicker) vpicker.classList.add('hidden');
    if (inner) inner.classList.remove('hidden');
    $('min-hub-overlay').classList.remove('hidden');
  }

  function openMinSurahPicker() {
    $('min-hub-inner').classList.add('hidden');
    renderMinSurahList();
    $('min-surah-picker').classList.remove('hidden');
  }

  function closeMinSurahPicker() {
    $('min-surah-picker').classList.add('hidden');
    $('min-hub-inner').classList.remove('hidden');
  }

  function renderMinSurahList() {
    var list = $('min-picker-list');
    if (!list || !surahs) return;
    list.innerHTML = '';
    surahs.forEach(function(s, si) {
      var num = s.surahNumber || (si + 1);
      var item = document.createElement('div');
      item.className = 'min-picker-surah';
      item.innerHTML =
        '<span class="min-picker-num">' + num + '</span>' +
        '<span class="min-picker-name">' + (SURAH_TRANSLIT[num] || '') + '</span>' +
        '<span class="min-picker-ar">' + (s.surahNameAr || '') + '</span>' +
        '<span class="min-picker-count">' + s.ayahs.length + 'v</span>';
      item.addEventListener('click', function() {
        openMinVersePicker(si);
      });
      list.appendChild(item);
    });
  }

  function openMinVersePicker(surahIdx) {
    if (!surahs || !surahs[surahIdx]) return;
    var s = surahs[surahIdx];
    var num = s.surahNumber || (surahIdx + 1);
    var nameEl = $('min-vpicker-surah-name');
    if (nameEl) nameEl.textContent = (SURAH_TRANSLIT[num] || '') + '  ·  ' + (s.surahNameAr || '');
    renderMinVerseGrid(surahIdx);
    $('min-surah-picker').classList.add('hidden');
    $('min-verse-picker').classList.remove('hidden');
  }

  function closeMinVersePicker() {
    $('min-verse-picker').classList.add('hidden');
    $('min-surah-picker').classList.remove('hidden');
  }

  function renderMinVerseGrid(surahIdx) {
    var grid = $('min-vpicker-grid');
    if (!grid || !surahs || !surahs[surahIdx]) return;
    var total = surahs[surahIdx].ayahs.length;
    grid.innerHTML = '';
    for (var i = 0; i < total; i++) {
      (function(ai) {
        var cell = document.createElement('div');
        cell.className = 'min-vpicker-cell';
        cell.textContent = ai + 1;
        cell.addEventListener('click', function() {
          state.minContext = 'libre';
          openMinReader(surahIdx, ai);
        });
        grid.appendChild(cell);
      })(i);
    }
  }

  function closeMinHub() {
    $('min-hub-overlay').classList.add('hidden');
  }

  function openMinReader(surahIdx, ayahIdx) {
    state.minSurahIdx = surahIdx || 0;
    state.minAyahIdx = ayahIdx || 0;
    saveState();
    closeMinHub();
    renderMinReader();
    $('min-reader-overlay').classList.remove('hidden');
  }

  function closeMinReader() {
    $('min-reader-overlay').classList.add('hidden');
    openMinHub();
  }

  function renderMinHubPrefs() {
    document.querySelectorAll('#min-theme-btns .min-pref-opt').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.minTheme === (state.minTheme || 'dark'));
    });
    document.querySelectorAll('#min-lang-btns .min-pref-opt').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.minLang === (state.minLang || 'ar'));
    });
    document.querySelectorAll('#min-mode-btns .min-pref-opt').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.minMode === (state.minMode || 'minimal'));
    });
    document.querySelectorAll('#min-riwaya-btns .min-pref-opt').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.riwaya === (state.riwaya || 'hafs'));
    });
    document.querySelectorAll('#min-size-btns .min-pref-opt').forEach(function(btn) {
      btn.classList.toggle('active', parseInt(btn.dataset.minSize) === (state.minSize || 100));
    });
  }

  function updateMinHubItems() {
    // Khatm item
    var khatmNameEl = $('min-hub-khatm-name');
    var khatmItem = $('min-hub-khatm');
    if (khatm && khatm.surahIdx !== undefined && surahs && surahs[khatm.surahIdx]) {
      var kSurah = surahs[khatm.surahIdx];
      var kNum = kSurah.surahNumber || (khatm.surahIdx + 1);
      if (khatmNameEl) khatmNameEl.textContent = (SURAH_TRANSLIT[kNum] || kSurah.surahNameAr || '') + '  ·  v.' + (khatm.ayahIdx + 1);
      if (khatmItem) { khatmItem.style.opacity = '1'; khatmItem.style.pointerEvents = ''; }
    } else {
      if (khatmNameEl) khatmNameEl.textContent = 'Commencer un khatm';
      if (khatmItem) { khatmItem.style.opacity = '0.7'; khatmItem.style.pointerEvents = ''; }
    }
    // Libre item
    var libreNameEl = $('min-hub-libre-name');
    if (libreNameEl && totalAyat > 0 && surahs) {
      var pos = linearToPosition(state.globalIndex % totalAyat);
      var lSurah = surahs[pos.surahIdx];
      if (lSurah) {
        var lNum = lSurah.surahNumber || (pos.surahIdx + 1);
        libreNameEl.textContent = (SURAH_TRANSLIT[lNum] || lSurah.surahNameAr || '') + '  ·  v.' + (pos.ayahIdx + 1);
      }
    }
    // Reset khatm row — visible only when khatm is active
    var resetRow = $('min-reset-khatm-row');
    if (resetRow) {
      if (khatm && khatm.active) resetRow.classList.remove('hidden');
      else resetRow.classList.add('hidden');
    }
  }

  function renderMinReader() {
    var ov = $('min-reader-overlay');
    if (!ov || !surahs) return;
    // Apply theme
    ov.className = 'overlay min-t-' + (state.minTheme || 'dark');
    var surahIdx = state.minSurahIdx || 0;
    var ayahIdx = state.minAyahIdx || 0;
    var surah = surahs[surahIdx];
    if (!surah) return;
    var ayahText = surah.ayahs[ayahIdx] || '';
    var arEl = $('min-verse-ar');
    var frEl = $('min-verse-fr');
    var sizeScale = state.minSize || 100;
    var arPx = Math.round(26 * sizeScale / 100);
    var showAr = (state.minLang || 'ar') !== 'fr';
    var showFr = (state.minLang || 'ar') === 'ar-fr' || (state.minLang || 'ar') === 'fr';
    arEl.style.display = showAr ? '' : 'none';
    frEl.style.display = showFr ? '' : 'none';
    if (showAr) {
      arEl.style.fontSize = arPx + 'px';
      if (state.minMode === 'tajwid') {
        var _rm = state.readingMode, _tc = state.tajwidColors, _dl = state.displayLang;
        state.readingMode = 'tajwid'; state.tajwidColors = true; state.displayLang = 'ar';
        renderAyahText(arEl, { text: ayahText, surahNumber: surah.surahNumber, ayahNumber: ayahIdx + 1 });
        state.readingMode = _rm; state.tajwidColors = _tc; state.displayLang = _dl;
        // renderAyahText écrase le className — on le remet à zéro pour préserver les styles min reader
        arEl.className = '';
        arEl.style.fontSize = arPx + 'px';
      } else {
        arEl.textContent = ayahText;
      }
    }
    if (showFr) {
      var frSurah = surahsFr && surahsFr[surahIdx];
      frEl.textContent = frSurah ? (frSurah.ayahs[ayahIdx] || '') : '';
      frEl.style.fontSize = Math.max(12, Math.round(arPx * 0.52)) + 'px';
    }
    // Info bar
    var surahNum = surah.surahNumber || (surahIdx + 1);
    $('min-surah-name').textContent = SURAH_TRANSLIT[surahNum] || surah.surahNameAr || '';
    $('min-verse-num').textContent = 'v. ' + (ayahIdx + 1);
    // Khatm progress bar + top strip + complete button
    var bar = $('min-khatm-bar');
    var topEl = $('min-khatm-top');
    var dayLbl = $('min-khatm-day-lbl');
    var countLbl = $('min-khatm-count-lbl');
    var completeBtn = $('min-complete-btn');
    if (state.minContext === 'khatm' && khatm && khatm.active) {
      var portion = getTodayPortion();
      if (portion && portion.versesForToday > 0) {
        // Progress bar
        if (bar) {
          var dayPct = Math.min(portion.versesReadToday / portion.versesForToday * 100, 100);
          bar.style.width = dayPct.toFixed(1) + '%';
          bar.style.display = '';
        }
        // Top strip: "JOUR 3  ·  12 / 20"
        if (topEl) topEl.classList.remove('hidden');
        if (dayLbl) dayLbl.textContent = 'JOUR ' + portion.dayNumber;
        if (countLbl) countLbl.textContent = '· ' + Math.min(portion.versesReadToday, portion.versesForToday) + ' / ' + portion.versesForToday;
        // Complete button: appears when day quota reached
        if (completeBtn) {
          if (portion.versesReadToday >= portion.versesForToday) {
            completeBtn.textContent = 'COMPLÉTER JOUR ' + portion.dayNumber;
            completeBtn.classList.remove('hidden');
          } else {
            completeBtn.classList.add('hidden');
          }
        }
      } else {
        if (bar) { bar.style.width = '0%'; bar.style.display = ''; }
        if (topEl) topEl.classList.add('hidden');
        if (completeBtn) completeBtn.classList.add('hidden');
      }
    } else {
      if (topEl) topEl.classList.add('hidden');
      if (completeBtn) completeBtn.classList.add('hidden');
      if (bar) {
        if (surah.ayahs.length > 0) {
          bar.style.width = ((ayahIdx + 1) / surah.ayahs.length * 100).toFixed(1) + '%';
          bar.style.display = '';
        } else {
          bar.style.display = 'none';
        }
      }
    }
  }

  function minNextVerse() {
    var si = state.minSurahIdx || 0;
    var ai = state.minAyahIdx || 0;
    if (!surahs) return;
    var surah = surahs[si];
    if (!surah) return;
    // Compter les lettres du verset actuellement affiché (avant d'avancer)
    var letters = countArabicLetters(surah.ayahs[ai] || '');
    if (ai < surah.ayahs.length - 1) {
      state.minAyahIdx = ai + 1;
    } else if (si < surahs.length - 1) {
      state.minSurahIdx = si + 1;
      state.minAyahIdx = 0;
    }
    // Sync khatm position
    if (state.minContext === 'khatm' && khatm && khatm.active) {
      khatm.surahIdx = state.minSurahIdx;
      khatm.ayahIdx = state.minAyahIdx;
      saveKhatm();
      state.todayReadCount++;
    }
    // Hassanates + versets lus (khatm ET lecture libre)
    recordReading(1, letters);
    saveState();
    _animateMinVerse();
  }

  function minPrevVerse() {
    var si = state.minSurahIdx || 0;
    var ai = state.minAyahIdx || 0;
    if (!surahs) return;
    if (ai > 0) {
      state.minAyahIdx = ai - 1;
    } else if (si > 0) {
      state.minSurahIdx = si - 1;
      state.minAyahIdx = surahs[si - 1].ayahs.length - 1;
    }
    // Sync khatm position
    if (state.minContext === 'khatm' && khatm && khatm.active) {
      khatm.surahIdx = state.minSurahIdx;
      khatm.ayahIdx = state.minAyahIdx;
      saveKhatm();
    }
    saveState();
    _animateMinVerse();
  }

  function _animateMinVerse() {
    var wrap = $('min-verse-wrap');
    if (!wrap) return;
    wrap.style.transition = 'none';
    wrap.style.opacity = '0';
    setTimeout(function() {
      renderMinReader();
      wrap.style.transition = 'opacity 0.2s ease';
      wrap.style.opacity = '1';
    }, 110);
  }

  function minCompleteKhatmDay() {
    var portion = getTodayPortion();
    if (!portion || !khatm) return;
    if (portion.finished) {
      khatm.surahIdx = 0;
      khatm.ayahIdx = 0;
      khatm.active = false;
    } else {
      khatm.surahIdx = portion.endPos.surahIdx;
      khatm.ayahIdx = portion.endPos.ayahIdx;
    }
    saveKhatm();
    showToast('Jour ' + portion.dayNumber + ' complété ✓');
    closeMinReader();
  }

  function initMinReader() {
    // Triangle button in QURAN tab
    var minModeBtn = $('min-mode-btn');
    if (minModeBtn) {
      minModeBtn.classList.add('min-pulse');
      minModeBtn.addEventListener('click', function() {
        openMinHub();
      });
    }

    // Tab bar center triangle
    var tabBarMin = $('tab-bar-minimal');
    if (tabBarMin) {
      tabBarMin.classList.add('min-pulse');
      tabBarMin.addEventListener('click', function() {
        openMinHub();
      });
    }

    // MOI Minimal item
    var moiMinimal = $('moi-minimal');
    if (moiMinimal) moiMinimal.addEventListener('click', function() { openMinHub(); });

    // Hub back
    var minHubBack = $('min-hub-back');
    if (minHubBack) minHubBack.addEventListener('click', function() { closeMinHub(); });

    // Picker back (surah → hub)
    var minPickerBack = $('min-picker-back');
    if (minPickerBack) minPickerBack.addEventListener('click', function() { closeMinSurahPicker(); });

    // Verse picker back (verse → surah)
    var minVpickerBack = $('min-vpicker-back');
    if (minVpickerBack) minVpickerBack.addEventListener('click', function() { closeMinVersePicker(); });

    // Hub items
    var minHubKhatm = $('min-hub-khatm');
    if (minHubKhatm) minHubKhatm.addEventListener('click', function() {
      if (khatm && khatm.active && khatm.surahIdx !== undefined) {
        state.minContext = 'khatm';
        openMinReader(khatm.surahIdx, khatm.ayahIdx || 0);
      } else {
        // No active khatm → open wizard to create one, then redirect to minimal
        kwFromMinimal = true;
        closeMinHub();
        openKhatmWizard();
      }
    });
    var minHubLibre = $('min-hub-libre');
    if (minHubLibre) minHubLibre.addEventListener('click', function() {
      openMinSurahPicker();
    });

    // Hub prefs
    document.querySelectorAll('#min-theme-btns .min-pref-opt').forEach(function(btn) {
      btn.addEventListener('click', function() { state.minTheme = btn.dataset.minTheme; saveState(); renderMinHubPrefs(); applyMinThemeToHub(); });
    });
    document.querySelectorAll('#min-lang-btns .min-pref-opt').forEach(function(btn) {
      btn.addEventListener('click', function() { state.minLang = btn.dataset.minLang; saveState(); renderMinHubPrefs(); });
    });
    document.querySelectorAll('#min-mode-btns .min-pref-opt').forEach(function(btn) {
      btn.addEventListener('click', function() { state.minMode = btn.dataset.minMode; saveState(); renderMinHubPrefs(); });
    });
    document.querySelectorAll('#min-riwaya-btns .min-pref-opt').forEach(function(btn) {
      btn.addEventListener('click', function() {
        state.riwaya = btn.dataset.riwaya;
        saveState();
        switchRiwaya(state.riwaya).then(function() { renderMinHubPrefs(); });
      });
    });
    document.querySelectorAll('#min-size-btns .min-pref-opt').forEach(function(btn) {
      btn.addEventListener('click', function() { state.minSize = parseInt(btn.dataset.minSize); saveState(); renderMinHubPrefs(); });
    });

    // Reset khatm from hub
    var minResetKhatmBtn = $('min-reset-khatm-btn');
    if (minResetKhatmBtn) {
      minResetKhatmBtn.addEventListener('click', function() {
        openKhatmDeleteSheet(function() { updateMinHubItems(); });
      });
    }

    // Reader back
    var minReaderBack = $('min-reader-back');
    if (minReaderBack) minReaderBack.addEventListener('click', function(e) { e.stopPropagation(); closeMinReader(); });

    // Complete day button
    var minCompleteBtn = $('min-complete-btn');
    if (minCompleteBtn) minCompleteBtn.addEventListener('click', function(e) { e.stopPropagation(); minCompleteKhatmDay(); });

    // Reader touch navigation (tap + swipe)
    var readerEl = $('min-reader-overlay');
    if (readerEl) {
      var _tx = 0, _ty = 0, _moved = false;
      readerEl.addEventListener('touchstart', function(e) {
        _tx = e.touches[0].clientX;
        _ty = e.touches[0].clientY;
        _moved = false;
      }, { passive: true });
      readerEl.addEventListener('touchmove', function(e) {
        var dx = Math.abs(e.touches[0].clientX - _tx);
        var dy = Math.abs(e.touches[0].clientY - _ty);
        if (dx > 8 || dy > 8) _moved = true;
      }, { passive: true });
      readerEl.addEventListener('touchend', function(e) {
        var ex = e.changedTouches[0].clientX;
        var ey = e.changedTouches[0].clientY;
        var dx = ex - _tx, dy = ey - _ty;
        var adx = Math.abs(dx), ady = Math.abs(dy);
        if (e.target.closest('#min-reader-back') || e.target.closest('#min-complete-btn')) return;
        if (!_moved) {
          // Tap
          if (ex < window.innerWidth / 2) minPrevVerse(); else minNextVerse();
        } else if (adx > 40 && adx > ady) {
          // Horizontal swipe only → change verse (vertical = scroll natif)
          if (dx < 0) minNextVerse(); else minPrevVerse();
        }
      }, { passive: true });
      // Desktop click
      readerEl.addEventListener('click', function(e) {
        if ('ontouchstart' in window) return;
        if (e.target.closest('#min-reader-back') || e.target.closest('#min-complete-btn')) return;
        if (e.clientX < window.innerWidth / 2) minPrevVerse(); else minNextVerse();
      });
    }
  }

  // ====== FEATURE 1: Share Verse as Image (Canvas API) ======
  var _shareAyahCache = null;

  function _openShareChoice() {
    var sheet = $("share-choice-sheet");
    if (sheet) sheet.classList.remove("hidden");
  }
  function _closeShareChoice() {
    var sheet = $("share-choice-sheet");
    if (sheet) sheet.classList.add("hidden");
  }

  function _shareAsText(ayah) {
    var ref = "Sourate " + ayah.surahNameFr + " \u2014 Verset " + ayah.ayahNumber;
    var text = ayah.text + "\n\n" + ref;
    if (navigator.share) {
      navigator.share({ title: "Qurani", text: text }).catch(function () {});
    } else {
      navigator.clipboard.writeText(text).then(function () {
        showToast("Verset copi\u00e9");
      }).catch(function () {
        showToast("Impossible de copier");
      });
    }
  }

  function _shareAsImage(ayah) {
    var canvas = $("share-canvas");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w = 1080, h = 1080;
    canvas.width = w;
    canvas.height = h;

    // Gradient background
    var grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#0d4f4f");
    grad.addColorStop(1, "#0a1a3a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Decorative border
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    // Arabic text
    ctx.fillStyle = "#ffffff";
    ctx.font = "36px 'Amiri', 'Traditional Arabic', serif";
    ctx.textAlign = "center";
    ctx.direction = "rtl";
    _wrapText(ctx, ayah.text, w / 2, 340, w - 160, 56);

    // French translation
    if (ayah.textFr) {
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.font = "20px sans-serif";
      ctx.direction = "ltr";
      _wrapText(ctx, ayah.textFr, w / 2, 680, w - 160, 32);
    }

    // Reference
    var ref = "Sourate " + ayah.surahNameFr + " \u2014 Verset " + ayah.ayahNumber;
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "600 18px sans-serif";
    ctx.direction = "ltr";
    ctx.textAlign = "center";
    ctx.fillText(ref, w / 2, h - 120);

    // Watermark
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("QURANI", w / 2, h - 60);

    canvas.toBlob(function (blob) {
      if (!blob) { showToast("Erreur de g\u00e9n\u00e9ration"); return; }
      var file = new File([blob], "qurani-verset.png", { type: "image/png" });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: "Qurani" }).catch(function () {});
      } else {
        // Fallback: download
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "qurani-verset.png";
        a.click();
        setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
        showToast("Image t\u00e9l\u00e9charg\u00e9e");
      }
    }, "image/png");
  }

  function _wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = text.split(" ");
    var line = "";
    var lines = [];
    for (var i = 0; i < words.length; i++) {
      var test = line + words[i] + " ";
      if (ctx.measureText(test).width > maxWidth && line !== "") {
        lines.push(line.trim());
        line = words[i] + " ";
      } else {
        line = test;
      }
    }
    if (line.trim()) lines.push(line.trim());
    // Limit to 8 lines
    if (lines.length > 8) {
      lines = lines.slice(0, 8);
      lines[7] = lines[7] + "...";
    }
    for (var j = 0; j < lines.length; j++) {
      ctx.fillText(lines[j], x, y + j * lineHeight);
    }
  }

  function initShareChoice() {
    var backdrop = $("share-choice-backdrop");
    if (backdrop) backdrop.addEventListener("click", _closeShareChoice);
    var textBtn = $("share-as-text");
    if (textBtn) {
      textBtn.addEventListener("click", function () {
        _closeShareChoice();
        if (_shareAyahCache) _shareAsText(_shareAyahCache);
      });
    }
    var imgBtn = $("share-as-image");
    if (imgBtn) {
      imgBtn.addEventListener("click", function () {
        _closeShareChoice();
        if (_shareAyahCache) _shareAsImage(_shareAyahCache);
      });
    }
  }

  // ====== FEATURE 2: Daily Verse on Dashboard ======
  function getDailyVerseIndex() {
    var now = new Date();
    var epoch = new Date(2000, 0, 1);
    var daysSinceEpoch = Math.floor((now.getTime() - epoch.getTime()) / 86400000);
    return daysSinceEpoch % totalAyat;
  }

  function updateDailyVerse() {
    if (!surahs || surahs.length === 0 || totalAyat === 0) return;
    var idx = getDailyVerseIndex();
    var ayah = getAyahByGlobalIndex(idx);
    if (!ayah) return;
    // Skip basmala — pick next verse instead
    if (ayah.isBasmala) {
      idx = (idx + 1) % totalAyat;
      ayah = getAyahByGlobalIndex(idx);
      if (!ayah) return;
    }
    var arEl = $("dash-daily-verse-ar");
    var frEl = $("dash-daily-verse-fr");
    var refEl = $("dash-daily-verse-ref");
    if (arEl) {
      arEl.textContent = ayah.text;
    }
    if (frEl) {
      frEl.textContent = ayah.textFr || "";
    }
    if (refEl) {
      refEl.textContent = ayah.surahNameFr + " — " + ayah.ayahNumber;
    }
    var card = $("dash-daily-verse");
    if (card && !card._dvBound) {
      card._dvBound = true;
      card.addEventListener("click", function () {
        // Navigate to verse in surah player
        var a = getAyahByGlobalIndex(getDailyVerseIndex());
        if (!a) return;
        var si = surahs.findIndex(function (s) { return s.surahNumber === a.surahNumber; });
        if (si >= 0) {
          openSurahPlayer(si);
          setTimeout(function () {
            var target = document.querySelector("#sp-reader-content .sp-verse[data-i='" + (a.ayahNumber) + "']");
            if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 200);
        }
      });
    }
  }

  // ====== FEATURE 3: Hifz Quiz Mode ======
  var quizScore = 0;
  var quizCurrentBlanks = [];
  var quizCurrentCorrectWord = "";
  var quizBlanksRemaining = 0;

  function openQuizOverlay() {
    var overlay = $("quiz-overlay");
    if (overlay) overlay.classList.remove("hidden");
    quizScore = 0;
    var scoreEl = $("quiz-score");
    if (scoreEl) scoreEl.textContent = "0";
    generateQuizQuestion();
  }

  function closeQuizOverlay() {
    var overlay = $("quiz-overlay");
    if (overlay) overlay.classList.add("hidden");
  }

  function generateQuizQuestion() {
    if (!surahs || surahs.length === 0) return;
    // Pick a random surah and verse
    var surahIdx = Math.floor(Math.random() * surahs.length);
    var s = surahs[surahIdx];
    var ayahIdx = Math.floor(Math.random() * s.ayahs.length);
    // Skip basmala
    if (s.surahNumber !== 1 && s.surahNumber !== 9 && ayahIdx === 0) ayahIdx = 1;
    if (ayahIdx >= s.ayahs.length) ayahIdx = s.ayahs.length - 1;

    var text = s.ayahs[ayahIdx];
    var words = text.split(/\s+/).filter(function (w) { return w.length > 0; });
    if (words.length < 5) {
      // Try again with a longer verse
      generateQuizQuestion();
      return;
    }

    // Pick 3 random word positions to blank out
    var positions = [];
    var available = [];
    for (var i = 0; i < words.length; i++) available.push(i);
    // Shuffle
    for (var j = available.length - 1; j > 0; j--) {
      var k = Math.floor(Math.random() * (j + 1));
      var tmp = available[j]; available[j] = available[k]; available[k] = tmp;
    }
    var blanksCount = Math.min(3, Math.floor(words.length / 3));
    if (blanksCount < 1) blanksCount = 1;
    positions = available.slice(0, blanksCount).sort(function (a, b) { return a - b; });

    quizCurrentBlanks = positions.map(function (p) { return { pos: p, word: words[p], answered: false }; });
    quizBlanksRemaining = quizCurrentBlanks.length;

    // Render verse with blanks
    var verseEl = $("quiz-verse");
    if (verseEl) {
      var html = "";
      for (var w = 0; w < words.length; w++) {
        var isBlank = positions.indexOf(w) !== -1;
        if (isBlank) {
          html += '<span class="quiz-blank" data-pos="' + w + '">' + words[w] + '</span> ';
        } else {
          html += words[w] + " ";
        }
      }
      verseEl.innerHTML = html;
    }

    // Reference
    var displayNum = (s.surahNumber !== 1 && s.surahNumber !== 9) ? ayahIdx : ayahIdx + 1;
    var refEl = $("quiz-ref");
    if (refEl) refEl.textContent = (SURAH_NAMES_FR[s.surahNumber] || "Sourate " + s.surahNumber) + " \u2014 Verset " + displayNum;

    // Show first blank's choices
    _showQuizChoicesForBlank(0);

    var nextBtn = $("quiz-next");
    if (nextBtn) nextBtn.style.display = "none";
  }

  function _showQuizChoicesForBlank(blankIdx) {
    if (blankIdx >= quizCurrentBlanks.length) {
      // All blanks answered
      var nextBtn = $("quiz-next");
      if (nextBtn) nextBtn.style.display = "block";
      return;
    }
    var blank = quizCurrentBlanks[blankIdx];
    quizCurrentCorrectWord = blank.word;

    // Generate 3 distractors from random verses
    var distractors = [];
    var attempts = 0;
    while (distractors.length < 3 && attempts < 50) {
      var rsi = Math.floor(Math.random() * surahs.length);
      var rai = Math.floor(Math.random() * surahs[rsi].ayahs.length);
      var rwords = surahs[rsi].ayahs[rai].split(/\s+/);
      var rw = rwords[Math.floor(Math.random() * rwords.length)];
      if (rw && rw !== blank.word && distractors.indexOf(rw) === -1) {
        distractors.push(rw);
      }
      attempts++;
    }

    var choices = distractors.concat([blank.word]);
    // Shuffle choices
    for (var i = choices.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = choices[i]; choices[i] = choices[j]; choices[j] = tmp;
    }

    var choicesEl = $("quiz-choices");
    if (choicesEl) {
      choicesEl.innerHTML = "";
      choices.forEach(function (c) {
        var btn = document.createElement("button");
        btn.className = "quiz-choice-btn";
        btn.textContent = c;
        btn.addEventListener("click", function () {
          _handleQuizChoice(c, blankIdx, choicesEl);
        });
        choicesEl.appendChild(btn);
      });
    }

    // Highlight current blank
    var blankEls = document.querySelectorAll("#quiz-verse .quiz-blank");
    blankEls.forEach(function (el) { el.style.background = ""; });
    var currentBlankEl = document.querySelector('#quiz-verse .quiz-blank[data-pos="' + blank.pos + '"]');
    if (currentBlankEl) currentBlankEl.style.background = "rgba(52,211,153,0.15)";
  }

  function _handleQuizChoice(chosen, blankIdx, choicesEl) {
    var blank = quizCurrentBlanks[blankIdx];
    var blankEl = document.querySelector('#quiz-verse .quiz-blank[data-pos="' + blank.pos + '"]');
    var correct = chosen === blank.word;

    if (correct) {
      quizScore++;
      if (blankEl) { blankEl.classList.add("quiz-filled"); blankEl.style.background = ""; }
      var scoreEl = $("quiz-score");
      if (scoreEl) scoreEl.textContent = quizScore;
    } else {
      if (blankEl) { blankEl.classList.add("quiz-wrong"); blankEl.style.background = ""; }
    }

    // Disable all choice buttons + highlight
    var btns = choicesEl.querySelectorAll(".quiz-choice-btn");
    btns.forEach(function (b) {
      b.classList.add("quiz-disabled");
      if (b.textContent === blank.word) b.classList.add("quiz-correct");
      else if (b.textContent === chosen && !correct) b.classList.add("quiz-incorrect");
    });

    quizBlanksRemaining--;
    // Move to next blank after short delay
    setTimeout(function () {
      _showQuizChoicesForBlank(blankIdx + 1);
    }, 800);
  }

  function initQuiz() {
    var quizItem = $("moi-quiz");
    if (quizItem) {
      quizItem.addEventListener("click", function () {
        openQuizOverlay();
      });
    }
    var closeBtn = $("quiz-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeQuizOverlay);
    }
    var nextBtn = $("quiz-next");
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        generateQuizQuestion();
      });
    }
  }

  // ====== FEATURE 4: Thematic Search ======
  function initThematicSearch() {
    var tagsEl = $("qs-themes-tags");
    if (!tagsEl) return;
    tagsEl.querySelectorAll(".qs-theme-tag").forEach(function (tag) {
      tag.addEventListener("click", function () {
        var arKeyword = tag.dataset.themeAr;
        if (!arKeyword) return;
        // Toggle active
        tagsEl.querySelectorAll(".qs-theme-tag").forEach(function (t) { t.classList.remove("active"); });
        tag.classList.add("active");
        // Set search input and call performSearch directly
        var inp = $("search-input");
        if (inp) inp.value = arKeyword;
        if (typeof _performSearch === "function") {
          _performSearch(arKeyword);
        }
      });
    });
  }

  // ====== FEATURE 5: Hijri Calendar on Dashboard ======
  var ISLAMIC_EVENTS = [
    { month: 1, day: 1, name: "Nouvel An Islamique" },
    { month: 1, day: 10, name: "Achoura" },
    { month: 3, day: 12, name: "Mawlid an-Nabi" },
    { month: 7, day: 27, name: "Isra et Mi\u2019raj" },
    { month: 8, day: 15, name: "Nuit du pardon (Bara\u2019ah)" },
    { month: 9, day: 1, name: "D\u00e9but du Ramadan" },
    { month: 9, day: 27, name: "Nuit du Destin (Laylat al-Qadr)" },
    { month: 10, day: 1, name: "A\u00efd al-Fitr" },
    { month: 12, day: 8, name: "Jour de Arafat (veille)" },
    { month: 12, day: 10, name: "A\u00efd al-Adha" }
  ];

  function updateHijriCard() {
    var now = new Date();
    var hijri = _getHijriDate(now);
    var dateEl = $("dash-hijri-date");
    var eventEl = $("dash-hijri-event");
    var dayTypeEl = $("dash-hijri-daytype");

    if (dateEl) {
      dateEl.textContent = hijri.day + " " + hijri.monthName + " " + hijri.year + " H";
    }

    // Day type indicators
    var dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, 4=Thu
    var hints = [];
    if (dayOfWeek === 1 || dayOfWeek === 4) {
      hints.push("Je\u00fbne recommand\u00e9 (lundi/jeudi)");
    }
    if (hijri.day === 13 || hijri.day === 14 || hijri.day === 15) {
      hints.push("Jours blancs \u2014 je\u00fbne recommand\u00e9");
    }
    if (dayTypeEl) dayTypeEl.textContent = hints.join(" \u00b7 ");

    // Next Islamic event
    if (eventEl) {
      var nextEvent = _getNextIslamicEvent(hijri);
      if (nextEvent) {
        eventEl.textContent = nextEvent.name + (nextEvent.daysLeft > 0 ? " dans " + nextEvent.daysLeft + " jour" + (nextEvent.daysLeft > 1 ? "s" : "") : " \u2014 aujourd\u2019hui");
      } else {
        eventEl.textContent = "";
      }
    }
  }

  function _getNextIslamicEvent(hijri) {
    var current = hijri.month * 100 + hijri.day;
    var best = null;
    var bestDist = 9999;
    for (var i = 0; i < ISLAMIC_EVENTS.length; i++) {
      var ev = ISLAMIC_EVENTS[i];
      var evCode = ev.month * 100 + ev.day;
      var dist;
      if (evCode >= current) {
        dist = _hijriDayDiff(hijri.month, hijri.day, ev.month, ev.day);
      } else {
        // Next year
        dist = _hijriDayDiff(hijri.month, hijri.day, ev.month + 12, ev.day);
      }
      if (dist < bestDist) {
        bestDist = dist;
        best = { name: ev.name, daysLeft: dist };
      }
    }
    return best;
  }

  function _hijriDayDiff(m1, d1, m2, d2) {
    // Approximate: each Hijri month ~ 29.5 days
    return Math.round((m2 - m1) * 29.5 + (d2 - d1));
  }

  // ====== FEATURE 6: Synced Audio Highlight (estimate-based for full surah audio) ======
  function initAudioEstimateHighlight() {
    var audioEl = $("sp-audio-el");
    if (!audioEl) return;
    audioEl.addEventListener("timeupdate", function () {
      // Only do estimate-based highlighting when playing full surah (no per-verse playlist)
      if (!spIsPlaying) return;
      if (spPlaylist && spPlaylist.length > 0) return; // per-verse already handles highlighting
      var duration = audioEl.duration;
      var current = audioEl.currentTime;
      if (!duration || isNaN(duration) || duration <= 0) return;
      var si = spCurrentSurahIdx;
      if (si < 0 || si >= surahs.length) return;
      var verseCount = surahs[si].ayahs.length;
      if (verseCount <= 0) return;
      var estimatedIdx = Math.floor((current / duration) * verseCount);
      if (estimatedIdx >= verseCount) estimatedIdx = verseCount - 1;
      if (estimatedIdx < 0) estimatedIdx = 0;
      if (estimatedIdx !== spCurrentVerseI) {
        spSetActiveVerse(estimatedIdx);
      }
    });
  }

  // ====== FEATURE 7: Export/Import User Data ======
  function exportUserData() {
    var data = {};
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.indexOf("qurani-") === 0) {
        data[key] = localStorage.getItem(key);
      }
    }
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "qurani-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
    showToast("Donn\u00e9es export\u00e9es");
  }

  function importUserData() {
    var input = $("import-file-input");
    if (!input) return;
    input.value = "";
    input.click();
  }

  function _handleImportFile(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var data = JSON.parse(e.target.result);
        var count = 0;
        for (var key in data) {
          if (data.hasOwnProperty(key) && key.indexOf("qurani-") === 0) {
            localStorage.setItem(key, data[key]);
            count++;
          }
        }
        showToast(count + " cl\u00e9s restaur\u00e9es. Rechargement...");
        setTimeout(function () { location.reload(); }, 1500);
      } catch (err) {
        showToast("Fichier invalide");
      }
    };
    reader.readAsText(file);
  }

  function initExportImport() {
    var exportBtn = $("moi-set-export");
    if (exportBtn) exportBtn.addEventListener("click", exportUserData);
    var importBtn = $("moi-set-import");
    if (importBtn) importBtn.addEventListener("click", importUserData);
    var fileInput = $("import-file-input");
    if (fileInput) {
      fileInput.addEventListener("change", function () {
        if (this.files && this.files[0]) _handleImportFile(this.files[0]);
      });
    }
  }

  // ====== FEATURE 8: Daily Goal Widget on Dashboard ======
  function updateDashGoalWidget() {
    var totalToRead = totalAyat * state.khatmaGoal;
    var dayTargets = computeDayTargets(totalToRead);
    var dayIndex = getDayIndex(state.startDate);
    var todayTarget = dayTargets[dayIndex - 1] || 1;
    var todayRead = state.todayReadCount || 0;

    var ringFill = $("dash-goal-ring-fill");
    var ringText = $("dash-goal-ring-text");
    var subEl = $("dash-goal-sub");

    if (ringText) ringText.textContent = todayRead + "/" + todayTarget;

    // SVG ring: circumference = 2 * PI * 52 = 326.73
    var circumference = 326.73;
    var pct = Math.min(todayRead / Math.max(todayTarget, 1), 1);
    var offset = circumference * (1 - pct);
    if (ringFill) ringFill.setAttribute("stroke-dashoffset", offset);

    if (subEl) {
      if (pct >= 1) {
        subEl.textContent = "Objectif atteint ! Baraka Llahu fik";
        subEl.style.color = "#34d399";
      } else {
        var remaining = todayTarget - todayRead;
        subEl.textContent = remaining + " verset" + (remaining > 1 ? "s" : "") + " restant" + (remaining > 1 ? "s" : "");
        subEl.style.color = "";
      }
    }
  }

  // ====== FEATURE 9: Prayer-based Auto Night Mode ======
  function _getPrayerThemeEffective() {
    // Check cached prayer times for Maghrib and Fajr
    if (prayerTimesCache && prayerTimesCache.Maghrib && prayerTimesCache.Fajr) {
      var now = new Date();
      var nowMin = now.getHours() * 60 + now.getMinutes();
      var maghribParts = (prayerTimesCache.Maghrib + "").split(":");
      var fajrParts = (prayerTimesCache.Fajr + "").split(":");
      var maghribMin = parseInt(maghribParts[0]) * 60 + (parseInt(maghribParts[1]) || 0);
      var fajrMin = parseInt(fajrParts[0]) * 60 + (parseInt(fajrParts[1]) || 0);
      if (!isNaN(maghribMin) && !isNaN(fajrMin)) {
        // Between Maghrib and midnight, or between midnight and Fajr
        if (nowMin >= maghribMin || nowMin < fajrMin) {
          return "dark";
        }
        return "light";
      }
    }
    // Fallback: rough estimate (19h-5h = dark)
    var h = new Date().getHours();
    return (h >= 19 || h < 5) ? "dark" : "light";
  }

  // ====== CHANGELOG / NOUVEAUTÉS ======
  var CHANGELOG = [
    {
      version: "3.7.0",
      date: "9 avril 2026",
      title: "Mérites des invocations",
      entries: [
        { type: "feat", text: "Récompenses & mérites — chaque invocation affiche désormais sa récompense et sa signification spirituelle, basées sur les hadiths authentiques" },
        { type: "feat", text: "Toutes les catégories couvertes — matin, soir, dormir, protection, tristesse, voyage, prière, et bien d\u2019autres" }
      ]
    },
    {
      version: "3.6.0",
      date: "4 avril 2026",
      title: "9 nouvelles fonctionnalités",
      entries: [
        { type: "feat", text: "Partage de versets en image — générez une belle image à partager sur vos réseaux" },
        { type: "feat", text: "Verset du jour — un nouveau verset chaque jour sur votre tableau de bord" },
        { type: "feat", text: "Quiz Hifz — testez votre mémorisation avec des mots manquants" },
        { type: "feat", text: "Recherche thématique — trouvez les versets par thème (patience, paradis, prière…)" },
        { type: "feat", text: "Calendrier Hijri — date islamique, jours de jeûne et prochains événements" },
        { type: "feat", text: "Audio synchronisée — le verset en cours est surligné pendant l'écoute" },
        { type: "feat", text: "Export / Import — sauvegardez et restaurez toutes vos données" },
        { type: "feat", text: "Objectif du jour — suivez votre progression quotidienne avec un anneau visuel" },
        { type: "feat", text: "Mode nuit Prière — bascule automatique jour/nuit selon les horaires de prière" }
      ]
    },
    {
      version: "3.5.0",
      date: "28 mars 2026",
      title: "Lecteur audio amélioré",
      entries: [
        { type: "feat", text: "6 récitateurs disponibles avec sélection rapide" },
        { type: "feat", text: "Lecture continue sourate par sourate sans interruption" },
        { type: "fix", text: "Correction du lecteur audio sur certains appareils Android" },
        { type: "perf", text: "Chargement plus rapide des fichiers audio" }
      ]
    },
    {
      version: "3.4.0",
      date: "15 mars 2026",
      title: "Mode Minimal & Concentration",
      entries: [
        { type: "feat", text: "Mode Minimal — lecture verset par verset, épurée et immersive" },
        { type: "feat", text: "Hub de lecture avec choix Khatm ou Libre" },
        { type: "feat", text: "Personnalisation du thème, taille et mode dans le hub" },
        { type: "fix", text: "Meilleure gestion du scroll dans le lecteur de sourate" }
      ]
    },
    {
      version: "3.3.0",
      date: "1 mars 2026",
      title: "Zakat, Testament & Héritage",
      entries: [
        { type: "feat", text: "Calculateur de Zakat al-Mal avec historique et suivi annuel" },
        { type: "feat", text: "Générateur de testament islamique (Wasiyya)" },
        { type: "feat", text: "Calcul des parts d'héritage selon le droit islamique" },
        { type: "perf", text: "Optimisation du chargement initial de l'application" }
      ]
    },
    {
      version: "3.2.0",
      date: "10 février 2026",
      title: "Ayati — Shazam du Coran",
      entries: [
        { type: "feat", text: "Reconnaissance vocale du Coran — identifiez n'importe quel verset récité" },
        { type: "feat", text: "Modèle IA embarqué fonctionnant 100% hors-ligne" },
        { type: "feat", text: "Mode suivi de récitation en temps réel" }
      ]
    },
    {
      version: "3.1.0",
      date: "20 janvier 2026",
      title: "Horaires de prière & Qibla",
      entries: [
        { type: "feat", text: "Horaires de prière avec géolocalisation automatique" },
        { type: "feat", text: "Support Mawaqit pour les horaires de votre mosquée" },
        { type: "feat", text: "Boussole Qibla en temps réel" },
        { type: "feat", text: "Notifications de rappel pour chaque prière" }
      ]
    },
    {
      version: "3.0.0",
      date: "1 janvier 2026",
      title: "Qurani 3 — Refonte complète",
      entries: [
        { type: "feat", text: "Nouveau design glassmorphique avec thèmes Jour, Nuit et Sépia" },
        { type: "feat", text: "Système de Khatm — lisez le Coran en 30 à 240 jours" },
        { type: "feat", text: "Mode Tajwid avec couleurs et légende des règles" },
        { type: "feat", text: "Lecture Warsh en plus de Hafs" },
        { type: "feat", text: "Synchronisation cloud avec Apple et Google Sign-In" },
        { type: "feat", text: "Invocations authentiques avec 12+ catégories" },
        { type: "feat", text: "Apple Watch — horaires de prière au poignet" },
        { type: "perf", text: "Application progressive (PWA) 100% fonctionnelle hors-ligne" }
      ]
    },
    {
      version: "2.0.0",
      date: "15 septembre 2025",
      title: "Première version publique",
      entries: [
        { type: "feat", text: "Lecture du Coran complet en arabe avec traduction française" },
        { type: "feat", text: "Système de favoris et signets" },
        { type: "feat", text: "Notes personnelles sur les versets" },
        { type: "feat", text: "Statistiques de lecture et compteur de hassanates" }
      ]
    }
  ];

  var CHANGELOG_SEEN_KEY = "qurani-changelog-seen";

  function getLastSeenVersion() {
    return localStorage.getItem(CHANGELOG_SEEN_KEY) || "";
  }

  function setChangelogSeen() {
    if (CHANGELOG.length > 0) {
      localStorage.setItem(CHANGELOG_SEEN_KEY, CHANGELOG[0].version);
    }
  }

  function hasUnseenChangelog() {
    return getLastSeenVersion() !== (CHANGELOG.length > 0 ? CHANGELOG[0].version : "");
  }

  function updateWhatsNewBanner() {
    var el = $("dash-whatsnew");
    var textEl = $("dash-whatsnew-text");
    var badgeEl = $("dash-whatsnew-badge");
    if (!el || !textEl) return;

    if (CHANGELOG.length === 0) { el.classList.add("hidden"); return; }

    var latest = CHANGELOG[0];
    var isNew = hasUnseenChangelog();

    textEl.textContent = latest.title + " — v" + latest.version;
    if (badgeEl) {
      badgeEl.textContent = isNew ? "NOUVEAU" : "MIS À JOUR";
      badgeEl.classList.toggle("new", isNew);
      badgeEl.classList.toggle("seen", !isNew);
    }
    el.classList.remove("hidden");
  }

  function renderChangelog() {
    var body = $("changelog-body");
    if (!body) return;
    body.innerHTML = "";

    for (var v = 0; v < CHANGELOG.length; v++) {
      var release = CHANGELOG[v];
      var section = document.createElement("div");
      section.className = "changelog-version";

      // Header
      var header = document.createElement("div");
      header.className = "changelog-version-header";
      var tag = document.createElement("span");
      tag.className = "changelog-version-tag";
      tag.textContent = "v" + release.version;
      var date = document.createElement("span");
      date.className = "changelog-version-date";
      date.textContent = release.date;
      header.appendChild(tag);
      header.appendChild(date);
      section.appendChild(header);

      // Title
      var title = document.createElement("div");
      title.className = "changelog-version-title";
      title.textContent = release.title;
      section.appendChild(title);

      // Entries
      var list = document.createElement("ul");
      list.className = "changelog-entries";
      for (var e = 0; e < release.entries.length; e++) {
        var entry = release.entries[e];
        var li = document.createElement("li");
        li.className = "changelog-entry";

        var icon = document.createElement("span");
        icon.className = "changelog-entry-icon " + entry.type;
        icon.textContent = "";

        var text = document.createElement("span");
        text.className = "changelog-entry-text";
        text.textContent = entry.text;

        li.appendChild(icon);
        li.appendChild(text);
        list.appendChild(li);
      }
      section.appendChild(list);

      body.appendChild(section);

      // Separator between versions
      if (v < CHANGELOG.length - 1) {
        var sep = document.createElement("div");
        sep.className = "changelog-sep";
        body.appendChild(sep);
      }
    }
  }

  function openChangelogOverlay() {
    renderChangelog();
    setChangelogSeen();
    updateWhatsNewBanner();
    $("changelog-overlay").classList.remove("hidden");
  }

  function initChangelog() {
    updateWhatsNewBanner();

    var banner = $("dash-whatsnew");
    if (banner) {
      banner.addEventListener("click", openChangelogOverlay);
    }

    var closeBtn = $("changelog-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        $("changelog-overlay").classList.add("hidden");
      });
    }
  }

  // ====== INIT ALL NEW FEATURES ======
  function initNewFeatures() {
    initChangelog();
    initShareChoice();
    initQuiz();
    initExportImport();
    initAudioEstimateHighlight();
    updateDailyVerse();
    updateHijriCard();
    updateDashGoalWidget();

    // Thematic search tags
    initThematicSearch();

    // Prayer theme auto-check every minute
    if (state.theme === "prayer") {
      setInterval(function () {
        if (state.theme === "prayer") applyTheme();
      }, 60000);
    }
  }

  init();
  initFirebase();
  initMinReader();
  initNewFeatures();
})();
