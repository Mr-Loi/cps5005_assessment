import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";

import { authRouter } from "./routes/auth.routes";
import { deviceRouter } from "./routes/device.routes";
import { readingRouter } from "./routes/reading.routes";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(
    helmet(
        {
            contentSecurityPolicy: false
        }
    ));
app.use(cors());
app.use(express.json());

// static pages (optional)
app.use(express.static(path.resolve(process.cwd(), "public")));

app.get("/health", (_req, res) => res.json({ status: "OK" }));

app.use("/api/auth", authRouter);
app.use("/api/devices", deviceRouter);
app.use("/api/readings", readingRouter);

app.use(errorHandler);
