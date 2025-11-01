# 📊 Configuration Google Sheets

## 🎯 Vue d'ensemble

**Toutes les données admin sont stockées dans Google Sheets !**

L'application utilise Google Apps Script comme backend API pour lire et écrire dans Google Sheets.

---

## 🔗 Votre configuration

**Google Sheet ID** : `1Ez2twfio9nCmkZhrB1jdTvchEh6XSVNjkdwQUF2IoLM`

**URL Google Sheet** : https://docs.google.com/spreadsheets/d/1Ez2twfio9nCmkZhrB1jdTvchEh6XSVNjkdwQUF2IoLM/edit

**Apps Script URL** : `VITE_APP_SCRIPT_URL` dans `.env.local`

---

## 📋 Structure Google Sheets

### Onglet `leaderboard`
Classement des étudiants

| A (Prénom) | B (Nom) | C (Classe) | D (Email) | E (Points) | F (Actions) | G (LastUpdate) |
|------------|---------|------------|-----------|------------|-------------|----------------|

### Onglet `actions`
Soumissions d'actions

| A (ID) | B (Email) | C (Type) | D (Data) | E (Status) | F (Date) | G (Decision) | H (Points) | I (Comment) | J (ValidatedBy) | K (ValidatedAt) |
|--------|-----------|----------|----------|------------|----------|--------------|------------|-------------|-----------------|-----------------|

### Onglet `config`
Configuration admin (créé automatiquement)

| A (Key) | B (Value) |
|---------|-----------|
| totalPrizePool | "+500€" |
| deadline | "31 janvier 2026" |
| actionTypes | [...] |
| rewards | [...] |
| automations | [...] |
| landingTexts | {...} |

---

## 🚀 Configuration Apps Script

### Étape 1 : Ouvrir Apps Script

1. Ouvrez votre Google Sheet
2. **Extensions** > **Apps Script**

### Étape 2 : Copier le code

1. Ouvrez `apps-script/CodeV2.gs` dans votre éditeur
2. Sélectionnez tout (Ctrl+A)
3. Copiez (Ctrl+C)
4. Collez dans Apps Script (Ctrl+V)
5. **Sauvegardez** (Ctrl+S)

### Étape 3 : Déployer

1. **Deploy** > **New deployment**
2. ⚙️ à côté de "Select type"
3. "Enable deployment types"
4. **Web app**
5. Configurez :
   - Execute as: `Me`
   - Who has access: `Anyone` ⚠️ Important !
6. **Deploy**
7. **Autorisez** les permissions
8. **Copiez l'URL** du Web App

### Étape 4 : Configurer .env.local

```bash
VITE_APP_SCRIPT_URL=https://script.google.com/macros/s/VOTRE_ID/exec
VITE_ADMIN_EMAIL=svelasquez@eugeniaschool.com
VITE_ADMIN_PASSWORD=!EugeniaSchool2025!Walid
```

### Étape 5 : Importer les étudiants

1. Dans Apps Script, créez un nouveau fichier
2. Copiez le contenu de `docs/IMPORT-STUDENTS-SHEET.js`
3. Menu déroulant : sélectionnez "importStudents"
4. Cliquez **Run** ▶️
5. Autorisez si demandé
6. Attendez "Students imported successfully!"

---

## 🧪 Tests

### Test 1 : Apps Script direct

Ouvrez dans navigateur :
```
https://script.google.com/macros/s/VOTRE_ID/exec?action=getLeaderboard
```

**Attendu** : JSON avec les étudiants

---

### Test 2 : App locale

```bash
npm run dev
```

1. http://localhost:5173/leaderboard
2. Vérifiez que les étudiants apparaissent
3. Console (F12) : Pas d'erreurs

---

### Test 3 : Admin

1. http://localhost:5173/admin/login
2. Connectez-vous
3. Modifiez une configuration
4. Vérifiez dans Google Sheets que c'est sauvegardé

---

## 🔄 Workflow de données

### Enregistrement (écriture)
1. **Utilisateur** modifie dans l'admin
2. **Frontend** envoie `fetch()` POST à Apps Script
3. **Apps Script** écrit dans Google Sheets
4. **Données sauvegardées** ✅

### Affichage (lecture)
1. **Frontend** charge page admin
2. **Frontend** envoie `fetch()` GET à Apps Script
3. **Apps Script** lit Google Sheets
4. **Frontend** affiche les données ✅

**Toutes les modifications sont synchronisées en temps réel !**

---

## 🐛 Dépannage

### "Apps Script fetch failed"
**Cause** : Apps Script non déployé ou URL incorrecte  
**Solution** : Vérifiez `.env.local` et re-déployez Apps Script

### "config sheet not found"
**Cause** : Onglet config non créé  
**Solution** : C'est normal ! Il sera créé au premier enregistrement

### Erreur CORS
**Cause** : "Who has access" pas "Anyone"  
**Solution** : Re-déployez avec "Anyone"

### Données vides
**Cause** : Sheet vide ou étudiants non importés  
**Solution** : Exécutez `importStudents()` dans Apps Script

---

## ✅ Checklist

- [ ] Google Sheet créé
- [ ] 3 onglets : leaderboard, actions, config (créé auto)
- [ ] Code CodeV2.gs dans Apps Script
- [ ] SHEET_ID configuré (ligne 9)
- [ ] Web App déployé
- [ ] Permissions autorisées
- [ ] .env.local configuré
- [ ] Students importés
- [ ] Tests OK

---

## 📞 Support

**Documentation** :
- Apps Script : https://developers.google.com/apps-script
- Google Sheets API : https://developers.google.com/sheets

**En cas de problème** : Vérifiez les logs dans Apps Script (Executions)

