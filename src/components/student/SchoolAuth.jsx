import { Navigate } from 'react-router-dom';
import { useStudentAuth } from '../../contexts/StudentAuthContext';

/**
 * Composant de protection de route pour les pages d'école
 * Redirige vers la page de connexion si l'utilisateur n'est pas connecté
 */
export default function SchoolAuth({ children, school = 'eugenia' }) {
  const { student, loading } = useStudentAuth();
  const loginPath = school === 'eugenia' ? '/eugenia-school/login' : '/albert-school/login';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (!student) {
    return <Navigate to={loginPath} replace />;
  }

  // Vérifier que l'étudiant est bien de la bonne école
  if (student.school && student.school !== school) {
    // Si l'étudiant est connecté mais pour une autre école, rediriger vers sa page de connexion
    const otherLoginPath = student.school === 'eugenia' ? '/eugenia-school/login' : '/albert-school/login';
    return <Navigate to={otherLoginPath} replace />;
  }

  return <>{children}</>;
}

