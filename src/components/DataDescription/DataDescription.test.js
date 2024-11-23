import React from 'react';
import { render, screen } from '@testing-library/react';
import DataDescription from './DataDescription';

test('renders DataDescription component', () => {
  render(<DataDescription />);
  expect(screen.getByText(/About the Dataset/i)).toBeInTheDocument();
  expect(screen.getByText(/Acknowledgements/i)).toBeInTheDocument();
});
