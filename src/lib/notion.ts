import { Client } from '@notionhq/client';
import { ImageBlockObjectResponse } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/';
import fs from 'fs';
import { NotionToMarkdown } from 'notion-to-md';
import path from 'path';

import { config } from './config';
import { downloadImage, getFilename } from './download-image';
import { ValidationError, logError } from './errors';

export interface Post {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  date: string;
  dateModified?: string;
  excerpt?: string;
  content: string;
  author: string;
  section?: string; // 'All' | 'VBC';
  showToc?: boolean;
}

export function getWordCount(content: string): number {
  const cleanText = content
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleanText.length === 0 ? 0 : cleanText.split(' ').length;
}

export function getPostsFromCache(): Post[] {
  const cachePath = path.join(process.cwd(), config.cache.postsFileName);
  if (fs.existsSync(cachePath)) {
    try {
      const cache = fs.readFileSync(cachePath, 'utf-8');
      return JSON.parse(cache);
    } catch (error) {
      logError('getPostsFromCache', error, { cachePath });
      return [];
    }
  }
  return [];
}

export function getAllSectionPostsFromCache(): Post[] {
  const cachePath = path.join(process.cwd(), config.cache.postsFileName);
  if (fs.existsSync(cachePath)) {
    try {
      const cache = fs.readFileSync(cachePath, 'utf-8');
      return JSON.parse(cache).filter((post: Post) => post.section === 'All');
    } catch (error) {
      logError('getAllSectionPostsFromCache', error, { cachePath });
      return [];
    }
  }
  return [];
}

export function getVBCSectionPostsFromCache(): Post[] {
  const cachePath = path.join(process.cwd(), config.cache.postsFileName);
  if (fs.existsSync(cachePath)) {
    try {
      const cache = fs.readFileSync(cachePath, 'utf-8');
      return JSON.parse(cache).filter((post: Post) => post.section === 'VBC');
    } catch (error) {
      logError('getVBCSectionPostsFromCache', error, { cachePath });
      return [];
    }
  }
  return [];
}

export function getPhotosFromCache(): Post[] {
  const cachePath = path.join(process.cwd(), config.cache.photosFileName);
  if (fs.existsSync(cachePath)) {
    try {
      const cache = fs.readFileSync(cachePath, 'utf-8');
      return JSON.parse(cache);
    } catch (error) {
      logError('getPhotosFromCache', error, { cachePath });
      return [];
    }
  }
  return [];
}

export const fetchPublishedPosts = async (notion: Client, dataSourceID: string) => {
  // This function is now intended to be used only by the caching script.
  const posts = await notion.dataSources.query({
    data_source_id: dataSourceID!,
    filter: {
      and: [
        {
          property: 'Status',
          status: {
            equals: 'Published',
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Published Date',
        direction: 'descending',
      },
    ],
  });

  return posts.results as PageObjectResponse[];
};

export async function getPost(slug: string): Promise<Post | null> {
  const posts = getAllSectionPostsFromCache();
  const post = posts.find((p) => p.slug === slug);
  return post || null;
}

export async function getPostFromNotion(pageId: string): Promise<Post | null> {
  try {
    const notion = new Client({
      auth: process.env.NOTION_TOKEN || config.notion.token,
    });
    const n2m = new NotionToMarkdown({ notionClient: notion });

    n2m.setCustomTransformer('image', async (block) => {
      const { image } = block as ImageBlockObjectResponse;
      const src = image.type === 'external' ? image.external.url : image.file.url;
      const filename = getFilename(src);

      // Download image for local serving
      downloadImage(src);

      return `<figure><img src="/images/${filename}" /></figure>`;
    });

    n2m.setCustomTransformer('column_list', async (block) => {
      const mdBlocks = await n2m.pageToMarkdown(block.id);

      const strings = mdBlocks.map((block) => {
        const { parent: contentString } = n2m.toMarkdownString(block.children);
        return `<div>
    ${contentString}</div>`;
      });

      return `<div className="column">${strings.join('')}</div>`;
    });

    const page = (await notion.pages.retrieve({
      page_id: pageId,
    })) as PageObjectResponse;
    const mdBlocks = await n2m.pageToMarkdown(pageId);

    const { parent: contentString } = n2m.toMarkdownString(mdBlocks);

    const properties = page.properties;

    const imageName = properties['Image Name'];
    const title = properties['Title'];
    const slug = properties['Slug'];
    const excerpt = properties['Excerpt'];
    const date = properties['Published Date'];
    const section = properties['Section'];
    const showTocProp = properties['Show TOC'];

    const titleText =
      title.type === 'title' && title.title[0]?.plain_text ? title.title[0].plain_text : undefined;

    if (!titleText) {
      throw new ValidationError(`Missing title for page ${pageId}`, 'title');
    }

    const slugText =
      slug.type === 'rich_text' && slug.rich_text[0]?.plain_text
        ? slug.rich_text[0]?.plain_text
        : 'no-slug';

    if (!slugText) {
      throw new ValidationError(`Missing slug for post: ${titleText}`, 'slug');
    }

    const coverImage =
      imageName?.type === 'rich_text' && imageName.rich_text && imageName.rich_text[0]
        ? imageName.rich_text[0].plain_text
        : undefined;

    if (!coverImage) {
      throw new ValidationError(`Missing cover image for post: ${titleText}`, 'coverImage');
    }

    const sectionText =
      section?.type === 'select' && section.select ? section.select.name : undefined;

    const showToc =
      showTocProp?.type === 'checkbox' ? showTocProp.checkbox : undefined;

    const excerptText =
      excerpt.type === 'rich_text' && excerpt.rich_text[0]?.plain_text
        ? excerpt.rich_text[0]?.plain_text
        : undefined;

    if (!excerptText) {
      throw new ValidationError(`Missing excerpt for post: ${titleText}`, 'excerpt');
    }

    const dateText = date.type === 'date' && date.date?.start ? date.date?.start : undefined;

    if (!dateText) {
      throw new ValidationError(`Missing date for post: ${titleText}`, 'date');
    }

    const post: Post = {
      id: page.id,
      title: titleText,
      slug: slugText,
      excerpt: excerptText,
      coverImage,
      date: dateText,
      dateModified: page.last_edited_time,
      content: contentString,
      section: sectionText,
      showToc,
      author: 'Brennan Moore',
    };

    return post;
  } catch (error) {
    logError('getPostFromNotion', error, { pageId });
    return null;
  }
}

/**
 * Gets all posts and photos combined, sorted by date (newest first)
 * Adds a 'type' field to distinguish between 'writing' and 'photo' items
 */
export type PostWithType = Post & { type: 'writing' | 'photo' };

export function getAllItemsSortedByDate(): PostWithType[] {
  const writingPosts = getPostsFromCache().map((post) => ({ ...post, type: 'writing' as const }));
  const photos = getPhotosFromCache().map((post) => ({ ...post, type: 'photo' as const }));
  const allItems = [...writingPosts, ...photos].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  return allItems;
}
