# 📐 Brief Design - Eugenia School Community Platform

## 🎯 Vision Globale

Plateforme communautaire pour les étudiants Eugenia School permettant de :
- **Découvrir** les projets, talents et initiatives
- **Participer** aux programmes (ambassadeurs, associations)
- **Partager** son portfolio et ses réalisations
- **Signaler** les problèmes du campus
- **Suivre** son classement et ses points

---

## 🗺️ Structure du Site

### **1. Page d'Accueil** (`/`)
**Objectif** : Présentation globale de la plateforme et accès aux 3 verticales principales

#### Sections :
1. **Hero Section**
   - Grand titre : "Bienvenue sur l'Espace Communauté Eugenia School"
   - Sous-titre : "Découvrez la vie, les talents et l'engagement des étudiants"
   - 3 boutons CTA : Portfolio, Ambassadeurs, Associations

2. **Section Portfolio du Mois**
   - Badge : "Portfolios du Mois"
   - Titre : "Exposez vos projets, montrez vos compétences"
   - Problème → Solution → Valeur ajoutée
   - 2 boutons : "Découvrir les portfolios" + "Voir sur GitHub"
   - Visuel : 4 cards avec icônes (Design, Dev, Apps, Innovation)

3. **Section Ambassadeurs du Mois**
   - Badge : "Ambassadeurs du Mois"
   - Titre : "Participez aux missions, devenez leader !"
   - Problème → Solution → Valeur ajoutée
   - 2 boutons : "Rejoindre le programme" + "Voir le classement"
   - Visuel : 3 cards (Dashboard, Points, LinkedIn)

4. **Section Associations du Mois**
   - Badge : "Associations du Mois"
   - Titre : "Vivez le campus autrement"
   - Problème → Solution → Valeur ajoutée
   - 2 boutons : "Découvrir les associations" + "Voir l'agenda"
   - Visuel : 6 cards avec icônes (Théâtre, Music, Sport, Art, Solidarité, Innovation)

5. **Section "À propos d'Eugenia"**
   - Titre centré
   - 2 paragraphes sur la philosophie et les valeurs

6. **Section "Comment ça marche"**
   - Titre : "Comment ça marche ?"
   - 3 cards avec étapes : Partagez → Découvrez → Grandissez
   - 2 boutons CTA

7. **CTA Final**
   - Card avec gradient
   - 3 boutons : Portfolio, Ambassadeur, Association

8. **Footer**
   - 3 colonnes : Logo/Description, Navigation, Informations
   - Liens sociaux
   - Copyright

---

### **2. Page Portfolios du Mois** (`/portfolio`)
**Objectif** : Découvrir les projets étudiants du mois en cours

#### Structure :
1. **Hero**
   - Titre : "Portfolios du Mois"
   - Description
   - Badge avec mois en cours (ex: "janvier 2025")

2. **Filtres**
   - 5 boutons : Tous, Design, Développement, Applications, Innovation
   - Style : Pills arrondis, état actif visible

3. **Projets à la une** (si filtre = Tous)
   - Titre : "Projets à la une ce mois"
   - Grille 3 colonnes
   - Cards avec bordure jaune

4. **Liste des projets**
   - Grille responsive (1/2/3 colonnes selon écran)
   - Chaque card contient :
     - Emoji/Image du projet
     - Titre
     - Nom étudiant + Classe
     - Description (3 lignes max)
     - Badges technologies
     - Bouton "Voir sur GitHub" (si disponible)

5. **CTA Soumettre**
   - Card avec gradient
   - Bouton "Soumettre mon projet"

#### États :
- **Loading** : Spinner centré
- **Vide** : Message "Aucun projet trouvé"
- **Hover** : Card légèrement agrandie

---

### **3. Page Ambassadeurs du Mois** (`/ambassadeurs`)
**Objectif** : Découvrir les ambassadeurs actifs et les missions disponibles

#### Structure :
1. **Hero**
   - Titre : "Ambassadeurs du Mois"
   - Description
   - Badge avec mois en cours

2. **Stats (3 cards)**
   - Ambassadeurs actifs (nombre)
   - Points totaux
   - Missions réalisées

3. **Missions disponibles**
   - Titre : "Missions du mois"
   - Grille 3 colonnes
   - Chaque card contient :
     - Emoji de la mission
     - Badge points (jaune)
     - Badge catégorie
     - Titre
     - Description
     - Bouton "Participer"

4. **Classement Top 10**
   - Titre : "Top 10 Ambassadeurs du Mois"
   - Tableau avec colonnes :
     - Rang (avec médailles 🥇🥈🥉)
     - Nom complet
     - Classe
     - Points (en rose)
     - Nombre de missions
   - Bouton "Voir le classement complet"

5. **Section "Comment participer"**
   - Card avec gradient
   - 3 étapes visuelles
   - Bouton "Soumettre une action"

#### États :
- **Loading** : Spinner
- **Hover** : Cards agrandies

---

### **4. Page Associations du Mois** (`/associations`)
**Objectif** : Découvrir les associations actives et leurs événements

#### Structure :
1. **Hero**
   - Titre : "Associations du Mois"
   - Description
   - Badge avec mois en cours

2. **Liste des associations actives**
   - Titre : "Associations actives ce mois"
   - Grille 3 colonnes
   - Chaque card contient :
     - Emoji de l'association
     - Nom
     - Description
     - Badge catégorie
     - Nombre de membres
     - Bouton "En savoir plus"
   - **État vide** : Message si aucune association active

3. **Agenda mensuel**
   - Titre : "Agenda des activités"
   - Badge mois en cours (non cliquable)
   - Calendrier :
     - En-têtes jours (Lun-Dim)
     - Grille 7 colonnes × ~30 lignes
     - Cases avec numéro du jour
     - Cases avec événements : fond coloré + emoji + titre
   - **État vide** : Calendrier vide

4. **Liste des événements**
   - Titre : "Événements du mois"
   - Liste verticale
   - Chaque card contient :
     - Emoji association
     - Titre événement
     - Badge association
     - Date, Heure, Lieu
     - Bouton "Participer"
   - **État vide** : Message si aucun événement

5. **CTA Rejoindre**
   - Card avec gradient
   - Bouton "Formulaire d'adhésion"

6. **Modal Association** (au clic sur une card)
   - Overlay sombre
   - Card centrée avec :
     - Emoji + Nom
     - Description
     - Nombre de membres
     - Liste des activités
     - 2 boutons : Contacter + Adhérer

#### États :
- **Loading** : Spinner
- **Hover** : Cards agrandies
- **Modal ouvert** : Overlay + card centrée

---

### **5. Page Classement** (`/leaderboard`)
**Objectif** : Voir le classement complet des étudiants

#### Structure :
1. **Titre** : "Classement"
2. **Tableau** avec :
   - Rang (avec médailles pour top 3)
   - Nom complet
   - Classe
   - Points
   - Actions
   - Dernière mise à jour
3. **Tri** : Par défaut par points décroissants

#### États :
- **Loading** : Spinner
- **Hover ligne** : Fond légèrement coloré

---

### **6. Page Soumettre une Action** (`/submit`)
**Objectif** : Soumettre une action pour gagner des points

#### Structure :
1. **Titre** : "Soumettre une action"
2. **Formulaire** :
   - Email (avec validation @eugeniaschool.com)
   - Type d'action (dropdown)
   - Champs dynamiques selon le type
   - Message de succès/erreur
   - Bouton "Soumettre l'action"

#### États :
- **Succès** : Message vert + redirection après 2s
- **Erreur** : Message rouge
- **Chargement** : Bouton désactivé "Envoi en cours..."

---

### **7. Page Signalement** (`/report`)
**Objectif** : Signaler un problème du campus avec photo

#### Structure :
1. **Hero**
   - Titre : "Signaler un problème"
   - Description

2. **Formulaire** :
   - **Catégories** (grille 2×3) :
     - Matériel cassé 🪑
     - Nettoyage 🧹
     - Sécurité 🚨
     - Technique 💻
     - Autre 📋
     - Style : Cards cliquables, bordure colorée si sélectionné
   
   - **Titre** (input texte)
   - **Description** (textarea)
   - **Localisation** (input texte)
   - **Photo** (input file)
     - Prévisualisation si photo sélectionnée
     - Bouton "Supprimer la photo"
   
   - **Message** (succès/erreur)
   - **Bouton** "Envoyer le signalement"

#### États :
- **Photo sélectionnée** : Prévisualisation affichée
- **Succès** : Message vert + redirection
- **Erreur** : Message rouge
- **Chargement** : Bouton désactivé

---

### **8. Page Connexion Étudiant** (`/student/login`)
**Objectif** : Se connecter avec email @eugeniaschool.com

#### Structure :
1. **Card centrée**
   - Emoji 🎓
   - Titre : "Connexion Étudiant"
   - Description
   
2. **Formulaire** :
   - Email (input)
   - Mot de passe (input)
   - Note : "Mot de passe par défaut: 1234"
   - Message erreur (si applicable)
   - Bouton "Se connecter"
   
3. **Lien** : "Retour à l'accueil"

#### États :
- **Erreur** : Message rouge
- **Chargement** : Bouton désactivé

---

### **9. Page Profil Étudiant** (`/student/profile`)
**Objectif** : Gérer son portfolio et ses associations (privé)

#### Structure :
1. **Header Profil**
   - Avatar/Emoji
   - Nom complet
   - Email
   - Classe
   - Stats : Points + Actions (2 badges)
   - **Lien profil public** (input readonly + bouton copier)
   - Bouton "Déconnexion"

2. **Onglets**
   - Portfolio (actif par défaut)
   - Associations

3. **Onglet Portfolio**
   - Titre du portfolio (input)
   - Description (textarea)
   - GitHub (input URL)
   - Site Web (input URL)
   - **Technologies** :
     - Input + bouton "➕"
     - Liste de badges (avec ✕ pour supprimer)
   - **Projets** :
     - Liste des projets existants (cards)
     - Formulaire pour ajouter :
       - Titre
       - Description
       - Lien (optionnel)
       - Bouton "Ajouter le projet"
   - Bouton "Sauvegarder le portfolio"

4. **Onglet Associations**
   - **Mes associations** :
     - Grille 2 colonnes
     - Cards avec emoji + nom + bouton "Quitter"
     - Message si vide
   
   - **Rejoindre une association** :
     - Grille 2 colonnes
     - Cards avec emoji + nom + bouton "Rejoindre"
     - (N'affiche que celles non rejointes)

#### États :
- **Sauvegarde** : Confirmation
- **Hover** : Cards légèrement agrandies

---

### **10. Page Profil Public** (`/profile/prenom-nom`)
**Objectif** : Profil public partageable d'un étudiant

#### Structure :
1. **Header Profil**
   - Avatar/Emoji
   - Nom complet
   - Classe
   - Stats : Points + Actions

2. **Portfolio** (si existant)
   - Titre
   - Description
   - Liens GitHub/Site Web (cards cliquables)
   - Technologies (badges)
   - Projets (cards avec titre, description, lien)

3. **État vide** : Message si pas de portfolio

4. **Bouton** : "Voir le classement complet"

#### États :
- **Loading** : Spinner
- **Non trouvé** : Message d'erreur

---

### **11. Panel Admin** (`/admin/*`)
**Objectif** : Gestion complète de la plateforme

#### Navigation Admin (toujours visible) :
- Dashboard
- Validation
- **Signalements** 🚨 (nouveau)
- Types d'actions
- Élèves
- Automatisations
- Analytics
- Google Sheets
- Landing Page
- Guide

#### Page Signalements (`/admin/reports`)
1. **Header**
   - Titre : "Signalements"
   - Compteur total
   - **Filtres** : Tous, En attente, En cours, Résolus

2. **Liste des signalements**
   - Cards avec :
     - Photo (si disponible, à gauche)
     - Emoji catégorie
     - Titre
     - Nom étudiant + Localisation
     - Description
     - Badge statut
     - Date de création
     - **Actions** :
       - "En cours"
       - "Résolu"
       - "Voir détails"
       - "Supprimer"

3. **Modal Détails** (au clic "Voir détails")
   - Photo en grand (si disponible)
   - Toutes les infos
   - 2 boutons : "Marquer en cours" + "Marquer résolu"

4. **État vide** : Message si aucun signalement

#### États :
- **Loading** : Spinner
- **Hover** : Cards avec ombre plus prononcée
- **Statuts** :
  - En attente : Badge jaune
  - En cours : Badge bleu
  - Résolu : Badge vert

---

## 🧭 Navigation Globale

### **Header** (toujours visible)
- **Logo** : Clic → Accueil
- **Liens Desktop** :
  - Portfolio
  - Ambassadeurs
  - Associations
  - Classement
  - Signaler 🚨
  - Connexion / Mon profil (selon état)
- **Menu Mobile** : Hamburger → Drawer latéral

### **Footer** (toujours visible)
- Logo + Description
- Navigation (3 liens)
- Informations (Contact, Campus, Challenge)
- Réseaux sociaux
- Copyright + Mentions légales

---

## 🎨 Système de Design

### **Couleurs Principales**
- **Burgundy** : `#671324` - Couleur principale, textes importants
- **Pink** : `#E33054` - Accents, highlights
- **Yellow** : `#DBA12D` - CTAs, badges, éléments importants
- **Black** : `#000000` - Textes
- **White** : `#FFFFFF` - Fond, textes sur fond sombre

### **Composants Réutilisables**

#### **Cards**
- Fond blanc
- Border-radius : 16px
- Ombre : légère par défaut, plus prononcée au hover
- Padding : 24px
- Hover : Légèrement agrandie (scale 1.05)

#### **Boutons**
- **Primary** : Fond jaune, texte noir, gradient
- **Secondary** : Fond blanc, texte burgundy
- **Outline** : Bordure jaune, texte jaune
- **Danger** : Fond rouge, texte blanc
- **Success** : Fond vert, texte blanc
- Hover : Légèrement agrandi, ombre plus prononcée

#### **Badges**
- Pills arrondis
- Couleurs selon contexte (jaune, rose, vert, bleu)
- Padding : 8px 16px

#### **Inputs/Textareas**
- Bordure grise
- Focus : Bordure jaune, ring jaune
- Border-radius : 8px
- Padding : 12px 16px

---

## 📱 Responsive Design

### **Breakpoints**
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

### **Adaptations Mobile**
- Navigation : Menu hamburger
- Grilles : 1 colonne → 2 colonnes → 3 colonnes
- Cards : Pleine largeur
- Boutons : Pleine largeur ou empilés
- Tableaux : Scroll horizontal

---

## 🔄 Flux Utilisateurs

### **Flux 1 : Découvrir un Portfolio**
1. Accueil → Clic "Découvrir les portfolios"
2. Page Portfolio → Filtre (optionnel)
3. Clic sur un projet → (futur : page détail)
4. Clic "Voir sur GitHub" → Lien externe

### **Flux 2 : Rejoindre les Ambassadeurs**
1. Accueil → Clic "Rejoindre les ambassadeurs"
2. Page Ambassadeurs → Voir missions
3. Clic "Participer" sur une mission → Page Soumettre
4. Remplir formulaire → Soumettre
5. Retour classement → Voir ses points

### **Flux 3 : Rejoindre une Association**
1. Accueil → Clic "Explorer les associations"
2. Page Associations → Voir associations actives
3. Clic "En savoir plus" → Modal
4. Clic "Adhérer" → (futur : formulaire)
5. Ou : Connexion → Profil → Onglet Associations → Rejoindre

### **Flux 4 : Signaler un Problème**
1. Header → Clic "Signaler"
2. Page Signalement → Choisir catégorie
3. Remplir formulaire + Ajouter photo
4. Envoyer → Confirmation → Retour accueil
5. Admin voit le signalement dans `/admin/reports`

### **Flux 5 : Créer son Portfolio**
1. Connexion → Email + MDP (1234)
2. Profil → Onglet Portfolio
3. Remplir infos + Ajouter projets
4. Sauvegarder
5. Copier lien public → Partager

### **Flux 6 : Admin Gère Signalements**
1. Admin → Clic "Signalements"
2. Voir liste → Filtrer par statut
3. Clic "Voir détails" → Modal
4. Marquer "En cours" ou "Résolu"
5. Ou supprimer

---

## 🎯 Points d'Attention Design

### **Hiérarchie Visuelle**
- **Niveau 1** : Titres Hero (4xl-7xl)
- **Niveau 2** : Titres sections (3xl-5xl)
- **Niveau 3** : Sous-titres (xl-2xl)
- **Niveau 4** : Textes (base-lg)

### **Espacements**
- Sections : 64px (py-16)
- Cards : 24px padding
- Gaps : 16px-32px selon contexte

### **Animations**
- **Hover** : Scale 1.05, ombre plus prononcée
- **Transitions** : 200-300ms ease
- **Loading** : Spinner rotatif
- **Scroll** : Smooth scroll vers ancres

### **États Interactifs**
- **Hover** : Légère élévation, couleur plus saturée
- **Active** : Scale 0.95, bordure plus épaisse
- **Disabled** : Opacité 50%, curseur not-allowed
- **Focus** : Ring jaune, bordure jaune

### **Feedback Utilisateur**
- **Succès** : Message vert, icône ✓
- **Erreur** : Message rouge, icône ✕
- **Info** : Message bleu, icône ℹ️
- **Chargement** : Spinner + texte "Chargement..."

---

## 📋 Checklist Design

### **Pages à Designer**
- [ ] Page d'accueil (7 sections)
- [ ] Page Portfolios
- [ ] Page Ambassadeurs
- [ ] Page Associations
- [ ] Page Classement
- [ ] Page Soumettre action
- [ ] Page Signalement
- [ ] Page Connexion
- [ ] Page Profil étudiant (2 onglets)
- [ ] Page Profil public
- [ ] Panel Admin - Signalements

### **Composants à Designer**
- [ ] Header (desktop + mobile)
- [ ] Footer
- [ ] Cards (tous types)
- [ ] Boutons (tous types)
- [ ] Inputs/Textareas
- [ ] Badges
- [ ] Modals
- [ ] Tableaux
- [ ] Calendrier
- [ ] Filtres/Pills
- [ ] Navigation Admin

### **États à Designer**
- [ ] Loading
- [ ] Vide (empty states)
- [ ] Erreur
- [ ] Succès
- [ ] Hover
- [ ] Active
- [ ] Disabled
- [ ] Focus

### **Responsive à Designer**
- [ ] Mobile (< 768px)
- [ ] Tablet (768-1024px)
- [ ] Desktop (> 1024px)

---

## 💡 Suggestions UX

### **Micro-interactions**
- Animation douce au scroll
- Feedback visuel sur chaque action
- Transitions fluides entre pages
- Loading states élégants

### **Accessibilité**
- Contrastes suffisants
- Tailles de texte lisibles
- Zones de clic généreuses (min 44×44px)
- Navigation clavier possible

### **Performance Visuelle**
- Images optimisées
- Lazy loading pour les images
- Skeleton screens au lieu de spinners (optionnel)

---

## 📝 Notes Importantes

1. **Tous les textes sont en français**
2. **Les emojis sont utilisés comme icônes** (peuvent être remplacés par des icônes SVG)
3. **Le système de couleurs Eugenia doit être respecté**
4. **Les gradients sont utilisés** (burgundy → pink, yellow → gold)
5. **Les cards ont des ombres douces** pour la profondeur
6. **Le design doit être moderne et engageant** pour les étudiants
7. **La navigation doit être intuitive** et accessible en 2 clics max

---

## 🎨 Inspiration Design

- **Style** : Moderne, coloré, engageant
- **Références** : Plateformes communautaires étudiantes, apps de gamification
- **Tone** : Amical, motivant, professionnel
- **Atmosphère** : Dynamique, collaborative, inclusive

---

**Document créé pour le designer - Version 1.0**
**Date** : Janvier 2025
**Projet** : Eugenia School Community Platform

