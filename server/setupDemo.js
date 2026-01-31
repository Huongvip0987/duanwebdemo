require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  console.log('\n=== KHỞI TẠO HỆ THỐNG ===\n');
  
  try {
    // Create admin
    const hashedPassword = await bcrypt.hash('Admin@2026', 10);
    
    // Check if admin exists first
    let admin = await User.findOne({ email: 'admin@example.com' });
    
    if (admin) {
      console.log('✅ Admin đã tồn tại');
      console.log('   Email: admin@example.com\n');
    } else {
      // Create new admin with different studentId
      admin = await User.create({
        name: 'Administrator',
        email: 'admin@example.com',
        password: hashedPassword,
        studentId: 'ADMIN002',
        role: 'admin'
      });
      
      console.log('✅ Tạo tài khoản admin thành công!');
      console.log('   Email: admin@example.com');
      console.log('   Password: Admin@2026');
      console.log('   MSSV: ADMIN002\n');
    }
    
    // Create sample courses
    const courses = [
      {
        code: 'CS101',
        name: 'Lập Trình Căn Bản',
        instructor: 'TS. Nguyễn Văn A',
        credits: 3,
        schedule: 'Thứ 2, 7:30 - 10:00',
        room: 'A101',
        maxStudents: 50,
        description: 'Học các khái niệm cơ bản về lập trình với Python'
      },
      {
        code: 'CS102',
        name: 'Cơ Sở Dữ Liệu',
        instructor: 'PGS. Trần Thị B',
        credits: 4,
        schedule: 'Thứ 3, 13:30 - 16:30',
        room: 'B203',
        maxStudents: 45,
        description: 'Thiết kế và quản lý cơ sở dữ liệu SQL và NoSQL'
      },
      {
        code: 'CS201',
        name: 'Cấu Trúc Dữ Liệu',
        instructor: 'TS. Lê Văn C',
        credits: 4,
        schedule: 'Thứ 4, 9:00 - 12:00',
        room: 'C305',
        maxStudents: 40,
        description: 'Nghiên cứu các cấu trúc dữ liệu và giải thuật'
      },
      {
        code: 'CS202',
        name: 'Lập Trình Web',
        instructor: 'ThS. Phạm Thị D',
        credits: 3,
        schedule: 'Thứ 5, 14:00 - 17:00',
        room: 'D401',
        maxStudents: 40,
        description: 'Phát triển ứng dụng web với React và Node.js'
      },
      {
        code: 'CS301',
        name: 'Trí Tuệ Nhân Tạo',
        instructor: 'PGS. Hoàng Văn E',
        credits: 4,
        schedule: 'Thứ 6, 7:30 - 10:30',
        room: 'E102',
        maxStudents: 30,
        description: 'Machine Learning và Deep Learning cơ bản'
      }
    ];
    
    for (const courseData of courses) {
      await Course.findOneAndUpdate(
        { code: courseData.code },
        courseData,
        { upsert: true, new: true }
      );
    }
    
    console.log('✅ Tạo 5 môn học mẫu thành công!\n');
    console.log('=== HỆ THỐNG SẴN SÀNG ===');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
