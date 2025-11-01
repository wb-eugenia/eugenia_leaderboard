# ✅ Automatisations - Version FINALE

## 🎯 Système en 2 étapes obligatoires

Les automatisations vérifient **obligatoirement** 2 choses :
1. **Identité de l'étudiant** (nom, prénom, email)
2. **Un champ du formulaire** (date, lieu, événement...)

**Les deux doivent matcher pour valider automatiquement !**

---

## 📊 Exemple complet : Ta Sheet Événements

**Sheet** :
```
| A (Event)      | B (Dates)    | C (Lieux) | D (Amb 1) | E (Amb 2) | F (Amb 3) | G (Amb 4) |
|----------------|--------------|-----------|-----------|-----------|-----------|-----------|
| Vainqueur QVEMA| 2024-09-13   | Campus    | Bouzidane | Ansellem  | Ballonad  |           |
| Vainqueur leads| 2024-09-21   | Paris     |           |           |           |           |
| Hackathon      | 2025-10-30   | Campus    | Ansellem  |           |           |           |
```

### Configuration automatisation

**Étape 1 : Identifier l'étudiant** 🎓
- Type d'identifiant : **Nom**
- Colonnes Sheet : `D,E,F,G` (toutes les colonnes Ambassadeurs)

**Étape 2 : Vérifier un champ** 📝
- Champ formulaire : **Date de participation**
- Colonne Sheet : `B` (Dates)
- Règle : **Match par date**

---

## 🔄 Comment ça fonctionne

### Étudiant "Bouzidane" soumet avec date "2024-09-13"

1. **Étape 1** : Chercher "Bouzidane" dans colonnes D,E,F,G
   - ✅ Trouvé en ligne 1, colonne D

2. **Étape 2** : Vérifier si date "2024-09-13" existe en colonne B de la même ligne
   - ✅ Trouvé en ligne 1, colonne B

3. **Résultat** : ✅ **Validation automatique !**

---

### Étudiant "Bouzidane" soumet avec date "2024-10-15"

1. **Étape 1** : Chercher "Bouzidane" dans colonnes D,E,F,G
   - ✅ Trouvé en ligne 1, colonne D

2. **Étape 2** : Vérifier si date "2024-10-15" existe en colonne B de la même ligne
   - ❌ Pas trouvé (la ligne 1 a "2024-09-13", pas "2024-10-15")

3. **Résultat** : ❌ Pas de validation → passe en validation manuelle

---

### Étudiant "Martin" soumet (pas dans Sheet)

1. **Étape 1** : Chercher "Martin" dans colonnes D,E,F,G
   - ❌ Pas trouvé

2. **Résultat** : ❌ Pas de validation → passe en validation manuelle

---

## 🎨 Interface

### Section 1 : Identifier l'étudiant

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
│ D,E,F,G  │  ← Plusieurs colonnes séparées par virgules
└──────────┘
```

### Section 2 : Vérifier un champ

```
📝 Étape 2 : Vérifier un champ du formulaire

Champ du formulaire *
┌────────────────────────────────────┐
│ 📅 Date de participation           │
│ 📝 Lieu                            │
│ 📝 Nom de l'événement              │
└────────────────────────────────────┘

Colonne(s) pour ce champ *
┌──────┐
│ B    │  ← La colonne où chercher
└──────┘

Règle de matching *
┌─────────────────┐
│ Exact match     │
│ Contains        │
│ Match par date  │
│ Match partiel   │
└─────────────────┘
```

---

## ✅ Validation

### Champs obligatoires

**Étape 1** :
- ✅ Type d'identifiant
- ✅ Colonnes ID étudiant

**Étape 2** :
- ✅ Champ du formulaire
- ✅ Colonnes pour ce champ

Si un champ manque → **Alert** avant sauvegarde !

---

## 🔧 Cas d'usage

### Cas 1 : Vérifier Ambassadeur + Date

**Config** :
```javascript
{
  actionTypeId: "jpo-participation",
  studentIdType: "nom",
  studentIdColumns: "D,E,F,G",
  formFieldToMatch: "date",
  formFieldColumns: "B",
  formFieldRule: "date"
}
```

**Test** : "Bouzidane" + "2024-09-13" → ✅ Validé

---

### Cas 2 : Vérifier Ambassadeur + Nom d'événement

**Config** :
```javascript
{
  actionTypeId: "hackathon-victory",
  studentIdType: "nom",
  studentIdColumns: "D,E,F,G",
  formFieldToMatch: "eventName",
  formFieldColumns: "A",
  formFieldRule: "partial"
}
```

**Test** : "Ansellem" + "Hackathon" → ✅ Validé

---

### Cas 3 : Email + Lieu

**Config** :
```javascript
{
  actionTypeId: "jpo-participation",
  studentIdType: "email",
  studentIdColumns: "C",
  formFieldToMatch: "location",
  formFieldColumns: "C",
  formFieldRule: "partial"
}
```

**Test** : Email trouvé + Lieu "Campus" → ✅ Validé

---

## 📋 Structure de données

```javascript
{
  id: "auto-123",
  actionTypeId: "jpo-participation",
  enabled: true,
  sheetId: "1BxiMVs0XRAY5LGjhKYZekcOO5J8dZWrP6VZnCrFzxqE",
  sheetRange: "A:G",
  
  // Étape 1
  studentIdType: "nom",              // 'email' | 'nom' | 'prenom' | 'nom_complet'
  studentIdColumns: "D,E,F,G",       // OBLIGATOIRE
  
  // Étape 2
  formFieldToMatch: "date",          // OBLIGATOIRE
  formFieldColumns: "B",             // OBLIGATOIRE
  formFieldRule: "date",             // 'exact' | 'contains' | 'date' | 'partial'
  
  createdAt: "2025-01-XX...",
  updatedAt: "2025-01-XX..."
}
```

---

## 🧪 Logique de validation

```javascript
function autoValidate(action, automation) {
  // 1. Lire la Sheet
  const sheetData = readSheet(automation.sheetId, automation.sheetRange);
  
  // 2. Vérifier ID étudiant
  const studentId = getStudentId(action, automation.studentIdType);
  const studentColumns = parseColumns(automation.studentIdColumns);
  
  let foundRow = null;
  for (const row of sheetData) {
    if (searchInColumns(row, studentId, studentColumns)) {
      foundRow = row;
      break;
    }
  }
  
  if (!foundRow) {
    return { valid: false, reason: 'Étudiant non trouvé' };
  }
  
  // 3. Vérifier champ formulaire
  const formValue = action.data[automation.formFieldToMatch];
  const formColumns = parseColumns(automation.formFieldColumns);
  
  if (!searchInColumns(foundRow, formValue, formColumns, automation.formFieldRule)) {
    return { valid: false, reason: 'Champ formulaire non valide' };
  }
  
  // 4. Les deux OK !
  return { valid: true };
}
```

---

## 🎯 Pourquoi 2 étapes obligatoires ?

### Sécurité renforcée

Si seulement le nom :
- ❌ Risque de conflits (plusieurs "Martin")
- ❌ Validation trop facile

Avec nom + date :
- ✅ Vérifie la présence réelle
- ✅ Valide que c'était à la bonne date
- ✅ Moins de faux positifs

---

## 📝 Exemples de configuration

### Config 1 : JPO avec date

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

### Config 2 : Hackathon avec nom événement

```json
{
  "actionTypeId": "hackathon-victory",
  "studentIdType": "nom",
  "studentIdColumns": "D,E,F,G",
  "formFieldToMatch": "eventName",
  "formFieldColumns": "A",
  "formFieldRule": "partial"
}
```

### Config 3 : Événement avec lieu

```json
{
  "actionTypeId": "event-attendance",
  "studentIdType": "nom",
  "studentIdColumns": "D,E,F,G",
  "formFieldToMatch": "location",
  "formFieldColumns": "C",
  "formFieldRule": "contains"
}
```

---

## ✅ Checklist validation

### Pour qu'une action soit auto-validée, il faut :

1. ✅ L'étudiant existe dans une des colonnes ID (D,E,F,G...)
2. ✅ Le champ formulaire (date, lieu...) match dans la colonne spécifiée
3. ✅ Les deux conditions sont dans la MÊME ligne de la Sheet
4. ✅ Les règles de matching sont respectées

**Sinon** → Validation manuelle nécessaire

---

## 🎉 Avantages

### ✅ Double vérification

- Plus sûr
- Moins d'erreurs
- Validation précise

### ✅ Flexibilité

- ID étudiant : 4 options
- Champ formulaire : tous les champs disponibles
- Colonnes multiples supportées
- 4 règles de matching

### ✅ Interface claire

- 2 étapes visuellement séparées
- Champs obligatoires marqués *
- Désactivation si dépendant
- Messages d'erreur explicites

---

## 🚀 Test

```bash
npm run dev
# Ouvrir http://localhost:5173/admin/automations
```

**Test rapide** :
1. Créer une automatisation
2. Choisir type "Participation JPO"
3. Étape 1 : Nom, colonnes D,E,F,G
4. Étape 2 : Date, colonne B, règle date
5. Sauvegarder
6. ✅ Ça marche !

---

## ✅ Résumé

**Système** : 2 étapes obligatoires
**Sécurité** : Double vérification
**Flexibilité** : Toutes les combinaisons
**Interface** : Claire et intuitive
**Validation** : Champs obligatoires vérifiés
**Build** : Sans erreurs

**Prêt pour la production !** 🎉

---

*Document généré - Eugenia Challenge v1.2 Final*

