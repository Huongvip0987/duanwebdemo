import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
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
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      onLogin(response.data.user, response.data.token);
      navigate('/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="card">
            <h2 className="card-title text-center">Đăng Nhập</h2>
            <p className="text-center" style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>
              Chào mừng bạn trở lại!
            </p>

            {error && (
              <div className="alert alert-error">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@university.edu"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mật Khẩu</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
              </button>
            </form>

            <p className="text-center mt-3">
              Chưa có tài khoản?{' '}
              <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
                Đăng ký ngay
              </Link>
            </p>

            <div className="alert alert-info mt-3">
              <strong>Tài khoản demo:</strong><br />
              Email: student@university.edu<br />
              Password: student123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
