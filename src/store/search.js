import { create } from "zustand";

const useSearchStore = create((set) => ({
  open: false,
  query: "",
  openSearch: () => set({ open: true, query: "" }),
  closeSearch: () => set({ open: false, query: "" }),
  setQuery: (q) => set({ query: q }),
  toggle: () =>
    set((s) =>
      s.open ? { open: false, query: "" } : { open: true, query: "" },
    ),
}));

export default useSearchStore;
