import React, { useState } from 'react';

interface SimpleWelcomeProps {
  onStartGame: (username: string) => void;
}

export function SimpleWelcome({ onStartGame }: SimpleWelcomeProps) {
  const [screen, setScreen] = useState<'main' | 'auth' | 'guest'>('main');
  const [username, setUsername] = useState('');

  const handleGoogleAuth = async () => {
    try {
      // Redirect to Google OAuth endpoint
      window.location.href = '/api/auth/google';
    } catch (error) {
      alert('Google authentication failed. Please try guest mode.');
      setScreen('guest');
    }
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length >= 3) {
      try {
        const response = await fetch('/api/auth/guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username.trim(),
            deviceFingerprint: btoa(JSON.stringify({
              userAgent: navigator.userAgent,
              timestamp: Date.now()
            }))
          }),
        });

        if (response.ok) {
          const userData = await response.json();
          localStorage.setItem('authToken', userData.token);
          onStartGame(userData.user.username);
        } else {
          const error = await response.json();
          alert(error.message || 'Username might be taken. Please try another.');
        }
      } catch (error) {
        alert('Authentication failed. Please try again.');
      }
    }
  };

  if (screen === 'main') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `url('/images/GTC_Background_Portrait.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between max-w-5xl w-full mx-auto p-6 gap-8">
          <div className="flex justify-center md:justify-start">
            <img src="/images/GTC_Logo.png" alt="Global Trading Tycoon" className="w-40 sm:w-60 md:w-80" />
          </div>
          
          <div className="flex flex-col space-y-4 md:space-y-6 w-32 sm:w-48 md:w-64">
            <button 
              onClick={() => setScreen('auth')} 
              className="transition-transform hover:scale-105 focus:outline-none"
            >
              <img src="/images/GTC_Play.png" alt="Play" className="w-full" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'auth') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `url('/images/GTC_Background_Portrait.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="bg-white/90 rounded-lg p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Welcome to Global Trade Tycoon</h2>
          <p className="text-center text-gray-600 mb-6">Choose how you'd like to play</p>
          
          <div className="space-y-4">
            <button 
              onClick={handleGoogleAuth}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <span>🔑</span>
              Sign in with Google
            </button>
            
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            
            <button 
              onClick={() => setScreen('guest')}
              className="w-full border-2 border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <span>👤</span>
              Continue as Guest
            </button>
          </div>
          
          <div className="mt-6 text-xs text-gray-500 text-center">
            <p>Google Sign-In: Secure your username across all devices</p>
            <p>Guest Mode: Quick access, username tied to this device only</p>
          </div>
        </div>
        
        <button 
          onClick={() => setScreen('main')}
          className="mt-4 py-2 px-6 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  if (screen === 'guest') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `url('/images/GTC_Background_Portrait.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="bg-white/90 rounded-lg p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Guest Mode</h2>
          <p className="text-center text-gray-600 mb-6">Enter your trading name</p>
          
          <form onSubmit={handleGuestSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter your trading name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              required
              minLength={3}
            />
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setScreen('auth')}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium"
              >
                Start Trading
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return null;
}