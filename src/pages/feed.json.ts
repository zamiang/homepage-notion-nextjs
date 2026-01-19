/**
 * JSON Feed 1.1 endpoint
 * Spec: https://jsonfeed.org/version/1.1
 */

import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

import { config } from '../lib/config';

/**
 * Calculate word count from content
 */
function getWordCount(content: string): number {
  const cleanText = content.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  return cleanText.length === 0 ? 0 : cleanText.split(' ').length;
}

interface PostData {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  content: string;
  author: string;
  section?: string;
  coverImage: string;
}

export async function GET(context: APIContext) {
  const siteUrl = context.site?.toString().replace(/\/$/, '') || config.site.url;

  // Get all posts and photos from collections
  const posts = await getCollection('posts');
  const vbcPosts = await getCollection('vbcPosts');
  const photos = await getCollection('photos');

  // Combine all items with type information
  const allItems: { data: PostData; type: 'writing' | 'photo' }[] = [
    ...posts.map((post) => ({ data: post.data as PostData, type: 'writing' as const })),
    ...vbcPosts.map((post) => ({ data: post.data as PostData, type: 'writing' as const })),
    ...photos.map((photo) => ({ data: photo.data as PostData, type: 'photo' as const })),
  ];

  // Sort by date descending
  allItems.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

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
    items: allItems.map((item) => {
      const { data, type } = item;
      const itemUrl = type === 'photo' ? `${siteUrl}/photos/${data.slug}` : `${siteUrl}/writing/${data.slug}`;
      const imageUrl =
        type === 'photo'
          ? `${siteUrl}/images/photos/${data.coverImage}`
          : `${siteUrl}/images/${data.coverImage}`;
      const wordCount = data.content ? getWordCount(data.content) : 0;

      return {
        id: itemUrl,
        url: itemUrl,
        title: data.title,
        content_html: data.content,
        summary: data.excerpt,
        image: imageUrl,
        date_published: new Date(data.date).toISOString(),
        authors: [
          {
            name: data.author || config.site.author,
          },
        ],
        tags: data.section ? [data.section, type] : [type],
        _word_count: wordCount, // Custom extension
        _content_type: type, // Custom extension to distinguish photos from writing
      };
    }),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
