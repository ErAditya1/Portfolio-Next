import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

// Parse local .env file natively if MONGODB_URI is not pre-set in process.env
if (!process.env.MONGODB_URI) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const match = trimmed.match(/^([^=]+)=(.*)$/);
          if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
              value = value.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = value;
            }
          }
        }
      });
    }
  } catch (e) {
    // ignore
  }
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set in process.env or .env file.");
  process.exit(1);
}

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    coverImage: { type: String, default: "" },
    images: [{ type: String }],
    logoUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    coverImage: { type: String, default: "" },
    images: [{ type: String }],
  },
  { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

// Curated high quality dynamic project cover mapping
const PROJECT_COVERS = {
  "bright-veil-lms": {
    cover: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1200&auto=format&fit=crop",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=brightveil&backgroundColor=4f46e5"
  },
  "nou-elearning-platform": {
    cover: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=noulearning&backgroundColor=0284c7"
  },
  "born-goat": {
    cover: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=borngoat&backgroundColor=dc2626"
  },
  "college-management-system": {
    cover: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=clgms&backgroundColor=059669"
  },
  "event-management-system": {
    cover: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=eventms&backgroundColor=9333ea"
  },
  "ai-calling-agent-platform": {
    cover: "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1200&auto=format&fit=crop",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=aicalling&backgroundColor=2563eb"
  },
  "callio-ai": {
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=callio&backgroundColor=4f46e5"
  },
  "super-tasky": {
    cover: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1200&auto=format&fit=crop",
    logo: "https://api.dicebear.com/7.x/identicon/svg?seed=supertasky&backgroundColor=ea580c"
  },
};

// Curated high quality dynamic blog cover mapping
const BLOG_COVERS = {
  "how-i-built-a-scalable-lms-with-nextjs": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
  "docker-best-practices-for-developers": "https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=1200&auto=format&fit=crop",
  "clean-code-principles-i-follow-in-every-project": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
  "building-production-ai-voice-agents": "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1200&auto=format&fit=crop",
  "nextjs-15-app-router-deep-dive": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
};

async function updateDatabaseImages() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    // Update Projects
    const projects = await Project.find();
    console.log(`Found ${projects.length} projects in MongoDB.`);
    for (const p of projects) {
      const match = PROJECT_COVERS[p.slug] || {
        cover: `https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop`,
        logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${p.slug}&backgroundColor=4f46e5`
      };

      if (!p.coverImage || p.coverImage.trim() === "") {
        p.coverImage = match.cover;
      }
      if (!p.images || p.images.length === 0) {
        p.images = [p.coverImage];
      }
      if (!p.logoUrl || p.logoUrl.trim() === "") {
        p.logoUrl = match.logo;
      }
      await p.save();
      console.log(`  ✓ Updated dynamic image for project: ${p.title} (${p.slug}) -> ${p.coverImage}`);
    }

    // Update Blogs
    const blogs = await Blog.find();
    console.log(`Found ${blogs.length} blogs in MongoDB.`);
    for (const b of blogs) {
      const coverUrl = BLOG_COVERS[b.slug] || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop";

      if (!b.coverImage || b.coverImage.trim() === "") {
        b.coverImage = coverUrl;
      }
      if (!b.images || b.images.length === 0) {
        b.images = [b.coverImage];
      }
      await b.save();
      console.log(`  ✓ Updated dynamic image for blog: ${b.title} (${b.slug}) -> ${b.coverImage}`);
    }

    console.log("\n🎉 All projects and blogs images updated dynamically in MongoDB!");
  } catch (err) {
    console.error("Error updating database images:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

updateDatabaseImages();
