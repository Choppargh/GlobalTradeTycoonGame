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
      // Import WelcomeScreen dynamically to avoid hook issues
      const WelcomeScreen = React.lazy(() => import('@/components/game/WelcomeScreen').then(module => ({ default: module.WelcomeScreen })));
      return (
        <React.Suspense fallback={<div>Loading dashboard...</div>}>
          <WelcomeScreen navigate={this.props.navigate} />
        </React.Suspense>
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