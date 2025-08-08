import { Post } from '@/lib/notion';
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

  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zamiang.com';
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
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zamiang.com';
  const imageUrl =
    type === 'photos' ? `/images/photos/${post.coverImage}` : `/images/${post.coverImage}`;

  if (!isDateValid(post.date)) {
    throw new Error(`Invalid date format for post: ${post.id}`);
  }

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
