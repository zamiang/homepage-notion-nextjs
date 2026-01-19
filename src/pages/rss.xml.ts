/**
 * RSS Feed endpoint
 * Generates an RSS 2.0 feed for all posts and photos
 */
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { existsSync, statSync } from 'fs';
import { join } from 'path';

import { config } from '../lib/config';

const MIME_TYPES: Record<string, string> = {
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
};

/**
 * Gets the file size in bytes for an image in the public/images directory.
 */
function getImageFileSize(filename: string, isPhoto: boolean): number {
  try {
    const imagePath = isPhoto
      ? join(process.cwd(), 'public', 'images', 'photos', filename)
      : join(process.cwd(), 'public', 'images', filename);
    if (existsSync(imagePath)) {
      return statSync(imagePath).size;
    }
  } catch (error) {
    console.warn(`Failed to get file size for ${filename}:`, error);
  }
  return 0;
}

/**
 * Generate enclosure object for cover image
 */
function getEnclosure(coverImage: string, isPhoto: boolean, siteUrl: string) {
  if (!coverImage) return undefined;

  const imageUrl = isPhoto
    ? `${siteUrl}/images/photos/${coverImage}`
    : `${siteUrl}/images/${coverImage}`;
  const ext = coverImage.split('.').pop()?.toLowerCase();
  const mimeType = MIME_TYPES[ext || ''] || 'image/jpeg';
  const fileSize = getImageFileSize(coverImage, isPhoto);

  return {
    url: imageUrl,
    type: mimeType,
    length: fileSize,
  };
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
  const siteUrl = config.site.url;

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

  return rss({
    title: 'Articles by Brennan Moore',
    description:
      "I see engineering as a creative craft. Whether my canvas is healthcare, art, or e-commerce, I build beauty by transforming complex problems into elegant solutions. I work best with a small crew, digging in with the business to find the one lever that can move a mountain. For me, success isn't just shipping a quality product—it's fostering an energized team and watching the business grow",
    site: context.site?.toString() || siteUrl,
    items: allItems.map((item) => {
      const { data, type } = item;
      const link = type === 'photo' ? `/photos/${data.slug}` : `/writing/${data.slug}`;

      // Build categories
      const categories: string[] = [];
      if (data.section) {
        categories.push(data.section === 'VBC' ? 'Value-Based Care' : data.section);
      }
      categories.push(type === 'photo' ? 'Photography' : 'Writing');

      return {
        title: data.title,
        pubDate: new Date(data.date),
        description: data.excerpt || '',
        link,
        author: data.author || 'Brennan Moore',
        categories,
        content: data.content,
        enclosure: getEnclosure(data.coverImage, type === 'photo', siteUrl),
      };
    }),
    customData: `<language>en</language>`,
    xmlns: {
      dc: 'http://purl.org/dc/elements/1.1/',
      content: 'http://purl.org/rss/1.0/modules/content/',
    },
  });
}
