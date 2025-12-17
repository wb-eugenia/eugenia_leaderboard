/**
 * Service de gamification - Fonctions utilitaires pour niveaux, badges, streaks
 */

/**
 * Calculer le niveau et la progression basés sur les points
 */
export function calculateLevel(points) {
  const levelThresholds = [
    { level: 1, min: 0, max: 50, name: 'Novice' },
    { level: 2, min: 50, max: 100, name: 'Novice' },
    { level: 3, min: 100, max: 150, name: 'Apprenti' },
    { level: 4, min: 150, max: 200, name: 'Apprenti' },
    { level: 5, min: 200, max: 300, name: 'Expert' },
    { level: 6, min: 300, max: 400, name: 'Expert' },
    { level: 7, min: 400, max: 500, name: 'Maître' },
    { level: 8, min: 500, max: 600, name: 'Maître' },
    { level: 9, min: 600, max: 750, name: 'Légende' },
    { level: 10, min: 750, max: 1000, name: 'Légende' },
  ];

  // Trouver le niveau actuel
  let currentLevel = 1;
  let levelName = 'Novice';
  let nextLevelPoints = 50;

  for (const threshold of levelThresholds) {
    if (points >= threshold.min && points < threshold.max) {
      currentLevel = threshold.level;
      levelName = threshold.name;
      nextLevelPoints = threshold.max;
      break;
    }
  }

  // Si au-delà du niveau 10
  if (points >= 1000) {
    currentLevel = Math.floor((points - 1000) / 250) + 11;
    levelName = 'Immortel';
    nextLevelPoints = Math.ceil((currentLevel - 10) * 250) + 1000;
  }

  // Calculer la progression (0-100)
  const currentLevelMin = levelThresholds.find(t => t.level === currentLevel)?.min || 0;
  const currentLevelMax = levelThresholds.find(t => t.level === currentLevel)?.max || nextLevelPoints;
  const progress = currentLevelMax > currentLevelMin 
    ? ((points - currentLevelMin) / (currentLevelMax - currentLevelMin)) * 100 
    : 0;

  return {
    level: currentLevel,
    progress: Math.min(100, Math.max(0, progress)),
    nextLevelPoints,
    levelName
  };
}

/**
 * Obtenir le nom du niveau
 */
export function getLevelName(level) {
  const levelNames = {
    1: 'Novice',
    2: 'Novice',
    3: 'Apprenti',
    4: 'Apprenti',
    5: 'Expert',
    6: 'Expert',
    7: 'Maître',
    8: 'Maître',
    9: 'Légende',
    10: 'Légende',
  };

  if (level <= 10) {
    return levelNames[level] || 'Novice';
  }
  return 'Immortel';
}

/**
 * Obtenir la couleur associée au niveau
 */
export function getLevelColor(level) {
  if (level <= 2) return '#9CA3AF'; // Gris - Novice
  if (level <= 4) return '#3B82F6'; // Bleu - Apprenti
  if (level <= 6) return '#10B981'; // Vert - Expert
  if (level <= 8) return '#F59E0B'; // Orange - Maître
  if (level <= 10) return '#8B5CF6'; // Violet - Légende
  return '#EF4444'; // Rouge - Immortel
}

/**
 * Obtenir les informations d'un badge
 */
export function getBadgeInfo(badgeId) {
  const badges = {
    first_action: {
      id: 'first_action',
      name: 'Premier Pas',
      description: 'Première action validée',
      icon: '🎯',
      color: '#3B82F6'
    },
    top_100: {
      id: 'top_100',
      name: 'Top 100',
      description: 'Dans le top 100 du classement',
      icon: '🌟',
      color: '#10B981'
    },
    top_50: {
      id: 'top_50',
      name: 'Top 50',
      description: 'Dans le top 50 du classement',
      icon: '⭐',
      color: '#10B981'
    },
    top_25: {
      id: 'top_25',
      name: 'Top 25',
      description: 'Dans le top 25 du classement',
      icon: '💫',
      color: '#F59E0B'
    },
    top_10: {
      id: 'top_10',
      name: 'Top 10',
      description: 'Dans le top 10 du classement',
      icon: '🔥',
      color: '#F59E0B'
    },
    top_5: {
      id: 'top_5',
      name: 'Top 5',
      description: 'Dans le top 5 du classement',
      icon: '💎',
      color: '#8B5CF6'
    },
    top_3: {
      id: 'top_3',
      name: 'Top 3',
      description: 'Dans le top 3 du classement',
      icon: '🏆',
      color: '#8B5CF6'
    },
    champion: {
      id: 'champion',
      name: 'Champion',
      description: 'Numéro 1 du classement',
      icon: '👑',
      color: '#FCD34D'
    },
    streak_7: {
      id: 'streak_7',
      name: 'Streak de 7 jours',
      description: '7 jours consécutifs avec action',
      icon: '🔥',
      color: '#EF4444'
    },
    streak_30: {
      id: 'streak_30',
      name: 'Streak de 30 jours',
      description: '30 jours consécutifs avec action',
      icon: '🔥🔥',
      color: '#DC2626'
    },
    level_5: {
      id: 'level_5',
      name: 'Niveau 5',
      description: 'Atteint le niveau 5',
      icon: '⭐',
      color: '#10B981'
    },
    level_10: {
      id: 'level_10',
      name: 'Niveau 10',
      description: 'Atteint le niveau 10',
      icon: '💫',
      color: '#8B5CF6'
    }
  };

  return badges[badgeId] || {
    id: badgeId,
    name: badgeId,
    description: 'Badge',
    icon: '🏅',
    color: '#9CA3AF'
  };
}

/**
 * Obtenir tous les badges disponibles
 */
export function getAllBadges() {
  return [
    'first_action',
    'top_100',
    'top_50',
    'top_25',
    'top_10',
    'top_5',
    'top_3',
    'champion',
    'streak_7',
    'streak_30',
    'level_5',
    'level_10'
  ];
}

/**
 * Formater le nombre de points pour affichage
 */
export function formatPoints(points) {
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}k`;
  }
  return points.toString();
}

