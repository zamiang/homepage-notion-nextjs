import { Client } from '@notionhq/client';
import { ImageBlockObjectResponse } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/';
import dotenv from 'dotenv';
import fs from 'fs';
import { NotionToMarkdown } from 'notion-to-md';
import path from 'path';

import { downloadImage, getFilename } from './download-image';

dotenv.config();

export interface Post {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  date: string;
  excerpt?: string;
  content: string;
  author: string;
  section?: string; // 'All' | 'VBC';
}

export function getWordCount(content: string): number {
  const cleanText = content
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleanText.length === 0 ? 0 : cleanText.split(' ').length;
}

export function getPostsFromCache(): Post[] {
  const cachePath = path.join(process.cwd(), 'posts-cache.json');
  if (fs.existsSync(cachePath)) {
    const cache = fs.readFileSync(cachePath, 'utf-8');
    return JSON.parse(cache);
  }
  return [];
}

export function getAllSectionPostsFromCache(): Post[] {
  const cachePath = path.join(process.cwd(), 'posts-cache.json');
  if (fs.existsSync(cachePath)) {
    const cache = fs.readFileSync(cachePath, 'utf-8');
    return JSON.parse(cache).filter((post: Post) => post.section === 'All');
  }
  return [];
}

export function getVBCSectionPostsPostsFromCache(): Post[] {
  const cachePath = path.join(process.cwd(), 'posts-cache.json');
  if (fs.existsSync(cachePath)) {
    const cache = fs.readFileSync(cachePath, 'utf-8');
    return JSON.parse(cache).filter((post: Post) => post.section === 'VBC');
  }
  return [];
}

export function getPhotosFromCache(): Post[] {
  const cachePath = path.join(process.cwd(), 'photos-cache.json');
  if (fs.existsSync(cachePath)) {
    const cache = fs.readFileSync(cachePath, 'utf-8');
    return JSON.parse(cache);
  }
  return [];
}

export const fetchPublishedPosts = async (notion: Client, databaseID: string) => {
  // This function is now intended to be used only by the caching script.
  const posts = await notion.dataSources.query({
    data_source_id: databaseID!,
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
      auth: process.env.NOTION_TOKEN,
      notionVersion: '2022-06-28',
    });
    const n2m = new NotionToMarkdown({ notionClient: notion });

    n2m.setCustomTransformer('image', async (block) => {
      const { image } = block as ImageBlockObjectResponse;
      const src = image.type === 'external' ? image.external.url : image.file.url;
      const filename = getFilename(src);

      if (true) {
        downloadImage(src);
      }

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

    const titleText =
      title.type === 'title' && title.title[0]?.plain_text ? title.title[0].plain_text : undefined;

    if (!titleText) {
      throw new Error(`Add a title for ${pageId}`);
    }

    const slugText =
      slug.type === 'rich_text' && slug.rich_text[0]?.plain_text
        ? slug.rich_text[0]?.plain_text
        : 'no-slug';

    if (!slugText) {
      throw new Error(`Add a slug for ${titleText}`);
    }

    const coverImage =
      imageName?.type === 'rich_text' && imageName.rich_text && imageName.rich_text[0]
        ? imageName.rich_text[0].plain_text
        : undefined;

    if (!coverImage) {
      throw new Error(`Add a cover image for ${titleText}`);
    }

    const sectionText =
      section?.type === 'select' && section.select ? section.select.name : undefined;

    const excerptText =
      excerpt.type === 'rich_text' && excerpt.rich_text[0]?.plain_text
        ? excerpt.rich_text[0]?.plain_text
        : undefined;

    if (!excerptText) {
      throw new Error(`Add excerpt text for ${titleText}`);
    }

    const dateText = date.type === 'date' && date.date?.start ? date.date?.start : undefined;

    if (!dateText) {
      throw new Error(`Add a date for ${titleText}`);
    }

    const post: Post = {
      id: page.id,
      title: titleText,
      slug: slugText,
      excerpt: excerptText,
      coverImage,
      date: dateText,
      content: contentString,
      section: sectionText,
      author: 'Brennan Moore',
    };

    return post;
  } catch (error) {
    console.error('Error getting post:', error);
    return null;
  }
}
