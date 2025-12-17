# API Externe - Ajout de Points

Ce document explique comment utiliser l'API externe pour ajouter des points aux étudiants depuis un service externe (comme Instagram, TikTok, etc.).

## Endpoint

**POST** `/api/external/add-points`

## Authentification

L'endpoint nécessite une clé API pour l'authentification. Configurez la variable d'environnement `EXTERNAL_API_KEY` dans votre Cloudflare Worker.

### Configuration

Dans `worker/wrangler.toml`, ajoutez :

```toml
[vars]
EXTERNAL_API_KEY = "votre-cle-secrete-ici"
```

Ou via la console Cloudflare :
1. Allez dans Workers & Pages
2. Sélectionnez votre worker
3. Settings > Variables
4. Ajoutez `EXTERNAL_API_KEY` avec votre clé secrète

## Requête

### Headers

```
Content-Type: application/json
```

### Body

```json
{
  "email": "etudiant@eugeniaschool.com",
  "points": 10,
  "apiKey": "votre-cle-secrete-ici",
  "source": "instagram",  // Optionnel
  "description": "Post Instagram avec 100 likes"  // Optionnel
}
```

### Paramètres

- **email** (requis) : Email de l'étudiant
- **points** (requis) : Nombre de points à ajouter (doit être positif)
- **apiKey** (requis) : Clé API pour authentification
- **source** (optionnel) : Source des points (ex: "instagram", "tiktok", "youtube")
- **description** (optionnel) : Description de l'action qui a généré les points

## Réponse

### Succès (200)

```json
{
  "success": true,
  "message": "Points added successfully",
  "data": {
    "email": "etudiant@eugeniaschool.com",
    "pointsAdded": 10,
    "totalPoints": 150,
    "actionsCount": 5
  }
}
```

### Erreurs

#### 401 - Clé API invalide

```json
{
  "success": false,
  "error": "Invalid API key"
}
```

#### 400 - Données invalides

```json
{
  "success": false,
  "error": "Valid email is required"
}
```

ou

```json
{
  "success": false,
  "error": "Points must be a positive number"
}
```

## Exemples d'utilisation

### JavaScript/Node.js

```javascript
const response = await fetch('https://votre-worker.workers.dev/api/external/add-points', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'etudiant@eugeniaschool.com',
    points: 10,
    apiKey: 'votre-cle-secrete-ici',
    source: 'instagram',
    description: 'Post Instagram avec 100 likes'
  })
});

const data = await response.json();
console.log(data);
```

### Python

```python
import requests

url = 'https://votre-worker.workers.dev/api/external/add-points'
data = {
    'email': 'etudiant@eugeniaschool.com',
    'points': 10,
    'apiKey': 'votre-cle-secrete-ici',
    'source': 'instagram',
    'description': 'Post Instagram avec 100 likes'
}

response = requests.post(url, json=data)
print(response.json())
```

### cURL

```bash
curl -X POST https://votre-worker.workers.dev/api/external/add-points \
  -H "Content-Type: application/json" \
  -d '{
    "email": "etudiant@eugeniaschool.com",
    "points": 10,
    "apiKey": "votre-cle-secrete-ici",
    "source": "instagram",
    "description": "Post Instagram avec 100 likes"
  }'
```

## Notes importantes

1. **Sécurité** : Gardez votre clé API secrète. Ne la partagez jamais publiquement.

2. **Points** : Les points doivent être des nombres positifs. Les valeurs négatives ou nulles seront rejetées.

3. **Email** : L'email doit être valide et contenir un "@". Si l'étudiant n'existe pas dans le leaderboard, il sera créé automatiquement.

4. **Traçabilité** : Si vous fournissez `source` ou `description`, une action sera automatiquement créée dans le système pour tracer l'origine des points.

5. **CORS** : L'endpoint supporte CORS et peut être appelé depuis n'importe quel domaine.

## Intégration avec Instagram/TikTok

Pour intégrer avec un service externe type Instagram :

1. Configurez un webhook ou un script qui surveille les interactions
2. Quand un étudiant atteint un seuil (ex: 100 likes), appelez l'endpoint
3. Utilisez `source: "instagram"` pour identifier la source
4. Ajoutez une `description` pour documenter l'action

Exemple :

```javascript
// Quand un post atteint 100 likes
if (post.likes >= 100 && !post.pointsAwarded) {
  await fetch('https://votre-worker.workers.dev/api/external/add-points', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: post.authorEmail,
      points: 10,
      apiKey: process.env.EXTERNAL_API_KEY,
      source: 'instagram',
      description: `Post avec ${post.likes} likes`
    })
  });
  
  post.pointsAwarded = true; // Marquer comme récompensé
}
```

