const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment, demoPayment, webhookHandler } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);
router.post('/demo', protect, demoPayment);
router.post('/webhook', webhookHandler); // No auth — Razorpay calls this

module.exports = router;
