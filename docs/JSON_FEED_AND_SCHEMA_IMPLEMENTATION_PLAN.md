# JSON Feed and Schema.org JSON-LD Implementation Plan

**Date**: 2025-10-23
**Status**: Planning
**Priority**: Medium
**Estimated Effort**: 4-6 hours

---

## Executive Summary

**Current State:**
- ✅ Schema.org JSON-LD **already implemented** for individual blog posts and photos
- ✅ RSS 2.0 feed implemented at `/rss.xml`
- ❌ JSON Feed not implemented (modern alternative to RSS)
- ⚠️ Schema.org JSON-LD needs enhancement (add homepage, improve coverage)

**Goals:**
1. Add JSON Feed support at `/feed.json`
2. Enhance Schema.org JSON-LD coverage (homepage, blog/photo listings)
3. Add comprehensive tests for both features
4. Update documentation

**Benefits:**
- **JSON Feed**: Modern, easier-to-parse alternative to RSS. Supported by many feed readers.
- **Enhanced Schema.org**: Improved SEO with rich snippets, better search engine understanding.
- **Better Developer Experience**: JSON is easier to work with than XML.

---

## Current Implementation Analysis

### ✅ Schema.org JSON-LD (Already Implemented!)

**Location**: [src/lib/page-utils.ts:69-102](src/lib/page-utils.ts#L69-L102)

**Current Implementation:**
```typescript
export function generateJsonLd(post: Post, type: PostType) {
  const siteUrl = config.site.url;
  const imageUrl = type === 'photos'
    ? `/images/photos/${post.coverImage}`
    : `/images/${post.coverImage}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
    datePublished: new Date(post.date).toISOString(),
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Person',
      name: 'Brennan Moore',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/${type}/${post.slug}`,
    },
  };
}
```

**Usage:**
- Writing posts: [src/app/writing/[slug]/page.tsx:35,64-67](src/app/writing/[slug]/page.tsx#L35)
- Photo posts: [src/app/photos/[slug]/page.tsx:30,34-37](src/app/photos/[slug]/page.tsx#L30)

**What's Missing:**
1. Homepage doesn't have JSON-LD (should be `Person` or `Blog` type)
2. No `wordCount` property (useful for SEO)
3. No `dateModified` property (if posts are ever updated)
4. Could add `articleSection` for VBC posts

### ❌ JSON Feed (Not Implemented)

**What is JSON Feed?**
- Modern alternative to RSS/Atom
- JSON format (easier to parse than XML)
- Spec: https://jsonfeed.org/version/1.1
- Supported by: Feedbin, Feedly, NewsBlur, and many others

**Advantages over RSS:**
- Easier to parse (native JSON vs XML parsing)
- More extensible (custom properties)
- Better suited for modern applications
- Simpler spec (no namespace confusion)

---

## Implementation Plan

### Phase 1: Add JSON Feed Support (Priority: High)

**Estimated Time**: 2-3 hours

#### Step 1.1: Create JSON Feed Route

**File**: `src/app/feed.json/route.ts` (new file)

**Implementation:**
```typescript
import { config } from '@/lib/config';
import { getAllSectionPostsFromCache } from '@/lib/notion';

export async function GET() {
  const posts = getAllSectionPostsFromCache();
  const siteUrl = config.site.url;

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: config.site.title,
    home_page_url: siteUrl,
    feed_url: `${siteUrl}/feed.json`,
    description: config.site.description,
    icon: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    authors: [
      {
        name: config.site.author,
        url: siteUrl,
      },
    ],
    language: 'en',
    items: posts.map((post) => ({
      id: `${siteUrl}/writing/${post.slug}`,
      url: `${siteUrl}/writing/${post.slug}`,
      title: post.title,
      content_html: post.content, // Markdown rendered as HTML
      summary: post.excerpt,
      image: `${siteUrl}/images/${post.coverImage}`,
      date_published: new Date(post.date).toISOString(),
      authors: [
        {
          name: post.author,
        },
      ],
      tags: post.section ? [post.section] : undefined,
    })),
  };

  return Response.json(feed, {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
    },
  });
}
```

**Key Decisions:**
- Use `getAllSectionPostsFromCache()` to match RSS feed behavior (only "All" section)
- Include `content_html` with full post content (better user experience)
- Use `summary` for excerpt (matches RSS behavior)
- Include post section as `tags` for categorization
- Follow JSON Feed 1.1 spec strictly

#### Step 1.2: Add JSON Feed to Layout

**File**: `src/app/layout.tsx`

**Change**: Add JSON Feed link to `<head>`:
```typescript
export const metadata: Metadata = {
  // ... existing metadata
  alternates: {
    types: {
      'application/rss+xml': `${siteUrl}/rss.xml`,
      'application/feed+json': `${siteUrl}/feed.json`, // NEW
    },
  },
};
```

This allows feed readers to auto-discover the JSON Feed.

#### Step 1.3: Add Tests for JSON Feed

**File**: `__tests__/app/feed.test.ts` (new file)

**Test Coverage:**
```typescript
describe('JSON Feed Route', () => {
  // Structure tests
  it('should return valid JSON Feed 1.1 structure');
  it('should include required top-level fields');
  it('should include items array with all posts');

  // Content tests
  it('should properly format post URLs');
  it('should include ISO 8601 date format');
  it('should include post excerpt as summary');
  it('should include full content as content_html');
  it('should include author information');

  // Section filtering tests
  it('should only include "All" section posts');
  it('should not include VBC posts');
  it('should include section as tags');

  // Header tests
  it('should set correct Content-Type header');

  // Edge cases
  it('should handle posts without images');
  it('should handle empty posts cache');
});
```

**Minimum Tests Required**: 12 tests (to match RSS feed test coverage)

#### Step 1.4: Update Documentation

**Files to Update:**
1. `README.md` - Add JSON Feed to features list
2. `CLAUDE.md` - Document JSON Feed implementation
3. Add link to `/feed.json` in footer (optional)

---

### Phase 2: Enhance Schema.org JSON-LD (Priority: Medium)

**Estimated Time**: 2-3 hours

#### Step 2.1: Add Homepage JSON-LD

**File**: `src/app/page.tsx`

**Implementation**: Add JSON-LD for the homepage (Person + Blog schema):

```typescript
// Add to page.tsx before the return statement
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Brennan Moore',
  url: config.site.url,
  image: `${config.site.url}/about.jpg`,
  jobTitle: 'CTO / Engineering Leader',
  description: config.site.description,
  sameAs: [
    // Add social media links if available
  ],
  // Add Blog type as well
  '@graph': [
    {
      '@type': 'Person',
      name: 'Brennan Moore',
      url: config.site.url,
    },
    {
      '@type': 'Blog',
      name: config.site.title,
      description: config.site.description,
      url: config.site.url,
      author: {
        '@type': 'Person',
        name: 'Brennan Moore',
      },
      blogPost: posts.slice(0, 5).map((post) => ({
        '@type': 'BlogPosting',
        '@id': `${config.site.url}/writing/${post.slug}`,
        headline: post.title,
        datePublished: new Date(post.date).toISOString(),
      })),
    },
  ],
};

// Add to JSX:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

#### Step 2.2: Enhance Blog Post JSON-LD

**File**: `src/lib/page-utils.ts`

**Enhancement**: Add missing properties to `generateJsonLd()`:

```typescript
export function generateJsonLd(post: Post, type: PostType) {
  const siteUrl = config.site.url;
  const imageUrl = type === 'photos'
    ? `${siteUrl}/images/photos/${post.coverImage}`
    : `${siteUrl}/images/${post.coverImage}`;

  if (!isDateValid(post.date)) {
    throw new Error(`Invalid date format for post: ${post.id}`);
  }

  return {
    '@context': 'https://schema.org',
    '@type': type === 'photos' ? 'Photograph' : 'BlogPosting', // NEW: Distinguish photos
    headline: post.title,
    description: post.excerpt,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      caption: post.title,
    },
    datePublished: new Date(post.date).toISOString(),
    // NEW: Add dateModified if different from datePublished
    dateModified: new Date(post.date).toISOString(),
    author: {
      '@type': 'Person',
      name: post.author,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Person',
      name: 'Brennan Moore',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/${type}/${post.slug}`,
    },
    // NEW: Add wordCount for writing posts
    ...(type === 'writing' && post.content ? {
      wordCount: getWordCount(post.content),
    } : {}),
    // NEW: Add articleSection for VBC posts
    ...(post.section === 'VBC' ? {
      articleSection: 'Value-Based Care',
    } : {}),
    // NEW: Add keywords/tags
    keywords: post.section ? [post.section] : undefined,
  };
}
```

**Key Improvements:**
1. Use `Photograph` type for photos (more specific than `BlogPosting`)
2. Add `wordCount` for writing posts (helps search engines)
3. Add `articleSection` for VBC posts (categorization)
4. Add `keywords` based on section
5. Enhance image to full `ImageObject` type
6. Add `url` to author (better entity recognition)

#### Step 2.3: Add Tests for Enhanced JSON-LD

**File**: `__tests__/lib/page-utils.test.ts`

**Add New Tests:**
```typescript
describe('generateJsonLd', () => {
  it('should generate BlogPosting type for writing posts');
  it('should generate Photograph type for photo posts');
  it('should include wordCount for writing posts');
  it('should include articleSection for VBC posts');
  it('should include keywords based on section');
  it('should include enhanced image object');
  it('should include author URL');
  it('should throw error for invalid dates');
  it('should handle posts without content');
  it('should handle posts without section');
});
```

**Minimum Tests Required**: 10 tests

#### Step 2.4: Validate JSON-LD

**Tools to Use:**
1. Google Rich Results Test: https://search.google.com/test/rich-results
2. Schema.org Validator: https://validator.schema.org/
3. Structured Data Testing Tool (deprecated but still useful)

**Manual Testing Checklist:**
- [ ] Test homepage JSON-LD in Google Rich Results Test
- [ ] Test blog post JSON-LD in Google Rich Results Test
- [ ] Test photo post JSON-LD in Google Rich Results Test
- [ ] Verify no errors in schema.org validator
- [ ] Check that breadcrumbs appear correctly

---

## Phase 3: Documentation and Cleanup (Priority: Low)

**Estimated Time**: 1 hour

### Step 3.1: Update CLAUDE.md

Add section documenting the implementation:

```markdown
### JSON Feed Implementation - Completed

**Date**: 2025-10-23

Successfully added JSON Feed support alongside existing RSS feed.

**Key Features**:
- JSON Feed 1.1 spec compliant
- Available at `/feed.json`
- Auto-discovery link in HTML head
- Full content included in feed items
- Section-based filtering (matches RSS behavior)

**Files Created**:
- `src/app/feed.json/route.ts`
- `__tests__/app/feed.test.ts`

**Verification**:
- ✅ All 12 tests passing
- ✅ Valid JSON Feed 1.1 format
- ✅ Auto-discovery working

### Schema.org JSON-LD Enhancement - Completed

**Date**: 2025-10-23

Enhanced existing Schema.org implementation with additional properties.

**Key Improvements**:
- Homepage now includes Person + Blog schema
- Blog posts include wordCount and articleSection
- Photos use Photograph type instead of BlogPosting
- Enhanced image objects with captions
- Added keywords based on post section

**Files Modified**:
- `src/app/page.tsx`
- `src/lib/page-utils.ts`

**Verification**:
- ✅ Google Rich Results Test passing
- ✅ Schema.org validator passing
- ✅ All 10 tests passing
```

### Step 3.2: Update README.md

Add to features list:

```markdown
## Features

- 📝 Blog posts and photo galleries powered by Notion
- 🎨 Two content sections: "All" (general) and "VBC" (Value-Based Care)
- 🔍 SEO optimized with:
  - RSS 2.0 feed (`/rss.xml`)
  - JSON Feed 1.1 (`/feed.json`) ← NEW
  - XML sitemap
  - Schema.org JSON-LD structured data ← ENHANCED
  - OpenGraph and Twitter Card metadata
```

### Step 3.3: Add Feed Discovery Link (Optional)

**File**: `src/components/footer.tsx`

**Optional Enhancement**: Add link to feeds in footer:

```tsx
<footer>
  <div className="feeds">
    <a href="/rss.xml" title="RSS Feed">RSS</a>
    {' • '}
    <a href="/feed.json" title="JSON Feed">JSON Feed</a>
  </div>
</footer>
```

---

## Testing Strategy

### Unit Tests

**Coverage Goal**: 100% for new code

**Test Files:**
1. `__tests__/app/feed.test.ts` (new) - 12 tests
2. `__tests__/lib/page-utils.test.ts` (enhanced) - 10 new tests

**Total New Tests**: 22 tests

### Integration Tests

**Manual Testing Checklist:**

**JSON Feed:**
- [ ] Access `/feed.json` in browser (should download/display JSON)
- [ ] Verify JSON is valid (use JSON validator)
- [ ] Check feed in JSON Feed viewer: https://json-feed-viewer.herokuapp.com/
- [ ] Test auto-discovery in feed reader (Feedbin, Feedly)
- [ ] Verify content includes full post content
- [ ] Verify only "All" section posts are included

**Schema.org JSON-LD:**
- [ ] Test homepage in Google Rich Results Test
- [ ] Test blog post in Google Rich Results Test
- [ ] Test photo post in Google Rich Results Test
- [ ] Verify no warnings in schema.org validator
- [ ] Check mobile preview in search results test

### Performance Testing

**Checklist:**
- [ ] JSON Feed route responds within 100ms (should be fast - cached data)
- [ ] JSON Feed size < 1MB (should be ~50-200KB depending on content length)
- [ ] No impact on page load time (JSON-LD is inline, minimal overhead)

---

## Rollout Plan

### Step-by-Step Implementation Order

**Day 1: JSON Feed (3 hours)**
1. Create `src/app/feed.json/route.ts` (30 min)
2. Add auto-discovery link to layout.tsx (10 min)
3. Write tests in `__tests__/app/feed.test.ts` (60 min)
4. Test manually with feed readers (30 min)
5. Fix any issues found (30 min)

**Day 2: Schema.org Enhancements (3 hours)**
1. Enhance `generateJsonLd()` in page-utils.ts (30 min)
2. Add homepage JSON-LD to page.tsx (30 min)
3. Write tests for enhanced JSON-LD (60 min)
4. Test with Google Rich Results Test (30 min)
5. Fix any validation errors (30 min)

**Day 3: Documentation and Cleanup (1 hour)**
1. Update CLAUDE.md (20 min)
2. Update README.md (10 min)
3. Add footer links (optional, 10 min)
4. Final testing and verification (20 min)

**Total Time**: 6-7 hours across 3 days

### Deployment Strategy

**Recommended Approach**: Deploy in two phases

**Phase 1 - JSON Feed**:
1. Merge JSON Feed implementation first
2. Verify feed works in production
3. Monitor for issues (1-2 days)
4. Announce JSON Feed availability

**Phase 2 - Schema.org Enhancement**:
1. Merge Schema.org enhancements
2. Verify Rich Results Test passes in production
3. Monitor Google Search Console for any issues
4. Wait for Google to re-index (1-2 weeks)

---

## Success Criteria

### JSON Feed
- ✅ Valid JSON Feed 1.1 structure
- ✅ All 12 tests passing
- ✅ Feed works in at least 2 feed readers (Feedbin, Feedly)
- ✅ Auto-discovery working
- ✅ Response time < 100ms

### Schema.org JSON-LD
- ✅ No errors in Google Rich Results Test
- ✅ No errors in schema.org validator
- ✅ All 10 tests passing
- ✅ Blog posts show as "BlogPosting" type
- ✅ Photos show as "Photograph" type
- ✅ Homepage shows Person + Blog types

### Overall
- ✅ Test coverage remains above 60% (ideally 65%+)
- ✅ TypeScript compilation successful
- ✅ Production build successful
- ✅ No performance degradation

---

## Risks and Mitigations

### Risk 1: JSON Feed Content Size
**Risk**: Including full post content could make feed too large
**Likelihood**: Low
**Impact**: Medium (slow feed loading)
**Mitigation**:
- Monitor feed size in production
- Consider truncating content if > 1MB
- Add pagination if needed (JSON Feed supports it)

### Risk 2: Schema.org Validation Errors
**Risk**: Enhanced JSON-LD might have validation errors
**Likelihood**: Medium
**Impact**: Low (search engines are forgiving)
**Mitigation**:
- Test thoroughly with Google Rich Results Test
- Use schema.org validator before deployment
- Start with conservative enhancements

### Risk 3: Breaking Existing RSS Feed
**Risk**: Changes to shared code could break RSS
**Likelihood**: Low
**Impact**: High (breaks existing subscribers)
**Mitigation**:
- JSON Feed is entirely separate route
- Existing RSS tests ensure no regression
- Test both feeds in parallel

### Risk 4: Performance Impact
**Risk**: Additional JSON-LD on homepage could slow load time
**Likelihood**: Low
**Impact**: Low (inline script, minimal size)
**Mitigation**:
- JSON-LD is small (< 5KB)
- Already implemented on post pages
- Monitor Core Web Vitals

---

## Future Enhancements (Out of Scope)

**Not included in this plan, but consider later:**

1. **Feed Pagination**: JSON Feed supports pagination for large feeds
2. **Feed Filtering**: Allow filtering by section (e.g., `/feed.json?section=VBC`)
3. **Podcast Feed**: If adding audio/video content
4. **Atom Feed**: Some readers prefer Atom over RSS 2.0
5. **WebSub Support**: Real-time feed updates
6. **Feed Analytics**: Track feed subscriber counts
7. **Enhanced Schema Types**: Add Review, FAQ, HowTo schemas for specific posts
8. **Breadcrumb Schema**: Add BreadcrumbList for navigation
9. **Organization Schema**: If blog becomes part of organization

---

## Questions to Resolve

**Before Starting:**

1. **Content in JSON Feed**: Should we include full post content or just excerpts?
   - **Recommendation**: Full content (better UX, matches best practices)

2. **VBC Posts in JSON Feed**: Should VBC section posts be in separate feed?
   - **Recommendation**: No, keep one feed matching RSS behavior

3. **Photo Posts in JSON Feed**: Should photos have separate feed?
   - **Recommendation**: Start with one feed, add separate later if needed

4. **Homepage JSON-LD**: Should we use Person or Organization type?
   - **Recommendation**: Person (this is a personal blog, not company blog)

5. **Image URLs in JSON-LD**: Relative or absolute?
   - **Recommendation**: Absolute URLs (better for search engines)

---

## References

### JSON Feed
- **Spec**: https://jsonfeed.org/version/1.1
- **Examples**: https://jsonfeed.org/code/
- **Validator**: https://validator.jsonfeed.org/

### Schema.org
- **BlogPosting**: https://schema.org/BlogPosting
- **Photograph**: https://schema.org/Photograph
- **Person**: https://schema.org/Person
- **Blog**: https://schema.org/Blog
- **Google Guide**: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

### Testing Tools
- **JSON Feed Viewer**: https://json-feed-viewer.herokuapp.com/
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Schema.org Validator**: https://validator.schema.org/
- **JSON Validator**: https://jsonlint.com/

---

## Appendix: Code Templates

### A. Complete JSON Feed Route Template

```typescript
// src/app/feed.json/route.ts
import { config } from '@/lib/config';
import { getAllSectionPostsFromCache, getWordCount } from '@/lib/notion';

export async function GET() {
  const posts = getAllSectionPostsFromCache();
  const siteUrl = config.site.url;

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: config.site.title,
    home_page_url: siteUrl,
    feed_url: `${siteUrl}/feed.json`,
    description: config.site.description,
    icon: `${siteUrl}/favicon.ico`,
    favicon: `${siteUrl}/favicon.ico`,
    authors: [
      {
        name: config.site.author,
        url: siteUrl,
      },
    ],
    language: 'en',
    items: posts.map((post) => {
      const wordCount = post.content ? getWordCount(post.content) : 0;

      return {
        id: `${siteUrl}/writing/${post.slug}`,
        url: `${siteUrl}/writing/${post.slug}`,
        title: post.title,
        content_html: post.content,
        summary: post.excerpt,
        image: `${siteUrl}/images/${post.coverImage}`,
        date_published: new Date(post.date).toISOString(),
        authors: [
          {
            name: post.author,
          },
        ],
        tags: post.section ? [post.section] : undefined,
        _word_count: wordCount, // Custom extension
      };
    }),
  };

  return Response.json(feed, {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
```

### B. Complete Test Template

```typescript
// __tests__/app/feed.test.ts
import { GET } from '@/app/feed.json/route';
import { Post } from '@/lib/notion';
import fs from 'fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

// Mock fs module
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  },
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

vi.mock('path', () => ({
  default: {
    join: vi.fn((...args: string[]) => args.join('/')),
  },
  join: vi.fn((...args: string[]) => args.join('/')),
}));

describe('JSON Feed Route', () => {
  const mockPosts: Post[] = [
    {
      id: '1',
      title: 'Test Post 1',
      slug: 'test-post-1',
      coverImage: 'cover1.jpg',
      date: '2023-06-15',
      excerpt: 'First test post excerpt.',
      content: 'Content of test post 1',
      author: 'Brennan Moore',
      section: 'All',
    },
    {
      id: '2',
      title: 'Test Post 2',
      slug: 'test-post-2',
      coverImage: 'cover2.jpg',
      date: '2023-06-10',
      excerpt: 'Second test post excerpt.',
      content: 'Content of test post 2',
      author: 'Brennan Moore',
      section: 'All',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return valid JSON Feed 1.1 structure', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json.version).toBe('https://jsonfeed.org/version/1.1');
    expect(json.title).toBeDefined();
    expect(json.home_page_url).toBeDefined();
    expect(json.feed_url).toBeDefined();
    expect(json.items).toBeInstanceOf(Array);
  });

  it('should include required top-level fields', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json).toHaveProperty('version');
    expect(json).toHaveProperty('title');
    expect(json).toHaveProperty('home_page_url');
    expect(json).toHaveProperty('feed_url');
    expect(json).toHaveProperty('items');
  });

  it('should include all posts in items array', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json.items).toHaveLength(2);
  });

  it('should properly format post URLs', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json.items[0].url).toContain('/writing/test-post-1');
    expect(json.items[0].id).toContain('/writing/test-post-1');
  });

  it('should include ISO 8601 date format', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json.items[0].date_published).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('should include post excerpt as summary', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json.items[0].summary).toBe('First test post excerpt.');
  });

  it('should include full content as content_html', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json.items[0].content_html).toBe('Content of test post 1');
  });

  it('should include author information', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json.items[0].authors).toHaveLength(1);
    expect(json.items[0].authors[0].name).toBe('Brennan Moore');
  });

  it('should set correct Content-Type header', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();

    expect(response.headers.get('Content-Type')).toBe(
      'application/feed+json; charset=utf-8'
    );
  });

  it('should handle empty posts cache', async () => {
    (fs.existsSync as Mock).mockReturnValue(false);

    const response = await GET();
    const json = await response.json();

    expect(json.items).toHaveLength(0);
  });

  it('should include section as tags', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json.items[0].tags).toEqual(['All']);
  });

  it('should handle posts without images gracefully', async () => {
    const postsWithoutImage = [
      { ...mockPosts[0], coverImage: '' },
    ];

    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(postsWithoutImage));

    const response = await GET();
    const json = await response.json();

    expect(json.items[0].image).toBeDefined();
  });
});
```

---

**End of Implementation Plan**

**Next Steps**: Review this plan, ask questions, and begin implementation when ready!
