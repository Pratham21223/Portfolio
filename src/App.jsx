import { lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Background,
  MenuBar,
  Dock,
  Hero,
  BootScreen,
  DesktopFolders,
  ContextMenu,
  Spotlight,
} from "#components";

import useBootStore from "#store/boot";
import useContextMenuStore from "#store/context";
import useWindowStore from "#store/window";
import { desktopMenuItems } from "#constants/ui";

const WIN_DEFS = [
  { key: "finder", C: lazy(() => import("#windows/Finder")) },
  { key: "terminal", C: lazy(() => import("#windows/Terminal")) },
  { key: "activity", C: lazy(() => import("#windows/ActivityMonitor")) },
  { key: "skills", C: lazy(() => import("#windows/Skills")) },
  { key: "about", C: lazy(() => import("#windows/About")) },
  { key: "cp", C: lazy(() => import("#windows/CP")) },
  { key: "sysdesign", C: lazy(() => import("#windows/SystemDesign")) },
  { key: "aiprojects", C: lazy(() => import("#windows/AIProjects")) },
  { key: "achievements", C: lazy(() => import("#windows/Achievements")) },
  { key: "contact", C: lazy(() => import("#windows/Contact")) },
  { key: "resume", C: lazy(() => import("#windows/Resume")) },
  { key: "project", C: lazy(() => import("#windows/Project")) },
];

const WindowHost = ({ k, C }) => {
  const isOpen = useWindowStore((s) => s.windows[k]?.isOpen);
  if (!isOpen) return null;
  return (
    <Suspense fallback={null}>
      <C />
    </Suspense>
  );
};

const DESKTOP_MENU = desktopMenuItems.map((item) =>
  item.divider
    ? { divider: true }
    : {
        label: item.label,
        icon: item.icon,
        action: () => useWindowStore.getState().openWindow(item.key),
      },
);

const App = () => {
  const booted = useBootStore((s) => s.booted);
  const openMenu = useContextMenuStore((s) => s.openMenu);

  const onContextMenu = (e) => {
    if (e.target.closest("nav, #dock, [data-window]")) return;
    e.preventDefault();
    openMenu(e.clientX, e.clientY, DESKTOP_MENU);
  };

  return (
    <main
      onContextMenu={onContextMenu}
      className="relative h-full w-full overflow-hidden"
    >
      <AnimatePresence>{!booted && <BootScreen key="boot" />}</AnimatePresence>

      {/* Mounted immediately so particles and the 3D scene initialize
          behind the boot overlay instead of after it fades. */}
      <Background />

      {booted && (
        <>
          <MenuBar />
          <Hero />
          <DesktopFolders />
          <Dock />
          <ContextMenu />
          <Spotlight />

          {WIN_DEFS.map(({ key, C }) => (
            <WindowHost key={key} k={key} C={C} />
          ))}
        </>
      )}
    </main>
  );
};

export default App;
