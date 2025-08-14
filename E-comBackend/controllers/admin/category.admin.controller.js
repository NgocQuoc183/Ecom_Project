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