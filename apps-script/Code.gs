/**
 * Eugenia Challenge - Apps Script Backend
 * 
 * This script provides two endpoints:
 * GET: Fetch leaderboard from Google Sheet
 * POST: Submit action to Google Sheet
 * 
 * Setup Instructions:
 * 1. Create a Google Sheet with two tabs: "leaderboard" and "actions"
 * 2. Deploy as web app with "Execute as: Me" and "Who has access: Anyone"
 * 3. Copy the web app URL and update the APP_SCRIPT_URL in src/App.jsx
 */

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // Replace with your Google Sheet ID
const LEADERBOARD_TAB = 'leaderboard';
const ACTIONS_TAB = 'actions';
const FORM_CONFIG_TAB = 'FormConfig';

/**
 * Handle HTTP GET and POST requests
 */
function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getLeaderboard') {
    return getLeaderboard();
  } else if (action === 'getFormConfig') {
    return getFormConfig();
  } else if (action === 'getActionsToValidate') {
    return getActionsToValidate();
  } else if (action === 'getAllActions') {
    return getAllActions();
  } else if (action === 'getActionById') {
    const id = e.parameter.id;
    return getActionById(id);
  } else {
    return ContentService.createTextOutput('Invalid action').setMimeType(ContentService.MimeType.TEXT);
  }
}

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
 * Get leaderboard data from the leaderboard tab
 */
function getLeaderboard() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(LEADERBOARD_TAB);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Leaderboard tab not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Skip header row (row 1) - start from row 2
    const rows = values.slice(1);
    
    // Column indices: A=0 (prénom), B=1 (nom), C=2 (classe), D=3 (mail), E=4 (points)
    const leaderboard = rows
      .map((row, index) => {
        const prenom = row[0] || ''; // Colonne A
        const nom = row[1] || ''; // Colonne B
        const classe = row[2] || ''; // Colonne C
        const mail = row[3] || ''; // Colonne D
        const points = parseInt(row[4]) || 0; // Colonne E
        
        return {
          name: `${prenom} ${nom}`.trim(),
          classe: classe,
          points: points,
          mail: mail
        };
      })
      .filter(row => row.name) // Filter out empty rows
      .sort((a, b) => b.points - a.points) // Sort by points descending
      .map((row, index) => ({
        ...row,
        rank: index + 1 // Add rank after sorting
      }));
    
    return ContentService.createTextOutput(JSON.stringify(leaderboard))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get form configuration from FormConfig tab
 */
function getFormConfig() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(FORM_CONFIG_TAB);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({categories: {}}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    if (values.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({categories: {}}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const rows = values.slice(1);
    const config = {categories: {}};
    
    // Colonnes: A=Category, B=SubCategory, C=Label, D=Emoji, E=Field Type, 
    // F=Field Name, G=Field Label, H=Required, I=Placeholder, J=Default, 
    // K=Validation, L=Options, M=Column Mapping, N=Display Order, O=Active, P=Points
    
    rows.forEach((row) => {
      if (!row[0] || row[0].toString().trim() === '' || 
          (row[14] && row[14].toString().toUpperCase() !== 'TRUE')) {
        return;
      }
      
      const category = row[0].toString().trim();
      const subCategory = row[1].toString().trim();
      const label = row[2].toString().trim();
      const emoji = row[3] ? row[3].toString().trim() : '';
      const fieldType = row[4] ? row[4].toString().trim().toLowerCase() : 'text';
      const fieldName = row[5] ? row[5].toString().trim() : '';
      const fieldLabel = row[6] ? row[6].toString().trim() : '';
      const required = row[7] && row[7].toString().toUpperCase() === 'TRUE';
      const placeholder = row[8] ? row[8].toString().trim() : '';
      const defaultValue = row[9] ? row[9].toString().trim() : '';
      const validation = row[10] ? row[10].toString().trim().toLowerCase() : 'none';
      const options = row[11] ? row[11].toString().trim() : '';
      const columnMapping = row[12] ? row[12].toString().trim() : '';
      const displayOrder = row[13] ? parseInt(row[13]) : 999;
      const points = row[15] ? parseInt(row[15]) : 0;
      
      if (!config.categories[category]) {
        config.categories[category] = {
          label: category,
          subTypes: {},
          displayOrder: displayOrder
        };
      }
      
      if (!config.categories[category].subTypes[subCategory]) {
        config.categories[category].subTypes[subCategory] = {
          label: label,
          emoji: emoji,
          fields: [],
          columnMapping: columnMapping,
          points: points
        };
      }
      
      const field = {
        type: fieldType,
        name: fieldName,
        label: fieldLabel,
        required: required,
        placeholder: placeholder,
        default: defaultValue,
        validation: validation,
        options: options ? options.split(',').map(opt => opt.trim()) : []
      };
      
      config.categories[category].subTypes[subCategory].fields.push(field);
    });
    
    return ContentService.createTextOutput(JSON.stringify(config))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log('Error loading form config: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({categories: {}}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Load form configuration and return mapping for a subType
 */
function loadFormConfigForSubType(subType) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const configSheet = ss.getSheetByName(FORM_CONFIG_TAB);
    
    if (!configSheet) {
      return null;
    }
    
    const configRange = configSheet.getDataRange();
    const values = configRange.getValues();
    
    if (values.length <= 1) {
      return null;
    }
    
    const rows = values.slice(1);
    
    // Collect all fields for this subType
    const fields = [];
    let label = '';
    let emoji = '';
    let category = '';
    
    rows.forEach((row) => {
      const rowSubType = row[1] ? row[1].toString().trim() : '';
      if (rowSubType === subType && row[0] && row[14] && row[14].toString().toUpperCase() === 'TRUE') {
        // Get label and emoji from the first occurrence
        if (!label) {
          label = row[2].toString().trim();
          emoji = row[3] ? row[3].toString().trim() : '';
          category = row[0].toString().trim();
        }
        
        fields.push({
          type: row[4] ? row[4].toString().trim().toLowerCase() : 'text',
          name: row[5] ? row[5].toString().trim() : '',
          label: row[6] ? row[6].toString().trim() : '',
          required: row[7] && row[7].toString().toUpperCase() === 'TRUE',
          placeholder: row[8] ? row[8].toString().trim() : '',
          defaultValue: row[9] ? row[9].toString().trim() : '',
          validation: row[10] ? row[10].toString().trim().toLowerCase() : 'none',
          options: row[11] ? row[11].toString().trim() : '',
          columnMapping: row[12] ? row[12].toString().trim() : ''
        });
      }
    });
    
    if (fields.length > 0) {
      return {
        category: category,
        subType: subType,
        label: label,
        emoji: emoji,
        fields: fields
      };
    }
    
    return null;
    
  } catch (error) {
    Logger.log('Error loading form config for subType: ' + error.toString());
    return null;
  }
}

/**
 * Convert column letter to index (A=1, B=2, etc.)
 */
function getColumnIndex(columnLetter) {
  return columnLetter.charCodeAt(0) - 64;
}

/**
 * Submit action to the actions tab
 */
function submitAction(data) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(ACTIONS_TAB);
    
    // Structure des colonnes :
    // Colonne A : laisser vide (formule XLOOKUP prénom)
    // Colonne B : laisser vide (formule XLOOKUP nom)
    // Colonne C : mail
    // Colonne D : nom de l'action
    // Colonne E : lien si disponible (ou autre champ selon config)
    // Colonne F : date si disponible (ou autre champ selon config)
    // Colonne G : lieu si disponible (ou autre champ selon config)
    // Colonne H : notes/commentaire
    // Colonne I : rouge (validation)
    
    const category = data.category || '';
    const subType = data.subType || data.actionType || '';
    
    // Charger la configuration pour ce subType
    const config = loadFormConfigForSubType(subType);
    
    let actionName = '';
    let link = '';
    let dateStr = '';
    let lieu = '';
    
    // Si configuration dynamique trouvée, utiliser les mappings
    if (config && config.fields && config.fields.length > 0) {
      // Récupérer le label depuis la première ligne de config
      actionName = config.label || subType;
      
      // Mapper les données selon les colonnes définies dans la config
      config.fields.forEach((field) => {
        const value = data[field.name] || '';
        const colLetter = field.columnMapping;
        
        if (colLetter) {
          const colIndex = getColumnIndex(colLetter);
          // Colonne E, F, G, H correspondent aux indices 5, 6, 7, 8
          if (colIndex === 5) link = value;
          else if (colIndex === 6) dateStr = value;
          else if (colIndex === 7) lieu = value;
        }
      });
      
    } else {
      // Fallback vers l'ancienne logique hardcodée
      const subTypeLabels = {
        'linkedin': 'Post LinkedIn',
        'salon-1j': 'Salon (1 journée)',
        'jpo': 'JPO',
        'forum-lycee': 'Forum Lycée',
        'salon-demi': 'Salon 1/2 journée',
        'hackathon': 'Hackathon',
        'lead-salon': 'Lead Salon',
        'bdd': 'BDD',
        'creation-asso': 'Création Asso',
        'creation-event': 'Création Événement',
        'contact-interessant': 'Contact Intéressant'
      };
      
      actionName = subTypeLabels[subType] || subType || 'Action';
      
      if (category === 'linkedin' || subType === 'linkedin') {
        link = data.link || data.postUrl || '';
      }
      
      if (data.date) {
        dateStr = data.date;
        if (data.time) {
          dateStr += ' ' + data.time;
        }
      }
      
      if (category === 'autre' && data.nom) {
        lieu = data.nom;
      } else if (data.eventName) {
        lieu = data.eventName;
      }
    }
    
    // Trouver la première ligne vide en vérifiant uniquement la colonne C (email)
    // La colonne C est la clé : si elle est vide, on peut écrire dans cette ligne
    const dataRange = sheet.getDataRange();
    const maxRows = Math.max(dataRange.getLastRow(), 100); // Chercher au moins jusqu'à la ligne 100
    
    let nextRow = maxRows + 1; // Par défaut, après la dernière ligne
    
    // Parcourir de haut en bas (depuis la ligne 2) pour trouver la première ligne vide dans la colonne C
    for (let i = 2; i <= maxRows; i++) {
      const emailCell = sheet.getRange(i, 3).getValue(); // Colonne C (email)
      
      if (!emailCell || emailCell.toString().trim() === '') {
        // Cette ligne est vide dans la colonne C, on peut l'utiliser
        nextRow = i;
        break;
      }
    }
    
    // Créer la ligne avec les données (sans formules d'abord)
    const row = [
      '',                              // Colonne A : sera remplie par la formule
      '',                              // Colonne B : sera remplie par la formule
      data.email || '',                // Colonne C : mail
      actionName,                      // Colonne D : nom de l'action
      link,                            // Colonne E : lien
      dateStr,                         // Colonne F : date
      lieu,                            // Colonne G : lieu
      data.notes || '',                // Colonne H : notes
      ''                               // Colonne I : vide (sera colorée en rouge)
    ];
    
    // Ajouter la ligne à la position trouvée
    sheet.getRange(nextRow, 1, 1, 9).setValues([row]);
    
    // Ajouter les formules XLOOKUP dans les colonnes A et B
    sheet.getRange(nextRow, 1).setFormula(`=XLOOKUP(C${nextRow},Leaderboard!$D$2:$D,Leaderboard!$A$2:$A)`);
    sheet.getRange(nextRow, 2).setFormula(`=XLOOKUP(C${nextRow},Leaderboard!$D$2:$D,Leaderboard!$B$2:$B)`);
    
    // Colorier uniquement la colonne I en rouge (pas de couleurs sur les lignes)
    sheet.getRange(nextRow, 9, 1, 1).setBackground('#ffebee'); // Rouge clair
    
    Logger.log('Action submitted successfully: ' + JSON.stringify(data));
    
    return { 
      success: true, 
      message: 'Votre action a été soumise avec succès ! Elle sera validée prochainement.',
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    Logger.log('Error submitting action: ' + error.toString());
    return { 
      success: false, 
      error: error.toString(),
      message: 'Erreur lors de la soumission. Veuillez réessayer.'
    };
  }
}

/**
 * Get all pending actions for admin validation
 */
function getActionsToValidate() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(ACTIONS_TAB);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const rows = values.slice(1); // Skip header
    
    // Get actions with status="pending"
    const pendingActions = rows
      .map((row, index) => {
        if (row[4] && row[4].toString().toLowerCase() === 'pending') {
          return {
            id: row[0] || '',
            email: row[1] || '',
            type: row[2] || '',
            data: row[3] || '{}',
            date: row[5] || '',
            status: row[4] || '',
            decision: row[6] || '',
            points: row[7] || 0,
            comment: row[8] || ''
          };
        }
        return null;
      })
      .filter(action => action !== null);
    
    return ContentService.createTextOutput(JSON.stringify(pendingActions))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get all actions (admin view)
 */
function getAllActions() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(ACTIONS_TAB);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const rows = values.slice(1); // Skip header
    
    const allActions = rows.map((row, index) => ({
      id: row[0] || '',
      email: row[1] || '',
      type: row[2] || '',
      data: row[3] || '{}',
      date: row[5] || '',
      status: row[4] || '',
      decision: row[6] || '',
      points: row[7] || 0,
      comment: row[8] || ''
    }));
    
    return ContentService.createTextOutput(JSON.stringify(allActions))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get a specific action by ID
 */
function getActionById(id) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(ACTIONS_TAB);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Actions tab not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const rows = values.slice(1); // Skip header
    
    // Find action by ID (column A)
    const foundRow = rows.find(row => row[0] === id);
    
    if (!foundRow) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'Action not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const action = {
      id: foundRow[0] || '',
      email: foundRow[1] || '',
      type: foundRow[2] || '',
      data: foundRow[3] || '{}',
      date: foundRow[5] || '',
      status: foundRow[4] || '',
      decision: foundRow[6] || '',
      points: foundRow[7] || 0,
      comment: foundRow[8] || '',
      validatedBy: foundRow[9] || '',
      validatedAt: foundRow[10] || ''
    };
    
    return ContentService.createTextOutput(JSON.stringify(action))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function (optional, for development)
 */
function testGetLeaderboard() {
  const result = getLeaderboard();
  Logger.log(result.getContent());
}

function testSubmitAction() {
  const testData = {
    email: 'test@campus.fr',
    actionType: 'linkedin',
    postUrl: 'https://www.linkedin.com/posts/test',
    timestamp: new Date().toISOString()
  };
  
  submitAction(testData);
  Logger.log('Test action submitted');
}

