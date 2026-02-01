const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
let dbReady = false;
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/course-registration';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  // Initialize Settings if not exists
  try {
    const Settings = require('./models/Settings');
    const registrationSetting = await Settings.findOne({ key: 'registrationEnabled' });
    if (!registrationSetting) {
      await Settings.create({ key: 'registrationEnabled', value: true });
      console.log('✅ Initialized registration settings');
    }
    dbReady = true;
  } catch (error) {
    console.warn('⚠️ Settings initialization:', error.message);
    dbReady = true;
  }
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Import routes (after database connection starts)
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Error stack:', err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  console.error('Stack:', err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

// Initialize sample data
async function initializeData() {
  const User = require('./models/User');
  const Course = require('./models/Course');
  
  try {
    // Check if data already exists
    const userCount = await User.countDocuments();
    const courseCount = await Course.countDocuments();
    
    if (userCount === 0) {
      // Create sample users
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const hashedPassword2 = await bcrypt.hash('student123', 10);
      
      await User.create([
        {
          name: 'Administrator',
          email: 'admin@university.edu',
          password: hashedPassword,
          studentId: 'ADMIN001',
          role: 'admin'
        },
        {
          name: 'Nguyen Van A',
          email: 'student@university.edu',
          password: hashedPassword2,
          studentId: 'SV001',
          role: 'student'
        }
      ]);
      console.log('✅ Sample users created');
    }
    
    if (courseCount === 0) {
      // Create sample courses
      await Course.create([
        {
          code: 'CS101',
          name: 'Lập Trình Căn Bản',
          instructor: 'TS. Trần Văn B',
          credits: 3,
          schedule: 'Thứ 2, 7:30 - 9:30',
          room: 'A101',
          maxStudents: 40,
          description: 'Học các khái niệm cơ bản về lập trình, cấu trúc dữ liệu và giải thuật'
        },
        {
          code: 'CS102',
          name: 'Cơ Sở Dữ Liệu',
          instructor: 'PGS. Lê Thị C',
          credits: 3,
          schedule: 'Thứ 3, 13:30 - 15:30',
          room: 'B203',
          maxStudents: 35,
          description: 'Thiết kế và quản lý cơ sở dữ liệu quan hệ, SQL và NoSQL'
        },
        {
          code: 'CS201',
          name: 'Cấu Trúc Dữ Liệu và Giải Thuật',
          instructor: 'TS. Phạm Văn D',
          credits: 4,
          schedule: 'Thứ 4, 9:30 - 11:30',
          room: 'C305',
          maxStudents: 30,
          description: 'Nghiên cứu các cấu trúc dữ liệu và giải thuật nâng cao'
        },
        {
          code: 'CS202',
          name: 'Lập Trình Web',
          instructor: 'ThS. Hoàng Thị E',
          credits: 3,
          schedule: 'Thứ 5, 15:30 - 17:30',
          room: 'D401',
          maxStudents: 35,
          description: 'Phát triển ứng dụng web với HTML, CSS, JavaScript và frameworks hiện đại'
        },
        {
          code: 'CS301',
          name: 'Mạng Máy Tính',
          instructor: 'PGS. Vũ Văn F',
          credits: 3,
          schedule: 'Thứ 6, 7:30 - 9:30',
          room: 'E102',
          maxStudents: 40,
          description: 'Các khái niệm về mạng, giao thức TCP/IP, bảo mật mạng'
        },
        {
          code: 'CS302',
          name: 'Trí Tuệ Nhân Tạo',
          instructor: 'TS. Đỗ Thị G',
          credits: 4,
          schedule: 'Thứ 2, 13:30 - 16:00',
          room: 'F201',
          maxStudents: 25,
          description: 'Machine Learning, Deep Learning và các ứng dụng AI'
        }
      ]);
      console.log('✅ Sample courses created');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}

// Start server
try {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
  
  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(async () => {
      try {
        await mongoose.connection.close();
      } catch (err) {
        console.error('Error closing MongoDB:', err);
      }
      process.exit(0);
    });
  });
  
  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(async () => {
      try {
        await mongoose.connection.close();
      } catch (err) {
        console.error('Error closing MongoDB:', err);
      }
      process.exit(0);
    });
  });
  
} catch (error) {
  console.error('Fatal error starting server:', error);
  process.exit(1);
}

module.exports = app;
