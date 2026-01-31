# 📱 Truy Cập Từ Điện Thoại

## Địa Chỉ Truy Cập

**Trên Windows (máy local):**
- Frontend: http://192.168.1.6:3000
- Backend API: http://192.168.1.6:5000

**Trên điện thoại (cùng WiFi):**
- Mở trình duyệt và truy cập: **http://192.168.1.6:3000**

## Yêu Cầu
- ✅ Điện thoại và máy tính phải cùng mạng WiFi
- ✅ Windows Firewall cho phép port 3000 và 5000
- ✅ Backend đã enable CORS cho tất cả origins

## Tài Khoản Test

**Admin:**
- Email: `admin@example.com`
- Password: `Admin@2026`

**Tạo tài khoản sinh viên mới:**
- Vào trang Register để tạo tài khoản
- Admin có thể bật/tắt đăng ký từ Admin Dashboard

## Test Nhiều Tab/Window

### Cách 1: Chrome Multiple Profiles
1. Mở Chrome → Click avatar → "Add" → Tạo profile mới
2. Mỗi profile có session riêng biệt
3. Đăng nhập tài khoản khác nhau ở mỗi profile

### Cách 2: Incognito Mode
1. Tab thường: Đăng nhập Admin
2. Ctrl+Shift+N → Tab ẩn danh: Đăng nhập Student
3. Mỗi window có session riêng

### Cách 3: Nhiều Trình Duyệt
- Chrome: Admin account
- Firefox: Student account 1
- Edge: Student account 2

### Cách 4: Phone + PC
- PC: Admin
- Phone: Student

## Kiểm Tra Firewall Windows

Nếu phone không kết nối được, chạy PowerShell với quyền Admin:

```powershell
# Cho phép port 3000 (React)
New-NetFirewallRule -DisplayName "React Dev Server" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# Cho phép port 5000 (Node.js)
New-NetFirewallRule -DisplayName "Node.js Backend" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
```

## Test Online Users Feature

1. Đăng nhập Admin → vào Admin Dashboard
2. Mở tab/phone khác → Đăng nhập Student
3. Quay lại Admin Dashboard → Refresh → Thấy "Đang Online" tăng lên
4. Số online = số user có hoạt động trong 5 phút gần đây

## Test Registration Toggle

1. Admin Dashboard → Click nút "Đăng Ký: BẬT"
2. Nút chuyển màu đỏ "Đăng Ký: TẮT"
3. Thử register tài khoản mới → Sẽ bị từ chối
4. Click lại nút → Chuyển xanh "Đăng Ký: BẬT"
5. Register lại → Thành công
