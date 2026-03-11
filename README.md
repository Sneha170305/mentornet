# 🎓 MentorNet

A full-stack mentorship platform connecting students, professionals, and teachers with expert mentors for quick career guidance and learning sessions.

---

## ✨ Features

- 🔍 **Search & Browse** mentors by skill, expertise, rating
- 👤 **Mentor Profiles** with bio, skills, ratings, reviews
- 📅 **Session Booking** with date/time picker and 15/30/60 min options
- 💳 **Mock Payment** flow with session confirmation
- 📹 **Live Session** interface with video simulation, timer, and chat
- 🌟 **Ratings & Reviews** system
- 📊 **User Dashboard** with session history
- 🔐 **JWT Authentication** with role-based access (student / professional / mentor)
- 📱 **Fully Responsive** mobile-friendly design

---

## 🗂️ Project Structure

```
mentornet/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   └── auth.js             # JWT protect middleware
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Mentor.js           # Mentor + reviews schema
│   │   └── Session.js          # Session schema
│   ├── routes/
│   │   ├── auth.js             # POST /signup, /login
│   │   ├── mentors.js          # GET /mentors, GET /mentors/:id, reviews, seed
│   │   └── sessions.js         # POST /book, GET /sessions, PATCH status
│   ├── server.js               # Express entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── MentorCard.jsx
    │   │   └── StarRating.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state
    │   ├── pages/
    │   │   ├── Home.jsx         # Landing page
    │   │   ├── MentorList.jsx   # Browse + filter mentors
    │   │   ├── MentorDetail.jsx # Mentor profile + booking CTA
    │   │   ├── Booking.jsx      # 3-step booking flow
    │   │   ├── LiveSession.jsx  # Video session interface
    │   │   ├── Dashboard.jsx    # User session history
    │   │   ├── Login.jsx
    │   │   └── Signup.jsx
    │   ├── App.jsx              # Router & layout
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── tailwind.config.js
```

---

## 🚀 Setup & Running Locally

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

### 1. Clone or unzip the project

```bash
cd mentornet
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mentornet
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

> **Using MongoDB Atlas?** Replace `MONGO_URI` with your Atlas connection string.

Start the backend:
```bash
npm run dev
```

The API will run on: `http://localhost:5000`

---

### 3. Seed Demo Mentor Data

After the backend is running, seed the database with 6 demo mentors:

```bash
curl -X POST http://localhost:5000/api/mentors/seed/init
```

Or open your browser to: `http://localhost:5000/api/mentors/seed/init` (POST request via Postman/Thunder Client)

---

### 4. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm start
```

The app will open at: `http://localhost:3000`

---

## 🗺️ Page Flow

```
/ (Home)
  → Search / Browse
  → /mentors (Mentor List)
    → Filter by expertise, rating
    → Click "View Profile"
    → /mentors/:id (Mentor Detail)
      → "Book a Session"
      → /book/:mentorId (Booking)
        Step 1: Select duration, date, time
        Step 2: Mock payment
        Step 3: Confirmation → Join Session
      → /session/live (Live Session)
        → Video simulation + timer + chat
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register (student/professional/mentor) |
| POST | `/api/auth/login` | Login, returns JWT |

### Mentors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mentors` | List all mentors (supports ?search=, ?expertise=, ?minRating=) |
| GET | `/api/mentors/:id` | Get mentor profile |
| POST | `/api/mentors/:id/review` | Add review (auth required) |
| POST | `/api/mentors/seed/init` | Seed 6 demo mentors |

### Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions/book` | Book a session (auth required) |
| GET | `/api/sessions` | Get user's sessions (auth required) |
| GET | `/api/sessions/:id` | Get session details |
| POST | `/api/sessions/:id/pay` | Mark session as paid (mock) |
| PATCH | `/api/sessions/:id/status` | Update session status |

---

## 🗃️ MongoDB Schemas

### Users
```js
{ name, email, password, role: 'student'|'professional'|'mentor' }
```

### Mentors
```js
{ name, email, avatar, expertise, bio, skills[], experience, company, title,
  hourlyRate, rating, numReviews, reviews[], availableSessions[], totalSessions }
```

### Sessions
```js
{ mentor (ref), user (ref), date, time, duration: 15|30|60,
  topic, status, paymentStatus, amount, meetingLink }
```

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router v6 |
| Styling | Tailwind CSS |
| HTTP | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |

---

## 🧪 Demo Accounts

After seeding, create accounts via `/signup`. Demo mentors (seeded) include:
- Dr. Priya Sharma — Data Science (Google)
- Marcus Chen — UX Design (Figma)
- Aisha Patel — AI/ML Engineering (OpenAI)
- James Okafor — Full-Stack Development (Stripe)
- Sofia Rodriguez — Product Management (Airbnb)
- Raj Mehta — Cloud & DevOps (AWS)

---

## 📝 Notes

- **Payment** is simulated (mock card UI). Integrate Stripe for real payments.
- **Video** sessions are simulated. Integrate Daily.co, Agora, or WebRTC for real video.
- **Meeting links** are auto-generated placeholder URLs.
