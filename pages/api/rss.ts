import { Request, Response } from 'express';
import { getDatabase } from '../../lib/notion';
import { postsDatabaseId } from '../index';

const title = 'Articles by Brennan Moore';
const description = 'todo';
const baseUrl = 'https://www.zamaing.com/writing';

const getRssXml = async () => {
  const posts = await getDatabase(postsDatabaseId);

  const orderedPosts = posts
    .filter(
      (p) =>
        (p.properties.Status as any).select?.name === 'Live' &&
        (p.properties['Featured on homepage'] as any).select?.name === 'Featured',
    )
    .sort((a, b) =>
      new Date((a.properties.Date as any).date?.start) >
      new Date((b.properties.Date as any).date?.start)
        ? -1
        : 1,
    );

  let latestPostDate = '';
  let rssItemsXml = '';

  orderedPosts.forEach((post) => {
    const postDate = Date.parse(post.last_edited_time);
    const postHref = `${baseUrl}/${post.id}`;

    if (!latestPostDate || postDate > Date.parse(latestPostDate)) {
      latestPostDate = post.last_edited_time;
    }

    const date = new Date((post.properties.Date as any).date.start).toUTCString();
    const title = (post.properties.Title as any).title[0]?.plain_text;
    const excerpt = (post.properties.Excerpt as any).rich_text[0]?.plain_text;

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
            <link>https://www.zamiang.com</link>
            <description>
              <![CDATA[${description}]]>
            </description>
            <language>en</language>
            <lastBuildDate>${latestPostDate}</lastBuildDate>
            ${rssItemsXml}
        </channel>
      </rss>`;
};

export default async (_req: Request, res: Response) => {
  const processedXml = await getRssXml();

  res.setHeader('Content-Type', 'text/xml');
  res.write(processedXml);
  res.end();
};
