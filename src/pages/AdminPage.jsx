import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../styles/admin.css';
import { useSchoolTheme } from '../hooks/useSchoolTheme';

export default function AdminPage({ school = 'eugenia' }) {
  const navigate = useNavigate();
  const theme = useSchoolTheme(school);
  const adminPath = school === 'eugenia' ? '/eugenia-school/admin' : '/albert-school/admin';
  const schoolPath = school === 'eugenia' ? '/eugenia-school' : '/albert-school';
  const schoolName = school === 'eugenia' ? 'Eugenia School' : 'Albert School';

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_school');
    sessionStorage.removeItem('admin_email');
    // Rediriger vers la page de login de l'école correspondante
    const loginPath = school === 'eugenia' ? '/eugenia-school/login' : '/albert-school/login';
    navigate(loginPath);
  };
  
  return (
    <div className="min-h-screen admin-panel">
      {/* Header Admin */}
      <header className="admin-header shadow-md" style={{ backgroundColor: theme.primary }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">
                ⚙️ Panel Admin - {schoolName}
              </h1>
              <Link to={schoolPath} className="text-white hover:text-yellow-300 transition-colors">
                ← Retour au site
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="badge badge-admin-info">
                Mode Admin - {schoolName}
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-outline text-sm"
              >
                🚪 Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="admin-nav shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto">
            <Link 
              to={adminPath} 
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to={`${adminPath}/validate`} 
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Validation
            </Link>
            <Link 
              to={`${adminPath}/reports`} 
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              🚨 Signalements
            </Link>
            <Link 
              to={`${adminPath}/actions`} 
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Types d'actions
            </Link>
            <Link 
              to={`${adminPath}/leaderboard`} 
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Eleves
            </Link>
            <Link 
              to={`${adminPath}/automations`} 
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Automatisations
            </Link>
            <Link 
              to={`${adminPath}/analytics`} 
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Analytics
            </Link>
            <Link 
              to={`${adminPath}/google-sheets`} 
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-blue-600 font-semibold"
            >
              Google Sheets
            </Link>
            <Link 
              to={`${adminPath}/rewards`} 
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Landing Page
            </Link>
            <Link 
              to={`${adminPath}/guide`} 
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-yellow-500 font-semibold"
            >
              Guide
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

