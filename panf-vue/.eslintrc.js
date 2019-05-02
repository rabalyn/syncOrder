module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['standard', 'plugin:vue/essential'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    quotes: 2, // 'single',
    semi: 2 // 'never'
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  plugins: ['vue']
}
