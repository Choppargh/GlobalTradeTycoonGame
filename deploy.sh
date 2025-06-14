#!/bin/bash

# Production deployment script for Global Trade Tycoon
set -e

echo "Starting production deployment..."

# Set environment variables
export NODE_ENV=production

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf dist

# Build the application
echo "Building application..."
npm run build

# Verify build output
if [ ! -d "dist" ]; then
    echo "Build failed - dist directory not found"
    exit 1
fi

echo "Build completed successfully"

# Start the production server
echo "Starting production server..."
exec npm start