# 📝 Explication du flux d'écriture des données dans l'onglet "actions"

## 🎯 Vue d'ensemble

Le système écrit maintenant les données **dynamiquement** selon la configuration définie dans l'onglet `FormConfig` de votre Google Sheet.

---

## 🔄 Flux complet

### 1️⃣ Utilisateur soumet le formulaire

**Données envoyées** (JSON depuis `ActionForm.jsx`) :
```json
{
  "email": "etudiant@eugeniaschool.com",
  "category": "LinkedIn",
  "subType": "linkedin",
  "link": "https://www.linkedin.com/posts/...",
  "notes": "Super post !",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### 2️⃣ Le serveur Apps Script reçoit les données

**Fonction** : `submitAction(data)` dans `Code.gs`

**Processus** :

#### A. Charger la configuration dynamique

```javascript
const config = loadFormConfigForSubType('linkedin');
```

**Cette fonction** :
- Lit l'onglet `FormConfig`
- Trouve toutes les lignes avec `SubCategory = linkedin`
- Retourne un objet avec les champs définis :

```javascript
{
  category: "LinkedIn",
  subType: "linkedin",
  label: "Post LinkedIn",
  emoji: "📱",
  fields: [
    {
      type: "url",
      name: "link",
      label: "Lien du post",
      required: true,
      placeholder: "https://www.linkedin.com/posts/...",
      columnMapping: "E"  // ⭐ C'EST ICI QUE ÇA SE PASSE
    }
  ]
}
```

---

#### B. Mapper les données selon la configuration

```javascript
if (config && config.fields && config.fields.length > 0) {
  // Configuration dynamique trouvée !
  actionName = config.label || subType;  // "Post LinkedIn"
  
  config.fields.forEach((field) => {
    const value = data[field.name];  // data["link"] = "https://..."
    const colLetter = field.columnMapping;  // "E"
    
    const colIndex = getColumnIndex(colLetter);  // E → 5
    
    // Assigner la valeur selon l'index de colonne
    if (colIndex === 5) link = value;      // Colonne E
    else if (colIndex === 6) dateStr = value;  // Colonne F
    else if (colIndex === 7) lieu = value;     // Colonne G
  });
}
```

**Résultat** :
- `actionName = "Post LinkedIn"`
- `link = "https://www.linkedin.com/posts/..."`
- `dateStr = ""`
- `lieu = ""`

---

#### C. Fallback si pas de config

Si l'onglet `FormConfig` n'existe pas ou est vide :

```javascript
else {
  // Ancienne logique hardcodée
  const subTypeLabels = {
    'linkedin': 'Post LinkedIn',
    'jpo': 'JPO',
    // ...
  };
  actionName = subTypeLabels[subType] || subType;
  
  // Logique spécifique par catégorie
  if (subType === 'linkedin') {
    link = data.link || data.postUrl || '';
  }
  // ...
}
```

**C'est rétrocompatible !** 🎉

---

#### D. Trouver la première ligne vide

```javascript
// Chercher une ligne vide dans la colonne C (email)
for (let i = 2; i <= maxRows; i++) {
  const emailCell = sheet.getRange(i, 3).getValue(); // Colonne C
  
  if (!emailCell || emailCell.toString().trim() === '') {
    nextRow = i;  // Cette ligne est disponible !
    break;
  }
}
```

---

#### E. Construire et écrire la ligne

```javascript
const row = [
  '',                              // A : vide (formule XLOOKUP)
  '',                              // B : vide (formule XLOOKUP)
  'etudiant@...',                  // C : email
  'Post LinkedIn',                 // D : actionName
  'https://linkedin.com/...',      // E : link
  '',                              // F : dateStr
  '',                              // G : lieu
  'Super post !',                  // H : notes
  ''                               // I : vide (sera rouge)
];

// Écrire la ligne
sheet.getRange(nextRow, 1, 1, 9).setValues([row]);
```

---

#### F. Ajouter les formules XLOOKUP

```javascript
// Colonne A : Prénom depuis leaderboard
sheet.getRange(nextRow, 1).setFormula(
  `=XLOOKUP(C${nextRow},Leaderboard!$D$2:$D,Leaderboard!$A$2:$A)`
);

// Colonne B : Nom depuis leaderboard
sheet.getRange(nextRow, 2).setFormula(
  `=XLOOKUP(C${nextRow},Leaderboard!$D$2:$D,Leaderboard!$B$2:$B)`
);
```

**Résultat** : Les colonnes A et B se remplissent automatiquement ! ✨

---

#### G. Colorer la colonne I en rouge

```javascript
sheet.getRange(nextRow, 9, 1, 1).setBackground('#ffebee'); // Rouge clair
```

**État** : "En attente de validation"

---

### 3️⃣ Résultat dans Google Sheets

**Onglet `actions`** :

| A (Prénom) | B (Nom) | C (Email) | D (Action) | E (Lien) | F (Date) | G (Lieu) | H (Notes) | I (Status) |
|------------|---------|-----------|------------|----------|----------|----------|-----------|------------|
| Jean | Dupont | etudiant@... | Post LinkedIn | https://... |  |  | Super post ! | **Rouge** |

**Formules** :
- A2 : `=XLOOKUP(C2,Leaderboard!$D$2:$D,Leaderboard!$A$2:$A)` → "Jean"
- B2 : `=XLOOKUP(C2,Leaderboard!$D$2:$D,Leaderboard!$B$2:$B)` → "Dupont"

---

## 🎨 Exemples de mappings

### Exemple 1 : LinkedIn (lien → colonne E)

**Config** :
```
Category: LinkedIn
SubCategory: linkedin
Field Name: link
Column Mapping: E
```

**Données** :
```json
{ "subType": "linkedin", "link": "https://..." }
```

**Résultat** :
- Colonne E = `"https://..."`

---

### Exemple 2 : JPO (date → colonne F)

**Config** :
```
Category: Salon
SubCategory: jpo
Field Name: date
Column Mapping: F
```

**Données** :
```json
{ "subType": "jpo", "date": "2024-10-15" }
```

**Résultat** :
- Colonne F = `"2024-10-15"`

---

### Exemple 3 : Création Asso (nom → colonne G)

**Config** :
```
Category: Autre
SubCategory: creation-asso
Field Name: nom
Column Mapping: G
```

**Données** :
```json
{ "subType": "creation-asso", "nom": "BDE Campus" }
```

**Résultat** :
- Colonne G = `"BDE Campus"`

---

### Exemple 4 : Multi-champs (lien + date)

**Config** (2 lignes pour le même SubCategory) :
```
Category: Salon
SubCategory: salon-complet
Field Name: date_debut
Column Mapping: F
---
Category: Salon
SubCategory: salon-complet
Field Name: date_fin
Column Mapping: G
```

**Données** :
```json
{ "subType": "salon-complet", "date_debut": "2024-10-01", "date_fin": "2024-10-03" }
```

**Résultat** :
- Colonne F = `"2024-10-01"`
- Colonne G = `"2024-10-03"`

---

## 🔧 Modifier le mapping

### Changer où va un champ

Dans `FormConfig`, changez la colonne **Column Mapping** :

**Avant** :
```
LinkedIn | linkedin | Post LinkedIn | 📱 | url | link | Lien du post | TRUE | ... | E | ...
```

**Après** :
```
LinkedIn | linkedin | Post LinkedIn | 📱 | url | link | Lien du post | TRUE | ... | G | ...
```

**Résultat** : Le lien LinkedIn sera maintenant écrit dans la colonne G au lieu de E !

---

### Créer de nouveaux mappings

Vous pouvez mapper n'importe quel champ vers n'importe quelle colonne :

```
Salon | salon-special | Salon Spécial | 🎓 | text | ville | Ville | TRUE | Paris | ... | F | ...
Salon | salon-special | Salon Spécial | 🎓 | number | participants | Nombre participants | FALSE | 10 | ... | G | ...
```

**Résultat** : Deux nouveaux champs qui vont dans F et G !

---

## ⚠️ Limitations actuelles

### Colonnes fixes

Les colonnes suivantes sont **toujours fixes** :
- **A** : Prénom (formule auto)
- **B** : Nom (formule auto)
- **C** : Email (auto depuis le formulaire)
- **D** : Nom de l'action (auto depuis le label)
- **H** : Notes (auto depuis le formulaire)
- **I** : Statut (auto, rouge)

### Colonnes flexibles

Ces colonnes peuvent être **mappées dynamiquement** :
- **E** : Champ 1 (lien, date, texte, etc.)
- **F** : Champ 2 (date, ville, nombre, etc.)
- **G** : Champ 3 (lieu, contact, etc.)

---

## 🚀 Avantages

### ✅ Flexible
Vous pouvez changer où vont les données sans toucher au code !

### ✅ Rétrocompatible
Si `FormConfig` n'existe pas, l'ancienne logique hardcodée fonctionne.

### ✅ Extensible
Ajoutez de nouveaux types d'actions simplement en ajoutant des lignes dans `FormConfig`.

### ✅ Maintenable
Toute la logique de mapping est centralisée dans le Google Sheet.

---

## 🔍 Debug

### Voir les données écrites

Dans Google Sheets :
1. Ouvrez l'onglet `actions`
2. Vérifiez que les bonnes colonnes sont remplies

### Voir la config chargée

Testez l'endpoint :
```
https://script.google.com/macros/s/YOUR_ID/exec?action=getFormConfig
```

### Voir les logs Apps Script

Dans Apps Script :
1. **View > Execution log**
2. Cherchez les logs : `"Action submitted successfully"`

### Vérifier le mapping

Dans `Code.gs`, ajoutez des logs :
```javascript
config.fields.forEach((field) => {
  const colLetter = field.columnMapping;
  Logger.log(`${field.name} → Colonne ${colLetter}`);
});
```

---

## 📚 Résumé

1. **Config dynamique** : `FormConfig` définit quels champs vont dans quelles colonnes
2. **Chargement** : `loadFormConfigForSubType()` lit la config
3. **Mapping** : Les données sont assignées selon `Column Mapping`
4. **Écriture** : La ligne est écrite dans `actions`
5. **Formules** : A et B se remplissent automatiquement
6. **Statut** : I est coloré en rouge (en attente)

**C'est ça ! 🎉**

