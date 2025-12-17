import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function BadgesDisplay({ studentEmail, school = 'eugenia' }) {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentEmail) {
      loadBadges();
    }
  }, [studentEmail]);

  const loadBadges = async () => {
    try {
      const response = await fetch(`${API_URL}/badges/student/${encodeURIComponent(studentEmail)}`);
      const data = await response.json();
      setBadges(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eugenia-burgundy"></div>
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">🏆</div>
        <p>Aucun badge obtenu pour le moment</p>
        <p className="text-sm mt-2">Continuez à participer pour débloquer des badges !</p>
      </div>
    );
  }

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 via-orange-500 to-red-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-300 to-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {badges.map((badge) => (
        <div
          key={badge.id}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all border-2 border-gray-100 dark:border-gray-700 group relative"
          title={`${badge.name} - ${badge.description || ''}`}
        >
          <div className={`text-4xl mb-2 text-center bg-gradient-to-br ${getRarityColor(badge.rarity)} bg-clip-text text-transparent`}>
            {badge.emoji || '🏆'}
          </div>
          <div className="text-xs font-bold text-gray-900 dark:text-white text-center line-clamp-2">
            {badge.name}
          </div>
          {badge.rarity !== 'common' && (
            <div className="absolute top-1 right-1">
              <span className={`text-[8px] px-1 py-0.5 rounded ${
                badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                badge.rarity === 'epic' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {badge.rarity}
              </span>
            </div>
          )}
          {badge.earned_at && (
            <div className="text-[10px] text-gray-500 dark:text-gray-400 text-center mt-1">
              {new Date(badge.earned_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}










