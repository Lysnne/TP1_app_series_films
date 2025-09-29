import { Router } from "express";
import { MediaController } from "../controllers/MediaController";
import { authMiddleware, requireAdmin } from "../middlewares/auth";
import { validateMedia } from "../middlewares/validateMedia";

const router = Router();

// Routes spécifiques pour les films
router.post("/", authMiddleware, requireAdmin, validateMedia, MediaController.createFilm);

export { router as filmsRouter };