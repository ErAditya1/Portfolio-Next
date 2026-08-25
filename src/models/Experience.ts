import mongoose, { Document, Schema } from "mongoose";

export interface IExperience extends Document {
  company: string;
  companyLogo?: string;
  role: string;
  period: string;
  description: string;
  points?: string[];
  location?: string;
  skills: string[];
  type: "job" | "trainee" | "freelance" | "education";
  order: number;
  featured: boolean;
  isCurrent?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    company: { type: String, required: true, trim: true },
    companyLogo: { type: String, trim: true },
    role: { type: String, required: true, trim: true },
    period: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    points: [{ type: String, trim: true }],
    location: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    type: { type: String, enum: ["job", "trainee", "freelance", "education"], default: "job" },
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: true },
    isCurrent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ExperienceSchema.index({ order: 1 });
ExperienceSchema.index({ featured: -1 });

export default mongoose.models.Experience || mongoose.model<IExperience>("Experience", ExperienceSchema);
