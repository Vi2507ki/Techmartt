# 🚀 TechMart — Complete Setup Guide
## E-Commerce Admin & Order Management System

---

## 📁 Project Structure

```
techmart/
│
├── backend/                    ← Node.js + Express API
│   ├── config/
│   │   └── seed.js             ← Database seeder (sample data)
│   ├── middleware/
│   │   └── auth.js             ← JWT auth middleware
│   ├── models/
│   │   ├── User.js             ← User schema (admin + customers)
│   │   ├── Product.js          ← Product schema
│   │   ├── Order.js            ← Order schema with status tracking
│   │   └── Category.js         ← Category schema
│   ├── routes/
│   │   ├── auth.js             ← Login / Register / Profile
│   │   ├── products.js         ← Product CRUD + reviews
│   │   ├── orders.js           ← Order placement + status management
│   │   ├── categories.js       ← Category CRUD
│   │   ├── users.js            ← Admin: manage users
│   │   ├── payment.js          ← Stripe payment intent
│   │   └── dashboard.js        ← Analytics & stats
│   ├── .env                    ← Environment variables
│   ├── package.json
│   └── server.js               ← Main Express server
│
├── frontend/
│   └── pages/
│       ├── index.html          ← 🏠 Shop / Landing Page (Flipkart style)
│       ├── checkout.html       ← 💳 Checkout + Payment
│       ├── orders.html         ← 📦 My Orders (user tracking)
│       ├── admin.html          ← 📊 Admin Dashboard
│       ├── css/
│       │   ├── main.css        ← Shop styles
│       │   └── admin.css       ← Dashboard styles
│       └── js/
│           └── main.js         ← API utility, cart, auth helpers
│
├── frontend-server.js          ← Simple static file server (port 3000)
└── package.json
```

---

## ✅ PREREQUISITES — Install These First

### 1. Node.js (v18 or higher)
Download from: https://nodejs.org/en/download

Verify installation:
```bash
node --version    # should show v18.x.x or higher
npm --version     # should show 9.x.x or higher
```

### 2. MongoDB (Community Edition)

**Option A — Install locally:**
- Windows: https://www.mongodb.com/try/download/community
- macOS: `brew tap mongodb/brew && brew install mongodb-community`
- Ubuntu/Linux:
  ```bash
  sudo apt-get install -y mongodb
  sudo systemctl start mongodb
  sudo systemctl enable mongodb
  ```

**Option B — MongoDB Atlas (Cloud, Free Tier) — Recommended for beginners:**
1. Go to https://cloud.mongodb.com
2. Create a free account
3. Create a free M0 cluster
4. Click **Connect** → **Connect your application**
5. Copy the connection string, e.g.:
   `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/techmart`
6. Paste it into `backend/.env` as `MONGO_URI`

Verify local MongoDB is running:
```bash
mongosh           # opens MongoDB shell — type "exit" to quit
```

### 3. Git (optional but recommended)
Download from: https://git-scm.com/downloads

---

## 🔧 STEP-BY-STEP SETUP

### STEP 1 — Get the Project Files
If you have the ZIP, extract it. Otherwise, navigate to the project folder:
```bash
cd techmart
```

---

### STEP 2 — Configure Environment Variables
Open `backend/.env` in any text editor (Notepad, VS Code, etc.):

```env
MONGO_URI=mongodb://localhost:27017/techmart
JWT_SECRET=techmart_super_secret_key_2026
PORT=5000
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
ADMIN_EMAIL=admin@techmart.com
ADMIN_PASSWORD=Admin@2026
FRONTEND_URL=http://localhost:3000
```

**Important notes:**
- If using **MongoDB Atlas**, replace `MONGO_URI` with your Atlas connection string
- For **Stripe payments**, get free test keys from https://dashboard.stripe.com/test/apikeys
- The ADMIN credentials (`admin@techmart.com` / `Admin@2026`) are fixed — you can change them here

---

### STEP 3 — Install Backend Dependencies
```bash
cd backend
npm install
```

This installs: express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, stripe, nodemon

Expected output:
```
added 120 packages in 15s
```

---

### STEP 4 — Seed the Database with Sample Data
Still inside the `backend/` folder:
```bash
npm run seed
```

Expected output:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
✅ Created 8 categories
✅ Created 12 products
✅ Created sample users (password: User@123)

🎉 Database seeded successfully!
📧 Admin: admin@techmart.com | 🔑 Password: Admin@2026
📧 User:  priya@example.com  | 🔑 Password: User@123
```

---

### STEP 5 — Start the Backend Server
```bash
# For development (auto-restart on file changes):
npm run dev

# For production:
npm start
```

Expected output:
```
✅ MongoDB Connected: techmart database
🚀 TechMart Server running at http://localhost:5000
📊 Admin Dashboard API ready
🛒 E-Commerce API ready
```

**Test the API is working:**
Open your browser and go to:
`http://localhost:5000/api/health`

You should see:
```json
{"status":"TechMart API is running 🚀","timestamp":"..."}
```

---

### STEP 6 — Start the Frontend Server
Open a **NEW terminal window** (keep the backend terminal running):
```bash
# Navigate back to the root project folder
cd ..             # if you're inside backend/

node frontend-server.js
```

Expected output:
```
🌐 TechMart Frontend: http://localhost:3000
   Home/Shop : http://localhost:3000/index.html
   Checkout  : http://localhost:3000/checkout.html
   My Orders : http://localhost:3000/orders.html
   Admin     : http://localhost:3000/admin.html
```

---

### STEP 7 — Open in Browser 🎉
| Page | URL | Who |
|------|-----|-----|
| 🏠 Shop / Landing Page | http://localhost:3000/index.html | All users |
| 💳 Checkout | http://localhost:3000/checkout.html | Logged-in users |
| 📦 My Orders | http://localhost:3000/orders.html | Logged-in users |
| 📊 Admin Dashboard | http://localhost:3000/admin.html | Admin only |

---

## 👤 LOGIN CREDENTIALS

### 🔐 Fixed Admin Account
| Field | Value |
|-------|-------|
| Email | `admin@techmart.com` |
| Password | `Admin@2026` |
| Access | Full admin dashboard |

### 👤 Sample User Accounts (created by seeder)
| Email | Password | Name |
|-------|----------|------|
| `priya@example.com` | `User@123` | Priya Sharma |
| `rahul@example.com` | `User@123` | Rahul Kumar |
| `sneha@example.com` | `User@123` | Sneha Patel |

### ✨ Register New Users
Any visitor can register a new account from the Login button on the shop page.

---

## 🧪 TESTING WITH POSTMAN

### Import and test these endpoints:

**Base URL:** `http://localhost:5000/api`

#### Auth
```
POST /auth/register        — Register new user
POST /auth/login           — Login (returns JWT token)
GET  /auth/me              — Get current user (needs token)
```

#### Products
```
GET  /products             — All products (public)
GET  /products?category=Smartphones&sort=price_asc
GET  /products?search=apple&limit=6
GET  /products/:id         — Single product
POST /products             — Create product (admin token required)
PUT  /products/:id         — Update product (admin token required)
DELETE /products/:id       — Delete product (admin token required)
```

#### Orders
```
POST /orders               — Place order (user token required)
GET  /orders/my            — My orders (user token required)
GET  /orders               — All orders (admin token required)
PUT  /orders/:id/status    — Update status (admin token required)
PUT  /orders/:id/cancel    — Cancel order (user token required)
```

#### Dashboard
```
GET  /dashboard/stats      — Analytics data (admin token required)
```

### How to use JWT in Postman:
1. Login via `POST /auth/login`
2. Copy the `token` from the response
3. In subsequent requests, go to **Authorization** tab
4. Select **Bearer Token** and paste the token

---

## 💳 PAYMENT SETUP (Stripe)

### Test Mode (No real money):
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy **Publishable key** → paste in `.env` as `STRIPE_PUBLISHABLE_KEY`
3. Copy **Secret key** → paste in `.env` as `STRIPE_SECRET_KEY`
4. Restart backend after updating `.env`

### Test Card Numbers (Stripe test mode):
| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 9995` | ❌ Declined |
| `4000 0025 0000 3155` | 🔒 3D Secure |

Use any future expiry date and any 3-digit CVV.

> **Note:** The current implementation simulates payment on the frontend. To enable real Stripe processing, integrate the Stripe.js SDK with the client secret from `/api/payment/create-intent`.

---

## 📊 ADMIN DASHBOARD FEATURES

### Dashboard Overview
- 📈 Monthly revenue with Chart.js bar chart
- 🍩 Orders by status donut chart
- 🏆 Top 5 selling products
- 🗂️ Sales by category pie chart
- ⚠️ Low stock alerts

### Orders Management
- View all orders with filters (by status, search by order ID)
- Update order status: Placed → Confirmed → Processing → Shipped → Out for Delivery → Delivered
- Add status notes for each update

### Products Management
- Full CRUD: Add, Edit, Delete products
- Set discount percentage, featured flag, active/inactive
- Upload multiple image URLs
- Set product tags and specifications

### Inventory Management
- Real-time stock levels per product
- Filter: Low Stock (≤10), Out of Stock, In Stock
- One-click stock quantity update
- Visual warnings for low/out-of-stock items

### Users Management
- View all registered users
- Activate / Deactivate user accounts
- Search by name or email

### Categories Management
- Add, Edit, Delete categories
- Set icon (emoji) and description

### Reports & Analytics
- Revenue trend line chart (last 6 months)
- Orders trend line chart
- Category performance bar chart

---

## 🛒 USER SHOP FEATURES

### Landing Page (Flipkart-style)
- Hero banner with CTA
- Category strip (click to filter)
- Deal banners
- Featured products section
- Full product grid with filters:
  - Filter by category, brand, price range
  - Sort: newest, popular, price, rating
- Product search
- Pagination

### Product Cards
- Discount badges
- Rating with review count
- Price with original price strikethrough
- One-click "Add to Cart"
- Product detail modal with full info

### Cart System
- Slide-in cart sidebar
- Add, remove, update quantities
- Persistent (localStorage — survives page refresh)
- Free shipping above ₹999

### Checkout
- Delivery address form
- Payment methods: Card, UPI, Net Banking, Cash on Delivery
- Card form with formatting (auto-spaces card number, expiry)
- Order summary with price breakdown
- Order placement → success screen with order ID

### Order Tracking
- All past orders listed
- Visual step-by-step tracker (Placed → Delivered)
- Cancel order button (before shipping)
- Estimated delivery date

---

## 🔒 SECURITY FEATURES

| Feature | Implementation |
|---------|---------------|
| Password Hashing | bcryptjs (12 rounds) |
| Authentication | JWT tokens (7-day expiry) |
| Route Protection | Middleware guards on all admin routes |
| Admin Separation | Role-based access (user vs admin) |
| CORS | Configured for localhost only |
| Input Validation | Server-side validation on all routes |

---

## 🐛 COMMON ISSUES & FIXES

### "Cannot connect to MongoDB"
```
❌ MongoDB Connection Error: ECONNREFUSED
```
**Fix:** Start MongoDB service:
- Windows: Open Services → Start "MongoDB"
- macOS: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`
- OR use MongoDB Atlas (cloud) instead

### "Port 5000 already in use"
```
Error: listen EADDRINUSE :::5000
```
**Fix:** Change the PORT in `.env`:
```env
PORT=5001
```
Also update `API_BASE` in `frontend/pages/js/main.js`:
```js
const API_BASE = 'http://localhost:5001/api';
```

### "Products not loading on shop page"
- Make sure the backend is running on port 5000
- Check browser console for CORS errors
- Make sure you ran `npm run seed` to add products

### "Admin login not working"
- Verify `.env` has `ADMIN_EMAIL` and `ADMIN_PASSWORD` set
- Restart the backend after changing `.env`
- Clear browser localStorage: DevTools → Application → Local Storage → Clear

### "Module not found" errors
```bash
cd backend
npm install    # reinstall all dependencies
```

---

## 🚀 RUNNING BOTH SERVERS — QUICK REFERENCE

### Terminal 1 (Backend):
```bash
cd techmart/backend
npm run dev
# Server: http://localhost:5000
```

### Terminal 2 (Frontend):
```bash
cd techmart
node frontend-server.js
# Frontend: http://localhost:3000
```

---

## 📦 TECH STACK SUMMARY

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | HTML5, CSS3, Vanilla JS | Shop UI + Admin Dashboard |
| Styling | Custom CSS (no framework needed) | Flipkart-inspired design |
| Charts | Chart.js 4.x | Revenue, orders, category charts |
| Backend | Node.js + Express.js | REST API server |
| Database | MongoDB + Mongoose | Data storage & schemas |
| Auth | JWT + bcryptjs | Secure login system |
| Payment | Stripe API | Card payment processing |
| Dev Tool | Nodemon | Auto-restart on code changes |

---

## 📝 API ENDPOINTS REFERENCE

```
Authentication:
  POST   /api/auth/register          Register new user
  POST   /api/auth/login             Login (admin or user)
  GET    /api/auth/me                Get current profile
  PUT    /api/auth/update-profile    Update profile

Products:
  GET    /api/products               List (with filters)
  GET    /api/products/:id           Single product
  GET    /api/products/admin/all     Admin: all products
  POST   /api/products               Admin: create
  PUT    /api/products/:id           Admin: update
  DELETE /api/products/:id           Admin: delete
  POST   /api/products/:id/review    User: add review

Orders:
  POST   /api/orders                 Place order
  GET    /api/orders/my              User's orders
  GET    /api/orders/:id             Single order
  GET    /api/orders                 Admin: all orders
  PUT    /api/orders/:id/status      Admin: update status
  PUT    /api/orders/:id/cancel      User: cancel order

Categories:
  GET    /api/categories             List all
  POST   /api/categories             Admin: create
  PUT    /api/categories/:id         Admin: update
  DELETE /api/categories/:id         Admin: delete

Users:
  GET    /api/users                  Admin: all users
  PUT    /api/users/:id/toggle       Admin: activate/deactivate

Payment:
  GET    /api/payment/key            Get Stripe publishable key
  POST   /api/payment/create-intent  Create Stripe payment intent
  POST   /api/payment/verify         Verify payment

Dashboard:
  GET    /api/dashboard/stats        Admin: analytics data

Health:
  GET    /api/health                 Server status check
```

---

*TechMart E-Commerce Admin & Order Management System — Built for Industry Project 2026*
