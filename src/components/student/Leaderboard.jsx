import { useEffect, useState } from 'react';
import { getLeaderboard } from '../../services/googleSheets.js';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Table Header */}
      <div className="hidden md:flex bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="w-20 text-sm font-bold text-gray-500 uppercase tracking-wider text-center">Rang</div>
        <div className="flex-1 text-sm font-bold text-gray-500 uppercase tracking-wider">Étudiant</div>
        <div className="w-32 text-right text-sm font-bold text-gray-500 uppercase tracking-wider">Points</div>
      </div>

      <div className="divide-y divide-gray-100">
        {leaderboard.map((user, index) => {
          const isTopThree = index < 3;
          const medal = ['🥇', '🥈', '🥉'][index];
          
          return (
            <div
              key={user.email}
              className={`flex flex-col md:flex-row items-center p-6 hover:bg-gray-50 transition-colors ${
                isTopThree ? 'bg-yellow-50/30' : ''
              }`}
            >
              {/* Rank */}
              <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                <div className="w-20 text-3xl font-bold text-center flex-shrink-0">
                   {medal || <span className="text-gray-400 text-xl">#{user.rank}</span>}
                </div>
                
                {/* Mobile only info */}
                <div className="md:hidden flex-1">
                  <div className="font-bold text-lg text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user.classe}
                  </div>
                </div>

                <div className="md:hidden text-right">
                  <span className="block text-2xl font-bold text-eugenia-pink">{user.totalPoints}</span>
                  <span className="text-xs text-gray-500">pts</span>
                </div>
              </div>
              
              {/* Desktop info */}
              <div className="hidden md:flex flex-1 items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-eugenia-burgundy to-eugenia-pink text-white flex items-center justify-center font-bold">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                 </div>
                 <div>
                    <div className="font-bold text-lg text-gray-900">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{user.classe || 'N/A'}</span>
                      <span>•</span>
                      <span>{user.actionsCount} action{user.actionsCount > 1 ? 's' : ''}</span>
                    </div>
                 </div>
              </div>
              
              {/* Desktop Points */}
              <div className="hidden md:block w-32 text-right">
                <div className="text-3xl font-bold text-eugenia-pink">
                  {user.totalPoints}
                </div>
                <div className="text-sm text-gray-500">pts</div>
              </div>
            </div>
          );
        })}
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-gray-500 text-lg">
            Aucun participant pour le moment. Soyez le premier ! 🎉
          </p>
        </div>
      )}
    </div>
  );
}

