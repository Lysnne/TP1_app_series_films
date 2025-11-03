# TP1/TP2 series-films-TV Tracker 

Application de suivi de séries et films développée avec TypeScript, Node.js et Express.

## TP2 (API v2 avec MongoDB + JWT)

### Lancement 
```bash
# Dans v2/tv-tracker/
npm install
npm run dev
```
Logs attendus: `MongoDB connected: localhost` puis `Serveur démarré sur http://localhost:3000`.

### Basculer vers Atlas 
-  Utilisez une variable d'environnement en shell:
```bash
# PowerShell (session courante)
$env:MONGO_URI="mongodb+srv://<user>:<pass>@cluster0.exmbru8.mongodb.net/media_dev?retryWrites=true&w=majority&appName=Cluster0"
npm run dev
```

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






