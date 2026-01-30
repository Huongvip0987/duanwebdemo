# Hướng Dẫn Chuyển Code Từ Windows Sang Ubuntu Server

## Phương Pháp 1: Sử dụng SCP (Secure Copy)

### Từ Windows PowerShell:

```powershell
# Cú pháp: scp -r <đường-dẫn-source> <username>@<ip-ubuntu>:<đường-dẫn-đích>

# Ví dụ:
scp -r G:\1_codewebsitedkhocphan username@192.168.1.100:~/
```

**Giải thích:**
- `-r`: Copy toàn bộ thư mục
- `username`: Tên user Ubuntu của bạn
- `192.168.1.100`: Địa chỉ IP của máy ảo Ubuntu (dùng `ip addr` để xem)
- `~/`: Thư mục home trên Ubuntu

## Phương Pháp 2: Sử dụng WinSCP (GUI Tool)

1. Tải WinSCP: https://winscp.net/
2. Kết nối đến Ubuntu Server:
   - Host name: IP của Ubuntu Server
   - User name: username Ubuntu
   - Password: password Ubuntu
3. Kéo thả folder từ Windows sang Ubuntu

## Phương Pháp 3: Shared Folder trong VMware

### Bước 1: Cài đặt VMware Tools trên Ubuntu

```bash
sudo apt update
sudo apt install open-vm-tools open-vm-tools-desktop
```

### Bước 2: Tạo Shared Folder trong VMware

1. Trong VMware, chọn VM > Settings
2. Chọn Options > Shared Folders
3. Chọn "Always enabled"
4. Add folder từ Windows (G:\1_codewebsitedkhocphan)
5. Đặt tên: course-registration

### Bước 3: Mount Shared Folder trên Ubuntu

```bash
# Tạo thư mục mount point
sudo mkdir -p /mnt/hgfs

# Mount shared folder
sudo vmhgfs-fuse .host:/ /mnt/hgfs -o allow_other

# Copy vào home directory
cp -r /mnt/hgfs/course-registration ~/course-registration
```

## Phương Pháp 4: Sử dụng Git (Khuyến nghị)

### Từ Windows:

```powershell
cd G:\1_codewebsitedkhocphan
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-git-repo-url>
git push -u origin main
```

### Từ Ubuntu:

```bash
cd ~
git clone <your-git-repo-url> course-registration
cd course-registration
```

## Phương Pháp 5: Tạo Archive và Transfer

### Từ Windows PowerShell:

```powershell
# Tạo zip file
Compress-Archive -Path "G:\1_codewebsitedkhocphan\*" -DestinationPath "C:\course-registration.zip"

# Copy qua Ubuntu
scp C:\course-registration.zip username@192.168.1.100:~/
```

### Từ Ubuntu:

```bash
# Giải nén
unzip ~/course-registration.zip -d ~/course-registration
```

## Sau Khi Copy Code

### 1. Di chuyển vào thư mục project

```bash
cd ~/course-registration
```

### 2. Cấp quyền thực thi cho scripts

```bash
chmod +x setup.sh
chmod +x start.sh
chmod +x start-dev.sh
```

### 3. Chạy script setup

```bash
./setup.sh
```

### 4. Cấu hình môi trường

```bash
cd server
nano .env
```

Cập nhật nếu cần:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/course_registration
JWT_SECRET=your_random_secret_key_here
NODE_ENV=production
```

### 5. Khởi động ứng dụng

**Production mode:**
```bash
cd ~/course-registration
./start.sh
```

**Development mode:**
```bash
cd ~/course-registration
./start-dev.sh
```

## Kiểm Tra IP Ubuntu Server

```bash
# Xem IP address
ip addr show

# Hoặc
hostname -I
```

## Mở Port Firewall (Nếu Cần)

```bash
# Cho phép port 5000 (backend)
sudo ufw allow 5000/tcp

# Cho phép port 3000 (frontend dev)
sudo ufw allow 3000/tcp

# Kích hoạt firewall
sudo ufw enable

# Kiểm tra status
sudo ufw status
```

## Truy Cập Website

Từ Windows, mở trình duyệt và truy cập:
- Production: `http://<ip-ubuntu-server>:5000`
- Development: `http://<ip-ubuntu-server>:3000`

## Khắc Phục Sự Cố

### Lỗi: Permission denied

```bash
# Cấp quyền cho thư mục
sudo chown -R $USER:$USER ~/course-registration
chmod -R 755 ~/course-registration
```

### Lỗi: MongoDB connection failed

```bash
# Kiểm tra MongoDB
sudo systemctl status mongod

# Khởi động MongoDB
sudo systemctl start mongod

# Enable auto-start
sudo systemctl enable mongod
```

### Lỗi: Port already in use

```bash
# Tìm process đang dùng port
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

### Không thể kết nối từ Windows

```bash
# Kiểm tra xem server có đang chạy không
ps aux | grep node

# Kiểm tra firewall
sudo ufw status

# Kiểm tra network trong VMware
# Đảm bảo VMware Network Adapter là "Bridged" hoặc "NAT"
```

## Tips

1. **Sử dụng tmux hoặc screen** để chạy server trong background:
   ```bash
   # Cài đặt tmux
   sudo apt install tmux
   
   # Tạo session
   tmux new -s courseapp
   
   # Chạy server
   ./start.sh
   
   # Detach: Ctrl+B, sau đó nhấn D
   # Attach lại: tmux attach -t courseapp
   ```

2. **Tạo systemd service** để auto-start:
   ```bash
   sudo nano /etc/systemd/system/course-registration.service
   ```
   
   Thêm nội dung:
   ```ini
   [Unit]
   Description=Course Registration System
   After=network.target mongod.service
   
   [Service]
   Type=simple
   User=your-username
   WorkingDirectory=/home/your-username/course-registration/server
   ExecStart=/usr/bin/node server.js
   Restart=on-failure
   Environment=NODE_ENV=production
   
   [Install]
   WantedBy=multi-user.target
   ```
   
   Kích hoạt:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable course-registration
   sudo systemctl start course-registration
   ```
