import Link from 'next/link';
import { getPostsFromCache, getWordCount } from '@/lib/notion';
import { format } from 'date-fns';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import { calculateReadingTime } from '@/lib/utils';
import { components } from '@/components/mdx-component';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import PostsFooter from '@/components/posts-footer';
import VBCFooter from '@/components/vbc-footer';
import { VBC_TITLE } from '@/components/consts';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const posts = getPostsFromCache();
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
      canonical: `${siteUrl}/writing/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `${siteUrl}/writing/${post.slug}`,
      siteName: "Brennan's Blog",
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      images: [
        {
          url: `/images/${post.coverImage}`,
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
          url: `/images/${post.coverImage}`,
          alt: post.title,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  const posts = getPostsFromCache();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const posts = getPostsFromCache();
  const post = posts.find((p) => p.slug === slug);
  const wordCount = post?.content ? getWordCount(post.content) : 0;

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
      '@id': `${siteUrl}/writing/${post.slug}`,
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
            <span>{calculateReadingTime(wordCount)}</span>
          </div>
          {post.section === 'VBC' && (
            <Link href="/#vbc" className="footerLink">
              <b>{VBC_TITLE}</b>
            </Link>
          )}
          <h1 className="mb-4">{post.title}</h1>
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
        {post.section === 'VBC' && <VBCFooter slug={slug} />}
        <PostsFooter slug={post.slug} />
      </article>
    </>
  );
}
