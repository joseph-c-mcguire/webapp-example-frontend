import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

test('renders Footer component', () => {
  render(<Footer />);
  expect(screen.getByText(/© 2024 Sample Predictive Maintenance System/i)).toBeInTheDocument();
  expect(screen.getByText(/Developed by Joseph McGuire/i)).toBeInTheDocument();
});

afterEach(() => {
  jest.clearAllMocks();
});
