import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import globals from "globals";

export default [
  {
    files: ["../app/components/SiteHeader.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.es2022 },
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      "no-eval": "error",
      "no-new-func": "error",
      "no-debugger": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["../public/assets/social-engagement.js"],
    languageOptions: { globals: { ...globals.browser, ...globals.es2022 } },
    rules: {
      "no-eval": "error",
      "no-new-func": "error",
      "no-debugger": "error",
      "no-undef": "error",
    },
  },
];
