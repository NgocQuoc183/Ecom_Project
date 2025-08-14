// // src/components/admin/CategoryList.jsx
// import React, { useState, useEffect } from 'react';
// import { getAllCategories, deleteCategory } from '../../api/adminApi';
// import CategoryForm from './CategoryForm';

// const CategoryList = () => {
//   const [categories, setCategories] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editCategory, setEditCategory] = useState(null);

//   useEffect(() => {
//     fetchCategories();
//   }, []);

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
//         await deleteCategory(id);
//         fetchCategories();
//       } catch (err) {
//         console.error(err);
//       }
//     }
//   };

//   const handleEdit = (category) => {
//     setEditCategory(category);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setEditCategory(null);
//     fetchCategories();
//   };

//   return (
//     <div>
//       <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 mb-4">Thêm mới</button>
//       <table className="w-full border-collapse border border-gray-300">
//         <thead>
//           <tr>
//             <th className="border p-2">ID</th>
//             <th className="border p-2">Tên</th>
//             <th className="border p-2">Hành động</th>
//           </tr>
//         </thead>
//         <tbody>
//           {categories.map((cat) => (
//             <tr key={cat.id}>
//               <td className="border p-2">{cat.id}</td>
//               <td className="border p-2">{cat.name}</td>
//               <td className="border p-2">
//                 <button onClick={() => handleEdit(cat)} className="bg-yellow-500 text-white px-2 py-1 mr-2">Sửa</button>
//                 <button onClick={() => handleDelete(cat.id)} className="bg-red-500 text-white px-2 py-1">Xóa</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow-lg">
//             <CategoryForm category={editCategory} onClose={handleCloseModal} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategoryList;
// src/components/admin/CategoryList.jsx
import React, { useState, useEffect } from 'react';
import { getAllCategories, deleteCategory } from '../../api/adminApi';
import CategoryForm from './CategoryForm';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

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
        await deleteCategory(id);
        fetchCategories();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditCategory(null);
    fetchCategories();
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
              <th className="border border-gray-300 p-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition duration-150">
                <td className="border border-gray-300 p-4">{cat.id}</td>
                <td className="border border-gray-300 p-4">{cat.name}</td>
                <td className="border border-gray-300 p-4">
                  <button 
                    onClick={() => handleEdit(cat)} 
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-yellow-600 transition duration-200"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)} 
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
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 transform transition-all duration-300 scale-100">
            <CategoryForm category={editCategory} onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;