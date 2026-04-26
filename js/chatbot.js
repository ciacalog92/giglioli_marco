'use strict';

const BOT_NAME   = 'Assistente GM';
const BOT_AVATAR = 'GM';

const INTENTS = [
  {
    id: 'greeting',
    patterns: ['ciao','salve','buongiorno','buonasera','hey','hei','hello'],
    response: () => `Ciao! 👋 Sono l'assistente virtuale di <strong>G.M. Impianti</strong>. Posso rispondere alle tue domande sui nostri servizi o aiutarti a richiedere un preventivo.\n\nCome posso aiutarti?`,
    suggestions: ['Servizi offerti','Richiedi preventivo','Orari e contatti','Pronto intervento'],
  },
  {
    id: 'termici',
    patterns: ['caldaia','caldaie','riscaldamento','termosifone','termosifoni','radiante','pavimento','termico','termici','gas','condensazione','boiler','stufa','camino'],
    response: () => `🔥 <strong>Impianti Termici</strong>\n\nInstalliamo e manuteniamo:\n• Caldaie a gas e a condensazione\n• Riscaldamento a pavimento radiante\n• Termosifoni e impianti centralizzati\n• Sostituzioni di emergenza\n\nTutti i lavori sono garantiti e certificati. Vuoi un <strong>preventivo gratuito</strong>?`,
    suggestions: ['Richiedi preventivo','Orari e contatti','Pronto intervento'],
  },
  {
    id: 'idraulici',
    patterns: ['idraulico','idraulici','perdita','perdite','tubo','tubatura','tubazione','scarico','acqua','bagno','cucina','rubinetto','wc','sanitari','fognatura','fogna','perdita d acqua'],
    response: () => `💧 <strong>Impianti Idraulici</strong>\n\nOffriamo:\n• Riparazione perdite e guasti\n• Realizzazione impianti civili e industriali\n• Ristrutturazione bagni e cucine\n• Sostituzione tubazioni\n• Pronto intervento per emergenze\n\nHai una perdita urgente? Chiamaci subito!`,
    suggestions: ['Pronto intervento','Richiedi preventivo','Contattaci'],
  },
  {
    id: 'condizionamento',
    patterns: ['condizionatore','condizionatori','condizionamento','climatizzatore','climatizzatori','split','multisplit','pompa di calore','caldo','freddo','aria condizionata','clima','raffrescamento','cooling','inverter'],
    response: () => `❄️ <strong>Condizionamento</strong>\n\nForniamo e installiamo:\n• Climatizzatori split e multisplit\n• Pompe di calore aria-aria e aria-acqua\n• Sistemi per ambienti residenziali e commerciali\n• Ricarica gas refrigerante e assistenza\n\nDesideri un sopralluogo gratuito?`,
    suggestions: ['Richiedi preventivo','Orari e contatti'],
  },
  {
    id: 'antincendio',
    patterns: ['antincendio','fumo','sprinkler','idrante','idranti','rilevatore','rilevatori','estintore','estintori','normativa','certificazione','collaudo','vvf'],
    response: () => `🛡️ <strong>Impianti Antincendio</strong>\n\nProgettiamo e installiamo:\n• Sistemi sprinkler e reti idranti\n• Rilevatori di fumo e gas\n• Impianti conformi alle normative vigenti\n• Collaudi e verifiche periodiche certificate\n\nTutti gli impianti sono documentati e certificati. Vuoi saperne di più?`,
    suggestions: ['Richiedi preventivo','Contattaci'],
  },
  {
    id: 'piscine',
    patterns: ['piscina','piscine','filtro','filtrazione','vasca','nuoto','trattamento acqua','pompa piscina','riscaldamento piscina'],
    response: () => `🏊 <strong>Impianti per Piscine</strong>\n\nRealizzamo:\n• Impianti idraulici per piscine private e pubbliche\n• Sistemi di filtrazione e trattamento acqua\n• Riscaldamento dell'acqua (solare o pompa di calore)\n• Manutenzione ordinaria e straordinaria\n\nVuoi un preventivo per la tua piscina?`,
    suggestions: ['Richiedi preventivo','Energie rinnovabili'],
  },
  {
    id: 'rinnovabili',
    patterns: ['solare','fotovoltaico','pannelli solari','rinnovabili','rinnovabile','geotermico','geotermica','risparmio energetico','energia','green','incentivi','detrazioni','bonus','ecobonus','superbonus'],
    response: () => `☀️ <strong>Energie Rinnovabili</strong>\n\nInstalliamo:\n• Pannelli solari termici e fotovoltaici\n• Pompe di calore geotermiche\n• Sistemi ibridi caldaia + solare\n• Ti guidiamo negli incentivi fiscali (Ecobonus, detrazioni 65%)\n\nRiduci la bolletta e inquini meno. Vuoi una consulenza gratuita?`,
    suggestions: ['Richiedi preventivo','Contattaci'],
  },
  {
    id: 'preventivo',
    patterns: ['preventivo','costo','prezzo','quanto','tariff','gratis','gratuito','offerta','quotazione','stima'],
    response: () => `📋 <strong>Preventivo Gratuito</strong>\n\nEffettuiamo sopralluoghi e preventivi <strong>completamente gratuiti e senza impegno</strong>.\n\nPuoi contattarci:\n📞 Chiamando il nostro numero\n💬 Scrivendo via WhatsApp\n📝 Compilando il modulo sul sito\n\nRispondiamo entro <strong>24 ore lavorative</strong>.`,
    suggestions: ['Vai al modulo contatti','Orari e contatti','Pronto intervento'],
  },
  {
    id: 'orari',
    patterns: ['orari','orario','quando','aperto','chiuso','ore','mattina','pomeriggio','sabato','domenica','settimana'],
    response: () => `🕐 <strong>Orari di apertura</strong>\n\n📅 Lunedì – Venerdì: <strong>8:00 – 18:00</strong>\n📅 Sabato: <strong>8:00 – 13:00</strong>\n📅 Domenica: chiuso (salvo emergenze)\n\nPer <strong>emergenze e guasti urgenti</strong> siamo disponibili anche fuori orario, 7 giorni su 7.`,
    suggestions: ['Pronto intervento','Contattaci','Richiedi preventivo'],
  },
  {
    id: 'contatti',
    patterns: ['telefono','numero','chiamare','chiama','email','contatto','contatta','dove','indirizzo','zona','raggiungere','scrivere','whatsapp'],
    response: () => `📞 <strong>Contatti</strong>\n\n📱 Telefono / WhatsApp: <strong>+39 000 000 0000</strong>\n📧 Email: <strong>info@gmimpianti.it</strong>\n📍 Zona operativa: provincia e dintorni\n\nPuoi anche compilare il <strong>modulo di contatto</strong> sul sito e ti ricontatteremo entro 24 ore.`,
    suggestions: ['Vai al modulo contatti','Orari e contatti','Richiedi preventivo'],
  },
  {
    id: 'emergenza',
    patterns: ['urgenza','urgente','emergenza','pronto intervento','subito','adesso','oggi','immediato','guasto','rotto','allagamento','allagato','gas','perdita gas'],
    response: () => `🚨 <strong>Pronto Intervento</strong>\n\nSiamo disponibili per emergenze <strong>7 giorni su 7</strong>, anche fuori orario!\n\nIn caso di:\n• Perdita d'acqua\n• Guasto caldaia\n• Sospetta perdita di gas\n• Allagamento\n\n👉 <strong>Chiama subito: +39 000 000 0000</strong>\n\nNon esitare, interveniamo rapidamente!`,
    suggestions: ['Contattaci','Orari e contatti'],
  },
  {
    id: 'garanzia',
    patterns: ['garanzia','garantito','certifica','certificato','abilitato','assicurato','qualità','qualifica','patentino','normativa'],
    response: () => `✅ <strong>Garanzia e Certificazioni</strong>\n\nG.M. Impianti è:\n• <strong>Certificata</strong> e abilitata ai sensi di legge\n• <strong>Assicurata</strong> per tutti gli interventi\n• Aggiornata sulle normative di sicurezza\n\nTutti i lavori vengono eseguiti a regola d'arte e sono <strong>garantiti</strong>. Usiamo solo materiali e componenti certificati di prima qualità.`,
    suggestions: ['Richiedi preventivo','Chi siamo'],
  },
  {
    id: 'about',
    patterns: ['chi siete','chi sei','esperienza','anni','azienda','impresa','artigiano','marco','giglioli','storia','da quanto','presentati'],
    response: () => `🏢 <strong>Chi siamo</strong>\n\n<strong>G.M. Impianti di Giglioli Marco</strong> opera nel settore degli impianti civili e industriali da oltre <strong>20 anni</strong>.\n\n✔️ 500+ clienti soddisfatti\n✔️ 1000+ impianti installati\n✔️ Team di tecnici qualificati\n✔️ Rapporto diretto con Marco\n\nNessuna burocrazia, prezzi trasparenti e interventi rapidi.`,
    suggestions: ['Servizi offerti','Richiedi preventivo'],
  },
];

const QUICK_STARTS = [
  { label: '🔧 Servizi offerti',    message: 'Servizi offerti' },
  { label: '📋 Richiedi preventivo', message: 'Richiedi preventivo' },
  { label: '🕐 Orari e contatti',   message: 'Orari e contatti' },
  { label: '🚨 Pronto intervento',  message: 'Pronto intervento' },
];

const SUGGESTION_ACTIONS = {
  'Vai al modulo contatti': () => {
    const el = document.getElementById('contatti');
    if (el) { el.scrollIntoView({ behavior: 'smooth' }); }
    closeChatWindow();
  },
  'Chi siamo': () => {
    const el = document.getElementById('chi-siamo');
    if (el) { el.scrollIntoView({ behavior: 'smooth' }); }
    closeChatWindow();
  },
  'Energie rinnovabili': () => sendUserMessage('Energie rinnovabili'),
};

function classify(text) {
  const lower = text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  let best = null, bestScore = 0;
  for (const intent of INTENTS) {
    let score = 0;
    for (const p of intent.patterns) {
      if (lower.includes(p)) score += p.length;
    }
    if (score > bestScore) { bestScore = score; best = intent; }
  }
  return bestScore > 0 ? best : null;
}

const FALLBACK = [
  `Non sono sicuro di aver capito bene. 😅\nProvo a indirizzarti:\n\n• Per i <strong>servizi</strong> scrivi "servizi"\n• Per un <strong>preventivo</strong> scrivi "preventivo"\n• Per <strong>emergenze</strong> scrivi "urgenza"\n• Per i <strong>contatti</strong> scrivi "telefono"\n\nOppure compila il <a href="#contatti" style="color:var(--accent);font-weight:600">modulo di contatto</a> e ti risponderemo entro 24 ore!`,
];

let chatOpen   = false;
let firstOpen  = true;
let isTyping   = false;

function createWidget() {
  const widget = document.createElement('div');
  widget.className = 'chat-widget';
  widget.id = 'chatWidget';
  widget.innerHTML = `
    <div class="chat-window" id="chatWindow" aria-hidden="true">
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-bot-avatar">${BOT_AVATAR}</div>
          <div>
            <strong>${BOT_NAME}</strong>
            <span class="chat-status"><span class="chat-status-dot"></span>Online</span>
          </div>
        </div>
        <button class="chat-close" id="chatClose" aria-label="Chiudi chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="chat-messages" id="chatMessages" role="log" aria-live="polite"></div>
      <div class="chat-input-wrap">
        <div class="chat-input-row">
          <input type="text" id="chatInput" placeholder="Scrivi un messaggio…" autocomplete="off" maxlength="300" />
          <button id="chatSend" aria-label="Invia">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
        <p class="chat-footer-note">Assistente virtuale · G.M. Impianti</p>
      </div>
    </div>
    <button class="chat-toggle" id="chatToggle" aria-label="Apri chat assistente">
      <span class="chat-toggle-icon chat-toggle-icon--open">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="9" cy="10" r=".8" fill="currentColor"/><circle cx="12" cy="10" r=".8" fill="currentColor"/><circle cx="15" cy="10" r=".8" fill="currentColor"/></svg>
      </span>
      <span class="chat-toggle-icon chat-toggle-icon--close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </span>
      <span class="chat-badge" id="chatBadge">1</span>
    </button>`;
  document.body.appendChild(widget);

  document.getElementById('chatToggle').addEventListener('click', toggleChat);
  document.getElementById('chatClose').addEventListener('click', closeChatWindow);
  document.getElementById('chatSend').addEventListener('click', onSend);
  document.getElementById('chatInput').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } });
}

function toggleChat() {
  chatOpen ? closeChatWindow() : openChatWindow();
}

function openChatWindow() {
  chatOpen = true;
  const win   = document.getElementById('chatWindow');
  const btn   = document.getElementById('chatToggle');
  const badge = document.getElementById('chatBadge');
  win.classList.add('open');
  win.setAttribute('aria-hidden', 'false');
  btn.classList.add('open');
  badge.style.display = 'none';
  if (firstOpen) { firstOpen = false; showWelcome(); }
  setTimeout(() => document.getElementById('chatInput').focus(), 300);
}

function closeChatWindow() {
  chatOpen = false;
  const win = document.getElementById('chatWindow');
  const btn = document.getElementById('chatToggle');
  win.classList.remove('open');
  win.setAttribute('aria-hidden', 'true');
  btn.classList.remove('open');
}

function showWelcome() {
  addBotMessage(`👋 Ciao! Sono l'assistente virtuale di <strong>G.M. Impianti</strong>.<br>Posso risponderti su servizi, preventivi, orari ed emergenze.<br><br>Come posso aiutarti?`);
  addQuickStarts();
}

function addQuickStarts() {
  const msgs = document.getElementById('chatMessages');
  const row  = document.createElement('div');
  row.className = 'chat-quickstarts';
  QUICK_STARTS.forEach(({ label, message }) => {
    const btn = document.createElement('button');
    btn.className = 'chat-suggestion';
    btn.textContent = label;
    btn.addEventListener('click', () => { row.remove(); sendUserMessage(message); });
    row.appendChild(btn);
  });
  msgs.appendChild(row);
  scrollMessages();
}

function addBotMessage(html, suggestions = []) {
  const msgs = document.getElementById('chatMessages');
  const wrap = document.createElement('div');
  wrap.className = 'chat-msg chat-msg--bot';
  wrap.innerHTML = `<div class="chat-avatar">${BOT_AVATAR}</div><div class="chat-bubble"><div class="chat-text">${html.replace(/\n/g, '<br>')}</div></div>`;
  msgs.appendChild(wrap);
  if (suggestions.length) {
    const row = document.createElement('div');
    row.className = 'chat-suggestions';
    suggestions.forEach(label => {
      const btn = document.createElement('button');
      btn.className = 'chat-suggestion';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        row.remove();
        if (SUGGESTION_ACTIONS[label]) { SUGGESTION_ACTIONS[label](); }
        else { sendUserMessage(label); }
      });
      row.appendChild(btn);
    });
    msgs.appendChild(row);
  }
  scrollMessages();
}

function addUserMessage(text) {
  const msgs = document.getElementById('chatMessages');
  const wrap = document.createElement('div');
  wrap.className = 'chat-msg chat-msg--user';
  wrap.innerHTML = `<div class="chat-bubble"><div class="chat-text">${escHtml(text)}</div></div>`;
  msgs.appendChild(wrap);
  scrollMessages();
}

function showTyping() {
  const msgs = document.getElementById('chatMessages');
  const el   = document.createElement('div');
  el.className = 'chat-msg chat-msg--bot chat-typing-row';
  el.id = 'chatTyping';
  el.innerHTML = `<div class="chat-avatar">${BOT_AVATAR}</div><div class="chat-bubble chat-typing"><span></span><span></span><span></span></div>`;
  msgs.appendChild(el);
  scrollMessages();
  isTyping = true;
}

function hideTyping() {
  const el = document.getElementById('chatTyping');
  if (el) el.remove();
  isTyping = false;
}

function onSend() {
  const input = document.getElementById('chatInput');
  const text  = input.value.trim();
  if (!text || isTyping) return;
  input.value = '';
  sendUserMessage(text);
}

function sendUserMessage(text) {
  addUserMessage(text);
  removeSuggestions();
  showTyping();
  const delay = 700 + Math.random() * 600;
  setTimeout(() => {
    hideTyping();
    const intent = classify(text);
    if (intent) {
      addBotMessage(intent.response(), intent.suggestions || []);
    } else {
      addBotMessage(FALLBACK[0], ['Servizi offerti','Richiedi preventivo','Pronto intervento']);
    }
  }, delay);
}

function removeSuggestions() {
  document.querySelectorAll('#chatMessages .chat-suggestions, #chatMessages .chat-quickstarts').forEach(el => el.remove());
}

function scrollMessages() {
  const msgs = document.getElementById('chatMessages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createWidget);
} else {
  createWidget();
}
