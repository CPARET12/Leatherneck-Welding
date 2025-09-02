document.addEventListener('DOMContentLoaded', () => {
  // footer year (optional)
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const carousel = document.getElementById('recentCarousel');
  if (!carousel) return;

  const track  = carousel.querySelector('.carousel-track');
  const slides = Array.from(track?.children || []);
  const prev   = carousel.querySelector('.prev');
  const next   = carousel.querySelector('.next');

  if (!track || slides.length === 0 || !prev || !next) return;

  let index = 0;
  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }
  update();

  prev.addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    update();
  });

  next.addEventListener('click', () => {
    index = (index + 1) % slides.length;
    update();
  });

  // touch swipe (optional)
  let startX = null;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (dx > 40)  { index = (index - 1 + slides.length) % slides.length; update(); }
    if (dx < -40) { index = (index + 1) % slides.length; update(); }
    startX = null;
  });
});
