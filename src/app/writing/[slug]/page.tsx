import { VBC_TITLE } from '@/components/consts';
import PostLayout from '@/components/post-layout';
import PostsFooter from '@/components/posts-footer';
import TableOfContents from '@/components/table-of-contents';
import VBCFooter from '@/components/vbc-footer';
import { getPostsFromCache, getWordCount } from '@/lib/notion';
import { generateJsonLd, generatePostMetadata, generatePostStaticParams } from '@/lib/page-utils';
import { extractHeadings } from '@/lib/toc';
import { calculateReadingTime } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  return generatePostMetadata(getPostsFromCache, 'writing', slug);
}

export async function generateStaticParams() {
  return generatePostStaticParams(getPostsFromCache);
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const posts = getPostsFromCache();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const wordCount = getWordCount(post.content);
  const jsonLd = generateJsonLd(post, 'writing');

  // Extract headings for TOC only if showToc is enabled
  const tocItems = post.showToc ? extractHeadings(post.content) : [];
  const tocContent =
    post.showToc && tocItems.length >= 3 ? <TableOfContents items={tocItems} /> : null;

  const headerContent = (
    <>
      <span>{calculateReadingTime(wordCount)}</span>
    </>
  );

  const footerContent = (
    <>
      {post.section === 'VBC' && <VBCFooter slug={slug} />}
      <PostsFooter slug={post.slug} />
    </>
  );

  const subHeaderContent = (
    <>
      {post.section === 'VBC' && (
        <div className="mb-4">
          <Link
            href="/#vbc"
            className="inline-block text-xs font-semibold uppercase tracking-wider text-accent bg-accent/15 px-3 py-1 rounded hover:bg-accent/25 transition-colors duration-150 !border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {VBC_TITLE}
          </Link>
        </div>
      )}
    </>
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostLayout
        post={post}
        headerContent={headerContent}
        tocContent={tocContent}
        footerContent={footerContent}
        subHeaderContent={subHeaderContent}
      />
    </>
  );
}
