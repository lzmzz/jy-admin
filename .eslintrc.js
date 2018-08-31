module.exports = {
  root: true,
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    'eol-last': 'off',
    'comma-dangle': 'off',
    'space-before-function-paren': 'off',
    'space-before-blocks': 'off',
    "spaced-comment": 'off',
    "block-spacing": 'off',
    "space-infix-ops": 'off',
    "keyword-spacing": 'off',
    "semi": 'off',
    "indent": 'off',
    "semi-spacing": 'off',
    "padded-blocks": 'off',
    "comma-spacing": 'off',
  }
}
