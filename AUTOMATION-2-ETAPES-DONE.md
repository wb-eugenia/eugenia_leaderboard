# ✅ Automatisations en 2 Étapes - TERMINÉ

## 🎯 Nouveau système simplifié

Configuration en **2 étapes claires** :

1. **🎓 Étape 1 : Identifier l'étudiant** (obligatoire)
   - Type d'ID : Email, Nom, Prénom, ou Nom complet
   - Colonnes Sheet : où chercher cet ID

2. **📝 Étape 2 : Vérifier un champ du formulaire** (optionnel)
   - Champ du formulaire : Date, Lieu, Nom événement...
   - Colonnes Sheet : où chercher ce champ
   - Règle : Exact, Contains, Date, Partial

---

## 📊 Exemple : Ta Sheet Événements

**Sheet** :
```
| A (Event)      | B (Dates)    | C (Lieux) | D (Amb 1) | E (Amb 2) | F (Amb 3) | G (Amb 4) |
|----------------|--------------|-----------|-----------|-----------|-----------|-----------|
| Vainqueur QVEMA| 2024-09-13   | Campus    | Bouzidane | Ansellem  | Ballonad  |           |
| Vainqueur leads| 2024-09-21   | Paris     |           |           |           |           |
| Hackathon      | 2025-10-30   | Campus    | Ansellem  |           |           |           |
```

### Configuration automatisation

**Étape 1 : Identifier l'étudiant**
- Type d'identifiant : **Nom**
- Colonnes Sheet : `D,E,F,G`

**Étape 2 : Champ du formulaire** (optionnel)
- Champ formulaire : **Date de participation** (si disponible)
- Colonne Sheet : `B`
- Règle : **Match par date**

---

## 🔄 Flux de vérification

### Cas 1 : Identification seule

**Config** :
- ID étudiant : Nom, Colonnes D,E,F,G
- Champ formulaire : (vide)

**Test** :
1. Étudiant "Bouzidane" soumet action
2. Système cherche "Bouzidane" dans colonnes D,E,F,G
3. ✅ Trouvé en ligne 1, colonne D → **Validé !**

---

### Cas 2 : Identification + Champ formulaire

**Config** :
- ID étudiant : Nom, Colonnes D,E,F,G
- Champ formulaire : Date, Colonne B, Règle date

**Test** :
1. Étudiant "Bouzidane" soumet action avec date "2024-09-13"
2. Système vérifie :
   - ✅ "Bouzidane" trouvé dans D (ligne 1)
   - ✅ Date "2024-09-13" trouvée dans B (ligne 1)
3. **Validé !**

**Si la date n'est pas "2024-09-13"** :
- ❌ Pas de validation (nom OK mais date KO)
- → Passe en file de validation manuelle

---

## 🎨 Interface

### Section 1 : ID Étudiant (Obligatoire)

```
🎓 Étape 1 : Identifier l'étudiant

Type d'identifiant étudiant *
┌─────────────────────────────────┐
│ 📧 Email                        │
│ 👤 Nom                          │
│ 👤 Prénom                       │
│ 👤 Nom complet (Prénom + Nom)   │
└─────────────────────────────────┘

Colonne(s) pour ID étudiant *
┌──────────┐
│ D,E,F,G  │
└──────────┘
💡 Plusieurs colonnes : Utilisez des virgules
```

### Section 2 : Champ formulaire (Optionnel)

```
📝 Étape 2 : Optionnel - Vérifier un champ du formulaire

Champ du formulaire
┌────────────────────────────────────┐
│ (Aucun - optionnel)                │
│ 📅 Date de participation           │
│ 📝 Lieu                            │
│ 📝 Nom de l'événement              │
└────────────────────────────────────┘

[Si champ sélectionné, affiche :]
┌─────────────────────┬─────────────────┐
│ Colonnes pour ce    │ Règle de        │
│ champ               │ matching        │
│ ┌──────┐            │ ┌─────────────┐ │
│ │ B    │            │ │ Exact match │ │
│ └──────┘            │ └─────────────┘ │
└─────────────────────┴─────────────────┘
```

---

## 📋 Cas d'usage

### Use Case 1 : Matcher Ambassadeurs

**Sheet** : Ambassadeurs en colonnes D,E,F,G

**Config** :
```
Étape 1 :
- Type : Nom
- Colonnes : D,E,F,G

Étape 2 :
- Champ : (vide)
```

**Résultat** : Si l'étudiant a participé → Validation auto

---

### Use Case 2 : Matcher date d'événement

**Sheet** : Dates en colonne B

**Config** :
```
Étape 1 :
- Type : Nom
- Colonnes : D,E,F,G

Étape 2 :
- Champ : Date de participation
- Colonne : B
- Règle : Match par date
```

**Résultat** : Nom trouvé ET date trouvée → Validation auto

---

### Use Case 3 : Matcher par email

**Sheet** : Emails en colonne C

**Config** :
```
Étape 1 :
- Type : Email
- Colonne : C

Étape 2 :
- Champ : (vide)
```

**Résultat** : Email trouvé → Validation auto

---

## 🔧 Structure technique

### Données sauvegardées

```javascript
{
  id: "auto-123",
  actionTypeId: "hackathon-victory",
  enabled: true,
  sheetId: "1BxiMVs0XRAY5LGjhKYZekcOO5J8dZWrP6VZnCrFzxqE",
  sheetRange: "A:G",
  
  // Étape 1 : ID étudiant (obligatoire)
  studentIdType: "nom",              // 'email' | 'nom' | 'prenom' | 'nom_complet'
  studentIdColumns: "D,E,F,G",       // Colonnes pour ID
  
  // Étape 2 : Champ formulaire (optionnel)
  formFieldToMatch: "date",          // Champ formulaire OU '' si vide
  formFieldColumns: "B",             // Colonnes pour ce champ
  formFieldRule: "date",             // Règle de matching
  
  createdAt: "2025-01-XX...",
  updatedAt: "2025-01-XX..."
}
```

### Logique de validation backend

```javascript
async function autoValidate(action, automation) {
  const sheet = await readSheet(automation.sheetId);
  const values = await sheet.getValues(automation.sheetRange);
  
  // Étape 1 : Vérifier ID étudiant
  const studentId = getStudentIdentifier(action, automation.studentIdType);
  const studentIdColumns = parseColumns(automation.studentIdColumns);
  
  const matchedRow = findStudentInColumns(values, studentId, studentIdColumns);
  if (!matchedRow) {
    return { valid: false, reason: 'Student not found' };
  }
  
  // Étape 2 : Vérifier champ formulaire (si configuré)
  if (automation.formFieldToMatch) {
    const formValue = action.data[automation.formFieldToMatch];
    const formColumns = parseColumns(automation.formFieldColumns);
    
    if (!matchFormField(
      matchedRow, 
      formValue, 
      formColumns, 
      automation.formFieldRule
    )) {
      return { valid: false, reason: 'Form field mismatch' };
    }
  }
  
  return { valid: true };
}

function getStudentIdentifier(action, type) {
  switch(type) {
    case 'email': return action.email;
    case 'nom': return action.nom;
    case 'prenom': return action.prenom;
    case 'nom_complet': return `${action.prenom} ${action.nom}`;
    default: return null;
  }
}

function findStudentInColumns(values, studentId, columns) {
  for (let rowIndex = 0; rowIndex < values.length; rowIndex++) {
    const row = values[rowIndex];
    for (const colIndex of columns) {
      if (matches(row[colIndex], studentId, 'partial')) {
        return { row, rowIndex };
      }
    }
  }
  return null;
}

function matchFormField(rowData, formValue, columns, rule) {
  for (const colIndex of columns) {
    if (matches(rowData[colIndex], formValue, rule)) {
      return true;
    }
  }
  return false;
}

function matches(sheetValue, formValue, rule) {
  if (!sheetValue || !formValue) return false;
  
  switch(rule) {
    case 'exact':
      return String(sheetValue).trim() === String(formValue).trim();
    
    case 'contains':
      return String(sheetValue).toLowerCase().includes(String(formValue).toLowerCase());
    
    case 'date':
      return normalizeDate(sheetValue) === normalizeDate(formValue);
    
    case 'partial':
      return normalizeString(sheetValue) === normalizeString(formValue);
    
    default:
      return false;
  }
}

function normalizeString(str) {
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function normalizeDate(dateStr) {
  // Convertir différents formats de date en ISO
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
}
```

---

## ✅ Avantages du système 2 étapes

### ✅ Simplicité

Plus besoin de comprendre des "types de matching" abstraits :
- **Étape 1** : Qui est l'étudiant ?
- **Étape 2** : Que doit-on vérifier ?

### ✅ Flexibilité

- Identification claire de l'étudiant
- Vérification optionnelle d'un champ spécifique
- Adaptable à n'importe quelle structure Sheet

### ✅ Puissance

Combinaisons possibles :
- Nom seul → Validation si participant
- Nom + Date → Validation si date correcte
- Email seul → Validation si présent
- Nom + Lieu → Validation si bon lieu

### ✅ Interface claire

Deux sections distinctes avec titres :
- 🎓 Étape 1 (bleu)
- 📝 Étape 2 (vert)
- Pas de confusion

---

## 📝 Exemples de configuration

### Exemple 1 : Simple (nom seul)

```json
{
  "actionTypeId": "hackathon",
  "studentIdType": "nom",
  "studentIdColumns": "D,E,F,G",
  "formFieldToMatch": "",
  "formFieldColumns": "",
  "formFieldRule": "exact"
}
```

**Résultat** : "Bouzidane" trouvé → ✅ Validé

---

### Exemple 2 : Nom + Date

```json
{
  "actionTypeId": "jpo-participation",
  "studentIdType": "nom",
  "studentIdColumns": "D,E,F,G",
  "formFieldToMatch": "date",
  "formFieldColumns": "B",
  "formFieldRule": "date"
}
```

**Résultat** : "Bouzidane" + date "2024-09-13" → ✅ Validé

---

### Exemple 3 : Email seul

```json
{
  "actionTypeId": "event-attendance",
  "studentIdType": "email",
  "studentIdColumns": "C",
  "formFieldToMatch": "",
  "formFieldColumns": "",
  "formFieldRule": "exact"
}
```

**Résultat** : Email trouvé → ✅ Validé

---

## 🧪 Tests

### Test 1 : Identification réussie, pas de champ formulaire

1. Sheet : "Bouzidane" en D ligne 1
2. Config : Nom, colonnes D,E,F,G, champ vide
3. Étudiant "Bouzidane" soumet
4. ✅ Devrait valider

### Test 2 : Identification + champ formulaire OK

1. Sheet : "Bouzidane" en D, "2024-09-13" en B ligne 1
2. Config : Nom D,E,F,G + Date B
3. Étudiant "Bouzidane" avec date "2024-09-13" soumet
4. ✅ Devrait valider

### Test 3 : Identification OK, champ formulaire KO

1. Sheet : "Bouzidane" en D, "2024-09-13" en B ligne 1
2. Config : Nom D,E,F,G + Date B
3. Étudiant "Bouzidane" avec date "2024-10-15" soumet
4. ❌ Devrait passer en validation manuelle

### Test 4 : Identification échouée

1. Sheet : "Martin" en D ligne 1 (pas "Bouzidane")
2. Config : Nom, colonnes D,E,F,G
3. Étudiant "Bouzidane" soumet
4. ❌ Devrait passer en validation manuelle

---

## 🚀 Migration depuis ancien système

### Ancien (v1.1)
```javascript
{
  matchingType: "nom",
  matchingColumn: "D,E,F,G"
}
```

### Nouveau (v1.2)
```javascript
{
  studentIdType: "nom",
  studentIdColumns: "D,E,F,G",
  formFieldToMatch: "",           // Vide par défaut
  formFieldColumns: "",
  formFieldRule: "exact"
}
```

**Conversion automatique** : Les anciennes configs sont compatibles !

---

## ✅ Résumé

**Système** : 2 étapes claires et distinctes
**Interface** : 2 sections séparées visuellement
**Flexibilité** : ID étudiant + champ optionnel
**Simplicité** : Plus intuitif
**Puissance** : Toutes les combinaisons possibles

**Tu peux maintenant configurer n'importe quel cas d'usage !** 🎉

---

*Document généré - Eugenia Challenge v1.2*

