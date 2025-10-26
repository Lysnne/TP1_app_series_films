import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import config from "config";
import { UserModel } from "../db/models/User";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, username, password, role } = req.body || {};
    if (!email || !username || !password) {
      return res.status(400).json({ message: "Données manquantes", code: 400 });
    }
    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(422).json({ message: "Email déjà utilisé", code: 422 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ email, username, password: hashed, role: role === "admin" ? "admin" : "user" });

    const secret: Secret = config.get("security.jwt.secret");
    const expiresIn = config.get("security.jwt.expiresIn") as unknown as SignOptions["expiresIn"];
    const signOpts: SignOptions = { expiresIn };
    const token = jwt.sign({ sub: user.id, role: user.role }, secret, signOpts);

    return res.status(201).json({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      token
    });
  } catch (e: any) {
    return res.status(500).json({ message: "Erreur", code: 500, details: e?.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Données manquantes", code: 400 });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides", code: 401 });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Identifiants invalides", code: 401 });
    }
    const secret: Secret = config.get("security.jwt.secret");
    const expiresIn = config.get("security.jwt.expiresIn") as unknown as SignOptions["expiresIn"];
    const signOpts: SignOptions = { expiresIn };
    const token = jwt.sign({ sub: user.id, role: user.role }, secret, signOpts);
    return res.json({ token });
  } catch (e: any) {
    return res.status(500).json({ message: "Erreur", code: 500, details: e?.message });
  }
});

export { router as authRouter };
