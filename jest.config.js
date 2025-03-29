/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'], // Note: We'll refine this in package.json scripts
  clearMocks: true, // Automatically clear mock calls and instances between every test
  // Removed maxWorkers: 1 to allow parallel execution for mock tests
}; 