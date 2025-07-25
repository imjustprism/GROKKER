import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import stylistic from "@stylistic/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import sortPlugin from "eslint-plugin-simple-import-sort";
import unusedPlugin from "eslint-plugin-unused-imports";
import header from "eslint-plugin-simple-header";
import pathAliasPlugin from "eslint-plugin-path-alias";
import { resolve } from "node:path";

export default [
    {
        ignores: ["node_modules/**", "dist/**", "*.lock", "*.md"],
    },
    {
        files: ["src/**/*.{ts,tsx,js,mjs}", "eslint.config.mjs"],
        settings: {
            react: {
                version: "18",
            },
        },
        plugins: {
            react: reactPlugin,
        },
        rules: {
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react/display-name": "off",
            "react/no-unescaped-entities": "off",
        },
    },
    {
        files: ["src/**/*.{ts,tsx,js,mjs}", "eslint.config.mjs"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                browser: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            "@stylistic": stylistic,
            "simple-header": header,
            "simple-import-sort": sortPlugin,
            "unused-imports": unusedPlugin,
            "path-alias": pathAliasPlugin,
        },
        rules: {
            semi: ["error", "always"],
            "no-console": ["warn", { allow: ["warn", "error", "info"] }],
            eqeqeq: ["error", "always", { null: "ignore" }],
            "arrow-body-style": ["error", "as-needed"],
            "object-shorthand": ["error", "always"],
            "prefer-const": ["error", { destructuring: "all" }],
            "no-var": "error",
            "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
            curly: ["error", "all"],
            "brace-style": ["error", "1tbs"],
            "keyword-spacing": ["error", { before: true, after: true }],
            "space-infix-ops": "error",
            "comma-spacing": ["error", { before: false, after: true }],
            "no-trailing-spaces": "error",

            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/consistent-type-imports": [
                "error",
                { prefer: "type-imports" },
            ],
            "@typescript-eslint/dot-notation": [
                "error",
                {
                    allowPrivateClassPropertyAccess: true,
                    allowProtectedClassPropertyAccess: true,
                },
            ],

            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            "unused-imports/no-unused-imports": "error",

            "simple-header/header": [
                "error",
                {
                    text: [
                        "GROKKER, a Grok Discord bot",
                        "Copyright (c) {year} {author}",
                        "SPDX-License-Identifier: GPL-3.0-or-later",
                    ],
                    templates: { author: [".*", "Prism and contributors"] },
                },
            ],
            yoda: "error",
            "prefer-destructuring": [
                "error",
                {
                    VariableDeclarator: { array: false, object: true },
                    AssignmentExpression: { array: false, object: false },
                },
            ],
            "operator-assignment": ["error", "always"],
            "no-useless-computed-key": "error",
            "no-unneeded-ternary": ["error", { defaultAssignment: false }],
            "no-invalid-regexp": "error",
            "no-constant-condition": ["error", { checkLoops: false }],
            "no-duplicate-imports": "error",
            "no-useless-escape": "error",
            "no-fallthrough": "error",
            "for-direction": "error",
            "no-async-promise-executor": "error",
            "no-cond-assign": "error",
            "no-dupe-else-if": "error",
            "no-duplicate-case": "error",
            "no-irregular-whitespace": "error",
            "no-loss-of-precision": "error",
            "no-misleading-character-class": "error",
            "no-prototype-builtins": "error",
            "no-regex-spaces": "error",
            "no-shadow-restricted-names": "error",
            "no-unexpected-multiline": "error",
            "no-unsafe-optional-chaining": "error",
            "no-useless-backreference": "error",
            "use-isnan": "error",
            "prefer-spread": "error",

            "path-alias/no-relative": [
                "error",
                {
                    paths: {
                        "@utils": resolve(import.meta.dirname, "src/utils"),
                        "@types": resolve(import.meta.dirname, "src/types"),
                        "@services": resolve(
                            import.meta.dirname,
                            "src/services"
                        ),
                    },
                },
            ],
        },
    },
];
