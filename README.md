# TP1/TP2 series-films-TV Tracker 

Application de suivi de séries et films développée avec TypeScript, Node.js et Express.

## TP2 (API v2 avec MongoDB + JWT)

### Prérequis
- Node 18+
- MongoDB local (recommandé pour le dev) OU un cluster Atlas

### Lancement (local par défaut)
```bash
# Dans v2/tv-tracker/
npm install
npm run dev
```
Logs attendus: `MongoDB connected: localhost` puis `Serveur démarré sur http://localhost:3000`.

### Basculer vers Atlas (optionnel)
- N'ajoutez pas vos secrets dans le repo. Utilisez une variable d'environnement en shell:
```bash
# PowerShell (session courante)
$env:MONGO_URI="mongodb+srv://<user>:<pass>@cluster0.exmbru8.mongodb.net/media_dev?retryWrites=true&w=majority&appName=Cluster0"
npm run dev
```
Pour revenir en local, fermez la session ou supprimez la variable.

### Seed de données (admin, user, films)
```bash
# Dans v2/tv-tracker/
npm run seed
```
Crée: `admin@example.com` (admin), `user@example.com` (user), films `Inception`, `Interstellar`.

### Postman (collection v2)
- Importez: `v2/tv-tracker/TV_Tracker_API_v2.postman_collection.json`
- Variables de collection:
  - `baseUrl = http://localhost:3000`
  - `token` (utilisateur), `adminToken` (admin)
  - `movieId`, `seriesId`, `seasonId`, `episodeId`

### Endpoints v2 principaux
- Auth: `POST /api/v2/auth/register`, `POST /api/v2/auth/login`
- Movies: `GET/POST/GET/:id/PATCH/:id/DELETE/:id` sur `/api/v2/movies` (CRUD + filtres/pagination)
- Series:
  - `GET /api/v2/series?title=&genre=&status=`
  - `POST /api/v2/series` (admin)
  - `POST /api/v2/series/:seriesId/seasons` (admin)
  - `POST /api/v2/series/:seriesId/seasons/:seasonId/episodes` (admin)
  - `GET /api/v2/series/:seriesId/seasons/:seasonId/episodes?minDuration=`
- Ratings:
  - `POST /api/v2/ratings` (JWT; `{ target: "movie"|"episode", targetId, score }`)
  - `GET /api/v2/ratings/avg/movie/:movieId`
  - `GET /api/v2/ratings/avg/series/:seriesId`
- Utilitaire dev: `POST /api/v2/dev/ping` (écrit dans `pings`)

Routes admin protégées: utilisez le token admin. Rate-limit appliqué sur `/api/v2/auth/login` et `/api/v2/ratings`.

### Scénario de test rapide
1. Démarrer: `npm run dev`
2. Login admin:
   - `POST /api/v2/auth/login` avec `admin@example.com` / `Str0ngP@ssw0rd!`
   - Copier `token` → variable `adminToken`
3. Movies:
   - `POST /api/v2/movies` (admin) → sauver `_id` en `movieId`
   - `GET /api/v2/movies?title=...`
4. Series/Seasons/Episodes (admin):
   - `POST /api/v2/series` → `seriesId`
   - `POST /api/v2/series/:seriesId/seasons` → `seasonId`
   - `POST /api/v2/series/:seriesId/seasons/:seasonId/episodes` → `episodeId`
   - `GET /api/v2/series/:seriesId/seasons/:seasonId/episodes?minDuration=30`
5. Ratings:
   - `POST /api/v2/ratings` pour un film (`movieId`) puis `GET /api/v2/ratings/avg/movie/:movieId`
   - `POST /api/v2/ratings` pour un épisode (`episodeId`) puis `GET /api/v2/ratings/avg/series/:seriesId`

### Erreurs fréquentes
- 401 `jwt malformed`: header incorrect. Utiliser `Authorization: Bearer <token>` (sans quotes, ni espaces supplémentaires).
- 403: route admin appelée avec un token non-admin.
- 404: mauvais chemin (vérifier `/api/v2/...`).
- 422: validation (champs requis/format).

##  Installation et démarrage

```bash
# Installation des dépendances
npm install

# Démarrage 
npm run dev

```



## 📁 Structure du projet

```
tv-tracker/
├── src/
│   ├── controllers/          # Contrôleurs MVC
│   │   └── index.ts
│   │   ├── MediaController.ts
│   │   ├── UserController.ts
│   │   └── LogsController.ts
│   │   └── SeriesController.ts
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
│   │   └── filmsRoutes.ts
│   │   └── seriesRoutes.ts
│   ├── middlewares/          # Middlewares
│   │   ├── auth.ts
│   │   ├── validateMedia.ts
│   │   └── errorHandler.ts
│   │   └── requireAdmin.ts
│   ├── services/             # Services métier
│   │   └── StorageService.ts
│   │   └── dbService.ts
│   ├── utils/                # Utilitaires
│   │   └── logger.ts
│   └── data/                 # Données persistantes
│       └── db.json
├── app.ts 
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


##  API Endpoints

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



##  Persistance

Les données sont sauvegardées automatiquement dans `src/data/db.json` après chaque opération de création, modification ou suppression.

##  Tests Postman

Une collection Postman est fournie avec tous les cas de test :
- Requêtes valides et invalides
- Tests d'authentification
- Tests de validation
- Tests de filtrage

##  Technologies utilisées

- **Node.js** : Runtime JavaScript
- **TypeScript** : Langage de programmation
- **Express** : Framework web
- **Winston** : Système de logging



