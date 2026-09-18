export const INITIAL_Z_INDEX = 1000;

// key -> default window dimensions (px). Position is auto-centered when null.
export const APP_WINDOWS = {
  finder: { w: 860, h: 560 },
  terminal: { w: 760, h: 500 },
  activity: { w: 780, h: 560 },
  skills: { w: 860, h: 600 },
  about: { w: 820, h: 600 },
  cp: { w: 900, h: 620 },
  sysdesign: { w: 940, h: 620 },
  aiprojects: { w: 860, h: 580 },
  achievements: { w: 720, h: 560 },
  contact: { w: 640, h: 560 },
  resume: { w: 720, h: 720 },
  project: { w: 900, h: 640 },
};

export const dockApps = [
  {
    key: "finder",
    name: "Projects",
    icon: "folder",
    grad: "from-sky-500 to-blue-600",
  },
  {
    key: "terminal",
    name: "Terminal",
    icon: "terminal",
    grad: "from-zinc-700 to-zinc-900",
  },
  {
    key: "activity",
    name: "Activity Monitor",
    icon: "activity",
    grad: "from-emerald-500 to-teal-600",
  },
  {
    key: "skills",
    name: "Skills",
    icon: "radar",
    grad: "from-cyan-500 to-sky-600",
  },
  {
    key: "about",
    name: "About Me",
    icon: "user",
    grad: "from-violet-500 to-purple-600",
  },
  {
    key: "cp",
    name: "Competitive Programming",
    icon: "trophy",
    grad: "from-amber-500 to-orange-600",
  },
  {
    key: "sysdesign",
    name: "System Design",
    icon: "network",
    grad: "from-rose-500 to-pink-600",
  },
  {
    key: "aiprojects",
    name: "AI Projects",
    icon: "sparkles",
    grad: "from-fuchsia-500 to-violet-600",
  },
  {
    key: "achievements",
    name: "Achievements",
    icon: "award",
    grad: "from-yellow-400 to-amber-600",
  },
  {
    key: "contact",
    name: "Contact",
    icon: "mail",
    grad: "from-emerald-500 to-green-600",
  },
  {
    key: "resume",
    name: "Resume",
    icon: "file-text",
    grad: "from-slate-500 to-slate-700",
  },
];
