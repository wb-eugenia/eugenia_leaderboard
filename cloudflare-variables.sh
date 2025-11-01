#!/bin/bash
# Configuration des variables d'environnement Cloudflare Pages
# À exécuter manuellement car wrangler pages secret ne supporte pas les VITE_ variables

echo "⚠️  ATTENTION: Vous devez configurer les variables manuellement dans Cloudflare Dashboard"
echo ""
echo "📋 Variables à ajouter:"
echo ""
echo "VITE_APP_SCRIPT_URL=https://script.google.com/macros/s/AKfycbyAwSriM-CgCiVVDnMj-GaqiakW1nlGmoGmoq0lFbVBTrZah6mcmV60GDQScmFpwOnC/exec"
echo "VITE_ADMIN_EMAIL=svelasquez@eugeniaschool.com"
echo "VITE_ADMIN_PASSWORD=!EugeniaSchool2025!Walid"
echo ""
echo "📝 Instructions:"
echo "1. Allez sur https://dash.cloudflare.com"
echo "2. Pages → eugenia-challenge → Settings → Environment Variables"
echo "3. Ajoutez les 3 variables ci-dessus"
echo "4. Save"
echo "5. Redéployez ou attendez le prochain auto-deploy"
echo ""
echo "🎉 Après configuration, votre app sera complètement fonctionnelle!"

