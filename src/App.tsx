import React from 'react';

export const App: React.FC = () => {
  return (
    <div className="app-container">
      <header style={{ height: 'var(--header-height)', background: 'var(--bg-header)', display: 'flex', alignItems: 'center', padding: '0 1rem', borderBottom: '1px solid var(--border-color)' }}>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Flowchart Studio</h1>
      </header>
      <main className="app-main">
        <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>
          Flowchart Canvas Loading...
        </div>
      </main>
    </div>
  );
};

export default App;
