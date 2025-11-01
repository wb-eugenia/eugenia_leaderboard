// Service de validation des actions
import { validateAction, getActionById } from './googleSheets.js';

/**
 * Traite la validation complète d'une action
 * - Valide l'action
 * - Met à jour le leaderboard si validé
 * - Envoie l'email de notification
 */
export async function processValidation(actionId, decision, points, comment, validatedBy) {
  try {
    // Récupérer l'action pour avoir l'email
    const action = await getActionById(actionId);
    
    if (!action) {
      return { success: false, error: 'Action not found' };
    }
    
    // Valider l'action (cette fonction met déjà à jour le leaderboard)
    const result = await validateAction(actionId, decision, points, comment, validatedBy);
    
    if (!result.success) {
      return result;
    }
    
    // TODO: Envoyer l'email de notification
    // await sendNotificationEmail(action.email, decision, comment);
    console.log(`Would send ${decision} notification to ${action.email}`);
    
    return { success: true };
  } catch (error) {
    console.error('Error processing validation:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Vérifie si une action peut être auto-validée
 * TODO: Implémenter la logique d'auto-validation
 */
export async function autoValidate(action, rules) {
  console.log('TODO: Implement auto-validation logic');
  return false;
}

/**
 * Envoie un email de notification
 * TODO: Implémenter l'envoi d'email via Apps Script ou service externe
 */
async function sendNotificationEmail(email, decision, comment) {
  console.log('TODO: Implement email notification');
  return { success: false, message: 'Not implemented yet' };
}

export default {
  processValidation,
  autoValidate
};

