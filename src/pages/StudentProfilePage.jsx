import { useState, useEffect } from 'react';
import { useStudentAuth } from '../contexts/StudentAuthContext';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/shared/PageLayout';

export default function StudentProfilePage({ school = 'eugenia' }) {
  const { student, logout, updateStudent } = useStudentAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('portfolio');
  const [portfolio, setPortfolio] = useState({
    title: '',
    description: '',
    github: '',
    website: '',
    technologies: [],
    projects: []
  });
  const [associations, setAssociations] = useState([]);
  const [newTech, setNewTech] = useState('');
  const [newProject, setNewProject] = useState({ title: '', description: '', link: '' });

  useEffect(() => {
    // Charger le portfolio depuis localStorage ou API
    const savedPortfolio = localStorage.getItem(`portfolio_${student.email}`);
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }

    // Charger les associations
    const savedAssociations = localStorage.getItem(`associations_${student.email}`);
    if (savedAssociations) {
      setAssociations(JSON.parse(savedAssociations));
    }
  }, [student]);

  const handlePortfolioSave = () => {
    localStorage.setItem(`portfolio_${student.email}`, JSON.stringify(portfolio));
    alert('Portfolio sauvegardé !');
  };

  const handleAddTech = () => {
    if (newTech.trim()) {
      setPortfolio({
        ...portfolio,
        technologies: [...portfolio.technologies, newTech.trim()]
      });
      setNewTech('');
    }
  };

  const handleRemoveTech = (index) => {
    setPortfolio({
      ...portfolio,
      technologies: portfolio.technologies.filter((_, i) => i !== index)
    });
  };

  const handleAddProject = () => {
    if (newProject.title.trim()) {
      setPortfolio({
        ...portfolio,
        projects: [...portfolio.projects, { ...newProject }]
      });
      setNewProject({ title: '', description: '', link: '' });
    }
  };

  const handleRemoveProject = (index) => {
    setPortfolio({
      ...portfolio,
      projects: portfolio.projects.filter((_, i) => i !== index)
    });
  };

  const handleJoinAssociation = (assoId) => {
    if (!associations.find(a => a.id === assoId)) {
      const associationsList = [
        { id: 1, name: 'Eugenia Théâtre', emoji: '🎭' },
        { id: 2, name: 'Eugenia Music', emoji: '🎵' },
        { id: 3, name: 'Eugenia Sport', emoji: '⚽' },
        { id: 4, name: 'Eugenia Art', emoji: '🎨' },
        { id: 5, name: 'Eugenia Solidarité', emoji: '🌍' },
        { id: 6, name: 'Eugenia Innovation', emoji: '💡' }
      ];
      const asso = associationsList.find(a => a.id === assoId);
      if (asso) {
        const updated = [...associations, asso];
        setAssociations(updated);
        localStorage.setItem(`associations_${student.email}`, JSON.stringify(updated));
        alert(`Vous avez rejoint ${asso.name} !`);
      }
    }
  };

  const handleLeaveAssociation = (assoId) => {
    const updated = associations.filter(a => a.id !== assoId);
    setAssociations(updated);
    localStorage.setItem(`associations_${student.email}`, JSON.stringify(updated));
  };

  const profileUrl = `${window.location.origin}/profile/${student.slug || student.email.split('@')[0].replace('.', '-')}`;

  return (
    <PageLayout school={school}>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="student-hero-section py-12 px-4 text-white">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              👤 Mon Profil
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Gérez votre profil et votre portfolio
            </p>
          </div>
        </section>

        <div className="px-4 py-8">
          <div className="max-w-7xl mx-auto">

          {/* Header Profil */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="text-8xl">👤</div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {student.firstName} {student.lastName}
                </h1>
                <p className="text-gray-600 mb-4">{student.email}</p>
                <p className="text-gray-600 mb-4">Classe: {student.classe || 'N/A'}</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-eugenia-yellow/20 px-4 py-2 rounded-lg">
                    <span className="font-bold text-eugenia-burgundy">{student.totalPoints || 0} points</span>
                  </div>
                  <div className="bg-eugenia-pink/20 px-4 py-2 rounded-lg">
                    <span className="font-bold text-eugenia-pink">{student.actionsCount || 0} actions</span>
                  </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600 mb-1">Lien de votre profil public :</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={profileUrl}
                      className="form-control flex-1 text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(profileUrl);
                        alert('Lien copié !');
                      }}
                      className="btn btn-outline text-sm"
                    >
                      📋 Copier
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="btn btn-danger"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8">
            <div className="flex gap-4 border-b mb-6">
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'portfolio'
                    ? 'border-b-2 border-eugenia-burgundy text-eugenia-burgundy'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📁 Portfolio
              </button>
              <button
                onClick={() => setActiveTab('associations')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'associations'
                    ? 'border-b-2 border-eugenia-burgundy text-eugenia-burgundy'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🎪 Associations
              </button>
            </div>

            {/* Tab Content: Portfolio */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Titre du portfolio
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={portfolio.title}
                    onChange={(e) => setPortfolio({ ...portfolio, title: e.target.value })}
                    placeholder="Ex: Portfolio de Développement Web"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={portfolio.description}
                    onChange={(e) => setPortfolio({ ...portfolio, description: e.target.value })}
                    placeholder="Décrivez vos compétences et votre parcours..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      GitHub
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      value={portfolio.github}
                      onChange={(e) => setPortfolio({ ...portfolio, github: e.target.value })}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Site Web
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      value={portfolio.website}
                      onChange={(e) => setPortfolio({ ...portfolio, website: e.target.value })}
                      placeholder="https://monsite.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Technologies
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="form-control flex-1"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTech()}
                      placeholder="Ajouter une technologie (ex: React, Node.js)"
                    />
                    <button onClick={handleAddTech} className="btn btn-primary">
                      ➕
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="bg-eugenia-burgundy/10 text-eugenia-burgundy px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2"
                      >
                        {tech}
                        <button
                          onClick={() => handleRemoveTech(i)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Projets
                  </label>
                  <div className="space-y-4 mb-4">
                    {portfolio.projects.map((project, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900">{project.title}</h4>
                          <button
                            onClick={() => handleRemoveProject(i)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-eugenia-burgundy text-sm">
                            🔗 Voir le projet
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      className="form-control"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      placeholder="Titre du projet"
                    />
                    <textarea
                      className="form-control"
                      rows="2"
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Description"
                    />
                    <input
                      type="url"
                      className="form-control"
                      value={newProject.link}
                      onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                      placeholder="Lien (optionnel)"
                    />
                    <button onClick={handleAddProject} className="btn btn-primary w-full">
                      ➕ Ajouter le projet
                    </button>
                  </div>
                </div>

                <button onClick={handlePortfolioSave} className="btn btn-primary w-full text-lg py-4">
                  💾 Sauvegarder le portfolio
                </button>
              </div>
            )}

            {/* Tab Content: Associations */}
            {activeTab === 'associations' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Mes associations
                </h3>
                {associations.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">
                    Vous n'avez pas encore rejoint d'association
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {associations.map(asso => (
                      <div key={asso.id} className="bg-gradient-to-br from-eugenia-burgundy/10 to-eugenia-pink/10 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-4xl">{asso.emoji}</span>
                            <span className="font-bold text-gray-900">{asso.name}</span>
                          </div>
                          <button
                            onClick={() => handleLeaveAssociation(asso.id)}
                            className="btn btn-danger btn-sm"
                          >
                            Quitter
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t pt-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Rejoindre une association
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 1, name: 'Eugenia Théâtre', emoji: '🎭' },
                      { id: 2, name: 'Eugenia Music', emoji: '🎵' },
                      { id: 3, name: 'Eugenia Sport', emoji: '⚽' },
                      { id: 4, name: 'Eugenia Art', emoji: '🎨' },
                      { id: 5, name: 'Eugenia Solidarité', emoji: '🌍' },
                      { id: 6, name: 'Eugenia Innovation', emoji: '💡' }
                    ]
                      .filter(asso => !associations.find(a => a.id === asso.id))
                      .map(asso => (
                        <div key={asso.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{asso.emoji}</span>
                              <span className="font-semibold text-gray-900">{asso.name}</span>
                            </div>
                            <button
                              onClick={() => handleJoinAssociation(asso.id)}
                              className="btn btn-primary btn-sm"
                            >
                              Rejoindre
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </PageLayout>
  );
}

