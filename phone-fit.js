// Presents each 390 × 844 screen like a phone.
// - On phones: the screen scales to fill the display (keeping proportions).
// - On desktop: the screen sits inside a phone frame, centred and scaled to
//   fit the window, with a side panel for jumping between flows.
// Loaded by every *.dc.html right after support.js.
(function () {
  var W = 390, H = 844, BEZEL = 14, RADIUS = 54;
  var FW = W + BEZEL * 2, FH = H + BEZEL * 2;
  var doc = document.documentElement;
  var DATA_KEYS = ['harbor.profile', 'harbor.mood', 'harbor.notes', 'harbor.notes.open', 'harbor.fair'];
  var FLOWS = [
    ['Onboarding', 'Onboarding.dc.html'],
    ['Home', 'Main.dc.html'],
    ['Search & register', 'Search.dc.html'],
    ['Live event', 'LiveOverview.dc.html'],
    ['Live · Notes', 'LiveNotes.dc.html'],
    ['Live · Wellness', 'LiveWellness.dc.html'],
    ['After the event', 'VoyageLogbook.dc.html'],
    ['Event recap', 'EventRecap.dc.html'],
  ];

  if (!document.querySelector('meta[name="viewport"]')) {
    var m = document.createElement('meta');
    m.name = 'viewport';
    m.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
    document.head.appendChild(m);
  }

  var css = document.createElement('style');
  css.textContent = [
    'html,body{margin:0;height:100%;overflow:hidden;background:var(--fit-bg,#0b2f3a);-webkit-text-size-adjust:100%;text-size-adjust:100%}',
    '#dc-root{position:fixed;left:50%;top:50%;width:' + W + 'px;height:' + H + 'px;overflow:hidden;z-index:2;',
    'transform:translate(-50%,-50%) scale(var(--fit-s,1));transform-origin:center center}',
    '#dc-root:not(.fit-ready){visibility:hidden}',
    // Desktop frame
    'html.fit-desk{--fit-bg:radial-gradient(120% 90% at 50% 0%,#14576b 0%,#0b2f3a 55%,#071f27 100%)}',
    'html.fit-desk body{background:var(--fit-bg)}',
    'html.fit-desk #dc-root{border-radius:' + (RADIUS - BEZEL) + 'px}',
    '.fit-frame,.fit-island,.fit-home{display:none}',
    'html.fit-desk .fit-frame{display:block;position:fixed;left:50%;top:50%;width:' + FW + 'px;height:' + FH + 'px;z-index:1;box-sizing:border-box;',
    'border-radius:' + RADIUS + 'px;background:#111;box-shadow:0 0 0 2px #2b2b2b,0 0 0 4px #0a0a0a,0 30px 80px rgba(0,0,0,.55);',
    'transform:translate(-50%,-50%) scale(var(--fit-s,1));transform-origin:center center}',
    'html.fit-desk .fit-island{display:block;position:fixed;left:50%;top:50%;width:122px;height:35px;border-radius:20px;background:#000;z-index:3;pointer-events:none;',
    'transform:translate(-50%,calc(-50% - (' + (H / 2 - 11 - 17.5) + 'px * var(--fit-s,1)))) scale(var(--fit-s,1))}',
    'html.fit-desk .fit-home{display:block;position:fixed;left:50%;top:50%;width:134px;height:5px;border-radius:3px;background:rgba(0,0,0,.35);z-index:3;pointer-events:none;',
    'transform:translate(-50%,calc(-50% + (' + (H / 2 - 8) + 'px * var(--fit-s,1)))) scale(var(--fit-s,1))}',
    // Side panel
    '.fit-panel{display:none}',
    'html.fit-wide .fit-panel{display:flex;position:fixed;left:32px;top:50%;transform:translateY(-50%);width:248px;max-height:calc(100% - 64px);overflow:auto;',
    'flex-direction:column;gap:18px;padding:22px;box-sizing:border-box;border-radius:16px;background:rgba(235,250,254,.07);border:1px solid rgba(235,250,254,.14);',
    'color:#ebfafe;font-family:Poppins,system-ui,sans-serif;z-index:4}',
    '.fit-panel h1{margin:0;font-family:"DM Sans",Poppins,system-ui,sans-serif;font-size:26px;line-height:1.1;font-weight:700}',
    '.fit-panel .fit-sub{margin:4px 0 0;font-size:12px;color:#a0c3ce}',
    '.fit-panel .fit-label{margin:0 0 6px;font-size:11px;letter-spacing:.04em;color:#a0c3ce}',
    '.fit-panel .fit-now{margin:0;font-size:15px;font-weight:600}',
    '.fit-panel nav{display:flex;flex-direction:column;gap:4px}',
    '.fit-panel nav a{display:block;padding:8px 10px;border-radius:8px;color:#ebfafe;text-decoration:none;font-size:14px}',
    '.fit-panel nav a:hover{background:rgba(235,250,254,.1)}',
    '.fit-panel nav a[aria-current=page]{background:#26b2dc;color:#00303f;font-weight:600}',
    '.fit-panel .fit-actions{display:flex;gap:8px}',
    '.fit-panel .fit-actions a,.fit-panel .fit-actions button{flex:1;height:38px;border-radius:8px;border:1px solid rgba(235,250,254,.35);background:none;color:#ebfafe;',
    'font:600 13px Poppins,system-ui,sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;text-decoration:none}',
    '.fit-panel .fit-actions a:hover,.fit-panel .fit-actions button:hover{background:rgba(235,250,254,.1)}',
    '.fit-panel .fit-tip{margin:0;font-size:12px;line-height:1.5;color:#a0c3ce}',
    '.fit-panel :focus-visible{outline:2px solid #80fdff;outline-offset:2px}',
  ].join('');
  document.head.appendChild(css);

  function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }

  function buildChrome() {
    if (document.querySelector('.fit-frame')) return;
    document.body.appendChild(el('div', 'fit-frame'));
    document.body.appendChild(el('div', 'fit-island'));
    document.body.appendChild(el('div', 'fit-home'));

    var here = (location.pathname.split('/').pop() || '').replace(/\.html$/, '');
    var panel = el('aside', 'fit-panel');
    panel.setAttribute('aria-label', 'Prototype controls');
    var links = FLOWS.map(function (f) {
      var cur = f[1].replace(/\.html$/, '') === here ? ' aria-current="page"' : '';
      return '<a href="' + f[1] + '"' + cur + '>' + f[0] + '</a>';
    }).join('');
    panel.innerHTML =
      '<div><h1>Harbor</h1><p class="fit-sub">UXD 370 · Hi-fi prototype</p></div>' +
      '<div><p class="fit-label">Now viewing</p><p class="fit-now"></p></div>' +
      '<div><p class="fit-label">Jump to a flow</p><nav>' + links + '</nav></div>' +
      '<div class="fit-actions"><button type="button" class="fit-restart">Restart</button><a href="screens.html">All screens</a></div>' +
      '<p class="fit-tip">Click, type and scroll inside the phone like a real app. Restart clears your name, mood, notes and registration.</p>';
    panel.querySelector('.fit-now').textContent = document.title || 'Harbor';
    panel.querySelector('.fit-restart').addEventListener('click', function () {
      try { DATA_KEYS.forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {}
      location.href = 'Onboarding.dc.html';
    });
    document.body.appendChild(panel);
  }

  function isPhone(w) { return w <= 600 || (window.matchMedia && window.matchMedia('(pointer:coarse)').matches && w <= 1024); }

  function screenBg() {
    var root = document.getElementById('dc-root');
    var e = root && root.querySelector('.sc-host > *');
    for (var i = 0; e && i < 4; i++) {
      var bg = getComputedStyle(e).backgroundColor;
      if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') return bg;
      e = e.firstElementChild;
    }
    return '#fafeff';
  }

  function fit() {
    var vv = window.visualViewport;
    var w = vv ? vv.width : window.innerWidth;
    var h = vv ? vv.height : window.innerHeight;
    var s;
    if (isPhone(w)) {
      doc.classList.remove('fit-desk', 'fit-wide');
      s = Math.min(w / W, h / H);
      doc.style.setProperty('--fit-bg', screenBg());
    } else {
      doc.classList.add('fit-desk');
      doc.classList.toggle('fit-wide', w >= 900);
      doc.style.removeProperty('--fit-bg');
      s = Math.min(1, (h - 48) / FH, (w - 48) / FW);
    }
    doc.style.setProperty('--fit-s', String(Math.max(s, 0.3)));
    var root = document.getElementById('dc-root');
    if (root) root.classList.add('fit-ready');
  }

  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', fit);
  document.addEventListener('click', function () { setTimeout(fit, 60); }, true);

  // Links to screens that aren't built yet show a short note instead of doing nothing.
  var toastTimer = null;
  function protoToast(msg) {
    var t = document.querySelector('.fit-toast');
    if (!t) {
      t = el('div', 'fit-toast');
      t.setAttribute('role', 'status');
      t.style.cssText = 'position:fixed;z-index:6;left:50%;transform:translateX(-50%);max-width:300px;padding:10px 14px;border-radius:10px;' +
        'background:#004256;color:#fff;font:500 13px Poppins,system-ui,sans-serif;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,.25);transition:opacity .2s;pointer-events:none';
      document.body.appendChild(t);
    }
    var root = document.getElementById('dc-root');
    var r = root ? root.getBoundingClientRect() : { bottom: window.innerHeight };
    t.style.top = Math.max(12, r.bottom - 150) + 'px';
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.style.opacity = '0'; }, 1800);
  }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('#dc-root a[href="#"]');
    if (!a) return;
    e.preventDefault();
    var inner = e.target.closest('button, input, textarea, select');
    if (inner && a.contains(inner)) return;
    var what = a.getAttribute('data-proto-todo');
    protoToast((what ? what + ' isn’t' : 'This isn’t') + ' part of this prototype yet');
  }, true);

  // Back controls return to the screen the student came from, like a real app.
  // Falls back to the link's own target when there is no previous prototype page.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[aria-label]');
    if (!a || !/^back\b/i.test(a.getAttribute('aria-label') || '')) return;
    var ref = document.referrer;
    var same = false;
    try { same = !!ref && new URL(ref).origin === location.origin && new URL(ref).pathname !== location.pathname; } catch (err) {}
    if (same && history.length > 1) { e.preventDefault(); history.back(); }
  }, true);

  // The runtime mounts #dc-root asynchronously; fit once it appears.
  var tries = 0;
  (function wait() {
    if (document.body) buildChrome();
    if (document.querySelector('#dc-root .sc-host')) { fit(); setTimeout(fit, 300); return; }
    if (tries++ < 200) setTimeout(wait, 25); else fit();
  })();
})();
