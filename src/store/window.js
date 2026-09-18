import { create } from "zustand";
import { APP_WINDOWS, INITIAL_Z_INDEX } from "#constants/apps";

const makeWindow = () => ({
  isOpen: false,
  isMinimized: false,
  isMaximized: false,
  zIndex: INITIAL_Z_INDEX,
  position: null,
  size: null,
  prev: null,
  data: null,
});

const initialWindows = Object.keys(APP_WINDOWS).reduce((acc, key) => {
  acc[key] = makeWindow();
  return acc;
}, {});

// Window zIndex increments on every focus/open and would eventually grow past
// the menu bar / dock (z-2000), letting windows cover system chrome. Renormalize
// all open windows to 1000..N (N <= MAX_WINDOW_Z) whenever we approach the cap.
const MAX_WINDOW_Z = 1500;

const renormalize = (windows, topKey) => {
  const open = Object.entries(windows)
    .filter(([k, w]) => w.isOpen && k !== topKey)
    .sort((a, b) => a[1].zIndex - b[1].zIndex);
  const next = { ...windows };
  let z = INITIAL_Z_INDEX;
  for (const [k, w] of open) {
    next[k] = { ...w, zIndex: z };
    z += 1;
  }
  if (topKey && next[topKey]) {
    next[topKey] = { ...next[topKey], zIndex: z };
    z += 1;
  }
  return { windows: next, nextZIndex: z + 1 };
};

const useWindowStore = create((set, get) => ({
  windows: initialWindows,
  nextZIndex: INITIAL_Z_INDEX + 1,
  activeKey: null,

  openWindow: (key, data = null, opts = {}) =>
    set((state) => {
      const win = state.windows[key];
      if (!win) return {};

      const isNew = !win.isOpen;

      if (state.nextZIndex > MAX_WINDOW_Z) {
        const { windows, nextZIndex } = renormalize(state.windows, key);
        return {
          activeKey: key,
          nextZIndex,
          windows: {
            ...windows,
            [key]: {
              ...windows[key],
              isOpen: true,
              isMinimized: false,
              data: data ?? win.data,
            },
          },
        };
      }

      // Always raise the window — re-opening from desktop folders, Finder, or
      // Spotlight should bring an existing window to the front, not hide it.
      return {
        activeKey: key,
        nextZIndex: state.nextZIndex + 1,
        windows: {
          ...state.windows,
          [key]: {
            ...win,
            isOpen: true,
            isMinimized: false,
            zIndex: state.nextZIndex,
            data: data ?? win.data,
            position: isNew ? opts.position ?? null : win.position,
            size: isNew ? opts.size ?? null : win.size,
          },
        },
      };
    }),

  closeWindow: (key) =>
    set((state) => {
      const win = state.windows[key];
      if (!win) return {};
      return {
        activeKey: state.activeKey === key ? null : state.activeKey,
        windows: {
          ...state.windows,
          [key]: { ...win, isOpen: false, isMinimized: false, data: null },
        },
      };
    }),

  focusWindow: (key) =>
    set((state) => {
      const win = state.windows[key];
      if (!win || !win.isOpen) return {};

      if (state.nextZIndex > MAX_WINDOW_Z) {
        return { activeKey: key, ...renormalize(state.windows, key) };
      }

      return {
        activeKey: key,
        nextZIndex: state.nextZIndex + 1,
        windows: {
          ...state.windows,
          [key]: { ...win, zIndex: state.nextZIndex },
        },
      };
    }),

  minimizeWindow: (key) =>
    set((state) => {
      const win = state.windows[key];
      if (!win) return {};
      return {
        activeKey: state.activeKey === key ? null : state.activeKey,
        windows: { ...state.windows, [key]: { ...win, isMinimized: true } },
      };
    }),

  restoreWindow: (key) => {
    const { focusWindow } = get();
    set((state) => {
      const win = state.windows[key];
      if (!win) return {};
      return { windows: { ...state.windows, [key]: { ...win, isMinimized: false } } };
    });
    focusWindow(key);
  },

  toggleMaximize: (key) =>
    set((state) => {
      const win = state.windows[key];
      if (!win) return {};
      const maximizing = !win.isMaximized;
      return {
        windows: {
          ...state.windows,
          [key]: {
            ...win,
            isMaximized: maximizing,
            prev: maximizing
              ? { position: win.position, size: win.size }
              : win.prev,
          },
        },
      };
    }),

  setPosition: (key, position) =>
    set((state) => {
      const win = state.windows[key];
      if (!win) return {};
      return { windows: { ...state.windows, [key]: { ...win, position } } };
    }),

  setSize: (key, size) =>
    set((state) => {
      const win = state.windows[key];
      if (!win) return {};
      return { windows: { ...state.windows, [key]: { ...win, size } } };
    }),
}));

export default useWindowStore;
