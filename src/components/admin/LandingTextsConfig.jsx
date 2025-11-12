import React, { useState, useEffect } from 'react';
import { getGlobalConfig, updateGlobalConfig } from '../../services/configService';

export default function LandingTextsConfig() {
  const [config, setConfig] = useState(null);
  const [landingTexts, setLandingTexts] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('🔄 Loading landing page config...');
      const loadedConfig = await getGlobalConfig();
      console.log('📥 Loaded config:', loadedConfig);
      
      // Si pas de config ou config invalide, utiliser des valeurs par défaut
      if (!loadedConfig || typeof loadedConfig !== 'object') {
        console.warn('⚠️ No config loaded, using defaults');
        const defaultConfig = {
          totalPrizePool: '+500€',
          deadline: '31 janvier 2026',
          landingTexts: {}
        };
        setConfig(defaultConfig);
        setLandingTexts({});
        return;
      }
      
      // Forcer une nouvelle référence pour que React détecte le changement
      const newConfig = {
        ...loadedConfig,
        landingTexts: loadedConfig.landingTexts ? { ...loadedConfig.landingTexts } : {}
      };
      console.log('🔄 Setting new config:', newConfig);
      console.log('🔄 New landingTexts:', newConfig.landingTexts);
      
      // Mettre à jour les states
      setConfig(newConfig);
      setLandingTexts(loadedConfig.landingTexts ? { ...loadedConfig.landingTexts } : {});
      
      // Incrémenter la clé de refresh pour forcer le re-render des inputs
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('❌ Error loading config:', error);
      // En cas d'erreur, initialiser avec des valeurs par défaut pour ne pas rester bloqué
      const defaultConfig = {
        totalPrizePool: '+500€',
        deadline: '31 janvier 2026',
        landingTexts: {}
      };
      setConfig(defaultConfig);
      setLandingTexts({});
    }
  };

  const handleUpdate = (field, value) => {
    if (!config) return; // Sécurité si config n'est pas encore chargé
    
    const updatedLandingTexts = {
      ...landingTexts,
      [field]: value
    };
    setLandingTexts(updatedLandingTexts);
    setConfig({
      ...config,
      landingTexts: updatedLandingTexts
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('💾 Saving config:', config);
      console.log('💾 Saving landingTexts:', landingTexts);
      // Utiliser config avec landingTexts à jour
      const configToSave = {
        ...config,
        landingTexts: landingTexts
      };
      await updateGlobalConfig(configToSave);
      console.log('✅ Config saved, reloading...');
      // Attendre un peu pour que la DB soit mise à jour
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Vérifier directement que les données sont bien sauvegardées
      const verifyConfig = await getGlobalConfig();
      console.log('🔍 Verified config after save:', verifyConfig);
      // Recharger les données après sauvegarde
      await loadData();
      console.log('✅ Data reloaded');
      setMessage({ 
        type: 'success', 
        text: '✅ Configuration sauvegardée avec succès !' 
      });
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('❌ Error saving config:', error);
      setMessage({ 
        type: 'error', 
        text: `❌ Erreur lors de la sauvegarde: ${error.message}` 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!config) {
    return (
      <div className="text-center py-12">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">📝 Configuration des Textes Landing Page</h2>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message.text}
        </div>
      )}

      {/* Hero Section */}
      <div className="card">
        <h3 className="text-2xl font-bold mb-4">🎯 Section Hero</h3>
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Titre principal</label>
            <input
              type="text"
              className="form-control"
              value={landingTexts.heroTitle || ''}
              onChange={(e) => handleUpdate('heroTitle', e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Sous-titre</label>
            <textarea
              className="form-control"
              rows="3"
              value={landingTexts.heroSubtitle || ''}
              onChange={(e) => handleUpdate('heroSubtitle', e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Badge cagnotte</label>
            <textarea
              className="form-control"
              rows="2"
              value={landingTexts.prizeBadge || ''}
              onChange={(e) => handleUpdate('prizeBadge', e.target.value)}
              placeholder="Ligne 1\nLigne 2"
            />
          </div>
        </div>
      </div>

      {/* Section Récompenses */}
      <div className="card">
        <h3 className="text-2xl font-bold mb-4">💰 Section Récompenses</h3>
        <div>
          <label className="block font-semibold mb-2">Titre</label>
            <input
              type="text"
              className="form-control"
              value={landingTexts.sectionRewardsTitle || ''}
              onChange={(e) => handleUpdate('sectionRewardsTitle', e.target.value)}
            />
        </div>
      </div>

      {/* Comment ça marche */}
      <div className="card">
        <h3 className="text-2xl font-bold mb-4">📖 Section Comment ça marche</h3>
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Titre</label>
            <input
              type="text"
              className="form-control"
              value={landingTexts.sectionHowItWorksTitle || ''}
              onChange={(e) => handleUpdate('sectionHowItWorksTitle', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-2">Étape 1 - Titre</label>
              <input
                type="text"
                className="form-control"
                value={landingTexts.step1Title || ''}
                onChange={(e) => handleUpdate('step1Title', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Étape 2 - Titre</label>
              <input
                type="text"
                className="form-control"
                value={landingTexts.step2Title || ''}
                onChange={(e) => handleUpdate('step2Title', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Étape 3 - Titre</label>
              <input
                type="text"
                className="form-control"
                value={landingTexts.step3Title || ''}
                onChange={(e) => handleUpdate('step3Title', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-2">Étape 1 - Description</label>
              <textarea
                className="form-control"
                rows="2"
                value={landingTexts.step1Desc || ''}
                onChange={(e) => handleUpdate('step1Desc', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Étape 2 - Description</label>
              <textarea
                className="form-control"
                rows="2"
                value={landingTexts.step2Desc || ''}
                onChange={(e) => handleUpdate('step2Desc', e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Étape 3 - Description</label>
              <textarea
                className="form-control"
                rows="2"
                value={landingTexts.step3Desc || ''}
                onChange={(e) => handleUpdate('step3Desc', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section Actions */}
      <div className="card">
        <h3 className="text-2xl font-bold mb-4">⚡ Section Actions</h3>
        <div>
          <label className="block font-semibold mb-2">Titre</label>
            <input
              type="text"
              className="form-control"
              value={landingTexts.sectionActionsTitle || ''}
              onChange={(e) => handleUpdate('sectionActionsTitle', e.target.value)}
            />
        </div>
      </div>

      {/* Section Leaderboard */}
      <div className="card">
        <h3 className="text-2xl font-bold mb-4">🏆 Section Leaderboard</h3>
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Titre</label>
            <input
              type="text"
              className="form-control"
              value={landingTexts.sectionLeaderboardTitle || ''}
              onChange={(e) => handleUpdate('sectionLeaderboardTitle', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Utiliser {"{amount}"} pour insérer le montant</p>
          </div>
          <div>
            <label className="block font-semibold mb-2">Sous-titre</label>
            <input
              type="text"
              className="form-control"
              value={landingTexts.sectionLeaderboardSubtitle || ''}
              onChange={(e) => handleUpdate('sectionLeaderboardSubtitle', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Utiliser {"{amount}"} et {"{deadline}"} pour insérer les valeurs</p>
          </div>
        </div>
      </div>

      {/* Section CTA Final */}
      <div className="card">
        <h3 className="text-2xl font-bold mb-4">🚀 CTA Final</h3>
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Titre</label>
            <input
              type="text"
              className="form-control"
              value={landingTexts.sectionFinalCTATitle || ''}
              onChange={(e) => handleUpdate('sectionFinalCTATitle', e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Utiliser {"{amount}"} pour insérer le montant</p>
          </div>
          <div>
            <label className="block font-semibold mb-2">Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={landingTexts.sectionFinalCTADesc || ''}
              onChange={(e) => handleUpdate('sectionFinalCTADesc', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="btn btn-primary btn-lg"
          disabled={isSaving}
        >
          {isSaving ? '⏳ Sauvegarde...' : '💾 Sauvegarder'}
        </button>
      </div>
    </div>
  );
}

