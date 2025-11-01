import { Link } from 'react-router-dom';
import EugeniaLogo from './EugeniaLogo';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/30 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <EugeniaLogo />
        </Link>
        
        <div className="flex gap-6">
          <Link 
            to="/leaderboard" 
            className="text-white font-semibold hover:text-eugenia-yellow transition-colors"
          >
            📊 Classement
          </Link>
          <Link 
            to="/submit" 
            className="text-white font-semibold hover:text-eugenia-yellow transition-colors"
          >
            ➕ Participer
          </Link>
        </div>
      </nav>
    </header>
  );
}

