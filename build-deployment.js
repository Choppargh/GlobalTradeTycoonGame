#!/usr/bin/env node

/**
 * Deployment Build Script for Global Trade Tycoon
 * Ensures esbuild is available and handles the complete build process
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function log(message) {
  console.log(`[Build] ${message}`);
}

function execute(command, description) {
  log(description);
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✓ ${description} completed`);
  } catch (error) {
    log(`✗ ${description} failed`);
    throw error;
  }
}

async function main() {
  log('Starting deployment build process...');

  // Ensure we have all dependencies
  execute('npm install', 'Installing dependencies');

  // Verify esbuild is available
  try {
    execSync('npx esbuild --version', { stdio: 'pipe' });
    log('✓ esbuild is available');
  } catch (error) {
    log('Installing esbuild...');
    execute('npm install esbuild', 'Installing esbuild');
  }

  // Build frontend
  execute('npx vite build', 'Building frontend');

  // Build server
  execute(
    'npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist',
    'Building server'
  );

  // Verify build outputs exist
  if (!fs.existsSync('dist/index.js')) {
    throw new Error('Server build output not found at dist/index.js');
  }

  if (!fs.existsSync('dist/public')) {
    throw new Error('Frontend build output not found at dist/public');
  }

  log('✓ Deployment build completed successfully');
}

main().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});