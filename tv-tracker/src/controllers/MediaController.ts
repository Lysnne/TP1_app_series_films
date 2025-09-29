import { Request, Response } from "express";
import { StorageService } from "../services/StorageService";
import { Film } from "../models/Film";
import { Serie } from "../models/Serie";
import { Season } from "../models/Season";
import { Episode } from "../models/Episode";
import { logOperation, logError } from "../utils/logger";

export class MediaController {
    private static storage = StorageService.getInstance();

    static async getAllMedias(req: Request, res: Response): Promise<void> {
        try {
            const { type, genre, annee, year } = req.query;
            let medias = await MediaController.storage.listMedias();

            // Filtrage
            const normalize = (v: unknown) => String(v).toLowerCase();
            const inferType = (m: any): string => {
                if (m?.type) return normalize(m.type);
                if (Array.isArray(m?.saisons) || m?.statut) return "serie";
                return "film";
            };
            if (type) {
                medias = medias.filter(m => inferType(m) === normalize(type));
            }
            if (genre) {
                medias = medias.filter(m => (m as any).genre?.toLowerCase() === String(genre).toLowerCase());
            }
            const yearFilter = annee ?? year;
            if (yearFilter) {
                medias = medias.filter(m => (m as any).annee === Number(yearFilter));
            }

            logOperation("GET_MEDIAS", { count: medias.length, filters: req.query });
            res.json(medias);
        } catch (error) {
            logError(error as Error, { operation: "GET_MEDIAS" });
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    static async getMediaById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const media = await MediaController.storage.getMediaById(id);
            
            if (!media) {
                res.status(404).json({ error: "Média non trouvé" });
                return;
            }

            logOperation("GET_MEDIA_BY_ID", { id, titre: media.titre });
            res.json(media);
        } catch (error) {
            logError(error as Error, { operation: "GET_MEDIA_BY_ID", id: req.params.id });
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    static async createMedia(req: Request, res: Response): Promise<void> {
        try {
            const { titre, plateforme, duree, genre, annee, statut, type } = req.body;
            const userId = req.user?.id || "unknown";
            const id = Date.now().toString();
            
            let media;
            if (type === "film") {
                media = new Film(id, titre, plateforme, userId, duree, genre, annee);
                (media as any).type = "film";
            } else if (type === "serie") {
                media = new Serie(id, titre, plateforme, userId, statut);
                (media as any).type = "serie";
            } else {
                res.status(400).json({ error: "Type de média invalide" });
                return;
            }

            await MediaController.storage.addMedia(media);
            logOperation("CREATE_MEDIA", { id, titre, type, userId });
            res.status(201).json(media);
        } catch (error) {
            logError(error as Error, { operation: "CREATE_MEDIA" });
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    static async updateMedia(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updatedMedia = await MediaController.storage.updateMedia(id, req.body);
            
            if (!updatedMedia) {
                res.status(404).json({ error: "Média non trouvé" });
                return;
            }

            logOperation("UPDATE_MEDIA", { id, titre: updatedMedia.titre });
            res.json(updatedMedia);
        } catch (error) {
            logError(error as Error, { operation: "UPDATE_MEDIA", id: req.params.id });
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    static async deleteMedia(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const success = await MediaController.storage.deleteMedia(id);
            
            if (!success) {
                res.status(404).json({ error: "Média non trouvé" });
                return;
            }

            logOperation("DELETE_MEDIA", { id });
            res.status(204).send();
        } catch (error) {
            logError(error as Error, { operation: "DELETE_MEDIA", id: req.params.id });
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    // Routes spécifiques pour les films
    static async createFilm(req: Request, res: Response): Promise<void> {
        try {
            const { titre, plateforme, duree, genre, annee } = req.body;
            const userId = req.user?.id || "unknown";
            const id = Date.now().toString();
            
            const film = new Film(id, titre, plateforme, userId, duree, genre, annee);
            (film as any).type = "film";
            await MediaController.storage.addMedia(film);
            
            logOperation("CREATE_FILM", { id, titre, userId });
            res.status(201).json(film);
        } catch (error) {
            logError(error as Error, { operation: "CREATE_FILM" });
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    // Routes spécifiques pour les séries
    static async createSerie(req: Request, res: Response): Promise<void> {
        try {
            const { titre, plateforme, statut } = req.body;
            const userId = req.user?.id || "unknown";
            const id = Date.now().toString();
            
            const serie = new Serie(id, titre, plateforme, userId, statut);
            (serie as any).type = "serie";
            await MediaController.storage.addMedia(serie);
            
            logOperation("CREATE_SERIE", { id, titre, userId });
            res.status(201).json(serie);
        } catch (error) {
            logError(error as Error, { operation: "CREATE_SERIE" });
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    static async getSeriesEpisodes(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const media = await MediaController.storage.getMediaById(id);
            
            if (!media || !(media instanceof Serie)) {
                res.status(404).json({ error: "Série non trouvée" });
                return;
            }

            const allEpisodes = media.saisons.flatMap(saison => saison.episodes);
            logOperation("GET_SERIES_EPISODES", { serieId: id, episodeCount: allEpisodes.length });
            res.json(allEpisodes);
        } catch (error) {
            logError(error as Error, { operation: "GET_SERIES_EPISODES", id: req.params.id });
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    static async createSaison(req: Request, res: Response): Promise<void> {
        try {
            const { serieId, numero } = req.body;
            const media = await MediaController.storage.getMediaById(serieId);
            
            if (!media || !(media instanceof Serie)) {
                res.status(404).json({ error: "Série non trouvée" });
                return;
            }

            const saison = new Season(numero);
            media.addSaison(saison);
            await MediaController.storage.updateMedia(serieId, media);
            
            logOperation("CREATE_SAISON", { serieId, numero });
            res.status(201).json(saison);
        } catch (error) {
            logError(error as Error, { operation: "CREATE_SAISON" });
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    static async createEpisode(req: Request, res: Response): Promise<void> {
        try {
            const { serieId, saisonNumero, titre, numero, duree } = req.body;
            const media = await MediaController.storage.getMediaById(serieId);
            
            if (!media || !(media instanceof Serie)) {
                res.status(404).json({ error: "Série non trouvée" });
                return;
            }

            const saison = media.saisons.find(s => s.numero === saisonNumero);
            if (!saison) {
                res.status(404).json({ error: "Saison non trouvée" });
                return;
            }

            const episode = new Episode(Date.now().toString(), titre, numero, duree);
            saison.addEpisode(episode);
            await MediaController.storage.updateMedia(serieId, media);
            
            logOperation("CREATE_EPISODE", { serieId, saisonNumero, titre });
            res.status(201).json(episode);
        } catch (error) {
            logError(error as Error, { operation: "CREATE_EPISODE" });
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    static async markEpisodeAsWatched(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const medias = await MediaController.storage.listMedias();
            
            for (const media of medias) {
                if (media instanceof Serie) {
                    for (const saison of media.saisons) {
                        const episode = saison.episodes.find((ep: Episode) => ep.id === id);
                        if (episode) {
                            episode.watched = true;
                            await MediaController.storage.updateMedia(media.id, media);
                            
                            logOperation("MARK_EPISODE_WATCHED", { episodeId: id, titre: episode.titre });
                            res.json(episode);
                            return;
                        }
                    }
                }
            }
            
            res.status(404).json({ error: "Épisode non trouvé" });
        } catch (error) {
            logError(error as Error, { operation: "MARK_EPISODE_WATCHED", id: req.params.id });
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }
}