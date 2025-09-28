# Claude Code Memory Bank

## Project Information
- **Project**: Personal homepage/blog built with Next.js and Notion as CMS
- **Tech Stack**: Next.js 15.5.4, TypeScript, @notionhq/client 5.1.0, notion-to-md, Tailwind CSS
- **Testing**: Vitest with 71 tests
- **Node Version**: 22.x

## Recent Updates

### @notion/client Migration (v4.0.2 → v5.1.0) - Completed
**Date**: 2025-09-28

Successfully migrated from @notion/client v4.0.2 to v5.1.0 without breaking functionality.

**Key Changes Made**:
1. **API Method Change**: `notion.databases.query()` → `notion.dataSources.query()`
2. **Parameter Change**: `database_id` → `data_source_id`
3. **Import Path Fix**: `ImageBlockObjectResponse` now imported from main module
4. **API Version**: Using default API version (2025-09-03) - older versions had compatibility issues
5. **Test Updates**: Updated mocks to use `dataSources` instead of `databases`

**Important Notes**:
- Initially tried to use `notionVersion: '2022-06-28'` for backward compatibility, but this caused "Invalid request URL" errors
- The fix was to use the default API version (2025-09-03) with `data_source_id` parameter
- Database IDs remain the same, but the API treats them as data source IDs in the new version

**Files Modified**:
- `src/lib/notion.ts` - Core Notion API interactions
- `scripts/cache-posts.ts` - Post caching script
- `__tests__/lib/notion.test.ts` - Unit tests

**Verification**:
- ✅ All 71 tests pass
- ✅ TypeScript compilation successful
- ✅ Build completes without errors
- ✅ Static generation works correctly

## Commands to Remember

### Development
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm test` - Run all tests
- `npm run typecheck` - TypeScript validation
- `npm run lint` - ESLint
- `npm run cache:posts` - Cache posts from Notion

### Testing
- `npm run test:watch` - Watch mode testing
- `npm run test:coverage` - Coverage report
- `npm run test:ui` - Vitest UI

## Architecture Notes

### Notion Integration
- Uses Notion as headless CMS for blog posts and photos
- Posts cached locally in `posts-cache.json` and `photos-cache.json`
- Supports two sections: "All" (general posts) and "VBC" (Value-Based Care posts)
- Image handling with local download and optimization

### File Structure
- `src/lib/notion.ts` - Main Notion API wrapper
- `scripts/cache-posts.ts` - Caching script for posts and photos
- `__tests__/` - Test files using Vitest
- Posts cached as JSON files in project root

### API Compatibility
- Currently using Notion API version `2022-06-28` for stability
- Migration to newer API versions would require updating to `dataSources` endpoints
- Database queries work with both posts and photos databases