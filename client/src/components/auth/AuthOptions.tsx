import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

interface AuthOptionsProps {
  onAuthSuccess: (user: any) => void;
}

export function AuthOptions({ onAuthSuccess }: AuthOptionsProps) {
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestUsername, setGuestUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);

  useEffect(() => {
    // Load Google Sign-In
    const initGoogle = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: process.env.GOOGLE_CLIENT_ID || '',
          callback: handleGoogleResponse
        });
        setGoogleReady(true);
      }
    };

    // Load Google script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = initGoogle;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleGoogleResponse = async (response: any) => {
    try {
      setIsLoading(true);

      const authResponse = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: response.credential,
          username: 'GoogleUser' // Backend will extract real name from token
        }),
      });

      if (authResponse.ok) {
        const userData = await authResponse.json();
        localStorage.setItem('authToken', userData.token);
        onAuthSuccess(userData);
      } else {
        const error = await authResponse.json();
        alert(error.message || 'Google authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt();
    }
  };

  const handleGuestLogin = async () => {
    if (!guestUsername.trim() || guestUsername.length < 3) {
      alert('Username must be at least 3 characters');
      return;
    }

    try {
      setIsLoading(true);

      // Create device fingerprint
      const deviceFingerprint = generateDeviceFingerprint();
      
      const response = await fetch('/api/auth/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: guestUsername,
          deviceFingerprint
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('authToken', userData.token);
        onAuthSuccess(userData);
      } else {
        const error = await response.json();
        alert(error.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Guest authentication error:', error);
      alert('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateDeviceFingerprint = () => {
    // Create a unique device fingerprint
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: Date.now()
    };
    
    return btoa(JSON.stringify(fingerprint));
  };

  return (
    <div className="bg-white/90 rounded-lg p-8 max-w-md w-full mx-4 z-10 relative">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl text-tycoon-navy">
            Welcome to Global Trade Tycoon
          </CardTitle>
          <p className="text-center text-sm text-gray-600">
            Choose how you'd like to play
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Sign-In */}
          <div className="text-center">
            <h3 className="font-semibold mb-2">🔒 Secure Account</h3>
            <p className="text-sm text-gray-600 mb-4">
              Sign in with Google to keep your username safe across all devices
            </p>
            <Button 
              onClick={handleGoogleSignIn}
              disabled={!googleReady || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Signing in...' : '🔑 Sign in with Google'}
            </Button>
          </div>

          <div className="flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Guest Mode */}
          <div className="text-center">
            <h3 className="font-semibold mb-2">👤 Guest Mode</h3>
            <p className="text-sm text-gray-600 mb-4">
              Play without an account (username tied to this device only)
            </p>
            
            {!showGuestForm ? (
              <Button 
                onClick={() => setShowGuestForm(true)}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                Continue as Guest
              </Button>
            ) : (
              <div className="space-y-3">
                <Input
                  placeholder="Enter your trading name"
                  value={guestUsername}
                  onChange={(e) => setGuestUsername(e.target.value)}
                  disabled={isLoading}
                  maxLength={20}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowGuestForm(false)}
                    variant="outline"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleGuestLogin}
                    disabled={isLoading || !guestUsername.trim()}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? 'Setting up...' : 'Start Trading'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}