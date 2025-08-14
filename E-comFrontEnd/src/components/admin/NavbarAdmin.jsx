// import React from 'react';
// import { NavLink } from 'react-router-dom'; // Import NavLink để highlight active link

// const NavbarAdmin = () => {
//   return (
//     <nav className="bg-gray-800 text-white p-4 mb-6">
//       <ul className="flex space-x-6 justify-center">
//         <li>
//           <NavLink
//             to="/dashboard"
//             className={({ isActive }) => 
//               isActive ? 'font-bold underline' : 'hover:underline'
//             }
//           >
//             Dashboard
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/managecategories"
//             className={({ isActive }) => 
//               isActive ? 'font-bold underline' : 'hover:underline'
//             }
//           >
//             Quản lý Danh mục
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/manageproducts"
//             className={({ isActive }) => 
//               isActive ? 'font-bold underline' : 'hover:underline'
//             }
//           >
//             Quản lý Sản phẩm
//           </NavLink>
//         </li>
//         <li>
//           <NavLink
//             to="/manageorders"
//             className={({ isActive }) => 
//               isActive ? 'font-bold underline' : 'hover:underline'
//             }
//           >
//             Quản lý Đơn hàng
//           </NavLink>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default NavbarAdmin;
// src/components/admin/NavbarAdmin.jsx (Nếu vẫn dùng, nhưng có Sidebar rồi có thể bỏ hoặc dùng cho mobile)
import React from 'react';
import { NavLink } from 'react-router-dom';

const NavbarAdmin = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 mb-6 shadow-md">
      <ul className="flex space-x-8 justify-center">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => 
              `px-4 py-2 rounded-md transition duration-200 ${isActive ? 'bg-blue-600 font-bold' : 'hover:bg-blue-800'}`
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/managecategories"
            className={({ isActive }) => 
              `px-4 py-2 rounded-md transition duration-200 ${isActive ? 'bg-blue-600 font-bold' : 'hover:bg-blue-800'}`
            }
          >
            Quản lý Danh mục
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/manageproducts"
            className={({ isActive }) => 
              `px-4 py-2 rounded-md transition duration-200 ${isActive ? 'bg-blue-600 font-bold' : 'hover:bg-blue-800'}`
            }
          >
            Quản lý Sản phẩm
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/manageorders"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md transition duration-200 ${isActive ? 'bg-blue-600 font-bold' : 'hover:bg-blue-800'}`
            }
          >
            Quản lý Đơn hàng
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/manageusers"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md transition duration-200 ${isActive ? 'bg-blue-600 font-bold' : 'hover:bg-blue-800'}`
            }
          >
            Quản lý Người dùng
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavbarAdmin;