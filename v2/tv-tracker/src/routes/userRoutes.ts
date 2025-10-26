import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();

router.get("/:id/medias", UserController.getUserMedias);

export { router as userRouter };