const db = require('../../config/db');

// Tạo sản phẩm
exports.createProduct = (req, res) => {
  const { name, description, price, image, stock, category_id } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: 'Tên và giá là bắt buộc.' });
  }

  const sql = `
    INSERT INTO products (name, description, price, image, stock, category_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, description, price, image, stock, category_id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi thêm sản phẩm.', error: err });

    res.status(201).json({ message: 'Tạo sản phẩm thành công!', product_id: result.insertId });
  });
};

// Lấy danh sách sản phẩm
exports.getAllProducts = (req, res) => {
  const sql = `
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm.', error: err });

    res.status(200).json({ products: results });
  });
};

// Cập nhật sản phẩm
exports.updateProduct = (req, res) => {
  const productId = req.params.id;
  const { name, description, price, image, stock, category_id } = req.body;

  const sql = `
    UPDATE products SET
      name = ?, description = ?, price = ?, image = ?, stock = ?, category_id = ?
    WHERE id = ?
  `;

  db.query(sql, [name, description, price, image, stock, category_id, productId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi cập nhật.', error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
    }

    res.status(200).json({ message: 'Cập nhật sản phẩm thành công.' });
  });
};

// Xoá sản phẩm
exports.deleteProduct = (req, res) => {
  const productId = req.params.id;

  db.query('DELETE FROM products WHERE id = ?', [productId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi khi xoá.', error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
    }

    res.status(200).json({ message: 'Xoá sản phẩm thành công.' });
  });
};
