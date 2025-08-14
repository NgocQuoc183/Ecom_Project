// // src/components/admin/ProductList.jsx
// import React, { useState, useEffect } from 'react';
// import { getAllProducts, deleteProduct, getAllCategories } from '../../api/adminApi';
// import ProductForm from './ProductForm';

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editProduct, setEditProduct] = useState(null);

//   useEffect(() => {
//     fetchProducts();
//     fetchCategories();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const res = await getAllProducts();
//       setProducts(res.data.products);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await getAllCategories();
//       setCategories(res.data.categories);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Xác nhận xóa?')) {
//       try {
//         await deleteProduct(id);
//         fetchProducts();
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   };

//   const handleEdit = (product) => {
//     setEditProduct(product);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditProduct(null);
//     fetchProducts();
//   };

//   return (
//     <div>
//       <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 mb-4">Thêm mới</button>
//       <table className="w-full border-collapse border border-gray-300">
//         <thead>
//           <tr>
//             <th className="border p-2">ID</th>
//             <th className="border p-2">Tên</th>
//             <th className="border p-2">Giá</th>
//             <th className="border p-2">Danh mục</th>
//             <th className="border p-2">Hành động</th>
//           </tr>
//         </thead>
//         <tbody>
//           {products.map((prod) => (
//             <tr key={prod.id}>
//               <td className="border p-2">{prod.id}</td>
//               <td className="border p-2">{prod.name}</td>
//               <td className="border p-2">{prod.price}</td>
//               <td className="border p-2">{prod.category_name}</td>
//               <td className="border p-2">
//                 <button onClick={() => handleEdit(prod)} className="bg-yellow-500 text-white px-2 py-1 mr-2">Sửa</button>
//                 <button onClick={() => handleDelete(prod.id)} className="bg-red-500 text-white px-2 py-1">Xóa</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow-lg w-1/2">
//             <ProductForm product={editProduct} categories={categories} onClose={handleCloseModal} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductList;
// src/components/admin/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { getAllProducts, deleteProduct, getAllCategories } from '../../api/adminApi';
import ProductForm from './ProductForm';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res.data.products);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xác nhận xóa?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditProduct(null);
    fetchProducts();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <button 
        onClick={() => setShowModal(true)} 
        className="bg-blue-600 text-white px-6 py-3 rounded-lg mb-6 hover:bg-blue-700 transition duration-200 shadow-sm"
      >
        Thêm mới
      </button>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 p-4 text-left">ID</th>
              <th className="border border-gray-300 p-4 text-left">Tên</th>
              <th className="border border-gray-300 p-4 text-left">Giá</th>
              <th className="border border-gray-300 p-4 text-left">Danh mục</th>
              <th className="border border-gray-300 p-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id} className="hover:bg-gray-50 transition duration-150">
                <td className="border border-gray-300 p-4">{prod.id}</td>
                <td className="border border-gray-300 p-4">{prod.name}</td>
                <td className="border border-gray-300 p-4">{prod.price}</td>
                <td className="border border-gray-300 p-4">{prod.category_name}</td>
                <td className="border border-gray-300 p-4">
                  <button 
                    onClick={() => handleEdit(prod)} 
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-yellow-600 transition duration-200"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(prod.id)} 
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-1/2 transform transition-all duration-300 scale-100">
            <ProductForm product={editProduct} categories={categories} onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;