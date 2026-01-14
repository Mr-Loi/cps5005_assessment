import "dotenv/config";
import { app } from "./app";
import { connectDB } from "./config/db";
import { startSimulator } from "./services/simulator";

async function main() {
  const port = Number(process.env.PORT || 4000);
  const mongoUri = process.env.MONGO_URI as string;

  await connectDB(mongoUri);
  startSimulator(5000);
  
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
