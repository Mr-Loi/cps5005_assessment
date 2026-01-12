import { Schema, model, InferSchemaType, Types } from "mongoose";

const readingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deviceId: { type: Schema.Types.ObjectId, ref: "Device", required: true },
    timestamp: { type: Date, required: true },
    powerWatts: { type: Number, required: true },
    energyKwh: { type: Number, required: true }
  },
  { timestamps: true }
);

// Helps performance for "latest" queries and history queries
readingSchema.index({ userId: 1, timestamp: -1 });
readingSchema.index({ deviceId: 1, timestamp: -1 });

export type Reading = InferSchemaType<typeof readingSchema> & {
  userId: Types.ObjectId;
  deviceId: Types.ObjectId;
};

export const ReadingModel = model<Reading>("Reading", readingSchema);
