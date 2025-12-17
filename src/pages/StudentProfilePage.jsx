import { useState, useEffect } from 'react';
import { useStudentAuth } from '../contexts/StudentAuthContext';
import PageLayout from '../components/shared/PageLayout';

export default function StudentProfilePage({ school = 'eugenia' }) {
  const { student } = useStudentAuth();
  const [associations, setAssociations] = useState([]);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

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

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Veuillez remplir tous les champs' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas' });
      return;
    }

    if (newPassword.length < 4) {
      setPasswordMessage({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 4 caractères' });
      return;
    }

    // Vérifier le mot de passe actuel (pour l'instant, on accepte 1234 ou le mot de passe stocké)
    const storedPassword = localStorage.getItem(`password_${student.email}`);
    const defaultPassword = '1234';
    
    if (currentPassword !== (storedPassword || defaultPassword)) {
      setPasswordMessage({ type: 'error', text: 'Mot de passe actuel incorrect' });
      return;
    }

    // Sauvegarder le nouveau mot de passe
    try {
      localStorage.setItem(`password_${student.email}`, newPassword);
      setPasswordMessage({ type: 'success', text: 'Mot de passe modifié avec succès !' });
      
      // Réinitialiser le formulaire
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
      
      setTimeout(() => {
        setPasswordMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'Erreur lors de la modification du mot de passe' });
    }
  };

  return (
    <PageLayout school={school}>
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-8">
          <div className="max-w-7xl mx-auto">

          {/* Header Profil */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="text-8xl">👤</div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {student.firstName && student.lastName 
                    ? `${student.firstName} ${student.lastName}`
                    : student.firstName || student.lastName || student.email?.split('@')[0] || 'Étudiant'}
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
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🔐 Sécurité</h2>
            </div>

            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="btn btn-outline"
              >
                Modifier le mot de passe
              </button>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      className="form-control pr-12"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Entrez votre mot de passe actuel"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showCurrentPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      className="form-control pr-12"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Entrez votre nouveau mot de passe"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showNewPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez votre nouveau mot de passe"
                    required
                  />
                </div>

                {passwordMessage.text && (
                  <div className={`p-3 rounded-lg ${
                    passwordMessage.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {passwordMessage.text}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Modifier le mot de passe
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setPasswordMessage({ type: '', text: '' });
                    }}
                    className="btn btn-secondary"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Associations Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8">
            {/* Associations Content */}
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
            </div>
          </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

