import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          🎓 Đăng Ký Học Phần
        </Link>
        <ul className="navbar-menu">
          {user ? (
            <>
              {/* Admin Menu - Only Admin Dashboard */}
              {user.role === 'admin' ? (
                <>
                  <li>
                    <Link 
                      to="/admin" 
                      className={`navbar-link ${location.pathname === '/admin' ? 'active' : ''}`}
                    >
                      ⚙️ Quản Lý Hệ Thống
                    </Link>
                  </li>
                  <li>
                    <span className="navbar-link" style={{color: '#ffd700', fontWeight: 'bold'}}>
                      👑 Admin
                    </span>
                  </li>
                  <li>
                    <button onClick={onLogout} className="btn btn-primary">
                      Đăng Xuất
                    </button>
                  </li>
                </>
              ) : (
                /* Student Menu - Course Registration */
                <>
                  <li>
                    <Link 
                      to="/courses" 
                      className={`navbar-link ${location.pathname === '/courses' ? 'active' : ''}`}
                    >
                      📚 Danh Sách Môn Học
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/my-courses" 
                      className={`navbar-link ${location.pathname === '/my-courses' ? 'active' : ''}`}
                    >
                      ✅ Môn Đã Đăng Ký
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/profile" 
                      className={`navbar-link ${location.pathname === '/profile' ? 'active' : ''}`}
                    >
                      👤 {user.name}
                    </Link>
                  </li>
                  <li>
                    <button onClick={onLogout} className="btn btn-primary">
                      Đăng Xuất
                    </button>
                  </li>
                </>
              )}
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="btn btn-outline">
                  Đăng Nhập
                </Link>
              </li>
              <li>
                <Link to="/register" className="btn btn-primary">
                  Đăng Ký
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
