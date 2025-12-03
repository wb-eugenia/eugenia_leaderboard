import { useState, useEffect } from 'react';
import { getAssociationMembers } from '../services/associationsApi';
import { useStudentAuth } from '../contexts/StudentAuthContext';

/**
 * Hook pour vérifier si l'utilisateur est admin d'une association
 */
export function useAssociationAuth(associationId) {
  const { student } = useStudentAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!associationId || !student?.email) {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        setLoading(true);
        setError(null);

        const members = await getAssociationMembers(associationId);
        const userMember = members.find(m => m.email.toLowerCase() === student.email.toLowerCase());

        if (userMember) {
          setIsMember(true);
          setIsAdmin(userMember.role === 'admin');
        } else {
          setIsMember(false);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Error checking association auth:', err);
        setError(err.message || 'Failed to check authorization');
        setIsAdmin(false);
        setIsMember(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [associationId, student?.email]);

  return {
    isAdmin,
    isMember,
    loading,
    error
  };
}

