import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import { SeriesModel } from "../db/models/Series";
import { SeasonModel } from "../db/models/Season";
import { EpisodeModel } from "../db/models/Episode";
import { jwtAuth, requireAdmin } from "../middlewares/jwt";

function toObjectId(id: string) {
  return new Types.ObjectId(id);
}

export const seriesV2Router = Router();

// GET /api/v2/series?title=&genre=&status=
seriesV2Router.get("/", async (req: Request, res: Response) => {
  try {
    const { title, genre, status } = req.query as Record<string, string | undefined>;
    const filter: any = {};
    if (title) filter.title = { $regex: title, $options: "i" };
    if (genre) filter.genres = genre;
    if (status) filter.status = status;

    const items = await SeriesModel.find(filter).sort({ createdAt: -1 });
    return res.json(items);
  } catch (e: any) {
    return res.status(500).json({ message: "Erreur", code: 500, details: e?.message });
  }
});

// POST /api/v2/series (admin)
seriesV2Router.post("/", jwtAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { title, genres, status } = req.body || {};
    if (!title || !status) return res.status(400).json({ message: "Données manquantes", code: 400 });
    const doc = await SeriesModel.create({ title, genres, status });
    return res.status(201).json(doc);
  } catch (e: any) {
    if (e?.name === "ValidationError") return res.status(422).json({ message: "Validation", code: 422, details: e?.message });
    return res.status(500).json({ message: "Erreur", code: 500, details: e?.message });
  }
});

// POST /api/v2/series/:seriesId/seasons (admin)
seriesV2Router.post("/:seriesId/seasons", jwtAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { seasonNo } = req.body || {};
    if (!seasonNo || seasonNo < 1) return res.status(400).json({ message: "seasonNo invalide", code: 400 });
    const seriesId = req.params.seriesId;
    const exists = await SeriesModel.findById(seriesId);
    if (!exists) return res.status(404).json({ message: "Série non trouvée", code: 404 });
    const doc = await SeasonModel.create({ seriesId: toObjectId(seriesId), seasonNo });
    return res.status(201).json(doc);
  } catch (e: any) {
    if (e?.code === 11000) return res.status(422).json({ message: "Saison déjà existante", code: 422 });
    if (e?.name === "ValidationError") return res.status(422).json({ message: "Validation", code: 422, details: e?.message });
    return res.status(500).json({ message: "Erreur", code: 500, details: e?.message });
  }
});

// POST /api/v2/series/:seriesId/seasons/:seasonId/episodes (admin)
seriesV2Router.post("/:seriesId/seasons/:seasonId/episodes", jwtAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { epNo, title, durationMin } = req.body || {};
    if (!epNo || epNo < 1 || !title || !durationMin) return res.status(400).json({ message: "Données manquantes", code: 400 });
    const { seriesId, seasonId } = req.params;
    const season = await SeasonModel.findOne({ _id: seasonId, seriesId });
    if (!season) return res.status(404).json({ message: "Saison non trouvée", code: 404 });
    const doc = await EpisodeModel.create({ seriesId: toObjectId(seriesId), seasonId: toObjectId(seasonId), epNo, title, durationMin });
    return res.status(201).json(doc);
  } catch (e: any) {
    if (e?.code === 11000) return res.status(422).json({ message: "Épisode déjà existant", code: 422 });
    if (e?.name === "ValidationError") return res.status(422).json({ message: "Validation", code: 422, details: e?.message });
    return res.status(500).json({ message: "Erreur", code: 500, details: e?.message });
  }
});

// GET /api/v2/series/:seriesId/seasons/:seasonId/episodes?minDuration=
seriesV2Router.get("/:seriesId/seasons/:seasonId/episodes", async (req: Request, res: Response) => {
  try {
    const { seriesId, seasonId } = req.params;
    const minDuration = req.query.minDuration ? parseInt(String(req.query.minDuration), 10) : undefined;
    const filter: any = { seriesId, seasonId };
    if (Number.isFinite(minDuration)) filter.durationMin = { $gte: minDuration };
    const items = await EpisodeModel.find(filter).sort({ epNo: 1 });
    return res.json(items);
  } catch (e: any) {
    return res.status(500).json({ message: "Erreur", code: 500, details: e?.message });
  }
});
