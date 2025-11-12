import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function useAnalytics(filters = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const period = filters.period || '30d';

      const [overview, timeline, popularActions, byClass, topStudents, insights, recentActions] = await Promise.all([
        fetch(`${API_URL}/api/analytics/overview?period=${period}`).then(r => r.json()),
        fetch(`${API_URL}/api/analytics/timeline?period=${period}`).then(r => r.json()),
        fetch(`${API_URL}/api/analytics/popular-actions?limit=5`).then(r => r.json()),
        fetch(`${API_URL}/api/analytics/by-class`).then(r => r.json()),
        fetch(`${API_URL}/api/analytics/top-students?limit=10`).then(r => r.json()),
        fetch(`${API_URL}/api/analytics/insights`).then(r => r.json()),
        fetch(`${API_URL}/api/analytics/recent-actions?hours=24&limit=20`).then(r => r.json()),
      ]);

      // S'assurer que les données sont des tableaux si attendu
      setData({
        overview,
        timeline: Array.isArray(timeline) ? timeline : [],
        popularActions: Array.isArray(popularActions) ? popularActions : [],
        byClass: Array.isArray(byClass) ? byClass : [],
        topStudents: Array.isArray(topStudents) ? topStudents : [],
        recentActions: Array.isArray(recentActions) ? recentActions : [],
        insights,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters.period]);

  return { data, loading, error, refetch: fetchData };
}

