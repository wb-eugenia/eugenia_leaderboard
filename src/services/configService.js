// Service de gestion de la configuration
import { defaultConfig } from '../config/defaultConfig.js';

const CONFIG_STORAGE_KEY = 'eugeniaConfig';

/**
 * Charge la configuration depuis le stockage local
 * Retourne la config par défaut si aucune n'est trouvée
 */
export function loadConfig() {
  try {
    const storedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (storedConfig) {
      const parsed = JSON.parse(storedConfig);
      // Merge avec la config par défaut pour éviter les champs manquants
      return { ...defaultConfig, ...parsed };
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }
  
  return defaultConfig;
}

/**
 * Sauvegarde la configuration dans le stockage local
 */
export function saveConfig(config) {
  try {
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
export function getActionTypes() {
  const config = loadConfig();
  return config.actionTypes || [];
}

/**
 * Obtient un type d'action par son ID
 */
export function getActionTypeById(id) {
  const config = loadConfig();
  return config.actionTypes.find(type => type.id === id);
}

/**
 * Ajoute ou met à jour un type d'action
 */
export function saveActionType(actionType) {
  const config = loadConfig();
  const existingIndex = config.actionTypes.findIndex(t => t.id === actionType.id);
  
  if (existingIndex >= 0) {
    config.actionTypes[existingIndex] = actionType;
  } else {
    config.actionTypes.push(actionType);
  }
  
  saveConfig(config);
  return config;
}

/**
 * Supprime un type d'action
 */
export function deleteActionType(id) {
  const config = loadConfig();
  config.actionTypes = config.actionTypes.filter(t => t.id !== id);
  saveConfig(config);
  return config;
}

/**
 * Obtient la configuration du leaderboard
 */
export function getLeaderboardConfig() {
  const config = loadConfig();
  return config.leaderboard || {};
}

/**
 * Met à jour la configuration du leaderboard
 */
export function updateLeaderboardConfig(leaderboardConfig) {
  const config = loadConfig();
  config.leaderboard = { ...config.leaderboard, ...leaderboardConfig };
  saveConfig(config);
  return config;
}

/**
 * Obtient les règles d'automatisation
 */
export function getAutomationRules() {
  const config = loadConfig();
  return config.automations || [];
}

/**
 * Sauvegarde les règles d'automatisation
 */
export function saveAutomationRules(automations) {
  const config = loadConfig();
  config.automations = automations;
  saveConfig(config);
  return config;
}

/**
 * Ajoute ou met à jour une règle d'automatisation
 */
export function saveAutomationRule(automation) {
  const config = loadConfig();
  const existingIndex = config.automations.findIndex(a => a.id === automation.id);
  
  if (existingIndex >= 0) {
    config.automations[existingIndex] = automation;
  } else {
    config.automations.push(automation);
  }
  
  saveConfig(config);
  return config;
}

/**
 * Supprime une règle d'automatisation
 */
export function deleteAutomationRule(id) {
  const config = loadConfig();
  config.automations = config.automations.filter(a => a.id !== id);
  saveConfig(config);
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
  deleteAutomationRule
};

