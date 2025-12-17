import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/shared/PageLayout';
import { useStudentAuth } from '../contexts/StudentAuthContext';

export default function ReportIssuePage({ school = 'eugenia' }) {
  const { student } = useStudentAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    photo: null,
    photoPreview: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    { value: 'materiel', label: 'Matériel cassé', emoji: '🪑' },
    { value: 'nettoyage', label: 'Nettoyage nécessaire', emoji: '🧹' },
    { value: 'securite', label: 'Problème de sécurité', emoji: '🚨' },
    { value: 'technique', label: 'Problème technique', emoji: '💻' },
    { value: 'autre', label: 'Autre', emoji: '📋' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'La photo est trop grande (max 5MB)' });
        return;
      }

      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Veuillez sélectionner une image' });
        return;
      }

      setFormData(prev => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: 'Veuillez indiquer un titre' });
      return;
    }

    if (!formData.description.trim()) {
      setMessage({ type: 'error', text: 'Veuillez décrire le problème' });
      return;
    }

    if (!formData.location.trim()) {
      setMessage({ type: 'error', text: 'Veuillez indiquer la localisation' });
      return;
    }

    if (!formData.category) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner une catégorie' });
      return;
    }

    setSubmitting(true);

    try {
      // Convertir la photo en base64
      let photoBase64 = null;
      if (formData.photo) {
        photoBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(formData.photo);
        });
      }

      const API_URL = import.meta.env.VITE_API_URL;
      
      if (!API_URL) {
        console.warn('VITE_API_URL n\'est pas définie, utilisation du fallback localStorage');
      }
      
      if (API_URL) {
        const response = await fetch(`${API_URL}/reports`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            location: formData.location,
            category: formData.category,
            photo: photoBase64,
            studentEmail: student?.email || 'anonymous@eugeniaschool.com',
            studentName: student ? `${student.firstName} ${student.lastName}` : 'Anonyme'
          })
        });

        // Lire la réponse même en cas d'erreur
        let result;
        try {
          result = await response.json();
        } catch (e) {
          // Si la réponse n'est pas du JSON, lire le texte
          const text = await response.text();
          throw new Error(`Erreur serveur (${response.status}): ${text || response.statusText}`);
        }

        if (!response.ok) {
          const errorMessage = result?.error || result?.message || `Erreur ${response.status}: ${response.statusText}`;
          throw new Error(errorMessage);
        }
        
        if (result.success) {
          setMessage({ 
            type: 'success', 
            text: 'Signalement envoyé avec succès ! Il sera traité par l\'administration.' 
          });
          
          // Reset form
          setFormData({
            title: '',
            description: '',
            location: '',
            category: '',
            photo: null,
            photoPreview: null
          });
          
          // Rediriger après 2 secondes
          const basePath = school === 'albert' ? '/albert-school' : '/eugenia-school';
          setTimeout(() => {
            navigate(basePath);
          }, 2000);
        } else {
          throw new Error(result.error || result.message || 'Erreur lors de l\'envoi');
        }
      } else {
        // Fallback: sauvegarder dans localStorage
        const reports = JSON.parse(localStorage.getItem('reports') || '[]');
        const newReport = {
          id: `report_${Date.now()}`,
          ...formData,
          photo: photoBase64,
          studentEmail: student?.email || 'anonymous@eugeniaschool.com',
          studentName: student ? `${student.firstName} ${student.lastName}` : 'Anonyme',
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        reports.push(newReport);
        localStorage.setItem('reports', JSON.stringify(reports));
        
        setMessage({ 
          type: 'success', 
          text: 'Signalement enregistré localement !' 
        });
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      let errorMessage = 'Une erreur est survenue lors de l\'envoi du signalement';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet et réessayez.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setMessage({ 
        type: 'error', 
        text: `Erreur: ${errorMessage}` 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout school={school}>
      <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="student-hero-section py-20 px-4 text-white">
        <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              🚨 Signaler un problème
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Aidez-nous à améliorer le campus en signalant les problèmes
            </p>
        </div>
      </section>

      <div className="py-12 px-4 -mt-16 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Catégorie */}
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.category === cat.value
                        ? 'border-eugenia-burgundy bg-eugenia-burgundy/5 ring-2 ring-eugenia-burgundy/20 transform scale-105'
                        : 'border-gray-200 hover:border-eugenia-burgundy/50 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{cat.emoji}</div>
                    <div className="text-sm font-semibold text-gray-700">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Titre */}
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">
                Titre du problème <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-eugenia-burgundy focus:ring-4 focus:ring-eugenia-burgundy/10 transition-all text-gray-900 bg-gray-50 focus:bg-white"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ex: Chaise cassée dans la salle 101"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-eugenia-burgundy focus:ring-4 focus:ring-eugenia-burgundy/10 transition-all text-gray-900 bg-gray-50 focus:bg-white min-h-[120px]"
                rows="4"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Décrivez le problème en détail..."
                required
              />
            </div>

            {/* Localisation */}
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">
                Localisation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:border-eugenia-burgundy focus:ring-4 focus:ring-eugenia-burgundy/10 transition-all text-gray-900 bg-gray-50 focus:bg-white"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ex: Salle 101, Couloir 2ème étage, Cafétéria..."
                required
              />
            </div>

            {/* Photo */}
            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">
                Photo (optionnel)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-gray-500">
                      <div className="text-4xl mb-2">📸</div>
                      <span className="font-semibold">Cliquez pour ajouter une photo</span>
                      <p className="text-xs mt-1">PNG, JPG jusqu'à 5MB</p>
                  </div>
              </div>

              {formData.photoPreview && (
                <div className="mt-4 relative inline-block">
                  <img
                    src={formData.photoPreview}
                    alt="Preview"
                    className="max-w-full h-48 object-cover rounded-xl shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, photo: null, photoPreview: null }))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              )}
            </div>

            {/* Message */}
            {message.text && (
              <div className={`p-4 rounded-xl border ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <p className="flex items-center gap-2">
                    <span className="text-xl">{message.type === 'success' ? '✅' : '⚠️'}</span>
                    {message.text}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-eugenia-burgundy to-eugenia-pink text-white font-bold text-xl py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-70"
              disabled={submitting}
            >
              {submitting ? 'Envoi en cours...' : '📤 Envoyer le signalement'}
            </button>
          </form>
        </div>
      </div>
      </div>

      </div>
    </PageLayout>
  );
}

