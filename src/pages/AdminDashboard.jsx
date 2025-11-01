import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActionsToValidate, getLeaderboard, getAllActions } from '../services/googleSheets';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingActions: 0,
    totalActions: 0,
    totalUsers: 0,
    totalPoints: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    loadStats();
    loadRecentActivity();
  }, []);

  const loadStats = async () => {
    try {
      const pending = await getActionsToValidate();
      const leaderboard = await getLeaderboard();
      const allActions = localStorage.getItem('eugenia_actions');
      const actionsList = allActions ? JSON.parse(allActions) : [];

      const totalPoints = leaderboard.reduce((sum, user) => sum + user.totalPoints, 0);

      setStats({
        pendingActions: pending.length,
        totalActions: actionsList.length,
        totalUsers: leaderboard.length,
        totalPoints
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRecentActivity = async () => {
    try {
      setLoadingActivity(true);
      const allActions = await getAllActions();
      
      // Trier par date et prendre les 5 plus récentes
      const sorted = allActions.sort((a, b) => {
        const dateA = new Date(a.date || a.validatedAt || 0);
        const dateB = new Date(b.date || b.validatedAt || 0);
        return dateB - dateA;
      }).slice(0, 5);
      
      setRecentActivity(sorted);
    } catch (error) {
      console.error('Error loading activity:', error);
    } finally {
      setLoadingActivity(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Il y a quelques instants';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${diffDays}j`;
  };

  const getActionTypeLabel = (type) => {
    const actionTypes = ['linkedin-post', 'jpo-participation', 'hackathon-victory', 'association-create'];
    const labels = {
      'linkedin-post': '📱 Post LinkedIn',
      'jpo-participation': '🎓 JPO',
      'hackathon-victory': '🏆 Hackathon',
      'association-create': '🤝 Création Asso'
    };
    return labels[type] || type || '📋 Action';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Admin
        </h2>
        <p className="text-gray-600">
          Vue d'ensemble du système de gamification
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Actions en attente */}
        <Link to="/admin/validate" className="card hover:shadow-2xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold text-red-600">
                {stats.pendingActions}
              </div>
              <div className="text-gray-600 mt-2">Actions en attente</div>
            </div>
            <div className="text-5xl">🔴</div>
          </div>
          {stats.pendingActions > 0 && (
            <div className="mt-4">
              <div className="badge badge-danger">
                Action requise
              </div>
            </div>
          )}
        </Link>

        {/* Total actions */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold text-primary-600">
                {stats.totalActions}
              </div>
              <div className="text-gray-600 mt-2">Total actions</div>
            </div>
            <div className="text-5xl">📊</div>
          </div>
        </div>

        {/* Total users */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold text-green-600">
                {stats.totalUsers}
              </div>
              <div className="text-gray-600 mt-2">Participants</div>
            </div>
            <div className="text-5xl">👥</div>
          </div>
        </div>

        {/* Total points */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold text-eugenia-yellow">
                {stats.totalPoints}
              </div>
              <div className="text-gray-600 mt-2">Points distribués</div>
            </div>
            <div className="text-5xl">🏆</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Actions rapides
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/validate" className="btn btn-danger w-full">
            📋 Valider les actions ({stats.pendingActions})
          </Link>
          <Link to="/admin/actions" className="btn btn-secondary w-full">
            ⚙️ Configurer les types
          </Link>
          <Link to="/leaderboard" className="btn btn-outline w-full">
            🏆 Voir le classement
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Activité récente
        </h3>
        {loadingActivity ? (
          <div className="text-gray-500 text-center py-8">
            <div className="spinner"></div>
            Chargement...
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            Aucune activité récente
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((action) => (
              <div
                key={action.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-2xl">{action.status === 'validated' ? '✅' : action.status === 'rejected' ? '❌' : '⏳'}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {getActionTypeLabel(action.type)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {action.email || 'Email inconnu'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    {formatTimeAgo(action.date || action.validatedAt)}
                  </div>
                  {action.status === 'validated' && action.points > 0 && (
                    <div className="text-sm font-bold text-green-600">
                      +{action.points} pts
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

