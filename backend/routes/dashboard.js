const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @route GET /api/dashboard/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [totalOrders, monthOrders, lastMonthOrders, totalUsers, totalProducts, lowStockProducts] = await Promise.all([
      Order.countDocuments(),
      Order.find({ createdAt: { $gte: startOfMonth } }),
      Order.find({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ stock: { $lte: 10 }, isActive: true })
    ]);

    const totalRevenue = monthOrders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalAmount, 0);
    const lastMonthRevenue = lastMonthOrders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalAmount, 0);

    // Order status breakdown
    const orderStatusCount = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);

    // Monthly revenue for last 6 months
    const monthlyRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
      { $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top products
    const topProducts = await Product.find({ isActive: true }).sort({ sold: -1 }).limit(5).select('name sold price images');

    // Category sales
    const categorySales = await Order.aggregate([
      { $unwind: '$items' },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      { $group: { _id: '$product.category', total: { $sum: '$items.subtotal' }, count: { $sum: '$items.quantity' } } },
      { $sort: { total: -1 } },
      { $limit: 6 }
    ]);

    res.json({
      stats: {
        totalRevenue,
        lastMonthRevenue,
        revenueGrowth: lastMonthRevenue > 0 ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1) : 0,
        totalOrders,
        monthOrders: monthOrders.length,
        totalUsers,
        totalProducts,
        lowStockProducts
      },
      orderStatusCount,
      monthlyRevenue,
      topProducts,
      categorySales
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
