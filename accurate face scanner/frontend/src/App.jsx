import React from 'react';
import SkinScanner from './SkinScanner';

function App() {
  return (
    // Added position: 'relative' to the main container
    <div style={{ backgroundColor: '#ffe4e5', minHeight: '100vh', padding: '20px', position: 'relative' }}>
    

      <SkinScanner />
    </div>
  );
}

export default App;