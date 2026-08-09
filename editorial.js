/* melvinmorales.com, editorial design system */
(function () {
  'use strict';

  /* ---- mobile menu ---- */
  var toggle = document.querySelector('.mast-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); toggle.focus(); }
    });
    var wide = window.matchMedia('(min-width: 821px)');
    var onWide = function (e) { if (e.matches) setOpen(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
    else if (wide.addListener) wide.addListener(onWide);
  }

  /* ---- scroll reveal: one effect, fires before entry ---- */
  var els = document.querySelectorAll('.fade');
  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(els, function (el) { el.classList.add('in'); });
  } else {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '200px 0px 200px 0px' });
    Array.prototype.forEach.call(els, function (el) { obs.observe(el); });
  }

  /* ---- voice note player ---- */
  Array.prototype.forEach.call(document.querySelectorAll('.vn'), function (vn) {
    var audio = vn.querySelector('audio');
    var btn   = vn.querySelector('.vn-btn');
    var bar   = vn.querySelector('.vn-bar');
    var fill  = vn.querySelector('.vn-fill');
    var time  = vn.querySelector('.vn-time');
    if (!audio || !btn) return;

    function fmt(s) {
      if (!isFinite(s)) return '0:00';
      var m = Math.floor(s / 60), r = Math.floor(s % 60);
      return m + ':' + (r < 10 ? '0' : '') + r;
    }

    btn.addEventListener('click', function () {
      if (audio.paused) {
        audio.play();
        btn.classList.add('playing');
        btn.setAttribute('aria-label', 'Pause voice note');
      } else {
        audio.pause();
        btn.classList.remove('playing');
        btn.setAttribute('aria-label', 'Play voice note');
      }
    });

    audio.addEventListener('timeupdate', function () {
      if (audio.duration) fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
      time.textContent = fmt(audio.currentTime);
    });
    audio.addEventListener('loadedmetadata', function () { time.textContent = fmt(audio.duration); });
    audio.addEventListener('ended', function () {
      btn.classList.remove('playing');
      fill.style.width = '0%';
      btn.setAttribute('aria-label', 'Play voice note');
    });

    bar.addEventListener('click', function (e) {
      if (!audio.duration) return;
      var r = bar.getBoundingClientRect();
      audio.currentTime = ((e.clientX - r.left) / r.width) * audio.duration;
    });
  });
})();
