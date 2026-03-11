import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MentorList from './pages/MentorList';
import MentorDetail from './pages/MentorDetail';
import Booking from './pages/Booking';
import LiveSession from './pages/LiveSession';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function Layout({ children, hideFooter }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/mentors" element={<Layout><MentorList /></Layout>} />
          <Route path="/mentors/:id" element={<Layout><MentorDetail /></Layout>} />
          <Route path="/book/:mentorId" element={<Layout><Booking /></Layout>} />
          <Route path="/session/live" element={<LiveSession />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
