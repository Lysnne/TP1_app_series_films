import { Router } from "express";
import { MediaController } from "../controllers/MediaController";
import { authMiddleware, requireAdmin } from "../middlewares/auth";
import { validateMedia } from "../middlewares/validateMedia";

const router = Router();

// Routes spécifiques pour les séries
router.post("/", authMiddleware, requireAdmin, validateMedia, MediaController.createSerie);
router.get("/:id/episodes", MediaController.getSeriesEpisodes);

// Routes pour les saisons et épisodes
router.post("/seasons", authMiddleware, requireAdmin, MediaController.createSaison);
router.post("/episodes", authMiddleware, requireAdmin, MediaController.createEpisode);
router.patch("/episodes/:id", MediaController.markEpisodeAsWatched);

export { router as seriesRouter };