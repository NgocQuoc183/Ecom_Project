// import React from "react";
// import AppRoutes from "./routes/AppRoutes"; // Các tuyến đường trong ứng dụng
// import Header from "./components/layout/Header"; // Component Header
// import Footer from "./components/layout/Footer"; // Component Footer
// const App = () => {
//   return (
//       <div className="bg-white text-black">
//         <Header /> {/* Hiển thị Header */}
//         <main className="min-h-[80vh]">
//           <AppRoutes /> {/* Các tuyến đường của ứng dụng */}
//         </main>
//         <Footer /> {/* Hiển thị Footer */}
//       </div>
//   );
// };

// export default App;
// src/App.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import NavbarAdmin from "./components/admin/NavbarAdmin"; // Import navbar admin

const App = () => {
  const location = useLocation();
  const adminPaths = ["/dashboard", "/managecategories", "/manageproducts", "/manageorders", "/manageusers"];
  const isAdmin = adminPaths.includes(location.pathname);

  return (
    <div className="bg-white text-black">
      {!isAdmin && <Header />} {/* Header user */}
      {isAdmin && <NavbarAdmin />} {/* Navbar chỉ cho admin */}
      <main className={isAdmin ? "min-h-screen p-4" : "min-h-[80vh]"}>
        <AppRoutes />
      </main>
      {!isAdmin && <Footer />} {/* Footer user */}
    </div>
  );
};

export default App;