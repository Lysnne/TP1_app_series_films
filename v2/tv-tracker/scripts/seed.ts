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

  // Minimal Series/Season/Episode/Rating schemas for seeding (no explicit indexes to avoid duplicate warnings)
  const seriesSchema = new Schema(
    {
      title: { type: String, required: true },
      genres: { type: [String], default: [] },
      status: { type: String, enum: ["ongoing", "ended"], required: true },
    },
    { timestamps: true }
  );

  const seasonSchema = new Schema(
    {
      seriesId: { type: Schema.Types.ObjectId, ref: "Series", required: true },
      seasonNo: { type: Number, required: true, min: 1 },
    },
    { timestamps: true }
  );

  const episodeSchema = new Schema(
    {
      seriesId: { type: Schema.Types.ObjectId, ref: "Series", required: true },
      seasonId: { type: Schema.Types.ObjectId, ref: "Season", required: true },
      epNo: { type: Number, required: true, min: 1 },
      title: { type: String, required: true },
      durationMin: { type: Number, required: true, min: 1 },
    },
    { timestamps: true }
  );

  const ratingSchema = new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      target: { type: String, enum: ["movie", "episode"], required: true },
      targetId: { type: Schema.Types.ObjectId, required: true },
      score: { type: Number, required: true, min: 0, max: 10 },
      review: { type: String, maxlength: 2000 },
    },
    { timestamps: true }
  );

  const User = model("User", userSchema, "users");
  const Movie = model("Movie", movieSchema, "movies");
  const Series = model("Series", seriesSchema, "series");
  const Season = model("Season", seasonSchema, "seasons");
  const Episode = model("Episode", episodeSchema, "episodes");
  const Rating = model("Rating", ratingSchema, "ratings");

  // Clean existing basic seed data (optional)
  await User.deleteMany({ email: { $in: ["admin@example.com", "user@example.com"] } });
  await Movie.deleteMany({ title: { $in: ["Inception", "Interstellar"] } });
  await Series.deleteMany({ title: { $in: ["The Expanse"] } });
  await Season.deleteMany({});
  await Episode.deleteMany({});
  await Rating.deleteMany({});

  const adminPassword = await bcrypt.hash("Str0ngP@ssw0rd!", 10);
  const userPassword = await bcrypt.hash("UserP@ssw0rd1!", 10);

  const [admin, user] = await User.create([
    { email: "admin@example.com", username: "admin", password: adminPassword, role: "admin" },
    { email: "user@example.com", username: "user1", password: userPassword, role: "user" },
  ]);

  const movies = await Movie.create([
    { title: "Inception2", genres: ["Sci-Fi"], durationMin: 148, releaseDate: new Date("2010-07-16") },
    { title: "Interstellar2", genres: ["Sci-Fi", "Adventure"], durationMin: 169, releaseDate: new Date("2014-11-07") },
  ]);

  // Series, Seasons, Episodes
  const series = await Series.create({ title: "The Expanse2", genres: ["Sci-Fi", "Drama"], status: "ended" });

  const seasons = await Season.create([
    { seriesId: series._id, seasonNo: 1 },
    { seriesId: series._id, seasonNo: 2 },
  ]);

  const epsS1 = await Episode.create([
    { seriesId: series._id, seasonId: seasons[0]._id, epNo: 1, title: "Dulcinea", durationMin: 45 },
    { seriesId: series._id, seasonId: seasons[0]._id, epNo: 2, title: "The Big Empty", durationMin: 44 },
    { seriesId: series._id, seasonId: seasons[0]._id, epNo: 3, title: "Remember the Cant", durationMin: 44 },
  ]);

  const epsS2 = await Episode.create([
    { seriesId: series._id, seasonId: seasons[1]._id, epNo: 1, title: "Safe", durationMin: 43 },
    { seriesId: series._id, seasonId: seasons[1]._id, epNo: 2, title: "Doors & Corners", durationMin: 44 },
  ]);

  // Ratings (movie and episode)
  const ratings = await Rating.create([
    { userId: user._id, target: "movie", targetId: movies[0]._id, score: 8, review: "Great visuals" },
    { userId: admin._id, target: "movie", targetId: movies[1]._id, score: 9, review: "Epic space adventure" },
    { userId: user._id, target: "episode", targetId: epsS1[0]._id, score: 7, review: "Good pilot" },
  ]);

  console.log("Seed completed:");
  console.log({
    adminId: admin._id.toString(),
    userId: user._id.toString(),
    movieIds: movies.map(m => m._id.toString()),
    seriesId: series._id.toString(),
    seasonIds: seasons.map(s => s._id.toString()),
    episodeIds: [...epsS1, ...epsS2].map(e => e._id.toString()),
    ratingIds: ratings.map(r => r._id.toString()),
  });

  await mongoose.disconnect();
  console.log("Disconnected");
}

run().catch(async (err) => {
  console.error("Seed error:", err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
