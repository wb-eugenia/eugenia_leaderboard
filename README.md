# Eugenia Challenge - Campus Gamification System

Une application React moderne pour un système de gamification campus avec classement dynamique, soumission d'actions et validation automatique.

## 🚀 Fonctionnalités

1. **Classement en temps réel** - Leaderboard synchronisé avec Cloudflare D1 (SQL)
2. **Soumission d'actions** - Formulaire configurable pour différents types d'actions
3. **Validation automatique** - Automatisations avec Google Sheets pour validation instantanée
4. **Interface admin** - Gestion complète des étudiants, actions, types d'actions et automatisations
5. **Déploiement Cloudflare** - Frontend sur Pages, API sur Workers, Base de données D1

## 📋 Prérequis

- Node.js 18+
- Compte Cloudflare (pour D1 et Workers)
- Compte Google (optionnel, pour les automatisations avec Google Sheets)

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env.local` :

```env
VITE_API_URL=https://votre-worker.wbouzidane.workers.dev
VITE_ADMIN_EMAIL=votre@email.com
VITE_ADMIN_PASSWORD=votre_mot_de_passe
```

### Configuration Cloudflare

1. **Créer la base D1** :
   ```bash
   cd worker
   npx wrangler d1 create eugeniachallenge
   ```

2. **Appliquer les migrations** :
   ```bash
   # Appliquer toutes les migrations dans l'ordre
   for file in ../migrations/*.sql; do
     npx wrangler d1 execute eugeniachallenge --remote --file="$file"
   done
   ```

3. **Déployer le Worker** :
   ```bash
   cd worker
   npx wrangler deploy
   ```

4. **Déployer le Frontend** :
   ```bash
   npm run build
   npx wrangler pages deploy dist --project-name=eugenia-challenge
   ```

## 📚 Technologies utilisées

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Cloudflare Workers (TypeScript)
- **Base de données**: Cloudflare D1 (SQLite)
- **Déploiement**: Cloudflare Pages

## 🚀 Déploiement

L'application est déployée sur **Cloudflare** :
- **Frontend** : Cloudflare Pages (`eugenia-challenge.pages.dev`)
- **Backend API** : Cloudflare Workers (`eugenia-challenge-api.wbouzidane.workers.dev`)
- **Base de données** : Cloudflare D1 (SQLite serverless)


## 📚 Structure du projet

```
EugeniaChallenge/
├── src/                    # Code source React
│   ├── components/         # Composants React
│   │   ├── admin/         # Composants admin
│   │   ├── analytics/     # Composants analytics
│   │   ├── shared/        # Composants partagés
│   │   └── student/       # Composants étudiants
│   ├── pages/             # Pages de l'application
│   ├── services/          # Services API
│   ├── hooks/             # Hooks React personnalisés
│   └── utils/             # Utilitaires
├── worker/                # Cloudflare Worker (backend)
│   └── src/
│       └── index.ts       # Point d'entrée du Worker
├── migrations/            # Migrations SQL pour D1
└── apps-script/          # Scripts Google Apps Script (legacy)
```

## 🎨 Types d'actions

Les types d'actions sont configurables depuis l'interface admin (`/admin/action-types`) :

- **📱 Post LinkedIn** - Avec validation de lien
- **🎓 Participation JPO** - Avec date et lieu
- **🏆 Victoire Hackathon** - Avec nom d'événement
- **🤝 Association validée** - Avec nom et rôle

Vous pouvez en créer de nouveaux avec des champs personnalisés !

## 🔧 Développement

### Commandes disponibles

- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Construire l'application pour la production
- `npm run preview` - Prévisualiser le build de production

### Variables d'environnement

Pour le développement local, créez un fichier `.env.local` :
```
VITE_APP_SCRIPT_URL=votre_url_apps_script
```

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte à tous les types d'écrans :
- Desktop
- Tablet
- Mobile

## 🎨 Personnalisation

Pour personnaliser les couleurs et le branding, modifiez les variables CSS dans :
- `src/App.css` - Styles principaux
- `src/components/Leaderboard.css` - Styles du leaderboard
- `src/components/ActionForm.css` - Styles du formulaire

## 🔐 Sécurité

- Validation email @eugeniaschool.com requise
- Authentification admin pour l'interface de gestion
- Validation des actions avant attribution des points
- Protection CORS sur l'API

## 🎛️ Fonctionnalités principales

### Interface Étudiante
- **Page d'accueil** : Présentation du challenge, récompenses, top 3
- **Classement** : Leaderboard en temps réel avec tri par points
- **Soumission d'actions** : Formulaire dynamique configurable

### Interface Admin
- **Validation** : Queue de validation des actions soumises
- **Gestion étudiants** : Ajout, modification, import en masse
- **Types d'actions** : Configuration des types d'actions et points
- **Analytics** : Statistiques avancées avec graphiques
- **Configuration** : Récompenses, textes landing page, automatisations

## 📞 Support

Pour toute question ou problème, contactez l'administrateur du système.

## 📄 Licence

© 2024 Eugenia Challenge - Tous droits réservés

