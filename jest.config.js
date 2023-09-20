module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '!src/*.tsx',
    '!src/routes/*',
    '!src/styles/*',
    'src/pages/**/*',
    'src/components/**/*',
  ],
  coverageDirectory: 'tests/coverage',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  preset: 'ts-jest',
  roots: ['<rootDir>/src/', '<rootDir>/tests/'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.spec.tsx'],
  transform: {
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2|svg)$':
      'jest-transform-stub',
  },
  transformIgnorePatterns: ['\\\\node_modules\\\\'],
};
