#!/usr/bin/env node

/**
 * Production startup script that handles dependency resolution
 * Works around the .replit vs replit.toml configuration conflict
 */

import { spawn } from 'child_process';
import fs from 'fs';

// Force production environment
process.env.NODE_ENV = 'production';

console.log('Starting Global Trade Tycoon in production mode...');
console.log(`Environment: ${process.env.NODE_ENV}`);

// Check if we have a built server file
if (fs.existsSync('dist/index.js')) {
    console.log('Found production build, starting server...');
    startServer();
} else {
    console.log('No production build found, using development server with production environment...');
    startDevelopmentWithProductionEnv();
}

function startServer() {
    const serverProcess = spawn('node', ['dist/index.js'], {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production' }
    });
    
    serverProcess.on('error', (error) => {
        console.error('Production server failed:', error.message);
        console.log('Falling back to development server with production environment...');
        startDevelopmentWithProductionEnv();
    });
    
    handleProcessEvents(serverProcess);
}

function startDevelopmentWithProductionEnv() {
    const devProcess = spawn('npx', ['tsx', 'server/index.ts'], {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production' }
    });
    
    handleProcessEvents(devProcess);
}

function handleProcessEvents(process) {
    process.on('close', (code) => {
        console.log(`Server exited with code: ${code}`);
        process.exit(code);
    });
    
    // Handle graceful shutdown
    ['SIGTERM', 'SIGINT'].forEach(signal => {
        process.on(signal, () => {
            console.log(`Received ${signal}, shutting down gracefully...`);
            process.kill(signal);
        });
    });
}