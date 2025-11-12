import React from 'react';
import { getTrendColor, getTrendIcon } from '../../utils/analyticsHelpers';

export default function OverviewCards({ data }) {
  if (!data) return null;

  const cards = [
    {
      title: 'Taux de Participation',
      value: `${data.participationRate || 0}%`,
      trend: data.participationTrend || 0,
      icon: '📈',
      color: 'var(--eugenia-yellow)',
      tooltip: '% d\'étudiants ayant soumis au moins 1 action',
    },
    {
      title: 'Actions ce mois',
      value: data.actionsThisMonth || 0,
      trend: null,
      icon: '⚡',
      color: 'var(--eugenia-pink)',
      tooltip: 'Nombre total d\'actions validées cette période',
    },
    {
      title: 'Étudiants Actifs',
      value: data.activeStudents || 0,
      trend: null,
      icon: '👥',
      color: 'var(--eugenia-burgundy)',
      tooltip: 'Nombre d\'étudiants ayant soumis au moins 1 action',
    },
    {
      title: 'Moyenne de Points',
      value: `${data.averagePoints || 0} pts`,
      trend: null,
      icon: '🎯',
      color: 'var(--eugenia-yellow)',
      tooltip: 'Points moyens par étudiant actif',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="admin-card analytics-card relative"
          style={{
            borderLeftColor: card.color,
            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">{card.icon}</div>
            {card.trend !== null && (
              <span
                className="trend-badge"
                style={{
                  backgroundColor: card.trend > 0 ? 'rgba(40, 167, 69, 0.15)' : 'rgba(220, 53, 69, 0.15)',
                  color: card.trend > 0 ? '#28a745' : '#dc3545',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                }}
              >
                {getTrendIcon(card.trend)} {Math.abs(card.trend)}%
              </span>
            )}
            {card.tooltip && (
              <div className="relative group">
                <span className="text-gray-400 hover:text-gray-600 cursor-help">ℹ️</span>
                <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                  {card.tooltip}
                </div>
              </div>
            )}
          </div>
          <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--eugenia-burgundy)' }}>
            {card.value}
          </h3>
          <p className="text-gray-600 text-sm">{card.title}</p>
        </div>
      ))}
    </div>
  );
}

