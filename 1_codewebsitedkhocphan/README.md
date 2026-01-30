# Hệ Thống Đăng Ký Học Phần (Course Registration System)

Website đăng ký học phần với đầy đủ chức năng đăng nhập, đăng ký và quản lý môn học.

## Tính Năng

- ✅ Đăng ký tài khoản người dùng
- ✅ Đăng nhập với xác thực JWT
- ✅ Xem danh sách môn học
- ✅ Đăng ký và hủy đăng ký môn học
- ✅ Quản lý thông tin cá nhân
- ✅ Giao diện đẹp, responsive

## Công Nghệ Sử Dụng

- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Cài Đặt Trên Ubuntu Server

### 1. Cài Đặt Node.js và MongoDB

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Node.js (version 18.x)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Cài đặt MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -sc)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org

# Khởi động MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Clone/Copy Mã Nguồn Vào Server

```bash
# Tạo thư mục cho project
mkdir -p ~/course-registration
cd ~/course-registration

# Copy mã nguồn từ máy host hoặc clone từ git
# Hoặc sử dụng scp để copy từ Windows:
# scp -r G:\1_codewebsitedkhocphan/* username@ubuntu-server-ip:~/course-registration/
```

### 3. Cài Đặt Dependencies

```bash
# Cài đặt dependencies cho server
cd ~/course-registration/server
npm install

# Cài đặt dependencies cho client
cd ~/course-registration/client
npm install
```

### 4. Cấu Hình Environment Variables

```bash
cd ~/course-registration/server
nano .env
```

Cập nhật nếu cần:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/course_registration
JWT_SECRET=change_this_to_random_secret_key
NODE_ENV=production
```

### 5. Build Frontend

```bash
cd ~/course-registration/client
npm run build
```

### 6. Chạy Server

```bash
cd ~/course-registration/server
node server.js
```

### 7. Cấu Hình Firewall (nếu cần)

```bash
sudo ufw allow 5000/tcp
sudo ufw allow 3000/tcp
sudo ufw enable
```

### 8. Truy Cập Website

- Mở trình duyệt và truy cập: `http://[IP-cua-Ubuntu-Server]:5000`
- Để chạy development mode: `http://[IP-cua-Ubuntu-Server]:3000`

## Chạy Development Mode

```bash
# Terminal 1 - Chạy backend
cd server
npm start

# Terminal 2 - Chạy frontend
cd client
npm start
```

## Chạy Production Mode

```bash
# Build frontend
cd client
npm run build

# Chạy server (serve cả frontend và backend)
cd ../server
npm start
```

## Tài Khoản Mẫu

Sau khi chạy server lần đầu, hệ thống sẽ tự động tạo dữ liệu mẫu:

**Admin:**
- Email: admin@university.edu
- Password: admin123

**Sinh viên:**
- Email: student@university.edu
- Password: student123

## Cấu Trúc Thư Mục

```
course-registration/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                # Express backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── config/          # Configuration
│   ├── server.js        # Entry point
│   └── package.json
├── README.md
└── package.json
```

## Khắc Phục Sự Cố

### Lỗi kết nối MongoDB
```bash
sudo systemctl status mongod
sudo systemctl restart mongod
```

### Lỗi port đã được sử dụng
```bash
# Tìm process đang dùng port
sudo lsof -i :5000
# Kill process
sudo kill -9 [PID]
```

### Cập nhật mã nguồn
```bash
cd ~/course-registration
# Pull updates hoặc copy files mới
cd server && npm install
cd ../client && npm install && npm run build
```

## Hỗ Trợ

Nếu gặp vấn đề, kiểm tra:
1. MongoDB đang chạy: `sudo systemctl status mongod`
2. Node.js version: `node --version` (cần >= 14.x)
3. Log của server: Xem output trong terminal
4. Firewall: Đảm bảo port 5000 được mở

## License

MIT
