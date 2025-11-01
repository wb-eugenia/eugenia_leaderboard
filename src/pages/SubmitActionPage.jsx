import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActionTypes } from '../services/configService';
import { submitAction } from '../services/googleSheets';

export default function SubmitActionPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const actionTypes = getActionTypes();

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setFormData({});
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData({
      ...formData,
      [fieldName]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation basique
    if (!email || !email.includes('@eugeniaschool.com')) {
      setMessage({ type: 'error', text: 'Veuillez entrer un email @eugeniaschool.com valide' });
      return;
    }

    if (!selectedType) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un type d\'action' });
      return;
    }

    setSubmitting(true);

    try {
      const result = await submitAction({
        email,
        type: selectedType,
        data: formData
      });

      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: 'Votre action a été soumise avec succès ! Elle sera validée prochainement.' 
        });
        
        // Reset form
        setEmail('');
        setSelectedType('');
        setFormData({});
        
        // Redirect to leaderboard after 2 seconds
        setTimeout(() => {
          navigate('/leaderboard');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la soumission. Veuillez réessayer.' });
      }
    } catch (error) {
      console.error('Error submitting:', error);
      setMessage({ type: 'error', text: 'Une erreur est survenue' });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedActionType = actionTypes.find(t => t.id === selectedType);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-8">
          ➕ Soumettre une action
        </h2>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email étudiant (@eugeniaschool.com) <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="prenom.nom@eugeniaschool.com"
              required
            />
          </div>

          {/* Type d'action */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Type d'action <span className="text-red-500">*</span>
            </label>
            <select
              className="form-control"
              value={selectedType}
              onChange={handleTypeChange}
              required
            >
              <option value="">Sélectionnez un type</option>
              {actionTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.emoji} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Champs dynamiques */}
          {selectedActionType && selectedActionType.fields.map(field => (
            <div key={field.name}>
              <label className="block text-gray-700 font-semibold mb-2">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  className="form-control"
                  rows="4"
                  value={formData[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type}
                  className="form-control"
                  value={formData[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
            </div>
          ))}

          {/* Message */}
          {message.text && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary w-full text-lg"
            disabled={submitting}
          >
            {submitting ? 'Envoi en cours...' : 'Soumettre l\'action'}
          </button>
        </form>
      </div>
    </div>
  );
}

