import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import DiagnosticPlots from './DiagnosticPlots';
import axios from 'axios';

jest.mock('axios');

beforeAll(() => {
  window.URL.createObjectURL = jest.fn();
});

afterAll(() => {
  jest.restoreAllMocks();
});

test('renders DiagnosticPlots component', async () => {
  axios.get.mockResolvedValue({ data: [] }); // Mock axios get request

  render(
    <Router>
      <DiagnosticPlots data={[]} />
    </Router>
  );

  expect(screen.getByText(/Please select a model and class label to view the diagnostic plots./i)).toBeInTheDocument();
});