require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Course = require('./models/Course');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  try {
    // Delete demo student account
    const demoUser = await User.findOneAndDelete({ email: 'student@university.edu' });
    
    if (demoUser) {
      // Remove from all courses
      await Course.updateMany(
        { enrolledStudents: demoUser._id },
        { $pull: { enrolledStudents: demoUser._id } }
      );
      console.log('✅ Deleted demo student account');
    } else {
      console.log('⚠️  Demo student account not found');
    }
    
    // Delete all sample courses
    const result = await Course.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} sample courses`);
    
    console.log('✅ Cleanup completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
