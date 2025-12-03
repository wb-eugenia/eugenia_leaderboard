import { useState, useEffect } from 'react';
import { getAssociationById, getAssociationMembers, getAssociationEvents } from '../services/associationsApi';

/**
 * Hook pour récupérer les données d'une association
 */
export function useAssociation(associationId) {
  const [association, setAssociation] = useState(null);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!associationId) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [associationData, membersData, eventsData] = await Promise.all([
          getAssociationById(associationId),
          getAssociationMembers(associationId),
          getAssociationEvents(associationId)
        ]);

        setAssociation(associationData);
        setMembers(membersData);
        setEvents(eventsData);
      } catch (err) {
        console.error('Error fetching association data:', err);
        setError(err.message || 'Failed to fetch association data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [associationId]);

  return {
    association,
    members,
    events,
    loading,
    error,
    refetch: () => {
      if (associationId) {
        setLoading(true);
        Promise.all([
          getAssociationById(associationId),
          getAssociationMembers(associationId),
          getAssociationEvents(associationId)
        ]).then(([associationData, membersData, eventsData]) => {
          setAssociation(associationData);
          setMembers(membersData);
          setEvents(eventsData);
          setLoading(false);
        }).catch(err => {
          setError(err.message);
          setLoading(false);
        });
      }
    }
  };
}

