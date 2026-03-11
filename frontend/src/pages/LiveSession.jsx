import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function LiveSession() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mentorName = searchParams.get('name') || 'Mentor';
  const duration = parseInt(searchParams.get('duration') || '30') * 60;

  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [messages, setMessages] = useState([
    { from: mentorName, text: `Hi! Welcome to our session. I'm ready to help you today.`, time: 'just now' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const intervalRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!isRunning || isEnded) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(intervalRef.current); setIsEnded(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isEnded]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const totalTime = duration;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages((m) => [...m, { from: 'You', text: chatInput, time: 'just now' }]);
    setChatInput('');
  };

  const endSession = () => {
    clearInterval(intervalRef.current);
    setIsEnded(true);
  };

  if (isEnded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 text-center max-w-md w-full">
          <div className="text-5xl mb-4">🎓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Complete!</h2>
          <p className="text-gray-500 mb-6">Your session with <strong>{mentorName}</strong> has ended. We hope it was valuable!</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/mentors')} className="btn-primary justify-center py-3">Book Another Session</button>
            <button onClick={() => navigate('/dashboard')} className="btn-secondary justify-center py-3">Go to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-white font-semibold text-sm">Live Session</span>
          <span className="text-gray-400 text-sm">with {mentorName}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className={`text-xl font-mono font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="w-28 h-1 bg-gray-700 rounded-full mt-1">
              <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video area */}
        <div className="flex-1 flex flex-col p-4 gap-4">
          {/* Mentor video (main) */}
          <div className="flex-1 bg-gray-800 rounded-2xl relative overflow-hidden flex items-center justify-center">
            {isVideoOff ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                  {mentorName.charAt(0)}
                </div>
                <span className="text-gray-400 text-sm">Video off</span>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-indigo-700 rounded-full flex items-center justify-center text-4xl font-bold text-white mx-auto mb-3">
                    {mentorName.charAt(0)}
                  </div>
                  <p className="text-white font-semibold">{mentorName}</p>
                  <p className="text-gray-400 text-sm mt-1">📹 Camera simulation</p>
                </div>
              </div>
            )}
            <div className="absolute top-3 left-3 bg-black/50 rounded-lg px-2 py-1 text-white text-xs">{mentorName}</div>
          </div>

          {/* Self video (small) */}
          <div className="h-28 bg-gray-700 rounded-xl flex items-center justify-center relative">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">You</div>
            {isMuted && <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1"><svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg></div>}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 py-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                {isMuted
                  ? <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  : <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd"/>
                }
              </svg>
            </button>

            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
            </button>

            <button
              onClick={() => setIsRunning(!isRunning)}
              className="w-12 h-12 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center transition-colors"
            >
              {isRunning
                ? <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                : <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
              }
            </button>

            <button onClick={endSession} className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat sidebar */}
        <div className="w-72 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold text-sm">Session Chat</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.from === 'You' ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-gray-500 mb-1">{msg.from}</span>
                <div className={`max-w-full rounded-xl px-3 py-2 text-sm ${msg.from === 'You' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 border border-gray-600 text-white text-sm rounded-lg px-3 py-2 placeholder-gray-400 focus:border-indigo-500"
              />
              <button onClick={sendMessage} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm">
                ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
