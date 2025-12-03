# Plan de Restructuration - Landing de Vente Multi-Écoles

## Objectif
Transformer l'application en plateforme multi-écoles avec une landing de vente principale et des espaces dédiés pour chaque école (Eugenia et Albert).

---

## Étapes d'Implémentation

### 1. Créer le système de thèmes par école
**Fichier**: `src/utils/schoolThemes.js`
- Définir les couleurs pour Eugenia (burgundy/pink/yellow) et Albert (bleu)
- Exporter un objet `schoolThemes` avec les configurations

**Fichier**: `src/hooks/useSchoolTheme.js`
- Hook React qui retourne les couleurs selon l'école active
- Utilise le paramètre URL ou le contexte pour déterminer l'école

**Fichier**: `src/index.css`
- Ajouter les variables CSS pour Albert School (bleu-800, bleu-500, bleu-400)

---

### 2. Créer Header et Footer pour landing de vente
**Fichier**: `src/components/shared/SalesHeader.jsx`
- Header simplifié avec logo + bouton "Connexion"
- Bouton "Connexion" → lien vers `/select-school`
- Fond blanc/gris clair (pas de gradient)

**Fichier**: `src/components/shared/SalesFooter.jsx`
- Footer spécifique pour landing de vente
- Liens: Company, Projects, Blog, About us
- Copyright et mentions légales

---

### 3. Créer les composants de la landing de vente
**Fichier**: `src/components/sales/HeroSection.jsx`
- Badge "Open for work" (fond blanc, point vert)
- Titre principal (grand, bold)
- Description
- 2 boutons CTA: "Book A Call" (noir) + "View Projects" (blanc)
- Section avatars: 3 photos circulaires + 5 étoiles + "From 150+ reviews"

**Fichier**: `src/components/sales/ImpactSection.jsx`
- Titre "Impact //" avec slashes rouges
- Sous-titre "makes it simple and delivers results"
- 3 cards métriques:
  - "500+" - "Successful projects delivered" + description
  - "240%" - "Increased in conversion rate" + description
  - "$100M+" - "Seed + series A funding" + description

**Fichier**: `src/components/sales/SuccessStoriesSection.jsx`
- Titre "We're loved. Just success stories"
- 2 cards témoignages:
  - Card 1: "2.3x increase in lead conversion" + guillemets rouges + texte + photo Sarah Coleman (CMO) + logo Google
  - Card 2: "45% Reduced bounce rate" + guillemets rouges + texte + photo Marcus Levine (Co-founder) + logo

**Fichier**: `src/components/sales/OffreSection.jsx`
- Section à définir (pricing, features, etc.)
- Structure flexible pour contenu futur

**Fichier**: `src/components/sales/FAQSection.jsx`
- Titre "FAQ" ou "Questions fréquentes"
- Liste de questions/réponses (accordéon ou liste simple)
- Données mockées pour l'instant

**Fichier**: `src/components/sales/TrustedBySection.jsx`
- Titre "Trusted by" ou "Ils nous font confiance"
- Grille de logos partenaires (placeholders pour l'instant)

---

### 4. Créer la landing de vente principale
**Fichier**: `src/pages/SalesLandingPage.jsx`
- Route: `/` (remplace HomePage actuelle)
- Utilise SalesHeader et SalesFooter
- Sections dans l'ordre:
  1. HeroSection
  2. ImpactSection
  3. SuccessStoriesSection
  4. OffreSection
  5. FAQSection
  6. TrustedBySection
  7. SalesFooter
- Fond: gris clair avec pattern de points (comme l'image)

---

### 5. Créer la page de sélection d'école
**Fichier**: `src/pages/SelectSchoolPage.jsx`
- Route: `/select-school`
- Titre: "Choisissez votre école"
- 2 cards cliquables côte à côte:
  - **Card Eugenia**: 
    - Logo Eugenia
    - Couleurs burgundy/pink/yellow
    - Titre "Eugenia School"
    - Description courte
    - Bouton "Se connecter"
    - Clic → `/eugenia-school/login`
  - **Card Albert**:
    - Logo Albert (à créer)
    - Couleurs bleues
    - Titre "Albert School"
    - Description courte
    - Bouton "Se connecter"
    - Clic → `/albert-school/login`
- Header: SalesHeader
- Footer: SalesFooter

---

### 6. Déplacer landing Eugenia actuelle
**Action**: Renommer `src/pages/HomePage.jsx` → `src/pages/EugeniaSchoolPage.jsx`
- Garder toute la structure actuelle
- Changer uniquement la route vers `/eugenia-school`
- Utiliser SchoolHeader avec prop `school="eugenia"`

---

### 7. Créer Header par école
**Fichier**: `src/components/shared/SchoolHeader.jsx`
- Props: `school` (eugenia/albert)
- Structure identique au Header actuel mais:
  - Couleurs dynamiques selon l'école (via useSchoolTheme)
  - Liens pointent vers `/eugenia-school/...` ou `/albert-school/...`
- Utilisé dans toutes les pages des écoles

---

### 8. Créer pages de connexion par école
**Fichier**: `src/pages/EugeniaLoginPage.jsx`
- Route: `/eugenia-school/login`
- Utilise StudentLogin avec prop `school="eugenia"`
- Validation email: `@eugeniaschool.com`
- Couleurs Eugenia

**Fichier**: `src/pages/AlbertLoginPage.jsx`
- Route: `/albert-school/login`
- Utilise StudentLogin avec prop `school="albert"`
- Validation email: `@albertschool.com`
- Couleurs Albert

**Modifier**: `src/components/student/StudentLogin.jsx`
- Accepter prop `school` ou paramètre URL `?school=...`
- Adapter validation email selon l'école
- Adapter couleurs selon l'école

---

### 9. Créer structure Albert School (pages principales)
**Fichier**: `src/pages/AlbertSchoolPage.jsx`
- Route: `/albert-school`
- Copie de EugeniaSchoolPage
- Utilise SchoolHeader avec `school="albert"`
- Couleurs Albert (bleu) au lieu de burgundy/pink/yellow
- Même structure de sections

**Fichier**: `src/pages/AlbertPortfolioPage.jsx`
- Route: `/albert-school/portfolio`
- Copie de PortfolioPage
- Couleurs Albert

**Fichier**: `src/pages/AlbertAmbassadeursPage.jsx`
- Route: `/albert-school/ambassadeurs`
- Copie de AmbassadeursPage
- Couleurs Albert

**Fichier**: `src/pages/AlbertAssociationsPage.jsx`
- Route: `/albert-school/associations`
- Copie de AssociationsPage
- Couleurs Albert

---

### 10. Mettre à jour le contexte d'authentification
**Fichier**: `src/contexts/StudentAuthContext.jsx`
- Ajouter `school` dans le state student
- Modifier `login()` pour accepter paramètre `school`
- Validation email selon l'école:
  - Eugenia: `@eugeniaschool.com`
  - Albert: `@albertschool.com`
- Stocker `school` dans localStorage avec les autres données

---

### 11. Mettre à jour toutes les routes dans App.jsx
**Fichier**: `src/App.jsx`
- **Nouvelle route**: `/` → `SalesLandingPage`
- **Nouvelle route**: `/select-school` → `SelectSchoolPage`
- **Modifier**: `/` → `/eugenia-school` pour `EugeniaSchoolPage`
- **Nouvelles routes Eugenia**:
  - `/eugenia-school` → `EugeniaSchoolPage`
  - `/eugenia-school/login` → `EugeniaLoginPage`
  - `/eugenia-school/portfolio` → `PortfolioPage` (avec prop school="eugenia")
  - `/eugenia-school/ambassadeurs` → `AmbassadeursPage` (avec prop school="eugenia")
  - `/eugenia-school/associations` → `AssociationsPage` (avec prop school="eugenia")
  - `/eugenia-school/leaderboard` → `LeaderboardPage` (avec prop school="eugenia")
  - `/eugenia-school/submit` → `SubmitActionPage` (avec prop school="eugenia")
  - `/eugenia-school/report` → `ReportIssuePage` (avec prop school="eugenia")
- **Nouvelles routes Albert**:
  - `/albert-school` → `AlbertSchoolPage`
  - `/albert-school/login` → `AlbertLoginPage`
  - `/albert-school/portfolio` → `AlbertPortfolioPage`
  - `/albert-school/ambassadeurs` → `AlbertAmbassadeursPage`
  - `/albert-school/associations` → `AlbertAssociationsPage`
  - `/albert-school/leaderboard` → `LeaderboardPage` (avec prop school="albert")
  - `/albert-school/submit` → `SubmitActionPage` (avec prop school="albert")
  - `/albert-school/report` → `ReportIssuePage` (avec prop school="albert")
- **Garder routes existantes** pour compatibilité temporaire (rediriger vers nouvelles routes)

---

### 12. Mettre à jour les composants pour supporter multi-écoles
**Fichier**: `src/components/shared/Header.jsx`
- Ajouter prop `school` optionnelle
- Si `school` fourni, utiliser SchoolHeader
- Sinon, utiliser Header actuel (pour compatibilité)

**Fichier**: `src/pages/PortfolioPage.jsx`, `AmbassadeursPage.jsx`, `AssociationsPage.jsx`
- Ajouter prop `school` optionnelle
- Utiliser `useSchoolTheme` pour appliquer les couleurs
- Adapter les liens internes selon l'école

**Fichier**: `src/pages/LeaderboardPage.jsx`, `SubmitActionPage.jsx`, `ReportIssuePage.jsx`
- Ajouter prop `school` optionnelle
- Utiliser couleurs du thème

---

### 13. Créer Logo Albert
**Fichier**: `src/components/shared/AlbertLogo.jsx`
- Structure similaire à EugeniaLogo
- Couleurs bleues au lieu de burgundy/yellow
- Texte "ALBERTSCHOOL"

---

### 14. Mettre à jour les services API
**Fichier**: `src/services/googleSheets.js`
- Ajouter paramètre `school` dans les appels API si nécessaire
- Backend pourra filtrer par école plus tard

---

## Ordre d'exécution recommandé

1. ✅ Créer système de thèmes (schoolThemes.js, useSchoolTheme.js, variables CSS)
2. ✅ Créer SalesHeader et SalesFooter
3. ✅ Créer tous les composants sales (Hero, Impact, SuccessStories, etc.)
4. ✅ Créer SalesLandingPage
5. ✅ Créer SelectSchoolPage
6. ✅ Renommer HomePage → EugeniaSchoolPage et mettre à jour route
7. ✅ Créer SchoolHeader
8. ✅ Créer pages de connexion par école
9. ✅ Créer AlbertLogo
10. ✅ Créer toutes les pages Albert (copies avec thème)
11. ✅ Mettre à jour contexte d'authentification
12. ✅ Mettre à jour toutes les routes dans App.jsx
13. ✅ Mettre à jour composants pour supporter prop school
14. ✅ Tester toutes les routes et transitions

---

## Fichiers à créer

### Nouveaux fichiers
- `src/utils/schoolThemes.js`
- `src/hooks/useSchoolTheme.js`
- `src/components/shared/SalesHeader.jsx`
- `src/components/shared/SalesFooter.jsx`
- `src/components/shared/SchoolHeader.jsx`
- `src/components/shared/AlbertLogo.jsx`
- `src/components/sales/HeroSection.jsx`
- `src/components/sales/ImpactSection.jsx`
- `src/components/sales/SuccessStoriesSection.jsx`
- `src/components/sales/OffreSection.jsx`
- `src/components/sales/FAQSection.jsx`
- `src/components/sales/TrustedBySection.jsx`
- `src/pages/SalesLandingPage.jsx`
- `src/pages/SelectSchoolPage.jsx`
- `src/pages/EugeniaLoginPage.jsx`
- `src/pages/AlbertLoginPage.jsx`
- `src/pages/EugeniaSchoolPage.jsx` (renommé depuis HomePage)
- `src/pages/AlbertSchoolPage.jsx`
- `src/pages/AlbertPortfolioPage.jsx`
- `src/pages/AlbertAmbassadeursPage.jsx`
- `src/pages/AlbertAssociationsPage.jsx`

### Fichiers à modifier
- `src/App.jsx` (routes)
- `src/index.css` (variables CSS Albert)
- `src/contexts/StudentAuthContext.jsx` (support multi-écoles)
- `src/components/student/StudentLogin.jsx` (prop school)
- `src/components/shared/Header.jsx` (prop school optionnelle)
- `src/pages/PortfolioPage.jsx` (prop school)
- `src/pages/AmbassadeursPage.jsx` (prop school)
- `src/pages/AssociationsPage.jsx` (prop school)
- `src/pages/LeaderboardPage.jsx` (prop school)
- `src/pages/SubmitActionPage.jsx` (prop school)
- `src/pages/ReportIssuePage.jsx` (prop school)

---

## Notes importantes

- Les couleurs Albert sont à définir précisément (suggestion: bleu-800, bleu-500, bleu-400)
- Le contenu des sections Offre, FAQ, Trusted by peut être mocké pour l'instant
- Les routes existantes peuvent être gardées temporairement avec redirections
- Le logo Albert doit être créé ou un placeholder utilisé
- La validation email doit être adaptée pour chaque école

