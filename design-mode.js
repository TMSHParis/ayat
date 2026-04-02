/**
 * QURANI — Design Mode
 * Activé via ?design=1 dans l'URL
 * Permet de réordonner les blocs, ajuster marges, polices, espacements
 * et exporter le CSS résultant.
 */
(function () {
  'use strict';
  // Persiste via sessionStorage pour survivre aux reloads (SW peut stripper le ?design=1)
  if (window.location.search.includes('design=1')) {
    sessionStorage.setItem('dm_active', '1');
  }
  if (!sessionStorage.getItem('dm_active')) return;

  // ── Blocs réordonnables (IDs dans l'ordre initial) ──────────────────
  var BLOCK_IDS = [
    'dash-carousel',
    'dash-ramadan',
    'dash-reading-card',
    'dash-stats-section',
    'dash-hassanates-progress-line',
    'dash-emotion',
  ];

  // Séparateurs sans ID (on les exclut du drag mais ils restent sélectionnables)
  var state = {
    mode: 'select',   // 'select' | 'reorder'
    selected: null,
    changes: {},      // { selector: { prop: val } }
    dragEl: null,
    dragStartY: 0,
    dragCurrentY: 0,
    placeholder: null,
  };

  // ── CSS injecté ──────────────────────────────────────────────────────
  var css = `
    #dm-bar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 999999;
      background: rgba(8,8,8,0.96);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      display: flex; align-items: center; gap: 8px;
      padding: 8px 14px;
      padding-top: calc(8px + env(safe-area-inset-top, 0px));
      font-family: 'Space Mono', monospace;
      box-shadow: 0 2px 20px rgba(0,0,0,0.5);
    }
    #dm-title {
      color: #facc15; font-size: 9px; letter-spacing: 2px;
      text-transform: uppercase; flex: 1;
    }
    .dm-btn {
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px; color: rgba(255,255,255,0.7);
      font-size: 10px; padding: 5px 11px; cursor: pointer;
      font-family: 'Space Mono', monospace; letter-spacing: 0.5px;
      -webkit-tap-highlight-color: transparent; white-space: nowrap;
    }
    .dm-btn.active {
      background: rgba(250,204,21,0.15);
      border-color: rgba(250,204,21,0.6); color: #facc15;
    }
    .dm-btn.danger { border-color: rgba(239,68,68,0.4); color: rgba(239,68,68,0.8); }

    /* Panel flottant draggable */
    #dm-panel {
      position: fixed; left: 8px; right: 8px; z-index: 999998;
      bottom: 12px;
      background: rgba(10,10,10,0.98);
      backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 0;
      opacity: 0; pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s ease;
      transform: translateY(8px);
      max-height: 52vh; overflow: hidden;
      display: flex; flex-direction: column;
    }
    #dm-panel.open { opacity: 1; pointer-events: auto; transform: translateY(0); }

    /* Poignée de drag */
    #dm-drag-handle {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 14px 8px;
      cursor: grab; touch-action: none; user-select: none;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      flex-shrink: 0;
    }
    #dm-drag-handle:active { cursor: grabbing; }
    #dm-drag-pip {
      width: 32px; height: 4px; border-radius: 2px;
      background: rgba(255,255,255,0.2); margin: 0 auto;
    }
    #dm-panel-scroll {
      overflow-y: auto; padding: 12px 14px;
      padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
    }

    #dm-panel-name {
      font-size: 9px; letter-spacing: 2px; color: #facc15;
      text-transform: uppercase; font-family: 'Space Mono', monospace;
      margin-bottom: 2px;
    }
    #dm-panel-tag {
      font-size: 9px; color: rgba(255,255,255,0.3);
      font-family: 'Space Mono', monospace; margin-bottom: 12px;
    }
    .dm-close-panel {
      background: none; border: none; color: rgba(255,255,255,0.4);
      font-size: 18px; cursor: pointer; padding: 0 4px;
      -webkit-tap-highlight-color: transparent; line-height: 1;
    }

    /* Sliders */
    .dm-row {
      display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
    }
    .dm-lbl {
      font-size: 9px; letter-spacing: 1px; color: rgba(255,255,255,0.4);
      text-transform: uppercase; font-family: 'Space Mono', monospace;
      width: 72px; flex-shrink: 0;
    }
    .dm-slider {
      flex: 1; -webkit-appearance: none; height: 3px;
      background: rgba(255,255,255,0.12); border-radius: 2px; outline: none;
    }
    .dm-slider::-webkit-slider-thumb {
      -webkit-appearance: none; width: 22px; height: 22px;
      border-radius: 50%; background: #facc15; cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    }
    .dm-val {
      font-size: 10px; color: #fff; font-family: 'Space Mono', monospace;
      width: 36px; text-align: right; flex-shrink: 0;
    }
    .dm-reset {
      background: none; border: none; color: rgba(255,255,255,0.25);
      font-size: 14px; cursor: pointer; padding: 2px 4px;
      -webkit-tap-highlight-color: transparent; flex-shrink: 0;
    }
    .dm-reset:hover { color: rgba(255,255,255,0.6); }

    /* Highlight sélection */
    .dm-sel {
      outline: 2px solid rgba(250,204,21,0.8) !important;
      outline-offset: 3px !important;
    }

    /* Mode réorganisation */
    .dm-wrap {
      position: relative;
      touch-action: none;
    }
    .dm-wrap.dm-dragging { opacity: 0.35; }
    .dm-handle {
      position: absolute; left: -26px; top: 50%;
      transform: translateY(-50%);
      color: rgba(255,255,255,0.35); font-size: 16px;
      cursor: grab; padding: 8px 6px;
      -webkit-tap-highlight-color: transparent;
      user-select: none; z-index: 10;
    }
    .dm-ghost {
      position: fixed; left: 0; right: 0; z-index: 99997;
      pointer-events: none; opacity: 0.85;
      transition: none;
    }
    .dm-placeholder {
      background: rgba(250,204,21,0.07);
      border: 1.5px dashed rgba(250,204,21,0.3);
      border-radius: 12px; margin: 4px 0;
    }

    /* Toast */
    #dm-toast {
      position: fixed; top: 70px; left: 50%;
      transform: translateX(-50%) translateY(-8px);
      background: #facc15; color: #000;
      font-size: 10px; font-family: 'Space Mono', monospace;
      letter-spacing: 1px; padding: 7px 16px;
      border-radius: 20px; z-index: 1000000;
      opacity: 0; pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }
    #dm-toast.show {
      opacity: 1; transform: translateX(-50%) translateY(0);
    }

    /* Export box */
    #dm-export-box {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px; padding: 12px;
      font-size: 9.5px; color: rgba(255,255,255,0.6);
      font-family: 'Space Mono', monospace;
      white-space: pre; overflow-x: auto;
      line-height: 1.6; margin-top: 12px;
      max-height: 180px; overflow-y: auto;
    }
    #dm-copy-btn {
      margin-top: 12px; width: 100%; text-align: center;
      padding: 10px; border-radius: 10px;
    }

    /* Offset du contenu pour la toolbar */
    .dm-offset { padding-top: 56px !important; }
  `;

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── Toolbar ──────────────────────────────────────────────────────────
  var bar = document.createElement('div');
  bar.id = 'dm-bar';
  bar.innerHTML = `
    <span id="dm-title">⚡ Design Mode</span>
    <button class="dm-btn active" id="dm-sel-btn">Sélect.</button>
    <button class="dm-btn" id="dm-ord-btn">Ordre</button>
    <button class="dm-btn" id="dm-exp-btn">Export</button>
    <button class="dm-btn danger" id="dm-close-btn">✕</button>
  `;
  document.body.appendChild(bar);

  // ── Panel bas ────────────────────────────────────────────────────────
  var panel = document.createElement('div');
  panel.id = 'dm-panel';
  panel.innerHTML = `
    <div id="dm-drag-handle">
      <div id="dm-drag-pip"></div>
      <button class="dm-close-panel" id="dm-panel-close">×</button>
    </div>
    <div id="dm-panel-scroll">
      <div id="dm-panel-name"></div>
      <div id="dm-panel-tag"></div>
      <div id="dm-panel-body"></div>
    </div>
  `;
  document.body.appendChild(panel);

  // ── Drag du panel ─────────────────────────────────────────────────────
  (function() {
    var handle = document.getElementById('dm-drag-handle');
    var startY = 0, startBottom = 0, draggingPanel = false;

    function getPanelBottom() {
      return parseInt(panel.style.bottom) || 12;
    }

    handle.addEventListener('touchstart', function(e) {
      if (e.target.closest('#dm-panel-close')) return;
      draggingPanel = true;
      startY = e.touches[0].clientY;
      startBottom = getPanelBottom();
      panel.style.transition = 'none';
      e.preventDefault();
    }, { passive: false });

    handle.addEventListener('mousedown', function(e) {
      if (e.target.closest('#dm-panel-close')) return;
      draggingPanel = true;
      startY = e.clientY;
      startBottom = getPanelBottom();
      panel.style.transition = 'none';
    });

    document.addEventListener('touchmove', function(e) {
      if (!draggingPanel) return;
      var dy = startY - e.touches[0].clientY; // positif = monte
      var newBottom = Math.max(0, Math.min(window.innerHeight - 100, startBottom + dy));
      panel.style.bottom = newBottom + 'px';
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('mousemove', function(e) {
      if (!draggingPanel) return;
      var dy = startY - e.clientY;
      var newBottom = Math.max(0, Math.min(window.innerHeight - 100, startBottom + dy));
      panel.style.bottom = newBottom + 'px';
    });

    function stopDrag() { draggingPanel = false; panel.style.transition = ''; }
    document.addEventListener('touchend', stopDrag);
    document.addEventListener('mouseup', stopDrag);
  })();

  // ── Toast ────────────────────────────────────────────────────────────
  var toast = document.createElement('div');
  toast.id = 'dm-toast';
  document.body.appendChild(toast);

  function showToast(msg, dur) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, dur || 2000);
  }

  // ── Utilitaires DOM ──────────────────────────────────────────────────
  function getSelector(el) {
    if (el.id) return '#' + el.id;
    var classes = Array.from(el.classList)
      .filter(function (c) { return !['dm-sel', 'dm-wrap', 'dm-dragging', 'hidden'].includes(c); })
      .slice(0, 3);
    if (classes.length) return '.' + classes.join('.');
    return el.tagName.toLowerCase();
  }

  function getComputed(el, prop) {
    return parseFloat(window.getComputedStyle(el)[prop]) || 0;
  }

  // ── Offset dashboard pour la toolbar ────────────────────────────────
  var dashboard = document.querySelector('.dashboard');
  if (dashboard) dashboard.classList.add('dm-offset');

  // ── Boutons toolbar ──────────────────────────────────────────────────
  document.getElementById('dm-sel-btn').addEventListener('click', function () { setMode('select'); });
  document.getElementById('dm-ord-btn').addEventListener('click', function () { setMode('reorder'); });
  document.getElementById('dm-exp-btn').addEventListener('click', showExport);
  document.getElementById('dm-close-btn').addEventListener('click', deactivate);
  document.getElementById('dm-panel-close').addEventListener('click', closePanel);

  function setMode(m) {
    state.mode = m;
    document.getElementById('dm-sel-btn').classList.toggle('active', m === 'select');
    document.getElementById('dm-ord-btn').classList.toggle('active', m === 'reorder');
    clearHighlight();
    closePanel();
    if (m === 'select') {
      removeWrap();
      dashboard && (dashboard.style.touchAction = '');
    } else {
      addWrap();
      dashboard && (dashboard.style.touchAction = 'none');
    }
  }

  // ── Mode sélection ───────────────────────────────────────────────────
  document.addEventListener('click', function (e) {
    if (state.mode !== 'select') return;
    if (e.target.closest('#dm-bar') || e.target.closest('#dm-panel') || e.target.closest('#dm-toast')) return;
    e.preventDefault();
    e.stopPropagation();
    selectEl(e.target);
  }, true);

  function selectEl(el) {
    clearHighlight();
    state.selected = el;
    el.classList.add('dm-sel');
    openPanel(el);
  }

  function clearHighlight() {
    if (state.selected) {
      state.selected.classList.remove('dm-sel');
      state.selected = null;
    }
  }

  // ── Panel contrôles ──────────────────────────────────────────────────
  function openPanel(el) {
    var selector = getSelector(el);
    var saved = state.changes[selector] || {};
    var computed = window.getComputedStyle(el);
    var tag = el.tagName.toLowerCase();
    var isText = ['span', 'div', 'p', 'h1', 'h2', 'h3', 'h4', 'button', 'a', 'label', 'li'].includes(tag)
      || el.children.length === 0;

    var rect = el.getBoundingClientRect();
    document.getElementById('dm-panel-name').textContent = selector;
    document.getElementById('dm-panel-tag').textContent = '<' + tag + '> · ' + Math.round(rect.width) + '×' + Math.round(rect.height) + 'px';

    var rows = [];

    if (isText) {
      var fz = saved.fontSize !== undefined ? saved.fontSize : getComputed(el, 'fontSize');
      rows.push(makeRow('Font size', 'fontSize', fz, 6, 80, 0.5, 'px', el, selector));
    }

    if (['span', 'div', 'p', 'button', 'a'].includes(tag)) {
      var fw = saved.fontWeight !== undefined ? saved.fontWeight : (getComputed(el, 'fontWeight') || 400);
      rows.push(makeRow('Font weight', 'fontWeight', fw, 100, 900, 100, '', el, selector));
    }

    var mt = saved.marginTop !== undefined ? saved.marginTop : getComputed(el, 'marginTop');
    rows.push(makeRow('Margin top', 'marginTop', mt, -40, 120, 1, 'px', el, selector));

    var mb = saved.marginBottom !== undefined ? saved.marginBottom : getComputed(el, 'marginBottom');
    rows.push(makeRow('Margin bot.', 'marginBottom', mb, -40, 120, 1, 'px', el, selector));

    var pt = saved.paddingTop !== undefined ? saved.paddingTop : getComputed(el, 'paddingTop');
    rows.push(makeRow('Pad. top', 'paddingTop', pt, 0, 80, 1, 'px', el, selector));

    var pb = saved.paddingBottom !== undefined ? saved.paddingBottom : getComputed(el, 'paddingBottom');
    rows.push(makeRow('Pad. bot.', 'paddingBottom', pb, 0, 80, 1, 'px', el, selector));

    if (computed.display === 'flex' || computed.display === 'grid') {
      var gap = saved.gap !== undefined ? saved.gap : getComputed(el, 'gap');
      rows.push(makeRow('Gap', 'gap', gap, 0, 80, 1, 'px', el, selector));
    }

    var lh = saved.lineHeight !== undefined ? saved.lineHeight : (getComputed(el, 'lineHeight') || 1.4);
    rows.push(makeRow('Line height', 'lineHeight', lh, 0.8, 3, 0.05, '', el, selector));

    var ls = saved.letterSpacing !== undefined ? saved.letterSpacing : getComputed(el, 'letterSpacing');
    rows.push(makeRow('Letter sp.', 'letterSpacing', ls, -2, 10, 0.1, 'px', el, selector));

    var bdr = saved.borderRadius !== undefined ? saved.borderRadius : getComputed(el, 'borderRadius');
    rows.push(makeRow('Radius', 'borderRadius', bdr, 0, 60, 1, 'px', el, selector));

    document.getElementById('dm-panel-body').innerHTML = rows.join('');

    // Bind sliders
    document.querySelectorAll('.dm-slider').forEach(function (s) {
      s.addEventListener('input', function () {
        var prop = this.dataset.prop;
        var unit = this.dataset.unit;
        var val = parseFloat(this.value);
        var displayVal = Math.round(val * 100) / 100;
        this.parentElement.querySelector('.dm-val').textContent = displayVal + unit;
        applyChange(el, selector, prop, val, unit);
      });
    });

    // Bind reset buttons
    document.querySelectorAll('.dm-reset').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var prop = this.dataset.prop;
        el.style[prop] = '';
        if (state.changes[selector]) delete state.changes[selector][prop];
        // Re-open to refresh
        openPanel(el);
        showToast('Reset ' + prop);
      });
    });

    panel.classList.add('open');
  }

  function makeRow(label, prop, val, min, max, step, unit, el, selector) {
    var display = Math.round(val * 100) / 100;
    return `<div class="dm-row">
      <span class="dm-lbl">${label}</span>
      <input type="range" class="dm-slider" data-prop="${prop}" data-unit="${unit}"
        min="${min}" max="${max}" step="${step}" value="${val}">
      <span class="dm-val">${display}${unit}</span>
      <button class="dm-reset" data-prop="${prop}" title="Reset">↺</button>
    </div>`;
  }

  function applyChange(el, selector, prop, val, unit) {
    if (!state.changes[selector]) state.changes[selector] = {};
    state.changes[selector][prop] = val;

    // Cas spécial : roue des émotions → font-size s'applique aux mots enfants
    if (selector === '#dash-emotion-wheel' && prop === 'fontSize') {
      document.querySelectorAll('.dash-emotion-word').forEach(function (w) {
        w.style.fontSize = val + (unit || '');
      });
      // Stocker sous le bon sélecteur pour l'export
      if (!state.changes['.dash-emotion-word']) state.changes['.dash-emotion-word'] = {};
      state.changes['.dash-emotion-word'].fontSize = val;
      delete state.changes[selector][prop];
    } else {
      el.style[prop] = val + (unit || '');
    }
  }

  function closePanel() {
    panel.classList.remove('open');
    clearHighlight();
  }

  // ── Mode réorganisation ──────────────────────────────────────────────
  function addWrap() {
    var parent = dashboard;
    if (!parent) return;

    BLOCK_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var wrap = document.createElement('div');
      wrap.className = 'dm-wrap';
      wrap.dataset.blockId = id;
      el.parentNode.insertBefore(wrap, el);
      wrap.appendChild(el);

      var handle = document.createElement('div');
      handle.className = 'dm-handle';
      handle.textContent = '⠿';
      wrap.appendChild(handle);

      handle.addEventListener('touchstart', onDragStart, { passive: false });
      handle.addEventListener('mousedown', onDragStart);
    });
  }

  function removeWrap() {
    document.querySelectorAll('.dm-wrap').forEach(function (wrap) {
      var child = wrap.firstElementChild;
      if (child) wrap.parentNode.insertBefore(child, wrap);
      wrap.remove();
    });
  }

  var ghost = null;

  function onDragStart(e) {
    e.preventDefault();
    var wrap = e.currentTarget.parentElement;
    if (!wrap) return;

    state.dragEl = wrap;
    var rect = wrap.getBoundingClientRect();
    var touch = e.touches ? e.touches[0] : e;
    state.dragStartY = touch.clientY - rect.top;

    wrap.classList.add('dm-dragging');

    // Créer ghost
    ghost = wrap.cloneNode(true);
    ghost.className = 'dm-ghost';
    ghost.querySelector('.dm-handle') && ghost.querySelector('.dm-handle').remove();
    ghost.style.top = rect.top + 'px';
    ghost.style.height = rect.height + 'px';
    ghost.style.padding = '0 28px';
    document.body.appendChild(ghost);

    // Placeholder
    state.placeholder = document.createElement('div');
    state.placeholder.className = 'dm-placeholder';
    state.placeholder.style.height = rect.height + 'px';
    wrap.parentNode.insertBefore(state.placeholder, wrap.nextSibling);

    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
  }

  function onDragMove(e) {
    if (!state.dragEl) return;
    e.preventDefault();
    var touch = e.touches ? e.touches[0] : e;
    var y = touch.clientY;

    // Déplacer le ghost
    if (ghost) ghost.style.top = (y - state.dragStartY) + 'px';

    // Trouver la position d'insertion
    var wraps = Array.from(document.querySelectorAll('.dm-wrap:not(.dm-dragging)'));
    var insertRef = null;
    var insertBefore = true;

    for (var i = 0; i < wraps.length; i++) {
      var r = wraps[i].getBoundingClientRect();
      if (y < r.top + r.height / 2) {
        insertRef = wraps[i];
        insertBefore = true;
        break;
      }
      insertRef = wraps[i];
      insertBefore = false;
    }

    var p = state.placeholder;
    if (insertRef) {
      if (insertBefore) {
        insertRef.parentNode.insertBefore(p, insertRef);
      } else {
        insertRef.parentNode.insertBefore(p, insertRef.nextSibling);
      }
    }
  }

  function onDragEnd() {
    if (!state.dragEl) return;

    // Placer l'élément au niveau du placeholder
    if (state.placeholder && state.placeholder.parentNode) {
      state.placeholder.parentNode.insertBefore(state.dragEl, state.placeholder);
      state.placeholder.remove();
    }

    state.dragEl.classList.remove('dm-dragging');
    state.dragEl = null;
    state.placeholder = null;
    if (ghost) { ghost.remove(); ghost = null; }

    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('touchend', onDragEnd);
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);

    showToast('Ordre mis à jour');
  }

  // ── Export CSS ───────────────────────────────────────────────────────
  function showExport() {
    setMode('select');
    var css = buildCSS();

    document.getElementById('dm-panel-name').textContent = 'EXPORT CSS';
    document.getElementById('dm-panel-tag').textContent = 'Copiez et collez dans style.css';
    document.getElementById('dm-panel-body').innerHTML = `
      <div id="dm-export-box">${escHtml(css) || "/* Aucun changement pour l'instant */"}</div>
      <button class="dm-btn" id="dm-copy-btn">Copier le CSS</button>
    `;

    document.getElementById('dm-copy-btn').addEventListener('click', function () {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(css).then(function () { showToast('CSS copié !'); });
      } else {
        var ta = document.createElement('textarea');
        ta.value = css; document.body.appendChild(ta);
        ta.select(); document.execCommand('copy');
        ta.remove(); showToast('CSS copié !');
      }
    });

    panel.classList.add('open');
  }

  function buildCSS() {
    var lines = [];

    // Ordre des blocs
    var wraps = document.querySelectorAll('.dm-wrap');
    if (wraps.length > 0) {
      var order = Array.from(wraps).map(function (w) { return '#' + w.dataset.blockId; });
      lines.push('/* ── Ordre des blocs (à réorganiser dans le HTML) ──');
      lines.push('   ' + order.join('\n   '));
      lines.push('*/\n');
    }

    // Modifications de style
    var selectors = Object.keys(state.changes);
    if (selectors.length === 0 && lines.length === 0) return '';

    selectors.forEach(function (sel) {
      var props = state.changes[sel];
      var propLines = Object.keys(props).map(function (p) {
        var cssProp = p.replace(/([A-Z])/g, function (m) { return '-' + m.toLowerCase(); });
        var val = props[p];
        // Ajouter 'px' si numérique et prop le nécessite
        var needsPx = ['fontSize', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom',
          'gap', 'letterSpacing', 'borderRadius'].includes(p);
        return '  ' + cssProp + ': ' + val + (needsPx ? 'px' : '') + ';';
      });
      if (propLines.length) {
        lines.push(sel + ' {');
        lines = lines.concat(propLines);
        lines.push('}\n');
      }
    });

    return lines.join('\n');
  }

  function escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ── Désactivation ────────────────────────────────────────────────────
  function deactivate() {
    sessionStorage.removeItem('dm_active');
    document.removeEventListener('click', arguments.callee, true);
    closePanel();
    removeWrap();
    if (dashboard) {
      dashboard.classList.remove('dm-offset');
      dashboard.style.touchAction = '';
    }
    // Reset tous les styles appliqués
    Object.keys(state.changes).forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      Object.keys(state.changes[sel]).forEach(function (p) { el.style[p] = ''; });
    });
    bar.remove(); panel.remove(); toast.remove(); styleEl.remove();
    showToast && showToast('Design mode fermé');
  }

  // ── Init ─────────────────────────────────────────────────────────────
  function init() {
    showToast('⚡ Design mode actif — tap pour sélectionner', 3000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 600); });
  } else {
    setTimeout(init, 600);
  }
})();
