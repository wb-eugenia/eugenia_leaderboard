import React from 'react';

export default function InsightsCards({ insights }) {
  if (!insights) return null;

  const insightCards = [
    {
      icon: '🔥',
      title: 'Momentum du moment',
      text: insights.momentum?.actionType && insights.momentum?.actionType !== 'N/A'
        ? `Les actions "${insights.momentum.actionType}" ont ${insights.momentum.increase > 0 ? 'augmenté' : 'diminué'} de ${Math.abs(insights.momentum.increase || 0)}% cette semaine !`
        : 'Pas assez de données pour calculer le momentum',
      color: 'var(--eugenia-pink)',
    },
    {
      icon: '📅',
      title: 'Jour le plus actif',
      text: insights.busiestDay?.day && insights.busiestDay?.day !== 'N/A'
        ? `${insights.busiestDay.day} est le jour le plus actif (${insights.busiestDay.percentage || 0}% des actions)`
        : 'Pas assez de données pour déterminer le jour le plus actif',
      color: 'var(--eugenia-yellow)',
    },
    {
      icon: '⏰',
      title: 'Heure de pointe',
      text: insights.peakHours?.start
        ? `La majorité des actions sont soumises entre ${insights.peakHours.start}h-${insights.peakHours.end}h`
        : 'Pas assez de données pour déterminer l\'heure de pointe',
      color: 'var(--eugenia-burgundy)',
    },
    {
      icon: '🎓',
      title: 'Classe championne',
      text: insights.topClass?.name && insights.topClass?.name !== 'N/A'
        ? `La classe ${insights.topClass.name} domine avec ${insights.topClass.count || 0} actions ce mois`
        : 'Pas assez de données pour déterminer la classe championne',
      color: 'var(--eugenia-pink)',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {insightCards.map((insight, index) => (
        <div
          key={index}
          className="insight-card admin-card"
          style={{
            background: `linear-gradient(135deg, rgba(103, 19, 36, 0.05), rgba(233, 30, 99, 0.05))`,
            border: '1px solid #ddd',
            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
          }}
        >
          <div className="flex items-start gap-4">
            <div className="text-5xl">{insight.icon}</div>
            <div className="flex-1">
              <h4 className="text-lg font-bold mb-2" style={{ color: 'var(--eugenia-burgundy)' }}>
                {insight.title}
              </h4>
              <p className="text-gray-700">{insight.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

