import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "#components": resolve(rootDir, "src/components"),
      "#constants": resolve(rootDir, "src/constants"),
      "#store": resolve(rootDir, "src/store"),
      "#windows": resolve(rootDir, "src/windows"),
      "#lib": resolve(rootDir, "src/lib"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("three") || id.includes("@react-three")) return "three";
          if (id.includes("recharts") || id.includes("d3-")) return "charts";
          if (id.includes("react-pdf") || id.includes("pdfjs")) return "pdf";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("lucide-react")) return "icons";
          return "vendor";
        },
      },
    },
  },
});
