import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'users', 'courses'
  const [registrationEnabled, setRegistrationEnabled] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      alert('Access denied. Admin only.');
      navigate('/');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const [statsRes, usersRes] = await Promise.all([
        axios.get('/api/admin/stats', { headers }),
        axios.get('/api/admin/users', { headers })
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setRegistrationEnabled(statsRes.data.registrationEnabled);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || 'Error loading data');
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await axios.delete(`/api/admin/users/${userId}`, { headers });
      alert('Xóa người dùng thành công');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting user');
    }
  };

  const handleToggleRegistration = async () => {
    try {
      const newStatus = !registrationEnabled;
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await axios.post('/api/admin/toggle-registration', { enabled: newStatus }, { headers });
      setRegistrationEnabled(newStatus);
      alert(newStatus ? '✅ Đã bật đăng ký' : '🚫 Đã tắt đăng ký');
    } catch (err) {
      alert(err.response?.data?.message || 'Error toggling registration');
    }
  };

  if (loading) return <div className="admin-container"><p>Loading...</p></div>;
  if (error) return <div className="admin-container"><p className="error">{error}</p></div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🎓 Admin Dashboard</h1>
        <button 
          className={`btn-toggle-registration ${registrationEnabled ? 'enabled' : 'disabled'}`}
          onClick={handleToggleRegistration}
        >
          {registrationEnabled ? '✅ Đăng Ký: BẬT' : '🚫 Đăng Ký: TẮT'}
        </button>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'stats' ? 'active' : ''} 
          onClick={() => setActiveTab('stats')}
        >
          Thống Kê
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Quản Lý Người Dùng
        </button>
      </div>

      {activeTab === 'stats' && stats && (
        <div className="stats-section">
          <div className="stat-cards">
            <div className="stat-card">
              <h3>{stats.totalUsers}</h3>
              <p>Tổng Sinh Viên</p>
            </div>
            <div className="stat-card online">
              <h3>{stats.onlineUsers}</h3>
              <p>Đang Online</p>
            </div>
            <div className="stat-card">
              <h3>{stats.totalCourses}</h3>
              <p>Tổng Môn Học</p>
            </div>
            <div className="stat-card">
              <h3>{stats.totalEnrollments}</h3>
              <p>Tổng Đăng Ký</p>
            </div>
            <div className="stat-card">
              <h3>{stats.recentUsers}</h3>
              <p>Đăng Ký Mới (7 ngày)</p>
            </div>
          </div>

          {stats.courseDistribution && stats.courseDistribution.length > 0 && (
          <div className="chart-section">
            <h2>📊 Phân Bổ Đăng Ký Môn Học</h2>
            <div className="pie-chart-container">
              <svg viewBox="0 0 200 200" className="pie-chart">
                {stats.courseDistribution.map((course, index) => {
                  let cumulativePercentage = 0;
                  stats.courseDistribution.slice(0, index).forEach(c => {
                    cumulativePercentage += parseFloat(c.percentage);
                  });
                  
                  const startAngle = (cumulativePercentage / 100) * 360;
                  const endAngle = ((cumulativePercentage + parseFloat(course.percentage)) / 100) * 360;
                  
                  const startX = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
                  const startY = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
                  const endX = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
                  const endY = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
                  
                  const largeArcFlag = parseFloat(course.percentage) > 50 ? 1 : 0;
                  
                  const pathData = [
                    `M 100 100`,
                    `L ${startX} ${startY}`,
                    `A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                    `Z`
                  ].join(' ');
                  
                  const colors = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#f56565'];
                  
                  return (
                    <path
                      key={course.code}
                      d={pathData}
                      fill={colors[index % colors.length]}
                      stroke="white"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
              <div className="pie-legend">
                {stats.courseDistribution.map((course, index) => {
                  const colors = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#f56565'];
                  return (
                    <div key={course.code} className="legend-item">
                      <span 
                        className="legend-color" 
                        style={{backgroundColor: colors[index % colors.length]}}
                      ></span>
                      <span className="legend-text">
                        {course.code} - {course.name}: {course.count} ({course.percentage}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-section">
          <h2>Danh Sách Người Dùng ({users.length})</h2>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>MSSV</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Vai Trò</th>
                  <th>Số Môn Đã Đăng Ký</th>
                  <th>Môn Học</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.studentId}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role === 'admin' ? 'Quản Trị' : 'Sinh Viên'}
                      </span>
                    </td>
                    <td>{user.enrolledCourses?.length || 0}</td>
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
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Xóa
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
