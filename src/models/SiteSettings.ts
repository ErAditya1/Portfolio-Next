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
  socialLinks: { platform: string; url: string; icon: string }[];
  siteTitle: string;
  siteDescription: string;
  siteFavicon?: string;
  ogImage?: string;
  skills: { name: string; level: number; category: string }[];
  currentlyLearning: string[];
  recentlyLearned: string[];
  emergingExpertise: string[];
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    ownerName: { type: String, default: "Aditya Kumar" },
    ownerTitle: { type: String, default: "Full Stack Web Developer" },
    ownerBio: { type: String, default: "" },
    ownerEmail: { type: String, default: "mradityaji2@gmail.com" },
    ownerPhone: { type: String },
    ownerLocation: { type: String },
    avatarUrl: { type: String },
    resumeUrl: { type: String },
    githubUrl: { type: String },
    linkedinUrl: { type: String },
    twitterUrl: { type: String },
    socialLinks: [
      {
        platform: { type: String },
        url: { type: String },
        icon: { type: String },
      },
    ],
    siteTitle: { type: String, default: "Aditya Kumar | Portfolio" },
    siteDescription: { type: String, default: "Full-Stack Web Developer specializing in MERN and Modern UI frameworks." },
    siteFavicon: { type: String },
    ogImage: { type: String },
    skills: [
      {
        name: { type: String },
        level: { type: Number },
        category: { type: String },
      },
    ],
    currentlyLearning: [{ type: String }],
    recentlyLearned: [{ type: String }],
    emergingExpertise: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
