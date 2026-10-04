import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative assets work on GitHub Pages repository URLs such as /Naija-Hustle/.
  base: "./"
});
