# TechMart — How to Run

## ✅ Prerequisites
- Node.js v18+ → https://nodejs.org
- MongoDB Community Server → https://www.mongodb.com/try/download/community
  (Install with "Run as Service" checked — starts automatically)

---

## 🚀 Local Setup (Step by Step)

### Step 1 — Install dependencies
```bash
cd techmart-deploy/backend
npm install
```

### Step 2 — Seed the database (products + users + orders)
```bash
npm run seed
```
Expected:
```
✅ Connected to MongoDB
✅ Created 8 categories
✅ Created 20 products
✅ Created 5 users
✅ Created 15 sample orders
🎉 Database seeded successfully!
```

### Step 3 — Start backend (Terminal 1)
```bash
npm run dev
# → http://localhost:5000
```

### Step 4 — Start frontend (Terminal 2, new window)
```bash
cd ..   ← go back to techmart-deploy/
node frontend-server.js
# → http://localhost:3000
```

### Step 5 — Open browser
| Page      | URL                              |
|-----------|----------------------------------|
| Shop      | http://localhost:3000/index.html |
| Orders    | http://localhost:3000/orders.html |
| Checkout  | http://localhost:3000/checkout.html |
| Admin     | http://localhost:3000/admin.html |

---

## 🔑 Login Credentials

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@techmart.com     | Admin@2026 |
| User  | priya@example.com      | User@123   |
| User  | rahul@example.com      | User@123   |

---

## 🗄️ MongoDB Compass

1. Open Compass → connect to: `mongodb://localhost:27017`
2. After seeding you'll see: `techmart` database with:
   - categories (8)
   - products (20)
   - users (5+)
   - orders (15)

---

## ☁️ Deploy to Render (After Compass Testing)

1. Create MongoDB Atlas free account → get connection string
2. Update `backend/.env`:  MONGO_URI=mongodb+srv://...
3. Run `npm run seed` again to populate cloud DB
4. Push project to GitHub
5. Render → New Web Service → connect repo
6. Build: `cd backend && npm install`
7. Start: `cd backend && node server.js`
8. Add env vars in Render dashboard (MONGO_URI, JWT_SECRET, ADMIN_PASSWORD)

---

## 🐛 Common Fixes

| Error | Fix |
|-------|-----|
| `ECONNREFUSED` | Start MongoDB (Services → MongoDB) |
| Products not loading | Make sure backend is running on :5000 |
| Login failing | Clear localStorage in DevTools |
| Admin page blank | Run seed first, then login as admin |
