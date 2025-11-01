import React, { useState } from 'react';

/**
 * Composant pour éditer une récompense dans le panel admin
 */
export default function RewardEditor({ reward, onUpdate, onDelete }) {
  const [benefits, setBenefits] = useState(
    reward.benefits ? reward.benefits.join(', ') : ''
  );
  
  const handleBenefitsChange = (value) => {
    setBenefits(value);
    const parsedBenefits = value
      .split(',')
      .map(b => b.trim())
      .filter(Boolean);
    onUpdate('benefits', parsedBenefits);
  };

  return (
    <div className="reward-editor card">
      <div className="editor-header flex justify-between items-center mb-4">
        <h4 className="text-xl font-bold">Palier #{reward.rank}</h4>
        {onDelete && (
          <button 
            onClick={onDelete}
            className="btn btn-danger btn-sm"
            type="button"
          >
            🗑️ Supprimer
          </button>
        )}
      </div>
      
      <div className="editor-fields grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label className="block text-gray-700 font-semibold mb-2">
            Position
          </label>
          <input
            type="text"
            className="form-control"
            value={reward.position || ''}
            onChange={(e) => onUpdate('position', e.target.value)}
            placeholder="1ère place"
          />
        </div>
        
        <div className="form-group">
          <label className="block text-gray-700 font-semibold mb-2">
            Emoji
          </label>
          <input
            type="text"
            className="form-control"
            value={reward.emoji || ''}
            onChange={(e) => onUpdate('emoji', e.target.value)}
            placeholder="🥇"
          />
        </div>
        
        <div className="form-group">
          <label className="block text-gray-700 font-semibold mb-2">
            Montant
          </label>
          <input
            type="text"
            className="form-control"
            value={reward.amount || ''}
            onChange={(e) => onUpdate('amount', e.target.value)}
            placeholder="250€"
          />
        </div>
        
        <div className="form-group md:col-span-2">
          <label className="block text-gray-700 font-semibold mb-2">
            Avantages (séparés par virgules)
          </label>
          <input
            type="text"
            className="form-control"
            value={benefits}
            onChange={(e) => handleBenefitsChange(e.target.value)}
            placeholder="Trophée, Visibilité, Goodies"
          />
        </div>
        
        <div className="form-group md:col-span-2">
          <label className="block text-gray-700 font-semibold mb-2">
            Dégradé CSS
          </label>
          <input
            type="text"
            className="form-control"
            value={reward.gradient || ''}
            onChange={(e) => onUpdate('gradient', e.target.value)}
            placeholder="linear-gradient(135deg, #FFD700, #FFA500)"
          />
          
          {/* Preview couleur */}
          <div 
            className="gradient-preview mt-2 rounded p-4 text-white text-center font-bold"
            style={{ background: reward.gradient || 'linear-gradient(135deg, #888, #666)' }}
          >
            Aperçu de la couleur
          </div>
        </div>
      </div>
    </div>
  );
}

