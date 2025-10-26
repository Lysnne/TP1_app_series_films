import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "config";

export interface AuthUser {
  id: string;
  role: "user" | "admin";
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthUser;
    }
  }
}

export function jwtAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers["authorization"] || req.headers["Authorization"];
  if (!header || Array.isArray(header)) {
    return res.status(401).json({ message: "Authorization header manquant", code: 401 });
  }
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Token invalide", code: 401 });
  }
  try {
    const secret = config.get<string>("security.jwt.secret");
    const decoded = jwt.verify(token, secret) as JwtPayload;
    const sub = (decoded.sub as string) || "";
    const role = (decoded.role as AuthUser["role"]) || "user";
    if (!sub) return res.status(401).json({ message: "Token invalide", code: 401 });
    req.auth = { id: sub, role };
    next();
  } catch (e: any) {
    return res.status(401).json({ message: "Token invalide", code: 401, details: e?.message });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.auth) return res.status(401).json({ message: "Authentification requise", code: 401 });
  if (req.auth.role !== "admin") return res.status(403).json({ message: "Accès réservé aux admins", code: 403 });
  next();
}
