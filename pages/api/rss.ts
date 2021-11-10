import { Request, Response } from 'express';
import { getItemsFromDatabase } from '../../lib/notion';
import { baseUrl, postsDatabaseId } from '../index';

const title = 'Articles by Brennan Moore';
const description = 'todo';

const getRssXml = async () => {
  const posts = await getItemsFromDatabase(postsDatabaseId);

  const orderedPosts = posts
    .filter(
      (p) =>
        (p.properties.Status as any).select?.name === 'Live' &&
        (p.properties['Featured on homepage'] as any).select?.name === 'Featured',
    )
    .sort((a, b) =>
      new Date((a.properties.Date as any).date?.start as string) >
      new Date((b.properties.Date as any).date?.start as string)
        ? -1
        : 1,
    );

  let latestPostDate = '';
  let rssItemsXml = '';

  orderedPosts.forEach((post) => {
    const slug = (post.properties.Slug as any).rich_text[0]?.plain_text;
    const postDate = Date.parse(post.last_edited_time);
    const postHref = `${baseUrl}/writing/${slug}`;

    if (!latestPostDate || postDate > Date.parse(latestPostDate)) {
      latestPostDate = new Date(post.last_edited_time).toUTCString();
    }

    const date = new Date((post.properties.Date as any).date?.start as string).toUTCString();
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
            <link>${baseUrl}</link>
            <description>
              <![CDATA[${description}]]>
            </description>
            <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
            <language>en</language>
            <lastBuildDate>${latestPostDate}</lastBuildDate>
            ${rssItemsXml}
        </channel>
      </rss>`;
};

export default async (_req: Request, res: Response) => {
  const processedXml = await getRssXml();

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.write(processedXml);
  res.end();
};
