# 📊 Configuration Google Sheets - Production Complète

## 🎯 Objectif

Connecter votre application React à une Google Sheet pour persister les données.

---

## 📋 Étapes

### 1. Créer votre Google Sheet

1. Allez sur https://sheets.google.com
2. Créez un nouveau **Google Sheet**
3. Nommez-le : `Eugenia Challenge Data`
4. Notez l'**ID du Sheet** dans l'URL :
   ```
   https://docs.google.com/spreadsheets/d/[ID_ICI]/edit
   ```

### 2. Créer les onglets

Votre Sheet doit avoir **2 onglets** avec ces structures :

#### Onglet `leaderboard`

**En-têtes (ligne 1)** :
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| firstName | lastName | classe | email | totalPoints | actionsCount | lastUpdate |

**Données (à partir ligne 2)** :
| firstName | lastName | classe | email | totalPoints | actionsCount | lastUpdate |
|-----------|----------|--------|-------|-------------|--------------|------------|
| Orehn | Ansellem | B1 | oansellem@eugeniaschool.com | 0 | 0 | |
| Corentin | Ballonad | B1 | cballonad@eugeniaschool.com | 0 | 0 | |

**Format** :
- Ligne 1 = en-têtes
- Ligne 2+ = données étudiants
- Les colonnes totalPoints, actionsCount, lastUpdate seront remplies automatiquement

#### Onglet `actions`

**En-têtes (ligne 1)** :
| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| id | email | type | data | status | date | decision | points | comment | validatedBy | validatedAt |

**Données** : Automatiquement rempli par l'application
**Status** : `pending`, `validated`, `rejected`

---

### 3. Importer vos étudiants

Vous avez 2 options :

#### Option A : Copier-Coller

1. Ouvrez votre Google Sheet
2. Onglet `leaderboard`
3. Dans une ligne vide, collez :
   ```
   Orehn	Ansellem	B1	oansellem@eugeniaschool.com	0	0
   Corentin	Ballonad	B1	cballonad@eugeniaschool.com	0	0
   Walid	Bouzidane	B1	wbouzidane@eugeniaschool.com	0	0
   ```

(Liste complète dans `src/utils/resetData.js`)

#### Option B : Importer via app

L'application créera automatiquement les entrées lors de la première soumission.

---

### 4. Déployer Apps Script

1. Dans votre Google Sheet : **Extensions** > **Apps Script**
2. Supprimez tout le code par défaut
3. Copiez le contenu de `apps-script/CodeV2.gs`
4. **IMPORTANT** : Remplacez `YOUR_GOOGLE_SHEET_ID` ligne 11 par votre ID
5. Cliquez sur **Save** (💾)

---

### 5. Déployer en Web App

1. Cliquez sur **Deploy** > **New deployment**
2. Cliquez sur l'icône **⚙️** à côté de "Select type"
3. Cliquez sur **Enable deployment types**
4. Sélectionnez **Web app**
5. Configuration :
   - **Description** : `Eugenia Challenge Backend v1`
   - **Execute as** : **Me** (votre compte Google)
   - **Who has access** : **Anyone** (accès public)
6. Cliquez sur **Deploy**
7. **Autorisez les permissions** (première fois)
8. **Copiez l'URL du Web App** (elle ressemble à : `https://script.google.com/macros/s/XXXXX/exec`)

---

### 6. Configurer l'application React

1. Créez un fichier `.env.local` à la racine du projet :
   ```bash
   VITE_APP_SCRIPT_URL=https://script.google.com/macros/s/VOTRE_ID/exec
   ```

2. Remplacez `VOTRE_ID` par l'URL que vous avez copiée

---

### 7. Modifier googleSheets.js

Le fichier `src/services/googleSheets.js` doit être mis à jour pour utiliser Apps Script au lieu de localStorage.

**Modification nécessaire** : (voir fichier suivant)

---

## ✅ Test

### Test 1 : Leaderboard
```
GET https://script.google.com/macros/s/YOUR_ID/exec?action=getLeaderboard
```

**Attendu** : JSON avec vos étudiants

### Test 2 : Soumission
```
POST https://script.google.com/macros/s/YOUR_ID/exec
Body: {
  "action": "submitAction",
  "email": "test@eugeniaschool.com",
  "type": "linkedin-post",
  "data": {"link": "https://linkedin.com/test"}
}
```

**Attendu** : `{"success": true, "actionId": "..."}`

---

## 🔒 Sécurité

- **Execute as: Me** : Le script s'exécute avec vos permissions
- **Who has access: Anyone** : Pas d'authentification requise
- **Read/Write** : Full accès au Sheet

**⚠️ Important** : Vos données Sheets sont accessibles par l'URL publique (mais pas par recherche Google)

---

## 🚨 Dépannage

### Erreur : "Sheet not found"
- Vérifiez l'ID du Sheet
- Vérifiez que les onglets s'appellent exactement : `leaderboard` et `actions`

### Erreur : "Permission denied"
- Vérifiez que vous avez autorisé les permissions Apps Script

### Erreur : "Invalid action"
- Vérifiez l'URL du Web App
- Vérifiez les paramètres de la requête

---

## 📊 Structure Sheets

### leaderboard
```
Ligne 1: firstName | lastName | classe | email | totalPoints | actionsCount | lastUpdate
Ligne 2: Jean      | Dupont   | B1     | jean@... | 150        | 5           | 2025-01-...
```

### actions
```
Ligne 1: id | email | type | data | status | date | decision | points | comment | validatedBy | validatedAt
Ligne 2: act_123 | jean@... | linkedin-post | {"link":"..."} | pending | 2025-01-... | | | | |
```

---

**C'est prêt ! Maintenant connectons le frontend** 🚀

