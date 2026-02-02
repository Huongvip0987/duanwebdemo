const mongoose = require('mongoose');
const Course = require('./models/Course');
require('dotenv').config();

const createCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://admin:admin123@mongodb:27017/course-registration?authSource=admin');
    
    // Xóa courses cũ
    await Course.deleteMany({});
    
    // Tạo 5 khóa học tinh học
    const courses = [
      {
        code: 'TH101',
        name: 'Nhập Môn Tinh Học',
        instructor: 'TS. Nguyễn Văn A',
        credits: 3,
        schedule: 'Thứ 2, 7:30 - 9:30',
        room: 'A101',
        maxStudents: 40,
        description: 'Giới thiệu các khái niệm cơ bản về tinh học, khảo sát tinh tế và ứng dụng'
      },
      {
        code: 'TH202',
        name: 'Tinh Học Hiện Đại',
        instructor: 'PGS. Trần Thị B',
        credits: 4,
        schedule: 'Thứ 3, 13:30 - 15:30',
        room: 'B203',
        maxStudents: 35,
        description: 'Nghiên cứu các phương pháp tinh học hiện đại, kỹ thuật tối ưu hóa'
      },
      {
        code: 'TH303',
        name: 'Tinh Học Ứng Dụng',
        instructor: 'TS. Lê Văn C',
        credits: 3,
        schedule: 'Thứ 4, 9:30 - 11:30',
        room: 'C305',
        maxStudents: 30,
        description: 'Ứng dụng tinh học trong công nghiệp, kinh tế, quản lý dự án'
      },
      {
        code: 'TH404',
        name: 'Thống Kê Trong Tinh Học',
        instructor: 'ThS. Phạm Thị D',
        credits: 3,
        schedule: 'Thứ 5, 15:30 - 17:30',
        room: 'D401',
        maxStudents: 35,
        description: 'Phân tích dữ liệu, mô hình thống kê trong tinh học, xác suất'
      },
      {
        code: 'TH505',
        name: 'Tinh Học Nâng Cao',
        instructor: 'PGS. Vũ Văn E',
        credits: 4,
        schedule: 'Thứ 6, 7:30 - 9:30',
        room: 'E102',
        maxStudents: 25,
        description: 'Các chủ đề nâng cao trong tinh học, nghiên cứu độc lập, seminar'
      }
    ];
    
    await Course.insertMany(courses);
    console.log('✅ 5 khóa học tinh học đã được tạo!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createCourses();
