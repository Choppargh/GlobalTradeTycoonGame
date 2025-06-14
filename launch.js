#!/usr/bin/env node

/**
 * Production Launch Script
 * Ensures frontend is built and starts server in production mode
 */

import { spawn, execSync } from 'child_process';
import fs from 'fs';

// Set production environment
process.env.NODE_ENV = 'production';

console.log('Production launch initiated...');

// Check if frontend build exists
const buildPaths = ['dist/public', 'server/public'];
const hasBuild = buildPaths.some(path => fs.existsSync(path));

if (!hasBuild) {
    console.log('Building frontend assets...');
    try {
        // Quick build without full processing
        execSync('npx vite build --mode production', { 
            stdio: 'inherit',
            timeout: 120000  // 2 minute timeout
        });
        console.log('Frontend build complete');
    } catch (error) {
        console.log('Frontend build timeout, starting server anyway...');
    }
}

console.log('Starting production server...');

// Start the server with tsx
const server = spawn('npx', ['tsx', 'server/index.ts'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
});

server.on('close', (code) => process.exit(code));
server.on('error', (err) => process.exit(1));

// Handle shutdown
['SIGTERM', 'SIGINT'].forEach(signal => {
    process.on(signal, () => server.kill(signal));
});