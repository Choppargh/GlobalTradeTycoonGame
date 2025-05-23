import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.globaltrade.tycoon',
  appName: 'Global Trade Tycoon',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  }
};

export default config;
