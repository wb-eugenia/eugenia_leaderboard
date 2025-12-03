import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger automatiquement après 5 secondes vers la page de sélection d'école
    const timer = setTimeout(() => {
      navigate('/select-school');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white mb-4">404</h1>
          <div className="text-6xl mb-6">🔍</div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Page non trouvée
        </h2>
        
        <p className="text-xl text-gray-300 mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <p className="text-white mb-4">
            <strong>💡 Astuce :</strong> Chaque école a maintenant son propre espace avec des routes préfixées.
          </p>
          <div className="text-left text-gray-300 space-y-2">
            <p>Pour <strong className="text-white">Eugenia School</strong> :</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><code className="bg-black/30 px-2 py-1 rounded">/eugenia-school</code></li>
              <li><code className="bg-black/30 px-2 py-1 rounded">/eugenia-school/student/profile</code></li>
              <li><code className="bg-black/30 px-2 py-1 rounded">/eugenia-school/report</code></li>
            </ul>
            <p className="mt-4">Pour <strong className="text-white">Albert School</strong> :</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><code className="bg-black/30 px-2 py-1 rounded">/albert-school</code></li>
              <li><code className="bg-black/30 px-2 py-1 rounded">/albert-school/student/profile</code></li>
              <li><code className="bg-black/30 px-2 py-1 rounded">/albert-school/report</code></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/select-school"
            className="bg-gradient-to-r from-eugenia-burgundy to-eugenia-pink text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:scale-105 transition-all"
          >
            🏫 Choisir une école
          </Link>
          <Link
            to="/"
            className="bg-white/10 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/20 transition-all border border-white/20"
          >
            🏠 Retour à l'accueil
          </Link>
        </div>

        <p className="text-gray-400 text-sm mt-8">
          Redirection automatique dans 5 secondes...
        </p>
      </div>
    </div>
  );
}


