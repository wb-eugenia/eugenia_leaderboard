# ⚡ Actions Immédiates - Production

## 🎯 CE QUE VOUS DEVEZ FAIRE MAINTENANT

### Étape 1 : Créer votre Google Sheet (10min)

1. Allez sur https://sheets.google.com
2. Créez un nouveau fichier : **"Eugenia Challenge Data"**
3. **Notez l'ID** dans l'URL :
   ```
   https://docs.google.com/spreadsheets/d/[THIS_IS_YOUR_ID]/edit
   ```

### Étape 2 : Créer les 2 onglets (5min)

#### Onglet `leaderboard`

1. Renommez le premier onglet : **"leaderboard"**
2. Ligne 1, tapez ces en-têtes :
   ```
   firstName | lastName | classe | email | totalPoints | actionsCount | lastUpdate
   ```
3. Ligne 2+, copiez vos 35 étudiants :
   ```
   Orehn	Ansellem	B1	oansellem@eugeniaschool.com	0	0
   Corentin	Ballonad	B1	cballonad@eugeniaschool.com	0	0
   ... (et 33 autres)
   ```

**Format** : Colonnes séparées par TAB dans Sheets

#### Onglet `actions`

1. Cliquez sur **"+ Onglet"** (bas de page)
2. Renommez : **"actions"**
3. Ligne 1, tapez :
   ```
   id | email | type | data | status | date | decision | points | comment | validatedBy | validatedAt
   ```

**⚠️ IMPORTANT** : Les noms d'onglets doivent être EXACTEMENT `leaderboard` et `actions` (miniscule)

---

### Étape 3 : Déployer Apps Script (10min)

1. Dans votre Google Sheet : **Extensions** > **Apps Script**
2. Supprimez tout le code par défaut
3. Ouvrez le fichier `apps-script/CodeV2.gs` sur votre ordinateur
4. Copiez TOUT le contenu (Ctrl+A, Ctrl+C)
5. Collez dans Apps Script (Ctrl+V)
6. **LIGNE 9** : Remplacez :
   ```javascript
   const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
   ```
   Par :
   ```javascript
   const SHEET_ID = 'VOTRE_ID_COPIE_ETAPE_1';
   ```
7. **Save** (Ctrl+S)

---

### Étape 4 : Deploy Web App (5min)

1. Dans Apps Script : **Deploy** > **New deployment**
2. Cliquez sur l'icône **⚙️** (Settings)
3. Cliquez sur **"Enable deployment types"**
4. Cochez **"Web app"**
5. Cliquez **"Next"**
6. Configuration :
   - **Description** : `V1 - Production`
   - **Execute as** : **Me**
   - **Who has access** : **Anyone**
7. Cliquez **"Deploy"**
8. **"Authorize access"** → Sélectionnez votre compte
9. **"Advanced"** → **"Go to Eugenia Challenge (unsafe)"**
10. **"Allow"**
11. **COPIEZ l'URL** (ressemble à `https://script.google.com/macros/s/ABCDE.../exec`)

---

### Étape 5 : Configurer React (2min)

1. À la racine du projet, créez `.env.local`
2. Ajoutez :
   ```bash
   VITE_APP_SCRIPT_URL=https://script.google.com/macros/s/VOTRE_ID_COPIE_ETAPE_4/exec
   ```
3. Remplacez `VOTRE_ID_COPIE_ETAPE_4` par l'URL complète copiée

---

### Étape 6 : Tester local (5min)

1. Redémarrez le serveur :
   ```bash
   npm run dev
   ```
2. Allez sur http://localhost:5173
3. **Test 1** : `/leaderboard` → Vérifiez que vos étudiants apparaissent
4. **Test 2** : `/submit` → Soumettez une action
5. **Test 3** : Ouvrez votre Google Sheet onglet `actions` → Vérifiez l'action créée
6. **Test 4** : `/admin/login` → Connectez-vous
7. **Test 5** : `/admin/validate` → Validez l'action
8. **Test 6** : `/leaderboard` → Vérifiez les points ajoutés

---

### Étape 7 : Deploy Production (10min)

#### Via GitHub (recommandé)

1. Créez un repo GitHub
2. Dans Cloudflare Pages : **Connect repository**
3. Configuration :
   - Build command: `npm run build`
   - Build output: `dist`
   - Node version: 18
4. **Environment Variables** :
   - Name: `VITE_APP_SCRIPT_URL`
   - Value: Votre URL Apps Script
5. **Save and Deploy**

---

## ✅ Checklist

- [ ] Google Sheet créé
- [ ] 2 onglets créés (`leaderboard`, `actions`)
- [ ] 35 étudiants importés
- [ ] Apps Script CodeV2.gs déployé
- [ ] SHEET_ID configuré
- [ ] Web App déployé
- [ ] Permissions autorisées
- [ ] URL Web App copiée
- [ ] .env.local créé et configuré
- [ ] Tests locaux passés
- [ ] Cloudflare Pages configuré
- [ ] Variable d'env Cloudflare configurée
- [ ] Deploy production OK
- [ ] Tests production passés

---

## ⏱️ Temps total estimé : 45min

**Suivez ces étapes dans l'ordre et vous serez en production !** 🚀

---

## 🆘 Besoin d'aide ?

Consultez :
- `GUIDE-DEPLOIEMENT-COMPLET.md` (détaillé)
- `GOOGLE-SHEETS-SETUP.md` (structure Sheets)
- `DEPLOIEMENT-RAPIDE.md` (alternative)

---

**C'est parti ! 🎉**

