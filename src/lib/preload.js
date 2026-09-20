import { loadStats } from "#lib/stats";

// Prefetched during the boot screen so windows open instantly afterwards.
// Most-likely-to-be-opened windows come first; heavy ones (ActivityMonitor,
// Resume) come last so they don't compete for bandwidth early on.
const WINDOW_LOADERS = [
  () => import("#windows/Finder"),
  () => import("#windows/Terminal"),
  () => import("#windows/Project"),
  () => import("#windows/About"),
  () => import("#windows/Contact"),
  () => import("#windows/Skills"),
  () => import("#windows/cp/CP"),
  () => import("#windows/dev/SystemDesign"),
  () => import("#windows/Achievements"),
  () => import("#windows/Resume"),
];

let started = false;

// Fire-and-forget warmup. Imports are staggered so bundler transforms
// (dev) and network fetches (prod) don't spike the main thread while the
// boot progress bar animates.
export function preloadApp() {
  if (started) return;
  started = true;

  loadStats().catch(() => {});

  WINDOW_LOADERS.forEach((load, i) => {
    setTimeout(() => load().catch(() => {}), 250 + i * 350);
  });
}
