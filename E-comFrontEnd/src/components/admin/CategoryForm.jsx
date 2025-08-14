// // src/components/admin/CategoryForm.jsx
// import React, { useState, useEffect } from 'react';
// import { createCategory, updateCategory } from '../../api/adminApi';

// const CategoryForm = ({ category, onClose }) => {
//   const [name, setName] = useState('');

//   useEffect(() => {
//     if (category) setName(category.name);
//   }, [category]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (category) {
//         await updateCategory(category.id, { name });
//       } else {
//         await createCategory({ name });
//       }
//       onClose();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h3 className="text-lg font-bold mb-4">{category ? 'Sửa Danh mục' : 'Thêm Danh mục'}</h3>
//       <input
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         placeholder="Tên danh mục"
//         className="border p-2 w-full mb-4"
//         required
//       />
//       <div className="flex justify-end">
//         <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 mr-2">Hủy</button>
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2">Lưu</button>
//       </div>
//     </form>
//   );
// };

// export default CategoryForm;
// src/components/admin/CategoryForm.jsx
import React, { useState, useEffect } from 'react';
import { createCategory, updateCategory } from '../../api/adminApi';

const CategoryForm = ({ category, onClose }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (category) setName(category.name);
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (category) {
        await updateCategory(category.id, { name });
      } else {
        await createCategory({ name });
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold mb-6 text-gray-800">{category ? 'Sửa Danh mục' : 'Thêm Danh mục'}</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên danh mục"
        className="border border-gray-300 p-3 w-full mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        required
      />
      <div className="flex justify-end space-x-4">
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

export default CategoryForm;