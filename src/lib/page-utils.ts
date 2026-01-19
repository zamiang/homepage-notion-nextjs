import { config } from '@/lib/config';
import { Post, getWordCount } from '@/lib/notion';

type PostType = 'photos' | 'writing';

const isDateValid = (val: string) => !isNaN(new Date(val).getTime());

export function generateJsonLd(post: Post, type: PostType) {
  const siteUrl = config.site.url;
  const imageUrl =
    type === 'photos'
      ? `${siteUrl}/images/photos/${post.coverImage}`
      : `${siteUrl}/images/${post.coverImage}`;

  if (!isDateValid(post.date)) {
    throw new Error(`Invalid date format for post: ${post.id}`);
  }

  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type === 'photos' ? 'Photograph' : 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      caption: post.title,
    },
    datePublished: new Date(post.date).toISOString(),
    dateModified: post.dateModified
      ? new Date(post.dateModified).toISOString()
      : new Date(post.date).toISOString(),
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
  };

  // Add wordCount for writing posts
  if (type === 'writing' && post.content) {
    const wordCount = getWordCount(post.content);
    return {
      ...baseSchema,
      wordCount,
      ...(post.section === 'VBC' ? { articleSection: 'Value-Based Care' } : {}),
      keywords: post.section ? [post.section] : undefined,
    };
  }

  // Add keywords for photos
  if (type === 'photos' && post.section) {
    return {
      ...baseSchema,
      keywords: [post.section],
    };
  }

  return baseSchema;
}
