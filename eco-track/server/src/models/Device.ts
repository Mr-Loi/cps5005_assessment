import { Schema, model, InferSchemaType, Types } from "mongoose";

const deviceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    powerRatingWatts: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ["on", "off"], default: "off" }
  },
  { timestamps: true }
);

export type Device = InferSchemaType<typeof deviceSchema> & { userId: Types.ObjectId };
export const DeviceModel = model<Device>("Device", deviceSchema);
