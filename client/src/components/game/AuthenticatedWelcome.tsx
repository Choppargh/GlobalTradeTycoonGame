import React from 'react';
import { AuthScreen } from '../auth/AuthScreen';

interface AuthenticatedWelcomeProps {
  onStartGame: (username: string) => void;
  onBack: () => void;
}

export function AuthenticatedWelcome({ onStartGame, onBack }: AuthenticatedWelcomeProps) {
  const handleGoogleAuth = async () => {
    try {
      // Load Google Sign-In library
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        if (window.google && window.google.accounts) {
          window.google.accounts.id.initialize({
            client_id: '{{GOOGLE_CLIENT_ID}}', // This will use your environment variable
            callback: async (response: any) => {
              try {
                const authResponse = await fetch('/api/auth/google', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    token: response.credential,
                    username: 'GoogleUser'
                  }),
                });

                if (authResponse.ok) {
                  const userData = await authResponse.json();
                  localStorage.setItem('authToken', userData.token);
                  onStartGame(userData.user.username);
                } else {
                  alert('Google authentication failed. Please try guest mode.');
                }
              } catch (error) {
                alert('Authentication error. Please try guest mode.');
              }
            }
          });
          window.google.accounts.id.prompt();
        }
      };
      document.head.appendChild(script);
    } catch (error) {
      alert('Google authentication is not available. Please use guest mode.');
    }
  };

  const handleGuestAuth = async (username: string) => {
    try {
      const deviceFingerprint = btoa(JSON.stringify({
        userAgent: navigator.userAgent,
        language: navigator.language,
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
        onStartGame(userData.user.username);
      } else {
        const error = await response.json();
        alert(error.message || 'Username might already be taken. Please try another.');
      }
    } catch (error) {
      alert('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <AuthScreen 
        onGoogleAuth={handleGoogleAuth}
        onGuestAuth={handleGuestAuth}
      />
      <button 
        onClick={onBack}
        className="mt-4 py-2 px-6 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
      >
        Back to Menu
      </button>
    </div>
  );
}