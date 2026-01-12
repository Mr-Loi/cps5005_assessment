import "dotenv/config";
import { app } from "./app";
import { connectDB } from "./config/db";
import { startSimulator } from "./services/simulator";

async function main() {
  const port = Number(process.env.PORT || 4000);
  const mongoUri = process.env.MONGO_URI as string;

  // Connect to MongoDB
  await connectDB(mongoUri);

  // Start virtual IoT energy simulator
  startSimulator(5000);

  // Start HTTP server
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
