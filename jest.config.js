module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/src/', '<rootDir>/tests/'],
  collectCoverage: true,
  collectCoverageFrom: [
    '!src/*.tsx',
    '!src/routes/*',
    '!src/styles/*',
    'src/pages/**/*',
    'src/components/**/*',
  ],
  coverageDirectory: 'tests/coverage',
  testMatch: ['**/tests/**/*.spec.tsx'],
};
