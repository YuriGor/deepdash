module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 2017
  },
  plugins: ['prettier'],
  rules: {
    // 'no-undef':1,
    'quotes': ["error", "single", { "avoidEscape": true }],
    'quote-props': ["error", "as-needed", { "keywords": true, "unnecessary": false }],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
        arrowParens: 'always',
        printWidth: 80,
      },
    ],
  },
};
