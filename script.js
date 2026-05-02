/* ===== THEME TOGGLE ===== */
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const savedTheme = localStorage.getItem('portfolio-theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

function applyTheme(theme) {
  root.dataset.theme = theme;
  if (themeMeta) themeMeta.setAttribute('content', theme === 'light' ? '#F7F8FC' : '#0B0B0F');
  if (themeToggle) {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
  }
}

applyTheme(savedTheme || systemTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('portfolio-theme', nextTheme);
    applyTheme(nextTheme);
  });
}

/* ===== CUSTOM CURSOR ===== */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

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

/* ===== NAV SCROLL ===== */
const navbar   = document.getElementById('navbar');
const navLinks = document.getElementById('nav-links');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  highlightNav();
});

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

/* ===== ACTIVE NAV ===== */
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (!link) return;
    link.classList.toggle('active', scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight);
  });
}
highlightNav();

/* ===== HAMBURGER ===== */
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ===== COUNT-UP ===== */
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target);
    const start  = performance.now();
    const duration = 1000;
    const step = now => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(c => countObserver.observe(c));

/* ===== PHOTO UPLOAD ===== */
const photoArea   = document.getElementById('photo-area');
const photoInput  = document.getElementById('photo-input');
const avatarImg   = document.getElementById('avatar-img');
const placeholder = document.getElementById('photo-placeholder');

photoArea.addEventListener('click', () => photoInput.click());
photoInput.addEventListener('change', function() {
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

/* ===== EMAILJS CONTACT FORM =====
   SETUP STEPS (takes 3 minutes):
   1. Sign up free at https://www.emailjs.com
   2. Add a Gmail service -> copy the Service ID -> replace YOUR_SERVICE_ID below
   3. Create an email template with variables: {{from_name}}, {{reply_to}}, {{message}}
      -> copy the Template ID -> replace YOUR_TEMPLATE_ID below
   4. Go to Account -> copy Public Key -> replace YOUR_PUBLIC_KEY below
   That's it. The form will send emails directly to mohdhanan195@gmail.com.
================================================= */
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

(function() {
  if (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
})();

const form       = document.getElementById('contact-form');
const sendBtn    = document.getElementById('send-btn');
const formStatus = document.getElementById('form-status');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const name    = document.getElementById('from_name').value.trim();
  const email   = document.getElementById('reply_to').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showStatus('Please fill in all fields.', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showStatus('That email address doesn\'t look right.', 'error');
    return;
  }

  // If EmailJS isn't configured yet, fall back to mailto
  if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:mohdhanan195@gmail.com?subject=Portfolio contact from ${encodeURIComponent(name)}&body=${body}`;
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';

  emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
    .then(() => {
      showStatus('Sent! I\'ll get back to you soon.', 'success');
      form.reset();
    })
    .catch(err => {
      console.error('EmailJS error:', err);
      showStatus('Something went wrong. Try emailing me directly.', 'error');
    })
    .finally(() => {
      sendBtn.disabled = false;
      sendBtn.textContent = 'Send Message';
    });
});

function showStatus(msg, type) {
  formStatus.textContent = msg;
  formStatus.className = 'form-status ' + type;
  setTimeout(() => { formStatus.className = 'form-status'; }, 5000);
}
