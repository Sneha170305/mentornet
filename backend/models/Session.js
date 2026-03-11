const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentorName: String,
  userName: String,
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, enum: [15, 30, 60], required: true },
  topic: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'confirmed', 'live', 'completed', 'cancelled'], default: 'confirmed' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  amount: { type: Number, default: 0 },
  meetingLink: { type: String, default: '' },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
