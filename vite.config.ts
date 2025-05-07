import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target:
          "https://script.google.com/macros/s/AKfycbxDBOfSUnhWKrcvVYN6WpJTEjBOHXfXYC_1wY91u2mufHPrV8FdAJKgf2lJF7rueA-K/exec",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Elimina el prefijo /api de la ruta
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Create an alias '@' for the src directory
    },
  },
});
