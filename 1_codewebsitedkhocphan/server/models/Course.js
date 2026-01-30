const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  schedule: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  maxStudents: {
    type: Number,
    required: true,
    default: 40
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  description: {
    type: String,
    default: ''
  },
  semester: {
    type: String,
    default: 'Spring 2026'
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'full'],
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for available seats
courseSchema.virtual('availableSeats').get(function() {
  return this.maxStudents - this.enrolledStudents.length;
});

// Update status based on enrollment
courseSchema.pre('save', function(next) {
  if (this.enrolledStudents.length >= this.maxStudents) {
    this.status = 'full';
  } else {
    this.status = 'open';
  }
  next();
});

// Enable virtual fields in JSON
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
