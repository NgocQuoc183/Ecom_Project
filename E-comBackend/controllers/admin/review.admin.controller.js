const db = require('../../config/db');

/**
 * Admin Review Controller - Quản lý đánh giá sản phẩm
 */

// Lấy tất cả đánh giá với phân trang và filter
exports.getAllReviews = (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    product_id, 
    user_id, 
    rating, 
    search,
    sort_by = 'created_at',
    sort_order = 'DESC'
  } = req.query;

  const offset = (page - 1) * limit;
  let whereConditions = [];
  let queryParams = [];

  // Build WHERE conditions
  if (product_id) {
    whereConditions.push('r.product_id = ?');
    queryParams.push(product_id);
  }

  if (user_id) {
    whereConditions.push('r.user_id = ?');
    queryParams.push(user_id);
  }

  if (rating) {
    whereConditions.push('r.rating = ?');
    queryParams.push(rating);
  }

  if (search) {
    whereConditions.push('(r.comment LIKE ? OR u.name LIKE ? OR p.name LIKE ?)');
    const searchTerm = `%${search}%`;
    queryParams.push(searchTerm, searchTerm, searchTerm);
  }

  const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

  // Validate sort_by to prevent SQL injection
  const allowedSortFields = ['created_at', 'rating', 'user_name', 'product_name'];
  const validSortBy = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
  const validSortOrder = ['ASC', 'DESC'].includes(sort_order.toUpperCase()) ? sort_order.toUpperCase() : 'DESC';

  const sql = `
    SELECT
      r.id,
      r.rating,
      r.comment,
      r.created_at,
      u.id as user_id,
      u.name as user_name,
      u.email as user_email,
      p.id as product_id,
      p.name as product_name,
      p.image as product_image
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    JOIN products p ON r.product_id = p.id
    ${whereClause}
    ORDER BY ${validSortBy === 'user_name' ? 'u.name' : validSortBy === 'product_name' ? 'p.name' : 'r.' + validSortBy} ${validSortOrder}
    LIMIT ? OFFSET ?
  `;

  queryParams.push(parseInt(limit), offset);

  db.query(sql, queryParams, (err, results) => {
    if (err) {
      console.error('Error getting all reviews:', err);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách đánh giá'
      });
    }

    // Lấy tổng số đánh giá
    const countSql = `
      SELECT COUNT(*) as total 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN products p ON r.product_id = p.id
      ${whereClause}
    `;

    const countParams = queryParams.slice(0, -2); // Remove limit and offset

    db.query(countSql, countParams, (countErr, countResults) => {
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

// Lấy chi tiết một đánh giá
exports.getReviewById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      r.id,
      r.rating,
      r.comment,
      r.created_at,
      u.id as user_id,
      u.name as user_name,
      u.email as user_email,
      u.avatar_url as user_avatar,
      p.id as product_id,
      p.name as product_name,
      p.image as product_image,
      p.price as product_price
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    JOIN products p ON r.product_id = p.id
    WHERE r.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error getting review by id:', err);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy chi tiết đánh giá'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá'
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
};

// Xóa đánh giá
exports.deleteReview = (req, res) => {
  const { id } = req.params;

  // Kiểm tra đánh giá có tồn tại không
  const checkSql = 'SELECT id FROM reviews WHERE id = ?';
  db.query(checkSql, [id], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Error checking review:', checkErr);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi kiểm tra đánh giá'
      });
    }

    if (checkResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đánh giá'
      });
    }

    // Xóa đánh giá
    const deleteSql = 'DELETE FROM reviews WHERE id = ?';
    db.query(deleteSql, [id], (deleteErr) => {
      if (deleteErr) {
        console.error('Error deleting review:', deleteErr);
        return res.status(500).json({
          success: false,
          message: 'Lỗi khi xóa đánh giá'
        });
      }

      res.json({
        success: true,
        message: 'Đánh giá đã được xóa thành công'
      });
    });
  });
};

// Lấy thống kê đánh giá tổng quan
exports.getReviewStats = (req, res) => {
  const statsSql = `
    SELECT 
      COUNT(*) as total_reviews,
      AVG(rating) as average_rating,
      SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
      SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
      SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
      SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
      SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star,
      COUNT(DISTINCT user_id) as unique_reviewers,
      COUNT(DISTINCT product_id) as reviewed_products
    FROM reviews
  `;

  db.query(statsSql, (err, results) => {
    if (err) {
      console.error('Error getting review stats:', err);
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thống kê đánh giá'
      });
    }

    const stats = results[0];

    // Lấy top sản phẩm được đánh giá nhiều nhất
    const topProductsSql = `
      SELECT 
        p.id,
        p.name,
        p.image,
        COUNT(r.id) as review_count,
        AVG(r.rating) as avg_rating
      FROM products p
      JOIN reviews r ON p.id = r.product_id
      GROUP BY p.id, p.name, p.image
      ORDER BY review_count DESC, avg_rating DESC
      LIMIT 5
    `;

    db.query(topProductsSql, (topErr, topResults) => {
      if (topErr) {
        console.error('Error getting top products:', topErr);
        return res.status(500).json({
          success: false,
          message: 'Lỗi khi lấy top sản phẩm'
        });
      }

      res.json({
        success: true,
        data: {
          overview: {
            totalReviews: stats.total_reviews,
            averageRating: parseFloat(stats.average_rating || 0).toFixed(1),
            uniqueReviewers: stats.unique_reviewers,
            reviewedProducts: stats.reviewed_products
          },
          ratingDistribution: {
            5: stats.five_star,
            4: stats.four_star,
            3: stats.three_star,
            2: stats.two_star,
            1: stats.one_star
          },
          topProducts: topResults.map(product => ({
            ...product,
            avg_rating: parseFloat(product.avg_rating).toFixed(1)
          }))
        }
      });
    });
  });
};
