import { Request, Response } from 'express';
import { SitemapStream, streamToPromise } from 'sitemap';

export default async (_req: Request, res: Response) => {
  const smStream = new SitemapStream({
    hostname: 'https://www.kelp.nyc',
  });

  smStream.write({
    url: '/',
  });
  smStream.write({
    url: '/about',
  });
  smStream.write({
    url: '/privacy',
  });
  smStream.write({
    url: '/terms',
  });
  smStream.write({
    url: '/install',
  });

  // tell sitemap that there is nothing more to add to the sitemap
  smStream.end();

  // generate a sitemap and add the XML feed to a url which will be used later on.
  const sitemap = await streamToPromise(smStream).then((sm) => sm.toString());

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
};
