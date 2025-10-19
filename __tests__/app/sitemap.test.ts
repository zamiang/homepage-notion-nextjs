import sitemap from '@/app/sitemap';
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

describe('Sitemap Generation', () => {
  const mockPosts: Post[] = [
    {
      id: '1',
      title: 'Test Post 1',
      slug: 'test-post-1',
      coverImage: 'cover1.jpg',
      date: '2023-06-15',
      excerpt: 'Test excerpt 1',
      content: 'Content 1',
      author: 'Brennan Moore',
      section: 'All',
    },
    {
      id: '2',
      title: 'Test Post 2',
      slug: 'test-post-2',
      coverImage: 'cover2.jpg',
      date: '2023-06-10',
      excerpt: 'Test excerpt 2',
      content: 'Content 2',
      author: 'Brennan Moore',
      section: 'VBC',
    },
  ];

  const mockPhotos: Post[] = [
    {
      id: '3',
      title: 'Photo 1',
      slug: 'photo-1',
      coverImage: 'photo1.jpg',
      date: '2023-05-20',
      excerpt: 'Photo excerpt',
      content: 'Photo content',
      author: 'Brennan Moore',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_BASE_URL = 'https://www.zamiang.com';
  });

  it('should return an array of sitemap entries', () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(mockPosts)) // First call for posts
      .mockReturnValueOnce(JSON.stringify(mockPhotos)); // Second call for photos

    const result = sitemap();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should include the homepage as first entry', () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(mockPosts))
      .mockReturnValueOnce(JSON.stringify(mockPhotos));

    const result = sitemap();

    expect(result[0]).toEqual({
      url: 'https://www.zamiang.com',
      lastModified: expect.any(Date),
      changeFrequency: 'daily',
      priority: 1,
    });
  });

  it('should include all posts in the sitemap', () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(mockPosts))
      .mockReturnValueOnce(JSON.stringify(mockPhotos));

    const result = sitemap();

    const postUrls = result.filter((entry) => entry.url.includes('/writing/'));
    expect(postUrls).toHaveLength(2);

    expect(postUrls[0]).toMatchObject({
      url: 'https://www.zamiang.com/writing/test-post-1',
      lastModified: new Date('2023-06-15'),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    expect(postUrls[1]).toMatchObject({
      url: 'https://www.zamiang.com/writing/test-post-2',
      lastModified: new Date('2023-06-10'),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  it('should include all photos in the sitemap', () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(mockPosts))
      .mockReturnValueOnce(JSON.stringify(mockPhotos));

    const result = sitemap();

    const photoUrls = result.filter((entry) => entry.url.includes('/photos/'));
    expect(photoUrls).toHaveLength(1);

    expect(photoUrls[0]).toMatchObject({
      url: 'https://www.zamiang.com/photos/photo-1',
      lastModified: new Date('2023-05-20'),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  it('should use correct priorities for different page types', () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(mockPosts))
      .mockReturnValueOnce(JSON.stringify(mockPhotos));

    const result = sitemap();

    const homepage = result.find((entry) => entry.url === 'https://www.zamiang.com');
    expect(homepage?.priority).toBe(1);

    const posts = result.filter((entry) => entry.url.includes('/writing/'));
    posts.forEach((post) => {
      expect(post.priority).toBe(0.8);
    });

    const photos = result.filter((entry) => entry.url.includes('/photos/'));
    photos.forEach((photo) => {
      expect(photo.priority).toBe(0.8);
    });
  });

  it('should use correct change frequencies', () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(mockPosts))
      .mockReturnValueOnce(JSON.stringify(mockPhotos));

    const result = sitemap();

    const homepage = result.find((entry) => entry.url === 'https://www.zamiang.com');
    expect(homepage?.changeFrequency).toBe('daily');

    const posts = result.filter((entry) => entry.url.includes('/writing/'));
    posts.forEach((post) => {
      expect(post.changeFrequency).toBe('weekly');
    });

    const photos = result.filter((entry) => entry.url.includes('/photos/'));
    photos.forEach((photo) => {
      expect(photo.changeFrequency).toBe('weekly');
    });
  });

  it('should use fallback URL when NEXT_PUBLIC_BASE_URL is not set', () => {
    delete process.env.NEXT_PUBLIC_BASE_URL;

    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(mockPosts))
      .mockReturnValueOnce(JSON.stringify(mockPhotos));

    const result = sitemap();

    expect(result[0].url).toBe('https://www.zamiang.com');
  });

  it('should handle empty posts cache', () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify([])) // Empty posts
      .mockReturnValueOnce(JSON.stringify(mockPhotos));

    const result = sitemap();

    // Should still have homepage and photos
    expect(result.length).toBe(1 + mockPhotos.length);
    expect(result[0].url).toBe('https://www.zamiang.com');
  });

  it('should handle empty photos cache', () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(mockPosts))
      .mockReturnValueOnce(JSON.stringify([])); // Empty photos

    const result = sitemap();

    // Should still have homepage and posts
    expect(result.length).toBe(1 + mockPosts.length);
    expect(result[0].url).toBe('https://www.zamiang.com');
  });

  it('should handle both caches being empty', () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify([])) // Empty posts
      .mockReturnValueOnce(JSON.stringify([])); // Empty photos

    const result = sitemap();

    // Should only have homepage
    expect(result.length).toBe(1);
    expect(result[0]).toMatchObject({
      url: 'https://www.zamiang.com',
      changeFrequency: 'daily',
      priority: 1,
    });
  });

  it('should use post dates as lastModified for posts', () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(mockPosts))
      .mockReturnValueOnce(JSON.stringify(mockPhotos));

    const result = sitemap();

    const post1 = result.find((entry) => entry.url.includes('test-post-1'));
    expect(post1?.lastModified).toEqual(new Date('2023-06-15'));

    const post2 = result.find((entry) => entry.url.includes('test-post-2'));
    expect(post2?.lastModified).toEqual(new Date('2023-06-10'));
  });

  it('should use photo dates as lastModified for photos', () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(mockPosts))
      .mockReturnValueOnce(JSON.stringify(mockPhotos));

    const result = sitemap();

    const photo = result.find((entry) => entry.url.includes('photo-1'));
    expect(photo?.lastModified).toEqual(new Date('2023-05-20'));
  });

  it('should have correct total count of entries', () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(mockPosts))
      .mockReturnValueOnce(JSON.stringify(mockPhotos));

    const result = sitemap();

    // 1 homepage + 2 posts + 1 photo = 4 total
    expect(result.length).toBe(4);
  });
});
