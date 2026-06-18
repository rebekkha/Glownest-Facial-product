import React from 'react';
import GlowNestProfile from './Auth'; // Imports your new circular modal

function App() {
  return (
    <div>
      {/* React Floating Back Button */}
      <a href="https://rebekkha.github.io/Glownest-Facial-product/" 
         style={{ position: 'absolute', top: '20px', left: '20px', padding: '10px 16px', backgroundColor: '#722f37', color: 'white', textDecoration: 'none', borderRadius: '6px', fontFamily: 'sans-serif', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 9999 }}>
          ← Back to Home Page
      </a>

      <GlowNestProfile />
    </div>
  );
}

export default App;