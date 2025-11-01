import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/googleSheets';
import { loadConfig, getActionTypes } from '../services/configService';
import RewardCard from '../components/shared/RewardCard';
import Header from '../components/shared/Header';

export default function HomePage() {
  const [config, setConfig] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPoints: 0,
    totalActions: 0
  });
  const [topThree, setTopThree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionTypes, setActionTypes] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load config
      const loadedConfig = await loadConfig();
      setConfig(loadedConfig);

      // Load action types
      const types = await getActionTypes();
      setActionTypes(types);

      // Load leaderboard for stats and top 3
      const leaderboard = await getLeaderboard();
      
      // Calculate stats
      const totalStudents = leaderboard.length;
      const totalPoints = leaderboard.reduce((sum, user) => sum + (user.totalPoints || 0), 0);
      const totalActions = leaderboard.reduce((sum, user) => sum + (user.actionsCount || 0), 0);
      
      setStats({ totalStudents, totalPoints, totalActions });
      setTopThree(leaderboard.slice(0, 3));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eugenia-burgundy via-eugenia-pink to-eugenia-burgundy">
      <Header />
      
      {/* Hero Section */}
      <section className="hero py-20 px-4">
        <div className="hero-content text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 animate-pulse">
            🏆 EUGENIA CHALLENGE 2025 🏆
          </h1>

          {/* Badge cagnotte */}
          <div className="prize-badge animate-pulse">
            💰 {config.totalPrizePool || '+500€'} DE CAGNOTTE 💰
            <br />
            à gagner ce semestre !
          </div>

          <p className="hero-subtitle text-2xl text-white mb-8">
            Gagne des points, monte dans le classement,
            <br />
            deviens le champion du campus !
          </p>

          <div className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/submit" className="btn btn-primary text-xl py-4 px-8">
              🎯 Soumettre une action
            </Link>
            <Link to="/leaderboard" className="btn btn-secondary text-xl py-4 px-8">
              📊 Voir le classement
            </Link>
          </div>

          {/* Stats live */}
          <div className="hero-stats grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="card text-center">
              <div className="text-4xl mb-2">💡</div>
              <div className="text-3xl font-bold text-primary-600">{stats.totalStudents}</div>
              <div className="text-gray-600">étudiants</div>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-3xl font-bold text-green-600">{stats.totalPoints}</div>
              <div className="text-gray-600">points</div>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-2">🏅</div>
              <div className="text-3xl font-bold text-eugenia-pink">{stats.totalActions}</div>
              <div className="text-gray-600">actions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Récompenses */}
      {config.rewards && config.rewards.length > 0 && (
        <section className="rewards-section py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
              💰 Récompenses à gagner 💰
            </h2>

            <div className="rewards-grid grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {config.rewards.map((reward) => (
                <RewardCard key={reward.id} {...reward} />
              ))}
            </div>

            {config.deadline && (
              <p className="deadline text-center text-xl text-gray-700 mb-8">
                📅 Classement finalisé le {config.deadline}
              </p>
            )}

            <div className="text-center">
              <Link to="/submit" className="btn btn-primary text-xl py-4 px-8">
                🚀 Je commence maintenant !
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Section Comment ça marche */}
      <section className="how-it-works py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-12">
            Comment participer ?
          </h2>

          <div className="steps-grid grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="card text-center">
              <div className="text-6xl mb-4">1️⃣</div>
              <h3 className="text-2xl font-bold mb-4">Choisis une action</h3>
              <p className="text-gray-600">
                Post LinkedIn, JPO, Hackathon, Association...
              </p>
            </div>

            <div className="card text-center">
              <div className="text-6xl mb-4">2️⃣</div>
              <h3 className="text-2xl font-bold mb-4">Soumets ta preuve</h3>
              <p className="text-gray-600">
                Lien, date ou photo
              </p>
            </div>

            <div className="card text-center">
              <div className="text-6xl mb-4">3️⃣</div>
              <h3 className="text-2xl font-bold mb-4">Gagne des points !</h3>
              <p className="text-gray-600">
                Monte dans le top 3 et gagne !
              </p>
            </div>
          </div>

          <Link to="/submit" className="btn btn-primary text-xl py-4 px-8">
            🚀 Commencer à accumuler des points
          </Link>
        </div>
      </section>

      {/* Section Types d'actions */}
      {actionTypes && actionTypes.length > 0 && (
        <section className="actions-types py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Comment gagner des points ?
            </h2>

            <div className="actions-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {actionTypes.slice(0, 8).map((action) => (
                <div key={action.id} className="card text-center">
                  <div className="text-5xl mb-3">{action.emoji || '🎯'}</div>
                  <h3 className="text-xl font-bold mb-2">{action.label}</h3>
                  <div className="text-3xl font-bold text-primary-600">
                    {action.points || 0} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top 3 actuel */}
      {topThree.length > 0 && (
        <section className="leaderboard-preview py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              🏆 Classement en direct - Course aux {config.totalPrizePool || '+500€'}
            </h2>
            
            {config.deadline && (
              <p className="prize-info text-xl text-white/80 mb-12">
                💰 Cagnotte : {config.totalPrizePool || '+500€'} | Fin : {config.deadline}
              </p>
            )}

            {/* Podium Display */}
            <div className="podium-display flex justify-center items-end gap-4 mb-8 max-w-3xl mx-auto">
              {topThree.length >= 2 && (
                <div className="flex-1 card text-center border-2 border-slate-400">
                  <div className="text-4xl mb-2">🥈</div>
                  <div className="font-bold text-lg">
                    {topThree[1].firstName} {topThree[1].lastName}
                  </div>
                  <div className="text-2xl font-bold text-primary-600 mt-2">
                    {topThree[1].totalPoints} pts
                  </div>
                </div>
              )}
              {topThree.length >= 1 && (
                <div className="flex-1 card text-center border-2 border-yellow-400 transform scale-110 shadow-xl">
                  <div className="text-4xl mb-2">🥇</div>
                  <div className="font-bold text-lg">
                    {topThree[0].firstName} {topThree[0].lastName}
                  </div>
                  <div className="text-2xl font-bold text-primary-600 mt-2">
                    {topThree[0].totalPoints} pts
                  </div>
                </div>
              )}
              {topThree.length >= 3 && (
                <div className="flex-1 card text-center border-2 border-orange-400">
                  <div className="text-4xl mb-2">🥉</div>
                  <div className="font-bold text-lg">
                    {topThree[2].firstName} {topThree[2].lastName}
                  </div>
                  <div className="text-2xl font-bold text-primary-600 mt-2">
                    {topThree[2].totalPoints} pts
                  </div>
                </div>
              )}
            </div>

            <Link to="/leaderboard" className="btn btn-secondary text-xl py-4 px-8 mb-8">
              📊 Voir le classement complet
            </Link>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="final-cta py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            💰 La course aux {config.totalPrizePool || '+500€'} est lancée ! 💰
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Soumets ta première action maintenant et
            <br />
            commence à grimper dans le classement
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/submit" className="btn btn-primary btn-lg py-4 px-8">
              🎯 Gagner mes premiers points
            </Link>
            <Link to="/leaderboard" className="btn btn-secondary btn-lg py-4 px-8">
              📊 Voir qui est en tête
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
