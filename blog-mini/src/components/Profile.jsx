import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '../features/auth/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    const updateData = {
      username: formData.username,
      email: formData.email,
      bio: formData.bio
    };

    try {
      await dispatch(updateUserProfile(updateData)).unwrap();
      setMessage('Cập nhật profile thành công!');
      setIsEditing(false);
    } catch (error) {
      setMessage(error.message || 'Có lỗi xảy ra khi cập nhật profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('Mật khẩu mới không khớp!');
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    const passwordData = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    };

    try {
      await dispatch(updateUserProfile(passwordData)).unwrap();
      setMessage('Đổi mật khẩu thành công!');
      setShowPasswordForm(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setMessage(error.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <p>Vui lòng đăng nhập để xem profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Profile của tôi</h2>
          {user.role === 'admin' && (
            <span className="admin-badge">Admin</span>
          )}
        </div>

        {message && (
          <div className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {/* Profile Information */}
        <div className="profile-section">
          <h3>Thông tin cá nhân</h3>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label htmlFor="username">Tên người dùng:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Giới thiệu:</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="4"
                placeholder="Viết vài dòng về bản thân..."
              />
            </div>

            <div className="profile-actions">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  Chỉnh sửa
                </button>
              ) : (
                <div className="edit-actions">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        username: user.username || '',
                        email: user.email || '',
                        bio: user.bio || '',
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    className="btn btn-secondary"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Password Change Section */}
        <div className="profile-section">
          <h3>Đổi mật khẩu</h3>
          {!showPasswordForm ? (
            <button
              type="button"
              onClick={() => setShowPasswordForm(true)}
              className="btn btn-outline"
            >
              Đổi mật khẩu
            </button>
          ) : (
            <form onSubmit={handlePasswordUpdate}>
              <div className="form-group">
                <label htmlFor="currentPassword">Mật khẩu hiện tại:</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Mật khẩu mới:</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu mới:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="password-actions">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setFormData(prev => ({
                      ...prev,
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    }));
                  }}
                  className="btn btn-secondary"
                >
                  Hủy
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Account Info */}
        <div className="profile-section">
          <h3>Thông tin tài khoản</h3>
          <div className="account-info">
            <p><strong>Ngày tham gia:</strong> {new Date(user.createdAt).toLocaleDateString('vi-VN')}</p>
            <p><strong>Vai trò:</strong> {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</p>
            <p><strong>ID:</strong> {user._id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
