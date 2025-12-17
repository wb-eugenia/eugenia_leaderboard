import { Link } from 'react-router-dom';
import { useSchoolTheme } from '../../hooks/useSchoolTheme';
import EugeniaLogo from './EugeniaLogo';
import AlbertLogo from './AlbertLogo';

export default function Footer({ school = 'eugenia' }) {
  const currentYear = new Date().getFullYear();
  const theme = useSchoolTheme(school);
  const schoolPath = school === 'eugenia' ? '/eugenia-school' : '/albert-school';
  const Logo = school === 'eugenia' ? EugeniaLogo : AlbertLogo;

  return (
    <footer className="bg-black/40 backdrop-blur-lg border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Section Logo & Description */}
          <div className="text-center md:text-left">
            <Link to={schoolPath} className="inline-block mb-4 hover:opacity-80 transition-opacity">
              <Logo />
            </Link>
            <p className="text-white/80 text-sm mb-4">
              Le challenge gamifié du campus Eugenia School. 
              Gagnez des points, montez dans le classement et remportez des récompenses !
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <a 
                href="https://www.eugenia-school.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-eugenia-yellow transition-colors"
                aria-label="Site web Eugenia School"
              >
                🌐
              </a>
              <a 
                href="https://www.linkedin.com/school/eugenia-school" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-eugenia-yellow transition-colors"
                aria-label="LinkedIn Eugenia School"
              >
                💼
              </a>
            </div>
          </div>

          {/* Section Navigation */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-lg mb-4">Navigation</h3>
            <nav className="flex flex-col gap-3">
              <Link 
                to={`${schoolPath}/leaderboard`} 
                className="text-white/80 hover:text-yellow-300 transition-colors text-sm"
                style={{ '--hover-color': theme.accent }}
              >
                📊 Classement
              </Link>
              <Link 
                to={`${schoolPath}/submit`} 
                className="text-white/80 hover:text-yellow-300 transition-colors text-sm"
                style={{ '--hover-color': theme.accent }}
              >
                ➕ Soumettre une action
              </Link>
            </nav>
          </div>

          {/* Section Informations */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-lg mb-4">Informations</h3>
            <div className="flex flex-col gap-3 text-sm text-white/80">
              <div>
                <span className="font-semibold">📧 Contact:</span>
                <a 
                  href="mailto:challenge@eugenia-school.com" 
                  className="block hover:text-eugenia-yellow transition-colors"
                >
                  challenge@eugenia-school.com
                </a>
              </div>
              <div>
                <span className="font-semibold">🏫 Campus:</span>
                <p>Eugenia School</p>
              </div>
              <div>
                <span className="font-semibold">📅 Challenge:</span>
                <p>2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm text-center md:text-left">
              © {currentYear} Eugenia School. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm">
              <Link 
                to="/" 
                className="text-white/60 hover:text-eugenia-yellow transition-colors"
              >
                Mentions légales
              </Link>
              <Link 
                to="/" 
                className="text-white/60 hover:text-eugenia-yellow transition-colors"
              >
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

