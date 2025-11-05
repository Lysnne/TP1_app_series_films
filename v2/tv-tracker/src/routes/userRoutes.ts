import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { jwtAuth, requireAdmin } from "../middlewares/jwt";

const router = Router();

router.get("/me", jwtAuth, UserController.getMe);
router.patch("/me", jwtAuth, UserController.updateMe);
router.get("/:id", jwtAuth, requireAdmin, UserController.getById);
router.get("/:id/medias", UserController.getUserMedias);

export { router as userRouter };