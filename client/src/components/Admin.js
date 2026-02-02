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
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      alert('Access denied. Admin only.');
      navigate('/');
      return;
    }

    fetchData();

    const intervalId = setInterval(() => {
      fetchData(true);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  const fetchData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const [statsRes, usersRes] = await Promise.all([
        axios.get('/api/admin/stats', { headers }),
        axios.get('/api/admin/users', { headers })
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
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
      fetchData(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Error toggling registration');
    }
  };

  if (loading) return <div className="admin-container"><p>Loading...</p></div>;
  if (error) return <div className="admin-container"><p className="error">{error}</p></div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1>🎓 Admin Dashboard</h1>
          {lastUpdated && (
            <div className="last-updated">
              🔄 Cập nhật: {lastUpdated.toLocaleTimeString()}
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
            <h2>📊 Tỉ Lệ Đăng Ký Môn Học</h2>
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
                          width: `${course.percentage}%`,
                          backgroundColor: colors[index % colors.length]
                        }}
                      />
                    </div>
                    <div className="bar-value">
                      {course.count} ({course.percentage}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )}

          {stats.creditsPerUser && stats.creditsPerUser.length > 0 && (
          <div className="chart-section">
            <h2>📈 Tín Chỉ Theo Từng Sinh Viên (Top 10)</h2>
            <div className="bar-chart-list">
              {(() => {
                const topUsers = stats.creditsPerUser.slice(0, 10);
                const maxCredits = Math.max(...topUsers.map(u => u.credits), 1);
                return topUsers.map((user) => (
                  <div key={user.email} className="bar-row">
                    <div className="bar-label">
                      {user.name} ({user.studentId})
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${(user.credits / maxCredits) * 100}%` }}
                      />
                    </div>
                    <div className="bar-value">{user.credits} TC</div>
                  </div>
                ));
              })()}
            </div>

            <div className="bar-chart-table">
              <table className="credits-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>MSSV</th>
                    <th>Tên Sinh Viên</th>
                    <th>Email</th>
                    <th>Tín Chỉ</th>
                    <th>Môn Học</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.creditsPerUser.map((user, idx) => (
                    <tr key={user.email}>
                      <td>{idx + 1}</td>
                      <td>{user.studentId}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td className="credits-cell">{user.credits}</td>
                      <td>{user.enrollments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  <th>Tín Chỉ</th>
                  <th>Môn Học</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  // Calculate total credits for this user
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
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Xóa
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
