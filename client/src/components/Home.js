import React from 'react';
import { Link } from 'react-router-dom';

function Home({ user }) {
  return (
    <div>
      <div className="hero">
        <div className="container">
          <h1 className="hero-title">
            {user && user.role === 'admin' 
              ? '👑 Hệ Thống Quản Lý Admin' 
              : 'Chào Mừng Đến Hệ Thống Đăng Ký Học Phần'
            }
          </h1>
          <p className="hero-subtitle">
            {user && user.role === 'admin'
              ? 'Quản lý người dùng, môn học, và theo dõi thống kê hệ thống'
              : 'Quản lý và đăng ký môn học dễ dàng, nhanh chóng'
            }
          </p>
          {!user && (
            <div style={{ marginTop: '2rem' }}>
              <Link to="/register" className="btn btn-primary" style={{ marginRight: '1rem' }}>
                Đăng Ký Ngay
              </Link>
              <Link to="/login" className="btn btn-outline" style={{ background: 'white' }}>
                Đăng Nhập
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="container page">
        {/* Admin Dashboard Preview */}
        {user && user.role === 'admin' ? (
          <div>
            <div className="grid grid-cols-3">
              <div className="card text-center" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                <h3 className="card-title" style={{color: 'white'}}>Quản Lý Người Dùng</h3>
                <p className="card-subtitle" style={{color: '#f0f0f0'}}>
                  Xem, xóa và theo dõi tài khoản sinh viên
                </p>
              </div>

              <div className="card text-center" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white'}}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                <h3 className="card-title" style={{color: 'white'}}>Thống Kê Hệ Thống</h3>
                <p className="card-subtitle" style={{color: '#f0f0f0'}}>
                  Dashboard với biểu đồ và số liệu chi tiết
                </p>
              </div>

              <div className="card text-center" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white'}}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
                <h3 className="card-title" style={{color: 'white'}}>Cài Đặt Hệ Thống</h3>
                <p className="card-subtitle" style={{color: '#f0f0f0'}}>
                  Bật/tắt đăng ký, quản lý môn học
                </p>
              </div>
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
              <Link to="/admin" className="btn btn-primary" style={{fontSize: '1.2rem', padding: '15px 40px'}}>
                🚀 Vào Trang Quản Lý
              </Link>
            </div>
          </div>
        ) : (
          /* Student Features */
          <>
            <div className="grid grid-cols-3">
              <div className="card text-center">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                <h3 className="card-title">Đa Dạng Môn Học</h3>
                <p className="card-subtitle">
                  Hàng trăm môn học từ các lĩnh vực khác nhau
                </p>
              </div>

              <div className="card text-center">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
                <h3 className="card-title">Đăng Ký Nhanh Chóng</h3>
                <p className="card-subtitle">
                  Giao diện đơn giản, đăng ký chỉ với vài click
                </p>
              </div>

              <div className="card text-center">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
                <h3 className="card-title">Bảo Mật An Toàn</h3>
                <p className="card-subtitle">
                  Thông tin cá nhân được bảo vệ tối đa
                </p>
              </div>
            </div>

            {user && (
              <div style={{ marginTop: '3rem' }}>
                <h2 className="page-title text-center">Bắt Đầu Ngay</h2>
                <div className="grid grid-cols-2" style={{ maxWidth: '800px', margin: '2rem auto' }}>
                  <Link to="/courses" className="card text-center" style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</div>
                    <h3 className="card-title">Xem Danh Sách Môn Học</h3>
                    <p className="card-subtitle">Khám phá các môn học có sẵn</p>
                  </Link>

                  <Link to="/my-courses" className="card text-center" style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                    <h3 className="card-title">Môn Đã Đăng Ký</h3>
                    <p className="card-subtitle">Quản lý môn học của bạn</p>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
