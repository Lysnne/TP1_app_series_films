import { Request, Response } from "express";
import { Serie } from "../models/Serie";
import { Episode } from "../models/Episode";
import { Season } from "../models/Season";
import { medias, saveDB } from "../services/dbService";
import { logger } from "../utils/logger";

export class SeriesController {
    
    /**
     * GET /api/series/:id/episodes - Liste des épisodes d'une série spécifique
     */
    static async getSeriesEpisodes(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const serie = medias.find(m => m.id === id && m instanceof Serie) as Serie;
            
            if (!serie) {
                logger.warn(`Série avec l'ID ${id} non trouvée`);
                res.status(404).json({ error: "Série non trouvée" });
                return;
            }

            // Récupérer tous les épisodes de toutes les saisons
            const allEpisodes = serie.saisons.flatMap(season => season.episodes);
            
            logger.info(`Récupération de ${allEpisodes.length} épisodes pour la série: ${serie.titre}`);
            res.json(allEpisodes);
        } catch (error) {
            logger.error(`Erreur lors de la récupération des épisodes de la série ${req.params.id}: ${error}`);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    /**
     * POST /api/series/:id/seasons - Ajouter une saison à une série
     */
    static async addSeasonToSeries(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { seasonNumber, releaseDate, episodes = [] } = req.body;
            
            const serie = medias.find(m => m.id === id && m instanceof Serie) as Serie;
            
            if (!serie) {
                logger.warn(`Série avec l'ID ${id} non trouvée pour ajout de saison`);
                res.status(404).json({ error: "Série non trouvée" });
                return;
            }

            // Créer les épisodes à partir des données fournies
            const seasonEpisodes = episodes.map((ep: any) => 
                new Episode(ep.id || Date.now().toString(), ep.title, ep.duration, ep.episodeNumber, ep.watched || false)
            );

            // Créer la nouvelle saison
            const newSeason = new Season(seasonNumber, seasonEpisodes);
            
            // Ajouter la saison à la série
            serie.addSaison(newSeason);
            saveDB();
            
            logger.info(`Saison ${seasonNumber} ajoutée à la série: ${serie.titre}`);
            res.status(201).json(newSeason);
        } catch (error) {
            logger.error(`Erreur lors de l'ajout de saison à la série ${req.params.id}: ${error}`);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    /**
     * POST /api/series/:id/seasons/:seasonNumber/episodes - Ajouter un épisode à une saison
     */
    static async addEpisodeToSeason(req: Request, res: Response): Promise<void> {
        try {
            const { id, seasonNumber } = req.params;
            const { title, duration, episodeNumber, watched = false } = req.body;
            
            const serie = medias.find(m => m.id === id && m instanceof Serie) as Serie;
            
            if (!serie) {
                logger.warn(`Série avec l'ID ${id} non trouvée pour ajout d'épisode`);
                res.status(404).json({ error: "Série non trouvée" });
                return;
            }

            const season = serie.saisons.find(s => s.numero === Number(seasonNumber));
            
            if (!season) {
                logger.warn(`Saison ${seasonNumber} non trouvée dans la série: ${serie.titre}`);
                res.status(404).json({ error: "Saison non trouvée" });
                return;
            }

            // Créer le nouvel épisode
            const newEpisode = new Episode(
                Date.now().toString(),
                title,
                duration,
                episodeNumber,
                watched
            );

            // Ajouter l'épisode à la saison
            season.addEpisode(newEpisode);
            saveDB();
            
            logger.info(`Épisode ${episodeNumber} ajouté à la saison ${seasonNumber} de la série: ${serie.titre}`);
            res.status(201).json(newEpisode);
        } catch (error) {
            logger.error(`Erreur lors de l'ajout d'épisode à la série ${req.params.id}: ${error}`);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    /**
     * PATCH /api/episodes/:id - Marquer un épisode comme vu
     */
    static async markEpisodeAsWatched(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            let found = false;
            
            // Parcourir toutes les séries pour trouver l'épisode
            for (const media of medias) {
                if (media instanceof Serie) {
                    for (const season of media.saisons) {
                        const episode = season.episodes.find(ep => ep.id === id);
                        if (episode) {
                            episode.watched = true;
                            found = true;
                            saveDB();
                            
                            logger.info(`Épisode marqué comme vu: ${episode.titre} (ID: ${id})`);
                            res.json(episode);
                            return;
                        }
                    }
                }
            }
            
            if (!found) {
                logger.warn(`Épisode avec l'ID ${id} non trouvé`);
                res.status(404).json({ error: "Épisode non trouvé" });
            }
        } catch (error) {
            logger.error(`Erreur lors du marquage de l'épisode ${req.params.id} comme vu: ${error}`);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    /**
     * GET /api/series/:id/seasons - Récupérer toutes les saisons d'une série
     */
    static async getSeriesSeasons(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const serie = medias.find(m => m.id === id && m instanceof Serie) as Serie;
            
            if (!serie) {
                logger.warn(`Série avec l'ID ${id} non trouvée`);
                res.status(404).json({ error: "Série non trouvée" });
                return;
            }

            logger.info(`Récupération de ${serie.saisons.length} saisons pour la série: ${serie.titre}`);
            res.json(serie.saisons);
        } catch (error) {
            logger.error(`Erreur lors de la récupération des saisons de la série ${req.params.id}: ${error}`);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }

    /**
     * GET /api/series/:id/stats - Récupérer les statistiques d'une série
     */
    static async getSeriesStats(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const serie = medias.find(m => m.id === id && m instanceof Serie) as Serie;
            
            if (!serie) {
                logger.warn(`Série avec l'ID ${id} non trouvée pour statistiques`);
                res.status(404).json({ error: "Série non trouvée" });
                return;
            }

            const totalEpisodes = serie.saisons.reduce((sum, season) => sum + season.episodes.length, 0);
            const watchedEpisodes = serie.saisons.reduce((sum, season) => sum + season.episodes.filter(ep => ep.watched).length, 0);
            const totalSeasons = serie.saisons.length;
            
            
            const stats = {
                title: serie.titre,
                status: serie.statut,
                totalSeasons,
                totalEpisodes,
                watchedEpisodes,
                watchedPercentage: totalEpisodes > 0 ? Math.round((watchedEpisodes / totalEpisodes) * 100) : 0,
                seasons: serie.saisons.map(season => ({
                    seasonNumber: season.numero,
                    totalEpisodes: season.episodes.length,
                    watchedEpisodes: season.episodes.filter(ep => ep.watched).length,
                    watchedPercentage: season.episodes.length > 0 ? 
                        Math.round((season.episodes.filter(ep => ep.watched).length / season.episodes.length) * 100) : 0
                }))
            };

            logger.info(`Statistiques récupérées pour la série: ${serie.titre}`);
            res.json(stats);
        } catch (error) {
            logger.error(`Erreur lors de la récupération des statistiques de la série ${req.params.id}: ${error}`);
            res.status(500).json({ error: "Erreur interne du serveur" });
        }
    }
}
