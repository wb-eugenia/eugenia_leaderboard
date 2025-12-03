import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStudentAuth } from '../contexts/StudentAuthContext';

export default function EugeniaLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useStudentAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password, 'eugenia');
    
    if (result.success) {
      navigate('/eugenia-school');
    } else if (result.error === 'ADMIN_REDIRECT') {
      // Rediriger vers le dashboard admin
      navigate(result.redirectPath);
    } else {
      setError(result.error || 'Erreur de connexion');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#671324] via-[#E33054] to-[#671324] flex items-center justify-center py-12 px-4">
      <div className="card max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎓</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Connexion Eugenia School
            </h1>
            <p className="text-gray-600">
              Connectez-vous avec votre email @eugeniaschool.com
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
                placeholder="prenom.nom@eugeniaschool.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe par défaut: 1234"
                required
              />
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

