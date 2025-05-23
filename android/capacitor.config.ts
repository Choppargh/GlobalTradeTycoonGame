import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.globaltrade.tycoon',
  appName: 'Global Trade Tycoon',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    App: {
      appUrlScheme: 'com.globaltrade.tycoon'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1f2937'
    }
  }
};

export default config;
