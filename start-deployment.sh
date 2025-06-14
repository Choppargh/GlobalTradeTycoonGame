#!/bin/bash
# Production deployment startup script
export NODE_ENV=production

echo "🚀 Starting Global Trade Tycoon in production mode..."
echo "Environment: $NODE_ENV"

# Build the application if dist doesn't exist
if [ ! -d "dist" ] || [ ! -f "dist/index.js" ]; then
    echo "📦 Building application for production..."
    npm run build
    
    if [ $? -ne 0 ]; then
        echo "❌ Build failed. Exiting..."
        exit 1
    fi
fi

# Verify build output exists
if [ ! -f "dist/index.js" ]; then
    echo "❌ Production build not found. Please run 'npm run build' first."
    exit 1
fi

echo "✅ Starting production server..."
exec node dist/index.js
