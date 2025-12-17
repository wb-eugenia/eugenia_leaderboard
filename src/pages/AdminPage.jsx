import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import '../styles/admin.css';
import { useSchoolTheme } from '../hooks/useSchoolTheme';

export default function AdminPage({ school = 'eugenia' }) {
  const navigate = useNavigate();
  const location = useLocation();
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

  const isActive = (path) => {
    if (path === adminPath) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className="min-h-screen admin-panel flex">
      {/* Sidebar */}
      <aside 
        className="w-64 bg-white shadow-lg border-r border-gray-200 flex-shrink-0 flex flex-col"
        style={{ minHeight: '100vh' }}
      >
        {/* Header Sidebar */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0" style={{ backgroundColor: theme.primary }}>
          <h2 className="text-xl font-bold text-white mb-2">
            ⚙️ Admin Panel
          </h2>
          <p className="text-sm text-white/80">{schoolName}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <Link 
            to={adminPath} 
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive(adminPath) && location.pathname === adminPath
                ? 'bg-gray-100 text-gray-900 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <span className="text-xl">📊</span>
            <span>Dashboard</span>
          </Link>
          <Link 
            to={`${adminPath}/validate`} 
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive(`${adminPath}/validate`)
                ? 'bg-gray-100 text-gray-900 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <span className="text-xl">✅</span>
            <span>Validation</span>
          </Link>
          <Link 
            to={`${adminPath}/reports`} 
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive(`${adminPath}/reports`)
                ? 'bg-gray-100 text-gray-900 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <span className="text-xl">🚨</span>
            <span>Signalements</span>
          </Link>
          <Link 
            to={`${adminPath}/actions`} 
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive(`${adminPath}/actions`)
                ? 'bg-gray-100 text-gray-900 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <span className="text-xl">🎯</span>
            <span>Types d'actions</span>
          </Link>
          <Link 
            to={`${adminPath}/leaderboard`} 
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive(`${adminPath}/leaderboard`)
                ? 'bg-gray-100 text-gray-900 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <span className="text-xl">👥</span>
            <span>Élèves</span>
          </Link>
          <Link 
            to={`${adminPath}/analytics`} 
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive(`${adminPath}/analytics`)
                ? 'bg-gray-100 text-gray-900 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            <span className="text-xl">📈</span>
            <span>Analytics</span>
          </Link>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
          <Link 
            to={schoolPath} 
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors mb-2"
          >
            <span>←</span>
            <span>Retour au site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span>🚪</span>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header Admin */}
        <header className="admin-header shadow-sm bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {location.pathname === adminPath ? 'Dashboard' : 
                 location.pathname.includes('/validate') ? 'Validation' :
                 location.pathname.includes('/reports') ? 'Signalements' :
                 location.pathname.includes('/actions') ? 'Types d\'actions' :
                 location.pathname.includes('/leaderboard') ? 'Élèves' :
                 location.pathname.includes('/analytics') ? 'Analytics' : 'Admin'}
              </h1>
              <div className="badge badge-admin-info">
                Mode Admin - {schoolName}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

