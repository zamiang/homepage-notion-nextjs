import { Request, Response } from 'express';
import { SitemapStream, streamToPromise } from 'sitemap';
import { getDatabase } from '../../lib/notion';
import { postsDatabaseId } from '../index';

export default async (_req: Request, res: Response) => {
  const posts = await getDatabase(postsDatabaseId);

  const smStream = new SitemapStream({
    hostname: 'https://www.kelp.nyc',
  });

  smStream.write({
    url: '/',
  });
  smStream.write({
    url: '/writing',
  });
  smStream.write({
    url: '/photos',
  });

  posts.map((p) => {
    const slug = (p.properties.Slug as any).rich_text[0]?.plain_text;
    return smStream.write({
      url: `/writing/${slug}`,
      lastmod: new Date(p.last_edited_time).toISOString(),
    });
  });

  smStream.end();

  // generate a sitemap and add the XML feed to a url which will be used later on.
  const sitemap = await streamToPromise(smStream).then((sm) => sm.toString());

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
};
