import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export default function ExportData({ school = 'eugenia' }) {
  const [exporting, setExporting] = useState(false);

  const exportLeaderboard = async () => {
    setExporting(true);
    try {
      const response = await fetch(`${API_URL}/export/leaderboard`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leaderboard-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'export');
    } finally {
      setExporting(false);
    }
  };

  const exportActions = async (status = 'all') => {
    setExporting(true);
    try {
      const response = await fetch(`${API_URL}/export/actions?status=${status}`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `actions-${status}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'export');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="admin-card">
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--eugenia-burgundy)' }}>
        📊 Export des Données
      </h2>
      
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Classement</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Exporter le classement complet au format CSV
          </p>
          <button
            onClick={exportLeaderboard}
            disabled={exporting}
            className="btn btn-admin-primary"
          >
            {exporting ? '⏳ Export en cours...' : '📥 Exporter le classement (CSV)'}
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Actions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Exporter les actions au format CSV
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => exportActions('all')}
              disabled={exporting}
              className="btn btn-admin-secondary"
            >
              📋 Toutes les actions
            </button>
            <button
              onClick={() => exportActions('validated')}
              disabled={exporting}
              className="btn btn-admin-secondary"
            >
              ✅ Actions validées
            </button>
            <button
              onClick={() => exportActions('pending')}
              disabled={exporting}
              className="btn btn-admin-secondary"
            >
              ⏳ Actions en attente
            </button>
            <button
              onClick={() => exportActions('rejected')}
              disabled={exporting}
              className="btn btn-admin-secondary"
            >
              ❌ Actions refusées
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}









