import React, { Component, ErrorInfo, ReactNode } from 'react';
import { clearAllCache, clearReactCache } from '@/lib/cacheManager';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorCount: number;
  lastError: Error | null;
}

export class ReactStabilityProvider extends Component<Props, State> {
  private errorBoundaryKey = 0;

  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
      errorCount: 0,
      lastError: null
    };

    // Bind methods
    this.handleReactFix = this.handleReactFix.bind(this);
    this.handleClearCache = this.handleClearCache.bind(this);
    this.handleFullReset = this.handleFullReset.bind(this);
  }

  componentDidMount() {
    // Listen for useState errors in development
    window.addEventListener('error', this.handleGlobalError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.handleGlobalError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  handleGlobalError = (event: ErrorEvent) => {
    const message = event.message || '';
    if (message.includes('useState') || message.includes('Cannot read properties of null')) {
      console.warn('Global useState error detected:', message);
      this.setState({ 
        hasError: true, 
        errorCount: this.state.errorCount + 1,
        lastError: new Error(message)
      });
    }
  };

  handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason?.toString() || '';
    if (reason.includes('useState') || reason.includes('hook')) {
      console.warn('Promise rejection with React hook error:', reason);
      this.setState({ 
        hasError: true,
        errorCount: this.state.errorCount + 1,
        lastError: new Error(reason)
      });
    }
  };

  static getDerivedStateFromError(error: Error): State {
    const message = error.message || '';
    if (message.includes('useState') || message.includes('hook') || message.includes('Cannot read properties of null')) {
      return {
        hasError: true,
        errorCount: 1,
        lastError: error
      };
    }
    return {
      hasError: false,
      errorCount: 0,
      lastError: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React Error Boundary caught useState error:', error, errorInfo);
    
    // Auto-clear cache when React errors occur
    try {
      clearReactCache();
    } catch (clearError) {
      console.warn('Failed to auto-clear cache:', clearError);
    }
  }

  handleReactFix = () => {
    try {
      // Clear React-related cache
      clearReactCache();
      
      // Reset error boundary
      this.errorBoundaryKey++;
      this.setState({ 
        hasError: false, 
        errorCount: 0,
        lastError: null 
      });
      
      console.log('React stability fix applied');
    } catch (error) {
      console.error('Failed to apply React fix:', error);
    }
  };

  handleClearCache = () => {
    try {
      clearAllCache();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  handleFullReset = () => {
    try {
      // Clear everything and force reload
      clearAllCache();
      
      // Force hard reload after short delay
      setTimeout(() => {
        window.location.href = window.location.href;
      }, 500);
    } catch (error) {
      console.error('Failed to perform full reset:', error);
      // Fallback to regular reload
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-lg p-8 max-w-lg w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">React Hook Issue Detected</h1>
              <p className="text-gray-600 mb-4">
                A React useState corruption has been detected. This happens when the browser cache gets corrupted during development.
              </p>
              {this.state.errorCount > 1 && (
                <p className="text-orange-600 text-sm mb-4">
                  This error has occurred {this.state.errorCount} times. Consider a full reset.
                </p>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={this.handleReactFix}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-2xl transition-colors"
              >
                Quick Fix - Clear React Cache
              </button>
              
              <button
                onClick={this.handleClearCache}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-2xl transition-colors"
              >
                Clear All Cache
              </button>
              
              <button
                onClick={this.handleFullReset}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-2xl transition-colors"
              >
                Full Reset & Reload
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
              <h3 className="font-semibold text-gray-900 mb-2">Developer Info:</h3>
              <p className="text-sm text-gray-600 mb-2">
                Error: {this.state.lastError?.message || 'Unknown React hook error'}
              </p>
              <p className="text-xs text-gray-500">
                You can also open browser console and run: <code>window.clearGameCache()</code>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={this.errorBoundaryKey}>
        {this.props.children}
      </div>
    );
  }
}