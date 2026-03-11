import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';

export default function MentorCard({ mentor }) {
  const navigate = useNavigate();

  const expertiseColors = {
    'Data Science': 'bg-blue-100 text-blue-700',
    'UX Design': 'bg-pink-100 text-pink-700',
    'AI/ML Engineering': 'bg-purple-100 text-purple-700',
    'Full-Stack Development': 'bg-green-100 text-green-700',
    'Product Management': 'bg-orange-100 text-orange-700',
    'Cloud & DevOps': 'bg-cyan-100 text-cyan-700',
  };

  const badgeColor = expertiseColors[mentor.expertise] || 'bg-indigo-100 text-indigo-700';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 card-hover flex flex-col">
      {/* Avatar & Info */}
      <div className="flex items-start gap-4 mb-4">
        <img
          src={mentor.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${mentor.name}`}
          alt={mentor.name}
          className="w-16 h-16 rounded-xl object-cover bg-indigo-50 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{mentor.name}</h3>
          <p className="text-sm text-gray-500 truncate">{mentor.title} {mentor.company ? `@ ${mentor.company}` : ''}</p>
          <div className="mt-1">
            <StarRating rating={mentor.rating || 4.5} />
          </div>
        </div>
      </div>

      {/* Badge */}
      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 w-fit ${badgeColor}`}>
        {mentor.expertise}
      </span>

      {/* Bio */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">{mentor.bio}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(mentor.skills || []).slice(0, 3).map((skill) => (
          <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
            {skill}
          </span>
        ))}
        {mentor.skills?.length > 3 && (
          <span className="text-xs text-gray-400 px-2 py-1">+{mentor.skills.length - 3}</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div>
          <span className="text-lg font-bold text-indigo-600">${mentor.hourlyRate}</span>
          <span className="text-xs text-gray-400">/hr</span>
        </div>
        <button
          onClick={() => navigate(`/mentors/${mentor._id}`)}
          className="btn-primary text-sm py-2 px-4"
        >
          View Profile
        </button>
      </div>

      {/* Sessions count */}
      <div className="text-center mt-3">
        <span className="text-xs text-gray-400">{mentor.totalSessions || 0} sessions completed • {mentor.numReviews || 0} reviews</span>
      </div>
    </div>
  );
}
