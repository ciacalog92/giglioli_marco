'use strict';

(() => {
  const launcher = document.getElementById('chatbot-launcher');
  const panel    = document.getElementById('chatbot');
  const body     = document.getElementById('chatbot-body');
  const chips    = document.getElementById('chatbot-chips');
  const form     = document.getElementById('chatbot-form');
  const input    = document.getElementById('chatbot-input');
  const closeBtn = document.getElementById('chatbot-close');
  const openCta  = document.getElementById('open-chatbot-cta');
  if (!launcher || !panel) return;

  const PHONE_TEL  = '+393356891624';
  const PHONE_TXT  = '+39 335 689 1624';
  const EMAIL      = 'info@gigliolimarco.com';
  const WA_LINK    = 'https://wa.me/393356891624?text=Salve%2C%20vorrei%20un%20preventivo%20per%20un%20impianto.';

  const TOPICS = {
    servizi: {
      label: 'I vostri servizi',
      keywords: ['servizi', 'servizio', 'cosa fate', 'lavori', 'cosa offrite', 'caldai', 'termic', 'idraulic', 'condizion', 'climatiz', 'antincendio', 'piscin', 'fotovoltaic', 'pompa di calore', 'rinnovabil', 'solare'],
      answer:
        'Ci occupiamo di:\n' +
        '• Impianti termici (caldaie, riscaldamento a pavimento, radiatori)\n' +
        '• Impianti idraulici e sanitari\n' +
        '• Condizionamento e climatizzazione\n' +
        '• Impianti antincendio a norma\n' +
        '• Piscine e wellness\n' +
        '• Energie rinnovabili (fotovoltaico, pompe di calore, solare termico)\n\n' +
        'Vuoi un preventivo gratuito per un servizio specifico?',
      next: ['preventivo', 'orari', 'umano']
    },
    preventivo: {
      label: 'Richiedere un preventivo',
      keywords: ['preventivo', 'costo', 'quanto costa', 'prezzo', 'tariffa', 'stima'],
      answer:
        'Il preventivo è sempre gratuito e senza impegno. Puoi:\n' +
        '1. Compilare il modulo qui sotto (apriremo la sezione contatti)\n' +
        `2. Chiamarci al ${PHONE_TXT}\n` +
        '3. Scriverci su WhatsApp per una risposta veloce\n\n' +
        'Cosa preferisci?',
      next: ['apri-form', 'chiama', 'whatsapp']
    },
    orari: {
      label: 'Orari di apertura',
      keywords: ['orari', 'orario', 'aperto', 'apertura', 'chiuso', 'quando', 'sabato', 'domenica', 'festivi'],
      answer:
        'Siamo operativi:\n' +
        '• Lunedì – Venerdì: 09:00 – 18:00\n' +
        '• Sabato e Domenica: chiuso\n\n' +
        'Per emergenze fuori orario contattaci comunque, valutiamo la disponibilità.',
      next: ['emergenza', 'contatti']
    },
    emergenza: {
      label: 'Intervento urgente',
      keywords: ['emergenz', 'urgent', 'guasto', 'perdita', 'rottura', 'subito', 'rotto'],
      answer:
        'Per guasti o emergenze il modo più rapido è una telefonata diretta.\n' +
        `Chiama subito il ${PHONE_TXT} o scrivi su WhatsApp: ti rispondiamo nel più breve tempo possibile.`,
      next: ['chiama', 'whatsapp']
    },
    zona: {
      label: 'Zona operativa',
      keywords: ['zona', 'dove', 'provincia', 'comune', 'lavorate', 'trasferta', 'paese', 'città', 'citta'],
      answer:
        'Operiamo in provincia e nei comuni limitrofi. Per zone più distanti scrivici: valutiamo ogni richiesta caso per caso.',
      next: ['preventivo', 'contatti']
    },
    contatti: {
      label: 'Tutti i contatti',
      keywords: ['contatt', 'telefono', 'numero', 'email', 'mail', 'recapit', 'whatsapp'],
      answer:
        `Ecco come raggiungerci:\n` +
        `• Telefono: ${PHONE_TXT}\n` +
        `• Email: ${EMAIL}\n` +
        `• WhatsApp: stesso numero, risposta veloce\n\n` +
        `Orari ufficio: Lun–Ven 09:00–18:00.`,
      next: ['chiama', 'whatsapp', 'apri-form']
    },
    umano: {
      label: 'Parla con un operatore',
      keywords: ['operatore', 'umano', 'persona', 'parlare', 'tecnico', 'titolare', 'marco'],
      answer:
        'Per parlare direttamente con un nostro tecnico:\n' +
        `• Chiama il ${PHONE_TXT}\n` +
        '• Oppure scrivi su WhatsApp\n' +
        '• In alternativa compila il modulo: ti richiamiamo entro 24 ore lavorative.',
      next: ['chiama', 'whatsapp', 'apri-form']
    }
  };

  const ACTIONS = {
    'apri-form': {
      label: 'Apri il modulo contatti',
      run: () => {
        closePanel();
        const section = document.getElementById('contatti');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const first = document.getElementById('nome');
          if (first) first.focus({ preventScroll: true });
        }, 600);
      }
    },
    'chiama':   { label: `Chiama ${PHONE_TXT}`, href: `tel:${PHONE_TEL}` },
    'whatsapp': { label: 'Apri WhatsApp', href: WA_LINK, target: '_blank' },
    'restart':  { label: 'Ricomincia', run: () => { body.innerHTML = ''; greet(); } }
  };

  const escapeHtml = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const linkify = txt => escapeHtml(txt)
    .replace(/(\+?\d[\d .]{6,}\d)/g, m => `<a href="tel:${m.replace(/\s/g, '')}">${m}</a>`)
    .replace(/([\w.+-]+@[\w-]+\.[\w.-]+)/g, '<a href="mailto:$1">$1</a>');

  const scrollDown = () => { body.scrollTop = body.scrollHeight; };

  const addMsg = (text, who = 'bot') => {
    const div = document.createElement('div');
    div.className = `chatbot__msg chatbot__msg--${who}`;
    div.innerHTML = linkify(text);
    body.appendChild(div);
    scrollDown();
  };

  const showTyping = () => {
    const div = document.createElement('div');
    div.className = 'chatbot__typing';
    div.id = 'chatbot-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(div);
    scrollDown();
  };
  const hideTyping = () => document.getElementById('chatbot-typing')?.remove();

  const renderChips = keys => {
    chips.innerHTML = '';
    keys.forEach(key => {
      const t = TOPICS[key] || ACTIONS[key];
      if (!t) return;
      let el;
      if (t.href) {
        el = document.createElement('a');
        el.href = t.href;
        if (t.target) { el.target = t.target; el.rel = 'noopener noreferrer'; }
      } else {
        el = document.createElement('button');
        el.type = 'button';
      }
      el.className = 'chatbot__chip';
      el.textContent = t.label;
      el.addEventListener('click', e => {
        if (TOPICS[key]) {
          e.preventDefault();
          handleTopic(key);
        } else if (t.run) {
          e.preventDefault();
          t.run();
        }
      });
      chips.appendChild(el);
    });
  };

  const handleTopic = key => {
    const topic = TOPICS[key];
    if (!topic) return;
    addMsg(topic.label, 'user');
    chips.innerHTML = '';
    showTyping();
    setTimeout(() => {
      hideTyping();
      addMsg(topic.answer);
      renderChips([...(topic.next || []), 'restart']);
    }, 450);
  };

  const matchTopic = text => {
    const t = text.toLowerCase();
    let best = null;
    let bestScore = 0;
    Object.entries(TOPICS).forEach(([key, topic]) => {
      const score = topic.keywords.reduce((acc, kw) => acc + (t.includes(kw) ? kw.length : 0), 0);
      if (score > bestScore) { bestScore = score; best = key; }
    });
    return best;
  };

  const handleFreeText = txt => {
    addMsg(txt, 'user');
    chips.innerHTML = '';
    showTyping();
    setTimeout(() => {
      hideTyping();
      const key = matchTopic(txt);
      if (key) {
        addMsg(TOPICS[key].answer);
        renderChips([...(TOPICS[key].next || []), 'restart']);
      } else {
        addMsg(
          "Non sono sicuro di aver capito. Posso aiutarti su:\n" +
          "• Servizi offerti\n• Preventivi\n• Orari\n• Emergenze\n• Zona operativa\n• Contatti\n\n" +
          `Per richieste specifiche, chiamaci al ${PHONE_TXT} o scrivici a ${EMAIL}.`
        );
        renderChips(['servizi', 'preventivo', 'orari', 'umano']);
      }
    }, 500);
  };

  let greeted = false;
  const greet = () => {
    greeted = true;
    addMsg("Ciao! Sono l'assistente virtuale di G.M. Impianti di Giglioli Marco. Come posso aiutarti?");
    renderChips(['servizi', 'preventivo', 'orari', 'emergenza', 'zona', 'contatti']);
  };

  const openPanel = () => {
    panel.hidden = false;
    launcher.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
    if (!greeted) greet();
    setTimeout(() => input?.focus({ preventScroll: true }), 100);
  };
  const closePanel = () => {
    panel.hidden = true;
    launcher.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
  };

  launcher.addEventListener('click', () => panel.hidden ? openPanel() : closePanel());
  closeBtn?.addEventListener('click', closePanel);
  openCta?.addEventListener('click', openPanel);

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const txt = input.value.trim();
    if (!txt) return;
    input.value = '';
    handleFreeText(txt);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.hidden) closePanel();
  });
})();
