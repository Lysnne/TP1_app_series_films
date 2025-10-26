import { Schema, model, Document, Types } from "mongoose";

export interface ISeries extends Document {
  title: string;
  genres: string[];
  status: "ongoing" | "ended";
}

const SeriesSchema = new Schema<ISeries>({
  title: { type: String, required: true, minlength: 1, maxlength: 200, index: true },
  genres: { type: [String], default: [], validate: [(arr: string[]) => arr.length <= 30, "Too many genres"] },
  status: { type: String, enum: ["ongoing", "ended"], required: true }
}, { timestamps: true });

SeriesSchema.index({ title: 1 });
SeriesSchema.index({ genres: 1 });

export const SeriesModel = model<ISeries>("Series", SeriesSchema, "series");
