# Database Configuration

## Windows (Development)
Sử dụng MongoDB Atlas:
1. Copy `.env.example` thành `.env`
2. Thay `MONGODB_URI` bằng connection string từ MongoDB Atlas
3. Format: `mongodb+srv://username:password@cluster.xxx.mongodb.net/course_registration`

## Ubuntu (Production)
Sử dụng MongoDB Local:
1. Copy `.env.example` thành `.env`
2. Giữ nguyên: `MONGODB_URI=mongodb://localhost:27017/course_registration`
3. Đảm bảo MongoDB đang chạy: `sudo docker ps`

## Lưu ý
- File `.env` không được push lên Git
- Mỗi môi trường có `.env` riêng
- Dữ liệu Windows và Ubuntu độc lập
