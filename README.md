# TP1 series-films-TV Tracker 

Application de suivi de séries et films développée avec TypeScript, Node.js et Express.

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



