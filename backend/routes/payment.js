const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// @route POST /api/payment/create-intent
router.post('/create-intent', protect, async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { amount, currency = 'inr' } = req.body;

    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // in paise
      currency,
      metadata: { userId: req.user._id.toString() }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route POST /api/payment/verify
router.post('/verify', protect, async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { paymentIntentId } = req.body;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    res.json({
      verified: paymentIntent.status === 'succeeded',
      status: paymentIntent.status,
      paymentId: paymentIntent.id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/payment/key
router.get('/key', protect, (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

module.exports = router;
