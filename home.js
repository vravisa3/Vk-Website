// home.js — compact robust carousel for the featured projects on the Home page.
// pages by visibleCount, ensures prev & next always show and work.

(function () {
  'use strict';

  function Carousel(rootId) {
    const root = document.getElementById(rootId);
    if (!root) return;
    const track = root.querySelector('.cards-track');
    const slides = Array.from(root.querySelectorAll('.cards-slide'));
    const prev = root.querySelector('.prev');
    const next = root.querySelector('.next');
    if (!track || slides.length === 0) return;

    let pageIndex = 0;
    let slideW = 0;
    let gapPx = 16;
    let visibleCount = 1;
    let pageCount = 1;
    let maxPage = 0;

    function readGap() {
      try {
        const cs = window.getComputedStyle(track);
        const g = parseFloat(cs.gap);
        gapPx = Number.isFinite(g) ? g : gapPx;
      } catch (e) {}
    }

    function measure() {
      readGap();
      const wrapper = track.parentElement;
      const wrapperW = wrapper.getBoundingClientRect().width || document.documentElement.clientWidth;
      const measured = slides[0].offsetWidth || slides[0].getBoundingClientRect().width;

      if (measured <= 0) {
        slideW = Math.max(120, Math.floor((wrapperW - gapPx * 2) / 3));
      } else {
        slideW = measured;
      }

      const itemTotal = slideW + gapPx;
      visibleCount = Math.max(1, Math.floor((wrapperW + gapPx) / itemTotal));
      pageCount = Math.max(1, Math.ceil(slides.length / visibleCount));
      maxPage = Math.max(0, pageCount - 1);

      pageIndex = Math.min(Math.max(0, pageIndex), maxPage);
      apply();
      updateButtons();
    }

    function apply() {
      const itemIndex = pageIndex * visibleCount;
      const tx = -(itemIndex * (slideW + gapPx));
      track.style.transform = `translate3d(${Math.round(tx)}px,0,0)`;
    }

    function updateButtons() {
      if (prev) prev.disabled = pageIndex <= 0;
      if (next) next.disabled = pageIndex >= maxPage;
    }

    function goto(n) {
      pageIndex = Math.min(Math.max(0, n), maxPage);
      apply();
      updateButtons();
    }

    prev && prev.addEventListener('click', () => goto(pageIndex - 1));
    next && next.addEventListener('click', () => goto(pageIndex + 1));

    // keyboard navigation on wrapper
    const wrapper = root.querySelector('.cards-wrapper');
    if (wrapper) {
      wrapper.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); goto(pageIndex - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); goto(pageIndex + 1); }
      });
    }

    // touch swipe handling
    let startX = 0, moved = false;
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; moved = false; }, { passive: true });
    track.addEventListener('touchmove', () => { moved = true; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (!moved) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) < 30) return;
      goto(pageIndex + (dx < 0 ? 1 : -1));
    });

    // recalc on image load
    slides.forEach(slide => {
      const imgs = slide.querySelectorAll('img');
      imgs.forEach(img => {
        if (img.complete) setTimeout(measure, 20);
        else {
          img.addEventListener('load', () => setTimeout(measure, 20), { passive: true });
          img.addEventListener('error', () => setTimeout(measure, 20), { passive: true });
        }
      });
    });

    // fonts ready
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => setTimeout(measure, 20)).catch(()=>{});

    // resize debounce
    let tid = null;
    window.addEventListener('resize', () => { clearTimeout(tid); tid = setTimeout(measure, 120); });

    // init
    setTimeout(measure, 80);

    // expose for debugging
    root._carousel = { measure, goto, getState: () => ({ pageIndex, visibleCount, pageCount, maxPage }) };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => Carousel('home-projects-carousel'));
  else Carousel('home-projects-carousel');
})();
