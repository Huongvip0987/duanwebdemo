import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Courses from './components/Courses';
import MyCourses from './components/MyCourses';
import Profile from './components/Profile';
import Admin from './components/Admin';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route 
            path="/login" 
            element={
              user 
                ? user.role === 'admin' 
                  ? <Navigate to="/admin" /> 
                  : <Navigate to="/courses" />
                : <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/courses" /> : <Register onLogin={handleLogin} />} 
          />
          
          {/* Student Routes - Admin CANNOT access */}
          <Route 
            path="/courses" 
            element={
              user 
                ? user.role === 'student' 
                  ? <Courses user={user} setUser={setUser} />
                  : <Navigate to="/admin" />
                : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/my-courses" 
            element={
              user 
                ? user.role === 'student'
                  ? <MyCourses user={user} setUser={setUser} />
                  : <Navigate to="/admin" />
                : <Navigate to="/login" />
            } 
          />
          <Route 
            path="/profile" 
            element={
              user 
                ? user.role === 'student'
                  ? <Profile user={user} setUser={setUser} />
                  : <Navigate to="/admin" />
                : <Navigate to="/login" />
            } 
          />
          
          {/* Admin Route - Students CANNOT access */}
          <Route 
            path="/admin" 
            element={
              user 
                ? user.role === 'admin' 
                  ? <Admin /> 
                  : <Navigate to="/courses" />
                : <Navigate to="/login" />
            } 
          />
        </Routes>
        <footer className="footer">
          <div className="container">
            <p>© 2026 Hệ Thống Đăng Ký Học Phần. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
