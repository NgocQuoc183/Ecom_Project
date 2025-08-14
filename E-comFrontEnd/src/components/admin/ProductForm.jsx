// // src/components/admin/ProductForm.jsx
// import React, { useState, useEffect } from 'react';
// import { createProduct, updateProduct } from '../../api/adminApi';

// const ProductForm = ({ product, categories, onClose }) => {
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [price, setPrice] = useState(0);
//   const [image, setImage] = useState('');
//   const [stock, setStock] = useState(0);
//   const [categoryId, setCategoryId] = useState('');

//   useEffect(() => {
//     if (product) {
//       setName(product.name);
//       setDescription(product.description || '');
//       setPrice(product.price);
//       setImage(product.image || '');
//       setStock(product.stock || 0);
//       setCategoryId(product.category_id || '');
//     }
//   }, [product]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = { name, description, price, image, stock, category_id: categoryId };
//     try {
//       if (product) {
//         await updateProduct(product.id, data);
//       } else {
//         await createProduct(data);
//       }
//       onClose();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h3 className="text-lg font-bold mb-4">{product ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm'}</h3>
//       <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên" className="border p-2 w-full mb-2" required />
//       <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả" className="border p-2 w-full mb-2" />
//       <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Giá" className="border p-2 w-full mb-2" required />
//       <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="URL hình ảnh" className="border p-2 w-full mb-2" />
//       <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Tồn kho" className="border p-2 w-full mb-2" />
//       <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="border p-2 w-full mb-4">
//         <option value="">Chọn danh mục</option>
//         {categories.map((cat) => (
//           <option key={cat.id} value={cat.id}>{cat.name}</option>
//         ))}
//       </select>
//       <div className="flex justify-end">
//         <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 mr-2">Hủy</button>
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2">Lưu</button>
//       </div>
//     </form>
//   );
// };

// export default ProductForm;
// src/components/admin/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../../api/adminApi';

const ProductForm = ({ product, categories, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [stock, setStock] = useState(0);
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || '');
      setPrice(product.price);
      setImage(product.image || '');
      setStock(product.stock || 0);
      setCategoryId(product.category_id || '');
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, description, price, image, stock, category_id: categoryId };
    try {
      if (product) {
        await updateProduct(product.id, data);
      } else {
        await createProduct(data);
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold mb-6 text-gray-800">{product ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm'}</h3>
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Tên" 
        className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" 
        required 
      />
      <textarea 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="Mô tả" 
        className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 h-24" 
      />
      <input 
        type="number" 
        value={price} 
        onChange={(e) => setPrice(e.target.value)} 
        placeholder="Giá" 
        className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" 
        required 
      />
      <input 
        type="text" 
        value={image} 
        onChange={(e) => setImage(e.target.value)} 
        placeholder="URL hình ảnh" 
        className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" 
      />
      <input 
        type="number" 
        value={stock} 
        onChange={(e) => setStock(e.target.value)} 
        placeholder="Tồn kho" 
        className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" 
      />
      <select 
        value={categoryId} 
        onChange={(e) => setCategoryId(e.target.value)} 
        className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
      >
        <option value="">Chọn danh mục</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <div className="flex justify-end space-x-4 mt-6">
        <button 
          type="button" 
          onClick={onClose} 
          className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition duration-200"
        >
          Hủy
        </button>
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Lưu
        </button>
      </div>
    </form>
  );
};

export default ProductForm;