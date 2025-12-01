// ai.js — bulletproof carousel: pages by visibleCount, both prev/next always functional.
// Initializes multiple carousels when present by ID.

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
    let slideWidth = 0;
    let gapPx = 16;
    let visibleCount = 1;
    let pageCount = 1;
    let maxPageIndex = 0;

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
        slideWidth = Math.max(120, Math.floor((wrapperW - gapPx * 2) / 3));
      } else {
        slideWidth = measured;
      }

      const itemTotal = slideWidth + gapPx;
      visibleCount = Math.max(1, Math.floor((wrapperW + gapPx) / itemTotal));
      pageCount = Math.max(1, Math.ceil(slides.length / visibleCount));
      maxPageIndex = Math.max(0, pageCount - 1);

      pageIndex = Math.min(Math.max(0, pageIndex), maxPageIndex);
      applyTransform();
      updateButtons();
    }

    function applyTransform() {
      const itemIndex = pageIndex * visibleCount;
      const tx = -(itemIndex * (slideWidth + gapPx));
      track.style.transform = `translate3d(${Math.round(tx)}px,0,0)`;
    }

    function updateButtons() {
      if (prev) prev.disabled = pageIndex <= 0;
      if (next) next.disabled = pageIndex >= maxPageIndex;
    }

    function gotoPage(n) {
      pageIndex = Math.min(Math.max(0, n), maxPageIndex);
      applyTransform();
      updateButtons();
    }

    if (prev) prev.addEventListener('click', () => gotoPage(pageIndex - 1));
    if (next) next.addEventListener('click', () => gotoPage(pageIndex + 1));

    // keyboard nav on wrapper
    const wrapper = root.querySelector('.cards-wrapper');
    if (wrapper) {
      wrapper.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); gotoPage(pageIndex - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); gotoPage(pageIndex + 1); }
      });
    }

    // touch swipe
    let sx = 0, moved = false;
    track.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; moved = false; }, { passive: true });
    track.addEventListener('touchmove', () => { moved = true; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (!moved) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) < 30) return;
      gotoPage(pageIndex + (dx < 0 ? 1 : -1));
    });

    // mouse drag (desktop)
    let dragging = false, dragStart = 0, dragCurrent = 0;
    track.addEventListener('mousedown', (e) => {
      dragging = true; dragStart = e.clientX; dragCurrent = dragStart; track.classList.add('is-dragging');
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => { if (!dragging) return; dragCurrent = e.clientX; });
    window.addEventListener('mouseup', () => {
      if (!dragging) return;
      dragging = false; track.classList.remove('is-dragging');
      const dx = dragCurrent - dragStart;
      if (Math.abs(dx) > 40) gotoPage(pageIndex + (dx < 0 ? 1 : -1));
    });

    // recalc on image load inside carousel
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
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(measure, 20)).catch(() => {});
    }

    // resize debounce
    let tid = null;
    window.addEventListener('resize', () => { clearTimeout(tid); tid = setTimeout(measure, 120); });

    // mutation observer for dynamic changes
    const mo = new MutationObserver(() => setTimeout(measure, 20));
    mo.observe(track, { childList: true, subtree: true });

    // initial measure
    setTimeout(measure, 80);

    // expose API for debugging
    root._carousel = { measure, gotoPage, state: () => ({ pageIndex, visibleCount, pageCount, maxPageIndex }) };
  }

  // init carousels if they exist
  function initAll() {
    Carousel('articles-carousel');
    Carousel('projects-carousel');
    Carousel('upcoming-carousel');
    Carousel('home-projects-carousel'); // safe-noop if not present
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
  else initAll();
})();
