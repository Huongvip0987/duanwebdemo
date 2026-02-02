import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let user = null;
    try {
      const rawUser = localStorage.getItem('user');
      if (rawUser && rawUser !== 'undefined') {
        user = JSON.parse(rawUser);
      }
    } catch (parseError) {
      user = null;
    }
    if (!user || user.role !== 'admin') {
      alert('Access denied. Admin only.');
      navigate('/');
      return;
    }

    fetchData();

    // Change polling interval from 10s to 5s
    const intervalId = setInterval(() => {
      fetchData(true);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  const fetchData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      // Fetch all three data sources together
      const [statsRes, usersRes, activeUsersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/active-users')
      ]);
      
      setStats(statsRes.data);
      if (typeof statsRes.data?.registrationEnabled === 'boolean') {
        setRegistrationEnabled(statsRes.data.registrationEnabled);
      }
      setUsers(usersRes.data);
      setActiveUsers(activeUsersRes.data);
      setLastUpdated(new Date());
      if (!silent) setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      if (!silent) {
        setError(err.response?.data?.message || 'Error loading data');
        setLoading(false);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      alert('Xóa người dùng thành công');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  const handleToggleRegistration = async () => {
    try {
      const newStatus = !registrationEnabled;
      await api.post('/admin/toggle-registration', { enabled: newStatus });
      setRegistrationEnabled(newStatus);
      alert(newStatus ? '✅ Đã bật đăng ký' : '🚫 Đã tắt đăng ký');
      fetchData(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Error toggling registration');
    }
  };

  if (loading) return <div className="admin-container"><p>Loading...</p></div>;
  if (error) return <div className="admin-container"><p className="error">{error}</p></div>;

  return (
    <div className="admin-container">
      {/* Header with toggle button */}
      <div className="admin-header">
        <div>
          <h1>🎓 Admin Dashboard</h1>
          {lastUpdated && (
            <div className="last-updated">
              🔄 Cập nhật: {lastUpdated.toLocaleTimeString()} ({Math.round((new Date() - lastUpdated) / 1000)}s)
            </div>
          )}
        </div>
        <button 
          className={`btn-toggle-registration ${registrationEnabled ? 'enabled' : 'disabled'}`}
          onClick={handleToggleRegistration}
        >
          {registrationEnabled ? '✅ Đăng Ký: BẬT' : '🚫 Đăng Ký: TẮT'}
        </button>
      </div>

      {/* Statistics Section */}
      {stats && (
        <div className="unified-section">
          <div className="section-title">📊 Thống Kê Hệ Thống</div>
          <div className="stat-cards">
            <div className="stat-card">
              <h3>{stats.totalUsers}</h3>
              <p>👥 Tổng Tài Khoản</p>
            </div>
            <div className="stat-card">
              <h3>{stats.studentCount}</h3>
              <p>🎓 Sinh Viên</p>
            </div>
            <div className="stat-card">
              <h3>{stats.adminCount}</h3>
              <p>👨‍💼 Admin</p>
            </div>
            <div className="stat-card">
              <h3>{stats.totalCourses}</h3>
              <p>📚 Tổng Môn Học</p>
            </div>
            <div className="stat-card">
              <h3>{stats.totalEnrollments}</h3>
              <p>✏️ Tổng Đăng Ký</p>
            </div>
          </div>

          {stats.courseStats && stats.courseStats.length > 0 && (
            <div className="chart-section">
              <h2>📈 Tỉ Lệ Đăng Ký Môn Học</h2>
              <table className="course-table">
                <thead>
                  <tr>
                    <th>Mã Môn</th>
                    <th>Tên Môn</th>
                    <th>Số SV Đăng Ký</th>
                    <th>Tối Đa</th>
                    <th>Tỉ Lệ %</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.courseStats.map((course) => (
                    <tr key={course.id}>
                      <td><strong>{course.code}</strong></td>
                      <td>{course.name}</td>
                      <td>{course.enrolled}</td>
                      <td>{course.maxStudents}</td>
                      <td>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{width: `${course.percentage}%`}}
                          >
                            {course.percentage}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Active Users Section - Real-time updates */}
      <div className="unified-section active-users-section">
        <h2>👥 Tài Khoản Đang Hoạt Động ({activeUsers.length})</h2>
        {activeUsers && activeUsers.length > 0 ? (
          <div className="active-users-grid">
            {activeUsers.map(user => (
              <div key={user._id} className="active-user-card">
                <div className="user-status-indicator"></div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                  <div className="user-role">{user.role === 'admin' ? '👨‍💼 Admin' : '🎓 Sinh Viên'}</div>
                  {user.lastActive && (
                    <div className="user-last-active">
                      Hoạt động: {new Date(user.lastActive).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-active-users">Không có tài khoản nào đang hoạt động</p>
        )}
      </div>

      {/* Users Management Section */}
      <div className="unified-section users-section">
        <h2>👨‍💼 Danh Sách Người Dùng ({users.length})</h2>
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>MSSV</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai Trò</th>
                <th>Tín Chỉ</th>
                <th>Môn Học</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const userCredits = user.enrolledCourses?.reduce((sum, course) => sum + (course.credits || 0), 0) || 0;
                
                return (
                  <tr key={user._id}>
                    <td>{user.studentId}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role === 'admin' ? 'Quản Trị' : 'Sinh Viên'}
                      </span>
                    </td>
                    <td className="credits-td">
                      <strong style={{fontSize: '1.1rem', color: '#2d7ab8'}}>
                        {userCredits} TC
                      </strong>
                    </td>
                    <td>
                      {user.enrolledCourses?.length > 0 ? (
                        <ul className="enrolled-courses-list">
                          {user.enrolledCourses.map(course => (
                            <li key={course._id}>
                              {course.code} - {course.name} ({course.credits} TC)
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="no-courses">Chưa đăng ký môn nào</span>
                      )}
                    </td>
                    <td>
                      {user.role !== 'admin' && (
                        <div className="admin-actions">
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Xóa
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
