const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
}, { timestamps: true });

const mentorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: { type: String, default: '' },
  expertise: { type: String, required: true },
  bio: { type: String, required: true },
  skills: [String],
  experience: { type: Number, default: 0 }, // years
  company: { type: String, default: '' },
  title: { type: String, default: '' },
  hourlyRate: { type: Number, default: 50 },
  rating: { type: Number, default: 4.5 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
  availableSessions: [
    {
      date: String,
      time: String,
      duration: Number,
      booked: { type: Boolean, default: false },
    },
  ],
  totalSessions: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Mentor', mentorSchema);
