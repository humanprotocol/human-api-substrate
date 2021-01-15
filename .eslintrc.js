// Copyright 2017-2020 @polkadot/api authors & contributors
// SPDX-License-Identifier: Apache-2.0

const base = require("@polkadot/dev/config/eslint.cjs");

module.exports = {
  ...base,
  ignorePatterns: [
    ".eslintrc.js",
    ".github/**",
    ".vscode/**",
    ".yarn/**",
    "**/build/*",
    "**/coverage/*",
    "**/node_modules/*",
  ],
  parserOptions: {
    ...base.parserOptions,
    project: ["./tsconfig.json"],
  },
  rules: {
    ...base.rules,
    // add override for any (a metric ton of them, initial conversion)
    "@typescript-eslint/no-explicit-any": "off",
    // these should be removed, there are 8 of them as errors
    "@typescript-eslint/no-non-null-assertion": "off",
    // this seems very broken atm, false positives
    "@typescript-eslint/unbound-method": "off",
    "header/header": "off",
    camelcase: "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "sort-keys": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    quotes: "off",
    "comma-dangle": "off",
    "object-curly-newline": "off",
    "space-before-function-paren": "off",
    "@typescript-eslint/no-misused-promises": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",
  },
};
