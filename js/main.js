/* ============================================================
   NABUATH ULLA KHAN — main.js
   Scroll progress | Sticky nav | Mobile menu | Typewriter
   Expand/collapse experience | Back to top | Animations
   ============================================================ */

/* ---------- SCROLL PROGRESS BAR ---------- */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrolled / total * 100) + '%';
}, { passive: true });

/* ---------- STICKY NAV ---------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ---------- MOBILE NAV TOGGLE ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  }
});

/* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const activateNavLink = () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) current = section.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
};
window.addEventListener('scroll', activateNavLink, { passive: true });

/* ---------- BACK TO TOP ---------- */
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- TYPEWRITER EFFECT ---------- */
const phrases = [
  'unlock Supply Chain Resilience',
  'harness the power of AI & GenAI',
  'turn data into competitive advantage',
  'lead Digital Transformation at scale',
  'build future-ready intelligent enterprises',
  'navigate complexity with data-driven clarity',
];

const typeEl   = document.getElementById('typewriter-text');
let phraseIdx  = 0;
let charIdx    = 0;
let deleting   = false;
let typePause  = false;

function typeWriter() {
  if (!typeEl) return;
  const current = phrases[phraseIdx];

  if (!deleting) {
    typeEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      typePause = true;
      setTimeout(() => { typePause = false; deleting = true; typeWriter(); }, 2200);
      return;
    }
  } else {
    typeEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting   = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
    }
  }
  if (!typePause) setTimeout(typeWriter, deleting ? 38 : 62);
}
setTimeout(typeWriter, 1200);

/* ---------- FADE-IN ON SCROLL ---------- */
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
      let delay = 0;
      siblings.forEach((sib, idx) => { if (sib === entry.target) delay = idx * 80; });
      setTimeout(() => entry.target.classList.add('visible'), Math.min(delay, 320));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
fadeEls.forEach(el => observer.observe(el));

/* ---------- SMOOTH SCROLL ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---------- EXPAND / COLLAPSE EXPERIENCE DETAILS ---------- */
document.querySelectorAll('.timeline-content').forEach((card, idx) => {
  const points   = card.querySelector('.timeline-points');
  const subtitle = card.querySelector('.role-subtitle');
  if (!points) return; // compact cards — skip

  // Wrap bullet list (and subtitle if present) in a collapsible container
  const wrapper = document.createElement('div');
  wrapper.className = 'timeline-details';
  if (subtitle) wrapper.appendChild(subtitle);
  wrapper.appendChild(points);
  card.appendChild(wrapper);

  // Create toggle button
  const btn = document.createElement('button');
  btn.className = 'toggle-btn';
  btn.innerHTML = 'View Details <span class="arrow">&#9660;</span>';
  card.appendChild(btn);

  // First item (current role) starts open
  if (idx === 0) {
    wrapper.classList.add('open');
    btn.classList.add('open');
    btn.innerHTML = 'Hide Details <span class="arrow">&#9660;</span>';
  }

  btn.addEventListener('click', () => {
    const isOpen = wrapper.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.innerHTML = isOpen
      ? 'Hide Details <span class="arrow">&#9660;</span>'
      : 'View Details <span class="arrow">&#9660;</span>';
  });
});

/* ---------- COUNTER ANIMATION (hero stats) ---------- */
const animateCounter = (el, target, prefix = '', suffix = '') => {
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(num => {
        const prefix = num.dataset.prefix || '';
        const match  = num.textContent.match(/(\d+)([A-Z+M%]*)/);
        if (match) animateCounter(num, parseInt(match[1]), prefix, match[2] || '');
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);
