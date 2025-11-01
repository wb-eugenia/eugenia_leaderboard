// Service de gestion de la configuration
import { defaultConfig } from '../config/defaultConfig.js';

const CONFIG_STORAGE_KEY = 'eugeniaConfig';
const APP_SCRIPT_URL = import.meta.env.VITE_APP_SCRIPT_URL;
const USE_APPS_SCRIPT = !!APP_SCRIPT_URL;

/**
 * Charge la configuration depuis Google Sheets ou localStorage (fallback)
 * Retourne la config par défaut si aucune n'est trouvée
 */
export async function loadConfig() {
  try {
    // Try Apps Script first
    if (USE_APPS_SCRIPT) {
      try {
        const response = await fetch(`${APP_SCRIPT_URL}?action=getConfig`);
        const text = await response.text();
        const googleConfig = JSON.parse(text);
        
        if (googleConfig && !googleConfig.error) {
          // Merge profond avec la config par défaut
          const merged = { ...defaultConfig, ...googleConfig };
          
          // Merge profond pour les tableaux importants
          if (googleConfig.actionTypes && googleConfig.actionTypes.length > 0) {
            merged.actionTypes = googleConfig.actionTypes;
          }
          if (googleConfig.rewards && googleConfig.rewards.length > 0) {
            merged.rewards = googleConfig.rewards;
          }
          if (googleConfig.automations && googleConfig.automations.length > 0) {
            merged.automations = googleConfig.automations;
          }
          
          return merged;
        }
      } catch (error) {
        console.warn('Apps Script fetch failed, using localStorage fallback:', error);
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
    // Try Apps Script first
    if (USE_APPS_SCRIPT) {
      try {
        const response = await fetch(APP_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'saveConfig',
            config: config
          })
        });
        const text = await response.text();
        const result = JSON.parse(text);
        
        if (result.success) {
          return true;
        }
      } catch (error) {
        console.warn('Apps Script save failed, using localStorage fallback:', error);
      }
    }
    
    // Fallback to localStorage
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error saving config:', error);
    return false;
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
 * Obtient les types d'actions configurés
 */
export async function getActionTypes() {
  const config = await loadConfig();
  return config.actionTypes || [];
}

/**
 * Obtient un type d'action par son ID
 */
export async function getActionTypeById(id) {
  const config = await loadConfig();
  return config.actionTypes.find(type => type.id === id);
}

/**
 * Ajoute ou met à jour un type d'action
 */
export async function saveActionType(actionType) {
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
  const config = await loadConfig();
  return config.automations || [];
}

/**
 * Sauvegarde les règles d'automatisation
 */
export async function saveAutomationRules(automations) {
  const config = await loadConfig();
  config.automations = automations;
  await saveConfig(config);
  return config;
}

/**
 * Ajoute ou met à jour une règle d'automatisation
 */
export async function saveAutomationRule(automation) {
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
  const config = await loadConfig();
  return {
    totalPrizePool: config.totalPrizePool || '+500€',
    deadline: config.deadline || '31 janvier 2026'
  };
}

/**
 * Met à jour la configuration globale
 */
export async function updateGlobalConfig(globalConfig) {
  const config = await loadConfig();
  config.totalPrizePool = globalConfig.totalPrizePool || config.totalPrizePool;
  config.deadline = globalConfig.deadline || config.deadline;
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

