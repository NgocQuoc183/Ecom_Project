

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

// Load biến môi trường từ .env
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (avatars)
app.use('/uploads', express.static('uploads'));

// Import middleware và routes
const authMiddleware = require('./middleware/authMiddleware'); // Import middleware auth
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const userRoutes = require('./routes/user.routes');
const adminProductRoutes = require('./routes/admin/product.admin.routes');
const adminCategoryRoutes = require('./routes/admin/category.admin.routes');
const adminOrderRoutes = require('./routes/admin/order.admin.routes');
const adminUserRoutes = require('./routes/admin/user.admin.routes');
const reviewRoutes = require('./routes/review.routes');
const addressRoutes = require('./routes/address.routes');
const paymentRoutes = require('./routes/payment.routes');

// Sử dụng routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Áp dụng middleware auth cho /api/orders và /api/user
app.use('/api/orders', authMiddleware, orderRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/categories', adminCategoryRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/address', addressRoutes);
app.use('/api/payment', paymentRoutes);

// Route kiểm tra server
app.get('/', (req, res) => {
  res.send('API đang chạy...');
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy ở cổng ${PORT}`);
});