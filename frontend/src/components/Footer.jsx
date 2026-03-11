import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-white">Mentor<span className="text-indigo-400">Net</span></span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">
              Connecting learners with expert mentors for quick, structured guidance sessions that accelerate careers.
            </p>
            <div className="flex gap-4 mt-4">
              {['twitter', 'linkedin', 'github'].map((s) => (
                <a key={s} href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-indigo-600 transition-colors text-xs font-bold uppercase">{s[0]}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/mentors" className="hover:text-indigo-400 transition-colors">Find Mentors</Link></li>
              <li><Link to="/signup" className="hover:text-indigo-400 transition-colors">Become a Mentor</Link></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">How it Works</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:support@mentornet.com" className="hover:text-indigo-400 transition-colors">support@mentornet.com</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          © 2025 MentorNet. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
