import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// URL de l'API backend
const API_URL = import.meta.env.VITE_API_URL;

export default function AdminLogin({ school = 'eugenia' }) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Appel à l'API backend pour l'authentification
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: inclure les cookies
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Session créée via cookie httpOnly (automatique)
        // Stocker aussi en sessionStorage pour l'UI (optionnel)
        sessionStorage.setItem('admin_authenticated', 'true');
        sessionStorage.setItem('admin_email', credentials.email);
        
        // Rediriger vers le dashboard admin de l'école
        const basePath = school === 'albert' ? '/albert-school/admin' : '/eugenia-school/admin';
        navigate(basePath);
      } else {
        setError(data.error?.message || data.message || 'Email ou mot de passe incorrect');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Fallback: vérification locale si l'API n'est pas disponible
      // (pour le développement)
      const FALLBACK_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
      const FALLBACK_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
      
      if (FALLBACK_EMAIL && FALLBACK_PASSWORD &&
          credentials.email === FALLBACK_EMAIL &&
          credentials.password === FALLBACK_PASSWORD) {
        sessionStorage.setItem('admin_authenticated', 'true');
        sessionStorage.setItem('admin_email', credentials.email);
        const basePath = school === 'albert' ? '/albert-school/admin' : '/eugenia-school/admin';
        navigate(basePath);
      } else {
        setError('Erreur de connexion. Vérifiez vos identifiants ou réessayez plus tard.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Nom de l'école pour l'affichage
  const schoolName = school === 'albert' ? 'Albert School' : 'Eugenia School';
  const schoolEmoji = school === 'albert' ? '🎓' : '⚙️';

  return (
    <div className="min-h-screen bg-gradient-to-br from-eugenia-burgundy to-eugenia-pink flex items-center justify-center px-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {schoolEmoji} Connexion Admin
          </h1>
          <p className="text-gray-600">
            Panel d'administration {schoolName}
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
              placeholder={school === 'albert' ? 'admin@albertschool.com' : 'admin@eugeniaschool.com'}
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
      </div>
    </div>
  );
}
