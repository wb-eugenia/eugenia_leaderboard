import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSchoolTheme } from '../../hooks/useSchoolTheme';
import EugeniaLogo from './EugeniaLogo';
import AlbertLogo from './AlbertLogo';
import { useStudentAuth } from '../../contexts/StudentAuthContext';
import Sidebar from './Sidebar';
// import ThemeToggle from './ThemeToggle'; // Désactivé
import NotificationCenter from './NotificationCenter';

function StudentAuthButton({ school, theme }) {
  const { student } = useStudentAuth();
  const schoolPath = school === 'eugenia' ? '/eugenia-school' : '/albert-school';
  
  if (student) {
    return (
      <Link 
        to={`${schoolPath}/student/profile`}
        className="text-white font-semibold hover:text-yellow-300 transition-colors"
        style={{ '--hover-color': theme.accent }}
      >
        👤 Mon profil
      </Link>
    );
  }
  
  return (
    <Link 
      to={`${schoolPath}/login`}
      className="text-white font-semibold hover:text-yellow-300 transition-colors"
      style={{ '--hover-color': theme.accent }}
    >
      🔐 Connexion
    </Link>
  );
}

function StudentAuthButtonMobile({ school, theme, onClose }) {
  const { student } = useStudentAuth();
  const schoolPath = school === 'eugenia' ? '/eugenia-school' : '/albert-school';
  
  if (student) {
    return (
      <Link
        to={`${schoolPath}/student/profile`}
        onClick={onClose}
        className="block px-6 py-4 text-gray-800 hover:bg-gray-100 transition-colors font-semibold flex items-center gap-2"
      >
        <span className="text-xl">👤</span>
        <span>Mon profil</span>
      </Link>
    );
  }
  
  return (
    <Link
      to={`${schoolPath}/login`}
      onClick={onClose}
      className="block px-6 py-4 text-gray-800 hover:bg-gray-100 transition-colors font-semibold flex items-center gap-2"
    >
      <span className="text-xl">🔐</span>
      <span>Connexion</span>
    </Link>
  );
}

export default function SchoolHeader({ school = 'eugenia', onMenuToggle }) {
  const theme = useSchoolTheme(school);
  const { student, logout: logoutAuth } = useStudentAuth();
  const schoolPath = school === 'eugenia' ? '/eugenia-school' : '/albert-school';
  const Logo = school === 'eugenia' ? EugeniaLogo : AlbertLogo;

  const gradientStyle = {
    background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
  };

  return (
    <header className="lg:hidden sticky top-0 z-40 backdrop-blur-lg shadow-lg" style={gradientStyle}>
      <nav className="max-w-7xl mx-auto px-3 md:px-4 py-2 md:py-4 flex justify-between items-center">
        {/* Menu hamburger - Mobile seulement */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden text-white hover:text-yellow-300 transition-colors focus:outline-none"
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Espaceur pour desktop (remplace le burger menu) */}
        <div className="hidden lg:block w-6 h-6" aria-hidden="true" />

        {/* Logo */}
        <Link 
          to={schoolPath}
          className="hover:opacity-80 transition-opacity flex-1 text-center lg:text-left"
        >
          <Logo />
        </Link>
        
        {/* Actions à droite - Desktop seulement */}
        <div className="hidden lg:flex gap-4 items-center">
          {student ? (
            <>
              <NotificationCenter studentEmail={student.email} />
              <Link 
                to={`${schoolPath}/student/profile`}
                className="text-white font-semibold hover:text-yellow-300 transition-colors"
              >
                👤 Mon profil
              </Link>
            </>
          ) : (
            <Link 
              to={`${schoolPath}/login`}
              className="text-white font-semibold hover:text-yellow-300 transition-colors"
            >
              🔐 Connexion
            </Link>
          )}
        </div>

        {/* Espaceur pour mobile */}
        <div className="lg:hidden w-6 h-6" aria-hidden="true" />
      </nav>
    </header>
  );
}

