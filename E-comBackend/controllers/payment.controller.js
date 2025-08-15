const VnPayService = require('../services/vnpayService');
const db = require('../config/db');
const { sendPaymentSuccessEmail } = require('../services/emailService');

/**
 * Payment Controller - Xử lý thanh toán theo chuẩn Node.js
 */

// Khởi tạo VNPay service
let vnPayService;
try {
  vnPayService = new VnPayService();
} catch (error) {
  console.error('Failed to initialize VNPay service:', error);
  process.exit(1);
}

/**
 * Tạo URL thanh toán VNPay
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
exports.createVnpayPaymentUrl = async (req, res) => {
  try {
    const { orderId, amount, orderDescription, orderType, bankCode } = req.body;

    // Validation
    if (!orderId || !amount || !orderDescription) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: orderId, amount, orderDescription'
      });
    }

    // Lấy IP address của client
    const ipAddr = vnPayService.getClientIpAddress(req);

    // Tạo URL thanh toán
    const paymentUrl = vnPayService.createPaymentUrl({
      orderId,
      amount,
      orderDescription,
      orderType: orderType || 'other',
      bankCode: bankCode || ''
    }, ipAddr);

    // Log payment request
    console.log('VNPay Payment URL created:', {
      orderId,
      amount,
      orderDescription,
      ipAddr,
      timestamp: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: 'Tạo URL thanh toán thành công',
      paymentUrl,
      orderId
    });

  } catch (error) {
    console.error('Error creating VNPay payment URL:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi tạo URL thanh toán',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Xử lý callback từ VNPay
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
exports.vnpayCallback = async (req, res) => {
  try {
    const vnpParams = req.query;

    console.log('=== VNPAY CALLBACK DEBUG ===');
    console.log('Full URL:', req.url);
    console.log('Query params:', JSON.stringify(vnpParams, null, 2));
    console.log('VNPay callback received:', vnpParams);

    // Validate callback parameters
    if (!vnpParams.vnp_TxnRef || !vnpParams.vnp_ResponseCode) {
      console.error('Invalid VNPay callback parameters');
      return res.redirect(`http://localhost:5173/payment-failed?message=${encodeURIComponent('Tham số callback không hợp lệ')}`);
    }

    // Xử lý response từ VNPay
    const result = vnPayService.processVnpayReturn(vnpParams);

    if (result.success) {
      // Cập nhật trạng thái đơn hàng trong database
      const orderId = result.data.orderId;

      const updateOrderSql = `
        UPDATE orders
        SET status = 'confirmed',
            payment_status = 'paid',
            vnpay_transaction_no = ?,
            vnpay_response_code = ?,
            updated_at = NOW()
        WHERE id = ?
      `;

      db.query(updateOrderSql, [
        result.data.transactionNo,
        vnpParams.vnp_ResponseCode,
        orderId
      ], async (err) => {
        if (err) {
          console.error('Error updating order status:', err);
        } else {
          console.log('Order status updated successfully:', orderId);

          // Gửi email thông báo thanh toán thành công
          try {
            await sendPaymentSuccessEmailForOrder(orderId);
          } catch (emailError) {
            console.error('Error sending payment success email:', emailError);
            // Không làm gián đoạn flow chính nếu gửi email lỗi
          }
        }
      });

      // Redirect về trang thành công
      return res.redirect(`http://localhost:5173/payment-success?orderId=${orderId}&transactionNo=${result.data.transactionNo}`);
    } else {
      // Redirect về trang thất bại
      return res.redirect(`http://localhost:5173/payment-failed?orderId=${vnpParams.vnp_TxnRef}&message=${encodeURIComponent(result.message)}`);
    }

  } catch (error) {
    console.error('Error processing VNPay callback:', error);
    return res.redirect(`http://localhost:5173/payment-failed?message=${encodeURIComponent('Lỗi xử lý thanh toán')}`);
  }
};

// API để frontend kiểm tra trạng thái thanh toán
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const sql = `
      SELECT 
        id,
        status,
        payment_status,
        vnpay_transaction_no,
        vnpay_response_code,
        total_amount,
        created_at,
        updated_at
      FROM orders 
      WHERE id = ?
    `;

    db.query(sql, [orderId], (err, results) => {
      if (err) {
        console.error('Error checking payment status:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi kiểm tra trạng thái thanh toán'
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy đơn hàng'
        });
      }

      const order = results[0];
      res.json({
        success: true,
        data: {
          orderId: order.id,
          status: order.status,
          paymentStatus: order.payment_status,
          transactionNo: order.vnpay_transaction_no,
          responseCode: order.vnpay_response_code,
          amount: order.total_amount,
          createdAt: order.created_at,
          updatedAt: order.updated_at
        }
      });
    });

  } catch (error) {
    console.error('Error checking payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi kiểm tra trạng thái thanh toán',
      error: error.message
    });
  }
};

// Tạo đơn hàng và URL thanh toán VNPay
exports.createOrderAndPayment = async (req, res) => {
  try {
    console.log('=== CREATE ORDER AND PAYMENT ===');
    console.log('Request body:', req.body);

    const {
      user_id,
      items,
      total_amount,
      shipping_address,
      payment_method,
      recipient_name,
      recipient_phone
    } = req.body;

    // Validation
    if (!user_id || !items || !total_amount || !shipping_address) {
      console.log('Validation failed:', { user_id, items: !!items, total_amount, shipping_address: !!shipping_address });
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    console.log('Validation passed, creating order...');

    // Tạo đơn hàng trong database
    const createOrderSql = `
      INSERT INTO orders (
        user_id, 
        total_amount, 
        status, 
        payment_method, 
        payment_status,
        shipping_address,
        recipient_name,
        recipient_phone,
        created_at
      ) VALUES (?, ?, 'pending', ?, 'pending', ?, ?, ?, NOW())
    `;

    db.query(createOrderSql, [
      user_id, 
      total_amount, 
      payment_method,
      shipping_address,
      recipient_name,
      recipient_phone
    ], (err, orderResult) => {
      if (err) {
        console.error('Error creating order:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi tạo đơn hàng'
        });
      }

      const orderId = orderResult.insertId;

      // Thêm order items
      const orderItemsSql = `
        INSERT INTO order_items (order_id, product_id, quantity, price) 
        VALUES ?
      `;

      const orderItemsData = items.map(item => {
        console.log('Processing item:', item);
        return [
          orderId,
          item.product_id || item.id, // Fallback to item.id if product_id is not available
          item.quantity,
          item.price
        ];
      });

      console.log('Order items data:', orderItemsData);

      db.query(orderItemsSql, [orderItemsData], async (err) => {
        if (err) {
          console.error('Error creating order items:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi tạo chi tiết đơn hàng'
          });
        }

        // Nếu thanh toán VNPay, tạo URL thanh toán
        if (payment_method === 'VNPay') {
          const ipAddr = vnPayService.getClientIpAddress(req);
          const orderDescription = `Thanh toan don hang ${orderId}`;

          const paymentUrl = vnPayService.createPaymentUrl({
            orderId: orderId,
            amount: total_amount,
            orderDescription: orderDescription,
            orderType: 'other'
          }, ipAddr);

          res.json({
            success: true,
            message: 'Tạo đơn hàng và URL thanh toán thành công',
            orderId: orderId,
            paymentUrl: paymentUrl,
            paymentMethod: 'VNPay'
          });
        } else {
          // COD hoặc phương thức khác - gửi email xác nhận đơn hàng
          try {
            await sendPaymentSuccessEmailForOrder(orderId);
          } catch (emailError) {
            console.error('Error sending order confirmation email:', emailError);
            // Không làm gián đoạn flow chính nếu gửi email lỗi
          }

          res.json({
            success: true,
            message: 'Tạo đơn hàng thành công',
            orderId: orderId,
            paymentMethod: payment_method
          });
        }
      });
    });

  } catch (error) {
    console.error('Error creating order and payment:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi tạo đơn hàng và thanh toán',
      error: error.message
    });
  }
};

/**
 * Helper function: Gửi email thông báo thanh toán thành công
 * @param {number} orderId - ID của đơn hàng
 */
const sendPaymentSuccessEmailForOrder = async (orderId) => {
  return new Promise((resolve, reject) => {
    // Lấy thông tin đơn hàng, user và order items
    const orderDetailsSql = `
      SELECT
        o.*,
        u.name as user_name,
        u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `;

    db.query(orderDetailsSql, [orderId], (err, orderResults) => {
      if (err) {
        console.error('Error fetching order details:', err);
        return reject(err);
      }

      if (orderResults.length === 0) {
        return reject(new Error('Order not found'));
      }

      const order = orderResults[0];
      const user = {
        name: order.user_name,
        email: order.user_email
      };

      // Lấy danh sách sản phẩm trong đơn hàng
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
          console.error('Error fetching order items:', itemsErr);
          return reject(itemsErr);
        }

        const orderItems = itemsResults;

        // Gửi email
        try {
          const emailResult = await sendPaymentSuccessEmail({
            order,
            user,
            orderItems
          });

          if (emailResult.success) {
            console.log(`✅ Payment success email sent to ${user.email} for order #${orderId}`);
            resolve(emailResult);
          } else {
            console.error(`❌ Failed to send email to ${user.email}:`, emailResult.error);
            reject(new Error(emailResult.error));
          }
        } catch (emailError) {
          console.error('Error in sendPaymentSuccessEmail:', emailError);
          reject(emailError);
        }
      });
    });
  });
};
