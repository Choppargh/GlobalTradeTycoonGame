#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏗️  Starting production build...');

try {
  // Set environment to production
  process.env.NODE_ENV = 'production';
  
  // Clean previous builds
  if (fs.existsSync('dist')) {
    console.log('🧹 Cleaning previous build...');
    execSync('rm -rf dist', { stdio: 'inherit' });
  }
  
  // Build frontend
  console.log('⚛️  Building React frontend...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Build backend
  console.log('🚀 Building Express backend...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  
  // Copy necessary files
  console.log('📁 Copying production files...');
  if (fs.existsSync('package.json')) {
    fs.copyFileSync('package.json', 'dist/package.json');
  }
  
  console.log('✅ Production build completed successfully!');
  console.log('📦 Built files are in the dist/ directory');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}