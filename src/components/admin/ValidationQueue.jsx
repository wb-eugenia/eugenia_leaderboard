import { useState, useEffect } from 'react';
import { getActionsToValidate, getAllActions, deleteAction, invalidateCache } from '../../services/googleSheets';
import { getActionTypes } from '../../services/configService';
import ActionDetailModal from './ActionDetailModal';

export default function ValidationQueue() {
  const [pendingActions, setPendingActions] = useState([]);
  const [validatedActions, setValidatedActions] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionTypes, setActionTypes] = useState([]);
  const [deletingIds, setDeletingIds] = useState(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('📥 Loading data...');
      
      const [actions, types, allActions] = await Promise.all([
        getActionsToValidate(),
        getActionTypes(),
        getAllActions()
      ]);
      
      console.log('📥 Loaded pending actions:', actions.length);
      console.log('📥 Loaded all actions:', allActions.length);
      
      setPendingActions(actions);
      setActionTypes(types);
      
      // Filtrer les actions validées ou refusées
      const validated = allActions.filter(a => 
        a.status === 'validated' || a.status === 'rejected' || a.decision === 'validated' || a.decision === 'rejected'
      );
      
      console.log('📥 Filtered validated actions:', validated.length);
      setValidatedActions(validated);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingActions = async () => {
    try {
      const actions = await getActionsToValidate();
      setPendingActions(actions);
    } catch (error) {
      console.error('Error loading pending actions:', error);
    }
  };

  const handleActionClick = (action) => {
    setSelectedAction(action);
  };

  const handleCloseModal = () => {
    setSelectedAction(null);
    loadPendingActions();
    loadData(); // Refresh toutes les données
  };

  const handleDeleteAction = async (actionId, e) => {
    e.stopPropagation(); // Empêcher l'ouverture du modal
    
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer définitivement cette action ? Cette action est irréversible.')) {
      return;
    }

    setDeletingIds(prev => new Set(prev).add(actionId));

    try {
      console.log('🗑️ Deleting action:', actionId);
      
      // Invalider le cache AVANT la suppression
      invalidateCache('actions_pending');
      invalidateCache('actions_all');
      invalidateCache('leaderboard');
      
      const result = await deleteAction(actionId);
      console.log('🗑️ Delete result:', result);
      
      // Vérifier si la suppression a réussi (vérifier aussi response.ok si data n'est pas défini)
      const success = result?.success === true || (result && !result.error);
      
      if (success) {
        // Invalider le cache à nouveau après la suppression
        invalidateCache('actions_pending');
        invalidateCache('actions_all');
        invalidateCache('leaderboard');
        
        // Attendre un peu pour que le cache soit invalidé
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Recharger les données sans utiliser le cache
        console.log('🔄 Reloading data after delete...');
        await loadData();
      } else {
        alert('Erreur lors de la suppression : ' + (result?.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Error deleting action:', error);
      alert('Erreur lors de la suppression : ' + error.message);
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Il y a quelques instants';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
      return 'Il y a quelques instants';
    } else if (diffMins < 60) {
      return `Il y a ${diffMins}min`;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) {
        return `Il y a ${diffHours}h`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        return `Il y a ${diffDays}j`;
      }
    }
  };

  const getActionTypeLabel = (typeId) => {
    const type = actionTypes.find(t => t.id === typeId);
    return type ? `${type.emoji || ''} ${type.label}` : typeId;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eugenia-yellow"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section Nouvelles Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--eugenia-burgundy)' }}>
            Nouvelles actions en attente
            {pendingActions.length > 0 && (
              <span className="badge badge-admin-danger ml-2">{pendingActions.length}</span>
            )}
          </h2>
          <button
            onClick={loadPendingActions}
            className="btn btn-admin-secondary"
          >
            🔄 Rafraîchir
          </button>
        </div>

        {pendingActions.length === 0 ? (
          <div className="admin-card text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-gray-500 text-lg">
              Aucune action en attente de validation !
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingActions.map((action) => {
              if (!action || !action.email) return null;
              const emailParts = action.email.split('@')[0].split('.');
              const firstName = emailParts[0] || 'User';
              const lastName = emailParts[1] || '';
              const fullName = `${firstName} ${lastName}`;

              return (
                <div
                  key={action.id}
                  className="admin-card hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handleActionClick(action)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🔴</div>
                      <div>
                        <div className="font-bold text-xl text-gray-900">
                          {fullName}
                        </div>
                        <div className="text-gray-600 text-lg">
                          {getActionTypeLabel(action.type)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          🕐 {formatTimeAgo(action.date)}
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-admin-primary">
                      Voir détails
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section Anciennes Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--eugenia-burgundy)' }}>
            Anciennes actions (validées/refusées)
            {validatedActions.length > 0 && (
              <span className="badge badge-admin-info ml-2">{validatedActions.length}</span>
            )}
          </h2>
          <button
            onClick={loadData}
            className="btn btn-admin-secondary"
          >
            🔄 Rafraîchir
          </button>
        </div>

        {validatedActions.length === 0 ? (
          <div className="admin-card text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-lg">
              Aucune action validée ou refusée pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {validatedActions.map((action) => {
              if (!action || !action.email) return null;
              const emailParts = action.email.split('@')[0].split('.');
              const firstName = emailParts[0] || 'User';
              const lastName = emailParts[1] || '';
              const fullName = `${firstName} ${lastName}`;
              const isValidated = action.status === 'validated' || action.decision === 'validated';
              const isRejected = action.status === 'rejected' || action.decision === 'rejected';

              return (
                <div
                  key={action.id}
                  className={`admin-card hover:shadow-xl transition-shadow ${
                    isValidated ? 'border-l-4 border-green-500' : 
                    isRejected ? 'border-l-4 border-red-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-4xl">
                        {isValidated ? '✅' : isRejected ? '❌' : '📋'}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-xl text-gray-900">
                          {fullName}
                        </div>
                        <div className="text-gray-600 text-lg">
                          {getActionTypeLabel(action.type)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {isValidated && action.points > 0 && (
                            <span className="text-green-600 font-semibold">+{action.points} pts</span>
                          )}
                          {isValidated && action.points === 0 && (
                            <span className="text-gray-500">0 pts</span>
                          )}
                          {isRejected && (
                            <span className="text-red-600">Refusé</span>
                          )}
                          {' • '}
                          🕐 {formatDate(action.validatedAt || action.date)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleActionClick(action)}
                        className="btn btn-admin-secondary"
                      >
                        Voir détails
                      </button>
                      <button
                        onClick={(e) => handleDeleteAction(action.id, e)}
                        disabled={deletingIds.has(action.id)}
                        className="btn btn-admin-danger"
                        title="Supprimer définitivement"
                      >
                        {deletingIds.has(action.id) ? '⏳' : '🗑️'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedAction && (
        <ActionDetailModal
          action={selectedAction}
          onClose={handleCloseModal}
          onActionComplete={handleCloseModal}
        />
      )}
    </div>
  );
}

