// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
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
          icon: "github",
          label: "GitHub",
          href: "https://github.com/Jarmos-san/rivu",
        },
      ],
      title: "Rivu",
    }),
  ],
  site: "https://rivu.jarmos.dev",
});
