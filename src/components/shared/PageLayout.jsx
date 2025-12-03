import { useState } from 'react';
import SchoolHeader from './SchoolHeader';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * Layout avec sidebar pour les pages étudiantes
 */
export default function PageLayout({ school = 'eugenia', children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - Desktop et Mobile */}
      <Sidebar school={school} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Contenu principal - Collé au sidebar sur desktop */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <SchoolHeader school={school} onMenuToggle={toggleSidebar} />

        {/* Contenu de la page */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <Footer school={school} />
      </div>
    </div>
  );
}

