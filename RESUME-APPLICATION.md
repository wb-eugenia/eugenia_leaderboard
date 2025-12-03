# 📋 Résumé Complet de l'Application - Campus Platform

## 🎯 Vue d'Ensemble

**Campus Platform** est une plateforme complète de gamification pour les écoles et universités, permettant de motiver les étudiants via un système de points, classements et récompenses. L'application supporte **plusieurs écoles simultanément** (Eugenia School et Albert School) avec des espaces séparés pour chaque établissement.

---

## 🏗️ Architecture Technique

### **Stack Technologique**

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  • React 18.2 + Vite                                        │
│  • Tailwind CSS (design system)                             │
│  • React Router 6 (navigation)                              │
│  • React Hook Form + Zod (validation)                       │
│  • Recharts (graphiques analytics)                          │
│  • Déployé sur: Cloudflare Pages                            │
└─────────────────────────────────────────────────────────────┘
                          ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│              BACKEND API (Cloudflare Workers)                │
│  • TypeScript 5.3                                           │
│  • Cloudflare D1 Database (SQLite serverless)               │
│  • Google OAuth 2.0 (intégration Sheets)                   │
│  • API REST complète (2900+ lignes)                         │
│  • Déployé sur: Cloudflare Workers                          │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│              BASE DE DONNÉES (Cloudflare D1)                 │
│  • SQLite Serverless                                        │
│  • 14 migrations SQL                                       │
│  • Tables: leaderboard, actions, action_types,              │
│    automations, config, rewards, reports,                 │
│    admin_sessions, oauth_credentials, etc.                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Structure du Projet

```
EugeniaChallenge/
├── src/                          # Frontend React
│   ├── components/              # Composants réutilisables
│   │   ├── admin/              # Interface admin (17 composants)
│   │   ├── analytics/          # Graphiques et stats (8 composants)
│   │   ├── shared/             # Composants partagés (10 composants)
│   │   ├── student/            # Interface étudiante (8 composants)
│   │   └── sales/              # Landing page commerciale (6 composants)
│   ├── pages/                  # Pages de l'application (24 pages)
│   ├── services/               # Services API
│   │   ├── api.js              # Service API centralisé avec retry
│   │   ├── configService.js    # Gestion configuration
│   │   ├── googleSheets.js    # Intégration Google Sheets
│   │   └── validationService.js
│   ├── hooks/                  # Hooks React personnalisés
│   │   ├── useAnalytics.js
│   │   ├── useApi.js
│   │   ├── useSchoolTheme.js
│   │   └── useTheme.js
│   ├── routes/                 # Configuration des routes
│   │   └── index.jsx          # Routes avec lazy loading
│   ├── contexts/               # Contextes React
│   │   └── StudentAuthContext.jsx
│   └── constants/             # Constantes
│       ├── routes.js           # Routes et écoles
│       └── config.js           # Configuration API
│
├── worker/                      # Backend Cloudflare Worker
│   └── src/
│       └── index.ts            # API REST complète (2900+ lignes)
│
├── migrations/                  # Migrations SQL D1
│   ├── 0001_initial_schema.sql
│   ├── 0002_seed_students.sql
│   ├── 0003_add_action_types_and_landing.sql
│   ├── 0004_seed_action_types.sql
│   ├── 0005_add_google_oauth.sql
│   ├── 0006_add_oauth_credentials.sql
│   ├── 0007_seed_landing_page_config.sql
│   ├── 0008_add_rewards.sql
│   ├── 0009_add_analytics_indexes.sql
│   ├── 0010_add_reports_table.sql
│   ├── 0011_add_admin_sessions.sql
│   ├── 0012_add_badges_and_achievements.sql
│   ├── 0013_add_messaging.sql
│   └── 0014_add_moderation_levels.sql
│
└── public/                      # Assets statiques
    ├── logo.png               # Logo 3D (favicon)
    └── _redirects             # Cloudflare Pages redirects
```

---

## 🎨 Frontend - Interface Utilisateur

### **Architecture Multi-École**

L'application supporte **deux écoles** avec des espaces séparés :
- **Eugenia School** : Routes `/eugenia-school/*`
- **Albert School** : Routes `/albert-school/*`

Chaque école a :
- Son propre système d'authentification (validation email par domaine)
- Ses propres étudiants et classements
- Ses propres configurations admin
- Son thème visuel personnalisé

### **Pages Étudiantes** (24 pages au total)

#### **Pages Publiques**
1. **SalesLandingPage** (`/`) - Page d'accueil commerciale
2. **SelectSchoolPage** (`/select-school`) - Sélection de l'école
3. **StudentPublicProfilePage** (`/profile/:slug`) - Profil public partageable

#### **Pages Étudiantes (par école)**
4. **EugeniaSchoolPage / AlbertSchoolPage** (`/{school}/`) - Page d'accueil étudiante
5. **EugeniaLoginPage / AlbertLoginPage** (`/{school}/login`) - Connexion étudiante
6. **LeaderboardPage** (`/{school}/leaderboard`) - Classement en temps réel
7. **SubmitActionPage** (`/{school}/submit`) - Soumission d'actions
8. **PortfolioPage** (`/{school}/portfolio`) - Gestion du portfolio
9. **AmbassadeursPage** (`/{school}/ambassadeurs`) - Programme ambassadeurs
10. **AssociationsPage** (`/{school}/associations`) - Associations et agenda
11. **ReportIssuePage** (`/{school}/report`) - Signalement de problèmes
12. **StudentProfilePage** (`/{school}/student/profile`) - Profil privé étudiant

### **Composants Frontend**

#### **Composants Admin** (17 composants)
- `AdminDashboard` - Vue d'ensemble admin
- `ValidationQueue` - Queue de validation des actions
- `ReportsQueue` - Gestion des signalements campus
- `ActionTypeEditor` - Configuration des types d'actions
- `LeaderboardConfig` - Gestion des étudiants
- `AutomationConfig` - Configuration des automatisations
- `LandingConfig` - Configuration de la landing page
- `GoogleSheetsSetup` - Configuration OAuth Google
- Et plus...

#### **Composants Analytics** (8 composants)
- Graphiques Recharts (timeline, camembert, barres)
- Cartes de statistiques
- Insights automatiques
- Top étudiants

#### **Composants Étudiants** (8 composants)
- `ActionForm` - Formulaire de soumission d'actions
- `Leaderboard` - Affichage du classement
- `SchoolAuth` - Authentification par école
- Et plus...

#### **Composants Partagés** (10 composants)
- `Header` - Navigation globale
- `Footer` - Footer avec liens
- `SchoolHeader` - Header spécifique école
- `ErrorBoundary` - Gestion d'erreurs
- Et plus...

### **Fonctionnalités Frontend**

#### **Système d'Authentification**
- Authentification par email (validation domaine : `@eugeniaschool.com` ou `@albertschool.com`)
- Sessions stockées en localStorage
- Protection des routes avec `SchoolAuth` et `AdminAuth`
- Déconnexion automatique

#### **Gestion d'État**
- Contextes React (`StudentAuthContext`)
- Hooks personnalisés (`useApi`, `useAnalytics`, `useSchoolTheme`)
- Service API centralisé avec retry automatique

#### **Performance**
- Lazy loading des routes (React.lazy)
- Code splitting automatique
- Service Worker pour cache (PWA ready)

#### **Design System**
- Tailwind CSS avec couleurs personnalisées :
  - **Burgundy** : `#671324` (couleur principale)
  - **Pink** : `#E33054` (accents)
  - **Yellow** : `#DBA12D` (CTAs, badges)
- Composants réutilisables (Cards, Buttons, Badges)
- Responsive design (mobile-first)

---

## ⚙️ Backend - API REST

### **Architecture Backend**

Le backend est un **Cloudflare Worker** en TypeScript qui expose une API REST complète. Toutes les routes sont gérées dans un seul fichier `worker/src/index.ts` (2900+ lignes).

### **Endpoints API Principaux**

#### **Leaderboard**
- `GET /leaderboard` - Récupère le classement complet
- `GET /leaderboard/check?email=xxx` - Vérifie si un étudiant existe
- `PUT /leaderboard/user` - Met à jour un utilisateur
- `DELETE /leaderboard/user?email=xxx` - Supprime un utilisateur
- `POST /leaderboard/bulk` - Import en masse d'étudiants (CSV)

#### **Actions**
- `GET /actions/pending` - Actions en attente de validation
- `GET /actions/all` - Toutes les actions
- `GET /actions/:id` - Récupère une action par ID
- `POST /actions/submit` - Soumet une nouvelle action
- `POST /actions/validate` - Valide/rejette une action
- `DELETE /actions/:id` - Supprime une action

#### **Types d'Actions**
- `GET /action-types` - Liste tous les types d'actions
- `POST /action-types` - Crée un type d'action
- `PUT /action-types/:id` - Met à jour un type d'action
- `DELETE /action-types/:id` - Supprime un type d'action

#### **Automatisations**
- `GET /automations` - Liste toutes les automatisations
- `POST /automations` - Crée une automatisation
- `PUT /automations/:id` - Met à jour une automatisation
- `DELETE /automations/:id` - Supprime une automatisation

#### **Analytics**
- `GET /api/analytics/overview?period=30d` - Vue d'ensemble
- `GET /api/analytics/timeline?period=30d` - Évolution temporelle
- `GET /api/analytics/popular-actions?limit=5` - Actions populaires
- `GET /api/analytics/by-class` - Répartition par classe
- `GET /api/analytics/top-students?limit=10` - Top étudiants
- `GET /api/analytics/recent-actions?hours=48` - Actions récentes
- `GET /api/analytics/insights` - Insights automatiques

#### **Configuration**
- `GET /config` - Récupère la configuration globale
- `POST /config` - Sauvegarde la configuration
- `GET /landing-page-config` - Config de la landing page
- `POST /landing-page-config` - Sauvegarde config landing
- `GET /rewards` - Liste des récompenses
- `POST /rewards` - Sauvegarde les récompenses

#### **Google OAuth**
- `POST /google-oauth/callback` - Callback OAuth
- `GET /google-oauth/status` - Statut de la connexion
- `DELETE /google-oauth/disconnect` - Déconnecte OAuth
- `POST /oauth-credentials` - Sauvegarde credentials OAuth
- `GET /oauth-credentials` - Récupère credentials OAuth

#### **Signalements (Reports)**
- `GET /reports` - Liste tous les signalements
- `POST /reports` - Crée un signalement
- `PATCH /reports/:id` - Met à jour le statut
- `DELETE /reports/:id` - Supprime un signalement

### **Fonctionnalités Backend Avancées**

#### **1. Validation Automatique via Google Sheets**

Le système peut **valider automatiquement** les actions en vérifiant leur présence dans une Google Sheet :

**Processus** :
1. Étudiant soumet une action
2. Le système vérifie les automatisations actives pour ce type d'action
3. Pour chaque automatisation :
   - Lit la Google Sheet (via OAuth ou API publique)
   - Compare l'identifiant étudiant (email, nom, etc.)
   - Compare le champ du formulaire (date, texte, etc.)
   - Si match trouvé → **Validation automatique** + attribution des points

**Configuration d'une automatisation** :
- Sheet ID et range (ex: `A2:G24`)
- Type d'identifiant étudiant (email, nom, prénom, nom complet)
- Colonnes de matching étudiant (ex: `D,E,F`)
- Champ du formulaire à matcher (ex: `date`)
- Colonnes de matching champ (ex: `G`)
- Règle de matching (exact, contains, date, partial)

**Exemple** : Validation automatique d'une participation JPO si l'étudiant + date sont trouvés dans la sheet.

#### **2. Gestion OAuth Google**

- Stockage des credentials OAuth en base (comme n8n)
- Refresh automatique des tokens expirés
- Fallback vers API publique si OAuth non configuré
- Support de plusieurs méthodes de lecture Sheets (API v4, CSV export, Visualization API)

#### **3. Analytics Avancées**

- **Vue d'ensemble** : Taux de participation, actions du mois, moyenne de points
- **Timeline** : Évolution temporelle des actions (graphique ligne)
- **Actions populaires** : Top 5 des types d'actions (graphique barres)
- **Répartition par classe** : Graphique en camembert
- **Top étudiants** : Classement des plus actifs
- **Insights automatiques** :
  - Momentum du moment (action la plus populaire)
  - Jour le plus actif de la semaine
  - Heure de pointe
  - Classe championne

#### **4. Gestion des Ex-Aequo**

Le classement gère automatiquement les ex-aequo :
- Si deux étudiants ont le même nombre de points, ils ont le même rang
- Le rang suivant est calculé correctement (ex: 1, 1, 3 au lieu de 1, 2, 3)

#### **5. Protection CORS**

- Headers CORS configurables
- Support des requêtes OPTIONS (preflight)
- Origines autorisées configurables via variables d'environnement

#### **6. Gestion d'Erreurs**

- Codes d'erreur standardisés
- Messages d'erreur descriptifs
- Logs détaillés pour le debugging
- Retry automatique côté frontend

---

## 🗄️ Base de Données

### **Tables Principales**

| Table | Description |
|-------|-------------|
| `leaderboard` | Étudiants avec points et actions |
| `actions` | Actions soumises (pending/validated/rejected) |
| `action_types` | Types d'actions configurables avec champs dynamiques |
| `automations` | Règles de validation automatique |
| `admin_sessions` | Sessions admin (tokens) |
| `reports` | Signalements campus (pending/in_progress/resolved) |
| `rewards` | Récompenses par rang |
| `config` | Configuration globale |
| `landing_page_config` | Textes de la landing page |
| `oauth_credentials` | Credentials Google OAuth |
| `google_oauth_tokens` | Tokens OAuth Google (access + refresh) |

### **Migrations**

14 migrations SQL disponibles dans `/migrations/` :
- Schéma initial (leaderboard, actions)
- Seed étudiants
- Types d'actions et landing page
- Google OAuth
- Récompenses
- Analytics (indexes)
- Signalements
- Sessions admin
- Badges et achievements
- Messaging
- Niveaux de modération

---

## 🔐 Sécurité

### **Authentification Admin**
- Sessions sécurisées avec cookies `httpOnly` (non accessibles en JavaScript)
- Expiration automatique (24h par défaut)
- Validation email multi-école
- Révocation possible (suppression en base)

### **Validation des Données**
- Validation email (domaines autorisés)
- Validation des champs requis
- Sanitization des inputs (protection XSS)
- Codes d'erreur standardisés

### **CORS**
- Origines configurables via `ALLOWED_ORIGINS`
- Headers de sécurité (SameSite, Secure en production)

---

## 🚀 Déploiement

### **Frontend**
- **Plateforme** : Cloudflare Pages
- **Build** : Vite
- **URL** : https://eugenia-challenge.pages.dev

### **Backend**
- **Plateforme** : Cloudflare Workers
- **Runtime** : V8 Isolates (edge computing)
- **URL** : https://eugenia-challenge-api.wbouzidane.workers.dev

### **Base de Données**
- **Plateforme** : Cloudflare D1
- **Type** : SQLite Serverless
- **Réplication** : Automatique sur le réseau Cloudflare

---

## 📊 Fonctionnalités Principales

### **Pour les Étudiants**

1. **🏠 Page d'accueil** - Présentation du challenge, récompenses, top 3
2. **📊 Classement** - Leaderboard en temps réel avec tri par points
3. **➕ Soumission d'actions** - Formulaire dynamique configurable
4. **🌟 Ambassadeurs** - Découvrir les missions, voir le top 10
5. **🎨 Portfolios** - Exposer ses projets, partager son portfolio public
6. **🤝 Associations** - Découvrir les associations actives, voir l'agenda mensuel
7. **🚨 Signalements** - Signaler les problèmes du campus avec photos
8. **👤 Profil** - Gérer son portfolio et ses associations

### **Pour les Admins**

1. **✅ Validation** - Queue de validation des actions, validation/rejet avec commentaires
2. **👥 Gestion étudiants** - Ajout, modification, import en masse depuis CSV
3. **🎯 Types d'actions** - Configuration des types d'actions, points, champs dynamiques
4. **🤖 Automatisations** - Validation automatique via Google Sheets (OAuth)
5. **📈 Analytics** - Statistiques avancées, graphiques, insights automatiques
6. **🎁 Récompenses** - Configuration des récompenses par rang
7. **📝 Configuration** - Textes de la landing page, réglages globaux
8. **📋 Signalements** - Gestion des signalements campus (pending/in_progress/resolved)
9. **🔗 Google Sheets** - Configuration OAuth et connexion Google

---

## 🔄 Flux Utilisateurs Principaux

### **Flux 1 : Soumission d'Action**
1. Étudiant se connecte → `/eugenia-school/login`
2. Va sur "Soumettre une action" → `/eugenia-school/submit`
3. Sélectionne un type d'action
4. Remplit le formulaire dynamique
5. Soumet → Action créée en `pending`
6. **Si automatisation configurée** → Validation automatique si match trouvé dans Google Sheet
7. **Sinon** → Action en attente de validation admin

### **Flux 2 : Validation Admin**
1. Admin se connecte → `/eugenia-school/admin/login`
2. Va sur "Validation" → `/eugenia-school/admin/validate`
3. Voit la queue d'actions en attente
4. Clique sur une action → Voir détails
5. Valide ou rejette avec commentaire
6. Points attribués automatiquement au leaderboard

### **Flux 3 : Configuration Automatisation**
1. Admin → "Google Sheets" → Configure OAuth
2. Admin → "Automatisations" → Crée une automatisation
3. Configure :
   - Type d'action
   - Sheet ID et range
   - Colonnes de matching
   - Règles de matching
4. Active l'automatisation
5. Les actions correspondantes seront validées automatiquement

### **Flux 4 : Signalement Campus**
1. Étudiant → "Signaler" → `/eugenia-school/report`
2. Choisit une catégorie
3. Remplit le formulaire + ajoute photo
4. Envoie → Signalement créé en `pending`
5. Admin voit le signalement → `/eugenia-school/admin/reports`
6. Admin peut marquer "En cours" ou "Résolu"

---

## 📈 Statistiques et Analytics

### **Métriques Disponibles**
- Taux de participation (étudiants actifs / total)
- Tendance de participation (comparaison période précédente)
- Actions du mois
- Moyenne de points par étudiant
- Top 5 des types d'actions
- Répartition par classe
- Top 10 des étudiants actifs
- Actions récentes (48h)

### **Insights Automatiques**
- **Momentum** : Action la plus populaire cette semaine
- **Jour le plus actif** : Jour de la semaine avec le plus d'actions
- **Heure de pointe** : Heure avec le plus d'activité
- **Classe championne** : Classe avec le plus d'actions

---

## 🛠️ Technologies Utilisées

### **Frontend**
- React 18.2
- Vite 5.0
- Tailwind CSS 3.4
- React Router 6.21
- React Hook Form 7.49
- Zod 3.22 (validation)
- Recharts 3.3 (graphiques)

### **Backend**
- TypeScript 5.3
- Cloudflare Workers
- Cloudflare D1 (SQLite)
- Google OAuth 2.0
- Google Sheets API v4

### **Outils de Développement**
- Wrangler 3.78 (CLI Cloudflare)
- PostCSS + Autoprefixer
- Service Worker (PWA)

---

## 📝 Notes Importantes

1. **Multi-école** : L'application supporte plusieurs écoles avec des espaces séparés
2. **Validation automatique** : Intégration Google Sheets pour valider automatiquement les actions
3. **Analytics avancées** : Graphiques et insights automatiques pour suivre l'engagement
4. **Responsive** : Design mobile-first avec Tailwind CSS
5. **Performance** : Lazy loading, code splitting, Service Worker
6. **Sécurité** : Authentification par session, validation des données, CORS configurable

---

## 🔗 Liens Utiles

- **Frontend** : https://eugenia-challenge.pages.dev
- **API** : https://eugenia-challenge-api.wbouzidane.workers.dev
- **Documentation Cloudflare** : https://developers.cloudflare.com/

---

**Made with ❤️ for students**

*Document généré le : Janvier 2025*

