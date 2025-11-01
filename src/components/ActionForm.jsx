import React, { useState, useEffect } from 'react'
import './ActionForm.css'

function ActionForm({ appScriptUrl, onSuccess }) {
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('')
  const [subType, setSubType] = useState('')
  const [notes, setNotes] = useState('')
  const [formData, setFormData] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [formConfig, setFormConfig] = useState(null)
  const [configLoading, setConfigLoading] = useState(true)

  // Fallback categories (configuration par défaut hardcodée)
  const defaultCategories = {
    linkedin: {
      label: '📱 LinkedIn',
      subTypes: {
        'linkedin': { label: 'Post LinkedIn', fields: ['link'] }
      }
    },
    salon: {
      label: '🎓 Salon/Event',
      subTypes: {
        'salon-1j': { label: 'Salon (1 journée)', fields: ['date'] },
        'jpo': { label: 'JPO', fields: ['date'] },
        'forum-lycee': { label: 'Forum Lycée', fields: ['date'] },
        'salon-demi': { label: 'Salon 1/2 journée', fields: ['date'] }
      }
    },
    victoire: {
      label: '🏆 Victoire',
      subTypes: {
        'hackathon': { label: 'Hackathon', fields: ['date'] },
        'lead-salon': { label: 'Lead Salon', fields: ['date'] },
        'bdd': { label: 'BDD', fields: ['date'] }
      }
    },
    autre: {
      label: '✨ Autre',
      subTypes: {
        'creation-asso': { label: 'Création Asso', fields: ['nom'] },
        'creation-event': { label: 'Création Événement', fields: ['nom'] },
        'contact-interessant': { label: 'Contact Intéressant', fields: ['nom'] }
      }
    }
  }

  // Charger la configuration au montage
  useEffect(() => {
    loadFormConfig()
  }, [])

  const loadFormConfig = async () => {
    try {
      setConfigLoading(true)
      const response = await fetch(`${appScriptUrl}?action=getFormConfig`)
      const data = await response.json()
      
      // Vérifier si on a reçu une configuration valide
      if (data && data.categories && Object.keys(data.categories).length > 0) {
        setFormConfig(data)
      } else {
        setFormConfig(null)
      }
    } catch (error) {
      console.error('Error loading form config:', error)
      setFormConfig(null)
    } finally {
      setConfigLoading(false)
    }
  }

  // Utiliser formConfig si disponible, sinon fallback sur defaultCategories
  const categories = formConfig?.categories || defaultCategories

  const handleCategoryChange = (e) => {
    const cat = e.target.value
    setCategory(cat)
    setSubType('')
    setFormData({})
    setMessage({ type: '', text: '' })
  }

  const handleSubTypeChange = (e) => {
    const sub = e.target.value
    setSubType(sub)
    setFormData({})
    setMessage({ type: '', text: '' })
  }

  const handleFieldChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const validateForm = () => {
    if (!email) {
      setMessage({ type: 'error', text: 'L\'email est obligatoire' })
      return false
    }

    // Valider que l'email contient @eugeniaschool.com
    if (!email.toLowerCase().includes('@eugeniaschool.com')) {
      setMessage({ type: 'error', text: 'Seuls les emails @eugeniaschool.com sont acceptés' })
      return false
    }

    if (!category) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner une catégorie' })
      return false
    }

    if (!subType) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un type' })
      return false
    }

    // Vérifier si on utilise la configuration dynamique ou l'ancienne
    const subTypeConfig = categories[category]?.subTypes?.[subType]
    
    if (subTypeConfig && subTypeConfig.fields) {
      // Configuration dynamique : vérifier les champs requis
      const requiredFields = subTypeConfig.fields.filter(f => f.required)
      for (const field of requiredFields) {
        if (!formData[field.name] || formData[field.name].toString().trim() === '') {
          setMessage({ type: 'error', text: 'Veuillez remplir tous les champs requis' })
          return false
        }
      }
    } else {
      // Ancienne configuration : vérifier les champs hardcodés
      const requiredFields = categories[category]?.subTypes?.[subType]?.fields || []
      for (const field of requiredFields) {
        if (!formData[field] || formData[field].toString().trim() === '') {
          setMessage({ type: 'error', text: 'Veuillez remplir tous les champs requis' })
          return false
        }
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        email,
        category,
        subType,
        actionType: subType, // Pour compatibilité avec le code existant
        notes,
        ...formData,
        timestamp: new Date().toISOString()
      }

      console.log('Submitting:', payload)
      console.log('URL:', appScriptUrl)
      
      // Utiliser mode 'no-cors' car Apps Script a des restrictions CORS
      await fetch(appScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      
      // En mode no-cors, on ne peut pas lire la réponse
      // On considère que la soumission est réussie si aucune erreur n'est levée
      
      console.log('Submission sent successfully')
      
      setMessage({ type: 'success', text: 'Votre action a été soumise avec succès ! Elle sera validée prochainement.' })
      setEmail('')
      setCategory('')
      setSubType('')
      setNotes('')
      setFormData({})
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error submitting action:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la soumission. Veuillez réessayer.' })
    } finally {
      setSubmitting(false)
    }
  }

  // Afficher un loader pendant le chargement de la config
  if (configLoading) {
    return (
      <div className="action-form">
        <div className="leaderboard-loading">
          <div className="spinner"></div>
          <p>Chargement de la configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="action-form">
      <h2>Soumettre une action</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">
            Email étudiant (@eugeniaschool.com) <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="etudiant@eugeniaschool.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">
            Catégorie <span className="required">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Sélectionnez une catégorie</option>
            {Object.entries(categories).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
        </div>

        {category && (
          <div className="form-group">
            <label htmlFor="subType">
              Type <span className="required">*</span>
            </label>
            <select
              id="subType"
              value={subType}
              onChange={handleSubTypeChange}
              required
            >
              <option value="">Sélectionnez un type</option>
              {Object.entries(categories[category].subTypes).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {category && subType && (
          <div className="dynamic-fields">
            {/* Rendering dynamique basé sur la configuration */}
            {formConfig && formConfig.categories && formConfig.categories[category] && 
             formConfig.categories[category].subTypes && 
             formConfig.categories[category].subTypes[subType] && 
             formConfig.categories[category].subTypes[subType].fields ? (
              // Configuration dynamique depuis Google Sheets
              formConfig.categories[category].subTypes[subType].fields.map((field, idx) => (
                <div key={idx} className="form-group">
                  <label htmlFor={field.name}>
                    {field.label} {field.required && <span className="required">*</span>}
                  </label>
                  {field.type === 'text' && (
                    <input
                      type="text"
                      id={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                  {field.type === 'date' && (
                    <input
                      type="date"
                      id={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      required={field.required}
                    />
                  )}
                  {field.type === 'url' && (
                    <input
                      type="url"
                      id={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                  {field.type === 'textarea' && (
                    <textarea
                      id={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      rows="4"
                      required={field.required}
                    />
                  )}
                  {field.type === 'select' && field.options && field.options.length > 0 && (
                    <select
                      id={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      required={field.required}
                    >
                      <option value="">Sélectionnez...</option>
                      {field.options.map((opt, optIdx) => (
                        <option key={optIdx} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                  {field.type === 'number' && (
                    <input
                      type="number"
                      id={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                </div>
              ))
            ) : (
              // Fallback vers l'ancienne logique hardcodée
              <>
                {category === 'linkedin' && (
                  <div className="form-group">
                    <label htmlFor="link">
                      Lien du post <span className="required">*</span>
                    </label>
                    <input
                      type="url"
                      id="link"
                      value={formData.link || ''}
                      onChange={(e) => handleFieldChange('link', e.target.value)}
                      placeholder="https://www.linkedin.com/posts/..."
                      required
                    />
                  </div>
                )}
                {category === 'salon' && (
                  <div className="form-group">
                    <label htmlFor="date">
                      Date <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={formData.date || ''}
                      onChange={(e) => handleFieldChange('date', e.target.value)}
                      required
                    />
                  </div>
                )}
                {category === 'victoire' && (
                  <div className="form-group">
                    <label htmlFor="date">
                      Date <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={formData.date || ''}
                      onChange={(e) => handleFieldChange('date', e.target.value)}
                      required
                    />
                  </div>
                )}
                {category === 'autre' && (
                  <div className="form-group">
                    <label htmlFor="nom">
                      Nom <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="nom"
                      value={formData.nom || ''}
                      onChange={(e) => handleFieldChange('nom', e.target.value)}
                      placeholder={
                        subType === 'creation-asso' ? 'Nom de l\'association' :
                        subType === 'creation-event' ? 'Nom de l\'événement' :
                        'Nom du contact'
                      }
                      required
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="notes">
            Notes / Commentaires (optionnel)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ajoutez des informations supplémentaires..."
            rows="4"
          />
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          className="submit-button"
          disabled={submitting}
        >
          {submitting ? 'Envoi en cours...' : 'Soumettre l\'action'}
        </button>
      </form>
    </div>
  )
}

export default ActionForm

