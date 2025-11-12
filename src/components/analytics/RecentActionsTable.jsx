import React, { useState } from 'react';
import { formatDateTime } from '../../utils/analyticsHelpers';

export default function RecentActionsTable({ actions, onStatusChange }) {
  const [statusFilter, setStatusFilter] = useState('all');
  
  // S'assurer que actions est un tableau
  const actionsArray = Array.isArray(actions) ? actions : [];

  if (!actionsArray || actionsArray.length === 0) {
    return (
      <div className="admin-card">
        <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--eugenia-burgundy)' }}>
          📋 Dernières Actions (24h)
        </h3>
        <div className="empty-state text-center py-8">
          <p className="text-gray-500 mb-2">📊 Aucune action pour cette période</p>
          <p className="text-sm text-gray-400">Les actions soumises dans les dernières 24h apparaîtront ici</p>
        </div>
      </div>
    );
  }

  const filteredActions = statusFilter === 'all'
    ? actionsArray
    : actionsArray.filter(a => a.status === statusFilter);

  return (
    <div className="admin-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold" style={{ color: 'var(--eugenia-burgundy)' }}>
          📋 Dernières Actions (24h)
        </h3>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-control"
          style={{ width: 'auto' }}
        >
          <option value="all">Toutes</option>
          <option value="validated">Validées</option>
          <option value="rejected">Refusées</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="admin-table w-full">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left">Date/Heure</th>
              <th className="px-4 py-3 text-left">Étudiant</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-right">Points</th>
              <th className="px-4 py-3 text-center">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filteredActions.map((action) => (
              <tr key={action.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{formatDateTime(action.created_at)}</td>
                <td className="px-4 py-3">{action.student_name}</td>
                <td className="px-4 py-3">
                  {action.emoji} {action.action_type}
                </td>
                <td className="px-4 py-3 text-right font-bold">{action.points || 0} pts</td>
                <td className="px-4 py-3 text-center">
                  {action.status === 'validated' ? (
                    <span className="text-green-600 text-xl">✅</span>
                  ) : (
                    <span className="text-red-600 text-xl">❌</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

