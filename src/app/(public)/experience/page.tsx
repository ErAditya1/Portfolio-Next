import { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Experience, { IExperience } from "@/models/Experience";
import { ExperiencePageClient } from "@/components/public/ExperiencePageClient";
import { TimelineExperienceItem } from "@/components/public/ExperienceTimeline";
import { CompanyCardItem } from "@/components/public/CompanySlider";

export const revalidate = 60; // Dynamic ISR revalidation every 60 seconds

export const metadata: Metadata = {
  title: "Experience & Career Chronicle | Aditya Kumar — Full Stack Engineer",
  description:
    "Explore Aditya Kumar's verified engineering roles, full stack accomplishments, AI voice integrations, organizations, education, and technical certifications.",
};

const defaultExperiences: TimelineExperienceItem[] = [
  {
    role: "Full Stack Developer",
    company: "Feeding Trends",
    companyLogo: "https://images.yourstory.com/cs/images/companies/1673542379000-1680580688969.jpg",
    period: "Feb 2026 – Present",
    location: "Lucknow, Uttar Pradesh — India",
    description:
      "Engineering scalable web applications, real-time AI voice calling solutions, and robust SaaS products with Next.js, Node.js, and Django.",
    points: [
      "Architecting AI-powered voice calling agents using ElevenLabs, Deepgram STT, and WebSockets.",
      "Developing high-throughput REST APIs and scalable full-stack applications with MERN / Next.js.",
      "Integrated third-party payment gateways, media streaming CDNs, and automated notification systems.",
    ],
    skills: ["Next.js", "Node.js", "AI Agents", "WebSockets", "MongoDB", "Docker"],
    isCurrent: true,
    type: "Full-Time Role",
  },
  {
    role: "MERN Stack Developer (Internship)",
    company: "Softpro India",
    period: "Jul 2025 – Feb 2026",
    location: "Lucknow — India",
    description:
      "Developed responsive web applications, REST APIs, and database models using the MERN stack with modern UI practices.",
    points: [
      "Built full-stack web applications with React.js, Express.js, Node.js, and MongoDB Atlas.",
      "Implemented responsive user interfaces with Tailwind CSS and state management using Redux Toolkit.",
      "Designed secure JWT authentication flows and optimized database queries.",
    ],
    skills: ["React.js", "Express.js", "Node.js", "MongoDB", "Redux", "Tailwind CSS"],
    isCurrent: false,
    type: "Internship",
  },
  {
    role: "Python / Django Trainee",
    company: "Softpro India",
    period: "May 2024 – Jul 2024",
    location: "Lucknow — India",
    description:
      "Completed intensive hands-on training in Python, Django REST Framework, relational databases, and MVC web architecture.",
    points: [
      "Built dynamic web applications with Django and PostgreSQL database integration.",
      "Implemented user authorization, secure forms, and template rendering pipelines.",
    ],
    skills: ["Python", "Django", "PostgreSQL", "REST APIs", "Bootstrap"],
    isCurrent: false,
    type: "Technical Training",
  },
  {
    role: "Freelance Full-Stack Developer",
    company: "Global Clients & Personal Builds",
    period: "2023 – 2024",
    location: "Remote",
    description:
      "Engineered custom websites, landing portals, and full-stack solutions for businesses and independent creators.",
    points: [
      "Delivered production-ready web apps with React.js, Next.js, and Firebase.",
      "Optimized Core Web Vitals, SEO performance, and responsive mobile layouts.",
    ],
    skills: ["Next.js", "React", "Firebase", "Tailwind CSS", "SEO"],
    isCurrent: false,
    type: "Freelance / Contract",
  },
];

const companiesList: CompanyCardItem[] = [
  {
    id: "c-feedingtrends",
    name: "Feeding Trends",
    role: "Full Stack & AI Solutions",
    period: "2026 – Present",
    logo: "https://images.yourstory.com/cs/images/companies/1673542379000-1680580688969.jpg",
  },
  {
    id: "c-softpro-mern",
    name: "Softpro India",
    role: "MERN Stack Developer (Internship)",
    period: "2025 – 2026",
    logo: "",
  },
  {
    id: "c-softpro-python",
    name: "Softpro India",
    role: "Python / Django Trainee",
    period: "2024",
    logo: "",
  },
  {
    id: "c-college",
    name: "Government Polytechnic",
    role: "Diploma Systems & LMS Project",
    period: "2024",
  },
  {
    id: "c-freelance",
    name: "Multiple Global Clients",
    role: "Freelance Full-Stack Builds",
    period: "2023 – 2024",
  },
];

export default async function ExperiencePage() {
  let dbExperiences: IExperience[] = [];
  try {
    await connectDB();
    const raw = await Experience.find().sort({ order: 1, createdAt: -1 }).lean();
    if (raw && raw.length > 0) {
      dbExperiences = JSON.parse(JSON.stringify(raw));
    }
  } catch (e) {
    console.error("DB error fetching experiences on ExperiencePage:", e);
  }

  const mappedDbExperiences: TimelineExperienceItem[] = dbExperiences.map((exp, idx) => ({
    id: String(exp._id || idx),
    role: exp.role,
    company: exp.company,
    companyLogo: exp.companyLogo,
    period: exp.period,
    location: exp.location || "India",
    description: exp.description,
    points: exp.points && exp.points.length > 0 ? exp.points : [exp.description],
    skills: exp.skills || [],
    isCurrent: Boolean(exp.isCurrent || idx === 0),
    type:
      exp.type === "job"
        ? "Full-Time Role"
        : exp.type === "trainee"
        ? "Technical Training"
        : exp.type === "freelance"
        ? "Freelance"
        : "Internship",
  }));

  const experiences = mappedDbExperiences.length > 0 ? mappedDbExperiences : defaultExperiences;

  return <ExperiencePageClient experiences={experiences} companies={companiesList} />;
}
