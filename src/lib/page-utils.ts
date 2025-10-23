import { config } from '@/lib/config';
import { Post, getWordCount } from '@/lib/notion';
import { Metadata } from 'next';

type PostType = 'photos' | 'writing';

export async function generatePostMetadata(
  getPosts: () => Post[],
  type: PostType,
  slug: string,
): Promise<Metadata> {
  const posts = getPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const siteUrl = config.site.url;
  const imageUrl =
    type === 'photos' ? `/images/photos/${post.coverImage}` : `/images/${post.coverImage}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${siteUrl}/${type}/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      siteName: "Brennan's Blog",
      type: 'article',
      url: `${siteUrl}/${type}/${post.slug}`,
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      images: [
        {
          url: imageUrl,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: imageUrl,
          alt: post.title,
        },
      ],
    },
  };
}

export function generatePostStaticParams(getPosts: () => Post[]) {
  const posts = getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

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
