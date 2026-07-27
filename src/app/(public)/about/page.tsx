import { connectDB } from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { Container } from "@/components/Container";
import Image from "next/image";
import { ISiteSettings } from "@/types";
import { Metadata } from "next";
import Link from "next/link";
import { 
  Code2, 
  Lightbulb, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Rocket, 
  GraduationCap, 
  Award, 
  Brain,
  Coffee,
  Globe,
  Compass,
  Cpu,
  Layers,
  Terminal,
  Heart
} from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About | Aditya Kumar - Full Stack Developer",
  description: "Learn more about Aditya Kumar — Full Stack Web Developer, engineering philosophy, skills, journey, and technical capabilities.",
};

export default async function AboutPage() {
  let settings: ISiteSettings = {} as ISiteSettings;
  try {
    await connectDB();
    const settingsRaw = await SiteSettings.findOne().lean();
    settings = JSON.parse(JSON.stringify(settingsRaw));
  } catch (e) {
    console.error("DB connection error on About page:", e);
  }

  const name = settings?.ownerName || "Aditya Kumar";

  const skillCategories = [
    {
      category: "Programming",
      items: [
        { name: "JavaScript", level: 85 },
        { name: "TypeScript", level: 80 },
        { name: "Python", level: 65 },
        { name: "C", level: 80 },
        { name: "SQL", level: 70 },
      ],
    },
    {
      category: "Frontend",
      items: [
        { name: "React.js", level: 85 },
        { name: "Next.js", level: 80 },
        { name: "Tailwind CSS", level: 85 },
        { name: "Material UI", level: 75 },
        { name: "Shadcn UI", level: 70 },
      ],
    },
    {
      category: "Backend",
      items: [
        { name: "Node.js", level: 85 },
        { name: "Express.js", level: 80 },
        { name: "MongoDB", level: 70 },
        { name: "MySQL", level: 75 },
        { name: "PostgreSQL", level: 70 },
      ],
    },
    {
      category: "Tools & Others",
      items: [
        { name: "Git", level: 85 },
        { name: "GitHub", level: 80 },
        { name: "Postman", level: 80 },
        { name: "VS Code", level: 85 },
        { name: "Figma", level: 70 },
      ],
    },
  ];

  const whatIHaveLearned = [
    { title: "Data Structures & Algorithms", desc: "Strong foundation in problem solving." },
    { title: "Web Development Fundamentals", desc: "HTML, CSS, JavaScript, and modern frameworks." },
    { title: "Database Design & Optimization", desc: "Building efficient and scalable databases." },
    { title: "RESTful APIs & Integrations", desc: "Designing and consuming APIs effectively." },
    { title: "Clean Code & Best Practices", desc: "Writing maintainable and testable code." },
  ];

  const emergingExpertise = [
    { title: "Cloud Deployment", desc: "Learning AWS & Vercel for scalable apps." },
    { title: "DevOps & CI/CD", desc: "Automating deployments and workflows." },
    { title: "System Design Basics", desc: "Designing scalable and high-performance systems." },
    { title: "Performance Optimization", desc: "Making applications faster and more efficient." },
    { title: "AI/ML Integration", desc: "Exploring AI tools and integrations." },
  ];

  const hobbies = [
    { icon: Globe, title: "Tech Blogging", desc: "Writing tutorials on Next.js, WebSockets, and clean code." },
    { icon: Compass, title: "Open Source", desc: "Contributing to community projects and building developer tools." },
    { icon: Coffee, title: "Continuous Learning", desc: "Reading tech papers, exploring new frameworks, and experimenting with AI." },
  ];

  return (
    <main className="pt-24 pb-20 overflow-hidden">
      <Container>
        {/* 1. Hero Section */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-7 space-y-6">
            <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs font-bold uppercase tracking-widest inline-block">
              About Me
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
              Passionate About <span className="text-indigo-600 dark:text-indigo-400">Innovating</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              I build digital solutions that solve real problems and deliver meaningful experiences. Clean code, thoughtful design, and continuous learning drive everything I do.
            </p>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-card border border-border text-center">
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">2+</div>
                <div className="text-[11px] text-muted-foreground font-semibold">Years of Learning</div>
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border text-center">
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">20+</div>
                <div className="text-[11px] text-muted-foreground font-semibold">Projects</div>
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border text-center">
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">15+</div>
                <div className="text-[11px] text-muted-foreground font-semibold">Technologies</div>
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border text-center">
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">100%</div>
                <div className="text-[11px] text-muted-foreground font-semibold">Commitment</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden border-4 border-card shadow-2xl bg-indigo-500/10">
              <Image
                src="/images/aditya_profile.png"
                alt="Aditya Kumar"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 px-4 py-2 rounded-2xl bg-background/90 backdrop-blur-md border border-border flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-foreground">1+ Years Experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Who I Am / Story / Journey */}
        <div className="p-8 md:p-12 rounded-3xl bg-card border border-border mb-24 shadow-sm">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 block">
              Who I Am
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Hello! I&apos;m <span className="text-indigo-600 dark:text-indigo-400">{name}</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              I&apos;m a Full Stack Developer who loves turning ideas into reality with modern web technologies. I specialize in building responsive, scalable, and user-friendly applications.
            </p>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              My journey in tech is fueled by curiosity and a commitment to excellence. When I&apos;m not coding, you&apos;ll find me exploring new tools, contributing to open-source, and sharing knowledge with the developer community.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-accent/40 border border-border flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Problem Solver</h3>
                  <p className="text-xs text-muted-foreground mt-1">Breaking down complex problems and building simple solutions.</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-accent/40 border border-border flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">Lifelong Learner</h3>
                  <p className="text-xs text-muted-foreground mt-1">Constantly learning and adapting to new technologies and trends.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-md shadow-indigo-500/20"
              >
                Explore My Work <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Technologies I Work With */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 block">
              Professional Expertise
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Technologies <span className="text-indigo-600 dark:text-indigo-400">I Work With</span>
            </h2>
            <p className="text-muted-foreground text-sm">
              A comprehensive toolkit of modern technologies and frameworks I use to build scalable digital solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillCategories.map((cat) => (
              <div key={cat.category} className="p-6 rounded-3xl bg-card border border-border space-y-6">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  {cat.category}
                </h3>
                <div className="space-y-4">
                  {cat.items.map((item) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-foreground">
                        <span>{item.name}</span>
                        <span className="text-indigo-500">{item.level}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-accent overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
                          style={{ width: `${item.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. What I've Learned & Emerging Expertise */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <div className="p-8 rounded-3xl bg-card border border-border space-y-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-500" />
              What I&apos;ve Learned
            </h3>
            <div className="space-y-4">
              {whatIHaveLearned.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-accent/30 border border-border/50">
                  <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-card border border-border space-y-6">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Emerging Expertise
            </h3>
            <div className="space-y-4">
              {emergingExpertise.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-accent/30 border border-border/50">
                  <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Engineering Philosophy */}
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-card to-card border border-border mb-24">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 block">
              My Engineering Philosophy
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              The Principles That <span className="text-indigo-600 dark:text-indigo-400">Guide My Work</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Code as Craft</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                I write clean, maintainable code with attention to detail and best practices.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Scalability First</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                I build solutions designed to grow and adapt to future needs effortlessly.
              </p>
            </div>
          </div>
        </div>

        {/* 6. Life Beyond Code */}
        <div className="mb-24">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 block">
              Life Beyond Code
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              What Keeps Me <span className="text-indigo-600 dark:text-indigo-400">Inspired</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hobbies.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl bg-card border border-border space-y-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7. CTA */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-xl text-center md:text-left z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-200 block">Next Step</span>
            <h2 className="text-3xl md:text-4xl font-black">
              Have a Vision? Let&apos;s Build It Together!
            </h2>
            <p className="text-indigo-200 text-sm">
              I&apos;m always excited to work on challenging projects that create real impact.
            </p>
          </div>
          <Link
            href="/contact"
            className="z-10 px-8 py-4 rounded-2xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 transition-all shadow-lg flex items-center gap-2 group whitespace-nowrap"
          >
            Initiate Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </Container>
    </main>
  );
}
