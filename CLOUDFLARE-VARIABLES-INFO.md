# 🔐 Configuration des variables Cloudflare Pages

## ✅ Déploiement réussi !

**URL de production** : https://7406fd8e.eugenia-challenge.pages.dev  
**URL custom** : https://eugenia-challenge.pages.dev

---

## ⚠️ IMPORTANT : Configuration des variables

**Wrangler CLI ne supporte pas les variables d'environnement pour Pages.**

**Vous devez les configurer manuellement dans le Dashboard Cloudflare.**

---

## 📋 Variables à ajouter

Allez sur : https://dash.cloudflare.com

1. **Pages** → **eugenia-challenge** → **Settings**
2. **Environment Variables**
3. **Add variable** pour chaque variable :

### Production

```
Nom: VITE_APP_SCRIPT_URL
Valeur: https://script.google.com/macros/s/AKfycbyAwSriM-CgCiVVDnMj-GaqiakW1nlGmoGmoq0lFbVBTrZah6mcmV60GDQScmFpwOnC/exec
```

```
Nom: VITE_ADMIN_EMAIL
Valeur: svelasquez@eugeniaschool.com
```

```
Nom: VITE_ADMIN_PASSWORD
Valeur: !EugeniaSchool2025!Walid
```

### Preview (optionnel, mêmes valeurs)

Activez aussi pour preview si vous voulez tester sur branches

---

## 🔄 Après avoir ajouté les variables

### Option 1 : Attendre auto-redeploy
- Cloudflare va automatiquement redéployer
- Attendez 1-2 minutes

### Option 2 : Redéployer manuellement

```bash
npm run build
wrangler pages deploy dist --project-name=eugenia-challenge
```

---

## 🧪 Tester

Une fois les variables ajoutées et redéployé :

**URLs** :
- https://eugenia-challenge.pages.dev
- https://eugenia-challenge.pages.dev/leaderboard
- https://eugenia-challenge.pages.dev/submit
- https://eugenia-challenge.pages.dev/admin/login

**Identifiants admin** :
- Email: svelasquez@eugeniaschool.com
- Password: !EugeniaSchool2025!Walid

---

## 🎯 Prochaines étapes

1. ✅ Configurer les 3 variables dans Cloudflare Dashboard
2. ✅ Redéployer (optionnel)
3. ✅ Tester l'app en production
4. ✅ Partager l'URL avec les étudiants

---

**Consultez** `START-HERE.md` pour plus de détails.

