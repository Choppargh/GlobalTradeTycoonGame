import React from 'react';

interface AuthScreenProps {
  onGoogleAuth: () => void;
  onGuestAuth: (username: string) => void;
}

export function AuthScreen({ onGoogleAuth, onGuestAuth }: AuthScreenProps) {
  const [step, setStep] = React.useState<'choose' | 'guest'>('choose');
  const [username, setUsername] = React.useState('');

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length >= 3) {
      onGuestAuth(username.trim());
    }
  };

  if (step === 'guest') {
    return (
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
          />
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep('choose')}
              className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={username.trim().length < 3}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50"
            >
              Start Trading
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white/90 rounded-lg p-8 max-w-md w-full mx-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Welcome to Global Trade Tycoon</h2>
      <p className="text-center text-gray-600 mb-6">Choose how you'd like to play</p>
      
      <div className="space-y-4">
        <button 
          onClick={onGoogleAuth}
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
          onClick={() => setStep('guest')}
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
  );
}