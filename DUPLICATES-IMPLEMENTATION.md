# 🔍 Gestion des Doublons - Documentation

## ✅ Implémentation complète

La détection des doublons est maintenant implémentée à **3 niveaux** pour garantir la sécurité des données.

---

## 📋 Critères de détection d'un doublon

Un doublon est détecté si **TOUS** les critères suivants sont remplis :

1. ✅ **Même email étudiant** (case-insensitive)
2. ✅ **Même type d'action** (ex: "salon-1j", "linkedin", etc.)
3. ✅ **Même date** (pour les actions avec un champ date)
4. ✅ **Status actif** : `pending` OU `validated` (ignore les `rejected`)

**Important** : Les actions rejetées (`rejected`) ne sont **PAS** considérées comme doublons. Un étudiant peut donc soumettre à nouveau une action rejetée.

---

## 🏗️ Architecture de l'implémentation

### 1️⃣ Apps Script (Google Sheets) - Production

**Fichier** : `apps-script/CodeV2.gs`

**Fonction** : `submitAction(data)`

**Logique** :
```javascript
// Récupère toutes les actions
// Parcourt chaque action existante
// Vérifie email, type, date
// Retourne erreur si doublon trouvé
```

**Avantage** : Base de données centralisée, toutes les soumissions passent par là.

---

### 2️⃣ Frontend Service (localStorage) - Fallback

**Fichier** : `src/services/googleSheets.js`

**Fonction** : `submitAction(actionData)`

**Logique** :
```javascript
// Si Apps Script configuré, priorité à Apps Script
// Fallback vers localStorage si Apps Script échoue
// Même logique de détection
```

**Avantage** : L'app fonctionne même si Apps Script est indisponible (dev/test).

---

### 3️⃣ UI Error Handling - Affichage

**Fichier** : `src/pages/SubmitActionPage.jsx`

**Logique** :
```javascript
// Lit la réponse du serveur
// Si error === 'duplicate'
// Affiche message d'erreur spécifique
```

**Message affiché** :
```
⚠️ Cette action a déjà été soumise. 
Veuillez soumettre une action différente.
```

---

## 🧪 Scénarios de test

### ✅ Soumission valide
- Email: `john.doe@eugeniaschool.com`
- Type: `salon-1j`
- Date: `2024-12-20`
- **Résultat** : ✅ Accepté

### ❌ Premier doublon
- Email: `john.doe@eugeniaschool.com`
- Type: `salon-1j`
- Date: `2024-12-20`
- Status: `pending`
- **Résultat** : ❌ Rejeté (doublon)

### ✅ Nouvelle action différente
- Email: `john.doe@eugeniaschool.com`
- Type: `linkedin`
- Link: `https://linkedin.com/posts/...`
- **Résultat** : ✅ Accepté (type différent)

### ✅ Même type, date différente
- Email: `john.doe@eugeniaschool.com`
- Type: `salon-1j`
- Date: `2024-12-21`
- **Résultat** : ✅ Accepté (date différente)

### ✅ Action rejetée à nouveau
- Email: `john.doe@eugeniaschool.com`
- Type: `salon-1j`
- Date: `2024-12-20`
- Status: `rejected`
- **Résultat** : ✅ Accepté (re-soumission)

---

## 🔄 Flux de validation

```
1. Étudiant soumet action
   ↓
2. Frontend appelle submitAction()
   ↓
3. Détection doublon ?
   ├─ OUI → Retourne { success: false, error: 'duplicate' }
   │         ↓
   │         Affiche message d'erreur
   │
   └─ NON → Ajoute à la base
            ↓
            Retourne { success: true }
            ↓
            Affiche message de succès
            ↓
            Redirect vers leaderboard
```

---

## 🔧 Détails techniques

### Apps Script (CodeV2.gs)

```javascript
// Check for duplicates
const isDuplicate = rows.some(row => {
  const existingEmail = row[1];
  const existingType = row[2];
  const existingData = parseJSON(row[3] || '{}');
  const existingStatus = row[4];
  
  const sameEmail = existingEmail && 
    existingEmail.toLowerCase() === data.email.toLowerCase();
  const sameType = existingType === data.type;
  
  let sameData = false;
  if (data.data && data.data.date && existingData.date) {
    sameData = data.data.date === existingData.date;
  }
  
  return sameEmail && sameType && sameData && 
    (existingStatus.toLowerCase() === 'pending' || 
     existingStatus.toLowerCase() === 'validated');
});
```

### Frontend Service (googleSheets.js)

```javascript
const isDuplicate = actions.some(existing => {
  const sameEmail = existing.email && 
    existing.email.toLowerCase() === actionData.email.toLowerCase();
  const sameType = existing.type === actionData.type;
  
  let sameDate = false;
  if (actionData.data && actionData.data.date && 
      existing.data && existing.data.date) {
    sameDate = actionData.data.date === existing.data.date;
  }
  
  const activeStatus = existing.status === 'pending' || 
                       existing.status === 'validated';
  
  return sameEmail && sameType && sameDate && activeStatus;
});
```

---

## 📊 Structure des données

### Format soumission
```json
{
  "email": "john.doe@eugeniaschool.com",
  "type": "salon-1j",
  "data": {
    "date": "2024-12-20"
  }
}
```

### Format réponse (success)
```json
{
  "success": true,
  "actionId": "act_1234567890_abc123"
}
```

### Format réponse (duplicate)
```json
{
  "success": false,
  "error": "duplicate",
  "message": "Cette action a déjà été soumise..."
}
```

---

## 🎯 Avantages

✅ **Sécurité** : Empêche les soumissions accidentelles en double  
✅ **Base de données propre** : Pas de données dupliquées  
✅ **UX** : Message clair pour l'utilisateur  
✅ **Flexibilité** : Type ET date = autorise plusieurs actions du même type  
✅ **Ré-soumission** : Autorise la re-soumission d'actions rejetées  

---

## 🚀 Déploiement

Les modifications ont été appliquées à :

- ✅ `apps-script/CodeV2.gs`
- ✅ `src/services/googleSheets.js`
- ✅ `src/pages/SubmitActionPage.jsx`

**Prochaine étape** : Re-déployer Apps Script et rebuild le frontend.

---

**Documentation générée le** : 2024-12-19

