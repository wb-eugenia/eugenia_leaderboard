# Configuration GitHub pour le Push

## Problème
Erreur 403 : Permission denied lors du push vers GitHub.

## Solution 1 : Utiliser un Personal Access Token (PAT)

### Étape 1 : Créer un Personal Access Token

1. Allez sur GitHub.com
2. Cliquez sur votre profil (coin supérieur droit) → **Settings**
3. Dans le menu de gauche : **Developer settings**
4. Cliquez sur **Personal access tokens** → **Tokens (classic)**
5. Cliquez sur **Generate new token** → **Generate new token (classic)**
6. Donnez un nom au token (ex: "Eugenia Challenge")
7. Sélectionnez les permissions :
   - ✅ `repo` (toutes les permissions du repo)
8. Cliquez sur **Generate token**
9. **COPIEZ LE TOKEN** (vous ne pourrez plus le voir après !)

### Étape 2 : Utiliser le token

#### Option A : Dans l'URL du remote (recommandé pour une seule fois)

```powershell
# Remplacez YOUR_TOKEN par votre token
git remote set-url origin https://YOUR_TOKEN@github.com/wb-eugenia/eugenia_leaderboard.git
```

#### Option B : Utiliser Git Credential Manager (recommandé pour la sécurité)

Quand Git vous demande vos credentials :
- **Username** : votre nom d'utilisateur GitHub (wb-eugenia ou walid-afk)
- **Password** : collez votre Personal Access Token (PAS votre mot de passe GitHub)

### Étape 3 : Pousser les changements

```powershell
git push origin main
```

---

## Solution 2 : Utiliser SSH (plus sécurisé, une seule configuration)

### Étape 1 : Générer une clé SSH

```powershell
ssh-keygen -t ed25519 -C "walid.bouzidane@gmail.com"
# Appuyez sur Entrée pour accepter l'emplacement par défaut
# Entrez une passphrase (optionnel mais recommandé)
```

### Étape 2 : Ajouter la clé SSH à l'agent

```powershell
# Démarrer l'agent SSH
Start-Service ssh-agent

# Ajouter la clé
ssh-add $env:USERPROFILE\.ssh\id_ed25519
```

### Étape 3 : Copier la clé publique

```powershell
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub | Set-Clipboard
```

### Étape 4 : Ajouter la clé sur GitHub

1. Allez sur GitHub.com → **Settings** → **SSH and GPG keys**
2. Cliquez sur **New SSH key**
3. Collez votre clé publique
4. Cliquez sur **Add SSH key**

### Étape 5 : Changer l'URL du remote vers SSH

```powershell
git remote set-url origin git@github.com:wb-eugenia/eugenia_leaderboard.git
```

### Étape 6 : Tester la connexion

```powershell
ssh -T git@github.com
```

### Étape 7 : Pousser

```powershell
git push origin main
```

---

## Vérification

Pour vérifier votre configuration actuelle :

```powershell
# Voir l'URL du remote
git remote get-url origin

# Voir la configuration Git
git config --list
```

---

## Note importante

Si vous travaillez en équipe, assurez-vous que :
1. Vous avez les permissions **Write** sur le repository
2. Le repository appartient à l'organisation `wb-eugenia` ou vous êtes collaborateur
3. Vous utilisez le bon compte GitHub





