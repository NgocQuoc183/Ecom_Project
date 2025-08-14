import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getCurrentUser,
  getUserProfile, 
  updateUserProfile, 
  changePassword 
} from '../api/userApi';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [currentUser] = useState(getCurrentUser()); // Bỏ setCurrentUser nếu không dùng
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser.id !== userId) {
      setError('Bạn không có quyền truy cập hồ sơ này');
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(userId);
        setProfile(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId, currentUser, navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(userId, profile);
      setSuccessMessage('Cập nhật thông tin thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Mật khẩu mới không khớp');
      return;
    }
    
    try {
      await changePassword(userId, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      
      setSuccessMessage('Đổi mật khẩu thành công!');
      setTimeout(() => {
        setSuccessMessage('');
        setShowPasswordForm(false);
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!currentUser) return null;

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div>Không tìm thấy hồ sơ</div>;

  return (
    <div className="profile-container">
      <h2>Hồ sơ người dùng</h2>
      
      {successMessage && <div className="success">{successMessage}</div>}
      
      <form onSubmit={handleProfileUpdate}>
        {/* ... các form fields ... */}
        <button type="submit" className="btn-primary">Cập nhật thông tin</button>
      </form>
      
      <div className="password-section">
        <button 
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="btn-secondary"
        >
          {showPasswordForm ? 'Hủy' : 'Đổi mật khẩu'}
        </button>
        
        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="password-form">
            {/* ... các password fields ... */}
            <button type="submit" className="btn-primary">Đổi mật khẩu</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;