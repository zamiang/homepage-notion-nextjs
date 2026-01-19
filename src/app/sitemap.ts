import { config } from '@/lib/config';
import { Post, getPhotosFromCache, getPostsFromCache } from '@/lib/notion';
import { MetadataRoute } from 'next';

// Force static generation at build time for consistent priority calculations
export const dynamic = 'force-static';

/**
 * Determines the priority for a post based on section and recency.
 * - VBC series posts: 0.9 (flagship content)
 * - Recent posts (< 6 months): 0.8
 * - Older posts (>= 6 months): 0.6
 */
function getPostPriority(post: Post): number {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const postDate = new Date(post.date);

  if (post.section === 'VBC') return 0.9;
  if (postDate >= sixMonthsAgo) return 0.8;
  return 0.6;
}

/**
 * Determines change frequency based on post age.
 * - Posts < 6 months: 'weekly' (may still receive updates)
 * - Posts 6-12 months: 'monthly' (occasional updates)
 * - Posts > 1 year: 'never' (content is stable)
 */
function getChangeFrequency(post: Post): 'weekly' | 'monthly' | 'never' {
  const now = new Date();
  const postDate = new Date(post.date);
  const ageInMonths =
    (now.getFullYear() - postDate.getFullYear()) * 12 + (now.getMonth() - postDate.getMonth());

  if (ageInMonths < 6) return 'weekly';
  if (ageInMonths < 12) return 'monthly';
  return 'never';
}

/**
 * Generates image URLs for sitemap entries.
 * Returns array with cover image if available, empty array otherwise.
 */
function getImageUrls(post: Post, siteUrl: string): string[] {
  if (!post.coverImage) return [];
  // Cover images are stored in /images/ directory
  return [`${siteUrl}/images/${post.coverImage}`];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = config.site.url;

  const posts = getPostsFromCache();
  const postUrls = posts.map((post: Post) => ({
    url: `${siteUrl}/writing/${post.slug}`,
    lastModified: new Date(post.dateModified || post.date),
    changeFrequency: getChangeFrequency(post),
    priority: getPostPriority(post),
    images: getImageUrls(post, siteUrl),
  }));

  const photos = getPhotosFromCache();
  const photoUrls = photos.map((post: Post) => ({
    url: `${siteUrl}/photos/${post.slug}`,
    lastModified: new Date(post.dateModified || post.date),
    changeFrequency: getChangeFrequency(post),
    priority: 0.7, // Photos have consistent priority
    images: getImageUrls(post, siteUrl),
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...postUrls,
    ...photoUrls,
  ];
}
