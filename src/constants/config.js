/**
 * Configuration centralisée de l'application
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || '',
  TIMEOUT: 30000, // 30 secondes
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 seconde
};

export const STORAGE_KEYS = {
  STUDENT_AUTH: 'student_auth',
  ADMIN_AUTH: 'admin_authenticated',
  ADMIN_SCHOOL: 'admin_school',
  CONFIG: 'eugeniaConfig',
  ASSOCIATIONS: (email) => `associations_${email}`
};

export const DEFAULT_PASSWORD = '1234';

export const ADMIN_EMAILS = {
  EUGENIA: 'admin@eugeniaschool.com',
  ALBERT: 'admin@albertschool.com'
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
};

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 4
};


