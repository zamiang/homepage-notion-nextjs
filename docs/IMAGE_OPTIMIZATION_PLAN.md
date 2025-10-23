# Next.js Image Optimization Plan for Photo Galleries

**Date**: 2025-10-23
**Project**: Brennan Moore Personal Homepage/Blog
**Current Status**: Basic `next/image` usage, room for optimization

---

## Current Implementation Analysis

### ✅ What's Working Well

1. **Using `next/image` Component**
   - [photo-card.tsx](../src/components/photo-card.tsx:16) uses `<Image fill />` for responsive images
   - [mdx-component.tsx](../src/components/mdx-component.tsx:50) uses `<Image>` with fixed dimensions (1000x1000)
   - Automatic WebP/AVIF conversion by Next.js
   - Lazy loading enabled by default

2. **Cache Configuration**
   - [next.config.ts:10](../next.config.ts:10) sets `minimumCacheTTL: 2678400` (30 days)
   - CDN caching via Vercel's edge network
   - `Cache-Control` headers configured (1 hour max-age, 24 hour stale-while-revalidate)

3. **Photo Storage**
   - 19 photos in `public/images/photos/` directory
   - High-resolution originals (DSC camera format)
   - Static generation at build time

### ⚠️ Areas for Improvement

1. **Missing Image Specifications**
   - No `sizes` prop on PhotoCard images (browser uses default `100vw`)
   - No `priority` prop for above-the-fold images
   - No `quality` configuration (uses default 75%)
   - MDX component uses arbitrary 1000x1000 dimensions

2. **Missing Responsive Sizing**
   - PhotoCard renders at fixed aspect ratio but no breakpoint-specific sizes
   - Grid layout likely changes on mobile but images sized for desktop

3. **No Image Format Configuration**
   - Not explicitly specifying preferred formats (WebP/AVIF)
   - Not disabling formats for better compatibility

4. **Performance Monitoring**
   - No Lighthouse CI for tracking image performance
   - No Core Web Vitals monitoring for LCP (Largest Contentful Paint)

5. **Build-Time Optimization**
   - High-res originals stored in public/ (not pre-optimized)
   - No responsive image generation at build time

---

## Recommended Improvements

### Priority 1: Add `sizes` Prop for Responsive Loading

**Impact**: High - Reduces bandwidth usage by 40-60% on mobile
**Effort**: Low
**Files**: [src/components/photo-card.tsx](../src/components/photo-card.tsx:16)

#### Current Code:

```tsx
<Image src={`/images/photos/${post.coverImage}`} alt={post.title} fill />
```

#### Improved Code:

```tsx
<Image
  src={`/images/photos/${post.coverImage}`}
  alt={post.title}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  quality={85}
/>
```

**Explanation**:

- Mobile (≤640px): Full width (100vw)
- Tablet (641-1024px): Half width (50vw) - assuming 2-column grid
- Desktop (>1024px): Third width (33vw) - assuming 3-column grid

**Expected Improvement**:

- Mobile: Loads ~640px image instead of 1920px+ image
- Tablet: Loads ~512px image instead of 1920px+ image
- Bandwidth savings: 50-70% on mobile, 30-50% on tablet

---

### Priority 2: Prioritize Above-the-Fold Images

**Impact**: Medium - Improves LCP (Largest Contentful Paint) score
**Effort**: Low
**Files**: [src/app/photos/[slug]/page.tsx](../src/app/photos/[slug]/page.tsx), photo gallery pages

#### Approach:

```tsx
// For the first 3-6 images in a gallery
<Image
  src={photo.src}
  alt={photo.alt}
  fill
  sizes="..."
  priority // Prevents lazy loading, loads immediately
/>

// For remaining images
<Image
  src={photo.src}
  alt={photo.alt}
  fill
  sizes="..."
  loading="lazy" // Explicit lazy loading (default behavior)
/>
```

**Implementation Strategy**:

1. Add `priority` prop to first row of photos (typically 3-6 photos)
2. Keep lazy loading for remaining photos
3. Adjust based on actual viewport height

**Expected Improvement**:

- LCP improvement: 200-500ms faster
- Better Lighthouse performance score
- Improved perceived performance

---

### Priority 3: Optimize Image Quality Settings

**Impact**: Medium - Balance between quality and file size
**Effort**: Low
**Files**: [next.config.ts](../next.config.ts:9-11), component files

#### Current Configuration:

```ts
images: {
  minimumCacheTTL: 2678400, // 30 days
}
```

#### Recommended Configuration:

```ts
images: {
  minimumCacheTTL: 2678400, // 30 days
  formats: ['image/webp', 'image/avif'], // Prioritize modern formats
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  // Consider adding a remote loader if using external CDN later
}
```

#### Component-Level Quality:

```tsx
// For photo galleries (high quality needed)
<Image quality={85} ... />  // 85% is good balance

// For thumbnails/previews
<Image quality={75} ... />  // Default, good for smaller images
```

**Quality Guidelines**:

- **85%**: Hero images, featured photos, full-screen galleries
- **75%**: Regular photo cards, article images (default)
- **60%**: Thumbnails, avatars, low-priority images

**Expected Improvement**:

- 10-20% smaller file sizes with quality=85 vs quality=100
- AVIF format: 30-50% smaller than JPEG
- WebP format: 25-35% smaller than JPEG

---

### Priority 4: Add Blur Placeholder

**Impact**: Medium - Improves perceived performance
**Effort**: Medium
**Files**: Photo components

#### Approach:

```tsx
<Image
  src={photo.src}
  alt={photo.alt}
  fill
  placeholder="blur"
  blurDataURL={photo.blurDataURL} // Generate at build time
/>
```

#### Implementation Options:

**Option A: Manual Blur Data URLs (Simpler)**

```tsx
// For static images in public/
import photo1 from '@/public/images/photos/photo1.jpg';

<Image
  src={photo1}
  alt="..."
  fill
  placeholder="blur" // Automatically generates blur from static import
/>;
```

**Option B: Generate Blur Hashes at Build Time (Better)**

```ts
// In cache-posts.ts script
import { getPlaiceholder } from 'plaiceholder';

async function generateBlurDataURL(imagePath: string) {
  const { base64 } = await getPlaiceholder(imagePath);
  return base64;
}

// Add to Post type
interface Post {
  // ... existing fields
  blurDataURL?: string;
}
```

**Required Package**:

```bash
npm install plaiceholder sharp
```

**Expected Improvement**:

- Better perceived performance (no layout shift)
- Smoother loading experience
- Professional appearance

---

### Priority 5: Implement Responsive Image Sizing Strategy

**Impact**: High - Most impactful optimization for galleries
**Effort**: Medium
**Files**: CSS grid layouts, photo components

#### Current Grid Analysis:

Based on typical photo gallery layouts:

- Mobile: 1 column (100% width)
- Tablet: 2 columns (~50% width each)
- Desktop: 3-4 columns (~33% or 25% width each)

#### Recommended `sizes` Configuration:

**For Photo Gallery Grid**:

```tsx
<Image
  sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         (max-width: 1280px) 33vw,
         25vw"
/>
```

**For Full-Screen Photo View**:

```tsx
<Image
  sizes="(max-width: 768px) 100vw,
         (max-width: 1200px) 90vw,
         80vw"
/>
```

**For Thumbnail Grid (if added)**:

```tsx
<Image
  sizes="(max-width: 640px) 50vw,
         (max-width: 1024px) 33vw,
         20vw"
/>
```

#### Testing Strategy:

1. Use Chrome DevTools Network tab to verify correct image sizes loading
2. Test on different viewport sizes: 375px, 768px, 1024px, 1920px
3. Verify bandwidth usage reduction

**Expected Improvement**:

- 50-70% bandwidth reduction on mobile
- 30-50% bandwidth reduction on tablet
- Faster page loads on slower connections

---

## Advanced Optimizations (Optional)

### Option 1: Add Progressive Loading

**Implementation**:

```tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

export function ProgressiveImage({ src, alt, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative">
      <Image
        src={src}
        alt={alt}
        onLoadingComplete={() => setIsLoaded(true)}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
    </div>
  );
}
```

### Option 2: Add Image Grid Virtualization

For large galleries (100+ photos), consider using `react-window` or `react-virtualized`:

```tsx
import { FixedSizeGrid } from 'react-window';

function PhotoGallery({ photos }) {
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const photo = photos[rowIndex * COLUMNS + columnIndex];
    if (!photo) return null;

    return (
      <div style={style}>
        <PhotoCard post={photo} />
      </div>
    );
  };

  return (
    <FixedSizeGrid
      columnCount={3}
      columnWidth={400}
      height={800}
      rowCount={Math.ceil(photos.length / 3)}
      rowHeight={400}
      width={1200}
    >
      {Cell}
    </FixedSizeGrid>
  );
}
```

**When to use**: 50+ photos in a single gallery page

### Option 3: External CDN with Image Optimization

If scaling beyond Vercel's built-in optimization:

```ts
// next.config.ts
images: {
  loader: 'custom',
  loaderFile: './src/lib/image-loader.ts',
}

// src/lib/image-loader.ts
export default function cloudflareLoader({ src, width, quality }) {
  return `https://cdn.yourdomain.com/${src}?w=${width}&q=${quality || 75}`;
}
```

**Consider when**:

- 1000+ high-res images
- International audience (need geo-distributed CDN)
- Budget for external CDN (Cloudflare, Imgix, Cloudinary)

---

## Implementation Phases

### Phase 1: Quick Wins (1-2 hours)

1. Add `sizes` prop to PhotoCard component
2. Add `quality={85}` for photo galleries
3. Add `priority` to first 6 images on gallery pages
4. Update `next.config.ts` with `formats` configuration

**Expected Impact**: 40-50% bandwidth reduction, 200-300ms LCP improvement

### Phase 2: Blur Placeholders (2-3 hours)

1. Install `plaiceholder` and `sharp`
2. Update `cache-posts.ts` to generate blur hashes
3. Update Post interface to include `blurDataURL`
4. Update PhotoCard to use blur placeholders

**Expected Impact**: Improved perceived performance, better UX

### Phase 3: Advanced Optimizations (4-6 hours, optional)

1. Implement progressive loading component
2. Add virtualization for large galleries
3. Performance monitoring with Lighthouse CI
4. Core Web Vitals tracking

**Expected Impact**: Support for larger galleries, better monitoring

---

## Testing & Validation

### Performance Metrics to Track

**Before Optimization:**

```bash
# Run Lighthouse
npm run lighthouse

# Expected baseline:
# - Performance: 85-90
# - LCP: 2.5-3.5s
# - Total image size: ~5-8MB for gallery page
```

**After Phase 1:**

```bash
# Expected improvements:
# - Performance: 90-95
# - LCP: 1.5-2.0s
# - Total image size: ~2-3MB for gallery page
```

### Testing Checklist

- [ ] Test on mobile (375px viewport)
- [ ] Test on tablet (768px viewport)
- [ ] Test on desktop (1920px viewport)
- [ ] Verify correct image sizes loading in Network tab
- [ ] Check LCP in Lighthouse
- [ ] Test on slow 3G connection
- [ ] Verify no layout shift (CLS score)
- [ ] Check image quality visually

### Monitoring Commands

```bash
# Check image sizes being generated
ls -lh .next/cache/images/

# Analyze Next.js build
npm run build -- --profile

# Run Lighthouse CI
npm install -g @lhci/cli
lhci autorun --collect.url=http://localhost:3000/photos
```

---

## File Sizes Reference

Current image sizes in `public/images/photos/`:

- Average original size: ~3-8MB each (high-res DSC camera files)
- With Next.js optimization: ~300-800KB per image (at 1920w)
- With Phase 1 optimizations: ~100-300KB per image (responsive sizing)

**Estimated Savings**:

- Before: 19 photos × 800KB = ~15MB total
- After Phase 1: 19 photos × 200KB = ~3.8MB total
- **Savings: ~75% bandwidth reduction**

---

## Cost-Benefit Analysis

| Optimization      | Effort | Impact   | Time      | Cost |
| ----------------- | ------ | -------- | --------- | ---- |
| Add `sizes` prop  | Low    | High     | 30 min    | Free |
| Add `priority`    | Low    | Medium   | 15 min    | Free |
| Quality settings  | Low    | Medium   | 30 min    | Free |
| Blur placeholders | Medium | Medium   | 2-3 hours | Free |
| Virtualization    | High   | Low\*    | 4-6 hours | Free |
| External CDN      | High   | High\*\* | 1-2 days  | Paid |

\*Low for current gallery size (19 photos)
\*\*High only if scaling to 1000+ photos

---

## Recommended Implementation Order

### Immediate (Do Now):

1. Add `sizes` prop to PhotoCard - **Highest ROI**
2. Add `quality={85}` to photo images
3. Update `next.config.ts` with format preferences

### Next Week:

4. Add `priority` to above-the-fold images
5. Implement blur placeholders

### Future (When Needed):

6. Add virtualization (if gallery grows beyond 50 photos)
7. Consider external CDN (if scaling internationally)
8. Add progressive loading animations

---

## Conclusion

The current implementation is good but can be improved with relatively small changes. **Phase 1 optimizations** (1-2 hours effort) will provide the biggest impact:

- **40-50% bandwidth reduction**
- **200-300ms faster LCP**
- **Better mobile experience**
- **No cost** (uses Next.js built-in features)

All improvements are incremental and can be implemented without breaking changes.
