import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';

test('renders Header component', () => {
  render(
    <Router>
      <Header />
    </Router>
  );
  expect(screen.getByText(/Predictive Maintenance System/i)).toBeInTheDocument();
});

test('toggles menu on hamburger button click', () => {
  render(
    <Router>
      <Header />
    </Router>
  );
  const hamburgerButton = screen.getByRole('button');
  fireEvent.click(hamburgerButton);
  expect(screen.getByRole('navigation')).toHaveClass('open');
  fireEvent.click(hamburgerButton);
  expect(screen.getByRole('navigation')).not.toHaveClass('open');
});
