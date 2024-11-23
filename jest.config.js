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
};