import { useState, useEffect } from 'react';
import { SCHOOL_EMAIL_DOMAINS } from '../constants/routes';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function useAnalytics(filters = {}, school = 'eugenia') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const period = filters.period || '30d';

      const emailDomain = SCHOOL_EMAIL_DOMAINS[school];
      
      const [overview, timeline, popularActions, byClass, topStudents, insights, recentActions] = await Promise.all([
        fetch(`${API_URL}/api/analytics/overview?period=${period}`).then(r => r.json()),
        fetch(`${API_URL}/api/analytics/timeline?period=${period}`).then(r => r.json()),
        fetch(`${API_URL}/api/analytics/popular-actions?limit=5`).then(r => r.json()),
        fetch(`${API_URL}/api/analytics/by-class`).then(r => r.json()),
        fetch(`${API_URL}/api/analytics/top-students?limit=10`).then(r => r.json()),
        fetch(`${API_URL}/api/analytics/insights`).then(r => r.json()),
        fetch(`${API_URL}/api/analytics/recent-actions?hours=24&limit=20`).then(r => r.json()),
      ]);

      // Filtrer par école
      const filterBySchool = (items) => {
        if (!Array.isArray(items)) return [];
        return items.filter(item => {
          if (item.email) {
            return item.email.toLowerCase().includes(emailDomain);
          }
          // Pour les données qui n'ont pas d'email direct, on les garde (comme les statistiques agrégées)
          return true;
        });
      };

      // S'assurer que les données sont des tableaux si attendu et filtrées par école
      setData({
        overview,
        timeline: filterBySchool(Array.isArray(timeline) ? timeline : []),
        popularActions: filterBySchool(Array.isArray(popularActions) ? popularActions : []),
        byClass: filterBySchool(Array.isArray(byClass) ? byClass : []),
        topStudents: filterBySchool(Array.isArray(topStudents) ? topStudents : []),
        recentActions: filterBySchool(Array.isArray(recentActions) ? recentActions : []),
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
  }, [filters.period, school]);

  return { data, loading, error, refetch: fetchData };
}

