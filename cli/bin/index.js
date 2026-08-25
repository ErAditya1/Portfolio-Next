#!/usr/bin/env node

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  ADITYA KUMAR — INTERACTIVE TERMINAL BUSINESS CARD & PORTFOLIO CLI
 * ═══════════════════════════════════════════════════════════════════════════
 *  Run via: npx aditya-kumar@latest --connect
 *  Author:  Aditya Kumar <mradityaji2@gmail.com>
 *  Website: https://eraditya.vercel.app
 * ═══════════════════════════════════════════════════════════════════════════
 */

const readline = require("readline");
const { exec } = require("child_process");

// ANSI Color & Styling Tokens
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",
  // Foreground Colors
  cyan: "\x1b[36m",
  brightCyan: "\x1b[96m",
  blue: "\x1b[34m",
  brightBlue: "\x1b[94m",
  indigo: "\x1b[38;5;63m",
  purple: "\x1b[35m",
  brightPurple: "\x1b[95m",
  magenta: "\x1b[38;5;206m",
  green: "\x1b[32m",
  emerald: "\x1b[38;5;48m",
  yellow: "\x1b[33m",
  brightYellow: "\x1b[93m",
  white: "\x1b[37m",
  brightWhite: "\x1b[97m",
  gray: "\x1b[90m",
  red: "\x1b[31m",
  // Badges
  badgeCyan: "\x1b[46m\x1b[30m\x1b[1m",
  badgePurple: "\x1b[45m\x1b[30m\x1b[1m",
  badgeGreen: "\x1b[42m\x1b[30m\x1b[1m",
  badgeYellow: "\x1b[43m\x1b[30m\x1b[1m",
};

// Cross-platform URL opener
function openUrl(url, label = "URL") {
  const start =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
      ? "start"
      : "xdg-open";

  exec(`${start} "${url}"`, (err) => {
    if (err) {
      console.log(`\n${c.yellow}⚠️ Could not automatically launch browser. Please visit:${c.reset}\n${c.cyan}${c.underline}${url}${c.reset}\n`);
    } else {
      console.log(`\n${c.emerald}✓ Opening ${label} in your default browser...${c.reset}`);
      console.log(`${c.gray}→ ${url}${c.reset}\n`);
    }
  });
}

function printHeader() {
  console.clear();
  console.log(`
${c.cyan}  █████╗ ██████╗ ██╗████████╗██╗   ██╗ █████╗     ██╗  ██╗██╗   ██╗███╗   ███╗ █████╗ ██████╗ 
 ██╔══██╗██╔══██╗██║╚══██╔══╝╚██╗ ██╔╝██╔══██╗    ██║ ██╔╝██║   ██║████╗ ████║██╔══██╗██╔══██╗
 ███████║██║  ██║██║   ██║    ╚████╔╝ ███████║    █████╔╝ ██║   ██║██╔████╔██║███████║██████╔╝
 ██╔══██║██║  ██║██║   ██║     ╚██╔╝  ██╔══██║    ██╔═██╗ ██║   ██║██║╚██╔╝██║██╔══██║██╔══██╗
 ██║  ██║██████╔╝██║   ██║      ██║   ██║  ██║    ██║  ██╗╚██████╔╝██║ ╚═╝ ██║██║  ██║██║  ██║
 ╚═╝  ╚═╝╚═════╝ ╚═╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝${c.reset}
`);
}

function printHeroCard() {
  printHeader();
  console.log(`${c.indigo}╭───────────────────────────────────────────────────────────────────────────────────╮${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.bold}${c.brightWhite}ADITYA KUMAR${c.reset} ${c.gray}•${c.reset} ${c.brightCyan}Full-Stack Developer & AI Systems Engineer${c.reset}                     ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.emerald}🟢 Status:${c.reset} ${c.white}Available for Senior Roles, Contract & High-Impact Consulting${c.reset}      ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.yellow}💼 Current:${c.reset} ${c.white}Full Stack Developer at Feeding Trends${c.reset}                             ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.purple}📍 Location:${c.reset} ${c.white}Lucknow / Barabanki, Uttar Pradesh, India${c.reset}                          ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}                                                                                   ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.bold}${c.white}⚡ CORE COMPETENCIES:${c.reset}                                                             ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.dim}•${c.reset} ${c.cyan}Frontend Architecture:${c.reset}   Next.js 15 (App Router), React 19, TypeScript, Tailwind   ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.dim}•${c.reset} ${c.purple}Backend & Realtime:${c.reset}      NestJS, Node.js, Python (FastAPI/Django), WebSockets     ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.dim}•${c.reset} ${c.yellow}AI Voice & Messaging:${c.reset}    ElevenLabs Voice AI (<300ms), WhatsApp Cloud API, Gemini ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.dim}•${c.reset} ${c.emerald}Databases & Infra:${c.reset}       MongoDB Atlas, PostgreSQL, Redis, BullMQ, Docker Compose ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}                                                                                   ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.bold}${c.white}🌐 DIRECT LINKS:${c.reset}                                                                   ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.dim}•${c.reset} ${c.brightBlue}Portfolio:${c.reset}  ${c.underline}https://eraditya.vercel.app${c.reset}                                     ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.dim}•${c.reset} ${c.emerald}WhatsApp:${c.reset}   ${c.underline}https://wa.me/919473774390${c.reset}                                      ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.dim}•${c.reset} ${c.white}GitHub:${c.reset}     ${c.underline}https://github.com/ErAditya1${c.reset}                                    ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.dim}•${c.reset} ${c.blue}LinkedIn:${c.reset}   ${c.underline}https://linkedin.com/in/eraditya1${c.reset}                               ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.dim}•${c.reset} ${c.magenta}Email:${c.reset}      ${c.underline}mradityaji2@gmail.com${c.reset}                                           ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}                                                                                   ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.dim}Card Command:${c.reset} ${c.cyan}npx aditya-kumar@latest --connect${c.reset}                                  ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}╰───────────────────────────────────────────────────────────────────────────────────╯${c.reset}\n`);
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA REPOSITORIES
// ─────────────────────────────────────────────────────────────────────────────

const projects = [
  {
    id: "callio",
    title: "Callio AI — Outbound Calling & Conversational Voice AI Platform",
    tag: "Flagship AI Telephony",
    description:
      "Enterprise automated outbound dialing platform connecting Tata Smartflo cloud telephony with ElevenLabs neural voice synthesis for real-time <300ms conversational phone calls at scale.",
    architecture: [
      "Full-duplex WebSocket audio streaming pipeline with barge-in voice interruption detection.",
      "Decoupled NestJS API Gateway + Next.js 14 telemetry dashboard with live call waveform analytics.",
      "BullMQ + Redis job scheduling managing 10,000+ daily automated outbound calling campaigns.",
      "Post-call GPT-4 conversation summaries, sentiment evaluation, and CRM webhook sync.",
    ],
    tech: ["NestJS", "Next.js 14", "TypeScript", "PostgreSQL", "Prisma", "Redis", "BullMQ", "Socket.io", "Tata Smartflo", "ElevenLabs"],
    live: "https://callio.cheetahagi.com/",
    github: "https://github.com/ErAditya1/",
  },
  {
    id: "wautomator",
    title: "WAutomator — Enterprise WhatsApp Marketing & Automation SaaS",
    tag: "Enterprise SaaS",
    description:
      "Scalable multi-tenant WhatsApp automation SaaS built on Meta's official WhatsApp Cloud API, enabling automated bulk campaigns, Gemini AI chatbots, and real-time delivery telemetry.",
    architecture: [
      "Multi-tenant organization schema with RBAC and secure API key management.",
      "Google Gemini AI chatbot integration for context-aware customer support auto-replies.",
      "High-throughput BullMQ queue for high-volume broadcast campaigns with failover retries.",
      "Razorpay subscription ledger with credit-based messaging quota tracking.",
    ],
    tech: ["Next.js 15", "React 19", "NestJS", "PostgreSQL", "Redis", "BullMQ", "Prisma", "WhatsApp Cloud API", "Gemini AI", "Razorpay"],
    live: "https://whatsapp.billionairevox.com/",
    github: "https://github.com/ErAditya1/",
  },
  {
    id: "amplibuzz",
    title: "Amplibuzz (Amplibuz) — Influencer Marketing & Escrow Platform",
    tag: "Flagship Fintech SaaS",
    description:
      "High-performance platform connecting brands with social media creators using locked escrow wallets, automated Puppeteer post-verification scrapers, and instant reward payouts.",
    architecture: [
      "Automated headless Puppeteer workers verifying live sponsored posts across Instagram & YouTube.",
      "Locked escrow financial workflow ensuring brand transparency and guaranteed creator payment.",
      "Real-time event logging and analytics dashboard built with Next.js 14 and TailwindCSS.",
    ],
    tech: ["Next.js 14", "NestJS", "TypeScript", "PostgreSQL", "Prisma", "Redis", "BullMQ", "Puppeteer", "Razorpay"],
    live: "https://amplibuzz.com/",
    github: "https://github.com/ErAditya1/",
  },
  {
    id: "brightveil",
    title: "BrightVeil LMS — Enterprise Video Course & Certification Platform",
    tag: "EdTech Platform",
    description:
      "Full-stack Learning Management System engineered for high-speed video course delivery, instructor analytics dashboards, interactive quizzes, and automated certificate generation.",
    architecture: [
      "Next.js App Router frontend with Incremental Static Regeneration (ISR) for sub-second page loads.",
      "Cloudinary CDN video streaming hooks with automated compression and adaptive bitrate delivery.",
      "Comprehensive student progress telemetry, quiz evaluation, and Razorpay payment integration.",
    ],
    tech: ["Next.js", "React", "Node.js", "Express.js", "MongoDB", "Cloudinary", "Razorpay", "Tailwind CSS"],
    live: "https://brightveil.vercel.app/",
    github: "https://github.com/ErAditya1/BrightVeil-Next",
  },
  {
    id: "supertasky",
    title: "Super Tasky — Real-Time Collaborative Task & Team Workspace",
    tag: "Productivity",
    description:
      "Modern full-stack task management platform with real-time state synchronization, deadline reminders, priority matrices, and team collaboration boards.",
    architecture: [
      "WebSocket orchestration for instant task updates across active client sessions.",
      "JWT-based role authentication with granular team workspace permissions.",
    ],
    tech: ["Next.js", "Node.js", "Express.js", "MongoDB", "Socket.io", "Tailwind CSS", "Redux"],
    live: "https://supertasky.vercel.app/",
    github: "https://github.com/ErAditya1/Super-Tasky",
  },
  {
    id: "observiq",
    title: "Observiq (Trubetix) — Social Intelligence & AI Security Platform",
    tag: "AI & Security",
    description:
      "Enterprise social monitoring and content duplicate security platform aggregating public metrics across 10+ social networks with perceptual image hashing and sentiment analytics.",
    architecture: [
      "TF-IDF & pHash perceptual duplicate image detection algorithms.",
      "Asynchronous Python FastAPI microservice architecture with Redis queue workers.",
    ],
    tech: ["FastAPI", "Python", "Next.js 14", "PostgreSQL", "Redis", "Playwright", "Docker"],
    live: "https://observiq.cheetahagi.com/",
    github: "https://github.com/ErAditya1",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PROMPT & INTERACTIVE FLOWS
// ─────────────────────────────────────────────────────────────────────────────

function promptUser(query, callback) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(query, (answer) => {
    rl.close();
    callback(answer.trim());
  });
}

function showMainMenu() {
  printHeroCard();

  console.log(`${c.bold}${c.brightWhite}🧭 EXPLORE ADITYA'S PORTFOLIO CLI:${c.reset}\n`);
  console.log(`  ${c.cyan}[1]${c.reset} 🚀 ${c.bold}Explore Featured Projects${c.reset} ${c.dim}(Deep dive into architecture & live demos)${c.reset}`);
  console.log(`  ${c.cyan}[2]${c.reset} 🛠️  ${c.bold}Tech Stack & Capabilities Matrix${c.reset}`);
  console.log(`  ${c.cyan}[3]${c.reset} 💼 ${c.bold}Work Experience & Career Impact${c.reset}`);
  console.log(`  ${c.cyan}[4]${c.reset} 💬 ${c.bold}Connect & Hire Aditya${c.reset} ${c.emerald}(WhatsApp, Email, LinkedIn, Call)${c.reset}`);
  console.log(`  ${c.cyan}[5]${c.reset} 📄 ${c.bold}View / Download Resume (PDF)${c.reset}`);
  console.log(`  ${c.cyan}[6]${c.reset} 🌐 ${c.bold}Launch Web Portfolio${c.reset} ${c.dim}(https://eraditya.vercel.app)${c.reset}`);
  console.log(`  ${c.cyan}[7]${c.reset} 💡 ${c.bold}About Aditya & Engineering Philosophy${c.reset}`);
  console.log(`  ${c.red}[0]${c.reset} 🚪 ${c.dim}Exit CLI${c.reset}\n`);

  promptUser(`${c.brightYellow}👉 Enter option (0-7): ${c.reset}`, (choice) => {
    switch (choice) {
      case "1":
        showProjectsMenu();
        break;
      case "2":
        showTechStack();
        break;
      case "3":
        showExperience();
        break;
      case "4":
        showConnectMenu();
        break;
      case "5":
        openUrl("https://eraditya.vercel.app/images/ADITYA_RESUME.pdf", "Aditya's Resume PDF");
        setTimeout(showMainMenu, 2000);
        break;
      case "6":
        openUrl("https://eraditya.vercel.app", "Aditya's Portfolio Website");
        setTimeout(showMainMenu, 2000);
        break;
      case "7":
        showAboutPhilosophy();
        break;
      case "0":
      case "exit":
      case "q":
        console.log(`\n${c.emerald}✨ Thank you for checking out Aditya Kumar's CLI!${c.reset}`);
        console.log(`${c.dim}Connect anytime at:${c.reset} ${c.cyan}mradityaji2@gmail.com${c.reset} ${c.dim}| WhatsApp:${c.reset} ${c.green}+91 9473774390${c.reset}\n`);
        process.exit(0);
        break;
      default:
        console.log(`\n${c.yellow}⚠️ Invalid option. Please enter a number between 0 and 7.${c.reset}`);
        setTimeout(showMainMenu, 1500);
        break;
    }
  });
}

function showProjectsMenu() {
  printHeader();
  console.log(`${c.bold}${c.brightWhite}🚀 PRODUCTION PROJECTS & SYSTEM ARCHITECTURE:${c.reset}\n`);

  projects.forEach((p, idx) => {
    console.log(`  ${c.cyan}[${idx + 1}]${c.reset} ${c.bold}${p.title}${c.reset}`);
    console.log(`      ${c.yellow}Tag:${c.reset} ${p.tag} ${c.dim}|${c.reset} ${c.dim}Tech: ${p.tech.slice(0, 5).join(", ")}...${c.reset}\n`);
  });

  console.log(`  ${c.cyan}[B]${c.reset} ⬅️  ${c.dim}Back to Main Menu${c.reset}\n`);

  promptUser(`${c.brightYellow}👉 Select a project to inspect (1-${projects.length}) or B: ${c.reset}`, (ans) => {
    if (ans.toLowerCase() === "b" || ans === "0") {
      return showMainMenu();
    }

    const idx = parseInt(ans, 10) - 1;
    if (idx >= 0 && idx < projects.length) {
      showProjectDetail(projects[idx]);
    } else {
      console.log(`\n${c.yellow}⚠️ Invalid choice.${c.reset}`);
      setTimeout(showProjectsMenu, 1200);
    }
  });
}

function showProjectDetail(proj) {
  printHeader();
  console.log(`${c.indigo}╭───────────────────────────────────────────────────────────────────────────────────╮${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.bold}${c.brightWhite}${proj.title}${c.reset} ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.yellow}Category:${c.reset} ${proj.tag}                                                           ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}╰───────────────────────────────────────────────────────────────────────────────────╯${c.reset}\n`);

  console.log(`${c.bold}${c.white}📌 Overview:${c.reset}`);
  console.log(`  ${proj.description}\n`);

  console.log(`${c.bold}${c.cyan}🛠️ System Architecture Highlights:${c.reset}`);
  proj.architecture.forEach((arch) => {
    console.log(`  ${c.emerald}▸${c.reset} ${arch}`);
  });

  console.log(`\n${c.bold}${c.purple}⚡ Tech Stack:${c.reset}`);
  console.log(`  ${proj.tech.map((t) => `${c.gray}[${c.cyan}${t}${c.gray}]${c.reset}`).join(" ")}\n`);

  console.log(`${c.bold}${c.brightWhite}Actions for this project:${c.reset}`);
  console.log(`  ${c.cyan}[1]${c.reset} 🌐 Open Live Project in Browser`);
  console.log(`  ${c.cyan}[2]${c.reset} 🐙 Open GitHub Repository`);
  console.log(`  ${c.cyan}[B]${c.reset} ⬅️  Back to Projects List\n`);

  promptUser(`${c.brightYellow}👉 Choose action (1, 2, or B): ${c.reset}`, (act) => {
    if (act === "1") {
      openUrl(proj.live, proj.title);
      setTimeout(() => showProjectDetail(proj), 2000);
    } else if (act === "2") {
      openUrl(proj.github, `${proj.title} GitHub Repo`);
      setTimeout(() => showProjectDetail(proj), 2000);
    } else {
      showProjectsMenu();
    }
  });
}

function showTechStack() {
  printHeader();
  console.log(`${c.bold}${c.brightWhite}🛠️  TECHNICAL CAPABILITIES & ENGINEERING MATRIX:${c.reset}\n`);

  const matrix = [
    {
      category: "Frontend & UI Systems",
      skills: ["Next.js 15 (App Router)", "React 19", "TypeScript", "Tailwind CSS v4", "Framer Motion", "Shadcn UI", "Zustand", "TanStack React Query"],
    },
    {
      category: "Backend, APIs & Distributed Architecture",
      skills: ["NestJS", "Node.js", "Express.js", "Python (FastAPI & Django)", "RESTful APIs", "WebSockets (ws, Socket.io)", "BullMQ Queue Workers"],
    },
    {
      category: "AI, Voice Telephony & Automation",
      skills: ["ElevenLabs Conversational Voice AI (<300ms)", "Deepgram Speech-to-Text", "Meta WhatsApp Cloud API", "Google Gemini AI", "OpenAI GPT-4"],
    },
    {
      category: "Databases, Caching & Cloud Infrastructure",
      skills: ["MongoDB Atlas (Mongoose)", "PostgreSQL (Prisma ORM)", "MySQL", "Redis (Cache & Queues)", "Cloudinary CDN", "Docker & Docker Compose", "Linux VPS / Nginx"],
    },
  ];

  matrix.forEach((sec) => {
    console.log(`${c.bold}${c.cyan}▸ ${sec.category}:${c.reset}`);
    console.log(`  ${sec.skills.map((s) => `${c.white}${s}${c.reset}`).join(`${c.gray} • ${c.reset}`)}\n`);
  });

  promptUser(`${c.brightYellow}Press ENTER to return to Main Menu... ${c.reset}`, () => {
    showMainMenu();
  });
}

function showExperience() {
  printHeader();
  console.log(`${c.bold}${c.brightWhite}💼 PROFESSIONAL WORK EXPERIENCE & TRACK RECORD:${c.reset}\n`);

  console.log(`${c.indigo}╭───────────────────────────────────────────────────────────────────────────────────╮${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.bold}${c.brightWhite}Full Stack Developer${c.reset} ${c.gray}@${c.reset} ${c.yellow}Feeding Trends${c.reset} ${c.emerald}[CURRENT ROLE]${c.reset}                      ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}│${c.reset}  ${c.dim}Focus: Real-time Telephony Systems, Multi-Tenant SaaS & Influencer Platforms${c.reset}     ${c.indigo}│${c.reset}`);
  console.log(`${c.indigo}╰───────────────────────────────────────────────────────────────────────────────────╯${c.reset}\n`);

  const achievements = [
    "Architected Callio AI, a high-throughput outbound dialing engine connecting Tata Smartflo cloud telephony with ElevenLabs neural voice AI for <300ms live phone calls.",
    "Engineered WAutomator, a multi-tenant WhatsApp marketing automation platform using Meta's official Cloud API, BullMQ queues, and Google Gemini AI chatbots.",
    "Developed automated content verification scrapers for Amplibuzz using Puppeteer and BullMQ workers, enabling instantaneous escrow payouts for social media creators.",
    "Engineered robust PostgreSQL schemas, Prisma ORM queries, and Redis caching layers for high concurrency and sub-100ms API response latency.",
  ];

  achievements.forEach((ach) => {
    console.log(`  ${c.emerald}✔${c.reset} ${ach}\n`);
  });

  promptUser(`${c.brightYellow}Press ENTER to return to Main Menu... ${c.reset}`, () => {
    showMainMenu();
  });
}

function showConnectMenu() {
  printHeader();
  console.log(`${c.bold}${c.brightWhite}💬 CONNECT & COLLABORATE WITH ADITYA:${c.reset}\n`);

  const connectOptions = [
    {
      title: "💬 Chat Directly on WhatsApp (+91 9473774390)",
      action: () => openUrl("https://wa.me/919473774390?text=Hi%20Aditya,%20I%20ran%20your%20CLI%20and%20would%20like%20to%20discuss%20a%20project/role!", "WhatsApp"),
    },
    {
      title: "✉️  Compose an Email (mradityaji2@gmail.com)",
      action: () => openUrl("mailto:mradityaji2@gmail.com?subject=Project%20Inquiry%20/%20Hiring%20Opportunity", "Email"),
    },
    {
      title: "💼 Connect on LinkedIn (/in/eraditya1)",
      action: () => openUrl("https://linkedin.com/in/eraditya1", "LinkedIn Profile"),
    },
    {
      title: "🐙 Follow on GitHub (@ErAditya1)",
      action: () => openUrl("https://github.com/ErAditya1", "GitHub Profile"),
    },
    {
      title: "📄 View / Download Resume (PDF)",
      action: () => openUrl("https://eraditya.vercel.app/images/ADITYA_RESUME.pdf", "Resume"),
    },
  ];

  connectOptions.forEach((opt, idx) => {
    console.log(`  ${c.cyan}[${idx + 1}]${c.reset} ${opt.title}`);
  });
  console.log(`  ${c.cyan}[B]${c.reset} ⬅️  Back to Main Menu\n`);

  promptUser(`${c.brightYellow}👉 Choose connection channel (1-${connectOptions.length}) or B: ${c.reset}`, (ans) => {
    if (ans.toLowerCase() === "b" || ans === "0") {
      return showMainMenu();
    }
    const idx = parseInt(ans, 10) - 1;
    if (idx >= 0 && idx < connectOptions.length) {
      connectOptions[idx].action();
      setTimeout(showConnectMenu, 2000);
    } else {
      console.log(`\n${c.yellow}⚠️ Invalid choice.${c.reset}`);
      setTimeout(showConnectMenu, 1200);
    }
  });
}

function showAboutPhilosophy() {
  printHeader();
  console.log(`${c.bold}${c.brightWhite}💡 ABOUT ADITYA & ENGINEERING PHILOSOPHY:${c.reset}\n`);

  console.log(`${c.cyan}❝ Software is written for humans first, computers second. Scalable systems require clean boundaries, strict typing, and relentless focus on user latency. ❞${c.reset}\n`);

  console.log(`${c.white}Aditya is a full-stack engineer and AI systems developer who thrives at the intersection of modern frontend elegance and distributed backend architecture.`);
  console.log(`Whether optimizing sub-300ms real-time audio WebSockets for AI telephony, scaling multi-tenant Redis job queues, or designing glassmorphic UI dashboards in Next.js, he builds production-grade software engineered for performance, resilience, and scale.${c.reset}\n`);

  console.log(`${c.yellow}• Preferred Stack:${c.reset} Next.js 15, TypeScript, NestJS, PostgreSQL, Redis, Docker, Tailwind CSS.`);
  console.log(`${c.emerald}• Core Focus:${c.reset} Real-time Telephony AI, WhatsApp Cloud API SaaS, High-Throughput APIs.\n`);

  promptUser(`${c.brightYellow}Press ENTER to return to Main Menu... ${c.reset}`, () => {
    showMainMenu();
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIALIZATION & CLI ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  printHeroCard();
  console.log(`Usage: npx aditya-kumar@latest [--connect]\n`);
  process.exit(0);
}

showMainMenu();
