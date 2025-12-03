import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTopAssociations } from '../../services/associationsApi';
import { useSchoolTheme } from '../../hooks/useSchoolTheme';

export default function TopAssociations({ school = 'eugenia', limit = 3 }) {
  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useSchoolTheme(school);
  const schoolPath = school === 'eugenia' ? '/eugenia-school' : '/albert-school';

  useEffect(() => {
    async function fetchTopAssociations() {
      try {
        setLoading(true);
        const data = await getTopAssociations(limit);
        setAssociations(data);
      } catch (error) {
        console.error('Error fetching top associations:', error);
        setAssociations([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTopAssociations();
  }, [limit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">⏳</div>
          <div className="text-gray-500">Chargement des associations...</div>
        </div>
      </div>
    );
  }

  if (associations.length === 0) {
    return null; // Ne rien afficher si pas d'associations
  }

  return (
    <section className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🏆 Top {limit} Associations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Les associations les plus populaires du campus
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {associations.map((asso, index) => (
            <div
              key={asso.id}
              className={`
                relative bg-white rounded-2xl overflow-hidden shadow-lg
                border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2
                ${index === 0 ? 'border-yellow-400 ring-4 ring-yellow-200' : 'border-gray-100'}
              `}
            >
              {/* Badge Top */}
              {index === 0 && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-10 shadow-lg">
                  🥇 #1
                </div>
              )}
              {index === 1 && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-10 shadow-lg">
                  🥈 #2
                </div>
              )}
              {index === 2 && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-10 shadow-lg">
                  🥉 #3
                </div>
              )}

              <div className="p-8 text-center">
                {/* Emoji */}
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center text-5xl shadow-inner">
                  {asso.emoji || '🤝'}
                </div>

                {/* Nom */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{asso.name}</h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 text-sm line-clamp-2 min-h-[2.5rem]">
                  {asso.description || 'Association étudiante'}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: theme.primary }}>
                      {asso.membersCount || 0}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Membres</div>
                  </div>
                  <div className="w-px h-12 bg-gray-200"></div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-700 px-3 py-1 bg-gray-100 rounded-full">
                      {asso.category || 'Autre'}
                    </div>
                  </div>
                </div>

                {/* Bouton */}
                <Link
                  to={`${schoolPath}/associations`}
                  className="block w-full py-3 rounded-xl font-semibold transition-all duration-200"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                    color: 'white'
                  }}
                >
                  Voir les détails
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton voir toutes */}
        <div className="text-center">
          <Link
            to={`${schoolPath}/associations`}
            className="inline-block px-8 py-3 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:border-gray-300 transition-colors"
          >
            Voir toutes les associations →
          </Link>
        </div>
      </div>
    </section>
  );
}

