import React, { useEffect, useState } from 'react';

function BugList() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBugs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error('Failed to fetch bugs');
      const data = await res.json();
      setBugs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Delete this bug?')) return;
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer test-token' },
      });
      if (!res.ok) throw new Error('Failed to delete bug');
      fetchBugs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token',
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchBugs();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div>Loading bugs...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (bugs.length === 0) return <div>No bugs reported yet.</div>;

  return (
    <div>
      <h2>Bug List</h2>
      <ul>
        {bugs.map(bug => (
          <li key={bug._id} style={{ marginBottom: 16, border: '1px solid #ccc', padding: 8 }}>
            <strong>{bug.title}</strong> <br />
            <span>{bug.content}</span> <br />
            <span>Status: </span>
            <label htmlFor={`status-${bug._id}`}>Status:</label>
            <select
              id={`status-${bug._id}`}
              value={bug.status}
              onChange={e => handleStatusChange(bug._id, e.target.value)}
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <button style={{ marginLeft: 8 }} onClick={() => handleDelete(bug._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BugList; 