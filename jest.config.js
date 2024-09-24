module.exports = {
  rootDir: 'src', // Sets the root directory for Jest to the 'src' folder
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@common/(.*)$': '<rootDir>/common/$1',
    '^@domains/(.*)$': '<rootDir>/domains/$1',
    '^@infrastructure/(.*)$': '<rootDir>/infrastructure/$1',
    '^@scripts/(.*)$': '<rootDir>/scripts/$1',
    '^@guards/(.*)$': '<rootDir>/guards/$1',
    '^@api/(.*)$': '<rootDir>/api/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['**/*.(t|j)s'],
};
