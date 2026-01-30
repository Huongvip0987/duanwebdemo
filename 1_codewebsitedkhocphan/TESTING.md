# 🧪 Hướng Dẫn Test và Demo Website

## ✅ Checklist Test Đầy Đủ

### 1. Test Đăng Ký (Registration)

**Kịch bản 1: Đăng ký thành công**
1. Truy cập trang chủ
2. Click "Đăng Ký"
3. Điền thông tin:
   - Họ tên: Trần Văn B
   - Email: tranvanb@university.edu
   - Mã SV: SV002
   - Mật khẩu: 123456
   - Xác nhận mật khẩu: 123456
4. Click "Đăng Ký"
5. ✅ Kiểm tra: Tự động đăng nhập và chuyển đến trang danh sách môn học

**Kịch bản 2: Đăng ký với email đã tồn tại**
1. Thử đăng ký với email: student@university.edu
2. ✅ Kiểm tra: Hiện thông báo lỗi "User already exists"

**Kịch bản 3: Validation**
1. Thử đăng ký với mật khẩu < 6 ký tự
2. Thử với email không đúng format
3. ✅ Kiểm tra: Hiện thông báo lỗi validation

### 2. Test Đăng Nhập (Login)

**Kịch bản 1: Đăng nhập với tài khoản sinh viên**
1. Click "Đăng Nhập"
2. Email: student@university.edu
3. Password: student123
4. ✅ Kiểm tra: Đăng nhập thành công, hiện tên user trên navbar

**Kịch bản 2: Đăng nhập với tài khoản admin**
1. Email: admin@university.edu
2. Password: admin123
3. ✅ Kiểm tra: Đăng nhập thành công, có thêm quyền admin

**Kịch bản 3: Đăng nhập sai**
1. Nhập email/password sai
2. ✅ Kiểm tra: Hiện thông báo "Invalid credentials"

### 3. Test Danh Sách Môn Học (Courses)

**Kịch bản 1: Xem danh sách**
1. Đăng nhập thành công
2. Click "Danh Sách Môn Học"
3. ✅ Kiểm tra:
   - Hiển thị 6 môn học mẫu
   - Mỗi card có đầy đủ thông tin
   - Badge hiển thị trạng thái (Còn chỗ/Đã đầy)

**Kịch bản 2: Thông tin môn học**
Kiểm tra mỗi card hiển thị:
- ✅ Mã môn (CS101, CS102, ...)
- ✅ Tên môn học
- ✅ Giảng viên
- ✅ Lịch học
- ✅ Phòng học
- ✅ Số tín chỉ
- ✅ Số chỗ còn trống
- ✅ Mô tả môn học

### 4. Test Đăng Ký Môn Học (Enrollment)

**Kịch bản 1: Đăng ký môn học thành công**
1. Đăng nhập với tài khoản mới
2. Vào "Danh Sách Môn Học"
3. Click "Đăng Ký" ở môn CS101
4. ✅ Kiểm tra:
   - Hiện thông báo "Đăng ký môn học thành công"
   - Button đổi thành "✓ Đã đăng ký" (disabled)
   - Số chỗ trống giảm đi 1

**Kịch bản 2: Đăng ký nhiều môn**
1. Đăng ký thêm CS102, CS201
2. ✅ Kiểm tra: Có thể đăng ký nhiều môn

**Kịch bản 3: Đăng ký môn đã đăng ký**
1. Thử click vào môn đã đăng ký
2. ✅ Kiểm tra: Button bị disable, không thể đăng ký lại

**Kịch bản 4: Đăng ký môn đã đầy**
1. Dùng nhiều tài khoản đăng ký cho đến khi đầy
2. Thử đăng ký với tài khoản mới
3. ✅ Kiểm tra: Hiện "Course is full"

### 5. Test Môn Đã Đăng Ký (My Courses)

**Kịch bản 1: Xem danh sách môn đã đăng ký**
1. Click "Môn Đã Đăng Ký"
2. ✅ Kiểm tra:
   - Hiển thị tất cả môn đã đăng ký
   - Hiển thị tổng số tín chỉ
   - Mỗi môn có button "Hủy Đăng Ký"

**Kịch bản 2: Hủy đăng ký môn học**
1. Click "Hủy Đăng Ký" ở một môn
2. Xác nhận hủy
3. ✅ Kiểm tra:
   - Môn học biến mất khỏi danh sách
   - Tổng tín chỉ cập nhật
   - Hiện thông báo "Hủy đăng ký thành công"
4. Quay lại "Danh Sách Môn Học"
5. ✅ Kiểm tra: Môn vừa hủy có thể đăng ký lại

**Kịch bản 3: Empty state**
1. Hủy tất cả môn học
2. ✅ Kiểm tra: Hiển thị "Chưa đăng ký môn học nào"

### 6. Test Profile (Thông Tin Cá Nhân)

**Kịch bản 1: Xem profile**
1. Click vào tên user trên navbar
2. ✅ Kiểm tra hiển thị:
   - Họ tên
   - Email
   - Mã sinh viên
   - Vai trò (Student/Admin)
   - Số môn đã đăng ký
   - Tổng tín chỉ

**Kịch bản 2: Cập nhật thông tin**
1. Click "Chỉnh Sửa"
2. Đổi tên thành "Nguyễn Văn C"
3. Click "Lưu Thay Đổi"
4. ✅ Kiểm tra:
   - Hiện "Cập nhật thông tin thành công"
   - Tên trên navbar cập nhật
   - Profile hiển thị tên mới

**Kịch bản 3: Cancel edit**
1. Click "Chỉnh Sửa"
2. Đổi thông tin
3. Click "Hủy"
4. ✅ Kiểm tra: Thông tin không thay đổi

### 7. Test Navigation và UI

**Kịch bản 1: Navigation**
1. ✅ Click logo → về trang chủ
2. ✅ Menu links có active state
3. ✅ Responsive trên mobile

**Kịch bản 2: Authentication flow**
1. ✅ Chưa login → Không vào được trang Courses, MyCourses, Profile
2. ✅ Đã login → Không vào được trang Login, Register
3. ✅ Logout → Quay về trang chủ

### 8. Test Đăng Xuất (Logout)

1. Đăng nhập
2. Click "Đăng Xuất"
3. ✅ Kiểm tra:
   - Quay về trang chủ
   - Token bị xóa
   - Không vào được trang protected

### 9. Test Admin Features (Nếu có thời gian)

**Login as Admin:**
- Email: admin@university.edu
- Password: admin123

✅ Admin có thể:
- Xem tất cả môn học
- Đăng ký môn học như sinh viên
- (Có thể thêm CRUD courses nếu cần)

### 10. Test Performance và UX

**Loading States:**
1. ✅ Hiển thị spinner khi loading
2. ✅ Button disabled khi đang xử lý
3. ✅ Thông báo lỗi/thành công rõ ràng

**Error Handling:**
1. ✅ Network error → Hiện thông báo lỗi
2. ✅ Invalid token → Tự động logout
3. ✅ Validation errors → Hiện dưới input

**UI/UX:**
1. ✅ Màu sắc hài hòa
2. ✅ Button có hover effect
3. ✅ Card có shadow và hover effect
4. ✅ Form validation real-time
5. ✅ Responsive trên mobile

## 📊 Kịch Bản Demo Hoàn Chỉnh

### Phần 1: Giới Thiệu (2 phút)
```
"Xin chào, đây là hệ thống đăng ký học phần trực tuyến.
Website giúp sinh viên dễ dàng xem và đăng ký các môn học."
```

1. Mở trang chủ
2. Giới thiệu giao diện
3. Giới thiệu các tính năng

### Phần 2: Đăng Ký Tài Khoản (3 phút)

1. **Click "Đăng Ký"**
2. **Điền form:**
   - Họ tên: Demo Student
   - Email: demo@university.edu
   - Mã SV: DEMO001
   - Password: demo123
3. **Submit** → Tự động đăng nhập

### Phần 3: Xem và Đăng Ký Môn Học (5 phút)

1. **Click "Danh Sách Môn Học"**
2. **Giới thiệu 1 môn học:**
   - Mã môn: CS101
   - Tên: Lập Trình Căn Bản
   - Giảng viên, lịch học, phòng
   - Số tín chỉ, số chỗ
3. **Đăng ký CS101** → Thông báo thành công
4. **Đăng ký thêm CS102, CS201**
5. **Chỉ các thông tin cập nhật:**
   - Button "Đã đăng ký"
   - Số chỗ giảm

### Phần 4: Quản Lý Môn Đã Đăng Ký (3 phút)

1. **Click "Môn Đã Đăng Ký"**
2. **Hiển thị:**
   - 3 môn đã đăng ký
   - Tổng 10 tín chỉ
3. **Hủy đăng ký CS201**
4. **Xác nhận** → Thông báo thành công
5. **Kiểm tra:** Còn 2 môn, 6 tín chỉ

### Phần 5: Quản Lý Profile (2 phút)

1. **Click tên user trên navbar**
2. **Hiển thị thông tin:**
   - Tên, email, mã SV
   - Thống kê: 2 môn, 6 tín chỉ
3. **Chỉnh sửa tên**
4. **Lưu** → Cập nhật thành công

### Phần 6: Demo Admin (2 phút)

1. **Logout**
2. **Login as Admin:**
   - Email: admin@university.edu
   - Password: admin123
3. **Giới thiệu:** Admin có thể quản lý toàn bộ hệ thống

### Phần 7: Kết Thúc (1 phút)
```
"Hệ thống đã hoạt động tốt trên Ubuntu Server,
đáp ứng đầy đủ yêu cầu về đăng nhập, đăng ký,
quản lý môn học và giao diện đẹp, dễ sử dụng."
```

## 🎬 Script Demo Chi Tiết

```markdown
[TRANG CHỦ]
"Đây là trang chủ của hệ thống đăng ký học phần."

[CLICK ĐĂNG KÝ]
"Để bắt đầu, sinh viên cần đăng ký tài khoản."

[ĐIỀN FORM]
"Nhập thông tin cá nhân: họ tên, email, mã sinh viên, mật khẩu."

[SUBMIT]
"Sau khi đăng ký, hệ thống tự động đăng nhập và chuyển đến trang chính."

[DANH SÁCH MÔN HỌC]
"Đây là danh sách các môn học có sẵn."
"Mỗi môn hiển thị đầy đủ thông tin: mã môn, tên, giảng viên, 
lịch học, phòng, tín chỉ, và số chỗ còn trống."

[ĐĂNG KÝ MÔN]
"Click Đăng Ký để đăng ký môn học."
"Hệ thống hiển thị thông báo thành công."
"Button đổi thành 'Đã đăng ký' và số chỗ cập nhật."

[MÔN ĐÃ ĐĂNG KÝ]
"Ở đây sinh viên xem được tất cả môn đã đăng ký."
"Hiển thị tổng số tín chỉ đã đăng ký."
"Có thể hủy đăng ký nếu cần."

[PROFILE]
"Sinh viên có thể xem và chỉnh sửa thông tin cá nhân."
"Có thống kê số môn học và tổng tín chỉ."

[KẾT THÚC]
"Hệ thống đã triển khai thành công trên Ubuntu Server
với đầy đủ chức năng và giao diện thân thiện."
```

## 🐛 Test Cases cho Backend API

### Test với Postman/cURL:

```bash
# 1. Health Check
curl http://localhost:5000/api/health

# 2. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@university.edu",
    "password": "test123",
    "studentId": "TEST001"
  }'

# 3. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@university.edu",
    "password": "test123"
  }'

# 4. Get Courses
curl http://localhost:5000/api/courses

# 5. Enroll (cần token)
curl -X POST http://localhost:5000/api/courses/{courseId}/enroll \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ✅ Acceptance Criteria

Hệ thống pass test khi:
- ✅ Đăng ký tài khoản mới thành công
- ✅ Đăng nhập với tài khoản hợp lệ
- ✅ Xem được danh sách môn học
- ✅ Đăng ký môn học thành công
- ✅ Hủy đăng ký môn học thành công
- ✅ Cập nhật profile thành công
- ✅ Không đăng ký được môn đã đăng ký
- ✅ Không đăng ký được môn đã đầy
- ✅ Logout hoạt động đúng
- ✅ Protected routes được bảo vệ
- ✅ Giao diện đẹp và responsive
- ✅ Có validation và error handling
- ✅ Performance tốt (load < 2s)

---

**Chúc test thành công! 🎉**
