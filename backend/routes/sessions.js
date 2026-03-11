const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Mentor = require('../models/Mentor');
const { protect } = require('../middleware/auth');

// POST /api/sessions/book
router.post('/book', protect, async (req, res) => {
  const { mentorId, date, time, duration, topic } = req.body;
  try {
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });

    const ratePerMin = mentor.hourlyRate / 60;
    const amount = Math.round(ratePerMin * duration);

    const session = await Session.create({
      mentor: mentorId,
      user: req.user._id,
      mentorName: mentor.name,
      userName: req.user.name,
      date,
      time,
      duration,
      topic: topic || '',
      amount,
      paymentStatus: 'pending',
      status: 'confirmed',
      meetingLink: `https://meet.mentornet.com/${mentorId}-${Date.now()}`,
    });

    // Update mentor session count
    mentor.totalSessions += 1;
    await mentor.save();

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/sessions/:id/pay — mock payment
router.post('/:id/pay', protect, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    session.paymentStatus = 'paid';
    session.status = 'confirmed';
    await session.save();
    res.json({ message: 'Payment successful', session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/sessions — user's sessions
router.get('/', protect, async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .populate('mentor', 'name expertise avatar')
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/sessions/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('mentor', 'name expertise avatar bio')
      .populate('user', 'name email');
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/sessions/:id/status
router.patch('/:id/status', protect, async (req, res) => {
  const { status } = req.body;
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
