# TV Tracker - Structure avec Contrôleurs

## Structure du projet

```
tv-tracker/
├── src/
│   ├── controllers/          # 🆕 Nouveaux contrôleurs
│   │   ├── MediaController.ts
│   │   ├── SeriesController.ts
│   │   ├── UserController.ts
│   │   ├── LogsController.ts
│   │   └── index.ts
│   ├── models/
│   │   ├── Media.ts
│   │   ├── Film.ts
│   │   ├── Serie.ts
│   │   ├── Season.ts
│   │   ├── Episode.ts
│   │   └── User.ts
│   ├── routes/
│   │   ├── mediaRoutes.ts
│   │   ├── seriesRoutes.ts
│   │   ├── userRoutes.ts
│   │   └── logsRoutes.ts     # 🆕 Nouvelle route pour les logs
│   ├── middlewares/
│   │   ├── errorHandler.ts
│   │   ├── requireAdmin.ts
│   │   └── validateMedia.ts
│   ├── services/
│   │   └── dbService.ts
│   ├── utils/
│   │   └── logger.ts
│   └── data/
│       └── db.json
├── logs/
│   ├── actions.log
│   └── errors.log
├── package.json
├── tsconfig.json
├── app.ts
└── README.md
```

## Contrôleurs implémentés

### 1. MediaController
Gère toutes les opérations CRUD sur les médias (films et séries).

**Méthodes :**
- `getAllMedias()` - GET /api/medias (avec filtrage)
- `getMediaById()` - GET /api/medias/:id
- `createMedia()` - POST /api/medias (admin requis)
- `updateMedia()` - PUT /api/medias/:id (admin requis)
- `deleteMedia()` - DELETE /api/medias/:id (admin requis)

### 2. SeriesController
Gère les opérations spécifiques aux séries et épisodes.

**Méthodes :**
- `getSeriesEpisodes()` - GET /api/series/:id/episodes
- `getSeriesSeasons()` - GET /api/series/:id/seasons
- `getSeriesStats()` - GET /api/series/:id/stats
- `addSeasonToSeries()` - POST /api/series/:id/seasons (admin requis)
- `addEpisodeToSeason()` - POST /api/series/:id/seasons/:seasonNumber/episodes (admin requis)
- `markEpisodeAsWatched()` - PATCH /api/episodes/:id

### 3. UserController
Gère les utilisateurs et leurs favoris.

**Méthodes :**
- `getUserMedias()` - GET /api/users/:id/medias
- `getUserById()` - GET /api/users/:id
- `getFavorites()` - GET /api/users/:id/favorites
- `addFavorite()` - POST /api/users/:id/favorites
- `removeFavorite()` - DELETE /api/users/:id/favorites/:mediaId
- `getAllUsers()` - GET /api/users (admin requis)
- `createUser()` - POST /api/users

### 4. LogsController
Gère l'exposition des logs selon les exigences.

**Méthodes :**
- `getLastLog()` - GET /api/logs (dernière action enregistrée)
- `getAllActionLogs()` - GET /api/logs/actions
- `getErrorLogs()` - GET /api/logs/errors
- `getLogStats()` - GET /api/logs/stats
- `clearLogs()` - DELETE /api/logs (admin requis)

## Routes disponibles

### Médias
- `GET /api/medias` - Liste tous les médias (avec filtrage par type, genre, année)
- `GET /api/medias/:id` - Récupère un média par ID
- `POST /api/medias` - Crée un nouveau média (admin requis)
- `PUT /api/medias/:id` - Met à jour un média (admin requis)
- `DELETE /api/medias/:id` - Supprime un média (admin requis)

### Séries
- `GET /api/series/:id/episodes` - Liste des épisodes d'une série
- `GET /api/series/:id/seasons` - Liste des saisons d'une série
- `GET /api/series/:id/stats` - Statistiques d'une série
- `POST /api/series/:id/seasons` - Ajoute une saison (admin requis)
- `POST /api/series/:id/seasons/:seasonNumber/episodes` - Ajoute un épisode (admin requis)
- `PATCH /api/episodes/:id` - Marque un épisode comme vu

### Utilisateurs
- `GET /api/users/:id/medias` - Médias d'un utilisateur
- `GET /api/users/:id` - Informations d'un utilisateur
- `GET /api/users/:id/favorites` - Favoris d'un utilisateur
- `POST /api/users/:id/favorites` - Ajoute un favori
- `DELETE /api/users/:id/favorites/:mediaId` - Supprime un favori
- `GET /api/users` - Liste tous les utilisateurs (admin requis)
- `POST /api/users` - Crée un utilisateur

### Logs
- `GET /api/logs` - Dernière action enregistrée
- `GET /api/logs/actions` - Toutes les actions
- `GET /api/logs/errors` - Toutes les erreurs
- `GET /api/logs/stats` - Statistiques des logs
- `DELETE /api/logs` - Efface les logs (admin requis)

## Fonctionnalités implémentées

✅ **Architecture MVC** - Séparation claire entre contrôleurs, modèles et routes
✅ **Logging complet** - Winston avec fichiers séparés pour actions et erreurs
✅ **Validation des données** - Middleware de validation avec RegEx
✅ **Gestion des erreurs** - Middleware d'erreur centralisé
✅ **Authentification admin** - Middleware requireAdmin
✅ **Persistance JSON** - Sauvegarde automatique dans db.json
✅ **Endpoints de logs** - Exposition des logs selon les exigences
✅ **Gestion des favoris** - Système complet de favoris utilisateur
✅ **Statistiques** - Statistiques détaillées des séries

## Avantages de la nouvelle structure

1. **Séparation des responsabilités** - Chaque contrôleur gère un domaine spécifique
2. **Code plus maintenable** - Logique métier centralisée dans les contrôleurs
3. **Réutilisabilité** - Méthodes statiques facilement testables
4. **Logging intégré** - Chaque action est automatiquement loggée
5. **Gestion d'erreurs robuste** - Try/catch dans chaque méthode
6. **Documentation claire** - Commentaires JSDoc sur chaque méthode

## Utilisation

```bash
# Démarrer le serveur
npm start

# Le serveur sera disponible sur http://localhost:3000
```

Toutes les routes respectent les spécifications fonctionnelles du TP1 et incluent la gestion des logs avec Winston.
