import { Link } from 'react-router-dom';
import { useState } from 'react';
import EugeniaLogo from './EugeniaLogo';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-black/30 shadow-lg">
        <nav className="max-w-7xl mx-auto px-3 md:px-4 py-2 md:py-4 flex justify-between items-center">
          {/* Menu hamburger - Mobile seulement, à gauche */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white hover:text-eugenia-yellow transition-colors focus:outline-none"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Logo - Centré sur mobile, gauche sur desktop */}
          <Link 
            to="/" 
            className="hover:opacity-80 transition-opacity absolute left-1/2 transform -translate-x-1/2 md:relative md:left-0 md:transform-none"
            onClick={closeMenu}
          >
            <EugeniaLogo />
          </Link>
          
          {/* Liens navigation - Desktop seulement */}
          <div className="hidden md:flex gap-6">
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
          
          {/* Espaceur invisible pour équilibrer sur mobile */}
          <div className="md:hidden w-6 h-6" aria-hidden="true" />
        </nav>
      </header>

      {/* Menu dépliant mobile */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeMenu}
          />
          
          {/* Menu drawer */}
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 md:hidden transform transition-transform duration-300 ease-in-out">
            {/* Header du menu */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 flex items-center border-b">
              <button
                onClick={closeMenu}
                className="text-gray-700 hover:text-gray-900"
                aria-label="Fermer le menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Liens du menu */}
            <nav className="py-4">
              <Link
                to="/leaderboard"
                onClick={closeMenu}
                className="block px-6 py-4 text-gray-800 hover:bg-gray-100 hover:text-eugenia-burgundy transition-colors font-semibold flex items-center gap-2"
              >
                <span className="text-xl">📊</span>
                <span>Classement</span>
              </Link>
              <Link
                to="/submit"
                onClick={closeMenu}
                className="block px-6 py-4 text-gray-800 hover:bg-gray-100 hover:text-eugenia-burgundy transition-colors font-semibold flex items-center gap-2"
              >
                <span className="text-xl">➕</span>
                <span>Participer</span>
              </Link>
            </nav>
          </div>
        </>
      )}
    </>
  );
}

