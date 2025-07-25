import { getPostsFromCache } from '@/lib/notion';

const title = 'Articles by Brennan Moore';
const description =
  "I see engineering as a creative craft. Whether my canvas is healthcare, art, or e-commerce, I build beauty by transforming complex problems into elegant solutions. I work best with a small crew, digging in with the business to find the one lever that can move a mountain. For me, success isn't just shipping a quality product—it's fostering an energized team and watching the business grow";
const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zamiang.com';

const getRssXml = () => {
  const posts = getPostsFromCache();

  let latestPostDate = '';
  let rssItemsXml = '';

  posts.forEach((post) => {
    const postDate = Date.parse(post.date);
    const postHref = `${siteUrl}/writing/${post.slug}`;

    if (!latestPostDate || postDate > Date.parse(latestPostDate)) {
      latestPostDate = new Date(post.date).toUTCString();
    }

    const date = new Date(post.date).toUTCString();
    const title = post.title;
    const excerpt = post.excerpt;

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
