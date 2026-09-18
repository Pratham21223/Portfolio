import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useContextMenuStore from "#store/context";
import Lucide from "./icons";

const MENU_W = 208;
const ITEM_H = 34;

const ContextMenu = () => {
  const { menu, closeMenu } = useContextMenuStore();

  // Clamp so the menu never renders off-screen near viewport edges.
  const clamped = menu
    ? {
        x: Math.max(8, Math.min(menu.x, window.innerWidth - MENU_W - 8)),
        y: Math.max(8, Math.min(menu.y, window.innerHeight - menu.items.length * ITEM_H - 16)),
      }
    : null;

  useEffect(() => {
    if (!menu) return;
    const onDown = () => closeMenu();
    const onEsc = (e) => e.key === "Escape" && closeMenu();
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, [menu, closeMenu]);

  return (
    <AnimatePresence>
      {menu && clamped && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.12 }}
          style={{ left: clamped.x, top: clamped.y }}
          className="glass-strong fixed z-[3000] w-52 rounded-xl p-1.5 shadow-2xl"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {menu.items.map((item, i) =>
            item.divider ? (
              <div key={i} className="my-1 h-px bg-[var(--glass-border)]" />
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => {
                  item.action?.();
                  closeMenu();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[13px] text-[var(--text)] transition-colors hover:bg-emerald-500/15"
              >
                {item.icon && (
                  <Lucide name={item.icon} size={14} className="text-[var(--text-muted)]" />
                )}
                {item.label}
              </button>
            ),
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContextMenu;
