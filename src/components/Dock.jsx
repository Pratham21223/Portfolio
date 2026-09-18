import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { dockApps } from "#constants/apps";
import useWindowStore from "#store/window";
import Lucide from "./icons";

const BASE_SIZE = 44;

const DockIcon = ({ app, mouseX, onOpen, isOpen, onHover, onLeave }) => {
  const ref = useRef(null);
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0 };
    return val - bounds.x - BASE_SIZE / 2;
  });

  const widthSync = useTransform(distance, [-110, 0, 110], [44, 74, 44]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 220,
    damping: 12,
  });

  return (
    <motion.button
      ref={ref}
      type="button"
      onMouseDown={onOpen}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{ width, height: width }}
      className="group relative flex shrink-0 items-center justify-center"
      whileTap={{ scale: 0.85, y: 6 }}
      aria-label={app.name}
    >
      <div
        className={`absolute inset-0 rounded-[22%] bg-gradient-to-br ${app.grad} shadow-lg ring-1 ring-white/20`}
      />
      <div className="absolute inset-0 rounded-[22%] bg-gradient-to-b from-white/25 to-transparent" />
      <Lucide name={app.icon} size={26} className="relative text-white" />
      {isOpen && (
        <span className="absolute -bottom-1.5 h-1 w-1 rounded-full bg-[var(--text-muted)] ring-1 ring-black/10" />
      )}
    </motion.button>
  );
};

const Dock = () => {
  const mouseX = useMotionValue(Infinity);
  const windows = useWindowStore((s) => s.windows);
  const openWindow = useWindowStore((s) => s.openWindow);
  const restoreWindow = useWindowStore((s) => s.restoreWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const [tooltip, setTooltip] = useState(null);

  const handleOpen = (key) => {
    const win = windows[key];
    if (win?.isMinimized) return restoreWindow(key);
    if (win?.isOpen) return focusWindow(key);
    openWindow(key);
  };

  return (
    <div
      id="dock"
      className="fixed inset-x-0 bottom-3 z-[2000] flex justify-center px-4"
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 24 }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => {
          mouseX.set(Infinity);
          setTooltip(null);
        }}
        className="glass-strong flex max-w-[94vw] items-end gap-2 overflow-x-auto rounded-2xl px-2.5 pb-2 pt-2.5 shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {dockApps.map((app) => (
          <DockIcon
            key={app.key}
            app={app}
            mouseX={mouseX}
            onOpen={() => handleOpen(app.key)}
            isOpen={windows[app.key]?.isOpen && !windows[app.key]?.isMinimized}
            onHover={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setTooltip({ name: app.name, x: r.left + r.width / 2, y: r.top });
            }}
            onLeave={() => setTooltip(null)}
          />
        ))}

        <span className="mx-1 h-10 w-px self-center bg-[var(--glass-border)]" />
      </motion.div>

      <AnimatePresence>
        {tooltip && (
          <motion.div
            key="dock-tooltip"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ left: tooltip.x, top: tooltip.y - 36 }}
            className="pointer-events-none fixed z-[3000] -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--glass-border-strong)] bg-[var(--glass-strong)] px-2.5 py-1 text-[11px] font-medium text-[var(--text)] shadow-xl backdrop-blur-xl"
          >
            {tooltip.name}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
    </div>
  );
};

export default Dock;
