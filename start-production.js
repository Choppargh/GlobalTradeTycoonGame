#!/usr/bin/env node

/**
 * Clean Production Startup Script
 * No development references - production only
 */

import { spawn } from 'child_process';

// Force production environment
process.env.NODE_ENV = 'production';

console.log('Global Trade Tycoon - Production Mode');

// Start server using tsx with production environment
const server = spawn('npx', ['tsx', 'server/index.ts'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
});

server.on('close', (code) => process.exit(code));
server.on('error', (err) => {
    console.error('Server error:', err.message);
    process.exit(1);
});

// Handle shutdown signals
['SIGTERM', 'SIGINT'].forEach(signal => {
    process.on(signal, () => server.kill(signal));
});