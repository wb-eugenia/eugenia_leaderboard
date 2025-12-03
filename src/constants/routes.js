/**
 * Constantes pour les routes de l'application
 */

export const SCHOOLS = {
  EUGENIA: 'eugenia',
  ALBERT: 'albert'
};

export const SCHOOL_NAMES = {
  [SCHOOLS.EUGENIA]: 'Eugenia School',
  [SCHOOLS.ALBERT]: 'Albert School'
};

export const SCHOOL_PATHS = {
  [SCHOOLS.EUGENIA]: '/eugenia-school',
  [SCHOOLS.ALBERT]: '/albert-school'
};

export const SCHOOL_EMAIL_DOMAINS = {
  [SCHOOLS.EUGENIA]: '@eugeniaschool.com',
  [SCHOOLS.ALBERT]: '@albertschool.com'
};

export const ROUTES = {
  // Public
  HOME: '/',
  SELECT_SCHOOL: '/select-school',
  PROFILE_PUBLIC: '/profile/:slug',
  GOOGLE_OAUTH_CALLBACK: '/google-oauth/callback',
  
  // Student routes (will be prefixed with school path)
  STUDENT_LOGIN: '/login',
  STUDENT_HOME: '',
  STUDENT_PORTFOLIO: '/portfolio',
  STUDENT_AMBASSADEURS: '/ambassadeurs',
  STUDENT_ASSOCIATIONS: '/associations',
  STUDENT_ASSOCIATIONS_AGENDA: '/associations/agenda',
  STUDENT_LEADERBOARD: '/leaderboard',
  STUDENT_SUBMIT: '/submit',
  STUDENT_REPORT: '/report',
  STUDENT_PROFILE: '/student/profile',
  
  // Admin routes (will be prefixed with school path)
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_VALIDATE: '/admin/validate',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_ACTIONS: '/admin/actions',
  ADMIN_LEADERBOARD: '/admin/leaderboard',
  ADMIN_AUTOMATIONS: '/admin/automations',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_GOOGLE_SHEETS: '/admin/google-sheets',
  ADMIN_REWARDS: '/admin/rewards',
  ADMIN_TEXTS: '/admin/texts',
  ADMIN_GUIDE: '/admin/guide'
};

/**
 * Génère une route complète avec le préfixe de l'école
 */
export function getSchoolRoute(school, route) {
  const schoolPath = SCHOOL_PATHS[school] || SCHOOL_PATHS[SCHOOLS.EUGENIA];
  return `${schoolPath}${route}`;
}

/**
 * Extrait l'école depuis une route
 */
export function getSchoolFromPath(pathname) {
  if (pathname.startsWith(SCHOOL_PATHS[SCHOOLS.EUGENIA])) {
    return SCHOOLS.EUGENIA;
  }
  if (pathname.startsWith(SCHOOL_PATHS[SCHOOLS.ALBERT])) {
    return SCHOOLS.ALBERT;
  }
  return null;
}


