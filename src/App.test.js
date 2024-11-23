import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

test('renders App component', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /Predictive Maintenance System/i })).toBeInTheDocument(); // Use getByRole for specific query
  expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();
});

test('fetches data from backend and passes it to InteractiveDashboard', async () => {
  const mockData = [{ id: 1, name: 'Sample Data' }];
  axios.get.mockResolvedValue({ data: mockData });

  render(<App />);

  await waitFor(() => expect(axios.get).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND_URL}/data`));
  await waitFor(() => expect(screen.getByText(/Sample Data/i)).toBeInTheDocument());
});

test('system test for entire application flow', async () => {
  const mockData = [{ id: 1, name: 'Sample Data' }];
  axios.get.mockResolvedValue({ data: mockData });

  render(<App />);

  // Verify initial render
  expect(screen.getByRole('heading', { name: /Predictive Maintenance System/i })).toBeInTheDocument();
  expect(screen.getByText(/Welcome!/i)).toBeInTheDocument();

  // Navigate to EDA page
  fireEvent.click(screen.getByText((content, element) => element.tagName.toLowerCase() === 'a' && /Data Analysis Dashboard/i.test(content)));
  await waitFor(() => expect(screen.getByText(/Interactive Data Analysis/i)).toBeInTheDocument());

  // Navigate to Model Description page
  fireEvent.click(screen.getByText((content, element) => element.tagName.toLowerCase() === 'a' && /Model Description/i.test(content)));
  await waitFor(() => expect(screen.getByText(/Model Descriptions/i)).toBeInTheDocument());

  // Navigate to Model Querying page
  fireEvent.click(screen.getByText((content, element) => element.tagName.toLowerCase() === 'a' && /Model Querying/i.test(content)));
  await waitFor(() => expect(screen.getByText(/Submit/i)).toBeInTheDocument());

  // Navigate to Model Diagnostics page
  fireEvent.click(screen.getByText((content, element) => element.tagName.toLowerCase() === 'a' && /Model Diagnostics/i.test(content)));
  await waitFor(() => expect(screen.getByText(/Please select a model and class label to view the diagnostic plots./i)).toBeInTheDocument());
});
