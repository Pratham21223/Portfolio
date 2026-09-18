// UI chrome strings & config shared across shell components.

export const menuItems = [
  { label: "Projects", key: "finder" },
  { label: "Skills", key: "skills" },
  { label: "CP", key: "cp" },
  { label: "System Design", key: "sysdesign" },
  { label: "About", key: "about" },
  { label: "Achievements", key: "achievements" },
  { label: "Contact", key: "contact" },
];

// Desktop right-click menu — actions are wired up in App.jsx.
export const desktopMenuItems = [
  { label: "New Terminal", icon: "terminal", key: "terminal" },
  { label: "Projects", icon: "folder", key: "finder" },
  { label: "Skills", icon: "radar", key: "skills" },
  { divider: true },
  { label: "About Me", icon: "user", key: "about" },
];

export const finderSections = [
  { id: "all", label: "All Projects", icon: "folder" },
  { id: "ai", label: "AI / Systems", icon: "sparkles" },
  { id: "web", label: "Full Stack", icon: "layers" },
];

export const finderCopy = {
  favorites: "Favorites",
  searchPlaceholder: "Search projects…",
  empty: "No projects found.",
};

export const bootCopy = {
  booting: "Booting prathfolio",
  ready: " — ready",
  waiting: "…",
};

// Window title bar labels — single source of truth for all window chrome.
export const windowTitles = {
  finder: "Projects",
  terminal: "Terminal",
  activity: "Activity Monitor",
  skills: "Skills",
  about: "About Me",
  cp: "Competitive Programming",
  sysdesign: "System Design",
  aiprojects: "AI Projects",
  achievements: "Achievements",
  contact: "Contact",
  resume: "Resume.pdf",
};

export const menuBarCopy = {
  brand: "Prath",
  search: "Search",
};

export const aboutCopy = {
  cgpa: "CGPA",
};

export const projectCopy = {
  features: "Key Features",
  architecture: "Architecture",
  techStack: "Tech Stack",
  source: "Source Code",
  demo: "Live Demo",
};

export const cpCopy = {
  viewProfile: "View profile →",
  solved: "Solved",
};

export const skillsCopy = {
  radar: "Tech Radar",
};

export const sysDesignCopy = {
  lifecycle: "Request Lifecycle",
};

export const activityCopy = {
  cfProgression: "Codeforces Rating Progression",
  leetDistribution: "LeetCode Problem Distribution",
};

export const resumeCopy = {
  download: "Download",
  byline: "Resume",
  loading: "Loading…",
  loadingLong: "Loading resume…",
  failedFooter: "Failed to load PDF",
  failedMessage: "Couldn't load the PDF.",
  openNewTab: "Open in new tab",
};

export const terminal = {
  prompt: "pratham@prathfolio",
  title: "pratham — zsh",
  footer: "zsh — 80×24",
  inputLabel: "Terminal input",
  welcome: [
    { type: "text", value: "prathfolio Terminal v2.0" },
    { type: "text", value: "Type 'help' to see available commands." },
    { type: "text", value: "" },
  ],
  helpTitle: "Available commands:",
  autocompleteTip: "Tip: press TAB to autocomplete, ↑/↓ for history.",
  skillsTitle: "Technical Skills",
  projectsTitle: "Featured Projects",
  projectsOpening: "Opening Projects in Finder…",
  experienceTitle: "Journey",
  resumeOpening: "Opening resume…",
  contactTitle: "Contact",
  emailLabel: "Email",
  locationLabel: "Location",
  opening: (name) => `Opening ${name}…`,
  linkNotFound: "link not found",
  commandNotFound:
    "command not found: {cmd}. Type 'help' for available commands.",
};

export const spotlightCopy = {
  placeholder: "Search apps, projects, links…",
  mailItem: "Say hello",
  emptyPrefix: "No results for",
  hintNavigate: "↑↓ navigate",
  hintOpen: "↵ open",
  hintClose: "esc close",
  resultsSuffix: "results",
};
