import { useState, useEffect } from 'react';
import { getAllAssociations, applyToAssociation } from '../../services/associationsApi';
import { useStudentAuth } from '../../contexts/StudentAuthContext';

export default function AssociationApplicationForm({ school = 'eugenia', onSuccess }) {
  const { student } = useStudentAuth();
  const [associations, setAssociations] = useState([]);
  const [selectedAssociation, setSelectedAssociation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssociations() {
      try {
        setLoading(true);
        setError('');
        const data = await getAllAssociations();
        
        // Vérifier que la réponse est un tableau
        if (Array.isArray(data)) {
          setAssociations(data);
        } else if (data && Array.isArray(data.associations)) {
          // Si la réponse est un objet avec une propriété associations
          setAssociations(data.associations);
        } else if (data && data.error) {
          // Si c'est une erreur
          setError(data.error || 'Erreur lors du chargement des associations');
          setAssociations([]);
        } else {
          // Format inattendu
          console.warn('Unexpected data format:', data);
          setAssociations([]);
        }
      } catch (err) {
        console.error('Error fetching associations:', err);
        setError(err.message || 'Erreur lors du chargement des associations');
        setAssociations([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAssociations();
  }, []);

  const handleOpenModal = (association) => {
    if (!student) {
      setError('Vous devez être connecté pour postuler');
      return;
    }
    setSelectedAssociation(association);
    setIsModalOpen(true);
    setMessage('');
    setError('');
    setSuccess(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAssociation(null);
    setMessage('');
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedAssociation) {
      setError('Aucune association sélectionnée');
      return;
    }

    if (!student?.email) {
      setError('Vous devez être connecté pour postuler');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess(false);

      await applyToAssociation(selectedAssociation.id, student.email, message);
      
      setSuccess(true);
      setMessage('');
      
      // Fermer le modal après 2 secondes
      setTimeout(() => {
        handleCloseModal();
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
    } catch (err) {
      console.error('Error applying to association:', err);
      setError(err.message || 'Erreur lors de la candidature. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Chargement des associations...</div>
      </div>
    );
  }

  if (!loading && Array.isArray(associations) && associations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center">
        <div className="text-5xl mb-3">🤝</div>
        <p className="text-gray-600">
          {error || 'Aucune association disponible pour le moment.'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-100">
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 text-center">
          📝 Postuler à une association
        </h3>

        {!student && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm text-center">
              ⚠️ Vous devez être connecté pour postuler à une association.
            </p>
          </div>
        )}

        {/* Grille de cartes d'associations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
          {Array.isArray(associations) && associations.map(asso => (
            <div
              key={asso.id}
              className="bg-white rounded-lg p-3 lg:p-4 border-2 border-gray-200 hover:border-eugenia-pink hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group cursor-pointer h-full"
            >
              {/* Emoji/Logo */}
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner flex items-center justify-center text-3xl lg:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                {asso.emoji || '🤝'}
              </div>
              
              {/* Nom */}
              <h4 className="font-bold text-gray-900 mb-1.5 text-sm lg:text-base line-clamp-2 min-h-[2.5rem] flex items-center justify-center">
                {asso.name}
              </h4>
              
              {/* Catégorie */}
              {asso.category && (
                <span className="text-xs text-gray-500 mb-1.5 px-2 py-0.5 bg-gray-100 rounded-full font-medium">
                  {asso.category}
                </span>
              )}
              
              {/* Nombre de membres */}
              <div className="text-xs text-gray-600 mb-2 flex items-center gap-1 flex-grow">
                <span>👥</span>
                <span className="font-semibold">{asso.membersCount || 0}</span>
                <span className="text-gray-500">membre{asso.membersCount !== 1 ? 's' : ''}</span>
              </div>
              
              {/* Bouton Postuler */}
              <button
                onClick={() => handleOpenModal(asso)}
                disabled={!student}
                className="w-full py-2 px-3 bg-gradient-to-r from-eugenia-burgundy to-eugenia-pink text-white font-semibold rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-xs lg:text-sm mt-auto"
              >
                {!student ? 'Connectez-vous' : 'Postuler'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de candidature */}
      {isModalOpen && selectedAssociation && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du modal */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-4xl">
                  {selectedAssociation.emoji || '🤝'}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Postuler à {selectedAssociation.name}
                  </h3>
                  {selectedAssociation.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {selectedAssociation.description}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            {/* Messages de succès/erreur */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <span className="text-xl">✅</span>
                  <span className="font-semibold">Candidature envoyée avec succès !</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Votre candidature a été soumise. Les administrateurs de l'association vous contacteront bientôt.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <span className="text-xl">❌</span>
                  <span className="font-semibold">{error}</span>
                </div>
              </div>
            )}

            {/* Formulaire */}
            {!success && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations étudiant */}
                {student && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Vos informations :</p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Nom :</span> {student.firstName} {student.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email :</span> {student.email}
                    </p>
                  </div>
                )}

                {/* Message de motivation */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message de motivation <span className="text-gray-500 font-normal">(optionnel)</span>
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-eugenia-pink focus:border-eugenia-pink outline-none transition-all resize-none"
                    placeholder="Expliquez pourquoi vous souhaitez rejoindre cette association..."
                    disabled={submitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {message.length} caractères
                  </p>
                </div>

                {/* Boutons */}
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    disabled={submitting}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !student}
                    className="px-6 py-3 bg-gradient-to-r from-eugenia-burgundy to-eugenia-pink text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Envoi en cours...
                      </span>
                    ) : (
                      '📤 Envoyer la candidature'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
