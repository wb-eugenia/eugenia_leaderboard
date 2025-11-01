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
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center text-white mb-8">
        🏆 Classement des Champions
      </h2>

      <div className="space-y-3">
        {leaderboard.map((user, index) => {
          const isTopThree = index < 3;
          const medal = ['🥇', '🥈', '🥉'][index];
          
          return (
            <div
              key={user.email}
              className={`card flex items-center gap-4 ${
                isTopThree ? 'border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-yellow-100' : ''
              }`}
            >
              <div className="text-3xl font-bold w-16 text-center">
                {medal || user.rank}
              </div>
              
              <div className="flex-1">
                <div className="font-bold text-xl">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-gray-600">
                  {user.classe || ''} • {user.actionsCount} action{user.actionsCount > 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600">
                  {user.totalPoints}
                </div>
                <div className="text-sm text-gray-500">pts</div>
              </div>
            </div>
          );
        })}
      </div>

      {leaderboard.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">
            Aucun participant pour le moment. Soyez le premier ! 🎉
          </p>
        </div>
      )}
    </div>
  );
}

