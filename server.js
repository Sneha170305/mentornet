const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mentornet')
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});

const User = mongoose.model('User', {
    username: String,
    password: String
});

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/mentors', (req, res) => {
    res.render('mentors');
});

app.get('/signuppop', (req, res) => {
    res.render('signuppop');
});

app.post('/book-session', (req, res) => {
    res.render('session-status', { message: "No sessions available right now. Please check back later!" });
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    await User.create({ username, password });
    res.redirect('/mentors');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
        res.redirect('/mentors');
    } else {
        res.redirect('/signuppop');
    }
});

app.get('/mentor/:id', (req, res) => {
const mentorDetails = {
  1: {
    name: "Sneha",
    role: "Backend Developer",
    emoji: "👩‍💻",
    bio: "Specializes in Node.js and MongoDB. Passionate about building scalable APIs and mentoring junior devs."
  },
  2: {
    name: "Manisha",
    role: "Cyber Security",
    emoji: "🛡️",
    bio: "Expert in ethical hacking and digital forensics. Helps teams secure their infrastructure and data."
  },
  3: {
    name: "Pruthvee",
    role: "Robotics Engineer",
    emoji: "🤖",
    bio: "Designs intelligent robotic systems. Loves integrating AI with hardware to solve real-world problems."
  },
  4: {
    name: "Ankita",
    role: "Frontend Developer",
    emoji: "🎨",
    bio: "Crafts responsive, emotionally resonant UIs. Skilled in React, accessibility, and visual storytelling."
  },
  5: {
    name: "Ritika",
    role: "Data Analyst",
    emoji: "📊",
    bio: "Turns raw data into actionable insights. Loves dashboards, storytelling, and uncovering hidden patterns."
  },
  6: {
    name: "Akshay",
    role: "Financial Analyst",
    emoji: "💼",
    bio: "Analyzes market trends and financial models. Helps startups make smart, data-driven decisions."
  }
};

    const mentor = mentorDetails[req.params.id];
    if (mentor) {
        res.render('mentor-detail', { mentor });
    } else {
        res.send('Mentor not found');
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
module.exports = app;