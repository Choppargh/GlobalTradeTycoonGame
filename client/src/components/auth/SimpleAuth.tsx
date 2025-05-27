import React, { useState } from 'react';

interface SimpleAuthProps {
  onAuthSuccess: (username: string) => void;
}

export function SimpleAuth({ onAuthSuccess }: SimpleAuthProps) {
  const [username, setUsername] = useState('');
  const [authType, setAuthType] = useState<'google' | 'guest' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      // Simple Google OAuth simulation - in production, this would use real Google OAuth
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: 'demo-google-token',
          username: 'GoogleUser'
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('authToken', userData.token);
        onAuthSuccess(userData.user.username);
      } else {
        alert('Google authentication is not configured yet. Please use Guest Mode for now.');
        setAuthType(null);
      }
    } catch (error) {
      alert('Authentication failed. Please try Guest Mode.');
      setAuthType(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAuth = async () => {
    if (!username.trim() || username.length < 3) {
      alert('Username must be at least 3 characters');
      return;
    }

    setIsLoading(true);
    try {
      const deviceFingerprint = btoa(JSON.stringify({
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      }));

      const response = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          deviceFingerprint
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('authToken', userData.token);
        onAuthSuccess(userData.user.username);
      } else {
        const error = await response.json();
        alert(error.message || 'Authentication failed');
      }
    } catch (error) {
      alert('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authType === null) {
    return (
      <div className="bg-white/90 rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome to Global Trade Tycoon</h2>
        <p className="text-center text-gray-600 mb-6">Choose how you'd like to play</p>
        
        <div className="space-y-4">
          <button 
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium"
          >
            🔑 Sign in with Google
          </button>
          
          <div className="flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          
          <button 
            onClick={() => setAuthType('guest')}
            disabled={isLoading}
            className="w-full border-2 border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium"
          >
            👤 Continue as Guest
          </button>
        </div>
      </div>
    );
  }

  if (authType === 'guest') {
    return (
      <div className="bg-white/90 rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-6">Guest Mode</h2>
        <p className="text-center text-gray-600 mb-6">Enter your trading name</p>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your trading name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            maxLength={20}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="flex gap-2">
            <button
              onClick={() => setAuthType(null)}
              disabled={isLoading}
              className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium"
            >
              Back
            </button>
            <button
              onClick={handleGuestAuth}
              disabled={isLoading || !username.trim()}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50"
            >
              {isLoading ? 'Setting up...' : 'Start Trading'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}