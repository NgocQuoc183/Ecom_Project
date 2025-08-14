// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../../api/adminApi';
import { FaUsers, FaShoppingCart, FaBoxOpen, FaTags, FaDollarSign } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalRevenue: 0,
    monthlyOrders: [],
    orderStatus: [],
    productsByCategory: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className={`${bgColor} rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">
            {loading ? '...' : value.toLocaleString()}
          </p>
        </div>
        <div className={`${color} p-4 rounded-full`}>
          <Icon className="text-white text-2xl" />
        </div>
      </div>
    </div>
  );

  // Màu sắc cho biểu đồ
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Chuẩn bị dữ liệu cho biểu đồ tháng
  const formatMonthlyData = (data) => {
    return data.map(item => ({
      month: item.month,
      orders: item.orders,
      revenue: parseFloat(item.revenue) || 0
    }));
  };

  // Component loading cho biểu đồ
  const ChartLoading = () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard Admin</h1>
          <p className="text-gray-600">Tổng quan hệ thống quản lý</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={FaUsers}
            title="Tổng người dùng"
            value={stats.totalUsers}
            color="bg-blue-500"
            bgColor="bg-white"
          />
          <StatCard
            icon={FaShoppingCart}
            title="Tổng đơn hàng"
            value={stats.totalOrders}
            color="bg-green-500"
            bgColor="bg-white"
          />
          <StatCard
            icon={FaBoxOpen}
            title="Tổng sản phẩm"
            value={stats.totalProducts}
            color="bg-purple-500"
            bgColor="bg-white"
          />
          <StatCard
            icon={FaTags}
            title="Tổng danh mục"
            value={stats.totalCategories}
            color="bg-orange-500"
            bgColor="bg-white"
          />
          <StatCard
            icon={FaDollarSign}
            title="Doanh thu"
            value={stats.totalRevenue}
            color="bg-red-500"
            bgColor="bg-white"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Biểu đồ đơn hàng theo tháng */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Đơn hàng theo tháng</h3>
            {loading ? (
              <ChartLoading />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formatMonthlyData(stats.monthlyOrders)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Số đơn hàng"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Biểu đồ trạng thái đơn hàng */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Trạng thái đơn hàng</h3>
            {loading ? (
              <ChartLoading />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.orderStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, count }) => `${status}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats.orderStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Second row of charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Biểu đồ sản phẩm theo danh mục */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Sản phẩm theo danh mục</h3>
            {loading ? (
              <ChartLoading />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.productsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="products" fill="#82ca9d" name="Số sản phẩm" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Biểu đồ doanh thu theo tháng */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Doanh thu theo tháng</h3>
            {loading ? (
              <ChartLoading />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formatMonthlyData(stats.monthlyOrders)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} VNĐ`, 'Doanh thu']} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#ffc658" name="Doanh thu (VNĐ)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quản lý nhanh</h3>
            <div className="space-y-3">
              <a href="/managecategories" className="block w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200 text-center">
                Quản lý danh mục
              </a>
              <a href="/manageproducts" className="block w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200 text-center">
                Quản lý sản phẩm
              </a>
              <a href="/manageorders" className="block w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition duration-200 text-center">
                Quản lý đơn hàng
              </a>
              <a href="/manageusers" className="block w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-200 text-center">
                Quản lý người dùng
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Hoạt động gần đây</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-between py-2 border-b">
                <span>Đơn hàng mới</span>
                <span className="text-green-500 font-medium">+{stats.totalOrders}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span>Sản phẩm</span>
                <span className="text-blue-500 font-medium">{stats.totalProducts}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Người dùng</span>
                <span className="text-purple-500 font-medium">{stats.totalUsers}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Thông tin hệ thống</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center justify-between py-2 border-b">
                <span>Trạng thái</span>
                <span className="text-green-500 font-medium">Hoạt động</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span>Phiên bản</span>
                <span className="text-blue-500 font-medium">v1.0.0</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Cập nhật</span>
                <span className="text-gray-500 font-medium">Hôm nay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

