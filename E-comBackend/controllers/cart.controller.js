const db = require('../config/db');

// POST /api/cart
exports.addToCart = (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({ message: 'Thiếu user_id, product_id hoặc quantity.' });
  }

  // Kiểm tra sản phẩm có tồn tại không
  db.query('SELECT * FROM products WHERE id = ?', [product_id], (err, productResults) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn sản phẩm.', error: err });

    if (productResults.length === 0) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại.' });
    }

    // Kiểm tra sản phẩm đã có trong giỏ chưa
    db.query(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [user_id, product_id],
      (err, cartResults) => {
        if (err) return res.status(500).json({ message: 'Lỗi truy vấn giỏ hàng.', error: err });

        if (cartResults.length > 0) {
          // Nếu đã có → cập nhật số lượng
          const newQuantity = cartResults[0].quantity + quantity;

          db.query(
            'UPDATE cart SET quantity = ? WHERE id = ?',
            [newQuantity, cartResults[0].id],
            (err) => {
              if (err) return res.status(500).json({ message: 'Lỗi cập nhật giỏ hàng.', error: err });

              return res.status(200).json({ message: 'Cập nhật số lượng trong giỏ hàng thành công.' });
            }
          );
        } else {
          // Nếu chưa có → thêm mới
          db.query(
            'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
            [user_id, product_id, quantity],
            (err, result) => {
              if (err) return res.status(500).json({ message: 'Lỗi thêm vào giỏ hàng.', error: err });

              res.status(201).json({ message: 'Thêm sản phẩm vào giỏ hàng thành công!' });
            }
          );
        }
      }
    );
  });
};

// Lấy giỏ hàng của người dùng 
exports.getCartByUser = (req, res) => {
  const user_id = req.query.user_id;

  if (!user_id) {
    return res.status(400).json({ message: 'Thiếu user_id.' });
  }

  const sql = `
    SELECT 
      c.id AS cart_id,
      c.quantity,
      p.id AS product_id,
      p.name AS product_name,
      p.price,
      p.image,
      (p.price * c.quantity) AS total_price
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn giỏ hàng.', error: err });

    res.status(200).json({
      user_id,
      total_items: results.length,
      cart: results
    });
  });
};

exports.updateCartItem = (req, res) => {
  const cartId = req.params.id;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'Số lượng phải lớn hơn 0.' });
  }

  const sql = 'UPDATE cart SET quantity = ? WHERE id = ?';

  db.query(sql, [quantity, cartId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi khi cập nhật giỏ hàng.', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy mục giỏ hàng.' });
    }

    res.status(200).json({ message: 'Cập nhật số lượng thành công.' });
  });
};
// Xoá sản phẩm khỏi giỏ hàng
exports.deleteCartItem = (req, res) => {
  const cartId = req.params.id;

  const sql = 'DELETE FROM cart WHERE id = ?';

  db.query(sql, [cartId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi khi xoá khỏi giỏ hàng.', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy mục giỏ hàng.' });
    }

    res.status(200).json({ message: 'Xoá sản phẩm khỏi giỏ hàng thành công.' });
  });
};
