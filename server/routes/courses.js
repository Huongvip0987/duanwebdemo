const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const Settings = require('../models/Settings');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('enrolledStudents', 'name studentId')
      .sort({ code: 1 });
    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('enrolledStudents', 'name studentId email');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/:id/enroll', authMiddleware, async (req, res) => {
  try {
    const registrationSetting = await Settings.findOne({ key: 'registrationEnabled' });
    const registrationEnabled = registrationSetting?.value !== false;
    if (!registrationEnabled) {
      return res.status(403).json({ message: 'Đăng ký hiện đang bị khóa' });
    }

    const course = await Course.findById(req.params.id);
    const user = await User.findById(req.user._id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if already enrolled
    if (user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    // Check if course is full
    if (course.enrolledStudents.length >= course.maxStudents) {
      return res.status(400).json({ message: 'Course is full' });
    }
    
    // Enroll student
    course.enrolledStudents.push(user._id);
    user.enrolledCourses.push(course._id);
    
    await course.save();
    await user.save();
    
    const updatedCourse = await Course.findById(course._id)
      .populate('enrolledStudents', 'name studentId');
    
    res.json({
      message: 'Successfully enrolled in course',
      course: updatedCourse
    });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/courses/:id/unenroll
// @desc    Unenroll from a course
// @access  Private
router.delete('/:id/unenroll', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const user = await User.findById(req.user._id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if enrolled
    if (!user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({ message: 'Not enrolled in this course' });
    }
    
    // Unenroll student
    course.enrolledStudents = course.enrolledStudents.filter(
      id => id.toString() !== user._id.toString()
    );
    user.enrolledCourses = user.enrolledCourses.filter(
      id => id.toString() !== course._id.toString()
    );
    
    await course.save();
    await user.save();
    
    const updatedCourse = await Course.findById(course._id)
      .populate('enrolledStudents', 'name studentId');
    
    res.json({
      message: 'Successfully unenrolled from course',
      course: updatedCourse
    });
  } catch (error) {
    console.error('Unenroll error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/courses
// @desc    Create a course (admin only)
// @access  Private/Admin
router.post('/', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update a course (admin only)
// @access  Private/Admin
router.put('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json({
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course (admin only)
// @access  Private/Admin
router.delete('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Remove course from all enrolled users
    await User.updateMany(
      { enrolledCourses: course._id },
      { $pull: { enrolledCourses: course._id } }
    );
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
