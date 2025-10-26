import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

// Middleware de gestion d'erreurs global
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(`${err.message} - ${req.method} ${req.originalUrl}`);
  res.status(500).json({
    error: "Erreur interne du serveur",
    message: err.message,
  });
}

