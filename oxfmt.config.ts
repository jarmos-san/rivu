import { defineConfig } from "oxfmt";

export default defineConfig({
  ignorePatterns: [
    "coverage/**",
    "dist/**",
    "node_modules/**",
    ".task/**",
    "docs/**",
    "pnpm-lock.yaml",
    "pnpm-workspace.yaml",
  ],
  jsdoc: {
    bracketSpacing: true,
    descriptionTag: true,
    descriptionWithDot: true,
    preferCodeFences: true,
    separateReturnsFromParam: true,
  },
  objectWrap: "preserve",
  printWidth: 80,
  proseWrap: "always",
  semi: true,
  singleQuote: false,
  sortImports: true,
  sortPackageJson: {
    sortScripts: true,
  },
  tabWidth: 2,
  trailingComma: "all",
});
