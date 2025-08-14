const db = require('../config/db');

// Thêm đánh giá sản phẩm (chỉ khi đã mua)
exports.createReview = (req, res) => {
  const { user_id, product_id, rating, comment } = req.body;

  if (!user_id || !product_id || !rating) {
    return res.status(400).json({ message: 'Thiếu thông tin cần thiết.' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating phải từ 1 đến 5.' });
  }

  // Kiểm tra người dùng đã mua sản phẩm chưa
  const checkSql = `
    SELECT oi.id FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'delivered'
  `;

  db.query(checkSql, [user_id, product_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi kiểm tra đơn hàng.', error: err });

    if (result.length === 0) {
      return res.status(403).json({ message: 'Bạn chỉ có thể đánh giá sản phẩm đã mua.' });
    }

    // Tiếp tục thêm đánh giá
    const insertSql = `
      INSERT INTO reviews (user_id, product_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `;

    db.query(insertSql, [user_id, product_id, rating, comment], (err, result) => {
      if (err) return res.status(500).json({ message: 'Lỗi khi thêm đánh giá.', error: err });

      res.status(201).json({ message: 'Đánh giá sản phẩm thành công!' });
    });
  });
};

// Lấy danh sách đánh giá theo sản phẩm
exports.getReviewsByProduct = (req, res) => {
  const productId = req.params.product_id;

  const sql = `
    SELECT r.*, u.name AS user_name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
  `;

  db.query(sql, [productId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi lấy đánh giá.', error: err });

    res.status(200).json({ reviews: results });
  });
};
