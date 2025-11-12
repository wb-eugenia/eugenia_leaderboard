/**
 * Eugenia Challenge - Cloudflare Worker API
 * Backend API pour remplacer Google Apps Script
 */

export interface Env {
  DB: D1Database;
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
}

interface LeaderboardUser {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  classe?: string;
  totalPoints: number;
  actionsCount: number;
  lastUpdate?: string;
}

interface Action {
  id: string;
  email: string;
  type: string;
  data: any;
  status: 'pending' | 'validated' | 'rejected';
  submittedAt: string;
  validatedAt?: string;
  decision?: string;
  points?: number;
  comment?: string;
  validatedBy?: string;
}

/**
 * Helper: Parse JSON safely
 */
function parseJSON(str: string | null): any {
  if (!str) return {};
  try {
    return JSON.parse(str);
  } catch {
    return {};
  }
}

/**
 * Helper: Create JSON response
 */
function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Helper: CORS headers
 */
function corsHeaders(): HeadersInit {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

/**
 * GET /leaderboard - Récupère le classement
 */
async function getLeaderboard(env: Env): Promise<Response> {
  try {
    const { results } = await env.DB.prepare(
      'SELECT id, first_name, last_name, email, classe, total_points, actions_count, last_update FROM leaderboard ORDER BY total_points DESC, last_update DESC'
    ).all();

    // Calculer les rangs avec gestion des ex aequo
    let currentRank = 1;
    const users = results.map((user: any, index: number) => {
      // Si ce n'est pas le premier et que les points sont différents du précédent, augmenter le rang
      if (index > 0) {
        const prevPoints = (results[index - 1] as any).total_points;
        if (user.total_points !== prevPoints) {
          currentRank = index + 1;
        }
      }

      return {
        rank: currentRank,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        classe: user.classe || '',
        totalPoints: user.total_points || 0,
        actionsCount: user.actions_count || 0,
        lastUpdate: user.last_update || '',
      };
    });

    return jsonResponse(users);
  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * Helper: Get Google OAuth credentials from DB (like n8n)
 */
async function getGoogleOAuthCredentials(env: Env): Promise<{ clientId: string; clientSecret: string } | null> {
  try {
    // First try to get from DB (like n8n)
    const credentials = await env.DB.prepare(
      'SELECT client_id, client_secret FROM oauth_credentials WHERE provider = ? LIMIT 1'
    ).bind('google').first() as any;

    if (credentials && credentials.client_id && credentials.client_secret) {
      return {
        clientId: credentials.client_id,
        clientSecret: credentials.client_secret
      };
    }

    // Fallback to env variables (for backward compatibility, but deprecated)
    if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
      console.log('⚠️ Using OAuth credentials from env variables (deprecated). Please configure in admin UI.');
      return {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET
      };
    }

    return null;
  } catch (error: any) {
    console.error('Error getting OAuth credentials:', error);
    // Fallback to env
    if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
      return {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET
      };
    }
    return null;
  }
}

/**
 * Helper: Get Google OAuth access token (refresh if needed)
 */
async function getGoogleAccessToken(env: Env): Promise<string | null> {
  try {
    // Get the most recent token
    const token = await env.DB.prepare(
      'SELECT * FROM google_oauth_tokens ORDER BY created_at DESC LIMIT 1'
    ).first() as any;

    if (!token) {
      console.log('   ⚠️ No Google OAuth token found');
      return null;
    }

    // Check if token is expired (with 5 min buffer)
    const now = Date.now();
    const expiresAt = token.expires_at ? new Date(token.expires_at).getTime() : 0;
    
    if (expiresAt && now < expiresAt - 300000) {
      // Token still valid
      return token.access_token;
    }

    // Token expired, refresh it
    if (!token.refresh_token) {
      console.log('   ⚠️ Token expired but no refresh token available');
      return null;
    }

    console.log('   🔄 Refreshing Google OAuth token...');
    
    // Get credentials from DB (like n8n) or env fallback
    const credentials = await getGoogleOAuthCredentials(env);
    if (!credentials) {
      console.error('   ❌ No Google OAuth credentials configured');
      return null;
    }
    
    const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        refresh_token: token.refresh_token,
        grant_type: 'refresh_token'
      })
    });

    if (!refreshResponse.ok) {
      console.error('   ❌ Failed to refresh token:', await refreshResponse.text());
      return null;
    }

    const refreshData = await refreshResponse.json();
    const newExpiresAt = new Date(Date.now() + (refreshData.expires_in * 1000));

    // Update token in DB
    await env.DB.prepare(
      `UPDATE google_oauth_tokens 
       SET access_token = ?, expires_at = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(refreshData.access_token, newExpiresAt.toISOString(), token.id).run();

    return refreshData.access_token;
  } catch (error: any) {
    console.error('   ❌ Error getting Google access token:', error);
    return null;
  }
}

/**
 * Helper: Read Google Sheet via Google Sheets API v4 (with OAuth)
 */
async function readGoogleSheetWithOAuth(env: Env, sheetId: string, range: string): Promise<any[][]> {
  try {
    const accessToken = await getGoogleAccessToken(env);
    
    if (!accessToken) {
      throw new Error('No Google OAuth token available. Please connect Google account in admin.');
    }

    // Extract sheet name from range
    let sheetName = '';
    let actualRange = range;
    
    if (range.includes('!')) {
      const parts = range.split('!');
      sheetName = parts[0];
      actualRange = parts[1];
    }

    // Build Google Sheets API v4 URL
    let apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/`;
    
    if (sheetName) {
      apiUrl += `${encodeURIComponent(sheetName)}!${encodeURIComponent(actualRange)}`;
    } else {
      apiUrl += encodeURIComponent(actualRange);
    }
    
    apiUrl += '?valueRenderOption=UNFORMATTED_VALUE';

    console.log(`   🔗 Google Sheets API v4: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const rows = data.values || [];

    console.log(`   ✅ Read ${rows.length} rows from Google Sheets API`);
    return rows;
  } catch (error: any) {
    console.error('   ❌ Error reading Google Sheet with OAuth:', error);
    throw error;
  }
}

/**
 * Helper: Read Google Sheet via public API (fallback)
 */
async function readGoogleSheet(sheetId: string, range: string): Promise<any[][]> {
  try {
    console.log(`   📥 Fetching Google Sheet: ${sheetId}, range: ${range}`);
    
    // Extract sheet name from range if provided (e.g., "Sheet1!A1:D10" or "Salon!A2:G24")
    let sheetName = '';
    let actualRange = range;
    
    if (range.includes('!')) {
      const parts = range.split('!');
      sheetName = parts[0];
      actualRange = parts[1];
    }
    
    // Method 1: Try Google Visualization API (gviz/tq)
    let url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&range=${encodeURIComponent(actualRange)}`;
    if (sheetName) {
      url += `&sheet=${encodeURIComponent(sheetName)}`;
    }
    
    console.log(`   🔗 URL: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Cloudflare Worker)'
      }
    });
    
    const text = await response.text();
    console.log(`   📄 Response length: ${text.length} chars`);
    console.log(`   📄 Response preview (first 200 chars): ${text.substring(0, 200)}`);
    
    // Check if response is HTML/JavaScript instead of JSON
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html') || text.includes('google.visualization')) {
      console.log('   ⚠️ Received HTML/JavaScript instead of JSON, trying alternative method...');
      
      // Method 2: Try CSV export (simpler, more reliable for public sheets)
      // Note: CSV export uses gid (numeric tab ID) from URL, not sheet name
      // From URL: gid=1383674800 means tab ID is 1383674800
      // For now, try without gid first (gets first sheet), or allow gid in future
      let csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
      
      console.log(`   🔗 Trying CSV export (first sheet): ${csvUrl}`);
      let csvResponse;
      let csvText;
      
      try {
        csvResponse = await fetch(csvUrl);
        
        if (!csvResponse.ok) {
          throw new Error(`CSV export failed: ${csvResponse.status} ${csvResponse.statusText}`);
        }
        
        csvText = await csvResponse.text();
        console.log(`   📄 CSV response length: ${csvText.length} chars`);
        
        // Check if we got HTML instead of CSV (sheet might not be public)
        if (csvText.trim().startsWith('<!DOCTYPE') || csvText.trim().startsWith('<html') || csvText.length < 100) {
          throw new Error('Received HTML or empty response - sheet might not be public');
        }
      } catch (csvError: any) {
        console.error(`   ❌ CSV export error: ${csvError.message}`);
        throw new Error(`Failed to read Google Sheet as CSV. Make sure the sheet is public (View-only). Error: ${csvError.message}`);
      }
      
      // Parse CSV to rows
      const rows: any[][] = [];
      const lines = csvText.split('\n');
      
      for (const line of lines) {
        if (line.trim()) {
          // Simple CSV parsing (handles quoted fields)
          const row: any[] = [];
          let currentField = '';
          let insideQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
              insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
              row.push(currentField.trim());
              currentField = '';
            } else {
              currentField += char;
            }
          }
          
          // Add last field
          row.push(currentField.trim());
          
          rows.push(row);
        }
      }
      
      // Apply range filter if specified (e.g., "A2:G24" means skip row 1, only columns A-G)
      let filteredRows = rows;
      if (actualRange && actualRange !== 'A:Z' && actualRange.match(/^[A-Z]+\d+:[A-Z]+\d+$/)) {
        // Parse range like "A2:G24"
        const rangeMatch = actualRange.match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/);
        if (rangeMatch) {
          const startCol = rangeMatch[1];
          const startRow = parseInt(rangeMatch[2]) - 1; // Convert to 0-based
          const endCol = rangeMatch[3];
          const endRow = parseInt(rangeMatch[4]) - 1;
          
          // Parse column letters to indices
          const parseCol = (col: string): number => {
            let result = 0;
            for (let i = 0; i < col.length; i++) {
              result = result * 26 + (col.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
            }
            return result - 1;
          };
          
          const startColIdx = parseCol(startCol);
          const endColIdx = parseCol(endCol);
          
          filteredRows = rows.slice(startRow, endRow + 1).map(row => row.slice(startColIdx, endColIdx + 1));
          console.log(`   ✂️ Applied range filter ${actualRange}: ${rows.length} -> ${filteredRows.length} rows`);
        }
      }
      
      console.log(`   ✅ Parsed ${filteredRows.length} rows from CSV`);
      return filteredRows;
    }
    
    // Parse Google's weird format: remove "/*O_o*/\n" prefix and ";" suffix
    let jsonText = text.trim();
    
    // Remove various prefixes
    if (jsonText.startsWith('/*O_o*/\\n')) {
      jsonText = jsonText.substring(9);
    } else if (jsonText.startsWith('/*O_o*/')) {
      jsonText = jsonText.substring(7);
    } else if (jsonText.startsWith('/*')) {
      // Remove any /* comment */ prefix
      const endComment = jsonText.indexOf('*/');
      if (endComment >= 0) {
        jsonText = jsonText.substring(endComment + 2).trim();
      }
    }
    
    // Remove trailing semicolon
    if (jsonText.endsWith(';')) {
      jsonText = jsonText.slice(0, -1).trim();
    }
    
    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(jsonText);
    } catch (parseError: any) {
      console.error('   ❌ JSON parse error:', parseError.message);
      console.error('   📄 Problematic text (first 500 chars):', jsonText.substring(0, 500));
      throw new Error(`Invalid JSON response from Google Sheets. The sheet might not be public or the format changed. Error: ${parseError.message}`);
    }
    
    // Extract rows
    const rows: any[][] = [];
    if (data.table && data.table.rows) {
      data.table.rows.forEach((row: any) => {
        const rowData: any[] = [];
        if (row.c) {
          row.c.forEach((cell: any) => {
            rowData.push(cell ? (cell.v !== undefined ? cell.v : (cell.f || '')) : '');
          });
        }
        rows.push(rowData);
      });
    }
    
    console.log(`   ✅ Parsed ${rows.length} rows from JSON`);
    return rows;
  } catch (error: any) {
    console.error('   ❌ Error reading Google Sheet:', error);
    throw new Error(`Failed to read Google Sheet: ${error.message}`);
  }
}

/**
 * Helper: Get student identifier value based on type
 */
function getStudentIdentifier(user: any, studentIdType: string): string {
  switch (studentIdType) {
    case 'email':
      return user.email?.toLowerCase().trim() || '';
    case 'nom':
      return user.lastName || '';
    case 'prenom':
      return user.firstName || '';
    case 'nom_complet':
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    default:
      return user.email?.toLowerCase().trim() || '';
  }
}

/**
 * Helper: Check if form field value matches sheet value
 */
function matchesFieldValue(formValue: any, sheetValue: any, rule: string): boolean {
  if (!formValue || sheetValue === null || sheetValue === undefined) return false;
  
  const formStr = String(formValue).toLowerCase().trim();
  const sheetStr = String(sheetValue).toLowerCase().trim();
  
  switch (rule) {
    case 'exact':
      return formStr === sheetStr;
    case 'contains':
      return sheetStr.includes(formStr) || formStr.includes(sheetStr);
    case 'date':
      // Compare dates (handle Excel serial numbers and different formats)
      console.log(`      📅 Date matching: form="${formValue}" (${typeof formValue}), sheet="${sheetValue}" (${typeof sheetValue})`);
      
      let formDate: Date;
      let sheetDate: Date;
      
      // Parse form value (usually ISO string like "2025-09-21")
      formDate = new Date(formValue);
      
      // Parse sheet value - could be Excel serial number (integer) or date string
      if (typeof sheetValue === 'number') {
        // Check if it's an Excel serial number (typically > 1 and < 1000000 for reasonable dates)
        if (sheetValue > 1 && sheetValue < 1000000) {
          console.log(`      📊 Detected Excel serial number: ${sheetValue}`);
          // Excel serial number conversion
          // Excel epoch: December 30, 1899 (day 0 in Excel's system)
          // Excel day 1 = January 1, 1900
          // Standard formula: Excel day N = Dec 30, 1899 + (N-1) days
          // BUT: Excel treats 1900 as a leap year (bug), so day 60 = Feb 29, 1900 (which didn't exist)
          // For dates >= 61, Excel's internal count is off by 1 day
          // Correct formula: Dec 30, 1899 + (N-1) days, then add 1 day if N >= 61
          
          // Calculate base date: Dec 30, 1899 + (N-1) days
          const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Dec 30, 1899, 00:00:00 UTC
          sheetDate = new Date(excelEpoch.getTime() + (sheetValue - 1) * 24 * 60 * 60 * 1000);
          
          // Excel's 1900 leap year bug compensation: for days >= 61, add 1 day
          if (sheetValue >= 61) {
            sheetDate = new Date(sheetDate.getTime() + 24 * 60 * 60 * 1000);
          }
          
          // Parse the UTC date components to create a local date (avoids timezone shifts)
          // This ensures we compare dates correctly regardless of timezone
          sheetDate = new Date(Date.UTC(sheetDate.getUTCFullYear(), sheetDate.getUTCMonth(), sheetDate.getUTCDate()));
          
          console.log(`      📅 Converted Excel ${sheetValue} to date: ${sheetDate.toISOString()} (${sheetDate.toDateString()})`);
        } else {
          // Not an Excel date, try parsing as regular date
          sheetDate = new Date(sheetValue);
        }
      } else {
        // Try parsing as date string
        sheetDate = new Date(sheetValue);
      }
      
      // Compare only the date part (ignore time)
      const formIsValid = !isNaN(formDate.getTime());
      const sheetIsValid = !isNaN(sheetDate.getTime());
      
      if (!formIsValid) {
        console.log(`      ⚠️ Form date parsing failed: "${formValue}" -> Invalid Date`);
        return false;
      }
      
      if (!sheetIsValid) {
        console.log(`      ⚠️ Sheet date parsing failed: "${sheetValue}" -> Invalid Date`);
        return false;
      }
      
      console.log(`      📅 Form date: ${formDate.toISOString()} (${formDate.toDateString()})`);
      console.log(`      📅 Sheet date: ${sheetDate.toISOString()} (${sheetDate.toDateString()})`);
      
      const match = formDate.toDateString() === sheetDate.toDateString();
      if (match) {
        console.log(`      ✅ Date match successful!`);
      } else {
        console.log(`      ❌ Date mismatch: ${formDate.toDateString()} !== ${sheetDate.toDateString()}`);
      }
      return match;
    case 'partial':
      return sheetStr.includes(formStr) || formStr.includes(sheetStr);
    default:
      return formStr === sheetStr;
  }
}

/**
 * Helper: Check automation and auto-validate if match found
 */
async function checkAutomationsAndValidate(env: Env, actionId: string, email: string, actionType: string, formData: any): Promise<boolean> {
  try {
    console.log(`🔍 Checking automations for action ${actionId}, type: ${actionType}, email: ${email}`);
    
    // Parse formData if it's a string
    let parsedFormData = formData;
    if (typeof formData === 'string') {
      try {
        parsedFormData = JSON.parse(formData);
      } catch {
        parsedFormData = formData;
      }
    }
    
    console.log('📝 Form data:', JSON.stringify(parsedFormData, null, 2));
    
    // Get user from leaderboard
    const user = await env.DB.prepare(
      'SELECT first_name, last_name, email FROM leaderboard WHERE email = ?'
    ).bind(email).first() as any;
    
    if (!user) {
      console.log(`❌ User not found in leaderboard: ${email}`);
      return false; // User not found, cannot auto-validate
    }
    
    // Normalize user object to have both snake_case and camelCase
    const normalizedUser = {
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || ''
    };
    
    console.log('✅ User found:', normalizedUser);
    
    // Get active automations for this action type
    const { results: automations } = await env.DB.prepare(
      `SELECT * FROM automations 
       WHERE action_type_id = ? AND enabled = 1`
    ).bind(actionType).all();
    
    if (!automations || automations.length === 0) {
      console.log(`❌ No active automations found for action type: ${actionType}`);
      return false; // No automations configured
    }
    
    console.log(`✅ Found ${automations.length} active automation(s) for ${actionType}`);
    
    // Get action type to know points
    const actionTypeData = await env.DB.prepare(
      'SELECT points FROM action_types WHERE id = ?'
    ).bind(actionType).first() as any;
    
    const points = actionTypeData?.points || 0;
    console.log(`💰 Points for this action type: ${points}`);
    
    // Try each automation until one matches
    for (const auto of automations) {
      try {
        console.log(`\n🔄 Checking automation ID ${auto.id}:`);
        console.log(`   Sheet ID: ${auto.sheet_id}`);
        console.log(`   Range: ${auto.sheet_range}`);
        console.log(`   Student ID type: ${auto.student_id_type}`);
        console.log(`   Student ID columns: ${auto.student_id_columns}`);
        console.log(`   Form field to match: ${auto.form_field_to_match}`);
        console.log(`   Form field columns: ${auto.form_field_columns}`);
        
        // Read Google Sheet - try OAuth first, fallback to public API
        let rows: any[][] = [];
        try {
          rows = await readGoogleSheetWithOAuth(env, auto.sheet_id, auto.sheet_range || 'A:Z');
        } catch (oauthError: any) {
          console.log(`   ⚠️ OAuth failed: ${oauthError.message}, trying public API...`);
          try {
            rows = await readGoogleSheet(auto.sheet_id, auto.sheet_range || 'A:Z');
          } catch (publicError: any) {
            console.error(`   ❌ Both OAuth and public API failed: ${publicError.message}`);
            throw publicError;
          }
        }
        
        console.log(`   📊 Read ${rows.length} rows from Google Sheet`);
        if (rows.length === 0) {
          console.log(`   ⚠️ No rows found in sheet, skipping`);
          continue;
        }
        
        // Parse column indices (convert "D" to 3, "A" to 0, etc.)
        const parseColumn = (col: string): number => {
          const colUpper = col.trim().toUpperCase();
          if (!colUpper || colUpper.length === 0) return -1;
          let result = 0;
          for (let i = 0; i < colUpper.length; i++) {
            result = result * 26 + (colUpper.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
          }
          return result - 1;
        };
        
        // Parse student_id_columns (can be string "D" or "D,E,F" or JSON array)
        let studentIdColsStr = auto.student_id_columns;
        if (!studentIdColsStr) {
          console.log(`   ❌ student_id_columns is empty, skipping`);
          continue;
        }
        
        // Try to parse as JSON, if fails, treat as string
        let studentIdColsParsed: string[];
        try {
          const parsed = JSON.parse(studentIdColsStr);
          studentIdColsParsed = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          // Not JSON, treat as comma-separated string
          studentIdColsParsed = studentIdColsStr.split(',').map(c => c.trim()).filter(c => c.length > 0);
        }
        
        // Parse form_field_columns
        let formFieldColsStr = auto.form_field_columns;
        if (!formFieldColsStr) {
          console.log(`   ❌ form_field_columns is empty, skipping`);
          continue;
        }
        
        let formFieldColsParsed: string[];
        try {
          const parsed = JSON.parse(formFieldColsStr);
          formFieldColsParsed = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          formFieldColsParsed = formFieldColsStr.split(',').map(c => c.trim()).filter(c => c.length > 0);
        }
        
        const studentIdCols = studentIdColsParsed.map(c => parseColumn(c)).filter(c => c >= 0);
        const formFieldCols = formFieldColsParsed.map(c => parseColumn(c)).filter(c => c >= 0);
        
        console.log(`   📍 Parsed student ID columns: ${studentIdColsParsed} -> indices [${studentIdCols.join(', ')}]`);
        console.log(`   📍 Parsed form field columns: ${formFieldColsParsed} -> indices [${formFieldCols.join(', ')}]`);
        
        if (studentIdCols.length === 0 || formFieldCols.length === 0) {
          console.log(`   ❌ Invalid column configuration, skipping`);
          continue;
        }
        
        // Get student identifier (use normalized user)
        const studentIdentifier = getStudentIdentifier(normalizedUser, auto.student_id_type || 'email');
        console.log(`   🎓 Student identifier (${auto.student_id_type}): "${studentIdentifier}"`);
        
        if (!studentIdentifier) {
          console.log(`   ❌ Student identifier is empty, cannot match`);
          continue;
        }
        
        // Get form field value to match
        const formFieldValue = parsedFormData[auto.form_field_to_match || ''];
        console.log(`   📝 Form field "${auto.form_field_to_match}": "${formFieldValue}"`);
        
        if (!formFieldValue) {
          console.log(`   ❌ Form field value is empty, skipping`);
          continue;
        }
        
        // Check each row in the sheet
        let rowIndex = 0;
        for (const row of rows) {
          rowIndex++;
          console.log(`   \n   📄 Checking row ${rowIndex}:`, row.slice(0, 5)); // Log first 5 columns
          
          // Check if student ID matches in any of the specified columns
          let studentMatch = false;
          let matchedStudentCol = -1;
          for (const colIdx of studentIdCols) {
            if (colIdx < row.length) {
              const sheetValue = String(row[colIdx] || '').toLowerCase().trim();
              const studentId = studentIdentifier.toLowerCase().trim();
              console.log(`      Comparing student: "${studentId}" with sheet[${colIdx}]="${sheetValue}"`);
              if (sheetValue === studentId || sheetValue.includes(studentId) || studentId.includes(sheetValue)) {
                studentMatch = true;
                matchedStudentCol = colIdx;
                console.log(`      ✅ Student match found in column ${colIdx}!`);
                break;
              }
            }
          }
          
          if (!studentMatch) {
            console.log(`      ❌ No student match in this row, skipping`);
            continue;
          }
          
          // Check if form field matches in any of the specified columns
          let fieldMatch = false;
          let matchedFieldCol = -1;
          for (const colIdx of formFieldCols) {
            if (colIdx < row.length) {
              const sheetValue = row[colIdx];
              const rule = auto.form_field_rule || 'exact';
              console.log(`      Comparing field "${formFieldValue}" (type: ${typeof formFieldValue}) with sheet[${colIdx}]="${sheetValue}" (type: ${typeof sheetValue}, rule: ${rule})`);
              const matched = matchesFieldValue(formFieldValue, sheetValue, rule);
              console.log(`      -> Match result: ${matched}`);
              if (matched) {
                fieldMatch = true;
                matchedFieldCol = colIdx;
                console.log(`      ✅ Field match found in column ${colIdx}!`);
                break;
              }
            }
          }
          
          if (fieldMatch) {
            // MATCH FOUND! Auto-validate
            console.log(`\n   🎉 MATCH FOUND! Row ${rowIndex}, validating action...`);
            console.log(`      Student matched in column ${matchedStudentCol}`);
            console.log(`      Field matched in column ${matchedFieldCol}`);
            
            await env.DB.prepare(
              `UPDATE actions 
               SET status = 'validated', 
                   decision = 'validated',
                   points = ?,
                   validated_by = 'system',
                   validated_at = CURRENT_TIMESTAMP
               WHERE id = ?`
            ).bind(points, actionId).run();
            
            // Update leaderboard
            const existing = await env.DB.prepare(
              'SELECT id FROM leaderboard WHERE email = ?'
            ).bind(email).first() as any;
            
            if (existing) {
              await env.DB.prepare(
                `UPDATE leaderboard 
                 SET total_points = total_points + ?,
                     actions_count = actions_count + 1,
                     last_update = CURRENT_TIMESTAMP
                 WHERE email = ?`
              ).bind(points, email).run();
            } else {
              const emailParts = email.split('@')[0].split('.');
              await env.DB.prepare(
                `INSERT INTO leaderboard (email, first_name, last_name, total_points, actions_count, last_update)
                 VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)`
              ).bind(
                email,
                emailParts[0] || 'User',
                emailParts[1] || '',
                points
              ).run();
            }
            
            console.log(`   ✅ Action auto-validated successfully!`);
            return true; // Auto-validated
          } else {
            console.log(`      ❌ No field match in this row`);
          }
        }
        
        console.log(`   ❌ No match found in any row for this automation`);
      } catch (error: any) {
        console.error(`Error checking automation ${auto.id}:`, error);
        // Continue to next automation
        continue;
      }
    }
    
    return false; // No match found
  } catch (error: any) {
    console.error('Error checking automations:', error);
    return false;
  }
}

/**
 * POST /actions/submit - Soumettre une action
 */
async function submitAction(env: Env, request: Request): Promise<Response> {
  try {
    const body = await request.json() as { email: string; type: string; data: any };

    // Validation
    if (!body.email || !body.type) {
      return jsonResponse({ success: false, error: 'Missing email or type' }, 400);
    }

    // Vérifier les doublons
    const existing = await env.DB.prepare(
      `SELECT id FROM actions 
       WHERE email = ? AND type = ? 
       AND status IN ('pending', 'validated')
       AND submitted_at > datetime('now', '-1 day')`
    ).bind(body.email, body.type).first();

    if (existing) {
      return jsonResponse({
        success: false,
        error: 'duplicate',
        message: 'Cette action a déjà été soumise. Veuillez soumettre une action différente.',
      }, 400);
    }

    // Générer ID
    const id = `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Insérer l'action en pending
    await env.DB.prepare(
      `INSERT INTO actions (id, email, type, data, status, submitted_at)
       VALUES (?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)`
    ).bind(id, body.email, body.type, JSON.stringify(body.data || {})).run();

    // Check automations and auto-validate if match found
    console.log(`\n🔍 Starting automation check for action ${id}`);
    console.log(`   Type: ${body.type}`);
    console.log(`   Email: ${body.email}`);
    console.log(`   Data:`, JSON.stringify(body.data || {}, null, 2));
    
    const autoValidated = await checkAutomationsAndValidate(
      env,
      id,
      body.email,
      body.type,
      body.data || {}
    );
    
    if (autoValidated) {
      console.log(`✅ Action ${id} was auto-validated!`);
    } else {
      console.log(`⚠️ Action ${id} was NOT auto-validated (no matching automation or match not found)`);
    }

    return jsonResponse({
      success: true,
      actionId: id,
      autoValidated: autoValidated,
      message: autoValidated 
        ? 'Action validée automatiquement via automatisation !'
        : 'Action soumise avec succès. En attente de validation.'
    });
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * GET /actions/pending - Actions en attente
 */
async function getActionsToValidate(env: Env): Promise<Response> {
  try {
    const { results } = await env.DB.prepare(
      `SELECT id, email, type, data, status, submitted_at, validated_at, decision, points, comment, validated_by
       FROM actions 
       WHERE status = 'pending'
       ORDER BY submitted_at DESC`
    ).all();

    const actions = results.map((action: any) => ({
      id: action.id,
      email: action.email,
      type: action.type,
      data: parseJSON(action.data),
      status: action.status,
      date: action.submitted_at,
      decision: action.decision || '',
      points: action.points || 0,
      comment: action.comment || '',
      validatedBy: action.validated_by || '',
      validatedAt: action.validated_at || '',
    }));

    return jsonResponse(actions);
  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * GET /actions/all - Toutes les actions
 */
async function getAllActions(env: Env): Promise<Response> {
  try {
    const { results } = await env.DB.prepare(
      `SELECT id, email, type, data, status, submitted_at, validated_at, decision, points, comment, validated_by
       FROM actions 
       ORDER BY submitted_at DESC`
    ).all();

    const actions = results.map((action: any) => ({
      id: action.id,
      email: action.email,
      type: action.type,
      data: parseJSON(action.data),
      status: action.status,
      date: action.submitted_at,
      decision: action.decision || action.status,
      points: action.points || 0,
      comment: action.comment || '',
      validatedBy: action.validated_by || '',
      validatedAt: action.validated_at || '',
    }));

    return jsonResponse(actions);
  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * POST /actions/validate - Valider une action
 */
async function validateAction(env: Env, request: Request): Promise<Response> {
  try {
    const body = await request.json() as {
      actionId: string;
      decision: 'validated' | 'rejected';
      points: number;
      comment?: string;
      validatedBy?: string;
    };

    // Récupérer l'action AVANT de la mettre à jour pour avoir l'email
    const action = await env.DB.prepare(
      'SELECT email FROM actions WHERE id = ?'
    ).bind(body.actionId).first() as any;

    if (!action) {
      return jsonResponse({ success: false, error: 'Action not found' }, 404);
    }

    // Mettre à jour l'action
    await env.DB.prepare(
      `UPDATE actions 
       SET status = ?, decision = ?, points = ?, comment = ?, validated_by = ?, validated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(
      body.decision,
      body.decision,
      body.points || 0,
      body.comment || '',
      body.validatedBy || 'Admin',
      body.actionId
    ).run();

    // Si validé, mettre à jour le leaderboard
    if (body.decision === 'validated') {
      // Vérifier si l'utilisateur existe
      const existing = await env.DB.prepare(
        'SELECT id, total_points, actions_count FROM leaderboard WHERE email = ?'
      ).bind(action.email).first() as any;

      const emailParts = action.email.split('@')[0].split('.');
      const firstName = emailParts[0] || 'User';
      const lastName = emailParts[1] || '';

      if (existing) {
        // Mettre à jour l'utilisateur existant
        await env.DB.prepare(
          `UPDATE leaderboard 
           SET total_points = total_points + ?, 
               actions_count = actions_count + 1,
               last_update = CURRENT_TIMESTAMP
           WHERE email = ?`
        ).bind(body.points || 0, action.email).run();
      } else {
        // Créer un nouvel utilisateur
        await env.DB.prepare(
          `INSERT INTO leaderboard (email, first_name, last_name, total_points, actions_count, last_update)
           VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)`
        ).bind(action.email, firstName, lastName, body.points || 0).run();
      }
    }

    return jsonResponse({ success: true });
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * GET /config - Récupérer la configuration
 */
async function getConfig(env: Env): Promise<Response> {
  try {
    const { results } = await env.DB.prepare(
      'SELECT key, value FROM config'
    ).all();

    const config: Record<string, any> = {};
    results.forEach((row: any) => {
      try {
        config[row.key] = JSON.parse(row.value);
      } catch {
        config[row.key] = row.value;
      }
    });

    return jsonResponse(config);
  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * POST /config - Sauvegarder la configuration
 */
async function saveConfig(env: Env, request: Request): Promise<Response> {
  try {
    const body = await request.json() as { config: Record<string, any> };

    // Supprimer l'ancienne config
    await env.DB.prepare('DELETE FROM config').run();

    // Insérer la nouvelle config
    const entries = Object.entries(body.config);
    const statements = entries.map(([key, value]) =>
      env.DB.prepare(
        'INSERT INTO config (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)'
      ).bind(key, typeof value === 'string' ? value : JSON.stringify(value))
    );

    await env.DB.batch(statements);

    return jsonResponse({ success: true, saved: entries.length });
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * GET /actions/:id - Récupérer une action par ID
 */
async function getActionById(env: Env, actionId: string): Promise<Response> {
  try {
    const action = await env.DB.prepare(
      `SELECT id, email, type, data, status, submitted_at, validated_at, decision, points, comment, validated_by
       FROM actions WHERE id = ?`
    ).bind(actionId).first() as any;

    if (!action) {
      return jsonResponse({ error: 'Action not found' }, 404);
    }

    return jsonResponse({
      id: action.id,
      email: action.email,
      type: action.type,
      data: parseJSON(action.data),
      status: action.status,
      date: action.submitted_at,
      decision: action.decision || action.status,
      points: action.points || 0,
      comment: action.comment || '',
      validatedBy: action.validated_by || '',
      validatedAt: action.validated_at || '',
    });
  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * DELETE /actions/:id - Supprimer une action
 */
async function deleteAction(env: Env, actionId: string): Promise<Response> {
  try {
    console.log(`🗑️ deleteAction called with ID: ${actionId}`);
    
    // Vérifier si l'action existe
    const action = await env.DB.prepare(
      'SELECT id, email, points FROM actions WHERE id = ?'
    ).bind(actionId).first() as any;

    if (!action) {
      console.log(`🗑️ Action not found: ${actionId}`);
      return jsonResponse({ error: 'Action not found' }, 404);
    }

    console.log(`🗑️ Action found: ${action.id}, email: ${action.email}, points: ${action.points}`);

    // Supprimer l'action
    await env.DB.prepare('DELETE FROM actions WHERE id = ?').bind(actionId).run();
    console.log(`🗑️ Action deleted successfully`);

    // Si l'action était validée, mettre à jour le leaderboard (retirer les points)
    if (action.points && action.points > 0) {
      const existing = await env.DB.prepare(
        'SELECT id, total_points, actions_count FROM leaderboard WHERE email = ?'
      ).bind(action.email).first() as any;

      if (existing) {
        const newPoints = Math.max(0, (existing.total_points || 0) - action.points);
        const newActionsCount = Math.max(0, (existing.actions_count || 0) - 1);

        await env.DB.prepare(
          `UPDATE leaderboard 
           SET total_points = ?, actions_count = ?, last_update = CURRENT_TIMESTAMP
           WHERE email = ?`
        ).bind(newPoints, newActionsCount, action.email).run();
        console.log(`🗑️ Leaderboard updated: ${action.email}, new points: ${newPoints}`);
      }
    }

    return jsonResponse({ success: true, message: 'Action deleted successfully' });
  } catch (error: any) {
    console.error(`🗑️ Error deleting action:`, error);
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * PUT /leaderboard/user - Mettre à jour un utilisateur
 */
async function updateLeaderboardUser(env: Env, request: Request): Promise<Response> {
  try {
    const body = await request.json() as {
      email: string;
      firstName?: string;
      lastName?: string;
      classe?: string;
      totalPoints?: number;
      actionsCount?: number;
    };

    // Vérifier si l'utilisateur existe
    const existing = await env.DB.prepare(
      'SELECT id FROM leaderboard WHERE email = ?'
    ).bind(body.email).first() as any;

    if (existing) {
      // Mettre à jour
      await env.DB.prepare(
        `UPDATE leaderboard 
         SET first_name = COALESCE(?, first_name),
             last_name = COALESCE(?, last_name),
             classe = COALESCE(?, classe),
             total_points = COALESCE(?, total_points),
             actions_count = COALESCE(?, actions_count),
             last_update = CURRENT_TIMESTAMP
         WHERE email = ?`
      ).bind(
        body.firstName || null,
        body.lastName || null,
        body.classe || null,
        body.totalPoints !== undefined ? body.totalPoints : null,
        body.actionsCount !== undefined ? body.actionsCount : null,
        body.email
      ).run();
    } else {
      // Créer
      await env.DB.prepare(
        `INSERT INTO leaderboard (email, first_name, last_name, classe, total_points, actions_count, last_update)
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
      ).bind(
        body.email,
        body.firstName || '',
        body.lastName || '',
        body.classe || '',
        body.totalPoints || 0,
        body.actionsCount || 0
      ).run();
    }

    return jsonResponse({ success: true });
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * DELETE /leaderboard/user - Supprimer un utilisateur
 */
async function deleteLeaderboardUser(env: Env, request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return jsonResponse({ success: false, error: 'Email parameter required' }, 400);
    }

    await env.DB.prepare('DELETE FROM leaderboard WHERE email = ?').bind(email).run();

    return jsonResponse({ success: true });
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * POST /leaderboard/bulk - Import en masse d'étudiants
 */
async function bulkImportStudents(env: Env, request: Request): Promise<Response> {
  try {
    const body = await request.json() as {
      students: Array<{
        firstName: string;
        lastName: string;
        email: string;
        classe?: string;
        totalPoints?: number;
      }>;
    };

    if (!body.students || !Array.isArray(body.students) || body.students.length === 0) {
      return jsonResponse({ success: false, error: 'No students provided' }, 400);
    }

    let imported = 0;
    let updated = 0;
    const errors: string[] = [];

    for (const student of body.students) {
      try {
        if (!student.email || !student.firstName) {
          errors.push(`Étudiant sans email ou prénom: ${student.firstName || 'N/A'}`);
          continue;
        }

        // Vérifier si l'étudiant existe déjà
        const existing = await env.DB.prepare(
          'SELECT id, total_points, actions_count FROM leaderboard WHERE email = ?'
        ).bind(student.email.toLowerCase()).first();

        if (existing) {
          // Mettre à jour sans écraser les points existants
          await env.DB.prepare(
            `UPDATE leaderboard 
             SET first_name = ?,
                 last_name = COALESCE(?, last_name),
                 classe = COALESCE(?, classe),
                 last_update = CURRENT_TIMESTAMP
             WHERE email = ?`
          ).bind(
            student.firstName,
            student.lastName || null,
            student.classe || null,
            student.email.toLowerCase()
          ).run();
          updated++;
        } else {
          // Créer un nouvel étudiant
          await env.DB.prepare(
            `INSERT INTO leaderboard (email, first_name, last_name, classe, total_points, actions_count, last_update)
             VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
          ).bind(
            student.email.toLowerCase(),
            student.firstName,
            student.lastName || '',
            student.classe || 'B1',
            student.totalPoints !== undefined ? student.totalPoints : 0,
            0
          ).run();
          imported++;
        }
      } catch (error: any) {
        errors.push(`Erreur pour ${student.email}: ${error.message}`);
      }
    }

    return jsonResponse({
      success: true,
      imported,
      updated,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * GET /action-types - Récupérer tous les types d'actions
 */
async function getActionTypes(env: Env): Promise<Response> {
  try {
    const { results } = await env.DB.prepare(
      'SELECT id, label, emoji, category, points, auto_validation, fields FROM action_types ORDER BY category, label'
    ).all();

    const actionTypes = results.map((type: any) => ({
      id: type.id,
      label: type.label,
      emoji: type.emoji || '',
      category: type.category,
      points: type.points || 0,
      autoValidation: type.auto_validation === 1,
      fields: parseJSON(type.fields)
    }));

    return jsonResponse(actionTypes);
  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * POST /action-types - Créer un type d'action
 */
async function createActionType(env: Env, request: Request): Promise<Response> {
  try {
    const body = await request.json() as {
      id: string;
      label: string;
      emoji?: string;
      category: string;
      points: number;
      autoValidation?: boolean;
      fields?: any[];
    };

    if (!body.id || !body.label || !body.category) {
      return jsonResponse({ success: false, error: 'Missing required fields' }, 400);
    }

    await env.DB.prepare(
      `INSERT INTO action_types (id, label, emoji, category, points, auto_validation, fields, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
    ).bind(
      body.id,
      body.label,
      body.emoji || '',
      body.category,
      body.points || 0,
      body.autoValidation ? 1 : 0,
      JSON.stringify(body.fields || [])
    ).run();

    return jsonResponse({ success: true });
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * PUT /action-types/:id - Mettre à jour un type d'action
 */
async function updateActionType(env: Env, actionId: string, request: Request): Promise<Response> {
  try {
    const body = await request.json() as {
      label?: string;
      emoji?: string;
      category?: string;
      points?: number;
      autoValidation?: boolean;
      fields?: any[];
    };

    await env.DB.prepare(
      `UPDATE action_types 
       SET label = COALESCE(?, label),
           emoji = COALESCE(?, emoji),
           category = COALESCE(?, category),
           points = COALESCE(?, points),
           auto_validation = COALESCE(?, auto_validation),
           fields = COALESCE(?, fields),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(
      body.label || null,
      body.emoji || null,
      body.category || null,
      body.points !== undefined ? body.points : null,
      body.autoValidation !== undefined ? (body.autoValidation ? 1 : 0) : null,
      body.fields ? JSON.stringify(body.fields) : null,
      actionId
    ).run();

    return jsonResponse({ success: true });
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * DELETE /action-types/:id - Supprimer un type d'action
 */
async function deleteActionType(env: Env, actionId: string): Promise<Response> {
  try {
    await env.DB.prepare('DELETE FROM action_types WHERE id = ?').bind(actionId).run();

    return jsonResponse({ success: true });
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * GET /automations - Récupérer toutes les automatisations
 */
async function getAutomations(env: Env): Promise<Response> {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM automations ORDER BY created_at DESC'
    ).all();

    const automations = results.map((auto: any) => {
      // student_id_columns and form_field_columns can be stored as string or JSON
      let studentIdColumns = auto.student_id_columns;
      let formFieldColumns = auto.form_field_columns;
      
      // Try to parse as JSON, if fails, keep as string
      try {
        studentIdColumns = JSON.parse(auto.student_id_columns);
      } catch {
        // Already a string, keep it
      }
      
      try {
        formFieldColumns = JSON.parse(auto.form_field_columns);
      } catch {
        // Already a string, keep it
      }
      
      return {
        id: auto.id,
        actionTypeId: auto.action_type_id,
        enabled: auto.enabled === 1,
        sheetId: auto.sheet_id,
        sheetRange: auto.sheet_range,
        studentIdType: auto.student_id_type,
        studentIdColumns: studentIdColumns,
        formFieldToMatch: auto.form_field_to_match,
        formFieldColumns: formFieldColumns,
        formFieldRule: auto.form_field_rule,
        mappedColumns: parseJSON(auto.mapped_columns),
        createdAt: auto.created_at,
        updatedAt: auto.updated_at
      };
    });

    return jsonResponse(automations);
  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * POST /automations - Créer une automatisation
 */
async function createAutomation(env: Env, request: Request): Promise<Response> {
  try {
    const body = await request.json() as any;

    console.log('📥 Creating automation with data:', JSON.stringify(body, null, 2));

    // Handle columns: can be string like "D" or "D,E,F" or array
    const studentIdColumns = body.studentIdColumns || body.student_id_columns;
    const formFieldColumns = body.formFieldColumns || body.form_field_columns;
    
    // If it's a string, keep it as string. If it's an array, stringify it.
    const studentIdColumnsStr = typeof studentIdColumns === 'string' 
      ? studentIdColumns 
      : JSON.stringify(studentIdColumns || []);
    
    const formFieldColumnsStr = typeof formFieldColumns === 'string'
      ? formFieldColumns
      : JSON.stringify(formFieldColumns || []);

    await env.DB.prepare(
      `INSERT INTO automations (action_type_id, enabled, sheet_id, sheet_range, student_id_type, student_id_columns, form_field_to_match, form_field_columns, form_field_rule, mapped_columns, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
    ).bind(
      body.actionTypeId || body.action_type_id || '',
      body.enabled !== undefined ? (body.enabled ? 1 : 0) : 1,
      body.sheetId || body.sheet_id || null,
      body.sheetRange || body.sheet_range || 'A:Z',
      body.studentIdType || body.student_id_type || 'email',
      studentIdColumnsStr,
      body.formFieldToMatch || body.form_field_to_match || null,
      formFieldColumnsStr,
      body.formFieldRule || body.form_field_rule || 'exact',
      JSON.stringify(body.mappedColumns || body.mapped_columns || [])
    ).run();

    console.log('✅ Automation created successfully');
    return jsonResponse({ success: true });
  } catch (error: any) {
    console.error('❌ Error creating automation:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * PUT /automations/:id - Mettre à jour une automatisation
 */
async function updateAutomation(env: Env, automationId: string, request: Request): Promise<Response> {
  try {
    const body = await request.json() as any;

    console.log('📝 Updating automation:', automationId, JSON.stringify(body, null, 2));

    // Handle columns: can be string like "D" or "D,E,F" or array
    const studentIdColumns = body.studentIdColumns || body.student_id_columns;
    const formFieldColumns = body.formFieldColumns || body.form_field_columns;
    
    const studentIdColumnsStr = typeof studentIdColumns === 'string' 
      ? studentIdColumns 
      : (studentIdColumns ? JSON.stringify(studentIdColumns) : null);
    
    const formFieldColumnsStr = typeof formFieldColumns === 'string'
      ? formFieldColumns
      : (formFieldColumns ? JSON.stringify(formFieldColumns) : null);

    await env.DB.prepare(
      `UPDATE automations 
       SET action_type_id = COALESCE(?, action_type_id),
           enabled = COALESCE(?, enabled),
           sheet_id = COALESCE(?, sheet_id),
           sheet_range = COALESCE(?, sheet_range),
           student_id_type = COALESCE(?, student_id_type),
           student_id_columns = COALESCE(?, student_id_columns),
           form_field_to_match = COALESCE(?, form_field_to_match),
           form_field_columns = COALESCE(?, form_field_columns),
           form_field_rule = COALESCE(?, form_field_rule),
           mapped_columns = COALESCE(?, mapped_columns),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(
      body.actionTypeId || body.action_type_id || null,
      body.enabled !== undefined ? (body.enabled ? 1 : 0) : null,
      body.sheetId || body.sheet_id || null,
      body.sheetRange || body.sheet_range || null,
      body.studentIdType || body.student_id_type || null,
      studentIdColumnsStr,
      body.formFieldToMatch || body.form_field_to_match || null,
      formFieldColumnsStr,
      body.formFieldRule || body.form_field_rule || null,
      body.mappedColumns || body.mapped_columns ? JSON.stringify(body.mappedColumns || body.mapped_columns) : null,
      automationId
    ).run();

    console.log('✅ Automation updated successfully');
    return jsonResponse({ success: true });
  } catch (error: any) {
    console.error('❌ Error updating automation:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * DELETE /automations/:id - Supprimer une automatisation
 */
async function deleteAutomation(env: Env, automationId: string): Promise<Response> {
  try {
    await env.DB.prepare('DELETE FROM automations WHERE id = ?').bind(automationId).run();

    return jsonResponse({ success: true });
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * GET /rewards - Récupérer toutes les récompenses
 */
async function getRewards(env: Env): Promise<Response> {
  try {
    const { results } = await env.DB.prepare(
      'SELECT id, rank, position, emoji, amount, benefits, gradient FROM rewards ORDER BY rank ASC'
    ).all();

    const rewards = (results || []).map((reward: any) => ({
      id: reward.id,
      rank: reward.rank,
      position: reward.position,
      emoji: reward.emoji || '🏆',
      amount: reward.amount || '',
      benefits: parseJSON(reward.benefits) || [],
      gradient: reward.gradient || 'linear-gradient(135deg, #888, #666)'
    }));

    return jsonResponse(rewards);
  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * POST /rewards - Sauvegarder les récompenses
 */
async function saveRewards(env: Env, request: Request): Promise<Response> {
  try {
    const body = await request.json() as { rewards: any[] };
    
    // Supprimer toutes les anciennes récompenses
    await env.DB.prepare('DELETE FROM rewards').run();
    
    // Insérer les nouvelles récompenses
    if (body.rewards && body.rewards.length > 0) {
      const statements = body.rewards.map((reward) => {
        return env.DB.prepare(
          `INSERT INTO rewards (rank, position, emoji, amount, benefits, gradient, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
        ).bind(
          reward.rank || 1,
          reward.position || '',
          reward.emoji || '🏆',
          reward.amount || '',
          JSON.stringify(reward.benefits || []),
          reward.gradient || 'linear-gradient(135deg, #888, #666)'
        );
      });
      
      await env.DB.batch(statements);
    }
    
    return jsonResponse({ success: true, saved: body.rewards?.length || 0 });
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * GET /landing-page-config - Récupérer la config de la landing page
 */
async function getLandingPageConfig(env: Env): Promise<Response> {
  try {
    console.log('📖 Getting landing page config from D1...');
    const { results } = await env.DB.prepare(
      'SELECT key, value FROM landing_page_config'
    ).all();

    const config: Record<string, string> = {};
    if (results && results.length > 0) {
      console.log(`📊 Found ${results.length} config entries`);
      results.forEach((row: any) => {
        config[row.key] = row.value;
        console.log(`   ${row.key} = ${row.value.substring(0, 50)}...`);
      });
    } else {
      console.log('⚠️ No config entries found in database');
    }

    // Récupérer aussi les récompenses
    const rewardsResult = await env.DB.prepare(
      'SELECT id, rank, position, emoji, amount, benefits, gradient FROM rewards ORDER BY rank ASC'
    ).all();
    
    const rewards = (rewardsResult.results || []).map((reward: any) => ({
      id: reward.id,
      rank: reward.rank,
      position: reward.position,
      emoji: reward.emoji || '🏆',
      amount: reward.amount || '',
      benefits: parseJSON(reward.benefits) || [],
      gradient: reward.gradient || 'linear-gradient(135deg, #888, #666)'
    }));

    // Ajouter les récompenses comme JSON dans la config
    config.rewards = JSON.stringify(rewards);
    console.log(`✅ Added ${rewards.length} rewards to config`);

    console.log('✅ Returning config:', Object.keys(config));
    return jsonResponse(config);
  } catch (error: any) {
    console.error('❌ Error getting landing page config:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * POST /landing-page-config - Sauvegarder la config de la landing page
 */
async function saveLandingPageConfig(env: Env, request: Request): Promise<Response> {
  try {
    const body = await request.json() as { config: Record<string, string> };
    
    console.log('💾 Saving landing page config...');
    console.log(`   Config keys: ${Object.keys(body.config).join(', ')}`);

    // Extraire les récompenses si présentes
    let rewards: any[] = [];
    if (body.config.rewards) {
      try {
        rewards = JSON.parse(body.config.rewards);
        delete body.config.rewards; // Ne pas sauvegarder dans landing_page_config
      } catch (e) {
        console.warn('⚠️ Failed to parse rewards:', e);
      }
    }

    // Supprimer l'ancienne config
    await env.DB.prepare('DELETE FROM landing_page_config').run();
    console.log('   Deleted old config');

    // Insérer la nouvelle config (convertir toutes les valeurs en string)
    const entries = Object.entries(body.config);
    const statements = entries.map(([key, value]) => {
      const stringValue = String(value || '');
      console.log(`   Preparing: ${key} = ${stringValue.substring(0, 50)}...`);
      return env.DB.prepare(
        'INSERT INTO landing_page_config (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)'
      ).bind(key, stringValue);
    });

    if (statements.length > 0) {
      await env.DB.batch(statements);
      console.log(`✅ Saved ${statements.length} config entries`);
    } else {
      console.log('⚠️ No entries to save');
    }

    // Sauvegarder les récompenses si présentes
    if (rewards.length > 0) {
      await env.DB.prepare('DELETE FROM rewards').run();
      const rewardStatements = rewards.map((reward) => {
        return env.DB.prepare(
          `INSERT INTO rewards (rank, position, emoji, amount, benefits, gradient, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
        ).bind(
          reward.rank || 1,
          reward.position || '',
          reward.emoji || '🏆',
          reward.amount || '',
          JSON.stringify(reward.benefits || []),
          reward.gradient || 'linear-gradient(135deg, #888, #666)'
        );
      });
      await env.DB.batch(rewardStatements);
      console.log(`✅ Saved ${rewards.length} rewards`);
    }

    return jsonResponse({ success: true, saved: entries.length, rewardsSaved: rewards.length });
  } catch (error: any) {
    console.error('❌ Error saving landing page config:', error);
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * GET /api/analytics/overview - Vue d'ensemble des statistiques
 */
async function getAnalyticsOverview(env: Env, period: string = '30d'): Promise<Response> {
  try {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 1;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Total étudiants
    const totalStudents = await env.DB.prepare('SELECT COUNT(*) as count FROM leaderboard').first() as any;
    const totalCount = totalStudents?.count || 0;
    
    // Étudiants actifs ce mois
    const activeStudents = await env.DB.prepare(`
      SELECT COUNT(DISTINCT email) as count 
      FROM actions 
      WHERE status = 'validated' 
        AND submitted_at >= ?
    `).bind(startDate.toISOString()).first() as any;
    
    // Actions ce mois
    const actionsThisMonth = await env.DB.prepare(`
      SELECT COUNT(*) as count 
      FROM actions 
      WHERE status = 'validated' 
        AND submitted_at >= ?
    `).bind(startDate.toISOString()).first() as any;
    
    // Moyenne de points
    const avgPoints = await env.DB.prepare(`
      SELECT AVG(total_points) as avg 
      FROM leaderboard 
      WHERE total_points > 0
    `).first() as any;
    
    // Taux de participation
    const participationRate = totalCount > 0 ? ((activeStudents?.count || 0) / totalCount) * 100 : 0;
    
    // Tendance (comparaison avec période précédente)
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - days);
    const prevActiveStudents = await env.DB.prepare(`
      SELECT COUNT(DISTINCT email) as count 
      FROM actions 
      WHERE status = 'validated' 
        AND submitted_at >= ? AND submitted_at < ?
    `).bind(prevStartDate.toISOString(), startDate.toISOString()).first() as any;
    
    const prevCount = prevActiveStudents?.count || 0;
    const currentCount = activeStudents?.count || 0;
    const participationTrend = prevCount > 0 ? ((currentCount - prevCount) / prevCount) * 100 : 0;
    
    return jsonResponse({
      participationRate: Math.round(participationRate * 10) / 10,
      participationTrend: Math.round(participationTrend * 10) / 10,
      actionsThisMonth: actionsThisMonth?.count || 0,
      activeStudents: activeStudents?.count || 0,
      averagePoints: Math.round((avgPoints?.avg || 0) * 10) / 10
    });
  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * GET /api/analytics/timeline - Évolution temporelle
 */
async function getAnalyticsTimeline(env: Env, period: string = '30d'): Promise<Response> {
  try {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 1;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Récupérer les données existantes
    const { results } = await env.DB.prepare(`
      SELECT 
        DATE(submitted_at) as date,
        COUNT(*) as count
      FROM actions
      WHERE status = 'validated'
        AND submitted_at >= ?
      GROUP BY DATE(submitted_at)
      ORDER BY date ASC
    `).bind(startDate.toISOString()).all();
    
    // Créer un map des dates avec données
    const dataMap = new Map();
    (results || []).forEach((row: any) => {
      dataMap.set(row.date, row.count);
    });
    
    // Générer tous les jours de la période même avec 0 actions
    const allDays: any[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      allDays.push({
        date: dateStr,
        count: dataMap.get(dateStr) || 0
      });
    }
    
    return jsonResponse(allDays);
  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * GET /api/analytics/popular-actions - Actions les plus populaires
 */
async function getPopularActions(env: Env, limit: number = 5): Promise<Response> {
  try {
    const { results } = await env.DB.prepare(`
      SELECT 
        at.label as type,
        at.emoji,
        COUNT(*) as count
      FROM actions a
      JOIN action_types at ON a.type = at.id
      WHERE a.status = 'validated'
        AND a.submitted_at >= date('now', '-30 days')
      GROUP BY at.id
      ORDER BY count DESC
      LIMIT ?
    `).bind(limit).all();
    
    return jsonResponse(results || []);
  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * GET /api/analytics/by-class - Répartition par classe
 */
async function getAnalyticsByClass(env: Env): Promise<Response> {
  try {
    console.log('📊 Fetching analytics by class...');
    const total = await env.DB.prepare(`
      SELECT COUNT(*) as total
      FROM actions a
      JOIN leaderboard l ON a.email = l.email
      WHERE a.status = 'validated'
        AND a.submitted_at >= date('now', '-30 days')
    `).first() as any;
    
    const totalCount = total?.total || 1;
    console.log(`📊 Total actions: ${totalCount}`);
    
    const { results } = await env.DB.prepare(`
      SELECT 
        l.classe as class,
        COUNT(*) as count
      FROM actions a
      JOIN leaderboard l ON a.email = l.email
      WHERE a.status = 'validated'
        AND a.submitted_at >= date('now', '-30 days')
      GROUP BY l.classe
      ORDER BY count DESC
    `).all();
    
    console.log(`📊 Found ${results?.length || 0} classes`);
    
    const data = (results || []).map((row: any) => ({
      class: row.class || row.classe,
      count: row.count,
      percentage: Math.round((row.count / totalCount) * 100)
    }));
    
    console.log('📊 By class data:', data);
    return jsonResponse(data);
  } catch (error: any) {
    console.error('❌ Error in getAnalyticsByClass:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * GET /api/analytics/top-students - Top étudiants actifs
 */
async function getTopStudents(env: Env, limit: number = 10): Promise<Response> {
  try {
    console.log('📊 Fetching top students...');
    const { results } = await env.DB.prepare(`
      SELECT 
        l.first_name,
        l.last_name,
        l.classe as class,
        COUNT(a.id) as actions_count,
        COALESCE(l.total_points, 0) as points
      FROM leaderboard l
      LEFT JOIN actions a ON l.email = a.email AND a.status = 'validated'
      GROUP BY l.email
      HAVING actions_count > 0
      ORDER BY actions_count DESC, points DESC
      LIMIT ?
    `).bind(limit).all();
    
    console.log(`📊 Found ${results?.length || 0} top students`);
    
    const students = (results || []).map((student: any, index: number) => ({
      rank: index + 1,
      firstName: student.first_name,
      lastName: student.last_name,
      class: student.class || student.classe,
      actionsCount: student.actions_count,
      points: student.points,
      trend: 'stable'
    }));
    
    console.log('📊 Top students:', students);
    return jsonResponse(students);
  } catch (error: any) {
    console.error('❌ Error in getTopStudents:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * GET /api/analytics/recent-actions - Actions récentes
 */
async function getRecentActions(env: Env, hours: number = 48, limit: number = 20, status: string = 'all'): Promise<Response> {
  try {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hours);
    
    let query = `
      SELECT 
        a.id,
        l.first_name || ' ' || l.last_name as student_name,
        at.label as action_type,
        at.emoji,
        a.points,
        a.status,
        a.submitted_at as created_at
      FROM actions a
      JOIN leaderboard l ON a.email = l.email
      LEFT JOIN action_types at ON a.type = at.id
      WHERE a.submitted_at >= ?
    `;
    
    if (status === 'validated') {
      query += ` AND a.status = 'validated'`;
    } else if (status === 'rejected') {
      query += ` AND a.status = 'rejected'`;
    }
    
      query += ` ORDER BY a.submitted_at DESC LIMIT ?`;
    
    const { results } = await env.DB.prepare(query)
      .bind(startDate.toISOString(), limit)
      .all();
    
    return jsonResponse(results || []);
  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * GET /api/analytics/insights - Insights automatiques
 */
async function getAnalyticsInsights(env: Env): Promise<Response> {
  try {
    console.log('📊 Fetching insights...');
    
    // Momentum du moment
    const momentum = await env.DB.prepare(`
      SELECT 
        at.label as action_type,
        COUNT(*) as count
      FROM actions a
      JOIN action_types at ON a.type = at.id
      WHERE a.status = 'validated'
        AND a.submitted_at >= date('now', '-7 days')
      GROUP BY at.id
      ORDER BY count DESC
      LIMIT 1
    `).first() as any;
    
    console.log('📊 Momentum:', momentum);
    
    const prevMomentum = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM actions a
      JOIN action_types at ON a.type = at.id
      WHERE a.status = 'validated'
        AND at.label = ?
        AND a.submitted_at >= date('now', '-14 days')
        AND a.submitted_at < date('now', '-7 days')
    `).bind(momentum?.action_type || '').first() as any;
    
    const momentumIncrease = prevMomentum?.count > 0 
      ? Math.round(((momentum?.count || 0) - (prevMomentum.count || 0)) / prevMomentum.count * 100)
      : 0;
    
    // Jour le plus actif
    const busiestDay = await env.DB.prepare(`
      SELECT 
        CASE CAST(strftime('%w', submitted_at) AS INTEGER)
          WHEN 0 THEN 'Dimanche'
          WHEN 1 THEN 'Lundi'
          WHEN 2 THEN 'Mardi'
          WHEN 3 THEN 'Mercredi'
          WHEN 4 THEN 'Jeudi'
          WHEN 5 THEN 'Vendredi'
          WHEN 6 THEN 'Samedi'
        END as day,
        COUNT(*) as count
      FROM actions
      WHERE status = 'validated'
        AND submitted_at >= date('now', '-30 days')
      GROUP BY CAST(strftime('%w', submitted_at) AS INTEGER)
      ORDER BY count DESC
      LIMIT 1
    `).first() as any;
    
    console.log('📊 Busiest day:', busiestDay);
    
    const totalActions = await env.DB.prepare(`
      SELECT COUNT(*) as total
      FROM actions
      WHERE status = 'validated'
        AND submitted_at >= date('now', '-30 days')
    `).first() as any;
    
    const busiestDayPercentage = totalActions?.total > 0
      ? Math.round(((busiestDay?.count || 0) / totalActions.total) * 100)
      : 0;
    
    // Heure de pointe
    const peakHours = await env.DB.prepare(`
      SELECT 
        CAST(strftime('%H', submitted_at) AS INTEGER) as hour,
        COUNT(*) as count
      FROM actions
      WHERE status = 'validated'
        AND submitted_at >= date('now', '-30 days')
      GROUP BY hour
      ORDER BY count DESC
      LIMIT 1
    `).first() as any;
    
    const peakHour = peakHours?.hour || 14;
    console.log('📊 Peak hour:', peakHour);
    
    // Classe championne
    const topClass = await env.DB.prepare(`
      SELECT 
        l.classe as class,
        COUNT(*) as count
      FROM actions a
      JOIN leaderboard l ON a.email = l.email
      WHERE a.status = 'validated'
        AND a.submitted_at >= date('now', '-30 days')
      GROUP BY l.classe
      ORDER BY count DESC
      LIMIT 1
    `).first() as any;
    
    console.log('📊 Top class:', topClass);
    
    return jsonResponse({
      momentum: {
        actionType: momentum?.action_type || 'N/A',
        increase: momentumIncrease,
        period: 'week'
      },
      busiestDay: {
        day: busiestDay?.day || 'N/A',
        percentage: busiestDayPercentage
      },
      peakHours: {
        start: peakHour,
        end: peakHour + 2
      },
      topClass: {
        name: topClass?.class || topClass?.classe || 'N/A',
        count: topClass?.count || 0
      }
    });
  } catch (error: any) {
    console.error('❌ Error in getAnalyticsInsights:', error);
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * Main handler
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    try {
      // Route: GET /leaderboard
      if (url.pathname === '/leaderboard' && request.method === 'GET') {
        const response = await getLeaderboard(env);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: DELETE /actions/:id - DOIT être AVANT les autres routes /actions/*
      // Vérifier que ce n'est pas une route spéciale comme /actions/all, /actions/validate, etc.
      if (request.method === 'DELETE' && 
          url.pathname.startsWith('/actions/') && 
          url.pathname !== '/actions/all' &&
          url.pathname !== '/actions/pending' &&
          url.pathname !== '/actions/submit' &&
          url.pathname !== '/actions/validate') {
        const actionId = decodeURIComponent(url.pathname.split('/')[2]);
        console.log(`🗑️ DELETE action request for ID: ${actionId}, pathname: ${url.pathname}`);
        const response = await deleteAction(env, actionId);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: POST /actions/submit
      if (url.pathname === '/actions/submit' && request.method === 'POST') {
        const response = await submitAction(env, request);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: GET /actions/pending
      if (url.pathname === '/actions/pending' && request.method === 'GET') {
        const response = await getActionsToValidate(env);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: GET /actions/all
      if (url.pathname === '/actions/all' && request.method === 'GET') {
        const response = await getAllActions(env);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: POST /actions/validate
      if (url.pathname === '/actions/validate' && request.method === 'POST') {
        const response = await validateAction(env, request);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: GET /config
      if (url.pathname === '/config' && request.method === 'GET') {
        const response = await getConfig(env);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: POST /config
      if (url.pathname === '/config' && request.method === 'POST') {
        const response = await saveConfig(env, request);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: GET /actions/:id
      if (url.pathname.startsWith('/actions/') && request.method === 'GET') {
        const actionId = url.pathname.split('/')[2];
        const response = await getActionById(env, actionId);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: PUT /leaderboard/user - Mettre à jour un utilisateur
      if (url.pathname === '/leaderboard/user' && request.method === 'PUT') {
        const response = await updateLeaderboardUser(env, request);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: DELETE /leaderboard/user - Supprimer un utilisateur
      if (url.pathname === '/leaderboard/user' && request.method === 'DELETE') {
        const response = await deleteLeaderboardUser(env, request);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: POST /leaderboard/bulk - Import en masse d'étudiants
      if (url.pathname === '/leaderboard/bulk' && request.method === 'POST') {
        const response = await bulkImportStudents(env, request);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: GET /action-types
      if (url.pathname === '/action-types' && request.method === 'GET') {
        const response = await getActionTypes(env);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: POST /action-types
      if (url.pathname === '/action-types' && request.method === 'POST') {
        const response = await createActionType(env, request);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: PUT /action-types/:id
      if (url.pathname.startsWith('/action-types/') && request.method === 'PUT') {
        const actionId = url.pathname.split('/')[2];
        const response = await updateActionType(env, actionId, request);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: DELETE /action-types/:id
      if (url.pathname.startsWith('/action-types/') && request.method === 'DELETE') {
        const actionId = url.pathname.split('/')[2];
        const response = await deleteActionType(env, actionId);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: GET /automations
      if (url.pathname === '/automations' && request.method === 'GET') {
        const response = await getAutomations(env);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: POST /automations
      if (url.pathname === '/automations' && request.method === 'POST') {
        const response = await createAutomation(env, request);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: PUT /automations/:id
      if (url.pathname.startsWith('/automations/') && request.method === 'PUT') {
        const automationId = url.pathname.split('/')[2];
        const response = await updateAutomation(env, automationId, request);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: DELETE /automations/:id
      if (url.pathname.startsWith('/automations/') && request.method === 'DELETE') {
        const automationId = url.pathname.split('/')[2];
        const response = await deleteAutomation(env, automationId);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: GET /api/analytics/overview
      if (url.pathname === '/api/analytics/overview' && request.method === 'GET') {
        const period = url.searchParams.get('period') || '30d';
        const response = await getAnalyticsOverview(env, period);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: GET /api/analytics/timeline
      if (url.pathname === '/api/analytics/timeline' && request.method === 'GET') {
        const period = url.searchParams.get('period') || '30d';
        const response = await getAnalyticsTimeline(env, period);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: GET /api/analytics/popular-actions
      if (url.pathname === '/api/analytics/popular-actions' && request.method === 'GET') {
        const limit = parseInt(url.searchParams.get('limit') || '5');
        const response = await getPopularActions(env, limit);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: GET /api/analytics/by-class
      if (url.pathname === '/api/analytics/by-class' && request.method === 'GET') {
        const response = await getAnalyticsByClass(env);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: GET /api/analytics/top-students
      if (url.pathname === '/api/analytics/top-students' && request.method === 'GET') {
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const response = await getTopStudents(env, limit);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: GET /api/analytics/recent-actions
      if (url.pathname === '/api/analytics/recent-actions' && request.method === 'GET') {
        const hours = parseInt(url.searchParams.get('hours') || '48');
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const status = url.searchParams.get('status') || 'all';
        const response = await getRecentActions(env, hours, limit, status);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: GET /api/analytics/insights
      if (url.pathname === '/api/analytics/insights' && request.method === 'GET') {
        const response = await getAnalyticsInsights(env);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: GET /rewards
      if (url.pathname === '/rewards' && request.method === 'GET') {
        const response = await getRewards(env);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: POST /rewards
      if (url.pathname === '/rewards' && request.method === 'POST') {
        const response = await saveRewards(env, request);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: GET /landing-page-config
      if (url.pathname === '/landing-page-config' && request.method === 'GET') {
        const response = await getLandingPageConfig(env);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: POST /landing-page-config
      if (url.pathname === '/landing-page-config' && request.method === 'POST') {
        const response = await saveLandingPageConfig(env, request);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: POST /google-oauth/callback
      if (url.pathname === '/google-oauth/callback' && request.method === 'POST') {
        const response = await handleGoogleOAuthCallback(env, request);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: GET /google-oauth/status
      if (url.pathname === '/google-oauth/status' && request.method === 'GET') {
        const response = await getGoogleOAuthStatus(env);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: DELETE /google-oauth/disconnect
      if (url.pathname === '/google-oauth/disconnect' && request.method === 'DELETE') {
        const response = await disconnectGoogleOAuth(env);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: POST /oauth-credentials - Sauvegarder credentials OAuth (comme n8n)
      if (url.pathname === '/oauth-credentials' && request.method === 'POST') {
        const response = await saveOAuthCredentials(env, request);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      // Route: GET /oauth-credentials - Récupérer credentials OAuth
      if (url.pathname === '/oauth-credentials' && request.method === 'GET') {
        const response = await getOAuthCredentials(env);
        return new Response(response.body, {
          ...response,
          headers: { ...response.headers, ...corsHeaders() },
        });
      }

      return jsonResponse({ error: 'Not found' }, 404);
    } catch (error: any) {
      return jsonResponse({ error: error.message }, 500);
    }
  },
};

/**
 * POST /oauth-credentials - Sauvegarder les credentials OAuth (comme n8n)
 */
async function saveOAuthCredentials(env: Env, request: Request): Promise<Response> {
  try {
    const body = await request.json() as {
      provider?: string;
      clientId: string;
      clientSecret: string;
    };

    const provider = body.provider || 'google';

    // Upsert credentials (SQLite doesn't support ON CONFLICT DO UPDATE, so we check first)
    const existing = await env.DB.prepare(
      'SELECT id FROM oauth_credentials WHERE provider = ?'
    ).bind(provider).first() as any;

    if (existing) {
      // Update
      await env.DB.prepare(
        `UPDATE oauth_credentials 
         SET client_id = ?, client_secret = ?, updated_at = CURRENT_TIMESTAMP
         WHERE provider = ?`
      ).bind(body.clientId, body.clientSecret, provider).run();
    } else {
      // Insert
      await env.DB.prepare(
        `INSERT INTO oauth_credentials (provider, client_id, client_secret, updated_at)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP)`
      ).bind(provider, body.clientId, body.clientSecret).run();
    }

    return jsonResponse({ success: true, message: 'OAuth credentials saved' });
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * GET /oauth-credentials - Récupérer les credentials OAuth (sans le secret)
 */
async function getOAuthCredentials(env: Env): Promise<Response> {
  try {
    const credentials = await env.DB.prepare(
      'SELECT provider, client_id, updated_at FROM oauth_credentials WHERE provider = ?'
    ).bind('google').first() as any;

    if (!credentials) {
      return jsonResponse({ 
        configured: false,
        clientId: null,
        hasCredentials: false
      });
    }

    return jsonResponse({
      configured: !!credentials.client_id,
      clientId: credentials.client_id || null,
      hasCredentials: !!credentials.client_id,
      updatedAt: credentials.updated_at
    });
  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
}

/**
 * POST /google-oauth/callback - Handle OAuth callback
 */
async function handleGoogleOAuthCallback(env: Env, request: Request): Promise<Response> {
  try {
    const body = await request.json() as {
      code: string;
      userEmail?: string;
      redirectUri: string;
    };

    // Get credentials from DB (like n8n)
    const credentials = await getGoogleOAuthCredentials(env);
    if (!credentials) {
      return jsonResponse({ 
        success: false, 
        error: 'OAuth credentials not configured. Please configure Client ID and Secret first.' 
      }, 400);
    }

    // Exchange code for token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        code: body.code,
        redirect_uri: body.redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      return jsonResponse({ 
        success: false, 
        error: `Failed to exchange code: ${errorText}` 
      }, 400);
    }

    const tokenData = await tokenResponse.json();
    const expiresAt = new Date(Date.now() + (tokenData.expires_in * 1000));

    // Save token to DB
    await env.DB.prepare(
      `INSERT INTO google_oauth_tokens (user_email, access_token, refresh_token, expires_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(user_email) DO UPDATE SET
         access_token = excluded.access_token,
         refresh_token = excluded.refresh_token,
         expires_at = excluded.expires_at,
         updated_at = CURRENT_TIMESTAMP`
    ).bind(
      body.userEmail || 'admin',
      tokenData.access_token,
      tokenData.refresh_token || null,
      expiresAt.toISOString()
    ).run();

    return jsonResponse({ success: true });
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

/**
 * GET /google-oauth/status - Get OAuth connection status
 */
async function getGoogleOAuthStatus(env: Env): Promise<Response> {
  try {
    // Check if credentials are configured
    const credentials = await getOAuthCredentials(env);
    const credentialsData = await credentials.json() as any;

    // Check if token exists
    const token = await env.DB.prepare(
      'SELECT user_email, expires_at FROM google_oauth_tokens ORDER BY created_at DESC LIMIT 1'
    ).first() as any;

    if (!token && !credentialsData.hasCredentials) {
      return jsonResponse({
        connected: false,
        clientId: 'not configured',
        userEmail: null
      });
    }

    const isConnected = token && new Date(token.expires_at) > new Date();

    return jsonResponse({
      connected: isConnected,
      clientId: credentialsData.hasCredentials ? 'configured' : 'not configured',
      userEmail: token?.user_email || null,
      expiresAt: token?.expires_at || null
    });
  } catch (error: any) {
    return jsonResponse({ connected: false, clientId: 'not configured', error: error.message }, 500);
  }
}

/**
 * DELETE /google-oauth/disconnect - Disconnect Google OAuth
 */
async function disconnectGoogleOAuth(env: Env): Promise<Response> {
  try {
    await env.DB.prepare('DELETE FROM google_oauth_tokens').run();
    return jsonResponse({ success: true });
  } catch (error: any) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}

