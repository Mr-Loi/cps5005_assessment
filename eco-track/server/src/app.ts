import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";

import { authRouter } from "./routes/auth.routes";
import { deviceRouter } from "./routes/device.routes";
import { readingRouter } from "./routes/reading.routes";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve static client files
app.use(express.static(path.join(__dirname, "../public")));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/devices", deviceRouter);
app.use("/api/readings", readingRouter);

// Global error handler
app.use(errorHandler);
