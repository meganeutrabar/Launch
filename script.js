(function () {
  'use strict';

  var TARGET = new Date('2026-10-21T10:00:00+05:00').getTime();
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var preview = new URLSearchParams(location.search).get('preview') === 'live';

  var el = {
    badge:  document.getElementById('badge-text'),
    h1:     document.getElementById('head-1'),
    h2:     document.getElementById('head-2'),
    h3:     document.getElementById('head-3'),
    sub:    document.getElementById('sub'),
    days:   document.getElementById('days'),
    hours:  document.getElementById('hours'),
    mins:   document.getElementById('mins'),
    secs:   document.getElementById('secs'),
    cd:     document.getElementById('countdown')
  };

  /* ---------- entrance ---------- */
  requestAnimationFrame(function () { document.body.classList.add('ready'); });

  /* ---------- countdown ---------- */
  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function set(node, value) {
    if (node.textContent === value) return;
    node.textContent = value;
    if (reduced) return;
    node.classList.remove('flip');
    void node.offsetWidth;          // restart the animation
    node.classList.add('flip');
  }

  var launched = false;

  function goLive(celebrate) {
    if (launched) return;
    launched = true;
    document.body.classList.add('live');
    el.badge.textContent = 'Now Live';
    el.h1.textContent = "We're";
    el.h2.textContent = 'Live!';
    el.h3.textContent = '';
    el.sub.textContent = 'MegaNeutraBar is officially here. Follow us on Instagram to order and grab the exclusive launch sale.';
    el.cd.removeAttribute('role');
    if (celebrate && !reduced) confetti();
  }

  function tick() {
    var left = TARGET - Date.now();
    if (left <= 0) { goLive(true); return false; }
    var s = Math.floor(left / 1000);
    set(el.days,  pad(Math.floor(s / 86400)));
    set(el.hours, pad(Math.floor(s / 3600) % 24));
    set(el.mins,  pad(Math.floor(s / 60) % 60));
    set(el.secs,  pad(s % 60));
    return true;
  }

  if (preview) {
    goLive(true);
  } else if (tick()) {
    var timer = setInterval(function () {
      if (!tick()) clearInterval(timer);
    }, 1000);
    // keep it honest after the tab sleeps
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) tick();
    });
  }

  /* ---------- floating gold particles ---------- */
  if (!reduced) {
    var cv = document.getElementById('particles');
    var ctx = cv.getContext('2d');
    var dots = [], w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    function size() {
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.max(14, Math.min(30, Math.round(w * h / 42000)));
      dots = [];
      for (var i = 0; i < n; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.6 + Math.random() * 1.5,
          vy: -(0.06 + Math.random() * 0.16),
          vx: (Math.random() - 0.5) * 0.08,
          a: 0.08 + Math.random() * 0.22,
          p: Math.random() * Math.PI * 2
        });
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.y += d.vy; d.x += d.vx + Math.sin(t / 2600 + d.p) * 0.12;
        if (d.y < -8) { d.y = h + 8; d.x = Math.random() * w; }
        if (d.x < -8) d.x = w + 8; else if (d.x > w + 8) d.x = -8;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(226,194,129,' + (d.a * (0.65 + 0.35 * Math.sin(t / 1500 + d.p))).toFixed(3) + ')';
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    size();
    addEventListener('resize', size, { passive: true });
    requestAnimationFrame(draw);
  }

  /* ---------- one-shot gold confetti ---------- */
  function confetti() {
    var cv = document.getElementById('confetti');
    var ctx = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = cv.clientWidth, h = cv.clientHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var colors = ['#C9A35A', '#E2C281', '#F3E9DC', '#A57B3A'];
    var bits = [];
    for (var i = 0; i < 90; i++) {
      bits.push({
        x: w / 2 + (Math.random() - 0.5) * w * 0.3,
        y: h * 0.42,
        vx: (Math.random() - 0.5) * 9,
        vy: -4 - Math.random() * 9,
        w: 2 + Math.random() * 4,
        hh: 5 + Math.random() * 7,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        c: colors[(Math.random() * colors.length) | 0]
      });
    }

    var start = performance.now();
    (function frame(now) {
      var life = now - start;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < bits.length; i++) {
        var b = bits[i];
        b.vy += 0.17; b.vx *= 0.995;
        b.x += b.vx; b.y += b.vy; b.rot += b.vr;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.globalAlpha = Math.max(0, 1 - life / 2600);
        ctx.fillStyle = b.c;
        ctx.fillRect(-b.w / 2, -b.hh / 2, b.w, b.hh);
        ctx.restore();
      }
      if (life < 2600) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, w, h);
    })(start);
  }
})();
