const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const User    = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order   = require('../models/Order');

// ─── Categories ───────────────────────────────────────────────────────────────
const categories = [
  { name: 'Smartphones',   icon: '📱', description: 'Latest smartphones and accessories' },
  { name: 'Laptops',       icon: '💻', description: 'Laptops and computing devices' },
  { name: 'Headphones',    icon: '🎧', description: 'Audio headphones and earbuds' },
  { name: 'Tablets',       icon: '📟', description: 'Tablets and e-readers' },
  { name: 'Cameras',       icon: '📷', description: 'Digital cameras and accessories' },
  { name: 'Smart Watches', icon: '⌚', description: 'Smartwatches and fitness bands' },
  { name: 'Gaming',        icon: '🎮', description: 'Gaming consoles and accessories' },
  { name: 'TVs',           icon: '📺', description: 'Smart TVs and displays' }
];

// ─── Products (all images from picsum.photos — always loads) ─────────────────
const products = [
  // ── Smartphones ──────────────────────────────────────────────────────────
  {
    name: 'Apple iPhone 15 Pro Max',
    description: 'The most powerful iPhone ever with titanium design, A17 Pro chip, and ProRes 4K video. 6.7" Super Retina XDR display, 48MP main camera, USB-C connectivity.',
    price: 134900, originalPrice: 149900, discount: 10,
    category: 'Smartphones', brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80'
    ],
    stock: 50, sold: 320, rating: 4.8, numReviews: 1240, isFeatured: true,
    tags: ['apple', 'iphone', '5g', 'smartphone', 'ios'],
    specifications: { Display: '6.7" Super Retina XDR', Chip: 'A17 Pro', Camera: '48MP ProRAW', Battery: '4422 mAh', Storage: '256GB', OS: 'iOS 17' }
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: "Samsung's flagship with built-in S Pen, 200MP camera, Snapdragon 8 Gen 3 processor, titanium frame, and 5000mAh battery for all-day power.",
    price: 129999, originalPrice: 139999, discount: 7,
    category: 'Smartphones', brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80',
      'https://images.unsplash.com/photo-1592899792577-a2a7aa8e715f?w=600&q=80'
    ],
    stock: 35, sold: 210, rating: 4.7, numReviews: 892, isFeatured: true,
    tags: ['samsung', 'galaxy', 's-pen', '5g', 'android'],
    specifications: { Display: '6.8" Dynamic AMOLED 2X', Processor: 'Snapdragon 8 Gen 3', Camera: '200MP', Battery: '5000 mAh', RAM: '12GB', Storage: '256GB' }
  },
  {
    name: 'OnePlus 12 5G',
    description: 'Powered by Snapdragon 8 Gen 3, 50MP Hasselblad camera system, 100W SUPERVOOC charging, and 5400mAh battery. The speed flagship at an amazing price.',
    price: 64999, originalPrice: 74999, discount: 13,
    category: 'Smartphones', brand: 'OnePlus',
    images: [
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80'
    ],
    stock: 60, sold: 185, rating: 4.5, numReviews: 654, isFeatured: false,
    tags: ['oneplus', '5g', 'android', 'fast-charging'],
    specifications: { Display: '6.82" LTPO AMOLED', Processor: 'Snapdragon 8 Gen 3', Camera: '50MP Hasselblad', Battery: '5400 mAh', Charging: '100W SUPERVOOC' }
  },
  {
    name: 'Google Pixel 8 Pro',
    description: 'Google Tensor G3 chip, 50MP camera with AI Magic Eraser, 7 years of OS updates, Temperature sensor, and the cleanest Android experience.',
    price: 89999, originalPrice: 99999, discount: 10,
    category: 'Smartphones', brand: 'Google',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80'
    ],
    stock: 40, sold: 98, rating: 4.6, numReviews: 445, isFeatured: false,
    tags: ['google', 'pixel', 'android', 'ai'],
    specifications: { Display: '6.7" LTPO OLED', Processor: 'Google Tensor G3', Camera: '50MP + 48MP + 48MP', Battery: '5050 mAh', Updates: '7 years' }
  },

  // ── Laptops ───────────────────────────────────────────────────────────────
  {
    name: 'MacBook Pro 16" M3 Max',
    description: 'Incredible performance with M3 Max chip, up to 22 hours battery life, Liquid Retina XDR display. Perfect for video editors, 3D artists and developers.',
    price: 299900, originalPrice: 329900, discount: 9,
    category: 'Laptops', brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80'
    ],
    stock: 20, sold: 145, rating: 4.9, numReviews: 567, isFeatured: true,
    tags: ['macbook', 'apple', 'm3', 'laptop', 'pro'],
    specifications: { Chip: 'Apple M3 Max', RAM: '36GB', Storage: '1TB SSD', Display: '16.2" Liquid Retina XDR', Battery: '22 hours', Ports: 'Thunderbolt 4 × 3' }
  },
  {
    name: 'Dell XPS 15 (2024)',
    description: 'Premium ultrabook with Intel Core i9, 32GB RAM, NVIDIA RTX 4070, and stunning OLED display. Ideal for creators, engineers and power users.',
    price: 189900, originalPrice: 209900, discount: 9,
    category: 'Laptops', brand: 'Dell',
    images: [
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80'
    ],
    stock: 15, sold: 89, rating: 4.6, numReviews: 324, isFeatured: false,
    tags: ['dell', 'xps', 'laptop', 'intel', 'creator'],
    specifications: { Processor: 'Intel Core i9-13900H', RAM: '32GB DDR5', Storage: '1TB NVMe', GPU: 'RTX 4070', Display: '15.6" OLED 3.5K' }
  },
  {
    name: 'ASUS ROG Strix G16',
    description: 'Gaming powerhouse with Intel Core i9-13980HX, RTX 4090, 240Hz QHD display, and MUX Switch for pure GPU performance. Dominate every game.',
    price: 249999, originalPrice: 279999, discount: 11,
    category: 'Laptops', brand: 'ASUS',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80'
    ],
    stock: 12, sold: 56, rating: 4.7, numReviews: 213, isFeatured: true,
    tags: ['asus', 'rog', 'gaming', 'laptop', 'rtx'],
    specifications: { Processor: 'Intel Core i9-13980HX', RAM: '32GB DDR5', Storage: '2TB NVMe', GPU: 'RTX 4090 16GB', Display: '16" QHD 240Hz' }
  },

  // ── Headphones ────────────────────────────────────────────────────────────
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling with 30hr battery, multipoint Bluetooth, and exceptional Hi-Res audio quality. The best headphones money can buy.',
    price: 28990, originalPrice: 34990, discount: 17,
    category: 'Headphones', brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80'
    ],
    stock: 80, sold: 780, rating: 4.7, numReviews: 2100, isFeatured: true,
    tags: ['sony', 'headphones', 'anc', 'wireless', 'hi-res'],
    specifications: { Driver: '30mm', Battery: '30 hours', Connectivity: 'Bluetooth 5.2', ANC: 'Industry-leading', Weight: '250g' }
  },
  {
    name: 'Apple AirPods Pro (2nd Gen)',
    description: 'Adaptive Audio with Transparency mode, Personalized Spatial Audio, H2 chip, and up to 30hrs total battery with the charging case.',
    price: 24900, originalPrice: 26900, discount: 7,
    category: 'Headphones', brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80'
    ],
    stock: 60, sold: 1200, rating: 4.6, numReviews: 3400, isFeatured: false,
    tags: ['apple', 'airpods', 'earbuds', 'wireless', 'anc'],
    specifications: { Chip: 'H2', ANC: 'Adaptive Transparency', Battery: '6hr + 24hr case', Water: 'IPX4', Case: 'MagSafe charging' }
  },
  {
    name: 'Bose QuietComfort 45',
    description: 'Premium noise cancellation with TriPort acoustic architecture, 24hr battery, and foldable design. Crystal clear calls and immersive sound.',
    price: 22990, originalPrice: 29990, discount: 23,
    category: 'Headphones', brand: 'Bose',
    images: [
      'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80'
    ],
    stock: 45, sold: 420, rating: 4.5, numReviews: 876, isFeatured: false,
    tags: ['bose', 'headphones', 'anc', 'wireless'],
    specifications: { Battery: '24 hours', ANC: 'Quiet & Aware modes', Connectivity: 'Bluetooth 5.1', Weight: '238g', Foldable: 'Yes' }
  },

  // ── Tablets ───────────────────────────────────────────────────────────────
  {
    name: 'iPad Pro 12.9" M2',
    description: 'The most advanced iPad with M2 chip, ProMotion display, Apple Pencil hover experience, Liquid Retina XDR display and Thunderbolt connectivity.',
    price: 112900, originalPrice: 122900, discount: 8,
    category: 'Tablets', brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80'
    ],
    stock: 25, sold: 234, rating: 4.8, numReviews: 789, isFeatured: true,
    tags: ['apple', 'ipad', 'tablet', 'm2', 'pro'],
    specifications: { Chip: 'M2', Display: '12.9" Liquid Retina XDR', Storage: '256GB', Camera: '12MP ProRAW', Connectivity: 'Thunderbolt 4, 5G' }
  },
  {
    name: 'Samsung Galaxy Tab S9 Ultra',
    description: 'Massive 14.6" AMOLED display, Snapdragon 8 Gen 2, S Pen included, 12000mAh battery and desktop-class DeX mode for ultimate productivity.',
    price: 108999, originalPrice: 119999, discount: 9,
    category: 'Tablets', brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=600&q=80',
      'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?w=600&q=80'
    ],
    stock: 18, sold: 156, rating: 4.6, numReviews: 412, isFeatured: false,
    tags: ['samsung', 'galaxy', 'tablet', 'android', 's-pen'],
    specifications: { Display: '14.6" Dynamic AMOLED 2X', Processor: 'Snapdragon 8 Gen 2', RAM: '12GB', Battery: '12000 mAh', 'S Pen': 'Included' }
  },

  // ── Cameras ───────────────────────────────────────────────────────────────
  {
    name: 'Sony Alpha A7 IV',
    description: 'Full-frame mirrorless camera with 33MP BSI sensor, 4K60p video, real-time tracking AF, weather sealing, and dual card slots. The hybrid perfection.',
    price: 249900, originalPrice: 269900, discount: 7,
    category: 'Cameras', brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80'
    ],
    stock: 12, sold: 78, rating: 4.8, numReviews: 456, isFeatured: true,
    tags: ['sony', 'camera', 'mirrorless', 'full-frame', '4k'],
    specifications: { Sensor: '33MP Full-frame BSI CMOS', Video: '4K60p', 'AF Points': '759', ISO: '100-51200', Weather: 'Sealed' }
  },
  {
    name: 'Canon EOS R6 Mark II',
    description: '40fps burst, IBIS up to 8 stops, 4K60p video with no crop, eye-tracking for humans/animals/vehicles. Perfect for sports and wildlife photographers.',
    price: 239900, originalPrice: 259900, discount: 8,
    category: 'Cameras', brand: 'Canon',
    images: [
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80',
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=600&q=80'
    ],
    stock: 8, sold: 45, rating: 4.7, numReviews: 234, isFeatured: false,
    tags: ['canon', 'eos', 'mirrorless', 'rf-mount', '4k'],
    specifications: { Sensor: '24.2MP Full-frame CMOS', Video: '4K60p', 'Burst Rate': '40fps', IBIS: '8 stops', Weather: 'Sealed' }
  },

  // ── Smart Watches ─────────────────────────────────────────────────────────
  {
    name: 'Apple Watch Ultra 2',
    description: 'The most capable Apple Watch with titanium case, precision dual-frequency GPS, 3000 nits display, and 60hr battery in low power mode. Built for extremes.',
    price: 89900, originalPrice: 95900, discount: 6,
    category: 'Smart Watches', brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'
    ],
    stock: 30, sold: 267, rating: 4.7, numReviews: 634, isFeatured: true,
    tags: ['apple', 'watch', 'smartwatch', 'fitness', 'ultra'],
    specifications: { Case: 'Titanium 49mm', Display: '3000 nits LTPO OLED', Battery: '60hr low power', Water: '100m WR', GPS: 'Dual-frequency L1+L5' }
  },
  {
    name: 'Samsung Galaxy Watch 6 Classic',
    description: 'Rotating bezel, sapphire crystal glass, advanced health tracking including blood pressure and ECG, Google ecosystem integration, and 40hr battery.',
    price: 44999, originalPrice: 49999, discount: 10,
    category: 'Smart Watches', brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80'
    ],
    stock: 40, sold: 312, rating: 4.5, numReviews: 421, isFeatured: false,
    tags: ['samsung', 'watch', 'galaxy', 'android', 'health'],
    specifications: { Display: '1.5" AMOLED 480×480', Battery: '590 mAh / 40hr', Water: '5ATM + IP68', OS: 'Wear OS 4', Sensors: 'ECG, BP, SpO2' }
  },

  // ── Gaming ────────────────────────────────────────────────────────────────
  {
    name: 'PlayStation 5 Digital Edition',
    description: 'Experience lightning-fast SSD loading, haptic feedback DualSense controller, 3D audio, and next-generation exclusive titles. The future of gaming is here.',
    price: 44990, originalPrice: 49990, discount: 10,
    category: 'Gaming', brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&q=80',
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80'
    ],
    stock: 18, sold: 890, rating: 4.8, numReviews: 2890, isFeatured: true,
    tags: ['playstation', 'ps5', 'gaming', 'console', 'sony'],
    specifications: { CPU: 'AMD Zen 2 3.5GHz', GPU: '10.28 TFLOPS RDNA 2', RAM: '16GB GDDR6', Storage: '825GB Custom SSD', 'Optical Drive': 'None (Digital)' }
  },
  {
    name: 'Xbox Series X',
    description: '12 teraflops GPU, 120fps gaming, Quick Resume for multiple games, Smart Delivery, and Game Pass integration. The most powerful Xbox ever.',
    price: 49990, originalPrice: 54990, discount: 9,
    category: 'Gaming', brand: 'Microsoft',
    images: [
      'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&q=80',
      'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&q=80'
    ],
    stock: 22, sold: 445, rating: 4.7, numReviews: 1567, isFeatured: false,
    tags: ['xbox', 'microsoft', 'gaming', 'console', '4k'],
    specifications: { CPU: 'AMD Zen 2 3.8GHz', GPU: '12 TFLOPS RDNA 2', RAM: '16GB GDDR6', Storage: '1TB Custom NVMe', 'Max Resolution': '8K (UHD)' }
  },

  // ── TVs ───────────────────────────────────────────────────────────────────
  {
    name: 'Samsung 65" Neo QLED 4K',
    description: 'Quantum Matrix Technology with Neo Quantum Processor 4K, Object Tracking Sound+, Anti-Reflection panel, and 144Hz for gaming and sports.',
    price: 129900, originalPrice: 149900, discount: 13,
    category: 'TVs', brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&q=80',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600&q=80'
    ],
    stock: 10, sold: 123, rating: 4.6, numReviews: 567, isFeatured: false,
    tags: ['samsung', 'tv', 'qled', '4k', 'smart-tv', '144hz'],
    specifications: { Size: '65 inches', Resolution: '4K UHD', HDR: 'Quantum HDR 32X', Refresh: '144Hz', Smart: 'Tizen OS', 'Gaming Hub': 'Yes' }
  },
  {
    name: 'LG C3 65" OLED evo 4K',
    description: 'OLED evo panel with α9 AI Processor Gen6, Dolby Vision IQ, Dolby Atmos, 120Hz HDMI 2.1, and perfect blacks. The reference TV for cinephiles.',
    price: 159900, originalPrice: 189900, discount: 16,
    category: 'TVs', brand: 'LG',
    images: [
      'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=600&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'
    ],
    stock: 8, sold: 98, rating: 4.9, numReviews: 334, isFeatured: true,
    tags: ['lg', 'oled', '4k', 'dolby', 'tv', 'gaming'],
    specifications: { Size: '65 inches', Panel: 'OLED evo', Resolution: '4K UHD', HDR: 'Dolby Vision IQ', Refresh: '120Hz', HDMI: '4x HDMI 2.1' }
  }
];

// ─── Seed function ────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({})
    ]);
    // Drop stale indexes left over from old schema versions (survive deleteMany)
    await Promise.all([
      Order.collection.dropIndexes().catch(() => {}),
      Category.collection.dropIndexes().catch(() => {}),
      Product.collection.dropIndexes().catch(() => {})
    ]);
    console.log('🗑️  Cleared existing data + dropped stale indexes');

    // Create categories
    // Use create() not insertMany() — triggers pre-save hook that generates slug
    const createdCats = [];
    for (const c of categories) {
      const cat = await Category.create(c);
      createdCats.push(cat);
    }
    console.log(`✅ Created ${createdCats.length} categories`);

    // Create products one-by-one (uses pre-save hook for SKU + handles Map specs)
    const createdProducts = [];
    for (const p of products) {
      const prod = await Product.create(p);
      createdProducts.push(prod);
    }
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create sample users
    const hashedPw = await bcrypt.hash('User@123', 12);
    const sampleUsers = [
      { name: 'Priya Sharma',  email: 'priya@example.com',  password: hashedPw, phone: '9876543210' },
      { name: 'Rahul Kumar',   email: 'rahul@example.com',  password: hashedPw, phone: '9876543211' },
      { name: 'Sneha Patel',   email: 'sneha@example.com',  password: hashedPw, phone: '9876543212' },
      { name: 'Arjun Singh',   email: 'arjun@example.com',  password: hashedPw, phone: '9876543213' },
      { name: 'Meera Nair',    email: 'meera@example.com',  password: hashedPw, phone: '9876543214' }
    ];

    const userDocs = [];
    for (const u of sampleUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        const created = await User.create(u);
        userDocs.push(created);
      } else {
        userDocs.push(exists);
      }
    }
    console.log(`✅ Created ${userDocs.length} users`);

    // Create sample orders so admin dashboard has data
    const orderStatuses = ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'delivered', 'delivered', 'cancelled'];
    for (let i = 0; i < 15; i++) {
      const user = userDocs[i % userDocs.length];
      const p1 = createdProducts[i % createdProducts.length];
      const p2 = createdProducts[(i + 3) % createdProducts.length];
      const qty1 = 1, qty2 = 1;
      const price1 = p1.discount > 0 ? Math.round(p1.price - (p1.price * p1.discount / 100)) : p1.price;
      const price2 = p2.discount > 0 ? Math.round(p2.price - (p2.price * p2.discount / 100)) : p2.price;
      const itemsTotal = price1 * qty1 + price2 * qty2;
      const shippingCharge = itemsTotal >= 999 ? 0 : 49;
      const status = orderStatuses[i % orderStatuses.length];
      const payMethod = ['cod', 'upi', 'card', 'netbanking'][i % 4];
      const createdDate = new Date(Date.now() - (i * 3 * 24 * 60 * 60 * 1000)); // staggered dates

      await Order.create({
        user: user._id,
        items: [
          { product: p1._id, name: p1.name, image: p1.images[0], price: price1, quantity: qty1, subtotal: price1 * qty1 },
          { product: p2._id, name: p2.name, image: p2.images[0], price: price2, quantity: qty2, subtotal: price2 * qty2 }
        ],
        shippingAddress: {
          name: user.name, phone: user.phone || '9876543210',
          street: `${100 + i}, Sample Street`, city: ['Chennai', 'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad'][i % 5],
          state: ['Tamil Nadu', 'Maharashtra', 'Delhi', 'Karnataka', 'Telangana'][i % 5],
          pincode: `60000${i % 9 + 1}`, country: 'India'
        },
        paymentMethod: payMethod,
        paymentStatus: (status === 'delivered' || payMethod !== 'cod') ? 'paid' : 'pending',
        orderStatus: status,
        statusHistory: [{ status, note: `Order ${status}` }],
        itemsTotal, shippingCharge, totalAmount: itemsTotal + shippingCharge,
        estimatedDelivery: new Date(createdDate.getTime() + 5 * 24 * 60 * 60 * 1000),
        createdAt: createdDate
      });
    }
    console.log('✅ Created 15 sample orders');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('─────────────────────────────────────────');
    console.log('📧 Admin   : admin@techmart.com  | 🔑 Admin@2026');
    console.log('📧 User 1  : priya@example.com   | 🔑 User@123');
    console.log('📧 User 2  : rahul@example.com   | 🔑 User@123');
    console.log('─────────────────────────────────────────');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    console.error(err);
    process.exit(1);
  }
}

seed();
