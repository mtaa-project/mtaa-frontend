import prettierPlugin from "eslint-plugin-prettier"
import prettierConfig from "eslint-config-prettier"
import unicorn from "eslint-plugin-unicorn"
import tsParser from "@typescript-eslint/parser"
import tsEslintPlugin from "@typescript-eslint/eslint-plugin"
import unusedImports from "eslint-plugin-unused-imports"
import simpleImportSort from "eslint-plugin-simple-import-sort"

// This configuration file is highly inspired by:
// https://starter.obytes.com/getting-started/rules-and-conventions/

/** @type {import("eslint").FlatConfig[]} */
export default [
  {
    ignores: [
      "eslint.config.js",
      "metro.config.js",
      "android",
      "ios",
      ".env",
      "node_modules/",
      ".vscode",
      ".eslintcache",
      ".expo/",
      "dist/",
      "web-build/",
      "expo-env.d.ts",
      "*.orig.*",
      "*.jks",
      "*.p8",
      "*.p12",
      "*.key",
      "*.mobileprovision",
      ".metro-health-check*",
      "npm-debug.*",
      "yarn-debug.*",
      "yarn-error.*",
      ".DS_Store",
      "*.pem",
      ".env*.local",
      "*.tsbuildinfo",
    ],
  },

  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
      },
      sourceType: "module",
      ecmaVersion: "latest",
    },
    plugins: {
      prettier: prettierPlugin,
      unicorn,
      "unused-imports": unusedImports,
      "@typescript-eslint": tsEslintPlugin,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "prettier/prettier": "error",
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: ["/android", "/ios"],
        },
      ],

      "@typescript-eslint/comma-dangle": "off", // Avoid conflict rule between Eslint and Prettier
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
          disallowTypeAnnotations: true,
        },
      ], // Ensure `import type` is used when it's necessary
      "unused-imports/no-unused-imports": "error",
      "simple-import-sort/imports": "error", // Import configuration for `eslint-plugin-simple-import-sort`
      "simple-import-sort/exports": "error", // Export configuration for `eslint-plugin-simple-import-sort`
      "@typescript-eslint/no-unused-vars": "off",

      // "unused-imports/no-unused-vars": [
      //   "warn",
      //   {
      //     vars: "all",
      //     varsIgnorePattern: "^_",
      //     args: "after-used",
      //     argsIgnorePattern: "^_",
      //   },
      // ],

      // Expo-like React Native safe rules
      // "react-native/no-inline-styles": "warn",
      // "react-native/no-color-literals": "off",
    },
  },

  prettierConfig,
]
