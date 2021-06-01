module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  parserOptions: {
    project: ["./tsconfig.json"], // Specify it only for TypeScript files
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "airbnb-typescript/base",
    "plugin:prettier/recommended",
  ],
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
    "prettier/prettier": "error",
  },
};
