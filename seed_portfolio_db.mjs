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
    // Native fallback ignore
  }
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set in process.env or .env file.");
  process.exit(1);
}

// Define Experience schema inline for standalone seed script execution
const ExperienceSchema = new mongoose.Schema(
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

const Experience = mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);

const EXPERIENCES_SEED = [
  {
    company: "Feeding Trends",
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Feeding%20Trends&backgroundColor=4f46e5",
    role: "Full Stack Developer (Permanent)",
    period: "Feb 2026 – Present",
    location: "Lucknow, Uttar Pradesh — India",
    description: "Worked on AI voice & calling solutions, SaaS platforms and internal products.",
    points: [
      "Worked on AI voice & calling solutions (Callio AI), SaaS platforms (Amplibuzz) and internal security products (Observiq/Trubetix).",
      "Developed scalable web applications with MERN/Next.js/Django.",
      "Integrated third party APIs: ElevenLabs, Deepgram, payment gateways, etc."
    ],
    skills: ["Next.js", "NestJS", "FastAPI", "React", "Node.js", "Express.js", "MongoDB", "PostgreSQL", "Socket.io", "ElevenLabs", "Razorpay"],
    type: "job",
    order: 1,
    featured: true,
    isCurrent: true
  },
  {
    company: "Softpro India",
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Softpro%20India&backgroundColor=0284c7",
    role: "MERN Stack Developer (Internship)",
    period: "Jul 2025 – Feb 2026",
    location: "Lucknow — India",
    description: "Worked as MERN Stack Developer Intern developing responsive web applications, REST APIs, and database models.",
    points: [
      "Developed full-stack web applications using React.js, Node.js, Express.js, and MongoDB.",
      "Created responsive user interfaces with Tailwind CSS and state management with Redux/Context API.",
      "Built secure RESTful APIs, authentication workflows, and database schema optimizations."
    ],
    skills: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "Redux", "REST APIs"],
    type: "trainee",
    order: 2,
    featured: true,
    isCurrent: false
  },
  {
    company: "Softpro India",
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Softpro%20India&backgroundColor=0284c7",
    role: "Python / Django Trainee",
    period: "May 2024 – Jul 2024",
    location: "Lucknow — India",
    description: "Intensive training on Python, Django and Web development.",
    points: [
      "Intensive training on Python, Django and Web development.",
      "Built small applications with database integration."
    ],
    skills: ["Python", "Django", "SQLite", "HTML", "CSS", "Bootstrap"],
    type: "trainee",
    order: 3,
    featured: true,
    isCurrent: false
  },
  {
    company: "Government Polytechnic & Personal Projects",
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Diploma&backgroundColor=7c3aed",
    role: "Internship / Diploma Project Work",
    period: "Mar 2024 – May 2024",
    location: "Uttar Pradesh — India",
    description: "Worked on college management system using Django.",
    points: [
      "Worked on college management system using Django.",
      "Hands-on real world project development and team collaboration."
    ],
    skills: ["Django", "Python", "PostgreSQL", "Web Development"],
    type: "education",
    order: 4,
    featured: true,
    isCurrent: false
  },
  {
    company: "Freelance (Multiple Clients)",
    companyLogo: "https://api.dicebear.com/7.x/initials/svg?seed=Freelance&backgroundColor=059669",
    role: "Freelance / Client Projects",
    period: "2023 – 2024",
    location: "Remote",
    description: "Built websites, web apps and UI for clients.",
    points: [
      "Built websites, web apps and UI for clients.",
      "Worked with React.js, Next.js, Tailwind CSS, and Firebase."
    ],
    skills: ["React.js", "Next.js", "Tailwind CSS", "Firebase"],
    type: "freelance",
    order: 5,
    featured: true,
    isCurrent: false
  }
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB Database...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully to MongoDB.");

    console.log("\n🌱 Seeding Experience collection...");
    for (const expData of EXPERIENCES_SEED) {
      const exp = await Experience.findOneAndUpdate(
        { company: expData.company, role: expData.role },
        {
          company: expData.company,
          companyLogo: expData.companyLogo,
          role: expData.role,
          period: expData.period,
          location: expData.location,
          description: expData.description,
          points: expData.points,
          skills: expData.skills,
          type: expData.type,
          order: expData.order,
          featured: expData.featured,
          isCurrent: expData.isCurrent,
        },
        { upsert: true, returnDocument: 'after' }
      );
      console.log(`  ✓ Seeded Experience: ${exp.role} at ${exp.company} (isCurrent: ${exp.isCurrent})`);
    }

    console.log("\n🎉 Experience Database Seed Completed Successfully!");
  } catch (error) {
    console.error("❌ Database seed failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seedDatabase();
