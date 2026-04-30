const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// @route POST /api/orders - Place order
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentId } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items in order' });

    let itemsTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });

      const price = product.discount > 0
        ? product.price - (product.price * product.discount / 100)
        : product.price;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price,
        quantity: item.quantity,
        subtotal: price * item.quantity
      });
      itemsTotal += price * item.quantity;

      // Deduct stock
      product.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }

    const shippingCharge = itemsTotal >= 999 ? 0 : 49;
    const totalAmount = itemsTotal + shippingCharge;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      paymentId: paymentId || '',
      orderStatus: 'placed',
      statusHistory: [{ status: 'placed', note: 'Order placed successfully' }],
      itemsTotal,
      shippingCharge,
      totalAmount,
      estimatedDelivery
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/orders/my - Get user's orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/orders/:id - Get single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images price');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // User can only see their own orders
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/orders - Admin: Get all orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (status) query.orderStatus = status;
    if (search) query.orderId = { $regex: search, $options: 'i' };

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    res.json({ orders, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route PUT /api/orders/:id/status - Admin: Update order status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.orderStatus = status;
    order.statusHistory.push({ status, note: note || `Status updated to ${status}` });
    if (status === 'delivered') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'paid';
    }
    await order.save();
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route PUT /api/orders/:id/cancel - User: Cancel order
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Access denied' });
    if (['shipped', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'Cannot cancel shipped or delivered orders' });
    }

    order.orderStatus = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', note: 'Cancelled by customer' });

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, sold: -item.quantity }
      });
    }
    await order.save();
    res.json({ message: 'Order cancelled', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
