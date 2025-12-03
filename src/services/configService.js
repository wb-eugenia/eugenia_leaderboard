// Service de gestion de la configuration
import { defaultConfig } from '../config/defaultConfig.js';

const CONFIG_STORAGE_KEY = 'eugeniaConfig';
const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_APP_SCRIPT_URL;
const USE_API = !!API_URL;
const USE_D1_API = !!import.meta.env.VITE_API_URL;

// Debug logging
console.log('⚙️ Config Service initialized:');
console.log('  - API_URL:', API_URL ? API_URL.substring(0, 50) + '...' : 'NOT SET');
console.log('  - USE_API:', USE_API);
console.log('  - USE_D1_API:', USE_D1_API);
console.log('  - Mode:', USE_D1_API ? 'Cloudflare D1 Worker' : USE_API ? 'Google Apps Script' : 'localStorage fallback');

if (!API_URL) {
  console.warn('⚠️ VITE_API_URL or VITE_APP_SCRIPT_URL is not configured! Config will use localStorage fallback.');
}

/**
 * Helper: Parse JSON safely
 */
function parseJSON(str) {
  if (!str || typeof str !== 'string') return {};
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
}

/**
 * Charge la configuration depuis Google Sheets ou localStorage (fallback)
 * Retourne la config par défaut si aucune n'est trouvée
 */
export async function loadConfig() {
  try {
    // Try API first (D1 Worker or Apps Script)
    if (USE_API) {
      try {
        const url = USE_D1_API 
          ? `${API_URL}/config`
          : `${API_URL}?action=getConfig`;
        const response = await fetch(url);
        const text = await response.text();
        const apiConfig = JSON.parse(text);
        
        if (apiConfig && !apiConfig.error && Object.keys(apiConfig).length > 0) {
          // Merge profond avec la config par défaut
          const merged = { ...defaultConfig, ...apiConfig };
          
          // Merge profond pour les tableaux importants
          if (apiConfig.actionTypes && apiConfig.actionTypes.length > 0) {
            merged.actionTypes = apiConfig.actionTypes;
          }
          if (apiConfig.rewards && apiConfig.rewards.length > 0) {
            merged.rewards = apiConfig.rewards;
          }
          if (apiConfig.automations && apiConfig.automations.length > 0) {
            merged.automations = apiConfig.automations;
          }
          
          return merged;
        }
      } catch (error) {
        console.warn('API fetch failed, using localStorage fallback:', error);
      }
    }
    
    // Fallback to localStorage
    const storedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (storedConfig) {
      const parsed = JSON.parse(storedConfig);
      // Merge profond avec la config par défaut
      const merged = { ...defaultConfig, ...parsed };
      
      if (parsed.actionTypes && parsed.actionTypes.length > 0) {
        merged.actionTypes = parsed.actionTypes;
      }
      if (parsed.rewards && parsed.rewards.length > 0) {
        merged.rewards = parsed.rewards;
      }
      if (parsed.automations && parsed.automations.length > 0) {
        merged.automations = parsed.automations;
      }
      
      return merged;
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }
  
  return defaultConfig;
}

/**
 * Sauvegarde la configuration dans Google Sheets ou localStorage (fallback)
 */
export async function saveConfig(config) {
  try {
    // Try API first (D1 Worker or Apps Script)
    if (USE_API) {
      try {
        console.log('📤 Saving config to API:', API_URL);
        console.log('   Config keys:', Object.keys(config || {}));
        
        let url, body;
        if (USE_D1_API) {
          // D1 Worker API
          url = `${API_URL}/config`;
          body = JSON.stringify({ config });
        } else {
          // Apps Script API
          url = API_URL;
          body = JSON.stringify({
            action: 'saveConfig',
            config: config
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
        
        const result = JSON.parse(text);
        console.log('📥 Parsed response:', result);
        
        if (result.success) {
          console.log('✅ Config saved to API successfully');
          return true;
        } else {
          // If API returns an error, throw it
          const errorMsg = result.error || 'Unknown error saving config';
          console.error('❌ API save failed:', errorMsg, result);
          throw new Error(errorMsg);
        }
      } catch (error) {
        console.error('❌ API save failed:', error);
        console.error('   Error details:', {
          message: error.message,
          stack: error.stack,
          url: API_URL
        });
        // Only fallback if it's a network error, not a business logic error
        if (error.message && !error.message.includes('No config data')) {
          // Fallback to localStorage only for network errors
          localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
          console.warn('⚠️ Saved to localStorage as fallback');
          return true;
        } else {
          // Re-throw business logic errors
          throw error;
        }
      }
    } else {
      console.warn('⚠️ API not configured, using localStorage fallback');
    }
    
    // Fallback to localStorage
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error saving config:', error);
    throw error; // Re-throw to let caller handle it
  }
}

/**
 * Réinitialise la configuration par défaut
 */
export function resetConfig() {
  localStorage.removeItem(CONFIG_STORAGE_KEY);
  return defaultConfig;
}

/**
 * Helper: Extract data from API response (handles both old and new format)
 */
function extractApiData(response) {
  // New format: { success: true, data: [...], meta: {...} }
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data;
  }
  // Old format: direct array or object
  return response;
}

/**
 * Obtient les types d'actions configurés
 */
export async function getActionTypes() {
  if (USE_D1_API && USE_API) {
    try {
      const response = await fetch(`${API_URL}/action-types`);
      const text = await response.text();
      const parsed = JSON.parse(text);
      const data = extractApiData(parsed);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('API fetch failed, using config fallback:', error);
    }
  }
  
  // Fallback: utiliser config
  const config = await loadConfig();
  return config.actionTypes || [];
}

/**
 * Obtient un type d'action par son ID
 */
export async function getActionTypeById(id) {
  if (USE_D1_API && USE_API) {
    try {
      const actionTypes = await getActionTypes();
      return actionTypes.find(type => type.id === id);
    } catch (error) {
      console.warn('API fetch failed, using config fallback:', error);
    }
  }
  
  const config = await loadConfig();
  return config.actionTypes.find(type => type.id === id);
}

/**
 * Ajoute ou met à jour un type d'action
 */
export async function saveActionType(actionType) {
  if (USE_D1_API && USE_API) {
    try {
      const existing = await getActionTypeById(actionType.id);
      
      if (existing) {
        // PUT: Update
        const response = await fetch(`${API_URL}/action-types/${actionType.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(actionType)
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.error);
      } else {
        // POST: Create
        const response = await fetch(`${API_URL}/action-types`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(actionType)
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.error);
      }
      
      return actionType;
    } catch (error) {
      console.warn('API save failed, using config fallback:', error);
    }
  }
  
  // Fallback: utiliser config
  const config = await loadConfig();
  const existingIndex = config.actionTypes.findIndex(t => t.id === actionType.id);
  
  if (existingIndex >= 0) {
    config.actionTypes[existingIndex] = actionType;
  } else {
    config.actionTypes.push(actionType);
  }
  
  await saveConfig(config);
  return config;
}

/**
 * Supprime un type d'action
 */
export async function deleteActionType(id) {
  if (USE_D1_API && USE_API) {
    try {
      const response = await fetch(`${API_URL}/action-types/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return { success: true };
    } catch (error) {
      console.warn('API delete failed, using config fallback:', error);
    }
  }
  
  // Fallback: utiliser config
  const config = await loadConfig();
  config.actionTypes = config.actionTypes.filter(t => t.id !== id);
  await saveConfig(config);
  return config;
}

/**
 * Obtient la configuration du leaderboard
 */
export async function getLeaderboardConfig() {
  const config = await loadConfig();
  return config.leaderboard || {};
}

/**
 * Met à jour la configuration du leaderboard
 */
export async function updateLeaderboardConfig(leaderboardConfig) {
  const config = await loadConfig();
  config.leaderboard = { ...config.leaderboard, ...leaderboardConfig };
  await saveConfig(config);
  return config;
}

/**
 * Obtient les règles d'automatisation
 */
export async function getAutomationRules() {
  if (USE_D1_API && USE_API) {
    try {
      const response = await fetch(`${API_URL}/automations`);
      const text = await response.text();
      const parsed = JSON.parse(text);
      const data = extractApiData(parsed);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('API fetch failed, using config fallback:', error);
    }
  }
  
  // Fallback: utiliser config
  const config = await loadConfig();
  return config.automations || [];
}

/**
 * Sauvegarde les règles d'automatisation
 */
export async function saveAutomationRules(automations) {
  if (USE_D1_API && USE_API) {
    try {
      // Pour l'instant, on sauvegarde une par une
      // TODO: Ajouter un endpoint batch si nécessaire
      for (const automation of automations) {
        if (automation.id) {
          await saveAutomationRule(automation);
        } else {
          await createAutomationRule(automation);
        }
      }
      return automations;
    } catch (error) {
      console.warn('API save failed, using config fallback:', error);
    }
  }
  
  // Fallback: utiliser config
  const config = await loadConfig();
  config.automations = automations;
  await saveConfig(config);
  return config;
}

/**
 * Crée une nouvelle règle d'automatisation
 */
async function createAutomationRule(automation) {
  if (USE_D1_API && USE_API) {
    try {
      const response = await fetch(`${API_URL}/automations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(automation)
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return automation;
    } catch (error) {
      console.warn('API create failed, using config fallback:', error);
    }
  }
  
  // Fallback
  const config = await loadConfig();
  config.automations.push(automation);
  await saveConfig(config);
  return config;
}

/**
 * Ajoute ou met à jour une règle d'automatisation
 */
export async function saveAutomationRule(automation) {
  if (USE_D1_API && USE_API) {
    try {
      console.log('💾 Saving automation:', automation);
      
      // Check if automation exists in SQL
      // SQL IDs are numbers, frontend-generated IDs are strings (Date.now().toString())
      const existingAutomations = await getAutomationRules();
      const exists = existingAutomations.some(a => 
        a.id === automation.id && typeof a.id === 'number' && typeof automation.id === 'number'
      );
      
      // If editingAutomation was passed, it means we're updating (it has a numeric ID from SQL)
      // If no editingAutomation or ID is a string, it's a creation
      const isUpdate = typeof automation.id === 'number' && exists;
      
      if (isUpdate) {
        // PUT: Update existing (ID is a number from SQL)
        console.log('📝 Updating automation ID:', automation.id);
        const response = await fetch(`${API_URL}/automations/${automation.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(automation)
        });
        const text = await response.text();
        console.log('📥 Update response:', text);
        const result = JSON.parse(text);
        if (!result.success) {
          throw new Error(result.error || 'Failed to update automation');
        }
      } else {
        // POST: Create new (ID is string from Date.now() or doesn't exist in SQL)
        console.log('➕ Creating new automation (removing frontend ID)');
        // Remove the frontend-generated ID, createdAt, updatedAt - let SQL handle it
        const { id, createdAt, updatedAt, ...automationData } = automation;
        console.log('📤 Sending automation data:', automationData);
        
        const response = await fetch(`${API_URL}/automations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(automationData)
        });
        const text = await response.text();
        console.log('📥 Create response:', text);
        const result = JSON.parse(text);
        if (!result.success) {
          throw new Error(result.error || 'Failed to create automation');
        }
      }
      
      return automation;
    } catch (error) {
      console.error('❌ API save failed:', error);
      console.error('   Error details:', {
        message: error.message,
        stack: error.stack,
        url: API_URL
      });
      throw error; // Re-throw pour que le composant puisse afficher l'erreur
    }
  }
  
  // Fallback: utiliser config
  const config = await loadConfig();
  const existingIndex = config.automations.findIndex(a => a.id === automation.id);
  
  if (existingIndex >= 0) {
    config.automations[existingIndex] = automation;
  } else {
    config.automations.push(automation);
  }
  
  await saveConfig(config);
  return config;
}

/**
 * Supprime une règle d'automatisation
 */
export async function deleteAutomationRule(id) {
  if (USE_D1_API && USE_API) {
    try {
      const response = await fetch(`${API_URL}/automations/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return { success: true };
    } catch (error) {
      console.warn('API delete failed, using config fallback:', error);
    }
  }
  
  // Fallback: utiliser config
  const config = await loadConfig();
  config.automations = config.automations.filter(a => a.id !== id);
  await saveConfig(config);
  return config;
}

/**
 * Obtient la configuration des récompenses
 */
export async function getRewardsConfig() {
  const config = await loadConfig();
  return config.rewards || [];
}

/**
 * Met à jour la configuration des récompenses
 */
export async function updateRewardsConfig(rewards) {
  const config = await loadConfig();
  config.rewards = rewards;
  await saveConfig(config);
  return config;
}

/**
 * Obtient la configuration globale (cagnotte, deadline)
 */
export async function getGlobalConfig() {
  if (USE_D1_API && USE_API) {
    try {
      console.log('📡 Fetching landing page config from:', `${API_URL}/landing-page-config`);
      const response = await fetch(`${API_URL}/landing-page-config`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      console.log('📥 Raw response:', text);
      
      if (!text || text.trim() === '') {
        console.warn('⚠️ Empty response, using defaults');
        return {
          totalPrizePool: '+500€',
          deadline: '31 janvier 2026',
          landingTexts: {}
        };
      }
      
      const data = JSON.parse(text);
      console.log('📊 Parsed data:', data);
      
      const landingTexts = {};
      // Récupérer tous les keys qui commencent par "landingTexts."
      if (data && typeof data === 'object') {
        Object.keys(data).forEach(key => {
          if (key.startsWith('landingTexts.')) {
            const textKey = key.replace('landingTexts.', '');
            landingTexts[textKey] = data[key];
          }
        });
      }
      
      const result = {
        totalPrizePool: data.totalPrizePool || '+500€',
        deadline: data.deadline || '31 janvier 2026',
        landingTexts: Object.keys(landingTexts).length > 0 ? landingTexts : {},
        rewards: data.rewards ? (typeof data.rewards === 'string' ? JSON.parse(data.rewards) : data.rewards) : []
      };
      console.log('✅ Final config:', result);
      return result;
    } catch (error) {
      console.warn('❌ API fetch failed, using config fallback:', error);
      // Ne pas retourner undefined, retourner une config par défaut
      return {
        totalPrizePool: '+500€',
        deadline: '31 janvier 2026',
        landingTexts: {}
      };
    }
  }
  
  // Fallback: utiliser config
  try {
    const config = await loadConfig();
    return {
      totalPrizePool: config.totalPrizePool || '+500€',
      deadline: config.deadline || '31 janvier 2026',
      landingTexts: config.landingTexts || {},
      rewards: config.rewards || []
    };
  } catch (error) {
    console.warn('❌ LoadConfig fallback failed:', error);
    return {
      totalPrizePool: '+500€',
      deadline: '31 janvier 2026',
      landingTexts: {},
      rewards: []
    };
  }
}

/**
 * Met à jour la configuration globale
 */
export async function updateGlobalConfig(globalConfig) {
  if (USE_D1_API && USE_API) {
    try {
      // Préparer la config pour la landing page
      const landingConfig = {
        totalPrizePool: globalConfig.totalPrizePool || '+500€',
        deadline: globalConfig.deadline || '31 janvier 2026'
      };
      
      // Ajouter chaque clé de landingTexts comme entry séparée (convertir en string)
      if (globalConfig.landingTexts && typeof globalConfig.landingTexts === 'object') {
        Object.entries(globalConfig.landingTexts).forEach(([key, value]) => {
          landingConfig[`landingTexts.${key}`] = String(value || '');
        });
      }
      
      // Ajouter les récompenses comme JSON string
      if (globalConfig.rewards && Array.isArray(globalConfig.rewards)) {
        landingConfig.rewards = JSON.stringify(globalConfig.rewards);
      }
      
      console.log('📤 Sending config to API:', landingConfig);
      const response = await fetch(`${API_URL}/landing-page-config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: landingConfig })
      });
      const text = await response.text();
      console.log('📥 Save response:', text);
      const result = JSON.parse(text);
      if (!result.success) throw new Error(result.error);
      console.log('✅ Config saved successfully');
      return globalConfig;
    } catch (error) {
      console.warn('API save failed, using config fallback:', error);
    }
  }
  
  // Fallback: utiliser config
  const config = await loadConfig();
  config.totalPrizePool = globalConfig.totalPrizePool || config.totalPrizePool;
  config.deadline = globalConfig.deadline || config.deadline;
  if (globalConfig.landingTexts) {
    config.landingTexts = { ...config.landingTexts, ...globalConfig.landingTexts };
  }
  await saveConfig(config);
  return config;
}

export default {
  loadConfig,
  saveConfig,
  resetConfig,
  getActionTypes,
  getActionTypeById,
  saveActionType,
  deleteActionType,
  getLeaderboardConfig,
  updateLeaderboardConfig,
  getAutomationRules,
  saveAutomationRules,
  saveAutomationRule,
  deleteAutomationRule,
  getRewardsConfig,
  updateRewardsConfig,
  getGlobalConfig,
  updateGlobalConfig
};

