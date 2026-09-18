import { useRef } from "react";
import { motion } from "framer-motion";
import useWindowStore from "#store/window";
import { projects } from "#constants/content";
import Lucide from "./icons";

const DesktopFolder = ({ p, delay }) => {
  const openWindow = useWindowStore((s) => s.openWindow);
  const dragged = useRef(false);

  return (
    <motion.button
      type="button"
      drag
      dragMomentum={false}
      // NOTE: never animate `x` here — it fights the drag transform and snaps
      // dragged icons back to their original spot on re-render.
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onDragStart={() => {
        dragged.current = false;
      }}
      onDrag={(e, info) => {
        if (Math.abs(info.offset.x) > 5 || Math.abs(info.offset.y) > 5) {
          dragged.current = true;
        }
      }}
      onClick={() => {
        if (dragged.current) {
          dragged.current = false;
          return;
        }
        openWindow("project", p);
      }}
      className="group flex w-24 cursor-grab flex-col items-center gap-1.5 text-center active:cursor-grabbing"
    >
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${p.accent} shadow-lg ring-1 ring-white/20 transition-transform group-hover:scale-105`}
      >
        <Lucide name="folder" size={26} className="text-white" />
      </div>
      <span className="rounded px-1 text-[11px] font-medium leading-tight text-[var(--text)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] group-hover:bg-white/10">
        {p.name}
      </span>
    </motion.button>
  );
};

const DesktopFolders = () => (
  <div className="absolute right-6 top-16 hidden flex-col gap-4 md:flex">
    {projects.map((p, i) => (
      <DesktopFolder key={p.id} p={p} delay={0.7 + i * 0.1} />
    ))}
  </div>
);

export default DesktopFolders;
