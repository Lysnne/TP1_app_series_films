import { Router } from "express";
import { LogsController } from "../controllers/LogsController";

const router = Router();

router.get("/", LogsController.getLastLog);

export { router as logsRouter };