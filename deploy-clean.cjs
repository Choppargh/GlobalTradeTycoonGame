#!/usr/bin/env node

/**
 * Clean deployment script for production
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');

const command = process.argv[2] || 'build';

if (command === 'build') {
  console.log('Building application for production...');
  
  try {
    // Ensure dist directory exists
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist', { recursive: true });
    }
    
    // Build frontend
    console.log('Building frontend...');
    execSync('npx vite build', { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    
    // Build backend
    console.log('Building backend...');
    execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', {
      stdio: 'inherit'
    });
    
    console.log('Build completed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
  
} else if (command === 'start') {
  console.log('Starting production server...');
  
  // Start production server
  const server = spawn('node', ['dist/index.js'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  server.on('close', (code) => {
    console.log(`Server exited with code ${code}`);
    process.exit(code);
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('Shutting down...');
    server.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.log('Terminating...');
    server.kill('SIGTERM');
  });
  
} else {
  console.error('Usage: node deploy-clean.cjs [build|start]');
  process.exit(1);
}