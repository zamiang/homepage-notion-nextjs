# Claude Code Memory Bank

## Project Information

- **Project**: Personal homepage/blog built with Next.js and Notion as CMS
- **Tech Stack**: Next.js 15.5.6, React 19.2.0, TypeScript 5.9.3, @notionhq/client 5.3.0, Tailwind CSS 4.1.14
- **Testing**: Vitest with 126 tests (coverage TBD)
- **Node Version**: 22.x

## Recent Updates

### JSON Feed and Schema.org JSON-LD Enhancement - Completed

**Date**: 2025-10-23

Successfully added JSON Feed 1.1 support and enhanced Schema.org JSON-LD structured data across the blog.

**JSON Feed Implementation**:

- Added JSON Feed 1.1 route at `/feed.json`
- Auto-discovery link in HTML head for feed readers
- Full content included in feed items (better UX than RSS summaries)
- Custom `_word_count` extension for analytics
- Section-based filtering (matches RSS behavior - "All" section only)
- 16 comprehensive tests covering structure, content, and edge cases

**Schema.org JSON-LD Enhancements**:

- Homepage now includes Person + Blog schema with `@graph`
- Blog posts use `BlogPosting` type with enhanced properties
- Photos use `Photograph` type (more specific than generic BlogPosting)
- Added `wordCount` property for writing posts (SEO benefit)
- Added `articleSection` for VBC posts ("Value-Based Care")
- Added `keywords` array based on post section
- Enhanced image objects with `ImageObject` type and captions
- Absolute image URLs for better search engine compatibility
- Added author and publisher URLs for entity recognition
- 13 new tests for JSON-LD validation

**Files Created**:

- `src/app/feed.json/route.ts` - JSON Feed route handler
- `__tests__/app/feed.test.ts` - 16 tests for JSON Feed
- `docs/JSON_FEED_AND_SCHEMA_IMPLEMENTATION_PLAN.md` - Implementation plan

**Files Modified**:

- `src/app/layout.tsx` - Added feed auto-discovery links
- `src/app/page.tsx` - Added homepage Person + Blog JSON-LD
- `src/lib/page-utils.ts` - Enhanced `generateJsonLd()` function
- `__tests__/lib/page-utils.test.ts` - Added 13 new JSON-LD tests

**Test Coverage Improvement**:

- Tests: 97 → 126 (+29 tests)
- Test files: 9 → 10 (+1 file)
- All 126 tests passing

**Verification**:

- ✅ All 126 tests passing
- ✅ TypeScript compilation successful
- ✅ Production build successful
- ✅ JSON Feed 1.1 spec compliant
- ✅ Schema.org valid (Person, Blog, BlogPosting, Photograph types)
- ✅ Auto-discovery working (RSS + JSON Feed)

**Benefits**:

- Modern JSON-based feed format (easier to parse than XML)
- Improved SEO with enhanced structured data
- Rich snippets potential in search results
- Better entity recognition for search engines
- Word count and article sections for content categorization

See `docs/JSON_FEED_AND_SCHEMA_IMPLEMENTATION_PLAN.md` for full implementation details.

### Dependency Updates - Completed

**Date**: 2025-10-19

Successfully updated all 18 outdated npm packages to their latest versions.

**Key Updates**:

- React: 19.1.1 → 19.2.0
- Next.js: 15.5.4 → 15.5.6
- Notion Client: 5.1.0 → 5.3.0
- TypeScript: 5.9.2 → 5.9.3
- ESLint: 9.36.0 → 9.38.0
- Tailwind CSS: 4.1.13 → 4.1.14

**Verification**:

- ✅ All 97 tests passing
- ✅ TypeScript compilation successful
- ✅ Production build successful
- ✅ No breaking changes

See `docs/DEPENDENCY_UPDATES_2025-10-19.md` for full details.

### Code Quality Improvements - Completed

**Date**: 2025-10-19

Successfully completed all high-priority items from the code quality audit:

**Improvements Made**:

1. **Added API Route Tests** (26 new tests)
   - RSS feed route: 13 tests covering XML structure, CDATA escaping, section filtering
   - Sitemap route: 13 tests covering URL generation, priorities, change frequencies

2. **Centralized Configuration** (`src/lib/config.ts`)
   - Type-safe configuration object
   - Environment variable validation with `validateNotionConfig()`
   - Single source of truth for all config values
   - Updated 8 files to use centralized config

3. **Standardized Error Handling** (`src/lib/errors.ts`)
   - Custom error classes: `NotionApiError`, `ValidationError`
   - Consistent `logError()` utility for structured error logging
   - Graceful error handling in cache functions (log and return empty array)
   - Better error context with metadata

4. **Test Coverage Improvement**
   - Coverage: 57.69% → 64.48% statements (+6.79%)
   - Tests: 71 → 97 (+26 tests)
   - Test files: 7 → 9 (+2 files)

**Files Created**:

- `__tests__/app/rss.test.ts`
- `__tests__/app/sitemap.test.ts`
- `src/lib/config.ts`
- `src/lib/errors.ts`
- `docs/HIGH_PRIORITY_IMPROVEMENTS_COMPLETED.md`

**Verification**:

- ✅ All 97 tests passing
- ✅ TypeScript compilation successful
- ✅ ESLint passing (no warnings)
- ✅ Production build successful

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

- Switched to use notion data source ids instead of Database IDs

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

- Database queries work with both posts and photos databases
