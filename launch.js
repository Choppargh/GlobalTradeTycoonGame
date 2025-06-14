#!/usr/bin/env node

/**
 * Production Launch Script
 * Bypasses build requirements and starts server in production mode
 */

import { spawn } from 'child_process';

// Set production environment
process.env.NODE_ENV = 'production';

console.log('Launching production server...');

// Start the server directly with tsx
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