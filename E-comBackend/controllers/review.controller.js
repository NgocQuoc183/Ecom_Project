const db = require('../config/db');

// Thêm đánh giá sản phẩm (chỉ khi đã mua)
exports.createReview = (req, res) => {
  const { user_id, product_id, rating, comment } = req.body;

  if (!user_id || !product_id || !rating) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu thông tin cần thiết.'
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating phải từ 1 đến 5.'
    });
  }

  // Kiểm tra người dùng đã mua sản phẩm chưa
  const checkPurchaseSql = `
    SELECT oi.id FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ? AND oi.product_id = ? AND o.status IN ('confirmed', 'shipped', 'delivered')
  `;

  db.query(checkPurchaseSql, [user_id, product_id], (err, purchaseResult) => {
    if (err) {
      console.error('Error checking purchase:', err);
      return res.status(500).json({
        success: false,
        message: 'Lỗi kiểm tra đơn hàng.',
        error: err
      });
    }

    if (purchaseResult.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Bạn chỉ có thể đánh giá sản phẩm đã mua.'
      });
    }

    // Kiểm tra user đã đánh giá sản phẩm này chưa
    const checkExistingSql = `
      SELECT id FROM reviews
      WHERE user_id = ? AND product_id = ?
    `;

    db.query(checkExistingSql, [user_id, product_id], (err, existingResult) => {
      if (err) {
        console.error('Error checking existing review:', err);
        return res.status(500).json({
          success: false,
          message: 'Lỗi kiểm tra đánh giá hiện có.',
          error: err
        });
      }

      if (existingResult.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Bạn đã đánh giá sản phẩm này rồi.'
        });
      }

      // Thêm đánh giá mới
      const insertSql = `
        INSERT INTO reviews (user_id, product_id, rating, comment)
        VALUES (?, ?, ?, ?)
      `;

      db.query(insertSql, [user_id, product_id, rating, comment], (err, result) => {
        if (err) {
          console.error('Error adding review:', err);
          return res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm đánh giá.',
            error: err
          });
        }

        res.status(201).json({
          success: true,
          message: 'Đánh giá sản phẩm thành công!',
          data: {
            id: result.insertId,
            user_id,
            product_id,
            rating,
            comment
          }
        });
      });
    });
  });
};

// Lấy danh sách đánh giá theo sản phẩm với phân trang
exports.getReviewsByProduct = (req, res) => {
  const productId = req.params.product_id;
  const { page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * limit;

  const sql = `
    SELECT
      r.id,
      r.rating,
      r.comment,
      r.created_at,
      u.name AS user_name,
      u.avatar_url
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
    LIMIT ? OFFSET ?
  `;

  db.query(sql, [productId, parseInt(limit), offset], (err, results) => {
    if (err) {
      console.error('Error getting reviews:', err);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy đánh giá.',
        error: err
      });
    }

    // Lấy tổng số đánh giá
    const countSql = 'SELECT COUNT(*) as total FROM reviews WHERE product_id = ?';
    db.query(countSql, [productId], (countErr, countResults) => {
      if (countErr) {
        console.error('Error counting reviews:', countErr);
        return res.status(500).json({
          success: false,
          message: 'Lỗi khi đếm số đánh giá'
        });
      }

      const total = countResults[0].total;
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: results,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      });
    });
  });
};

// Lấy thống kê đánh giá của sản phẩm
exports.getReviewStats = (req, res) => {
  const productId = req.params.product_id;

  const sql = `
    SELECT
      COUNT(*) as total_reviews,
      AVG(rating) as average_rating,
      SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
      SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
      SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
      SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
      SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
    FROM reviews
    WHERE product_id = ?
  `;

  db.query(sql, [productId], (err, results) => {
    if (err) {
      console.error('Error getting review stats:', err);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thống kê đánh giá'
      });
    }

    const stats = results[0];

    res.json({
      success: true,
      data: {
        totalReviews: stats.total_reviews,
        averageRating: parseFloat(stats.average_rating || 0).toFixed(1),
        ratingDistribution: {
          5: stats.five_star,
          4: stats.four_star,
          3: stats.three_star,
          2: stats.two_star,
          1: stats.one_star
        }
      }
    });
  });
};
