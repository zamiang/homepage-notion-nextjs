# Claude Code Memory Bank

> **Purpose**: This document serves as a persistent memory for Claude Code sessions, providing context about the project, recent work, and important patterns to follow.
>
> **Maintenance**: When completing significant work, update the "Recent Updates" section with a dated entry. Archive entries older than 3 months to the bottom of the file.

---

## Project Overview

### Tech Stack (Current)

| Component | Version | Notes |
|-----------|---------|-------|
| Next.js | 16.1.1 | Turbopack default, async route params |
| React | 19.2.3 | Using automatic JSX runtime |
| TypeScript | 5.9.3 | Strict mode enabled |
| Notion Client | 5.6.0 | Uses dataSources API (not databases) |
| Tailwind CSS | 4.1.18 | v4 with Lightning CSS |
| Vitest | 4.0.16 | Test runner with Istanbul coverage |
| ESLint | 9.39.2 | Flat config format (eslint.config.mjs) |

### Project Statistics

- **Tests**: 292 tests (2 skipped), 76.9% coverage
- **Build Time**: ~1.7s (production, with Turbopack)
- **Pages**: 38 static pages (19 photos, 13 posts, 6 utility)
- **Node Version**: 24.x (minimum 20.9.0 for Next.js 16)

### Architecture

- **Type**: Static site with ISR (Incremental Static Regeneration)
- **CMS**: Notion as headless CMS
- **Caching**: Posts cached locally in JSON files (`posts-cache.json`, `photos-cache.json`)
- **Sections**: "All" (general posts) and "VBC" (Value-Based Care series)
- **Images**: Local optimization with Next.js Image component (WebP/AVIF, quality 85)

---

## Key Patterns & Conventions

### Development Workflow

1. **Testing First**: Run tests before any changes (`npm test`)
2. **Type Safety**: Verify TypeScript compilation (`npm run typecheck`)
3. **Build Verification**: Test production builds after major changes (`npm run build`)
4. **Feature Branches**: Use descriptive branch names (e.g., `upgrade/nextjs-16`, `feature/json-feed`)

### Code Patterns

#### Notion API Usage
```typescript
// ✅ Correct (v5.x API)
await notion.dataSources.query({
  data_source_id: NOTION_DATABASE_ID,
  // ...
});

// ❌ Incorrect (old v4.x API)
await notion.databases.query({
  database_id: NOTION_DATABASE_ID,
  // ...
});
```

#### Async Route Params (Next.js 16+)
```typescript
// ✅ Correct (Next.js 16 requires Promise)
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  // ...
}
```

#### Image Configuration
```typescript
// Required in next.config.ts for custom quality values
images: {
  qualities: [75, 85],  // Must list all quality values used
  formats: ['image/webp', 'image/avif'],
  // ...
}
```

#### ESLint Configuration (v9 Flat Config)
```javascript
// eslint.config.mjs - ESLint v9 uses flat config format
import nextPlugin from 'eslint-config-next';

const eslintConfig = [
  {
    ignores: ['.next/**', 'node_modules/**', 'coverage/**'],
  },
  ...nextPlugin,
  {
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['**/__tests__/**/*.ts', '**/__tests__/**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

export default eslintConfig;
```
**Note**: ESLint v9 requires flat config format. Legacy `.eslintrc.json` files are no longer supported.

### Testing Patterns

- **Vitest**: Test runner with global imports configured
- **React Testing Library**: Behavioral testing, avoid implementation details
- **Mocking**: Use `vi.mocked()` for type-safe mocks
- **Snapshots**: Update with `npm test -- -u` after intentional changes
- **Timezone Handling**: Use regex for date assertions (e.g., `/Aug (19|20), 2023/`)

### File Locations

| Purpose | Location | Example |
|---------|----------|---------|
| Components | `src/components/` | `post-card.tsx` |
| API Routes | `src/app/*/route.ts` | `feed.json/route.ts` |
| Utilities | `src/lib/` | `notion.ts`, `config.ts` |
| Tests | `__tests__/` | `__tests__/lib/notion.test.ts` |
| Scripts | `scripts/` | `cache-posts.ts` |
| Documentation | `docs/` | `*.md` files |
| Config | Root directory | `eslint.config.mjs`, `next.config.ts` |

### Commands Reference

```bash
# Development
npm run dev              # Start dev server (Turbopack HMR)
npm run build            # Production build
npm run cache:posts      # Fetch & cache posts from Notion

# Testing
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm run test:ui          # Vitest UI

# Quality Checks
npm run typecheck        # TypeScript validation
npm run lint             # ESLint
```

---

## Recent Updates

> **Note**: Keep high-level summaries here. Link to detailed docs in `/docs` for full context.
>
> **Archive Policy**: Move entries older than 3 months to the "Archive" section at the bottom.

### December 2025 Work Summary

**Visual Theme Overhaul** (PR #872):
- ✅ Redesigned homepage layout with improved visual hierarchy
- ✅ Updated footer design with better spacing and styling
- ✅ Enhanced particle animation system with theme-aware colors
- ✅ Improved table of contents component styling
- ✅ Refreshed post layout and VBC footer components
- ✅ Added 190+ lines of new CSS utilities in `globals.css`

**Floating Particles Optimization**:
- ✅ Disabled particle background on mobile browsers (viewport < 768px)
- ✅ Uses existing `useIsMobile` hook for responsive detection
- ✅ Improves mobile performance by skipping animation entirely

**Infrastructure**:
- ✅ Added GitHub Actions workflow for Claude Code (`.github/workflows/claude.yml`)
- ✅ Updated all dependencies to latest versions
- ✅ Node.js 24.x support confirmed

**Key Metrics**:
- Tests: 292 passing (76.9% coverage, +71 tests since October)
- All dependencies current
- 0 security vulnerabilities

---

## Troubleshooting & Known Issues

### Common Issues

**Image Quality Warnings (Next.js 16)**
```
Image with src "..." is using quality "85" which is not configured in images.qualities
```
**Solution**: Add `qualities: [75, 85]` to `images` config in `next.config.ts`

**Notion API Errors**
- Ensure using `dataSources.query()` not `databases.query()` (v5+ API)
- Verify `data_source_id` is correct in environment variables
- Check API version is compatible (default 2025-09-03 works)

**Test Failures**
- Date assertions: Use regex for timezone variations (e.g., `/Aug (19|20), 2023/`)
- Snapshot mismatches: Review changes, update with `npm test -- -u` if intentional
- Mock errors: Use `vi.mocked()` for type-safe mocking

---

## Archive

<details>
<summary><strong>Detailed Update History (Expand for full details)</strong></summary>

### October 2025 Work Summary (Archived)

**Major Accomplishments**:
- ✅ **Next.js 16 Upgrade**: 15.5.6 → 16.0.0, Turbopack default, 19% faster builds
- ✅ **ESLint v9 Migration**: 8.57.1 → 9.38.0, flat config format, fixed React hooks pattern
- ✅ **Test Coverage**: 59.79% → 75.79% (+95 tests across 7 new test files)
- ✅ **Image Optimization**: Responsive sizing, WebP/AVIF support, 40-60% bandwidth reduction
- ✅ **JSON Feed**: Added JSON Feed 1.1 route with Schema.org enhancements
- ✅ **Code Quality**: Centralized config, standardized error handling, API route tests

**Documentation**:
- 📄 [Next.js 16 Upgrade](docs/NEXTJS_16_UPGRADE_COMPLETED_2025-10-23.md)
- 📄 [Test Coverage Plan](docs/CODE_QUALITY_AUDIT_2025-10-23.md)
- 📄 [Image Optimization](docs/IMAGE_OPTIMIZATION_IMPLEMENTATION.md)
- 📄 [Dependency Updates](docs/DEPENDENCY_UPDATES_PLAN_2025-10-23.md)

### ESLint v9 & Dependency Updates - Completed

**Date**: 2025-10-24

Successfully upgraded ESLint to v9 and updated all outdated dependencies for Next.js 16 compatibility.

**Packages Updated**:

1. **@vitejs/plugin-react**: 5.0.4 → 5.1.0 (minor update)
2. **ESLint**: 8.57.1 → 9.38.0 (major upgrade)
   - Migrated to flat config format (`eslint.config.mjs`)
   - Removed legacy `.eslintrc.json` file
   - Added `coverage/` to ignore patterns
3. **eslint-config-next**: 15.5.6 → 16.0.0 (Next.js 16 compatibility)
4. **react-syntax-highlighter**: Evaluated v16 upgrade
   - v16.0.0 has refractor v5 compatibility issues
   - Staying on v15.6.6 until patches released
   - Security fixes in v16 only affect refractor (we use Prism)

**Code Fixes**:

- Fixed `use-mobile.ts` React hook (src/hooks/use-mobile.ts:6-13)
  - Resolved ESLint error: "Calling setState synchronously within an effect"
  - Used lazy initializer pattern for `useState`
  - Added SSR check with `typeof window !== 'undefined'`

**ESLint v9 Migration**:

- Created new `eslint.config.mjs` with flat config format
- Native import of `eslint-config-next` (no FlatCompat needed)
- Updated ignore patterns to include `coverage/**`
- Preserved all custom rules for tests and project

**Files Modified**:

- `eslint.config.mjs` (created)
- `.eslintrc.json` (removed)
- `src/hooks/use-mobile.ts` (fixed React pattern)
- `package.json` & `package-lock.json` (dependency updates)

**Verification**:

- ✅ All 221 tests passing
- ✅ ESLint v9 running without errors or warnings
- ✅ TypeScript compilation successful
- ✅ Production build successful (1.7s)
- ✅ 0 security vulnerabilities (down from 3)

**Key Learnings**:

- ESLint v9 requires flat config format (`.mjs` file)
- `eslint-config-next@16` works natively with ESLint v9
- React hooks should initialize state with lazy initializers, not in effects
- Coverage directory should be ignored in ESLint config

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

</details>

---

## Quick Reference

### Environment Variables Required

```bash
NOTION_TOKEN=secret_xxx                    # Notion API integration token
NOTION_POSTS_DATABASE_ID=xxx               # Posts database/datasource ID
NOTION_PHOTOS_DATABASE_ID=xxx              # Photos database/datasource ID
SITE_URL=https://brennanmoore.com          # Site URL for absolute links
```

### Project Structure

```
homepage-notion-nextjs/
├── src/
│   ├── app/                    # Next.js 16 App Router
│   │   ├── (routes)/          # Page routes
│   │   ├── feed.json/         # JSON Feed route
│   │   ├── rss.xml/           # RSS feed route
│   │   └── sitemap.xml/       # Dynamic sitemap
│   ├── components/            # React components
│   ├── lib/                   # Utilities (notion, config, errors)
│   └── styles/                # Tailwind CSS
├── __tests__/                 # Vitest tests
├── scripts/                   # Build scripts (cache-posts.ts)
├── docs/                      # Project documentation
├── posts-cache.json          # Cached posts from Notion
├── photos-cache.json         # Cached photos from Notion
└── public/images/            # Optimized images
```

---

**Last Updated**: 2025-12-28
**Document Version**: 2.2 (December 2025 visual theme + mobile particle optimization)
