import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  server: {
    proxy: {
      "/api": {
        target: "https://vutungtungrental-backend.onrender.com/",
        changeOrigin: true,
        secure: false,
      },
      "/vehicle": {
        target: "https://vutungtungrental-backend.onrender.com/",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "https://vutungtungrental-backend.onrender.com/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
