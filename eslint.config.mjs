import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import htmlEslint from "@html-eslint/eslint-plugin";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import html from "eslint-plugin-html";
import importPlugin from "eslint-plugin-import";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [{
  ignores: [
    "**/*package.json",
    "**/package-lock.json",
    "**/dist",
    "**/node_modules",
    "**/karma.conf.js",
    "**/commitlint.config.js*",
    "**/.angular/cache"
  ],
}, ...fixupConfigRules(compat.extends(
  "eslint:recommended",
  "plugin:@angular-eslint/recommended",
  "plugin:@angular-eslint/template/process-inline-templates",
  "plugin:@typescript-eslint/recommended",
  "plugin:prettier/recommended",
  "plugin:import/recommended",
)).map(config => ({
  ...config,
  files: ["**/*.ts"],
})), {
  files: ["**/*.ts"],

  plugins: {
    "@typescript-eslint": fixupPluginRules(typescriptEslint),
    "@html-eslint": htmlEslint,
    "import": fixupPluginRules(importPlugin),
  },

  languageOptions: {
    ecmaVersion: 5,
    sourceType: "script",

    parserOptions: {
      project: ["tsconfig.app.json", "tsconfig.spec.json"],
      createDefaultProgram: true,
    },
  },

  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: ["tsconfig.app.json", "tsconfig.spec.json"],
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
  },

  rules: {
    "@typescript-eslint/member-ordering": ["error", {
      default: [
        "public-static-field",
        "protected-static-field",
        "private-static-field",
        "public-instance-field",
        "protected-instance-field",
        "private-instance-field",
        "constructor",
        "public-instance-method",
        "protected-instance-method",
        "private-instance-method",
      ],
    }],

    "@angular-eslint/directive-selector": ["error", {
      type: "attribute",
      prefix: "luftborn",
      style: "camelCase",
    }],

    "@angular-eslint/component-selector": ["error", {
      type: ["element", "attribute"],
      prefix: "luftborn",
      style: "kebab-case",
    }],

    "no-inline-comments": "warn",

    "no-console": ["error", {
      allow: ["error"],
    }],

    "@typescript-eslint/no-explicit-any": "warn",
    "@angular-eslint/no-input-rename": "warn",
    "no-useless-constructor": "off",
    "@typescript-eslint/no-inferrable-types": "warn",
    "@typescript-eslint/no-empty-interface": "error",
    "@typescript-eslint/prefer-includes": "warn",
    "import/no-duplicates": "error",
    "import/no-cycle": ["error", {
      maxDepth: 10,
      ignoreExternal: true,
    }],
    "import/no-unresolved": "off",
    "import/named": "off",
    "@typescript-eslint/no-useless-constructor": "error",
    "@typescript-eslint/no-unused-vars": "off",
    "@angular-eslint/no-output-on-prefix": "warn",
    "@typescript-eslint/no-unused-expressions": "warn",
    "@typescript-eslint/prefer-readonly": "error",
    'no-control-regex': 0,
    "prettier/prettier": "off",
  },
}, ...fixupConfigRules(compat.extends("plugin:@angular-eslint/template/recommended")).map(config => ({
  ...config,
  files: ["**/*.html"],
})), {
  files: ["**/*.html"],

  plugins: {
    html,
  },

  rules: {
    "@angular-eslint/template/no-negated-async": "off",
    "@angular-eslint/template/eqeqeq": "error",
    "@angular-eslint/template/banana-in-box": "error",

    "@angular-eslint/template/no-inline-styles": ["error", {
      allowNgStyle: true,
    }]
  },

}];
