import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier/flat";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "next", "next/core-web-vitals", "prettier"),
  eslintConfigPrettier,
  {
    rules: {
      indent: ["error", 2],
      quotes: ["error", "double"],
      "@typescript-eslint/no-unused-vars": "warn"
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
