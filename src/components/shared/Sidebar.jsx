import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useStudentAuth } from '../../contexts/StudentAuthContext';
import { useSchoolTheme } from '../../hooks/useSchoolTheme';

// Icônes SVG simples pour le sidebar
const iconClasses = 'w-5 h-5 flex-shrink-0';

function AmbassadeursIcon() {
  return (
    <svg className={iconClasses} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l1.9 3.85 4.25.62-3.07 2.99.72 4.22L12 12.77 8.2 13.68l.72-4.22L5.85 6.47l4.25-.62L12 2z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

function AssociationsIcon() {
  return (
    <svg className={iconClasses} viewBox="0 0 24 24" fill="none">
      <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="17" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M9.5 9.5L10.8 12M14.5 9.5L13.2 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClassementIcon() {
  return (
    <svg className={iconClasses} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 14h3v6H5v-6zm5-8h3v14h-3V6zm5 4h3v10h-3V10z"
        fill="currentColor"
      />
    </svg>
  );
}

function SoumettreIcon() {
  return (
    <svg className={iconClasses} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M12 5v14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SignalerIcon() {
  return (
    <svg className={iconClasses} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 4h9l-1 3 1 3H5v8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 21h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function NotificationsIcon() {
  return (
    <svg className={iconClasses} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21a2.5 2.5 0 0 0 2.45-2H9.55A2.5 2.5 0 0 0 12 21z"
        fill="currentColor"
      />
      <path
        d="M18 15V11a6 6 0 0 0-12 0v4l-1.5 2H19.5L18 15z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfilIcon() {
  return (
    <svg className={iconClasses} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M6 19c1.2-2.2 3.1-3.5 6-3.5s4.8 1.3 6 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DeconnexionIcon() {
  return (
    <svg className={iconClasses} viewBox="0 0 24 24" fill="none">
      <path
        d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 8l4 4-4 4M18 12H10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ConnexionIcon() {
  return (
    <svg className={iconClasses} viewBox="0 0 24 24" fill="none">
      <path
        d="M14 5h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 8l-4 4 4 4M6 12h8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Sidebar({ school = 'eugenia', isOpen, onClose }) {
  const location = useLocation();
  const { student, logout } = useStudentAuth();
  const theme = useSchoolTheme(school);
  const schoolPath = school === 'eugenia' ? '/eugenia-school' : '/albert-school';
  const [unreadCount, setUnreadCount] = useState(0);

  // Charger le nombre de notifications non lues
  useEffect(() => {
    if (student?.email) {
      const loadUnreadCount = () => {
        try {
          const stored = localStorage.getItem(`notifications_${student.email}`);
          if (stored) {
            const notifs = JSON.parse(stored);
            setUnreadCount(notifs.filter(n => !n.read).length);
          }
        } catch (error) {
          console.error('Error loading notification count:', error);
        }
      };
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [student?.email]);

  // Fermer le menu si on change de route (mobile seulement)
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const menuItems = [
    {
      path: `${schoolPath}/ambassadeurs`,
      label: 'Ambassadeurs',
      Icon: AmbassadeursIcon
    },
    {
      path: `${schoolPath}/associations`,
      label: 'Associations',
      Icon: AssociationsIcon
    },
    {
      path: `${schoolPath}/leaderboard`,
      label: 'Classement',
      Icon: ClassementIcon
    },
    {
      path: `${schoolPath}/submit`,
      label: 'Soumettre',
      Icon: SoumettreIcon
    },
    {
      path: `${schoolPath}/report`,
      label: 'Signaler',
      Icon: SignalerIcon
    }
  ];

  const isActive = (path) => {
    if (path === schoolPath) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const gradientStyle = {
    background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
  };

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:fixed lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64 shadow-2xl
        `}
        style={gradientStyle}
      >
        {/* Header du sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <Link
            to={schoolPath}
            onClick={onClose}
            className="text-white font-bold text-lg hover:text-yellow-300 transition-colors"
          >
            {school === 'eugenia' ? 'Eugenia School' : 'Albert School'}
          </Link>
          {/* Bouton fermer - Mobile seulement */}
          <button
            onClick={onClose}
            className="lg:hidden text-white hover:text-yellow-300 transition-colors"
            aria-label="Fermer le menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
          <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
            {menuItems.map((item) => {
              const Icon = item.Icon;
              return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    isActive(item.path)
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <Icon />
                <span className="font-semibold">{item.label}</span>
              </Link>
            );})}
          </div>

          {/* Section fixe en bas */}
          <div className="flex-shrink-0 space-y-2">
            {/* Séparateur */}
            <div className="border-t border-white/20 my-2" />

            {/* Notifications */}
            {student && (
              <Link
                to={`${schoolPath}/notifications`}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    location.pathname.includes('/notifications')
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <NotificationsIcon />
                <span className="font-semibold flex-1">Notifications</span>
                {unreadCount > 0 && (
                  <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Profil utilisateur */}
            {student ? (
              <>
                <Link
                  to={`${schoolPath}/student/profile`}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${
                      location.pathname.includes('/student/profile')
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <ProfilIcon />
                  <span className="font-semibold">Mon profil</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-red-500/20 hover:text-white transition-all duration-200 w-full"
                >
                  <DeconnexionIcon />
                  <span className="font-semibold">Déconnexion</span>
                </button>
              </>
            ) : (
              <Link
                to={`${schoolPath}/login`}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                <ConnexionIcon />
                <span className="font-semibold">Connexion</span>
              </Link>
            )}
          </div>
        </nav>

        {/* Footer du sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
          <div className="text-white/60 text-xs text-center">
            © 2025 {school === 'eugenia' ? 'Eugenia' : 'Albert'} School
          </div>
        </div>
      </aside>
    </>
  );
}

