const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 10000,
  acquireTimeout: 10000,
});

// Kết nối tới MySQL
connection.connect((err) => {
  if (err) {
    console.error('❌ Kết nối MySQL thất bại: ' + err.message);
    process.exit(1); // Dừng server nếu lỗi
  } else {
    console.log('✅ Kết nối MySQL thành công!');
  }
});

module.exports = connection;