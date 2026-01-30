import React, { useState, useEffect } from 'react';
import { coursesAPI, authAPI } from '../services/api';

function Courses({ user, setUser }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getAll();
      setCourses(response.data);
    } catch (err) {
      setError('Không thể tải danh sách môn học');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setError('');
      setSuccess('');
      await coursesAPI.enroll(courseId);
      
      // Update user data
      const userResponse = await authAPI.getMe();
      const updatedUser = userResponse.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Refresh courses
      await fetchCourses();
      setSuccess('Đăng ký môn học thành công!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  const isEnrolled = (courseId) => {
    return user.enrolledCourses?.some(c => c._id === courseId || c === courseId);
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
          <h1 className="page-title">Danh Sách Môn Học</h1>
          <p className="page-description">
            Chọn và đăng ký các môn học phù hợp với bạn
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <h3 className="empty-state-title">Chưa có môn học nào</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2">
            {courses.map((course) => (
              <div key={course._id} className="card">
                <div className="card-header">
                  <div>
                    <span className="badge badge-info">{course.code}</span>
                    <h3 className="card-title">{course.name}</h3>
                    <p className="card-subtitle">Giảng viên: {course.instructor}</p>
                  </div>
                  <div>
                    {course.status === 'full' ? (
                      <span className="badge badge-danger">Đã đầy</span>
                    ) : (
                      <span className="badge badge-success">Còn chỗ</span>
                    )}
                  </div>
                </div>

                <div className="card-body">
                  <p style={{ marginBottom: '0.5rem' }}>{course.description}</p>
                  
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
                    <span className="info-label">👥 Số chỗ:</span>
                    <span className="info-value">
                      {course.enrolledStudents?.length || 0}/{course.maxStudents}
                      {' '}({course.availableSeats} còn trống)
                    </span>
                  </div>
                </div>

                <div className="card-footer">
                  {isEnrolled(course._id) ? (
                    <button className="btn btn-secondary" disabled>
                      ✓ Đã đăng ký
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEnroll(course._id)}
                      disabled={course.status === 'full'}
                    >
                      {course.status === 'full' ? 'Hết chỗ' : 'Đăng ký'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;
