import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MonitorForm from './MonitorForm';

describe('MonitorForm', () => {
  test('renders the form and submits data', () => {
    const setResult = jest.fn();

    render(<MonitorForm setResult={setResult} />);

    // Ensure the form is rendered
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Quality of the item:/i), { target: { value: 'M' } });
    fireEvent.change(screen.getByLabelText(/Air Temperature \[K\]/i), { target: { value: '300' } });
    fireEvent.change(screen.getByLabelText(/Process Temperature \[K\]/i), { target: { value: '310' } });
    fireEvent.change(screen.getByLabelText(/Rotational Speed \[rpm\]/i), { target: { value: '1500' } });
    fireEvent.change(screen.getByLabelText(/Torque \[Nm\]/i), { target: { value: '40' } });
    fireEvent.change(screen.getByLabelText(/Tool Wear \[min\]/i), { target: { value: '10' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    });
});