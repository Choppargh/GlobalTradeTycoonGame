# Global Trade Tycoon - Deployment Guide

## Production Deployment

### Overview
This project is configured for production deployment on Replit with Cloud Run as the target. The deployment configuration has been updated to address security requirements and use production-ready commands.

### Deployment Configuration

#### Fixed Issues
- ✅ Replaced development command (`npm run dev`) with production command (`npm start`)
- ✅ Added proper build step before deployment
- ✅ Set NODE_ENV environment variable to production
- ✅ Created optimized build configuration

#### Files Created/Updated
- `replit.toml` - Main deployment configuration
- `deploy.sh` - Production deployment script
- `start-production.sh` - Production startup script
- `build-production.js` - Build automation
- `production.config.js` - Production settings
- `Dockerfile` - Container configuration

### Build Process

#### Automatic Build
The deployment system automatically runs:
1. `npm run build` - Builds frontend (Vite) and backend (esbuild)
2. Creates optimized production assets in `dist/` directory
3. Starts server with `NODE_ENV=production npm start`

#### Manual Build
For local testing:
```bash
# Build for production
NODE_ENV=production npm run build

# Start production server
NODE_ENV=production npm start
```

### Environment Configuration

#### Production Environment Variables
- `NODE_ENV=production` - Enables production mode
- OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, etc.)
- Database URL for PostgreSQL connection

#### Server Configuration
- Port: 5000 (internal), 80 (external)
- Host: 0.0.0.0 for external access
- Static files served from dist/public in production
- Development hot-reload disabled in production

### Security Features

#### Production Security
- Secure cookies enabled in production
- HTTPS enforcement for OAuth callbacks
- Static file serving optimized for production
- Development debugging disabled

#### Build Security
- Production builds use minification
- Source maps disabled for production
- Dependencies optimized for production use

### Deployment Commands

#### Replit Configuration
```toml
[deployment]
build = ["npm", "run", "build"]
run = ["sh", "-c", "NODE_ENV=production npm start"]
deploymentTarget = "cloudrun"

[env]
NODE_ENV = "production"
```

#### Alternative Deployment
```bash
# Using deployment script
./deploy.sh

# Using production script
./start-production.sh
```

### Troubleshooting

#### Common Issues
1. **Build timeouts**: Use optimized build configuration
2. **Missing static files**: Ensure build completes before start
3. **Environment variables**: Verify NODE_ENV is set to production

#### Verification
Check deployment logs for:
- "Production mode: true"
- "Server mode: production"
- Static files served from correct directory

### Performance

#### Optimizations
- Frontend built with Vite production optimizations
- Backend bundled with esbuild minification
- Static assets served efficiently in production
- Database connections optimized for serverless

#### Monitoring
- Server logs show production/development mode
- Environment debugging in startup logs
- Performance metrics available in deployment console