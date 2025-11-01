# 🎯 Étape suivante - Google Sheets

## ✅ Ce qui est fait

- ✅ `.env.local` configuré avec votre URL Apps Script
- ✅ Frontend prêt pour Apps Script
- ✅ Tous les appels async corrigés
- ✅ Build OK sans erreurs

---

## 📋 Ce qu'il vous reste à faire

### 1. Vérifier votre Google Sheet

**Allez sur** : Votre Google Sheet

**Vérifiez** :
- [ ] Onglet `leaderboard` existe
- [ ] Onglet `actions` existe
- [ ] Les en-têtes sont configurés

---

### 2. Vérifier votre Apps Script

**Dans Google Sheet** : **Extensions** > **Apps Script**

**Vérifiez** :
- [ ] Le code `CodeV2.gs` est copié
- [ ] `SHEET_ID` est configuré (ligne 9)
- [ ] Le fichier est sauvegardé

---

### 3. Vérifier le Web App

**Dans Apps Script** :
- [ ] **Deploy** > **Manage deployments**
- [ ] Vérifiez "Web app" déployé
- [ ] **"Who has access"** : Anyone
- [ ] L'URL correspond à celle dans `.env.local`

---

### 4. Importer les étudiants

**Option A** : Via code Apps Script

1. Dans Apps Script, créez un nouveau fichier
2. Collez le contenu de `docs/IMPORT-STUDENTS-SHEET.js`
3. **Exécutez** la fonction `importStudents()`
4. Vérifiez onglet `leaderboard` : 35 étudiants apparaissent

**Option B** : Manuellement

1. Ouvrez onglet `leaderboard`
2. Ligne 1 : En-têtes
3. Lignes 2-36 : Copiez vos 35 étudiants

---

### 5. Tester

```bash
# Redémarrer le serveur si nécessaire
npm run dev
```

**Tests** :
1. http://localhost:5173/leaderboard → Vérifiez étudiants
2. http://localhost:5173/submit → Soumettez action
3. Ouvrez Google Sheet → Vérifiez action créée
4. http://localhost:5173/admin/validate → Vérifiez action pending
5. Validez → Vérifiez Google Sheet mis à jour

---

## 🐛 Si ça ne marche pas

### Console browser

**F12** → Console

**Regardez** :
- Messages d'erreur
- "Apps Script fetch failed" → Problème URL/config
- "Network error" → Apps Script pas accessible

---

### Apps Script Logs

**Dans Apps Script** :
1. **Exécutions** (Excecutions)
2. Regardez les dernières exécutions
3. Cliquez pour voir les erreurs

---

## 📞 Questions de debug

### Vos étudiants apparaissent dans `/leaderboard` ?

**Oui** : ✅ Google Sheets fonctionne !
**Non** : Vérifiez onglet `leaderboard` dans Sheet

---

### Pouvez-vous soumettre une action ?

**Oui** : ✅ POST fonctionne !
**Non** : Vérifiez console browser, vérifiez Apps Script

---

### L'action apparaît dans `/admin/validate` ?

**Oui** : ✅ GET actions fonctionne !
**Non** : Vérifiez onglet `actions` dans Sheet

---

## 🎯 Résultat attendu

### Avec localStorage
```
Données isolées par navigateur
```

### Avec Google Sheets
```
Tous les navigateurs voient les mêmes données
```

---

**Suivez les tests et dites-moi où vous en êtes !** 🧪

