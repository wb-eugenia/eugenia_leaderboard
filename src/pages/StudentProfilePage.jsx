import { useState, useEffect } from 'react';
import { useStudentAuth } from '../contexts/StudentAuthContext';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/shared/PageLayout';

export default function StudentProfilePage({ school = 'eugenia' }) {
  const { student, logout, updateStudent } = useStudentAuth();
  const navigate = useNavigate();
  const [associations, setAssociations] = useState([]);

  useEffect(() => {
    // Charger les associations
    const savedAssociations = localStorage.getItem(`associations_${student.email}`);
    if (savedAssociations) {
      setAssociations(JSON.parse(savedAssociations));
    }
  }, [student]);

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
              Gérez votre profil
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

          {/* Associations Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🎪 Associations</h2>
            </div>

            {/* Associations Content */}
            <div className="space-y-6">
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
          </div>
        </div>
        </div>
      </div>
    </PageLayout>
  );
}

