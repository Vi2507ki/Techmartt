const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: 0 },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  images: [{ type: String }],
  stock: { type: Number, required: true, default: 0, min: 0 },
  sold: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  specifications: { type: Map, of: String },
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  sku: { type: String, unique: true },
  weight: { type: Number, default: 0 },
  discount: { type: Number, default: 0 }, // percentage
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-generate SKU
productSchema.pre('save', function(next) {
  if (!this.sku) {
    this.sku = 'TM-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  this.updatedAt = new Date();
  next();
});

// Virtual for discount price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return this.price - (this.price * this.discount / 100);
  }
  return this.price;
});

module.exports = mongoose.model('Product', productSchema);
