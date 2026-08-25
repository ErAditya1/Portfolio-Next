// ---------- Config / Data ----------
export const NAME = 'Aditya Kumar'
export const ROLE = 'Full‑Stack Web Developer'
export const LOCATION = 'Barabanki / Lucknow, India'
export const EMAIL = 'mradityaji2@gmail.com'
export const PHONE = '+91 9473774390'
export const RESUME = '/images/ADITYA_RESUME.pdf'

export const skills = [
  // -------- Frontend --------
  { name: 'HTML', level: 90, category: 'Frontend' },
  { name: 'CSS / TailwindCSS', level: 85, category: 'Frontend' },
  { name: 'JavaScript', level: 85, category: 'Frontend' },
  { name: 'TypeScript', level: 80, category: 'Frontend' },
  { name: 'React', level: 88, category: 'Frontend' },
  { name: 'Next.js', level: 85, category: 'Frontend' },
  { name: 'React Native', level: 75, category: 'Frontend' },
  { name: 'ShadcnUI / AceternityUI / MUI', level: 75, category: 'Frontend' },

  // -------- Backend --------
  { name: 'Node.js', level: 80, category: 'Backend' },
  { name: 'Express.js', level: 78, category: 'Backend' },
  { name: 'Python', level: 65, category: 'Backend' },
  { name: 'Django', level: 55, category: 'Backend' },

  // -------- Database --------
  { name: 'MongoDB', level: 75, category: 'Database' },
  { name: 'MySQL', level: 70, category: 'Database' },

  // -------- Other Tools & Cloud --------
  { name: 'Git / GitHub', level: 80, category: 'Other' },
  { name: 'WebSocket / Redux / Context API', level: 70, category: 'Other' },
  { name: 'Firebase / Appwrite / Clerk', level: 70, category: 'Other' },
  { name: 'Cloudinary / ImageKit', level: 68, category: 'Other' },
  { name: 'Razorpay (Payments)', level: 65, category: 'Other' },
];

// our services
export const services = [
  {
    title: "Full-Stack Web Development",
    desc: "Custom, scalable apps with Next.js, React, Node.js, Express.js, and MongoDB/MySQL.",
    icon: "💻"
  },
  {
    title: "Frontend Development",
    desc: "Modern, responsive UIs with Tailwind, Shadcn UI, Aceternity UI, and MUI.",
    icon: "🎨"
  },
  {
    title: "Backend & APIs",
    desc: "Secure, optimized APIs with Node.js, Express.js, Django",
    icon: "⚙️"
  },
  {
    title: "Native App Development",
    desc: "Cross-platform mobile apps with React Native and seamless API integration.",
    icon: "📱"
  },
  {
    title: "Training & Mentorship",
    desc: "Workshops and personalized sessions on MERN, Next.js, Django, and full-stack basics.",
    icon: "📚"
  },
  {
    title: "Freelance Solutions",
    desc: "Helping individuals and businesses build websites, portals, and SaaS products.",
    icon: "🚀"
  },
];

/** Project type */
export interface Project {
  id: string
  title: string
  tag: string
  desc: string
  live: string
  repo: string
  img: string
  logoUrl?: string
  isMinor?: boolean
  category?: 'flagship' | 'major' | 'minor' | 'client'
  year: number
  tech: string[]
}

// All projects are loaded dynamically from the MongoDB database
export const PROJECTS: Project[] = [];

// Blog post type
export type BlogPost = {
  title: string
  slug: string
  excerpt: string
  img: string
  date: string
  tags: string[]
  url?: string
  author?: { name: string; avatar?: string; bio?: string }
  content: string
}

// All blogs are loaded dynamically from the MongoDB database
export const BLOGS: BlogPost[] = [];
