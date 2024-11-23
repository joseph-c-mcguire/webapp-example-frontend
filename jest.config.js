module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Transform JavaScript files using babel-jest
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios)', // Ignore node_modules except for axios
  ],
  moduleNameMapper: {
    "^axios$": "axios/dist/node/axios.cjs"
  },
  setupFilesAfterEnv: ['webapp-example-frontend/src/setupTests.js'], // Ensure setupTests.js is included
  collectCoverage: true, // Enable code coverage
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/index.js", // Exclude entry point
    "!src/reportWebVitals.js" // Exclude reportWebVitals
  ],
  coverageReporters: ["text", "lcov"], // Use text and lcov reporters
};