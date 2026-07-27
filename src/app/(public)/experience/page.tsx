import { Metadata } from "next";
import { connectDB } from "@/lib/db";
import Experience, { IExperience } from "@/models/Experience";
import { Container } from "@/components/Container";
import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  Award,
  MapPin,
  Building2,
  ArrowRight,
  Code2,
  Bot,
  BookOpen,
  Layers,
  Cloud,
  CheckCircle2,
  Sparkles,
  Rocket,
  User,
  Calendar,
  Cpu,
  Wrench
} from "lucide-react";
import { CompanySlider, CompanyCardItem } from "@/components/public/CompanySlider";

export const revalidate = 60; // Dynamic ISR revalidation every 60 seconds

export const metadata: Metadata = {
  title: "My Professional Journey | Aditya Kumar - Full Stack Developer",
  description: "Explore Aditya Kumar's professional experience, MERN stack internships, career timeline, key contributions, education, and technical certifications.",
};

export default async function ExperiencePage() {
  let dbExperiences: IExperience[] = [];
  try {
    await connectDB();
    const raw = await Experience.find().sort({ order: 1 }).lean();
    if (raw && raw.length > 0) {
      dbExperiences = JSON.parse(JSON.stringify(raw));
    }
  } catch (e) {
    console.error("DB error fetching experiences:", e);
  }

  const defaultExperiences = [
    {
      role: "Full Stack Developer (Permanent)",
      period: "Feb 2026 – Present",
      company: "Feeding Trends",
      companyLogo: "https://images.yourstory.com/cs/images/companies/1673542379000-1680580688969.jpg",
      location: "Lucknow, Uttar Pradesh — India",
      description: "Worked on AI voice & calling solutions, SaaS platforms and internal products.",
      points: [
        "Worked on AI voice & calling solutions, SaaS platforms and internal products.",
        "Developed scalable web applications with MERN/Next.js/Django.",
        "Integrated third party APIs: ElevenLabs, Deepgram, payment gateways, etc."
      ],
      isCurrent: true,
      icon: Briefcase,
    },
    {
      role: "MERN Stack Developer (Internship)",
      period: "Jul 2025 – Feb 2026",
      company: "Softpro India",
      companyLogo: "/images/companies/softpro_india.svg",
      location: "Lucknow — India",
      description: "Worked as MERN Stack Developer Intern developing responsive web applications, REST APIs, and database models.",
      points: [
        "Developed full-stack web applications using React.js, Node.js, Express.js, and MongoDB.",
        "Created responsive user interfaces with Tailwind CSS and state management with Redux/Context API.",
        "Built secure RESTful APIs, authentication workflows, and database schema optimizations."
      ],
      isCurrent: false,
      icon: Code2,
    },
    {
      role: "Python / Django Trainee",
      period: "May 2024 – Jul 2024",
      company: "Softpro India",
      companyLogo: "/images/companies/softpro_india.svg",
      location: "Lucknow — India",
      description: "Intensive training on Python, Django and Web development.",
      points: [
        "Intensive training on Python, Django and Web development.",
        "Built small applications with database integration."
      ],
      isCurrent: false,
      icon: Code2,
    },
    {
      role: "Internship / Diploma Project Work",
      period: "Mar 2024 – May 2024",
      company: "Government Polytechnic & Personal Projects",
      location: "Uttar Pradesh — India",
      description: "Worked on college management system using Django.",
      points: [
        "Worked on college management system using Django.",
        "Hands-on real world project development and team collaboration."
      ],
      isCurrent: false,
      icon: GraduationCap,
    },
    {
      role: "Freelance / Client Projects",
      period: "2023 – 2024",
      company: "Freelance (Multiple Clients)",
      location: "Remote",
      description: "Built websites, web apps and UI for clients.",
      points: [
        "Built websites, web apps and UI for clients.",
        "Worked with React.js, Next.js, Tailwind CSS, and Firebase."
      ],
      isCurrent: false,
      icon: Layers,
    },
  ];

  const mappedDbExperiences = dbExperiences.map((exp, idx) => ({
    role: exp.role,
    period: exp.period,
    company: exp.company,
    companyLogo: exp.companyLogo,
    location: exp.location || "India",
    description: exp.description,
    points: exp.points && exp.points.length > 0 ? exp.points : [exp.description],
    isCurrent: idx === 0,
    icon: idx === 0 ? Briefcase : idx === 1 ? Code2 : idx === 2 ? Code2 : idx === 3 ? GraduationCap : Layers,
  }));

  const experiences = mappedDbExperiences.length > 0 ? mappedDbExperiences : defaultExperiences;

  // Companies List for Companies Slider Section
  const companiesList: CompanyCardItem[] = [
    {
      id: "c-feedingtrends",
      name: "Feeding Trends",
      role: "AI & Calling Solutions",
      period: "2025 – Present",
      logo: "https://images.yourstory.com/cs/images/companies/1673542379000-1680580688969.jpg",
    },
    {
      id: "c-softpro-mern",
      name: "Softpro India",
      role: "MERN Stack Developer (Internship)",
      period: "2025 – 2026",
      logo: "/images/companies/softpro_india.svg",
    },
    {
      id: "c-softpro-python",
      name: "Softpro India",
      role: "Python / Django Trainee",
      period: "2024",
      logo: "/images/companies/softpro_india.svg",
    },
    {
      id: "c-college",
      name: "College Project",
      role: "Diploma / Personal Builds",
      period: "2024",
    },
    {
      id: "c-freelance",
      name: "Multiple Clients",
      role: "Freelance Projects",
      period: "2023 – 2024",
    },
  ];

  // Stats Row
  const stats = [
    { label: "Years of Full Stack Experience", value: "1+", icon: Calendar },
    { label: "Real Projects Delivered", value: `${experiences.length + 2}+`, icon: Code2 },
    { label: "Years of Learning & Growth", value: "2.5+", icon: GraduationCap },
    { label: "Lives Impacted Through My Solutions", value: "100K+", icon: User },
  ];

  // Key Contributions
  const keyContributions = [
    {
      title: "Web Development",
      desc: "Built scalable, modern and high-performance web applications.",
      icon: Code2,
    },
    {
      title: "AI & Voice Solutions",
      desc: "Integrated AI voice (ElevenLabs, Deepgram) for modern applications.",
      icon: Bot,
    },
    {
      title: "EdTech & LMS",
      desc: "Developed e-learning and college management systems.",
      icon: BookOpen,
    },
    {
      title: "MERN Stack Development",
      desc: "Expert in React.js, Node.js, Express.js, MongoDB.",
      icon: Layers,
    },
    {
      title: "Cloud & DevOps",
      desc: "Deployed on Vercel, Render, Docker with CI/CD practices.",
      icon: Cloud,
    },
    {
      title: "Problem Solving",
      desc: "Turned ideas into working solutions with clean code & UI/UX.",
      icon: CheckCircle2,
    },
  ];

  // Tech Stack & Tools
  const techStack = {
    Frontend: ["React.js", "Next.js", "Tailwind CSS", "ShadCN UI", "TypeScript"],
    Backend: ["Node.js", "Express.js", "Django", "MongoDB", "MySQL"],
    "Tools & Others": ["Git", "GitHub", "Docker", "VS Code", "Figma", "Postman"],
  };

  // Education
  const education = [
    {
      title: "Diploma in Computer Science & Engineering",
      institution: "Government Polytechnic Aadanpur, Tanda",
      board: "BTEUP | 2022 – 2025",
      icon: GraduationCap,
    },
    {
      title: "Intermediate (Maths)",
      institution: "S.S. Inter College, Zaidpur Barabanki",
      board: "Uttar Pradesh | 2022",
      icon: User,
    },
    {
      title: "High School (Science)",
      institution: "B V M Inter College, Kothi, Barabanki",
      board: "Uttar Pradesh | 2020",
      icon: Building2,
    },
  ];

  // Certifications
  const certifications = [
    {
      title: "Python / Django Training",
      org: "Softpro India, Lucknow | 45 Days",
      icon: Award,
    },
    {
      title: "Web Development",
      org: "Self & Project Based Learning",
      icon: Cloud,
    },
    {
      title: "AI & Cloud Computing",
      org: "Continuous Learning",
      icon: Cpu,
    },
  ];

  return (
    <main className="pt-24 pb-20 overflow-hidden bg-background">
      <Container>
        {/* ================= 1. HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest inline-block">
            My Experience
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground">
            My Professional <span className="text-indigo-600 dark:text-indigo-400">Journey</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Building impactful real-world solutions with passion for technology, impact and continuous learning.
          </p>
        </div>

        {/* ================= 2. TIMELINE SECTION ================= */}
        <div className="max-w-4xl mx-auto mb-24 relative">
          <div className="absolute left-6 md:left-8 top-4 bottom-4 w-0.5 bg-indigo-500/30" />

          <div className="space-y-8">
            {experiences.map((exp, idx) => {
              const Icon = exp.icon;
              return (
                <div key={idx} className="relative flex gap-6 md:gap-8 items-start group">
                  <div className={`relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-md ${exp.isCurrent
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-500/20"
                      : "bg-card border border-border text-indigo-500"
                    }`}>
                    {exp.companyLogo ? (
                      <img src={exp.companyLogo} alt={exp.company} className="w-7 h-7 md:w-9 md:h-9 object-contain" />
                    ) : (
                      <Icon className="w-6 h-6 md:w-8 md:h-8" />
                    )}
                  </div>

                  <div className="flex-1 bg-card border border-border rounded-3xl p-6 md:p-8 hover:border-indigo-500/40 transition-all shadow-sm group-hover:shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {exp.role}
                        </h3>
                        <p className="text-xs md:text-sm font-medium text-muted-foreground flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                          {exp.company} — {exp.location}
                        </p>
                      </div>
                      <span className="px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold whitespace-nowrap self-start sm:self-auto">
                        {exp.period}
                      </span>
                    </div>

                    <ul className="space-y-2">
                      {exp.points.map((pt, pIdx) => (
                        <li key={pIdx} className="text-xs md:text-sm text-muted-foreground flex items-start gap-2 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 3. STATS ROW ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-24">
          {stats.map((st, sIdx) => {
            const Icon = st.icon;
            return (
              <div key={sIdx} className="p-6 md:p-8 rounded-3xl bg-card border border-border text-center space-y-2 hover:border-indigo-500/30 transition-all shadow-sm flex flex-col items-center justify-center">
                <Icon className="w-6 h-6 text-indigo-500 mb-1" />
                <div className="text-3xl md:text-4xl font-black text-indigo-600 dark:text-indigo-400">
                  {st.value}
                </div>
                <div className="text-xs md:text-sm font-medium text-muted-foreground">
                  {st.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= 4. KEY CONTRIBUTIONS ================= */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              Key <span className="text-indigo-600 dark:text-indigo-400">Contributions</span>
            </h2>
            <p className="text-muted-foreground text-xs md:text-sm">
              Building products and solving real-world problems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyContributions.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl bg-card border border-border space-y-4 hover:border-indigo-500/40 transition-all group shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base md:text-lg text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 5. COMPANIES I'VE WORKED WITH (SLIDER) ================= */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              Companies <span className="text-indigo-600 dark:text-indigo-400">I&apos;ve Worked With</span>
            </h2>
            <p className="text-muted-foreground text-xs md:text-sm">
              Where I gained experience and grew my skills.
            </p>
          </div>

          {/* Company Slider Component */}
          <CompanySlider companies={companiesList} />
        </div>

        {/* ================= 6. TECH STACK & TOOLS ================= */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              Tech Stack & <span className="text-indigo-600 dark:text-indigo-400">Tools</span>
            </h2>
            <p className="text-muted-foreground text-xs md:text-sm">
              Technologies I work with daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(techStack).map(([category, items]) => (
              <div key={category} className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
                <h3 className="font-bold text-xs md:text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((tech) => (
                    <span key={tech} className="px-3.5 py-2 rounded-xl bg-accent text-foreground text-xs font-semibold hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 7. EDUCATION & CERTIFICATIONS ================= */}
        <div className="mb-24 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              Education & <span className="text-indigo-600 dark:text-indigo-400">Certifications</span>
            </h2>
            <p className="text-muted-foreground text-xs md:text-sm">
              My academic background and professional credentials.
            </p>
          </div>

          {/* Education Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {education.map((edu, idx) => {
              const Icon = edu.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl bg-card border border-border space-y-3 shadow-sm hover:border-indigo-500/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-foreground">{edu.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{edu.institution}</p>
                  <span className="text-[11px] font-semibold text-indigo-500 block">{edu.board}</span>
                </div>
              );
            })}
          </div>

          {/* Certifications Sub-Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert, idx) => {
              const Icon = cert.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl bg-card border border-border space-y-2 shadow-sm hover:border-indigo-500/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-foreground">{cert.title}</h3>
                  <p className="text-xs text-muted-foreground">{cert.org}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 8. CTA BANNER ================= */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-4 z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center shrink-0">
              <Rocket className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-black">Let&apos;s Build Something Amazing Together</h2>
              <p className="text-indigo-200 text-xs md:text-sm">
                I&apos;m always excited to work on challenging projects and create real impact.
              </p>
            </div>
          </div>
          <Link
            href="/contact"
            className="z-10 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2 group whitespace-nowrap"
          >
            Hire Me <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Container>
    </main>
  );
}
