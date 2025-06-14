#!/usr/bin/env node

/**
 * Optimized Production Server
 * Starts immediately without build dependencies
 */

import { spawn } from 'child_process';

process.env.NODE_ENV = 'production';

console.log('Starting Global Trade Tycoon production server...');

const server = spawn('npx', ['tsx', 'server/index.ts'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
});

server.on('close', process.exit);
server.on('error', () => process.exit(1));

['SIGTERM', 'SIGINT'].forEach(signal => {
    process.on(signal, () => server.kill(signal));
});