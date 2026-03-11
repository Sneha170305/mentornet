import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

function getDates() {
  const dates = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      value: d.toISOString().split('T')[0],
    });
  }
  return dates;
}

export default function Booking() {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mentor, setMentor] = useState(null);
  const [duration, setDuration] = useState(30);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [topic, setTopic] = useState('');
  const [step, setStep] = useState(1); // 1: select, 2: payment, 3: confirmed
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const dates = getDates();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get(`/api/mentors/${mentorId}`).then(({ data }) => setMentor(data));
  }, [mentorId]);

  const price = mentor ? Math.round(mentor.hourlyRate / 60 * duration) : 0;

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) return alert('Please select date and time');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/sessions/book', {
        mentorId,
        date: selectedDate,
        time: selectedTime,
        duration,
        topic,
      });
      setBooking(data);
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/sessions/${booking._id}/pay`);
      setStep(3);
    } catch (err) {
      alert('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!mentor) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6">← Back</button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Book a Session</h1>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          {['Select Time', 'Payment', 'Confirmed'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-sm ${step === i + 1 ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>{s}</span>
              {i < 2 && <div className={`h-px w-8 ${step > i + 1 ? 'bg-green-400' : 'bg-gray-200'}`}></div>}
            </div>
          ))}
        </div>

        {/* Mentor summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 flex items-center gap-4">
          <img src={mentor.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${mentor.name}`} alt={mentor.name} className="w-14 h-14 rounded-xl bg-indigo-50" />
          <div>
            <p className="font-bold text-gray-900">{mentor.name}</p>
            <p className="text-sm text-gray-500">{mentor.expertise} • ${mentor.hourlyRate}/hr</p>
          </div>
        </div>

        {/* Step 1: Select */}
        {step === 1 && (
          <div className="space-y-5">
            {/* Duration */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Session Duration</h3>
              <div className="grid grid-cols-3 gap-3">
                {[15, 30, 60].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`py-4 rounded-xl border-2 text-center transition-all ${duration === d ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}`}
                  >
                    <div className="font-bold text-lg">{d}</div>
                    <div className="text-xs">min</div>
                    <div className="text-xs font-semibold mt-1">${Math.round(mentor.hourlyRate / 60 * d)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Select Date</h3>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {dates.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setSelectedDate(d.value)}
                    className={`py-3 rounded-xl text-center text-xs transition-all ${selectedDate === d.value ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-indigo-50'}`}
                  >
                    {d.label.split(', ').map((part, i) => (
                      <div key={i} className={i === 0 ? 'font-semibold' : ''}>{part}</div>
                    ))}
                  </button>
                ))}
              </div>
            </div>

            {/* Time */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Select Time</h3>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-2.5 rounded-lg text-sm transition-all ${selectedTime === t ? 'bg-indigo-600 text-white font-semibold' : 'bg-gray-50 text-gray-600 hover:bg-indigo-50'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">What do you want to discuss? <span className="text-gray-400 font-normal text-sm">(optional)</span></h3>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g. Career transition, technical interview prep, portfolio review..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:border-indigo-400 resize-none"
              />
            </div>

            <button
              onClick={handleBook}
              disabled={loading || !selectedDate || !selectedTime}
              className="w-full btn-primary py-4 text-base justify-center disabled:opacity-50"
            >
              {loading ? 'Booking...' : `Continue to Payment — $${price}`}
            </button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && booking && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <h3 className="font-bold text-xl text-gray-900 mb-6">Payment</h3>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Session with</span><span className="font-medium">{mentor.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date & Time</span><span className="font-medium">{booking.date} at {booking.time}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-medium">{booking.duration} minutes</span></div>
              <div className="flex justify-between border-t pt-2 mt-2"><span className="font-semibold text-gray-900">Total</span><span className="font-bold text-indigo-600 text-base">${booking.amount}</span></div>
            </div>

            {/* Mock card input */}
            <div className="space-y-3 mb-6">
              <input readOnly value="4242 4242 4242 4242" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 bg-gray-50" placeholder="Card number" />
              <div className="grid grid-cols-2 gap-3">
                <input readOnly value="12/26" className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 bg-gray-50" />
                <input readOnly value="123" className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 bg-gray-50" />
              </div>
              <p className="text-xs text-gray-400 text-center">🔒 Demo mode — no real payment processed</p>
            </div>

            <button onClick={handlePay} disabled={loading} className="w-full btn-primary py-4 text-base justify-center disabled:opacity-50">
              {loading ? 'Processing...' : `Pay $${booking.amount}`}
            </button>
          </div>
        )}

        {/* Step 3: Confirmed */}
        {step === 3 && booking && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Session Booked! 🎉</h3>
            <p className="text-gray-500 mb-6">Your mentorship session with <strong>{mentor.name}</strong> is confirmed.</p>
            <div className="bg-indigo-50 rounded-xl p-4 text-sm text-left mb-6 space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-semibold">{booking.date}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-semibold">{booking.time}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-semibold">{booking.duration} min</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Meeting Link</span><span className="font-semibold text-indigo-600 truncate text-xs">{booking.meetingLink}</span></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate(`/session/live?sessionId=${booking._id}&mentor=${mentorId}&name=${encodeURIComponent(mentor.name)}`)} className="btn-primary py-3 px-8 justify-center">
                Join Session
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn-secondary py-3 px-8 justify-center">
                My Sessions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
