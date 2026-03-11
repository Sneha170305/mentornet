import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Mentor<span className="text-indigo-600">Net</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/mentors"
              className={`text-sm font-medium transition-colors ${isActive('/mentors') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
            >
              Find Mentors
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
              >
                My Sessions
              </Link>
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-400 capitalize">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-4">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link to="/mentors" className="block text-sm font-medium text-gray-700 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>Find Mentors</Link>
          {user && <Link to="/dashboard" className="block text-sm font-medium text-gray-700 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>My Sessions</Link>}
          {user ? (
            <button onClick={handleLogout} className="block text-sm font-medium text-red-500">Logout</button>
          ) : (
            <>
              <Link to="/login" className="block text-sm font-medium text-gray-700" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="block btn-primary text-sm text-center" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
