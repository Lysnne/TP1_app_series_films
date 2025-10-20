import { Request, Response, NextFunction } from "express";

export function validateMedia(req: Request, res: Response, next: NextFunction) {
    const { titre, plateforme, duree, statut, annee, type } = req.body;

    // Regex exactes selon la checklist
    const titreRegex = /^[A-Za-z0-9 ]+$/;
    const plateformeRegex = /^[A-Za-z]+$/;
    const statutValues = ["en_attente", "en_cours", "terminee"];

    // Validation titre
    if (!titre || !titreRegex.test(titre)) {
        return res.status(400).json({ error: "Titre invalide" });
    }

    // Validation plateforme
    if (!plateforme || !plateformeRegex.test(plateforme)) {
        return res.status(400).json({ error: "Plateforme invalide" });
    }

    // Validation durée (entier positif)
    if (type === "film" && (!duree || !Number.isInteger(duree) || duree <= 0)) {
        return res.status(400).json({ error: "Durée invalide" });
    }

    // Validation statut
    if (type === "serie" && (!statut || !statutValues.includes(statut))) {
        return res.status(400).json({ error: "Statut invalide" });
    }

    // Validation année <= année actuelle
    if (!annee || !Number.isInteger(annee) || annee > new Date().getFullYear()) {
        return res.status(400).json({ error: "Année invalide" });
    }

    next();
}