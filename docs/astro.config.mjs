import starlight from "@astrojs/starlight";
// @ts-check
import { defineConfig } from "astro/config";
import starlightThemeRapide from "starlight-theme-rapide";

export default defineConfig({
  site: "https://rivu.jarmos.dev",
  integrations: [
    starlight({
      plugins: [starlightThemeRapide()],
      title: "Rivu",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/Jarmos-san/rivu",
        },
      ],
      sidebar: [
        { label: "Get Started", slug: "get-started" },
        { label: "API Reference", slug: "api-reference" },
        { label: "Contributing Guidelines", slug: "contributing-guidelines" },
      ],
    }),
  ],
});
