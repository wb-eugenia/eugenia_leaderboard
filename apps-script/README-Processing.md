# Apps Script - Traitement Automatique des Actions

## 📋 Description

Ce script Google Apps Script traite **automatiquement** les actions soumises par les étudiants et attribue les points selon le barème défini.

**Important** : Ce script est indépendant du site React. Il fonctionne uniquement avec Google Sheets.

## 🎯 Fonctionnalités

- ✅ Traitement automatique des posts LinkedIn
- ✅ Vérification du nombre de likes
- ✅ Attribution automatique des points selon le barème
- ✅ Mise à jour du leaderboard
- ✅ Marquage visuel (vert pour validé, rouge pour non validé)
- ✅ Exécution horaire automatique ou manuelle

## 📊 Structure des Colonnes

### Onglet "actions"

| Colonne | Description | Rôle du script |
|---------|-------------|----------------|
| A-B | Vides (ne pas toucher) | - |
| C | Email | Lecture |
| D | Nom de l'action | Lecture |
| E | Lien (LinkedIn, etc.) | Lecture |
| F-H | Données diverses | Lecture |
| **I** | **Statut réception** | **Écriture** ✅/⚠️ |
| **J** | **Statut validation** | **Écriture** ✅/❌ |
| **K** | **Points attribués** | **Écriture** (nombre) |
| **L** | **Notes** | **Écriture** (commentaires) |

## 🚀 Configuration

### Étape 1 : Créer un nouveau projet Apps Script

1. Allez sur [script.google.com](https://script.google.com)
2. Créez un nouveau projet
3. Nommez-le "Eugenia Challenge - Processing"

### Étape 2 : Copier le code

1. Supprimez le code par défaut
2. Créez un fichier `Code.gs` (il sera créé automatiquement)
3. Copiez tout le contenu de `CodeProcessing.gs`
4. Collez dans l'éditeur

### Étape 3 : Configurer le SHEET_ID

1. Remplacez `YOUR_GOOGLE_SHEET_ID` par l'ID de votre Google Sheet
2. L'ID est visible dans l'URL : `https://docs.google.com/spreadsheets/d/[ID]/edit`

### Étape 4 : Tester le script

1. Sélectionnez la fonction `testProcessActions`
2. Cliquez sur **Run** (▶️)
3. Autorisez les permissions si demandé
4. Consultez les logs : **View > Execution log**

## ⚙️ Barème de Points

Le barème actuel est défini dans la fonction `processLinkedInPost` :

```javascript
const pointsBar = {
  100: 50,    // 100 likes = 50 points
  200: 100,   // 200 likes = 100 points
  500: 200,   // 500 likes = 200 points
  1000: 500   // 1000 likes = 500 points
};
```

**Vous pouvez modifier ces valeurs** selon vos besoins.

## 🔄 Deux Modes d'Exécution

### 1. Mode Manuel

Exécutez manuellement la fonction `processActions` :
1. Sélectionnez `processActions` dans le menu
2. Cliquez sur **Run**
3. Consultez les logs

### 2. Mode Automatique (Recommandé)

Le script s'exécute automatiquement toutes les heures :

1. Sélectionnez la fonction `createTrigger`
2. Cliquez sur **Run**
3. Le déclencheur est créé automatiquement

Pour vérifier le déclencheur :
1. Cliquez sur **Triggers** (🔔) dans le menu de gauche
2. Vous verrez le déclencheur "processActions - Hour time-driven"

## 🔍 Récupération des Likes LinkedIn

### Problème

LinkedIn n'a **pas d'API publique gratuite** pour récupérer le nombre de likes.

### Solutions Possibles

#### Solution 1 : API Tierce (Payante)

Utilisez des services comme :
- **Social Media Count API** (https://socialsharecount.com/)
- **SharedCount** (https://sharedcount.com/)
- **OpenGraph.io** (https://www.opengraph.io/)

Modifiez la fonction `getLinkedInLikesTierce()` avec votre clé API.

#### Solution 2 : Scraping (Limité)

Le code inclut une tentative de scraping, mais LinkedIn bloque souvent les requêtes automatisées.

#### Solution 3 : Validation Manuelle (Recommandé pour débuter)

Créez une fonction alternative `processManually()` qui valide manuellement les posts :

```javascript
function processManually(rowNumber, points, valid) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('actions');
  
  // Met à jour les colonnes selon vos critères manuels
  // Exemple pour la ligne 2 : processManually(2, 50, true)
}
```

## 📝 Logique de Traitement

### Pour un Post LinkedIn :

1. **Vérifie** si l'action est déjà traitée (colonne I vide)
2. **Récupère** le nombre de likes
3. **Compare** avec le seuil (100 likes)
4. **Si >= 100 likes** :
   - ✅ Colonne I : Vert + "Reçu"
   - ✅ Colonne J : Vert + "Validé"
   - ✅ Colonne K : Points attribués
   - ✅ Colonne L : "X likes - Y points attribués"
   - ✅ Leaderboard : Points ajoutés
5. **Si < 100 likes** :
   - ✅ Colonne I : Vert + "Reçu"
   - ❌ Colonne J : Rouge + "Pas validé"
   - ❌ Colonne L : "Pas assez de likes X/100"

## 🛠️ Fonctions Utiles

### `processActions()`
Traite toutes les actions en attente.

### `testProcessActions()`
Teste le traitement sur quelques lignes.

### `createTrigger()`
Crée un déclencheur horaire automatique.

### `processSpecificRow(rowNumber)`
Traite une ligne spécifique (ex: `processSpecificRow(5)`).

## 🔧 Personnalisation du Barème

Pour modifier le barème, éditez la variable `pointsBar` :

```javascript
const pointsBar = {
  100: 50,    // Changez ces valeurs
  200: 100,   // selon vos besoins
  500: 200,
  1000: 500,
  2000: 1000  // Ajoutez des paliers
};
```

## ⚠️ Limitations Actuelles

1. **Récupération des likes** : Nécessite une API tierce ou une solution personnalisée
2. **Résilience** : En cas d'erreur, la ligne est marquée en orange
3. **Concurrent** : Pas de gestion des appels concurrents (peut être ajouté)

## 📊 Vérification

Pour vérifier que tout fonctionne :

1. Soumettez un post LinkedIn via le formulaire
2. Attendez 1 heure (ou exécutez manuellement `processActions`)
3. Vérifiez les colonnes I, J, K, L dans l'onglet "actions"
4. Vérifiez que les points ont été ajoutés dans le leaderboard

## 🎓 Commentaires dans le Code

Le code est bien documenté avec des commentaires expliquant chaque section. N'hésitez pas à le modifier selon vos besoins.

## 📞 Support

Pour toute question, consultez les logs :
- **View > Execution log** dans Apps Script
- Les erreurs sont loggées dans la console
- Les valeurs sont affichées dans les colonnes

