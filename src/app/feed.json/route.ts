import { config } from '@/lib/config';
import { getAllSectionPostsFromCache, getWordCount } from '@/lib/notion';

/**
 * JSON Feed 1.1 route
 * Spec: https://jsonfeed.org/version/1.1
 */
export async function GET() {
  const posts = getAllSectionPostsFromCache();
  const siteUrl = config.site.url;

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
    items: posts.map((post) => {
      const wordCount = post.content ? getWordCount(post.content) : 0;

      return {
        id: `${siteUrl}/writing/${post.slug}`,
        url: `${siteUrl}/writing/${post.slug}`,
        title: post.title,
        content_html: post.content,
        summary: post.excerpt,
        image: `${siteUrl}/images/${post.coverImage}`,
        date_published: new Date(post.date).toISOString(),
        authors: [
          {
            name: post.author,
          },
        ],
        tags: post.section ? [post.section] : undefined,
        _word_count: wordCount, // Custom extension
      };
    }),
  };

  return Response.json(feed, {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
