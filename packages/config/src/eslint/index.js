// @powerletter/config - Shared ESLint v9 Flat Config
// Used by all packages in the monorepo

import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

/** Base config for all TypeScript + React packages */
export function createBaseConfig({ files = ["**/*.{ts,tsx}"] } = {}) {
  return [
    js.configs.recommended,
    {
      files,
      languageOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        parser: tsParser,
        parserOptions: {
          ecmaFeatures: { jsx: true },
        },
        globals: {
          ...globals.browser,
          ...globals.node,
        },
      },
      plugins: {
        "@typescript-eslint": tsPlugin,
        "react-hooks": reactHooks,
        "react-refresh": reactRefresh,
      },
      rules: {
        ...tsPlugin.configs.recommended.rules,
        ...reactHooks.configs.recommended.rules,
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          { argsIgnorePattern: "^_" },
        ],
        "react-refresh/only-export-components": [
          "warn",
          { allowConstantExport: true },
        ],
      },
    },
    {
      ignores: [
        "dist/**",
        "build/**",
        ".next/**",
        "node_modules/**",
        "src/wasm/**",
        "*.config.*",
      ],
    },
  ];
}

/** Next.js specific config (uses next lint under the hood) */
export function createNextConfig() {
  return [
    ...createBaseConfig(),
    {
      rules: {
        // Next.js specific relaxations
        "@typescript-eslint/no-require-imports": "off",
      },
    },
  ];
}

export default createBaseConfig();
