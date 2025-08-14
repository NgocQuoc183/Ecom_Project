const db = require('../config/db');

// Lấy tất cả sản phẩm có phân trang, tìm kiếm, lọc theo danh mục
exports.getAllProducts = (req, res) => {
  let { page, limit, category, keyword, sort } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const offset = (page - 1) * limit;

  // Điều kiện WHERE chung
  let whereClause = `WHERE 1 = 1`;
  if (category) {
    whereClause += ` AND p.category_id = ${db.escape(category)}`;
  }
  if (keyword) {
    whereClause += ` AND p.name LIKE ${db.escape('%' + keyword + '%')}`;
  }

  // Query lấy tổng số sản phẩm
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM products p
    ${whereClause}
  `;

  // Query lấy danh sách sản phẩm có phân trang
  let dataQuery = `
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ${whereClause}
  `;

  // Sắp xếp
  if (sort === 'price_asc') {
    dataQuery += ` ORDER BY p.price ASC `;
  } else if (sort === 'price_desc') {
    dataQuery += ` ORDER BY p.price DESC `;
  } else {
    dataQuery += ` ORDER BY p.id DESC `;
  }

  // Giới hạn phân trang
  dataQuery += ` LIMIT ${limit} OFFSET ${offset}`;

  // Thực thi 2 truy vấn
  db.query(countQuery, (errCount, countResult) => {
    if (errCount) {
      return res.status(500).json({
        message: 'Lỗi truy vấn tổng số sản phẩm.',
        error: errCount
      });
    }

    const total = countResult[0].total;

    db.query(dataQuery, (errData, dataResults) => {
      if (errData) {
        return res.status(500).json({
          message: 'Lỗi truy vấn danh sách sản phẩm.',
          error: errData
        });
      }

      return res.status(200).json({
        page,
        limit,
        total,
        data: dataResults
      });
    });
  });
};


// Lấy sản phẩm mới nhất (mặc định 8 sp, dùng cho trang chủ)
exports.getNewestProducts = (req, res) => {
  const limit = parseInt(req.query.limit) || 8;

  const sql = `
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.id DESC
    LIMIT ${db.escape(limit)}
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Lỗi truy vấn sản phẩm mới nhất.',
        error: err
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
    }

    res.status(200).json(results);
  });
};

// Lấy chi tiết 1 sản phẩm theo ID
exports.getProductById = (req, res) => {
  const productId = req.params.id;

  const sql = `
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `;

  db.query(sql, [productId], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Lỗi truy vấn sản phẩm theo ID.',
        error: err
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm.' });
    }

    res.status(200).json(results[0]);
  });
};
