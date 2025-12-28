import { config } from '@/lib/config';
import { Post, getPhotosFromCache, getPostsFromCache } from '@/lib/notion';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = config.site.url;

  const posts = getPostsFromCache();
  const postUrls = posts.map((post: Post) => ({
    url: `${siteUrl}/writing/${post.slug}`,
    lastModified: new Date(post.dateModified || post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const photos = getPhotosFromCache();
  const photoUrls = photos.map((post: Post) => ({
    url: `${siteUrl}/photos/${post.slug}`,
    lastModified: new Date(post.dateModified || post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
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
