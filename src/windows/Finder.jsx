import { useState } from "react";
import { motion } from "framer-motion";
import WindowFrame from "#components/window/Frame";
import Lucide from "#components/icons";
import useWindowStore from "#store/window";
import { projects } from "#constants/content";
import { finderSections, finderCopy, windowTitles } from "#constants/ui";

const Finder = () => {
  const openWindow = useWindowStore((s) => s.openWindow);
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("all");

  const filtered = projects.filter((p) => {
    const matchQ = p.name.toLowerCase().includes(query.toLowerCase());
    // Sections derive from the project's own category field — no hardcoded id
    // lists that silently break when new projects are added.
    const matchS = section === "all" || p.cat === section;
    return matchQ && matchS;
  });

  return (
    <WindowFrame windowKey="finder" title={windowTitles.finder} icon={<Lucide name="folder" size={13} />}>
      <div className="flex h-full">
        <aside className="hidden w-44 shrink-0 flex-col gap-0.5 border-r border-[var(--glass-border)] bg-[var(--glass)]/40 p-3 sm:flex">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)]">
            {finderCopy.favorites}
          </p>
          {finderSections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                section === s.id
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-[var(--text-muted)] hover:bg-white/5"
              }`}
            >
              <Lucide name={s.icon} size={14} />
              {s.label}
            </button>
          ))}
        </aside>

        <div className="min-w-0 flex-1 overflow-y-auto p-5">
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2">
            <Lucide name="search" size={14} className="text-[var(--text-faint)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={finderCopy.searchPlaceholder}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-faint)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {filtered.map((p, i) => (
              <motion.button
                key={p.id}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => openWindow("project", p)}
                className="group flex flex-col items-center gap-2 rounded-xl p-3 text-center transition-colors hover:bg-white/5"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${p.accent} shadow-lg`}
                >
                  <Lucide name="folder" size={26} className="text-white" />
                </div>
                <span className="text-sm font-medium text-[var(--text)]">{p.name}</span>
                <span className="-mt-1.5 text-[11px] text-[var(--text-faint)]">
                  {p.tagline}
                </span>
              </motion.button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="col-center h-40 text-sm text-[var(--text-faint)]">
              {finderCopy.empty}
            </div>
          )}
        </div>
      </div>
    </WindowFrame>
  );
};

export default Finder;
