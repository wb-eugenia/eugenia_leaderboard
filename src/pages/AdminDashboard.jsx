import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActionsToValidate, getLeaderboard } from '../services/googleSheets';
import { resetToRealStudents } from '../utils/resetData';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingActions: 0,
    totalActions: 0,
    totalUsers: 0,
    totalPoints: 0
  });

  useEffect(() => {
    loadStats();
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
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={resetToRealStudents}
            className="btn btn-outline w-full text-sm"
          >
            🔄 Réinitialiser avec les vrais étudiants Eugenia
          </button>
          <p className="text-xs text-gray-500 mt-2">
            (35 étudiants B1 + B2 avec 0 points)
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Activité récente
        </h3>
        <div className="space-y-2">
          <div className="text-gray-500 text-center py-8">
            Aucune activité récente
          </div>
        </div>
      </div>
    </div>
  );
}

