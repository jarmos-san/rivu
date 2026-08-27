import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "error",
    nursery: "warn",
    pedantic: "off",
    perf: "warn",
    restriction: "off",
    style: "warn",
    suspicious: "warn",
  },
  env: {
    node: true,
    "shared-node-browser": true,
  },
  ignorePatterns: [
    "coverage/**",
    "dist/**",
    "node_modules/**",
    ".task/**",
    "docs/**",
  ],
  options: {
    maxWarnings: 10,
    reportUnusedDisableDirectives: "error",
    respectEslintDisableDirectives: false,
    typeAware: true,
    typeCheck: false,
  },
  overrides: [
    {
      files: ["*.config.ts"],
      rules: {
        "import/no-default-export": "allow",
        "node/no-top-level-await": "allow",
        "typescript/strict-boolean-expressions": "allow",
        "unicorn/max-nested-calls": "allow",
      },
    },
    {
      files: ["**/types/**/*.ts"],
      rules: {
        "import/no-default-export": "error",
        "import/no-named-export": "allow",
      },
    },
  ],
  plugins: [
    "eslint",
    "import",
    "jsdoc",
    "node",
    "oxc",
    "promise",
    "typescript",
    "unicorn",
  ],
  rules: {
    "import/no-named-export": "off",
    "no-ternary": "off",
    "sort-imports": "off",
  },
});
