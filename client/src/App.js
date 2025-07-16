import React, { useState } from 'react';
import BugForm from './components/BugForm';
import BugList from './components/BugList';

function App() {
  const [refresh, setRefresh] = useState(false);
  return (
    <div>
      <h1>Bug Tracker</h1>
      <BugForm onBugCreated={() => setRefresh(r => !r)} />
      <BugList key={refresh} />
    </div>
  );
}

export default App; 