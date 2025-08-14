// src/pages/admin/Dashboard.jsx
import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Tổng quan Admin</h2>
      <p>Chào mừng đến với dashboard. Quản lý từ sidebar bên trái.</p>
      {/* Có thể thêm stats như số lượng categories, products, orders bằng cách gọi API */}
    </div>
  );
};

export default Dashboard;

