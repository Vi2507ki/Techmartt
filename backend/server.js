const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ── CORS: allow all origins (handles localhost dev + Render production) ────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── MongoDB ───────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => { console.error('❌ MongoDB Error:', err.message); process.exit(1); });

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/users',      require('./routes/users'));
app.use('/api/payment',    require('./routes/payment'));
app.use('/api/dashboard',  require('./routes/dashboard'));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({ status: 'TechMart API running 🚀', timestamp: new Date() }));

// ── Serve frontend (works both locally and on Render) ─────────────────────────
const FRONTEND_DIR = path.join(__dirname, '../frontend/pages');
app.use(express.static(FRONTEND_DIR));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api'))
    res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 TechMart running → http://localhost:${PORT}`);
  console.log(`🛒 Shop   → http://localhost:${PORT}/index.html`);
  console.log(`📊 Admin  → http://localhost:${PORT}/admin.html`);
});
