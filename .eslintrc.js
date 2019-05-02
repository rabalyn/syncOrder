module.exports = {
  extends: 'standard',
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    quotes: 2, //'single',
    semi: 2 //'never'
  }
}
