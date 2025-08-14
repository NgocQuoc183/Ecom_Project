const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký người dùng mới
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Kiểm tra rỗng
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ họ tên, email và mật khẩu.' });
  }

  // Kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email không hợp lệ.' });
  }

  // Kiểm tra độ dài mật khẩu
  if (password.length < 6) {
    return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
  }

  // Kiểm tra email đã tồn tại chưa
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn.', error: err });

    if (results.length > 0) {
      return res.status(409).json({ message: 'Email đã tồn tại. Vui lòng dùng email khác.' });
    }

    try {
      // Băm mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { name, email, password: hashedPassword };

      db.query('INSERT INTO users SET ?', newUser, (err, result) => {
        if (err) return res.status(500).json({ message: 'Lỗi tạo tài khoản.', error: err });

        res.status(201).json({ message: 'Đăng ký thành công!', userId: result.insertId });
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ.', error: error.message });
    }
  });
};

// Đăng nhập người dùng
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Kiểm tra rỗng
  if (!email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn.', error: err });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.status(200).json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
};
