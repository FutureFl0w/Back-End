module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [
        2,
        'always',
        [
          'feat',
          'fix',
          'chore',
          'docs',
          'style',
          'refactor',
          'test',
          'perf',
          'ci',
          'build',
          'revert',
        ],
      ],
      'scope-empty': [2, 'never'],
      'scope-case': [2, 'always', 'lower-case'],
      'subject-max-length': [2, 'always', 72],
      'subject-case': [2, 'always', 'lower-case'],
      'subject-full-stop': [2, 'never', '.'],
      'body-max-line-length': [2, 'always', 100],
      //'references-empty': [2, 'never'],
    },
  };
  