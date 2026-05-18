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

burger.addEventListener('click', () => {
  const open = burger.classList.toggle('open');
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close nav on link click
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
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
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 12;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Contact form — client-side validation + simulated submit
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      } else {
        field.classList.remove('error');
      }
    });

    if (!valid) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Invio in corso…';

    // Simulate async submit (replace with real fetch to backend)
    setTimeout(() => {
      form.innerHTML = `
        <div class="form-success visible">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <h3>Messaggio inviato!</h3>
          <p>Grazie per averci contattato.<br />Ti risponderemo entro 24 ore lavorative.</p>
        </div>
      `;
    }, 1200);
  });

  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('error'));
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

// Chatbot assistente
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbot       = document.getElementById('chatbot');
const chatbotClose  = document.getElementById('chatbotClose');
const chatbotBody   = document.getElementById('chatbotBody');
const chatbotForm   = document.getElementById('chatbotForm');
const chatbotInput  = document.getElementById('chatbotInput');
const chatbotQuick  = document.getElementById('chatbotQuick');

if (chatbotToggle && chatbot) {
  const badge = chatbotToggle.querySelector('.chatbot-toggle__badge');

  const openChat = () => {
    chatbot.classList.add('open');
    chatbot.setAttribute('aria-hidden', 'false');
    chatbotToggle.classList.add('hidden');
    if (badge) badge.style.display = 'none';
    setTimeout(() => chatbotInput && chatbotInput.focus(), 200);
  };
  const closeChat = () => {
    chatbot.classList.remove('open');
    chatbot.setAttribute('aria-hidden', 'true');
    chatbotToggle.classList.remove('hidden');
  };

  chatbotToggle.addEventListener('click', openChat);
  chatbotClose.addEventListener('click', closeChat);

  const addMessage = (text, who = 'bot') => {
    const msg = document.createElement('div');
    msg.className = `chat-msg chat-msg--${who}`;
    msg.innerHTML = text;
    // Insert before quick replies if present, otherwise append
    if (chatbotQuick && chatbotQuick.parentNode === chatbotBody) {
      chatbotBody.insertBefore(msg, chatbotQuick);
    } else {
      chatbotBody.appendChild(msg);
    }
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  };

  const respond = (key, raw = '') => {
    const text = (raw || key).toLowerCase();
    let reply;
    if (key === 'preventivo' || /preventiv|prezz|costo|quanto/.test(text)) {
      reply = 'Perfetto! Puoi richiedere un preventivo gratuito compilando il <a href="#contatti">modulo contatti</a> oppure scrivendoci su WhatsApp. Rispondiamo entro 24 ore.';
    } else if (key === 'servizi' || /serviz|cosa fate|offrit/.test(text)) {
      reply = 'Ci occupiamo di impianti termici, idraulici, condizionamento, antincendio, piscine ed energie rinnovabili. <a href="#servizi">Scopri tutti i servizi</a>.';
    } else if (key === 'emergenza' || /emergen|urgen|pronto|guast|perdit/.test(text)) {
      reply = 'Per emergenze siamo disponibili 7 giorni su 7. Chiamaci al <a href="tel:+39XXXXXXXXXX">+39 000 000 0000</a> per un pronto intervento.';
    } else if (key === 'contatti' || /contatt|telefono|email|chiamar|dove/.test(text)) {
      reply = 'Puoi contattarci al <a href="tel:+39XXXXXXXXXX">+39 000 000 0000</a> o via email a <a href="mailto:info@gmimpianti.it">info@gmimpianti.it</a>. Orari: Lun–Ven 8:00–18:00, Sab 8:00–13:00.';
    } else if (/ciao|salve|buongiorno|buonasera|hey/.test(text)) {
      reply = 'Ciao! Come posso aiutarti? Puoi chiedermi di servizi, preventivi o contatti.';
    } else if (/grazie/.test(text)) {
      reply = 'Grazie a te! Sono qui se hai altre domande.';
    } else {
      reply = 'Per una risposta personalizzata ti consiglio di <a href="#contatti">contattarci direttamente</a>: ti risponderemo nel più breve tempo possibile.';
    }
    setTimeout(() => addMessage(reply, 'bot'), 500);
  };

  if (chatbotQuick) {
    chatbotQuick.addEventListener('click', e => {
      const btn = e.target.closest('button[data-q]');
      if (!btn) return;
      addMessage(btn.textContent, 'user');
      chatbotQuick.remove();
      respond(btn.dataset.q);
    });
  }

  if (chatbotForm) {
    chatbotForm.addEventListener('submit', e => {
      e.preventDefault();
      const val = chatbotInput.value.trim();
      if (!val) return;
      addMessage(val.replace(/</g, '&lt;'), 'user');
      chatbotInput.value = '';
      if (chatbotQuick && chatbotQuick.parentNode) chatbotQuick.remove();
      respond('', val);
    });
  }
}
