import React, { useState } from 'react';

export function ImprovedAuthPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleLogin = (provider: string) => {
    if (provider === 'google' || provider === 'facebook' || provider === 'twitter') {
      window.location.href = `/auth/${provider}`;
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const mode = (e.currentTarget.dataset.mode as string) || 'login';
    
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const body: any = {
        email: formData.get('email'),
        password: formData.get('password')
      };
      
      if (mode === 'register') {
        body.username = formData.get('username');
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        window.location.replace('/');
      } else {
        const error = await response.json();
        alert(error.message || 'Authentication failed');
      }
    } catch (error) {
      alert('Network error occurred');
    }
  };

  const AuthForm = ({ mode }: { mode: 'login' | 'register' }) => (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-600 text-sm">
          {mode === 'login' ? 'Sign in to your account' : 'Join the global competition'}
        </p>
      </div>

      <form data-mode={mode} onSubmit={handleFormSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label htmlFor={`${mode}-username`} className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id={`${mode}-username`}
              name="username"
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Choose a username"
            />
          </div>
        )}
        
        <div>
          <label htmlFor={`${mode}-email`} className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id={`${mode}-email`}
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label htmlFor={`${mode}-password`} className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id={`${mode}-password`}
            name="password"
            type="password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors"
        >
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500 font-medium">Or continue with</span>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={() => handleLogin('google')}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            width: '100px',
            height: '48px',
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          title={`Sign ${mode === 'login' ? 'in' : 'up'} with Google`}
        >
          Google
        </button>
        <button
          onClick={() => handleLogin('twitter')}
          style={{
            backgroundColor: '#000000',
            color: 'white',
            width: '100px',
            height: '48px',
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#374151'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#000000'}
          title={`Sign ${mode === 'login' ? 'in' : 'up'} with X (Twitter)`}
        >
          X / Twitter
        </button>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => setIsRegisterMode(!isRegisterMode)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {mode === 'login' 
            ? "Don't have an account? " 
            : "Already have an account? "
          }
          <span className="underline">
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url("/images/GTC_Background.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen items-center justify-center">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          width: '800px', 
          margin: '0 auto' 
        }}>
          {/* Logo Section */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img 
              src="/images/GTC_Logo.png" 
              alt="Global Trading Tycoon" 
              style={{ width: '280px', height: 'auto' }}
            />
          </div>
          
          {/* Buttons Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => setShowAuthModal(true)}
              className="transition-transform hover:scale-105"
            >
              <img 
                src="/images/GTC_Play.png" 
                alt="Play" 
                style={{ width: '160px', height: 'auto' }}
              />
            </button>
            <button
              onClick={() => setShowAuthModal(true)}
              className="transition-transform hover:scale-105"
            >
              <img 
                src="/images/GTC_Leaderboard.png" 
                alt="Leaderboard" 
                style={{ width: '160px', height: 'auto' }}
              />
            </button>
            <button
              onClick={() => setShowAuthModal(true)}
              className="transition-transform hover:scale-105"
            >
              <img 
                src="/images/GTC_Rules.png" 
                alt="Rules" 
                style={{ width: '160px', height: 'auto' }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <img src="/images/GTC_Logo.png" alt="Global Trading Tycoon" className="w-20 h-20 mx-auto mb-4 rounded-lg shadow-md" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Global Trade Tycoon</h1>
            <p className="text-gray-600 text-sm">Join the global competition</p>
          </div>

          <AuthForm mode={isRegisterMode ? 'register' : 'login'} />
        </div>
      </div>

      {/* Authentication Modal for Desktop */}
      <div className="hidden lg:block">
        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-gray-200 relative">
              {/* Header */}
              <div className="text-center mb-8">
                <img src="/images/GTC_Logo.png" alt="Global Trading Tycoon" className="w-20 h-20 mx-auto mb-4 rounded-lg shadow-md" />
                <h1 className="text-2xl font-bold text-gray-800">Global Trading Tycoon</h1>
                <p className="text-gray-600 text-sm">Choose your path to trading success</p>
              </div>

              <AuthForm mode={isRegisterMode ? 'register' : 'login'} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}