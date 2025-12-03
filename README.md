# 🎓 Campus Platform - Système de Gamification Campus

> Plateforme communautaire moderne pour gamifier la vie étudiante avec des points, des classements et des récompenses.

[![Deploy Status](https://img.shields.io/badge/Deploy-Cloudflare-blue)](https://eugenia-challenge.pages.dev)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)

---

## 📋 Résumé de l'Application

**Campus Platform** est une plateforme complète de gamification conçue pour les écoles et universités. Elle permet de :

- 🏆 **Motiver les étudiants** avec un système de points et de classements
- 📊 **Suivre l'engagement** via des statistiques et analytics détaillées
- 🤖 **Automatiser la validation** des actions via intégration Google Sheets
- 🎯 **Gérer les programmes** (Ambassadeurs, Associations, Portfolios)
- 🔐 **Sécuriser l'accès** avec authentification par session

### Architecture Multi-École

La plateforme supporte **plusieurs écoles** simultanément :
- **Eugenia School** (`/eugenia-school/*`)
- **Albert School** (`/albert-school/*`)
- Chaque école a son propre espace, ses étudiants et ses configurations

---

## ✨ Fonctionnalités Principales

### 👨‍🎓 Interface Étudiante

| Fonctionnalité | Description |
|----------------|-------------|
| **🏠 Page d'accueil** | Présentation du challenge, récompenses, top 3 du classement |
| **📊 Classement** | Leaderboard en temps réel avec tri par points, gestion des ex-aequo |
| **➕ Soumission d'actions** | Formulaire dynamique configurable selon le type d'action |
| **🌟 Ambassadeurs** | Découvrir les missions, voir le top 10, participer aux programmes |
| **🎨 Portfolios** | Exposer ses projets, partager son portfolio public |
| **🤝 Associations** | Découvrir les associations actives, voir l'agenda mensuel |
| **🚨 Signalements** | Signaler les problèmes du campus avec photos |

### ⚙️ Interface Admin

| Module | Fonctionnalités |
|--------|-----------------|
| **✅ Validation** | Queue de validation des actions, validation/rejet avec commentaires |
| **👥 Gestion étudiants** | Ajout, modification, import en masse depuis CSV |
| **🎯 Types d'actions** | Configuration des types d'actions, points, champs dynamiques |
| **🤖 Automatisations** | Validation automatique via Google Sheets (OAuth) |
| **📈 Analytics** | Statistiques avancées, graphiques, insights automatiques |
| **🎁 Récompenses** | Configuration des récompenses par rang |
| **📝 Configuration** | Textes de la landing page, réglages globaux |
| **📋 Signalements** | Gestion des signalements campus (pending/in_progress/resolved) |

### 🔐 Sécurité

- ✅ **Authentification admin** par session (cookies httpOnly)
- ✅ **Validation email** multi-école (@eugeniaschool.com, @albertschool.com)
- ✅ **Protection CORS** configurable
- ✅ **Validation des données** côté backend
- ✅ **Codes d'erreur standardisés** pour un meilleur debugging

---

## 🏗️ Architecture Technique

### Stack Technologique

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  React 18 + Vite + Tailwind CSS + React Router              │
│  Déployé sur: Cloudflare Pages                              │
└─────────────────────────────────────────────────────────────┘
                          ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│              BACKEND API (Cloudflare Workers)                │
│  TypeScript + D1 Database + Google OAuth                     │
│  Déployé sur: Cloudflare Workers                            │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│              BASE DE DONNÉES (Cloudflare D1)                 │
│  SQLite Serverless - Tables:                                │
│  • leaderboard, actions, action_types                       │
│  • automations, config, rewards                             │
│  • admin_sessions, reports, oauth_credentials               │
└─────────────────────────────────────────────────────────────┘
```

### Structure du Projet

```
EugeniaChallenge/
├── src/                          # Frontend React
│   ├── components/              # Composants réutilisables
│   │   ├── admin/              # Interface admin
│   │   ├── analytics/          # Graphiques et stats
│   │   ├── shared/             # Composants partagés
│   │   └── student/            # Interface étudiante
│   ├── pages/                  # Pages de l'application
│   ├── services/               # Services API (googleSheets.js, configService.js)
│   ├── hooks/                  # Hooks React personnalisés
│   └── utils/                  # Utilitaires
│
├── worker/                      # Backend Cloudflare Worker
│   └── src/
│       └── index.ts            # API REST (2900+ lignes)
│
├── migrations/                  # Migrations SQL D1
│   ├── 0001_initial_schema.sql
│   ├── 0002_seed_students.sql
│   └── ... (11 migrations)
│
├── public/                      # Assets statiques
│   ├── logo.png               # Logo 3D (favicon)
│   └── _redirects             # Cloudflare Pages redirects
│
└── apps-script/                # Google Apps Script (legacy)
```

---

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** 18+ 
- **npm** ou **yarn**
- **Compte Cloudflare** (gratuit)
- **Compte Google** (optionnel, pour automatisations)

### Installation

```bash
# 1. Cloner le repository
git clone <repository-url>
cd EugeniaChallenge

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos valeurs
```

### Configuration

#### Variables d'environnement Frontend (`.env.local`)

```env
VITE_API_URL=https://votre-worker.workers.dev
VITE_ADMIN_EMAIL=admin@eugeniaschool.com
VITE_ADMIN_PASSWORD=votre_mot_de_passe
```

#### Configuration Cloudflare Worker (`worker/wrangler.toml`)

```toml
name = "eugenia-challenge-api"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "eugeniachallenge"
database_id = "votre-database-id"
```

#### Variables Worker (Cloudflare Dashboard)

| Variable | Description |
|----------|-------------|
| `ADMIN_EMAIL` | Email de l'administrateur |
| `ADMIN_PASSWORD` | Mot de passe admin |
| `ALLOWED_ORIGINS` | Origines CORS autorisées (CSV) |

### Déploiement

#### 1. Créer la base D1

```bash
cd worker
npx wrangler d1 create eugeniachallenge
# Copier le database_id dans wrangler.toml
```

#### 2. Appliquer les migrations

```bash
# Migration locale (développement)
npx wrangler d1 execute eugeniachallenge --local --file=../migrations/0001_initial_schema.sql

# Migration production
npx wrangler d1 execute eugeniachallenge --remote --file=../migrations/0001_initial_schema.sql
# Répéter pour toutes les migrations dans l'ordre
```

#### 3. Déployer le Worker

```bash
cd worker
npx wrangler deploy
```

#### 4. Déployer le Frontend

```bash
# Build
npm run build

# Deploy sur Cloudflare Pages
npx wrangler pages deploy dist --project-name=eugenia-challenge
```

---

## 📚 Guide d'Utilisation

### Pour les Étudiants

1. **Se connecter** : `/eugenia-school/login` ou `/albert-school/login`
2. **Soumettre une action** : `/eugenia-school/submit`
3. **Voir le classement** : `/eugenia-school/leaderboard`
4. **Découvrir les ambassadeurs** : `/eugenia-school/ambassadeurs`
5. **Signaler un problème** : `/eugenia-school/report`

### Pour les Admins

1. **Se connecter** : `/eugenia-school/admin/login`
2. **Valider les actions** : `/eugenia-school/admin/validate`
3. **Gérer les étudiants** : `/eugenia-school/admin/leaderboard`
4. **Configurer les automatisations** : `/eugenia-school/admin/automations`
5. **Voir les analytics** : `/eugenia-school/admin/analytics`

---

## 🔧 Fonctionnalités Avancées

### Automatisations Google Sheets

Le système permet de **valider automatiquement** les actions en vérifiant leur présence dans une Google Sheet :

1. **Connecter Google OAuth** : `/admin/google-sheets`
2. **Créer une automatisation** : `/admin/automations`
3. **Configurer** :
   - Sheet ID et range
   - Colonnes de matching (étudiant, date, etc.)
   - Règle de matching (exact, contains, date)

**Exemple** : Validation automatique d'une participation JPO si l'étudiant + date sont trouvés dans la sheet.

### Analytics Avancées

- 📊 **Vue d'ensemble** : Taux de participation, actions du mois, moyenne de points
- 📈 **Timeline** : Évolution temporelle des actions
- 🎯 **Actions populaires** : Top 5 des types d'actions
- 👥 **Répartition par classe** : Graphique en camembert
- 🌟 **Top étudiants** : Classement des plus actifs
- 💡 **Insights automatiques** : Momentum, jour le plus actif, heure de pointe

---

## 🛡️ Sécurité

### Authentification Admin

- **Sessions sécurisées** : Cookies `httpOnly` (non accessibles en JavaScript)
- **Expiration automatique** : 24h par défaut
- **Révocation possible** : Suppression en base de données

### Validation des Données

- ✅ Validation email (domaines autorisés)
- ✅ Validation des champs requis
- ✅ Sanitization des inputs (protection XSS)
- ✅ Codes d'erreur standardisés

### CORS

- Origines configurables via `ALLOWED_ORIGINS`
- Headers de sécurité (SameSite, Secure en production)

---

## 📊 Base de Données

### Tables Principales

| Table | Description |
|-------|-------------|
| `leaderboard` | Étudiants avec points et actions |
| `actions` | Actions soumises (pending/validated/rejected) |
| `action_types` | Types d'actions configurables |
| `automations` | Règles de validation automatique |
| `admin_sessions` | Sessions admin (tokens) |
| `reports` | Signalements campus |
| `rewards` | Récompenses par rang |
| `config` | Configuration globale |
| `landing_page_config` | Textes de la landing page |
| `oauth_credentials` | Credentials Google OAuth |

### Migrations

11 migrations disponibles dans `/migrations/` :
- `0001_initial_schema.sql` - Schéma de base
- `0002_seed_students.sql` - Données initiales
- `0011_add_admin_sessions.sql` - Authentification admin

---

## 🎨 Personnalisation

### Couleurs

Les couleurs sont définies dans Tailwind CSS :
- **Burgundy** : `#671324` (couleur principale)
- **Pink** : `#E33054` (accents)
- **Yellow** : `#DBA12D` (CTAs, badges)

### Logo

Le logo est dans `/public/logo.png` (sphère 3D noire). Il est utilisé comme :
- Favicon (onglet navigateur)
- Logo header/footer
- Apple touch icon

---

## 🐛 Dépannage

### Problème : Classement vide

**Solution** : Vérifier que l'API retourne bien les données dans le format `{success: true, data: [...]}`. Le frontend extrait automatiquement `data`.

### Problème : Authentification admin échoue

**Solution** : 
1. Vérifier que `ADMIN_EMAIL` et `ADMIN_PASSWORD` sont configurés dans Cloudflare
2. Vérifier que la table `admin_sessions` existe (migration 0011)
3. Vérifier les cookies dans DevTools (Network tab)

### Problème : Automatisations ne fonctionnent pas

**Solution** :
1. Vérifier la connexion Google OAuth : `/admin/google-sheets`
2. Vérifier les credentials OAuth : `/admin/google-sheets`
3. Vérifier les logs du Worker : `npx wrangler tail`

---

## 📈 Roadmap

- [ ] Notifications email pour les étudiants
- [ ] Export Excel des classements
- [ ] API publique pour intégrations tierces
- [ ] Mode sombre
- [ ] Application mobile (PWA)
- [ ] Système de badges/achievements
- [ ] Intégration Discord/Slack

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

© 2025 Campus Platform - Tous droits réservés

---

## 👥 Auteur

Développé pour **Eugenia School** et **Albert School**

---

## 🔗 Liens Utiles

- **Frontend** : https://eugenia-challenge.pages.dev
- **API** : https://eugenia-challenge-api.wbouzidane.workers.dev
- **Documentation Cloudflare** : https://developers.cloudflare.com/

---

**Made with ❤️ for students**
