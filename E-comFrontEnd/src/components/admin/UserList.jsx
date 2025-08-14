import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, toggleUserStatus } from '../../api/adminApi';
import UserForm from './UserForm';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaEye } from 'react-icons/fa';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleView = (user) => {
    setViewUser(user);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await deleteUser(userId);
        alert('Xóa người dùng thành công!');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(error.response?.data?.message || 'Lỗi khi xóa người dùng');
      }
    }
  };

  const handleToggleStatus = async (userId, currentIsActive) => {
    const newStatus = currentIsActive ? 'inactive' : 'active';
    try {
      await toggleUserStatus(userId, newStatus);
      alert('Cập nhật trạng thái thành công!');
      fetchUsers();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditUser(null);
    fetchUsers();
  };

  const handleCloseView = () => {
    setViewUser(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      user: 'bg-blue-100 text-blue-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role] || 'bg-gray-100 text-gray-800'}`}>
        {role === 'admin' ? 'Quản trị' : 'Khách hàng'}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    const colors = {
      1: 'bg-green-100 text-green-800',
      0: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[isActive] || 'bg-gray-100 text-gray-800'}`}>
        {isActive ? 'Hoạt động' : 'Không hoạt động'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
        <div className="text-sm text-gray-600">
          Tổng: {users.length} người dùng
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 p-4 text-left">ID</th>
              <th className="border border-gray-300 p-4 text-left">Tên</th>
              <th className="border border-gray-300 p-4 text-left">Email</th>
              <th className="border border-gray-300 p-4 text-left">Số điện thoại</th>
              <th className="border border-gray-300 p-4 text-left">Vai trò</th>
              <th className="border border-gray-300 p-4 text-left">Trạng thái</th>
              <th className="border border-gray-300 p-4 text-left">Ngày tạo</th>
              <th className="border border-gray-300 p-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                <td className="border border-gray-300 p-4">{user.id}</td>
                <td className="border border-gray-300 p-4 font-medium">{user.name}</td>
                <td className="border border-gray-300 p-4">{user.email}</td>
                <td className="border border-gray-300 p-4">{user.phone || 'Chưa cập nhật'}</td>
                <td className="border border-gray-300 p-4">{getRoleBadge(user.role)}</td>
                <td className="border border-gray-300 p-4">{getStatusBadge(user.is_active)}</td>
                <td className="border border-gray-300 p-4">{formatDate(user.created_at)}</td>
                <td className="border border-gray-300 p-4">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleView(user)} 
                      className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
                      title="Xem chi tiết"
                    >
                      <FaEye />
                    </button>
                    <button 
                      onClick={() => handleEdit(user)} 
                      className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition duration-200"
                      title="Chỉnh sửa"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user.id, user.is_active)}
                      className={`p-2 rounded-md transition duration-200 ${
                        user.is_active
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                      title={user.is_active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                    >
                      {user.is_active ? <FaToggleOff /> : <FaToggleOn />}
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)} 
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
                      title="Xóa"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không có người dùng nào
        </div>
      )}

      {/* Modal chỉnh sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <UserForm user={editUser} onClose={handleCloseModal} />
          </div>
        </div>
      )}

      {/* Modal xem chi tiết */}
      {viewUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 transform transition-all duration-300 scale-100">
            <h3 className="text-xl font-bold mb-4">Chi tiết người dùng</h3>
            <div className="space-y-3">
              <div><strong>ID:</strong> {viewUser.id}</div>
              <div><strong>Tên:</strong> {viewUser.name}</div>
              <div><strong>Email:</strong> {viewUser.email}</div>
              <div><strong>Số điện thoại:</strong> {viewUser.phone || 'Chưa cập nhật'}</div>
              <div><strong>Vai trò:</strong> {getRoleBadge(viewUser.role)}</div>
              <div><strong>Trạng thái:</strong> {getStatusBadge(viewUser.is_active)}</div>
              <div><strong>Avatar:</strong> {viewUser.avatar_url || 'Chưa có'}</div>
              <div><strong>Ngày tạo:</strong> {formatDate(viewUser.created_at)}</div>
              <div><strong>Cập nhật:</strong> {formatDate(viewUser.updated_at)}</div>
            </div>
            <button 
              onClick={handleCloseView}
              className="mt-6 w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
