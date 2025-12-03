import React, { useState } from 'react';
import OverviewCards from '../components/analytics/OverviewCards';
import TimelineChart from '../components/analytics/TimelineChart';
import PopularActionsChart from '../components/analytics/PopularActionsChart';
import ClassDistribution from '../components/analytics/ClassDistribution';
import TopStudentsTable from '../components/analytics/TopStudentsTable';
import RecentActionsTable from '../components/analytics/RecentActionsTable';
import InsightsCards from '../components/analytics/InsightsCards';
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import useAnalytics from '../hooks/useAnalytics';

export default function Analytics({ school = 'eugenia' }) {
  const [filters, setFilters] = useState({
    period: '30d',
    classes: [],
    actionTypes: [],
  });

  const { data, loading, error, refetch } = useAnalytics(filters, school);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eugenia-yellow mx-auto"></div>
        <p className="mt-4">Chargement des analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <p>Erreur lors du chargement des analytics : {error.message}</p>
        <button onClick={refetch} className="btn btn-admin-primary mt-4">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--eugenia-burgundy)' }}>
          📊 Analytics
        </h1>
        <p className="text-gray-600">Statistiques et insights détaillés sur l'activité du challenge</p>
      </div>

      <AnalyticsFilters filters={filters} onChange={setFilters} data={data} />

      {data && (
        <>
          <OverviewCards data={data.overview} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <TimelineChart data={data.timeline} />
            <PopularActionsChart data={data.popularActions} />
          </div>

          <div className="mb-8">
            <ClassDistribution data={data.byClass} />
          </div>

          <InsightsCards insights={data.insights} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopStudentsTable students={data.topStudents} />
            <RecentActionsTable actions={data.recentActions} />
          </div>
        </>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

