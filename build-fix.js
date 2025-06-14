#!/usr/bin/env node

/**
 * Fixed build script for production deployment
 * Ensures all dependencies are properly bundled
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🏗️ Building Global Trade Tycoon for production...');

try {
  // Set production environment
  process.env.NODE_ENV = 'production';
  
  // Clean previous builds
  if (fs.existsSync('dist')) {
    console.log('🧹 Cleaning previous build...');
    execSync('rm -rf dist', { stdio: 'inherit' });
  }
  
  // Build frontend with Vite
  console.log('⚛️ Building React frontend...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Build backend with proper dependency handling
  console.log('🚀 Building Express backend...');
  execSync(`npx esbuild server/index.ts \
    --platform=node \
    --bundle \
    --format=esm \
    --outdir=dist \
    --external:pg-native \
    --external:fsevents \
    --external:bufferutil \
    --external:utf-8-validate`, { stdio: 'inherit' });
  
  console.log('✅ Production build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}