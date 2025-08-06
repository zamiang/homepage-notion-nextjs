import PostLayout from '@/components/post-layout';
import PostsFooter from '@/components/posts-footer';
import { getPhotosFromCache } from '@/lib/notion';
import { generateJsonLd, generatePostMetadata, generatePostStaticParams } from '@/lib/page-utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  return generatePostMetadata(getPhotosFromCache, 'photos', params.slug);
}

export async function generateStaticParams() {
  return generatePostStaticParams(getPhotosFromCache);
}

export default async function PhotoPage({ params }: PostPageProps) {
  const { slug } = params;
  const photos = getPhotosFromCache();
  const post = photos.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const jsonLd = generateJsonLd(post, 'photos');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostLayout post={post} footerContent={<PostsFooter slug={post.slug} />} />
    </>
  );
}
