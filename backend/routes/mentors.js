const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');
const { protect } = require('../middleware/auth');

// Seed data for demo
const seedMentors = [
  {
    name: 'Dr. Priya Sharma',
    email: 'priya@mentornet.com',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=priya',
    expertise: 'Data Science',
    bio: '10+ years in ML/AI at Google and DeepMind. PhD in Computer Science. Passionate about making data science accessible to everyone.',
    skills: ['Python', 'TensorFlow', 'Machine Learning', 'Deep Learning', 'SQL', 'Statistics'],
    experience: 10,
    company: 'Google',
    title: 'Senior Data Scientist',
    hourlyRate: 80,
    rating: 4.9,
    numReviews: 142,
    totalSessions: 280,
    availableSessions: [
      { date: '2025-07-10', time: '10:00 AM', duration: 30 },
      { date: '2025-07-10', time: '2:00 PM', duration: 60 },
      { date: '2025-07-11', time: '11:00 AM', duration: 15 },
    ],
  },
  {
    name: 'Marcus Chen',
    email: 'marcus@mentornet.com',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=marcus',
    expertise: 'UX Design',
    bio: 'Lead UX Designer at Figma. Helped 200+ designers break into top tech companies. Specializing in product design and design systems.',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility', 'CSS'],
    experience: 8,
    company: 'Figma',
    title: 'Lead UX Designer',
    hourlyRate: 70,
    rating: 4.8,
    numReviews: 98,
    totalSessions: 195,
    availableSessions: [
      { date: '2025-07-10', time: '9:00 AM', duration: 30 },
      { date: '2025-07-12', time: '3:00 PM', duration: 60 },
    ],
  },
  {
    name: 'Aisha Patel',
    email: 'aisha@mentornet.com',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=aisha',
    expertise: 'AI/ML Engineering',
    bio: 'AI Research Engineer at OpenAI. Building next-gen language models. Ex-Meta AI. Love helping engineers transition into AI roles.',
    skills: ['PyTorch', 'NLP', 'LLMs', 'Transformers', 'MLOps', 'Python', 'Research'],
    experience: 7,
    company: 'OpenAI',
    title: 'AI Research Engineer',
    hourlyRate: 100,
    rating: 4.9,
    numReviews: 87,
    totalSessions: 160,
    availableSessions: [
      { date: '2025-07-11', time: '1:00 PM', duration: 30 },
      { date: '2025-07-13', time: '10:00 AM', duration: 60 },
    ],
  },
  {
    name: 'James Okafor',
    email: 'james@mentornet.com',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=james',
    expertise: 'Full-Stack Development',
    bio: 'Staff Engineer at Stripe. 12 years building scalable systems. Mentor for 300+ developers. Specializing in React, Node.js and system design.',
    skills: ['React', 'Node.js', 'TypeScript', 'System Design', 'AWS', 'PostgreSQL'],
    experience: 12,
    company: 'Stripe',
    title: 'Staff Software Engineer',
    hourlyRate: 90,
    rating: 4.7,
    numReviews: 203,
    totalSessions: 420,
    availableSessions: [
      { date: '2025-07-10', time: '5:00 PM', duration: 30 },
      { date: '2025-07-14', time: '9:00 AM', duration: 60 },
    ],
  },
  {
    name: 'Sofia Rodriguez',
    email: 'sofia@mentornet.com',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=sofia',
    expertise: 'Product Management',
    bio: 'Senior PM at Airbnb. Former founder. Expert in zero-to-one products and growth strategy. MBA from Wharton.',
    skills: ['Product Strategy', 'Roadmapping', 'A/B Testing', 'Agile', 'Data Analysis', 'Go-to-Market'],
    experience: 9,
    company: 'Airbnb',
    title: 'Senior Product Manager',
    hourlyRate: 85,
    rating: 4.8,
    numReviews: 116,
    totalSessions: 230,
    availableSessions: [
      { date: '2025-07-11', time: '4:00 PM', duration: 30 },
      { date: '2025-07-12', time: '11:00 AM', duration: 15 },
    ],
  },
  {
    name: 'Raj Mehta',
    email: 'raj@mentornet.com',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=raj',
    expertise: 'Cloud & DevOps',
    bio: 'Principal Cloud Architect at AWS. Certified in all major cloud platforms. Helped 100+ teams migrate to cloud. Speaker at AWS re:Invent.',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'CI/CD', 'Azure', 'GCP'],
    experience: 11,
    company: 'Amazon Web Services',
    title: 'Principal Cloud Architect',
    hourlyRate: 95,
    rating: 4.6,
    numReviews: 74,
    totalSessions: 145,
    availableSessions: [
      { date: '2025-07-13', time: '2:00 PM', duration: 60 },
      { date: '2025-07-15', time: '10:00 AM', duration: 30 },
    ],
  },
];

// GET /api/mentors — list with search + filter
router.get('/', async (req, res) => {
  try {
    const { search, expertise, minRating } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { expertise: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }
    if (expertise) query.expertise = { $regex: expertise, $options: 'i' };
    if (minRating) query.rating = { $gte: parseFloat(minRating) };

    const mentors = await Mentor.find(query).sort({ rating: -1 });
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/mentors/:id
router.get('/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/mentors/:id/review — add a review
router.post('/:id/review', protect, async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });

    const alreadyReviewed = mentor.reviews.find(
      (r) => r.user?.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) return res.status(400).json({ message: 'Already reviewed' });

    mentor.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
    mentor.numReviews = mentor.reviews.length;
    mentor.rating = mentor.reviews.reduce((acc, r) => acc + r.rating, 0) / mentor.reviews.length;
    await mentor.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/mentors/seed — populate demo data
router.post('/seed/init', async (req, res) => {
  try {
    await Mentor.deleteMany({});
    const mentors = await Mentor.insertMany(seedMentors);
    res.json({ message: `Seeded ${mentors.length} mentors`, mentors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
