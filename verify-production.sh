#!/bin/bash
# Verify production build and configuration

echo "🔍 Verifying production configuration..."

# Check if required files exist
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found"
    exit 1
fi

if [ ! -f "replit.toml" ]; then
    echo "❌ replit.toml not found"
    exit 1
fi

# Check replit.toml configuration
echo "📋 Checking replit.toml configuration..."
if grep -q "NODE_ENV.*production" replit.toml; then
    echo "✅ NODE_ENV set to production in replit.toml"
else
    echo "⚠️  NODE_ENV not found in replit.toml"
fi

if grep -q "npm start" replit.toml; then
    echo "✅ Production start command found in replit.toml"
else
    echo "⚠️  Production start command not found in replit.toml"
fi

# Check package.json scripts
echo "📋 Checking package.json scripts..."
if grep -q '"start".*"node dist/index.js"' package.json; then
    echo "✅ Production start script configured"
else
    echo "⚠️  Production start script may need attention"
fi

echo "🎯 Configuration verification complete"
