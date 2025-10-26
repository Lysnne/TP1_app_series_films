import express from "express";
import { mediaRouter } from "./src/routes/mediaRoutes";
import { filmsRouter } from "./src/routes/filmsRoutes";
import { seriesRouter } from "./src/routes/seriesRoutes";
import { userRouter } from "./src/routes/userRoutes";
import { logsRouter } from "./src/routes/logsRoutes";
import { errorHandler } from "./src/middlewares/errorHandler";
import { logOperation } from "./src/utils/logger";

const app = express();
app.use(express.json());

// Routes
app.use("/api/medias", mediaRouter);
app.use("/api/films", filmsRouter);
app.use("/api/series", seriesRouter);
app.use("/api/users", userRouter);
app.use("/api/logs", logsRouter);

// Middleware d'erreur
app.use(errorHandler);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    logOperation("SERVER_START", { port: PORT });
});
