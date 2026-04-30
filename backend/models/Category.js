const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  icon: { type: String, default: '📦' },
  isActive: { type: Boolean, default: true },
  productCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
