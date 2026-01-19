# Claude Code Memory Bank

> **Purpose**: This document serves as a persistent memory for Claude Code sessions, providing context about the project, recent work, and important patterns to follow.
>
> **Maintenance**: When completing significant work, update the "Recent Updates" section with a dated entry. Archive entries older than 3 months to the bottom of the file.

---

## Design Context

### Users

**Primary audience**: Engineering peers and the technical community—fellow engineers, CTOs, and technical leaders who appreciate craft and thoughtful problem-solving. Visitors arrive to evaluate Brennan's work, learn from his writing on engineering leadership and value-based care, or explore his photography. They expect a site that reflects the same care and attention to detail they'd expect in well-architected software.

### Brand Personality

**Voice**: Direct but warm. Explains complex ideas clearly without being condescending. Shares openly about challenges and learnings.

**Tone**: Reflective and substantive—prioritizes depth over polish, insight over self-promotion.

**Three words**: Thoughtful, Builder, Curious

**Emotional goals**: Visitors should feel that Brennan is approachable and thoughtful ("I'd like to work with or learn from this person") and creative/distinctive ("This person thinks differently and has taste").

### Aesthetic Direction

**Visual tone**: Sophisticated minimalism with warmth. The current "Slate Executive" palette (cool mist backgrounds, steel blue and dusty teal accents, warm copper CTAs) establishes a calm, professional foundation while the serif typography (EB Garamond) and subtle texture add personality.

**Current design language**:
- Full-bleed sections with semi-transparent backgrounds reveal floating particles beneath
- Work cards with hover states create tactile, interactive feel
- Section labels in small caps + elegant serif italic headings establish hierarchy
- Generous whitespace and 680px content width prioritize readability

**Theme**: Light mode only (current implementation)

**Colors in use**:
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#f0f2f5` | Cool Mist - page background |
| Foreground | `#2c333a` | Deep Charcoal Blue - body text |
| Primary | `#5a7684` | Steel Blue - headers, branding |
| Accent | `#749ca8` | Dusty Teal - links, borders |
| Accent Bold | `#c17f59` | Warm Copper - CTAs, emphasis |
| Muted | `#e8eaed` / `#5a6570` | Subtle backgrounds, secondary text |

### Design Principles

1. **Clarity over cleverness**: Every design choice should make content easier to consume, not harder. Typography, spacing, and visual hierarchy serve readability first.

2. **Warmth within professionalism**: Balance the cool, sophisticated palette with warm touches—the copper accent, the serif italics, the subtle texture—that make the site feel human and inviting.

3. **Craft reflects craft**: The site should demonstrate the same attention to detail and quality that Brennan brings to engineering work. Small refinements matter.

4. **Content breathes**: Generous whitespace, constrained content width, and clear section boundaries let the writing and photography take center stage.

5. **Accessible by default**: WCAG 2.1 AA compliance, reduced motion support, semantic markup. Good design works for everyone.

---

## Project Overview

### Tech Stack (Current)

| Component | Version | Notes |
|-----------|---------|-------|
| Astro | 5.16.11 | Static site generation with islands architecture |
| React | 19.2.3 | Island components only (Header, FloatingParticles) |
| TypeScript | 5.9.3 | Strict mode enabled |
| Notion Client | 5.7.0 | Uses dataSources API via custom Content Loader |
| Tailwind CSS | 4.1.18 | v4 with Vite plugin |
| Vitest | 4.0.17 | Test runner with Istanbul coverage |
| ESLint | 9.39.2 | Flat config format (eslint.config.mjs) |

### Project Statistics

- **Tests**: 132 tests (2 skipped)
- **Build Time**: ~21s (production static build)
- **Pages**: 34 static pages
- **Node Version**: 24.x

### Architecture

- **Type**: Static site generation with Astro
- **CMS**: Notion as headless CMS via Content Collections
- **Deployment**: Cloudflare Pages
- **Sections**: "All" (general posts) and "VBC" (Value-Based Care series)
- **Images**: Local images in public/images/

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

#### Astro Content Collections
```typescript
// src/content/config.ts - Define content collections with custom loaders
import { defineCollection, z } from 'astro:content';
import { notionLoader } from '../lib/notion-loader';

const posts = defineCollection({
  loader: notionLoader({
    dataSourceId: getNotionEnvVar('NOTION_DATA_SOURCE_ID'),
    filter: { property: 'Section', select: { equals: 'All' } },
  }),
  schema: z.object({ /* ... */ }),
});
```

#### Astro Islands (React Components)
```astro
---
// Use React islands for interactive components
import Header from '../components/islands/Header';
---

<!-- client:idle - hydrate when browser is idle (recommended for most) -->
<Header client:idle />

<!-- client:visible - hydrate when visible in viewport -->
<FloatingParticles client:visible />
```

#### TypeScript Configuration
```
tsconfig.json excludes Astro-specific files that use virtual modules:
- src/content/config.ts (uses astro:content)
- src/lib/notion-loader.ts (uses import.meta.env)
- src/pages/*.ts API routes

Use `npm run check` (astro check) to type-check these files.
Use `npm run typecheck` (tsc) for non-Astro TypeScript files.
```

### Testing Patterns

- **Vitest**: Test runner with global imports configured
- **React Testing Library**: Behavioral testing, avoid implementation details
- **Mocking**: Use `vi.mocked()` for type-safe mocks
- **Snapshots**: Update with `npm test -- -u` after intentional changes
- **Timezone Handling**: Use regex for date assertions (e.g., `/Aug (19|20), 2023/`)

### File Locations

| Purpose | Location | Example |
|---------|----------|---------|
| Astro Components | `src/components/` | `Footer.astro`, `PostCard.astro` |
| React Islands | `src/components/islands/` | `Header.tsx`, `FloatingParticles.tsx` |
| Pages | `src/pages/` | `index.astro`, `writing/[slug].astro` |
| API Routes | `src/pages/` | `rss.xml.ts`, `feed.json.ts` |
| Layouts | `src/layouts/` | `BaseLayout.astro`, `PostLayout.astro` |
| Content Config | `src/content/` | `config.ts` |
| Utilities | `src/lib/` | `notion-loader.ts`, `config.ts` |
| Tests | `__tests__/` | `__tests__/lib/notion.test.ts` |
| Config | Root directory | `eslint.config.mjs`, `astro.config.mjs` |

### Commands Reference

```bash
# Development
npm run dev              # Start Astro dev server
npm run build            # Production static build
npm run preview          # Preview production build locally

# Testing
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm run test:ui          # Vitest UI

# Quality Checks
npm run check            # Astro type check (includes virtual modules)
npm run typecheck        # TypeScript validation (non-Astro files)
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
- Tests: 132 passing
- All dependencies current
- 4 low severity vulnerabilities (acceptable)

**January 2026 - Astro Migration**:
- ✅ Migrated from Next.js to Astro 5
- ✅ Deployed to Cloudflare Pages (was Vercel)
- ✅ Content Collections with custom Notion loader
- ✅ React islands for interactive components

---

## Troubleshooting & Known Issues

### Common Issues

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
NOTION_DATA_SOURCE_ID=xxx                  # Posts data source ID (Notion database)
NOTION_PHOTOS_DATA_SOURCE_ID=xxx           # Photos data source ID (Notion database)
SITE_URL=https://brennanmoore.com          # Site URL for absolute links
```

### Project Structure

```
homepage-notion-nextjs/
├── src/
│   ├── pages/                 # Astro pages and API routes
│   │   ├── index.astro       # Homepage
│   │   ├── writing/[slug].astro  # Blog post pages
│   │   ├── photos/[slug].astro   # Photo pages
│   │   ├── rss.xml.ts        # RSS feed endpoint
│   │   └── feed.json.ts      # JSON feed endpoint
│   ├── layouts/               # Astro layouts
│   │   ├── BaseLayout.astro  # Base page layout
│   │   └── PostLayout.astro  # Blog post layout
│   ├── components/            # Astro and React components
│   │   ├── *.astro           # Static Astro components
│   │   └── islands/          # React islands (interactive)
│   ├── content/               # Astro content collections
│   │   └── config.ts         # Collection definitions
│   ├── lib/                   # Utilities
│   │   ├── notion-loader.ts  # Custom Notion content loader
│   │   └── config.ts         # Site configuration
│   └── styles/                # Tailwind CSS
├── __tests__/                 # Vitest tests
├── docs/                      # Project documentation
└── public/images/            # Optimized images
```

---

**Last Updated**: 2025-12-28
**Document Version**: 2.2 (December 2025 visual theme + mobile particle optimization)
