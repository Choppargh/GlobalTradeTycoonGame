#!/usr/bin/env node

/**
 * Deployment Wrapper for Global Trade Tycoon
 * Ensures production environment is properly configured before startup
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Global Trade Tycoon - Production Deployment Wrapper');

// Force production environment
process.env.NODE_ENV = 'production';

// Validate environment
console.log('🔍 Validating production environment...');
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`Platform: ${process.platform}`);
console.log(`Node Version: ${process.version}`);

// Check if built files exist
const distPath = path.join(process.cwd(), 'dist');
const serverPath = path.join(distPath, 'index.js');

if (!fs.existsSync(distPath)) {
    console.log('📦 No dist directory found. Building application...');
    
    // Run build process
    const buildProcess = spawn('npm', ['run', 'build'], {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production' }
    });
    
    buildProcess.on('close', (code) => {
        if (code === 0) {
            console.log('✅ Build completed successfully');
            startServer();
        } else {
            console.error('❌ Build failed with code:', code);
            process.exit(1);
        }
    });
} else if (!fs.existsSync(serverPath)) {
    console.log('⚠️  Dist directory exists but server file missing. Rebuilding...');
    
    const buildProcess = spawn('npm', ['run', 'build'], {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production' }
    });
    
    buildProcess.on('close', (code) => {
        if (code === 0) {
            console.log('✅ Rebuild completed successfully');
            startServer();
        } else {
            console.error('❌ Rebuild failed with code:', code);
            process.exit(1);
        }
    });
} else {
    console.log('✅ Production build found');
    startServer();
}

function startServer() {
    console.log('🎯 Starting production server...');
    
    // Start the production server
    const serverProcess = spawn('node', ['dist/index.js'], {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production' }
    });
    
    serverProcess.on('close', (code) => {
        console.log(`Server exited with code: ${code}`);
        process.exit(code);
    });
    
    serverProcess.on('error', (error) => {
        console.error('Server error:', error);
        process.exit(1);
    });
    
    // Handle graceful shutdown
    process.on('SIGTERM', () => {
        console.log('Received SIGTERM, shutting down gracefully...');
        serverProcess.kill('SIGTERM');
    });
    
    process.on('SIGINT', () => {
        console.log('Received SIGINT, shutting down gracefully...');
        serverProcess.kill('SIGINT');
    });
}