# ✅ Automatisations par Champ de Formulaire - TERMINÉ

## 🎯 Nouveau système

**Avant** : Type de matching fixe (nom, prénom, email, date...)
**Maintenant** : Sélection d'**un champ du formulaire** à matcher avec les colonnes de la Sheet

---

## 📊 Fonctionnement

### Exemple : Sheet "Événements"

**Ta Sheet** :
```
| A (Event)      | B (Dates)    | C (Lieux) | D (Amb 1) | E (Amb 2) | F (Amb 3) | G (Amb 4) |
|----------------|--------------|-----------|-----------|-----------|-----------|-----------|
| Vainqueur QVEMA| 2024-09-13   | Campus    | Bouzidane | Ansellem  | Ballonad  |           |
| Vainqueur leads| 2024-09-21   | Paris     |           |           |           |           |
```

**Configuration de l'automatisation** :
1. **Type d'action** : "Hackathon" (par exemple)
2. **Champ formulaire à matcher** : 
   - Option 1 : "Nom de l'étudiant" (depuis profil)
   - Option 2 : "Email de l'étudiant" (depuis profil)
   - Option 3 : Un champ du formulaire (ex: "Date de l'événement")
3. **Colonnes Sheet** : `D,E,F,G` (colonne Ambassadeurs)
4. **Règle** : "Match partiel"

**Résultat** : 
- Étudiant "Bouzidane" soumet action
- Système cherche "Bouzidane" dans colonnes D,E,F,G
- ✅ Trouvé dans ligne 1, colonne D → Auto-validation !

---

## 🎨 Interface améliorée

### Nouveau champ de sélection

**"Champ du formulaire à matcher"** :
```
Sélection d'abord un type d'action → Menu déroulant apparaît

Options disponibles :
📧 Email de l'étudiant
👤 Nom de l'étudiant
👤 Prénom de l'étudiant
📅 Date de participation (si champ date existe)
📝 Nom de l'événement (si champ text existe)
📝 Lieu (si champ existe)
... + Tous les autres champs du formulaire
```

### Exemple concret

**Type d'action** : "Participation JPO"

**Champs disponibles** :
- Email de l'étudiant
- Nom de l'étudiant  
- Prénom de l'étudiant
- 📅 Date de participation (champ du formulaire)
- 📝 Lieu (champ du formulaire)
- 📝 Notes (champ du formulaire)

**Tu choisirais** :
- ✅ **"Date de participation"** pour matcher avec colonne B (Dates) de ta Sheet

---

## 🔄 Cas d'usage

### Cas 1 : Matcher par Nom dans Ambassadeurs

**Sheet** :
```
| Event    | Dates       | Lieux | Amb 1     | Amb 2     | Amb 3     | Amb 4     |
|----------|-------------|-------|-----------|-----------|-----------|-----------|
| Hackathon| 2025-10-30  | ...   | Ansellem  |           |           |           |
```

**Automatisation** :
- Champ formulaire : "Nom de l'étudiant"
- Colonnes Sheet : `D,E,F,G`
- Règle : "Match partiel"

**Test** : "Ansellem" → ✅ Trouvé !

---

### Cas 2 : Matcher par Date

**Sheet** :
```
| Event    | Dates       | Lieux | Amb 1     |
|----------|-------------|-------|-----------|
| JPO      | 2024-09-13  | Paris |           |
| JPO      | 2024-10-15  | Lyon  |           |
```

**Automatisation** :
- Champ formulaire : "📅 Date de participation"
- Colonnes Sheet : `B`
- Règle : "Match par date"

**Test** : Étudiant soumet avec date "2024-09-13" → ✅ Trouvé !

---

### Cas 3 : Matcher par Email

**Sheet** :
```
| Event    | Dates       | Email                     |
|----------|-------------|---------------------------|
| JPO      | 2024-09-13  | jean.dupont@eugenia.com   |
```

**Automatisation** :
- Champ formulaire : "📧 Email de l'étudiant"
- Colonnes Sheet : `C`
- Règle : "Exact match"

**Test** : Email = "jean.dupont@eugenia.com" → ✅ Trouvé !

---

## 🎯 Avantages du nouveau système

### ✅ Flexibilité maximale

Tu décides **exactement** ce qui est comparé :
- Profil étudiant (email, nom, prénom)
- N'importe quel champ du formulaire
- Plusieurs colonnes Sheet supportées

### ✅ Adaptation à toute structure

Peu importe comment ta Sheet est organisée :
- Colonnes multiples (Ambassadeur 1-4) → `D,E,F,G`
- Une seule colonne → `B`
- Colonnes avec en-têtes → Utilise les bonnes lettres

### ✅ Champs dynamiques

Selon le type d'action sélectionné :
- Les champs du formulaire s'affichent automatiquement
- Les champs Email/Nom/Prénom sont toujours disponibles
- Tu choisis le plus pertinent pour ton cas

### ✅ Règles adaptatives

4 règles de matching :
- **Exact** : Correspondance exacte
- **Contains** : Contient la chaîne
- **Date** : Comparaison par date
- **Partial** : Ignore accents et majuscules

---

## 🔧 Structure technique

### Données sauvegardées

```javascript
{
  id: "auto-123",
  actionTypeId: "jpo-participation",
  enabled: true,
  sheetId: "1BxiMVs0XRAY5LGjhKYZekcOO5J8dZWrP6VZnCrFzxqE",
  sheetRange: "A:G",
  formFieldToMatch: "date",           // ← Le champ du formulaire
  matchingColumn: "B",                // ← Colonnes Sheet à vérifier
  matchingRule: "date",               // ← Règle de comparaison
  mappedColumns: [],                  // Réservé pour futurs développements
  createdAt: "2025-01-XX...",
  updatedAt: "2025-01-XX..."
}
```

### Fonctionnement backend

```javascript
// Lors de la validation automatique
async function autoValidate(action, automation) {
  // 1. Récupérer la valeur du champ sélectionné
  const fieldValue = getFormFieldValue(action, automation.formFieldToMatch);
  //   → ex: "Bouzidane" si formFieldToMatch = "nom"
  //   → ex: "2024-09-13" si formFieldToMatch = "date"
  
  // 2. Lire la Sheet externe
  const sheetValues = await readSheet(automation.sheetId, automation.sheetRange);
  
  // 3. Convertir colonnes en indices
  const columnIndices = parseColumns(automation.matchingColumn); // "D,E,F,G" → [3,4,5,6]
  
  // 4. Chercher dans les colonnes
  for (const row of sheetValues) {
    for (const colIndex of columnIndices) {
      const cellValue = row[colIndex];
      if (matches(cellValue, fieldValue, automation.matchingRule)) {
        return { found: true, matchedValue: cellValue };
      }
    }
  }
  
  return { found: false };
}
```

---

## 📝 Exemples de configuration

### Config 1 : Matcher Ambassadeurs (Nom)

```json
{
  "actionTypeId": "hackathon-victory",
  "formFieldToMatch": "nom",
  "matchingColumn": "D,E,F,G",
  "matchingRule": "partial",
  "sheetRange": "A:G"
}
```

### Config 2 : Matcher Date d'événement

```json
{
  "actionTypeId": "jpo-participation",
  "formFieldToMatch": "date",
  "matchingColumn": "B",
  "matchingRule": "date",
  "sheetRange": "A:C"
}
```

### Config 3 : Matcher Email dans liste participants

```json
{
  "actionTypeId": "jpo-participation",
  "formFieldToMatch": "email",
  "matchingColumn": "C",
  "matchingRule": "exact",
  "sheetRange": "A:D"
}
```

### Config 4 : Matcher Nom d'événement

```json
{
  "actionTypeId": "hackathon-victory",
  "formFieldToMatch": "eventName",
  "matchingColumn": "A",
  "matchingRule": "partial",
  "sheetRange": "A:G"
}
```

---

## 🧪 Tests à effectuer

### Test 1 : Nom dans colonnes multiples

1. Sheet a "Bouzidane" en colonne D, ligne 2
2. Config : formFieldToMatch="nom", matchingColumn="D,E,F,G"
3. Étudiant "Bouzidane" soumet action
4. ✅ Devrait matcher et auto-valider

### Test 2 : Date d'événement

1. Sheet a "2024-09-13" en colonne B, ligne 2
2. Config : formFieldToMatch="date", matchingColumn="B", rule="date"
3. Étudiant soumet avec date "2024-09-13"
4. ✅ Devrait matcher

### Test 3 : Email exact

1. Sheet a "jean.dupont@eugenia.com" en colonne C
2. Config : formFieldToMatch="email", matchingColumn="C", rule="exact"
3. Étudiant avec cet email soumet
4. ✅ Devrait matcher

### Test 4 : Champs dynamiques

1. Sélectionner type "jpo-participation"
2. Menu "Champ à matcher" doit contenir :
   - Email, Nom, Prénom (basiques)
   - Date de participation (champ du formulaire)
   - Lieu (champ du formulaire)
   - Notes (champ du formulaire)
3. ✅ Tous les champs affichés

---

## 🚀 Prochaines étapes

### Implémentation backend Google Sheets

Les fonctions dans `googleSheets.js` :
```javascript
export async function checkExternalSheet(action, automation) {
  // 1. Extraire valeur du champ
  const fieldValue = action.data[automation.formFieldToMatch];
  
  // 2. Appeler API Google Sheets
  const sheet = await getSheet(automation.sheetId);
  const values = await sheet.getValues(automation.sheetRange);
  
  // 3. Parser colonnes
  const columnIndices = parseColumnLetters(automation.matchingColumn);
  
  // 4. Chercher
  return searchInColumns(values, fieldValue, columnIndices, automation.matchingRule);
}
```

---

## ✅ Résumé

**Avant** : 5 types prédéfinis, peu flexible
**Maintenant** : 
- ✅ Champ de formulaire choisi par l'admin
- ✅ Email, Nom, Prénom toujours disponibles
- ✅ Tous les champs du formulaire accessibles
- ✅ Support colonnes multiples
- ✅ 4 règles de matching
- ✅ Adaptation à toute structure Sheet
- ✅ Interface intuitive avec exemples
- ✅ Build sans erreurs

**Tu as maintenant une grande flexibilité pour adapter ton système !** 🎉

---

*Document généré - Eugenia Challenge v1.2*

