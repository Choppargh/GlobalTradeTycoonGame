# Database Configuration - Development vs Production

## Overview

Your Global Trade Tycoon project now supports separate databases for development and production environments to ensure data isolation and better development practices.

## Database Setup

### Current Configuration
- **Development Database**: Uses `DATABASE_URL_DEV` or falls back to `DATABASE_URL`
- **Production Database**: Uses `DATABASE_URL` (configured in deployment settings)

### Environment Variables

#### Development (.env.development)
```
DATABASE_URL_DEV=postgresql://neondb_owner:npg_IVOoUS9drQJ3@ep-soft-credit-a6be0bu1.us-west-2.aws.neon.tech/neondb?sslmode=require
```

#### Production (.env.production)
```
# DATABASE_URL will be set by deployment environment
```

## Database Selection Logic

The system automatically selects the appropriate database based on `NODE_ENV`:

1. **Production** (`NODE_ENV=production`):
   - Uses `DATABASE_URL` from deployment environment
   
2. **Development** (default):
   - Uses `DATABASE_URL_DEV` if available
   - Falls back to `DATABASE_URL` if `DATABASE_URL_DEV` is not set

## Commands for Database Management

### Development Database Operations
```bash
# Push schema changes to development database
NODE_ENV=development npm run db:push

# Generate migrations for development
NODE_ENV=development npm run db:generate

# Studio for development database
NODE_ENV=development npm run db:studio
```

### Production Database Operations
```bash
# Push schema changes to production database (use with caution)
NODE_ENV=production npm run db:push

# Studio for production database
NODE_ENV=production npm run db:studio
```

## Database Migration Strategy

1. **Development**: Test all schema changes in development database first
2. **Testing**: Verify migrations work correctly with existing data
3. **Production**: Apply tested migrations to production database
4. **Backup**: Always backup production data before major schema changes

## Benefits of Separate Databases

- **Data Safety**: Development testing won't affect production user data
- **Schema Testing**: Test database migrations safely before production
- **Performance**: Development queries don't impact production performance
- **User Privacy**: Real user data stays isolated in production environment
- **Rollback Safety**: Can test rollback procedures in development

## Important Notes

- The `drizzle.config.ts` file uses the main `DATABASE_URL` and cannot be modified
- For development work, ensure `DATABASE_URL_DEV` is set in your `.env.development` file
- Production deployments will automatically use the `DATABASE_URL` from deployment settings
- Always test schema changes in development before applying to production