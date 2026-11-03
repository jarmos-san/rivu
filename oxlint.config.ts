import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "error",
    nursery: "error",
    pedantic: "warn",
    perf: "error",
    restriction: "error",
    style: "warn",
    suspicious: "error",
  },
  env: {
    builtin: true,
    node: true,
  },
  ignorePatterns: ["**/sample.ts"],
  overrides: [
    {
      files: ["*.config.ts"],
      rules: {
        "node/no-process-env": [
          "error",
          { allowedVariables: ["VITEST", "CI", "GITHUB_ACTIONS"] },
        ],
      },
    },
    {
      files: ["tests/**/*.test.ts"],
      rules: { "import/no-relative-parent-imports": "off" },
    },
  ],
  plugins: [
    "typescript",
    "unicorn",
    "oxc",
    "eslint",
    "import",
    "jsdoc",
    "vitest",
    "node",
  ],
  rules: {
    "func-style": [
      "error",
      "declaration",
      {
        allowArrowFunctions: true,
        allowTypeAnnotation: true,
      },
    ],
    "import/no-default-export": "allow",
    "import/no-named-export": "off",
    "import/no-nodejs-modules": "off",
    "no-ternary": "allow",
    "no-undefined": "off",
    "one-var": "off",
    "sort-imports": "off",
    "vitest/no-importing-vitest-globals": "off",
    "vitest/prefer-strict-boolean-matchers": "off",
    "vitest/prefer-to-have-been-called-times": "allow",
  },
});
