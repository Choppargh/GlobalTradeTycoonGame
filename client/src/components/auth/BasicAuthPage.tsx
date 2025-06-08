import React from 'react';

export function BasicAuthPage() {
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
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.message || 'Authentication failed');
      }
    } catch (error) {
      alert('Network error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url('/images/GTC_Background_Portrait.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl border">
        <div className="text-center mb-6">
          <img src="/images/GTC_Logo.png" alt="Global Trading Tycoon" className="w-24 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-gray-900 mb-1">Global Trade Tycoon</h1>
          <p className="text-sm text-gray-700 font-medium">Sign in to compete on the global leaderboard</p>
        </div>

        {/* Login Form */}
        <div id="login-form" className="space-y-4">
          <form data-mode="login" onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign In
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleLogin('google')}
              className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <span className="text-red-500 font-bold">G</span>
            </button>
            <button
              onClick={() => handleLogin('facebook')}
              className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <span className="text-blue-600 font-bold">f</span>
            </button>
            <button
              onClick={() => handleLogin('twitter')}
              className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <span className="text-blue-400 font-bold">X</span>
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                document.getElementById('login-form')!.style.display = 'none';
                document.getElementById('register-form')!.style.display = 'block';
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </div>

        {/* Register Form */}
        <div id="register-form" className="space-y-4" style={{ display: 'none' }}>
          <form data-mode="register" onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="register-username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="register-username"
                name="username"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="register-password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Create Account
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleLogin('google')}
              className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <span className="text-red-500 font-bold">G</span>
            </button>
            <button
              onClick={() => handleLogin('facebook')}
              className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <span className="text-blue-600 font-bold">f</span>
            </button>
            <button
              onClick={() => handleLogin('twitter')}
              className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <span className="text-blue-400 font-bold">X</span>
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                document.getElementById('register-form')!.style.display = 'none';
                document.getElementById('login-form')!.style.display = 'block';
              }}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}