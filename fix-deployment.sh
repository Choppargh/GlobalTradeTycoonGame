#!/bin/bash

# Deployment Fix Script for Global Trade Tycoon
# Resolves configuration conflicts between .replit and replit.toml

echo "🔧 Fixing deployment configuration conflicts..."

# Ensure NODE_ENV is set to production
export NODE_ENV=production

# Create a production-ready startup script that the deployment system can use
echo "📝 Creating production startup wrapper..."

cat > start-deployment.sh << 'EOF'
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
EOF

chmod +x start-deployment.sh

# Create a verification script to test production mode
echo "🧪 Creating production verification script..."

cat > verify-production.sh << 'EOF'
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
EOF

chmod +x verify-production.sh

# Run verification
echo "🔍 Running production verification..."
./verify-production.sh

# Update replit.toml to ensure it has priority over .replit
echo "📝 Ensuring replit.toml takes precedence..."

# The replit.toml already has correct configuration, but let's make sure it's comprehensive
cat > replit.toml << 'EOF'
[deployment]
build = ["npm", "run", "build"]
run = ["sh", "-c", "NODE_ENV=production npm start"]
deploymentTarget = "cloudrun"

[env]
NODE_ENV = "production"

[[ports]]
localPort = 5000
externalPort = 80
EOF

echo "✅ Deployment configuration fixed!"
echo ""
echo "📋 Summary of changes:"
echo "   • Created start-deployment.sh for reliable production startup"
echo "   • Updated replit.toml to ensure production configuration"
echo "   • Added verification script to check deployment readiness"
echo "   • Ensured NODE_ENV=production is properly set"
echo ""
echo "🚀 The deployment should now use production commands instead of development commands."
echo "   The replit.toml configuration will take precedence over .replit for Cloud Run deployments."