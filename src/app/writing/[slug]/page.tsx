import { VBC_TITLE } from '@/components/consts';
import PostLayout from '@/components/post-layout';
import PostsFooter from '@/components/posts-footer';
import VBCFooter from '@/components/vbc-footer';
import { getPostsFromCache, getWordCount } from '@/lib/notion';
import { generateJsonLd, generatePostMetadata, generatePostStaticParams } from '@/lib/page-utils';
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
        <div className="mb-2 ">
          <Link href="/#vbc">
            <b>{VBC_TITLE}</b>
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
        footerContent={footerContent}
        subHeaderContent={subHeaderContent}
      />
    </>
  );
}
