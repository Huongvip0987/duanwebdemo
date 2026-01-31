require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promisify readline question
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  console.log('\n=== TẠO TÀI KHOẢN ADMIN ===\n');
  
  try {
    // Get admin information
    const name = await question('Tên admin: ');
    const email = await question('Email: ');
    const password = await question('Mật khẩu: ');
    const studentId = await question('Mã admin (ví dụ: ADMIN001): ');
    
    // Check if admin with this email already exists
    const existingAdmin = await User.findOne({ email });
    
    if (existingAdmin) {
      console.log('\n⚠️  Email này đã tồn tại!');
      const overwrite = await question('Bạn có muốn cập nhật thông tin? (y/n): ');
      
      if (overwrite.toLowerCase() === 'y') {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
          { email },
          {
            name,
            password: hashedPassword,
            studentId,
            role: 'admin'
          }
        );
        console.log('\n✅ Đã cập nhật tài khoản admin!');
      } else {
        console.log('\n❌ Đã hủy!');
      }
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await User.create({
        name,
        email,
        password: hashedPassword,
        studentId,
        role: 'admin'
      });
      
      console.log('\n✅ Tạo tài khoản admin thành công!');
    }
    
    console.log('\n=== THÔNG TIN ĐĂNG NHẬP ===');
    console.log(`Email: ${email}`);
    console.log(`Mật khẩu: ${password}`);
    console.log('⚠️  Hãy lưu lại thông tin này!\n');
    
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Lỗi:', error);
    rl.close();
    process.exit(1);
  }
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  rl.close();
  process.exit(1);
});

// Handle Ctrl+C
rl.on('SIGINT', () => {
  console.log('\n\n❌ Đã hủy!');
  rl.close();
  process.exit(1);
});
