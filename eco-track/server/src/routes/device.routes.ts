import { Router } from "express";
import { Types } from "mongoose";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { DeviceModel } from "../models/Device";

export const deviceRouter = Router();
deviceRouter.use(requireAuth);

deviceRouter.get("/", async (req: AuthRequest, res) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

  const userObjectId = new Types.ObjectId(req.userId);

  const devices = await DeviceModel.find({ userId: userObjectId }).sort({ createdAt: -1 });
  res.json(devices);
});

deviceRouter.post("/", async (req: AuthRequest, res) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

  const { name, type, powerRatingWatts } = req.body as {
    name: string;
    type: string;
    powerRatingWatts: number;
  };

  if (!name || !type || !powerRatingWatts) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const userObjectId = new Types.ObjectId(req.userId);

  const device = await DeviceModel.create({
    userId: userObjectId,
    name,
    type,
    powerRatingWatts,
    status: "off"
  });

  res.status(201).json(device);
});

deviceRouter.put("/:id", async (req: AuthRequest, res) => {
  if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.params;
  const updates = req.body as Partial<{
    name: string;
    status: "on" | "off";
    powerRatingWatts: number;
  }>;

  const userObjectId = new Types.ObjectId(req.userId);

  const device = await DeviceModel.findOneAndUpdate(
    { _id: id, userId: userObjectId },
    { $set: updates },
    { new: true }
  );

  if (!device) return res.status(404).json({ message: "Device not found" });
  res.json(device);
});
