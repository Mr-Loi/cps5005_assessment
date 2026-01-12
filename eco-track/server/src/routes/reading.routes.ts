import { Router } from "express";
import { Types } from "mongoose";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { ReadingModel } from "../models/Reading";

export const readingRouter = Router();
readingRouter.use(requireAuth);

readingRouter.get("/latest", async (req: AuthRequest, res) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

  const userObjectId = new Types.ObjectId(req.userId);

  const rows = await ReadingModel.find({ userId: userObjectId })
    .sort({ timestamp: -1 })
    .limit(50);

  res.json(rows);
});
