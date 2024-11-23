import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react'; // Import act from react
import ModelDescription from './ModelDescription';

test('renders ModelDescription component', () => {
  act(() => {
    render(<ModelDescription />);
  });
  expect(screen.getByText(/Model Descriptions/i)).toBeInTheDocument();
  expect(screen.getByText((content, element) => element.tagName.toLowerCase() === 'strong' && /Gradient Boosting/i.test(content))).toBeInTheDocument(); // Use custom matcher for specific query
  expect(screen.getByText((content, element) => element.tagName.toLowerCase() === 'strong' && /Random Forest/i.test(content))).toBeInTheDocument(); // Use custom matcher for specific query
  expect(screen.getByText((content, element) => element.tagName.toLowerCase() === 'strong' && /Decision Tree/i.test(content))).toBeInTheDocument(); // Use custom matcher for specific query
});

afterEach(() => {
  jest.clearAllMocks();
});