import React from "react";

function App() {
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
          src="/images/GTC_Logo.png" 
          alt="Global Trade Tycoon" 
          style={{ width: '200px', marginBottom: '1rem' }}
          onError={(e) => e.target.style.display = 'none'}
        />
        
        <div id="authScreen">
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
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
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
          
          <button 
            onClick={() => {
              document.getElementById('authScreen').style.display = 'none';
              document.getElementById('guestForm').style.display = 'block';
            }}
            style={{
              width: '100%',
              padding: '12px 24px',
              margin: '8px 0',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              background: 'transparent',
              color: '#4a5568',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            👤 Continue as Guest
          </button>
          
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
        
        <div id="guestForm" style={{ display: 'none' }}>
          <h1 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>Guest Mode</h1>
          <p style={{ color: '#4a5568', marginBottom: '2rem' }}>Enter your trading name</p>
          
          <form onSubmit={async (e) => {
            e.preventDefault();
            const username = e.target.username.value.trim();
            
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
                alert(`Welcome ${userData.user.username}! Your secure authentication is working perfectly.`);
              } else {
                const error = await response.json();
                alert(error.message || 'Username might already be taken. Please try another.');
              }
            } catch (error) {
              alert('Authentication failed. Please try again.');
            }
          }}>
            <input 
              name="username"
              type="text" 
              placeholder="Enter your trading name"
              required
              minLength="3"
              maxLength="20"
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
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  document.getElementById('guestForm').style.display = 'none';
                  document.getElementById('authScreen').style.display = 'block';
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  background: 'transparent',
                  color: '#4a5568'
                }}
              >
                Back
              </button>
              <button
                type="submit"
                style={{
                  flex: 1,
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
                Start Trading
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
