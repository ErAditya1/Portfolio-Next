import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set in process.env or .env file.");
  process.exit(1);
}


// Define schemas inline for standalone seed script execution
const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    images: [{ type: String }],
    tags: [{ type: String, trim: true, lowercase: true }],
    views: { type: Number, default: 1250 },
    readTime: { type: Number, default: 6 },
    published: { type: Boolean, default: true },
    isMinor: { type: Boolean, default: false },
    category: { type: String, enum: ["flagship", "major", "minor", "client"], default: "major" },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
  },
  { timestamps: true }
);

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    content: { type: String, default: "" },
    techStack: [{ type: String, trim: true }],
    githubUrl: { type: String, trim: true },
    liveUrl: { type: String, trim: true },
    coverImage: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    images: [{ type: String }],
    featured: { type: Boolean, default: true },
    isMinor: { type: Boolean, default: false },
    category: { type: String, enum: ["flagship", "major", "minor", "client"], default: "major" },
    status: { type: String, enum: ["completed", "building", "in-progress"], default: "completed" },
    views: { type: Number, default: 1540 },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

const PROJECTS_SEED = [
  // ─── FLAGSHIP & MAJOR PROJECTS ───────────────────────────────────────────────
  {
    title: "Callio AI — Outbound Calling & Voice AI Platform",
    slug: "callio-ai",
    excerpt: "Enterprise automated outbound dialing platform connecting Tata Smartflo cloud telephony with ElevenLabs voice synthesis for <300ms real-time calls.",
    coverImage: "/images/projects/white_swan_event.png",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Callio%20AI&backgroundColor=00c4ff",
    images: ["/images/projects/white_swan_event.png", "/images/projects/Bright_Veil.png"],
    tags: ["voice-ai", "nextjs", "nestjs", "typescript", "postgresql", "redis", "bullmq", "telephony", "websockets", "razorpay"],
    techStack: ["Next.js 14", "NestJS", "TypeScript", "PostgreSQL", "Prisma", "Redis", "BullMQ", "Socket.io", "Tata Smartflo", "ElevenLabs", "Razorpay"],
    liveUrl: "https://callio.cheetahagi.com/",
    githubUrl: "https://github.com/ErAditya1/",
    readTime: 7,
    published: true,
    featured: true,
    isMinor: false,
    category: "flagship",
    status: "completed",
    seoTitle: "Callio AI — Outbound Calling & Conversational Voice AI Platform",
    seoDescription: "Callio AI connects Tata Smartflo cloud telephony with ElevenLabs neural voice synthesis for real-time <300ms automated sales calls and live telemetry.",
    content: `# 🎙️ Callio AI — Outbound Calling & Voice AI Platform

## 📌 Executive Overview
**Callio AI** is a state-of-the-art enterprise outbound dialing and conversational AI platform designed to automate high-volume sales outreach, lead qualification, and customer support. By bridging cloud telephony trunks (**Tata Smartflo**) with neural voice synthesis (**ElevenLabs**), Callio AI executes natural human-like phone calls at scale.

---

## 🛠️ Tech Stack & System Architecture
- **Frontend Dashboard:** Next.js 14 (App Router), React, TypeScript, TailwindCSS, Shadcn UI, Socket.io Client
- **Backend API Gateway:** NestJS, TypeScript, REST API, WebSockets (\`ws\` & Socket.io)
- **Database & Cache:** PostgreSQL, Prisma ORM, Redis (Config pre-caching & BullMQ job queue state)
- **Telephony & Voice AI:** Tata Smartflo (Click-to-Call & Audio Websockets), ElevenLabs (Conversational Voice AI Engine)
- **AI Insights:** OpenAI GPT-4 (Call transcript summaries, lead qualification scoring, CRM webhook sync)
- **Billing:** Razorpay Subscriptions & Usage Ledger`
  },
  {
    title: "Amplibuzz (Amplibuz) — Influencer Marketing Platform",
    slug: "amplibuzz",
    excerpt: "High-performance platform connecting brands with social media influencers using locked escrow wallets and automated Puppeteer post-verification scrapers.",
    coverImage: "/images/projects/Bright_Veil.png",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Amplibuzz&backgroundColor=ff007a",
    images: ["/images/projects/Bright_Veil.png", "/images/projects/mint_slot.png"],
    tags: ["saas", "influencer-marketing", "escrow", "nextjs", "nestjs", "typescript", "postgresql", "puppeteer", "redis", "razorpay"],
    techStack: ["Next.js 14", "NestJS", "TypeScript", "PostgreSQL", "Prisma", "Redis", "BullMQ", "Puppeteer", "Razorpay", "TailwindCSS"],
    liveUrl: "https://amplibuzz.com/",
    githubUrl: "https://github.com/ErAditya1/",
    readTime: 6,
    published: true,
    featured: true,
    isMinor: false,
    category: "flagship",
    status: "completed",
    seoTitle: "Amplibuzz — Influencer Marketing & Escrow Verification Platform",
    seoDescription: "Amplibuzz connects brands with social media contributors using locked escrow wallets, automated Puppeteer post verification scrapers, and instant payouts.",
    content: `# 🚀 Amplibuzz — Influencer Marketing & Automated Escrow Platform

## 📌 Executive Overview
**Amplibuzz** is a high-performance platform designed to eliminate friction in influencer marketing campaigns. It provides brands with budget transparency through locked escrow wallets and empowers contributors with instant, automated payouts upon verified content posting.`
  },
  {
    title: "Observiq (Trubetix) — Social Intelligence & AI Security",
    slug: "observiq-trubetix",
    excerpt: "Horizontally scalable social auditing platform aggregating metrics across 10+ social networks with PR Pulse Google Trends/News analytics and TF-IDF/pHash plagiarism engines.",
    coverImage: "/images/projects/super_tasky.png",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Observiq&backgroundColor=7000ff",
    images: ["/images/projects/super_tasky.png", "/images/projects/white_swan_event.png"],
    tags: ["fastapi", "python", "nextjs", "ai-detection", "plagiarism", "phash", "social-intelligence", "docker", "redis", "scikit-learn"],
    techStack: ["FastAPI", "Python", "Next.js 14", "PostgreSQL", "Redis", "Playwright", "scikit-learn", "ReportLab", "Docker Compose"],
    liveUrl: "https://observiq.cheetahagi.com/",
    githubUrl: "https://github.com/ErAditya1",
    readTime: 8,
    published: true,
    featured: true,
    isMinor: false,
    category: "flagship",
    status: "completed",
    seoTitle: "Observiq (Trubetix) — Social Intelligence & AI Plagiarism Security",
    seoDescription: "Observiq aggregates metrics across 10+ social networks, featuring PR Pulse Google Trends/News analytics, TF-IDF/pHash plagiarism detection, and PDF reports.",
    content: `# 🛡️ Observiq (Trubetix) — Social Intelligence & AI Security Platform

## 📌 Executive Overview
**Observiq (Trubetix)** is an enterprise social auditing and content security platform. It aggregates public profiles, posts, and comments across 10+ social networks (*Instagram, X/Twitter, TikTok, YouTube, LinkedIn, Facebook, Threads, Reddit*), executes natural language sentiment scoring, and audits perceptual duplicate content.`
  },
  {
    title: "Born Goat — Digital Agency & Brand Showcase Platform",
    slug: "borngoat",
    excerpt: "Modern interactive agency showcase platform featuring dynamic brand logo cropping tools, responsive design tokens, and smooth micro-animations.",
    coverImage: "/images/projects/mint_slot.png",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Born%20Goat&backgroundColor=ffb800",
    images: ["/images/projects/mint_slot.png", "/images/projects/Bright_Veil.png"],
    tags: ["nextjs", "react", "typescript", "tailwindcss", "python", "branding", "agency"],
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Python (Image Processing)", "Framer Motion"],
    liveUrl: "https://borngoat.com/",
    githubUrl: "https://github.com/ErAditya1/",
    readTime: 4,
    published: true,
    featured: true,
    isMinor: false,
    category: "client",
    status: "completed",
    seoTitle: "Born Goat — Digital Agency & Brand Showcase Platform",
    seoDescription: "Born Goat is a dynamic web showcase platform featuring dynamic logo cropping, modern UI design tokens, and fast client-side rendering.",
    content: `# 🐐 Born Goat — Digital Agency & Brand Showcase Platform`
  },
  {
    title: "Cheetah AGI — Autonomous Agent Orchestrator",
    slug: "cheetah-agi",
    excerpt: "Multi-model LLM router and agent workflow automation engine delivering dynamic cost and latency optimization across LLM providers.",
    coverImage: "/images/projects/Adarsh_inter_college.png",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Cheetah%20AGI&backgroundColor=00ff66",
    images: ["/images/projects/Adarsh_inter_college.png"],
    tags: ["agi", "llm-router", "openai", "claude", "gemini", "nestjs", "nextjs", "typescript"],
    techStack: ["Node.js", "NestJS", "Next.js", "TypeScript", "OpenAI API", "Claude API", "Gemini API"],
    liveUrl: "https://cheetahagi.com/",
    githubUrl: "https://github.com/ErAditya1/",
    readTime: 5,
    published: true,
    featured: true,
    isMinor: false,
    category: "flagship",
    status: "completed",
    seoTitle: "Cheetah AGI — Autonomous Agent & Multi-Model LLM Router",
    seoDescription: "Cheetah AGI is an autonomous agent orchestrator featuring multi-model LLM routing between OpenAI, Claude, and Gemini for cost and latency optimization.",
    content: `# 🐆 Cheetah AGI — Autonomous Agent Orchestrator`
  },
  {
    title: "BrightVeil LMS Platform",
    slug: "brightveil",
    excerpt: "Enterprise learning management system with video courses, instructor dashboards, live classes, student progress analytics, and automated certification.",
    coverImage: "/images/projects/Bright_Veil.png",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=BrightVeil&backgroundColor=0284c7",
    images: ["/images/projects/Bright_Veil.png"],
    tags: ["lms", "edtech", "nextjs", "react", "nodejs", "express", "mongodb", "cloudinary", "razorpay"],
    techStack: ["Next.js", "React", "Node.js", "Express.js", "MongoDB", "Cloudinary", "Razorpay"],
    liveUrl: "https://brightveil.vercel.app/",
    githubUrl: "https://github.com/ErAditya1/BrightVeil-Next",
    readTime: 5,
    published: true,
    featured: true,
    isMinor: false,
    category: "major",
    status: "completed",
    seoTitle: "BrightVeil LMS — Enterprise Video Course & Certification Platform",
    seoDescription: "BrightVeil LMS provides video course delivery, instructor dashboards, progress tracking, and Razorpay payment integration.",
    content: `# 📚 BrightVeil LMS Platform`
  },
  {
    title: "NotesHub Platform",
    slug: "noteshub",
    excerpt: "Academic resource management ecosystem with CRUD operations, document file uploads, rating system, and community pull requests.",
    coverImage: "/images/projects/super_tasky.png",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=NotesHub&backgroundColor=10b981",
    images: ["/images/projects/super_tasky.png"],
    tags: ["edtech", "react", "express", "mongodb", "rest-api", "jwt"],
    techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "JWT"],
    liveUrl: "https://noteshubio.vercel.app/",
    githubUrl: "https://github.com/ErAditya1/",
    readTime: 4,
    published: true,
    featured: false,
    isMinor: false,
    category: "major",
    status: "completed",
    seoTitle: "NotesHub — Academic Resource & Notes Sharing Platform",
    seoDescription: "NotesHub is an open-source academic resource sharing web platform for notes, PDFs, and peer reviews.",
    content: `# 📝 NotesHub Platform`
  },

  // ─── MINOR & UTILITY PROJECTS ───────────────────────────────────────────────
  {
    title: "Super Tasky",
    slug: "supertasky",
    excerpt: "Real-time task management platform with project tracking, Socket.io synchronization, and automated deadline reminders.",
    coverImage: "/images/projects/super_tasky.png",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=SuperTasky&backgroundColor=f59e0b",
    images: ["/images/projects/super_tasky.png"],
    tags: ["productivity", "nextjs", "socketio", "tailwind", "express", "mongodb"],
    techStack: ["Next.js", "Tailwind CSS", "MongoDB", "Express.js", "Socket.io"],
    liveUrl: "https://supertasky.vercel.app/",
    githubUrl: "https://github.com/ErAditya1/Super-Tasky",
    readTime: 3,
    published: true,
    featured: false,
    isMinor: true,
    category: "minor",
    status: "completed",
    seoTitle: "Super Tasky — Real-time Task Management App",
    seoDescription: "Super Tasky is a lightweight real-time task management tool built with Next.js, Express, and Socket.io.",
    content: `# ⚡ Super Tasky`
  },
  {
    title: "SkillSpring LMS",
    slug: "skillspring",
    excerpt: "Interactive skill learning platform with dynamic topic icons, course paths, and student practice assessments.",
    coverImage: "/images/projects/Bright_Veil.png",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=SkillSpring&backgroundColor=6366f1",
    images: ["/images/projects/Bright_Veil.png"],
    tags: ["edtech", "react", "redux", "tailwind"],
    techStack: ["React.js", "Tailwind CSS", "Redux Toolkit"],
    liveUrl: "https://skillspring-sigma.vercel.app/",
    githubUrl: "https://github.com/ErAditya1/skill-spring-frontend",
    readTime: 3,
    published: true,
    featured: false,
    isMinor: true,
    category: "minor",
    status: "completed",
    seoTitle: "SkillSpring — Skill Practice & Assessment Web Portal",
    seoDescription: "SkillSpring provides interactive skill assessment modules and course practice tracks.",
    content: `# 🌱 SkillSpring`
  },
  {
    title: "LabSearch Healthcare",
    slug: "labsearch",
    excerpt: "Diagnostic lab search and medical user management system for finding nearby medical tests and instant online booking.",
    coverImage: "/images/projects/white_swan_event.png",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=LabSearch&backgroundColor=ef4444",
    images: ["/images/projects/white_swan_event.png"],
    tags: ["healthcare", "nextjs", "mongodb", "express"],
    techStack: ["Next.js", "React", "Node.js", "MongoDB"],
    liveUrl: "https://labsearch.vercel.app/",
    githubUrl: "https://github.com/ErAditya1/LabSearch",
    readTime: 3,
    published: true,
    featured: false,
    isMinor: true,
    category: "minor",
    status: "completed",
    seoTitle: "LabSearch — Diagnostic Lab & Medical Booking Portal",
    seoDescription: "LabSearch enables patients to locate local diagnostic centers, compare test costs, and book online.",
    content: `# 🧪 LabSearch Healthcare`
  },
  {
    title: "STT Whisper Service",
    slug: "stt-whisper",
    excerpt: "High-precision speech-to-text service wrapping OpenAI Whisper for multi-lingual audio transcription and subtitle generation.",
    coverImage: "/images/projects/white_swan_event.png",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=STT%20Whisper&backgroundColor=8b5cf6",
    images: ["/images/projects/white_swan_event.png"],
    tags: ["speech-to-text", "whisper", "python", "fastapi", "ai"],
    techStack: ["Python", "FastAPI", "OpenAI Whisper", "FFmpeg"],
    liveUrl: "https://github.com/ErAditya1/",
    githubUrl: "https://github.com/ErAditya1/",
    readTime: 3,
    published: true,
    featured: false,
    isMinor: true,
    category: "minor",
    status: "completed",
    seoTitle: "STT Whisper — Speech-to-Text Transcription Microservice",
    seoDescription: "STT Whisper is a Python FastAPI microservice providing fast audio-to-text transcriptions using Whisper models.",
    content: `# 🎧 STT Whisper Service`
  },
  {
    title: "WhatsApp Automation API",
    slug: "whatsapp-api",
    excerpt: "Automated messaging and webhook gateway integrating Meta WhatsApp Business API for transactional notifications and chatbots.",
    coverImage: "/images/projects/mint_slot.png",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=WhatsApp%20API&backgroundColor=22c55e",
    images: ["/images/projects/mint_slot.png"],
    tags: ["whatsapp", "messaging", "nodejs", "express", "webhooks"],
    techStack: ["Node.js", "Express.js", "WhatsApp Business Cloud API", "Redis"],
    liveUrl: "https://github.com/ErAditya1/",
    githubUrl: "https://github.com/ErAditya1/",
    readTime: 3,
    published: true,
    featured: false,
    isMinor: true,
    category: "minor",
    status: "completed",
    seoTitle: "WhatsApp Automation API & Webhook Gateway",
    seoDescription: "Automated messaging gateway for Meta WhatsApp Cloud API with template notifications and webhook listener.",
    content: `# 💬 WhatsApp Automation API`
  },
  {
    title: "Scrapify Lead Scraper",
    slug: "scrapify",
    excerpt: "Lead generation and contact extraction tool for scraping public lead directories and email/phone validation.",
    coverImage: "/images/projects/Bright_Veil.png",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Scrapify&backgroundColor=ec4899",
    images: ["/images/projects/Bright_Veil.png"],
    tags: ["scraping", "lead-gen", "python", "playwright", "beautifulsoup"],
    techStack: ["Python", "Playwright", "BeautifulSoup4", "FastAPI"],
    liveUrl: "https://github.com/ErAditya1/",
    githubUrl: "https://github.com/ErAditya1/",
    readTime: 3,
    published: true,
    featured: false,
    isMinor: true,
    category: "minor",
    status: "completed",
    seoTitle: "Scrapify — Lead Generation & Contact Scraping Suite",
    seoDescription: "Scrapify extracts validated email, phone, and organization directory contacts using automated Playwright headless browsers.",
    content: `# 🔍 Scrapify Lead Scraper`
  },
  {
    title: "Geeta Palace Resort",
    slug: "geetapalace",
    excerpt: "Event venue and luxury resort web application with booking inquiry forms and high-resolution media galleries.",
    coverImage: "/images/projects/white_swan_event.png",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=Geeta%20Palace&backgroundColor=d97706",
    images: ["/images/projects/white_swan_event.png"],
    tags: ["client-project", "nextjs", "react", "tailwindcss", "framer-motion"],
    techStack: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://geeta-palace.vercel.app/",
    githubUrl: "https://github.com/ErAditya1/Geeta-Palace",
    readTime: 3,
    published: true,
    featured: false,
    isMinor: true,
    category: "client",
    status: "completed",
    seoTitle: "Geeta Palace Resort & Event Venue",
    seoDescription: "Geeta Palace is a modern resort web portal with luxury amenities showcase and online booking forms.",
    content: `# 🏰 Geeta Palace Resort`
  },
  {
    title: "Sagar Institute (SITM)",
    slug: "sagar-institute",
    excerpt: "Educational institute application shell with global metadata, SEO schema, and academic department catalogs.",
    coverImage: "/images/projects/Adarsh_inter_college.png",
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=SITM&backgroundColor=2563eb",
    images: ["/images/projects/Adarsh_inter_college.png"],
    tags: ["client-project", "nextjs", "react", "tailwindcss", "seo"],
    techStack: ["Next.js", "React", "Tailwind CSS", "SEO Schema"],
    liveUrl: "https://sagar-aditya.vercel.app/",
    githubUrl: "https://github.com/ErAditya1/sitm-ui",
    readTime: 3,
    published: true,
    featured: false,
    isMinor: true,
    category: "client",
    status: "completed",
    seoTitle: "Sagar Institute of Technology & Management (SITM)",
    seoDescription: "Sagar Institute web application portal featuring academic courses, admissions info, and campus galleries.",
    content: `# 🎓 Sagar Institute (SITM)`
  }
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB Database...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully to MongoDB.");

    console.log("\n🌱 Seeding Projects collection...");
    for (const data of PROJECTS_SEED) {
      const proj = await Project.findOneAndUpdate(
        { slug: data.slug },
        {
          title: data.title,
          slug: data.slug,
          description: data.excerpt,
          content: data.content,
          techStack: data.techStack,
          githubUrl: data.githubUrl,
          liveUrl: data.liveUrl,
          coverImage: data.coverImage,
          logoUrl: data.logoUrl,
          images: data.images,
          featured: data.featured,
          isMinor: data.isMinor,
          category: data.category,
          status: data.status,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
        },
        { upsert: true, new: true }
      );
      console.log(`  ✓ Seeded Project: ${proj.title} [Type: ${proj.category.toUpperCase()}] (${proj.slug})`);
    }

    console.log("\n🌱 Seeding Blogs collection...");
    for (const data of PROJECTS_SEED) {
      const blog = await Blog.findOneAndUpdate(
        { slug: data.slug },
        {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          coverImage: data.coverImage,
          logoUrl: data.logoUrl,
          images: data.images,
          tags: data.tags,
          readTime: data.readTime,
          published: data.published,
          isMinor: data.isMinor,
          category: data.category,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
        },
        { upsert: true, new: true }
      );
      console.log(`  ✓ Seeded Blog: ${blog.title} [Type: ${blog.category.toUpperCase()}] (${blog.slug})`);
    }

    console.log("\n🎉 Database Seed Completed Successfully!");
  } catch (error) {
    console.error("❌ Database seed failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seedDatabase();
