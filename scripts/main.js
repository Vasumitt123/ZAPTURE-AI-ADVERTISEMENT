/* ── LANDING PAGE INTERACTIONS ── */

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 20);
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// Trial badge on CTA buttons
document.querySelectorAll('[data-cta]').forEach(btn => {
  btn.addEventListener('click', () => {
    window.location.href = 'studio.html';
  });
});
