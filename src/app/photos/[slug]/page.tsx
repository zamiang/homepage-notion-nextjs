import { getPhotosFromCache } from '@/lib/notion';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import { components } from '@/components/mdx-component';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import PostsFooter from '@/components/posts-footer';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const posts = getPhotosFromCache();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zamiang.com';

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${siteUrl}/photos/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      siteName: "Brennan's Blog",
      type: 'article',
      url: `${siteUrl}/photos/${post.slug}`,
      publishedTime: new Date(post.date).toISOString(),
      authors: post.author ? [post.author] : [],
      images: [
        {
          url: `/images/photos/${post.coverImage}`,
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
          url: `/images/photos/${post.coverImage}`,
          alt: post.title,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  const photos = getPhotosFromCache();

  return photos.map((photo) => ({
    slug: photo.slug,
  }));
}

export default async function PhotoPage({ params }: PostPageProps) {
  const { slug } = await params;
  const posts = getPhotosFromCache();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zamiang.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: `/images/photos/${post.coverImage}`,
    datePublished: new Date(post.date).toISOString(),
    author: {
      '@type': 'Person',
      name: post.author || 'Guest Author',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Brennan Moore',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/photos/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-2xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <time>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">{post.title}</h1>
          <div className="excerpt text-muted-foreground">{post.excerpt}</div>
          <div className="divider"></div>
        </header>
        <div className="max-w-none">
          <ReactMarkdown
            components={components}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
        <PostsFooter slug={post.slug} />
      </article>
    </>
  );
}
