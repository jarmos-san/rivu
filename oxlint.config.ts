import { defineConfig } from "oxlint";

export default defineConfig({
  ignorePatterns: ["coverage/**", "dist/**"],
  rules: {
    "no-unused-vars": "warn",
  },
});
