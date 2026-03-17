import mongoose, { Document, Schema } from "mongoose";

export interface IGallery extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  order: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, required: true },
    category: { type: String, default: "General", trim: true },
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

GallerySchema.index({ category: 1 });
GallerySchema.index({ featured: -1 });
GallerySchema.index({ order: 1 });

export default mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", GallerySchema);
