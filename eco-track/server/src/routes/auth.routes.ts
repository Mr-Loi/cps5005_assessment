import { Router } from "express";
import bcrypt from "bcrypt";
import { UserModel } from "../models/User";
import { signToken } from "../utils/jwt";
import { requireAuth, AuthRequest } from "../middleware/auth";

export const authRouter = Router();

// POST /api/auth/register
authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const existing = await UserModel.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ name, email, passwordHash });

  const token = signToken({ userId: user._id.toString() });
  return res.status(201).json({ token });
});

// POST /api/auth/login
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({ userId: user._id.toString() });
  return res.json({ token });
});

// GET /api/auth/me
authRouter.get("/me", requireAuth, async (req: AuthRequest, res) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

  const user = await UserModel.findById(req.userId).select("name email tariffPerKwh dailyGoalKwh");
  if (!user) return res.status(404).json({ message: "User not found" });

  return res.json(user);
});

