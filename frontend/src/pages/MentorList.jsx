import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import MentorCard from '../components/MentorCard';

const EXPERTISE_OPTIONS = ['All', 'Data Science', 'UX Design', 'AI/ML Engineering', 'Full-Stack Development', 'Product Management', 'Cloud & DevOps'];

export default function MentorList() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expertise, setExpertise] = useState('All');
  const [minRating, setMinRating] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearch(q);
  }, []);

  useEffect(() => {
    fetchMentors();
  }, [expertise, minRating]);

  const fetchMentors = async (searchTerm = search) => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (expertise !== 'All') params.expertise = expertise;
      if (minRating) params.minRating = minRating;
      const { data } = await axios.get('/api/mentors', { params });
      setMentors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMentors(search);
    setSearchParams(search ? { search } : {});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Mentor</h1>
          <p className="text-gray-500 mb-6">Connect with industry experts for personalized guidance</p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search skills, name, or expertise..."
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
              />
            </div>
            <button type="submit" className="btn-primary text-sm">Search</button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar */}
          <aside className="md:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Expertise</label>
                <div className="space-y-1">
                  {EXPERTISE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setExpertise(opt)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${expertise === opt ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Min Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:border-indigo-400"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.8">4.8+ Stars</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Mentor grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm text-gray-500">
                {loading ? 'Loading...' : `${mentors.length} mentor${mentors.length !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-72 border border-gray-100"></div>
                ))}
              </div>
            ) : mentors.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No mentors found</h3>
                <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {mentors.map((mentor) => (
                  <MentorCard key={mentor._id} mentor={mentor} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
