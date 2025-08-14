// controllers/category.controller.js
const db = require('../config/db');

exports.getCategories = (req, res) => {
  const sql = 'SELECT id, name FROM categories';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi truy vấn danh mục.', error: err });
    }
    res.status(200).json(results);
  });
};