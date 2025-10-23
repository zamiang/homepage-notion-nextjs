# Claude Code Memory Bank

## Project Information

- **Project**: Personal homepage/blog built with Next.js and Notion as CMS
- **Tech Stack**: Next.js 16.0.0, React 19.2.0, TypeScript 5.9.3, @notionhq/client 5.3.0, Tailwind CSS 4.1.14, Vitest 4.0.2
- **Testing**: Vitest with 221 tests, 75.79% coverage
- **Node Version**: 22.x (Next.js 16 requires 20.9.0+)

## Recent Updates

### Next.js 16 Upgrade - Completed

**Date**: 2025-10-23

Successfully upgraded Next.js from 15.5.6 to 16.0.0 and eslint-config-next to 16.0.0.

**Key Changes**:

- **Next.js**: 15.5.6 → 16.0.0 (major version with Turbopack default)
- **eslint-config-next**: 15.5.6 → 16.0.0
- **Vitest ecosystem**: 4.0.1 → 4.0.2 (Phase 1)
- **Test Coverage**: Maintained 75.79% (221 passing tests)

**Breaking Changes Handled**:

1. **Async Request APIs**: Already prepared - codebase was using `params: Promise<{ slug: string }>` pattern
2. **ESLint Config Removal**: Removed deprecated `eslint` option from `next.config.ts`
3. **Image Quality Config**: Added `qualities: [75, 85]` to `next.config.ts` (required for custom quality values)
4. **Image Quality Defaults**: Updated snapshots (quality changed from 85 to 75 default)
5. **Turbopack Default**: Now default for both dev and build (1.7s build time, down from 2.1s)

**Files Modified**:

- `package.json` - Updated Next.js and eslint-config-next versions
- `next.config.ts` - Removed eslint config, added qualities array
- `tsconfig.json` - Auto-updated by Next.js (jsx: react-jsx, new type includes)
- `__tests__/components/__snapshots__/photo-card.test.tsx.snap` - Updated for new quality defaults

**Verification**:

- ✅ All 221 tests passing (2 skipped)
- ✅ TypeScript compilation successful
- ✅ Production build successful (38 pages in 1.7s)
- ✅ No runtime warnings or errors

**Benefits**:

- 19% faster build times (1.7s vs 2.1s)
- Turbopack's faster HMR in development
- Access to React 19 features
- Better caching and optimization
- Up-to-date with latest Next.js features

See `docs/NEXTJS_16_UPGRADE_COMPLETED_2025-10-23.md` for complete details.

### Test Coverage Improvement - Completed

**Date**: 2025-10-23

Implemented Phase 1 and Phase 2 of the test coverage improvement plan from the code quality audit.

**Coverage Improvement**:

- Coverage: 59.79% → 75.79% (+16%)
- Tests: 126 → 221 (+95 tests)
- Test Files: 10 → 17 (+7 files)
- Grade: A- (88/100) → A (93/100)

**Phase 1: Error Handling Tests** (29 tests)
- `__tests__/lib/config.test.ts` - 11 tests for environment validation
- `__tests__/lib/errors.test.ts` - 18 tests for error utilities

**Phase 2: UI Component Tests** (66 tests)
- `__tests__/components/post-card.test.tsx` - 9 tests
- `__tests__/components/photo-card.test.tsx` - 11 tests
- `__tests__/components/series-post-card.test.tsx` - 16 tests
- `__tests__/components/vbc-footer.test.tsx` - 13 tests
- `__tests__/components/ui/table.test.tsx` - 19 tests

**Test Improvements**:

- Fixed timezone issues with date formatting tests
- Fixed reading time calculation tests (250 words = 2 min read at 225 wpm)
- Improved VBC Footer mocking with `vi.mocked()` pattern
- Added behavioral assertions for user interactions

**Verification**:

- ✅ All 221 tests passing
- ✅ 75.79% coverage (exceeded 70% target by 5.79%)
- ✅ TypeScript compilation successful
- ✅ Production build successful

See `docs/CODE_QUALITY_AUDIT_2025-10-23.md` (updated) for remaining work.

### Image Optimization Implementation - Completed

**Date**: 2025-10-23

Implemented Phase 1 quick wins from the image optimization plan to reduce bandwidth usage.

**Optimizations**:

1. **Responsive Image Sizing**: Added `sizes` prop to PhotoCard
   - `"(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`
   - Prevents loading oversized images on mobile devices

2. **Quality Settings**: Added `quality={85}` for high-quality photos
   - Better balance between quality and file size

3. **Modern Formats**: Configured WebP and AVIF in `next.config.ts`
   - `formats: ['image/webp', 'image/avif']`
   - Automatic format selection based on browser support

4. **Priority Loading**: Added `priority` prop support to PhotoCard
   - Used on homepage hero image for better LCP
   - Prevents lazy loading for above-the-fold images

5. **MDX Image Improvements**: Better aspect ratio (1200x800 vs 1000x1000)
   - Responsive sizes for blog post images
   - Consistent quality settings

**Expected Results**:

- 40-60% bandwidth reduction overall
- 70-75% reduction on mobile devices
- Improved Largest Contentful Paint (LCP)
- Better Core Web Vitals scores

**Files Modified**:

- `src/components/photo-card.tsx` - Added sizes, quality, priority props
- `src/components/mdx-component.tsx` - Improved dimensions and sizes
- `next.config.ts` - Added formats, deviceSizes, imageSizes, qualities
- `src/app/page.tsx` - Added priority to homepage hero image

See `docs/IMAGE_OPTIMIZATION_IMPLEMENTATION.md` for detailed metrics.

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
