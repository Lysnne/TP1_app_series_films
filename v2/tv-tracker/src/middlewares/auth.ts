import { Request, Response, NextFunction } from "express";
import { StorageService } from "../services/StorageService";
import { User } from "../models/User";

// Étendre l'interface Request pour inclure user
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers["x-user-id"] as string;
    
    if (!userId) {
        return res.status(401).json({ error: "Header x-user-id requis" });
    }

    try {
        const storage = StorageService.getInstance();
        const user = await storage.getUserById(userId);
        
        if (!user) {
            return res.status(401).json({ error: "Utilisateur non trouvé" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ error: "Erreur d'authentification" });
    }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({ error: "Authentification requise" });
    }

    if (!req.user.isAdmin()) {
        return res.status(403).json({ error: "Accès réservé aux admins" });
    }

    next();
}
