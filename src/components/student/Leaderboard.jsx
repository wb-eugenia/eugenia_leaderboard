import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useStudentAuth } from '../../contexts/StudentAuthContext';
import { getLevelColor, getLevelName, getBadgeInfo } from '../../services/gamificationService';
import BadgeCollection from './BadgeCollection';

export default function Leaderboard({ school = 'eugenia' }) {
  const { student } = useStudentAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('general'); // 'general', 'class', 'monthly'
  const [selectedClass, setSelectedClass] = useState('all');
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    loadLeaderboard();
  }, [filter, selectedClass]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      let data;
      
      if (filter === 'class' && selectedClass !== 'all') {
        data = await api.get(`/leaderboard/class/${encodeURIComponent(selectedClass)}`);
      } else if (filter === 'monthly') {
        data = await api.get('/leaderboard/monthly');
      } else {
        data = await api.get('/leaderboard');
      }

      setLeaderboard(Array.isArray(data) ? data : []);
      
      // Extraire les classes uniques pour le filtre
      if (Array.isArray(data)) {
        const uniqueClasses = [...new Set(data.map(u => u.classe).filter(Boolean))];
        setClasses(uniqueClasses.sort());
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setLeaderboard([]);
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

  // Trouver la position de l'étudiant connecté
  const studentRank = student ? leaderboard.findIndex(u => u.email === student.email) + 1 : null;
  const studentData = student ? leaderboard.find(u => u.email === student.email) : null;

  return (
    <div className="w-full">
      {/* Filtres */}
      <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Type de classement */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('general')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'general'
                  ? 'bg-eugenia-burgundy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Général
            </button>
            <button
              onClick={() => setFilter('monthly')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'monthly'
                  ? 'bg-eugenia-burgundy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setFilter('class')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'class'
                  ? 'bg-eugenia-burgundy text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Par classe
            </button>
          </div>

          {/* Filtre classe si mode classe */}
          {filter === 'class' && (
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eugenia-yellow focus:border-eugenia-yellow outline-none"
            >
              <option value="all">Toutes les classes</option>
              {classes.map(classe => (
                <option key={classe} value={classe}>{classe}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Position de l'étudiant connecté */}
      {studentData && studentRank && (
        <div className="mb-6 p-4 bg-gradient-to-r from-eugenia-burgundy to-eugenia-pink rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90 mb-1">Votre position</div>
              <div className="text-2xl font-bold">#{studentRank}</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90 mb-1">Points</div>
              <div className="text-2xl font-bold">{studentData.totalPoints}</div>
            </div>
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="hidden md:flex bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="w-20 text-sm font-bold text-gray-500 uppercase tracking-wider text-center">Rang</div>
        <div className="flex-1 text-sm font-bold text-gray-500 uppercase tracking-wider">Étudiant</div>
        <div className="w-32 text-right text-sm font-bold text-gray-500 uppercase tracking-wider">
          {filter === 'monthly' ? 'Points (mois)' : 'Points'}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {leaderboard.map((user, index) => {
          const isTopThree = user.rank <= 3;
          const levelColor = getLevelColor(user.level || 1);
          const levelName = getLevelName(user.level || 1);
          const isCurrentUser = student && user.email === student.email;
          
          return (
            <div
              key={user.email}
              className={`flex flex-col md:flex-row items-center p-6 hover:bg-gray-50 transition-all ${
                isTopThree ? 'bg-yellow-50/30 border-l-4' : ''
              } ${
                isCurrentUser ? 'ring-2 ring-eugenia-burgundy' : ''
              }`}
              style={isTopThree ? { borderLeftColor: '#FCD34D' } : {}}
            >
              {/* Rank */}
              <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                <div className="w-20 text-center flex-shrink-0">
                  {user.rank === 1 && (
                    <div className="text-3xl font-bold">🥇</div>
                  )}
                  {user.rank === 2 && (
                    <div className="text-3xl font-bold">🥈</div>
                  )}
                  {user.rank === 3 && (
                    <div className="text-3xl font-bold">🥉</div>
                  )}
                  {user.rank > 3 && (
                    <span className="text-gray-400 text-xl font-bold">#{user.rank}</span>
                  )}
                </div>
                
                {/* Mobile only info */}
                <div className="md:hidden flex-1">
                  <div className="font-bold text-lg text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: levelColor + '20', color: levelColor }}>
                      Nv.{user.level || 1} {levelName}
                    </span>
                    {user.currentStreak > 0 && (
                      <span className="text-orange-500 text-xs flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                        {user.currentStreak}
                      </span>
                    )}
                  </div>
                </div>

                <div className="md:hidden text-right">
                  <span className="block text-2xl font-bold text-eugenia-pink">
                    {filter === 'monthly' ? user.monthlyPoints || 0 : user.totalPoints}
                  </span>
                  <span className="text-xs text-gray-500">pts</span>
                </div>
              </div>
              
              {/* Desktop info */}
              <div className="hidden md:flex flex-1 items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-eugenia-burgundy to-eugenia-pink text-white flex items-center justify-center font-bold flex-shrink-0">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                 </div>
                 <div className="flex-1">
                    <div className="font-bold text-lg text-gray-900 flex items-center gap-2">
                      {user.firstName} {user.lastName}
                      {isCurrentUser && (
                        <span className="text-xs px-2 py-0.5 bg-eugenia-burgundy text-white rounded">Vous</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{user.classe || 'N/A'}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: levelColor + '20', color: levelColor }}>
                        Nv.{user.level || 1} {levelName}
                      </span>
                      {user.currentStreak > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-orange-500 text-xs flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                            {user.currentStreak}j
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span>{user.actionsCount} action{user.actionsCount > 1 ? 's' : ''}</span>
                    </div>
                    {/* Badges compacts */}
                    {user.badges && user.badges.length > 0 && (
                      <div className="mt-2">
                        <BadgeCollection earnedBadges={user.badges} compact={true} />
                      </div>
                    )}
                 </div>
              </div>
              
              {/* Desktop Points */}
              <div className="hidden md:block w-32 text-right">
                <div className="text-3xl font-bold text-eugenia-pink">
                  {filter === 'monthly' ? user.monthlyPoints || 0 : user.totalPoints}
                </div>
                <div className="text-sm text-gray-500">pts</div>
              </div>
            </div>
          );
        })}
      </div>

      {leaderboard.length === 0 && !loading && (
        <div className="text-center py-20">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          <p className="text-gray-500 text-lg">
            Aucun participant pour le moment. Soyez le premier !
          </p>
        </div>
      )}
    </div>
  );
}

