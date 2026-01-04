

// Sticky CTA behavior: show a subtle "Request Quote" button after scrolling
(function stickyCTA(){
  const btn = document.createElement('a');
  btn.href = '#contact';
  btn.textContent = 'Request Quote';
  btn.className = 'btn';
  Object.assign(btn.style, {
    position:'fixed', right:'16px', bottom:'16px', zIndex:'50',
    boxShadow:'0 10px 30px rgba(178,34,34,.35)', display:'none'
  });
  document.body.appendChild(btn);
  let shown = false;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY || document.documentElement.scrollTop;
    if (scrolled > 600 && !shown){ btn.style.display = 'inline-flex'; shown = true; }
    if (scrolled <= 600 && shown){ btn.style.display = 'none'; shown = false; }
  });
})();

// Basic client-side form guard (non-submitting demo)
document.addEventListener('submit', (e) => {
  const form = e.target.closest('form');
  if (!form) return;
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  // TODO: replace with your real endpoint (EmailJS, Formspree, or server)
  alert('Thanks! We received your request and will reach out shortly.');
  form.reset();
});
