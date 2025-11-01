# 🚀 Déploiement Cloudflare Pages

## ✅ Prérequis terminés

- [x] Build OK (`npm run build`)
- [x] Variables d'environnement configurées
- [x] Apps Script CodeV2.gs prêt
- [x] Authentification admin fonctionnelle
- [x] Tous les imports async corrigés

---

## 🔐 Variables Cloudflare

**Ajoutez ces variables dans Cloudflare Pages** :

```
VITE_APP_SCRIPT_URL=https://script.google.com/macros/s/AKfycbyAwSriM-CgCiVVDnMj-GaqiakW1nlGmoGmoq0lFbVBTrZah6mcmV60GDQScmFpwOnC/exec
VITE_ADMIN_EMAIL=svelasquez@eugeniaschool.com
VITE_ADMIN_PASSWORD=!EugeniaSchool2025!Walid
```

---

## 📋 Méthodes de déploiement

### Méthode 1 : Via GitHub (recommandé)

#### 1.1 Créer repo GitHub

```bash
# Init git (si pas déjà fait)
git init

# Add all files
git add .

# Commit
git commit -m "Production ready - Eugenia Challenge"

# Push to GitHub
git remote add origin https://github.com/VOTRE_USERNAME/eugenia-challenge.git
git branch -M main
git push -u origin main
```

#### 1.2 Connecter à Cloudflare Pages

1. Allez sur https://dash.cloudflare.com
2. **Pages** → **Create a project** → **Connect to Git**
3. Sélectionnez votre repo GitHub
4. Configurez :
   - **Framework preset** : `Vite`
   - **Build command** : `npm run build`
   - **Build output directory** : `dist`
   - **Root directory** : `/` (ou laisser vide)

#### 1.3 Ajouter variables d'environnement

Dans **Environment Variables** :

**Production** :
```
VITE_APP_SCRIPT_URL=...
VITE_ADMIN_EMAIL=...
VITE_ADMIN_PASSWORD=...
```

**Preview** (optionnel, même chose) :
```
VITE_APP_SCRIPT_URL=...
VITE_ADMIN_EMAIL=...
VITE_ADMIN_PASSWORD=...
```

#### 1.4 Déployer

Clic **Save and Deploy**

---

### Méthode 2 : Via CLI Wrangler

#### 2.1 Installer Wrangler

```bash
npm install -g wrangler
```

#### 2.2 Login Cloudflare

```bash
wrangler login
```

#### 2.3 Créer projet

```bash
wrangler pages project create eugenia-challenge
```

#### 2.4 Déployer

```bash
# Build d'abord
npm run build

# Deploy
wrangler pages deploy dist --project-name=eugenia-challenge
```

#### 2.5 Configurer variables

Dans Cloudflare Dashboard :
- Pages → eugenia-challenge → Settings → Environment Variables
- Ajoutez les 3 variables

---

## 🧪 Tester le déploiement

### URLs à vérifier

1. **Home** : `https://votre-projet.pages.dev`
2. **Leaderboard** : `https://votre-projet.pages.dev/leaderboard`
3. **Submit** : `https://votre-projet.pages.dev/submit`
4. **Admin Login** : `https://votre-projet.pages.dev/admin/login`

### Tests fonctionnels

**Test 1 : Leaderboard**
- Vérifier l'affichage des étudiants
- Vérifier ex aequo fonctionne

**Test 2 : Soumission action**
- Soumettre une action via `/submit`
- Vérifier dans Google Sheet onglet `actions`

**Test 3 : Validation admin**
- Login admin
- Valider action
- Vérifier leaderboard mis à jour

**Test 4 : Console**
- Ouvrir DevTools
- Vérifier pas d'erreurs réseau

---

## 🔒 Sécurité

### Vérifications

- [x] `.env.local` dans `.gitignore`
- [x] Variables dans Cloudflare (pas commitées)
- [x] Apps Script : Who has access = "Anyone" (nécessaire pour CORS)

### Future amélioration

- Ajouter rate limiting dans Apps Script
- Implémenter CSRF protection
- Ajouter logging pour monitoring

---

## 📊 Monitoring

### Cloudflare Analytics

1. Dashboard → Pages → votre-projet
2. **Analytics** : Visites, erreurs
3. **Functions** : Logs (si fonctions utilisées)

### Google Sheets

- Ouvrir régulièrement pour vérifier données
- Vérifier structure onglets
- Backup régulier

### Erreurs courantes

| Erreur | Solution |
|--------|----------|
| `Failed to fetch` | Vérifier VITE_APP_SCRIPT_URL |
| `401 Unauthorized` | Vérifier authentification Cloudflare |
| `CORS error` | Apps Script doit être "Anyone" |
| `Build failed` | Vérifier npm ci dans Cloudflare |

---

## 🔄 Mises à jour futures

### Déployer nouvelles versions

**Via Git** :
```bash
git add .
git commit -m "Update"
git push
```
Cloudflare auto-déploie !

**Via CLI** :
```bash
npm run build
wrangler pages deploy dist --project-name=eugenia-challenge
```

### Rollback

Dans Cloudflare Dashboard :
- Pages → Deployments
- Trouver l'ancien build
- Clic "..." → "Retry deployment"

---

## 🎉 Production !

**URL de production** : `https://votre-projet.pages.dev`

**Identifiants admin** :
- Email: `svelasquez@eugeniaschool.com`
- Mot de passe: `!EugeniaSchool2025!Walid`

**Félicitations !** 🎊

---

## 📞 Support

- **Cloudflare Docs** : https://developers.cloudflare.com/pages
- **Wrangler Docs** : https://developers.cloudflare.com/workers/wrangler
- **Google Apps Script** : https://developers.google.com/apps-script

