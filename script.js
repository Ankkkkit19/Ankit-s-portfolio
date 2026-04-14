/* ==========================================================================
   Ankit Kumar Pandit | Premium AI/ML Portfolio — script.js
   ========================================================================== */

'use strict';

/* ============================================================
   UTILS
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   1. YEAR
   ============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   2. SMART CURSOR (desktop only)
   ============================================================ */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (window.matchMedia('(pointer: fine)').matches && cursorDot && cursorRing) {
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
    window._cursorX = mouseX; window._cursorY = mouseY;
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    requestAnimationFrame(animateRing);
  })();

  const hoverTargets = $$('a, button, input, textarea, .skill-badge, .project-card, .stat-card, .achievement-card, select');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => { cursorDot.classList.add('hovered'); cursorRing.classList.add('hovered'); });
    el.addEventListener('mouseleave', () => { cursorDot.classList.remove('hovered'); cursorRing.classList.remove('hovered'); });
  });
}

/* ============================================================
   3. NAVBAR — scroll state + mobile toggle
   ============================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('nav-open');
});

$$('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (hamburger) hamburger.classList.remove('active');
    if (navLinks) navLinks.classList.remove('nav-open');
  });
});

/* Active link on scroll */
const sections   = $$('section[id]');
const navLinkEls = $$('.nav-link');

const activeSectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(l => l.classList.remove('active'));
      const active = navLinkEls.find(l => l.getAttribute('href') === `#${entry.target.id}`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => activeSectionObserver.observe(s));

/* ============================================================
   4. SCROLL REVEAL (Intersection Observer)
   ============================================================ */
const revealEls = $$('[data-reveal]');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseFloat(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('revealed'), delay);
      // Animate skill bars when in view
      if (el.classList.contains('skill-category')) {
        el.querySelectorAll('.pill-fill').forEach(bar => bar.classList.add('animated'));
      }
      obs.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
} else {
  // Fallback: no IntersectionObserver support
  revealEls.forEach(el => el.classList.add('revealed'));
}

// Safety net: force-reveal all elements after 1.5s in case observer fails
setTimeout(() => {
  revealEls.forEach(el => {
    if (!el.classList.contains('revealed')) {
      el.classList.add('revealed');
    }
  });
  // Also animate skill bars
  $$('.pill-fill').forEach(bar => bar.classList.add('animated'));
}, 1500);

/* ============================================================
   5. COUNTER ANIMATION
   ============================================================ */
const counterObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const numEl  = entry.target.querySelector('.stat-num');
    const target = parseInt(entry.target.dataset.count, 10);
    if (!numEl || isNaN(target)) return;
    let start = 0;
    const duration = 1600;
    const step = 30;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { numEl.textContent = target; clearInterval(timer); }
      else numEl.textContent = Math.floor(start);
    }, step);
    obs.unobserve(entry.target);
  });
}, { threshold: 0.5 });

$$('.stat-card[data-count]').forEach(el => counterObserver.observe(el));

/* ============================================================
   6. TYPEWRITER
   ============================================================ */
const typeEl     = document.getElementById('typewriter');
const typeCursor = document.getElementById('typeCursor');

const roles = [
  'Intelligent AI Systems',
  'NLP Models at Scale',
  'Computer Vision Pipelines',
  'Better Tomorrows with AI',
  'LLM-Powered Solutions',
];

let rIdx = 0, cIdx = 0, deleting = false, tDelay = 120;

function typeWriter() {
  if (!typeEl) return;
  const current = roles[rIdx];
  if (deleting) {
    typeEl.textContent = current.substring(0, cIdx - 1);
    cIdx--;
    tDelay = 55;
  } else {
    typeEl.textContent = current.substring(0, cIdx + 1);
    cIdx++;
    tDelay = 120;
  }

  if (!deleting && cIdx === current.length) {
    tDelay = 1800;
    deleting = true;
  } else if (deleting && cIdx === 0) {
    deleting = false;
    rIdx = (rIdx + 1) % roles.length;
    tDelay = 400;
  }

  setTimeout(typeWriter, tDelay);
}

setTimeout(typeWriter, 1200);

/* ============================================================
   7. PARTICLE CANVAS BACKGROUND
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles, animFrame;

  const isMobile = () => window.innerWidth < 768;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = -(Math.random() * 0.4 + 0.15);
      this.r  = Math.random() * 1.8 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79,142,247,${this.alpha})`;
      ctx.fill();
    }
  }

  const COUNT = isMobile() ? 40 : 90;
  const LINK_DIST = isMobile() ? 100 : 140;

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(79,142,247,${(1 - dist / LINK_DIST) * 0.25})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Connect nearest particles to mouse
    if (!isMobile() && window._cursorX !== undefined) {
      particles.forEach(p => {
        const dx = p.x - window._cursorX;
        const dy = p.y - window._cursorY;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 160) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,212,255,${(1 - d / 160) * 0.5})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(window._cursorX, window._cursorY);
          ctx.stroke();
        }
      });
    }

    animFrame = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); }, { passive: true });

  init();
  animate();
})();

/* ============================================================
   8. HERO AVATAR — subtle tilt on mouse move
   ============================================================ */
(function heroTilt() {
  const visual = $('.hero-visual');
  if (!visual || isMobileDevice()) return;

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const rx = ((e.clientY - cy) / cy) * -6;
    const ry = ((e.clientX - cx) / cx) *  6;
    visual.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });

  visual.addEventListener('mouseleave', () => {
    visual.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  });
})();

function isMobileDevice() { return /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768; }

/* ============================================================
   10. SMOOTH HOVER RIPPLE on Buttons
   ============================================================ */
$$('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect   = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size   = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY  - rect.top  - size/2}px;
      background:rgba(255,255,255,0.15);
      transform:scale(0); animation:ripple .55s ease-out forwards;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframe once
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes ripple{to{transform:scale(2.5);opacity:0}}`;
document.head.appendChild(rippleStyle);

/* ============================================================
   11. PROJECT CARDS — stagger on reveal
   ============================================================ */
$$('.project-card[data-reveal]').forEach((card, i) => {
  card.style.transitionDelay = `${i * 60}ms`;
});

/* ============================================================
   12. SCROLL PROGRESS INDICATOR (thin top bar)
   ============================================================ */
(function scrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position:fixed; top:0; left:0; height:2px; width:0%;
    background:linear-gradient(90deg,#4f8ef7,#00d4ff,#6c63ff);
    z-index:9999; transition:width .1s linear; pointer-events:none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop  = document.documentElement.scrollTop;
    const scrollMax  = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width  = `${(scrollTop / scrollMax) * 100}%`;
  }, { passive: true });
})();