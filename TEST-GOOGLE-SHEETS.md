# 🧪 Test Google Sheets - Connexion

## ✅ État actuel

Vous avez configuré :
- ✅ `.env.local` avec URL Apps Script
- ✅ Frontend prêt pour Apps Script
- ⏳ Apps Script à vérifier

---

## 🔍 Vérification Apps Script

### Étape 1 : Vérifier votre Google Sheet

**URL de votre Sheet** : (à remplir)
```
https://docs.google.com/spreadsheets/d/[VOTRE_SHEET_ID]/edit
```

**À vérifier** :
- [ ] Onglet `leaderboard` existe
- [ ] Onglet `actions` existe
- [ ] En-têtes configurés (voir GOOGLE-SHEETS-SETUP.md)

---

### Étape 2 : Vérifier Apps Script

1. Ouvrez votre Google Sheet
2. **Extensions** > **Apps Script**
3. Vérifiez le code :
   - [ ] Doit contenir `CodeV2.gs`
   - [ ] `SHEET_ID` est configuré
   - [ ] Fichier sauvegardé

---

### Étape 3 : Vérifier Web App déployé

**URL Apps Script** :
```
https://script.google.com/macros/s/AKfycbyAwSriM-CgCiVVDnMj-GaqiakW1nlGmoGmoq0lFbVBTrZah6mcmV60GDQScmFpwOnC/exec
```

**Test direct** :
Ouvrez dans navigateur :
```
https://script.google.com/macros/s/AKfycbyAwSriM-CgCiVVDnMj-GaqiakW1nlGmoGmoq0lFbVBTrZah6mcmV60GDQScmFpwOnC/exec?action=getLeaderboard
```

**Attendu** : JSON avec vos étudiants ou `[]`

---

### Étape 4 : Vérifier .env.local

**Fichier** : `.env.local`

**Contenu** :
```bash
VITE_APP_SCRIPT_URL=https://script.google.com/macros/s/AKfycbyAwSriM-CgCiVVDnMj-GaqiakW1nlGmoGmoq0lFbVBTrZah6mcmV60GDQScmFpwOnC/exec
```

✅ **Configuré correctement**

---

## 🧪 Tests à faire

### Test 1 : getLeaderboard

```bash
# 1. Redémarrez le serveur si déjà lancé
npm run dev

# 2. Ouvrez http://localhost:5173/leaderboard
# 3. Vérifiez que les étudiants apparaissent
```

**Si vide** : Vérifiez Google Sheet onglet leaderboard

---

### Test 2 : submitAction

1. Allez sur `/submit`
2. Soumettez une action
3. Ouvrez Google Sheet onglet `actions`
4. Vérifiez que l'action apparaît

**Si erreur** : Vérifiez console browser (F12)

---

### Test 3 : getActionsToValidate

1. Allez sur `/admin/login`
2. Connectez-vous
3. Allez sur `/admin/validate`
4. Vérifiez que l'action soumise apparaît

---

### Test 4 : validateAction

1. Dans `/admin/validate`
2. Cliquez "Voir détails" sur une action
3. Validez avec points
4. Ouvrez Google Sheet
5. Vérifiez onglet `actions` : status = "validated"
6. Vérifiez onglet `leaderboard` : points mis à jour

---

## 🐛 Dépannage

### Erreur : "Apps Script fetch failed"

**Causes possibles** :
- Apps Script pas déployé
- Permissions pas autorisées
- SHEET_ID incorrect
- Onglets mal nommés

**Solution** : Vérifiez étape par étape ci-dessus

---

### Données vides

**Cause** : Google Sheet vide

**Solution** : Importez les étudiants avec `docs/IMPORT-STUDENTS-SHEET.js`

---

### Erreur CORS

**Cause** : Web App pas configuré "Anyone"

**Solution** : 
1. Apps Script > Deploy > Manage deployments
2. Edit
3. "Who has access" : Anyone
4. Save
5. Redéploy

---

## ✅ Checklist

- [ ] Google Sheet créé avec 2 onglets
- [ ] Apps Script CodeV2.gs déployé
- [ ] SHEET_ID configuré
- [ ] Web App déployé
- [ ] Permissions autorisées
- [ ] .env.local configuré
- [ ] Serveur redémarré
- [ ] Test getLeaderboard OK
- [ ] Test submitAction OK
- [ ] Test validation OK

---

**Suivez ces tests et dites-moi où ça bloque !** 🧪

