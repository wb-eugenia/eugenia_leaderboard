import { useState, useEffect } from 'react';
import { useStudentAuth } from '../../contexts/StudentAuthContext';
import LevelProgress from './LevelProgress';
import BadgeCollection from './BadgeCollection';
import StreakCounter from './StreakCounter';
import { api } from '../../services/api';

export default function LeaderboardStats({ school = 'eugenia' }) {
  const { student } = useStudentAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      if (!student?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Encoder l'email pour l'URL
        const encodedEmail = encodeURIComponent(student.email);
        const endpoint = `/leaderboard/student/${encodedEmail}/stats`;
        
        console.log('Fetching stats from:', endpoint);
        const data = await api.get(endpoint);
        
        // Vérifier si la réponse contient une erreur
        if (data && data.error) {
          if (data.error === 'Student not found' || data.error.includes('not found')) {
            // L'étudiant n'existe pas encore dans la base, créer des stats par défaut
            setStats({
              student: {
                firstName: student.firstName || '',
                lastName: student.lastName || '',
                email: student.email,
                classe: student.classe || '',
                totalPoints: 0,
                actionsCount: 0,
                lastUpdate: '',
              },
              ranks: {
                global: null,
                class: null,
              },
              level: {
                current: 1,
                progress: 0,
                name: 'Novice',
                nextLevelPoints: 50,
              },
              streak: {
                current: 0,
                longest: 0,
              },
              badges: [],
              recentActions: [],
            });
            return;
          }
          throw new Error(data.error);
        }
        
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        
        // Gestion d'erreur plus détaillée
        let errorMessage = 'Erreur lors du chargement des statistiques';
        
        if (err.message) {
          errorMessage = err.message;
        } else if (err.status === 404) {
          errorMessage = 'Statistiques non disponibles. Soumettez une action pour commencer !';
        } else if (err.status === 0 || err.message?.includes('Failed to fetch')) {
          errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
        }
        
        setError(errorMessage);
        
        // Créer des stats par défaut en cas d'erreur réseau
        if (err.status === 0 || err.message?.includes('Failed to fetch')) {
          setStats({
            student: {
              firstName: student.firstName || '',
              lastName: student.lastName || '',
              email: student.email,
              classe: student.classe || '',
              totalPoints: student.totalPoints || 0,
              actionsCount: student.actionsCount || 0,
              lastUpdate: '',
            },
            ranks: {
              global: null,
              class: null,
            },
            level: {
              current: 1,
              progress: 0,
              name: 'Novice',
              nextLevelPoints: 50,
            },
            streak: {
              current: 0,
              longest: 0,
            },
            badges: [],
            recentActions: [],
          });
        }
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [student]);

  if (!student) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
        <p className="text-gray-500">Connectez-vous pour voir vos statistiques</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="bg-white rounded-xl p-8 border border-red-200 bg-red-50">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-red-600 font-semibold">Erreur</p>
        </div>
        <p className="text-red-600">{error}</p>
        <p className="text-sm text-red-500 mt-2">
          Les statistiques affichées peuvent être incomplètes.
        </p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec rangs */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Mes Statistiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Rang Global</div>
            <div className="text-3xl font-bold text-eugenia-burgundy">
              {stats.ranks?.global ? `#${stats.ranks.global}` : 'N/A'}
            </div>
          </div>
          {stats.student?.classe && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Rang dans la classe</div>
              <div className="text-3xl font-bold text-eugenia-pink">
                {stats.ranks?.class ? `#${stats.ranks.class}` : 'N/A'}
              </div>
            </div>
          )}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Points totaux</div>
            <div className="text-3xl font-bold text-eugenia-yellow">{stats.student?.totalPoints || 0}</div>
          </div>
        </div>
        
        {/* Message d'avertissement si erreur mais stats disponibles */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-800 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Niveau et progression */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Progression de niveau</h3>
        <LevelProgress
          points={stats.student?.totalPoints || 0}
          currentLevel={stats.level?.current}
          levelProgress={stats.level?.progress}
        />
      </div>

      {/* Streak */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Streak</h3>
        <StreakCounter
          currentStreak={stats.streak?.current || 0}
          longestStreak={stats.streak?.longest || 0}
        />
      </div>

      {/* Badges */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <BadgeCollection earnedBadges={stats.badges || []} showLocked={true} />
      </div>

      {/* Actions récentes */}
      {stats.recentActions && stats.recentActions.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Actions récentes</h3>
          <div className="space-y-2">
            {stats.recentActions.slice(0, 5).map((action, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      +{action.points} points
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(action.validated_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

