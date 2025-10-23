import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('site configuration', () => {
    it('should use default base URL when NEXT_PUBLIC_BASE_URL is not set', async () => {
      delete process.env.NEXT_PUBLIC_BASE_URL;
      const { config } = await import('@/lib/config');
      expect(config.site.url).toBe('https://www.zamiang.com');
    });

    it('should use environment variable when NEXT_PUBLIC_BASE_URL is set', async () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com';
      const { config } = await import('@/lib/config');
      expect(config.site.url).toBe('https://example.com');
    });

    it('should have correct site metadata', async () => {
      const { config } = await import('@/lib/config');
      expect(config.site.title).toBe('Brennan Moore - Blog');
      expect(config.site.description).toBe('Writing and photos by Brennan Moore');
      expect(config.site.author).toBe('Brennan Moore');
    });
  });

  describe('notion configuration', () => {
    it('should allow empty Notion token when not required', async () => {
      delete process.env.NOTION_TOKEN;
      const { config } = await import('@/lib/config');
      expect(config.notion.token).toBe('');
    });

    it('should use environment variables when set', async () => {
      process.env.NOTION_TOKEN = 'test-token';
      process.env.NOTION_DATA_SOURCE_ID = 'test-db-id';
      process.env.NOTION_PHOTOS_DATA_SOURCE_ID = 'test-photos-id';

      const { config } = await import('@/lib/config');
      expect(config.notion.token).toBe('test-token');
      expect(config.notion.dataSourceId).toBe('test-db-id');
      expect(config.notion.photosDataSourceId).toBe('test-photos-id');
    });
  });

  describe('cache configuration', () => {
    it('should have correct cache file names', async () => {
      const { config } = await import('@/lib/config');
      expect(config.cache.postsFileName).toBe('posts-cache.json');
      expect(config.cache.photosFileName).toBe('photos-cache.json');
    });
  });

  describe('images configuration', () => {
    it('should have correct image cache TTL', async () => {
      const { config } = await import('@/lib/config');
      expect(config.images.minimumCacheTTL).toBe(2678400);
    });
  });

  describe('validateNotionConfig', () => {
    it('should throw error when NOTION_TOKEN is missing', async () => {
      delete process.env.NOTION_TOKEN;
      process.env.NOTION_DATA_SOURCE_ID = 'test-db-id';
      process.env.NOTION_PHOTOS_DATA_SOURCE_ID = 'test-photos-id';

      const { validateNotionConfig } = await import('@/lib/config');
      expect(() => validateNotionConfig()).toThrow(
        'Missing required environment variable: NOTION_TOKEN',
      );
    });

    it('should throw error when NOTION_DATA_SOURCE_ID is missing', async () => {
      process.env.NOTION_TOKEN = 'test-token';
      delete process.env.NOTION_DATA_SOURCE_ID;
      process.env.NOTION_PHOTOS_DATA_SOURCE_ID = 'test-photos-id';

      const { validateNotionConfig } = await import('@/lib/config');
      expect(() => validateNotionConfig()).toThrow(
        'Missing required environment variable: NOTION_DATA_SOURCE_ID',
      );
    });

    it('should throw error when NOTION_PHOTOS_DATA_SOURCE_ID is missing', async () => {
      process.env.NOTION_TOKEN = 'test-token';
      process.env.NOTION_DATA_SOURCE_ID = 'test-db-id';
      delete process.env.NOTION_PHOTOS_DATA_SOURCE_ID;

      const { validateNotionConfig } = await import('@/lib/config');
      expect(() => validateNotionConfig()).toThrow(
        'Missing required environment variable: NOTION_PHOTOS_DATA_SOURCE_ID',
      );
    });

    it('should not throw error when all required variables are set', async () => {
      process.env.NOTION_TOKEN = 'test-token';
      process.env.NOTION_DATA_SOURCE_ID = 'test-db-id';
      process.env.NOTION_PHOTOS_DATA_SOURCE_ID = 'test-photos-id';

      const { validateNotionConfig } = await import('@/lib/config');
      expect(() => validateNotionConfig()).not.toThrow();
    });
  });
});
