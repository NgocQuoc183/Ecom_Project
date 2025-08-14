import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEdit, FaSave, FaTimes, FaCamera, FaUpload } from 'react-icons/fa';
import jwt_decode from 'jwt-decode';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadAvatar
} from '../api/userApi';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    avatar_url: ''
  });
  const [originalProfile, setOriginalProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwt_decode(token);
      setUser(decodedToken);
      fetchProfile(decodedToken.id);
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  const fetchProfile = async (userId) => {
    try {
      setLoading(true);
      const data = await getUserProfile(userId);
      const profileData = {
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        avatar_url: data.avatar_url || ''
      };
      setProfile(profileData);
      setOriginalProfile(profileData);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải thông tin profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Hủy chỉnh sửa - khôi phục dữ liệu gốc
      setProfile(originalProfile);
      setError('');
    }
    setIsEditing(!isEditing);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      await updateUserProfile(user.id, profile);
      setOriginalProfile(profile);
      setIsEditing(false);
      setSuccessMessage('Cập nhật thông tin thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Lỗi khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      await changePassword(user.id, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });

      setSuccessMessage('Đổi mật khẩu thành công!');
      setShowPasswordForm(false);
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Lỗi khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý chọn file avatar
  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        setError('Vui lòng chọn file ảnh');
        return;
      }

      // Kiểm tra kích thước file (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File ảnh không được vượt quá 5MB');
        return;
      }

      setAvatarFile(file);

      // Tạo preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload avatar
  const handleUploadAvatar = async () => {
    if (!avatarFile || !user) return;

    try {
      setUploadingAvatar(true);
      setError('');

      const response = await uploadAvatar(user.id, avatarFile);

      // Cập nhật profile với avatar mới
      setProfile(prev => ({
        ...prev,
        avatar_url: response.avatarUrl
      }));
      setOriginalProfile(prev => ({
        ...prev,
        avatar_url: response.avatarUrl
      }));

      setSuccessMessage('Cập nhật avatar thành công!');
      setAvatarFile(null);
      setAvatarPreview(null);

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Lỗi khi upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Hủy chọn avatar
  const handleCancelAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : profile.avatar_url ? (
                    <img
                      src={`http://localhost:3001${profile.avatar_url}`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  {!avatarPreview && !profile.avatar_url && (
                    <FaUser className="text-gray-400 text-2xl" />
                  )}
                </div>

                {/* Camera button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition duration-200"
                  title="Thay đổi avatar"
                >
                  <FaCamera className="text-sm" />
                </button>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h1>
                <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>

                {/* Avatar upload controls */}
                {avatarFile && (
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={handleUploadAvatar}
                      disabled={uploadingAvatar}
                      className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50"
                    >
                      {uploadingAvatar ? (
                        <>
                          <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full"></div>
                          Đang tải...
                        </>
                      ) : (
                        <>
                          <FaUpload className="text-xs" />
                          Lưu avatar
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelAvatar}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition duration-200"
                    >
                      <FaTimes className="text-xs" />
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleEditToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 ${
                isEditing
                  ? 'bg-gray-500 text-white hover:bg-gray-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isEditing ? <FaTimes /> : <FaEdit />}
              {isEditing ? 'Hủy' : 'Chỉnh sửa'}
            </button>
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Thông tin cơ bản</h2>

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUser className="inline mr-2" />
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                  }`}
                  placeholder="Nhập họ và tên"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                  }`}
                  placeholder="Nhập email"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="inline mr-2" />
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                  }`}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              {isEditing && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FaSave />
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              )}
            </form>
          </div>

          {/* Password Change */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Bảo mật</h2>
              <button
                onClick={() => {
                  setShowPasswordForm(!showPasswordForm);
                  setError('');
                  setPasswordData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition duration-200 ${
                  showPasswordForm
                    ? 'bg-gray-500 text-white hover:bg-gray-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                <FaLock />
                {showPasswordForm ? 'Hủy' : 'Đổi mật khẩu'}
              </button>
            </div>

            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập lại mật khẩu mới"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition duration-200 disabled:opacity-50"
                >
                  {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                </button>
              </form>
            )}

            {!showPasswordForm && (
              <div className="text-gray-600">
                <p className="mb-4">Để bảo vệ tài khoản của bạn, hãy:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Sử dụng mật khẩu mạnh với ít nhất 6 ký tự</li>
                  <li>Không chia sẻ mật khẩu với người khác</li>
                  <li>Thay đổi mật khẩu định kỳ</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;