import { create } from "zustand";

const useContextMenuStore = create((set) => ({
  menu: null,

  openMenu: (x, y, items) => set({ menu: { x, y, items } }),
  closeMenu: () => set({ menu: null }),
}));

export default useContextMenuStore;
