/* ===== Fun & Relax carousels =====
   Auto-advance, with Prev/Next controls.
   Each slide can contain a GRID of cards.
*/

function initCarousel(id, intervalMs = 6000) {
  const root  = document.getElementById(id);
  if (!root) return;

  const track = root.querySelector(".track");
  const slides = root.querySelectorAll(".slide");
  const prevBtn = root.querySelector(".prev");
  const nextBtn = root.querySelector(".next");
  let i = 0, timer = null;

  function go(n) {
    i = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${i * 100}%)`;
  }

  function start() { stop(); timer = setInterval(() => go(i + 1), intervalMs); }
  function stop()  { if (timer) clearInterval(timer); }

  prevBtn?.addEventListener("click", () => { go(i - 1); start(); });
  nextBtn?.addEventListener("click", () => { go(i + 1); start(); });

  // Swipe support (basic)
  let x0 = null;
  root.addEventListener("pointerdown", e => { x0 = e.clientX; stop(); });
  root.addEventListener("pointerup",   e => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 30) go(i + (dx < 0 ? 1 : -1));
    x0 = null; start();
  });

  // Kickoff
  go(0); start();
}

// Initialize all three carousels
initCarousel("tech-carousel",   6500);
initCarousel("travel-carousel", 6000);
initCarousel("life-carousel",   7000);

// Optional: fade-in on scroll (reuses .reveal styles if present)
(function(){
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  const io = new IntersectionObserver((ents, obs) => {
    ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
})();
