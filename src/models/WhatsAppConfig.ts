import mongoose, { Document, Schema } from "mongoose";

export interface IWhatsAppConfig extends Document {
  autoReplyEnabled: boolean;
  totalMessagesCount: number;
  activeConversationsCount: number;
  autoRepliesSentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const WhatsAppConfigSchema = new Schema<IWhatsAppConfig>(
  {
    autoReplyEnabled: {
      type: Boolean,
      default: true,
    },
    totalMessagesCount: {
      type: Number,
      default: 0,
    },
    activeConversationsCount: {
      type: Number,
      default: 0,
    },
    autoRepliesSentCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const WhatsAppConfig =
  mongoose.models.WhatsAppConfig ||
  mongoose.model<IWhatsAppConfig>("WhatsAppConfig", WhatsAppConfigSchema);
