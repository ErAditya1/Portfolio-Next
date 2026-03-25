import mongoose, { Document, Schema } from "mongoose";

export interface IWhatsAppMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  messageId: string; // Meta Message ID
  content: string;
  type: "text" | "image" | "document" | "interactive" | "other";
  direction: "incoming" | "outgoing";
  status: "sent" | "delivered" | "read" | "failed" | "received";
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WhatsAppMessageSchema = new Schema<IWhatsAppMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "WhatsAppConversation",
      required: true,
      index: true,
    },
    messageId: {
      type: String,
      required: true,
      unique: true, // Used to prevent duplicates from Meta Webhooks
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "text",
    },
    direction: {
      type: String,
      enum: ["incoming", "outgoing"],
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read", "failed", "received"],
      default: "received",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const WhatsAppMessage =
  mongoose.models.WhatsAppMessage ||
  mongoose.model<IWhatsAppMessage>("WhatsAppMessage", WhatsAppMessageSchema);
