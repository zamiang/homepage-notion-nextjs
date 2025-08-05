import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';

import { fetchPublishedPosts, getPostFromNotion } from '../src/lib/notion';

const cachePosts = async (notion: Client) => {
  try {
    console.log('Fetching posts from Notion...');
    const posts = await fetchPublishedPosts(notion, process.env.NOTION_DATABASE_ID!);

    const allPosts = [];

    for (const post of posts) {
      const postDetails = await getPostFromNotion(post.id);
      if (postDetails) {
        allPosts.push(postDetails);
      }
    }

    const cachePath = path.join(process.cwd(), 'posts-cache.json');
    fs.writeFileSync(cachePath, JSON.stringify(allPosts, null, 2));

    console.log(`Successfully cached ${allPosts.length} posts.`);
  } catch (error) {
    console.error('Error caching posts:', error);
    process.exit(1);
  }
};

const cachePhotoPosts = async (notion: Client) => {
  try {
    console.log('Fetching photos from Notion...');
    const posts = await fetchPublishedPosts(notion, process.env.NOTION_PHOTOS_DATABASE_ID!);

    const allPosts = [];

    for (const post of posts) {
      const postDetails = await getPostFromNotion(post.id);
      if (postDetails) {
        allPosts.push(postDetails);
      }
    }

    const cachePath = path.join(process.cwd(), 'photos-cache.json');
    fs.writeFileSync(cachePath, JSON.stringify(allPosts, null, 2));

    console.log(`Successfully cached ${allPosts.length} photos.`);
  } catch (error) {
    console.error('Error caching photos:', error);
    process.exit(1);
  }
};

const notion = new Client({ auth: process.env.NOTION_TOKEN });
cachePhotoPosts(notion);
cachePosts(notion);
