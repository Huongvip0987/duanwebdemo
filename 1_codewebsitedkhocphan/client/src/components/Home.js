import React from 'react';
import { Link } from 'react-router-dom';

function Home({ user }) {
  return (
    <div>
      <div className="hero">
        <div className="container">
          <h1 className="hero-title">Chào Mừng Đến Hệ Thống Đăng Ký Học Phần</h1>
          <p className="hero-subtitle">
            Quản lý và đăng ký môn học dễ dàng, nhanh chóng
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
      </div>
    </div>
  );
}

export default Home;
