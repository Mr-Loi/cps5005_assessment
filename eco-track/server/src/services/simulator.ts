import { DeviceModel } from "../models/Device";
import { ReadingModel } from "../models/Reading";

// virtual iot sim
export function startSimulator(intervalMs = 5000) {
  setInterval(async () => {
    const onDevices = await DeviceModel.find({ status: "on" });
    if (onDevices.length === 0) return;

    const now = new Date();
    const seconds = intervalMs / 1000;

    const readings = onDevices.map((d) => {
      const randomFactor = 0.6 + Math.random() * 0.8; // 0.6..1.4
      const powerWatts = Math.round(d.powerRatingWatts * randomFactor);
      const energyKwh = (powerWatts / 1000) * (seconds / 3600);

      return {
        userId: d.userId,
        deviceId: d._id,
        timestamp: now,
        powerWatts,
        energyKwh
      };
    });

    await ReadingModel.insertMany(readings);
  }, intervalMs);

  console.log("⚡ Simulator started (creates readings every 5s for ON devices)");
}
