import { Request, Response } from "express";
import { StorageService } from "../services/StorageService";
import { logOperation, logError } from "../utils/logger";
import { UserModel } from "../db/models/User";

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

    static async getMe(req: Request, res: Response): Promise<void> {
        try {
            if (!req.auth) {
                res.status(401).json({ error: "Authentification requise" });
                return;
            }
            const user = await UserModel.findById(req.auth.id).select("_id email username role");
            if (!user) {
                res.status(404).json({ error: "Utilisateur non trouvé" });
                return;
            }
            logOperation("GET_ME", { userId: req.auth.id });
            res.json({ id: user.id, email: user.email, username: user.username, role: user.role });
        } catch (error) {
            logError(error as Error, { operation: "GET_ME" });
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    static async getById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const user = await UserModel.findById(id).select("_id email username role");
            if (!user) {
                res.status(404).json({ error: "Utilisateur non trouvé" });
                return;
            }
            logOperation("GET_USER_BY_ID", { userId: id });
            res.json({ id: user.id, email: user.email, username: user.username, role: user.role });
        } catch (error) {
            logError(error as Error, { operation: "GET_USER_BY_ID", userId: req.params.id });
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    static async updateMe(req: Request, res: Response): Promise<void> {
        try {
            if (!req.auth) {
                res.status(401).json({ error: "Authentification requise" });
                return;
            }
            const { email, username } = req.body || {};
            if (!email && !username) {
                res.status(400).json({ error: "Aucun champ à mettre à jour" });
                return;
            }
            const updates: any = {};
            if (email) updates.email = email;
            if (username) updates.username = username;

            const user = await UserModel.findByIdAndUpdate(
                req.auth.id,
                { $set: updates },
                { new: true, runValidators: true, context: "query" }
            ).select("_id email username role");

            if (!user) {
                res.status(404).json({ error: "Utilisateur non trouvé" });
                return;
            }
            logOperation("PATCH_ME", { userId: req.auth.id, fields: Object.keys(updates) });
            res.json({ id: user.id, email: user.email, username: user.username, role: user.role });
        } catch (error) {
            logError(error as Error, { operation: "PATCH_ME" });
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }
}