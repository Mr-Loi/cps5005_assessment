import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  // 1) Must have "Authorization: Bearer <token>"
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  // 2) Extract token safely
  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  // 3) Read secret safely
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not set in .env");
    return res.status(500).json({ message: "Server configuration error" });
  }

  // 4) Verify token
  try {
    const decoded = jwt.verify(token, secret) as any;

    if (!decoded || typeof decoded.userId !== "string") {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.userId = decoded.userId;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
