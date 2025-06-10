import React from 'react';
import { ImprovedAuthPage } from '@/components/auth/ImprovedAuthPage';
import { useNavigate } from 'react-router-dom';

// Wrapper function component to provide navigation to class component
function HomePageWrapper() {
  const navigate = useNavigate();
  return <HomePage navigate={navigate} />;
}

class HomePage extends React.Component<{ navigate?: (path: string) => void }> {
  state = {
    isLoading: true,
    isAuthenticated: false
  };

  async componentDidMount() {
    try {
      const response = await fetch('/auth/status');
      const data = await response.json();
      this.setState({
        isAuthenticated: Boolean(data.isAuthenticated && data.user),
        isLoading: false
      });
    } catch {
      this.setState({
        isAuthenticated: false,
        isLoading: false
      });
    }
  }

  render() {
    const { isLoading, isAuthenticated } = this.state;

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
          </div>
        </div>
      );
    }

    if (isAuthenticated) {
      return (
        <div className="min-h-screen" style={{
          backgroundImage: `url('/images/GTC_Background_Portrait.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <div className="flex flex-col items-center justify-center min-h-screen space-y-6 px-4">
            <div className="mb-8">
              <img src="/images/GTC_Logo.png" alt="Global Trading Tycoon" className="w-64 sm:w-80" />
            </div>
            
            <div className="flex flex-col items-center gap-4 w-full">
              <button 
                onClick={() => this.props.navigate && this.props.navigate('/game')}
                className="transition-transform hover:scale-105 focus:outline-none"
              >
                <img 
                  src="/images/GTC_Play.png" 
                  alt="Play" 
                  style={{ width: '200px', height: 'auto', display: 'block', margin: '0 auto' }}
                />
              </button>
              
              <button 
                onClick={() => {}}
                className="transition-transform hover:scale-105 focus:outline-none"
              >
                <img 
                  src="/images/GTC_Leaderboard.png" 
                  alt="Leaderboard" 
                  style={{ width: '200px', height: 'auto', display: 'block', margin: '0 auto' }}
                />
              </button>
              
              <button 
                onClick={() => {}}
                className="transition-transform hover:scale-105 focus:outline-none"
              >
                <img 
                  src="/images/GTC_Rules.png" 
                  alt="Rules" 
                  style={{ width: '200px', height: 'auto', display: 'block', margin: '0 auto' }}
                />
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen">
        <ImprovedAuthPage />
      </div>
    );
  }
}

export default HomePageWrapper;