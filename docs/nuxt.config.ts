import tailwindcss from "@tailwindcss/vite";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  content: {
    build: {
      markdown: {
        highlight: {
          langs: ["ts", "typescript", "xml", "bash", "json", "vue"],
          theme: "github-dark",
        },
      },
    },
  },
  css: ["~/assets/css/main.css"],
  devtools: {
    enabled: true,
  },
  modules: ["@nuxt/content", "@nuxt/icon"],
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/", "/docs/getting-started"],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
