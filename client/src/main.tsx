import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import GamePage from "./pages/GamePage";

interface User {
  username: string;
  authType: string;
}

function SimpleApp() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check localStorage on first load only
  React.useEffect(() => {
    const stored = localStorage.getItem('authUser');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('authUser');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
  };

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('username') as HTMLInputElement;
    const username = input.value.trim();
    
    if (username.length < 3) {
      alert('Username must be at least 3 characters');
      setIsLoading(false);
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
        const newUser = {
          username: username,
          authType: 'guest'
        };
        localStorage.setItem('authUser', JSON.stringify(newUser));
        setUser(newUser);
      } else {
        const error = await response.json();
        alert(error.message || 'Username might already be taken. Please try another.');
      }
    } catch (error) {
      alert('Authentication failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  // Authenticated view - Load the full game
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
        <img 
          src="/attached_assets/GTC_Logo.png" 
          alt="Global Trade Tycoon" 
          style={{ width: '200px', marginBottom: '1rem' }}
          onError={(e) => { 
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        
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
            autoComplete="username"
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
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              background: isLoading ? '#a0aec0' : '#48bb78',
              color: 'white'
            }}
          >
            {isLoading ? 'Authenticating...' : '👤 Continue as Guest'}
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

createRoot(document.getElementById("root")!).render(<SimpleApp />);