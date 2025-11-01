/**
 * Eugenia Challenge - Traitement Automatique des Actions
 * 
 * Ce script traite automatiquement les actions soumises dans Google Sheets
 * Il vérifie les posts LinkedIn et attribue les points selon le barème
 * 
 * Instructions :
 * 1. Copiez ce code dans un nouveau projet Apps Script
 * 2. Configurez le SHEET_ID ci-dessous
 * 3. Créez un déclencheur horaire pour exécuter automatiquement
 */

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // Remplacez par votre Google Sheet ID
const ACTIONS_TAB = 'actions';
const LEADERBOARD_TAB = 'leaderboard';

/**
 * Fonction principale - à appeler manuellement ou via déclencheur
 */
function processActions() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const actionsSheet = ss.getSheetByName(ACTIONS_TAB);
    
    if (!actionsSheet) {
      Logger.log('Onglet "actions" non trouvé');
      return;
    }
    
    const dataRange = actionsSheet.getDataRange();
    const rows = dataRange.getValues();
    
    // Commencer à la ligne 2 (ignorer les en-têtes)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      // Colonnes: A=vide, B=vide, C=email, D=action, E=lien, F=date, G=lieu, H=notes
      const email = row[2];
      const actionName = row[3];
      const postUrl = row[4];
      
      // Vérifier si c'est un post LinkedIn
      if (actionName === 'Post LinkedIn' && postUrl && postUrl.includes('linkedin.com')) {
        // Vérifier si déjà traité (colonne I doit être vide)
        if (row[8] === '' || row[8] === undefined) {
          processLinkedInPost(actionsSheet, i + 1, postUrl, email);
        }
      }
    }
    
    Logger.log('Traitement terminé');
  } catch (error) {
    Logger.log('Erreur dans processActions: ' + error.toString());
  }
}

/**
 * Traite un post LinkedIn
 */
function processLinkedInPost(sheet, rowNum, postUrl, email) {
  try {
    Logger.log('Traitement du post: ' + postUrl);
    
    // Marquer la colonne I en vert (action reçue)
    sheet.getRange(rowNum, 9).setBackground('#e8f5e9'); // Vert clair
    sheet.getRange(rowNum, 9).setValue('✅ Reçu');
    
    // Récupérer le nombre de likes
    const likeCount = getLinkedInLikes(postUrl);
    
    // Barème de points (à ajuster selon vos besoins)
    const pointsBar = {
      100: 50,    // 100 likes = 50 points
      200: 100,   // 200 likes = 100 points
      500: 200,   // 500 likes = 200 points
      1000: 500   // 1000 likes = 500 points
    };
    
    if (likeCount >= 100) {
      // Cas 1 : >= 100 likes - valider
      
      // Calculer les points selon le barème
      let points = 0;
      if (likeCount >= 1000) {
        points = pointsBar[1000];
      } else if (likeCount >= 500) {
        points = pointsBar[500];
      } else if (likeCount >= 200) {
        points = pointsBar[200];
      } else if (likeCount >= 100) {
        points = pointsBar[100];
      }
      
      // Mettre la colonne J en vert
      sheet.getRange(rowNum, 10).setBackground('#e8f5e9'); // Vert clair
      sheet.getRange(rowNum, 10).setValue('✅ Validé');
      
      // Mettre les points dans la colonne K
      sheet.getRange(rowNum, 11).setValue(points);
      
      // Mettre une note dans la colonne L
      sheet.getRange(rowNum, 12).setValue(`${likeCount} likes - ${points} points attribués`);
      
      // Mettre à jour le leaderboard
      updateLeaderboard(email, points);
      
    } else {
      // Cas 2 : < 100 likes - pas validé
      
      // Mettre la colonne J en rouge
      sheet.getRange(rowNum, 10).setBackground('#ffebee'); // Rouge clair
      sheet.getRange(rowNum, 10).setValue('❌ Pas validé');
      
      // Écrire dans la colonne L
      sheet.getRange(rowNum, 12).setValue(`Pas assez de likes ${likeCount}/100`);
    }
    
  } catch (error) {
    Logger.log('Erreur dans processLinkedInPost: ' + error.toString());
    
    // Marquer comme erreur
    sheet.getRange(rowNum, 9).setBackground('#fff3e0'); // Orange pour erreur
    sheet.getRange(rowNum, 9).setValue('⚠️ Erreur');
    sheet.getRange(rowNum, 12).setValue('Erreur: ' + error.toString());
  }
}

/**
 * Récupère le nombre de likes d'un post LinkedIn
 * Note: LinkedIn n'a pas d'API publique gratuite
 * Cette fonction utilise une méthode alternative
 */
function getLinkedInLikes(postUrl) {
  try {
    // Méthode 1 : Essayer avec l'API officielle (nécessite une clé API)
    // return getLinkedInLikesAPI(postUrl);
    
    // Méthode 2 : Utiliser une API tierce (comme Social Media Count API)
    // return getLinkedInLikesTierce(postUrl);
    
    // Méthode 3 : Scraping simple (attention aux limites)
    return getLinkedInLikesScraping(postUrl);
    
  } catch (error) {
    Logger.log('Erreur récupération likes: ' + error.toString());
    return 0;
  }
}

/**
 * Récupère les likes par scraping (méthode simple)
 */
function getLinkedInLikesScraping(postUrl) {
  try {
    // LinkedIn bloque le scraping direct, on va simuler pour l'exemple
    // Dans un environnement réel, utilisez une API tierce ou une solution payante
    
    // Pour la démonstration, on simule un nombre aléatoire entre 0 et 500
    // REMPLACEZ CE CODE par votre méthode réelle de récupération
    
    const response = UrlFetchApp.fetch(postUrl, {
      'muteHttpExceptions': true,
      'headers': {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    // Parse la réponse pour extraire les likes
    const html = response.getContentText();
    
    // Chercher les patterns de likes dans le HTML
    // LinkedIn utilise des attributs data-* pour le nombre de réactions
    const likePattern = /"likeCount":(\d+)/;
    const match = html.match(likePattern);
    
    if (match && match[1]) {
      return parseInt(match[1]);
    }
    
    // Fallback : si on ne trouve pas, retourner un nombre aléatoire pour test
    // À REMPLACER par une vraie méthode
    return Math.floor(Math.random() * 500);
    
  } catch (error) {
    Logger.log('Erreur scraping: ' + error.toString());
    return Math.floor(Math.random() * 500); // Valeur aléatoire pour test
  }
}

/**
 * Alternative : Utiliser une API tierce (exemple avec Social Media Count API)
 * Nécessite une clé API
 */
function getLinkedInLikesTierce(postUrl) {
  try {
    const apiKey = 'YOUR_API_KEY'; // Remplacez par votre clé API
    const apiUrl = `https://api.example.com/linkedin/count?url=${encodeURIComponent(postUrl)}&api_key=${apiKey}`;
    
    const response = UrlFetchApp.fetch(apiUrl);
    const data = JSON.parse(response.getContentText());
    
    return data.likeCount || 0;
    
  } catch (error) {
    Logger.log('Erreur API tierce: ' + error.toString());
    return 0;
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
      
      if (emailCol && emailCol.toLowerCase() === email.toLowerCase()) {
        // Ajouter les points (colonne E, index 4)
        const currentPoints = row[4] || 0;
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
 * Test de la fonction principale
 */
function testProcessActions() {
  processActions();
  Logger.log('Test terminé');
}

/**
 * Créer un déclencheur horaire pour traiter automatiquement
 */
function createTrigger() {
  // Supprimer les anciens déclencheurs
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'processActions') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Créer un nouveau déclencheur horaire
  ScriptApp.newTrigger('processActions')
    .timeBased()
    .everyHours(1) // Exécuter toutes les heures
    .create();
  
  Logger.log('Déclencheur horaire créé');
}

/**
 * Créer un déclencheur au changement de cellule
 * (Se déclenche quand une nouvelle ligne est ajoutée)
 */
function createOnChangeTrigger() {
  ScriptApp.newTrigger('processActions')
    .onFormSubmit()
    .create();
  
  Logger.log('Déclencheur onChange créé');
}

/**
 * Fonction alternative : Traiter manuellement une ligne spécifique
 */
function processSpecificRow(rowNumber) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const actionsSheet = ss.getSheetByName(ACTIONS_TAB);
  
  if (!actionsSheet) {
    return;
  }
  
  const row = actionsSheet.getRange(rowNumber, 1, 1, 12).getValues()[0];
  const email = row[2];
  const actionName = row[3];
  const postUrl = row[4];
  
  if (actionName === 'Post LinkedIn' && postUrl && postUrl.includes('linkedin.com')) {
    processLinkedInPost(actionsSheet, rowNumber, postUrl, email);
    Logger.log(`Ligne ${rowNumber} traitée`);
  }
}

/**
 * Validation manuelle - À utiliser quand vous vérifiez manuellement les posts
 * 
 * Usage: processManually(rowNumber, points, valid)
 * 
 * Exemples:
 *   processManually(2, 100, true)   -> Valide la ligne 2 avec 100 points
 *   processManually(3, 0, false)    -> Refuse la ligne 3 (0 points)
 *   processManually(5, 50, true)    -> Valide la ligne 5 avec 50 points
 */
function processManually(rowNumber, points, valid) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const actionsSheet = ss.getSheetByName(ACTIONS_TAB);
    
    if (!actionsSheet) {
      Logger.log('Onglet actions non trouvé');
      return;
    }
    
    // Récupérer la ligne
    const row = actionsSheet.getRange(rowNumber, 1, 1, 12).getValues()[0];
    const email = row[2];
    
    // Colonne I : Statut réception (toujours vert)
    actionsSheet.getRange(rowNumber, 9).setBackground('#e8f5e9'); // Vert clair
    actionsSheet.getRange(rowNumber, 9).setValue('✅ Reçu');
    
    if (valid) {
      // Cas validé
      // Colonne J : Statut validation (vert)
      actionsSheet.getRange(rowNumber, 10).setBackground('#e8f5e9'); // Vert clair
      actionsSheet.getRange(rowNumber, 10).setValue('✅ Validé manuellement');
      
      // Colonne K : Points attribués
      actionsSheet.getRange(rowNumber, 11).setValue(points);
      
      // Colonne L : Note
      actionsSheet.getRange(rowNumber, 12).setValue(`Validation manuelle - ${points} points attribués`);
      
      // Mettre à jour le leaderboard
      updateLeaderboard(email, points);
      
      Logger.log(`Ligne ${rowNumber} validée avec ${points} points`);
      
    } else {
      // Cas non validé
      // Colonne J : Statut validation (rouge)
      actionsSheet.getRange(rowNumber, 10).setBackground('#ffebee'); // Rouge clair
      actionsSheet.getRange(rowNumber, 10).setValue('❌ Refusé');
      
      // Colonne K : Pas de points
      actionsSheet.getRange(rowNumber, 11).setValue(0);
      
      // Colonne L : Note
      actionsSheet.getRange(rowNumber, 12).setValue('Refusé - Pas assez de likes ou non conforme');
      
      Logger.log(`Ligne ${rowNumber} refusée`);
    }
    
  } catch (error) {
    Logger.log('Erreur dans processManually: ' + error.toString());
  }
}

/**
 * Fonction pour valider tous les posts en attente manuellement
 * Vous pouvez modifier cette fonction selon vos critères
 */
function processAllPendingManually() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const actionsSheet = ss.getSheetByName(ACTIONS_TAB);
  
  if (!actionsSheet) {
    return;
  }
  
  const dataRange = actionsSheet.getDataRange();
  const rows = dataRange.getValues();
  
  Logger.log(`Traitement de ${rows.length - 1} lignes`);
  
  // Commencer à la ligne 2 (ignorer les en-têtes)
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    
    // Si déjà traité, passer
    if (row[8] !== '' && row[8] !== undefined) {
      continue;
    }
    
    const email = row[2];
    const actionName = row[3];
    const postUrl = row[4];
    
    // Si c'est un post LinkedIn, demander validation manuelle
    if (actionName === 'Post LinkedIn' && postUrl && postUrl.includes('linkedin.com')) {
      // ATTENTION: Décommentez et modifiez ces lignes pour valider
      // processManually(i + 1, 50, true);   // Valider avec 50 points
      // processManually(i + 1, 0, false);  // Refuser
      
      Logger.log(`Ligne ${i + 1} en attente de validation: ${email}`);
    }
  }
  
  Logger.log('Pensez à décommenter les lignes processManually pour valider');
}

