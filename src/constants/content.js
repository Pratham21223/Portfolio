import {fallbackStats} from "#constants/stats";

export const profile = {
  name: "Pratham Kataria",
  title: "Competitive Programmer & Backend Engineer",
  tagline: "I design scalable systems and build AI-powered products.",
  email: "prathamrk.7@gmail.com",
  avatar: "https://github.com/Pratham21223.png",
  location: "Mumbai, India",
  education: "B.Tech Information Technology, DJSCE (2025–2029)",
  cgpa: "9.04",
};

export const roles = ["Competitive Programmer", "Full-Stack Developer"];

export const heroCopy = {
  status: "available for opportunities",
  shell: "zsh",
  extraRole: "Problem Solver",
};

export const heroWords = [...roles, heroCopy.extraRole];

export const socials = [
  {
    id: 1,
    text: "GitHub",
    icon: "github",
    link: "https://github.com/Pratham21223",
  },
  {
    id: 2,
    text: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/pratham-kataria-prk/",
  },
  {
    id: 3,
    text: "Codeforces",
    icon: "codeforces",
    link: "https://codeforces.com/profile/Pratham2123",
  },
  {
    id: 4,
    text: "CodeChef",
    icon: "codechef",
    link: "https://www.codechef.com/users/generous_hand",
  },
  {
    id: 5,
    text: "LeetCode",
    icon: "leetcode",
    link: "https://leetcode.com/u/Pratham3004/",
  },
  {
    id: 6,
    text: "Twitter/X",
    icon: "twitter",
    link: "https://x.com/prathamrk57",
  },
];

export const achievements = [
  {
    id: 1,
    title: "Codeforces Pupil (Max Rating 1277)",
    detail: "Solved 600+ competitive programming problems across platforms.",
    icon: "code",
  },
  {
    id: 2,
    title: "CodeChef 2★ (Max Rating 1503)",
    detail: "Active competitive programmer on CodeChef.",
    icon: "chef",
  },
  {
    id: 3,
    title: "Winner — Foundance Mumbai Hackathon 2025",
    detail: "Built and shipped a winning product under pressure.",
    icon: "trophy",
  },
  {
    id: 4,
    title: "Second Runner-Up — ADAPPT 4.0 Hackathon",
    detail: "Top 3 finish among competing teams.",
    icon: "medal",
  },
  {
    id: 5,
    title: "Top 28 Finalist — Blitz Cup SPIT",
    detail: "Advanced through multiple elimination rounds.",
    icon: "zap",
  },
  {
    id: 6,
    title: "Finalist — Zuup Faraway International Hackathon",
    detail: "Top 60 out of 10,000+ participants worldwide.",
    icon: "globe",
  },
  {
    id: 7,
    title: "2× Hackathon Finalist",
    detail: "Multiple podium and finalist appearances.",
    icon: "flag",
  },
  {
    id: 8,
    title: "Code Uncode Finalist",
    detail: "Competitive programming contest finalist.",
    icon: "code",
  },
];

export const projects = [
  {
    id: "palimind",
    cat: "ai",
    name: "Palimind",
    tagline: "Local-First AI Operating System",
    description:
      "A local-first AI OS that combines multimodal RAG, AI email management, OCR, and screen understanding into a single privacy-preserving workspace.",
    tech: [
      "Python",
      "FastAPI",
      "Electron",
      "Ollama",
      "RAG",
      "AI Agents",
      "OCR",
    ],
    metrics: [
      { label: "Embeddings", value: "4-bit quantized" },
      { label: "Architecture", value: "Agent swarm" },
      { label: "Mode", value: "Local-first" },
    ],
    features: [
      "Multimodal RAG engine with quantized embeddings",
      "Multi-account email sync with AI-drafted replies",
      "Real-time screen-to-text OCR with vision-LLM Q&A",
      "Agent swarm orchestration for complex workflows",
    ],
    architecture: [
      "Electron Shell",
      "FastAPI Core",
      "Ollama Runtime",
      "Vector Store",
    ],
    links: { github: "https://github.com/Pratham21223", demo: "https://palimind-demo.vercel.app" },
    accent: "from-emerald-500 to-cyan-500",
  },
  {
    id: "aerohacks",
    cat: "web",
    name: "Aerohacks",
    tagline: "AI-Powered Hackathon Platform",
    description:
      "An end-to-end hackathon management platform with QR authentication, team management, evaluation workflows, and AI-based resume analysis.",
    tech: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "JWT",
      "WebSockets",
      "Hugging Face",
    ],
    metrics: [
      { label: "Roles", value: "Admin / Judge / Participant" },
      { label: "Auth", value: "QR + JWT" },
      { label: "AI", value: "Resume + GitHub analysis" },
    ],
    features: [
      "Secure QR + JWT authentication with role-based access",
      "AI resume & GitHub analysis for skill extraction",
      "Real-time team management over WebSockets",
      "Structured evaluation workflows for judges",
    ],
    architecture: [
      "React SPA",
      "Express API",
      "MongoDB",
      "Hugging Face Inference",
    ],
    links: { github: "https://github.com/Pratham21223", demo: "https://aerohacks-demo.vercel.app" },
    accent: "from-sky-500 to-indigo-500",
  },
  {
    id: "fintrack",
    cat: "web",
    name: "Fintrack",
    tagline: "Finance Analytics Dashboard",
    description:
      "A finance dashboard with role-based access control, analytics visualizations, secure APIs, and protected routes for Admin, Analyst, and Viewer roles.",
    tech: ["React", "Node.js", "Express", "MongoDB", "JWT", "Recharts", "RBAC"],
    metrics: [
      { label: "Roles", value: "3-tier RBAC" },
      { label: "Auth", value: "JWT" },
      { label: "Charts", value: "Recharts" },
    ],
    features: [
      "Role-based UI & APIs with protected routes",
      "Analytics dashboard with interactive visualizations",
      "Modular, scalable CRUD architecture",
      "Granular permission system",
    ],
    architecture: ["React SPA", "Express API", "MongoDB", "Recharts"],
    links: { github: "https://github.com/Pratham21223", demo: "https://fintrack-demo.vercel.app" },
    accent: "from-violet-500 to-purple-500",
  },
];

export const skills = [
  { name: "C++", level: 92, category: "Languages" },
  { name: "Python", level: 88, category: "Languages" },
  { name: "JavaScript", level: 90, category: "Languages" },
  { name: "TypeScript", level: 82, category: "Languages" },
  { name: "Java", level: 75, category: "Languages" },
  { name: "Node.js", level: 90, category: "Backend" },
  { name: "Express.js", level: 88, category: "Backend" },
  { name: "REST APIs", level: 92, category: "Backend" },
  { name: "Redis", level: 70, category: "Backend" },
  { name: "PostgreSQL", level: 76, category: "Databases" },
  { name: "MongoDB", level: 85, category: "Databases" },
  { name: "React", level: 86, category: "Frontend" },
  { name: "Next.js", level: 74, category: "Frontend" },
  { name: "Tailwind CSS", level: 88, category: "Frontend" },
  { name: "RAG", level: 84, category: "GenAI" },
  { name: "LLM Applications", level: 80, category: "GenAI" },
  { name: "Agentic Workflows", level: 78, category: "GenAI" },
  { name: "System Design", level: 82, category: "Engineering" },
  { name: "Docker", level: 72, category: "Engineering" },
  { name: "Git", level: 90, category: "Engineering" },
];

export const skillCategories = [
  "Languages",
  "Backend",
  "Databases",
  "Frontend",
  "GenAI",
  "Engineering",
];

export const systemDesign = [
  {
    id: "redis",
    name: "Redis",
    role: "In-memory caching & queues",
    group: "Caching",
    desc: "Low-latency caching, session stores, and pub/sub for real-time workloads.",
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    role: "Relational core",
    group: "Databases",
    desc: "ACID transactions, indexing strategy, and relational modeling.",
  },
  {
    id: "mongo",
    name: "MongoDB",
    role: "Document store",
    group: "Databases",
    desc: "Flexible schema for rapid product iteration.",
  },
  {
    id: "rabbitmq",
    name: "Message Queues",
    role: "Async decoupling",
    group: "Queues",
    desc: "Event-driven pipelines and background job processing.",
  },
  {
    id: "rest",
    name: "REST APIs",
    role: "Interface layer",
    group: "APIs",
    desc: "Versioned, documented, secure API design.",
  },
  {
    id: "websockets",
    name: "WebSockets",
    role: "Real-time transport",
    group: "APIs",
    desc: "Bidirectional, low-latency communication.",
  },
  {
    id: "lb",
    name: "Load Balancing",
    role: "Traffic distribution",
    group: "Scaling",
    desc: "Horizontal scaling with health checks and routing.",
  },
  {
    id: "events",
    name: "Event-Driven Systems",
    role: "Loose coupling",
    group: "Scaling",
    desc: "Producers, consumers, and durable event logs.",
  },
];

export const timeline = [
  {
    year: "2025",
    title: "Started B.Tech in IT @ DJSCE",
    detail:
      "Began Information Technology at D. J. Sanghvi College of Engineering.",
  },
  {
    year: "2025",
    title: "First Hackathon Win",
    detail:
      "Winner at Foundance Mumbai Hackathon — shipped a product under pressure.",
  },
  {
    year: "2025",
    title: "Crossed 600 CP Problems",
    detail: "Reached Codeforces Pupil (1277) and CodeChef 2★ (1503).",
  },
  {
    year: "2026",
    title: "Deep into AI Systems",
    detail:
      "Building Palimind — a local-first AI OS with RAG, agents, and OCR.",
  },
  {
    year: "2026",
    title: "Backend & System Design Focus",
    detail:
      "Scaling MERN systems, Redis caching, queues, and event-driven architecture.",
  },
];

export const codeSnippets = [
  {
    lang: "python",
    title: "rag_retrieval.py",
    code: `def retrieve(query, top_k=5):
    q = embed(query)
    scores = index.similarity(q, top_k)
    ctx = [doc.text for doc in scores]
    return synthesize(query, ctx)`,
  },
  {
    lang: "js",
    title: "auth.middleware.js",
    code: `export const auth = (roles = []) =>
  (req, res, next) => {
    const t = verify(req.token);
    if (!roles.includes(t.role))
      return res.status(403).end();
    req.user = t; next();
  };`,
  },
  {
    lang: "cpp",
    title: "dijkstra.cpp",
    code: `while (!pq.empty()) {
  auto [d, u] = pq.top(); pq.pop();
  if (d > dist[u]) continue;
  for (auto [v, w] : g[u])
    if (dist[u] + w < dist[v])
      pq.push({dist[v] = dist[u] + w, v});
}`,
  },
];

// ---- Hero terminal window ----

export const heroTermPath = "~/portfolio";

export const heroCode = `
  const name: "${profile.name}",
  const role : "Problem Solver",
  const interests: { "CP", "System Design", "RAG", "LLMs" },
  const ratings = { cf: "${fallbackStats.codeforces.maxRating}", cc: "${fallbackStats.codechef.maxRating}" };
  const beyondCode = { "Spirituality","Cricket" };

  const mantra = "Eat. Sleep. Code. Repeat." ;)
  // Ready to build something extraordinary.`;

// ---- About / Contact copy ----

export const aboutBio =
  "I'm an IT undergraduate and backend & system design enthusiast who loves building AI-powered products. My interests span scalable backend architectures, distributed systems, RAG applications, developer tools, and full-stack product development — with a strong competitive programming foundation.";

export const contactCopy = {
  headline: "Let's connect",
  sub: "Got an idea, a role, or just want to talk tech?",
};

// ---- Competitive programming ----

export const cpPlatforms = [
  { key: "codeforces", name: "Codeforces", icon: "codeforces", color: "#1f8acb" },
  { key: "codechef", name: "CodeChef", icon: "codechef", color: "#5b4638" },
  { key: "leetcode", name: "LeetCode", icon: "leetcode", color: "#ffa116" },
];

export const cpFallbacks = {
  cfRank: "Pupil",
  ccStars: 2,
  cfHandle: "Pratham2123",
  ccHandle: "generous_hand",
};

export const cpStatMeta = [
  { icon: "flame", label: "Total Problems" },
  { icon: "trophy", label: "Contests" },
  { icon: "zap", label: "Best Rank" },
];

export const cpRefreshNote =
  "Live stats refresh weekly (Sunday 12:00 AM) via GitHub Actions.";

// ---- Activity monitor ----

export const leetDifficultyMeta = [
  { name: "Easy", color: "#34d399" },
  { name: "Medium", color: "#fbbf24" },
  { name: "Hard", color: "#f87171" },
];

export const activityStatMeta = [
  { icon: "github", label: "Repositories" },
  { icon: "flame", label: "Problems Solved" },
  { icon: "trophy", label: "Hackathons" },
  { icon: "folder", label: "Projects" },
  { icon: "user", label: "CGPA" },
  { icon: "github", label: "Followers" },
];

export const cpGaugeConfig = {
  codeforces: { label: "Codeforces", max: 2000 },
  codechef: { label: "CodeChef", max: 2000 },
  leetcode: { label: "LeetCode", max: 1000, sub: "Total solved" },
};

// ---- System design window ----

export const systemFlow = [
  { name: "Client", icon: "globe", color: "text-sky-400" },
  { name: "Load Balancer", icon: "layers", color: "text-emerald-400" },
  { name: "API Gateway", icon: "network", color: "text-cyan-400" },
  { name: "Redis Cache", icon: "database", color: "text-rose-400" },
  { name: "PostgreSQL", icon: "database", color: "text-amber-400" },
  { name: "Message Queue", icon: "workflow", color: "text-violet-400" },
  { name: "Workers", icon: "cpu", color: "text-fuchsia-400" },
];

// Content has no per-item icon; derive one from the group so caching, queue,
// and API items don't all render as generic database glyphs.
export const systemGroupIcon = {
  Caching: "zap",
  Databases: "database",
  Queues: "workflow",
  APIs: "network",
  Scaling: "layers",
};

// ---- AI projects window ----

export const aiFeatured = {
  title: "Palimind — Local-First AI OS",
  description:
    "Multimodal RAG, agent swarm orchestration, real-time OCR, and AI email management — all running locally with 4-bit quantized embeddings for privacy and speed.",
};

// ---- Resume ----

export const resumePdfUrl = "files/Pratham%20Kataria%206.pdf";
