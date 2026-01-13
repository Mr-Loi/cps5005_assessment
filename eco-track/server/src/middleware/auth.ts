import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  // bearer token auth
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  // extract token
  const token = header.slice("Bearer ".length).trim();
  if (!token) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  // secret exists
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not set");
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    const decoded = jwt.verify(token, secret) as any;

    if (!decoded || typeof decoded.userId !== "string") {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // checks id
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
