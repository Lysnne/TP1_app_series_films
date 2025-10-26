import { Schema, model, Document, Types } from "mongoose";

export interface IEpisode extends Document {
  seriesId: Types.ObjectId;
  seasonId: Types.ObjectId;
  epNo: number;
  title: string;
  durationMin: number;
}

const EpisodeSchema = new Schema<IEpisode>({
  seriesId: { type: Schema.Types.ObjectId, ref: "Series", required: true, index: true },
  seasonId: { type: Schema.Types.ObjectId, ref: "Season", required: true, index: true },
  epNo: { type: Number, required: true, min: 1 },
  title: { type: String, required: true },
  durationMin: { type: Number, required: true, min: 1, max: 300 }
}, { timestamps: true });

EpisodeSchema.index({ seriesId: 1, seasonId: 1, epNo: 1 }, { unique: true });
EpisodeSchema.index({ seriesId: 1 });
EpisodeSchema.index({ seasonId: 1 });

export const EpisodeModel = model<IEpisode>("Episode", EpisodeSchema, "episodes");
