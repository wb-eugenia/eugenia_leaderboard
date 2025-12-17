import { useState } from 'react';
import { createAssociation } from '../../services/associationsApi';
import { useStudentAuth } from '../../contexts/StudentAuthContext';
import { useSchoolTheme } from '../../hooks/useSchoolTheme';

const EMOJI_OPTIONS = [
  '🎭', '🎵', '⚽', '🎨', '🌍', '💡', '📚', '🎬', '🎮', '🏃',
  '🎤', '🎸', '🎹', '🎺', '🎻', '🏀', '⚾', '🏐', '🏓', '🏸',
  '🎯', '🎲', '🧩', '🎪', '🎨', '🖼️', '📸', '🎥', '🎬', '🎞️',
  '🤝', '👥', '🌟', '💫', '🔥', '⭐', '✨', '🎉', '🎊', '🎈'
];

const CATEGORIES = ['Culture', 'Sport', 'Social', 'Innovation', 'Autre'];

export default function CreateAssociationForm({ school = 'eugenia', onSuccess, onClose }) {
  const { student } = useStudentAuth();
  const theme = useSchoolTheme(school);
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🤝',
    description: '',
    category: 'Autre'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!student?.email) {
      setError('Vous devez être connecté pour créer une association');
      return;
    }

    if (!formData.name.trim()) {
      setError('Le nom de l\'association est requis');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess(false);

      const result = await createAssociation({
        name: formData.name.trim(),
        emoji: formData.emoji,
        description: formData.description.trim(),
        category: formData.category,
        createdBy: student.email
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(result.id);
          }
          if (onClose) {
            onClose();
          }
        }, 1500);
      } else {
        setError(result.error || 'Erreur lors de la création de l\'association');
      }
    } catch (err) {
      console.error('Error creating association:', err);
      setError(err.message || 'Erreur lors de la création de l\'association');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Créer une nouvelle association
          </h3>
          <p className="text-sm text-gray-600">
            Remplissez le formulaire ci-dessous pour créer votre association
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Association créée avec succès !</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Vous êtes maintenant administrateur de cette association.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">{error}</span>
          </div>
        </div>
      )}

      {/* Formulaire */}
      {!success && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Nom de l'association <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eugenia-yellow focus:border-eugenia-yellow outline-none"
              placeholder="Ex: Eugenia Théâtre"
              required
              disabled={submitting}
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.name.length}/100 caractères
            </p>
          </div>

          {/* Emoji */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Icône de l'association (emoji)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-4xl border-2 border-gray-300">
                {formData.emoji}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.emoji}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eugenia-yellow focus:border-eugenia-yellow outline-none"
                  placeholder="Choisissez un emoji"
                  maxLength={2}
                  disabled={submitting}
                />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-600 mb-2">Ou choisissez parmi les suggestions :</p>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, emoji })}
                    className={`w-10 h-10 rounded-lg text-2xl hover:scale-110 transition-transform ${
                      formData.emoji === emoji 
                        ? 'bg-eugenia-yellow ring-2 ring-eugenia-burgundy' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    disabled={submitting}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eugenia-yellow focus:border-eugenia-yellow outline-none resize-none"
              placeholder="Décrivez votre association, ses objectifs et ses activités..."
              disabled={submitting}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500 caractères
            </p>
          </div>

          {/* Catégorie */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eugenia-yellow focus:border-eugenia-yellow outline-none"
              disabled={submitting}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Informations */}
          {student && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">Créateur :</p>
              <p className="text-sm text-gray-600">
                {student.firstName} {student.lastName} ({student.email})
              </p>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Vous serez automatiquement nommé administrateur de cette association.
              </p>
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                disabled={submitting}
              >
                Annuler
              </button>
            )}
            <button
              type="submit"
              disabled={submitting || !student || !formData.name.trim()}
              className="px-6 py-3 bg-gradient-to-r from-eugenia-burgundy to-eugenia-pink text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: submitting || !student || !formData.name.trim() 
                  ? undefined 
                  : `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
              }}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création en cours...
                </span>
              ) : (
                'Créer l\'association'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

