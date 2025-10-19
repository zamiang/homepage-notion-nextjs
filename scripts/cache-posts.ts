import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';

import { config, validateNotionConfig } from '../src/lib/config';
import { fetchPublishedPosts, getPostFromNotion } from '../src/lib/notion';

// Validate required Notion environment variables before proceeding
validateNotionConfig();

interface CacheConfig {
  dataSourceID: string;
  cacheFileName: string;
  itemName: string;
}

const cacheItems = async (notion: Client, config: CacheConfig) => {
  try {
    console.log(`Fetching ${config.itemName} from Notion...`);
    const posts = await fetchPublishedPosts(notion, config.dataSourceID);

    const allPosts = [];

    for (const post of posts) {
      const postDetails = await getPostFromNotion(post.id);
      if (postDetails) {
        allPosts.push(postDetails);
      }
    }

    const cachePath = path.join(process.cwd(), config.cacheFileName);
    fs.writeFileSync(cachePath, JSON.stringify(allPosts, null, 2));

    console.log(`Successfully cached ${allPosts.length} ${config.itemName}.`);
  } catch (error) {
    console.error(`Error caching ${config.itemName}:`, error);
    process.exit(1);
  }
};

const notion = new Client({
  auth: config.notion.token,
});

// Cache posts and photos using the generic function
(async () => {
  await Promise.all([
    cacheItems(notion, {
      dataSourceID: config.notion.dataSourceId,
      cacheFileName: config.cache.postsFileName,
      itemName: 'posts',
    }),
    cacheItems(notion, {
      dataSourceID: config.notion.photosDataSourceId,
      cacheFileName: config.cache.photosFileName,
      itemName: 'photos',
    }),
  ]);
})();
