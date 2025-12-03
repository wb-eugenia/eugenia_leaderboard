# 🎭 Spécifications d'Interactions - Eugenia School

## 📱 Composants Interactifs Détaillés

### **1. Navigation Header**

#### Desktop
- **Logo** : Hover → Opacité 80%
- **Liens** : Hover → Couleur jaune, transition 200ms
- **Bouton Connexion/Profil** : Même comportement que les autres liens

#### Mobile
- **Menu Hamburger** : 
  - Clic → Overlay sombre (50% opacity) + Drawer depuis la gauche
  - Drawer : Fond blanc, largeur 256px
  - Animation : Slide in 300ms ease-in-out
  - Fermeture : Clic sur overlay ou bouton ✕

---

### **2. Cards de Projets/Associations**

#### États
- **Par défaut** : Ombre légère, border-radius 16px
- **Hover** : 
  - Scale 1.05
  - Ombre plus prononcée
  - Transition 300ms ease
- **Clic** : Scale 0.98 (feedback tactile)

#### Contenu
- Image/Emoji en haut (centré)
- Titre en gras
- Métadonnées (nom, classe, date)
- Description (3 lignes max avec ellipsis)
- Badges/Tags en bas
- Bouton d'action

---

### **3. Formulaire de Signalement**

#### Sélection de Catégorie
- **Par défaut** : Fond gris clair, bordure grise
- **Sélectionné** : 
  - Fond jaune/20%, bordure burgundy
  - Scale 1.05
  - Animation : 200ms ease

#### Upload Photo
- **Input file** : Style standard
- **Photo sélectionnée** :
  - Prévisualisation : Image 192px hauteur, object-cover
  - Border-radius 8px
  - Bordure grise
  - Bouton "Supprimer" en dessous (texte rouge)

#### Validation
- **Champs requis** : Indicateur rouge (*)
- **Erreur** : Message rouge sous le champ
- **Succès** : Message vert en haut du formulaire

---

### **4. Calendrier Associations**

#### Structure
- **En-têtes** : 7 colonnes (Lun-Dim), fond gris clair
- **Cases** : 
  - Hauteur minimale 80px
  - Bordure grise fine
  - Numéro du jour en haut à gauche
- **Cases avec événements** :
  - Fond jaune/20%
  - Badge coloré avec emoji + texte
  - Hover : Badge légèrement agrandi
  - Clic : (futur : voir détails)

#### Responsive
- **Mobile** : Scroll horizontal
- **Desktop** : Grille complète visible

---

### **5. Tableau Classement**

#### Lignes
- **Par défaut** : Fond blanc, bordure basse grise
- **Hover** : Fond gris très clair (50)
- **Top 3** : 
  - Rang 1 : Badge 🥇, fond légèrement jaune
  - Rang 2 : Badge 🥈, fond légèrement gris
  - Rang 3 : Badge 🥉, fond légèrement orange

#### Colonnes
- **Rang** : Centré, largeur 80px
- **Nom** : Aligné gauche, largeur flexible
- **Classe** : Centré, largeur 100px
- **Points** : Aligné droite, couleur rose, largeur 120px
- **Actions** : Aligné droite, largeur 100px

---

### **6. Onglets Profil Étudiant**

#### Navigation
- **Par défaut** : Texte gris, pas de bordure
- **Actif** : 
  - Texte burgundy
  - Bordure basse 2px burgundy
  - Font-weight bold

#### Transition
- Changement d'onglet : Fade in 300ms
- Contenu : Slide léger (optionnel)

---

### **7. Modal Détails**

#### Apparition
- **Overlay** : Fond noir 50%, fade in 200ms
- **Modal** : 
  - Slide up + fade in 300ms
  - Max-width 672px
  - Max-height 90vh
  - Scroll si contenu trop long

#### Fermeture
- Clic sur overlay
- Clic sur bouton ✕
- Escape key (futur)

---

### **8. Filtres**

#### Style Pills
- **Par défaut** : Fond blanc/20%, texte blanc
- **Actif** : 
  - Fond jaune
  - Texte noir
  - Scale 1.05
  - Ombre

#### Grille Catégories
- **Par défaut** : Fond blanc, bordure grise
- **Sélectionné** : 
  - Fond burgundy/10%
  - Bordure burgundy 2px
  - Scale 1.05

---

### **9. Badges Statut**

#### Couleurs
- **En attente** : Fond jaune/100, texte jaune/800
- **En cours** : Fond bleu/100, texte bleu/800
- **Résolu** : Fond vert/100, texte vert/800

#### Style
- Pills arrondis
- Padding 4px 12px
- Font-size 14px
- Font-weight semibold

---

### **10. Boutons Actions**

#### États
- **Par défaut** : Couleur normale, ombre légère
- **Hover** : 
  - Scale 1.05
  - Ombre plus prononcée
  - Couleur légèrement plus saturée
- **Active** : Scale 0.95
- **Disabled** : 
  - Opacité 50%
  - Curseur not-allowed
  - Pas de hover

#### Tailles
- **Small** : Padding 4px 12px, font-size 14px
- **Medium** : Padding 8px 16px, font-size 16px (défaut)
- **Large** : Padding 12px 24px, font-size 18px

---

## 🎬 Animations Spécifiques

### **Page Load**
- **Sections** : Fade in up (opacity 0 → 1, translateY 30px → 0)
- **Durée** : 600ms ease-out
- **Délai** : 100ms entre chaque section

### **Cards Apparition**
- **Stagger** : Chaque card apparaît avec 50ms de délai
- **Animation** : Fade in + scale (0.95 → 1)

### **Scroll Smooth**
- **Ancres** : Scroll fluide vers les sections
- **Durée** : 500ms ease-in-out

### **Hover Effects**
- **Cards** : Scale 1.05, ombre plus prononcée
- **Boutons** : Scale 1.05, couleur plus saturée
- **Liens** : Couleur change, underline (optionnel)

---

## 📐 Grilles et Layouts

### **Grilles Principales**
- **Portfolio** : 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
- **Ambassadeurs** : 1 col → 2 cols → 3 cols
- **Associations** : 1 col → 2 cols → 3 cols
- **Stats** : 1 col → 3 cols (toujours)

### **Gaps**
- **Petit** : 16px (entre éléments proches)
- **Moyen** : 24px (entre cards)
- **Grand** : 32px (entre sections)

### **Containers**
- **Max-width** : 1280px (7xl)
- **Padding** : 16px mobile, 32px desktop

---

## 🎨 Palette de Couleurs Complète

### **Primaires**
- Burgundy : `#671324`
- Pink : `#E33054`
- Yellow : `#DBA12D`
- Black : `#000000`
- White : `#FFFFFF`

### **Sémantiques**
- **Succès** : Vert `#10B981`
- **Erreur** : Rouge `#EF4444`
- **Info** : Bleu `#3B82F6`
- **Avertissement** : Jaune `#F59E0B`

### **Gris**
- **900** : `#111827` (textes principaux)
- **700** : `#374151` (textes secondaires)
- **500** : `#6B7280` (textes tertiaires)
- **300** : `#D1D5DB` (bordures)
- **100** : `#F3F4F6` (fonds légers)
- **50** : `#F9FAFB` (fonds très légers)

### **Opacités**
- **10%** : Pour les fonds légers
- **20%** : Pour les overlays légers
- **50%** : Pour les overlays modérés
- **80%** : Pour les textes secondaires

---

## 🔍 Zones de Clic

### **Taille Minimale**
- **Boutons** : 44×44px (accessibilité)
- **Liens** : Hauteur ligne 24px minimum
- **Cards cliquables** : Toute la surface

### **Espacement**
- **Entre éléments cliquables** : Minimum 8px
- **Padding interne** : Minimum 12px

---

## 📊 Hiérarchie Typographique

### **Titres**
- **H1 Hero** : 48px-72px, bold, line-height 1.2
- **H2 Section** : 36px-48px, bold, line-height 1.3
- **H3 Sous-section** : 24px-30px, semibold, line-height 1.4
- **H4 Card** : 20px-24px, semibold, line-height 1.5

### **Textes**
- **Body Large** : 18px, regular, line-height 1.6
- **Body** : 16px, regular, line-height 1.6
- **Body Small** : 14px, regular, line-height 1.5
- **Caption** : 12px, regular, line-height 1.4

### **Poids**
- **Bold** : 700 (titres importants)
- **Semibold** : 600 (sous-titres, labels)
- **Regular** : 400 (textes)
- **Medium** : 500 (badges, stats)

---

## 🖼️ Images et Médias

### **Ratios**
- **Cards projets** : 16:9 ou 1:1
- **Photos signalements** : Flexible, max-height 384px
- **Avatars** : 1:1 (cercle ou carré arrondi)

### **Optimisation**
- **Format** : WebP (avec fallback JPG/PNG)
- **Lazy loading** : Pour images below the fold
- **Placeholder** : Fond gris avec icône

---

## 🎯 Points d'Attention UX

### **Feedback Immédiat**
- Toute action doit avoir un feedback visuel
- Messages de succès/erreur clairs
- États de chargement visibles

### **Navigation Claire**
- Breadcrumbs si nécessaire
- Bouton "Retour" visible
- Titre de page toujours visible

### **Accessibilité**
- Contrastes WCAG AA minimum
- Focus visible (ring jaune)
- Textes alternatifs pour images
- Labels pour tous les inputs

### **Performance Perçue**
- Skeleton screens pour chargements longs
- Optimistic UI quand possible
- Transitions fluides (60fps)

---

## 📱 Breakpoints Détaillés

### **Mobile** (< 768px)
- Navigation : Hamburger
- Grilles : 1 colonne
- Cards : Pleine largeur
- Boutons : Pleine largeur ou empilés
- Tableaux : Scroll horizontal
- Modals : Pleine largeur avec padding

### **Tablet** (768px - 1024px)
- Navigation : Liens visibles
- Grilles : 2 colonnes
- Cards : 2 colonnes
- Boutons : Inline si possible
- Tableaux : Scroll si nécessaire

### **Desktop** (> 1024px)
- Navigation : Tous les liens visibles
- Grilles : 3-4 colonnes
- Cards : 3 colonnes
- Boutons : Inline
- Tableaux : Toutes colonnes visibles

---

## 🎨 Exemples de Compositions

### **Hero Section Type**
```
[Grand Titre - 72px]
[Sous-titre - 24px]
[Badge Mois - 20px]
[3 Boutons CTA - 24px]
```

### **Card Projet Type**
```
[Emoji/Image - 64px]
[Titre - 24px bold]
[Nom + Classe - 16px]
[Description - 16px, 3 lignes]
[Badges Tech - 14px]
[Bouton - 16px]
```

### **Formulaire Type**
```
[Label - 16px semibold]
[Input - 16px, padding 12px]
[Message erreur - 14px rouge]
[Bouton - 18px]
```

---

**Document complémentaire pour le designer**
**Version 1.0 - Janvier 2025**

