import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile, heroCode, heroTermPath, heroCopy, heroWords } from "#constants/content";

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Ordered token rules — first match at a position wins, so semantic strings
// (name, role, interests, ratings, hobbies, mantra) outrank the generic
// editor-syntax palette (Tokyo Night inspired).
const TOKENS = [
  { re: /\/\/[^\n]*/, cls: "italic text-[#565f89]" },
  {
    re: new RegExp(`"${escRe(profile.name)}"`),
    cls: "bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text font-semibold text-transparent",
  },
  {
    re: /"Problem Solver"/,
    cls: "font-semibold text-violet-400",
  },
  { re: /"CP"/, cls: "font-medium text-sky-400" },
  { re: /"System Design"/, cls: "font-medium text-teal-300" },
  { re: /"RAG"/, cls: "font-medium text-emerald-300" },
  { re: /"LLMs"/, cls: "font-medium text-fuchsia-400" },
  {
    re: /"1287"/,
    cls: "font-semibold text-emerald-400",
  },
  {
    re: /"1503"/,
    cls: "font-semibold text-amber-300",
  },
  { re: /"Spirituality"/, cls: "font-medium text-purple-300" },
  { re: /"Cricket"/, cls: "font-medium text-orange-300" },
  {
    re: /"Eat\. Sleep\. Code\. Repeat\."/,
    cls: "italic font-medium text-slate-100",
  },
  { re: /"(?:[^"\\\n]|\\.)*"/, cls: "text-[#9ece6a]" },
  { re: /`(?:[^`\\]|\\.)*`/, cls: "text-[#9ece6a]" },
  {
    re: /\b(?:const|let|var|function|return|new|import|export|async|await)\b/,
    cls: "text-[#bb9af7]",
  },
  { re: /\b(?:true|false|null|undefined)\b/, cls: "text-[#ff9e64]" },
  { re: /\b\d+(?:\.\d+)?\b/, cls: "text-[#ff9e64]" },
  { re: /\b\w+(?=\s*:)/, cls: "text-[#7dcfff]" },
];

const MASTER = new RegExp(TOKENS.map((t) => `(${t.re.source})`).join("|"), "g");

const highlight = (src) => {
  const out = [];
  let last = 0;
  for (const m of src.matchAll(MASTER)) {
    if (m.index > last) {
      out.push(
        <span key={`p${last}`} className="text-[var(--text)]">
          {src.slice(last, m.index)}
        </span>,
      );
    }
    const gi = m.slice(1).findIndex((g) => g !== undefined);
    const tok = TOKENS[gi];
    if (!tok) continue;
    out.push(
      <span key={`t${m.index}`} className={tok.cls}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  if (last < src.length) {
    out.push(
      <span key={`e${last}`} className="text-[var(--text)]">
        {src.slice(last)}
      </span>,
    );
  }
  return out;
};

const Planets = () => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 overflow-hidden"
  >
    <div
      className="hero-planet hidden lg:block"
      style={{
        width: "11rem",
        height: "11rem",
        right: "6%",
        top: "12%",
        background:
          "radial-gradient(circle at 32% 30%, #d8b4fe, #7e22ce 55%, #3b0764)",
      }}
    >
      <div className="hero-planet-ring" />
    </div>
    <div
      className="hero-planet hidden md:block"
      style={{
        width: "4.5rem",
        height: "4.5rem",
        left: "8%",
        bottom: "16%",
        background:
          "radial-gradient(circle at 35% 30%, #fdba74, #c2410c 60%, #7c2d12)",
      }}
    />
    <div
      className="hero-planet hidden xl:block"
      style={{
        width: "7.5rem",
        height: "7.5rem",
        left: "4%",
        top: "20%",
        background:
          "radial-gradient(circle at 32% 28%, #a5f3fc, #0891b2 55%, #164e63)",
      }}
    />
    <div
      className="hero-planet"
      style={{
        width: "2.5rem",
        height: "2.5rem",
        right: "15%",
        bottom: "20%",
        background:
          "radial-gradient(circle at 35% 30%, #cbd5e1, #64748b 60%, #334155)",
      }}
    />
  </div>
);

const TypedCode = () => {
  const [count, setCount] = useState(0);
  const done = count >= heroCode.length;

  useEffect(() => {
    if (done) return undefined;
    const t = setTimeout(() => setCount((c) => c + 1), count === 0 ? 1200 : 20);
    return () => clearTimeout(t);
  }, [count, done]);

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: "auto" }}
      transition={{ height: { type: "spring", stiffness: 260, damping: 30 } }}
      style={{ overflow: "hidden" }}
    >
      <pre className="whitespace-pre-wrap break-words px-5 py-4 text-left font-mono text-[13px] leading-relaxed">
        {highlight(heroCode.slice(0, count))}
        <span className="typing-cursor" />
      </pre>
    </motion.div>
  );
};

const Hero = () => (
  <section className="absolute inset-0 flex overflow-y-auto px-6 py-10 text-center">
    <Planets />

    <div className="relative z-10 m-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="glass flex items-center gap-2.5 rounded-full px-4 py-1.5 font-mono text-[11px] tracking-wide text-[var(--text-muted)]"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {heroCopy.status}
        </motion.div>
        <div className="relative mt-7">
          <div className="absolute left-1/2 top-1/2 -z-10 h-44 w-[36rem] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-500/20 via-cyan-400/20 to-violet-500/25 blur-[90px]" />
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="hero-name text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl xl:text-8xl"
          >
            {profile.name}
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 text-base font-medium tracking-wide text-[var(--text-muted)] sm:text-lg"
        >
          {heroWords.map((w, i) => (
            <span key={w}>
              {w}
              {i < heroWords.length - 1 && (
                <span className="accent-text mx-2 font-semibold">·</span>
              )}
            </span>
          ))}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-9 w-[min(660px,92vw)]"
        >
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-violet-500/10 blur-2xl" />
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="glass-strong overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/5 transition-shadow duration-300 hover:shadow-[0_24px_80px_-16px_rgba(139,92,246,0.3)]"
          >
            <div className="group flex items-center gap-2 border-b border-[var(--glass-border-strong)] bg-black/25 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57] shadow-[0_0_6px_rgba(255,95,87,0.5)] transition-shadow duration-200 group-hover:shadow-[0_0_10px_rgba(255,95,87,0.85)]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e] shadow-[0_0_6px_rgba(254,188,46,0.5)] transition-shadow duration-200 group-hover:shadow-[0_0_10px_rgba(254,188,46,0.85)]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840] shadow-[0_0_6px_rgba(40,200,64,0.5)] transition-shadow duration-200 group-hover:shadow-[0_0_10px_rgba(40,200,64,0.85)]" />
              <span className="ml-3 font-mono text-xs font-medium text-cyan-300 transition-colors duration-200 group-hover:text-cyan-200">
                {heroTermPath}
              </span>
              <span className="ml-auto rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400 transition-colors duration-200 hover:bg-emerald-500/20 hover:text-emerald-300">
                {heroCopy.shell}
              </span>
            </div>
            <TypedCode />
          </motion.div>
        </motion.div>
      </div>
    </section>
);

export default Hero;
