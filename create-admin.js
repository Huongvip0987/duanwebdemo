const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://admin:admin123@localhost:27017/course-registration?authSource=admin');
    
    // Xóa admin cũ nếu có
    await User.deleteOne({ email: 'admin@example.com' });
    
    // Tạo admin mới
    const admin = new User({
      name: 'Quản Trị Viên',
      email: 'admin@example.com',
      password: 'Admin@123', // Sẽ được hash tự động
      studentId: 'ADMIN001',
      role: 'admin'
    });
    
    await admin.save();
    console.log('✅ Admin account created!');
    console.log('Email: admin@example.com');
    console.log('Password: Admin@123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();
