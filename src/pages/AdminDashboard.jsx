import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActionsToValidate, getLeaderboard, getAllActions } from '../services/googleSheets';
import { SCHOOL_EMAIL_DOMAINS, SCHOOL_NAMES } from '../constants/routes';

export default function AdminDashboard({ school = 'eugenia' }) {
  const [stats, setStats] = useState({
    pendingActions: 0,
    totalActions: 0,
    totalUsers: 0,
    totalPoints: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [allActivity, setAllActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [activityFilter, setActivityFilter] = useState('all'); // 'all', 'manual', 'auto'
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadStats();
    loadRecentActivity();
    loadAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [school]);

  useEffect(() => {
    applyActivityFilter();
  }, [activityFilter, allActivity]);

  const loadStats = async () => {
    try {
      const pending = await getActionsToValidate(school);
      const leaderboard = await getLeaderboard(school);
      const actionsList = await getAllActions(school);

      // Filtrer par école si nécessaire
      const emailDomain = SCHOOL_EMAIL_DOMAINS[school];
      const filteredPending = pending.filter(action => 
        action.email && action.email.toLowerCase().includes(emailDomain)
      );
      const filteredLeaderboard = leaderboard.filter(user => 
        user.email && user.email.toLowerCase().includes(emailDomain)
      );
      const filteredActions = actionsList.filter(action => 
        action.email && action.email.toLowerCase().includes(emailDomain)
      );

      const totalPoints = filteredLeaderboard.reduce((sum, user) => sum + (user.totalPoints || 0), 0);

      setStats({
        pendingActions: filteredPending.length,
        totalActions: filteredActions.length,
        totalUsers: filteredLeaderboard.length,
        totalPoints
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRecentActivity = async () => {
    try {
      setLoadingActivity(true);
      const allActions = await getAllActions(school);
      
      // Filtrer par école
      const emailDomain = SCHOOL_EMAIL_DOMAINS[school];
      const filteredActions = allActions.filter(action => 
        action.email && action.email.toLowerCase().includes(emailDomain)
      );
      
      // Trier par date
      const sorted = filteredActions.sort((a, b) => {
        const dateA = new Date(a.date || a.validatedAt || 0);
        const dateB = new Date(b.date || b.validatedAt || 0);
        return dateB - dateA;
      });
      
      setAllActivity(sorted);
    } catch (error) {
      console.error('Error loading activity:', error);
    } finally {
      setLoadingActivity(false);
    }
  };

  const applyActivityFilter = () => {
    let filtered = [...allActivity];
    
    if (activityFilter === 'manual') {
      filtered = allActivity.filter(action => action.validatedBy && action.validatedBy !== 'system');
    } else if (activityFilter === 'auto') {
      filtered = allActivity.filter(action => action.validatedBy === 'system' || action.autoValidated);
    }
    
    // Prendre les 10 plus récentes pour le filtre
    setRecentActivity(filtered.slice(0, 10));
  };

  const loadAlerts = async () => {
    try {
      const allActions = await getAllActions(school);
      const alertsList = [];
      const emailDomain = SCHOOL_EMAIL_DOMAINS[school];
      
      // Filtrer par école d'abord
      const filteredActions = allActions.filter(action => 
        action.email && action.email.toLowerCase().includes(emailDomain)
      );
      
      // Détecter les anomalies
      filteredActions.forEach((action, index) => {
        // Email invalide (ne devrait pas arriver après filtrage, mais on vérifie)
        if (action.email && !action.email.toLowerCase().includes(emailDomain)) {
          alertsList.push({
            id: `alert-email-${index}`,
            type: 'warning',
            icon: '📧',
            title: 'Email invalide',
            message: `${action.email} n'est pas un email ${emailDomain}`,
            actionId: action.id,
            severity: 'medium'
          });
        }
        
        // Date future
        if (action.data && action.data.date) {
          const actionDate = new Date(action.data.date);
          const now = new Date();
          if (actionDate > now) {
            alertsList.push({
              id: `alert-date-future-${index}`,
              type: 'error',
              icon: '📅',
              title: 'Date future',
              message: `L'action a une date dans le futur: ${action.data.date}`,
              actionId: action.id,
              severity: 'high'
            });
          }
        }
        
        // Pas de données
        if (!action.data || Object.keys(action.data).length === 0) {
          alertsList.push({
            id: `alert-no-data-${index}`,
            type: 'warning',
            icon: '⚠️',
            title: 'Données manquantes',
            message: `L'action ${action.type} n'a pas de données`,
            actionId: action.id,
            severity: 'medium'
          });
        }
      });
      
      // Détecter les doublons potentiels
      const actionsByEmailAndType = {};
      filteredActions.forEach(action => {
        const key = `${action.email}-${action.type}`;
        if (!actionsByEmailAndType[key]) {
          actionsByEmailAndType[key] = [];
        }
        actionsByEmailAndType[key].push(action);
      });
      
      Object.entries(actionsByEmailAndType).forEach(([key, actions]) => {
        if (actions.length > 3) {
          alertsList.push({
            id: `alert-duplicate-${key}`,
            type: 'warning',
            icon: '🔁',
            title: 'Nombre d\'actions suspect',
            message: `${actions[0].email} a ${actions.length} actions de type ${actions[0].type}`,
            actionId: actions[0].id,
            severity: 'medium'
          });
        }
      });
      
      setAlerts(alertsList);
    } catch (error) {
      console.error('Error loading alerts:', error);
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
          Dashboard Admin - {SCHOOL_NAMES[school]}
        </h2>
        <p className="text-gray-600">
          Vue d'ensemble du système de gamification pour {SCHOOL_NAMES[school]}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Actions en attente */}
        <Link to="/admin/validate" className="admin-card stats-card pending hover:shadow-2xl transition-shadow">
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
              <div className="badge badge-admin-danger">
                Action requise
              </div>
            </div>
          )}
        </Link>

        {/* Total actions */}
        <div className="admin-card stats-card info">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold" style={{ color: 'var(--eugenia-burgundy)' }}>
                {stats.totalActions}
              </div>
              <div className="text-gray-600 mt-2">Total actions</div>
            </div>
            <div className="text-5xl">📊</div>
          </div>
        </div>

        {/* Total users */}
        <div className="admin-card stats-card success">
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
        <div className="admin-card stats-card info">
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

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="admin-card alert-admin alert-admin-warning">
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--eugenia-burgundy)' }}>
            ⚠️ Alertes & Anomalies ({alerts.length})
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {alerts.map(alert => (
              <div 
                key={alert.id}
                className={`p-3 rounded-lg border ${
                  alert.severity === 'high' ? 'bg-red-50 border-red-200' : 'bg-white border-yellow-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{alert.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{alert.title}</div>
                    <div className="text-sm text-gray-600">{alert.message}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="admin-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold" style={{ color: 'var(--eugenia-burgundy)' }}>
            Activité récente
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActivityFilter('all')}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                activityFilter === 'all' 
                  ? 'btn-admin-primary' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setActivityFilter('manual')}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                activityFilter === 'manual' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Manuelles
            </button>
            <button
              onClick={() => setActivityFilter('auto')}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                activityFilter === 'auto' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Auto
            </button>
          </div>
        </div>
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
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {getActionTypeLabel(action.type)}
                      </span>
                      {/* Badge manuel/auto */}
                      {action.status === 'validated' && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          action.validatedBy === 'system' || action.autoValidated
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {action.validatedBy === 'system' || action.autoValidated ? '🤖 Auto' : '👤 Manuel'}
                        </span>
                      )}
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

