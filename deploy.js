#!/usr/bin/env node

/**
 * Deployment entry point - completely isolated from npm scripts
 */

import { spawn, execSync } from 'child_process';
import fs from 'fs';

process.env.NODE_ENV = 'production';

console.log('Deploying Global Trade Tycoon...');

// Build frontend directly without npm scripts
if (!fs.existsSync('server/public')) {
    console.log('Building frontend...');
    try {
        execSync('npx vite build --outDir server/public', { 
            stdio: 'inherit',
            timeout: 180000
        });
    } catch (error) {
        console.log('Frontend build failed, using minimal setup...');
        execSync('mkdir -p server/public', { stdio: 'inherit' });
        fs.writeFileSync('server/public/index.html', 
            '<!DOCTYPE html><html><head><title>Global Trade Tycoon</title></head><body><div id="root">Loading...</div></body></html>'
        );
    }
}

// Start server directly
console.log('Starting server...');
const server = spawn('npx', ['tsx', 'server/index.ts'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
});

server.on('close', process.exit);
server.on('error', () => process.exit(1));

['SIGTERM', 'SIGINT'].forEach(signal => {
    process.on(signal, () => server.kill(signal));
});