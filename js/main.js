'use strict';

// Header scroll effect
const header = document.getElementById('header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile burger menu
const burger = document.getElementById('burger');
const nav    = document.getElementById('nav');
let _navScrollY = 0;

function openNav() {
  _navScrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top      = `-${_navScrollY}px`;
  document.body.style.width    = '100%';
  burger.classList.add('open');
  nav.classList.add('open');
  header.classList.add('nav-open');
  burger.setAttribute('aria-expanded', 'true');
}

function closeNav() {
  document.body.style.position = '';
  document.body.style.top      = '';
  document.body.style.width    = '';
  window.scrollTo(0, _navScrollY);
  burger.classList.remove('open');
  nav.classList.remove('open');
  header.classList.remove('nav-open');
  burger.setAttribute('aria-expanded', 'false');
}

burger.addEventListener('click', () => {
  burger.classList.contains('open') ? closeNav() : openNav();
});

// Close nav on link click
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', closeNav);
});

// Scroll-triggered fade-up animations
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

const animTargets = [
  '.service-card',
  '.why-card',
  '.review-card',
  '.about__content',
  '.about__visual',
  '.contact-info',
  '.contact-form',
  '.section__header',
  '.reviews-summary',
];
document.querySelectorAll(animTargets.join(',')).forEach((el, i) => {
  el.classList.add('fade-up');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  observer.observe(el);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 12;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  });
});

// Contact form — client-side validation + simulated submit
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    let firstInvalid = null;
    form.querySelectorAll('[required]').forEach(field => {
      const empty = field.type === 'checkbox' ? !field.checked : !field.value.trim();
      if (empty) {
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        if (!firstInvalid) firstInvalid = field;
        valid = false;
      } else {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
      }
    });

    if (!valid) {
      firstInvalid?.focus();
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Invio in corso…';

    // Simulate async submit (replace with real fetch to backend)
    setTimeout(() => {
      form.innerHTML = `
        <div class="form-success visible" role="status" tabindex="-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <h3>Messaggio inviato!</h3>
          <p>Grazie per averci contattato.<br />Ti risponderemo entro 24 ore lavorative.</p>
        </div>
      `;
      form.querySelector('.form-success')?.focus();
    }, 1200);
  });

  form.querySelectorAll('[required]').forEach(field => {
    const clear = () => { field.classList.remove('error'); field.removeAttribute('aria-invalid'); };
    field.addEventListener('input', clear);
    field.addEventListener('change', clear);
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll-to-top button
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Cookie banner
const cookieBanner  = document.getElementById('cookieBanner');
const cookieAccept  = document.getElementById('cookieAccept');
const cookieDecline = document.getElementById('cookieDecline');

if (cookieBanner && !localStorage.getItem('gm_cookie_consent')) {
  setTimeout(() => cookieBanner.classList.add('show'), 800);

  const dismissBanner = val => {
    localStorage.setItem('gm_cookie_consent', val);
    cookieBanner.classList.remove('show');
  };
  cookieAccept.addEventListener('click',  () => dismissBanner('all'));
  cookieDecline.addEventListener('click', () => dismissBanner('necessary'));
}

// Animated counters for stat numbers
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el  = entry.target;
    const raw = el.textContent.replace(/\D/g, '');
    const end = parseInt(raw, 10);
    if (isNaN(end)) return;
    const suffix = el.textContent.replace(/[\d]/g, '');
    const dur    = 1200;
    const start  = performance.now();

    const tick = now => {
      const progress = Math.min((now - start) / dur, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * end) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat__num, .about__badge-num').forEach(el => {
  counterObserver.observe(el);
});
