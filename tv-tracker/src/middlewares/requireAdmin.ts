import { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    // Debug : afficher tous les headers reçus
    console.log("Headers reçus:", req.headers);
    
    // Accepter plusieurs formats de headers
    const role = req.headers["x-role"] || 
                 req.headers["x_role"] || 
                 req.headers["authorization"] ||
                 req.headers["role"];
    
    console.log("Role détecté:", role);
    
    if (role !== "admin") return res.status(403).json({ error: "Accès réservé aux admins" });
    next();
}
