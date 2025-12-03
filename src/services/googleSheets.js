// Service de gestion Google Sheets
import { SHEETS_CONFIG } from '../config/defaultConfig.js';

// Configuration API (Worker D1 ou Apps Script)
const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_SCRIPT_URL;
const USE_API = !!API_URL;
const USE_D1_API = !!import.meta.env.VITE_API_URL; // True if using D1 Worker

// Debug logging
console.log('📊 API Service initialized:');
console.log('  - API_URL:', API_URL ? API_URL.substring(0, 50) + '...' : 'NOT SET');
console.log('  - USE_API:', USE_API);
console.log('  - USE_D1_API:', USE_D1_API);
console.log('  - Mode:', USE_D1_API ? 'Cloudflare D1 Worker' : USE_API ? 'Google Apps Script' : 'localStorage fallback');

if (!API_URL) {
  console.warn('⚠️ VITE_API_URL or VITE_APP_SCRIPT_URL is not configured! All data will use localStorage fallback.');
}

const STORAGE_KEYS = {
  ACTIONS: 'eugenia_actions',
  LEADERBOARD: 'eugenia_leaderboard'
};

// Cache for API responses
const CACHE_DURATION = {
  LEADERBOARD: 30000,  // 30 seconds
  ACTIONS: 15000,      // 15 seconds
  CONFIG: 60000        // 60 seconds
};

let memoryCache = {};

// Helper: Fetch JSON with error handling
async function fetchJSON(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Helper: Check cache validity
function isValidCacheEntry(cacheKey, duration) {
  const entry = memoryCache[cacheKey];
  if (!entry) return false;
  
  const age = Date.now() - entry.timestamp;
  return age < duration;
}

// Helper: Get from cache or fetch
async function getCachedOrFetch(cacheKey, fetchFn, duration) {
  if (isValidCacheEntry(cacheKey, duration)) {
    console.log(`✅ Cache HIT: ${cacheKey}`);
    return memoryCache[cacheKey].data;
  }
  
  console.log(`❌ Cache MISS: ${cacheKey}`);
  const data = await fetchFn();
  
  memoryCache[cacheKey] = {
    data,
    timestamp: Date.now()
  };
  
  return data;
}

// Helper: Invalidate cache
export function invalidateCache(cacheKey) {
  if (cacheKey) {
    delete memoryCache[cacheKey];
  } else {
    memoryCache = {};
  }
}

/**
 * Génère un ID unique
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Écrit une action dans le storage
 */
export async function submitAction(actionData) {
  try {
    // Si API configurée (D1 Worker ou Apps Script)
    if (USE_API) {
      try {
        console.log('📤 Submitting action to API:', API_URL);
        console.log('   Data:', { email: actionData.email, type: actionData.type });
        
        let url, body;
        if (USE_D1_API) {
          // D1 Worker API - REST endpoint
          url = `${API_URL}/actions/submit`;
          body = JSON.stringify({
            email: actionData.email,
            type: actionData.type,
            data: actionData.data || {}
          });
        } else {
          // Apps Script API - legacy format
          url = API_URL;
          body = JSON.stringify({
            action: 'submitAction',
            email: actionData.email,
            type: actionData.type,
            data: actionData.data || {}
          });
        }
        
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body
        });
        
        console.log('📥 Response status:', response.status, response.statusText);
        const text = await response.text();
        console.log('📥 Response text:', text.substring(0, 200));
        
        const data = JSON.parse(text);
        console.log('📥 Parsed response:', data);
        
        if (data.success) {
          console.log('✅ Action submitted successfully to API');
        } else {
          console.error('❌ API returned error:', data.error);
        }
        
        // Invalidate cache on success
        invalidateCache('actions_pending');
        invalidateCache('actions_all');
        
        return data;
      } catch (fetchError) {
        console.error('❌ API fetch failed:', fetchError);
        console.error('   Error details:', {
          message: fetchError.message,
          stack: fetchError.stack,
          url: API_URL
        });
        console.warn('⚠️ Falling back to localStorage');
        // Fallback to localStorage if fetch fails
      }
    } else {
      console.warn('⚠️ API not configured, using localStorage fallback');
    }
    
    // Fallback localStorage - Check for duplicates
    const actions = getStoredActions();
    
    // Check if duplicate exists
    const isDuplicate = actions.some(existing => {
      const sameEmail = existing.email && existing.email.toLowerCase() === actionData.email.toLowerCase();
      const sameType = existing.type === actionData.type;
      const sameData = existing.data && actionData.data;
      
      // For date-based actions, check if same date
      let sameDate = false;
      if (actionData.data && actionData.data.date && existing.data && existing.data.date) {
        sameDate = actionData.data.date === existing.data.date;
      }
      
      // Check if pending or validated
      const activeStatus = existing.status === 'pending' || existing.status === 'validated';
      
      return sameEmail && sameType && sameDate && activeStatus;
    });
    
    if (isDuplicate) {
      return {
        success: false,
        error: 'duplicate',
        message: 'Cette action a déjà été soumise. Veuillez soumettre une action différente.'
      };
    }
    
    const newAction = {
      id: generateId(),
      email: actionData.email,
      type: actionData.type,
      data: actionData.data || {},
      date: new Date().toISOString(),
      status: 'pending',
      decision: null,
      points: 0,
      comment: null,
      validatedBy: null,
      validatedAt: null
    };
    actions.push(newAction);
    localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(actions));
    return { success: true, actionId: newAction.id };
  } catch (error) {
    console.error('Error submitting action:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Récupère toutes les actions
 */
export async function getAllActions(school = null) {
  return getCachedOrFetch('actions_all', async () => {
    if (USE_API) {
      try {
        const url = USE_D1_API 
          ? `${API_URL}/actions/all`
          : `${API_URL}?action=getAllActions`;
        const response = await fetch(url);
        const text = await response.text();
        const parsed = JSON.parse(text);
        
        // Extract data from new API format
        const data = extractData(parsed);
        
        if (!Array.isArray(data)) {
          console.warn('Actions response is not an array:', data);
          return getStoredActions();
        }
        
        // Parse data field if it's a string
        return data.map(action => ({
          ...action,
          data: typeof action.data === 'string' ? JSON.parse(action.data) : action.data
        }));
      } catch (error) {
        console.warn('API fetch failed, using localStorage:', error);
      }
    }
    return getStoredActions();
  }, CACHE_DURATION.ACTIONS);
}

/**
 * Récupère les actions à valider (status = pending)
 */
export async function getActionsToValidate(school = null) {
  return getCachedOrFetch('actions_pending', async () => {
    if (USE_API) {
      try {
        const url = USE_D1_API 
          ? `${API_URL}/actions/pending`
          : `${API_URL}?action=getActionsToValidate`;
        const response = await fetch(url);
        const text = await response.text();
        const parsed = JSON.parse(text);
        
        // Extract data from new API format
        const data = extractData(parsed);
        
        if (!Array.isArray(data)) {
          console.warn('Pending actions response is not an array:', data);
          const actions = getStoredActions();
          return actions.filter(action => action.status === 'pending');
        }
        
        // Parse data field if it's a string
        return data.map(action => ({
          ...action,
          data: typeof action.data === 'string' ? JSON.parse(action.data) : action.data
        }));
      } catch (error) {
        console.warn('API fetch failed, using localStorage:', error);
      }
    }
    const actions = getStoredActions();
    return actions.filter(action => action.status === 'pending');
  }, CACHE_DURATION.ACTIONS);
}

/**
 * Supprime une action de la DB
 */
export async function deleteAction(actionId) {
  try {
    if (USE_API) {
      try {
        const url = USE_D1_API 
          ? `${API_URL}/actions/${actionId}`
          : `${API_URL}?action=deleteAction&id=${actionId}`;
        
        console.log('🗑️ DELETE request to:', url);
        
        const response = await fetch(url, {
          method: USE_D1_API ? 'DELETE' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: USE_D1_API ? undefined : JSON.stringify({ actionId })
        });
        
        console.log('🗑️ DELETE response status:', response.status, response.statusText);
        
        const text = await response.text();
        console.log('🗑️ DELETE response text:', text);
        
        // Si la réponse n'est pas OK, ne pas utiliser le fallback
        if (!response.ok) {
          console.error('🗑️ DELETE failed with status:', response.status);
          return { success: false, error: `HTTP ${response.status}: ${text || response.statusText}` };
        }
        
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('🗑️ Failed to parse response:', parseError);
          // Si la réponse n'est pas du JSON mais status est OK, considérer comme succès
          if (response.ok) {
            data = { success: true, message: 'Action deleted successfully' };
          } else {
            data = { success: false, error: text || 'Unknown error' };
          }
        }
        
        console.log('🗑️ DELETE parsed data:', data);
        
        // Invalidate all related caches
        invalidateCache('actions_pending');
        invalidateCache('actions_all');
        invalidateCache('leaderboard');
        
        return data;
      } catch (fetchError) {
        console.error('🗑️ API fetch failed:', fetchError);
        // Ne pas utiliser localStorage fallback en production avec D1
        if (USE_D1_API) {
          return { success: false, error: fetchError.message || 'Failed to delete action' };
        }
        console.warn('Using localStorage fallback:', fetchError);
      }
    }
    
    // Fallback localStorage (seulement si pas D1 API)
    if (!USE_D1_API) {
      const actions = getStoredActions();
      const filtered = actions.filter(a => a.id !== actionId);
      localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(filtered));
      return { success: true };
    }
    
    return { success: false, error: 'API not configured' };
  } catch (error) {
    console.error('Error deleting action:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Récupère une action par son ID
 */
export async function getActionById(actionId) {
  if (USE_API) {
    try {
      const url = USE_D1_API 
        ? `${API_URL}/actions/${actionId}`
        : `${API_URL}?action=getActionById&id=${actionId}`;
      const response = await fetch(url);
      const text = await response.text();
      const data = JSON.parse(text);
      if (data && typeof data.data === 'string') {
        data.data = JSON.parse(data.data);
      }
      return data;
    } catch (error) {
      console.warn('API fetch failed, using localStorage:', error);
    }
  }
  const actions = getStoredActions();
  return actions.find(action => action.id === actionId);
}

/**
 * Valide ou refuse une action
 */
export async function validateAction(actionId, decision, points = 0, comment = '', validatedBy = 'Admin') {
  try {
    // Si API configurée
    if (USE_API) {
      try {
        let url, body;
        if (USE_D1_API) {
          // D1 Worker API
          url = `${API_URL}/actions/validate`;
          body = JSON.stringify({
            actionId,
            decision,
            points,
            comment,
            validatedBy
          });
        } else {
          // Apps Script API
          url = API_URL;
          body = JSON.stringify({
            action: 'validateAction',
            actionId,
            decision,
            points,
            comment,
            validatedBy
          });
        }
        
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body
        });
        const text = await response.text();
        const data = JSON.parse(text);
        
        // Invalidate all related caches
        invalidateCache('actions_pending');
        invalidateCache('actions_all');
        invalidateCache('leaderboard');
        
        return data;
      } catch (fetchError) {
        console.warn('API fetch failed, using localStorage:', fetchError);
      }
    }
    
    // Fallback localStorage
    const actions = getStoredActions();
    const actionIndex = actions.findIndex(a => a.id === actionId);
    
    if (actionIndex === -1) {
      return { success: false, error: 'Action not found' };
    }
    
    actions[actionIndex] = {
      ...actions[actionIndex],
      status: 'validated',
      decision,
      points,
      comment,
      validatedBy,
      validatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.ACTIONS, JSON.stringify(actions));
    
    // Si validé, mettre à jour le leaderboard
    if (decision === 'validated') {
      await updateLeaderboard(actions[actionIndex].email, points);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error validating action:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Met à jour le leaderboard
 */
export async function updateLeaderboard(email, points) {
  try {
    // Si Apps Script configuré (seulement si appellé indépendamment)
    // Normalement appelé par validateAction donc pas besoin ici
    
    // Fallback localStorage
    const leaderboard = getStoredLeaderboard();
    const userIndex = leaderboard.findIndex(u => u.email === email);
    
    if (userIndex >= 0) {
      // Utilisateur existe, ajouter les points
      leaderboard[userIndex].totalPoints += points;
      leaderboard[userIndex].actionsCount += 1;
      leaderboard[userIndex].lastUpdate = new Date().toISOString();
    } else {
      // Nouvel utilisateur
      const emailParts = email.split('@')[0].split('.');
      leaderboard.push({
        firstName: emailParts[0] || 'User',
        lastName: emailParts[1] || '',
        email,
        totalPoints: points,
        actionsCount: 1,
        lastUpdate: new Date().toISOString()
      });
    }
    
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
    return { success: true };
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Helper: Extract data from API response (handles both old and new format)
 */
function extractData(response) {
  // New format: { success: true, data: [...], meta: {...} }
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data;
  }
  // Old format: direct array or object
  return response;
}

/**
 * Récupère le leaderboard
 */
export async function getLeaderboard(school = null) {
  return getCachedOrFetch('leaderboard', async () => {
    let leaderboard;
    
    if (USE_API) {
      try {
        const url = USE_D1_API 
          ? `${API_URL}/leaderboard`
          : `${API_URL}?action=getLeaderboard`;
        const response = await fetch(url);
        const text = await response.text();
        const parsed = JSON.parse(text);
        
        // Extract data from new API format
        leaderboard = extractData(parsed);
        
        // Ensure it's an array
        if (!Array.isArray(leaderboard)) {
          console.warn('Leaderboard response is not an array:', leaderboard);
          leaderboard = [];
        }
        
        // D1 API already returns with ranks, but ensure compatibility
        if (leaderboard && leaderboard.length > 0 && !leaderboard[0].rank) {
          // If no rank, add it
          let rank = 1;
          leaderboard = leaderboard.map((user, index) => {
            if (index > 0 && user.totalPoints !== leaderboard[index - 1].totalPoints) {
              rank = index + 1;
            }
            return { ...user, rank };
          });
        }
      } catch (error) {
        console.warn('API fetch failed, using localStorage:', error);
        leaderboard = getStoredLeaderboard();
      }
    } else {
      leaderboard = getStoredLeaderboard();
    }
    
    // Ensure leaderboard is an array
    if (!Array.isArray(leaderboard)) {
      console.warn('Leaderboard is not an array, using empty array');
      leaderboard = [];
    }
    
    // Trier par points décroissant (if not already sorted)
    const sorted = [...leaderboard].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
    
    // Ajouter le rang (gestion des ex aequo)
    let rank = 1;
    return sorted.map((user, index) => {
      // Si ce n'est pas le premier et que les points sont différents du précédent, augmenter le rang
      if (index > 0 && (user.totalPoints || 0) !== (sorted[index - 1].totalPoints || 0)) {
        rank = index + 1;
      }
      return {
        ...user,
        rank
      };
    });
  }, CACHE_DURATION.LEADERBOARD);
}

/**
 * Fonctions utilitaires de storage
 */
function getStoredActions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIONS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading actions:', error);
    return [];
  }
}

function getStoredLeaderboard() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    if (!stored) {
      // Initialiser avec les vrais étudiants Eugenia
      const realLeaderboard = [
        { firstName: 'Orehn', lastName: 'Ansellem', email: 'oansellem@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Corentin', lastName: 'Ballonad', email: 'cballonad@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Walid', lastName: 'Bouzidane', email: 'wbouzidane@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Clément', lastName: 'Cochod', email: 'ccochod@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Marc', lastName: 'Coulibaly', email: 'mcoulibaly@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Bruno', lastName: 'Da Silva Lopez', email: 'bdasilvalopez@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Gaspard', lastName: 'Debuigne', email: 'gdebuigne@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Gaspard', lastName: 'Des champs de boishebert', email: 'gdeschampsdeboishebert@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Amaury', lastName: 'Despretz', email: 'adespretz@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Maxim', lastName: 'Duprat', email: 'mduprat@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Jules', lastName: 'Espy', email: 'jespy@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Abir', lastName: 'Essaidi', email: 'aessaidi@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Léna', lastName: 'Fitoussi', email: 'lfitoussi@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Marvyn', lastName: 'Frederick Salva', email: 'mfredericksalva@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Hector', lastName: 'Lebrun', email: 'hlebrun@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Léon', lastName: 'Le Calvez', email: 'llecalvez@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Louise', lastName: 'Lehmann', email: 'llehmann@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Paul', lastName: 'Marlin', email: 'pmarlin@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Alexandre', lastName: 'Mc Namara', email: 'amcnamara@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'William', lastName: 'Nehar', email: 'wnehar@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'César', lastName: 'Primet', email: 'cprimet@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Emilie', lastName: 'Flore Tata', email: 'efloretata@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Elyot', lastName: 'Trubert', email: 'etrubert@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Erwan', lastName: 'Zaouaoui', email: 'ezaouaoui@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B1', lastUpdate: new Date().toISOString() },
        { firstName: 'Alexandre', lastName: 'DE CARBONNIERES', email: 'adecarbonnieres@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
        { firstName: 'Enzo', lastName: 'PAROISSIEN', email: 'eparoissien@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
        { firstName: 'Nicolas', lastName: 'SHAHATA', email: 'nshahata@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
        { firstName: 'Antoine', lastName: 'MILLOT', email: 'amillot@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
        { firstName: 'Jonas', lastName: 'LAVIGNE', email: 'jlavigne@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
        { firstName: 'Raphaël', lastName: 'LASCAR', email: 'rlascar@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
        { firstName: 'Tara', lastName: 'MENELECK', email: 'tmeneleck@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
        { firstName: 'Jennie', lastName: 'ANSELLEM', email: 'jansellem@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
        { firstName: 'Samuel', lastName: 'ZAOUI', email: 'szaoui@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
        { firstName: 'Alexandre', lastName: 'PALMER', email: 'apalmer@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() },
        { firstName: 'Agathe', lastName: 'JOSSERAND', email: 'ajosserand@eugeniaschool.com', totalPoints: 0, actionsCount: 0, classe: 'B2', lastUpdate: new Date().toISOString() }
      ];
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(realLeaderboard));
      return realLeaderboard;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading leaderboard:', error);
    return [];
  }
}

/**
 * TODO: Connexion à Google Sheets API
 * 
 * Cette fonction sera implémentée pour se connecter à la vraie API
 */
export async function connectToSheet(sheetId, credentials) {
  console.log('TODO: Implement Google Sheets API connection');
  return { success: false, message: 'Not implemented yet' };
}

/**
 * Connexion à une Google Sheet externe pour les automatisations
 */
export async function connectExternalSheet(sheetId, range) {
  console.log('TODO: Connect to external sheet', sheetId, range);
  // Mock: simule une connexion réussie
  return {
    success: true,
    sheetId,
    range,
    message: 'Connexion simulée (à implémenter avec API Google Sheets)'
  };
}

/**
 * Vérifie si une donnée existe dans une Google Sheet externe
 */
export async function checkExternalSheet(data, sheetId, column) {
  console.log('TODO: Check external sheet', data, sheetId, column);
  // Mock: simule une vérification
  // Pour l'instant, retourne false (pas trouvé)
  return {
    found: false,
    message: 'Vérification simulée (à implémenter avec API Google Sheets)'
  };
}

/**
 * Update leaderboard user (full admin update)
 */
export async function updateLeaderboardUser(userData) {
  try {
    if (USE_API) {
      try {
        let url, body;
        if (USE_D1_API) {
          // D1 Worker API
          url = `${API_URL}/leaderboard/user`;
          body = JSON.stringify(userData);
        } else {
          // Apps Script API
          url = API_URL;
          body = JSON.stringify({
            action: 'updateLeaderboardUser',
            ...userData
          });
        }
        
        const response = await fetch(url, {
          method: USE_D1_API ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body
        });
        const text = await response.text();
        invalidateCache('leaderboard');
        return JSON.parse(text);
      } catch (fetchError) {
        console.warn('API fetch failed, using localStorage fallback:', fetchError);
      }
    }
    
    // Fallback localStorage
    const leaderboard = getStoredLeaderboard();
    const userIndex = leaderboard.findIndex(u => u.email === userData.email);
    
    if (userIndex >= 0) {
      leaderboard[userIndex] = { ...leaderboard[userIndex], ...userData };
    } else {
      leaderboard.push(userData);
    }
    
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
    return { success: true };
  } catch (error) {
    console.error('Error updating leaderboard user:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete leaderboard user
 */
export async function deleteLeaderboardUser(email) {
  try {
    if (USE_API) {
      try {
        let url;
        if (USE_D1_API) {
          // D1 Worker API
          url = `${API_URL}/leaderboard/user?email=${encodeURIComponent(email)}`;
        } else {
          // Apps Script API
          url = API_URL;
        }
        
        const response = await fetch(url, {
          method: USE_D1_API ? 'DELETE' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: USE_D1_API ? undefined : JSON.stringify({
            action: 'deleteLeaderboardUser',
            email
          })
        });
        const text = await response.text();
        invalidateCache('leaderboard');
        return JSON.parse(text);
      } catch (fetchError) {
        console.warn('API fetch failed, using localStorage fallback:', fetchError);
      }
    }
    
    // Fallback localStorage
    const leaderboard = getStoredLeaderboard();
    const filtered = leaderboard.filter(u => u.email !== email);
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(filtered));
    return { success: true };
  } catch (error) {
    console.error('Error deleting leaderboard user:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Bulk import students
 */
export async function bulkImportStudents(students) {
  try {
    if (USE_API) {
      try {
        let url;
        if (USE_D1_API) {
          // D1 Worker API
          url = `${API_URL}/leaderboard/bulk`;
        } else {
          // Apps Script API
          url = API_URL;
        }
        
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...(USE_D1_API ? {} : { action: 'bulkImportStudents' }),
            students
          })
        });
        const text = await response.text();
        invalidateCache('leaderboard');
        return JSON.parse(text);
      } catch (fetchError) {
        console.warn('API fetch failed, using localStorage fallback:', fetchError);
      }
    }
    
    // Fallback localStorage
    const leaderboard = getStoredLeaderboard();
    let imported = 0;
    let updated = 0;
    const errors = [];

    students.forEach((student) => {
      const existingIndex = leaderboard.findIndex(u => u.email === student.email);
      if (existingIndex >= 0) {
        // Mettre à jour sans écraser les points existants
        leaderboard[existingIndex] = {
          ...leaderboard[existingIndex],
          firstName: student.firstName,
          lastName: student.lastName,
          classe: student.classe || leaderboard[existingIndex].classe
        };
        updated++;
      } else {
        leaderboard.push({
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          classe: student.classe || 'B1',
          totalPoints: student.totalPoints || 0,
          actionsCount: 0
        });
        imported++;
      }
    });

    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
    return { success: true, imported, updated, errors };
  } catch (error) {
    console.error('Error bulk importing students:', error);
    return { success: false, error: error.message };
  }
}

export default {
  submitAction,
  getAllActions,
  getActionsToValidate,
  getActionById,
  validateAction,
  deleteAction,
  updateLeaderboard,
  getLeaderboard,
  updateLeaderboardUser,
  deleteLeaderboardUser,
  bulkImportStudents,
  connectToSheet,
  connectExternalSheet,
  checkExternalSheet
};

