import { create } from "zustand";

const useBootStore = create((set) => ({
  booted: false,
  booting: true,

  finishBoot: () => set({ booted: true, booting: false }),
}));

export default useBootStore;
