# 🔐 Identifiants Admin

## 🎯 Page de Connexion Unique

**URL de connexion :** `/admin/login`

Une seule page de connexion pour toutes les écoles. L'école est détectée automatiquement depuis l'email.

---

## 📧 Identifiants par École

### Eugenia School

**Email :** `admin@eugeniaschool.com`  
**Mot de passe :** `1234`

**Dashboard :** `/eugenia-school/admin`

---

### Albert School

**Email :** `admin@albertschool.com`  
**Mot de passe :** `1234`

**Dashboard :** `/albert-school/admin`

**Note :** Chaque école a son propre panel admin avec des données distinctes. Les données affichées dans le dashboard Albert sont filtrées pour ne montrer que les étudiants et actions de l'école Albert.

---

## 🔄 Fonctionnement

1. **Connexion :** Accédez à `/admin/login`
2. **Saisie :** Entrez `admin@eugeniaschool.com` ou `admin@albertschool.com` avec le mot de passe `1234`
3. **Détection automatique :** L'école est détectée depuis l'email
4. **Redirection :** Vous êtes redirigé vers le dashboard admin de l'école correspondante :
   - `admin@eugeniaschool.com` → `/eugenia-school/admin`
   - `admin@albertschool.com` → `/albert-school/admin`

---

## 🔄 Redirection Automatique depuis la Connexion Étudiante

Si vous essayez de vous connecter avec `admin@eugeniaschool.com` ou `admin@albertschool.com` depuis une page de connexion étudiante (`/eugenia-school/login` ou `/albert-school/login`), vous serez automatiquement redirigé vers `/admin/login`.

---

## 📝 Notes Techniques

- **Mot de passe unique :** `1234` pour tous les admins (à changer en production)
- **Détection d'école :** Basée sur le domaine de l'email (@eugeniaschool.com ou @albertschool.com)
- **Session :** Stockée dans `sessionStorage` avec les clés :
  - `admin_authenticated` : `'true'`
  - `admin_email` : email de l'admin
  - `admin_school` : `'eugenia'` ou `'albert'`
- **Sécurité :** En production, changez le mot de passe et utilisez une authentification plus robuste


