import { Request, Response } from "express";
import { StorageService } from "../services/StorageService";
import { logOperation, logError } from "../utils/logger";

export class UserController {
    private static storage = StorageService.getInstance();

    static async getUserMedias(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const medias = await UserController.storage.getMediasByUserId(id);
            
            logOperation("GET_USER_MEDIAS", { userId: id, count: medias.length });
            res.json(medias);
        } catch (error) {
            logError(error as Error, { operation: "GET_USER_MEDIAS", userId: req.params.id });
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }
}