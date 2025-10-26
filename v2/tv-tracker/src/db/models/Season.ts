import { Schema, model, Document, Types } from "mongoose";

export interface ISeason extends Document {
  seriesId: Types.ObjectId;
  seasonNo: number;
}

const SeasonSchema = new Schema<ISeason>({
  seriesId: { type: Schema.Types.ObjectId, ref: "Series", required: true, index: true },
  seasonNo: { type: Number, required: true, min: 1, index: true }
}, { timestamps: true });

SeasonSchema.index({ seriesId: 1, seasonNo: 1 }, { unique: true });

export const SeasonModel = model<ISeason>("Season", SeasonSchema, "seasons");
