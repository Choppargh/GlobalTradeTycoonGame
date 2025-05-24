// API configuration for different environments
export const API_CONFIG = {
  // Production API URL - this will be your deployed Replit URL
  PRODUCTION_API_URL: 'https://6f779a8b-b501-4985-a50d-a753520ba447-00-d7ma3qi0ko23.kirk.replit.dev',
  
  // Development API URL (localhost)
  DEVELOPMENT_API_URL: 'http://localhost:5000',
  
  // Determine which API URL to use
  getApiUrl: () => {
    // Check if we're running in a Capacitor app (mobile)
    if (window.location.protocol === 'capacitor:' || window.location.hostname === 'localhost') {
      return API_CONFIG.PRODUCTION_API_URL;
    }
    
    // Check if we're in development mode
    if (import.meta.env.DEV) {
      return API_CONFIG.DEVELOPMENT_API_URL;
    }
    
    // Default to production for built apps
    return API_CONFIG.PRODUCTION_API_URL;
  }
};

export const getApiEndpoint = (path: string) => {
  const baseUrl = API_CONFIG.getApiUrl();
  return `${baseUrl}${path}`;
};