import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-4">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-pulse">
          🏆 Eugenia Challenge
        </h1>
        <p className="text-2xl md:text-3xl mb-8">
          Défie-toi, accumule des points, deviens champion du campus !
        </p>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl">
        <div className="card text-center">
          <div className="text-4xl font-bold text-primary-600">42</div>
          <div className="text-gray-600">Participants</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-green-600">1,250</div>
          <div className="text-gray-600">Points distribués</div>
        </div>
        <div className="card text-center">
          <div className="text-4xl font-bold text-eugenia-pink">24</div>
          <div className="text-gray-600">Actions validées</div>
        </div>
      </div>
      
      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/leaderboard" className="btn btn-primary text-xl">
          📊 Voir le classement
        </Link>
        <Link to="/submit" className="btn btn-secondary text-xl">
          ➕ Soumettre une action
        </Link>
      </div>
    </div>
  );
}

