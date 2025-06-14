#!/bin/bash

# Production startup script for Global Trade Tycoon
echo "Starting production build process..."

# Set production environment
export NODE_ENV=production

# Build the application
echo "Building frontend and backend..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful. Starting production server..."
    npm start
else
    echo "Build failed. Exiting..."
    exit 1
fi