import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import Gallery from "@/models/Gallery";
import Experience from "@/models/Experience";
import SiteSettings from "@/models/SiteSettings";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // 1. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany([
        {
          title: "Bright Veil (LMS)",
          slug: "bright-veil-lms",
          description: "A comprehensive Learning Management System with courses, quizzes, assignments, live classes and analytics.",
          content: "## Bright Veil LMS Case Study\nBright Veil is an enterprise-grade Learning Management System engineered to support course delivery, video streaming, interactive quizzes, student progress tracking, and automated certificate generation.\n\n### System Architecture\n- **Frontend:** Next.js App Router + Tailwind CSS\n- **Backend:** Node.js + Express.js APIs\n- **Database:** MongoDB Atlas for high-speed document queries\n- **Media Storage:** Cloudinary CDN for HD video & document delivery\n- **Payments:** Razorpay gateway integration",
          techStack: ["Next.js", "Node.js", "MongoDB", "Tailwind CSS"],
          liveUrl: "https://brightveil.vercel.app/",
          githubUrl: "https://github.com/ErAditya1/BrightVeil-Next",
          coverImage: "/images/projects/Bright_Veil.png",
          images: ["/images/projects/Bright_Veil.png"],
          featured: true,
          status: "completed",
          views: 340,
        },
        {
          title: "NOU e-Learning Platform",
          slug: "nou-elearning-platform",
          description: "Educational platform for online learning, assessments, certificates and student progress tracking.",
          content: "## NOU e-Learning Platform\nNOU e-Learning provides students and instructors with automated test evaluation, live lecture scheduling, and modular course materials.\n\n### Tech Stack\nReact, Node.js, Express, MongoDB.",
          techStack: ["React", "Node.js", "Express", "MongoDB"],
          liveUrl: "https://brightveil.vercel.app/",
          githubUrl: "https://github.com/ErAditya1/Super-Tasky",
          coverImage: "/images/projects/super_tasky.png",
          images: ["/images/projects/super_tasky.png"],
          featured: true,
          status: "completed",
          views: 290,
        },
        {
          title: "Born Goat",
          slug: "born-goat",
          description: "Sports media platform and blog with news, player stats, articles and digital brand collaborations.",
          content: "## Born Goat Platform\nA high-traffic sports media outlet built with Next.js and Strapi CMS for live scores and article publishing.",
          techStack: ["Next.js", "Strapi", "PostgreSQL", "Tailwind CSS"],
          liveUrl: "https://brightveil.vercel.app/",
          githubUrl: "https://github.com/ErAditya1",
          coverImage: "/images/projects/mint_slot.png",
          images: ["/images/projects/mint_slot.png"],
          featured: true,
          status: "completed",
          views: 215,
        },
        {
          title: "College Management System",
          slug: "college-management-system",
          description: "Managing students, teachers, attendance, fees and exams for educational institutes.",
          content: "## College Management System\nBuilt with Django & PostgreSQL for academic administration.",
          techStack: ["Django", "PostgreSQL", "Bootstrap", "JavaScript"],
          liveUrl: "https://clg-ms-django.onrender.com",
          githubUrl: "https://github.com/ErAditya1/adarsh-inter-college",
          coverImage: "/images/projects/Adarsh_inter_college.png",
          images: ["/images/projects/Adarsh_inter_college.png"],
          featured: false,
          status: "completed",
          views: 180,
        },
        {
          title: "Event Management System",
          slug: "event-management-system",
          description: "Organize and manage events, registrations, tickets, speakers and schedules.",
          content: "## Event Management System\nFull event booking portal built with MERN stack.",
          techStack: ["MERN Stack", "Redux", "Tailwind CSS"],
          liveUrl: "https://whiteswanevent.vercel.app/",
          githubUrl: "https://github.com/ErAditya1",
          coverImage: "/images/projects/white_swan_event.png",
          images: ["/images/projects/white_swan_event.png"],
          featured: false,
          status: "completed",
          views: 195,
        },
        {
          title: "AI Calling Agent Platform",
          slug: "ai-calling-agent-platform",
          description: "AI-powered voice calling platform using WebSocket, STT, TTS and real-time interaction.",
          content: "## AI Calling Agent Platform\nReal-time telephony agent using Deepgram STT, ElevenLabs TTS, and WebSocket orchestration.",
          techStack: ["Next.js", "Socket.io", "ElevenLabs", "Deepgram"],
          liveUrl: "https://brightveil.vercel.app/",
          githubUrl: "https://github.com/ErAditya1",
          coverImage: "/images/projects/white_swan_event.png",
          images: ["/images/projects/white_swan_event.png"],
          featured: false,
          status: "completed",
          views: 310,
        },
      ]);
    }

    // 2. Seed Blogs
    const blogCount = await Blog.countDocuments();
    if (blogCount === 0) {
      await Blog.insertMany([
        {
          title: "How I Built a Scalable LMS with Next.js & Node.js",
          slug: "how-i-built-a-scalable-lms-with-nextjs",
          excerpt: "Deep dive into building an enterprise learning management system with Cloudinary video streaming, Razorpay payment flow, and ISR page caching.",
          content: "## Introduction\nBuilding an LMS requires balancing real-time analytics with media streaming bandwidth...\n\n### Key Lessons\n- Optimize video assets on upload via Cloudinary hooks.\n- Use ISR (Incremental Static Regeneration) for course landing pages.",
          coverImage: "/images/projects/Bright_Veil.png",
          tags: ["Web Development", "Next.js", "Node.js"],
          readTime: 5,
          views: 420,
          published: true,
        },
        {
          title: "Docker Best Practices for Developers",
          slug: "docker-best-practices-for-developers",
          excerpt: "Essential guidelines for multi-stage Docker builds, image size optimization, and microservice container deployment.",
          content: "## Container Security & Efficiency\nUsing multi-stage builds reduces image footprint from 1GB down to ~120MB...",
          coverImage: "/images/projects/super_tasky.png",
          tags: ["DevOps", "Docker", "Cloud"],
          readTime: 5,
          views: 380,
          published: true,
        },
        {
          title: "Clean Code Principles I Follow in Every Project",
          slug: "clean-code-principles-i-follow-in-every-project",
          excerpt: "SOLID principles, clean component modularization, and error boundary patterns for bulletproof React/Next.js codebases.",
          content: "## Clean Code Philosophy\nCode is written for humans first, computers second. Keep functions under 25 lines and separate concerns...",
          coverImage: "/images/projects/Adarsh_inter_college.png",
          tags: ["Programming", "Clean Code", "React"],
          readTime: 4,
          views: 510,
          published: true,
        },
      ]);
    }

    // 3. Seed Gallery
    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      await Gallery.insertMany([
        {
          title: "Bright Veil Dashboard",
          description: "Full-stack LMS portal dashboard with student progress analytics.",
          imageUrl: "/images/projects/Bright_Veil.png",
          category: "Projects",
          order: 1,
          featured: true,
        },
        {
          title: "Born Goat App",
          description: "Mobile app interface layout and brand experience design.",
          imageUrl: "/images/projects/super_tasky.png",
          category: "UI/UX Design",
          order: 2,
          featured: true,
        },
        {
          title: "AI Calling Platform",
          description: "AI-powered voice agent system code structure and STT listener.",
          imageUrl: "/images/projects/white_swan_event.png",
          category: "Projects",
          order: 3,
          featured: true,
        },
        {
          title: "College Management System",
          description: "College portal management dashboard for marksheet and attendance.",
          imageUrl: "/images/projects/Adarsh_inter_college.png",
          category: "Projects",
          order: 4,
          featured: true,
        },
        {
          title: "Certifications",
          description: "Official web development diploma certificate and technical awards.",
          imageUrl: "/images/projects/mint_slot.png",
          category: "Certificates",
          order: 5,
          featured: true,
        },
        {
          title: "Hackathon Event",
          description: "Speaker session and hackathon presentation at technical event.",
          imageUrl: "/images/projects/super_tasky.png",
          category: "Events",
          order: 6,
          featured: true,
        },
        {
          title: "Behind The Scenes",
          description: "Workspace notes and continuous learning journey log.",
          imageUrl: "/images/projects/Bright_Veil.png",
          category: "Behind The Scenes",
          order: 7,
          featured: true,
        },
        {
          title: "Life Beyond Code",
          description: "Mountain views, travel memories, and life outside engineering.",
          imageUrl: "/images/aditya_profile.png",
          category: "Life",
          order: 8,
          featured: true,
        },
      ]);
    }

    // 4. Seed Experiences
    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      await Experience.insertMany([
        {
          role: "Full Stack Developer",
          company: "Feeding Trends, India",
          companyLogo: "https://images.yourstory.com/cs/images/companies/1673542379000-1680580688969.jpg",
          period: "Feb 2026 – Present",
          description: "Working on scalable web applications, AI voice agents and cloud deployments.",
          skills: ["Next.js", "Node.js", "MongoDB", "AI Agents", "Docker"],
          type: "job",
          order: 1,
          featured: true,
        },
        {
          role: "MERN Stack Developer (Internship)",
          company: "Softpro India, Lucknow",
          companyLogo: "/images/companies/softpro_india.svg",
          period: "Jul 2025 – Feb 2026",
          description: "Worked as MERN Stack Developer Intern developing responsive web applications, REST APIs, and database models.",
          skills: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
          type: "job",
          order: 2,
          featured: true,
        },
        {
          role: "Python / Django Trainee",
          company: "Softpro India, Lucknow",
          companyLogo: "/images/companies/softpro_india.svg",
          period: "May 2024 – Jul 2024",
          description: "Completed 45 days of intensive training in Python, Django and full stack development.",
          skills: ["Python", "Django", "PostgreSQL", "REST APIs"],
          type: "trainee",
          order: 2,
          featured: true,
        },
        {
          role: "Freelance Developer",
          company: "Self Employed",
          period: "2024",
          description: "Built custom responsive websites and modern UI web applications for clients.",
          skills: ["React", "Next.js", "Tailwind CSS", "Firebase"],
          type: "freelance",
          order: 3,
          featured: true,
        },
        {
          role: "Academic Projects",
          company: "Various Technologies",
          period: "2023 – 2024",
          description: "Developed multiple real-world projects including college management portal.",
          skills: ["Full Stack", "Database Design", "System Architecture"],
          type: "education",
          order: 4,
          featured: true,
        },
      ]);
    }

    // 5. Seed Site Settings
    const settings = await SiteSettings.findOne();
    if (!settings) {
      await SiteSettings.create({
        siteTitle: "Aditya Kumar | Full Stack Developer",
        siteDescription: "Official portfolio of Aditya Kumar — specializing in full-stack web applications, scalable backend systems, and modern UIs.",
        ownerName: "Aditya Kumar",
        ownerTitle: "Full Stack Developer",
        ownerBio: "I build scalable web applications with modern technologies. Passionate about creating efficient, user-friendly solutions.",
        ownerLocation: "Barabanki / Lucknow, India",
        avatarUrl: "/images/aditya_profile.png",
        socialLinks: [
          { platform: "GitHub", url: "https://github.com/ErAditya1" },
          { platform: "LinkedIn", url: "https://linkedin.com" },
          { platform: "Twitter", url: "https://twitter.com" },
          { platform: "Email", url: "mailto:mradityaji2@gmail.com" },
        ],
      });
    }

    return NextResponse.json({
      message: "Database successfully seeded with Projects, Blogs, Gallery, Experiences & SiteSettings!",
      status: "success",
    });
  } catch (error) {
    console.error("Database seed error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
