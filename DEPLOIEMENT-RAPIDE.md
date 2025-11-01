# 🚀 Déploiement Rapide - Eugenia Challenge

## ⚡ Déploiement en 5 minutes !

### Option 1 : Cloudflare Pages (Gratuit)

#### Étape 1 : Build local
```bash
npm run build
```

#### Étape 2 : Connecter GitHub
1. Créer un repo GitHub
2. Push votre code
3. Aller sur https://pages.cloudflare.com
4. Connecter le repo

#### Étape 3 : Configurer
```
Framework Preset: Vite
Build Command: npm run build
Build Output Directory: dist
Root Directory: /
Node Version: 18
```

#### Étape 4 : Deploy !
Cliquer sur **Save and Deploy**

**URL** : `https://votre-repo.pages.dev`

---

### Option 2 : Vercel (Alternative gratuite)

#### Via CLI
```bash
npm install -g vercel
vercel
```

Suivre les instructions.

**URL** : `https://votre-repo.vercel.app`

---

### Option 3 : Netlify (Alternative gratuite)

```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## ⚙️ Configuration Variables d'environnement

**Pour MVP localStorage** : PAS BESOIN de variables

**Pour Google Sheets** (à ajouter plus tard) :
```
VITE_APP_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
VITE_SHEET_ID=votre_sheet_id
```

---

## 📊 Après déploiement

### URLs importantes
- **Homepage** : `https://votre-repo.pages.dev`
- **Leaderboard** : `https://votre-repo.pages.dev/leaderboard`
- **Submit** : `https://votre-repo.pages.dev/submit`
- **Admin** : `https://votre-repo.pages.dev/admin/login`

### Identifiants Admin
```
Email: svelasquez@eugeniaschool.com
Pass: !EugeniaSchool2025!Walid
```

---

## ✅ Test après déploiement

1. Visiter l'URL de production
2. Tester soumission d'action
3. Se connecter en admin
4. Valider une action
5. Vérifier le leaderboard

**Tout fonctionne ?** 🎉 **C'est en ligne !**

---

## 🔄 Mise à jour continue

Chaque push sur `main` → Auto-deploy

---

## 📝 Notes

**localStorage** : Les données persistent par navigateur
**Pour partage entre utilisateurs** : Connecter Google Sheets (plus tard)

---

**C'est prêt ! Lancez le déploiement !** 🚀

