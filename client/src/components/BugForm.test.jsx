import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BugForm from './BugForm';

global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));

describe('BugForm', () => {
  afterEach(() => { jest.clearAllMocks(); });

  it('renders all fields', () => {
    render(<BugForm />);
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Report Bug/i })).toBeInTheDocument();
  });

  it('shows error if title is missing', async () => {
    render(<BugForm />);
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'desc' } });
    fireEvent.click(screen.getByRole('button', { name: /Report Bug/i }));
    expect(await screen.findByText(/Title is required/i)).toBeInTheDocument();
  });

  it('submits form and resets on success', async () => {
    const onBugCreated = jest.fn();
    render(<BugForm onBugCreated={onBugCreated} />);
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Bug 1' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'desc' } });
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'in-progress' } });
    fireEvent.click(screen.getByRole('button', { name: /Report Bug/i }));
    await waitFor(() => expect(onBugCreated).toHaveBeenCalled());
    expect(screen.getByLabelText(/Title/i)).toHaveValue('');
    expect(screen.getByLabelText(/Description/i)).toHaveValue('');
    expect(screen.getByLabelText(/Status/i)).toHaveValue('open');
  });
}); 