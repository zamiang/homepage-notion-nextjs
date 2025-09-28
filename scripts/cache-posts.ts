import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';

import { fetchPublishedPosts, getPostFromNotion } from '../src/lib/notion';

interface CacheConfig {
  databaseId: string;
  cacheFileName: string;
  itemName: string;
}

const cacheItems = async (notion: Client, config: CacheConfig) => {
  try {
    console.log(`Fetching ${config.itemName} from Notion...`);
    const posts = await fetchPublishedPosts(notion, config.databaseId);

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
  auth: process.env.NOTION_TOKEN,
  notionVersion: '2022-06-28',
});

// Cache posts and photos using the generic function
(async () => {
  await Promise.all([
    cacheItems(notion, {
      databaseId: process.env.NOTION_DATABASE_ID!,
      cacheFileName: 'posts-cache.json',
      itemName: 'posts',
    }),
    cacheItems(notion, {
      databaseId: process.env.NOTION_PHOTOS_DATABASE_ID!,
      cacheFileName: 'photos-cache.json',
      itemName: 'photos',
    }),
  ]);
})();
