import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';

export default function MentorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('about');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    axios.get(`/api/mentors/${id}`)
      .then(({ data }) => { setMentor(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleReview = async () => {
    if (!user) return navigate('/login');
    setSubmittingReview(true);
    try {
      await axios.post(`/api/mentors/${id}/review`, { rating: reviewRating, comment: reviewText });
      const { data } = await axios.get(`/api/mentors/${id}`);
      setMentor(data);
      setReviewText('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!mentor) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">Mentor not found</div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6">
          ← Back to Mentors
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={mentor.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${mentor.name}`}
                  alt={mentor.name}
                  className="w-24 h-24 rounded-2xl bg-indigo-50 object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{mentor.name}</h1>
                  <p className="text-gray-500 mt-1">{mentor.title}{mentor.company ? ` @ ${mentor.company}` : ''}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <StarRating rating={mentor.rating || 4.5} size="md" />
                    <span className="text-sm text-gray-400">({mentor.numReviews} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1 rounded-full">{mentor.expertise}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{mentor.experience}+ years exp</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">{mentor.totalSessions} sessions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100">
                {['about', 'skills', 'reviews'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors ${tab === t ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {tab === 'about' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">About</h3>
                    <p className="text-gray-600 leading-relaxed">{mentor.bio}</p>
                  </div>
                )}

                {tab === 'skills' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {(mentor.skills || []).map((skill) => (
                        <span key={skill} className="bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-2 rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {tab === 'reviews' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Reviews ({mentor.reviews?.length || 0})</h3>
                    <div className="space-y-4 mb-6">
                      {(mentor.reviews || []).map((r, i) => (
                        <div key={i} className="border border-gray-100 rounded-xl p-4">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-sm text-gray-800">{r.name}</span>
                            <StarRating rating={r.rating} size="sm" />
                          </div>
                          <p className="text-sm text-gray-600">{r.comment}</p>
                        </div>
                      ))}
                      {mentor.reviews?.length === 0 && <p className="text-gray-400 text-sm">No reviews yet.</p>}
                    </div>

                    {user && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-800 mb-3">Write a Review</h4>
                        <div className="flex gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button key={s} onClick={() => setReviewRating(s)}>
                              <svg className={`w-6 h-6 ${s <= reviewRating ? 'star-filled' : 'star-empty'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Share your experience..."
                          rows={3}
                          className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:border-indigo-400 resize-none"
                        />
                        <button
                          onClick={handleReview}
                          disabled={submittingReview || !reviewText}
                          className="btn-primary mt-2 text-sm disabled:opacity-50"
                        >
                          {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Booking sidebar */}
          <div className="space-y-5">
            {/* Price card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <div className="text-3xl font-bold text-indigo-600 mb-1">${mentor.hourlyRate}<span className="text-base text-gray-400 font-normal">/hr</span></div>
              <p className="text-sm text-gray-500 mb-5">Transparent pricing, no hidden fees</p>

              <div className="space-y-3 mb-6">
                {[15, 30, 60].map((dur) => (
                  <div key={dur} className="flex justify-between text-sm border border-gray-100 rounded-xl p-3">
                    <span className="text-gray-600">{dur} min session</span>
                    <span className="font-semibold text-gray-900">${Math.round(mentor.hourlyRate / 60 * dur)}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate(`/book/${mentor._id}`)}
                className="w-full btn-primary justify-center py-3 text-base"
              >
                Book a Session
              </button>

              <button
                onClick={() => {
                  if (!user) return navigate('/login');
                  navigate(`/session/live?mentor=${mentor._id}&name=${encodeURIComponent(mentor.name)}`);
                }}
                className="w-full btn-secondary justify-center py-3 text-base mt-3"
              >
                Join Free Session
              </button>
            </div>

            {/* Available times */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h4 className="font-semibold text-gray-900 mb-3">Available Sessions</h4>
              {(mentor.availableSessions || []).slice(0, 4).map((s, i) => (
                <div key={i} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-600">{s.date}</span>
                  <span className="font-medium text-gray-800">{s.time}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.booked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {s.booked ? 'Booked' : 'Open'}
                  </span>
                </div>
              ))}
              {mentor.availableSessions?.length === 0 && <p className="text-sm text-gray-400">No slots listed</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
