import { GET } from '@/app/feed.json/route';
import { Post } from '@/lib/notion';
import fs from 'fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

// Mock fs module
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  },
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

vi.mock('path', () => ({
  default: {
    join: vi.fn((...args: string[]) => args.join('/')),
  },
  join: vi.fn((...args: string[]) => args.join('/')),
}));

describe('JSON Feed Route', () => {
  const mockPosts: Post[] = [
    {
      id: '1',
      title: 'Test Post 1',
      slug: 'test-post-1',
      coverImage: 'cover1.jpg',
      date: '2023-06-15',
      excerpt: 'This is the first test post excerpt.',
      content: 'Content of test post 1',
      author: 'Brennan Moore',
      section: 'All',
    },
    {
      id: '2',
      title: 'Test Post 2',
      slug: 'test-post-2',
      coverImage: 'cover2.jpg',
      date: '2023-06-10',
      excerpt: 'This is the second test post excerpt.',
      content: 'Content of test post 2',
      author: 'Brennan Moore',
      section: 'All',
    },
    {
      id: '3',
      title: 'VBC Post',
      slug: 'vbc-post',
      coverImage: 'cover3.jpg',
      date: '2023-06-05',
      excerpt: 'VBC section post.',
      content: 'VBC content',
      author: 'Brennan Moore',
      section: 'VBC',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return valid JSON Feed 1.1 structure', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json.version).toBe('https://jsonfeed.org/version/1.1');
    expect(json.title).toBeDefined();
    expect(json.home_page_url).toBeDefined();
    expect(json.feed_url).toBeDefined();
    expect(json.items).toBeInstanceOf(Array);
  });

  it('should include required top-level fields', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json).toHaveProperty('version');
    expect(json).toHaveProperty('title');
    expect(json).toHaveProperty('home_page_url');
    expect(json).toHaveProperty('feed_url');
    expect(json).toHaveProperty('items');
    expect(json).toHaveProperty('description');
    expect(json).toHaveProperty('authors');
    expect(json).toHaveProperty('language');
  });

  it('should only include "All" section posts', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    // Should only have 2 posts (excluding VBC)
    expect(json.items).toHaveLength(2);
    expect(json.items.every((item: { tags?: string[] }) =>
      !item.tags || item.tags.includes('All')
    )).toBe(true);
  });

  it('should properly format post URLs', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json.items[0].url).toContain('/writing/test-post-1');
    expect(json.items[0].id).toContain('/writing/test-post-1');
    expect(json.items[0].url).toMatch(/^https?:\/\//);
  });

  it('should include ISO 8601 date format', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json.items[0].date_published).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    // Verify it's a valid ISO 8601 date
    expect(() => new Date(json.items[0].date_published)).not.toThrow();
  });

  it('should include post excerpt as summary', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json.items[0].summary).toBe('This is the first test post excerpt.');
    expect(json.items[1].summary).toBe('This is the second test post excerpt.');
  });

  it('should include full content as content_html', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json.items[0].content_html).toBe('Content of test post 1');
    expect(json.items[1].content_html).toBe('Content of test post 2');
  });

  it('should include author information', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json.items[0].authors).toHaveLength(1);
    expect(json.items[0].authors[0].name).toBe('Brennan Moore');
    expect(json.authors).toHaveLength(1);
    expect(json.authors[0].name).toBe('Brennan Moore');
  });

  it('should set correct Content-Type header', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();

    expect(response.headers.get('Content-Type')).toBe(
      'application/feed+json; charset=utf-8'
    );
  });

  it('should set cache control headers', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();

    expect(response.headers.get('Cache-Control')).toBe(
      'public, max-age=3600, stale-while-revalidate=86400'
    );
  });

  it('should handle empty posts cache', async () => {
    (fs.existsSync as Mock).mockReturnValue(false);

    const response = await GET();
    const json = await response.json();

    expect(json.items).toHaveLength(0);
    expect(json.version).toBe('https://jsonfeed.org/version/1.1');
  });

  it('should include section as tags', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json.items[0].tags).toEqual(['All']);
  });

  it('should include word count as custom extension', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json.items[0]._word_count).toBeGreaterThan(0);
    expect(typeof json.items[0]._word_count).toBe('number');
  });

  it('should handle posts without content gracefully', async () => {
    const postsWithoutContent = [
      { ...mockPosts[0], content: '' },
    ];

    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(postsWithoutContent));

    const response = await GET();
    const json = await response.json();

    expect(json.items[0]._word_count).toBe(0);
    expect(json.items[0].content_html).toBe('');
  });

  it('should include image URLs with full domain', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json.items[0].image).toMatch(/^https?:\/\//);
    expect(json.items[0].image).toContain('/images/cover1.jpg');
  });

  it('should include feed_url pointing to itself', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readFileSync as Mock).mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const json = await response.json();

    expect(json.feed_url).toContain('/feed.json');
    expect(json.feed_url).toMatch(/^https?:\/\//);
  });
});
