// Production configuration for deployment
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  // Build configuration
  build: {
    // Optimize build for faster deployment
    minify: true,
    sourcemap: false,
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  
  // Server configuration
  server: {
    port: 5000,
    host: '0.0.0.0',
    strictPort: true
  },
  
  // Environment settings
  env: {
    NODE_ENV: isProduction ? 'production' : 'development'
  }
};