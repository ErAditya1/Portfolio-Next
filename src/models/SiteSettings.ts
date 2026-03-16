import mongoose, { Document, Schema } from "mongoose";

export interface ISiteSettings extends Document {
  ownerName: string;
  ownerTitle: string;
  ownerBio: string;
  ownerEmail: string;
  ownerPhone?: string;
  ownerLocation?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  siteTitle: string;
  siteDescription: string;
  siteFavicon?: string;
  ogImage?: string;
  skills: string[];
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    ownerName: { type: String, default: "John Doe" },
    ownerTitle: { type: String, default: "Full Stack Developer" },
    ownerBio: { type: String, default: "" },
    ownerEmail: { type: String, default: "" },
    ownerPhone: { type: String },
    ownerLocation: { type: String },
    avatarUrl: { type: String },
    resumeUrl: { type: String },
    githubUrl: { type: String },
    linkedinUrl: { type: String },
    twitterUrl: { type: String },
    siteTitle: { type: String, default: "My Portfolio" },
    siteDescription: { type: String, default: "A showcase of my work and thoughts." },
    siteFavicon: { type: String },
    ogImage: { type: String },
    skills: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
