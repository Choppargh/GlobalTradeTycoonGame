#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building for production deployment...');

// Set production environment
process.env.NODE_ENV = 'production';

try {
  // Clean build directory
  if (fs.existsSync('dist')) {
    execSync('rm -rf dist', { stdio: 'inherit' });
  }

  // Build frontend with production optimizations
  console.log('Building frontend...');
  execSync('npx vite build --mode production', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Build backend
  console.log('Building backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --minify', { 
    stdio: 'inherit' 
  });

  console.log('Production build completed successfully');
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}