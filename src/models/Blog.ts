import mongoose, { Document, Schema } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  views: number;
  readTime: number;
  images: string[];
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    images: [{ type: String }],
    tags: [{ type: String, trim: true, lowercase: true }],
    views: { type: Number, default: 0 },
    readTime: { type: Number, default: 5 }, // estimated minutes
    published: { type: Boolean, default: false },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
  },
  { timestamps: true }
);

// Indexes for common queries
BlogSchema.index({ slug: 1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ published: -1, createdAt: -1 });
BlogSchema.index({ title: "text", excerpt: "text" });

export default mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
