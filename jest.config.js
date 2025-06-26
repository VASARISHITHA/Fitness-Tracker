module.exports = {
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', 'backend/models'],
    moduleNameMapper: {
      '^@models/(.*)$': '<rootDir>/backend/models/$1',
      '^@components/(.*)$': '<rootDir>/frontend/src/components/$1',
    },
    testTimeout: 30000,
  };
  