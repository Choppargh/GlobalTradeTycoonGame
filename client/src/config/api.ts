// API configuration for different environments
export const API_CONFIG = {
  // Production API URL - your deployed Replit server
  PRODUCTION_API_URL: 'https://6f779a8b-b501-4985-a50d-a753520ba447-00-d7ma3qi0ko23.kirk.replit.dev',
  
  // Determine which API URL to use
  getApiUrl: () => {
    // Check if we're forcing production API (for mobile apps)
    if ((window as any).FORCE_PRODUCTION_API) {
      return (window as any).PRODUCTION_API_URL || API_CONFIG.PRODUCTION_API_URL;
    }
    
    // Always use production URL for mobile apps and built versions
    // This ensures the global leaderboard works on all devices
    return API_CONFIG.PRODUCTION_API_URL;
  }
};

export const getApiEndpoint = (path: string) => {
  const baseUrl = API_CONFIG.getApiUrl();
  return `${baseUrl}${path}`;
};