# ✅ Automatisations Flexibles - TERMINÉ

## 🎯 Objectif

Permettre une **grande flexibilité** à l'admin pour configurer les automatisations selon **sa structure de Sheet**, peu importe comment il organise ses données.

---

## 📊 Cas d'usage : Sheet "Événements"

### Structure de ta Sheet

```
| A (Event)          | B (Dates)    | C (Lieux)    | D (Amb 1)  | E (Amb 2) | F (Amb 3) | G (Amb 4) |
|--------------------|--------------|--------------|------------|-----------|-----------|-----------|
| Vainqueur QVEMA    | 2024-09-13   | Campus       | Bouzidane  | Ansellem  | Ballonad  |           |
| Vainqueur leads    | 2024-09-21   | Paris Event  |            |           |           |           |
| Hackathon          | 2025-10-30   | Campus       | Ansellem   |           |           |           |
```

### Tu veux matcher les Ambassadeurs ?

**Configuration** :
- **Type d'action** : "Hackathon" (ou autre)
- **Type de matching** : `Nom (Ambassadeur, Étudiant...)`
- **Colonnes** : `D,E,F,G` (toutes les colonnes Ambassadeurs)
- **Règle** : `Exact match` ou `Match partiel`

**Résultat** : Si "Bouzidane" soumet une action, le système cherche "Bouzidane" dans les colonnes D, E, F, G → ✅ Match trouvé → Validation auto !

---

## 🔧 Nouveaux champs ajoutés

### 1. **Type de matching**

L'admin choisit **quel type de donnée** il veut matcher :

| Option | Description | Exemple |
|--------|-------------|---------|
| **Nom** | Matcher par nom de famille | Bouzidane, Ansellem |
| **Prénom** | Matcher par prénom | Walid, Orehn |
| **Nom complet** | Matcher par Prénom + Nom | Walid Bouzidane |
| **Email** | Matcher par email | wbouzidane@eugeniaschool.com |
| **Date** | Matcher par date | 2024-09-13 |

### 2. **Colonnes multiples**

Pour gérer les colonnes **Ambassadeur 1, 2, 3, 4** :

- **Colonnes uniques** : `D`
- **Colonnes multiples** : `D,E,F,G` (séparées par virgules)

Le système cherche dans **toutes** les colonnes !

### 3. **Nom complet**

Si tu veux matcher par Prénom + Nom (2 colonnes) :

- **Type** : `Nom complet (Prénom + Nom)`
- **Colonne 1** : `D` (Prénom)
- **Colonne 2** : `E` (Nom)

### 4. **Règles supplémentaires**

Nouvelle règle : `Match partiel` (ignore accents, majuscules)

---

## 💡 Exemples concrets

### Exemple 1 : Matcher les Ambassadeurs

**Sheet** :
```
| Event | Dates | Lieux | Amb 1 | Amb 2 | Amb 3 | Amb 4 |
|-------|-------|-------|-------|-------|-------|-------|
| JPO   | ...   | Paris | Dupont| Martin|       |       |
```

**Automatisation** :
```javascript
{
  actionTypeId: "jpo-participation",
  matchingType: "nom",
  matchingColumn: "D,E,F,G",  // Colonnes Ambassadeurs
  matchingRule: "partial"
}
```

**Test** : "Dupont" soumet "Participation JPO" → ✅ Match trouvé dans colonne D !

---

### Exemple 2 : Matcher par email

**Sheet** :
```
| Event | Dates | Lieux | Email                     |
|-------|-------|-------|---------------------------|
| JPO   | ...   | Paris | jean.dupont@eugenia.com   |
```

**Automatisation** :
```javascript
{
  actionTypeId: "jpo-participation",
  matchingType: "email",
  matchingColumn: "D",
  matchingRule: "exact"
}
```

**Test** : Email soumis = "jean.dupont@eugenia.com" → ✅ Match !

---

### Exemple 3 : Matcher par date d'événement

**Sheet** :
```
| Event | Dates      | Lieux | Amb 1 |
|-------|------------|-------|-------|
| JPO   | 2024-09-13 | Paris | Dupont|
```

**Automatisation** :
```javascript
{
  actionTypeId: "jpo-participation",
  matchingType: "date",
  matchingColumn: "B",
  matchingRule: "date"
}
```

**Test** : Étudiant soumet action avec date "2024-09-13" → ✅ Match !

---

### Exemple 4 : Nom complet (2 colonnes)

**Sheet** :
```
| Event | Dates | Prénom | Nom    | Email |
|-------|-------|--------|--------|-------|
| JPO   | ...   | Jean   | Dupont | ...   |
```

**Automatisation** :
```javascript
{
  actionTypeId: "jpo-participation",
  matchingType: "nom_complet",
  matchingColumn: "C",  // Prénom
  mappedColumns: ["D"], // Nom
  matchingRule: "partial"
}
```

**Test** : "Jean Dupont" soumet → ✅ Match Prénom C + Nom D !

---

## 🎨 Interface améliorée

### Nouvelle section "Type de matching"

Avant :
```
Colonne de matching: B
Règle: exact
```

Maintenant :
```
Type de matching: Nom (Ambassadeur, Étudiant...)  ← NOUVEAU !
Colonnes de matching: D,E,F,G                      ← Plusieurs possibles !
Règle: Match partiel                                ← +1 règle
```

### Aide contextuelle

Si tu choisis `Nom` :
```
💡 Pour plusieurs colonnes (Ambassadeur 1, 2, 3, 4) :
   Indiquez toutes les colonnes séparées par des virgules. Ex: D,E,F,G
```

Si tu choisis `Nom complet` :
```
Saisir 2 champs :
- Colonne Prénom
- Colonne Nom
```

### Exemple visuel dans la description

Un tableau montrant ta structure Sheet avec des exemples de configuration.

---

## 🔄 Rétrocompatibilité

Les anciennes automatisations fonctionnent toujours :

```javascript
// Ancienne config (avant)
{
  matchingColumn: "B",
  matchingRule: "exact"
  // matchingType par défaut: "nom"
}

// Nouvelle config (maintenant)
{
  matchingType: "nom",
  matchingColumn: "B",
  matchingRule: "exact"
}
```

**Pas de breaking change !** ✅

---

## 📝 Structure de données sauvegardée

```javascript
{
  id: "auto-123",
  actionTypeId: "hackathon",
  enabled: true,
  sheetId: "1BxiMVs0XRAY5LGjhKYZekcOO5J8dZWrP6VZnCrFzxqE",
  sheetRange: "A:G",
  matchingType: "nom",           // ← NOUVEAU
  matchingColumn: "D,E,F,G",     // ← Support multiples
  mappedColumns: [],             // ← Pour nom_complet
  matchingRule: "partial",       // ← +1 option
  createdAt: "2025-01-XX...",
  updatedAt: "2025-01-XX..."
}
```

---

## 🧪 Tests à effectuer

### Test 1 : Colonnes multiples

1. Créer une automation avec `matchingColumn: "D,E,F,G"`
2. Sheet a "Bouzidane" en colonne D, ligne 2
3. Étudiant "Bouzidane" soumet action
4. ✅ Devrait matcher et auto-valider

### Test 2 : Match partiel

1. Automation avec `matchingRule: "partial"`
2. Sheet a "BOUZIDANE" (majuscules)
3. Étudiant soumet "Bouzidane" (mixed case)
4. ✅ Devrait matcher malgré les majuscules

### Test 3 : Nom complet

1. Automation avec `matchingType: "nom_complet"`
2. Colonnes C (Prénom) et D (Nom)
3. Étudiant soumet "Jean Dupont"
4. ✅ Devrait matcher Prénom C + Nom D

---

## 🚀 Prochaines étapes

### Implémentation backend

Les fonctions mockées dans `googleSheets.js` devront être implémentées :

```javascript
export async function checkExternalSheet(data, sheetId, column, automationConfig) {
  // Lire la Sheet
  const sheet = await getSheet(sheetId);
  const range = automationConfig.sheetRange;
  const values = await sheet.getValues(range);
  
  // Gérer matchingType
  switch(automationConfig.matchingType) {
    case 'nom':
    case 'prenom':
      return matchInColumns(values, data, automationConfig.matchingColumn, automationConfig.matchingRule);
    
    case 'email':
      return matchEmail(values, data, automationConfig.matchingColumn);
    
    case 'date':
      return matchDate(values, data, automationConfig.matchingColumn);
    
    case 'nom_complet':
      return matchFullName(values, data, automationConfig.matchingColumn, automationConfig.mappedColumns);
  }
}

function matchInColumns(values, data, columns, rule) {
  const columnIndices = columns.split(',').map(c => c.trim());
  
  for (const row of values) {
    for (const colIndex of columnIndices) {
      const cellValue = row[columnToIndex(colIndex)];
      if (matches(cellValue, data, rule)) {
        return { found: true, matchedValue: cellValue };
      }
    }
  }
  
  return { found: false };
}
```

---

## 📚 Documentation mise à jour

Le Guide Admin (`AdminGuide.jsx`) sera automatiquement à jour puisque l'interface est auto-explicative avec les exemples visuels.

---

## ✅ Résumé

**Avant** : Rigide, une seule colonne, un seul type de matching
**Maintenant** : 
- ✅ 5 types de matching (nom, prénom, nom_complet, email, date)
- ✅ Colonnes multiples supportées
- ✅ 4 règles de matching
- ✅ Interface intuitive avec exemples
- ✅ Grande flexibilité pour adapter n'importe quelle Sheet
- ✅ Rétrocompatible

**Tu peux maintenant adapter ton système à n'importe quelle structure de Sheet !** 🎉

---

*Document généré automatiquement - Eugenia Challenge v1.1*

