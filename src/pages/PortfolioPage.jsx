import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/shared/PageLayout';

export default function PortfolioPage({ school = 'eugenia' }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, design, dev, app, innovation

  // Simuler des données de projets (à remplacer par une vraie API plus tard)
  useEffect(() => {
    // TODO: Remplacer par un appel API réel
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Générer des dates : certains projets ce mois, d'autres mois précédents
    const mockProjects = [
      {
        id: 1,
        title: 'Application E-Commerce',
        student: 'Marie Dupont',
        class: 'MBA1',
        category: 'app',
        description: 'Application e-commerce complète avec paiement en ligne',
        tech: ['React', 'Node.js', 'Stripe'],
        github: 'https://github.com/marie/ecommerce',
        image: '💻',
        featured: true,
        createdAt: new Date(currentYear, currentMonth, 5) // Ce mois
      },
      {
        id: 2,
        title: 'Design System Eugenia',
        student: 'Jean Martin',
        class: 'B1',
        category: 'design',
        description: 'Système de design complet pour l\'école',
        tech: ['Figma', 'Design Tokens'],
        github: 'https://github.com/jean/design-system',
        image: '🎨',
        featured: true,
        createdAt: new Date(currentYear, currentMonth, 12) // Ce mois
      },
      {
        id: 3,
        title: 'API de Gestion Campus',
        student: 'Sophie Bernard',
        class: 'MBA2',
        category: 'dev',
        description: 'API RESTful pour la gestion du campus',
        tech: ['Python', 'FastAPI', 'PostgreSQL'],
        github: 'https://github.com/sophie/campus-api',
        image: '⚙️',
        featured: false,
        createdAt: new Date(currentYear, currentMonth - 1, 20) // Mois précédent
      },
      {
        id: 4,
        title: 'App Mobile Fitness',
        student: 'Lucas Petit',
        class: 'MBA1',
        category: 'app',
        description: 'Application mobile de suivi fitness',
        tech: ['React Native', 'Firebase'],
        github: 'https://github.com/lucas/fitness-app',
        image: '📱',
        featured: false,
        createdAt: new Date(currentYear, currentMonth, 18) // Ce mois
      },
      {
        id: 5,
        title: 'Plateforme d\'Innovation',
        student: 'Emma Rousseau',
        class: 'B1',
        category: 'innovation',
        description: 'Plateforme collaborative pour projets innovants',
        tech: ['Vue.js', 'MongoDB', 'WebSocket'],
        github: 'https://github.com/emma/innovation-platform',
        image: '🚀',
        featured: true,
        createdAt: new Date(currentYear, currentMonth, 25) // Ce mois
      },
      {
        id: 6,
        title: 'Identité Visuelle Startup',
        student: 'Thomas Moreau',
        class: 'MBA2',
        category: 'design',
        description: 'Création d\'identité visuelle complète',
        tech: ['Illustrator', 'Photoshop'],
        github: null,
        image: '🎭',
        featured: false,
        createdAt: new Date(currentYear, currentMonth, 8) // Ce mois
      }
    ];

    // Filtrer pour ne garder que les projets du mois en cours
    const currentMonthProjects = mockProjects.filter(project => {
      const projectDate = new Date(project.createdAt);
      return projectDate.getMonth() === currentMonth && 
             projectDate.getFullYear() === currentYear;
    });

    setTimeout(() => {
      setProjects(currentMonthProjects);
      setLoading(false);
    }, 500);
  }, []);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  const categories = [
    { id: 'all', label: 'Tous', emoji: '📁' },
    { id: 'design', label: 'Design', emoji: '🎨' },
    { id: 'dev', label: 'Développement', emoji: '💻' },
    { id: 'app', label: 'Applications', emoji: '📱' },
    { id: 'innovation', label: 'Innovation', emoji: '🚀' }
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
      <section className="student-hero-section py-20 px-4 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            📁 Portfolios du Mois
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            Découvrez les projets innovants et les talents de nos étudiants ce mois-ci
          </p>
          <div className="inline-block bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 rounded-full text-lg font-semibold">
            📅 {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="px-4 -mt-8 mb-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 bg-white p-4 rounded-2xl shadow-xl max-w-fit mx-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                  filter === cat.id
                    ? 'bg-eugenia-yellow text-eugenia-black shadow-md transform scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projets Featured */}
      {filter === 'all' && (
        <section className="px-4 mb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <span className="text-eugenia-yellow">⭐</span> Projets à la une
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects
                .filter(p => p.featured)
                .map(project => (
                  <ProjectCard key={project.id} project={project} featured />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Liste des projets */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {filter !== 'all' && (
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <span>{categories.find(c => c.id === filter)?.emoji}</span>
              <span>{categories.find(c => c.id === filter)?.label}</span>
            </h2>
          )}
          
          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-500">
                Aucun projet trouvé dans cette catégorie
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects
                .filter(p => filter === 'all' ? !p.featured : true)
                .map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Soumettre un projet */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-eugenia-burgundy to-eugenia-pink rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                🚀 Vous avez un projet à partager ?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Partagez votre travail et inspirez la communauté Eugenia. Votre projet apparaîtra dans les portfolios du mois !
              </p>
              <button className="btn btn-primary text-lg py-4 px-8 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                ➕ Soumettre mon projet
              </button>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>
        </div>
      </section>
      </div>
    </PageLayout>
  );
}

function ProjectCard({ project, featured = false }) {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      featured ? 'ring-2 ring-eugenia-yellow shadow-lg' : 'shadow-sm border border-gray-100'
    }`}>
      {featured && (
        <div className="absolute top-4 right-4 bg-eugenia-yellow text-eugenia-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-10 shadow-sm">
          À la une
        </div>
      )}
      
      <div className="h-48 bg-gray-50 flex items-center justify-center relative overflow-hidden group">
        <div className="text-8xl transition-transform duration-300 group-hover:scale-110">{project.image}</div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
          <span className="text-white font-medium">Voir le détail</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            project.category === 'design' ? 'bg-purple-100 text-purple-700' :
            project.category === 'dev' ? 'bg-blue-100 text-blue-700' :
            project.category === 'app' ? 'bg-green-100 text-green-700' :
            'bg-orange-100 text-orange-700'
          }`}>
            {project.category.toUpperCase()}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{project.title}</h3>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
            👤
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">{project.student}</div>
            <div className="text-xs text-gray-500">{project.class}</div>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-6 line-clamp-2 h-10">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.map((tech, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200"
            >
              {tech}
            </span>
          ))}
        </div>
        
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 rounded-xl border border-gray-200 text-center text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            Voir sur GitHub
          </a>
        )}
      </div>
    </div>
  );
}

