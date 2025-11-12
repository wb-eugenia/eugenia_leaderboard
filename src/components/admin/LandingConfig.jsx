import React, { useState, useEffect } from 'react';
import { getGlobalConfig, updateGlobalConfig } from '../../services/configService';
import RewardEditor from './RewardEditor';
import RewardCard from '../shared/RewardCard';

/**
 * Composant Admin combiné pour configurer les récompenses ET les textes de la landing page
 */
export default function LandingConfig() {
  const [config, setConfig] = useState(null);
  const [landingTexts, setLandingTexts] = useState({});
  const [rewards, setRewards] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('rewards'); // 'rewards' ou 'texts'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('🔄 Loading landing page config...');
      const loadedConfig = await getGlobalConfig();
      console.log('📥 Loaded config:', loadedConfig);
      
      if (!loadedConfig || typeof loadedConfig !== 'object') {
        console.warn('⚠️ No config loaded, using defaults');
        const defaultConfig = {
          totalPrizePool: '+500€',
          deadline: '31 janvier 2026',
          landingTexts: {},
          rewards: []
        };
        setConfig(defaultConfig);
        setLandingTexts({});
        setRewards([]);
        return;
      }
      
      const newConfig = {
        ...loadedConfig,
        landingTexts: loadedConfig.landingTexts ? { ...loadedConfig.landingTexts } : {}
      };
      
      setConfig(newConfig);
      setLandingTexts(loadedConfig.landingTexts || {});
      setRewards(loadedConfig.rewards || []);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('❌ Error loading config:', error);
      const defaultConfig = {
        totalPrizePool: '+500€',
        deadline: '31 janvier 2026',
        landingTexts: {},
        rewards: []
      };
      setConfig(defaultConfig);
      setLandingTexts({});
      setRewards([]);
    }
  };

  const handleUpdateGlobal = (field, value) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  const handleUpdateTexts = (field, value) => {
    if (!config) return;
    
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

  const handleAddReward = () => {
    const newRank = rewards.length + 1;
    const newRewards = [
      ...rewards,
      {
        id: Date.now(),
        rank: newRank,
        position: `${newRank}ème place`,
        emoji: '🏆',
        amount: '',
        benefits: [],
        gradient: 'linear-gradient(135deg, #888, #666)'
      }
    ];
    setRewards(newRewards);
    setConfig({
      ...config,
      rewards: newRewards
    });
  };

  const handleUpdateReward = (id, field, value) => {
    const updatedRewards = rewards.map(r =>
      r.id === id ? { ...r, [field]: value } : r
    );
    setRewards(updatedRewards);
    setConfig({
      ...config,
      rewards: updatedRewards
    });
  };

  const handleDeleteReward = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette récompense ?')) {
      const updatedRewards = rewards
        .filter(r => r.id !== id)
        .map((r, index) => ({ ...r, rank: index + 1 }));
      
      setRewards(updatedRewards);
      setConfig({
        ...config,
        rewards: updatedRewards
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('💾 Saving config:', config);
      console.log('💾 Saving rewards:', rewards);
      console.log('💾 Saving landingTexts:', landingTexts);
      
      const configToSave = {
        ...config,
        landingTexts: landingTexts,
        rewards: rewards
      };
      
      await updateGlobalConfig(configToSave);
      console.log('✅ Config saved, reloading...');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      const verifyConfig = await getGlobalConfig();
      console.log('🔍 Verified config after save:', verifyConfig);
      
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eugenia-yellow mx-auto"></div>
        <p className="mt-4">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold" style={{ color: 'var(--eugenia-burgundy)' }}>
          Configuration Landing Page
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'rewards'
              ? 'border-b-2 border-eugenia-yellow text-eugenia-burgundy'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Récompenses
        </button>
        <button
          onClick={() => setActiveTab('texts')}
          className={`px-6 py-3 font-semibold transition-colors ${
            activeTab === 'texts'
              ? 'border-b-2 border-eugenia-yellow text-eugenia-burgundy'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Textes Landing
        </button>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message.text}
        </div>
      )}

      {/* Tab Content: Récompenses */}
      {activeTab === 'rewards' && (
        <div className="space-y-6">
          {/* Config globale */}
          <div className="admin-card">
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--eugenia-burgundy)' }}>
              Informations générales
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-gray-700 font-semibold mb-2">
                  Cagnotte totale
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={config.totalPrizePool || ''}
                  onChange={(e) => handleUpdateGlobal('totalPrizePool', e.target.value)}
                  placeholder="+500€"
                />
              </div>

              <div className="form-group">
                <label className="block text-gray-700 font-semibold mb-2">
                  Date limite
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={config.deadline || ''}
                  onChange={(e) => handleUpdateGlobal('deadline', e.target.value)}
                  placeholder="31 janvier 2026"
                />
              </div>
            </div>
          </div>

          {/* Liste des récompenses */}
          <div className="admin-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--eugenia-burgundy)' }}>
                Paliers de récompenses
              </h3>
              <button
                onClick={handleAddReward}
                className="btn btn-admin-secondary"
                type="button"
              >
                ➕ Ajouter un palier
              </button>
            </div>

            {rewards.length > 0 ? (
              <div className="space-y-4">
                {rewards.map((reward) => (
                  <RewardEditor
                    key={reward.id}
                    reward={reward}
                    onUpdate={(field, value) => handleUpdateReward(reward.id, field, value)}
                    onDelete={() => handleDeleteReward(reward.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">Aucune récompense configurée</p>
                <button
                  onClick={handleAddReward}
                  className="btn btn-admin-secondary"
                  type="button"
                >
                  ➕ Créer la première récompense
                </button>
              </div>
            )}
          </div>

          {/* Preview */}
          {rewards.length > 0 && (
            <div className="admin-card">
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--eugenia-burgundy)' }}>
                Aperçu sur la landing page
              </h3>
              
              <div className="rewards-preview grid grid-cols-1 md:grid-cols-3 gap-6">
                {rewards.map(reward => (
                  <RewardCard key={reward.id} {...reward} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Textes Landing */}
      {activeTab === 'texts' && (
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="admin-card">
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--eugenia-burgundy)' }}>
              Section Hero
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Titre principal</label>
                <input
                  type="text"
                  className="form-control"
                  value={landingTexts.heroTitle || ''}
                  onChange={(e) => handleUpdateTexts('heroTitle', e.target.value)}
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Sous-titre</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={landingTexts.heroSubtitle || ''}
                  onChange={(e) => handleUpdateTexts('heroSubtitle', e.target.value)}
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Badge cagnotte</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={landingTexts.prizeBadge || ''}
                  onChange={(e) => handleUpdateTexts('prizeBadge', e.target.value)}
                  placeholder="Ligne 1\nLigne 2"
                />
              </div>
            </div>
          </div>

          {/* Section Récompenses */}
          <div className="admin-card">
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--eugenia-burgundy)' }}>
              Section Récompenses
            </h3>
            <div>
              <label className="block font-semibold mb-2">Titre</label>
              <input
                type="text"
                className="form-control"
                value={landingTexts.sectionRewardsTitle || ''}
                onChange={(e) => handleUpdateTexts('sectionRewardsTitle', e.target.value)}
              />
            </div>
          </div>

          {/* Comment ça marche */}
          <div className="admin-card">
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--eugenia-burgundy)' }}>
              Section Comment ça marche
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Titre</label>
                <input
                  type="text"
                  className="form-control"
                  value={landingTexts.sectionHowItWorksTitle || ''}
                  onChange={(e) => handleUpdateTexts('sectionHowItWorksTitle', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Étape 1 - Titre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={landingTexts.step1Title || ''}
                    onChange={(e) => handleUpdateTexts('step1Title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Étape 2 - Titre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={landingTexts.step2Title || ''}
                    onChange={(e) => handleUpdateTexts('step2Title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Étape 3 - Titre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={landingTexts.step3Title || ''}
                    onChange={(e) => handleUpdateTexts('step3Title', e.target.value)}
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
                    onChange={(e) => handleUpdateTexts('step1Desc', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Étape 2 - Description</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={landingTexts.step2Desc || ''}
                    onChange={(e) => handleUpdateTexts('step2Desc', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Étape 3 - Description</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={landingTexts.step3Desc || ''}
                    onChange={(e) => handleUpdateTexts('step3Desc', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section Actions */}
          <div className="admin-card">
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--eugenia-burgundy)' }}>
              Section Actions
            </h3>
            <div>
              <label className="block font-semibold mb-2">Titre</label>
              <input
                type="text"
                className="form-control"
                value={landingTexts.sectionActionsTitle || ''}
                onChange={(e) => handleUpdateTexts('sectionActionsTitle', e.target.value)}
              />
            </div>
          </div>

          {/* Section Leaderboard */}
          <div className="admin-card">
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--eugenia-burgundy)' }}>
              Section Leaderboard
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Titre</label>
                <input
                  type="text"
                  className="form-control"
                  value={landingTexts.sectionLeaderboardTitle || ''}
                  onChange={(e) => handleUpdateTexts('sectionLeaderboardTitle', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Utiliser {"{amount}"} pour insérer le montant</p>
              </div>
              <div>
                <label className="block font-semibold mb-2">Sous-titre</label>
                <input
                  type="text"
                  className="form-control"
                  value={landingTexts.sectionLeaderboardSubtitle || ''}
                  onChange={(e) => handleUpdateTexts('sectionLeaderboardSubtitle', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Utiliser {"{amount}"} et {"{deadline}"} pour insérer les valeurs</p>
              </div>
            </div>
          </div>

          {/* Section CTA Final */}
          <div className="admin-card">
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--eugenia-burgundy)' }}>
              CTA Final
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Titre</label>
                <input
                  type="text"
                  className="form-control"
                  value={landingTexts.sectionFinalCTATitle || ''}
                  onChange={(e) => handleUpdateTexts('sectionFinalCTATitle', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Utiliser {"{amount}"} pour insérer le montant</p>
              </div>
              <div>
                <label className="block font-semibold mb-2">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={landingTexts.sectionFinalCTADesc || ''}
                  onChange={(e) => handleUpdateTexts('sectionFinalCTADesc', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="btn btn-admin-primary btn-lg"
          disabled={isSaving}
        >
          {isSaving ? '⏳ Sauvegarde...' : '💾 Sauvegarder la configuration'}
        </button>
      </div>
    </div>
  );
}

