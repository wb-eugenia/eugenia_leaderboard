import React from 'react';
import { exportToCSV } from '../../utils/analyticsHelpers';

export default function AnalyticsFilters({ filters, onChange, data }) {
  const handlePeriodChange = (e) => {
    onChange({ ...filters, period: e.target.value });
  };

  const handleExport = () => {
    if (data?.topStudents) {
      exportToCSV(data.topStudents, `analytics-top-students-${new Date().toISOString().split('T')[0]}.csv`);
    }
  };

  return (
    <div className="admin-card mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-semibold mb-2">Période</label>
          <select
            value={filters.period || '30d'}
            onChange={handlePeriodChange}
            className="form-control"
          >
            <option value="1d">Aujourd'hui</option>
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">3 derniers mois</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={() => onChange({ period: '30d', classes: [], actionTypes: [] })}
            className="btn btn-admin-secondary"
          >
            Réinitialiser
          </button>
          <button
            onClick={handleExport}
            className="btn btn-admin-primary"
            disabled={!data?.topStudents || data.topStudents.length === 0}
          >
            📥 Exporter CSV
          </button>
        </div>
      </div>
    </div>
  );
}

