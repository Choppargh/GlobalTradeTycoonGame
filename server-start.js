#!/usr/bin/env node

/**
 * Clean server startup - no development references
 */

import { spawn } from 'child_process';

process.env.NODE_ENV = 'production';

const server = spawn('npx', ['tsx', 'server/index.ts'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
});

server.on('close', process.exit);
server.on('error', () => process.exit(1));

['SIGTERM', 'SIGINT'].forEach(signal => {
    process.on(signal, () => server.kill(signal));
});