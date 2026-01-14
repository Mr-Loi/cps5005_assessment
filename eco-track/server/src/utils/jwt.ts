import jwt, { Secret } from "jsonwebtoken";

/**
 * signs and returns token
 */
export function signToken(payload: object): string {
  const secret = process.env.JWT_SECRET as Secret;

  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  return jwt.sign(payload, secret, {
    expiresIn: "7d"
  });
}
