import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import config from "config";
import mongoose from "mongoose";
import swaggerJsdoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import { connectDB } from "./src/db/connection";
import { authRouter } from "./src/routes/authRoutes";
import { moviesV2Router } from "./src/routes/moviesRoutesV2";
import { mediaRouter } from "./src/routes/mediaRoutes";
import { filmsRouter } from "./src/routes/filmsRoutes";
import { seriesRouter } from "./src/routes/seriesRoutes";
import { seriesV2Router } from "./src/routes/seriesRoutesV2";
import { ratingsV2Router } from "./src/routes/ratingsRoutesV2";
import { userRouter } from "./src/routes/userRoutes";
import { logsRouter } from "./src/routes/logsRoutes";
import { errorHandler } from "./src/middlewares/errorHandler";
import { logOperation } from "./src/utils/logger";

const app = express();
app.use(express.json());


const allowedOrigins: string[] = config.get("security.cors.origins");
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(helmet());

const rateWindow: number = config.get("security.rateLimit.windowMs");
const rateMax: number = config.get("security.rateLimit.max");
const limiter = rateLimit({ windowMs: rateWindow, max: rateMax });

app.use("/api/v2/auth/login", limiter);
app.use("/api/v2/ratings", limiter);

// Routes
app.use("/api/v1/medias", mediaRouter);
app.use("/api/v1/films", filmsRouter);
app.use("/api/v1/series", seriesRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/logs", logsRouter);

app.use("/api/v2/medias", mediaRouter);
app.use("/api/v2/movies", moviesV2Router);
app.use("/api/v2/series", seriesV2Router);
app.use("/api/v2/users", userRouter);
app.use("/api/v2/logs", logsRouter);
app.use("/api/v2/auth", authRouter);
app.use("/api/v2/ratings", ratingsV2Router);



// Configuration pour Swagger UI v1
const swaggerV1Path = path.resolve(path.join(__dirname, "..", "..", "docs", "swagger-v1.json"));
const swaggerV1Doc = require(swaggerV1Path);

app.use(
  '/docs/v1',
  swaggerUi.serveFiles(swaggerV1Doc, {}),
  swaggerUi.setup(swaggerV1Doc, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'TV Tracker API v1 - Documentation (Deprecated)'
  })
);
// DÉCLARATION D'ABORD 
const swaggerV2Path = path.resolve(path.join(__dirname,"..", "..","docs", "swagger-v2.json"));

const swaggerV2Doc = require(swaggerV2Path);

console.log("===> Swagger V2 path:", swaggerV2Path);
try {
  console.log("===> Swagger V2 loaded:", Object.keys(swaggerV2Doc));
} catch (e) {
  console.error("Erreur chargement Swagger:", e);
}


app.use(
  '/docs/v2',
  swaggerUi.serveFiles(swaggerV2Doc, {}),
  swaggerUi.setup(swaggerV2Doc, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'TV Tracker API v2 - Documentation'
  })
);



// Dev utility to validate DB write (local Mongo)
app.post("/api/v2/dev/ping", async (req, res) => {
  try {
    const result = await mongoose.connection.collection("pings").insertOne({ at: new Date() });
    res.status(201).json({ message: "ok", id: result.insertedId });
  } catch (e: any) {
    res.status(500).json({ message: "Erreur", code: 500, details: e?.message || "insert failed" });
  }
});

// Middleware d'erreur
app.use(errorHandler);

// Démarrage du serveur 
const PORT = (config.has("server.http.port") ? config.get<number>("server.http.port") : process.env.PORT) || 3000;
async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
      logOperation("SERVER_START", { port: PORT });
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
