import { defineContentConfig, defineCollection } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content: defineCollection({
      source: { include: "**", prefix: "/docs" },
      type: "page",
    }),
  },
});
