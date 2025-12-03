import { Navigate } from 'react-router-dom';
import { SCHOOLS } from '../../constants/routes';

export default function AdminAuth({ children, school }) {
  const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
  const adminSchool = sessionStorage.getItem('admin_school');
  
  // Si pas authentifié, rediriger vers la page de login de l'école
  if (!isAuthenticated) {
    const loginPath = school === SCHOOLS.ALBERT ? '/albert-school/login' : '/eugenia-school/login';
    return <Navigate to={loginPath} replace />;
  }
  
  // Si l'admin est connecté mais pour une autre école, rediriger vers son dashboard
  if (adminSchool && school && adminSchool !== school) {
    const adminPath = adminSchool === SCHOOLS.ALBERT ? '/albert-school/admin' : '/eugenia-school/admin';
    return <Navigate to={adminPath} replace />;
  }
  
  return children;
}

