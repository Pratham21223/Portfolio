import { profile, skills, projects, timeline, socials, aboutBio } from "#constants/content";
import { terminal, aboutCopy } from "#constants/ui";

export const COMMANDS = {
  help: { desc: "list all available commands", usage: "help" },
  about: { desc: "who am I", usage: "about" },
  skills: { desc: "my technical skills", usage: "skills" },
  projects: { desc: "featured projects", usage: "projects" },
  experience: { desc: "my journey so far", usage: "experience" },
  resume: { desc: "open my resume", usage: "resume" },
  contact: { desc: "how to reach me", usage: "contact" },
  github: { desc: "open GitHub profile", usage: "github" },
  linkedin: { desc: "open LinkedIn profile", usage: "linkedin" },
  codeforces: { desc: "open Codeforces profile", usage: "codeforces" },
  codechef: { desc: "open CodeChef profile", usage: "codechef" },
  leetcode: { desc: "open LeetCode profile", usage: "leetcode" },
  clear: { desc: "clear the terminal", usage: "clear" },
};

const link = (socialName) => socials.find((s) => s.text.toLowerCase() === socialName);

export function autocomplete(input) {
  const matches = Object.keys(COMMANDS).filter((c) => c.startsWith(input));
  if (matches.length === 1) return { value: matches[0], matches: [] };
  return { value: input, matches };
}

export function runCommand(raw) {
  const [cmd] = raw.trim().split(/\s+/);
  const key = (cmd || "").toLowerCase();

  const out = { lines: [], sideEffect: null };

  switch (key) {
    case "help":
      out.lines = [
        { type: "text", value: terminal.helpTitle },
        ...Object.entries(COMMANDS).map(([name, { desc }]) => ({
          type: "cmd",
          name,
          desc,
        })),
        { type: "text", value: "" },
        { type: "hint", value: terminal.autocompleteTip },
      ];
      break;

    case "about":
      out.lines = [
        { type: "title", value: profile.name },
        { type: "text", value: `${profile.education}` },
        { type: "text", value: `${aboutCopy.cgpa}: ${profile.cgpa}` },
        { type: "text", value: profile.tagline },
        { type: "text", value: "" },
        { type: "text", value: aboutBio },
      ];
      break;

    case "skills":
      out.lines = [
        { type: "title", value: terminal.skillsTitle },
        ...skills.map((s) => ({
          type: "skill",
          name: s.name,
          level: s.level,
          category: s.category,
        })),
      ];
      break;

    case "projects":
      out.lines = [
        { type: "title", value: terminal.projectsTitle },
        ...projects.map((p) => ({
          type: "project",
          name: p.name,
          tagline: p.tagline,
          tech: p.tech,
        })),
        { type: "text", value: "" },
        { type: "hint", value: terminal.projectsOpening },
      ];
      out.sideEffect = { type: "open-window", key: "finder" };
      break;

    case "experience":
      out.lines = [
        { type: "title", value: terminal.experienceTitle },
        ...timeline.map((t) => ({ type: "exp", year: t.year, title: t.title, detail: t.detail })),
      ];
      break;

    case "resume":
      out.lines = [{ type: "hint", value: terminal.resumeOpening }];
      out.sideEffect = { type: "open-window", key: "resume" };
      break;

    case "contact":
      out.lines = [
        { type: "title", value: terminal.contactTitle },
        { type: "text", value: `${terminal.emailLabel}: ${profile.email}` },
        { type: "text", value: `${terminal.locationLabel}: ${profile.location}` },
        ...socials.map((s) => ({ type: "link", name: s.text, url: s.link })),
      ];
      break;

    case "github":
    case "linkedin":
    case "codeforces":
    case "codechef":
    case "leetcode": {
      const s = link(key);
      if (s) {
        out.lines = [{ type: "hint", value: terminal.opening(s.text) }];
        out.sideEffect = { type: "open-link", url: s.link };
      } else {
        out.lines = [{ type: "err", value: terminal.linkNotFound }];
      }
      break;
    }

    case "clear":
      out.sideEffect = { type: "clear" };
      break;

    case "":
      out.lines = [];
      break;

    default:
      out.lines = [
        {
          type: "err",
          value: terminal.commandNotFound.replace("{cmd}", cmd),
        },
      ];
  }

  return out;
}
