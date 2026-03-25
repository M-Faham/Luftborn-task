module.exports = {
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',
  rules: {
    'scope-enum': [2, 'always', ['core', 'shared', 'layout', 'dashboard']],
    'scope-empty': [2, 'never'],
    'body-leading-blank': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-case': [0],
  },
};
