const mongoose = require('mongoose');
const Course = require('./server/models/Course');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/course-registration';

// New course data - IT-related
const courseUpdates = [
  {
    code: 'IT101',
    name: 'Lập Trình Cơ Bản',
    description: 'Giới thiệu về lập trình, các khái niệm cơ bản',
    credits: 3,
    maxStudents: 40
  },
  {
    code: 'IT202',
    name: 'Công Nghệ Web',
    description: 'HTML, CSS, JavaScript, phát triển web front-end',
    credits: 3,
    maxStudents: 35
  },
  {
    code: 'IT303',
    name: 'Ứng Dụng Di Động',
    description: 'Phát triển ứng dụng cho Android và iOS',
    credits: 3,
    maxStudents: 30
  },
  {
    code: 'IT404',
    name: 'Cơ Sở Dữ Liệu',
    description: 'SQL, MongoDB, thiết kế cơ sở dữ liệu',
    credits: 3,
    maxStudents: 35
  },
  {
    code: 'IT505',
    name: 'An Ninh Mạng',
    description: 'Bảo mật hệ thống, mã hóa, kiểm thử bảo mật',
    credits: 3,
    maxStudents: 25
  }
];

async function updateCourses() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Find all courses
    const courses = await Course.find().sort({ createdAt: 1 });
    
    if (courses.length !== courseUpdates.length) {
      console.warn(`⚠️ Found ${courses.length} courses but have ${courseUpdates.length} updates`);
    }

    // Update courses
    for (let i = 0; i < Math.min(courses.length, courseUpdates.length); i++) {
      const courseId = courses[i]._id;
      const updateData = courseUpdates[i];
      
      await Course.findByIdAndUpdate(
        courseId,
        {
          code: updateData.code,
          name: updateData.name,
          description: updateData.description,
          credits: updateData.credits,
          maxStudents: updateData.maxStudents
        }
      );
      
      console.log(`✅ Updated course: ${updateData.code} - ${updateData.name}`);
    }

    console.log('\n✅ Tất cả khóa học đã được cập nhật!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateCourses();
