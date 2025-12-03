import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SCHOOLS, SCHOOL_EMAIL_DOMAINS } from '../constants/routes';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Détecte l'école à partir de l'email
   */
  const detectSchool = (email) => {
    const emailLower = email.toLowerCase();
    if (emailLower.includes(SCHOOL_EMAIL_DOMAINS[SCHOOLS.EUGENIA])) {
      return SCHOOLS.EUGENIA;
    }
    if (emailLower.includes(SCHOOL_EMAIL_DOMAINS[SCHOOLS.ALBERT])) {
      return SCHOOLS.ALBERT;
    }
    return null;
  };

  /**
   * Vérifie si l'email est un email admin
   */
  const isAdminEmail = (email) => {
    const emailLower = email.toLowerCase();
    return emailLower === 'admin@eugeniaschool.com' || emailLower === 'admin@albertschool.com';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Vérifier que c'est un email admin
    if (!isAdminEmail(credentials.email)) {
      setError('Seuls les emails admin@eugeniaschool.com ou admin@albertschool.com sont acceptés');
      setLoading(false);
      return;
    }

    // Vérifier le mot de passe (1234 pour tous les admins)
    if (credentials.password !== '1234') {
      setError('Mot de passe incorrect');
      setLoading(false);
      return;
    }

    // Détecter l'école depuis l'email
    const school = detectSchool(credentials.email);
    if (!school) {
      setError('Impossible de détecter l\'école depuis l\'email');
      setLoading(false);
      return;
    }

    // Sauvegarder la session
    sessionStorage.setItem('admin_authenticated', 'true');
    sessionStorage.setItem('admin_email', credentials.email);
    sessionStorage.setItem('admin_school', school);

    // Rediriger vers le dashboard admin de l'école détectée
    const adminPath = school === SCHOOLS.EUGENIA ? '/eugenia-school/admin' : '/albert-school/admin';
    navigate(adminPath);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ⚙️ Connexion Admin
          </h1>
          <p className="text-gray-600">
            Panel d'administration
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2 text-gray-900">
              Email administrateur
            </label>
            <input
              type="email"
              className="form-control"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              placeholder="admin@eugeniaschool.com ou admin@albertschool.com"
              required
              autoFocus
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-900">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control pr-10"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Mot de passe : <strong>1234</strong>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Connexion en cours...
              </span>
            ) : (
              '🔐 Se connecter'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🔒 Connexion sécurisée</p>
          <p className="mt-1">Accès réservé aux administrateurs</p>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}

