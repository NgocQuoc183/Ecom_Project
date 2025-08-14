const db = require('../../config/db');

// Lấy tất cả người dùng
exports.getAllUsers = (req, res) => {
  const sql = `
    SELECT
      id,
      name,
      email,
      phone,
      role,
      is_active,
      avatar_url,
      created_at,
      updated_at
    FROM users
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi lấy danh sách người dùng.', error: err });

    res.status(200).json({ users: results });
  });
};

// Lấy thông tin chi tiết người dùng
exports.getUserById = (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT
      id,
      name,
      email,
      phone,
      role,
      is_active,
      avatar_url,
      created_at,
      updated_at
    FROM users
    WHERE id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi lấy thông tin người dùng.', error: err });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    res.status(200).json({ user: results[0] });
  });
};

// Cập nhật thông tin người dùng
exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const { name, email, phone, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Tên và email không được để trống.' });
  }

  const sql = `
    UPDATE users
    SET name = ?, email = ?, phone = ?, role = ?, updated_at = NOW()
    WHERE id = ?
  `;

  db.query(sql, [name, email, phone, role, userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi cập nhật người dùng.', error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    res.status(200).json({ message: 'Cập nhật người dùng thành công.' });
  });
};

// Xóa người dùng
exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  // Kiểm tra xem người dùng có đơn hàng không
  const checkOrdersSql = 'SELECT COUNT(*) as order_count FROM orders WHERE user_id = ?';
  
  db.query(checkOrdersSql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi kiểm tra đơn hàng.', error: err });

    const orderCount = results[0].order_count;
    
    if (orderCount > 0) {
      return res.status(400).json({ 
        message: `Không thể xóa người dùng này vì có ${orderCount} đơn hàng liên quan.` 
      });
    }

    // Xóa người dùng nếu không có đơn hàng
    const deleteSql = 'DELETE FROM users WHERE id = ?';
    
    db.query(deleteSql, [userId], (err, result) => {
      if (err) return res.status(500).json({ message: 'Lỗi xóa người dùng.', error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
      }

      res.status(200).json({ message: 'Xóa người dùng thành công.' });
    });
  });
};

// Thay đổi trạng thái người dùng (active/inactive)
exports.toggleUserStatus = (req, res) => {
  const userId = req.params.id;
  const { status } = req.body;

  const isActive = status === 'active' ? 1 : 0;
  const sql = 'UPDATE users SET is_active = ?, updated_at = NOW() WHERE id = ?';

  db.query(sql, [isActive, userId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi cập nhật trạng thái.', error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    res.status(200).json({ message: 'Cập nhật trạng thái thành công.' });
  });
};

// Thống kê người dùng
exports.getUserStats = (req, res) => {
  const queries = [
    'SELECT COUNT(*) as total_users FROM users',
    'SELECT COUNT(*) as admin_users FROM users WHERE role = "admin"',
    'SELECT COUNT(*) as customer_users FROM users WHERE role = "user"',
    'SELECT COUNT(*) as active_users FROM users WHERE is_active = 1',
    `SELECT 
      DATE_FORMAT(created_at, '%Y-%m') as month,
      COUNT(*) as new_users
     FROM users 
     WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
     GROUP BY DATE_FORMAT(created_at, '%Y-%m')
     ORDER BY month`
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
      totalUsers: results[0][0].total_users || 0,
      adminUsers: results[1][0].admin_users || 0,
      customerUsers: results[2][0].customer_users || 0,
      activeUsers: results[3][0].active_users || 0,
      monthlyNewUsers: results[4] || []
    };
    res.status(200).json(stats);
  })
  .catch(err => {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ message: 'Lỗi lấy thống kê người dùng.', error: err });
  });
};
