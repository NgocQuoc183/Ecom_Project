const express = require('express');
const router = express.Router();
const { sendPaymentSuccessEmail } = require('../services/emailService');

/**
 * Test Routes - API để test các tính năng
 */

// Test gửi email thanh toán thành công
router.post('/send-test-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Test data
    const testOrderData = {
      order: {
        id: 999,
        total_amount: 750000,
        payment_method: 'vnpay',
        recipient_name: 'Test Customer',
        recipient_phone: '0123456789',
        shipping_address: '123 Test Street, Test City, Vietnam',
        created_at: new Date()
      },
      user: {
        name: 'Test Customer',
        email: email
      },
      orderItems: [
        {
          name: 'Reuzel Blue Pomade',
          quantity: 1,
          price: 350000,
          image: 'https://product.hstatic.net/200000424613/product/reuzel_blue_pomade_4oz_113g_master.jpg'
        },
        {
          name: 'Reuzel Grooming Tonic',
          quantity: 2,
          price: 200000,
          image: 'https://product.hstatic.net/200000424613/product/reuzel__grooming_tonic_3.38oz_100ml_master.jpg'
        }
      ]
    };

    const result = await sendPaymentSuccessEmail(testOrderData);

    if (result.success) {
      res.json({
        success: true,
        message: 'Test email sent successfully!',
        messageId: result.messageId,
        sentTo: email
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending test email',
      error: error.message
    });
  }
});

// Test VNPay callback manually
router.get('/vnpay-callback-test', (req, res) => {
  console.log('=== TEST VNPAY CALLBACK ===');
  console.log('Query params:', req.query);

  res.json({
    success: true,
    message: 'Test callback received',
    params: req.query
  });
});

// Test tạo chữ ký VNPay
router.post('/test-vnpay-signature', (req, res) => {
  const VnPayService = require('../services/vnpayService');
  const vnPayService = new VnPayService();

  const testParams = {
    vnp_Amount: '1000000',
    vnp_Command: 'pay',
    vnp_CreateDate: '20250815120000',
    vnp_CurrCode: 'VND',
    vnp_IpAddr: '127.0.0.1',
    vnp_Locale: 'vn',
    vnp_OrderInfo: 'Test payment',
    vnp_OrderType: 'other',
    vnp_ReturnUrl: 'http://localhost:3001/api/test/vnpay-callback-test',
    vnp_TmnCode: process.env.VNPAY_TMN_CODE,
    vnp_TxnRef: '123',
    vnp_Version: '2.1.0'
  };

  const signature = vnPayService.createSignature(testParams);

  res.json({
    success: true,
    testParams,
    signature,
    hashSecret: process.env.VNPAY_HASH_SECRET
  });
});

// Simulate VNPay callback thành công
router.get('/simulate-vnpay-success/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { sendPaymentSuccessEmail } = require('../services/emailService');

    // Simulate cập nhật order status
    const db = require('../config/db');
    const updateOrderSql = `
      UPDATE orders
      SET status = 'confirmed',
          payment_status = 'paid',
          vnpay_transaction_no = 'TEST_TXN_${Date.now()}',
          vnpay_response_code = '00',
          updated_at = NOW()
      WHERE id = ?
    `;

    db.query(updateOrderSql, [orderId], async (err) => {
      if (err) {
        console.error('Error updating order status:', err);
        return res.status(500).json({
          success: false,
          message: 'Error updating order status',
          error: err.message
        });
      }

      console.log('Order status updated successfully:', orderId);

      // Gửi email thông báo thanh toán thành công
      try {
        // Lấy thông tin đơn hàng để gửi email
        const orderDetailsSql = `
          SELECT
            o.*,
            u.name as user_name,
            u.email as user_email
          FROM orders o
          JOIN users u ON o.user_id = u.id
          WHERE o.id = ?
        `;

        db.query(orderDetailsSql, [orderId], async (orderErr, orderResults) => {
          if (orderErr || orderResults.length === 0) {
            throw new Error('Order not found');
          }

          const order = orderResults[0];
          const user = {
            name: order.user_name,
            email: order.user_email
          };

          // Lấy order items
          const orderItemsSql = `
            SELECT
              oi.*,
              p.name,
              p.image
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
          `;

          db.query(orderItemsSql, [orderId], async (itemsErr, itemsResults) => {
            if (itemsErr) {
              throw new Error('Error fetching order items');
            }

            const orderItems = itemsResults;
            const emailResult = await sendPaymentSuccessEmail({
              order,
              user,
              orderItems
            });

            res.json({
              success: true,
              message: 'Order updated and email sent successfully',
              orderId: orderId,
              emailResult: emailResult
            });
          });
        });
      } catch (emailError) {
        console.error('Error sending payment success email:', emailError);
        res.json({
          success: true,
          message: 'Order updated but email failed',
          orderId: orderId,
          emailError: emailError.message
        });
      }
    });

  } catch (error) {
    console.error('Error simulating VNPay success:', error);
    res.status(500).json({
      success: false,
      message: 'Error simulating payment success',
      error: error.message
    });
  }
});

// API cho admin xác nhận thanh toán thành công
router.post('/confirm-payment/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { sendPaymentSuccessEmail } = require('../services/emailService');
    const db = require('../config/db');

    // Cập nhật trạng thái đơn hàng
    const updateOrderSql = `
      UPDATE orders
      SET status = 'confirmed',
          payment_status = 'paid',
          vnpay_transaction_no = 'ADMIN_CONFIRMED_${Date.now()}',
          vnpay_response_code = '00',
          updated_at = NOW()
      WHERE id = ? AND payment_status != 'paid'
    `;

    db.query(updateOrderSql, [orderId], async (err, result) => {
      if (err) {
        console.error('Error updating order status:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi cập nhật trạng thái đơn hàng',
          error: err.message
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Đơn hàng không tồn tại hoặc đã được thanh toán'
        });
      }

      console.log('✅ Order payment confirmed by admin:', orderId);

      // Gửi email thông báo
      try {
        // Lấy thông tin đơn hàng
        const orderDetailsSql = `
          SELECT
            o.*,
            u.name as user_name,
            u.email as user_email
          FROM orders o
          JOIN users u ON o.user_id = u.id
          WHERE o.id = ?
        `;

        db.query(orderDetailsSql, [orderId], async (orderErr, orderResults) => {
          if (orderErr || orderResults.length === 0) {
            return res.json({
              success: true,
              message: 'Đã xác nhận thanh toán nhưng không thể gửi email',
              orderId: orderId
            });
          }

          const order = orderResults[0];
          const user = {
            name: order.user_name,
            email: order.user_email
          };

          // Lấy order items
          const orderItemsSql = `
            SELECT
              oi.*,
              p.name,
              p.image
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
          `;

          db.query(orderItemsSql, [orderId], async (itemsErr, itemsResults) => {
            if (itemsErr) {
              return res.json({
                success: true,
                message: 'Đã xác nhận thanh toán nhưng không thể gửi email',
                orderId: orderId
              });
            }

            const orderItems = itemsResults;
            const emailResult = await sendPaymentSuccessEmail({
              order,
              user,
              orderItems
            });

            res.json({
              success: true,
              message: 'Xác nhận thanh toán và gửi email thành công',
              orderId: orderId,
              emailResult: emailResult
            });
          });
        });
      } catch (emailError) {
        console.error('Error sending payment success email:', emailError);
        res.json({
          success: true,
          message: 'Đã xác nhận thanh toán nhưng gửi email thất bại',
          orderId: orderId,
          emailError: emailError.message
        });
      }
    });

  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi xác nhận thanh toán',
      error: error.message
    });
  }
});

// API lấy danh sách đơn hàng chưa thanh toán
router.get('/pending-payments', (req, res) => {
  const db = require('../config/db');

  const sql = `
    SELECT
      o.id,
      o.user_id,
      o.total_amount,
      o.payment_method,
      o.payment_status,
      o.status,
      o.recipient_name,
      o.recipient_phone,
      o.shipping_address,
      o.created_at,
      u.name as user_name,
      u.email as user_email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.payment_status = 'pending'
      AND o.payment_method = 'VNPay'
    ORDER BY o.created_at DESC
    LIMIT 20
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching pending payments:', err);
      return res.status(500).json({
        success: false,
        message: 'Lỗi lấy danh sách đơn hàng',
        error: err.message
      });
    }

    res.json({
      success: true,
      message: 'Lấy danh sách đơn hàng thành công',
      data: results,
      count: results.length
    });
  });
});

// Test tạo URL VNPay đơn giản
router.get('/test-vnpay-url', (req, res) => {
  try {
    const VnPayService = require('../services/vnpayService');
    const vnPayService = new VnPayService();

    // Test data đơn giản
    const testPayment = {
      orderId: 999,
      amount: 100000, // 1,000 VND
      orderDescription: 'Test payment simple',
      orderType: 'other'
    };

    const testIp = '127.0.0.1';
    const paymentUrl = vnPayService.createPaymentUrl(testPayment, testIp);

    res.json({
      success: true,
      message: 'Test VNPay URL created successfully',
      paymentUrl: paymentUrl,
      testData: testPayment,
      note: 'Copy URL này và paste vào browser để test thanh toán'
    });

  } catch (error) {
    console.error('Error creating test VNPay URL:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating test VNPay URL',
      error: error.message
    });
  }
});

module.exports = router;
