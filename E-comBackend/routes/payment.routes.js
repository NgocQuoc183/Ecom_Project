const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/authMiddleware');

// Tạo URL thanh toán VNPay (cần authentication)
router.post('/vnpay/create-payment-url', authMiddleware, paymentController.createVnpayPaymentUrl);

// Callback từ VNPay (không cần authentication vì đây là webhook)
router.get('/vnpay-callback', paymentController.vnpayCallback);

// Kiểm tra trạng thái thanh toán (cần authentication)
router.get('/status/:orderId', authMiddleware, paymentController.checkPaymentStatus);

// Tạo đơn hàng và thanh toán (cần authentication)
router.post('/create-order-payment', authMiddleware, paymentController.createOrderAndPayment);

module.exports = router;
