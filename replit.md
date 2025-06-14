# Global Trade Tycoon - Replit.md

## Overview

Global Trade Tycoon is a web-based trading simulation game built with React, TypeScript, and Node.js. Players manage a trading business across global markets, buying and selling commodities to maximize profits within a 31-day timeframe. The application features user authentication, real-time leaderboards, and a mobile-responsive design with PWA capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand stores for game state and audio management
- **Routing**: React Router for client-side navigation
- **UI Components**: Radix UI primitives with custom styling
- **3D Graphics**: React Three Fiber for potential 3D elements
- **Mobile Support**: Capacitor for Android app packaging

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with multiple strategies (Local, Google, Facebook, Twitter)
- **Session Management**: Express sessions with secure cookie handling
- **API Design**: RESTful endpoints for game actions and user management

### Data Storage Solutions
- **Primary Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle with TypeScript schema definitions
- **Local Storage**: Browser localStorage for game state persistence
- **Session Storage**: Server-side sessions for authentication

## Key Components

### Game Engine
- **Core Logic**: Located in `client/src/lib/gameLogic.ts`
- **State Management**: Zustand store in `useGameStore.ts`
- **Auto-save System**: Automatic game state persistence in `autoSave.ts`
- **Market Simulation**: Dynamic pricing with location-based modifiers
- **Random Events**: Economic events affecting market prices

### Authentication System
- **Multi-provider OAuth**: Google, Facebook, Twitter integration
- **Local Authentication**: Email/password with bcrypt hashing
- **Protected Routes**: Route guards for authenticated content
- **Display Name Management**: Customizable user display names

### Game Features
- **15 Different Products**: Coffee, tea, spices, precious metals, textiles, etc.
- **7 Global Locations**: Africa, Antarctica, Asia, Australia, Europe, North America, South America
- **Banking System**: Loans, deposits, interest calculations
- **Leaderboard**: Weekly score tracking with automatic resets
- **Travel Mechanics**: Location-based pricing and risk events

### Mobile Experience
- **Progressive Web App**: Service worker and manifest configuration
- **Capacitor Integration**: Native Android app capabilities
- **Responsive Design**: Mobile-first UI with touch optimizations
- **Install Prompts**: Native app installation guidance

## Data Flow

1. **User Authentication**: Users sign in via OAuth or local credentials
2. **Game Initialization**: New game state created or existing state loaded
3. **Market Data**: Product prices generated based on location and events
4. **Player Actions**: Buy/sell transactions update inventory and cash
5. **State Persistence**: Game state automatically saved to localStorage
6. **Score Submission**: Final scores submitted to global leaderboard
7. **Weekly Reset**: Automated leaderboard clearing every Monday

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **passport**: Authentication middleware with OAuth strategies
- **drizzle-orm**: Type-safe database operations
- **@radix-ui/react-***: Accessible UI component primitives
- **@capacitor/***: Mobile app functionality
- **@react-three/drei**: 3D graphics utilities

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundling
- **tailwindcss**: Utility-first CSS framework
- **vite-plugin-glsl**: GLSL shader support

### Authentication Providers
- **Google OAuth 2.0**: Social authentication
- **Twitter OAuth 1.0**: Social authentication
- **Facebook OAuth**: Social authentication (configured but not fully implemented)

## Deployment Strategy

### Production Environment
- **Platform**: Replit with Cloud Run deployment target
- **Port Configuration**: Internal port 5000, external port 80
- **Environment Variables**: OAuth credentials and database URLs, NODE_ENV=production
- **Build Process**: Vite build for frontend, esbuild for backend
- **Static Assets**: Served from dist/public directory
- **Deployment Configuration**: replit.toml with production build and start commands
- **Security**: Production deployment uses npm start instead of npm run dev

### Database Configuration
- **Provider**: Neon PostgreSQL serverless
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Environment-based URL configuration

### Mobile Deployment
- **Android**: Capacitor build targeting Android platform
- **PWA**: Service worker for offline capabilities
- **App Stores**: Configured for potential Google Play distribution

## Changelog

```
Changelog:
- June 14, 2025. Initial setup
- June 14, 2025. Fixed deployment configuration:
  * Updated replit.toml with production build and start commands
  * Created deployment scripts (deploy.sh, start-production.sh)
  * Added production environment detection in server
  * Implemented security fixes for production deployment
  * Separated build and run phases for CloudRun deployment
  * Added comprehensive deployment documentation
- June 14, 2025. Resolved deployment command conflicts:
  * Fixed .replit vs replit.toml configuration conflicts
  * Created production-deploy.js as deployment wrapper
  * Added automatic frontend build handling
  * Ensured NODE_ENV=production enforcement
  * Fixed dependency resolution for production builds
  * Updated replit.toml to use production deployment script
- June 14, 2025. Successfully deployed via manual configuration:
  * Bypassed .replit file conflicts using manual deployment settings
  * Set build command: npx vite build && npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
  * Set run command: NODE_ENV=production node dist/index.js
  * Deployment successful with production configuration
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```