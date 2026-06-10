import React from 'react';
import SkinScanner from './SkinScanner';

function App() {
  return (
    // Changed background to Baby Pink
    <div style={{ backgroundColor: '#ffe4e5', minHeight: '100vh', padding: '20px' }}>
      <SkinScanner />
    </div>
  );
}

export default App;