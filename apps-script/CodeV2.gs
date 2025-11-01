/**
 * Eugenia Challenge V2 - Backend Apps Script
 * 
 * Endpoints:
 * GET: getLeaderboard, getActionsToValidate, getAllActions, getActionById
 * POST: submitAction, validateAction, updateLeaderboard
 */

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // À remplacer
const LEADERBOARD_TAB = 'leaderboard';
const ACTIONS_TAB = 'actions';

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
    } else {
      return createJSONResponse({ success: false, error: 'Invalid action' });
    }
  } catch (error) {
    return createJSONResponse({ success: false, error: error.toString() });
  }
}

/**
 * Get leaderboard
 */
function getLeaderboard() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(LEADERBOARD_TAB);
    
    if (!sheet) {
      return createJSONResponse([]);
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const rows = values.slice(1); // Skip header
    
    const users = rows
      .filter(row => row[0] && row[1]) // Filter empty rows
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
      // If not first and points different from previous, increase rank
      if (index > 0 && user.totalPoints !== sorted[index - 1].totalPoints) {
        rank = index + 1;
      }
      return { ...user, rank };
    });
    
    return createJSONResponse(leaderboard);
  } catch (error) {
    return createJSONResponse({ error: error.toString() });
  }
}

/**
 * Submit action
 */
function submitAction(data) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(ACTIONS_TAB);
    
    if (!sheet) {
      return { success: false, error: 'Actions sheet not found' };
    }
    
    // Check for duplicates
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const rows = values.slice(1); // Skip header
    
    // Look for existing pending or validated action with same email and type
    const isDuplicate = rows.some(row => {
      const existingEmail = row[1];
      const existingType = row[2];
      const existingData = parseJSON(row[3] || '{}');
      const existingStatus = row[4];
      
      // Check if same email, same type, and same data
      const sameEmail = existingEmail && existingEmail.toString().toLowerCase() === data.email.toLowerCase();
      const sameType = existingType === data.type;
      
      // For date-based actions (events), check if it's the same date
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
    
    const nextRow = sheet.getLastRow() + 1;
    const id = 'act_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    sheet.appendRow([
      id,
      data.email,
      data.type,
      JSON.stringify(data.data || {}),
      'pending',
      new Date().toISOString(),
      '',
      0,
      '',
      '',
      ''
    ]);
    
    return { success: true, actionId: id };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Get actions to validate
 */
function getActionsToValidate() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(ACTIONS_TAB);
    
    if (!sheet) {
      return createJSONResponse([]);
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const rows = values.slice(1); // Skip header
    
    const pendingActions = rows
      .filter(row => row[4] && row[4].toString().toLowerCase() === 'pending')
      .map(row => ({
        id: row[0],
        email: row[1],
        type: row[2],
        data: parseJSON(row[3] || '{}'),
        status: row[4],
        date: row[5],
        decision: row[6],
        points: row[7],
        comment: row[8],
        validatedBy: row[9],
        validatedAt: row[10]
      }));
    
    return createJSONResponse(pendingActions);
  } catch (error) {
    return createJSONResponse({ error: error.toString() });
  }
}

/**
 * Get all actions
 */
function getAllActions() {
  try {
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
        id: row[0],
        email: row[1],
        type: row[2],
        data: parseJSON(row[3] || '{}'),
        status: row[4],
        date: row[5],
        decision: row[6],
        points: row[7],
        comment: row[8],
        validatedBy: row[9],
        validatedAt: row[10]
      }));
    
    return createJSONResponse(allActions);
  } catch (error) {
    return createJSONResponse({ error: error.toString() });
  }
}

/**
 * Get action by ID
 */
function getActionById(actionId) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(ACTIONS_TAB);
    
    if (!sheet) {
      return createJSONResponse(null);
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const rows = values.slice(1);
    
    const action = rows
      .filter(row => row[0] === actionId)
      .map(row => ({
        id: row[0],
        email: row[1],
        type: row[2],
        data: parseJSON(row[3] || '{}'),
        status: row[4],
        date: row[5],
        decision: row[6],
        points: row[7],
        comment: row[8],
        validatedBy: row[9],
        validatedAt: row[10]
      }))[0];
    
    return createJSONResponse(action);
  } catch (error) {
    return createJSONResponse({ error: error.toString() });
  }
}

/**
 * Validate action
 */
function validateAction(data) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(ACTIONS_TAB);
    
    if (!sheet) {
      return { success: false, error: 'Actions sheet not found' };
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const rows = values.slice(1);
    
    // Find action row
    const actionRowIndex = rows.findIndex(row => row[0] === data.actionId);
    
    if (actionRowIndex === -1) {
      return { success: false, error: 'Action not found' };
    }
    
    const actualRow = actionRowIndex + 2; // +1 for header, +1 for index base
    
    // Update action
    sheet.getRange(actualRow, 5).setValue(data.decision); // status
    sheet.getRange(actualRow, 7).setValue(data.points || 0); // points
    sheet.getRange(actualRow, 9).setValue(data.comment || ''); // comment
    sheet.getRange(actualRow, 10).setValue(data.validatedBy || 'Admin'); // validatedBy
    sheet.getRange(actualRow, 11).setValue(new Date().toISOString()); // validatedAt
    
    // If validated, update leaderboard
    if (data.decision === 'validated') {
      const email = rows[actionRowIndex][1];
      const points = data.points || 0;
      updateLeaderboardInternal(email, points);
    }
    
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
 * Internal leaderboard update
 */
function updateLeaderboardInternal(email, points) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(LEADERBOARD_TAB);
    
    if (!sheet) {
      return { success: false, error: 'Leaderboard sheet not found' };
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const rows = values.slice(1);
    
    // Find user row (email is in column D, index 3)
    const userRowIndex = rows.findIndex(row => row[3] === email);
    
    if (userRowIndex >= 0) {
      // User exists, update
      const actualRow = userRowIndex + 2;
      const currentPoints = parseInt(sheet.getRange(actualRow, 5).getValue()) || 0;
      const currentActions = parseInt(sheet.getRange(actualRow, 6).getValue()) || 0;
      
      sheet.getRange(actualRow, 5).setValue(currentPoints + points); // totalPoints
      sheet.getRange(actualRow, 6).setValue(currentActions + 1); // actionsCount
      sheet.getRange(actualRow, 7).setValue(new Date().toISOString()); // lastUpdate
      
      return { success: true };
    } else {
      // New user - create entry
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
      
      return { success: true };
    }
  } catch (error) {
    return { success: false, error: error.toString() };
  }
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

