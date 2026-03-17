import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import SiteSettings from "@/models/SiteSettings";
import Gallery from "@/models/Gallery";
import User from "@/models/User";
import Blog from "@/models/Blog";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { secret } = await req.json();

    if (secret !== process.env.SETUP_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 1. Update Site Settings
    await SiteSettings.findOneAndUpdate(
      {},
      {
        ownerName: "Aditya Kumar",
        ownerTitle: "Backend & System Engineer (Junior Level)",
        ownerBio: "Aditya Kumar is a passionate Web Developer with a strong foundation in both frontend and backend technologies. Currently pursuing BTech in CSE from AKTU and completed Diploma in Computer Science & Engineering (2022–2025), he specializes in building scalable, modern web applications using the MERN stack and modern UI frameworks.",
        ownerEmail: "mradityaji2@gmail.com",
        ownerPhone: "+91 9473774390",
        ownerLocation: "India",
        githubUrl: "https://github.com/ErAditya1",
        siteTitle: "Aditya Kumar | Backend & System Engineer",
        siteDescription: "Portfolio of Aditya Kumar, specializing in scalable backend architecture, web scraping, and MERN stack development.",
        skills: [
          { name: "C", level: 85, category: "Programming" },
          { name: "JavaScript", level: 80, category: "Programming" },
          { name: "Python", level: 60, category: "Programming" },
          { name: "React.js", level: 85, category: "Frontend" },
          { name: "Next.js", level: 80, category: "Frontend" },
          { name: "Node.js", level: 85, category: "Backend" },
          { name: "Express.js", level: 80, category: "Backend" },
          { name: "Prisma ORM", level: 75, category: "Backend" },
          { name: "BullMQ (Queues)", level: 70, category: "Backend" },
          { name: "Playwright", level: 70, category: "Backend" },
          { name: "MongoDB", level: 80, category: "Database" },
          { name: "MySQL", level: 70, category: "Database" },
        ],
        currentlyLearning: [
          "Scalable system design",
          "Distributed job processing (BullMQ)",
          "Advanced web scraping techniques",
          "Backend performance optimization"
        ],
        recentlyLearned: [
          "Queue Systems & Background Jobs",
          "System Design Basics",
          "Web Scraping (Advanced)",
          "Authentication & Security",
          "ORM & Database Optimization"
        ],
        emergingExpertise: [
          "Building real-world scalable scraping systems",
          "Working with queues, workers, and async processing",
          "Backend beyond CRUD (job systems, retries, failures)",
          "Integrating multiple services (DB + Queue + APIs)",
          "Debugging complex production issues"
        ]
      },
      { upsert: true, new: true }
    );

    // 2. Add Projects
    const projects = [
      {
        title: "Social Media Scraping & Analytics Platform",
        slug: "social-media-scraping-platform",
        description: "A scalable scraping system for platforms like Instagram, X (Twitter), and Facebook using Playwright and BullMQ.",
        content: "Built a scalable scraping system for platforms like Instagram, X (Twitter), and Facebook. Using Playwright + BullMQ + Redis for distributed scraping jobs. Implementing queue-based architecture for handling large workloads. Extracting: Followers / Following, Engagement metrics, Content analytics. Backend powered by NestJS + Prisma + MongoDB. Handling real-world scraping challenges like rate limits, retries, and failure recovery.",
        techStack: ["NestJS", "Prisma", "MongoDB", "Playwright", "BullMQ", "Redis"],
        status: "building",
        featured: true,
      },
      {
        title: "Bright Veil (Learning Platform)",
        slug: "bright-veil",
        description: "Developed a scalable e-learning platform with authentication and course management.",
        content: "Implemented authentication, course management, and UI dashboards using MERN Stack, Clerk, and Cloudinary.",
        techStack: ["MERN Stack", "Clerk", "Cloudinary"],
        status: "completed",
        featured: true,
      },
      {
        title: "White Swan Event (Event Management System)",
        slug: "white-swan-event",
        description: "Built event booking and management system with registration and scheduling.",
        content: "Features include user registration, event scheduling, and admin dashboard. Tech: React, Node.js, MongoDB.",
        techStack: ["React", "Node.js", "MongoDB"],
        status: "completed",
        featured: true,
      },
      {
        title: "NOU e-Learning Platform",
        slug: "nou-elearning",
        description: "Created an educational system for course delivery with user roles.",
        content: "Integrated user roles and content management with a focus on usability and performance.",
        techStack: ["React", "Node.js", "MongoDB"],
        status: "completed",
        featured: false,
      },
      {
        title: "Adarsh Inter College (College Management System)",
        slug: "adarsh-inter-college",
        description: "Developed system for managing students, faculty, and operations.",
        content: "Included admin panel and database management using MERN / Full-stack.",
        techStack: ["MERN", "Full-stack"],
        status: "completed",
        featured: true,
      }
    ];

    for (const p of projects) {
      await Project.findOneAndUpdate(
        { slug: p.slug },
        p,
        { upsert: true, new: true }
      );
    }

    // 3. Add Gallery Items
    const galleryItems = [
      {
        title: "Scalable Architecture",
        description: "Queue-based processing architecture for distributed scraping.",
        imageUrl: "/images/gallery/architecture.png",
        category: "Backend",
        featured: true,
        order: 1
      },
      {
        title: "Social Media Analytics",
        description: "Dashboard showcasing real-time engagement metrics.",
        imageUrl: "/images/gallery/analytics.png",
        category: "Frontend",
        featured: true,
        order: 2
      },
      {
        title: "System Design Patterns",
        description: "Microservices vs Monolith patterns exploration.",
        imageUrl: "/images/gallery/design.png",
        category: "Learning",
        featured: false,
        order: 3
      }
    ];

    for (const item of galleryItems) {
      await Gallery.findOneAndUpdate(
        { title: item.title },
        item,
        { upsert: true, new: true }
      );
    }

    // 4. Add Blogs
    const blogs = [
      {
        title: "Building Scalable Backend Systems with BullMQ",
        slug: "building-scalable-backend-bullmq",
        excerpt: "Learn how to handle high-concurrency tasks and background processing using Redis and BullMQ in a Node.js environment.",
        content: "Distributed systems require robust job processing. In this article, we explore the architecture of BullMQ, how it interacts with Redis, and how to implement retries, delays, and priority queues for production-level scraping systems...",
        coverImage: "/images/blog/bullmq.png",
        tags: ["Backend", "BullMQ", "Node.js", "System Design"],
        published: true,
      },
      {
        title: "Advanced Web Scraping: Beyond Basic CSS Selectors",
        slug: "advanced-web-scraping-playwright",
        excerpt: "Mastering Playwright for complex Single Page Applications (SPAs) and handling anti-bot measures effectively.",
        content: "Modern websites are dynamic and often protected. We dive into using Playwright for browser automation, handling shadow DOMs, and strategies for rotating user agents and proxies without getting flagged...",
        coverImage: "/images/blog/scraping.png",
        tags: ["Scraping", "Playwright", "Automation", "Python"],
        published: true,
      },
      {
        title: "System Design 101: From Monolith to Microservices",
        slug: "system-design-monolith-to-microservices",
        excerpt: "A guide for junior developers on when and how to break down a monolithic application into manageable services.",
        content: "Scalability is not just about adding more servers. It's about how you decouple your data and logic. This guide breaks down the CAP theorem, load balancing, and the trade-offs of moving to a microservices architecture...",
        coverImage: "/images/blog/system-design.png",
        tags: ["System Design", "Architecture", "Engineering"],
        published: true,
      }
    ];

    for (const b of blogs) {
      await Blog.findOneAndUpdate(
        { slug: b.slug },
        b,
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ message: "Seed successful" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to seed" }, { status: 500 });
  }
}
