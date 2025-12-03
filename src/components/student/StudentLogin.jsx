import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStudentAuth } from '../../contexts/StudentAuthContext';
import Header from '../shared/Header';
import Footer from '../shared/Footer';

export default function StudentLogin() {
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

    // Déterminer l'école à partir de l'email
    const school = email.toLowerCase().includes('@eugeniaschool.com') ? 'eugenia' : 'albert';
    const result = await login(email, password, school);
    
    if (result.success) {
      const schoolPath = school === 'eugenia' ? '/eugenia-school' : '/albert-school';
      navigate(`${schoolPath}/student/profile`);
    } else if (result.error === 'ADMIN_REDIRECT') {
      // Rediriger vers la page de connexion admin
      navigate(result.redirectPath);
    } else {
      setError(result.error || 'Erreur de connexion');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-md w-full border border-gray-100">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🎓</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Connexion Étudiant
            </h1>
            <p className="text-gray-500">
              Connectez-vous avec votre email @eugeniaschool.com
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-eugenia-burgundy focus:ring-4 focus:ring-eugenia-burgundy/10 transition-all text-gray-900 bg-gray-50 focus:bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prenom.nom@eugeniaschool.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-eugenia-burgundy focus:ring-4 focus:ring-eugenia-burgundy/10 transition-all text-gray-900 bg-gray-50 focus:bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                required
              />
              <p className="text-xs text-gray-500 mt-2 text-right">
                Mot de passe par défaut: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">1234</span>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-eugenia-burgundy to-eugenia-pink text-white font-bold text-lg py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <Link to="/" className="text-gray-500 hover:text-eugenia-burgundy font-medium transition-colors inline-flex items-center gap-2">
              <span>←</span> Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

