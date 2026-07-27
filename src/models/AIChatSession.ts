import mongoose, { Schema, Document } from "mongoose";

export interface IAIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface IAIChatSession extends Document {
  deviceId: string;
  messages: IAIChatMessage[];
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AIChatMessageSchema = new Schema<IAIChatMessage>({
  id: { type: String, required: true },
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const AIChatSessionSchema = new Schema<IAIChatSession>(
  {
    deviceId: { type: String, required: true, unique: true, index: true },
    messages: [AIChatMessageSchema],
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.AIChatSession ||
  mongoose.model<IAIChatSession>("AIChatSession", AIChatSessionSchema);
