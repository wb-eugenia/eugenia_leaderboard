import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../styles/admin.css';

export default function AdminPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    navigate('/admin/login');
  };
  return (
    <div className="min-h-screen admin-panel">
      {/* Header Admin */}
      <header className="admin-header shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">
                ⚙️ Panel Admin
              </h1>
              <Link to="/" className="text-white hover:text-eugenia-yellow transition-colors">
                ← Retour au site
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="badge badge-admin-info">
                Mode Admin
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
          <div className="flex gap-2 py-2">
            <Link 
              to="/admin" 
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/admin/validate" 
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Validation
            </Link>
            <Link 
              to="/admin/actions" 
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Types d'actions
            </Link>
            <Link 
              to="/admin/leaderboard" 
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Eleves
            </Link>
            <Link 
              to="/admin/automations" 
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Automatisations
            </Link>
            <Link 
              to="/admin/analytics" 
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Analytics
            </Link>
            <Link 
              to="/admin/google-sheets" 
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-blue-600 font-semibold"
            >
              Google Sheets
            </Link>
            <Link 
              to="/admin/rewards" 
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Landing Page
            </Link>
            <Link 
              to="/admin/guide" 
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-eugenia-yellow font-semibold"
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

