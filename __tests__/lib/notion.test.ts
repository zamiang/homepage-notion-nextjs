// Import after mocking
import {
  Post,
  fetchPublishedPosts,
  getAllSectionPostsFromCache,
  getPhotosFromCache,
  getPost,
  getPostFromNotion,
  getPostsFromCache,
  getVBCSectionPostsPostsFromCache,
  getWordCount,
} from '@/lib/notion';
import { Client } from '@notionhq/client';
import fs from 'fs';
import { NotionToMarkdown } from 'notion-to-md';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

// Mock modules before imports
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    mkdirSync: vi.fn(),
    createWriteStream: vi.fn(),
  },
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
  mkdirSync: vi.fn(),
  createWriteStream: vi.fn(),
}));

vi.mock('path', () => ({
  default: {
    join: vi.fn((...args: string[]) => args.join('/')),
    dirname: vi.fn((path: string) => path.substring(0, path.lastIndexOf('/'))),
  },
  join: vi.fn((...args: string[]) => args.join('/')),
  dirname: vi.fn((path: string) => path.substring(0, path.lastIndexOf('/'))),
}));

vi.mock('@notionhq/client');
vi.mock('notion-to-md');
vi.mock('@/lib/download-image', () => ({
  downloadImage: vi.fn(),
  getFilename: vi.fn((url: string) => url.split('/').pop()),
}));

describe('notion.ts - Unit Tests', () => {
  const mockPost: Post = {
    id: '1',
    title: 'Test Post',
    slug: 'test-post',
    coverImage: 'test-image.jpg',
    date: '2023-01-01',
    excerpt: 'This is a test post.',
    content: 'This is the content of the test post.',
    author: 'Brennan Moore',
    section: 'All',
  };

  const mockPosts: Post[] = [
    mockPost,
    {
      ...mockPost,
      id: '2',
      title: 'VBC Post',
      slug: 'vbc-post',
      section: 'VBC',
    },
    {
      ...mockPost,
      id: '3',
      title: 'Another All Post',
      slug: 'another-all-post',
      section: 'All',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getWordCount', () => {
    it('should count words correctly', () => {
      expect(getWordCount('Hello world')).toBe(2);
      expect(getWordCount('This is a test sentence.')).toBe(5);
      expect(getWordCount('One')).toBe(1);
    });

    it('should handle punctuation and special characters', () => {
      expect(getWordCount('Hello, world!')).toBe(2);
      // "Test-case" is treated as two words when split by non-word characters
      expect(getWordCount('Test-case with hyphen')).toBe(4);
      expect(getWordCount('Multiple   spaces   between   words')).toBe(4);
    });

    it('should handle empty strings', () => {
      expect(getWordCount('')).toBe(0);
      expect(getWordCount('   ')).toBe(0);
    });

    it('should handle strings with only special characters', () => {
      expect(getWordCount('!!!')).toBe(0);
      expect(getWordCount('---')).toBe(0);
    });
  });

  describe('getPostsFromCache', () => {
    it('should return posts from cache when file exists', () => {
      const existsSyncMock = fs.existsSync as Mock;
      const readFileSyncMock = fs.readFileSync as Mock;

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

      const posts = getPostsFromCache();

      expect(existsSyncMock).toHaveBeenCalled();
      expect(readFileSyncMock).toHaveBeenCalled();
      expect(posts).toEqual(mockPosts);
    });

    it('should return empty array when cache file does not exist', () => {
      const existsSyncMock = fs.existsSync as Mock;
      existsSyncMock.mockReturnValue(false);

      const posts = getPostsFromCache();

      expect(posts).toEqual([]);
      expect(fs.readFileSync).not.toHaveBeenCalled();
    });

    it('should handle malformed JSON gracefully', () => {
      const existsSyncMock = fs.existsSync as Mock;
      const readFileSyncMock = fs.readFileSync as Mock;

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue('invalid json');

      expect(() => getPostsFromCache()).toThrow();
    });
  });

  describe('getAllSectionPostsFromCache', () => {
    it('should return only posts with section "All"', () => {
      const existsSyncMock = fs.existsSync as Mock;
      const readFileSyncMock = fs.readFileSync as Mock;

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

      const posts = getAllSectionPostsFromCache();

      expect(posts).toHaveLength(2);
      expect(posts.every((p) => p.section === 'All')).toBe(true);
    });

    it('should return empty array when cache file does not exist', () => {
      const existsSyncMock = fs.existsSync as Mock;
      existsSyncMock.mockReturnValue(false);

      const posts = getAllSectionPostsFromCache();

      expect(posts).toEqual([]);
    });

    it('should handle posts without section property', () => {
      const postsWithoutSection = [
        { ...mockPost, section: undefined },
        { ...mockPost, id: '2', section: 'All' },
      ];

      const existsSyncMock = fs.existsSync as Mock;
      const readFileSyncMock = fs.readFileSync as Mock;

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(postsWithoutSection));

      const posts = getAllSectionPostsFromCache();

      expect(posts).toHaveLength(1);
      expect(posts[0].section).toBe('All');
    });
  });

  describe('getVBCSectionPostsPostsFromCache', () => {
    it('should return only posts with section "VBC"', () => {
      const existsSyncMock = fs.existsSync as Mock;
      const readFileSyncMock = fs.readFileSync as Mock;

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

      const posts = getVBCSectionPostsPostsFromCache();

      expect(posts).toHaveLength(1);
      expect(posts[0].section).toBe('VBC');
    });

    it('should return empty array when no VBC posts exist', () => {
      const allPosts = mockPosts.filter((p) => p.section === 'All');

      const existsSyncMock = fs.existsSync as Mock;
      const readFileSyncMock = fs.readFileSync as Mock;

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(allPosts));

      const posts = getVBCSectionPostsPostsFromCache();

      expect(posts).toEqual([]);
    });
  });

  describe('getPhotosFromCache', () => {
    it('should return photos from cache when file exists', () => {
      const mockPhotos = [mockPost];

      const existsSyncMock = fs.existsSync as Mock;
      const readFileSyncMock = fs.readFileSync as Mock;

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(mockPhotos));

      const photos = getPhotosFromCache();

      expect(existsSyncMock).toHaveBeenCalled();
      expect(readFileSyncMock).toHaveBeenCalled();
      expect(photos).toEqual(mockPhotos);
    });

    it('should return empty array when cache file does not exist', () => {
      const existsSyncMock = fs.existsSync as Mock;
      existsSyncMock.mockReturnValue(false);

      const photos = getPhotosFromCache();

      expect(photos).toEqual([]);
    });
  });

  describe('fetchPublishedPosts', () => {
    it('should fetch published posts from Notion', async () => {
      const mockNotionClient = {
        dataSources: {
          query: vi.fn().mockResolvedValue({
            results: [{ id: '1' }, { id: '2' }],
          }),
        },
      };

      const databaseId = 'test-database-id';
      const posts = await fetchPublishedPosts(mockNotionClient as unknown as Client, databaseId);

      expect(mockNotionClient.dataSources.query).toHaveBeenCalledWith({
        data_source_id: databaseId,
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

      expect(posts).toEqual([{ id: '1' }, { id: '2' }]);
    });

    it('should handle Notion API errors', async () => {
      const mockNotionClient = {
        dataSources: {
          query: vi.fn().mockRejectedValue(new Error('Notion API error')),
        },
      };

      await expect(
        fetchPublishedPosts(mockNotionClient as unknown as Client, 'test-db'),
      ).rejects.toThrow('Notion API error');
    });
  });

  describe('getPost', () => {
    it('should return post by slug', async () => {
      const existsSyncMock = fs.existsSync as Mock;
      const readFileSyncMock = fs.readFileSync as Mock;

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

      const post = await getPost('test-post');

      expect(post).toEqual(mockPost);
    });

    it('should return null when post not found', async () => {
      const existsSyncMock = fs.existsSync as Mock;
      const readFileSyncMock = fs.readFileSync as Mock;

      existsSyncMock.mockReturnValue(true);
      readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

      const post = await getPost('non-existent-slug');

      expect(post).toBeNull();
    });

    it('should return null when cache is empty', async () => {
      const existsSyncMock = fs.existsSync as Mock;
      existsSyncMock.mockReturnValue(false);

      const post = await getPost('test-post');

      expect(post).toBeNull();
    });
  });

  describe('getPostFromNotion', () => {
    const mockPageId = 'test-page-id';
    const mockPageResponse = {
      id: mockPageId,
      properties: {
        Title: {
          type: 'title',
          title: [{ plain_text: 'Test Title' }],
        },
        Slug: {
          type: 'rich_text',
          rich_text: [{ plain_text: 'test-slug' }],
        },
        'Image Name': {
          type: 'rich_text',
          rich_text: [{ plain_text: 'test-image.jpg' }],
        },
        Excerpt: {
          type: 'rich_text',
          rich_text: [{ plain_text: 'Test excerpt' }],
        },
        'Published Date': {
          type: 'date',
          date: { start: '2023-01-01' },
        },
        Section: {
          type: 'select',
          select: { name: 'All' },
        },
      },
    };

    beforeEach(() => {
      process.env.NOTION_TOKEN = 'test-token';
    });

    it('should fetch and transform a post from Notion', async () => {
      const mockNotionClient = {
        pages: {
          retrieve: vi.fn().mockResolvedValue(mockPageResponse),
        },
      };

      const mockN2M = {
        setCustomTransformer: vi.fn(),
        pageToMarkdown: vi.fn().mockResolvedValue([]),
        toMarkdownString: vi.fn().mockReturnValue({
          parent: 'Test content',
        }),
      };

      vi.mocked(Client).mockImplementation(() => mockNotionClient as any);
      vi.mocked(NotionToMarkdown).mockImplementation(() => mockN2M as any);

      const post = await getPostFromNotion(mockPageId);

      expect(post).toEqual({
        id: mockPageId,
        title: 'Test Title',
        slug: 'test-slug',
        excerpt: 'Test excerpt',
        coverImage: 'test-image.jpg',
        date: '2023-01-01',
        content: 'Test content',
        section: 'All',
        author: 'Brennan Moore',
      });

      expect(mockN2M.setCustomTransformer).toHaveBeenCalledWith('image', expect.any(Function));
      expect(mockN2M.setCustomTransformer).toHaveBeenCalledWith(
        'column_list',
        expect.any(Function),
      );
    });

    it('should handle missing title', async () => {
      const invalidPageResponse = {
        ...mockPageResponse,
        properties: {
          ...mockPageResponse.properties,
          Title: {
            type: 'title',
            title: [],
          },
        },
      };

      const mockNotionClient = {
        pages: {
          retrieve: vi.fn().mockResolvedValue(invalidPageResponse),
        },
      };

      vi.mocked(Client).mockImplementation(() => mockNotionClient as any);
      vi.mocked(NotionToMarkdown).mockImplementation(
        () =>
          ({
            setCustomTransformer: vi.fn(),
            pageToMarkdown: vi.fn().mockResolvedValue([]),
            toMarkdownString: vi.fn().mockReturnValue({ parent: '' }),
          }) as any,
      );

      const post = await getPostFromNotion(mockPageId);

      expect(post).toBeNull();
    });

    it('should use default slug when missing', async () => {
      const invalidPageResponse = {
        ...mockPageResponse,
        properties: {
          ...mockPageResponse.properties,
          Slug: {
            type: 'rich_text',
            rich_text: [],
          },
        },
      };

      const mockNotionClient = {
        pages: {
          retrieve: vi.fn().mockResolvedValue(invalidPageResponse),
        },
      };

      vi.mocked(Client).mockImplementation(() => mockNotionClient as any);
      vi.mocked(NotionToMarkdown).mockImplementation(
        () =>
          ({
            setCustomTransformer: vi.fn(),
            pageToMarkdown: vi.fn().mockResolvedValue([]),
            toMarkdownString: vi.fn().mockReturnValue({ parent: '' }),
          }) as any,
      );

      const post = await getPostFromNotion(mockPageId);

      // The function uses 'no-slug' as default but still validates it exists
      expect(post).not.toBeNull();
      if (post) {
        expect(post.slug).toBe('no-slug');
      }
    });

    it('should handle API errors gracefully', async () => {
      const mockNotionClient = {
        pages: {
          retrieve: vi.fn().mockRejectedValue(new Error('API Error')),
        },
      };

      vi.mocked(Client).mockImplementation(() => mockNotionClient as any);

      const post = await getPostFromNotion(mockPageId);

      expect(post).toBeNull();
    });

    it('should handle missing cover image', async () => {
      const invalidPageResponse = {
        ...mockPageResponse,
        properties: {
          ...mockPageResponse.properties,
          'Image Name': {
            type: 'rich_text',
            rich_text: [],
          },
        },
      };

      const mockNotionClient = {
        pages: {
          retrieve: vi.fn().mockResolvedValue(invalidPageResponse),
        },
      };

      vi.mocked(Client).mockImplementation(() => mockNotionClient as any);
      vi.mocked(NotionToMarkdown).mockImplementation(
        () =>
          ({
            setCustomTransformer: vi.fn(),
            pageToMarkdown: vi.fn().mockResolvedValue([]),
            toMarkdownString: vi.fn().mockReturnValue({ parent: '' }),
          }) as any,
      );

      const post = await getPostFromNotion(mockPageId);

      expect(post).toBeNull();
    });

    it('should handle missing excerpt', async () => {
      const invalidPageResponse = {
        ...mockPageResponse,
        properties: {
          ...mockPageResponse.properties,
          Excerpt: {
            type: 'rich_text',
            rich_text: [],
          },
        },
      };

      const mockNotionClient = {
        pages: {
          retrieve: vi.fn().mockResolvedValue(invalidPageResponse),
        },
      };

      vi.mocked(Client).mockImplementation(() => mockNotionClient as any);
      vi.mocked(NotionToMarkdown).mockImplementation(
        () =>
          ({
            setCustomTransformer: vi.fn(),
            pageToMarkdown: vi.fn().mockResolvedValue([]),
            toMarkdownString: vi.fn().mockReturnValue({ parent: '' }),
          }) as any,
      );

      const post = await getPostFromNotion(mockPageId);

      expect(post).toBeNull();
    });

    it('should handle missing date', async () => {
      const invalidPageResponse = {
        ...mockPageResponse,
        properties: {
          ...mockPageResponse.properties,
          'Published Date': {
            type: 'date',
            date: null,
          },
        },
      };

      const mockNotionClient = {
        pages: {
          retrieve: vi.fn().mockResolvedValue(invalidPageResponse),
        },
      };

      vi.mocked(Client).mockImplementation(() => mockNotionClient as any);
      vi.mocked(NotionToMarkdown).mockImplementation(
        () =>
          ({
            setCustomTransformer: vi.fn(),
            pageToMarkdown: vi.fn().mockResolvedValue([]),
            toMarkdownString: vi.fn().mockReturnValue({ parent: '' }),
          }) as any,
      );

      const post = await getPostFromNotion(mockPageId);

      expect(post).toBeNull();
    });
  });
});
