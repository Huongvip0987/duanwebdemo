# 🚀 Hướng Dẫn Nhanh (Quick Start Guide)

## 📋 Tổng Quan

Website đăng ký học phần hoàn chỉnh với:
- ✅ Đăng ký / Đăng nhập
- ✅ Danh sách môn học
- ✅ Đăng ký và hủy môn học
- ✅ Quản lý thông tin cá nhân
- ✅ Giao diện đẹp, responsive
- ✅ Backend API với Express.js + MongoDB
- ✅ Frontend với React.js

## 🎯 Chạy Demo Trên Windows (Test Local)

### 1. Cài đặt yêu cầu:
- Node.js (v14+): https://nodejs.org/
- MongoDB: https://www.mongodb.com/try/download/community

### 2. Khởi động MongoDB:
```powershell
# Windows - Mở PowerShell as Administrator
net start MongoDB
```

### 3. Cài đặt dependencies:
```powershell
cd G:\1_codewebsitedkhocphan

# Backend
cd server
npm install
cd ..

# Frontend
cd client
npm install
cd ..
```

### 4. Chạy ứng dụng:

**Terminal 1 - Backend:**
```powershell
cd server
node server.js
```

**Terminal 2 - Frontend:**
```powershell
cd client
npm start
```

### 5. Truy cập:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🐧 Triển Khai Trên Ubuntu Server (VMware)

### Bước 1: Copy code sang Ubuntu

**Phương pháp đơn giản nhất - SCP:**
```powershell
# Từ Windows PowerShell
scp -r G:\1_codewebsitedkhocphan username@<IP-Ubuntu>:~/
```

*Thay `username` và `<IP-Ubuntu>` bằng thông tin của bạn*

### Bước 2: Trên Ubuntu Server

```bash
# 1. Di chuyển vào thư mục
cd ~/1_codewebsitedkhocphan

# 2. Cấp quyền thực thi
chmod +x setup.sh start.sh start-dev.sh

# 3. Chạy script cài đặt (tự động cài Node.js, MongoDB)
./setup.sh

# 4. Khởi động ứng dụng
./start.sh
```

### Bước 3: Truy cập từ Windows

Mở trình duyệt trên Windows:
```
http://<IP-Ubuntu-Server>:5000
```

## 🔐 Tài Khoản Demo

**Sinh viên:**
- Email: `student@university.edu`
- Password: `student123`

**Admin:**
- Email: `admin@university.edu`
- Password: `admin123`

## 📁 Cấu Trúc Project

```
1_codewebsitedkhocphan/
├── client/                    # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Navbar.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Courses.js
│   │   │   ├── MyCourses.js
│   │   │   └── Profile.js
│   │   ├── services/
│   │   │   └── api.js        # API calls
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/                    # Backend Express
│   ├── models/
│   │   ├── User.js           # User model
│   │   └── Course.js         # Course model
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── courses.js        # Course routes
│   │   └── users.js          # User routes
│   ├── middleware/
│   │   └── auth.js           # JWT middleware
│   ├── server.js             # Entry point
│   ├── .env                  # Environment variables
│   └── package.json
├── setup.sh                   # Ubuntu setup script
├── start.sh                   # Production start script
├── start-dev.sh              # Development start script
├── stop.sh                    # Stop script
├── README.md                  # Full documentation
├── DEPLOYMENT.md             # Deployment guide
└── QUICK-START.md            # This file
```

## 🔧 Các Lệnh Hữu Ích

### Trên Ubuntu:

```bash
# Xem log MongoDB
sudo journalctl -u mongod -f

# Xem log ứng dụng (nếu dùng systemd)
sudo journalctl -u course-registration -f

# Restart MongoDB
sudo systemctl restart mongod

# Kiểm tra port đang sử dụng
sudo lsof -i :5000

# Xem IP của Ubuntu
hostname -I
```

### Development Mode (Ubuntu):

```bash
# Chạy cả frontend và backend
./start-dev.sh

# Hoặc chạy riêng lẻ:
# Terminal 1 - Backend
cd server && node server.js

# Terminal 2 - Frontend
cd client && npm start
```

## 🐛 Khắc Phục Lỗi Thường Gặp

### 1. MongoDB không khởi động được

```bash
sudo systemctl status mongod
sudo systemctl restart mongod
```

### 2. Port 5000 đã được sử dụng

```bash
# Tìm process
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

### 3. Không kết nối được từ Windows

- Kiểm tra VMware Network: Dùng "Bridged" mode
- Kiểm tra firewall Ubuntu:
```bash
sudo ufw allow 5000/tcp
sudo ufw allow 3000/tcp
```

### 4. Lỗi npm install

```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

## 📱 Tính Năng Chính

### Sinh Viên:
1. ✅ Đăng ký tài khoản mới
2. ✅ Đăng nhập vào hệ thống
3. ✅ Xem danh sách môn học
4. ✅ Đăng ký môn học (nếu còn chỗ)
5. ✅ Hủy đăng ký môn học
6. ✅ Xem môn đã đăng ký
7. ✅ Quản lý thông tin cá nhân
8. ✅ Xem thống kê tín chỉ

### Admin:
1. ✅ Tất cả quyền của sinh viên
2. ✅ Tạo môn học mới
3. ✅ Cập nhật thông tin môn học
4. ✅ Xóa môn học
5. ✅ Xem danh sách sinh viên

## 🌐 API Endpoints

### Authentication:
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Courses:
- `GET /api/courses` - Lấy danh sách môn học
- `GET /api/courses/:id` - Lấy chi tiết môn học
- `POST /api/courses/:id/enroll` - Đăng ký môn học
- `DELETE /api/courses/:id/unenroll` - Hủy đăng ký
- `POST /api/courses` - Tạo môn học (admin)
- `PUT /api/courses/:id` - Cập nhật môn học (admin)
- `DELETE /api/courses/:id` - Xóa môn học (admin)

### Users:
- `GET /api/users/profile` - Lấy profile
- `PUT /api/users/profile` - Cập nhật profile
- `GET /api/users` - Lấy danh sách users (admin)

## 🎨 Công Nghệ Sử Dụng

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (Password hashing)

**Frontend:**
- React.js
- React Router
- Axios
- CSS3 (Custom styling)

## 📚 Tài Liệu Thêm

- [README.md](README.md) - Tài liệu đầy đủ
- [DEPLOYMENT.md](DEPLOYMENT.md) - Hướng dẫn triển khai chi tiết

## 💡 Tips

1. **Chạy background trên Ubuntu:**
```bash
# Sử dụng nohup
nohup ./start.sh > app.log 2>&1 &

# Hoặc sử dụng tmux
tmux new -s courseapp
./start.sh
# Nhấn Ctrl+B, sau đó D để detach
```

2. **Auto-start khi khởi động:**
```bash
# Copy service file
sudo cp course-registration.service /etc/systemd/system/

# Sửa đường dẫn trong file
sudo nano /etc/systemd/system/course-registration.service

# Enable service
sudo systemctl enable course-registration
sudo systemctl start course-registration
```

3. **Xem log real-time:**
```bash
tail -f server/logs/*.log
```

## 🆘 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra MongoDB đang chạy
2. Kiểm tra port 5000 không bị chiếm
3. Kiểm tra file .env trong thư mục server
4. Xem log trong console
5. Đảm bảo đã cài đủ dependencies (npm install)

---

**Chúc bạn triển khai thành công! 🎉**
