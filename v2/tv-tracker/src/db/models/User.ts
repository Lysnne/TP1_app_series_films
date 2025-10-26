import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  role: "user" | "admin";
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, match: emailRegex, index: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" }
}, { timestamps: true });

export const UserModel = model<IUser>("User", UserSchema, "users");
