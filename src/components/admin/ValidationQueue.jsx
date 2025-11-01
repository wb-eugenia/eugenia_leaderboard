import { useState, useEffect } from 'react';
import { getActionsToValidate } from '../../services/googleSheets';
import { getActionTypes } from '../../services/configService';
import ActionDetailModal from './ActionDetailModal';

export default function ValidationQueue() {
  const [pendingActions, setPendingActions] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingActions();
  }, []);

  const loadPendingActions = async () => {
    try {
      const actions = await getActionsToValidate();
      setPendingActions(actions);
    } catch (error) {
      console.error('Error loading pending actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action) => {
    setSelectedAction(action);
  };

  const handleCloseModal = () => {
    setSelectedAction(null);
    loadPendingActions(); // Refresh après validation
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
      return `Il y a ${diffHours}h`;
    }
  };

  const getActionTypeLabel = (typeId) => {
    const actionTypes = getActionTypes();
    const type = actionTypes.find(t => t.id === typeId);
    return type ? `${type.emoji} ${type.label}` : typeId;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          📋 Actions en attente
          {pendingActions.length > 0 && (
            <span className="badge badge-danger ml-2">{pendingActions.length}</span>
          )}
        </h2>
        <button
          onClick={loadPendingActions}
          className="btn btn-secondary"
        >
          🔄 Rafraîchir
        </button>
      </div>

      {pendingActions.length === 0 ? (
        <div className="card text-center py-12">
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
                className="card hover:shadow-xl transition-shadow cursor-pointer"
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
                  <button className="btn btn-primary">
                    Voir détails
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

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

