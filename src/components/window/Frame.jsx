import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { APP_WINDOWS } from "#constants/apps";
import useWindowStore from "#store/window";

const MENU_BAR = 28;

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const WindowControls = ({ windowKey }) => {
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const toggleMaximize = useWindowStore((s) => s.toggleMaximize);

  return (
    <div
      className="group flex items-center gap-2"
      onPointerDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          closeWindow(windowKey);
        }}
        className="flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57] ring-1 ring-black/20 transition-[filter] hover:brightness-110 active:brightness-90"
        aria-label="Close"
      >
        <svg viewBox="0 0 10 10" className="h-full w-full text-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          <path d="M3 3l4 4M7 3l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          minimizeWindow(windowKey);
        }}
        className="flex h-3 w-3 items-center justify-center rounded-full bg-[#febc2e] ring-1 ring-black/20 transition-[filter] hover:brightness-110"
        aria-label="Minimize"
      >
        <svg viewBox="0 0 10 10" className="h-full w-full text-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          <path d="M2.5 5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleMaximize(windowKey);
        }}
        className="flex h-3 w-3 items-center justify-center rounded-full bg-[#28c840] ring-1 ring-black/20 transition-[filter] hover:brightness-110"
        aria-label="Maximize"
      >
        <svg viewBox="0 0 10 10" className="h-full w-full text-black/60 opacity-0 transition-opacity group-hover:opacity-100">
          <path d="M3 2.8h4.2V7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none" />
          <path d="M7 7.2H2.8V3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none" />
        </svg>
      </button>
    </div>
  );
};

const WindowFrame = ({ windowKey, title, icon, children, footer }) => {
  const win = useWindowStore((s) => s.windows[windowKey]);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const setPosition = useWindowStore((s) => s.setPosition);
  const setSize = useWindowStore((s) => s.setSize);
  const activeKey = useWindowStore((s) => s.activeKey);

  const defaultSize = APP_WINDOWS[windowKey] ?? { w: 720, h: 520 };
  const [pos, setPos] = useState(win?.position ?? null);
  const [size, setSizeState] = useState(win?.size ?? defaultSize);
  const sizeRef = useRef(size);
  sizeRef.current = size;
  const posRef = useRef(pos);
  posRef.current = pos;
  const frameRef = useRef(null);
  const dragState = useRef(null);

  // Clamp size/position to the viewport every time the window opens. Covers
  // the first open (centering) and re-opens after the browser was resized,
  // when the persisted geometry may no longer fit on screen.
  useEffect(() => {
    if (!win?.isOpen) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const nextSize = {
      w: Math.min(size.w, vw - 32),
      h: Math.min(size.h, vh - MENU_BAR - 72),
    };
    const nextPos = pos
      ? {
          x: clamp(pos.x, -nextSize.w + 120, vw - 120),
          y: clamp(pos.y, MENU_BAR, vh - 60),
        }
      : {
          x: Math.max(8, (vw - nextSize.w) / 2),
          y: Math.max(MENU_BAR + 8, (vh - nextSize.h) / 2),
        };
    setPos(nextPos);
    setSizeState(nextSize);
    // Persist so maximize → restore returns to the clamped geometry.
    setPosition(windowKey, nextPos);
    setSize(windowKey, nextSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win?.isOpen]);

  // Keep windows inside the viewport when the browser window is resized,
  // and persist the clamped geometry so reopening uses up-to-date values.
  useEffect(() => {
    const onViewportResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const nextSize = {
        w: Math.min(sizeRef.current.w, vw - 16),
        h: Math.min(sizeRef.current.h, vh - MENU_BAR - 64),
      };
      setSizeState(nextSize);
      setSize(windowKey, nextSize);
      const p = posRef.current;
      if (p) {
        const nextPos = {
          x: clamp(p.x, -nextSize.w + 120, vw - 120),
          y: clamp(p.y, MENU_BAR, vh - 60),
        };
        setPos(nextPos);
        setPosition(windowKey, nextPos);
      }
    };
    window.addEventListener("resize", onViewportResize);
    return () => window.removeEventListener("resize", onViewportResize);
  }, [windowKey, setPosition, setSize]);

  const onPointerDown = useCallback(
    (e) => {
      focusWindow(windowKey);
      if (win?.isMaximized) return;
      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: pos.x,
        origY: pos.y,
        el: frameRef.current,
      };
      const onMove = (ev) => {
        const s = dragState.current;
        if (!s) return;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const nx = clamp(s.origX + ev.clientX - s.startX, -s.el.offsetWidth + 120, vw - 120);
        const ny = clamp(s.origY + ev.clientY - s.startY, MENU_BAR, vh - 60);
        s.el.style.left = `${nx}px`;
        s.el.style.top = `${ny}px`;
      };
      const onUp = (ev) => {
        const s = dragState.current;
        if (s) {
          const nx = clamp(s.origX + ev.clientX - s.startX, -s.el.offsetWidth + 120, window.innerWidth - 120);
          const ny = clamp(s.origY + ev.clientY - s.startY, MENU_BAR, window.innerHeight - 60);
          setPos({ x: nx, y: ny });
          setPosition(windowKey, { x: nx, y: ny });
        }
        dragState.current = null;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [focusWindow, windowKey, pos, setPosition, win?.isMaximized],
  );

  const onResizeDown = useCallback(
    (e) => {
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const origW = size.w;
      const origH = size.h;
      const onMove = (ev) => {
        const nw = clamp(origW + ev.clientX - startX, 360, window.innerWidth - 16);
        const nh = clamp(origH + ev.clientY - startY, 260, window.innerHeight - MENU_BAR - 16);
        setSizeState({ w: nw, h: nh });
      };
      const onUp = () => {
        setSize(windowKey, sizeRef.current);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [size, windowKey, setSize],
  );

  const open = Boolean(win?.isOpen);

  const displayPos =
    open && win.isMaximized
      ? { x: 0, y: MENU_BAR }
      : pos ?? { x: 100, y: 80 };
  const displaySize =
    open && win.isMaximized
      ? { w: "100vw", h: `calc(100dvh - ${MENU_BAR}px - 56px)` }
      : { w: size.w, h: size.h };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key={windowKey}
          ref={frameRef}
          data-window
          onPointerDown={() => focusWindow(windowKey)}
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{
          opacity: win.isMinimized ? 0 : 1,
          scale: win.isMinimized ? 0.6 : 1,
          y: win.isMinimized ? 200 : 0,
        }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        style={{
          left: displayPos.x,
          top: displayPos.y,
          width: displaySize.w,
          height: displaySize.h,
          zIndex: win.zIndex,
        }}
        className={`glass-strong absolute flex flex-col overflow-hidden rounded-xl shadow-[var(--shadow-window)] ${
          win.isMinimized ? "pointer-events-none" : ""
        }`}
      >
        <div
          onPointerDown={onPointerDown}
          onDoubleClick={() => {
            // Toggle: maximize on double-click, restore on double-click again.
            useWindowStore.getState().toggleMaximize(windowKey);
          }}
          className="flex h-9 shrink-0 cursor-default select-none items-center justify-between border-b border-[var(--glass-border)] bg-[var(--titlebar)] px-3"
        >
          <WindowControls windowKey={windowKey} />
          <div className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 items-center gap-2">
            {icon && <span className="text-[var(--text-muted)]">{icon}</span>}
            <span
              className={`text-[13px] font-semibold transition-opacity ${
                activeKey === windowKey ? "text-[var(--text)]" : "text-[var(--text-muted)] opacity-70"
              }`}
            >
              {title}
            </span>
          </div>
          <div className="w-14" />
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>

        {footer && (
          <div className="h-7 shrink-0 border-t border-[var(--glass-border)] bg-[var(--titlebar)] px-3 text-[11px] leading-7 text-[var(--text-faint)]">
            {footer}
          </div>
        )}

        {!win.isMaximized && (
          <div
            onPointerDown={onResizeDown}
            className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize"
          />
        )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WindowFrame;
