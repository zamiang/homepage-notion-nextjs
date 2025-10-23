import { config } from '@/lib/config';
import { getAllItemsSortedByDate } from '@/lib/notion';

const title = 'Articles by Brennan Moore';
const description =
  "I see engineering as a creative craft. Whether my canvas is healthcare, art, or e-commerce, I build beauty by transforming complex problems into elegant solutions. I work best with a small crew, digging in with the business to find the one lever that can move a mountain. For me, success isn't just shipping a quality product—it's fostering an energized team and watching the business grow";
const siteUrl = config.site.url;

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
    const title = item.title;
    const excerpt = item.excerpt;

    rssItemsXml += `
          <item>
            <title><![CDATA[${title}]]></title>
            <link>${postHref}</link>
            <pubDate>${date}</pubDate>
            <guid isPermaLink="false">${postHref}</guid>
            <description>
            <![CDATA[${excerpt}]]>
            </description>
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
