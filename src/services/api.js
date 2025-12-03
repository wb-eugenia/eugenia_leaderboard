/**
 * Service API centralisé avec gestion d'erreurs, retry et timeout
 */

import { API_CONFIG } from '../constants/config.js';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Délai avant de réessayer
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Effectue une requête avec retry automatique
 */
async function fetchWithRetry(url, options = {}, retries = API_CONFIG.RETRY_ATTEMPTS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      // Ne pas retry pour les erreurs 4xx (erreurs client)
      if (response.status >= 400 && response.status < 500) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.error || errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData
        );
      }
      
      // Retry pour les erreurs 5xx (erreurs serveur)
      if (retries > 0 && response.status >= 500) {
        await delay(API_CONFIG.RETRY_DELAY);
        return fetchWithRetry(url, options, retries - 1);
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData
      );
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Retry pour les erreurs réseau
    if (retries > 0 && (error.name === 'TypeError' || error.name === 'AbortError')) {
      await delay(API_CONFIG.RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
    }
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      error.message || 'Network error',
      0,
      { originalError: error }
    );
  }
}

/**
 * Parse la réponse JSON avec gestion d'erreurs
 */
async function parseJSON(response) {
  const text = await response.text();
  if (!text) {
    return {};
  }
  
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse JSON response:', text);
    throw new ApiError('Invalid JSON response', response.status, { raw: text });
  }
}

/**
 * Classe principale pour les appels API
 */
class ApiService {
  constructor(baseURL = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Construit l'URL complète
   */
  getUrl(endpoint) {
    if (!this.baseURL) {
      throw new ApiError('API base URL not configured', 0);
    }
    
    // Si l'endpoint commence déjà par http, le retourner tel quel
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    
    // Nettoyer les slashes
    const base = this.baseURL.replace(/\/$/, '');
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    return `${base}${path}`;
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    const url = this.getUrl(endpoint);
    const response = await fetchWithRetry(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    return parseJSON(response);
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}, options = {}) {
    const url = this.getUrl(endpoint);
    const response = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    });
    
    return parseJSON(response);
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}, options = {}) {
    const url = this.getUrl(endpoint);
    const response = await fetchWithRetry(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    });
    
    return parseJSON(response);
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    const url = this.getUrl(endpoint);
    const response = await fetchWithRetry(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    return parseJSON(response);
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}, options = {}) {
    const url = this.getUrl(endpoint);
    const response = await fetchWithRetry(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: JSON.stringify(data),
      ...options
    });
    
    return parseJSON(response);
  }
}

// Instance singleton
export const api = new ApiService();

// Export de la classe pour les tests
export { ApiService, ApiError };

// Helpers pour les endpoints spécifiques
export const leaderboardApi = {
  getAll: () => api.get('/leaderboard'),
  check: (email) => api.get(`/leaderboard/check?email=${encodeURIComponent(email)}`),
  updateUser: (data) => api.put('/leaderboard/user', data),
  deleteUser: (email) => api.delete(`/leaderboard/user?email=${encodeURIComponent(email)}`),
  bulkImport: (students) => api.post('/leaderboard/bulk', { students })
};

export const actionsApi = {
  getAll: () => api.get('/actions/all'),
  getPending: () => api.get('/actions/pending'),
  getById: (id) => api.get(`/actions/${encodeURIComponent(id)}`),
  submit: (data) => api.post('/actions/submit', data),
  validate: (id, decision) => api.post('/actions/validate', { id, ...decision }),
  delete: (id) => api.delete(`/actions/${encodeURIComponent(id)}`)
};

export const configApi = {
  get: () => api.get('/config'),
  save: (config) => api.post('/config', { config })
};

export const reportsApi = {
  getAll: () => api.get('/reports'),
  getById: (id) => api.get(`/reports/${id}`),
  update: (id, data) => api.put(`/reports/${id}`, data),
  delete: (id) => api.delete(`/reports/${id}`)
};


