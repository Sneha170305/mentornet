import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';

const STATUS_COLORS = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-600',
  live: 'bg-blue-100 text-blue-700',
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('/api/sessions')
      .then(({ data }) => { setSessions(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  const upcoming = sessions.filter((s) => s.status === 'confirmed' || s.status === 'pending');
  const past = sessions.filter((s) => s.status === 'completed' || s.status === 'cancelled');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <span className="text-indigo-700 text-xl font-bold">{user?.name?.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-500 text-sm capitalize">{user?.role} • {user?.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/mentors')} className="btn-primary text-sm">Find Mentors</button>
            <button onClick={() => { logout(); navigate('/'); }} className="btn-secondary text-sm text-red-500 border-red-200 hover:bg-red-50">Logout</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Sessions', value: sessions.length },
            { label: 'Upcoming', value: upcoming.length },
            { label: 'Completed', value: past.filter(s => s.status === 'completed').length },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
              <div className="text-3xl font-bold text-indigo-600">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Sessions */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-gray-100"></div>)}
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No sessions yet</h3>
            <p className="text-gray-400 text-sm mb-6">Book your first mentorship session to get started</p>
            <button onClick={() => navigate('/mentors')} className="btn-primary">Browse Mentors</button>
          </div>
        ) : (
          <div className="space-y-6">
            {upcoming.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Upcoming Sessions</h2>
                <div className="space-y-3">
                  {upcoming.map((s) => (
                    <div key={s._id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={s.mentor?.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${s.mentorName}`}
                          alt={s.mentorName}
                          className="w-12 h-12 rounded-xl bg-indigo-50"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{s.mentorName}</p>
                          <p className="text-sm text-gray-500">{s.date} at {s.time} • {s.duration} min</p>
                          {s.topic && <p className="text-xs text-gray-400 mt-0.5">Topic: {s.topic}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[s.status]}`}>
                          {s.status}
                        </span>
                        <button
                          onClick={() => navigate(`/session/live?sessionId=${s._id}&mentor=${s.mentor?._id}&name=${encodeURIComponent(s.mentorName)}&duration=${s.duration}`)}
                          className="btn-primary text-sm py-2"
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Session History</h2>
                <div className="space-y-3">
                  {past.map((s) => (
                    <div key={s._id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between opacity-75">
                      <div className="flex items-center gap-4">
                        <img
                          src={s.mentor?.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${s.mentorName}`}
                          alt={s.mentorName}
                          className="w-12 h-12 rounded-xl bg-gray-100"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">{s.mentorName}</p>
                          <p className="text-sm text-gray-500">{s.date} at {s.time} • {s.duration} min</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[s.status]}`}>
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
