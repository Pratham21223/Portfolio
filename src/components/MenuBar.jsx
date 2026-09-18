import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import useWindowStore from "#store/window";
import useSearchStore from "#store/search";
import { menuItems, menuBarCopy } from "#constants/ui";
import Lucide from "./icons";

const Clock = () => {
  const [now, setNow] = useState(() => dayjs());

  useEffect(() => {
    const t = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <time className="font-mono text-xs tabular-nums text-[var(--text-muted)]">
      {now.format("ddd MMM D")}&nbsp;&nbsp;{now.format("h:mm A")}
    </time>
  );
};

const MenuBar = () => {
  const openWindow = useWindowStore((s) => s.openWindow);
  const activeKey = useWindowStore((s) => s.activeKey);
  const openSearch = useSearchStore((s) => s.openSearch);

  return (
    <motion.nav
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-strong fixed inset-x-0 top-0 z-[2000] flex h-10 items-center justify-between px-5 font-mono text-[13px]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-emerald-500/10 to-transparent" />

      <button
        type="button"
        onClick={() => openWindow("about")}
        aria-label="About"
        className="group flex items-center gap-1 rounded-md px-2 py-1 text-sm font-bold"
      >
        <span className="relative">
          <span className="absolute -inset-1.5 rounded-full bg-emerald-400/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative">
            <span className="text-emerald-400">&lt;</span>
            <span className="tracking-tight text-[var(--text)] transition-colors duration-300 group-hover:text-white">
              {menuBarCopy.brand}
            </span>
            <span className="text-emerald-400">&nbsp;/&gt;</span>
          </span>
        </span>
      </button>

      <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
        {menuItems.map(({ label, key }) => {
          const active = activeKey === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => openWindow(key)}
              className={`group relative rounded-md px-3 py-1.5 text-[12px] transition-colors duration-200 ${
                active
                  ? "text-emerald-400"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {label}
              <span
                className={`absolute inset-x-2.5 bottom-0.5 h-[2px] rounded-full bg-emerald-400/70 transition-transform duration-200 ${
                  active
                    ? "scale-x-0"
                    : "origin-center scale-x-0 group-hover:scale-x-100"
                }`}
              />
              {active && (
                <motion.span
                  layoutId="nav-active-underline"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-x-2.5 bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={openSearch}
          className="group flex h-7 items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-400/5 px-3 text-[11px] font-semibold text-emerald-400 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-400/15 hover:shadow-[0_0_18px_rgba(52,211,153,0.25)]"
        >
          <Lucide name="search" size={12} />
          <span className="hidden sm:inline">{menuBarCopy.search}</span>
          <kbd className="hidden rounded border border-emerald-400/40 bg-emerald-400/10 px-1 py-px font-mono text-[9px] transition-transform duration-200 group-hover:scale-105 sm:inline">
            ⌘K
          </kbd>
        </button>
        <div className="hidden h-4 w-px bg-white/10 lg:block" />
        <div className="hidden lg:block">
          <Clock />
        </div>
      </div>
    </motion.nav>
  );
};

export default MenuBar;
