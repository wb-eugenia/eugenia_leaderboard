# 🚀 Déploiement rapide - Eugenia Challenge

## ✅ Checklist finale avant déploiement

### Code
- [x] Build OK
- [x] Pas d'erreurs lint
- [x] Imports async corrigés
- [x] Authentication admin fonctionnelle
- [x] Variables d'environnement configurées

### Backend
- [x] Google Apps Script CodeV2.gs
- [x] Web App déployé
- [x] URL Apps Script configurée
- [x] Google Sheet créé
- [x] Étudiants importés

### Frontend
- [x] React + Vite
- [x] TailwindCSS
- [x] React Router
- [x] React Hook Form
- [x] Tous les composants admin

---

## 🔐 Configuration .env

**Important** : Créez `.env.local` avec :

```bash
VITE_APP_SCRIPT_URL=https://script.google.com/macros/s/VOTRE_ID/exec
VITE_ADMIN_EMAIL=svelasquez@eugeniaschool.com
VITE_ADMIN_PASSWORD=!EugeniaSchool2025!Walid
```

---

## 🧪 Tests locaux

```bash
npm run dev
```

Tester :
- http://localhost:5173
- http://localhost:5173/leaderboard
- http://localhost:5173/submit
- http://localhost:5173/admin/login

---

## 📦 Build production

```bash
npm run build
```

Vérifier :
- Pas d'erreurs
- Dossier `dist/` créé
- Fichiers CSS/JS optimisés

---

## 🌐 Déploiement Cloudflare

### Option 1 : GitHub (recommandé)

1. Push vers GitHub
2. Connecter repo à Cloudflare Pages
3. Config :
   - Build: `npm run build`
   - Output: `dist`
   - Framework: Vite
4. Ajouter variables d'env
5. Deploy

### Option 2 : CLI

```bash
npm install -g wrangler
wrangler login
npm run build
wrangler pages deploy dist
```

**Consultez** `CLOUDFLARE-DEPLOY.md` pour détails complets.

---

## 📁 Structure des fichiers

```
eugenia-challenge/
├── src/
│   ├── components/
│   │   ├── admin/           # Panel admin
│   │   ├── student/         # Interface étudiante
│   │   └── shared/          # Composants partagés
│   ├── pages/               # Pages React Router
│   ├── services/            # API Google Sheets
│   ├── config/              # Configuration
│   └── App.jsx              # Router principal
├── apps-script/
│   ├── CodeV2.gs            # Backend Apps Script
│   └── Code.gs              # Ancienne version (ignore)
├── dist/                    # Build production
├── .env.local               # Variables locales (NE PAS COMMIT)
├── package.json
└── vite.config.js
```

---

## 🔄 Workflow

### Dev local
```bash
npm run dev
```

### Production
```bash
npm run build
wrangler pages deploy dist
```

### Update
```bash
git add .
git commit -m "Update"
git push
# Cloudflare auto-déploie
```

---

## 📊 Google Sheets Structure

### Onglet `leaderboard`

| firstName | lastName | classe | email | totalPoints | actionsCount | lastUpdate |
|-----------|----------|--------|-------|-------------|--------------|------------|
| Orehn     | Ansellem | B1     | oansellem@... | 0 | 0 | |

### Onglet `actions`

| id | email | type | data | status | date | decision | points | comment | validatedBy | validatedAt |
|----|-------|------|------|--------|------|----------|--------|---------|-------------|-------------|
| act_... | wbouzidane@... | linkedin-post | {...} | pending | ... | | 0 | | | |

---

## 🎯 URLs importantes

**Local** :
- Home: http://localhost:5173
- Admin: http://localhost:5173/admin/login

**Production** :
- Home: https://votre-projet.pages.dev
- Admin: https://votre-projet.pages.dev/admin/login

---

## 🔒 Identifiants

**Admin** :
- Email: `svelasquez@eugeniaschool.com`
- Password: `!EugeniaSchool2025!Walid`

⚠️ **Changez ces identifiants en production !**

---

## 📚 Documentation

- **Guide déploiement complet** : `GUIDE-DEPLOIEMENT-COMPLET.md`
- **Guide Cloudflare** : `CLOUDFLARE-DEPLOY.md`
- **Configuration Google Sheets** : `apps-script/README.md`
- **Intégration** : `INTEGRATION-COMPLETE.md`
- **Test** : `TEST-GOOGLE-SHEETS.md`

---

## ✅ Tout est prêt !

**Prochaine étape** : Déployez sur Cloudflare Pages !

```bash
# Build
npm run build

# Deploy
wrangler pages deploy dist --project-name=eugenia-challenge
```

🎉 **Bon déploiement !**

