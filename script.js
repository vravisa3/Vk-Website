/* ===============================
   Vee–Kay Portfolio — script.js
   =============================== */

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initNav();
  highlightActiveNav();
  initCarousel("proj-carousel");   // Projects page (safe no-op if absent)
  initTypewriter("typewriter");    // About page (safe no-op if absent)
  initReveals();                   // Fade-in on scroll (site-wide)
});

/* ---------- Current year ---------- */
function setYear() {
  const ids = ["y", "year"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = new Date().getFullYear();
  });
}

/* ---------- Mobile navigation ---------- */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  const open = () => links.classList.add("open");
  const close = () => links.classList.remove("open");
  const toggleMenu = () => links.classList.toggle("open");

  toggle.addEventListener("click", toggleMenu);

  // Close when clicking a link (helpful on mobile)
  links.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => close());
  });

  // Close on Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* ---------- Highlight active nav item ---------- */
function highlightActiveNav() {
  const nav = document.querySelector(".nav-links");
  if (!nav) return;
  const path = location.pathname.split("/").pop() || "index.html";
  const found = Array.from(nav.querySelectorAll("a")).find(a => {
    const href = a.getAttribute("href");
    return href === path || (path === "" && href === "index.html");
  });
  if (found) {
    nav.querySelectorAll("a").forEach(a => a.classList.remove("active"));
    found.classList.add("active");
  }
}

/* ---------- Simple carousel ---------- */
/* Expects:
  <div id="proj-carousel" class="carousel">
    <div class="track"> <div class="slide">…</div> … </div>
    <button class="ctrl prev">‹</button>
    <button class="ctrl next">›</button>
  </div>
*/
function initCarousel(id) {
  const root = document.getElementById(id);
  if (!root) return;

  const track  = root.querySelector(".track");
  const slides = root.querySelectorAll(".slide");
  const prev   = root.querySelector(".prev");
  const next   = root.querySelector(".next");
  if (!track || slides.length === 0) return;

  let i = 0, timer;

  function go(n) {
    i = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${i * 100}%)`;
  }

  function play() {
    stop();
    timer = setInterval(() => go(i + 1), 6000);
  }

  function stop() {
    if (timer) clearInterval(timer);
  }

  prev && prev.addEventListener("click", () => { go(i - 1); play(); });
  next && next.addEventListener("click", () => { go(i + 1); play(); });

  // Pause on hover (desktop nicety)
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", play);

  go(0);
  play();
}

/* ---------- Typewriter (no cursor, ~3s total) ---------- */
/* Expects:
   <p id="typewriter" data-text="..."></p>
   Styles handled in CSS (.typewriter)
*/
function initTypewriter(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const full = (el.getAttribute("data-text") || el.textContent || "").trim();
  if (!full) return;

  el.textContent = "";
  const totalMs = 3000;          // finish within ~3 seconds
  const frameMs = 16;            // ~60fps
  const steps = Math.max(1, Math.round(totalMs / frameMs));
  const inc = Math.max(1, Math.ceil(full.length / steps));
  let i = 0;

  function tick() {
    i = Math.min(full.length, i + inc);
    el.textContent = full.slice(0, i);
    if (i < full.length) requestAnimationFrame(tick);
  }

  setTimeout(() => requestAnimationFrame(tick), 150);
}

/* ---------- Fade-in on scroll ---------- */
/* Adds .in to any .reveal when 15% visible */
function initReveals() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(el => io.observe(el));
}


// ===== Mobile nav =====
const toggle = document.querySelector('.nav-toggle');
const links  = document.querySelector('.nav-links');
if (toggle) toggle.addEventListener('click', () => links.classList.toggle('open'));

// ===== Simple carousel helper =====
function initCarousel(id){
  const root = document.getElementById(id);
  if(!root) return;
  const track  = root.querySelector('.track');
  const slides = root.querySelectorAll('.slide');
  const prev   = root.querySelector('.prev');
  const next   = root.querySelector('.next');

  let i = 0, timer = null;

  function go(n){
    i = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${i*100}%)`;
  }
  function start(){ stop(); timer = setInterval(()=>go(i+1), 6000); }
  function stop(){ if(timer) clearInterval(timer); timer = null; }

  prev && prev.addEventListener('click', ()=>{ go(i-1); start(); });
  next && next.addEventListener('click', ()=>{ go(i+1); start(); });

  // pause on hover for desktop
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);

  start();
}

// Init carousels wherever they exist
['proj-carousel','blog-carousel','travel-carousel'].forEach(initCarousel);

