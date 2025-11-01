import React from 'react';

/**
 * Composant pour afficher une carte de récompense
 */
export default function RewardCard({ rank, position, amount, emoji, benefits, gradient }) {
  return (
    <div 
      className="reward-card"
      style={{ background: gradient || 'linear-gradient(135deg, #888, #666)' }}
    >
      <div className="reward-emoji">{emoji || '🏆'}</div>
      <h3 className="reward-position">{position || `Position ${rank || '?'}`}</h3>
      <div className="reward-amount">{amount || '0€'}</div>
      
      {benefits && benefits.length > 0 && (
        <ul className="reward-benefits">
          {benefits.map((benefit, i) => (
            <li key={i}>✓ {benefit}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

