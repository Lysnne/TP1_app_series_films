import mongoose from "mongoose";
import config from "config";

export async function connectDB(): Promise<void> {
  const uri: string = config.get("db.uri");
  await mongoose.connect(uri);
  // Basic console log to confirm; main logs use winston elsewhere
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
}
