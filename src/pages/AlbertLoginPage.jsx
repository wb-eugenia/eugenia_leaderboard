import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStudentAuth } from '../contexts/StudentAuthContext';

export default function AlbertLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useStudentAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password, 'albert');
    
    if (result.success) {
      navigate('/albert-school');
    } else if (result.error === 'ADMIN_REDIRECT') {
      // Rediriger vers le dashboard admin
      navigate(result.redirectPath);
    } else {
      setError(result.error || 'Erreur de connexion');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E40AF] via-[#3B82F6] to-[#1E40AF] flex items-center justify-center py-12 px-4">
      <div className="card max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎓</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Connexion Albert School
            </h1>
            <p className="text-gray-600">
              Connectez-vous avec votre email @albertschool.com
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prenom.nom@albertschool.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe par défaut: 1234"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Mot de passe par défaut: <strong>1234</strong>
              </p>
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full text-lg py-4"
              disabled={loading}
              style={{ backgroundColor: '#1E40AF' }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-white hover:underline">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
    </div>
  );
}

