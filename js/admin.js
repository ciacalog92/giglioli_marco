'use strict';

// ─── CREDENTIALS (modifica questi valori direttamente qui) ───────────────────────
const _ADMIN_USER = 'admin';
const _ADMIN_PASS = 'admin123';

// ─── CHIAVI STORAGE ──────────────────────────────────────────────────────────────
const _SESSION_KEY = 'gm_admin_v1';
const _CONTENT_KEY = 'gm_content_v1';

// ─── HELPERS ─────────────────────────────────────────────────────────────────────
const _isAuth    = () => sessionStorage.getItem(_SESSION_KEY) === '1';
const _getContent = () => { try { return JSON.parse(localStorage.getItem(_CONTENT_KEY)) || {}; } catch { return {}; } };
const _setContent = d  => localStorage.setItem(_CONTENT_KEY, JSON.stringify(d));

// ─── APPLICA CONTENUTO SALVATO (visibile a tutti i visitatori) ───────────────────
function _applyContent() {
  const data = _getContent();

  Object.entries(data).forEach(([key, val]) => {
    if (key === '__gallery__') return;
    document.querySelectorAll(`[data-key="${key}"]`).forEach(el => {
      if (el.tagName === 'IMG') {
        el.src = val;
        el.style.display = 'block';
      } else if (key.endsWith('-img')) {
        // Contenitore immagine: sostituisce il placeholder
        if (val) {
          let img = el.querySelector('img.gm-uploaded');
          if (!img) {
            img = document.createElement('img');
            img.className = 'gm-uploaded';
            img.alt = 'G.M. Impianti';
            img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:3;';
            el.appendChild(img);
          }
          img.src = val;
        }
      } else if (key === 'contact-phone') {
        // sync footer too
        document.querySelectorAll('[data-key="footer-phone"]').forEach(a => { a.textContent = val; a.href = 'tel:' + val.replace(/[\s\-\(\)]/g,''); });
        el.textContent = val;
        el.href = 'tel:' + val.replace(/[\s\-\(\)]/g,'');
      } else if (key === 'footer-phone') {
        // already handled via contact-phone sync above — fall through to innerHTML
        el.textContent = val;
      } else if (key === 'contact-email') {
        document.querySelectorAll('[data-key="footer-email"]').forEach(a => { a.textContent = val; a.href = 'mailto:' + val; });
        el.textContent = val;
        el.href = 'mailto:' + val;
      } else if (key === 'footer-email') {
        el.textContent = val;
      } else {
        el.innerHTML = val;
      }
    });
  });

  // Galleria
  const gallery = data['__gallery__'];
  if (gallery && gallery.length) _renderGallery(gallery);
}

// ─── GALLERIA PROGETTI ───────────────────────────────────────────────────────────
function _renderGallery(images) {
  if (!images || !images.length) return;

  let section = document.getElementById('galleria');
  if (!section) {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    footer.insertAdjacentHTML('beforebegin', `
      <section class="section section--alt" id="galleria">
        <div class="container">
          <div class="section__header">
            <p class="section__eyebrow">I Nostri Lavori</p>
            <h2 class="section__title">Galleria Progetti</h2>
            <p class="section__desc">Una selezione dei nostri interventi più recenti.</p>
          </div>
          <div class="gallery-grid" id="galleryGrid"></div>
        </div>
      </section>
    `);
    section = document.getElementById('galleria');

    // Aggiunge link "Galleria" alla nav se non c'è già
    if (!document.querySelector('[href="#galleria"]')) {
      const ctaItem = document.querySelector('.nav__link--cta')?.closest('li');
      if (ctaItem) {
        const li = document.createElement('li');
        li.innerHTML = '<a href="#galleria" class="nav__link">Galleria</a>';
        ctaItem.parentNode.insertBefore(li, ctaItem);
      }
    }
  }

  // Mostra link galleria nella nav
  const navGallItem = document.getElementById('navGalleriaItem');
  if (navGallItem) navGallItem.style.display = '';

  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  grid.innerHTML = images.map((item, i) => `
    <div class="gallery-item fade-up">
      <img src="${item.src}" alt="${_esc(item.caption || 'Progetto')}" loading="lazy"/>
      ${item.caption ? `<p class="gallery-caption">${_esc(item.caption)}</p>` : ''}
    </div>
  `).join('');
}

function _esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── TOAST ───────────────────────────────────────────────────────────────────────
function _toast(msg, type) {
  const t = document.createElement('div');
  t.className = 'admin-toast' + (type === 'error' ? ' admin-toast--error' : '');
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 350); }, 3200);
}

// ═══════════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════════
const _loginForm = document.getElementById('loginForm');
if (_loginForm) {
  _loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const u = document.getElementById('adminUser').value.trim();
    const p = document.getElementById('adminPass').value;
    if (u === _ADMIN_USER && p === _ADMIN_PASS) {
      sessionStorage.setItem(_SESSION_KEY, '1');
      window.location.href = 'index.html';
    } else {
      document.getElementById('loginError').hidden = false;
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════════
if (!_loginForm) {
  // Applica sempre il contenuto salvato (per tutti i visitatori)
  _applyContent();

  // Pannello admin solo se autenticato
  if (_isAuth()) _initAdmin();
}

// ─── PANNELLO ADMIN ──────────────────────────────────────────────────────────────
function _initAdmin() {
  // Barra superiore
  const bar = document.createElement('div');
  bar.id = 'adminBar';
  bar.className = 'admin-bar';
  bar.innerHTML = `
    <div class="admin-bar__inner">
      <span class="admin-bar__brand">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
        Admin Panel
      </span>
      <div class="admin-bar__actions">
        <button id="abEdit"    class="ab-btn">✏️ Modifica</button>
        <button id="abGallery" class="ab-btn">🖼️ Galleria</button>
        <button id="abSave"    class="ab-btn ab-btn--save" disabled>💾 Salva</button>
        <button id="abReset"   class="ab-btn ab-btn--danger">🗑️ Reset</button>
        <button id="abLogout"  class="ab-btn ab-btn--logout">Esci</button>
      </div>
    </div>
  `;
  document.body.prepend(bar);

  // Sposta il contenuto sotto la barra
  document.documentElement.style.scrollPaddingTop =
    (parseInt(getComputedStyle(document.documentElement).scrollPaddingTop) || 80) + 50 + 'px';

  let _editing  = false;
  let _pending  = {};
  const _markDirty = () => { document.getElementById('abSave').disabled = false; };

  // ── Modifica ──────────────────────────────────────────────────────────────────
  document.getElementById('abEdit').addEventListener('click', () => {
    _editing = !_editing;
    document.body.classList.toggle('admin-editing', _editing);
    document.getElementById('abEdit').textContent = _editing ? '✕ Fine Modifica' : '✏️ Modifica';
    _editing ? _enableEditing(_pending, _markDirty) : _disableEditing();
  });

  // ── Salva ─────────────────────────────────────────────────────────────────────
  document.getElementById('abSave').addEventListener('click', () => {
    _setContent({ ..._getContent(), ..._pending });
    _pending = {};
    document.getElementById('abSave').disabled = true;
    _toast('✓ Modifiche salvate con successo!');
  });

  // ── Reset ────────────────────────────────────────────────────────────────────
  document.getElementById('abReset').addEventListener('click', () => {
    if (confirm('Ripristinare il contenuto originale?\nTutte le modifiche salvate andranno perse.')) {
      localStorage.removeItem(_CONTENT_KEY);
      location.reload();
    }
  });

  // ── Logout ───────────────────────────────────────────────────────────────────
  document.getElementById('abLogout').addEventListener('click', () => {
    sessionStorage.removeItem(_SESSION_KEY);
    location.reload();
  });

  // ── Galleria ─────────────────────────────────────────────────────────────────
  document.getElementById('abGallery').addEventListener('click', () => {
    _openGalleryModal(_pending, _markDirty);
  });
}

// ─── MODALITÀ MODIFICA ────────────────────────────────────────────────────────────
function _enableEditing(pending, markDirty) {
  // Testo editabile
  document.querySelectorAll('[data-key]').forEach(el => {
    const k = el.dataset.key;
    if (!k || k.endsWith('-img') || k.endsWith('-href')) return;
    if (['A','IMG'].includes(el.tagName)) return;
    el.setAttribute('contenteditable', 'true');
    el.classList.add('admin-editable');
  });

  // Event delegation per input
  document._adminInputH = e => {
    const el = e.target.closest('[contenteditable][data-key]');
    if (!el) return;
    pending[el.dataset.key] = el.innerHTML;
    markDirty();
  };
  document.addEventListener('input', document._adminInputH);

  // Overlay immagini (service cards + about)
  document.querySelectorAll('[data-key$="-img"]').forEach(el => {
    const key = el.dataset.key;
    const ov = document.createElement('button');
    ov.className = 'admin-img-overlay';
    ov.type = 'button';
    ov.innerHTML = `<span>📷</span><span>Carica immagine</span>`;
    ov.dataset.forKey = key;
    el.appendChild(ov);

    ov.addEventListener('click', () => {
      const inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = 'image/*';
      inp.addEventListener('change', () => {
        const file = inp.files[0];
        if (!file) return;
        if (file.size > 3 * 1024 * 1024) {
          _toast('Immagine troppo grande (max 3 MB).', 'error'); return;
        }
        const reader = new FileReader();
        reader.onload = ev => {
          const src = ev.target.result;
          pending[key] = src;
          markDirty();
          let img = el.querySelector('img.gm-uploaded');
          if (!img) {
            img = document.createElement('img');
            img.className = 'gm-uploaded';
            img.alt = '';
            img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:3;';
            el.appendChild(img);
          }
          img.src = src;
          _toast('✓ Immagine caricata. Clicca Salva per confermare.');
        };
        reader.readAsDataURL(file);
      });
      inp.click();
    });
  });

  // Overlay logo header
  const logoImg = document.querySelector('.logo__img');
  if (logoImg) {
    const wrap = logoImg.closest('.logo');
    if (wrap && !wrap.querySelector('.admin-img-overlay')) {
      const ov = document.createElement('button');
      ov.className = 'admin-img-overlay admin-img-overlay--logo';
      ov.type = 'button';
      ov.innerHTML = `<span>📷 Logo</span>`;
      wrap.style.position = 'relative';
      wrap.appendChild(ov);
      ov.addEventListener('click', e => {
        e.preventDefault();
        const inp = document.createElement('input');
        inp.type = 'file'; inp.accept = 'image/*';
        inp.addEventListener('change', () => {
          const file = inp.files[0]; if (!file) return;
          if (file.size > 2 * 1024 * 1024) { _toast('Max 2 MB', 'error'); return; }
          const r = new FileReader();
          r.onload = ev => {
            pending['logo-img'] = ev.target.result;
            markDirty();
            logoImg.src = ev.target.result;
            _toast('✓ Logo aggiornato. Clicca Salva.');
          };
          r.readAsDataURL(file);
        });
        inp.click();
      });
    }
  }
}

function _disableEditing() {
  document.querySelectorAll('[contenteditable][data-key]').forEach(el => {
    el.removeAttribute('contenteditable');
    el.classList.remove('admin-editable');
  });
  if (document._adminInputH) {
    document.removeEventListener('input', document._adminInputH);
    document._adminInputH = null;
  }
  document.querySelectorAll('.admin-img-overlay').forEach(el => el.remove());
}

// ─── MODALE GALLERIA ──────────────────────────────────────────────────────────────
function _openGalleryModal(pending, markDirty) {
  const stored  = _getContent();
  let localImgs = JSON.parse(JSON.stringify(
    pending['__gallery__'] ?? stored['__gallery__'] ?? []
  ));

  const modal = document.createElement('div');
  modal.className = 'admin-modal';
  modal.innerHTML = `
    <div class="admin-modal__bd"></div>
    <div class="admin-modal__dialog">
      <div class="admin-modal__head">
        <h3>Gestione Galleria Progetti</h3>
        <button class="admin-modal__cls" type="button">✕</button>
      </div>
      <div class="admin-modal__body">
        <div id="gmGallList" class="gm-gall-list"></div>
        <button id="gmAddPhoto" class="ab-btn ab-btn--add" type="button">+ Aggiungi foto</button>
      </div>
      <div class="admin-modal__foot">
        <button id="gmSaveGall" class="ab-btn ab-btn--save" type="button">Applica</button>
        <button class="admin-modal__cls ab-btn" type="button">Chiudi</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('show'));

  function render() {
    const list = document.getElementById('gmGallList');
    if (!localImgs.length) {
      list.innerHTML = '<p class="gm-gall-empty">Nessuna foto. Clicca "+ Aggiungi foto" per iniziare.</p>';
      return;
    }
    list.innerHTML = localImgs.map((item, i) => `
      <div class="gm-gall-item">
        <img src="${item.src}" alt="preview"/>
        <input class="gm-cap-inp" type="text" data-i="${i}"
               value="${_esc(item.caption || '')}" placeholder="Didascalia (opzionale)"/>
        <button class="ab-btn ab-btn--danger ab-btn--sm gm-del" data-i="${i}" type="button">✕</button>
      </div>
    `).join('');

    list.querySelectorAll('.gm-cap-inp').forEach(inp => {
      inp.addEventListener('input', () => { localImgs[+inp.dataset.i].caption = inp.value; });
    });
    list.querySelectorAll('.gm-del').forEach(btn => {
      btn.addEventListener('click', () => { localImgs.splice(+btn.dataset.i, 1); render(); });
    });
  }
  render();

  document.getElementById('gmAddPhoto').addEventListener('click', () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*'; inp.multiple = true;
    inp.addEventListener('change', () => {
      let done = 0;
      const files = Array.from(inp.files);
      files.forEach(f => {
        if (f.size > 4 * 1024 * 1024) { _toast(f.name + ': max 4 MB', 'error'); done++; return; }
        const r = new FileReader();
        r.onload = e => {
          localImgs.push({ src: e.target.result, caption: '' });
          if (++done === files.length) render();
        };
        r.readAsDataURL(f);
      });
    });
    inp.click();
  });

  document.getElementById('gmSaveGall').addEventListener('click', () => {
    pending['__gallery__'] = localImgs;
    markDirty();
    _renderGallery(localImgs);
    _closeModal(modal);
    _toast('✓ Galleria aggiornata. Clicca Salva per confermare.');
  });

  modal.querySelectorAll('.admin-modal__cls, .admin-modal__bd').forEach(el => {
    el.addEventListener('click', () => _closeModal(modal));
  });
}

function _closeModal(modal) {
  modal.classList.remove('show');
  setTimeout(() => modal.remove(), 300);
}
