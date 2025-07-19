import React from 'react';

const App = () => {
  console.log('App rendering...');

  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#fff',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333' }}>🚀 AllerChef Test</h1>
      <p style={{ color: '#666' }}>If you can see this, React is working!</p>
      <p style={{ color: 'green', fontWeight: 'bold' }}>✅ No errors detected</p>
    </div>
  );
};

export default App;
