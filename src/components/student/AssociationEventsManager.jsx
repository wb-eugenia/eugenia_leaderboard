import { useState } from 'react';
import { createAssociationEvent, updateAssociationEvent, deleteAssociationEvent } from '../../services/associationsApi';
import { useStudentAuth } from '../../contexts/StudentAuthContext';

export default function AssociationEventsManager({ associationId, events, onUpdate }) {
  const { student } = useStudentAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date) {
      setError('Le titre et la date sont requis');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      if (editingEvent) {
        await updateAssociationEvent(associationId, editingEvent.id, {
          ...formData,
          email: student.email
        });
      } else {
        await createAssociationEvent(associationId, {
          ...formData,
          createdBy: student.email
        });
      }

      setFormData({ title: '', description: '', date: '', time: '', location: '' });
      setShowForm(false);
      setEditingEvent(null);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Error saving event:', err);
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      date: event.date,
      time: event.time || '',
      location: event.location || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }

    try {
      await deleteAssociationEvent(associationId, eventId, student.email);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Erreur lors de la suppression : ' + (error.message || 'Erreur inconnue'));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
    setFormData({ title: '', description: '', date: '', time: '', location: '' });
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Bouton créer événement */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 px-6 bg-gradient-to-r from-eugenia-burgundy to-eugenia-pink text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          ➕ Créer un événement
        </button>
      )}

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eugenia-yellow focus:border-eugenia-yellow outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eugenia-yellow focus:border-eugenia-yellow outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eugenia-yellow focus:border-eugenia-yellow outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Heure
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eugenia-yellow focus:border-eugenia-yellow outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lieu
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Campus Eugenia, Salle 101"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-eugenia-yellow focus:border-eugenia-yellow outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-eugenia-burgundy to-eugenia-pink text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? '⏳ Enregistrement...' : (editingEvent ? '💾 Enregistrer' : '➕ Créer')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des événements */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Événements ({events.length})
        </h3>

        {events.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
            <div className="text-4xl mb-2">📅</div>
            <p className="text-gray-500">Aucun événement créé</p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map(event => {
              const eventDate = new Date(event.date);
              const isPast = eventDate < new Date();
              
              return (
                <div
                  key={event.id}
                  className={`bg-white rounded-lg p-4 border-2 transition-all ${
                    isPast ? 'border-gray-200 opacity-60' : 'border-gray-200 hover:border-eugenia-pink'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-lg text-gray-900">{event.title}</h4>
                        {isPast && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold">
                            Passé
                          </span>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          📅 {eventDate.toLocaleDateString('fr-FR')}
                        </div>
                        {event.time && (
                          <div className="flex items-center gap-1">
                            🕐 {event.time}
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-1">
                            📍 {event.location}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 transition-colors"
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold hover:bg-red-700 transition-colors"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

