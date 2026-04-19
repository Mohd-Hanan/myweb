/* ===== CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

function animateCursor() {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  cursor.style.left = curX + 'px';
  cursor.style.top  = curY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .proj-card, .skill-tag, .stat-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

/* ===== NAV SCROLL EFFECT ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  highlightNav();
});

/* ===== SMOOTH SCROLL FOR NAV LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 70;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    // Close mobile menu
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

/* ===== ACTIVE NAV HIGHLIGHT ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.getElementById('nav-links');

function highlightNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;
    if (scrollY >= top && scrollY < bottom) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
highlightNav();

/* ===== HAMBURGER MOBILE MENU ===== */
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ===== COUNT-UP ANIMATION ===== */
const counters = document.querySelectorAll('.stat-num[data-target]');

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.dataset.target);
    const duration = 1000;
    const start  = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(c => countObserver.observe(c));

/* ===== PHOTO UPLOAD ===== */
const photoArea    = document.getElementById('photo-area');
const photoInput   = document.getElementById('photo-input');
const avatarImg    = document.getElementById('avatar-img');
const placeholder  = document.getElementById('photo-placeholder');

photoArea.addEventListener('click', () => photoInput.click());

photoInput.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    avatarImg.src = e.target.result;
    avatarImg.style.display = 'block';
    placeholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
});
