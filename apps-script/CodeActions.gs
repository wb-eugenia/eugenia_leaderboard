/**
 * Eugenia Challenge - Apps Script pour soumissions d'actions
 * 
 * Ce script gère les soumissions d'actions depuis le formulaire React
 * 
 * Setup Instructions:
 * 1. Créez un Google Sheet avec un onglet "actions"
 * 2. Configurez le SHEET_ID ci-dessous
 * 3. Déployez comme web app avec "Execute as: Me" et "Who has access: Anyone"
 * 4. Copiez l'URL du web app et mettez à jour dans src/components/ActionForm.jsx
 */

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // Remplacez par votre Google Sheet ID
const ACTIONS_TAB = 'actions';

/**
 * Gère les requêtes POST pour soumettre des actions
 */
function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const result = submitAction(postData);
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    const errorResult = { 
      success: false, 
      error: error.toString(),
      message: 'Erreur lors de la soumission'
    };
    
    return ContentService.createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Soumet une action dans l'onglet "actions"
 */
function submitAction(data) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(ACTIONS_TAB);
    
    // Créer l'onglet s'il n'existe pas
    if (!sheet) {
      sheet = ss.insertSheet(ACTIONS_TAB);
      
      // Définir les en-têtes (ligne 1)
      sheet.getRange(1, 1, 1, 10).setValues([[
        'Timestamp', 
        'Email', 
        'Type d\'action', 
        'Post URL', 
        'Date', 
        'Heure', 
        'Nom événement', 
        'Type événement', 
        'Nom association',
        'Détails JSON'
      ]]);
      
      // Formater les en-têtes
      sheet.getRange(1, 1, 1, 10).setFontWeight('bold');
      sheet.getRange(1, 1, 1, 10).setBackground('#667eea');
      sheet.getRange(1, 1, 1, 10).setFontColor('white');
      
      // Ajuster la largeur des colonnes
      sheet.setColumnWidth(1, 180); // Timestamp
      sheet.setColumnWidth(2, 200); // Email
      sheet.setColumnWidth(3, 150); // Type d'action
      sheet.setColumnWidth(10, 400); // Détails JSON
    }
    
    // Préparer les données pour la ligne
    const timestamp = new Date();
    const detailsJson = JSON.stringify(data);
    
    // Créer la ligne avec tous les champs possibles
    const row = [
      timestamp,                           // Colonne 1: Timestamp
      data.email || '',                    // Colonne 2: Email
      data.actionType || '',               // Colonne 3: Type d'action
      data.postUrl || '',                  // Colonne 4: URL du post LinkedIn
      data.date || '',                     // Colonne 5: Date JPO
      data.time || '',                     // Colonne 6: Heure JPO
      data.eventName || '',                // Colonne 7: Nom événement
      data.eventType || '',                // Colonne 8: Type événement
      data.associationName || '',           // Colonne 9: Nom association
      detailsJson                          // Colonne 10: Tous les détails en JSON
    ];
    
    // Ajouter la ligne à la feuille
    sheet.appendRow(row);
    
    // Appliquer un formatage conditionnel pour les couleurs selon le type d'action
    const lastRow = sheet.getLastRow();
    const actionType = data.actionType;
    
    let color = '#ffffff';
    switch (actionType) {
      case 'linkedin':
        color = '#0077b5';
        break;
      case 'jpo':
        color = '#4caf50';
        break;
      case 'hackathon':
        color = '#ff9800';
        break;
      case 'association':
        color = '#9c27b0';
        break;
    }
    
    // Appliquer la couleur à toute la ligne
    sheet.getRange(lastRow, 1, 1, 10).setBackground(color);
    
    Logger.log('Action soumise avec succès: ' + detailsJson);
    
    return { 
      success: true, 
      message: 'Votre action a été soumise avec succès ! Elle sera validée prochainement.',
      timestamp: timestamp.toISOString()
    };
    
  } catch (error) {
    Logger.log('Erreur lors de la soumission: ' + error.toString());
    return { 
      success: false, 
      error: error.toString(),
      message: 'Erreur lors de la soumission. Veuillez réessayer.'
    };
  }
}

/**
 * Fonction de test (optionnel, pour développement)
 */
function testSubmitAction() {
  const testData = {
    email: 'test@campus.fr',
    actionType: 'linkedin',
    postUrl: 'https://www.linkedin.com/posts/test',
    timestamp: new Date().toISOString()
  };
  
  const result = submitAction(testData);
  Logger.log('Résultat du test: ' + JSON.stringify(result));
}

/**
 * Test avec différentes actions
 */
function testAllActionTypes() {
  const testCases = [
    {
      email: 'etudiant1@campus.fr',
      actionType: 'linkedin',
      postUrl: 'https://www.linkedin.com/posts/test1'
    },
    {
      email: 'etudiant2@campus.fr',
      actionType: 'jpo',
      date: '2024-10-15',
      time: '14:00'
    },
    {
      email: 'etudiant3@campus.fr',
      actionType: 'hackathon',
      eventName: 'Hackathon Campus',
      eventType: 'Hackathon'
    },
    {
      email: 'etudiant4@campus.fr',
      actionType: 'association',
      associationName: 'BDE Campus'
    }
  ];
  
  testCases.forEach((testData, index) => {
    Logger.log(`Test ${index + 1}/${testCases.length}`);
    testData.timestamp = new Date().toISOString();
    const result = submitAction(testData);
    Logger.log(JSON.stringify(result));
  });
  
  Logger.log('Tous les tests terminés');
}

