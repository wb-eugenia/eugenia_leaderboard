import React, { useState, useEffect } from 'react';
import { 
  loadConfig, 
  saveConfig, 
  getRewardsConfig, 
  getGlobalConfig,
  updateGlobalConfig 
} from '../../services/configService';
import RewardEditor from './RewardEditor';
import RewardCard from '../shared/RewardCard';

/**
 * Composant Admin pour configurer les récompenses
 */
export default function RewardsConfig() {
  const [config, setConfig] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const loadedConfig = loadConfig();
    setConfig(loadedConfig);
  }, []);

  const handleUpdateGlobal = (field, value) => {
    setConfig({
      ...config,
      [field]: value
    });
  };

  const handleAddReward = () => {
    const newRank = config.rewards.length + 1;
    setConfig({
      ...config,
      rewards: [
        ...config.rewards,
        {
          id: Date.now(),
          rank: newRank,
          position: `${newRank}ème place`,
          emoji: '🏆',
          amount: '',
          benefits: [],
          gradient: 'linear-gradient(135deg, #888, #666)'
        }
      ]
    });
  };

  const handleUpdateReward = (id, field, value) => {
    setConfig({
      ...config,
      rewards: config.rewards.map(r =>
        r.id === id ? { ...r, [field]: value } : r
      )
    });
  };

  const handleDeleteReward = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette récompense ?')) {
      const updatedRewards = config.rewards
        .filter(r => r.id !== id)
        .map((r, index) => ({ ...r, rank: index + 1 }));
      
      setConfig({
        ...config,
        rewards: updatedRewards
      });
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      saveConfig(config);
      setMessage({ 
        type: 'success', 
        text: '✅ Configuration sauvegardée avec succès !' 
      });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: '❌ Erreur lors de la sauvegarde' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!config) {
    return (
      <div className="text-center py-12">
        <div className="spinner"></div>
        <p>Chargement de la configuration...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">⚙️ Configuration des Récompenses</h2>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`alert mb-6 ${
          message.type === 'success' ? 'alert-success' : 'alert-danger'
        }`}>
          {message.text}
        </div>
      )}

      {/* Config globale */}
      <div className="config-section card mb-8">
        <h3 className="text-2xl font-bold mb-4">📊 Informations générales</h3>
        
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
      <div className="rewards-list mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">🏅 Paliers de récompenses</h3>
          <button
            onClick={handleAddReward}
            className="btn btn-primary"
            type="button"
          >
            ➕ Ajouter un palier
          </button>
        </div>

        {config.rewards && config.rewards.length > 0 ? (
          <div className="space-y-4">
            {config.rewards.map((reward) => (
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
              className="btn btn-primary"
              type="button"
            >
              ➕ Créer la première récompense
            </button>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="preview-section card mb-8">
        <h3 className="text-2xl font-bold mb-4">👀 Aperçu sur la landing page</h3>
        
        <div className="rewards-preview grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.rewards && config.rewards.map(reward => (
            <RewardCard key={reward.id} {...reward} />
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleSave}
          className="btn btn-primary btn-lg"
          disabled={isSaving}
          type="button"
        >
          {isSaving ? '⏳ Sauvegarde...' : '💾 Sauvegarder la configuration'}
        </button>
      </div>
    </div>
  );
}

