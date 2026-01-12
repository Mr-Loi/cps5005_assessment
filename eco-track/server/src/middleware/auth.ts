import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * We extend Express's Request type so we can safely
 * attach userId after validating the JWT.
 */
export interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Middleware to protect routes using JWT authentication.
 * If the token is valid, the user's ID is attached to the request.
 */
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = header.split(" ")[1];

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as unknown;

  // Type guard: make sure decoded is an object with a userId string
  if (
    typeof decoded !== "object" ||
    decoded === null ||
    !("userId" in decoded) ||
    typeof (decoded as any).userId !== "string"
  ) {
    return res.status(401).json({ message: "Invalid token payload" });
  }

  req.userId = (decoded as any).userId;
  next();
} catch {
  return res.status(401).json({ message: "Invalid token" });
}

    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
