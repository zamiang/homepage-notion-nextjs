import { config } from '@/lib/config';
import { PostWithType, getAllItemsSortedByDate } from '@/lib/notion';

// Force static generation at build time
export const dynamic = 'force-static';

const title = 'Articles by Brennan Moore';
const description =
  "I see engineering as a creative craft. Whether my canvas is healthcare, art, or e-commerce, I build beauty by transforming complex problems into elegant solutions. I work best with a small crew, digging in with the business to find the one lever that can move a mountain. For me, success isn't just shipping a quality product—it's fostering an energized team and watching the business grow";
const siteUrl = config.site.url;

/**
 * Generates category tags for an item based on section and type.
 */
function getCategoryTags(item: PostWithType): string {
  const categories: string[] = [];

  // Add section as category (e.g., "All", "VBC")
  if (item.section) {
    const sectionLabel = item.section === 'VBC' ? 'Value-Based Care' : item.section;
    categories.push(`<category><![CDATA[${sectionLabel}]]></category>`);
  }

  // Add type as category (e.g., "writing", "photo")
  const typeLabel = item.type === 'photo' ? 'Photography' : 'Writing';
  categories.push(`<category><![CDATA[${typeLabel}]]></category>`);

  return categories.join('\n            ');
}

const MIME_TYPES: Record<string, string> = {
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
};

/**
 * Generates enclosure tag for cover image if available.
 */
function getEnclosureTag(item: PostWithType): string {
  if (!item.coverImage) return '';

  const imageUrl = `${siteUrl}/images/${item.coverImage}`;
  const ext = item.coverImage.split('.').pop()?.toLowerCase();
  const mimeType = MIME_TYPES[ext || ''] || 'image/jpeg';

  return `<enclosure url="${imageUrl}" type="${mimeType}" length="0"/>`;
}

const getRssXml = () => {
  const allItems = getAllItemsSortedByDate();

  let latestPostDate = '';
  let rssItemsXml = '';

  allItems.forEach((item) => {
    const postDate = Date.parse(item.date);
    const postHref =
      item.type === 'photo' ? `${siteUrl}/photos/${item.slug}` : `${siteUrl}/writing/${item.slug}`;

    if (!latestPostDate || postDate > Date.parse(latestPostDate)) {
      latestPostDate = new Date(item.date).toUTCString();
    }

    const date = new Date(item.date).toUTCString();
    const itemTitle = item.title;
    const excerpt = item.excerpt || '';
    const content = item.content || '';
    const author = item.author || 'Brennan Moore';
    const categoryTags = getCategoryTags(item);
    const enclosureTag = getEnclosureTag(item);

    rssItemsXml += `
          <item>
            <title><![CDATA[${itemTitle}]]></title>
            <link>${postHref}</link>
            <pubDate>${date}</pubDate>
            <guid isPermaLink="false">${postHref}</guid>
            <dc:creator><![CDATA[${author}]]></dc:creator>
            ${categoryTags}
            <description><![CDATA[${excerpt}]]></description>
            <content:encoded><![CDATA[${content}]]></content:encoded>
            ${enclosureTag}
          </item>`;
  });

  return `<?xml version="1.0" ?>
      <rss
        xmlns:dc="http://purl.org/dc/elements/1.1/"
        xmlns:content="http://purl.org/rss/1.0/modules/content/"
        xmlns:atom="http://www.w3.org/2005/Atom"
        version="2.0"
      >
        <channel>
            <title><![CDATA[${title}]]></title>
            <link>${siteUrl}</link>
            <description>
              <![CDATA[${description}]]>
            </description>
            <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
            <language>en</language>
            <lastBuildDate>${latestPostDate}</lastBuildDate>
            ${rssItemsXml}
        </channel>
      </rss>`;
};

export async function GET() {
  const processedXml = getRssXml();
  const headers = new Headers({ 'content-type': 'application/xml' });

  return new Response(processedXml, { headers });
}
