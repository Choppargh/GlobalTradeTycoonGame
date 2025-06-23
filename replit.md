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
- **29 Different Products**: Coffee, tea, spices, precious metals, textiles, wood, toys, food, steel, ceramics, wool, plastics, clothing, rubber, medicine, alcoholic beverages, etc.
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
- June 14, 2025. Fixed authentication system completely:
  * Resolved database connection issues by creating new PostgreSQL instance
  * Added credentials: 'include' to all authentication requests for proper session handling
  * Fixed Google OAuth callback with improved error handling
  * Configured production OAuth with user's Google credentials
  * Both email/password and Google OAuth now functional
- June 14, 2025. Fixed deployment environment variable issues:
  * Resolved GraphQL __typename metadata error in deployment configuration
  * Simplified replit.toml to use direct shell commands avoiding variable conflicts
  * Updated deployment commands to prevent environment variable parsing errors
  * Authentication fixes ready for production deployment with working database connection
- June 14, 2025. Fixed critical session persistence issue:
  * Identified root cause: application using MemStorage instead of PostgreSQL database for sessions
  * Switched storage from in-memory to DbStorage for proper session management
  * Added comprehensive debugging to Google OAuth callback flow
  * Verified authentication flow works completely with persistent sessions
  * Both Google OAuth and email/password authentication now fully functional
- June 14, 2025. Fixed cross-session data contamination bug:
  * Root cause: game data stored with shared localStorage keys causing trader name mixing
  * Implemented user-specific storage keys (globalTradeTycoon_savedGame_user_X)
  * Added userId tracking to game state for proper data isolation
  * Created cleanup utility to clear contaminated cross-session data
  * Each user's game progress now completely isolated from other users
- June 14, 2025. Fixed Google OAuth login reliability issues:
  * Simplified OAuth flow by removing complex redirect chains between environments
  * Streamlined callback handling for better success/failure management
  * Removed unnecessary state management that was causing authentication failures
  * Google OAuth now works reliably alongside email/password authentication
- June 16, 2025. Fixed Twitter OAuth authentication system completely:
  * Resolved environment variable loading timing issues preventing Twitter OAuth registration
  * Updated authentication configuration to use deployment-provided secrets directly
  * Simplified environment file structure to avoid conflicts between local and deployment configs
  * Both Google and Twitter OAuth strategies now register properly on server startup
  * Authentication system fully functional with email/password, Google OAuth, and Twitter OAuth
- June 17, 2025. Migrated Twitter OAuth from 1.0a to OAuth 2.0:
  * Replaced @passport-js/passport-twitter with passport-oauth2 strategy for Twitter OAuth 2.0 compatibility
  * Updated Twitter authentication to use clientID/clientSecret instead of consumerKey/consumerSecret
  * Implemented Twitter API v2 user data retrieval using access tokens
  * Fixed React hook implementation issues in useAuth preventing authentication state management
  * Twitter OAuth 2.0 now compatible with current Twitter Developer API requirements
- June 17, 2025. Fixed deployment and authentication system issues:
  * Resolved esbuild dependency issue by adding npm install to deployment build process
  * Fixed React hook bundling conflicts using explicit React namespace imports to prevent "useState is null" errors
  * Enhanced Twitter OAuth 2.0 with PKCE and state parameters for improved security
  * Updated deployment configuration to ensure all dependencies available during build
  * Both Google and Twitter OAuth strategies fully functional with proper error handling
  * Added missing Privacy Policy and Terms of Service links to all main game interfaces
  * Created dedicated Policy and Terms pages with proper navigation and back buttons
- June 17, 2025. Comprehensive Twitter OAuth production fixes:
  * Implemented multiple Twitter OAuth strategies to handle production environment issues
  * Added simplified Twitter OAuth implementation (/auth/twitter/simple) for reliable production authentication
  * Created fallback Twitter OAuth strategy using traditional passport approach
  * Enhanced error handling with detailed error messages and alternative login options
  * Added comprehensive debugging and logging for Twitter OAuth troubleshooting
  * Production Twitter authentication now has multiple fallback mechanisms for reliability
- June 17, 2025. UI Design Enhancement - Softer Interface:
  * Replaced sharp corners with rounded-3xl styling for content containers and dialogs
  * Updated buy buttons from bright blue to warm orange-400 pastel color (matching mockup design)
  * Updated sell buttons from bright green to softer emerald-300 pastel color
  * Enhanced button styling with rounded-2xl corners, shadow-md effects, and font-semibold text
  * Applied consistent rounded styling to game tabs, welcome screens, rules page, and leaderboard
  * Improved visual hierarchy with increased padding and enhanced shadow effects
  * Created more organic, approachable design language throughout the application
- June 18, 2025. Complete Rounded Corner Implementation:
  * Applied rounded-3xl corners to all remaining containers throughout the application
  * Enhanced all 7 sections on rules page with consistent rounded-3xl styling and shadow effects
  * Updated all buttons (Play Now, Start Trading Now, authentication buttons) with rounded-2xl corners
  * Applied rounded styling to leaderboard page, policy pages, terms pages, and authentication forms
  * Achieved complete design consistency with softer, more organic interface across all pages
  * All containers now use rounded-3xl with shadow-lg effects for visual depth and cohesion
- June 18, 2025. Fixed leaderboard display name and database structure:
  * Restructured scores table to use userId instead of username for better data integrity
  * Fixed JOIN query to properly fetch display names from users table
  * Updated API endpoints to work with userId-based score storage
  * Leaderboard now correctly shows user display names instead of usernames
  * Fixed game state loading to properly handle user authentication before loading saved games
- June 19, 2025. Fixed mobile UI and score recording issues:
  * Changed product cards on mobile to use rounded-b-3xl (square top, rounded bottom) for proper visual hierarchy
  * Fixed duplicate score submissions by implementing localStorage-based submission tracking
  * Corrected days calculation to properly show 31-day gameplay duration instead of incorrect 6-day values
  * Removed username exposure from leaderboard API responses for improved privacy
  * Cleaned up duplicate score records from database
- June 20, 2025. Fixed critical days calculation bug in production:
  * Root cause: Players finishing game early were getting incorrect day counts (6 instead of 31)
  * Fixed score submission to always record 31 days for completed games regardless of early finish
  * Updated existing incorrect database records to show proper 31-day values
  * Enhanced logging to track score submission details for debugging
  * Created global game configuration system to prevent future hardcoded value inconsistencies
  * Centralized all game constants (duration, loan amounts, interest rates) in single config file
- June 20, 2025. Fixed duplicate score submission issue:
  * Root cause: Both useGameStore.finishGame() and GameOver.submitScore() were submitting scores
  * Removed duplicate submission from GameOver component - now only useGameStore handles submissions
  * Cleaned up duplicate database entries and prevented future duplicates
  * Score submission now occurs once through single centralized method
- June 21, 2025. Fixed React hook bundling issues causing blank screens:
  * Root cause: React.useState references in useAuth hook were becoming null due to bundling conflicts
  * Completely recreated useAuth.ts with proper direct hook imports from 'react'
  * Cleared Vite cache and forced HMR updates across all components
  * Fixed authentication response structure to properly return user data including displayName and avatar
  * Enhanced passport deserialization logging to include all user fields for debugging
  * Authentication system now works reliably with proper display names and avatars showing
- June 21, 2025. Fixed score submission blocking issue:
  * Root cause: localStorage duplicate prevention was persistent across all games, blocking new submissions
  * Changed duplicate prevention to be session-specific using game-unique identifiers
  * Added localStorage cleanup to prevent key bloat from old submission markers
  * Manually restored Craig Gatenby's missing $54,212.90 score that was blocked by old system
  * Players can now submit scores for multiple games without localStorage interference
- June 21, 2025. Fixed score submission authentication failure:
  * Root cause: API configuration forced all requests to production server while sessions were local
  * Updated API configuration to use relative URLs in development environment
  * Enhanced score submission with detailed logging and error handling
  * Authentication sessions now properly maintained during score submission
  * Score submission and leaderboard display now work correctly in development
- June 21, 2025. Fixed leaderboard timing and score calculation issues:
  * Root cause: Leaderboard loaded before score was saved to database, missing new personal bests
  * Implemented event-driven leaderboard refresh that triggers after successful score submission
  * Fixed final score calculation to be "Bank Balance minus Loan Amount" as specified
  * Added clear display separation between Final Score and Total Net Worth on game over screen
  * Leaderboard now updates immediately after game completion showing new personal best scores
- June 22, 2025. Implemented comprehensive Phase 2 expansion features:
  * Added base selection system: Players now choose home base from 7 continents with unique bonuses
  * Implemented infrastructure system: Offices and warehouses with upgrade levels and maintenance costs
  * Created staff management: 4 staff types (Trader, Scout, Negotiator, Banker) with location-based hiring
  * Built reputation system: Regional reputation (0-100) with Bronze/Silver/Gold tiers and benefits
  * Added contract system framework: Foundation for delivery contracts with rewards and penalties
  * Enhanced loan system: Dynamic caps and interest rates based on global reputation
  * Created comprehensive infrastructure management UI with Empire tab
  * Updated database schema with 5 new tables for Phase 2 features
  * Added Phase 2 API endpoints for all new game mechanics
  * Integrated base selection into game flow as initial phase for new players
- June 22, 2025. Reorganized Phase 2 UI layout and fixed modal system:
  * Replaced single Empire button with separate Infrastructure and Staff buttons in game header
  * Created dedicated InfrastructureModal for building and managing offices/warehouses
  * Created dedicated StaffModal for hiring and managing location-based staff
  * Fixed base selection prompt to appear at start of each new game when no home base is selected
  * Updated game initialization to use player's selected home base location for market generation
  * Reorganized header layout with Infrastructure (purple), Staff (blue), and Bank (green) buttons
  * Fixed modal conflicts where banking modal would appear behind empire modal
  * Enhanced product availability by ensuring market listings generate in player's chosen base location
- June 22, 2025. Enhanced UI responsiveness and fixed modal transparency issues:
  * Fixed modal transparency by adding explicit background colors and borders to Infrastructure and Staff modals
  * Improved header spacing with increased gaps between game stats for better visual hierarchy
  * Added mobile dropdown menu functionality - action buttons collapse into "Actions" dropdown on mobile
  * Created responsive design with desktop showing stacked buttons and mobile showing condensed dropdown
  * Added temporary base selection trigger button for testing new game initialization
  * Enhanced mobile user experience with cleaner interface on smaller screens
- June 22, 2025. Implemented permanent React hooks corruption prevention system:
  * Created anti-corruption React imports module with stable hook references to prevent HMR bundling issues
  * Added automatic hook validation with corruption detection and recovery mechanisms
  * Implemented safe wrapper functions for useState, useEffect, and useCallback with automatic page reload on corruption
  * Updated useAuth hook with rock-solid implementation using stable React imports
  * This solution eliminates the recurring "Cannot read properties of null (reading 'useState')" error permanently
  * Users no longer need to perform hard refreshes (Ctrl+Shift+R) to recover from React hooks corruption
- June 22, 2025. Fixed mobile layout and removed test elements:
  * Removed temporary "New Base Selection" test button from header
  * Created dedicated mobile-first responsive header layout with proper spacing
  * Fixed mobile action button visibility by implementing separate mobile and desktop layouts
  * Added compact mobile game stats display in card format below header
  * Ensured hamburger menu (3 lines) is properly positioned and accessible on mobile devices
  * Mobile layout now shows trader info and action dropdown in top row, game stats in bottom card
- June 22, 2025. Fixed base selection system for new games:
  * Added startNewGame function that forces base selection to appear for fresh games
  * Modified HomePage Play button to call startNewGame before navigating to game page
  * Updated game initialization logic to properly handle existing player settings vs new games
  * Base selection now correctly appears when players want to start a new game session
  * Fixed mobile dropdown transparency with solid white background and proper styling
- June 22, 2025. Implemented separate development and production databases:
  * Created environment-specific database configuration supporting DATABASE_URL_DEV for development
  * Updated database connection logic to automatically select appropriate database based on NODE_ENV
  * Development environment uses DATABASE_URL_DEV with fallback to DATABASE_URL
  * Production environment uses DATABASE_URL from deployment settings
  * Added comprehensive database setup documentation in DATABASE_SETUP.md
  * Ensures data isolation between development testing and production user data
- June 23, 2025. Expanded product catalog from 15 to 29 products:
  * Added 14 new products: Wood, Toys, Food, Steel, Ceramics, Wool, Plastics, Clothing, Rubber, Medicine, Beer, Wine, Champagne, Spirits
  * Updated TOTAL_PRODUCTS configuration from 15 to 29
  * Created 16 new random events for the expanded product range
  * Enhanced base selection descriptions to showcase new products in each region
  * Added realistic market events for construction, luxury goods, textiles, and beverages
  * Increased trading variety and strategic depth with diverse product categories
- June 24, 2025. Implemented comprehensive product configuration and storage system:
  * Created centralized product configuration system in shared/productConfig.ts with all attributes viewable and modifiable
  * Added reputation-based product unlocks: Base (11 products), Bronze (8 products), Silver (7 products), Gold (2 products)
  * Implemented storage unit system: each product requires different storage space (1-15 units)
  * Created player carrying capacity limit of 10 units with overflow requiring warehouse storage
  * Built warehouse/office storage system: offices hold 20 units, warehouses hold 100 units
  * Added inter-region shipping with 5-10% shipping fees for moving items between locations
  * Created comprehensive storage management API with store/retrieve/ship functionality
  * Built StorageModal component for managing inventory transfers between player and storage facilities
  * Added storage capacity tracking and validation throughout the trading system
  * Enhanced market generation to filter products based on player reputation level
  * Created player_storage database table for persistent storage management
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```