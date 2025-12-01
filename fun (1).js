/* Initialize all carousels on Fun & Relax page */
(function initFunCarousels(){
  const carousels = document.querySelectorAll('.carousel');
  carousels.forEach((root) => {
    const track = root.querySelector('.track');
    const slides = root.querySelectorAll('.slide');
    if(!track || slides.length === 0) return;

    let i = 0;
    const prev = root.querySelector('.prev');
    const next = root.querySelector('.next');

    function go(n){
      i = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${i*100}%)`;
    }

    prev && prev.addEventListener('click', ()=>go(i-1));
    next && next.addEventListener('click', ()=>go(i+1));

    // Auto-advance
    const autoMs = Number(root.dataset.auto || 6000);
    let t = setInterval(()=>go(i+1), autoMs);

    // Pause on hover if requested
    if(root.dataset.pause === 'true'){
      root.addEventListener('mouseenter', ()=>clearInterval(t));
      root.addEventListener('mouseleave', ()=>{ t = setInterval(()=>go(i+1), autoMs); });
    }

    // Swipe support (mobile)
    let startX = 0;
    root.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; }, {passive:true});
    root.addEventListener('touchend', (e)=>{
      const dx = e.changedTouches[0].clientX - startX;
      if(Math.abs(dx) > 40){ go(i + (dx < 0 ? 1 : -1)); }
    });
  });
})();
