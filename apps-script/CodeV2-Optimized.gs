/**
 * Eugenia Challenge V2 - Backend Apps Script OPTIMIZED
 * 
 * Optimizations:
 * 1. Cache via PropertiesService for leaderboard, config, actions
 * 2. Batch reads/writes for better performance
 * 3. Optimized duplicate detection
 * 4. Reduced sheet API calls
 * 
 * Endpoints:
 * GET: getLeaderboard, getActionsToValidate, getAllActions, getActionById, getConfig
 * POST: submitAction, validateAction, updateLeaderboard, saveConfig, updateLeaderboardUser, deleteLeaderboardUser
 */

const SHEET_ID = '1Ez2twfio9nCmkZhrB1jdTvchEh6XSVNjkdwQUF2IoLM';
const LEADERBOARD_TAB = 'leaderboard';
const ACTIONS_TAB = 'actions';
const CONFIG_TAB = 'config';

// Cache durations in seconds
const CACHE_DURATION = {
  LEADERBOARD: 60,    // 1 minute
  ACTIONS: 30,        // 30 seconds
  CONFIG: 300,        // 5 minutes
  USER_LOOKUP: 300    // 5 minutes
};

/**
 * Main GET handler
 */
function doGet(e) {
  const action = e.parameter.action;
  
  try {
    if (action === 'getLeaderboard') {
      return getLeaderboard();
    } else if (action === 'getActionsToValidate') {
      return getActionsToValidate();
    } else if (action === 'getAllActions') {
      return getAllActions();
    } else if (action === 'getActionById') {
      return getActionById(e.parameter.id);
    } else if (action === 'getConfig') {
      return getConfig();
    } else {
      return createJSONResponse({ error: 'Invalid action' });
    }
  } catch (error) {
    return createJSONResponse({ error: error.toString() });
  }
}

/**
 * Main POST handler
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === 'submitAction') {
      return createJSONResponse(submitAction(data));
    } else if (action === 'validateAction') {
      return createJSONResponse(validateAction(data));
    } else if (action === 'updateLeaderboard') {
      return createJSONResponse(updateLeaderboard(data));
    } else if (action === 'saveConfig') {
      return createJSONResponse(saveConfig(data));
    } else if (action === 'updateLeaderboardUser') {
      return createJSONResponse(updateLeaderboardUser(data));
    } else if (action === 'deleteLeaderboardUser') {
      return createJSONResponse(deleteLeaderboardUser(data));
    } else {
      return createJSONResponse({ success: false, error: 'Invalid action' });
    }
  } catch (error) {
    return createJSONResponse({ success: false, error: error.toString() });
  }
}

/**
 * OPTIMIZED: Get leaderboard with cache
 */
function getLeaderboard() {
  try {
    // Try cache first
    const cache = CacheService.getScriptCache();
    const cached = cache.get('leaderboard_data');
    
    if (cached) {
      Logger.log('✅ Cache HIT: leaderboard');
      return createJSONResponse(JSON.parse(cached));
    }
    
    // Cache miss - fetch from sheet
    Logger.log('❌ Cache MISS: leaderboard');
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(LEADERBOARD_TAB);
    
    if (!sheet) {
      return createJSONResponse([]);
    }
    
    // Batch read entire sheet in one call
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const rows = values.slice(1); // Skip header
    
    // Process data
    const users = rows
      .filter(row => row[0] && row[1])
      .map((row, index) => ({
        firstName: row[0] || '',
        lastName: row[1] || '',
        email: row[3] || '',
        classe: row[2] || '',
        totalPoints: parseInt(row[4]) || 0,
        actionsCount: parseInt(row[5]) || 0,
        lastUpdate: row[6] || ''
      }));
    
    // Sort by points descending
    const sorted = users.sort((a, b) => b.totalPoints - a.totalPoints);
    
    // Add rank with ex aequo handling
    let rank = 1;
    const leaderboard = sorted.map((user, index) => {
      if (index > 0 && user.totalPoints !== sorted[index - 1].totalPoints) {
        rank = index + 1;
      }
      return { ...user, rank };
    });
    
    // Cache for 60 seconds
    cache.put('leaderboard_data', JSON.stringify(leaderboard), CACHE_DURATION.LEADERBOARD);
    
    return createJSONResponse(leaderboard);
  } catch (error) {
    return createJSONResponse({ error: error.toString() });
  }
}

/**
 * OPTIMIZED: Submit action with optimized duplicate detection
 */
function submitAction(data) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(ACTIONS_TAB);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(ACTIONS_TAB);
      sheet.appendRow([
        'ID', 'Email', 'Type', 'Data', 'Status', 'SubmittedAt', 'ValidatedAt', 
        'ValidatedBy', 'Points', 'Notes', 'AutoValidated'
      ]);
      Logger.log('✅ Created actions sheet');
    }
    
    // OPTIMIZED: Only read status, email, type, data columns (not the full row)
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      // Read only relevant columns: ID, Email, Type, Data, Status
      const checkRange = sheet.getRange(2, 1, lastRow - 1, 5);
      const values = checkRange.getValues();
      
      // Check for duplicates
      const isDuplicate = values.some(row => {
        const existingEmail = row[1];
        const existingType = row[2];
        const existingData = parseJSON(row[3] || '{}');
        const existingStatus = row[4];
        
        const sameEmail = existingEmail && existingEmail.toString().toLowerCase() === data.email.toLowerCase();
        const sameType = existingType === data.type;
        
        let sameData = false;
        if (data.data && data.data.date && existingData.date) {
          sameData = data.data.date === existingData.date;
        }
        
        return sameEmail && sameType && sameData && 
               (existingStatus.toString().toLowerCase() === 'pending' || 
                existingStatus.toString().toLowerCase() === 'validated');
      });
      
      if (isDuplicate) {
        return { 
          success: false, 
          error: 'duplicate',
          message: 'Cette action a déjà été soumise. Veuillez soumettre une action différente.'
        };
      }
    }
    
    // Insert new action
    // Ordre des colonnes selon les en-têtes:
    // ID, Email, Type, Data, Status, SubmittedAt, ValidatedAt, ValidatedBy, Points, Notes, AutoValidated
    const id = 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    try {
      sheet.appendRow([
        id,                                    // 0: ID
        data.email,                           // 1: Email
        data.type,                            // 2: Type
        JSON.stringify(data.data || {}),       // 3: Data
        'pending',                            // 4: Status
        new Date().toISOString(),             // 5: SubmittedAt
        '',                                   // 6: ValidatedAt (vide pour l'instant)
        '',                                   // 7: ValidatedBy (vide pour l'instant)
        0,                                    // 8: Points (0 par défaut)
        '',                                   // 9: Notes/Comment (vide pour l'instant)
        ''                                    // 10: AutoValidated (vide pour l'instant)
      ]);
      
      Logger.log('✅ Action submitted: ' + id);
      Logger.log('Email: ' + data.email + ', Type: ' + data.type);
      
      // Invalidate all actions-related caches
      invalidateCache('actions_data');
      invalidateCache('actions_pending');
      invalidateCache('actions_all');
      
      return { success: true, actionId: id };
    } catch (writeError) {
      Logger.log('❌ Error writing to sheet: ' + writeError.toString());
      return { success: false, error: 'Write error: ' + writeError.toString() };
    }
  } catch (error) {
    Logger.log('❌ Error in submitAction: ' + error.toString());
    return { success: false, error: error.toString(), details: error.stack };
  }
}

/**
 * OPTIMIZED: Get actions to validate with cache
 */
function getActionsToValidate() {
  try {
    // Try cache
    const cache = CacheService.getScriptCache();
    const cached = cache.get('actions_pending');
    
    if (cached) {
      Logger.log('✅ Cache HIT: pending actions');
      return createJSONResponse(JSON.parse(cached));
    }
    
    // Cache miss
    Logger.log('❌ Cache MISS: pending actions');
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(ACTIONS_TAB);
    
    if (!sheet) {
      return createJSONResponse([]);
    }
    
    // Batch read
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const rows = values.slice(1);
    
    const pendingActions = rows
      .filter(row => row[4] && row[4].toString().toLowerCase() === 'pending')
      .map(row => ({
        id: row[0],                                    // ID
        email: row[1],                                // Email
        type: row[2],                                 // Type
        data: parseJSON(row[3] || '{}'),              // Data
        status: row[4],                               // Status (pending)
        date: row[5],                                 // SubmittedAt
        decision: row[4] || '',                       // Decision = Status (même colonne, "pending")
        points: parseInt(row[8]) || 0,                // Points (colonne 8)
        comment: row[9] || '',                        // Notes/Comment (colonne 9)
        validatedBy: row[7] || '',                    // ValidatedBy (colonne 7, vide si pending)
        validatedAt: row[6] || ''                      // ValidatedAt (colonne 6, vide si pending)
      }));
    
    // Cache for 30 seconds
    cache.put('actions_pending', JSON.stringify(pendingActions), CACHE_DURATION.ACTIONS);
    
    return createJSONResponse(pendingActions);
  } catch (error) {
    return createJSONResponse({ error: error.toString() });
  }
}

/**
 * OPTIMIZED: Get all actions with cache
 */
function getAllActions() {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get('actions_all');
    
    if (cached) {
      Logger.log('✅ Cache HIT: all actions');
      return createJSONResponse(JSON.parse(cached));
    }
    
    Logger.log('❌ Cache MISS: all actions');
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(ACTIONS_TAB);
    
    if (!sheet) {
      return createJSONResponse([]);
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const rows = values.slice(1);
    
    const allActions = rows
      .filter(row => row[0])
      .map(row => ({
        id: row[0],                                    // ID
        email: row[1],                                // Email
        type: row[2],                                 // Type
        data: parseJSON(row[3] || '{}'),              // Data
        status: row[4],                               // Status (pending/validated/rejected)
        date: row[5],                                 // SubmittedAt
        decision: row[4] || '',                      // Decision = Status (même colonne)
        points: parseInt(row[8]) || 0,               // Points (colonne 8)
        comment: row[9] || '',                        // Notes/Comment (colonne 9)
        validatedBy: row[7] || '',                    // ValidatedBy (colonne 7)
        validatedAt: row[6] || ''                     // ValidatedAt (colonne 6)
      }));
    
    cache.put('actions_all', JSON.stringify(allActions), CACHE_DURATION.ACTIONS);
    
    return createJSONResponse(allActions);
  } catch (error) {
    return createJSONResponse({ error: error.toString() });
  }
}

/**
 * OPTIMIZED: Get action by ID with targeted lookup
 */
function getActionById(actionId) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(ACTIONS_TAB);
    
    if (!sheet) {
      return createJSONResponse(null);
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return createJSONResponse(null);
    }
    
    // OPTIMIZED: Read only ID column first to find the row
    const idColumn = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    const rowIndex = idColumn.findIndex(row => row[0] === actionId);
    
    if (rowIndex === -1) {
      return createJSONResponse(null);
    }
    
    // OPTIMIZED: Read only that specific row
    const actualRow = rowIndex + 2;
    const row = sheet.getRange(actualRow, 1, 1, 11).getValues()[0];
    
    const action = {
      id: row[0],                                    // ID
      email: row[1],                                // Email
      type: row[2],                                 // Type
      data: parseJSON(row[3] || '{}'),              // Data
      status: row[4],                               // Status (pending/validated/rejected)
      date: row[5],                                 // SubmittedAt
      decision: row[4] || '',                       // Decision = Status (même colonne)
      points: parseInt(row[8]) || 0,               // Points (colonne 8)
      comment: row[9] || '',                        // Notes/Comment (colonne 9)
      validatedBy: row[7] || '',                    // ValidatedBy (colonne 7)
      validatedAt: row[6] || ''                     // ValidatedAt (colonne 6)
    };
    
    return createJSONResponse(action);
  } catch (error) {
    return createJSONResponse({ error: error.toString() });
  }
}

/**
 * OPTIMIZED: Validate action with batch update
 */
function validateAction(data) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(ACTIONS_TAB);
    
    if (!sheet) {
      return { success: false, error: 'Actions sheet not found' };
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return { success: false, error: 'Action not found' };
    }
    
    // OPTIMIZED: Read ID and email columns only to find the row
    const idColumn = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
    const rowIndex = idColumn.findIndex(row => row[0] === data.actionId);
    
    if (rowIndex === -1) {
      return { success: false, error: 'Action not found' };
    }
    
    const actualRow = rowIndex + 2;
    const email = idColumn[rowIndex][1];
    
    // OPTIMIZED: Batch update selon l'ordre des colonnes:
    // ID, Email, Type, Data, Status, SubmittedAt, ValidatedAt, ValidatedBy, Points, Notes, AutoValidated
    // Mise à jour des colonnes 5 (Status), 7 (ValidatedAt), 8 (ValidatedBy), 9 (Points), 10 (Notes)
    sheet.getRange(actualRow, 5).setValue(data.decision); // Status (colonne 5)
    sheet.getRange(actualRow, 7).setValue(new Date().toISOString()); // ValidatedAt (colonne 7)
    sheet.getRange(actualRow, 8).setValue(data.validatedBy || 'Admin'); // ValidatedBy (colonne 8)
    sheet.getRange(actualRow, 9).setValue(data.points || 0); // Points (colonne 9)
    sheet.getRange(actualRow, 10).setValue(data.comment || ''); // Notes/Comment (colonne 10)
    // AutoValidated (colonne 11) reste vide ou peut être mis à jour si nécessaire
    
    // If validated, update leaderboard
    if (data.decision === 'validated') {
      const points = data.points || 0;
      updateLeaderboardInternal(email, points);
    }
    
    // Invalidate caches
    invalidateCache('actions_data');
    invalidateCache('actions_pending');
    invalidateCache('actions_all');
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Update leaderboard manually
 */
function updateLeaderboard(data) {
  try {
    return updateLeaderboardInternal(data.email, data.points);
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * OPTIMIZED: Internal leaderboard update with batch operations
 */
function updateLeaderboardInternal(email, points) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(LEADERBOARD_TAB);
    
    if (!sheet) {
      return { success: false, error: 'Leaderboard sheet not found' };
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return { success: false, error: 'No users in leaderboard' };
    }
    
    // OPTIMIZED: Read only email column to find user
    const emailColumn = sheet.getRange(2, 4, lastRow - 1, 1).getValues();
    const userRowIndex = emailColumn.findIndex(row => row[0] === email);
    
    if (userRowIndex >= 0) {
      // User exists - batch update
      const actualRow = userRowIndex + 2;
      
      // Read current values
      const currentRange = sheet.getRange(actualRow, 5, 1, 3);
      const currentValues = currentRange.getValues()[0];
      
      const currentPoints = parseInt(currentValues[0]) || 0;
      const currentActions = parseInt(currentValues[1]) || 0;
      
      // OPTIMIZED: Update all 3 columns in one call
      currentRange.setValues([[
        currentPoints + points,
        currentActions + 1,
        new Date().toISOString()
      ]]);
      
      // Invalidate cache
      invalidateCache('leaderboard_data');
      
      return { success: true };
    } else {
      // New user
      const emailParts = email.split('@')[0].split('.');
      const firstName = emailParts[0] || 'User';
      const lastName = emailParts[1] || '';
      
      sheet.appendRow([
        firstName,
        lastName,
        '',
        email,
        points,
        1,
        new Date().toISOString()
      ]);
      
      invalidateCache('leaderboard_data');
      
      return { success: true };
    }
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * OPTIMIZED: Update leaderboard user with batch update
 */
function updateLeaderboardUser(data) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(LEADERBOARD_TAB);
    
    if (!sheet) {
      return { success: false, error: 'Leaderboard sheet not found' };
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return { success: false, error: 'No users in leaderboard' };
    }
    
    // OPTIMIZED: Read only email column
    const emailColumn = sheet.getRange(2, 4, lastRow - 1, 1).getValues();
    const userRowIndex = emailColumn.findIndex(row => row[0] === data.email);
    
    if (userRowIndex >= 0) {
      // Update existing user - batch write
      const actualRow = userRowIndex + 2;
      
      // OPTIMIZED: Update first 3 columns in one call
      sheet.getRange(actualRow, 1, 1, 3).setValues([[
        data.firstName || '',
        data.lastName || '',
        data.classe || ''
      ]]);
      
      // Update points and actions
      sheet.getRange(actualRow, 5, 1, 3).setValues([[
        data.totalPoints || 0,
        data.actionsCount || 0,
        new Date().toISOString()
      ]]);
      
      invalidateCache('leaderboard_data');
      
      return { success: true };
    } else {
      // New user
      sheet.appendRow([
        data.firstName || '',
        data.lastName || '',
        data.classe || '',
        data.email,
        data.totalPoints || 0,
        data.actionsCount || 0,
        new Date().toISOString()
      ]);
      
      invalidateCache('leaderboard_data');
      
      return { success: true };
    }
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Delete leaderboard user
 */
function deleteLeaderboardUser(data) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(LEADERBOARD_TAB);
    
    if (!sheet) {
      return { success: false, error: 'Leaderboard sheet not found' };
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return { success: false, error: 'No users in leaderboard' };
    }
    
    // OPTIMIZED: Read only email column
    const emailColumn = sheet.getRange(2, 4, lastRow - 1, 1).getValues();
    const userRowIndex = emailColumn.findIndex(row => row[0] === data.email);
    
    if (userRowIndex >= 0) {
      const actualRow = userRowIndex + 2;
      sheet.deleteRow(actualRow);
      
      invalidateCache('leaderboard_data');
      
      return { success: true };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * OPTIMIZED: Get configuration with cache
 */
function getConfig() {
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get('config_data');
    
    if (cached) {
      Logger.log('✅ Cache HIT: config');
      return createJSONResponse(JSON.parse(cached));
    }
    
    Logger.log('❌ Cache MISS: config');
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(CONFIG_TAB);
    
    if (!sheet) {
      return createJSONResponse({});
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    const config = {};
    for (let i = 1; i < values.length; i++) {
      const key = values[i][0];
      const value = values[i][1];
      if (key && value) {
        try {
          config[key] = JSON.parse(value);
        } catch (e) {
          config[key] = value;
        }
      }
    }
    
    // Cache for 5 minutes
    cache.put('config_data', JSON.stringify(config), CACHE_DURATION.CONFIG);
    
    return createJSONResponse(config);
  } catch (error) {
    return createJSONResponse({ error: error.toString() });
  }
}

/**
 * OPTIMIZED: Save configuration with cache invalidation
 */
function saveConfig(data) {
  try {
    Logger.log('💾 saveConfig called with ' + Object.keys(data.config || {}).length + ' keys');
    
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(CONFIG_TAB);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG_TAB);
      sheet.appendRow(['Key', 'Value']);
      Logger.log('✅ Created config sheet');
    }
    
    // OPTIMIZED: Batch delete and batch write
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }
    
    // Prepare batch write
    const configEntries = [];
    for (const key in data.config) {
      const value = typeof data.config[key] === 'string' 
        ? data.config[key] 
        : JSON.stringify(data.config[key]);
      configEntries.push([key, value]);
      Logger.log('  - Config key: ' + key + ' (length: ' + value.length + ')');
    }
    
    // OPTIMIZED: Write all rows at once
    if (configEntries.length > 0) {
      try {
        sheet.getRange(2, 1, configEntries.length, 2).setValues(configEntries);
        Logger.log('✅ Config saved: ' + configEntries.length + ' entries written');
      } catch (writeError) {
        Logger.log('❌ Error writing config: ' + writeError.toString());
        return { success: false, error: 'Write error: ' + writeError.toString() };
      }
    } else {
      Logger.log('⚠️ No config entries to write');
      return { success: false, error: 'No config data provided' };
    }
    
    // Invalidate cache
    invalidateCache('config_data');
    
    return { success: true, saved: configEntries.length };
  } catch (error) {
    Logger.log('❌ Error in saveConfig: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    return { success: false, error: error.toString(), details: error.stack };
  }
}

/**
 * Helper: Invalidate specific cache entries
 */
function invalidateCache(prefix) {
  const cache = CacheService.getScriptCache();
  
  // Invalidate related cache keys
  const keys = [
    prefix,
    'leaderboard_data',
    'actions_data',
    'actions_pending',
    'actions_all',
    'config_data'
  ];
  
  keys.forEach(key => cache.remove(key));
}

/**
 * Helper: Create JSON response
 */
function createJSONResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper: Parse JSON safely
 */
function parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return {};
  }
}

/**
 * Setup Google Sheets (create all required tabs)
 * Run this function once to initialize the Google Sheets structure
 */
function setupGoogleSheets() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    
    let sheet = ss.getSheetByName(LEADERBOARD_TAB);
    if (!sheet) {
      sheet = ss.insertSheet(LEADERBOARD_TAB);
      sheet.appendRow(['Prénom', 'Nom', 'Classe', 'Email', 'Points', 'Actions', 'LastUpdate']);
      Logger.log(`Onglet '${LEADERBOARD_TAB}' créé`);
    }
    
    sheet = ss.getSheetByName(ACTIONS_TAB);
    if (!sheet) {
      sheet = ss.insertSheet(ACTIONS_TAB);
      sheet.appendRow([
        'ID', 'Email', 'Type', 'Data', 'Status', 'SubmittedAt', 'ValidatedAt', 
        'ValidatedBy', 'Points', 'Notes', 'AutoValidated'
      ]);
      Logger.log(`Onglet '${ACTIONS_TAB}' créé`);
    }
    
    sheet = ss.getSheetByName(CONFIG_TAB);
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG_TAB);
      sheet.appendRow(['Key', 'Value']);
      Logger.log(`Onglet '${CONFIG_TAB}' créé`);
    }
    
    Logger.log('✅ Setup terminé : tous les onglets sont créés !');
    return 'Setup terminé : tous les onglets sont créés !';
  } catch (error) {
    Logger.log('Erreur setup : ' + error.toString());
    return 'Erreur : ' + error.toString();
  }
}

/**
 * Import students (utility function - run manually in Apps Script)
 */
function importStudents() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(LEADERBOARD_TAB);
  
  if (!sheet) {
    sheet = ss.insertSheet(LEADERBOARD_TAB);
    sheet.appendRow(['Prénom', 'Nom', 'Classe', 'Email', 'Points', 'Actions', 'LastUpdate']);
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 7).clearContent();
  }
  
  const students = [
    ['Orehn', 'Ansellem', 'B1', 'oansellem@eugeniaschool.com', 0, 0, ''],
    ['Corentin', 'Ballonad', 'B1', 'cballonad@eugeniaschool.com', 0, 0, ''],
    ['Walid', 'Bouzidane', 'B1', 'wbouzidane@eugeniaschool.com', 0, 0, ''],
    ['Clément', 'Cochod', 'B1', 'ccochod@eugeniaschool.com', 0, 0, ''],
    ['Marc', 'Coulibaly', 'B1', 'mcoulibaly@eugeniaschool.com', 0, 0, ''],
    ['Bruno', 'Da Silva Lopez', 'B1', 'bdasilvalopez@eugeniaschool.com', 0, 0, ''],
    ['Gaspard', 'Debuigne', 'B1', 'gdebuigne@eugeniaschool.com', 0, 0, ''],
    ['Gaspard', 'Des champs de boishebert', 'B1', 'gdeschampsdeboishebert@eugeniaschool.com', 0, 0, ''],
    ['Amaury', 'Despretz', 'B1', 'adespretz@eugeniaschool.com', 0, 0, ''],
    ['Maxim', 'Duprat', 'B1', 'mduprat@eugeniaschool.com', 0, 0, ''],
    ['Jules', 'Espy', 'B1', 'jespy@eugeniaschool.com', 0, 0, ''],
    ['Abir', 'Essaidi', 'B1', 'aessaidi@eugeniaschool.com', 0, 0, ''],
    ['Léna', 'Fitoussi', 'B1', 'lfitoussi@eugeniaschool.com', 0, 0, ''],
    ['Marvyn', 'Frederick Salva', 'B1', 'mfredericksalva@eugeniaschool.com', 0, 0, ''],
    ['Hector', 'Lebrun', 'B1', 'hlebrun@eugeniaschool.com', 0, 0, ''],
    ['Léon', 'Le Calvez', 'B1', 'llecalvez@eugeniaschool.com', 0, 0, ''],
    ['Louise', 'Lehmann', 'B1', 'llehmann@eugeniaschool.com', 0, 0, ''],
    ['Paul', 'Marlin', 'B1', 'pmarlin@eugeniaschool.com', 0, 0, ''],
    ['Alexandre', 'Mc Namara', 'B1', 'amcnamara@eugeniaschool.com', 0, 0, ''],
    ['William', 'Nehar', 'B1', 'wnehar@eugeniaschool.com', 0, 0, ''],
    ['César', 'Primet', 'B1', 'cprimet@eugeniaschool.com', 0, 0, ''],
    ['Emilie', 'Flore Tata', 'B1', 'efloretata@eugeniaschool.com', 0, 0, ''],
    ['Elyot', 'Trubert', 'B1', 'etrubert@eugeniaschool.com', 0, 0, ''],
    ['Erwan', 'Zaouaoui', 'B1', 'ezaouaoui@eugeniaschool.com', 0, 0, ''],
    ['Alexandre', 'DE CARBONNIERES', 'B2', 'adecarbonnieres@eugeniaschool.com', 0, 0, ''],
    ['Enzo', 'PAROISSIEN', 'B2', 'eparoissien@eugeniaschool.com', 0, 0, ''],
    ['Nicolas', 'SHAHATA', 'B2', 'nshahata@eugeniaschool.com', 0, 0, ''],
    ['Antoine', 'MILLOT', 'B2', 'amillot@eugeniaschool.com', 0, 0, ''],
    ['Jonas', 'LAVIGNE', 'B2', 'jlavigne@eugeniaschool.com', 0, 0, ''],
    ['Raphaël', 'LASCAR', 'B2', 'rlascar@eugeniaschool.com', 0, 0, ''],
    ['Tara', 'MENELECK', 'B2', 'tmeneleck@eugeniaschool.com', 0, 0, ''],
    ['Jennie', 'ANSELLEM', 'B2', 'jansellem@eugeniaschool.com', 0, 0, ''],
    ['Samuel', 'ZAOUI', 'B2', 'szaoui@eugeniaschool.com', 0, 0, ''],
    ['Alexandre', 'PALMER', 'B2', 'apalmer@eugeniaschool.com', 0, 0, ''],
    ['Agathe', 'JOSSERAND', 'B2', 'ajosserand@eugeniaschool.com', 0, 0, '']
  ];
  
  sheet.getRange(2, 1, students.length, 7).setValues(students);
  
  Logger.log(`${students.length} étudiants importés avec succès !`);
  
  // Clear cache
  invalidateCache('leaderboard_data');
  
  return students.length;
}


