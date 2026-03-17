/* ══════════════════════════════════════════
   MAIN.JS — Wolschicks Studio
   Carrosséis, navbar, utilitários
══════════════════════════════════════════ */

// ── CARROSSÉIS (drag + inércia) ──────────
function initCarousel(trackEl) {
  if (!trackEl) return;

  // duplicar itens para loop infinito
  const items = Array.from(trackEl.children);
  items.forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    trackEl.appendChild(clone);
  });

  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let offset = 0;
  let velocity = 0;
  let lastX = 0;
  let lastTime = 0;
  let rafId = null;

  function getHalfWidth() {
    const all = Array.from(trackEl.children);
    const half = Math.floor(all.length / 2);
    const gap = parseFloat(window.getComputedStyle(trackEl).gap) || 0;
    let w = 0;
    for (let i = 0; i < half; i++) w += all[i].getBoundingClientRect().width;
    w += gap * (half - 1);
    return w;
  }

  function applyTransform(x) {
    trackEl.style.transform = `translateX(${x}px)`;
  }

  function clampLoop(x) {
    const hw = getHalfWidth();
    if (!hw) return x;
    if (x < -hw) return x + hw;
    if (x > 0)   return x - hw;
    return x;
  }

  function getClientX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  function onDown(e) {
    isDragging = true;
    startX = getClientX(e);
    lastX = startX;
    lastTime = Date.now();
    velocity = 0;
    cancelAnimationFrame(rafId);
    trackEl.style.transition = 'none';
    trackEl.closest('.carousel, .wide-section').style.cursor = 'grabbing';
  }

  function onMove(e) {
    if (!isDragging) return;
    const cx = getClientX(e);
    const now = Date.now();
    const dt = now - lastTime || 1;
    velocity = (cx - lastX) / dt;
    lastX = cx;
    lastTime = now;
    offset = clampLoop(currentX + (cx - startX));
    applyTransform(offset);
    e.preventDefault();
  }

  function onUp() {
    if (!isDragging) return;
    isDragging = false;
    currentX = offset;
    const el = trackEl.closest('.carousel, .wide-section');
    if (el) el.style.cursor = 'grab';
    glide();
  }

  function glide() {
    if (Math.abs(velocity) < 0.01) return;
    velocity *= 0.94;
    currentX = clampLoop(currentX + velocity * 16);
    applyTransform(currentX);
    rafId = requestAnimationFrame(glide);
  }

  const container = trackEl.closest('.carousel, .wide-section') || trackEl.parentElement;
  container.addEventListener('mousedown',  onDown);
  container.addEventListener('touchstart', onDown, { passive: false });
  window.addEventListener('mousemove',   onMove, { passive: false });
  window.addEventListener('touchmove',   onMove, { passive: false });
  window.addEventListener('mouseup',     onUp);
  window.addEventListener('touchend',    onUp);
  trackEl.addEventListener('dragstart',  e => e.preventDefault());
}

// ── NAVBAR DROPDOWN (teclado) ─────────────
function initNavbar() {
  const wrap = document.querySelector('.nav-browse-wrap');
  const btn  = document.querySelector('.nav-browse-btn');
  if (!wrap || !btn) return;

  btn.addEventListener('click', () => {
    const isOpen = wrap.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
  });

  document.addEventListener('click', e => {
    if (!wrap.contains(e.target)) wrap.classList.remove('open');
  });
}

// ── SHOP: TROCA GRID/LISTA ────────────────
function initViewToggle() {
  const btns = document.querySelectorAll('.shop-view-btn');
  const grid = document.querySelector('.products-grid');
  if (!btns.length || !grid) return;

  btns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      grid.style.gridTemplateColumns = i === 0 ? 'repeat(3,1fr)' : '1fr';
    });
  });
}

// ── SHOP: URL PARAMS ─────────────────────
function initShopParams() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  if (!cat) return;

  const title = document.querySelector('.shop-topbar-title');
  const crumb = document.querySelector('.shop-topbar-breadcrumb');
  const label = cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ');

  if (title) title.textContent = label;
  if (crumb) {
    crumb.innerHTML = `<a href="../index.html">Home</a> &nbsp;/&nbsp; <a href="categories.html">Shop</a> &nbsp;/&nbsp; ${label}`;
  }

  // marcar checkbox correspondente
  document.querySelectorAll('.filter-check-name').forEach(el => {
    if (el.textContent.toLowerCase().includes(cat.replace(/-/g, ' '))) {
      const cb = el.closest('.filter-check')?.querySelector('input[type="checkbox"]');
      if (cb) cb.checked = true;
    }
  });
}

// ── PRODUCT: QTD ─────────────────────────
function initQty() {
  const dec = document.querySelector('.qty-dec');
  const inc = document.querySelector('.qty-inc');
  const val = document.querySelector('.qty-val');
  if (!dec || !inc || !val) return;

  inc.addEventListener('click', () => { val.textContent = parseInt(val.textContent) + 1; });
  dec.addEventListener('click', () => {
    const n = parseInt(val.textContent);
    if (n > 1) val.textContent = n - 1;
  });
}

// ── PRODUCT: THUMBNAILS ──────────────────
function initThumbs() {
  const thumbs = document.querySelectorAll('.product-thumb');
  if (!thumbs.length) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
}

// ── ACCOUNT: NAV ─────────────────────────
function initAccountNav() {
  const items = document.querySelectorAll('.account-nav-item');
  const sections = document.querySelectorAll('.account-panel');
  if (!items.length || !sections.length) return;

  items.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const target = item.dataset.panel;
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      sections.forEach(s => {
        s.style.display = s.dataset.panel === target ? 'block' : 'none';
      });
    });
  });
}

// ── CARRINHO: REMOVER ITEM ───────────────
function initCart() {
  document.querySelectorAll('.cart-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.cart-item')?.remove();
      updateCartTotal();
    });
  });
}

function updateCartTotal() {
  const prices = document.querySelectorAll('.cart-item-price');
  const totalEl = document.querySelector('.cart-total-value');
  if (!totalEl) return;
  let total = 0;
  prices.forEach(p => { total += parseFloat(p.dataset.price || 0); });
  totalEl.textContent = `$${total.toFixed(2)}`;
}

// ── TOAST NOTIFICATION ───────────────────
function showToast(message) {
  let toast = document.getElementById('ws-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ws-toast';
    toast.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: #fff; color: #000; padding: 12px 28px;
      font-family: 'Oswald', sans-serif; font-size: 13px;
      letter-spacing: 2px; text-transform: uppercase;
      border: 2px solid #000; z-index: 9999;
      opacity: 0; transition: opacity 0.3s; pointer-events: none;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => { toast.style.opacity = '0'; }, 2600);
}

// botões "Add to Cart"
function initAddToCart() {
  document.querySelectorAll('.btn-add-cart, .product-card-cta').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      showToast('Added to cart ✦');
    });
  });
}

// ── INIT ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // carrosséis
  ['track-top', 'track-wide', 'track-bot'].forEach(id => {
    const el = document.getElementById(id);
    if (el) initCarousel(el);
  });

  initNavbar();
  initViewToggle();
  initShopParams();
  initQty();
  initThumbs();
  initAccountNav();
  initCart();
  initAddToCart();
});
