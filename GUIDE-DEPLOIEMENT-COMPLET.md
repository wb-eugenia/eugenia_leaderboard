# 🚀 Guide de Déploiement Complet - Production

## ✅ Ce qui est fait

- ✅ **Apps Script CodeV2.gs** : Code complet prêt
- ✅ **googleSheets.js** : Intégration Apps Script + fallback localStorage
- ✅ **Tous les appels async** : Corrigés
- ✅ **Build** : OK, pas d'erreurs
- ✅ **Authentification admin** : Fonctionnelle
- ✅ **Export .env template** : Disponible

---

## 📋 Étapes de déploiement

### Étape 1 : Créer Google Sheet

1. Allez sur https://sheets.google.com
2. Créez un nouveau fichier : `Eugenia Challenge Data`
3. Notez l'ID dans l'URL :
   ```
   https://docs.google.com/spreadsheets/d/[ID_ICI]/edit
   ```

### Étape 2 : Créer les onglets

#### Onglet `leaderboard`

**Ligne 1 (en-têtes)** :
```
firstName | lastName | classe | email | totalPoints | actionsCount | lastUpdate
```

**Lignes suivantes (données)** : Importez vos 35 étudiants
```
Orehn | Ansellem | B1 | oansellem@eugeniaschool.com | 0 | 0 |
Corentin | Ballonad | B1 | cballonad@eugeniaschool.com | 0 | 0 |
...
```

**Format** :
- 7 colonnes exactement
- Colonnes D, E, F, G peuvent rester vides initialement
- L'application les remplira automatiquement

#### Onglet `actions`

**Ligne 1 (en-têtes)** :
```
id | email | type | data | status | date | decision | points | comment | validatedBy | validatedAt
```

**Lignes suivantes** : Vide pour l'instant, rempli automatiquement

---

### Étape 3 : Déployer Apps Script

1. Dans votre Google Sheet : **Extensions** > **Apps Script**
2. Supprimez tout le code par défaut
3. Copiez le contenu de `apps-script/CodeV2.gs`
4. **CRUCIAL** : Ligne 9, remplacez :
   ```javascript
   const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
   ```
   Par votre ID de Sheet
5. Sauvegardez (Ctrl+S ou File > Save)

---

### Étape 4 : Déployer Web App

1. Dans Apps Script : **Deploy** > **New deployment**
2. Cliquez sur l'icône **⚙️** à côté de "Select type"
3. **Enable deployment types**
4. Sélectionnez **Web app**
5. Configuration :
   - **Description** : `Eugenia Challenge V2 - Production`
   - **Execute as** : **Me**
   - **Who has access** : **Anyone**
6. Cliquez **Deploy**
7. **Autorisez** quand demandé
8. **COPIEZ l'URL Web App** (ressemble à `https://script.google.com/macros/s/XXXXX/exec`)

---

### Étape 5 : Configurer React App

1. Créez `.env.local` à la racine du projet
2. Ajoutez :
   ```bash
   VITE_APP_SCRIPT_URL=https://script.google.com/macros/s/VOTRE_ID/exec
   ```
3. Remplacez `VOTRE_ID` par l'URL que vous avez copiée

---

### Étape 6 : Tester localement

```bash
npm run dev
```

**URLs à tester** :
- http://localhost:5173
- http://localhost:5173/leaderboard
- http://localhost:5173/submit
- http://localhost:5173/admin/login

**Test 1** : Submit action
1. `/submit`
2. Soumettez une action
3. Vérifiez dans votre Google Sheet onglet `actions`

**Test 2** : Validate
1. `/admin/login` (svelasquez@eugeniaschool.com / !EugeniaSchool2025!Walid)
2. `/admin/validate`
3. Validez une action
4. Vérifiez leaderboard mis à jour

**Test 3** : Leaderboard
1. `/leaderboard`
2. Vérifiez affichage

---

### Étape 7 : Déployer sur Cloudflare

#### Option A : Via GitHub (recommandé)

1. Créez un repo GitHub
2. Push votre code :
   ```bash
   git init
   git add .
   git commit -m "Production ready"
   git remote add origin VOTRE_REPO_URL
   git push -u origin main
   ```
3. Sur https://pages.cloudflare.com :
   - **Connect repo**
   - Config :
     - Build command: `npm run build`
     - Build output: `dist`
     - Framework: Vite
     - Node version: 18
   - **Add environment variable** :
     - Name: `VITE_APP_SCRIPT_URL`
     - Value: Votre URL Apps Script
   - **Save and Deploy**

#### Option B : Via CLI

```bash
npm install -g wrangler
wrangler pages deploy dist
```

---

## ✅ Checklist finale

- [ ] Google Sheet créé avec 2 onglets
- [ ] 35 étudiants importés
- [ ] Apps Script CodeV2.gs déployé
- [ ] SHEET_ID configuré
- [ ] Web App URL obtenu
- [ ] .env.local configuré
- [ ] Tests locaux passés
- [ ] Deploy Cloudflare OK
- [ ] Variables d'env Cloudflare configurées
- [ ] Tests production passés

---

## 🎉 C'est en ligne !

**URL de production** : `https://votre-repo.pages.dev`

**Identifiants admin** :
- Email: `svelasquez@eugeniaschool.com`
- Pass: `!EugeniaSchool2025!Walid`

---

## 🔄 Auto-validation (optionnel)

**Pour plus tard** : Implémenter `checkExternalSheet` pour vérifier Sheets externes.

---

## 📊 Monitoring

**Google Sheets** : Ouvrez régulièrement pour vérifier les données
**Cloudflare Analytics** : Activez dans le dashboard
**Console browser** : Vérifiez les erreurs réseau

---

**Félicitations ! Votre plateforme est en production !** 🎊

