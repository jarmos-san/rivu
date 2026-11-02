import starlight from "@astrojs/starlight";
// @ts-check
import { defineConfig } from "astro/config";
import starlightThemeRapide from "starlight-theme-rapide";

export default defineConfig({
  integrations: [
    starlight({
      plugins: [starlightThemeRapide()],
      sidebar: [
        { label: "Get Started", slug: "get-started" },
        { label: "API Reference", slug: "api-reference" },
        { label: "Contributing Guidelines", slug: "contributing-guidelines" },
      ],
      social: [
        {
          href: "https://github.com/Jarmos-san/rivu",
          icon: "github",
          label: "GitHub",
        },
      ],
      title: "Rivu",
    }),
  ],
  site: "https://rivu.jarmos.dev",
});
