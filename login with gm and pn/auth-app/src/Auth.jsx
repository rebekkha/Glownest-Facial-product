import React, { useState, useEffect } from 'react';
import { signInWithPopup, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from './firebase'; 

export default function GlowNestProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');

  // Listen to authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setNewName(currentUser.displayName || '');
      }
    });
    return () => unsubscribe();
  }, []);

 const handleGoogleLogin = async () => {
    try {
      setError('');
      
      // ADD THIS ONE LINE: It forces the Google popup to ask which account to use!
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update user profile name in Firebase
  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    try {
      setError('');
      await updateProfile(auth.currentUser, {
        displayName: newName
      });
      // Force state refresh to show new initial
      setUser({ ...auth.currentUser });
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update name: " + err.message);
    }
  };

  // Helper function to extract the very first letter of the name
  const getFirstLetter = () => {
    if (user && user.displayName) {
      return user.displayName.trim().charAt(0).toUpperCase();
    }
    if (user && user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'G';
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Poppins", "Segoe UI", sans-serif',
      // Very soft blush background for the whole page
      backgroundColor: '#fcf5f7',
      backgroundImage: `radial-gradient(circle at 80% 20%, rgba(114, 47, 55, 0.08) 0%, transparent 40%), 
                        radial-gradient(circle at 10% 80%, rgba(229, 169, 180, 0.15) 0%, transparent 50%)`
    }}>
      
      {/* Decorative Skincare & Botanical Elements floating outside the circle */}
      <div style={{ position: 'absolute', top: '12%', left: '20%', fontSize: '55px', opacity: 0.7, filter: 'drop-shadow(2px 4px 8px rgba(114,47,55,0.15))', transform: 'rotate(-15deg)' }}>🧴</div>
      <div style={{ position: 'absolute', bottom: '15%', left: '18%', fontSize: '60px', opacity: 0.6, filter: 'drop-shadow(2px 4px 8px rgba(114,47,55,0.15))', transform: 'rotate(25deg)' }}>🌿</div>
      <div style={{ position: 'absolute', top: '22%', right: '20%', fontSize: '50px', opacity: 0.7, filter: 'drop-shadow(2px 4px 8px rgba(114,47,55,0.15))', transform: 'rotate(15deg)' }}>💧</div>
      <div style={{ position: 'absolute', bottom: '18%', right: '22%', fontSize: '45px', opacity: 0.8, filter: 'drop-shadow(2px 4px 8px rgba(114,47,55,0.15))', transform: 'rotate(-10deg)' }}>✨</div>
      <div style={{ position: 'absolute', top: '8%', right: '45%', fontSize: '35px', opacity: 0.5, transform: 'rotate(45deg)' }}>🌸</div>

      {/* THE MAIN MODAL CIRCLE (Larger & Lighter) */}
      <div style={{
        width: '580px',  // Considerably larger size
        height: '580px', // Considerably larger size
        borderRadius: '50%',
        // Light gradient that fades into a soft red wine tint at the edges
        background: 'radial-gradient(circle at 40% 40%, #ffffff 0%, #fff0f3 60%, #f5dbe0 100%)', 
        border: '12px solid #722f37', // Thicker, elegant Red Wine Border
        boxShadow: '0 25px 60px rgba(114, 47, 55, 0.25), inset 0 0 40px rgba(114, 47, 55, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '50px',
        boxSizing: 'border-box',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
        transition: 'transform 0.3s ease-in-out'
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >

        {/* GLOWNEST HEADER */}
        <h1 style={{
          margin: '0 0 8px 0',
          color: '#722f37', // Red Wine
          fontSize: '36px', // Larger Title
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}>
          GlowNest
        </h1>
        <p style={{
          margin: '0 0 30px 0',
          color: '#722f37',
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '3px',
          opacity: 0.8
        }}>
          Natural Skincare
        </p>

        {error && (
          <p style={{
            color: '#722f37',
            background: 'rgba(255,255,255,0.8)',
            padding: '8px 16px',
            borderRadius: '15px',
            fontSize: '13px',
            margin: '0 0 20px 0',
            maxWidth: '80%',
            border: '1px solid #722f37'
          }}>
            {error}
          </p>
        )}

        {/* LOGGED IN VIEW */}
        {user ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* DYNAMIC FIRST LETTER PROFILE AVATAR */}
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              backgroundColor: '#722f37', // Red Wine Fill
              color: '#ffffff', // White Letter Text
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '42px',
              fontWeight: 'bold',
              marginBottom: '25px',
              boxShadow: '0 8px 16px rgba(114, 47, 55, 0.25)',
              border: '4px solid white'
            }}>
              {getFirstLetter()}
            </div>

            {/* USER DETAILS / EDIT MODE */}
            {!isEditing ? (
              <div style={{ color: '#722f37', marginBottom: '35px', width: '90%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <h3 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>
                    {user.displayName || "Glow Guest"}
                  </h3>
                  {/* Small Edit Button */}
                  <button 
                    onClick={() => setIsEditing(true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '2px', opacity: 0.8 }}
                    title="Edit Name"
                  >
                    ✏️
                  </button>
                </div>
                <p style={{ margin: '6px 0 0 0', fontSize: '14px', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </p>
              </div>
            ) : (
              /* Name Editing Field Form */
              <form onSubmit={handleUpdateName} style={{ display: 'flex', gap: '8px', marginBottom: '35px', width: '85%' }}>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  placeholder="Enter custom name"
                  required
                  style={{
                    flex: 1,
                    padding: '10px 15px',
                    borderRadius: '25px',
                    border: '2px solid #722f37',
                    backgroundColor: 'white',
                    color: '#722f37',
                    outline: 'none',
                    fontSize: '15px'
                  }}
                />
                <button 
                  type="submit" 
                  style={{ padding: '8px 18px', background: '#722f37', color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                >
                  Save
                </button>
              </form>
            )}

            {/* ACTION BUTTON */}
            <button
              onClick={handleSignOut}
              style={{
                padding: '12px 35px',
                background: '#722f37',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                fontSize: '16px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                boxShadow: '0 6px 15px rgba(114, 47, 55, 0.25)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.backgroundColor = '#5a242b'; }}
              onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.backgroundColor = '#722f37'; }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          /* LOGGED OUT VIEW */
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ color: '#722f37', fontSize: '16px', marginBottom: '40px', maxWidth: '80%', lineHeight: '1.6' }}>
              Sign in to manage your premium personalized facial solutions.
            </p>
            
            <button
              onClick={handleGoogleLogin}
              style={{
                padding: '15px 30px',
                background: '#722f37',
                color: 'white',
                border: 'none',
                borderRadius: '35px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 20px rgba(114, 47, 55, 0.25)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => { e.target.style.transform = 'scale(1.03)'; e.target.style.backgroundColor = '#5a242b'; }}
              onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.backgroundColor = '#722f37'; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.48 1 0 6.48 0 13.2s5.48 12.2 12.24 12.2c7.055 0 11.75-4.96 11.75-11.96 0-.81-.09-1.425-.2-2.015H12.24z"/>
              </svg>
              Continue with Gmail
            </button>
          </div>
        )}

      </div>
    </div>
  );
}