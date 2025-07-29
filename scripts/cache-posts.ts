import { fetchPublishedPosts, getPostFromNotion } from '../src/lib/notion';
import fs from 'fs';
import path from 'path';

async function cachePosts() {
  try {
    console.log('Fetching posts from Notion...');
    const posts = await fetchPublishedPosts(process.env.NOTION_DATABASE_ID!);

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
}

async function cachePhotoPosts() {
  try {
    console.log('Fetching photos from Notion...');
    const posts = await fetchPublishedPosts(process.env.NOTION_PHOTOS_DATABASE_ID!);

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
}

cachePhotoPosts();
cachePosts();
