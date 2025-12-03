import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import { getLeaderboard } from '../services/googleSheets';

export default function StudentPublicProfilePage() {
  const { slug } = useParams();
  const [student, setStudent] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, [slug]);

  const loadStudentData = async () => {
    try {
      // Chercher l'étudiant dans le leaderboard
      const leaderboard = await getLeaderboard();
      
      // Essayer de trouver par slug (prenom-nom) ou email
      let foundStudent = leaderboard.find(s => {
        const studentSlug = `${s.firstName?.toLowerCase() || ''}-${s.lastName?.toLowerCase() || ''}`.replace(/\s+/g, '-');
        const emailSlug = s.email.split('@')[0].replace('.', '-');
        return studentSlug === slug || emailSlug === slug || s.email.split('@')[0] === slug;
      });

      if (foundStudent) {
        setStudent(foundStudent);
        
        // Charger le portfolio depuis localStorage
        const savedPortfolio = localStorage.getItem(`portfolio_${foundStudent.email}`);
        if (savedPortfolio) {
          setPortfolio(JSON.parse(savedPortfolio));
        }
      }
    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="spinner"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="card text-center max-w-md">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Profil non trouvé
            </h2>
            <p className="text-gray-600 mb-6">
              L'étudiant avec ce lien n'existe pas ou n'a pas encore de profil.
            </p>
            <Link to="/" className="btn btn-primary">
              Retour à l'accueil
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Profil */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-100">
             <div className="bg-gradient-to-r from-eugenia-burgundy to-eugenia-pink h-32"></div>
             <div className="px-8 pb-8">
                <div className="flex flex-col md:flex-row items-end -mt-12 mb-6 gap-6">
                    <div className="w-24 h-24 bg-white rounded-full p-2 shadow-lg flex items-center justify-center text-5xl">
                        👤
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        {student.firstName} {student.lastName}
                        </h1>
                         <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mb-2">
                            <span>{student.classe || 'N/A'}</span>
                         </div>
                    </div>
                     <div className="flex gap-4 justify-center md:justify-start">
                        <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-center">
                            <span className="block font-bold text-eugenia-burgundy text-xl">{student.totalPoints || 0}</span>
                            <span className="text-xs text-gray-500 font-bold uppercase">Points</span>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-center">
                            <span className="block font-bold text-eugenia-pink text-xl">{student.actionsCount || 0}</span>
                            <span className="text-xs text-gray-500 font-bold uppercase">Actions</span>
                        </div>
                    </div>
                </div>
             </div>
          </div>

          {/* Portfolio */}
          {portfolio && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-eugenia-yellow">📁</span> Portfolio
              </h2>
              
              {portfolio.title && (
                <h3 className="text-xl font-bold text-eugenia-burgundy mb-4">
                  {portfolio.title}
                </h3>
              )}
              
              {portfolio.description && (
                <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                  {portfolio.description}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {portfolio.github && (
                  <a
                    href={portfolio.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-gray-50 hover:bg-gray-900 hover:text-white border border-gray-200 p-5 rounded-xl flex items-center gap-4 transition-all"
                  >
                    <span className="text-3xl">💻</span>
                    <div>
                      <div className="font-bold">GitHub</div>
                      <div className="text-sm text-gray-500 group-hover:text-gray-300">Voir les projets</div>
                    </div>
                  </a>
                )}
                {portfolio.website && (
                  <a
                    href={portfolio.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-gray-50 hover:bg-eugenia-burgundy hover:text-white border border-gray-200 p-5 rounded-xl flex items-center gap-4 transition-all"
                  >
                    <span className="text-3xl">🌐</span>
                    <div>
                      <div className="font-bold">Site Web</div>
                      <div className="text-sm text-gray-500 group-hover:text-gray-200">Visiter le site</div>
                    </div>
                  </a>
                )}
              </div>

              {portfolio.technologies && portfolio.technologies.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm text-gray-500">Compétences Techniques</h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-800 border border-gray-200 px-4 py-2 rounded-full text-sm font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {portfolio.projects && portfolio.projects.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm text-gray-500">Projets Réalisés</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {portfolio.projects.map((project, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-2">{project.title}</h4>
                                {project.description && (
                                <p className="text-gray-600 mb-3">{project.description}</p>
                                )}
                            </div>
                            {project.link && (
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline btn-sm whitespace-nowrap"
                                >
                                    Voir 🔗
                                </a>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!portfolio && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center mb-8">
              <div className="text-6xl mb-4">📁</div>
              <p className="text-gray-500 text-lg">
                Cet étudiant n'a pas encore créé son portfolio.
              </p>
            </div>
          )}

          {/* Lien vers le classement */}
          <div className="text-center">
            <Link to="/leaderboard" className="btn btn-secondary shadow-lg hover:shadow-xl px-8 py-3 rounded-xl border border-gray-200">
              📊 Retour au classement
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

