import { config } from '@/lib/config';
import { getAllItemsSortedByDate, getWordCount } from '@/lib/notion';

// Force static generation at build time
export const dynamic = 'force-static';

/**
 * JSON Feed 1.1 route
 * Spec: https://jsonfeed.org/version/1.1
 */
export async function GET() {
  const allItems = getAllItemsSortedByDate();
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
    items: allItems.map((item) => {
      const wordCount = item.content ? getWordCount(item.content) : 0;
      const itemUrl =
        item.type === 'photo'
          ? `${siteUrl}/photos/${item.slug}`
          : `${siteUrl}/writing/${item.slug}`;
      const imageUrl =
        item.type === 'photo'
          ? `${siteUrl}/images/photos/${item.coverImage}`
          : `${siteUrl}/images/${item.coverImage}`;

      return {
        id: itemUrl,
        url: itemUrl,
        title: item.title,
        content_html: item.content,
        summary: item.excerpt,
        image: imageUrl,
        date_published: new Date(item.date).toISOString(),
        authors: [
          {
            name: item.author,
          },
        ],
        tags: item.section ? [item.section, item.type] : [item.type],
        _word_count: wordCount, // Custom extension
        _content_type: item.type, // Custom extension to distinguish photos from writing
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
