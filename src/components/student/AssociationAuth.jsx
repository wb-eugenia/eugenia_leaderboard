import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssociationAuth } from '../../hooks/useAssociationAuth';
import { useStudentAuth } from '../../contexts/StudentAuthContext';

/**
 * Composant pour protéger l'accès au panel de gestion d'association
 * Redirige si l'utilisateur n'est pas admin
 */
export default function AssociationAuth({ associationId, school, children }) {
  const navigate = useNavigate();
  const { student } = useStudentAuth();
  const { isAdmin, loading } = useAssociationAuth(associationId);
  const schoolPath = school === 'eugenia' ? '/eugenia-school' : '/albert-school';

  useEffect(() => {
    if (!loading) {
      if (!student) {
        // Rediriger vers la page de connexion
        navigate(`${schoolPath}/login`);
      } else if (!isAdmin) {
        // Rediriger vers la page des associations
        navigate(`${schoolPath}/associations`);
      }
    }
  }, [loading, isAdmin, student, navigate, schoolPath, associationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">⏳</div>
          <div className="text-gray-500">Vérification des permissions...</div>
        </div>
      </div>
    );
  }

  if (!student) {
    return null; // Redirection en cours
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h2>
          <p className="text-gray-600 mb-6">
            Vous devez être administrateur de cette association pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

