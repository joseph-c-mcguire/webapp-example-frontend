import React from 'react';
import { render, screen } from '@testing-library/react';
import InteractiveDashboard from './InteractiveDashboard';

test('renders InteractiveDashboard component', () => {
  render(<InteractiveDashboard />);
  expect(screen.getByText(/Interactive Data Analysis/i)).toBeInTheDocument();
});