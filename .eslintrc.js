module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: 'eslint:recommended',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-extra-semi': 0,
    'no-unused-vars': 1
  }
};
