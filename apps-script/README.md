# 📊 Apps Script - Backend Eugenia Challenge

## 🎯 Vue d'ensemble

**CodeV2.gs** est le backend principal qui connecte l'application React à Google Sheets.

Il fournit une API REST complète pour toutes les opérations CRUD.

---

## 📁 Fichier

**`CodeV2.gs`** - Backend unique et complet

Tous les autres fichiers (Code.gs, CodeActions.gs, etc.) sont **obsolètes** et ont été supprimés.

---

## 🔗 Endpoints API

### GET

| Endpoint | Description |
|----------|-------------|
| `getLeaderboard` | Récupère le classement complet |
| `getActionsToValidate` | Actions en attente de validation |
| `getAllActions` | Toutes les actions |
| `getActionById` | Une action spécifique par ID |
| `getConfig` | Configuration admin complète |

### POST

| Endpoint | Description |
|----------|-------------|
| `submitAction` | Soumettre une nouvelle action |
| `validateAction` | Valider/refuser une action |
| `updateLeaderboard` | Ajouter des points |
| `saveConfig` | Sauvegarder la config admin |
| `updateLeaderboardUser` | Modifier un étudiant |
| `deleteLeaderboardUser` | Supprimer un étudiant |

---

## 📊 Structure Google Sheets

### Onglet `leaderboard`
| Colonne | Description |
|---------|-------------|
| A | Prénom |
| B | Nom |
| C | Classe |
| D | Email |
| E | Points |
| F | Nombre d'actions |
| G | Dernière mise à jour |

### Onglet `actions`
| Colonne | Description |
|---------|-------------|
| A | ID |
| B | Email |
| C | Type d'action |
| D | Données (JSON) |
| E | Status (pending/validated) |
| F | Date soumission |
| G | Decision |
| H | Points |
| I | Commentaire |
| J | ValidatedBy |
| K | ValidatedAt |

### Onglet `config` (créé automatiquement)
| Colonne | Description |
|---------|-------------|
| A | Key |
| B | Value (JSON) |

---

## 🚀 Configuration

Voir **`GOOGLE-SHEETS-SETUP.md`** à la racine du projet pour les instructions complètes.

### Quick start

1. Ouvrez Google Sheets
2. Extensions > Apps Script
3. Copiez tout `CodeV2.gs`
4. Collez dans Apps Script
5. Déployez comme Web App
6. Configurez `.env.local`

---

## 🔧 Configuration

**Ligne 9** : `const SHEET_ID = 'YOUR_SHEET_ID';`

**Remplacez** par votre ID de Google Sheet !

---

## 📝 Important

- **Déployez avec "Who has access: Anyone"** pour CORS
- L'onglet `config` sera créé automatiquement au premier usage
- Les étudiants doivent être importés manuellement (voir `docs/IMPORT-STUDENTS-SHEET.js`)

---

## 🧪 Test

Ouvrez dans navigateur :
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=getLeaderboard
```

**Attendu** : JSON avec les étudiants

---

Pour plus de détails, consultez **`GOOGLE-SHEETS-SETUP.md`** à la racine.
