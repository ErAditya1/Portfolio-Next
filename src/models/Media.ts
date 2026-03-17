import mongoose, { Document, Schema } from "mongoose";

export interface IMedia extends Document {
  url: string;
  publicId: string;
  filename: string;
  format: string;
  resourceType: string;
  bytes: number;
  width?: number;
  height?: number;
  createdAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    filename: { type: String, required: true },
    format: { type: String },
    resourceType: { type: String, default: "image" },
    bytes: { type: Number },
    width: { type: Number },
    height: { type: Number },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Media || mongoose.model<IMedia>("Media", MediaSchema);
