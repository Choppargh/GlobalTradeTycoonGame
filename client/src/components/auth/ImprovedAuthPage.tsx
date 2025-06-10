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
              onClick={() => window.location.href = '/leaderboard'}
              className="transition-transform hover:scale-105"
            >
              <img 
                src="/images/GTC_Leaderboard.png" 
                alt="Leaderboard" 
                style={{ width: '160px', height: 'auto' }}
              />
            </button>
            <button
              onClick={() => window.location.href = '/rules'}
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
      <div className="lg:hidden min-h-screen flex items-center justify-center">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '20px' 
        }}>
          {/* Logo Section */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img 
              src="/images/GTC_Logo.png" 
              alt="Global Trading Tycoon" 
              style={{ width: '220px', height: 'auto' }}
            />
          </div>
          
          {/* Buttons Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              onClick={() => handleLogin('google')}
              className="transition-transform hover:scale-105"
            >
              <img 
                src="/images/GTC_Play.png" 
                alt="Play" 
                style={{ width: '140px', height: 'auto' }}
              />
            </button>
            <button
              onClick={() => window.location.href = '/leaderboard'}
              className="transition-transform hover:scale-105"
            >
              <img 
                src="/images/GTC_Leaderboard.png" 
                alt="Leaderboard" 
                style={{ width: '140px', height: 'auto' }}
              />
            </button>
            <button
              onClick={() => window.location.href = '/rules'}
              className="transition-transform hover:scale-105"
            >
              <img 
                src="/images/GTC_Rules.png" 
                alt="Rules" 
                style={{ width: '140px', height: 'auto' }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}