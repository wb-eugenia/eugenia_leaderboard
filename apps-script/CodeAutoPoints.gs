/**
 * Eugenia Challenge - Attribution Automatique des Points
 * 
 * Ce script traite automatiquement les actions et attribue les points
 * pour les catégories "Salon/Event" et "Vainqueurs"
 * 
 * Instructions :
 * 1. Copiez ce code dans un nouveau projet Apps Script
 * 2. Configurez le SHEET_ID ci-dessous
 * 3. Créez un déclencheur horaire avec la fonction createAutoTrigger()
 */

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // Remplacez par votre Google Sheet ID
const ACTIONS_TAB = 'actions';
const SALON_TAB = 'Salon';
const VAINQUEURS_TAB = 'Vainqueurs';
const BAREME_TAB = 'Barème';
const LEADERBOARD_TAB = 'leaderboard';

/**
 * Fonction principale - Traite toutes les actions en attente
 */
function processAutoPoints() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const actionsSheet = ss.getSheetByName(ACTIONS_TAB);
    
    if (!actionsSheet) {
      Logger.log('Onglet "actions" non trouvé');
      return;
    }
    
    const dataRange = actionsSheet.getDataRange();
    const rows = dataRange.getValues();
    
    let processedCount = 0;
    let stopFlag = false;
    
    // Commencer à la ligne 2 (ignorer les en-têtes)
    for (let i = 1; i < rows.length; i++) {
      const rowNum = i + 1;
      const row = rows[i];
      
      // Colonnes: A=vide, B=nom, C=email, D=action, E=lien, F=date, G=lieu, H=notes, I=statut, J=validation, K=points, L=notes
      
      // Récupérer la couleur de la colonne I (index 8)
      const statusCell = actionsSheet.getRange(rowNum, 9);
      const statusBackground = statusCell.getBackground();
      
      // Vérifier l'état de la colonne I
      if (statusBackground === '#ffffff' || statusBackground === '#FFFFFF' || statusBackground === '') {
        // Colonne blanche = arrêter
        Logger.log(`Colonne I blanche détectée à la ligne ${rowNum}. Arrêt du traitement.`);
        stopFlag = true;
        break;
      } else if (statusBackground === '#e8f5e9' || statusBackground === '#4caf50' || statusBackground === '#c8e6c9') {
        // Colonne verte = déjà traité, passer à la suivante
        continue;
      } else if (statusBackground === '#ffebee' || statusBackground === '#f44336' || statusBackground === '#ef5350' || 
                 statusBackground === '#fff3e0' || statusBackground === '#ff9800' || statusBackground === '#ffb74d') {
        // Colonne rouge OU orange = à traiter
        
        const nom = row[1] || '';        // Colonne B
        const action = row[3] || '';     // Colonne D
        const date = row[5] || '';       // Colonne F
        
        Logger.log(`Traitement ligne ${rowNum}: ${nom} - ${action} - ${date}`);
        
        // Vérifier si c'est une action LinkedIn ou Autre (à ignorer)
        if (action.includes('LinkedIn') || action.includes('Linkedin') || 
            action.includes('Création Asso') || action.includes('Création Événement') || 
            action.includes('Contact Intéressant')) {
          Logger.log(`Action ${action} ignorée (LinkedIn ou Autre)`);
          continue;
        }
        
        // Vérifier si c'est Salon/Event ou Vainqueurs
        if (isSalonEvent(action)) {
          const result = processSalonEvent(ss, nom, action, date);
          updateActionRow(actionsSheet, rowNum, result);
          processedCount++;
        } else if (isVainqueur(action)) {
          const result = processVainqueur(ss, nom, action, date);
          updateActionRow(actionsSheet, rowNum, result);
          processedCount++;
        } else {
          Logger.log(`Action ${action} non reconnue (Salon/Event ou Vainqueurs)`);
        }
      }
    }
    
    // Envoyer un message avec le nombre de lignes traitées
    if (stopFlag) {
      Logger.log(`${processedCount} lignes ont été traitées avant l'arrêt`);
      // Optionnel : envoyer un email ou notification
      // sendNotification(`${processedCount} lignes ont été traitées`);
    } else {
      Logger.log(`${processedCount} lignes ont été traitées`);
    }
    
  } catch (error) {
    Logger.log('Erreur dans processAutoPoints: ' + error.toString());
  }
}

/**
 * Vérifie si l'action fait partie de Salon/Event
 */
function isSalonEvent(action) {
  const salonActions = [
    'Salon (1 journée)',
    'JPO',
    'Forum Lycée',
    'Salon 1/2 journée'
  ];
  
  return salonActions.some(salonAction => action.includes(salonAction));
}

/**
 * Vérifie si l'action fait partie de Vainqueurs
 */
function isVainqueur(action) {
  const vainqueurActions = [
    'Hackathon',
    'Lead Salon',
    'BDD'
  ];
  
  return vainqueurActions.some(vainqueurAction => action.includes(vainqueurAction));
}

/**
 * Traite une action Salon/Event
 */
function processSalonEvent(ss, nom, action, date) {
  try {
    const salonSheet = ss.getSheetByName(SALON_TAB);
    
    if (!salonSheet) {
      return { success: false, error: 'Feuille Salon non trouvée', color: '#fff3e0' }; // Orange
    }
    
    const salonRange = salonSheet.getDataRange();
    const salonRows = salonRange.getValues();
    
    // Chercher une correspondance
    for (let i = 1; i < salonRows.length; i++) {
      const salonRow = salonRows[i];
      const salonAction = salonRow[0] || '';  // Colonne A
      const salonDate = salonRow[1] || '';    // Colonne B
      
      // Vérifier si l'action et la date correspondent
      if (salonAction && salonAction.toString().trim() !== '' && 
          salonDate && salonDate.toString().trim() !== '') {
        
        // Comparer les actions (tolérant aux variations)
        const actionMatch = salonAction.toString().toLowerCase().includes(action.toLowerCase().split(' ')[0]) ||
                           action.toLowerCase().includes(salonAction.toString().toLowerCase().split(' ')[0]);
        
        // Comparer les dates (formats flexibles)
        const dateMatch = compareDates(date, salonDate.toString());
        
        if (actionMatch && dateMatch) {
          // Vérifier si le nom est dans les colonnes D, E, F ou G
          const nomInList = checkNomInColumns(salonRow, nom, [3, 4, 5, 6]); // Indices D, E, F, G
          
          if (nomInList) {
            // Match trouvé ! Récupérer les points depuis le barème
            const points = getPointsFromBareme(ss, action);
            
            if (points !== null) {
              return { success: true, points: points, color: '#e8f5e9' }; // Vert
            } else {
              return { success: false, error: 'Points non trouvés dans le barème', color: '#fff3e0' }; // Orange
            }
          }
        }
      }
    }
    
    // Aucun match trouvé
    return { success: false, error: 'Pas de correspondance trouvée', color: '#fff3e0' }; // Orange
    
  } catch (error) {
    Logger.log('Erreur dans processSalonEvent: ' + error.toString());
    return { success: false, error: error.toString(), color: '#fff3e0' };
  }
}

/**
 * Traite une action Vainqueur
 */
function processVainqueur(ss, nom, action, date) {
  try {
    const vainqueursSheet = ss.getSheetByName(VAINQUEURS_TAB);
    
    if (!vainqueursSheet) {
      return { success: false, error: 'Feuille Vainqueurs non trouvée', color: '#fff3e0' }; // Orange
    }
    
    const vainqueursRange = vainqueursSheet.getDataRange();
    const vainqueursRows = vainqueursRange.getValues();
    
    // Chercher une correspondance
    for (let i = 1; i < vainqueursRows.length; i++) {
      const vainqueursRow = vainqueursRows[i];
      const vainqueursAction = vainqueursRow[0] || '';  // Colonne A
      const vainqueursDate = vainqueursRow[1] || '';   // Colonne B
      
      // Vérifier si l'action et la date correspondent
      if (vainqueursAction && vainqueursAction.toString().trim() !== '' && 
          vainqueursDate && vainqueursDate.toString().trim() !== '') {
        
        // Comparer les actions
        const actionMatch = vainqueursAction.toString().toLowerCase().includes(action.toLowerCase().split(' ')[0]) ||
                           action.toLowerCase().includes(vainqueursAction.toString().toLowerCase().split(' ')[0]);
        
        // Comparer les dates
        const dateMatch = compareDates(date, vainqueursDate.toString());
        
        if (actionMatch && dateMatch) {
          // Vérifier si le nom est dans les colonnes D, E, F ou G
          const nomInList = checkNomInColumns(vainqueursRow, nom, [3, 4, 5, 6]); // Indices D, E, F, G
          
          if (nomInList) {
            // Match trouvé ! Récupérer les points depuis le barème
            const points = getPointsFromBareme(ss, action);
            
            if (points !== null) {
              return { success: true, points: points, color: '#e8f5e9' }; // Vert
            } else {
              return { success: false, error: 'Points non trouvés dans le barème', color: '#fff3e0' }; // Orange
            }
          }
        }
      }
    }
    
    // Aucun match trouvé
    return { success: false, error: 'Pas de correspondance trouvée', color: '#fff3e0' }; // Orange
    
  } catch (error) {
    Logger.log('Erreur dans processVainqueur: ' + error.toString());
    return { success: false, error: error.toString(), color: '#fff3e0' };
  }
}

/**
 * Vérifie si le nom est présent dans les colonnes spécifiées
 */
function checkNomInColumns(row, nom, columnIndices) {
  for (let i = 0; i < columnIndices.length; i++) {
    const colIndex = columnIndices[i];
    if (colIndex < row.length) {
      const cellValue = row[colIndex];
      if (cellValue && cellValue.toString().toLowerCase().trim() === nom.toLowerCase().trim()) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Compare deux dates (formats flexibles)
 */
function compareDates(date1, date2) {
  try {
    // Convertir en objets Date
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    // Comparer seulement la date (sans l'heure)
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  } catch (error) {
    // Si la conversion échoue, comparaison de chaînes
    return date1.toString().trim() === date2.toString().trim();
  }
}

/**
 * Récupère les points depuis le barème
 */
function getPointsFromBareme(ss, action) {
  try {
    const baremeSheet = ss.getSheetByName(BAREME_TAB);
    
    if (!baremeSheet) {
      Logger.log('Feuille Barème non trouvée');
      return null;
    }
    
    const baremeRange = baremeSheet.getDataRange();
    const baremeRows = baremeRange.getValues();
    
    // Chercher l'action dans la colonne A
    for (let i = 1; i < baremeRows.length; i++) {
      const baremeRow = baremeRows[i];
      const baremeAction = baremeRow[0] || '';  // Colonne A
      const points = baremeRow[1];              // Colonne B
      
      if (baremeAction && baremeAction.toString().toLowerCase().trim() === action.toLowerCase().trim()) {
        return parseInt(points) || 0;
      }
    }
    
    return null;
    
  } catch (error) {
    Logger.log('Erreur dans getPointsFromBareme: ' + error.toString());
    return null;
  }
}

/**
 * Met à jour la ligne d'action selon le résultat
 */
function updateActionRow(actionsSheet, rowNum, result) {
  try {
    if (result.success) {
      // Succès : I et J en vert, K = points
      actionsSheet.getRange(rowNum, 9).setBackground('#e8f5e9'); // Vert - Colonne I
      actionsSheet.getRange(rowNum, 9).setValue('✅ Traité');
      
      actionsSheet.getRange(rowNum, 10).setBackground('#e8f5e9'); // Vert - Colonne J
      actionsSheet.getRange(rowNum, 10).setValue('✅ Validé');
      
      actionsSheet.getRange(rowNum, 11).setValue(result.points); // Colonne K
      
      // Mettre à jour le leaderboard
      const email = actionsSheet.getRange(rowNum, 3).getValue(); // Colonne C
      if (email) {
        updateLeaderboard(email, result.points);
      }
      
      Logger.log(`Ligne ${rowNum} validée avec ${result.points} points`);
      
    } else {
      // Échec : I en orange
      actionsSheet.getRange(rowNum, 9).setBackground(result.color || '#fff3e0'); // Orange
      actionsSheet.getRange(rowNum, 9).setValue('⚠️ Erreur');
      
      if (result.error) {
        actionsSheet.getRange(rowNum, 12).setValue(result.error); // Colonne L
      }
      
      Logger.log(`Ligne ${rowNum} non validée: ${result.error}`);
    }
    
  } catch (error) {
    Logger.log('Erreur dans updateActionRow: ' + error.toString());
  }
}

/**
 * Met à jour le leaderboard avec les nouveaux points
 */
function updateLeaderboard(email, points) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const leaderboardSheet = ss.getSheetByName(LEADERBOARD_TAB);
    
    if (!leaderboardSheet) {
      Logger.log('Onglet leaderboard non trouvé');
      return;
    }
    
    const dataRange = leaderboardSheet.getDataRange();
    const values = dataRange.getValues();
    
    // Colonnes: A=prénom, B=nom, C=classe, D=mail, E=points
    // Chercher la ligne correspondant à l'email
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const emailCol = row[3];
      
      if (emailCol && emailCol.toString().toLowerCase().trim() === email.toLowerCase().trim()) {
        // Ajouter les points (colonne E, index 4)
        const currentPoints = parseInt(row[4]) || 0;
        const newPoints = currentPoints + points;
        
        leaderboardSheet.getRange(i + 1, 5).setValue(newPoints);
        Logger.log(`Points mis à jour pour ${email}: ${currentPoints} + ${points} = ${newPoints}`);
        
        return;
      }
    }
    
    Logger.log(`Email ${email} non trouvé dans le leaderboard`);
    
  } catch (error) {
    Logger.log('Erreur updateLeaderboard: ' + error.toString());
  }
}

/**
 * Créer un déclencheur horaire pour exécuter automatiquement
 */
function createAutoTrigger() {
  // Supprimer les anciens déclencheurs
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processAutoPoints') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Créer un nouveau déclencheur horaire
  ScriptApp.newTrigger('processAutoPoints')
    .timeBased()
    .everyHours(1) // Exécuter toutes les heures
    .create();
  
  Logger.log('Déclencheur automatique créé pour processAutoPoints');
  
  // Afficher un message dans une alerte (si exécuté depuis le menu)
  if (typeof SpreadsheetApp !== 'undefined') {
    SpreadsheetApp.getUi().alert(
      '✅ Déclencheur créé !',
      'Le script s\'exécutera automatiquement toutes les heures.',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

/**
 * Créer le menu personnalisé dans Google Sheets
 * Cette fonction est appelée automatiquement à l'ouverture du fichier
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🏆 Auto Points')
    .addItem('▶️ Traiter les actions', 'runFromMenu')
    .addSeparator()
    .addItem('✋ Traiter manuellement (LinkedIn/Autre)', 'processManualRequests')
    .addSeparator()
    .addItem('⏰ Activer l\'automatisation (1h)', 'createAutoTrigger')
    .addItem('❌ Désactiver l\'automatisation', 'deleteAutoTrigger')
    .addSeparator()
    .addItem('📊 Voir les déclencheurs', 'showTriggers')
    .addToUi();
}

/**
 * Exécute le traitement depuis le menu
 */
function runFromMenu() {
  try {
    SpreadsheetApp.getUi().alert(
      '⏳ Traitement en cours...',
      'Le traitement des actions est en cours. Consultez les logs Apps Script pour voir le résultat.',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    
    // Exécuter le traitement
    processAutoPoints();
    
    // Afficher un message de confirmation
    SpreadsheetApp.getUi().alert(
      '✅ Traitement terminé !',
      'Le traitement est terminé. Consultez les logs Apps Script (View > Execution log) pour voir les détails.',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    
  } catch (error) {
    SpreadsheetApp.getUi().alert(
      '❌ Erreur',
      'Une erreur s\'est produite : ' + error.toString(),
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

/**
 * Supprimer tous les déclencheurs automatiques
 */
function deleteAutoTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  let deletedCount = 0;
  
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processAutoPoints') {
      ScriptApp.deleteTrigger(trigger);
      deletedCount++;
    }
  });
  
  Logger.log(`${deletedCount} déclencheur(s) supprimé(s)`);
  
  SpreadsheetApp.getUi().alert(
    deletedCount > 0 ? '✅ Déclencheurs supprimés' : 'ℹ️ Aucun déclencheur trouvé',
    deletedCount > 0 
      ? `${deletedCount} déclencheur(s) automatique(s) supprimé(s).`
      : 'Il n\'y avait aucun déclencheur à supprimer.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Afficher les déclencheurs actifs
 */
function showTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  let message = 'Déclencheurs actifs :\n\n';
  
  if (triggers.length === 0) {
    message = 'Aucun déclencheur actif.';
  } else {
    triggers.forEach((trigger, index) => {
      if (trigger.getHandlerFunction() === 'processAutoPoints') {
        message += `${index + 1}. processAutoPoints\n`;
        message += `   Type: ${trigger.getEventType()}\n`;
        if (trigger.getEventType() === 'CLOCK') {
          message += `   Fréquence: Toutes les heures\n`;
        }
        message += '\n';
      }
    });
    
    if (!message.includes('processAutoPoints')) {
      message = 'Aucun déclencheur pour processAutoPoints trouvé.';
    }
  }
  
  SpreadsheetApp.getUi().alert('📊 Déclencheurs', message, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Traitement manuel des demandes LinkedIn et Autre
 * Affiche une interface pour valider/refuser chaque demande
 */
function processManualRequests() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const actionsSheet = ss.getSheetByName(ACTIONS_TAB);
    
    if (!actionsSheet) {
      SpreadsheetApp.getUi().alert('Erreur', 'Onglet "actions" non trouvé', SpreadsheetApp.getUi().ButtonSet.OK);
      return;
    }
    
    // Trouver toutes les lignes LinkedIn ou Autre à traiter (rouges ou oranges)
    const dataRange = actionsSheet.getDataRange();
    const rows = dataRange.getValues();
    const requestsToProcess = [];
    
    for (let i = 1; i < rows.length; i++) {
      const rowNum = i + 1;
      const row = rows[i];
      const action = row[3] || ''; // Colonne D
      
      // Vérifier si c'est LinkedIn ou Autre
      const isLinkedIn = action.includes('LinkedIn') || action.includes('Linkedin');
      const isAutre = action.includes('Création Asso') || action.includes('Création Événement') || 
                      action.includes('Contact Intéressant');
      
      if (isLinkedIn || isAutre) {
        // Vérifier l'état de la colonne I
        const statusCell = actionsSheet.getRange(rowNum, 9);
        const statusBackground = statusCell.getBackground();
        
        // Vérifier si rouge ou orange
        if (statusBackground === '#ffebee' || statusBackground === '#f44336' || statusBackground === '#ef5350' ||
            statusBackground === '#fff3e0' || statusBackground === '#ff9800' || statusBackground === '#ffb74d') {
          
          const nom = row[1] || '';        // Colonne B (nom)
          const email = row[2] || '';      // Colonne C (email)
          const lien = row[4] || '';       // Colonne E (lien)
          const date = row[5] || '';       // Colonne F (date)
          const lieu = row[6] || '';       // Colonne G (lieu/nom)
          const notes = row[7] || '';      // Colonne H (notes)
          
          requestsToProcess.push({
            rowNum: rowNum,
            nom: nom,
            email: email,
            action: action,
            lien: isLinkedIn ? lien : lieu, // Lien pour LinkedIn, lieu pour Autre
            date: date,
            notes: notes
          });
        }
      }
    }
    
    if (requestsToProcess.length === 0) {
      SpreadsheetApp.getUi().alert(
        'ℹ️ Aucune action à traiter',
        'Il n\'y a plus de nouvelles actions LinkedIn ou Autre à traiter.',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      return;
    }
    
    // Stocker les demandes dans PropertiesService pour y accéder ensuite
    const properties = PropertiesService.getScriptProperties();
    properties.setProperty('MANUAL_REQUESTS', JSON.stringify(requestsToProcess));
    properties.setProperty('MANUAL_INDEX', '0');
    
    // Traiter la première demande
    processRequestInSequence(actionsSheet, requestsToProcess, 0);
    
  } catch (error) {
    Logger.log('Erreur dans processManualRequests: ' + error.toString());
    SpreadsheetApp.getUi().alert('❌ Erreur', 'Une erreur s\'est produite: ' + error.toString(), SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

/**
 * Traite les demandes en séquence
 */
function processRequestInSequence(sheet, requests, index) {
  if (index >= requests.length) {
    // Nettoyer PropertiesService
    const properties = PropertiesService.getScriptProperties();
    properties.deleteProperty('MANUAL_REQUESTS');
    properties.deleteProperty('MANUAL_INDEX');
    
    SpreadsheetApp.getUi().alert(
      '✅ Plus de nouvelles actions',
      `Toutes les ${requests.length} actions ont été traitées.`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    return;
  }
  
  const request = requests[index];
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty('MANUAL_INDEX', index.toString());
  
  processSingleManualRequest(sheet, request, index + 1, requests.length);
}

/**
 * Traite une demande manuelle individuelle avec interface HTML
 */
function processSingleManualRequest(sheet, request, currentIndex, totalCount) {
  try {
    // Créer le HTML pour l'interface
    const htmlContent = createManualRequestHtml(request, currentIndex, totalCount);
    
    // Créer la fenêtre modale
    const htmlOutput = HtmlService.createHtmlOutput(htmlContent)
      .setWidth(700)
      .setHeight(600);
    
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, `Traitement manuel - ${currentIndex}/${totalCount}`);
    
  } catch (error) {
    Logger.log('Erreur dans processSingleManualRequest: ' + error.toString());
  }
}

/**
 * Fonction appelée depuis le HTML pour traiter la décision
 * Architecture simplifiée : tout dans une seule fonction
 */
function processManualDecision(rowNum, validated, comments, action) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const actionsSheet = ss.getSheetByName(ACTIONS_TAB);
    
    if (!actionsSheet) {
      Logger.log('Onglet actions non trouvé');
      return { success: false, error: 'Onglet actions non trouvé' };
    }
    
    // Vérifier que la ligne existe
    const lastRow = actionsSheet.getLastRow();
    if (rowNum > lastRow || rowNum < 2) {
      Logger.log(`Ligne ${rowNum} invalide (dernière ligne: ${lastRow})`);
      return { success: false, error: 'Ligne invalide' };
    }
    
    if (validated) {
      // VALIDATION
      
      // Colonne I : Vert - Traité
      actionsSheet.getRange(rowNum, 9).setBackground('#e8f5e9');
      actionsSheet.getRange(rowNum, 9).setValue('✅ Traité');
      
      // Colonne J : Vert - Validé
      actionsSheet.getRange(rowNum, 10).setBackground('#e8f5e9');
      actionsSheet.getRange(rowNum, 10).setValue('✅ Validé manuellement');
      
      // Colonne K : Points depuis le barème
      let points = 0;
      try {
        const baremeSheet = ss.getSheetByName(BAREME_TAB);
        if (baremeSheet) {
          const baremeResult = getPointsFromBareme(ss, action);
          points = baremeResult || 0;
        }
      } catch (e) {
        Logger.log('Erreur récupération points: ' + e.toString());
        points = 0;
      }
      
      actionsSheet.getRange(rowNum, 11).setValue(points);
      
      // Colonne L : Commentaire
      const commentText = comments && comments.trim() !== '' 
        ? `Validation manuelle - ${comments}` 
        : 'Validation manuelle';
      actionsSheet.getRange(rowNum, 12).setValue(commentText);
      
      Logger.log(`Ligne ${rowNum} validée avec ${points} points`);
      
    } else {
      // REFUS
      
      // Colonne I : Vert - Traité
      actionsSheet.getRange(rowNum, 9).setBackground('#e8f5e9');
      actionsSheet.getRange(rowNum, 9).setValue('✅ Traité');
      
      // Colonne J : Rouge - Refusé
      actionsSheet.getRange(rowNum, 10).setBackground('#ffebee');
      actionsSheet.getRange(rowNum, 10).setValue('❌ Refusé');
      
      // Colonne K : 0 points
      actionsSheet.getRange(rowNum, 11).setValue(0);
      
      // Colonne L : Commentaire
      const commentText = comments && comments.trim() !== '' 
        ? `Refusé - ${comments}` 
        : 'Refusé';
      actionsSheet.getRange(rowNum, 12).setValue(commentText);
      
      Logger.log(`Ligne ${rowNum} refusée`);
    }
    
    return { success: true };
    
  } catch (error) {
    Logger.log('Erreur dans processManualDecision: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    
    // En cas d'erreur, essayer de mettre en orange
    try {
      const ss = SpreadsheetApp.openById(SHEET_ID);
      const actionsSheet = ss.getSheetByName(ACTIONS_TAB);
      if (actionsSheet && rowNum >= 2 && rowNum <= actionsSheet.getLastRow()) {
        actionsSheet.getRange(rowNum, 9).setBackground('#fff3e0');
        actionsSheet.getRange(rowNum, 9).setValue('⚠️ Erreur');
        const errorMsg = error.toString();
        const shortError = errorMsg.length > 100 ? errorMsg.substring(0, 97) + '...' : errorMsg;
        actionsSheet.getRange(rowNum, 12).setValue('Erreur: ' + shortError);
      }
    } catch (e) {
      Logger.log('Erreur lors de l\'écriture de l\'erreur: ' + e.toString());
    }
    
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Créer le HTML pour l'interface de traitement manuel
 */
function createManualRequestHtml(request, currentIndex, totalCount) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20px;
            margin: 0;
            background: #f5f5f5;
          }
          .container {
            background: white;
            border-radius: 8px;
            padding: 25px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h2 {
            color: #333;
            border-bottom: 3px solid #DBA12D;
            padding-bottom: 10px;
            margin-top: 0;
          }
          .field {
            margin-bottom: 20px;
          }
          label {
            font-weight: 600;
            color: #555;
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
          }
          .value {
            padding: 12px;
            background: #f9f9f9;
            border-radius: 4px;
            border-left: 4px solid #DBA12D;
            word-break: break-word;
          }
          .link-value {
            color: #0066cc;
            text-decoration: underline;
          }
          textarea {
            width: 100%;
            height: 100px;
            padding: 10px;
            border: 2px solid #e0e0e0;
            border-radius: 4px;
            font-family: inherit;
            font-size: 14px;
            resize: vertical;
            box-sizing: border-box;
          }
          textarea:focus {
            outline: none;
            border-color: #DBA12D;
          }
          .buttons {
            display: flex;
            gap: 10px;
            margin-top: 25px;
            justify-content: flex-end;
          }
          button {
            padding: 12px 30px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 120px;
          }
          .validate {
            background: #4caf50;
            color: white;
          }
          .validate:hover {
            background: #45a049;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
          }
          .reject {
            background: #f44336;
            color: white;
          }
          .reject:hover {
            background: #da190b;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(244, 67, 54, 0.3);
          }
          .progress {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-bottom: 20px;
            padding: 10px;
            background: #e8f5e9;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>⚡ Traitement Manuel</h2>
          <div class="progress">Action ${currentIndex} sur ${totalCount}</div>
          
          <div class="field">
            <label>👤 Demandeur:</label>
            <div class="value">${escapeHtml(request.nom || 'N/A')}</div>
          </div>
          
          <div class="field">
            <label>📋 Action demandée:</label>
            <div class="value">${escapeHtml(request.action || 'N/A')}</div>
          </div>
          
          <div class="field">
            <label>${request.action.includes('LinkedIn') ? '🔗 Lien' : '📝 Nom'}:</label>
            <div class="value">
              ${request.action.includes('LinkedIn') && request.lien
                ? `<a href="${request.lien}" target="_blank" style="color: #0066cc; text-decoration: underline; word-break: break-all;">${request.lien}</a>`
                : (request.lien ? escapeHtml(request.lien) : 'N/A')}
            </div>
          </div>
          
          <div class="field">
            <label>📅 Date:</label>
            <div class="value">${escapeHtml(request.date || 'N/A')}</div>
          </div>
          
          <div class="field">
            <label>📝 Notes de l'élève:</label>
            <div class="value">${escapeHtml(request.notes || 'Aucune note')}</div>
          </div>
          
          <div class="field">
            <label>💬 Commentaires (optionnel):</label>
            <textarea id="comments" placeholder="Ajoutez vos commentaires ici..."></textarea>
          </div>
          
          <div class="buttons">
            <button class="reject" onclick="rejectRequest()">❌ Refuser</button>
            <button class="validate" onclick="validateRequest()">✅ Valider</button>
          </div>
        </div>
        
        <script>
          function escapeHtml(text) {
            if (!text) return '';
            const map = {
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              '"': '&quot;',
              "'": '&#039;'
            };
            return text.toString().replace(/[&<>"']/g, m => map[m]);
          }
          
          function validateRequest() {
            const comments = document.getElementById('comments').value;
            const button = document.querySelector('button.validate');
            if (button) {
              button.disabled = true;
              button.textContent = 'Traitement...';
            }
            
            google.script.run
              .withSuccessHandler((result) => {
                if (result && result.success) {
                  google.script.host.close();
                } else {
                  if (button) {
                    button.disabled = false;
                    button.textContent = '✅ Valider';
                  }
                  alert('Erreur: ' + (result ? (result.error || 'Erreur inconnue') : 'Aucune réponse'));
                }
              })
              .withFailureHandler((error) => {
                if (button) {
                  button.disabled = false;
                  button.textContent = '✅ Valider';
                }
                alert('Erreur: ' + (error.message || error.toString()));
              })
              .processManualDecision(${request.rowNum}, true, comments || '', ${JSON.stringify(request.action)});
          }
          
          function rejectRequest() {
            let comments = document.getElementById('comments').value;
            
            if (!comments || comments.trim() === '') {
              comments = prompt('Raison du refus (obligatoire):');
              if (!comments || comments.trim() === '') {
                alert('Veuillez indiquer une raison pour le refus.');
                return;
              }
            }
            
            const button = document.querySelector('button.reject');
            if (button) {
              button.disabled = true;
              button.textContent = 'Traitement...';
            }
            
            google.script.run
              .withSuccessHandler((result) => {
                if (result && result.success) {
                  google.script.host.close();
                } else {
                  if (button) {
                    button.disabled = false;
                    button.textContent = '❌ Refuser';
                  }
                  alert('Erreur: ' + (result ? (result.error || 'Erreur inconnue') : 'Aucune réponse'));
                }
              })
              .withFailureHandler((error) => {
                if (button) {
                  button.disabled = false;
                  button.textContent = '❌ Refuser';
                }
                alert('Erreur: ' + (error.message || error.toString()));
              })
              .processManualDecision(${request.rowNum}, false, comments, ${JSON.stringify(request.action)});
          }
        </script>
      </body>
    </html>
  `;
  return html;
}

// Helper pour échapper le HTML
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.toString().replace(/[&<>"']/g, m => map[m]);
}

/**
 * Test de la fonction principale
 */
function testAutoPoints() {
  processAutoPoints();
  Logger.log('Test terminé');
}

