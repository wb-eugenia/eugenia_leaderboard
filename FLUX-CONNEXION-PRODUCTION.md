# 🔐 Flux de Connexion en Production - Étudiant "svelazquez"

## 📋 Vue d'ensemble

Quand un étudiant se connecte avec l'email **svelazquez@eugeniaschool.com** (ou similaire) en production, voici ce qui se passe étape par étape.

---

## 🚀 Étape 1 : Accès à la page de connexion

**URL :** `https://b22ec105.eugenia-challenge.pages.dev/eugenia-school/login`

L'utilisateur arrive sur la page de connexion Eugenia School qui affiche :
- Un formulaire avec champ email et mot de passe
- Indication que le mot de passe par défaut est **1234**
- Validation que l'email doit contenir `@eugeniaschool.com`

---

## 🔑 Étape 2 : Soumission du formulaire

Quand l'utilisateur entre :
- **Email :** `svelazquez@eugeniaschool.com` (ou `s.velazquez@eugeniaschool.com`)
- **Mot de passe :** `1234`

Le code dans `EugeniaLoginPage.jsx` appelle la fonction `login()` du contexte `StudentAuthContext`.

---

## 🔍 Étape 3 : Validation côté client (StudentAuthContext)

**Fichier :** `src/contexts/StudentAuthContext.jsx`

### 3.1 Validation de l'email
```javascript
const emailDomain = school === 'eugenia' ? '@eugeniaschool.com' : '@albertschool.com';
if (!email.includes(emailDomain)) {
  throw new Error(`Email doit être ${emailDomain}`);
}
```
✅ L'email doit contenir `@eugeniaschool.com`

### 3.2 Vérification du mot de passe
```javascript
if (password === '1234') {
  // Connexion autorisée
}
```
✅ Le mot de passe par défaut est **1234** (hardcodé pour l'instant)

---

## 🌐 Étape 4 : Récupération des données depuis l'API

**Fichier :** `src/contexts/StudentAuthContext.jsx` (lignes 34-45)

### 4.1 Appel API au leaderboard
```javascript
const API_URL = import.meta.env.VITE_API_URL;
const response = await fetch(`${API_URL}/leaderboard`);
const leaderboard = await response.json();
```

**Endpoint appelé :** `GET {VITE_API_URL}/leaderboard`

### 4.2 Recherche de l'étudiant dans le leaderboard
```javascript
studentData = leaderboard.find(s => s.email === email.toLowerCase());
```

Le système cherche l'étudiant dans la liste retournée par l'API en comparant l'email (en minuscules).

---

## 🗄️ Étape 5 : Traitement côté API (Cloudflare Worker)

**Fichier :** `worker/src/index.ts` (lignes 75-108)

### 5.1 Requête SQL
```sql
SELECT id, first_name, last_name, email, classe, total_points, actions_count, last_update 
FROM leaderboard 
ORDER BY total_points DESC, last_update DESC
```

L'API interroge la base de données **Cloudflare D1** (SQLite serverless) pour récupérer tous les étudiants du classement.

### 5.2 Calcul des rangs
L'API calcule les rangs avec gestion des ex-aequo :
- Si deux étudiants ont le même nombre de points, ils ont le même rang
- Le rang suivant saute les positions nécessaires

### 5.3 Format de réponse
```json
[
  {
    "rank": 1,
    "firstName": "Prénom",
    "lastName": "Nom",
    "email": "prenom.nom@eugeniaschool.com",
    "classe": "Classe",
    "totalPoints": 150,
    "actionsCount": 5,
    "lastUpdate": "2024-01-15T10:30:00Z"
  },
  ...
]
```

---

## 📦 Étape 6 : Création du profil étudiant

**Fichier :** `src/contexts/StudentAuthContext.jsx` (lignes 47-67)

### 6.1 Si l'étudiant existe dans le leaderboard
```javascript
if (studentData) {
  // Générer le slug (prenom-nom)
  const firstName = studentData.firstName?.toLowerCase().replace(/\s+/g, '-') || 'etudiant';
  const lastName = studentData.lastName?.toLowerCase().replace(/\s+/g, '-') || 'eugenia';
  const slug = `${firstName}-${lastName}`;
  
  studentData.slug = slug;
  studentData.school = 'eugenia';
}
```

L'étudiant récupère :
- ✅ Ses données complètes (nom, prénom, points, actions, classe)
- ✅ Un slug généré automatiquement (ex: `s-velazquez`)
- ✅ L'école associée (`eugenia`)

### 6.2 Si l'étudiant n'existe PAS dans le leaderboard
```javascript
if (!studentData) {
  const emailParts = email.split('@')[0].split('.');
  studentData = {
    email: email.toLowerCase(),
    firstName: emailParts[0]?.charAt(0).toUpperCase() + emailParts[0]?.slice(1) || 'Étudiant',
    lastName: emailParts[1]?.charAt(0).toUpperCase() + emailParts[1]?.slice(1) || '',
    classe: 'N/A',
    totalPoints: 0,
    actionsCount: 0,
    school: 'eugenia',
    slug: email.split('@')[0].replace('.', '-')
  };
}
```

Un profil basique est créé avec :
- ✅ Prénom et nom extraits de l'email
- ✅ 0 point et 0 action
- ✅ Classe "N/A"
- ✅ Slug basé sur l'email

---

## 💾 Étape 7 : Sauvegarde dans le localStorage

**Fichier :** `src/contexts/StudentAuthContext.jsx` (lignes 69-70)

```javascript
setStudent(studentData);
localStorage.setItem('student_auth', JSON.stringify(studentData));
```

Les données de l'étudiant sont :
- ✅ Stockées dans le state React (`student`)
- ✅ Sauvegardées dans `localStorage` sous la clé `student_auth`

**Format stocké :**
```json
{
  "email": "svelazquez@eugeniaschool.com",
  "firstName": "S",
  "lastName": "Velazquez",
  "classe": "Classe",
  "totalPoints": 150,
  "actionsCount": 5,
  "school": "eugenia",
  "slug": "s-velazquez",
  "rank": 1
}
```

---

## 🔄 Étape 8 : Redirection vers la page d'accueil

**Fichier :** `src/pages/EugeniaLoginPage.jsx` (lignes 20-21)

```javascript
if (result.success) {
  navigate('/eugenia-school');
}
```

L'utilisateur est redirigé vers : `/eugenia-school`

---

## 🛡️ Étape 9 : Protection de la route (SchoolAuth)

**Fichier :** `src/components/student/SchoolAuth.jsx`

### 9.1 Vérification de l'authentification
```javascript
const { student, loading } = useStudentAuth();

if (loading) {
  return <div>Chargement...</div>;
}

if (!student) {
  return <Navigate to="/eugenia-school/login" replace />;
}
```

Si l'étudiant n'est pas connecté, redirection vers `/eugenia-school/login`.

### 9.2 Vérification de l'école
```javascript
if (student.school && student.school !== school) {
  const otherLoginPath = student.school === 'eugenia' ? '/eugenia-school/login' : '/albert-school/login';
  return <Navigate to={otherLoginPath} replace />;
}
```

Si l'étudiant est connecté pour une autre école, redirection vers la bonne page de connexion.

### 9.3 Accès autorisé
```javascript
return <>{children}</>;
```

Si tout est OK, l'étudiant accède à la page demandée.

---

## 🎯 Étape 10 : Affichage de la page d'accueil Eugenia School

**Fichier :** `src/pages/EugeniaSchoolPage.jsx`

L'étudiant voit maintenant :
- ✅ Le header avec navigation
- ✅ La section hero "Bienvenue sur l'Espace Communauté"
- ✅ Les liens vers :
  - 📁 Portfolios
  - 🌟 Ambassadeurs
  - 🎪 Associations
- ✅ Les sections descriptives de chaque programme
- ✅ Le footer

---

## 🔄 Persistance de la session

### Au rechargement de la page

**Fichier :** `src/contexts/StudentAuthContext.jsx` (lignes 9-19)

```javascript
useEffect(() => {
  const savedStudent = localStorage.getItem('student_auth');
  if (savedStudent) {
    try {
      setStudent(JSON.parse(savedStudent));
    } catch (e) {
      localStorage.removeItem('student_auth');
    }
  }
  setLoading(false);
}, []);
```

Le système :
1. ✅ Vérifie si des données sont dans `localStorage`
2. ✅ Parse les données JSON
3. ✅ Restaure la session automatiquement
4. ✅ L'étudiant reste connecté sans se reconnecter

---

## 📊 Résumé du flux complet

```
1. Utilisateur → /eugenia-school/login
2. Saisie email + mot de passe (1234)
3. Validation email @eugeniaschool.com
4. Appel API GET /leaderboard
5. Recherche étudiant dans la réponse
6. Création profil (existant ou nouveau)
7. Sauvegarde localStorage
8. Redirection /eugenia-school
9. Vérification SchoolAuth
10. Affichage page d'accueil
```

---

## ⚠️ Points importants

### Sécurité actuelle
- ❌ **Mot de passe hardcodé** : Tous les étudiants ont le même mot de passe `1234`
- ✅ **Validation email** : Seuls les emails `@eugeniaschool.com` sont acceptés
- ✅ **Session persistante** : Stockée dans `localStorage` (reste après fermeture du navigateur)

### Limitations
- 🔴 Pas de vérification réelle du mot de passe côté serveur
- 🔴 Pas de gestion de session côté serveur (cookies httpOnly)
- 🔴 Les données sont accessibles via `localStorage` (peuvent être modifiées côté client)

### Améliorations possibles
- ✅ Implémenter une vraie authentification avec tokens JWT
- ✅ Utiliser des cookies httpOnly pour la session
- ✅ Vérifier le mot de passe côté serveur
- ✅ Ajouter un système de réinitialisation de mot de passe

---

## 🔍 Cas spécifique : "svelazquez"

Si l'email est `svelazquez@eugeniaschool.com` :

1. **Si présent dans le leaderboard :**
   - Récupère ses vraies données (points, actions, classe, rang)
   - Slug : `s-velazquez` (ou basé sur firstName/lastName)

2. **Si absent du leaderboard :**
   - Création d'un profil avec :
     - firstName: `Svelazquez`
     - lastName: `''` (vide)
     - totalPoints: `0`
     - actionsCount: `0`
     - classe: `N/A`
     - slug: `svelazquez`

---

## 🛠️ Variables d'environnement nécessaires

Pour que le système fonctionne en production :

```env
VITE_API_URL=https://votre-worker.workers.dev
```

Cette URL doit pointer vers votre Cloudflare Worker qui expose l'endpoint `/leaderboard`.

---

## 📝 Notes techniques

- **Base de données :** Cloudflare D1 (SQLite serverless)
- **Backend :** Cloudflare Workers (TypeScript)
- **Frontend :** React + Vite (déployé sur Cloudflare Pages)
- **Authentification :** Client-side uniquement (localStorage)
- **API :** REST API avec CORS activé


