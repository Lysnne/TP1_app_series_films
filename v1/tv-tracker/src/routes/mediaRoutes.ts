import { Router } from "express";
import { MediaController } from "../controllers/MediaController";
import { authMiddleware, requireAdmin } from "../middlewares/auth";
import { validateMedia } from "../middlewares/validateMedia";

const router = Router();

// Routes principales pour les médias
router.get("/", MediaController.getAllMedias);
router.get("/:id", MediaController.getMediaById);
router.post("/", authMiddleware, requireAdmin, validateMedia, MediaController.createMedia);
router.put("/:id", authMiddleware, requireAdmin, validateMedia, MediaController.updateMedia);
router.delete("/:id", authMiddleware, requireAdmin, MediaController.deleteMedia);

export { router as mediaRouter };