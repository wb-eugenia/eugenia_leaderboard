# Apps Script - Attribution Automatique des Points

## 📋 Description

Ce script traite **automatiquement** les actions dans le Google Sheet et attribue les points pour les catégories **Salon/Event** et **Vainqueurs**.

**Important** : Ce script est **indépendant** du site React. Il fonctionne uniquement avec Google Sheets.

## 🎯 Fonctionnalités

- ✅ Traitement automatique ligne par ligne
- ✅ Détection de l'état via la couleur de la colonne I
- ✅ Attribution des points pour Salon/Event et Vainqueurs
- ✅ Vérification dans les feuilles "Salon" et "Vainqueurs"
- ✅ Récupération des points depuis le barème
- ✅ Mise à jour automatique du leaderboard
- ✅ Exécution horaire automatique

## 📊 Logique de Traitement

### États de la Colonne I

| Couleur | Action |
|---------|--------|
| 🔴 **Rouge** | À traiter → Le script analyse la ligne |
| 🟢 **Vert** | Déjà traité → Passage à la ligne suivante |
| ⚪ **Blanc** | Arrêt → Le script s'arrête et envoie un message |

### Processus pour une Ligne à Traiter

1. **Récupère les données** :
   - Colonne B : Nom de l'étudiant
   - Colonne D : Nom de l'action
   - Colonne F : Date

2. **Vérifie le type d'action** :
   - **LinkedIn ou Autre** → Passe à la ligne suivante (ignoré)
   - **Salon/Event** → Va dans la feuille "Salon"
   - **Vainqueurs** → Va dans la feuille "Vainqueurs"

3. **Pour Salon/Event ou Vainqueurs** :
   - Va chercher dans la feuille correspondante :
     - Colonne A : Nom de l'action
     - Colonne B : Date
     - Colonnes D, E, F, G : Liste des participants
   - Vérifie si le nom (colonne B) est dans la liste
   - Vérifie si l'action correspond
   - Vérifie si la date correspond

4. **Si match trouvé** :
   - Va chercher les points dans la feuille "Barème" :
     - Colonne A : Nom de l'action
     - Colonne B : Points attribués
   - Met à jour les colonnes :
     - **Colonne I** : Vert + "✅ Traité"
     - **Colonne J** : Vert + "✅ Validé"
     - **Colonne K** : Points attribués
   - Met à jour le leaderboard

5. **Si pas de match** :
   - **Colonne I** : Orange + "⚠️ Erreur"
   - **Colonne L** : Message d'erreur

## 📋 Structure Requise des Feuilles

### Feuille "actions"

| Colonne | Description |
|---------|-------------|
| B | Nom de l'étudiant |
| C | Email |
| D | Nom de l'action |
| F | Date |
| I | Statut (couleur rouge = à traiter) |
| J | Validation |
| K | Points |
| L | Notes/Erreurs |

### Feuille "Salon"

| Colonne | Description |
|---------|-------------|
| A | Nom de l'action (ex: "JPO", "Salon 1 journée") |
| B | Date |
| D, E, F, G | Liste des participants (nom dans colonne B) |

### Feuille "Vainqueurs"

| Colonne | Description |
|---------|-------------|
| A | Nom de l'action (ex: "Hackathon", "Lead Salon") |
| B | Date |
| D, E, F, G | Liste des participants (nom dans colonne B) |

### Feuille "Barème"

| Colonne | Description |
|---------|-------------|
| A | Nom de l'action (exactement comme dans actions - colonne D) |
| B | Points attribués (nombre) |

### Feuille "leaderboard"

| Colonne | Description |
|---------|-------------|
| D | Email |
| E | Points (sera mis à jour automatiquement) |

## 🚀 Configuration

### Étape 1 : Créer un nouveau projet Apps Script

1. Allez sur [script.google.com](https://script.google.com)
2. Créez un nouveau projet
3. Nommez-le "Eugenia Challenge - Auto Points"

### Étape 2 : Copier le code

1. Supprimez le code par défaut
2. Créez un fichier `Code.gs`
3. Copiez tout le contenu de `CodeAutoPoints.gs`
4. Collez dans l'éditeur

### Étape 3 : Configurer le SHEET_ID

1. Remplacez `YOUR_GOOGLE_SHEET_ID` par l'ID de votre Google Sheet
2. L'ID est visible dans l'URL : `https://docs.google.com/spreadsheets/d/[ID]/edit`

### Étape 4 : Tester le script

1. Sélectionnez la fonction `testAutoPoints`
2. Cliquez sur **Run** (▶️)
3. Autorisez les permissions si demandé
4. Consultez les logs : **View > Execution log**

### Étape 5 : Utiliser le menu dans Google Sheets

Une fois le code copié, **rechargez votre Google Sheet** (F5 ou rafraîchir la page).

Un nouveau menu **"🏆 Auto Points"** apparaîtra dans la barre de menu de Google Sheets avec les options :

- **▶️ Traiter les actions** : Lance le traitement manuellement pour tester
- **⏰ Activer l'automatisation (1h)** : Active l'exécution automatique toutes les heures
- **❌ Désactiver l'automatisation** : Supprime les déclencheurs automatiques
- **📊 Voir les déclencheurs** : Affiche les déclencheurs actifs

### Étape 6 : Activer l'exécution automatique

**Depuis Google Sheets :**
1. Rechargez votre Google Sheet
2. Cliquez sur **🏆 Auto Points** dans le menu
3. Cliquez sur **⏰ Activer l'automatisation (1h)**
4. Le déclencheur horaire est créé

**Depuis Apps Script :**
1. Sélectionnez la fonction `createAutoTrigger`
2. Cliquez sur **Run**
3. Autorisez les permissions si demandé
4. Le déclencheur horaire est créé

### Étape 7 : Tester le script

**Depuis Google Sheets (Recommandé) :**
1. Cliquez sur **🏆 Auto Points** dans le menu
2. Cliquez sur **▶️ Traiter les actions**
3. Le script s'exécute et affiche un message de confirmation

**Depuis Apps Script :**
1. Sélectionnez la fonction `processAutoPoints` ou `testAutoPoints`
2. Cliquez sur **Run**
3. Consultez les logs : **View > Execution log**

Pour vérifier les déclencheurs :
1. Dans Apps Script, cliquez sur **Triggers** (🔔) dans le menu de gauche
2. Vous verrez le déclencheur "processAutoPoints - Hour time-driven"
3. Ou utilisez **🏆 Auto Points > 📊 Voir les déclencheurs** dans Google Sheets

## 🔍 Exemples d'Actions Traitées

### Salon/Event
- ✅ "Salon (1 journée)"
- ✅ "JPO"
- ✅ "Forum Lycée"
- ✅ "Salon 1/2 journée"

### Vainqueurs
- ✅ "Hackathon"
- ✅ "Lead Salon"
- ✅ "BDD"

### Ignorées (passage automatique)
- ⏭️ "Post LinkedIn"
- ⏭️ "Création Asso"
- ⏭️ "Création Événement"
- ⏭️ "Contact Intéressant"

## 🎨 Couleurs Utilisées

- 🔴 **Rouge** (`#ffebee`) : À traiter (déjà présent depuis le formulaire)
- 🟢 **Vert** (`#e8f5e9`) : Traité et validé avec succès
- 🟠 **Orange** (`#fff3e0`) : Erreur (pas de correspondance trouvée)

## ⚙️ Personnalisation

### Modifier les actions Salon/Event

Éditez la fonction `isSalonEvent()` :
```javascript
const salonActions = [
  'Salon (1 journée)',
  'JPO',
  'Forum Lycée',
  'Salon 1/2 journée'
];
```

### Modifier les actions Vainqueurs

Éditez la fonction `isVainqueur()` :
```javascript
const vainqueurActions = [
  'Hackathon',
  'Lead Salon',
  'BDD'
];
```

## 📝 Logs et Debugging

Consultez les logs dans **View > Execution log** pour voir :
- Les lignes traitées
- Les correspondances trouvées
- Les erreurs rencontrées
- Le nombre de lignes traitées

## ⚠️ Points Importants

1. **Arrêt automatique** : Le script s'arrête dès qu'il rencontre une colonne I blanche
2. **Sensibilité à la casse** : Les comparaisons de noms et actions sont insensibles à la casse
3. **Dates flexibles** : Le script compare les dates de manière flexible
4. **Pas de doublon** : Les lignes déjà traitées (vertes) sont ignorées

## 🔄 Workflow Recommandé

1. Les étudiants soumettent des actions via le formulaire
2. Les actions apparaissent avec la colonne I en rouge
3. Vous remplissez les feuilles "Salon" et "Vainqueurs" avec les participants
4. Le script s'exécute automatiquement toutes les heures
5. Les points sont attribués automatiquement

## 📞 Dépannage

### Le script ne trouve pas de correspondance

1. Vérifiez que le nom dans la colonne B correspond exactement à celui dans Salon/Vainqueurs
2. Vérifiez que l'action dans la colonne D correspond exactement à celle dans le barème
3. Vérifiez que la date dans la colonne F correspond à celle dans Salon/Vainqueurs

### Les points ne sont pas mis à jour

1. Vérifiez que l'email dans la colonne C existe dans le leaderboard
2. Vérifiez que le barème contient l'action exacte
3. Consultez les logs pour voir les erreurs

