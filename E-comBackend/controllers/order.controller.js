const db = require('../config/db');

exports.createOrder = (req, res) => {
  const user_id = req.user.id;
  const {payment_method, shipping_address } = req.body;

  if (!user_id || !payment_method || !shipping_address) {
    return res.status(400).json({ message: 'Thiếu thông tin cần thiết để đặt hàng.' });
  }

  db.query(
    `SELECT c.product_id, c.quantity, p.price 
     FROM cart c 
     JOIN products p ON c.product_id = p.id 
     WHERE c.user_id = ?`,
    [user_id],
    (err, cartItems) => {
      if (err) return res.status(500).json({ message: 'Lỗi truy vấn giỏ hàng.', error: err });

      if (cartItems.length === 0) {
        return res.status(400).json({ message: 'Giỏ hàng trống.' });
      }

      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      db.query(
        `INSERT INTO orders (user_id, total_amount, payment_method, shipping_address) 
         VALUES (?, ?, ?, ?)`,
        [user_id, total, payment_method, shipping_address],
        (err, orderResult) => {
          if (err) return res.status(500).json({ message: 'Không thể tạo đơn hàng.', error: err });

          const order_id = orderResult.insertId;

          const orderItemsData = cartItems.map((item) => [
            order_id,
            item.product_id,
            item.quantity,
            item.price
          ]);

          db.query(
            `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?`,
            [orderItemsData],
            (err) => {
              if (err) return res.status(500).json({ message: 'Không thể lưu sản phẩm vào đơn.', error: err });

              db.query(`DELETE FROM cart WHERE user_id = ?`, [user_id], (err) => {
                if (err) return res.status(500).json({ message: 'Lỗi khi xoá giỏ hàng.', error: err });

                res.status(201).json({
                  message: 'Đặt hàng thành công.',
                  order_id,
                  total_amount: total
                });
              });
            }
          );
        }
      );
    }
  );
};

// Xem lịch sử đơn hàng
exports.getOrdersByUserId = (req, res) => {
  const userId = req.params.user_id;

  const sql = `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy đơn hàng:', err);
      return res.status(500).json({ message: 'Lỗi server.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Không có đơn hàng nào.' });
    }

    res.status(200).json({ orders: results });
  });
};

// Chi tiết đơn hàng đã đặt 
exports.getOrderDetails = (req, res) => {
  const orderId = req.params.id;

  const orderQuery = `SELECT * FROM orders WHERE id = ?`;
  const itemsQuery = `SELECT oi.*, p.name, p.image FROM order_items oi
                      JOIN products p ON oi.product_id = p.id
                      WHERE oi.order_id = ?`;

  db.query(orderQuery, [orderId], (err, orderResult) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn đơn hàng.' });

    if (orderResult.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
    }

    db.query(itemsQuery, [orderId], (err, itemsResult) => {
      if (err) return res.status(500).json({ message: 'Lỗi truy vấn chi tiết đơn.' });

      res.status(200).json({
        order: orderResult[0],
        items: itemsResult
      });
    });
  });
};
