import { Router, Request, Response } from "express";
import { MovieModel } from "../db/models/Movie";
import { jwtAuth, requireAdmin } from "../middlewares/jwt";

function parseIntOrUndefined(v: any): number | undefined {
  const n = parseInt(String(v), 10);
  return Number.isFinite(n) ? n : undefined;
}

export const moviesV2Router = Router();

// GET /api/v2/movies?title=&genre=&minYear=&maxDur=&page=&limit=
moviesV2Router.get("/", async (req: Request, res: Response) => {
  try {
    const { title, genre, minYear, maxDur } = req.query as Record<string, string | undefined>;
    const page = parseIntOrUndefined(req.query.page);
    const limit = parseIntOrUndefined(req.query.limit) ?? 10;
    const skip = ((page ?? 1) - 1) * limit;

    const filter: any = {};
    if (title) filter.title = { $regex: title, $options: "i" };
    if (genre) filter.genres = genre;
    if (minYear) {
      const yearNum = parseInt(minYear, 10);
      if (Number.isFinite(yearNum)) {
        filter.releaseDate = { ...(filter.releaseDate || {}), $gte: new Date(`${yearNum}-01-01T00:00:00.000Z`) };
      }
    }
    if (maxDur) {
      const d = parseInt(maxDur, 10);
      if (Number.isFinite(d)) filter.durationMin = { $lte: d };
    }

    const [items, total] = await Promise.all([
      MovieModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      MovieModel.countDocuments(filter),
    ]);

    return res.json({ page: page ?? 1, limit, total, items });
  } catch (e: any) {
    return res.status(500).json({ message: "Erreur", code: 500, details: e?.message });
  }
});

// POST /api/v2/movies (admin)
moviesV2Router.post("/", jwtAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { title, genres, synopsis, releaseDate, durationMin } = req.body || {};
    if (!title) return res.status(400).json({ message: "Titre manquant", code: 400 });
    const doc = await MovieModel.create({ title, genres, synopsis, releaseDate, durationMin });
    return res.status(201).json(doc);
  } catch (e: any) {
    if (e?.name === "ValidationError") return res.status(422).json({ message: "Validation", code: 422, details: e?.message });
    return res.status(500).json({ message: "Erreur", code: 500, details: e?.message });
  }
});

// GET /api/v2/movies/:id
moviesV2Router.get("/:id", async (req: Request, res: Response) => {
  try {
    const movie = await MovieModel.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Non trouvé", code: 404 });
    return res.json(movie);
  } catch (e: any) {
    return res.status(500).json({ message: "Erreur", code: 500, details: e?.message });
  }
});

// PATCH /api/v2/movies/:id (admin)
moviesV2Router.patch("/:id", jwtAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const update: any = {};
    const fields = ["title", "genres", "synopsis", "releaseDate", "durationMin"] as const;
    for (const f of fields) if (f in req.body) (update as any)[f] = (req.body as any)[f];
    const movie = await MovieModel.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!movie) return res.status(404).json({ message: "Non trouvé", code: 404 });
    return res.json(movie);
  } catch (e: any) {
    if (e?.name === "ValidationError") return res.status(422).json({ message: "Validation", code: 422, details: e?.message });
    return res.status(500).json({ message: "Erreur", code: 500, details: e?.message });
  }
});

// DELETE /api/v2/movies/:id (admin)
moviesV2Router.delete("/:id", jwtAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const r = await MovieModel.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ message: "Non trouvé", code: 404 });
    return res.status(204).send();
  } catch (e: any) {
    return res.status(500).json({ message: "Erreur", code: 500, details: e?.message });
  }
});
