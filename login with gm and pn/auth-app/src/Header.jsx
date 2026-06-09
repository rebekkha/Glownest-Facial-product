import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; // Make sure this path points to your firebase.js file

export default function Header() {
  const [user, setUser] = useState(null);

  // Listen to Firebase to see if someone is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Helper function to extract the first letter of the user's name
  const getFirstLetter = () => {
    if (user && user.displayName) {
      return user.displayName.trim().charAt(0).toUpperCase();
    }
    if (user && user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'G'; // Fallback letter
  };

  return (
    <header className="glownest-main-header" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '20px 30px', position: 'relative', zIndex: 1000 }}>
      
      <div></div>

      <h1 className="glownest-main-title" style={{ margin: 0, textAlign: 'center', color: '#722f37' }}>GlowNest - Facial Products</h1>
      
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
          
          {/* AI Skin Scanner Link */}
          <a href="http://localhost:5174/" target="_blank" rel="noreferrer" title="Open AI Skin Scanner" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '28px', height: '28px', color: '#722f37', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color='#e5a9b4'} onMouseOut={(e) => e.currentTarget.style.color='#722f37'}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
          </a>

          {/* DYNAMIC PROFILE ICON */}
          {user ? (
            /* IF LOGGED IN: Show the First Letter Avatar in a Red Wine Circle */
            <a href="http://localhost:5180/" target="_blank" rel="noreferrer" title="Open Profile" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#722f37', // Red Wine Fill
                  color: '#fbcce1', // Baby Pink Letter
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  border: '2px solid transparent',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 5px rgba(114, 47, 55, 0.2)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#fbcce1'; e.currentTarget.style.color = '#722f37'; e.currentTarget.style.borderColor = '#722f37'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#722f37'; e.currentTarget.style.color = '#fbcce1'; e.currentTarget.style.borderColor = 'transparent'; }}
                >
                  {getFirstLetter()}
                </div>
            </a>
          ) : (
            /* IF LOGGED OUT: Show the standard outline person icon */
            <a href="http://localhost:5180/" target="_blank" rel="noreferrer" title="Login / Open Profile" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '28px', height: '28px', color: '#722f37', transition: 'color 0.3s' }} onMouseOver={(e) => e.currentTarget.style.color='#e5a9b4'} onMouseOut={(e) => e.currentTarget.style.color='#722f37'}>
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
            </a>
          )}

      </div>
    </header>
  );
}