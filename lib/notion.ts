import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getDatabase = async (databaseId: string) => {
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  return response.results;
};

export const getPage = async (pageId: string) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
};

export const getPageBySlug = async (slug: string, databaseId: string) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    page_size: 1,
    filter: {
      property: 'Slug',
      text: {
        equals: slug,
      },
    },
    sorts: [{ timestamp: 'last_edited_time', direction: 'ascending' }],
  });
  return response.results[0];
};

export const getBlocks = async (blockId: string) => {
  const response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 150,
  });
  return response.results;
};
