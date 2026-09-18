import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { dockApps } from "#constants/apps";
import { profile, projects, socials } from "#constants/content";
import { spotlightCopy } from "#constants/ui";
import useSearchStore from "#store/search";
import useWindowStore from "#store/window";
import Lucide from "./icons";

const Highlight = ({ text, q }) => {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="text-emerald-400">{text.slice(i, i + q.length)}</span>
      {text.slice(i + q.length)}
    </>
  );
};

const Spotlight = () => {
  const {
    open,
    query,
    setQuery,
    closeSearch: close,
    toggle,
  } = useSearchStore();
  const openWindow = useWindowStore((s) => s.openWindow);
  const inputRef = useRef(null);
  const [sel, setSel] = useState(0);

  const items = useMemo(
    () => [
      ...dockApps.map((a) => ({
        id: `app-${a.key}`,
        type: "App",
        icon: a.icon,
        name: a.name,
        action: () => openWindow(a.key),
      })),
      ...projects.map((p) => ({
        id: `project-${p.id}`,
        type: "Project",
        icon: "folder",
        name: p.name,
        desc: p.tagline,
        action: () => openWindow("project", p),
      })),
      ...socials.map((s) => ({
        id: `link-${s.id}`,
        type: "Link",
        icon: s.icon,
        name: s.text,
        action: () => window.open(s.link, "_blank", "noopener"),
      })),
      {
        id: "action-mail",
        type: "Link",
        icon: "mail",
        name: spotlightCopy.mailItem,
        desc: profile.email,
        action: () => {
          window.location.href = `mailto:${profile.email}`;
        },
      },
    ],
    [openWindow],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      [it.name, it.desc, it.type].some((f) => f?.toLowerCase().includes(q)),
    );
  }, [items, query]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      } else if (e.key === "Escape" && open) {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, toggle, close]);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        setSel(0);
        inputRef.current?.focus();
      });
    }
  }, [open]);

  useEffect(() => {
    document
      .getElementById(`sp-item-${sel}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  const run = (item) => {
    item.action();
    close();
  };

  const onInputKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(s + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[sel]) run(results[sel]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[3000] bg-black/40 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong mx-auto mt-[14vh] w-[min(560px,92vw)] overflow-hidden rounded-2xl shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-[var(--glass-border)] px-4 py-3">
              <Lucide
                name="search"
                size={15}
                className="shrink-0 text-emerald-400"
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSel(0);
                }}
                onKeyDown={onInputKey}
                placeholder={spotlightCopy.placeholder}
                spellCheck={false}
                className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-faint)]"
              />
              <kbd className="shrink-0 rounded border border-[var(--glass-border-strong)] bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-faint)]">
                esc
              </kbd>
            </div>

            <div className="max-h-[320px] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-[var(--text-faint)]">
                  {spotlightCopy.emptyPrefix} “{query}”
                </p>
              ) : (
                results.map((it, i) => {
                  const active = i === sel;
                  return (
                    <button
                      key={it.id}
                      id={`sp-item-${i}`}
                      type="button"
                      onMouseEnter={() => setSel(i)}
                      onClick={() => run(it)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                        active
                          ? "bg-emerald-400/10 ring-1 ring-emerald-400/30"
                          : ""
                      }`}
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ${
                          active
                            ? "bg-emerald-400/15 text-emerald-400 ring-emerald-400/30"
                            : "bg-white/5 text-[var(--text-muted)] ring-white/10"
                        }`}
                      >
                        <Lucide name={it.icon} size={14} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block truncate text-sm font-medium ${
                            active
                              ? "text-[var(--text)]"
                              : "text-[var(--text-muted)]"
                          }`}
                        >
                          <Highlight text={it.name} q={query} />
                        </span>
                        {it.desc && (
                          <span className="block truncate text-xs text-[var(--text-faint)]">
                            {it.desc}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 font-mono text-[9px] uppercase tracking-widest text-[var(--text-faint)]">
                        {it.type}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            <div className="flex items-center gap-4 border-t border-[var(--glass-border)] px-4 py-2 font-mono text-[10px] text-[var(--text-faint)]">
              <span>{spotlightCopy.hintNavigate}</span>
              <span>{spotlightCopy.hintOpen}</span>
              <span>{spotlightCopy.hintClose}</span>
              <span className="ml-auto">
                {results.length} {spotlightCopy.resultsSuffix}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Spotlight;
