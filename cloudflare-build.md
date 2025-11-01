# Configuration Cloudflare Pages

## Variables d'environnement requises

```bash
VITE_SHEET_ID=your_google_sheet_id
VITE_APP_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
```

## Commandes de build

```bash
# Développement local
npm run dev

# Build de production
npm run build

# Preview production
npm run preview
```

## Configuration Cloudflare Pages

Dans le dashboard Cloudflare Pages :

### Build Settings
- **Framework preset** : Vite
- **Build command** : `npm run build`
- **Build output directory** : `dist`
- **Root directory** : `/`

### Environment Variables
- `VITE_SHEET_ID` : ID de votre Google Sheet
- `VITE_APP_SCRIPT_URL` : URL de votre web app Apps Script

### Domain
Configurez votre domaine custom :
- `eugenia-challenge.pages.dev` (gratuit)
- `challenge.eugeniaschool.com` (custom)

## Déploiement

```bash
# Via GitHub (recommandé)
1. Push code sur GitHub
2. Connecter repo à Cloudflare Pages
3. Auto-deploy sur chaque commit

# Via CLI
npm install -g wrangler
wrangler pages deploy dist
```

## Performance

- **Edge Computing** : Proche des utilisateurs
- **Global CDN** : Rendu instantané
- **Automatic HTTPS** : SSL/TLS inclus
- **Free tier** : Jusqu'à 100k requêtes/jour

## Analytics

Activer Cloudflare Analytics dans le dashboard pour :
- Trafic en temps réel
- Pages les plus visitées
- Origine géographique
- Performance

## Rollback

En cas de problème :
1. Ouvrir Cloudflare Pages
2. Aller dans "Deployments"
3. Choisir version précédente
4. Cliquer "Retry deployment"

## Monitoring

- Errors : Dashboard Cloudflare
- Logs : `wrangler pages deployment tail`
- Performance : Web Vitals

