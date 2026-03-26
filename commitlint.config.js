module.exports = {
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',
  rules: {
    'scope-enum': [2, 'always', ['core', 'ci', 'shared', 'layout', 'dashboard', 'ui']],
    'scope-empty': [2, 'never'],
    'body-leading-blank': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-case': [0],
  },
};
