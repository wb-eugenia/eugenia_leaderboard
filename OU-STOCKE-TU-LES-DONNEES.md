# 📍 OÙ sont stockées les données ?

## 🎯 Réponse simple

**ACTUELLEMENT** : **localStorage** (base de données temporaire dans le navigateur)

**MAIS AUSSI** : Prêt pour **Google Sheets** (si vous le configurez)

---

## 📦 Les 3 emplacements

### 1. **localStorage** (navigateur)
**Emplacement** : Dans CHAQUE navigateur de chaque utilisateur

**Données stockées** :
```
Clé: eugenia_leaderboard
├─ Liste des étudiants
├─ Prénom, Nom, Email, Classe
├─ Points, Actions count
└─ 35 étudiants Eugenia pré-chargés
```

```
Clé: eugenia_actions
├─ Actions soumises
├─ Email, Type, Données
├─ Status (pending/validated/rejected)
└─ Historique complet
```

```
Clé: eugeniaConfig
├─ Types d'actions configurés
├─ Automatisations
├─ Config leaderboard
└─ Toute la config admin
```

**Problème** : Chaque navigateur = données isolées !

---

### 2. **Google Sheets** (future production)
**Emplacement** : Sur Google Drive, partagé

**Structure** :

#### Onglet `leaderboard`
```
| firstName | lastName | classe | email | totalPoints | actionsCount | lastUpdate |
|-----------|----------|--------|-------|-------------|--------------|------------|
| Orehn     | Ansellem | B1     | oan...| 0           | 0            |            |
| Corentin  | Ballonad | B1     | cba...| 0           | 0            |            |
```

#### Onglet `actions`
```
| id | email | type | data | status | date | decision | points | comment | validatedBy | validatedAt |
```

**Avantage** : Données partagées, persistantes, multi-utilisateur

---

### 3. **Apps Script** (backend)
**Emplacement** : Exécuté sur les serveurs Google

**Fonction** : 
- Lire/Écrire dans Google Sheets
- Traiter les requêtes
- Retourner JSON au frontend

---

## 🔄 Comment ça marche actuellement

### Mode localStorage (développement)

```
User Submit Action
  ↓
googleSheets.submitAction()
  ↓
localStorage.getItem('eugenia_actions')
  ↓
Ajouter la nouvelle action
  ↓
localStorage.setItem('eugenia_actions', ...)
  ↓
✅ Action sauvegardée dans le navigateur
```

---

### Mode Google Sheets (production)

**Si** `VITE_APP_SCRIPT_URL` est configuré :

```
User Submit Action
  ↓
googleSheets.submitAction()
  ↓
fetch(APP_SCRIPT_URL, { action: 'submitAction', ... })
  ↓
Apps Script receive POST
  ↓
SpreadsheetApp.openById(SHEET_ID)
  ↓
sheet.appendRow([...])
  ↓
✅ Action sauvegardée dans Google Sheets
```

**Si erreur** → Fallback sur localStorage

---

## 📍 Où sont stockées CHAQUE donnée

### 🎓 Étudiants (Leaderboard)

**LocalStorage** :
- Clé : `eugenia_leaderboard`
- Fichier : `src/services/googleSheets.js` ligne 334
- Données : 35 étudiants Eugenia

**Google Sheets** :
- Onglet : `leaderboard`
- Colonnes : A-G (firstName → lastUpdate)

**Modifications admin** :
- Via `/admin/leaderboard`
- Écrit dans localStorage
- Si Apps Script : via Apps Script → Sheets

---

### 📝 Actions

**LocalStorage** :
- Clé : `eugenia_actions`
- Fichier : `src/services/googleSheets.js` ligne 78
- Données : Toutes les actions soumises

**Google Sheets** :
- Onglet : `actions`
- Colonnes : A-K (id → validatedAt)

**Nouvelle action** :
- Via `/submit`
- Écrit dans localStorage
- Si Apps Script : via Apps Script → Sheets

---

### ⚙️ Configuration admin

**LocalStorage** :
- Clé : `eugeniaConfig`
- Fichier : `src/services/configService.js` ligne 30
- Données : Types d'actions, automatisations

**Contenu** :
- `actionTypes` : Types configurés
- `automations` : Règles d'auto-validation
- `leaderboard` : Config affichage

**Modifications** :
- Via `/admin/actions`
- Via `/admin/automations`
- Écrit dans localStorage

---

## 🔍 Où trouver les données

### Dans le navigateur (localStorage)

1. **Ouvrir DevTools** : F12
2. **Application** > **Storage** > **Local Storage**
3. **http://localhost:5173**
4. **Voir** :
   - `eugeniaConfig`
   - `eugenia_leaderboard`
   - `eugenia_actions`

### Dans Google Sheets (production)

1. **Ouvrir votre Sheet**
2. **Onglet "leaderboard"** : Vos étudiants
3. **Onglet "actions"** : Actions soumises

---

## 📊 Exemple concret

### Vous soumettez une action

```javascript
// Formulaire /submit
Email: wbouzidane@eugeniaschool.com
Type: linkedin-post
Link: https://linkedin.com/post/123
```

**Stockage localStorage** :
```javascript
{
  id: "act_1234567890",
  email: "wbouzidane@eugeniaschool.com",
  type: "linkedin-post",
  data: { link: "https://linkedin.com/post/123" },
  date: "2025-01-15T10:30:00Z",
  status: "pending",
  points: 0,
  decision: null,
  comment: null,
  validatedBy: null,
  validatedAt: null
}
```

**Stockage Google Sheets** (si configuré) :
```
Onglet "actions", nouvelle ligne:
act_1234567890 | wbouzidane@... | linkedin-post | {"link":"..."} | pending | 2025-01-15... | | 0 | | |
```

---

### Admin valide l'action

**Mise à jour localStorage** :
```javascript
status: "validated"
points: 50
validatedBy: "Admin"
validatedAt: "2025-01-15T10:45:00Z"
```

**Mise à jour Google Sheets** :
```
Onglet "actions", ligne X:
... | validated | ... | | 50 | | Admin | 2025-01-15...
```

**Mise à jour leaderboard** :
```javascript
Onglet "leaderboard", étudiant wbouzidane@...:
... | 50 | 1 | 2025-01-15...
(totalPoints → 50, actionsCount → 1)
```

---

## 🔄 Migration localStorage → Google Sheets

### Actuellement
**Tout est dans localStorage** du navigateur

### Après configuration
1. Créer Google Sheet
2. Déployer Apps Script
3. Configurer `.env.local`
4. **Toutes nouvelles opérations** → Google Sheets
5. **localStorage** sert de cache/fallback

### Import initial
**35 étudiants** : 
- Actuellement dans localStorage
- À copier manuellement dans Google Sheet
- Pour ensuite les lire depuis Sheets

---

## 🎯 Résumé

### Où stocke-t-on ?

| Donnée | localStorage | Google Sheets | Où ça se fait |
|--------|-------------|---------------|---------------|
| **Étudiants** | ✅ Oui | ⏳ Si configuré | `googleSheets.js:334` |
| **Actions** | ✅ Oui | ⏳ Si configuré | `googleSheets.js:78` |
| **Config admin** | ✅ Oui | ❌ Non | `configService.js:30` |
| **Automatisations** | ✅ Oui | ❌ Non | `configService.js:138` |

---

## 🔑 Clés localStorage actuelles

**Vos 3 fichiers** :
```
1. eugeniaConfig
   → Config complète de l'app

2. eugenia_leaderboard
   → 35 étudiants Eugenia
   → + Modifications admin

3. eugenia_actions
   → Actions soumises
   → + Validations admin
```

---

## 📍 Résumé ultra-simple

**localStorage = Un gros fichier JSON** dans votre navigateur
**Google Sheets = Un vrai fichier partagé** sur le cloud

**Actuellement** : On utilise localStorage
**Après config** : On utilisera Google Sheets (plus robuste)

**Toutes les données sont stockées dans l'un ou l'autre !** 📦

---

Voilà ! Toutes vos données sont dans **localStorage** pour l'instant, prêt à migrer vers **Google Sheets** dès que vous configurerez Apps Script ! 🚀

