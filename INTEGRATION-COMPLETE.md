# 🚀 Intégration Complète - Production Google Sheets

## 📋 État actuel

✅ **Apps Script CodeV2.gs** : Créé et prêt
✅ **Guide de configuration** : Disponible
⏳ **googleSheets.js** : À modifier
⏳ **Variables d'env** : À créer

---

## 🎯 Plan d'intégration

### 1. Fichiers à créer/modifier

#### Créer `.env.local`
```bash
# URLs Apps Script
VITE_APP_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
```

#### Modifier `src/services/googleSheets.js`
Remplacer localStorage par fetch() vers Apps Script

---

## 🔧 Structure attendue

### Apps Script Responses

#### GET getLeaderboard
```json
[
  {
    "firstName": "Orehn",
    "lastName": "Ansellem",
    "email": "oansellem@eugeniaschool.com",
    "classe": "B1",
    "totalPoints": 150,
    "actionsCount": 5,
    "lastUpdate": "2025-01-15T10:00:00.000Z",
    "rank": 1
  }
]
```

#### POST submitAction
**Body** :
```json
{
  "action": "submitAction",
  "email": "wbouzidane@eugeniaschool.com",
  "type": "linkedin-post",
  "data": {
    "link": "https://linkedin.com/post/123"
  }
}
```

**Response** :
```json
{
  "success": true,
  "actionId": "act_1234567890_abc123"
}
```

#### GET getActionsToValidate
```json
[
  {
    "id": "act_123",
    "email": "wbouzidane@eugeniaschool.com",
    "type": "linkedin-post",
    "data": {
      "link": "https://linkedin.com/post/123"
    },
    "status": "pending",
    "date": "2025-01-15T10:00:00.000Z",
    "decision": "",
    "points": 0,
    "comment": "",
    "validatedBy": "",
    "validatedAt": ""
  }
]
```

#### POST validateAction
**Body** :
```json
{
  "action": "validateAction",
  "actionId": "act_123",
  "decision": "validated",
  "points": 50,
  "comment": "Excellent post !",
  "validatedBy": "Admin"
}
```

**Response** :
```json
{
  "success": true
}
```

---

## 📝 Implémentation googleSheets.js

### Pattern à suivre

```javascript
// 1. Configuration URL
const APP_SCRIPT_URL = import.meta.env.VITE_APP_SCRIPT_URL;

// 2. Mode mixte (localStorage fallback)
const USE_APPS_SCRIPT = !!APP_SCRIPT_URL;

// 3. Fonctions avec fetch() + fallback
async function fetchJSON(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const text = await response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export async function getLeaderboard() {
  // Si Apps Script configuré
  if (USE_APPS_SCRIPT) {
    const data = await fetchJSON(`${APP_SCRIPT_URL}?action=getLeaderboard`);
    return data;
  }
  
  // Fallback localStorage
  return getLeaderboardLocalStorage();
}
```

---

## ✅ Checklist finale

- [ ] Créer Google Sheet avec 2 onglets
- [ ] Importer étudiants initiaux
- [ ] Déployer Apps Script CodeV2.gs
- [ ] Configurer SHEET_ID
- [ ] Déployer Web App
- [ ] Copier URL Web App
- [ ] Créer .env.local
- [ ] Modifier googleSheets.js
- [ ] Tester getLeaderboard
- [ ] Tester submitAction
- [ ] Tester getActionsToValidate
- [ ] Tester validateAction
- [ ] Vérifier ex aequo
- [ ] Deploy sur Cloudflare
- [ ] Test production

---

**Continuez avec la modification de googleSheets.js !** 🚀

