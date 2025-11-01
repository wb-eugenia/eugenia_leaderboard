# 🚀 Démarrage Rapide - Eugenia Challenge V2

## Installation

```bash
# Installer les dépendances (déjà fait normalement)
npm install

# Lancer l'application
npm run dev
```

## Accès

### Interface Étudiante
- **Accueil** : http://localhost:3000
- **Classement** : http://localhost:3000/leaderboard
- **Soumettre** : http://localhost:3000/submit

### Interface Admin ⭐
- **Dashboard** : http://localhost:3000/admin
- **Validation** : http://localhost:3000/admin/validate
- **Types d'actions** : http://localhost:3000/admin/actions
- **Leaderboard** : http://localhost:3000/admin/leaderboard

## Test Rapide

### 1. Soumettre une action
```
1. Va sur /submit
2. Email : walid.bouzidane@eugeniaschool.com
3. Type : 📱 Post LinkedIn
4. Lien : https://linkedin.com/test
5. Clique "Soumettre"
```

### 2. Valider l'action
```
1. Va sur /admin/validate
2. Tu vois ton action
3. Clique "Voir détails"
4. Clique "✅ Valider"
5. Vérifie le leaderboard
```

### 3. Configurer un type
```
1. Va sur /admin/actions
2. Clique "➕ Nouveau type"
3. Configure :
   - Emoji : 🎬
   - Nom : Vidéo YouTube
   - Points : 75
4. Ajoute des champs
5. Enregistre
6. Teste dans /submit
```

### 4. Gérer les étudiants
```
1. Va sur /admin/leaderboard
2. Clique "➕ Ajouter"
3. Ajoute un étudiant
4. Modifie ses points
5. Vérifie dans /leaderboard
```

## Fonctionnalités

### ✅ Étudiant
- Soumettre des actions
- Voir le classement
- Formulaire dynamique

### ✅ Admin
- Valider/refuser les actions
- Gérer les types d'actions
- **Gérer les étudiants** ⭐
- Dashboard avec stats

## Stockage

Actuellement en **localStorage** (simulation Google Sheets).

Pour réinitialiser :
```javascript
localStorage.clear()
// Recharger la page
```

## Structure

```
src/
├── pages/              ✅ HomePage, LeaderboardPage, SubmitActionPage
├── components/
│   ├── admin/          ✅ ValidationQueue, ActionDetailModal, ActionTypeEditor, LeaderboardConfig
│   └── student/        ✅ Leaderboard
├── services/           ✅ googleSheets, configService, validationService
└── config/             ✅ defaultConfig
```

## Prochaines étapes

- Authentification admin
- Intégration Google Sheets API
- Envoi emails
- Déploiement Cloudflare

---

**Tout fonctionne ! 🎉**

