import React from 'react';

export function ImprovedAuthPage() {
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
        // Use router navigation instead of window.location to prevent refresh loops
        window.location.replace('/game');
      } else {
        const error = await response.json();
        alert(error.message || 'Authentication failed');
      }
    } catch (error) {
      alert('Network error occurred');
    }
  };

  const toggleForm = (showRegister: boolean) => {
    const loginForm = document.getElementById('login-section');
    const registerForm = document.getElementById('register-section');
    
    if (showRegister) {
      loginForm!.classList.add('hidden');
      registerForm!.classList.remove('hidden');
    } else {
      registerForm!.classList.add('hidden');
      loginForm!.classList.remove('hidden');
    }
  };

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
      <div className="hidden md:flex min-h-screen items-center justify-center">
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
              onClick={() => handleLogin('google')}
              className="transition-transform hover:scale-105"
            >
              <img 
                src="/images/GTC_Play.png" 
                alt="Play" 
                style={{ width: '160px', height: 'auto' }}
              />
            </button>
            <button
              onClick={() => handleLogin('google')}
              className="transition-transform hover:scale-105"
            >
              <img 
                src="/images/GTC_Leaderboard.png" 
                alt="Leaderboard" 
                style={{ width: '160px', height: 'auto' }}
              />
            </button>
            <button
              onClick={() => handleLogin('google')}
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
      <div className="md:hidden min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <img src="/images/GTC_Logo.png" alt="Global Trading Tycoon" className="w-20 h-20 mx-auto mb-4 rounded-lg shadow-md" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Global Trade Tycoon</h1>
            <p className="text-gray-600 text-sm">Join the global competition</p>
          </div>

          {/* Login Section */}
          <div id="login-section" className="space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Welcome Back</h2>
              <p className="text-gray-600 text-sm">Sign in to your account</p>
            </div>

            <form data-mode="login" onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Enter your password"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors"
              >
                Sign In
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
                title="Sign in with Google"
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
                title="Sign in with X (Twitter)"
              >
                X / Twitter
              </button>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => toggleForm(true)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Don't have an account? <span className="underline">Sign up</span>
              </button>
            </div>
          </div>

          {/* Register Section */}
          <div id="register-section" className="hidden space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Create Account</h2>
              <p className="text-gray-600 text-sm">Join the global competition</p>
            </div>

            <form data-mode="register" onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="register-username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="register-username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Choose a username"
                />
              </div>
              
              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Create a password"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors"
              >
                Create Account
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
                title="Sign up with Google"
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
                title="Sign up with X (Twitter)"
              >
                X / Twitter
              </button>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => toggleForm(false)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Already have an account? <span className="underline">Sign in</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}