# 📝 Guide de Configuration du Formulaire Dynamique

## 🎯 Vue d'ensemble

Le système est maintenant **100% configurable depuis Google Sheets** ! Vous pouvez modifier, ajouter ou supprimer des catégories d'actions, des champs, et leurs mappings **sans toucher au code**.

---

## 📊 Structure de l'onglet `FormConfig`

Créez un onglet nommé `FormConfig` dans votre Google Sheet avec cette structure :

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Category** | **SubCategory** | **Label** | **Emoji** | **Field Type** | **Field Name** | **Field Label** | **Required** | **Placeholder** | **Default** | **Validation** | **Options** | **Column Mapping** | **Display Order** | **Active** | **Points** |

---

## 📋 Colonnes détaillées

### Colonnes obligatoires

1. **Category** (A) : Nom de la catégorie principale (ex: "LinkedIn", "Salon", "Victoire", "Autre")
2. **SubCategory** (B) : ID unique de la sous-catégorie (ex: "linkedin", "jpo", "hackathon")
3. **Label** (C) : Nom affiché dans le formulaire (ex: "Post LinkedIn", "JPO")
4. **Emoji** (D) : Emoji pour la catégorie (ex: "📱", "🎓", "🏆")

### Colonnes pour les champs

5. **Field Type** (E) : Type de champ (`text`, `date`, `url`, `textarea`, `select`, `number`)
6. **Field Name** (F) : Nom technique du champ (ex: "link", "date", "nom") - **doit correspondre au nom dans le payload JSON**
7. **Field Label** (G) : Label affiché à l'utilisateur (ex: "Lien du post", "Date")
8. **Required** (H) : `TRUE` ou `FALSE` - si le champ est obligatoire
9. **Placeholder** (I) : Texte d'aide affiché dans le champ
10. **Default** (J) : Valeur par défaut (optionnel)
11. **Validation** (K) : Type de validation (`url`, `date`, `email`, `text`, etc.)
12. **Options** (L) : Pour les champs `select`, liste séparée par virgules (ex: "Option1,Option2,Option3")

### Colonnes de mapping

13. **Column Mapping** (M) : **Colonne dans l'onglet `actions`** où écrire les données
   - `A` : Prénom (formule XLOOKUP - auto)
   - `B` : Nom (formule XLOOKUP - auto)
   - `C` : Email (auto)
   - `D` : Nom de l'action (auto)
   - `E` : Champ 1 (lien, date, etc.)
   - `F` : Champ 2 (date, etc.)
   - `G` : Champ 3 (lieu, nom, etc.)
   - `H` : Notes/commentaires (auto)

14. **Display Order** (N) : Ordre d'affichage (numéro, utilisé pour trier les catégories)
15. **Active** (O) : `TRUE` ou `FALSE` - si la catégorie est active
16. **Points** (P) : Points attribués (optionnel, pour futur usage)

---

## 🔄 Comment ça marche

### 1️⃣ Chargement de la config

Quand l'application se charge :

```javascript
fetch(`${APP_SCRIPT_URL}?action=getFormConfig`)
```

Le serveur lit l'onglet `FormConfig` et retourne un JSON comme :

```json
{
  "categories": {
    "LinkedIn": {
      "label": "LinkedIn",
      "displayOrder": 1,
      "subTypes": {
        "linkedin": {
          "label": "Post LinkedIn",
          "emoji": "📱",
          "columnMapping": "E",
          "fields": [
            {
              "type": "url",
              "name": "link",
              "label": "Lien du post",
              "required": true,
              "placeholder": "https://www.linkedin.com/posts/...",
              "validation": "url"
            }
          ]
        }
      }
    }
  }
}
```

### 2️⃣ Affichage du formulaire

Le formulaire React charge la config et affiche dynamiquement :
- Les catégories dans le premier select
- Les sous-catégories dans le deuxième select
- Les champs correspondants selon le Field Type

### 3️⃣ Soumission des données

Quand l'utilisateur soumet :

```json
{
  "email": "etudiant@eugeniaschool.com",
  "category": "LinkedIn",
  "subType": "linkedin",
  "link": "https://linkedin.com/posts/...",
  "notes": "",
  "timestamp": "2024-..."
}
```

### 4️⃣ Écriture dans Google Sheets

Le serveur Apps Script (`submitAction`) :

1. **Charge la config** pour le `subType` via `loadFormConfigForSubType('linkedin')`
2. **Mappe les données** selon la colonne `Column Mapping` :
   - `link` → Colonne E (car `Column Mapping = E`)
   - `date` → Colonne F (car `Column Mapping = F`)
   - `nom` → Colonne G (car `Column Mapping = G`)
3. **Écrit dans l'onglet `actions`** :

| A (Prénom) | B (Nom) | C (Email) | D (Action) | E (Lien) | F (Date) | G (Lieu) | H (Notes) | I (Status) |
|------------|---------|-----------|------------|----------|----------|----------|-----------|------------|
| =XLOOKUP... | =XLOOKUP... | etudiant@... | Post LinkedIn | https://... |  |  |  | (rouge) |

---

## ✨ Exemples

### Ajouter un nouveau type de salon

Dans `FormConfig`, ajoutez une ligne :

```
Salon,salon-special,Salon Spécial,🎓,date,date,Date,TRUE,,,,date,,F,2,TRUE,0
```

**Résultat** : Un nouveau type "Salon Spécial" apparaît automatiquement dans le formulaire !

### Modifier les colonnes de mapping

Pour écrire un champ dans une colonne différente :

```
LinkedIn,linkedin,Post LinkedIn,📱,url,link,Lien du post,TRUE,https://...","",url,,G,1,TRUE,0
```

**Résultat** : Le lien LinkedIn sera écrit dans la colonne G au lieu de E.

### Ajouter plusieurs champs à une action

Pour avoir plusieurs champs (ex: date + heure) :

```
Salon,salon-1j,Salon (1 journée),🎓,date,date,Date,TRUE,,,,date,,F,2,TRUE,0
Salon,salon-1j,Salon (1 journée),🎓,text,heure,Heure,TRUE,HH:mm,,text,,G,2,TRUE,0
```

**Attention** : Les champs multiples avec le même SubCategory doivent avoir des `Column Mapping` différents !

### Désactiver une catégorie

Mettez `Active` à `FALSE` :

```
Salon,jpo,JPO,🎓,date,date,Date,TRUE,,,,date,,F,2,FALSE,0
```

**Résultat** : La catégorie JPO disparaît du formulaire.

---

## 🚨 Points importants

### Mappings de colonnes

Les colonnes E, F, G, H sont **flexibles** et dépendent de votre config :
- Traditionnellement : E=lien, F=date, G=lieu, H=notes
- Avec la config dynamique : Vous choisissez où va chaque champ

### Noms de champs

Le `Field Name` (colonne F) **doit correspondre exactement** aux clés du JSON envoyé :

- Si `Field Name = link` → Le JSON doit avoir `data.link`
- Si `Field Name = date` → Le JSON doit avoir `data.date`
- Si `Field Name = nom_contact` → Le JSON doit avoir `data.nom_contact`

### Compatibilité

Si l'onglet `FormConfig` n'existe pas ou est vide, le système **fallback** vers la configuration hardcodée originale. C'est rétrocompatible !

---

## 📁 Fichiers modifiés

### Backend (Apps Script)

1. **`Code.gs`** :
   - `getFormConfig()` : Lit et retourne la config JSON
   - `loadFormConfigForSubType()` : Charge la config pour un subType spécifique
   - `submitAction()` : Utilise la config pour mapper les données
   - `getColumnIndex()` : Convertit lettre → index (E→5, F→6, etc.)

### Frontend (React)

2. **`ActionForm.jsx`** : À modifier pour charger dynamiquement la config

---

## 🧪 Tester

1. Créez l'onglet `FormConfig` dans votre Google Sheet
2. Copiez les données de `FormConfig-Example.csv`
3. Rechargez l'application
4. Le formulaire devrait s'adapter automatiquement !

---

## 💡 Cas d'usage avancés

### Projet avec plusieurs types de stages

```
Autre,stage-international,Stage International,🌍,text,lieu,Lieu,TRUE,Pays,,,,G,4,TRUE,0
Autre,stage-international,Stage International,🌍,date,date_debut,Date de début,TRUE,,,,date,,F,4,TRUE,0
Autre,stage-international,Stage International,🌍,date,date_fin,Date de fin,TRUE,,,,date,,E,4,TRUE,0
```

**Astuce** : Réutilisez les colonnes E, F, G selon vos besoins !

### Formulaire multi-langue

Le système ne gère pas la traduction directement, mais vous pouvez :
1. Créer plusieurs colonnes `Label` dans la config
2. Faire un mapping selon la langue détectée

---

## 🔧 Debug

### Logs Apps Script

Dans Apps Script, allez dans **View > Execution log** pour voir :
- Si la config est bien chargée
- Quelles données sont écrites
- Les erreurs éventuelles

### JSON de retour

Testez l'endpoint config :
```
https://script.google.com/macros/s/YOUR_ID/exec?action=getFormConfig
```

Vous devriez voir le JSON complet de votre config !

---

## 📚 Ressources

- `FormConfig-Example.csv` : Exemple de configuration
- `Code.gs` : Backend avec fonctions de config
- `ActionForm.jsx` : Frontend (à modifier)

---

**🎉 Avec ce système, vous pouvez configurer entièrement le formulaire sans toucher au code !**

