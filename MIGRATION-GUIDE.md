# 📚 Guide de Migration - Refonte Eugenia Challenge

## Vue d'ensemble

La nouvelle version transforme Eugenia Challenge en une **plateforme moderne et scalable** avec :
- Interface admin intégrée
- Validation des actions dans l'app web
- Configuration 100% UI
- Design system cohérent avec TailwindCSS

---

## Architecture

### Avant (V1)
```
React (Vite) + CSS vanilla
  ↓
Google Apps Script (endpoints GET/POST)
  ↓
Google Sheets (2 onglets : leaderboard, actions)
```

### Après (V2)
```
React 18 + TailwindCSS + React Router
  ↓
Services (localStorage mock → Google Sheets API)
  ↓
Multi-pages + Interface admin
  ↓
Configuration centralisée (localStorage + Sheets)
```

---

## Fichiers conservés

Ces fichiers gardent leur utilité :
- `apps-script/Code.gs` : À adapter pour la nouvelle structure
- `FormConfig-Example.csv` : Compatible avec le nouveau système
- `README.md` : Documentation principale
- `vercel.json` : Configuration déploiement

---

## Structure des nouvelles pages

### Pages étudiantes

#### `HomePage.jsx` (/)
- Hero section avec stats
- CTAs vers leaderboard et soumission
- Branding Eugenia

#### `LeaderboardPage.jsx` (/leaderboard)
- Affichage du classement
- Tri automatique
- Top 3 avec médailles

#### `SubmitActionPage.jsx` (/submit)
- Formulaire de soumission dynamique
- Validation email @eugeniaschool.com
- Champs adaptatifs selon type d'action

### Pages admin (à venir)
- `/admin` : Dashboard
- `/admin/validate` : File de validation ⭐
- `/admin/actions` : Config types d'actions
- `/admin/leaderboard` : Config leaderboard
- `/admin/automations` : Config automatisations

---

## Services

### `configService.js`
Gestion centralisée de la configuration :
```javascript
import { getActionTypes, saveActionType } from './services/configService';

// Charger les types d'actions
const types = getActionTypes();

// Ajouter/modifier un type
saveActionType(newType);
```

### `googleSheets.js`
Abstraction Google Sheets :
```javascript
import { submitAction, getActionsToValidate } from './services/googleSheets';

// Soumettre une action
await submitAction({ email, type, data });

// Récupérer les actions en attente
const pending = getActionsToValidate();
```

Actuellement utilise localStorage comme mock. À remplacer par vraie API Google Sheets.

### `validationService.js`
Logique de validation :
```javascript
import { processValidation } from './services/validationService';

await processValidation(actionId, 'validated', points, comment, 'Admin');
```

---

## Design System

### Classes utilitaires Tailwind

**Boutons** :
```jsx
<button className="btn btn-primary">Action</button>
<button className="btn btn-success">Valider</button>
<button className="btn btn-danger">Refuser</button>
<button className="btn btn-outline">Annuler</button>
```

**Cartes** :
```jsx
<div className="card">
  Contenu
</div>
```

**Badges** :
```jsx
<span className="badge badge-success">Validé</span>
<span className="badge badge-danger">Rejeté</span>
```

**Formulaires** :
```jsx
<input className="form-control" type="text" />
```

### Couleurs

- **Primary** : Teal (Google Material)
- **Eugenia Yellow** : `#DBA12D`
- **Eugenia Burgundy** : `#671324`
- **Eugenia Pink** : `#E33054`

---

## Migration progressive

### Étape 1 : Setup (✅ Fait)
- ✅ TailwindCSS configuré
- ✅ Services créés
- ✅ Routing de base
- ✅ Pages étudiantes

### Étape 2 : Interface admin (🔄 En cours)
- [ ] ValidationQueue
- [ ] ActionDetailModal
- [ ] Dashboard admin
- [ ] Navigation admin

### Étape 3 : Configurations
- [ ] ActionTypeEditor
- [ ] LeaderboardConfig
- [ ] AutomationConfig

### Étape 4 : Intégration Sheets
- [ ] Connexion API Google Sheets
- [ ] Remplacement localStorage
- [ ] Tests end-to-end

### Étape 5 : Déploiement
- [ ] Build Cloudflare Pages
- [ ] Variables d'environnement
- [ ] Domain setup

---

## Configuration

### `defaultConfig.js`
Configuration centralisée avec :
- Types d'actions par défaut
- Structure Google Sheets
- Email domain autorisé

### `configService.js`
CRUD de la configuration :
- LocalStorage pour persistance
- Merge avec defaults
- Sync futur avec Sheets

---

## Checklist migration

### Développeur

- [ ] Backup de l'ancien code
- [ ] Tests des nouvelles pages
- [ ] Vérifier le routing
- [ ] Tester les services localStorage
- [ ] Configurer les variables Tailwind

### Admin

- [ ] Réviser les types d'actions
- [ ] Vérifier les mappings de colonnes
- [ ] Tester la validation manuelle
- [ ] Configurer les automatisations

### Déploiement

- [ ] Build de production
- [ ] Config Cloudflare Pages
- [ ] Variables d'env (SHEET_ID, etc.)
- [ ] Test en production
- [ ] Migration des données Sheets

---

## Prochaines étapes

1. **Finir l'interface admin de validation** ⭐
2. Implémenter ActionTypeEditor
3. Ajouter les automatisations
4. Connecter la vraie API Google Sheets
5. Déployer sur Cloudflare Pages

---

## Documentation

- `FORM-CONFIG-GUIDE.md` : Guide config (v1)
- `WRITE-FLOW-EXPLANATION.md` : Flux écriture (v1)
- Ce fichier : Migration v1 → v2

---

**En cours de développement... 🚀**

