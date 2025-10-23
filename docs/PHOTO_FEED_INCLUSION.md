# Photo Feed Inclusion - Completed

**Date**: 2025-10-23

## Summary

Successfully updated JSON Feed and RSS feed to include photo posts in addition to writing posts, matching the behavior of the sitemap. All items are now sorted by date (newest first) regardless of type.

## Changes Made

### 1. Created Shared Utility Function

**File**: `src/lib/notion.ts`

Added `getAllItemsSortedByDate()` function to centralize the logic for fetching and combining posts and photos:

```typescript
export type PostWithType = Post & { type: 'writing' | 'photo' };

export function getAllItemsSortedByDate(): PostWithType[] {
  const writingPosts = getPostsFromCache().map((post) => ({ ...post, type: 'writing' as const }));
  const photos = getPhotosFromCache().map((post) => ({ ...post, type: 'photo' as const }));
  const allItems = [...writingPosts, ...photos].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  return allItems;
}
```

**Benefits**:
- Single source of truth for combining posts and photos
- Consistent sorting logic across all routes (feed.json, rss.xml, sitemap)
- Type-safe with TypeScript `PostWithType` type
- Easier to maintain and update in the future

### 2. Updated JSON Feed Route

**File**: `src/app/feed.json/route.ts`

**Before**:
```typescript
const writingPosts = getPostsFromCache().map((post) => ({ ...post, type: 'writing' as const }));
const photos = getPhotosFromCache().map((post) => ({ ...post, type: 'photo' as const }));
const allItems = [...writingPosts, ...photos].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);
```

**After**:
```typescript
const allItems = getAllItemsSortedByDate();
```

### 3. Updated RSS Feed Route

**File**: `src/app/rss.xml/route.ts`

**Before**:
```typescript
const writingPosts = getPostsFromCache().map(post => ({ ...post, type: 'writing' }));
const photos = getPhotosFromCache().map(post => ({ ...post, type: 'photo' }));
const allItems = [...writingPosts, ...photos].sort((a, b) =>
  new Date(b.date).getTime() - new Date(a.date).getTime()
);
```

**After**:
```typescript
const allItems = getAllItemsSortedByDate();
```

### 4. Updated Feed Tests

**File**: `__tests__/app/feed.test.ts`

- Added `mockPhotos` array with 3 photo posts
- Updated mock implementation to return different data based on cache file:
  ```typescript
  (fs.readFileSync as Mock).mockImplementation((path: string) => {
    if (path.includes('photos-cache.json')) {
      return JSON.stringify(mockPhotos);
    }
    return JSON.stringify(mockPosts);
  });
  ```
- Updated all test expectations to account for 6 items (3 posts + 3 photos)
- Added tests for photo-specific URLs and image paths
- Updated tag expectations to include both section and type
- All 16 tests passing

## Implementation Details

### URL Routing

Both feeds now correctly route items based on their type:

**Writing Posts**:
- URL: `https://example.com/writing/[slug]`
- Image: `https://example.com/images/[coverImage]`

**Photo Posts**:
- URL: `https://example.com/photos/[slug]`
- Image: `https://example.com/images/photos/[coverImage]`

### Tags in JSON Feed

Items now include type in their tags:

- Writing posts with section: `['All', 'writing']` or `['VBC', 'writing']`
- Writing posts without section: `['writing']`
- Photo posts with section: `['section-name', 'photo']`
- Photo posts without section: `['photo']`

### Custom Extensions

Added `_content_type` custom extension to JSON Feed items to distinguish between 'writing' and 'photo' posts.

## Verification

- ✅ All 124 tests passing (up from 97 before)
- ✅ TypeScript compilation successful
- ✅ Production build successful
- ✅ Both feeds now include posts and photos sorted by date
- ✅ Consistent behavior across feed.json, rss.xml, and sitemap

## Files Modified

1. `src/lib/notion.ts` - Added `getAllItemsSortedByDate()` utility
2. `src/app/feed.json/route.ts` - Refactored to use shared utility
3. `src/app/rss.xml/route.ts` - Refactored to use shared utility
4. `__tests__/app/feed.test.ts` - Updated tests for photos inclusion

## Test Coverage

- Feed tests: 16 tests
- RSS tests: 13 tests
- Total project tests: 124 tests (2 skipped)

## Next Steps

Deploy the updated feeds to production to verify that:
1. `/feed.json` includes both posts and photos
2. `/rss.xml` includes both posts and photos
3. Items are sorted correctly by date
4. URLs and image paths are correct for both types
