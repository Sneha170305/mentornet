import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MentorCard from '../components/MentorCard';

const SKILLS = ['AI/ML', 'Data Science', 'UX Design', 'Full-Stack', 'Product Management', 'Cloud & DevOps', 'React', 'Python'];

const STATS = [
  { label: 'Expert Mentors', value: '500+' },
  { label: 'Sessions Completed', value: '12,000+' },
  { label: 'Happy Learners', value: '8,500+' },
  { label: 'Avg. Rating', value: '4.8★' },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [topMentors, setTopMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/mentors').then(({ data }) => {
      setTopMentors(data.slice(0, 3));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/mentors${search ? `?search=${search}` : ''}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            250+ live sessions this week
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Learn from the <span className="text-yellow-300">Best</span> in<br className="hidden md:block" />
            Your Industry
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
            Quick 15–60 minute mentorship sessions with top professionals from Google, Stripe, Airbnb and more. Get career clarity, skill guidance, and real results.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-2xl">
              <div className="flex items-center gap-2 flex-1 pl-3">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by skill, role, or expertise..."
                  className="flex-1 text-gray-800 text-sm outline-none placeholder-gray-400 py-2"
                />
              </div>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
                Search
              </button>
            </div>
          </form>

          {/* Quick skill filters */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {SKILLS.map((skill) => (
              <button
                key={skill}
                onClick={() => navigate(`/mentors?search=${skill}`)}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold text-indigo-600">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How MentorNet Works</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Get expert guidance in three simple steps</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Find Your Mentor', desc: 'Browse hundreds of vetted mentors by skill, experience, and availability.', icon: '🔍' },
            { step: '02', title: 'Book a Session', desc: 'Pick a time that works. Choose 15, 30, or 60-minute sessions.', icon: '📅' },
            { step: '03', title: 'Grow Your Career', desc: 'Join a live video session and get actionable guidance for your goals.', icon: '🚀' },
          ].map((item) => (
            <div key={item.step} className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-indigo-50 transition-colors group">
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className="text-xs font-bold text-indigo-400 mb-2">{item.step}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Mentors */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Popular Mentors</h2>
              <p className="text-gray-500">Highly rated experts ready to help you</p>
            </div>
            <button
              onClick={() => navigate('/mentors')}
              className="btn-secondary text-sm hidden md:flex"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-64"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {topMentors.map((mentor) => (
                <MentorCard key={mentor._id} mentor={mentor} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <button onClick={() => navigate('/mentors')} className="btn-primary">
              View All Mentors
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="gradient-hero rounded-3xl p-10 md:p-16 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to accelerate your career?</h2>
          <p className="text-indigo-100 mb-8 max-w-xl mx-auto">Join thousands of learners getting real guidance from industry experts.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/mentors')} className="bg-white text-indigo-700 font-bold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
              Browse Mentors
            </button>
            <button onClick={() => navigate('/signup')} className="bg-white/10 text-white font-bold px-8 py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/20">
              Become a Mentor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
