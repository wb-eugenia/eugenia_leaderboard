import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/shared/PageLayout';
import { getLeaderboard } from '../services/googleSheets';

export default function AmbassadeursPage({ school = 'eugenia' }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAmbassadors: 0,
    totalPoints: 0,
    totalMissions: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getLeaderboard();
      
      // Filtrer pour ne garder que les ambassadeurs actifs ce mois
      // On considère qu'un ambassadeur est actif s'il a des points ou des actions
      // TODO: Filtrer par date réelle des actions du mois quand l'API le permettra
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      // Pour l'instant, on prend tous les ambassadeurs actifs (avec points > 0)
      // En production, il faudra filtrer par date des actions du mois
      const activeAmbassadors = data.filter(ambassador => 
        (ambassador.totalPoints || 0) > 0 || (ambassador.actionsCount || 0) > 0
      );
      
      // Trier par points décroissants
      activeAmbassadors.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      
      setLeaderboard(activeAmbassadors);
      
      // Calculer les stats du mois
      const totalPoints = activeAmbassadors.reduce((sum, user) => sum + (user.totalPoints || 0), 0);
      const totalMissions = activeAmbassadors.reduce((sum, user) => sum + (user.actionsCount || 0), 0);
      
      setStats({
        totalAmbassadors: activeAmbassadors.length,
        totalPoints,
        totalMissions
      });
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const missions = [
    {
      id: 1,
      title: 'Post LinkedIn - Événement Campus',
      description: 'Partagez un post LinkedIn sur un événement du campus',
      points: 10,
      icon: '📱',
      category: 'Social Media'
    },
    {
      id: 2,
      title: 'Participation JPO',
      description: 'Participez à une Journée Portes Ouvertes',
      points: 15,
      icon: '🎓',
      category: 'Événement'
    },
    {
      id: 3,
      title: 'Témoignage Étudiant',
      description: 'Partagez votre expérience Eugenia',
      points: 20,
      icon: '💬',
      category: 'Contenu'
    },
    {
      id: 4,
      title: 'Recrutement Référent',
      description: 'Parrainez un nouvel étudiant',
      points: 25,
      icon: '👥',
      category: 'Recrutement'
    },
    {
      id: 5,
      title: 'Hackathon - Participation',
      description: 'Participez à un hackathon',
      points: 30,
      icon: '🏆',
      category: 'Compétition'
    },
    {
      id: 6,
      title: 'Article Blog',
      description: 'Écrivez un article pour le blog Eugenia',
      points: 35,
      icon: '✍️',
      category: 'Contenu'
    }
  ];

  if (loading) {
    return (
      <PageLayout school={school}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="spinner"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout school={school}>
      <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-eugenia-burgundy via-eugenia-pink to-eugenia-burgundy text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            🌟 Ambassadeurs du Mois
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            Découvrez les ambassadeurs les plus actifs ce mois-ci
          </p>
          <div className="inline-block bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 rounded-full text-lg font-semibold">
            📅 {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 -mt-10 mb-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
              <div className="text-5xl mb-4">👥</div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stats.totalAmbassadors}
              </div>
              <div className="text-gray-500 font-medium">Ambassadeurs actifs</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl text-center border-b-4 border-eugenia-pink">
              <div className="text-5xl mb-4">⚡</div>
              <div className="text-4xl font-bold text-eugenia-pink mb-2">
                {stats.totalPoints}
              </div>
              <div className="text-gray-500 font-medium">Points totaux</div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
              <div className="text-5xl mb-4">🎯</div>
              <div className="text-4xl font-bold text-eugenia-yellow mb-2">
                {stats.totalMissions}
              </div>
              <div className="text-gray-500 font-medium">Missions réalisées</div>
            </div>
          </div>
        </div>
      </section>

      {/* Missions disponibles */}
      <section className="px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-3">
            <span className="text-eugenia-yellow">🎯</span> Missions du mois
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {missions.map(mission => (
              <MissionCard key={mission.id} mission={mission} school={school} />
            ))}
          </div>
        </div>
      </section>

      {/* Classement Top 10 */}
      <section className="px-4 mb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center gap-3">
            <span className="text-eugenia-yellow">🏆</span> Top 10 Ambassadeurs
          </h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-5 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Rang</th>
                    <th className="px-6 py-5 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Ambassadeur</th>
                    <th className="px-6 py-5 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Classe</th>
                    <th className="px-6 py-5 text-right text-sm font-bold text-gray-500 uppercase tracking-wider">Points</th>
                    <th className="px-6 py-5 text-right text-sm font-bold text-gray-500 uppercase tracking-wider">Missions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leaderboard.slice(0, 10).map((ambassador, index) => (
                    <tr key={ambassador.email} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {index === 0 && <span className="text-2xl drop-shadow-sm">🥇</span>}
                          {index === 1 && <span className="text-2xl drop-shadow-sm">🥈</span>}
                          {index === 2 && <span className="text-2xl drop-shadow-sm">🥉</span>}
                          {index > 2 && (
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                              {index + 1}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-eugenia-burgundy to-eugenia-pink text-white flex items-center justify-center font-bold text-sm">
                            {ambassador.firstName.charAt(0)}{ambassador.lastName.charAt(0)}
                          </div>
                          <div className="font-semibold text-gray-900">
                            {ambassador.firstName} {ambassador.lastName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          {ambassador.classe || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-eugenia-pink text-lg">
                          {ambassador.totalPoints || 0}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">pts</span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600 font-medium">
                        {ambassador.actionsCount || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to={`/${school}-school/leaderboard`} className="btn btn-secondary text-lg py-4 px-8 border-2 border-gray-200 hover:border-gray-300">
              📊 Voir le classement complet
            </Link>
          </div>
        </div>
      </section>

      {/* Comment participer */}
      <section className="px-4 pb-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-eugenia-burgundy to-eugenia-pink rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 md:mb-10">
                🚀 Comment participer ?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 md:p-6 border border-white/20 hover:bg-white/15 transition-colors">
                  <div className="text-4xl md:text-5xl mb-3 md:mb-4">1️⃣</div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">Choisissez</h3>
                  <p className="text-sm md:text-base text-white/80">Une mission qui vous inspire</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 md:p-6 border border-white/20 hover:bg-white/15 transition-colors">
                  <div className="text-4xl md:text-5xl mb-3 md:mb-4">2️⃣</div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">Réalisez</h3>
                  <p className="text-sm md:text-base text-white/80">L'action demandée</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 md:p-6 border border-white/20 hover:bg-white/15 transition-colors">
                  <div className="text-4xl md:text-5xl mb-3 md:mb-4">3️⃣</div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">Gagnez</h3>
                  <p className="text-sm md:text-base text-white/80">Des points et des récompenses</p>
                </div>
              </div>
              <Link 
                to={`/${school}-school/submit`} 
                className="inline-block bg-white text-eugenia-burgundy font-bold text-lg py-4 px-8 md:px-10 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                ➕ Soumettre une action
              </Link>
            </div>
            
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
          </div>
        </div>
      </section>

      </div>
    </PageLayout>
  );
}

function MissionCard({ mission, school = 'eugenia' }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
            {mission.icon}
          </div>
          <div className="bg-eugenia-yellow/10 text-eugenia-yellow-darker px-3 py-1 rounded-full text-sm font-bold border border-eugenia-yellow/20">
            {mission.points} pts
          </div>
        </div>
        
        <div className="mb-3">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
            {mission.category}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{mission.title}</h3>
        <p className="text-gray-600 mb-6 text-sm line-clamp-2">{mission.description}</p>
        
        <Link 
          to={`/${school}-school/submit`}
          className="block w-full py-3 rounded-xl border-2 border-eugenia-burgundy text-eugenia-burgundy font-bold text-center hover:bg-eugenia-burgundy hover:text-white transition-all duration-300"
        >
          🎯 Participer
        </Link>
      </div>
    </div>
  );
}

