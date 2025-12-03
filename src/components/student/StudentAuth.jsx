import { Navigate } from 'react-router-dom';
import { useStudentAuth } from '../../contexts/StudentAuthContext';

export default function StudentAuth({ children }) {
  const { student, loading } = useStudentAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-eugenia-burgundy via-eugenia-pink to-eugenia-burgundy">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!student) {
    return <Navigate to="/student/login" replace />;
  }

  return children;
}

