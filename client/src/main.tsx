import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Simple authentication check without JWT parsing
function getAuthenticatedUser() {
  try {
    const userStr = localStorage.getItem('authUser');
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
  }
  return null;
}

function SimpleApp() {
  const user = getAuthenticatedUser();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
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
        localStorage.setItem('authUser', JSON.stringify({
          username: username,
          authType: 'guest'
        }));
        // Force a single reload to show the authenticated state
        setTimeout(() => window.location.reload(), 100);
      } else {
        const error = await response.json();
        alert(error.message || 'Username might already be taken. Please try another.');
      }
    } catch (error) {
      alert('Authentication failed. Please try again.');
    }
  };

  // Show game dashboard for authenticated users
  if (user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: 'white'
      }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.5)',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #4a5568'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Global Trade Tycoon</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#a0aec0' }}>Welcome, {user.username}!</span>
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                background: 'transparent',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: '2px solid #4a5568'
          }}>
            <h2 style={{ margin: '0 0 1rem 0', color: '#63b3ed' }}>Trading Status</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#48bb78' }}>$500</div>
                <div style={{ fontSize: '14px', color: '#a0aec0' }}>Cash</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4299e1' }}>$0</div>
                <div style={{ fontSize: '14px', color: '#a0aec0' }}>Bank</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f56565' }}>$2,000</div>
                <div style={{ fontSize: '14px', color: '#a0aec0' }}>Loan</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ed8936' }}>7</div>
                <div style={{ fontSize: '14px', color: '#a0aec0' }}>Days Left</div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'rgba(72, 187, 120, 0.2)',
            border: '2px solid #48bb78',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#48bb78' }}>🎉 Authentication Success!</h3>
            <p style={{ margin: 0, color: '#e2e8f0' }}>
              Your secure {user.authType === 'google' ? 'Google' : 'guest'} authentication is working perfectly! 
              Ready to start trading.
            </p>
          </div>
        </div>
      </div>
    );
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

createRoot(document.getElementById("root")!).render(<SimpleApp />);