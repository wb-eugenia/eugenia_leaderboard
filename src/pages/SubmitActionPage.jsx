import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActionTypes } from '../services/configService';
import { submitAction } from '../services/googleSheets';
import PageLayout from '../components/shared/PageLayout';

export default function SubmitActionPage({ school = 'eugenia' }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [actionTypes, setActionTypes] = useState([]);
  
  useEffect(() => {
    loadActionTypes();
  }, []);

  const loadActionTypes = async () => {
    const types = await getActionTypes();
    setActionTypes(types);
  };

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

  // Validation email selon l'école
  const isValidSchoolEmail = (email, schoolType) => {
    if (!email || typeof email !== 'string') return false;
    const emailLower = email.toLowerCase().trim();
    
    // Domaines autorisés par école
    const domains = {
      eugenia: ['@eugeniaschool.com'],
      albert: ['@albertschool.com'],
      // Fallback: autoriser les deux si école non spécifiée
      default: ['@eugeniaschool.com', '@albertschool.com']
    };
    
    const allowedDomains = domains[schoolType] || domains.default;
    return allowedDomains.some(domain => emailLower.endsWith(domain));
  };

  const getEmailDomainHint = (schoolType) => {
    const hints = {
      eugenia: '@eugeniaschool.com',
      albert: '@albertschool.com',
      default: '@eugeniaschool.com ou @albertschool.com'
    };
    return hints[schoolType] || hints.default;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation email selon l'école
    if (!isValidSchoolEmail(email, school)) {
      setMessage({ 
        type: 'error', 
        text: `Veuillez entrer un email ${getEmailDomainHint(school)} valide` 
      });
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
        
        // Redirect to leaderboard after 2 seconds (use correct school path)
        setTimeout(() => {
          const basePath = school === 'albert' ? '/albert-school' : '/eugenia-school';
          navigate(`${basePath}/leaderboard`);
        }, 2000);
      } else {
        // Check if it's a duplicate error
        if (result.error === 'duplicate') {
          setMessage({ type: 'error', text: result.message || 'Cette action a déjà été soumise. Veuillez soumettre une action différente.' });
        } else {
          // Display detailed error message
          const errorMsg = result.error || result.message || 'Erreur lors de la soumission';
          console.error('Submit error:', result);
          setMessage({ 
            type: 'error', 
            text: `Erreur: ${errorMsg}. Veuillez vérifier votre connexion et réessayer.` 
          });
        }
      }
    } catch (error) {
      console.error('Error submitting:', error);
      setMessage({ 
        type: 'error', 
        text: `Une erreur est survenue: ${error.message || error.toString()}. Vérifiez votre connexion.` 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedActionType = actionTypes.find(t => t.id === selectedType);

  return (
    <PageLayout school={school}>
      <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="student-hero-section py-20 px-4 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            ➕ Soumettre une action
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto">
             Gagnez des points pour votre participation aux événements et actions de l'école
          </p>
        </div>
      </section>

      <div className="py-12 px-4 -mt-16 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email */}
              <div>
                <label className="block text-gray-700 font-bold mb-3 text-lg">
                  Email étudiant <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                    <input
                      type="email"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-eugenia-burgundy focus:ring-4 focus:ring-eugenia-burgundy/10 transition-all text-gray-900 bg-gray-50 focus:bg-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={school === 'albert' ? 'prenom.nom@albertschool.com' : 'prenom.nom@eugeniaschool.com'}
                      required
                    />
                </div>
              </div>

              {/* Type d'action */}
              <div>
                <label className="block text-gray-700 font-bold mb-3 text-lg">
                  Type d'action <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-eugenia-burgundy focus:ring-4 focus:ring-eugenia-burgundy/10 transition-all text-gray-900 bg-gray-50 focus:bg-white appearance-none"
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
                  <label className="block text-gray-700 font-bold mb-3 text-lg">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-eugenia-burgundy focus:ring-4 focus:ring-eugenia-burgundy/10 transition-all text-gray-900 bg-gray-50 focus:bg-white min-h-[120px]"
                      rows="4"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  ) : (
                    <input
                      type={field.type}
                      className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-eugenia-burgundy focus:ring-4 focus:ring-eugenia-burgundy/10 transition-all text-gray-900 bg-gray-50 focus:bg-white"
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
                <div className={`p-4 rounded-xl border ${
                  message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <p className="flex items-center gap-2">
                    <span className="text-xl">{message.type === 'success' ? '✅' : '⚠️'}</span>
                    {message.text}
                  </p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-eugenia-burgundy to-eugenia-pink text-white font-bold text-xl py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                disabled={submitting}
              >
                {submitting ? 'Envoi en cours...' : '🚀 Soumettre l\'action'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

