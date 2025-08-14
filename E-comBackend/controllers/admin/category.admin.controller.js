const db = require('../../config/db');

// Thêm danh mục
exports.createCategory = (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Tên danh mục không được để trống.' });
  }

  const sql = 'INSERT INTO categories (name) VALUES (?)';
  db.query(sql, [name], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi thêm danh mục.', error: err });

    res.status(201).json({ message: 'Thêm danh mục thành công.', category_id: result.insertId });
  });
};

// Lấy tất cả danh mục
exports.getAllCategories = (req, res) => {
  const sql = 'SELECT * FROM categories ORDER BY created_at DESC';

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi lấy danh mục.', error: err });

    res.status(200).json({ categories: results });
  });
};

// Cập nhật danh mục
exports.updateCategory = (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Tên danh mục không được để trống.' });
  }

  const sql = 'UPDATE categories SET name = ? WHERE id = ?';

  db.query(sql, [name, categoryId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi cập nhật.', error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục.' });
    }

    res.status(200).json({ message: 'Cập nhật danh mục thành công.' });
  });
};

// Xoá danh mục
exports.deleteCategory = (req, res) => {
  const categoryId = req.params.id;

  const sql = 'DELETE FROM categories WHERE id = ?';

  db.query(sql, [categoryId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi xoá danh mục.', error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Danh mục không tồn tại.' });
    }

    res.status(200).json({ message: 'Xoá danh mục thành công.' });
  });
};

// Lấy thống kê dashboard
exports.getDashboardStats = (req, res) => {
  const queries = [
    'SELECT COUNT(*) as total_categories FROM categories',
    'SELECT COUNT(*) as total_products FROM products',
    'SELECT COUNT(*) as total_orders FROM orders',
    'SELECT COUNT(*) as total_users FROM users',
    'SELECT SUM(total_amount) as total_revenue FROM orders WHERE status = "completed"',
    // Thống kê đơn hàng theo tháng (6 tháng gần nhất)
    `SELECT
      DATE_FORMAT(created_at, '%Y-%m') as month,
      COUNT(*) as orders,
      SUM(total_amount) as revenue
     FROM orders
     WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
     GROUP BY DATE_FORMAT(created_at, '%Y-%m')
     ORDER BY month`,
    // Thống kê trạng thái đơn hàng
    `SELECT
      status,
      COUNT(*) as count
     FROM orders
     GROUP BY status`,
    // Thống kê sản phẩm theo danh mục
    `SELECT
      c.name as category,
      COUNT(p.id) as products
     FROM categories c
     LEFT JOIN products p ON c.id = p.category_id
     GROUP BY c.id, c.name`
  ];

  Promise.all(queries.map(query => {
    return new Promise((resolve, reject) => {
      db.query(query, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }))
  .then(results => {
    const stats = {
      totalCategories: results[0][0].total_categories || 0,
      totalProducts: results[1][0].total_products || 0,
      totalOrders: results[2][0].total_orders || 0,
      totalUsers: results[3][0].total_users || 0,
      totalRevenue: results[4][0].total_revenue || 0,
      monthlyOrders: results[5] || [],
      orderStatus: results[6] || [],
      productsByCategory: results[7] || []
    };
    res.status(200).json(stats);
  })
  .catch(err => {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ message: 'Lỗi lấy thống kê dashboard.', error: err });
  });
};