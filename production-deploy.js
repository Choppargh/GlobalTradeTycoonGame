#!/usr/bin/env node

/**
 * Complete production deployment solution for Global Trade Tycoon
 * Handles frontend build and server startup in production mode
 */

import { spawn, execSync } from 'child_process';
import fs from 'fs';

// Force production environment
process.env.NODE_ENV = 'production';

console.log('Global Trade Tycoon - Production Deployment');
console.log(`Environment: ${process.env.NODE_ENV}`);

async function main() {
    try {
        // Ensure frontend is built
        await ensureFrontendBuild();
        
        // Start the server
        startProductionServer();
        
    } catch (error) {
        console.error('Deployment failed:', error.message);
        process.exit(1);
    }
}

async function ensureFrontendBuild() {
    const buildDirs = ['dist/public', 'server/public'];
    const hasBuild = buildDirs.some(dir => fs.existsSync(dir));
    
    if (!hasBuild) {
        console.log('Building frontend for production...');
        try {
            execSync('npx vite build', { stdio: 'inherit' });
            console.log('Frontend build completed');
        } catch (error) {
            console.log('Frontend build failed, continuing with development assets...');
        }
    } else {
        console.log('Frontend build found');
    }
}

function startProductionServer() {
    console.log('Starting production server...');
    
    // Try production build first, fallback to development with production env
    if (fs.existsSync('dist/index.js')) {
        console.log('Using built server');
        startServer(['node', 'dist/index.js']);
    } else {
        console.log('Using development server with production environment');
        startServer(['npx', 'tsx', 'server/index.ts']);
    }
}

function startServer(command) {
    const serverProcess = spawn(command[0], command.slice(1), {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production' }
    });
    
    serverProcess.on('close', (code) => {
        console.log(`Server process exited with code: ${code}`);
        process.exit(code);
    });
    
    serverProcess.on('error', (error) => {
        console.error('Server process error:', error.message);
        process.exit(1);
    });
    
    // Handle graceful shutdown
    ['SIGTERM', 'SIGINT'].forEach(signal => {
        process.on(signal, () => {
            console.log(`Received ${signal}, shutting down...`);
            serverProcess.kill(signal);
        });
    });
}

main();