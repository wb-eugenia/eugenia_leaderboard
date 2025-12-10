import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import { getLeaderboard } from '../services/googleSheets';

export default function StudentPublicProfilePage() {
  const { slug } = useParams();
  const [student, setStudent] = useState(null);
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

