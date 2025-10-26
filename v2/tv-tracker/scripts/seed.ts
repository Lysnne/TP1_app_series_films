import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import config from "config";

async function run() {
  const uri: string = config.get("db.uri");
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  // Minimal User schema for seeding
  const userSchema = new Schema(
    {
      email: { type: String, required: true, unique: true, index: true },
      username: { type: String, required: true },
      password: { type: String, required: true },
      role: { type: String, enum: ["user", "admin"], default: "user" },
    },
    { timestamps: true }
  );

  // Minimal Movie schema for seeding
  const movieSchema = new Schema(
    {
      title: { type: String, required: true, index: true },
      genres: { type: [String], default: [] },
      synopsis: { type: String },
      releaseDate: { type: Date },
      durationMin: { type: Number },
    },
    { timestamps: true }
  );

  const User = model("User", userSchema, "users");
  const Movie = model("Movie", movieSchema, "movies");

  // Clean existing basic seed data (optional)
  await User.deleteMany({ email: { $in: ["admin@example.com", "user@example.com"] } });
  await Movie.deleteMany({ title: { $in: ["Inception", "Interstellar"] } });

  const adminPassword = await bcrypt.hash("Str0ngP@ssw0rd!", 10);
  const userPassword = await bcrypt.hash("UserP@ssw0rd1!", 10);

  const [admin, user] = await User.create([
    { email: "admin@example.com", username: "admin", password: adminPassword, role: "admin" },
    { email: "user@example.com", username: "user1", password: userPassword, role: "user" },
  ]);

  const movies = await Movie.create([
    { title: "Inception", genres: ["Sci-Fi"], durationMin: 148, releaseDate: new Date("2010-07-16") },
    { title: "Interstellar", genres: ["Sci-Fi", "Adventure"], durationMin: 169, releaseDate: new Date("2014-11-07") },
  ]);

  console.log("Seed completed:");
  console.log({ adminId: admin._id.toString(), userId: user._id.toString(), movieIds: movies.map(m => m._id.toString()) });

  await mongoose.disconnect();
  console.log("Disconnected");
}

run().catch(async (err) => {
  console.error("Seed error:", err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
