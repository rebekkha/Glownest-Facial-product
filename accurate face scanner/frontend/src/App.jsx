import React from 'react';
import SkinScanner from './SkinScanner';

function App() {
  return (
    // Added position: 'relative' to the main container
    <div style={{ backgroundColor: '#ffe4e5', minHeight: '100vh', padding: '20px', position: 'relative' }}>
      
      {/* React Floating Back Button */}
      <a href="https://rebekkha.github.io/Glownest-Facial-product/" 
         style={{ position: 'absolute', top: '20px', left: '20px', padding: '10px 16px', backgroundColor: '#722f37', color: 'white', textDecoration: 'none', borderRadius: '6px', fontFamily: 'sans-serif', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 9999 }}>
          ← Back to Home Page
      </a>

      <SkinScanner />
    </div>
  );
}

export default App;