/* ============================================
   AYAT — app.js
   Pure vanilla JS, zero dependencies
   ============================================ */

(function () {
  "use strict";

  // ---- DATA ----
  let surahs = [];
  let totalAyat = 0;

  // ---- STATE ----
  const STORAGE_KEY = "ayat-app-state";
  let state = null;
  let goalDismissed = false;

  // ---- DOM refs ----
  const $ = (id) => document.getElementById(id);

  // ---- UTILS ----
  function getLocalDateStr() {
    const d = new Date();
    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0")
    );
  }

  function defaultState() {
    const today = getLocalDateStr();
    return {
      startDate: today,
      globalIndex: 0,
      cycleCount: 0,
      lastReadDate: today,
      todayReadCount: 0,
      khatmaGoal: 1,
      textSize: "M",
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const s = Object.assign(defaultState(), parsed);
      const today = getLocalDateStr();
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
    const start = new Date(startDate + "T00:00:00");
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffMs = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const dayIndex = diffDays + 1;
    if (dayIndex < 1) return 1;
    if (dayIndex > 30) return ((dayIndex - 1) % 30) + 1;
    return dayIndex;
  }

  function computeDayTargets(totalToRead) {
    const base = Math.floor(totalToRead / 30);
    const remainder = totalToRead % 30;
    const targets = [];
    for (let i = 0; i < 30; i++) {
      targets.push(i < remainder ? base + 1 : base);
    }
    return targets;
  }

  // ---- QURAN ACCESS ----
  function getAyahByGlobalIndex(globalIndex) {
    const idx = ((globalIndex % totalAyat) + totalAyat) % totalAyat;
    let count = 0;
    for (const surah of surahs) {
      if (idx < count + surah.ayahs.length) {
        const ayahIdx = idx - count;
        return {
          surahNumber: surah.surahNumber,
          surahNameAr: surah.surahNameAr,
          ayahNumber: ayahIdx + 1,
          text: surah.ayahs[ayahIdx],
        };
      }
      count += surah.ayahs.length;
    }
    return {
      surahNumber: 1,
      surahNameAr: surahs[0].surahNameAr,
      ayahNumber: 1,
      text: surahs[0].ayahs[0],
    };
  }

  // ---- RENDER ----
  function render() {
    const totalToRead = totalAyat * state.khatmaGoal;
    const dayTargets = computeDayTargets(totalToRead);
    const dayIndex = getDayIndex(state.startDate);
    const todayTarget = dayTargets[dayIndex - 1];
    const ayah = getAyahByGlobalIndex(state.globalIndex);

    // Header title
    $("header-title").textContent = todayTarget + " Ayat";

    // Ayah reference
    $("ayah-ref").textContent =
      ayah.surahNameAr + " — آية " + ayah.ayahNumber;

    // Ayah text
    const ayahEl = $("ayah-text");
    ayahEl.textContent = ayah.text;
    ayahEl.className =
      "ayah-text size-" + state.textSize;

    // Progress: today
    const todayPct = Math.min(
      (state.todayReadCount / Math.max(todayTarget, 1)) * 100,
      100
    );
    $("today-fill").style.width = todayPct + "%";
    $("today-label").textContent =
      state.todayReadCount + "/" + todayTarget;

    // Progress: khatma
    const cycleBase =
      state.khatmaGoal === 1 ? totalAyat : totalToRead;
    const currentCycleIndex = state.globalIndex % cycleBase;
    const khatmaPct = Math.min((currentCycleIndex / cycleBase) * 100, 100);
    $("khatma-fill").style.width = khatmaPct + "%";
    $("khatma-label").textContent = Math.round(khatmaPct) + "%";

    // Goal reached
    const goalReached = state.todayReadCount >= todayTarget;
    if (goalReached && !goalDismissed) {
      $("goal-reached").classList.remove("hidden");
    } else {
      $("goal-reached").classList.add("hidden");
    }

    // Settings sync
    $("cycle-count").textContent = state.cycleCount;
    document.querySelectorAll("#goal-buttons .setting-btn").forEach((btn) => {
      btn.classList.toggle(
        "active",
        Number(btn.dataset.goal) === state.khatmaGoal
      );
    });
    document.querySelectorAll("#size-buttons .setting-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.size === state.textSize);
    });
  }

  // ---- NAVIGATION ----
  function goNext() {
    const newIndex = state.globalIndex + 1;
    if (newIndex > 0 && newIndex % totalAyat === 0) {
      state.cycleCount++;
    }
    state.globalIndex = newIndex;
    state.todayReadCount++;
    state.lastReadDate = getLocalDateStr();
    saveState();
    fadeAndRender();
  }

  function goPrev() {
    if (state.globalIndex <= 0) return;
    state.globalIndex--;
    state.todayReadCount = Math.max(0, state.todayReadCount - 1);
    saveState();
    fadeAndRender();
  }

  function fadeAndRender() {
    const el = $("ayah-text");
    el.classList.add("fade-out");
    setTimeout(() => {
      render();
      el.classList.remove("fade-out");
    }, 150);
  }

  // ---- SWIPE ----
  let touchStartX = null;
  let touchStartY = null;

  function onTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function onTouchEnd(e) {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    touchStartX = null;
    touchStartY = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      // RTL: swipe left = next, swipe right = prev
      if (dx < 0) goNext();
      else goPrev();
    }
  }

  // ---- KEYBOARD ----
  function onKeyDown(e) {
    if (
      $("settings-overlay").classList.contains("hidden") === false ||
      $("about-overlay").classList.contains("hidden") === false
    )
      return;
    if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowDown" ||
      e.key === " "
    ) {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      goPrev();
    }
  }

  // ---- INIT ----
  async function init() {
    // Load Quran data
    try {
      const res = await fetch("quran.json");
      surahs = await res.json();
      totalAyat = surahs.reduce((sum, s) => sum + s.ayahs.length, 0);
    } catch (err) {
      document.body.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:100dvh;font-size:14px;color:#999;direction:rtl;">تعذّر تحميل بيانات القرآن</div>';
      return;
    }

    // Load state
    state = loadState();

    // Show app
    $("loading").classList.add("hidden");
    $("app").classList.remove("hidden");

    // Initial render
    render();

    // ---- EVENT LISTENERS ----

    // Next / prev
    $("next-btn").addEventListener("click", goNext);

    // Swipe
    $("ayah-container").addEventListener("touchstart", onTouchStart, {
      passive: true,
    });
    $("ayah-container").addEventListener("touchend", onTouchEnd);

    // Keyboard
    document.addEventListener("keydown", onKeyDown);

    // Goal continue
    $("continue-btn").addEventListener("click", () => {
      goalDismissed = true;
      $("goal-reached").classList.add("hidden");
    });

    // About
    $("about-link").addEventListener("click", (e) => {
      e.preventDefault();
      $("about-overlay").classList.remove("hidden");
    });
    $("about-close").addEventListener("click", () => {
      $("about-overlay").classList.add("hidden");
    });

    // Settings
    $("settings-btn").addEventListener("click", () => {
      render(); // sync
      $("settings-overlay").classList.remove("hidden");
    });
    $("settings-close").addEventListener("click", () => {
      $("settings-overlay").classList.add("hidden");
    });

    // Goal buttons
    document.querySelectorAll("#goal-buttons .setting-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.khatmaGoal = Number(btn.dataset.goal);
        saveState();
        render();
      });
    });

    // Size buttons
    document.querySelectorAll("#size-buttons .setting-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.textSize = btn.dataset.size;
        saveState();
        render();
      });
    });

    // Reset
    $("reset-btn").addEventListener("click", () => {
      if (confirm("إعادة تعيين كل شيء؟")) {
        state = defaultState();
        goalDismissed = false;
        saveState();
        render();
        $("settings-overlay").classList.add("hidden");
      }
    });

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  }

  // Go
  init();
})();
