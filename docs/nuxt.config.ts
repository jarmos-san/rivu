import tailwindcss from "@tailwindcss/vite";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: ["~/assets/css/main.css"],
  devtools: {
    enabled: true,
  },
  modules: ["@nuxt/content", "@nuxt/icon"],
  vite: {
    plugins: [tailwindcss()],
  },
});
