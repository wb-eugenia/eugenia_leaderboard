import React from 'react'
import './Leaderboard.css'

function Leaderboard({ data, loading }) {
  if (loading) {
    return (
      <div className="leaderboard-loading">
        <div className="spinner"></div>
        <p>Chargement du classement...</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="leaderboard-empty">
        <p>⚠️ Aucun participant pour le moment. Soyez le premier !</p>
        <p style={{fontSize: '0.9em', color: '#666', marginTop: '10px'}}>
          (Ou vérifiez la configuration du Google Apps Script)
        </p>
      </div>
    )
  }

  return (
    <div className="leaderboard">
      <h2>🏆 Classement des Champions</h2>
      <div className="leaderboard-list">
        {data.map((entry, index) => (
          <div
            key={entry.rank || index}
            className={`leaderboard-item ${entry.rank === 1 ? 'champion' : ''} ${entry.rank === 2 ? 'silver' : ''} ${entry.rank === 3 ? 'bronze' : ''}`}
          >
            <div className="rank-badge">
              {entry.rank === 1 && '🥇'}
              {entry.rank === 2 && '🥈'}
              {entry.rank === 3 && '🥉'}
              {entry.rank > 3 && entry.rank}
            </div>
            <div className="user-info">
              <div className="user-name">{entry.name}</div>
              <div className="user-actions">{entry.classe}</div>
            </div>
            <div className="user-points">
              <span className="points-value">{entry.points}</span>
              <span className="points-label">pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Leaderboard

