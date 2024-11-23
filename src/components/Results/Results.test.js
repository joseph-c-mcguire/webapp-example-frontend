import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Results from './Results';

test('renders Results component with no results', () => {
  render(<Results result={null} handleNewEntry={() => {}} />);
  expect(screen.getByText(/No results to display/i)).toBeInTheDocument();
});

test('renders Results component with results', () => {
  const result = { prediction: 'Class A' };
  render(<Results result={result} handleNewEntry={() => {}} />);
  expect(screen.getByText(/Predicted Class: Class A/i)).toBeInTheDocument();
});

test('calls handleNewEntry when Enter New Data button is clicked', () => {
  const handleNewEntry = jest.fn();
  const result = { prediction: 'Class A' };
  render(<Results result={result} handleNewEntry={handleNewEntry} />);
  fireEvent.click(screen.getByText(/Enter New Data/i));
  expect(handleNewEntry).toHaveBeenCalledTimes(1);
});
