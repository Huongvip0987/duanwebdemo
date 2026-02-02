const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Settings = require('../models/Settings');
const bcrypt = require('bcryptjs');
const { authMiddleware } = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Get all users with enrollment details
router.get('/users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .lean()
      .sort({ createdAt: -1 });
    
    if (!users) {
      return res.json([]);
    }
    
    // Manually populate enrolledCourses to avoid errors
    const Course = require('../models/Course');
    for (let user of users) {
      // Initialize enrolledCourses if it doesn't exist
      if (!user.enrolledCourses) {
        user.enrolledCourses = [];
      }
      
      if (Array.isArray(user.enrolledCourses) && user.enrolledCourses.length > 0) {
        try {
          user.enrolledCourses = await Course.find({
            _id: { $in: user.enrolledCourses }
          }).select('code name credits').lean();
        } catch (err) {
          console.error('Error populating courses for user:', user.email, err);
          user.enrolledCourses = [];
        }
      } else {
        user.enrolledCourses = [];
      }
    }
    
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
  }
});

// Get dashboard statistics
router.get('/stats', authMiddleware, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await User.aggregate([
      { $match: { role: 'student' } },
      { $project: { enrollmentCount: { $size: '$enrolledCourses' } } },
      { $group: { _id: null, total: { $sum: '$enrollmentCount' } } }
    ]);
    
    // Get online users (active in last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const onlineUsers = await User.countDocuments({
      role: 'student',
      lastActive: { $gte: fiveMinutesAgo }
    });
    
    // Get total credits for all students
    const allUsers = await User.find({ role: 'student' }).populate('enrolledCourses');
    const totalCreditsData = allUsers.reduce((sum, user) => {
      const credits = user.enrolledCourses.reduce((c, course) => c + (course.credits || 0), 0);
      return sum + credits;
    }, 0);
    
    // Get credits per user for bar chart
    const creditsPerUser = allUsers.map(user => ({
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      credits: user.enrolledCourses.reduce((c, course) => c + (course.credits || 0), 0),
      enrollments: user.enrolledCourses.length
    })).sort((a, b) => b.credits - a.credits);
    
    // Get course enrollment distribution for pie chart
    const courses = await Course.find().select('code name enrolledStudents credits');
    const totalEnrollmentsCount = totalEnrollments[0]?.total || 0;
    
    const courseDistribution = courses.map(c => ({
      code: c.code,
      name: c.name,
      count: c.enrolledStudents.length,
      percentage: totalEnrollmentsCount > 0 
        ? ((c.enrolledStudents.length / totalEnrollmentsCount) * 100).toFixed(1)
        : '0.0'
    })).sort((a, b) => b.count - a.count);
    
    // Get recent registrations (users created in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({ 
      role: 'student',
      createdAt: { $gte: sevenDaysAgo }
    });
    
    // Get registration enabled status
    const registrationSetting = await Settings.findOne({ key: 'registrationEnabled' });
    const registrationEnabled = registrationSetting?.value !== false;
    
    res.json({
      totalUsers,
      totalCourses,
      totalEnrollments: totalEnrollments[0]?.total || 0,
      onlineUsers,
      totalCredits: totalCreditsData,
      creditsPerUser,
      courseDistribution,
      recentUsers,
      registrationEnabled
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }
    
    // Remove user from enrolled courses
    await Course.updateMany(
      { enrolledStudents: user._id },
      { $pull: { enrolledStudents: user._id } }
    );
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset user password (admin only)
router.post('/users/:id/reset-password', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới tối thiểu 6 ký tự' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create/Update course (admin only)
router.post('/courses', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { code, name, instructor, credits, schedule, room, maxStudents, description } = req.body;
    
    const course = await Course.create({
      code,
      name,
      instructor,
      credits,
      schedule,
      room,
      maxStudents,
      description
    });
    
    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete course (admin only)
router.delete('/courses/:id', authMiddleware, isAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Remove course from users' enrolledCourses
    await User.updateMany(
      { enrolledCourses: course._id },
      { $pull: { enrolledCourses: course._id } }
    );
    
    await Course.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle registration (admin only)
router.post('/toggle-registration', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { enabled } = req.body;
    
    await Settings.findOneAndUpdate(
      { key: 'registrationEnabled' },
      { key: 'registrationEnabled', value: enabled, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    
    res.json({ 
      message: enabled ? 'Đã bật đăng ký' : 'Đã tắt đăng ký',
      registrationEnabled: enabled
    });
  } catch (error) {
    console.error('Toggle registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard statistics
router.get('/stats', authMiddleware, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const studentCount = await User.countDocuments({ role: 'student' });
    const totalCourses = await Course.countDocuments();
    const registrationSetting = await Settings.findOne({ key: 'registrationEnabled' }).lean();
    const registrationEnabled = registrationSetting?.value !== false;
    
    // Get enrollment statistics
    const users = await User.find().select('enrolledCourses');
    const courseEnrollmentMap = {};
    
    let totalEnrollments = 0;
    for (let user of users) {
      if (Array.isArray(user.enrolledCourses)) {
        for (let courseId of user.enrolledCourses) {
          totalEnrollments++;
          const courseIdStr = courseId.toString();
          courseEnrollmentMap[courseIdStr] = (courseEnrollmentMap[courseIdStr] || 0) + 1;
        }
      }
    }
    
    // Get course details with enrollment count
    const courses = await Course.find().select('code name maxStudents');
    const courseStats = courses.map(course => ({
      id: course._id,
      code: course.code,
      name: course.name,
      enrolled: courseEnrollmentMap[course._id.toString()] || 0,
      maxStudents: course.maxStudents,
      percentage: course.maxStudents > 0 ? Math.round((courseEnrollmentMap[course._id.toString()] || 0) / course.maxStudents * 100) : 0
    }));
    
    res.json({
      totalUsers,
      adminCount,
      studentCount,
      totalCourses,
      totalEnrollments,
      courseStats,
      registrationEnabled,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get active users (logged in recently - last 30 minutes)
router.get('/active-users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const activeUsers = await User.find({
      lastActive: { $gte: thirtyMinutesAgo }
    }).select('name email role lastActive enrolledCourses');
    
    res.json(activeUsers);
  } catch (error) {
    console.error('Active users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
