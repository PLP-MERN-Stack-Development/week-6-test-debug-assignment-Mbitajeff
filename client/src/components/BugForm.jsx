import React, { useState } from 'react';

const initialState = {
  title: '',
  content: '',
  status: 'open',
};

function BugForm({ onBugCreated }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.title) {
      setError('Title is required');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token',
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to create bug');
      setForm(initialState);
      if (onBugCreated) onBugCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Report a Bug</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <label>Title: <input name="title" value={form.title} onChange={handleChange} /></label>
      </div>
      <div>
        <label>Description: <textarea name="content" value={form.content} onChange={handleChange} /></label>
      </div>
      <div>
        <label>Status:
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </label>
      </div>
      <button type="submit" disabled={loading}>{loading ? 'Reporting...' : 'Report Bug'}</button>
    </form>
  );
}

export default BugForm; 