/* ===== About page scripts =====
   - Typewriter (finishes in ~3s, no cursor/line)
   - Fade-in on scroll for .reveal sections
*/

/* Typewriter */
(function initTypewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;

  const full = el.getAttribute("data-text") || el.textContent || "";
  el.textContent = "";                      // no cursor, no left line
  const totalMs = 3000;                     // finish in ~3s
  const frameMs = 16;                       // ~60fps
  const step = Math.max(1, Math.floor(full.length / (totalMs / frameMs)));
  let i = 0;

  function tick() {
    i = Math.min(full.length, i + step);
    el.textContent = full.slice(0, i);
    if (i < full.length) requestAnimationFrame(tick);
  }

  // slight delay so first paint is clean
  setTimeout(() => requestAnimationFrame(tick), 150);
})();

/* Fade-in on scroll for elements with .reveal */
(function initReveals() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => io.observe(el));
})();
