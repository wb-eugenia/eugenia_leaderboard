# Apps Script - Configuration Guide

## 📋 Instructions de déploiement

### Étape 1 : Créer votre Google Sheet

1. Créez un nouveau Google Sheet sur [sheets.google.com](https://sheets.google.com)
2. Notez l'ID du Sheet (visible dans l'URL : `https://docs.google.com/spreadsheets/d/[ID_ICI]/edit`)
3. Créez deux onglets nommés exactement :
   - `leaderboard`
   - `actions`

### Étape 2 : Configurer l'onglet "leaderboard"

Créez vos en-têtes dans la première ligne (ils ne seront pas utilisés par l'application) :

| Colonne A (Prénom) | Colonne B (Nom) | Colonne C (Classe) | Colonne D (Mail) | Colonne E (Points) |
|--------------------|-----------------|--------------------|-------------------|--------------------|
| Jean               | Dupont          | L3 Info           | jean@campus.fr    | 150                |
| Marie              | Martin          | M1 Info           | marie@campus.fr   | 120                |
| Pierre             | Durand          | L3 Info           | pierre@campus.fr  | 100                |

**Structure obligatoire :**
- Colonne A : Prénom
- Colonne B : Nom
- Colonne C : Classe
- Colonne D : Email
- Colonne E : Points (nombres uniquement)

**Note** : L'application lira automatiquement les données à partir de la ligne 2. La première ligne peut contenir vos en-têtes mais ne sera pas utilisée.

### Étape 3 : Configurer l'onglet "actions"

Ajoutez les en-têtes suivants dans la première ligne :

| Email | Action Type | Date Submitted | Details | Status | Points Awarded |
|-------|-------------|----------------|---------|--------|----------------|

Les données seront ajoutées automatiquement par l'application.

### Étape 4 : Ouvrir Apps Script

1. Dans votre Google Sheet, allez dans **Extensions** > **Apps Script**
2. Supprimez le code par défaut

### Étape 5 : Copier le code

Copiez tout le contenu de `Code.gs` et collez-le dans l'éditeur Apps Script.

### Étape 6 : Remplacer le SHEET_ID

1. Dans le fichier `Code.gs`, trouvez la ligne :
   ```javascript
   const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
   ```
2. Remplacez `YOUR_GOOGLE_SHEET_ID` par l'ID de votre Google Sheet (visible dans l'URL)

### Étape 7 : Sauvegarder le projet

1. Cliquez sur **File** > **Save** ou utilisez le raccourci `Ctrl+S`
2. Donnez un nom à votre projet (ex: "Eugenia Challenge Backend")

### Étape 8 : Déployer l'application

1. Cliquez sur **Deploy** > **New deployment**
2. Cliquez sur l'icône de paramètres (⚙️) à côté de "Select type"
3. Cliquez sur **Enable deployment types**
4. Sélectionnez **Web app** comme type de déploiement
5. Donnez une description (ex: "Version 1.0")
6. Configurez les paramètres :
   - **Execute as**: Me (votre compte Google)
   - **Who has access**: Anyone (permet l'accès public sans authentification)
7. Cliquez sur **Deploy**
8. Copiez l'URL du web app déployé

### Étape 9 : Autoriser les permissions

Lors de la première déploiement, Google vous demandera d'autoriser l'accès :
1. Cliquez sur **Authorize access**
2. Sélectionnez votre compte Google
3. Cliquez sur **Advanced** > **Go to Eugenia Challenge (unsafe)**
4. Cliquez sur **Allow**

### Étape 10 : Intégrer dans l'application React

Dans votre fichier `src/App.jsx`, remplacez :
```javascript
const APP_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL'
```

par l'URL de votre web app déployé.

## 🔧 Test des endpoints

### Tester GET (leaderboard)

Depuis votre navigateur ou avec curl :
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=getLeaderboard
```

Vous devriez recevoir un JSON avec les données du leaderboard.

### Tester POST (action)

Avec curl ou Postman :
```bash
curl -X POST https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@campus.fr",
    "actionType": "linkedin",
    "postUrl": "https://www.linkedin.com/posts/test",
    "timestamp": "2024-01-01T00:00:00Z"
  }'
```

Vérifiez que la ligne a été ajoutée dans l'onglet "actions" de votre Sheet.

## 🔄 Mise à jour du déploiement

Lorsque vous modifiez le code Apps Script :
1. Cliquez sur **Deploy** > **Manage deployments**
2. Cliquez sur l'icône de modification (✏️)
3. Changez la version en **New version**
4. Mettez à jour la description
5. Cliquez sur **Deploy**

## 🛠️ Fonctions de test (optionnel)

Le script inclut des fonctions de test pour le débogage :

```javascript
// Tester la récupération du leaderboard
function testGetLeaderboard() {
  const result = getLeaderboard();
  Logger.log(result.getContent());
}

// Tester la soumission d'une action
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
```

## ⚠️ Notes importantes

- **Sécurité** : L'URL de votre web app est publique mais unique. Ne la partagez pas publiquement.
- **Limites** : Google Apps Script a des limites de quota. Pour un usage intensif, considérez une solution backend dédiée.
- **Permissions** : L'application peut lire et écrire dans votre Google Sheet. Assurez-vous que c'est le comportement souhaité.

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez que les onglets sont nommés exactement `leaderboard` et `actions`
2. Vérifiez que l'ID du Sheet est correct dans le code
3. Vérifiez que le déploiement est bien configuré en mode "Anyone"
4. Consultez les logs dans Apps Script : **View** > **Execution log**

