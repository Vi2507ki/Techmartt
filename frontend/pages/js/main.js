// ===== TechMart API Utility =====
// Auto-detects whether running locally (port 3000 or 5500) or on Render
const API_BASE = (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
) ? 'http://localhost:5000/api'
  : `${window.location.origin}/api`;

const api = {
  getToken: () => localStorage.getItem('tm_token'),
  getUser:  () => JSON.parse(localStorage.getItem('tm_user') || 'null'),

  headers(isAuth = false) {
    const h = { 'Content-Type': 'application/json' };
    if (isAuth) h['Authorization'] = `Bearer ${this.getToken()}`;
    return h;
  },

  async get(endpoint, auth = false) {
    const res = await fetch(`${API_BASE}${endpoint}`, { headers: this.headers(auth) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  },

  async post(endpoint, body, auth = false) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST', headers: this.headers(auth), body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  },

  async put(endpoint, body, auth = false) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT', headers: this.headers(auth), body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  },

  async delete(endpoint, auth = false) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE', headers: this.headers(auth)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  }
};

// ===== Cart Manager =====
const cart = {
  items: JSON.parse(localStorage.getItem('tm_cart') || '[]'),

  save() { localStorage.setItem('tm_cart', JSON.stringify(this.items)); },

  add(product, qty = 1) {
    if (!product._id) { console.warn('Cart: product missing _id, skipping add'); return; }
    const existing = this.items.find(i => i._id === product._id);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, product.stock);
    } else {
      this.items.push({
        _id: product._id, name: product.name,
        image: product.images?.[0] || '',
        price: product.discount > 0
          ? Math.round(product.price - (product.price * product.discount / 100))
          : product.price,
        stock: product.stock, qty
      });
    }
    this.save(); this.updateBadge();
  },

  remove(id) {
    // Handle both normal _id and edge case where _id is undefined/null
    if (id === 'undefined' || id === undefined || id === null || id === 'null') {
      this.items = this.items.filter(i => i._id !== undefined && i._id !== null);
    } else {
      this.items = this.items.filter(i => i._id !== id);
    }
    this.save(); this.updateBadge();
  },
  updateQty(id, qty) {
    // Handle edge case where _id is undefined/null
    let item;
    if (id === 'undefined' || id === undefined || id === null || id === 'null') {
      item = this.items.find(i => i._id === undefined || i._id === null);
    } else {
      item = this.items.find(i => i._id === id);
    }
    if (item) { if (qty <= 0) this.remove(id); else item.qty = Math.min(qty, item.stock); }
    this.save(); this.updateBadge();
  },
  total()  { return this.items.reduce((s, i) => s + i.price * i.qty, 0); },
  count()  { return this.items.reduce((s, i) => s + i.qty, 0); },
  clear()  { this.items = []; this.save(); this.updateBadge(); },
  updateBadge() {
    const badge = document.querySelector('.cart-count');
    if (badge) badge.textContent = this.count() || '';
  }
};

// ===== Auth Helper =====
const auth = {
  isLoggedIn: () => !!localStorage.getItem('tm_token'),
  isAdmin: () => {
    const user = api.getUser();
    return user?.role === 'admin';
  },
  logout() {
    localStorage.removeItem('tm_token');
    localStorage.removeItem('tm_user');
    window.location.href = 'index.html';
  }
};

// ===== Toast =====
function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3500);
}

// ===== Format Price =====
function formatPrice(p) {
  return '₹' + Number(p).toLocaleString('en-IN');
}

// ===== Init =====
cart.updateBadge();
