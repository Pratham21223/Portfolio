import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { dockApps } from "#constants/apps";
import useWindowStore from "#store/window";
import Lucide from "./icons";

const BASE_SIZE = 44; // desktop resting size
const MAX_SIZE = 74; // desktop magnified size

// Touch devices: icons shrink so every app fits on one row (no scrolling).
const TOUCH_MAX = 48; // tablets / wide phones
const TOUCH_MIN = 30; // below this we fall back to horizontal scroll
const TOUCH_GAP = 4; // must match `gap-1` on the dock
const DOCK_SIDE_SPACE = 36; // outer px-2 + dock px-2 + border, in px

// True only on devices with a real hovering pointer (mouse / trackpad).
// Phones and tablets report false, so we skip magnification + tooltips there.
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

const useCanHover = () => {
  const [canHover, setCanHover] = useState(
    () => typeof window !== "undefined" && window.matchMedia(HOVER_QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(HOVER_QUERY);
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return canHover;
};

const useViewportWidth = () => {
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 390
  );

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return width;
};

const DockIcon = ({
  app,
  mouseX,
  magnify,
  touchSize,
  onOpen,
  isOpen,
  onHover,
  onLeave,
}) => {
  const ref = useRef(null);
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0 };
    return val - bounds.x - BASE_SIZE / 2;
  });

  const widthSync = useTransform(
    distance,
    [-110, 0, 110],
    [BASE_SIZE, MAX_SIZE, BASE_SIZE]
  );
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 220,
    damping: 12,
  });

  // Magnify on desktop, fit-to-width size on touch / reduced-motion.
  const size = magnify ? width : touchSize;
  const iconSize = magnify ? 26 : Math.round(touchSize * 0.55);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onOpen}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{ width: size, height: size }}
      className="group relative flex shrink-0 touch-manipulation items-center justify-center rounded-[22%] outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-white/70"
      whileTap={{ scale: 0.85, y: 6 }}
      aria-label={app.name}
    >
      <div
        className={`absolute inset-0 rounded-[22%] bg-gradient-to-br ${app.grad} shadow-lg ring-1 ring-white/20`}
      />
      <div className="absolute inset-0 rounded-[22%] bg-gradient-to-b from-white/25 to-transparent" />
      <Lucide name={app.icon} size={iconSize} className="relative text-white" />
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

  const canHover = useCanHover();
  const prefersReducedMotion = useReducedMotion();
  const magnify = canHover && !prefersReducedMotion;

  // Largest icon size that fits every app on one row, capped for tablets.
  const viewportWidth = useViewportWidth();
  const count = dockApps.length;
  const fitSize = Math.floor(
    (viewportWidth - DOCK_SIDE_SPACE - (count - 1) * TOUCH_GAP) / count
  );
  const touchSize = Math.max(TOUCH_MIN, Math.min(TOUCH_MAX, fitSize));

  const handleOpen = (key) => {
    const win = windows[key];
    if (win?.isMinimized) return restoreWindow(key);
    if (win?.isOpen) return focusWindow(key);
    openWindow(key);
  };

  return (
    <div
      id="dock"
      className="fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[2000] flex justify-center px-2 sm:px-4"
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 24 }}
        onMouseMove={magnify ? (e) => mouseX.set(e.clientX) : undefined}
        onMouseLeave={() => {
          mouseX.set(Infinity);
          setTooltip(null);
        }}
        className="glass-strong flex max-w-full touch-pan-x items-end gap-1 overflow-x-auto overscroll-x-contain rounded-2xl px-2 pb-2 pt-2.5 shadow-2xl sm:max-w-[94vw] sm:gap-2 sm:px-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {dockApps.map((app) => (
          <DockIcon
            key={app.key}
            app={app}
            mouseX={mouseX}
            magnify={magnify}
            touchSize={touchSize}
            onOpen={() => handleOpen(app.key)}
            isOpen={windows[app.key]?.isOpen && !windows[app.key]?.isMinimized}
            onHover={
              canHover
                ? (e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    setTooltip({
                      name: app.name,
                      x: r.left + r.width / 2,
                      y: r.top,
                    });
                  }
                : undefined
            }
            onLeave={canHover ? () => setTooltip(null) : undefined}
          />
        ))}

        <span className="mx-1 hidden h-10 w-px shrink-0 self-center bg-[var(--glass-border)] sm:block" />
      </motion.div>

      {/* Tooltips are hover-only, so they never render on touch devices */}
      <AnimatePresence>
        {canHover && tooltip && (
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

      <div className="pointer-events-none fixed inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent sm:h-24" />
    </div>
  );
};

export default Dock;