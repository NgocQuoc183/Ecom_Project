// const db = require('../config/db');
// const bcrypt = require('bcryptjs');

// // Lấy thông tin hồ sơ người dùng
// exports.getUserProfile = (req, res) => {
//   const userId = req.params.id;
//   const sql = 'SELECT id, name, phone, avatar_url FROM users WHERE id = ?';
//   db.query(sql, [userId], (err, results) => {
//     if (err) {
//       return res.status(500).json({ message: 'Lỗi khi truy vấn.', error: err });
//     }
//     if (results.length === 0) {
//       return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
//     }
//     res.status(200).json(results[0]);
//   });
// };

// // Cập nhật thông tin hồ sơ người dùng
// exports.updateUserProfile = (req, res) => {
//   const userId = req.params.id;
//   const { name, phone, avatar_url } = req.body;

//   // Kiểm tra dữ liệu đầu vào
//   if (!name || name.trim() === '') {
//     return res.status(400).json({ message: 'Tên không được để trống.' });
//   }

//   const sql = `
//     UPDATE users
//     SET name = ?, phone = ?, avatar_url = ?
//     WHERE id = ?
//   `;

//   db.query(sql, [name, phone, avatar_url, userId], (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: 'Lỗi khi cập nhật thông tin.', error: err });
//     }

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
//     }

//     res.status(200).json({ message: 'Cập nhật thông tin thành công.' });
//   });
// };

// // Đổi mật khẩu 

// // Đổi mật khẩu người dùng
// exports.changePassword = (req, res) => {
//   const userId = req.params.id;
//   const { oldPassword, newPassword } = req.body;

//   // Kiểm tra đầu vào
//   if (!oldPassword || !newPassword) {
//     return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mật khẩu cũ và mới.' });
//   }

//   if (newPassword.length < 6) {
//     return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
//   }

//   // Lấy mật khẩu hiện tại của user
//   const sql = 'SELECT password FROM users WHERE id = ?';

//   db.query(sql, [userId], async (err, results) => {
//     if (err) return res.status(500).json({ message: 'Lỗi truy vấn.', error: err });

//     if (results.length === 0) {
//       return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
//     }

//     const currentHashedPassword = results[0].password;
//     const isMatch = await bcrypt.compare(oldPassword, currentHashedPassword);

//     if (!isMatch) {
//       return res.status(401).json({ message: 'Mật khẩu cũ không đúng.' });
//     }

//     // Băm và cập nhật mật khẩu mới
//     const hashedNewPassword = await bcrypt.hash(newPassword, 10);

//     db.query(
//       'UPDATE users SET password = ? WHERE id = ?',
//       [hashedNewPassword, userId],
//       (err) => {
//         if (err) return res.status(500).json({ message: 'Lỗi khi cập nhật mật khẩu.', error: err });

//         res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
//       }
//     );
//   });
// };
// controllers/user.controller.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Lấy thông tin hồ sơ người dùng
exports.getUserProfile = (req, res) => {
  const userId = req.params.id;
  if (userId !== req.user.id) {
    return res.status(403).json({ message: 'Không có quyền truy cập hồ sơ này.' });
  }

  const sql = 'SELECT id, name, email, role, avatar_url, phone FROM users WHERE id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi server khi truy vấn database.', error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    res.status(200).json(results[0]);
  });
};

// Cập nhật thông tin hồ sơ người dùng
exports.updateUserProfile = (req, res) => {
  const userId = req.params.id;
  if (userId !== req.user.id) {
    return res.status(403).json({ message: 'Không có quyền cập nhật hồ sơ này.' });
  }

  const { name, email, role, avatar_url, phone } = req.body;
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Tên không được để trống.' });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Email không hợp lệ.' });
  }
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Vai trò không hợp lệ.' });
  }

  const sql = `
    UPDATE users
    SET name = ?, email = ?, role = ?, avatar_url = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  db.query(sql, [name, email, role, avatar_url || null, phone || null, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin.', error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    res.status(200).json({ message: 'Cập nhật thông tin thành công.' });
  });
};

// Đổi mật khẩu người dùng
exports.changePassword = (req, res) => {
  const userId = req.params.id;
  if (userId !== req.user.id) {
    return res.status(403).json({ message: 'Không có quyền đổi mật khẩu.' });
  }

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mật khẩu cũ và mới.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
  }

  const sql = 'SELECT password FROM users WHERE id = ?';
  db.query(sql, [userId], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi server khi truy vấn database.', error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }

    const currentHashedPassword = results[0].password;
    const isMatch = await bcrypt.compare(oldPassword, currentHashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mật khẩu cũ không đúng.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    db.query(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedNewPassword, userId],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Lỗi server khi cập nhật mật khẩu.', error: err.message });
        }
        res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
      }
    );
  });
};