import '@testing-library/jest-dom';
import 'jest-extended'; // Add jest-extended matchers
import 'jest-canvas-mock';

// Mock for window.URL.createObjectURL
window.URL.createObjectURL = jest.fn();

// Teardown function to clean up after tests
afterAll(() => {
  window.URL.createObjectURL.mockRestore();
});