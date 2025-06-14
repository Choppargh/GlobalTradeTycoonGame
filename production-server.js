#!/usr/bin/env node

/**
 * Production Server Launcher
 * Clean production startup without any development references
 */

import { spawn, execSync } from 'child_process';
import fs from 'fs';

// Set production environment
process.env.NODE_ENV = 'production';

console.log('Starting Global Trade Tycoon Production Server');

function buildIfNeeded() {
    // Check if we need to build frontend
    if (!fs.existsSync('dist/public') && !fs.existsSync('server/public')) {
        console.log('Building frontend assets...');
        try {
            execSync('npx vite build', { stdio: 'inherit', env: process.env });
        } catch (error) {
            console.log('Frontend build encountered issues, continuing...');
        }
    }
}

function startServer() {
    buildIfNeeded();
    
    console.log('Launching production server...');
    
    // Use tsx to run TypeScript server in production mode
    const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production' }
    });
    
    serverProcess.on('close', (code) => {
        process.exit(code);
    });
    
    serverProcess.on('error', (error) => {
        console.error('Server error:', error.message);
        process.exit(1);
    });
    
    // Graceful shutdown
    ['SIGTERM', 'SIGINT'].forEach(signal => {
        process.on(signal, () => {
            serverProcess.kill(signal);
        });
    });
}

startServer();