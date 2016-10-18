module.exports = {
  extends: 'airbnb',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'script'
  },
  rules: {
    'strict': 0,
    'no-console': 0,
    'max-len': ['error', 150, 2, {
      ignoreUrls: true,
      ignoreComments: false,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    'comma-dangle': ['error', 'never'],
    'no-use-before-define': 0
  }
};
