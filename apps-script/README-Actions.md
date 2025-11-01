# Apps Script - Configuration pour soumissions d'actions

## 📋 Instructions de déploiement

Ce script gère les soumissions d'actions depuis le formulaire React de l'application Eugenia Challenge.

### Étape 1 : Créer votre Google Sheet

1. Créez un nouveau Google Sheet sur [sheets.google.com](https://sheets.google.com)
2. Notez l'ID du Sheet (visible dans l'URL : `https://docs.google.com/spreadsheets/d/[ID_ICI]/edit`)
3. Créez un onglet nommé exactement : `actions`

**Optionnel** : Vous pouvez aussi créer un onglet `leaderboard` pour la table des scores (voir README.md principal)

### Étape 2 : Configurez l'onglet "actions"

Le script créera automatiquement l'onglet s'il n'existe pas avec les colonnes suivantes :

| Colonne | Description |
|---------|-------------|
| Timestamp | Date et heure de la soumission |
| Email | Email de l'étudiant |
| Type d'action | linkedin, jpo, hackathon, association |
| Post URL | Lien du post LinkedIn (si applicable) |
| Date | Date de la JPO (si applicable) |
| Heure | Heure de la JPO (si applicable) |
| Nom événement | Nom du hackathon/événement (si applicable) |
| Type événement | Type d'événement (si applicable) |
| Nom association | Nom de l'association (si applicable) |
| Détails JSON | Tous les détails en format JSON |

**Note** : Les colonnes seront créées automatiquement avec des couleurs selon le type d'action :
- 🔵 LinkedIn : Bleu
- 🟢 JPO : Vert
- 🟠 Hackathon : Orange
- 🟣 Association : Violet

### Étape 3 : Ouvrir Apps Script

1. Dans votre Google Sheet, allez dans **Extensions** > **Apps Script**
2. Cliquez sur **+** pour créer un nouveau fichier
3. Nommez-le `CodeActions`

### Étape 4 : Copier le code

Copiez tout le contenu du fichier `CodeActions.gs` et collez-le dans l'éditeur Apps Script.

### Étape 5 : Remplacer le SHEET_ID

1. Dans le fichier, trouvez la ligne :
   ```javascript
   const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
   ```
2. Remplacez `YOUR_GOOGLE_SHEET_ID` par l'ID de votre Google Sheet (visible dans l'URL)

### Étape 6 : Sauvegarder le projet

1. Cliquez sur **File** > **Save** ou utilisez le raccourci `Ctrl+S`
2. Donnez un nom à votre projet (ex: "Eugenia Challenge Actions")

### Étape 7 : Déployer l'application

1. Cliquez sur **Deploy** > **New deployment**
2. Cliquez sur l'icône de paramètres (⚙️) à côté de "Select type"
3. Cliquez sur **Enable deployment types**
4. Sélectionnez **Web app** comme type de déploiement
5. Donnez une description (ex: "Version 1.0 - Actions")
6. Configurez les paramètres :
   - **Execute as**: Me (votre compte Google)
   - **Who has access**: Anyone (permet l'accès public sans authentification)
7. Cliquez sur **Deploy**
8. **Copiez l'URL du web app déployé** - vous en aurez besoin pour l'application React

### Étape 8 : Autoriser les permissions

Lors de la première déploiement, Google vous demandera d'autoriser l'accès :
1. Cliquez sur **Authorize access**
2. Sélectionnez votre compte Google
3. Cliquez sur **Advanced** > **Go to Eugenia Challenge (unsafe)**
4. Cliquez sur **Allow**

### Étape 9 : Intégrer dans l'application React

Dans votre fichier `src/components/ActionForm.jsx`, remplacez :

```javascript
// Décommenter ces lignes (lignes 77-83):
const response = await fetch(appScriptUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})

if (!response.ok) throw new Error('Erreur lors de la soumission')
```

Et assurez-vous que l'`appScriptUrl` dans `App.jsx` pointe vers cette nouvelle URL.

## 🔧 Test des endpoints

### Tester avec curl ou Postman

```bash
curl -X POST https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@campus.fr",
    "actionType": "linkedin",
    "postUrl": "https://www.linkedin.com/posts/test",
    "timestamp": "2024-10-15T10:00:00Z"
  }'
```

### Tester avec les fonctions intégrées

Vous pouvez utiliser les fonctions de test dans Apps Script :

1. Dans l'éditeur Apps Script, sélectionnez la fonction `testSubmitAction`
2. Cliquez sur **Run** (▶️)
3. Autorisez les permissions si nécessaire
4. Vérifiez les logs dans **View** > **Execution log**

Pour tester tous les types d'actions :
1. Sélectionnez la fonction `testAllActionTypes`
2. Cliquez sur **Run**
3. Vérifiez que les lignes ont été ajoutées dans votre Google Sheet

## 📊 Format des données reçues

### Post LinkedIn
```json
{
  "email": "etudiant@campus.fr",
  "actionType": "linkedin",
  "postUrl": "https://www.linkedin.com/posts/test",
  "timestamp": "2024-10-15T10:00:00Z"
}
```

### Participation JPO
```json
{
  "email": "etudiant@campus.fr",
  "actionType": "jpo",
  "date": "2024-10-15",
  "time": "14:00",
  "timestamp": "2024-10-15T10:00:00Z"
}
```

### Hackathon/Événement
```json
{
  "email": "etudiant@campus.fr",
  "actionType": "hackathon",
  "eventName": "Hackathon Campus",
  "eventType": "Hackathon",
  "timestamp": "2024-10-15T10:00:00Z"
}
```

### Association
```json
{
  "email": "etudiant@campus.fr",
  "actionType": "association",
  "associationName": "BDE Campus",
  "timestamp": "2024-10-15T10:00:00Z"
}
```

## 🔄 Mise à jour du déploiement

Lorsque vous modifiez le code Apps Script :
1. Cliquez sur **Deploy** > **Manage deployments**
2. Cliquez sur l'icône de modification (✏️)
3. Changez la version en **New version**
4. Mettez à jour la description
5. Cliquez sur **Deploy**

## 🎨 Fonctionnalités

- ✅ Sauvegarde automatique de toutes les soumissions
- ✅ Formatage coloré selon le type d'action
- ✅ Timestamp automatique pour chaque soumission
- ✅ Sauvegarde de tous les détails en JSON pour flexibilité
- ✅ Validation et gestion d'erreurs

## 📊 Gestion des points

Les actions soumises doivent être **validées manuellement** par un administrateur :

1. Allez dans votre Google Sheet
2. Consultez l'onglet `actions`
3. Pour chaque action, attribuez des points dans l'onglet `leaderboard`
4. (Optionnel) Créez un script pour automatiser l'attribution des points

## ⚠️ Notes importantes

- **Sécurité** : L'URL de votre web app est publique mais unique. Ne la partagez pas publiquement.
- **Limites** : Google Apps Script a des limites de quota. Pour un usage intensif, considérez une solution backend dédiée.
- **Permissions** : L'application peut écrire dans votre Google Sheet. Assurez-vous que c'est le comportement souhaité.
- **Validation** : Les soumissions sont automatiquement enregistrées avec le statut "Pending". Vous devrez valider manuellement et attribuer les points.

## 🛠️ Dépannage

### Les soumissions ne s'enregistrent pas

1. Vérifiez que le `SHEET_ID` est correct dans le code
2. Vérifiez que le déploiement est bien configuré en mode "Anyone"
3. Consultez les logs dans Apps Script : **View** > **Execution log**
4. Vérifiez que l'onglet `actions` existe ou sera créé automatiquement

### Erreurs de permissions

1. Allez dans **Execute** > **All** > **Grant access**
2. Autorisez toutes les permissions requises
3. Redéployez le script si nécessaire

### Format des données incorrect

Le script est conçu pour être flexible. Tous les champs sont optionnels sauf `email` et `actionType`. Les données supplémentaires sont stockées dans la colonne "Détails JSON".

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs dans Apps Script : **View** > **Execution log**
2. Testez avec les fonctions de test intégrées
3. Vérifiez que le format JSON est correct dans vos requêtes

