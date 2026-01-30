import React, { useState } from 'react';
import { usersAPI } from '../services/api';

function Profile({ user, setUser }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await usersAPI.updateProfile(formData);
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setSuccess('Cập nhật thông tin thành công!');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email
    });
    setEditing(false);
    setError('');
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Thông Tin Cá Nhân</h1>
          <p className="page-description">Quản lý thông tin tài khoản của bạn</p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Thông Tin Tài Khoản</h3>
              {!editing && (
                <button className="btn btn-primary" onClick={() => setEditing(true)}>
                  Chỉnh Sửa
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Họ và Tên</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={handleCancel}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            ) : (
              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">Họ và Tên:</span>
                  <span className="info-value">{user.name}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user.email}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Mã Sinh Viên:</span>
                  <span className="info-value">{user.studentId}</span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Vai trò:</span>
                  <span className="info-value">
                    <span className={`badge ${user.role === 'admin' ? 'badge-warning' : 'badge-info'}`}>
                      {user.role === 'admin' ? 'Quản trị viên' : 'Sinh viên'}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="card mt-3">
            <h3 className="card-title">Thống Kê</h3>
            <div className="card-body">
              <div className="grid grid-cols-2">
                <div className="text-center" style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    {user.enrolledCourses?.length || 0}
                  </div>
                  <div style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>
                    Môn học đã đăng ký
                  </div>
                </div>
                
                <div className="text-center" style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>
                    {user.enrolledCourses?.reduce((sum, course) => sum + (course.credits || 0), 0) || 0}
                  </div>
                  <div style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>
                    Tổng tín chỉ
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
