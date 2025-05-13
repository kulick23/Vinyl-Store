module.exports = [{
  files: ["**/*.{js,ts,tsx}"],
  languageOptions: {
    parser: require("@typescript-eslint/parser"),
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    }
  },
  plugins: {
    react: require("eslint-plugin-react"),
    "react-hooks": require("eslint-plugin-react-hooks"),
    "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    "jsx-a11y": require("eslint-plugin-jsx-a11y")
  },
  
  settings: {
    react: {
      version: "detect"
    }
  },

}];