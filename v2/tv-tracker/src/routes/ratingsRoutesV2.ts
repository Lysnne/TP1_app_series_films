import { Router, Request, Response } from "express";
import { Types } from "mongoose";
import { RatingModel } from "../db/models/Rating";
import { jwtAuth } from "../middlewares/jwt";

export const ratingsV2Router = Router();

// POST /api/v2/ratings (JWT)
ratingsV2Router.post("/", jwtAuth, async (req: Request, res: Response) => {
  try {
    const { target, targetId, score, review } = req.body || {};
    if (!target || !["movie", "episode"].includes(target)) {
      return res.status(400).json({ message: "target invalide", code: 400 });
    }
    if (!targetId || !Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ message: "targetId invalide", code: 400 });
    }
    if (typeof score !== "number" || score < 0 || score > 10) {
      return res.status(400).json({ message: "score invalide (0-10)", code: 400 });
    }
    const doc = await RatingModel.create({
      userId: new Types.ObjectId(req.auth!.id),
      target,
      targetId: new Types.ObjectId(targetId),
      score,
      review
    });
    return res.status(201).json(doc);
  } catch (e: any) {
    if (e?.code === 11000) return res.status(422).json({ message: "Déjà noté par cet utilisateur", code: 422 });
    if (e?.name === "ValidationError") return res.status(422).json({ message: "Validation", code: 422, details: e?.message });
    return res.status(500).json({ message: "Erreur", code: 500, details: e?.message });
  }
});

// GET /api/v2/ratings/avg/movie/:movieId
ratingsV2Router.get("/avg/movie/:movieId", async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;
    if (!Types.ObjectId.isValid(movieId)) return res.status(400).json({ message: "movieId invalide", code: 400 });
    const [result] = await RatingModel.aggregate([
      { $match: { target: "movie", targetId: new Types.ObjectId(movieId) } },
      { $group: { _id: "$targetId", avg: { $avg: "$score" }, count: { $sum: 1 } } }
    ]);
    return res.json({ movieId, average: result?.avg ?? null, count: result?.count ?? 0 });
  } catch (e: any) {
    return res.status(500).json({ message: "Erreur", code: 500, details: e?.message });
  }
});

// GET /api/v2/ratings/avg/series/:seriesId
ratingsV2Router.get("/avg/series/:seriesId", async (req: Request, res: Response) => {
  try {
    const { seriesId } = req.params;
    if (!Types.ObjectId.isValid(seriesId)) return res.status(400).json({ message: "seriesId invalide", code: 400 });
    const [result] = await RatingModel.aggregate([
      { $match: { target: "episode" } },
      { $lookup: { from: "episodes", localField: "targetId", foreignField: "._id", as: "ep" } }
    ]);
    // The previous pipeline has a mistake in foreignField; fix full pipeline properly below
  } catch (e: any) {
    return res.status(500).json({ message: "Erreur", code: 500, details: e?.message });
  }
});

// Proper pipeline (keeping logic outside try for readability)
ratingsV2Router.get("/avg/series/:seriesId", async (req: Request, res: Response) => {
  try {
    const { seriesId } = req.params;
    if (!Types.ObjectId.isValid(seriesId)) return res.status(400).json({ message: "seriesId invalide", code: 400 });
    const sid = new Types.ObjectId(seriesId);
    const [result] = await RatingModel.aggregate([
      { $match: { target: "episode" } },
      { $lookup: { from: "episodes", localField: "targetId", foreignField: "_id", as: "ep" } },
      { $unwind: "$ep" },
      { $match: { "ep.seriesId": sid } },
      { $group: { _id: "$ep.seriesId", avg: { $avg: "$score" }, count: { $sum: 1 } } }
    ]);
    return res.json({ seriesId, average: result?.avg ?? null, count: result?.count ?? 0 });
  } catch (e: any) {
    return res.status(500).json({ message: "Erreur", code: 500, details: e?.message });
  }
});
