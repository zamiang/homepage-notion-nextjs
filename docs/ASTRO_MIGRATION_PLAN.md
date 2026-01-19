# Next.js to Astro 6 Migration Plan

> **Created**: 2026-01-19
> **Updated**: 2026-01-19
> **Status**: ✅ MIGRATION COMPLETE
> **Target**: Astro 5 (Cloudflare Pages deployment)
> **Current Stack**: Astro 5.16, React 19, TypeScript 5.9, Tailwind CSS 4

---

## Executive Summary

This document outlines a phased migration from Next.js 16 to Astro 6 for the brennanmoore.com portfolio/blog site. The migration prioritizes:

1. **Zero-downtime transition** — Migrated incrementally with parallel testing
2. **Incremental adoption** — Migrated page-by-page, component-by-component
3. **Preserving functionality** — All features work identically
4. **Test suite maintained** — 132 tests for utilities, hooks, and React components

**Estimated scope**: 4-6 focused sessions of work

---

## Migration Status

| Phase   | Description              | Status                          |
| ------- | ------------------------ | ------------------------------- |
| Phase 0 | Preparation              | ✅ Complete                     |
| Phase 1 | Notion Content Loader    | ✅ Complete                     |
| Phase 2 | Static Components        | ✅ Complete                     |
| Phase 3 | Page Routes              | ✅ Complete                     |
| Phase 4 | Interactive Islands      | ✅ Complete                     |
| Phase 5 | API Endpoints (RSS/JSON) | ✅ Complete                     |
| Phase 6 | Configuration & Security | ✅ Complete (Cloudflare Pages)  |
| Phase 7 | Testing Migration        | ✅ Complete (132 tests passing) |
| Phase 8 | Final Deployment         | ✅ Complete (Cloudflare Pages)  |

**Build Output**: 34 pages in ~21s

- 20 photo pages
- 13 writing pages
- 1 index page
- RSS and JSON feeds
- Sitemap auto-generated

---

## Table of Contents

1. [Current Architecture Analysis](#current-architecture-analysis)
2. [Target Architecture](#target-architecture)
3. [Migration Phases](#migration-phases)
4. [File-by-File Migration Map](#file-by-file-migration-map)
5. [Notion Integration Strategy](#notion-integration-strategy)
6. [Interactive Components (Islands)](#interactive-components-islands)
7. [Testing Strategy](#testing-strategy)
8. [Deployment Strategy](#deployment-strategy)
9. [Rollback Plan](#rollback-plan)
10. [Decision Log](#decision-log)

---

## Current Architecture Analysis

### Tech Stack Inventory

| Component          | Current        | Astro Equivalent                          |
| ------------------ | -------------- | ----------------------------------------- |
| Framework          | Next.js 16.1.3 | Astro 6.x                                 |
| React              | 19.2.3         | `@astrojs/react` (keep React for islands) |
| TypeScript         | 5.9.3          | Native support                            |
| Tailwind CSS       | 4.1.18         | `@astrojs/tailwind`                       |
| Notion Client      | 5.7.0          | Custom loader or community loader         |
| Testing            | Vitest 4.0.17  | Vitest (same)                             |
| Image Optimization | Next.js Image  | `@astrojs/image` or `astro:assets`        |

### Pages Inventory (8 routes)

| Route             | Type      | Complexity                                     |
| ----------------- | --------- | ---------------------------------------------- |
| `/`               | Static    | Medium (hero, recent work, particle animation) |
| `/writing/[slug]` | Dynamic   | High (MDX rendering, TOC, JSON-LD)             |
| `/photos/[slug]`  | Dynamic   | Medium (image gallery, JSON-LD)                |
| `/rss.xml`        | API Route | Low                                            |
| `/feed.json`      | API Route | Low                                            |
| `/sitemap.xml`    | Generated | Low (built-in in Astro)                        |
| `/robots.txt`     | Generated | Low (built-in in Astro)                        |

### Components Inventory (17 components)

**Layout Components** (convert to `.astro`):

- `layout.tsx` — Main layout wrapper
- `header.tsx` — Site header/navigation
- `footer.tsx` — Site footer
- `post-layout.tsx` — Blog post layout

**Content Components** (convert to `.astro`):

- `post-card.tsx` — Blog post preview card
- `photo-card.tsx` — Photo preview card
- `series-post-card.tsx` — VBC series card
- `posts-footer.tsx` — Post navigation footer
- `vbc-footer.tsx` — VBC series footer
- `table-of-contents.tsx` — TOC sidebar
- `mdx-component.tsx` — MDX renderer

**Interactive Components** (keep as React islands):

- `floating-particles.tsx` — Canvas animation (client-side only)
- `particles/particle-canvas.tsx` — Canvas rendering

**UI Components** (convert to `.astro` or keep React):

- `ui/button.tsx` — Button component
- `ui/label.tsx` — Form label
- `ui/table.tsx` — Data table
- `ui/badge.tsx` — Badge component

### Dependencies to Replace

| Current                  | Astro Replacement          | Notes                       |
| ------------------------ | -------------------------- | --------------------------- |
| `next`                   | `astro`                    | Core framework              |
| `next/image`             | `astro:assets`             | Built-in image optimization |
| `next/link`              | Native `<a>` tags          | Astro handles prefetching   |
| `@vercel/analytics`      | `@astrojs/vercel` adapter  | Or custom script            |
| `@vercel/speed-insights` | Same (works in Astro)      |                             |
| `next-secure-headers`    | Astro middleware or config | CSP in Astro 6              |
| `sitemap` package        | `@astrojs/sitemap`         | Built-in                    |

### Dependencies to Keep

- `@notionhq/client` — Notion API (used in loader)
- `notion-to-md` — Markdown conversion
- `react`, `react-dom` — For island components
- `tailwindcss`, `tailwind-merge`, `clsx` — Styling
- `date-fns` — Date formatting
- `react-markdown`, `rehype-raw`, `remark-gfm` — Content rendering
- `react-syntax-highlighter` — Code blocks
- `vitest`, `@testing-library/*` — Testing

---

## Target Architecture

### Directory Structure

```
brennanmoore-astro/
├── astro.config.mjs           # Astro configuration
├── src/
│   ├── components/            # .astro and React components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── PostCard.astro
│   │   ├── PhotoCard.astro
│   │   ├── islands/           # React client components
│   │   │   └── FloatingParticles.tsx
│   │   └── ui/                # Shared UI (keep React or convert)
│   ├── content/
│   │   └── config.ts          # Content Collections schema
│   ├── layouts/
│   │   ├── BaseLayout.astro   # HTML shell
│   │   └── PostLayout.astro   # Blog post layout
│   ├── lib/
│   │   ├── notion-loader.ts   # Custom Notion content loader
│   │   ├── config.ts          # Site configuration
│   │   └── utils.ts           # Shared utilities
│   ├── pages/
│   │   ├── index.astro        # Homepage
│   │   ├── writing/
│   │   │   └── [slug].astro   # Blog post pages
│   │   ├── photos/
│   │   │   └── [slug].astro   # Photo pages
│   │   ├── rss.xml.ts         # RSS endpoint
│   │   └── feed.json.ts       # JSON Feed endpoint
│   └── styles/
│       └── globals.css        # Global styles
├── public/
│   └── images/                # Static images (downloaded from Notion)
├── __tests__/                 # Test files (adapted for Astro)
└── package.json
```

### Content Collections Schema

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

import { notionLoader } from '../lib/notion-loader';

const posts = defineCollection({
  loader: notionLoader({
    dataSourceId: import.meta.env.NOTION_DATA_SOURCE_ID,
    filter: { property: 'Section', select: { equals: 'All' } },
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    coverImage: z.string(),
    date: z.string(),
    dateModified: z.string().optional(),
    excerpt: z.string().optional(),
    content: z.string(),
    author: z.string(),
    section: z.string().optional(),
    showToc: z.boolean().optional(),
  }),
});

const vbcPosts = defineCollection({
  loader: notionLoader({
    dataSourceId: import.meta.env.NOTION_DATA_SOURCE_ID,
    filter: { property: 'Section', select: { equals: 'VBC' } },
  }),
  schema: z.object({
    // Same as posts
  }),
});

const photos = defineCollection({
  loader: notionLoader({
    dataSourceId: import.meta.env.NOTION_PHOTOS_DATA_SOURCE_ID,
  }),
  schema: z.object({
    // Same as posts
  }),
});

export const collections = { posts, vbcPosts, photos };
```

---

## Migration Phases

### Phase 0: Preparation (Pre-migration) ✅

**Goal**: Set up Astro project alongside Next.js without disrupting current site.

**Tasks**:

- [x] Create new branch: `migration/astro-6`
- [x] Initialize Astro 6 project in a subdirectory or separate repo
- [x] Install core dependencies: `astro`, `@astrojs/react`, `@tailwindcss/vite`
- [x] Copy `tailwind.config.ts` and `globals.css`
- [x] Set up TypeScript configuration
- [x] Verify Tailwind styles render correctly

**Note**: Used `@tailwindcss/vite` instead of `@astrojs/tailwind` for Tailwind v4 compatibility.

**Verification**: ✅ Empty Astro page renders with correct Tailwind styles.

---

### Phase 1: Notion Content Loader ✅

**Goal**: Create custom Notion loader that replicates current caching behavior.

**Tasks**:

- [x] Create `src/lib/notion-loader.ts` implementing Astro's Loader interface
- [x] Port image downloading logic from `src/lib/download-image.ts`
- [x] Port `NotionToMarkdown` custom transformers (images, columns)
- [x] Define Content Collections schema in `src/content/config.ts`
- [x] Test content fetching with `astro sync`
- [x] Verify all posts and photos load correctly (20 posts, 9 VBC posts, 4 photos)

**Key Code to Port**:

```typescript
// Current: src/lib/notion.ts lines 121-232
// - getPostFromNotion() function
// - Custom image transformer (lines 128-137)
// - Custom column_list transformer (lines 139-149)
// - Property extraction logic (lines 158-211)
```

**Verification**: `getCollection('posts')` returns all posts with correct content.

---

### Phase 2: Static Components ✅

**Goal**: Convert non-interactive components to Astro components.

**Tasks**:

- [x] Create `BaseLayout.astro` from `layout.tsx`
- [x] Convert `Header.tsx` → `Header.tsx` (React island for mobile menu)
- [x] Convert `Footer.tsx` → `Footer.astro`
- [x] Convert `PostCard.tsx` → `PostCard.astro`
- [x] Convert `PhotoCard.tsx` → `PhotoCard.astro`
- [x] Convert `SeriesPostCard.tsx` → `SeriesPostCard.astro`
- [x] Convert `VBCFooter.tsx` → `VBCFooter.astro`
- [x] Convert `PostsFooter.tsx` → `PostsFooter.astro`
- [x] Port `TableOfContents.tsx` → `TableOfContents.astro`

**Conversion Pattern**:

```astro
---
// Header.astro
import { config } from '../lib/config';

interface Props {
  currentPath?: string;
}

const { currentPath } = Astro.props;
---

<header class="...">
  <!-- Template content -->
</header>
```

**Verification**: All components render identically to Next.js versions.

---

### Phase 3: Page Routes ✅

**Goal**: Migrate all page routes to Astro pages.

**Tasks**:

- [x] Create `src/pages/index.astro` (homepage)
- [x] Create `src/pages/writing/[slug].astro` (blog posts)
- [x] Create `src/pages/photos/[slug].astro` (photos)
- [x] Port JSON-LD generation to `PostLayout.astro`
- [x] Port metadata generation (title, description, Open Graph)
- [x] Add redirects for legacy URLs (`/post/...` → `/writing/...`)

**Dynamic Route Pattern**:

```astro
---
// src/pages/writing/[slug].astro
import { getCollection } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { slug: post.data.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
---

<PostLayout post={post.data}>
  <article set:html={post.data.content} />
</PostLayout>
```

**Verification**: All pages render with correct content, metadata, and JSON-LD.

---

### Phase 4: Interactive Islands ✅

**Goal**: Set up React islands for client-side interactivity.

**Tasks**:

- [x] Move `floating-particles.tsx` to `src/components/islands/`
- [x] Create `Header.tsx` island for mobile menu state
- [x] Create `ContentRenderer.tsx` island for markdown rendering with syntax highlighting
- [x] Add `client:visible` directive to particle component
- [x] Add `client:load` directive to header and content renderer
- [x] Verify mobile detection hook works in island context
- [x] Test particle animation renders and animates correctly

**Island Usage**:

```astro
---
// In BaseLayout.astro
import FloatingParticles from '../components/islands/FloatingParticles';
---

<FloatingParticles client:visible />
```

**Verification**: Particles animate on desktop, don't load on mobile.

---

### Phase 5: API Endpoints ✅

**Goal**: Migrate RSS and JSON Feed endpoints.

**Tasks**:

- [x] Create `src/pages/rss.xml.ts` endpoint (using @astrojs/rss)
- [x] Create `src/pages/feed.json.ts` endpoint (JSON Feed 1.1)
- [x] Configure `@astrojs/sitemap` integration
- [x] Create `public/robots.txt`
- [x] Verify feed auto-discovery links in HTML head

**Endpoint Pattern**:

```typescript
// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

import { config } from '../lib/config';

export async function GET(context) {
  const posts = await getCollection('posts');
  return rss({
    title: config.site.name,
    description: config.site.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.excerpt,
      link: `/writing/${post.data.slug}/`,
    })),
  });
}
```

**Verification**: RSS validates, JSON Feed matches spec, sitemap includes all pages.

---

### Phase 6: Configuration & Security ✅

**Goal**: Replicate Next.js configuration in Astro.

**Tasks**:

- [x] Configure CSP headers via `vercel.json`
- [x] Set up redirects in `astro.config.mjs`
- [x] Configure image optimization settings
- [x] Set up Vercel adapter: `@astrojs/vercel`
- [x] Configure cache headers for images, feeds
- [x] Set up environment variables

**Astro Config**:

```javascript
// astro.config.mjs
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://brennanmoore.com',
  output: 'static',
  adapter: vercel(),
  integrations: [react(), tailwind(), sitemap()],
  redirects: {
    '/post/debugging-a-live-saturn-v': '/writing/debugging-a-live-saturn-v',
  },
  security: {
    checkOrigin: true,
    // CSP configuration (Astro 6)
  },
});
```

**Verification**: Security headers match current site, redirects work.

---

### Phase 7: Testing Migration ✅

**Goal**: Adapt test suite for Astro.

**Tasks**:

- [x] Verify existing Vitest config works with Astro
- [x] Confirm library tests pass unchanged (config, errors, toc, notion, download-image, page-utils)
- [x] Confirm React component tests pass (UI table component)
- [x] Confirm hooks tests pass (use-mobile)
- [x] All 132 tests passing (2 skipped)

**Note**: The test suite tests utility functions and React components directly. Astro page and endpoint testing requires Astro's runtime environment, so feed endpoints are tested via build verification rather than unit tests.

**Tests to Adapt**:

| Test File                | Adaptation Needed           |
| ------------------------ | --------------------------- |
| `lib/notion.test.ts`     | Minimal (loader logic)      |
| `lib/config.test.ts`     | None                        |
| `lib/errors.test.ts`     | None                        |
| `lib/page-utils.test.ts` | Update for Astro context    |
| `lib/toc.test.ts`        | None                        |
| `components/*.test.tsx`  | Update for Astro components |
| `app/rss.test.ts`        | Update for Astro endpoint   |
| `app/feed.test.ts`       | Update for Astro endpoint   |
| `app/sitemap.test.ts`    | Update for @astrojs/sitemap |

**Verification**: All 292 tests pass (or equivalent coverage).

---

### Phase 8: Final Migration & Deployment ✅

**Goal**: Cut over from Next.js to Astro.

**Tasks**:

- [x] Run full build: `astro build` (34 pages in ~21s)
- [x] Remove Next.js code and configuration
- [x] Configure Cloudflare Pages adapter
- [x] Set up security headers via `public/_headers`
- [x] Set up redirects via `public/_redirects`
- [x] Deploy to Cloudflare Pages
- [x] Verify all functionality

**Deployment**: Cloudflare Pages

```bash
# Build
npm run build

# Preview locally
npm run preview
```

**Configuration**:

- Adapter: `@astrojs/cloudflare`
- Security headers: `public/_headers` (CSP, HSTS, X-Frame-Options)
- Redirects: `public/_redirects` (legacy URL support)

**Verification**: Production site fully functional on Cloudflare Pages.

---

## File-by-File Migration Map

### Source Files → Astro Equivalents

| Next.js File                            | Astro Equivalent                               | Action                    |
| --------------------------------------- | ---------------------------------------------- | ------------------------- |
| `src/app/layout.tsx`                    | `src/layouts/BaseLayout.astro`                 | Rewrite                   |
| `src/app/page.tsx`                      | `src/pages/index.astro`                        | Rewrite                   |
| `src/app/writing/[slug]/page.tsx`       | `src/pages/writing/[slug].astro`               | Rewrite                   |
| `src/app/photos/[slug]/page.tsx`        | `src/pages/photos/[slug].astro`                | Rewrite                   |
| `src/app/rss.xml/route.ts`              | `src/pages/rss.xml.ts`                         | Rewrite                   |
| `src/app/feed.json/route.ts`            | `src/pages/feed.json.ts`                       | Rewrite                   |
| `src/app/sitemap.ts`                    | `@astrojs/sitemap` config                      | Replace                   |
| `src/app/robots.ts`                     | `public/robots.txt` or config                  | Replace                   |
| `src/components/header.tsx`             | `src/components/Header.astro`                  | Convert                   |
| `src/components/footer.tsx`             | `src/components/Footer.astro`                  | Convert                   |
| `src/components/layout.tsx`             | `src/layouts/BaseLayout.astro`                 | Merge                     |
| `src/components/post-layout.tsx`        | `src/layouts/PostLayout.astro`                 | Convert                   |
| `src/components/post-card.tsx`          | `src/components/PostCard.astro`                | Convert                   |
| `src/components/photo-card.tsx`         | `src/components/PhotoCard.astro`               | Convert                   |
| `src/components/series-post-card.tsx`   | `src/components/SeriesPostCard.astro`          | Convert                   |
| `src/components/vbc-footer.tsx`         | `src/components/VBCFooter.astro`               | Convert                   |
| `src/components/posts-footer.tsx`       | `src/components/PostsFooter.astro`             | Convert                   |
| `src/components/table-of-contents.tsx`  | `src/components/TableOfContents.astro`         | Convert (may need island) |
| `src/components/mdx-component.tsx`      | `src/components/ContentRenderer.astro`         | Rewrite                   |
| `src/components/floating-particles.tsx` | `src/components/islands/FloatingParticles.tsx` | Move (keep React)         |
| `src/components/particles/*`            | `src/components/islands/particles/*`           | Move (keep React)         |
| `src/components/ui/*`                   | `src/components/ui/*`                          | Keep React or convert     |
| `src/lib/notion.ts`                     | `src/lib/notion-loader.ts`                     | Rewrite as Loader         |
| `src/lib/config.ts`                     | `src/lib/config.ts`                            | Copy                      |
| `src/lib/errors.ts`                     | `src/lib/errors.ts`                            | Copy                      |
| `src/lib/utils.ts`                      | `src/lib/utils.ts`                             | Copy                      |
| `src/lib/page-utils.ts`                 | `src/lib/page-utils.ts`                        | Adapt                     |
| `src/lib/toc.ts`                        | `src/lib/toc.ts`                               | Copy                      |
| `src/lib/download-image.ts`             | `src/lib/download-image.ts`                    | Copy                      |
| `src/hooks/use-mobile.ts`               | `src/hooks/use-mobile.ts`                      | Copy (for islands)        |
| `scripts/cache-posts.ts`                | Remove (Content Collections handles)           | Delete                    |
| `posts-cache.json`                      | Remove                                         | Delete                    |
| `photos-cache.json`                     | Remove                                         | Delete                    |
| `next.config.ts`                        | `astro.config.mjs`                             | Rewrite                   |
| `tailwind.config.ts`                    | `tailwind.config.mjs`                          | Minor updates             |

---

## Notion Integration Strategy

### Option A: Custom Loader (Recommended)

Build a custom Astro Content Loader that wraps your existing Notion logic.

**Pros**:

- Full control over image downloading
- Preserves custom transformers (columns, images)
- No external dependencies beyond `@notionhq/client`

**Implementation**:

```typescript
// src/lib/notion-loader.ts
import { Client } from '@notionhq/client';
import type { Loader } from 'astro/loaders';
import { NotionToMarkdown } from 'notion-to-md';

interface NotionLoaderOptions {
  dataSourceId: string;
  filter?: object;
}

export function notionLoader(options: NotionLoaderOptions): Loader {
  return {
    name: 'notion-loader',
    load: async ({ store, logger }) => {
      const notion = new Client({ auth: import.meta.env.NOTION_TOKEN });
      const n2m = new NotionToMarkdown({ notionClient: notion });

      // Port custom transformers from current notion.ts
      n2m.setCustomTransformer('image', async (block) => {
        // ... existing image logic with downloadImage()
      });

      n2m.setCustomTransformer('column_list', async (block) => {
        // ... existing column logic
      });

      // Fetch and process posts
      const response = await notion.dataSources.query({
        data_source_id: options.dataSourceId,
        filter: options.filter,
        sorts: [{ property: 'Published Date', direction: 'descending' }],
      });

      for (const page of response.results) {
        const post = await processPage(page, n2m);
        store.set({ id: post.slug, data: post });
      }
    },
  };
}
```

### Option B: Community Loader + Customization

Use `@notwoods/notion-astro-loader` or `@duocrafters/notion-database-astro` with custom post-processing.

**Pros**:

- Less code to maintain
- Community-supported

**Cons**:

- May not handle image downloading correctly
- Less control over markdown transformation

---

## Interactive Components (Islands)

### Components Requiring Client-Side JS

| Component           | Directive        | Reason                      |
| ------------------- | ---------------- | --------------------------- |
| `FloatingParticles` | `client:visible` | Canvas animation            |
| `TableOfContents`   | `client:idle`    | Scroll spy (if implemented) |

### Island Architecture

```astro
---
// BaseLayout.astro
import FloatingParticles from '../components/islands/FloatingParticles';
---

<!doctype html>
<html>
  <head></head>...
  <body>
    <!-- Zero JS for this content -->
    <Header />
    <main>
      <slot />
    </main>
    <Footer />

    <!-- Island: Only loads JS for this component -->
    <FloatingParticles client:visible />
  </body>
</html>
```

### Client Directives Reference

| Directive        | Behavior                     | Use Case                   |
| ---------------- | ---------------------------- | -------------------------- |
| `client:load`    | Hydrate on page load         | Critical interactivity     |
| `client:idle`    | Hydrate when browser idle    | Non-critical interactivity |
| `client:visible` | Hydrate when in viewport     | Below-fold interactivity   |
| `client:media`   | Hydrate on media query match | Responsive interactivity   |
| `client:only`    | Skip SSR, client-only        | No SSR needed              |

---

## Testing Strategy

### Vitest Configuration for Astro

```typescript
// vitest.config.ts
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup.ts'],
    include: ['__tests__/**/*.{test,spec}.{js,ts,tsx}'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', '.astro/'],
    },
  },
});
```

### Test Categories

**Unit Tests (keep as-is)**:

- `lib/config.test.ts`
- `lib/errors.test.ts`
- `lib/toc.test.ts`
- `lib/utils.test.ts`
- `hooks/use-mobile.test.ts`

**Integration Tests (adapt)**:

- `lib/notion.test.ts` → Test loader functions
- `lib/page-utils.test.ts` → Update context handling

**Component Tests (rewrite)**:

- Astro components use `@astrojs/test-utils`
- React islands keep `@testing-library/react`

**Endpoint Tests (rewrite)**:

- Test Astro endpoint functions directly

---

## Deployment Strategy

### Vercel Configuration

```javascript
// astro.config.mjs
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static', // or 'server' for Live Collections
  adapter: vercel({
    webAnalytics: { enabled: true },
    speedInsights: { enabled: true },
  }),
});
```

### Environment Variables

Same as current setup:

```
NOTION_TOKEN=secret_xxx
NOTION_DATA_SOURCE_ID=xxx
NOTION_PHOTOS_DATA_SOURCE_ID=xxx
SITE_URL=https://brennanmoore.com
```

### Build Commands

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

---

## Rollback Plan

### If Migration Fails

1. **Keep Next.js branch active** — Don't delete `main` branch
2. **Vercel rollback** — One-click rollback to previous deployment
3. **DNS unchanged** — Both versions can deploy to same domain

### Parallel Deployment (Recommended)

1. Deploy Astro to `preview.brennanmoore.com`
2. Test thoroughly on preview
3. When ready, swap DNS to Astro deployment
4. Keep Next.js deployment warm for 30 days

---

## Decision Log

| Decision          | Choice                      | Rationale                            |
| ----------------- | --------------------------- | ------------------------------------ |
| Content loader    | Custom (Option A)           | Full control over image downloading  |
| Static vs Server  | Static (`output: 'static'`) | Current site is fully static         |
| React islands     | Keep minimal                | Only particles need client JS        |
| UI components     | Convert to Astro            | Simpler, no hydration needed         |
| Testing framework | Keep Vitest                 | Already configured, works with Astro |
| Deployment        | Vercel + adapter            | Current host, seamless transition    |

---

## Success Criteria

- [ ] All 38 pages render correctly
- [ ] Lighthouse Performance score >= 95 (currently ~90)
- [ ] Lighthouse Accessibility score = 100
- [ ] RSS and JSON feeds validate
- [ ] All redirects work
- [ ] CSP headers configured
- [ ] Test coverage >= 75%
- [ ] Build time <= 30 seconds
- [ ] Zero JavaScript on content pages (except islands)

---

## Resources

- [Astro 6 Beta Announcement](https://astro.build/blog/astro-6-beta/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro Content Loader Reference](https://docs.astro.build/en/reference/content-loader-reference/)
- [notion-astro-loader](https://github.com/jalberto/notion-astro-loader)
- [@duocrafters/notion-database-astro](https://www.npmjs.com/package/@duocrafters/notion-database-astro)
- [Migrating from Next.js to Astro](https://docs.astro.build/en/guides/migrate-to-astro/from-nextjs/)

---

**Last Updated**: 2026-01-19
