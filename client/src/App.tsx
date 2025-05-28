import React from "react";
import GamePage from "./pages/GamePage";

// Simple authentication check without hooks
function getAuthenticatedUser() {
  try {
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { username: payload.username, authType: payload.authType };
    }
  } catch (error) {
    localStorage.removeItem('authToken');
  }
  return null;
}

function App() {
  const user = getAuthenticatedUser();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.reload();
  };

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('username') as HTMLInputElement;
    const username = input.value.trim();
    
    if (username.length < 3) {
      alert('Username must be at least 3 characters');
      return;
    }
    
    try {
      const response = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          deviceFingerprint: btoa(JSON.stringify({
            userAgent: navigator.userAgent,
            language: navigator.language,
            timestamp: Date.now()
          }))
        }),
      });
      
      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('authToken', userData.token);
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.message || 'Username might already be taken. Please try another.');
      }
    } catch (error) {
      alert('Authentication failed. Please try again.');
    }
  };

  // Authenticated user view - Load the full game
  if (user) {
    return <GamePage />;
  }

  // Login screen
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>Welcome to Global Trade Tycoon</h1>
        <p style={{ color: '#4a5568', marginBottom: '2rem' }}>Choose how you'd like to play</p>
        
        <button 
          onClick={() => window.location.href = '/api/auth/google'}
          style={{
            width: '100%',
            padding: '12px 24px',
            margin: '8px 0',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            background: '#4285f4',
            color: 'white'
          }}
        >
          🔑 Sign in with Google
        </button>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '16px 0',
          color: '#a0aec0',
          fontSize: '14px'
        }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
          <span style={{ padding: '0 12px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
        </div>
        
        <form onSubmit={handleGuestLogin}>
          <input 
            name="username"
            type="text" 
            placeholder="Enter your trading name"
            required
            minLength={3}
            maxLength={20}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px',
              marginBottom: '16px',
              boxSizing: 'border-box'
            }}
          />
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              background: '#48bb78',
              color: 'white'
            }}
          >
            👤 Continue as Guest
          </button>
        </form>
        
        <div style={{
          fontSize: '12px',
          color: '#718096',
          marginTop: '16px',
          lineHeight: '1.4'
        }}>
          <p>Google Sign-In: Secure your username across all devices</p>
          <p>Guest Mode: Quick access, username tied to this device only</p>
        </div>
      </div>
    </div>
  );
}

export default App;