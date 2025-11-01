# 🚀 Quick Start - Configuration Dynamique

## ⚡ Démarrage rapide en 5 minutes

### 1️⃣ Créer l'onglet `FormConfig` dans Google Sheets

**Copiez cette ligne d'en-tête** :

```
Category,SubCategory,Label,Emoji,Field Type,Field Name,Field Label,Required,Placeholder,Default,Validation,Options,Column Mapping,Display Order,Active,Points
```

**Créez l'onglet** `FormConfig` et **collez l'en-tête** dans la ligne 1.

---

### 2️⃣ Copier la configuration d'exemple

**Ouvrez** `FormConfig-Example.csv` et **copiez tout le contenu**.

**Collez** dans votre onglet `FormConfig` à partir de la ligne 2.

**Vous avez maintenant** 11 lignes de configuration (10 types d'actions).

---

### 3️⃣ Redéployer Apps Script

**Dans Apps Script** :

1. Ouvrez votre projet
2. Vérifiez que `Code.gs` contient toutes les nouvelles fonctions
3. **Deploy > Manage deployments**
4. Cliquez sur ✏️ pour éditer
5. Sélectionnez **New version**
6. Cliquez **Deploy**

---

### 4️⃣ Recharger l'application React

**En développement** :
```bash
npm run dev
```

**En production** :
```bash
vercel --prod
```

---

### 5️⃣ Tester !

**Ouvrez** `http://localhost:3000` et :

1. ✅ Le formulaire se charge automatiquement
2. ✅ Tous les types d'actions sont disponibles
3. ✅ Les champs s'affichent correctement
4. ✅ La soumission fonctionne

---

## 🎯 Test rapide : Ajouter un nouveau type

### Exemple : Ajouter "Stage International"

Dans `FormConfig`, **ajoutez cette ligne** :

```
Autre,stage-international,Stage International,🌍,text,lieu,Lieu,TRUE,Pays,,,,G,4,TRUE,0
```

**Rechargez** l'application → **"Stage International"** apparaît automatiquement ! 🎉

---

## 🔍 Vérifier que ça marche

### Test de l'API

**URL** :
```
https://script.google.com/macros/s/YOUR_ID/exec?action=getFormConfig
```

**Résultat attendu** : JSON avec toutes vos catégories et champs

---

### Test du formulaire

**Dans l'application** :
1. Cliquez "Soumettre une action"
2. Sélectionnez une catégorie
3. Vérifiez que tous les types s'affichent
4. Vérifiez que les champs correspondent

---

## 🐛 Si ça ne marche pas

### Checklist

- [ ] L'onglet `FormConfig` existe ?
- [ ] Les en-têtes sont corrects (ligne 1) ?
- [ ] Les données commencent à la ligne 2 ?
- [ ] Le `SHEET_ID` est correct dans Apps Script ?
- [ ] L'Apps Script est déployé en "New version" ?
- [ ] L'URL `APP_SCRIPT_URL` est correcte dans `App.jsx` ?

---

### Logs

**Apps Script** :
- `View > Execution log`
- Cherchez les erreurs

**Navigateur** :
- `F12 > Console`
- Cherchez "Error loading form config"

---

## 📚 Plus d'infos

- **FORM-CONFIG-GUIDE.md** : Guide complet
- **WRITE-FLOW-EXPLANATION.md** : Flux d'écriture
- **RESUME-IMPLANTATION.md** : Résumé technique

---

## 🎉 C'est tout !

**Vous avez maintenant un formulaire 100% configurable depuis Google Sheets !**

**Modifiez, ajoutez, supprimez des types d'actions sans toucher au code ! 🚀**

