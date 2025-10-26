import { Schema, model, Document, Types } from "mongoose";

export type RatingTarget = "movie" | "episode";

export interface IRating extends Document {
  userId: Types.ObjectId;
  target: RatingTarget;
  targetId: Types.ObjectId;
  score: number; // 0-10
  review?: string; // max 2000
}

const RatingSchema = new Schema<IRating>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  target: { type: String, enum: ["movie", "episode"], required: true, index: true },
  targetId: { type: Schema.Types.ObjectId, required: true, index: true },
  score: { type: Number, required: true, min: 0, max: 10 },
  review: { type: String, maxlength: 2000 }
}, { timestamps: true });

RatingSchema.index({ targetId: 1 });
RatingSchema.index({ userId: 1, target: 1, targetId: 1 }, { unique: true }); // one rating per user per target

export const RatingModel = model<IRating>("Rating", RatingSchema, "ratings");
