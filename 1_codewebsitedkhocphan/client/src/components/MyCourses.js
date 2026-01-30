import React, { useState, useEffect } from 'react';
import { coursesAPI, authAPI } from '../services/api';

function MyCourses({ user, setUser }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await authAPI.getMe();
      setCourses(response.data.enrolledCourses || []);
    } catch (err) {
      setError('Không thể tải danh sách môn học');
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (courseId) => {
    if (!window.confirm('Bạn có chắc muốn hủy đăng ký môn học này?')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await coursesAPI.unenroll(courseId);
      
      // Update user data
      const userResponse = await authAPI.getMe();
      const updatedUser = userResponse.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Refresh courses
      await fetchMyCourses();
      setSuccess('Hủy đăng ký môn học thành công!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Hủy đăng ký thất bại');
    }
  };

  const calculateTotalCredits = () => {
    return courses.reduce((total, course) => total + (course.credits || 0), 0);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Môn Học Đã Đăng Ký</h1>
          <p className="page-description">
            Quản lý các môn học bạn đã đăng ký
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {courses.length > 0 && (
          <div className="card mb-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="card-title">Tổng Kết</h3>
                <p className="card-subtitle">Thông tin tổng quan về môn học đã đăng ký</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  {calculateTotalCredits()}
                </div>
                <div style={{ color: 'var(--text-light)' }}>Tổng tín chỉ</div>
              </div>
            </div>
          </div>
        )}

        {courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h3 className="empty-state-title">Chưa đăng ký môn học nào</h3>
            <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>
              Hãy vào danh sách môn học để đăng ký
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1">
            {courses.map((course) => (
              <div key={course._id} className="card">
                <div className="card-header">
                  <div>
                    <span className="badge badge-info">{course.code}</span>
                    <h3 className="card-title">{course.name}</h3>
                    <p className="card-subtitle">Giảng viên: {course.instructor}</p>
                  </div>
                  <div>
                    <span className="badge badge-success">Đã đăng ký</span>
                  </div>
                </div>

                <div className="card-body">
                  <p style={{ marginBottom: '0.5rem' }}>{course.description}</p>
                  
                  <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                    <div className="info-row">
                      <span className="info-label">📅 Lịch học:</span>
                      <span className="info-value">{course.schedule}</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="info-label">🏢 Phòng:</span>
                      <span className="info-value">{course.room}</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="info-label">📖 Tín chỉ:</span>
                      <span className="info-value">{course.credits}</span>
                    </div>
                    
                    <div className="info-row">
                      <span className="info-label">👥 Sinh viên:</span>
                      <span className="info-value">
                        {course.enrolledStudents?.length || 0}/{course.maxStudents}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleUnenroll(course._id)}
                  >
                    Hủy Đăng Ký
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCourses;
