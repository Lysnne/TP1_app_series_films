import { Schema, model, Document } from "mongoose";

export interface IMovie extends Document {
  title: string;
  genres: string[];
  synopsis?: string;
  releaseDate?: Date;
  durationMin?: number;
}

const MovieSchema = new Schema<IMovie>({
  title: { type: String, required: true, minlength: 1, maxlength: 200, index: true },
  genres: { type: [String], default: [], validate: [(arr: string[]) => arr.length <= 30, "Too many genres"] },
  synopsis: { type: String },
  releaseDate: { type: Date },
  durationMin: { type: Number, min: 1, max: 600 }
}, { timestamps: true });

MovieSchema.index({ title: 1 });
MovieSchema.index({ genres: 1 });

export const MovieModel = model<IMovie>("Movie", MovieSchema, "movies");
