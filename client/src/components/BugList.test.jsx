import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import BugList from './BugList';

describe('BugList', () => {
  afterEach(() => { jest.resetAllMocks(); });

  it('shows loading state', () => {
    global.fetch = jest.fn(() => new Promise(() => {}));
    render(<BugList />);
    expect(screen.getByText(/Loading bugs/i)).toBeInTheDocument();
  });

  it('shows empty state', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
    render(<BugList />);
    expect(await screen.findByText(/No bugs reported yet/i)).toBeInTheDocument();
  });

  it('shows error state', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false }));
    render(<BugList />);
    expect(await screen.findByText(/Failed to fetch bugs/i)).toBeInTheDocument();
  });

  it('renders bug list and allows status update and delete', async () => {
    const bugs = [{ _id: '1', title: 'Bug 1', content: 'desc', status: 'open' }];
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(bugs) }) // fetchBugs
      .mockResolvedValueOnce({ ok: true }) // update status
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(bugs) }) // fetchBugs after update
      .mockResolvedValueOnce({ ok: true }) // delete
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) }); // fetchBugs after delete
    render(<BugList />);
    expect(await screen.findByText('Bug 1')).toBeInTheDocument();
    // Update status
    fireEvent.change(screen.getByRole('combobox', { name: /status/i }), { target: { value: 'resolved' } });
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/posts/1'), expect.objectContaining({ method: 'PUT' })));
    // Delete
    window.confirm = () => true;
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/posts/1'), expect.objectContaining({ method: 'DELETE' })));
    expect(await screen.findByText(/No bugs reported yet/i)).toBeInTheDocument();
  });
}); 