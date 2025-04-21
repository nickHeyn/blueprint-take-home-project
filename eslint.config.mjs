import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: typescriptEslintPlugin.configs.recommended,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "next", "next/core-web-vitals", "prettier"),
  ...compat.config({
    env: { node: true },
    extends: ["plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: ["@typescript-eslint"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-empty-interface": "error",
    },
  }),
  eslintConfigPrettier,
  {
    rules: {
      indent: ["error", 2],
      quotes: ["error", "double"],
      semi: ["error", "always"],
    },
  },
  {
    ignores: [
      "node_modules/*",
      ".next/*",
      ".vscode/*",
      "public/*",
      "src/lib/client/*",
      "**/*.js"
    ],
  }
];

export default eslintConfig;
