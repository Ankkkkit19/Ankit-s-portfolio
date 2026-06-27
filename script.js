'use strict';

/* ============================================================
   ANKIT KUMAR PANDIT — Portfolio JS
   Matching: anshumankumar.vercel.app layout
   ============================================================ */

/* ---- Helpers ---- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* ---- Year ---- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   PAGE LOADER
   ============================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('gone');
  }, 900);
});

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  if (!progressBar) return;
  const scrolled = document.documentElement.scrollTop;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrolled / total * 100) + '%';
}, { passive: true });

/* ============================================================
   HEADER — shadow on scroll
   ============================================================ */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (!header) return;
  header.classList.toggle('shadowed', window.scrollY > 20);
}, { passive: true });

/* ============================================================
   THEME TOGGLE
   ============================================================ */
const themeBtn = document.getElementById('themeBtn');
const sunIcon  = themeBtn?.querySelector('.sun-icon');
const moonIcon = themeBtn?.querySelector('.moon-icon');
const html     = document.documentElement;

function applyTheme(t) {
  html.setAttribute('data-theme', t);
  localStorage.setItem('ak-theme', t);
  if (sunIcon && moonIcon) {
    sunIcon.style.display  = t === 'dark' ? 'none'  : 'block';
    moonIcon.style.display = t === 'dark' ? 'block' : 'none';
  }
}

// Apply saved or system theme
const savedTheme = localStorage.getItem('ak-theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);

themeBtn?.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ============================================================
   HAMBURGER / MOBILE NAV
   ============================================================ */
const hamBtn       = document.getElementById('hamBtn');
const mobileOvl    = document.getElementById('mobileOverlay');
const hamOpenIcon  = hamBtn?.querySelector('.ham-open');
const hamCloseIcon = hamBtn?.querySelector('.ham-close');

function setDrawer(open) {
  mobileOvl.classList.toggle('open', open);
  if (hamOpenIcon)  hamOpenIcon.style.display  = open ? 'none'  : 'block';
  if (hamCloseIcon) hamCloseIcon.style.display = open ? 'block' : 'none';
  hamBtn?.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}

hamBtn?.addEventListener('click', () => setDrawer(!mobileOvl.classList.contains('open')));

mobileOvl?.addEventListener('click', e => {
  if (e.target === mobileOvl) setDrawer(false);
});

$$('.mobile-link').forEach(l => l.addEventListener('click', () => setDrawer(false)));

/* ============================================================
   ACTIVE NAV LINK ON SCROLL
   ============================================================ */
const navLinks = $$('.nav-link');
const sections = $$('section[id]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ============================================================
   TYPING ANIMATION
   ============================================================ */
const typingEl = document.getElementById('typingText');
const words = [
  'Intelligent Systems',
  'Neural Networks',
  'NLP Pipelines',
  'Computer Vision',
  'LLM Applications',
  'RAG Systems',
  'AI Research',
];
let wIdx = 0, cIdx = 0, erasing = false;

function typeLoop() {
  if (!typingEl) return;
  const word = words[wIdx];
  if (!erasing) {
    typingEl.textContent = word.slice(0, cIdx + 1);
    cIdx++;
    if (cIdx === word.length) { erasing = true; setTimeout(typeLoop, 1800); return; }
  } else {
    typingEl.textContent = word.slice(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) { erasing = false; wIdx = (wIdx + 1) % words.length; }
  }
  setTimeout(typeLoop, erasing ? 58 : 105);
}
typeLoop();

/* ============================================================
   SMOOTH SCROLL (offset for header)
   ============================================================ */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    obs.unobserve(e.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Auto-attach reveal to section children
$$('.inner > *, .home-left > *, .home-right, .about-text > *, .about-right, .res-card, .edu-card, .proj-card, .clink, .stat, .contact-intro, .focus-box').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Safety net — force reveal after 1.2s
setTimeout(() => $$('.reveal:not(.visible)').forEach(el => el.classList.add('visible')), 1200);

/* ============================================================
   SKILLS TABS
   ============================================================ */
const skillTabs = $$('#skillTabs .tab');
const skillPanels = $$('.skill-panel');

skillTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    skillTabs.forEach(t => t.classList.remove('active'));
    skillPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById(tab.dataset.target);
    if (panel) panel.classList.add('active');
  });
});

/* ============================================================
   PROJECTS FILTER
   ============================================================ */
const projTabs  = $$('#projTabs .tab');
const projCards = $$('.proj-card');

projTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    projTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const f = tab.dataset.filter;
    projCards.forEach(card => {
      card.style.display = (f === 'all' || card.dataset.cat === f) ? 'flex' : 'none';
    });
  });
});