import { Client } from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const getItemsFromDatabase = async (databaseId: string) => {
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  return response.results;
};

export const getPageById = async (pageId: string) => {
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
  let blockResponse = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 50,
  });
  let blocks = blockResponse.results;

  while (blockResponse.has_more && blockResponse.next_cursor) {
    blockResponse = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 50,
      start_cursor: blockResponse.next_cursor,
    });

    const results = blockResponse.results;
    blocks = blocks.concat(results);
  }

  return blocks;
};
