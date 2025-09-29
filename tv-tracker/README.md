# TV Tracker - API RESTful

Application de suivi de séries et films développée avec TypeScript, Node.js et Express.

## 🚀 Installation et démarrage

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev

# Démarrage en mode production
npm run start
```

Le serveur sera disponible sur `http://localhost:3000`

## 📁 Structure du projet

```
tv-tracker/
├── src/
│   ├── controllers/          # Contrôleurs MVC
│   │   ├── MediaController.ts
│   │   ├── UserController.ts
│   │   └── LogsController.ts
│   ├── models/               # Modèles POO
│   │   ├── Media.ts (abstrait)
│   │   ├── Film.ts
│   │   ├── Serie.ts
│   │   ├── Saison.ts
│   │   ├── Episode.ts
│   │   └── User.ts
│   ├── routes/               # Routes Express
│   │   ├── mediaRoutes.ts
│   │   ├── userRoutes.ts
│   │   └── logsRoutes.ts
│   ├── middlewares/          # Middlewares
│   │   ├── auth.ts
│   │   ├── validateMedia.ts
│   │   └── errorHandler.ts
│   ├── services/             # Services métier
│   │   └── StorageService.ts
│   ├── utils/                # Utilitaires
│   │   └── logger.ts
│   └── data/                 # Données persistantes
│       └── db.json
├── operations.log            # Log des opérations
├── errors.log               # Log des erreurs
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Authentification

L'API utilise un système d'authentification basé sur les headers :

### Header requis
```
x-user-id: <user_id>
```

### Utilisateurs de test
- **Admin** : `x-user-id: admin1`
- **User** : `x-user-id: user1`

## 📊 Modèles de données

### Media (abstrait)
- `id`: string
- `titre`: string
- `plateforme`: string
- `userId`: string

### Film (hérite de Media)
- `duree`: number
- `genre`: string
- `annee`: number

### Serie (hérite de Media)
- `statut`: "en_attente" | "en_cours" | "terminee"
- `saisons`: Saison[]

### Saison
- `numero`: number
- `episodes`: Episode[]

### Episode
- `id`: string
- `titre`: string
- `numero`: number
- `duree`: number
- `watched?`: boolean

### User
- `id`: string
- `nom`: string
- `role`: "admin" | "user"

## 🛠️ API Endpoints

### Médias
- `GET /api/medias` - Liste tous les médias (filtres: type, genre, annee)
- `GET /api/medias/:id` - Récupère un média par ID
- `POST /api/medias` - Crée un média (admin requis)
- `PUT /api/medias/:id` - Met à jour un média (admin requis)
- `DELETE /api/medias/:id` - Supprime un média (admin requis)

### Films
- `POST /api/films` - Crée un film (admin requis)

### Séries
- `POST /api/series` - Crée une série (admin requis)
- `GET /api/series/:id/episodes` - Liste les épisodes d'une série

### Saisons et Épisodes
- `POST /api/seasons` - Ajoute une saison (admin requis)
- `POST /api/episodes` - Ajoute un épisode (admin requis)
- `PATCH /api/episodes/:id` - Marque un épisode comme vu

### Utilisateurs
- `GET /api/users/:id/medias` - Liste les médias d'un utilisateur

### Logs
- `GET /api/logs` - Récupère la dernière action enregistrée

## 📝 Exemples de requêtes

### Créer un film (admin)
```bash
POST /api/films
Headers:
  Content-Type: application/json
  x-user-id: admin1

Body:
{
  "titre": "Inception",
  "plateforme": "Netflix",
  "duree": 148,
  "genre": "Sci-Fi",
  "annee": 2010
}
```

### Créer une série (admin)
```bash
POST /api/series
Headers:
  Content-Type: application/json
  x-user-id: admin1

Body:
{
  "titre": "Breaking Bad",
  "plateforme": "AMC",
  "statut": "terminee"
}
```

### Ajouter une saison (admin)
```bash
POST /api/seasons
Headers:
  Content-Type: application/json
  x-user-id: admin1

Body:
{
  "serieId": "2",
  "numero": 1
}
```

### Ajouter un épisode (admin)
```bash
POST /api/episodes
Headers:
  Content-Type: application/json
  x-user-id: admin1

Body:
{
  "serieId": "2",
  "saisonNumero": 1,
  "titre": "Pilot",
  "numero": 1,
  "duree": 58
}
```

### Marquer un épisode comme vu
```bash
PATCH /api/episodes/ep1
```

### Lister les médias avec filtres
```bash
GET /api/medias?type=film&genre=Sci-Fi&annee=2010
```

## ✅ Validation des données

### RegEx appliquées
- **titre** : `^[A-Za-z0-9 ]+$`
- **plateforme** : `^[A-Za-z]+$`
- **duree** : entier positif
- **statut** : `en_attente|en_cours|terminee`
- **annee** : <= année actuelle

### Codes d'erreur
- `400` : Données invalides
- `401` : Authentification requise
- `403` : Accès refusé (non-admin)
- `404` : Ressource non trouvée
- `500` : Erreur interne du serveur

## 📋 Logging

### Fichiers de logs
- `operations.log` : Toutes les opérations (format JSON)
- `errors.log` : Toutes les erreurs (format JSON)

### Format des logs
```json
{
  "action": "CREATE_FILM",
  "timestamp": "2025-09-29T03:00:00.000Z",
  "id": "1234567890",
  "titre": "Inception",
  "userId": "admin1"
}
```

## 🗄️ Persistance

Les données sont sauvegardées automatiquement dans `src/data/db.json` après chaque opération de création, modification ou suppression.

## 🧪 Tests Postman

Une collection Postman est fournie avec tous les cas de test :
- Requêtes valides et invalides
- Tests d'authentification
- Tests de validation
- Tests de filtrage

## 📚 Technologies utilisées

- **Node.js** : Runtime JavaScript
- **TypeScript** : Langage de programmation
- **Express** : Framework web
- **Winston** : Système de logging
- **fs/promises** : Persistance asynchrone

## 🔧 Scripts disponibles

- `npm run dev` : Démarrage en mode développement avec rechargement automatique
- `npm run start` : Démarrage en mode production
- `npm run build` : Compilation TypeScript

## 📄 Licence

ISC
