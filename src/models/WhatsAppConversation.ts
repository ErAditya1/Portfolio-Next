import mongoose, { Document, Schema } from "mongoose";

export interface IWhatsAppConversation extends Document {
  phone: string;
  name?: string;
  lastMessage: string;
  status: "active" | "archived" | "bot_handling";
  unreadCount: number;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WhatsAppConversationSchema = new Schema<IWhatsAppConversation>(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
    },
    lastMessage: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "archived", "bot_handling"],
      default: "bot_handling",
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const WhatsAppConversation =
  mongoose.models.WhatsAppConversation ||
  mongoose.model<IWhatsAppConversation>("WhatsAppConversation", WhatsAppConversationSchema);
