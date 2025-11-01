# Eugenia Challenge - Campus Gamification System

Une application React moderne pour un système de gamification campus avec classement dynamique et soumission d'actions.

## 🚀 Fonctionnalités

1. **Classement en temps réel** - Affichage dynamique du leaderboard depuis Google Sheets
2. **Soumission d'actions** - Formulaire pour soumettre différentes actions (posts LinkedIn, JPO, Hackathon, Association)
3. **Interface intuitive** - Design moderne et responsive
4. **Aucune authentification** - Accès direct avec juste un email

## 📋 Prérequis

- Node.js 18+ 
- Un compte Google pour accéder à Google Sheets
- Google Sheets avec deux onglets : `leaderboard` et `actions`

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 📦 Configuration Google Sheets

### 1. Créer un Google Sheet

Créez un nouveau Google Sheet avec un onglet nommé `leaderboard`.

#### Structure de l'onglet "leaderboard" (à partir de la ligne 2)
| Colonne A (Prénom) | Colonne B (Nom) | Colonne C (Classe) | Colonne D (Mail) | Colonne E (Points) |
|--------------------|-----------------|--------------------|-------------------|--------------------|
| Jean               | Dupont          | L3 Info           | jean@campus.fr    | 150                |
| Marie              | Martin          | M1 Info           | marie@campus.fr   | 120                |

**Note** : L'onglet `actions` sera créé automatiquement par le script.

### 2. Configurer le script Apps Script pour le leaderboard (GET)

1. Ouvrez votre Google Sheet
2. Allez dans **Extensions > Apps Script**
3. Supprimez le code par défaut
4. Créez un nouveau fichier appelé `Code` (il sera `Code.gs`)
5. Copiez le contenu de `apps-script/Code.gs` dans ce fichier
6. Remplacez `YOUR_GOOGLE_SHEET_ID` par l'ID de votre Google Sheet (visible dans l'URL)
7. Sauvegardez le projet
8. **Ne déployez pas encore**, on va créer le deuxième script d'abord

### 3. Configurer le script Apps Script pour les actions (POST)

1. Dans le même projet Apps Script, créez un nouveau fichier
2. Nommez-le `CodeActions` (il sera `CodeActions.gs`)
3. Copiez le contenu de `apps-script/CodeActions.gs` dans ce fichier
4. Remplacez `YOUR_GOOGLE_SHEET_ID` par l'ID de votre Google Sheet
5. Sauvegardez le projet

**Important** : Remplacez le `SHEET_ID` dans les deux fichiers ! Ils doivent pointer vers le même Google Sheet.

### 4. Déployer l'application

1. Dans Apps Script, cliquez sur **Deploy > New deployment**
2. Cliquez sur l'icône de paramètres (⚙️) à côté de "Select type"
3. Cliquez sur **Enable deployment types** si nécessaire
4. Sélectionnez **Web app** comme type
5. Configurez :
   - **Execute as**: Me
   - **Who has access**: Anyone
6. Copiez l'URL du web app déployé
7. Cliquez sur **Deploy**

### 5. Autoriser les permissions

Lors de la première déploiement, Google demandera d'autoriser l'accès :
1. Cliquez sur **Authorize access**
2. Sélectionnez votre compte Google
3. Cliquez sur **Advanced** > **Go to Eugenia Challenge (unsafe)**
4. Cliquez sur **Allow**

### 6. Configuration de l'application React

Dans `src/App.jsx`, remplacez :
```javascript
const APP_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL'
```
par l'URL de votre web app Apps Script déployé.

**Pour plus de détails** : Consultez les fichiers README dans `apps-script/` :
- `README.md` - Configuration du leaderboard (GET)
- `README-Actions.md` - Configuration des soumissions d'actions (POST)

## 🚀 Déploiement sur Vercel

### Méthode 1 : Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel
```

### Méthode 2 : Via l'interface Vercel

1. Connectez votre dépôt GitHub à Vercel
2. Vercel détectera automatiquement la configuration
3. Cliquez sur **Deploy**

## 📝 Structure du projet

```
EugeniaChallenge/
├── src/
│   ├── components/
│   │   ├── Leaderboard.jsx      # Affichage du classement
│   │   ├── Leaderboard.css
│   │   ├── ActionForm.jsx       # Formulaire de soumission
│   │   └── ActionForm.css
│   ├── App.jsx                   # Composant principal
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── apps-script/
│   ├── Code.gs                   # Backend GET (leaderboard)
│   ├── CodeActions.gs            # Backend POST (actions)
│   ├── README.md                  # Guide configuration leaderboard
│   └── README-Actions.md          # Guide configuration actions
├── package.json
├── vite.config.js
├── vercel.json
└── README.md
```

## 🎨 Types d'actions supportées

1. **📱 Post LinkedIn** - Soumission d'un post LinkedIn avec lien
2. **🎓 Participation JPO** - Participation à une JPO avec date/heure
3. **🏆 Victoire Hackathon** - Victoire à un hackathon/événement avec nom et type
4. **🤝 Association validée** - Validation d'une association avec nom

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

- Toutes les validations sont effectuées côté client
- La logique métier et l'attribution des points sont gérées uniquement côté Google Sheets
- Aucune authentification requise pour une expérience utilisateur simplifiée

## 🎛️ Configuration dynamique du formulaire (Nouveau !)

Le formulaire de soumission est maintenant **100% configurable depuis Google Sheets** !

### Créer l'onglet `FormConfig`

Créez un onglet `FormConfig` dans votre Google Sheet avec cette structure :

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Category** | **SubCategory** | **Label** | **Emoji** | **Field Type** | **Field Name** | **Field Label** | **Required** | **Placeholder** | **Default** | **Validation** | **Options** | **Column Mapping** | **Display Order** | **Active** | **Points** |

### Import rapide

1. Ouvrez `FormConfig-Example.csv` dans ce projet
2. Copiez tout le contenu
3. Collez dans l'onglet `FormConfig` de votre Google Sheet
4. C'est tout !

### Avantages

- ✅ Modifiez les champs sans toucher au code
- ✅ Ajoutez de nouveaux types d'actions facilement
- ✅ Changez où vont les données (colonnes E, F, G)
- ✅ Support de tous les types HTML : text, date, url, textarea, select, number

### Documentation complète

Consultez ces fichiers pour plus de détails :

- **`FORM-CONFIG-GUIDE.md`** : Guide complet d'utilisation
- **`WRITE-FLOW-EXPLANATION.md`** : Explication du flux d'écriture
- **`FormConfig-Example.csv`** : Exemple de configuration

## 📞 Support

Pour toute question ou problème, contactez l'administrateur du système.

## 📄 Licence

© 2024 Eugenia Challenge - Tous droits réservés

