/**
 * Configuration des thèmes par école
 */

export const schoolThemes = {
  eugenia: {
    name: 'Eugenia School',
    primary: '#671324', // burgundy
    secondary: '#E33054', // pink
    accent: '#DBA12D', // yellow
    black: '#000000',
    white: '#FFFFFF',
    gradient: 'from-[#671324] via-[#E33054] to-[#671324]',
    emailDomain: '@eugeniaschool.com'
  },
  albert: {
    name: 'Albert School',
    primary: '#1E40AF', // blue-800
    secondary: '#3B82F6', // blue-500
    accent: '#60A5FA', // blue-400
    black: '#000000',
    white: '#FFFFFF',
    gradient: 'from-[#1E40AF] via-[#3B82F6] to-[#1E40AF]',
    emailDomain: '@albertschool.com'
  }
};

/**
 * Obtenir le thème d'une école
 * @param {string} school - 'eugenia' ou 'albert'
 * @returns {object} Configuration du thème
 */
export function getSchoolTheme(school) {
  return schoolThemes[school] || schoolThemes.eugenia;
}

/**
 * Obtenir l'école depuis l'URL
 * @returns {string|null} 'eugenia', 'albert' ou null
 */
export function getSchoolFromUrl() {
  const path = window.location.pathname;
  if (path.startsWith('/eugenia-school')) return 'eugenia';
  if (path.startsWith('/albert-school')) return 'albert';
  return null;
}

