const db = require('../../config/db');

// Lấy tất cả đơn hàng
exports.getAllOrders = (req, res) => {
  const sql = `
    SELECT o.*, u.name AS user_name, u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn đơn hàng.', error: err });

    res.status(200).json({ orders: results });
  });
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  const allowedStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ.' });
  }

  const sql = `UPDATE orders SET status = ? WHERE id = ?`;

  db.query(sql, [status, orderId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi cập nhật trạng thái.', error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
    }

    res.status(200).json({ message: 'Cập nhật trạng thái thành công.' });
  });
};

// Lấy chi tiết đơn hàng 
exports.getOrderDetails = (req, res) => {
  const orderId = req.params.id;

  // 1. Lấy thông tin đơn hàng + người mua
  const orderSql = `
    SELECT o.*, u.name AS user_name, u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.id = ?
  `;

  db.query(orderSql, [orderId], (err, orderResult) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn đơn hàng.', error: err });

    if (orderResult.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
    }

    const orderInfo = orderResult[0];

    // 2. Lấy thông tin các sản phẩm trong đơn hàng
    const itemsSql = `
      SELECT oi.*, p.name AS product_name, p.image
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;

    db.query(itemsSql, [orderId], (err, itemsResult) => {
      if (err) return res.status(500).json({ message: 'Lỗi truy vấn sản phẩm trong đơn.', error: err });

      res.status(200).json({
        order: orderInfo,
        items: itemsResult
      });
    });
  });
};
