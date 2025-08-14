const jwt = require('jsonwebtoken');

// Middleware để verify JWT token
const authMiddleware = (req, res, next) => {
  // Lấy token từ header Authorization (Bearer <token>)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Không có token hoặc token không hợp lệ.' });
  }

  const token = authHeader.split(' ')[1]; // Lấy phần token sau 'Bearer '

  try {
    // Verify token với secret key (lấy từ .env hoặc hardcode tạm)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key_here'); // Thay 'your_secret_key_here' bằng key thật
    req.user = decoded; // Set req.user = decoded payload (chứa id, userId, v.v.)
    next(); // Tiếp tục đến controller
  } catch (err) {
    return res.status(403).json({ message: 'Token không hợp lệ hoặc hết hạn.' });
  }
};

module.exports = authMiddleware;