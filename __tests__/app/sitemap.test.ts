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

  it('should include all posts in the sitemap with appropriate priorities', () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(mockPosts))
      .mockReturnValueOnce(JSON.stringify(mockPhotos));

    const result = sitemap();

    const postUrls = result.filter((entry) => entry.url.includes('/writing/'));
    expect(postUrls).toHaveLength(2);

    // First post is old (>12 months), section "All" -> priority 0.6, changeFrequency 'never'
    expect(postUrls[0]).toMatchObject({
      url: 'https://www.zamiang.com/writing/test-post-1',
      lastModified: new Date('2023-06-15'),
      changeFrequency: 'never',
      priority: 0.6,
    });

    // Second post is VBC section -> priority 0.9 (VBC takes precedence), changeFrequency 'never' (old)
    expect(postUrls[1]).toMatchObject({
      url: 'https://www.zamiang.com/writing/test-post-2',
      lastModified: new Date('2023-06-10'),
      changeFrequency: 'never',
      priority: 0.9,
    });
  });

  it('should include all photos in the sitemap with priority 0.7', () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(mockPosts))
      .mockReturnValueOnce(JSON.stringify(mockPhotos));

    const result = sitemap();

    const photoUrls = result.filter((entry) => entry.url.includes('/photos/'));
    expect(photoUrls).toHaveLength(1);

    // Old photo (>12 months) -> changeFrequency 'never'
    expect(photoUrls[0]).toMatchObject({
      url: 'https://www.zamiang.com/photos/photo-1',
      lastModified: new Date('2023-05-20'),
      changeFrequency: 'never',
      priority: 0.7,
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

    // VBC post should have priority 0.9
    const vbcPost = result.find((entry) => entry.url.includes('test-post-2'));
    expect(vbcPost?.priority).toBe(0.9);

    // Old "All" section post should have priority 0.6
    const oldPost = result.find((entry) => entry.url.includes('test-post-1'));
    expect(oldPost?.priority).toBe(0.6);

    // Photos should have priority 0.7
    const photos = result.filter((entry) => entry.url.includes('/photos/'));
    photos.forEach((photo) => {
      expect(photo.priority).toBe(0.7);
    });
  });

  it('should use correct change frequencies based on post age', () => {
    // Create posts with different ages to test changeFrequency logic
    const now = new Date();

    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const nineMonthsAgo = new Date(now);
    nineMonthsAgo.setMonth(nineMonthsAgo.getMonth() - 9);

    const eighteenMonthsAgo = new Date(now);
    eighteenMonthsAgo.setMonth(eighteenMonthsAgo.getMonth() - 18);

    const postsWithDifferentAges: Post[] = [
      {
        id: '1',
        title: 'Recent Post',
        slug: 'recent-post',
        coverImage: 'cover.jpg',
        date: threeMonthsAgo.toISOString(),
        excerpt: 'Recent',
        content: 'Content',
        author: 'Brennan Moore',
        section: 'All',
      },
      {
        id: '2',
        title: 'Medium Age Post',
        slug: 'medium-post',
        coverImage: 'cover.jpg',
        date: nineMonthsAgo.toISOString(),
        excerpt: 'Medium',
        content: 'Content',
        author: 'Brennan Moore',
        section: 'All',
      },
      {
        id: '3',
        title: 'Old Post',
        slug: 'old-post',
        coverImage: 'cover.jpg',
        date: eighteenMonthsAgo.toISOString(),
        excerpt: 'Old',
        content: 'Content',
        author: 'Brennan Moore',
        section: 'All',
      },
    ];

    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(postsWithDifferentAges))
      .mockReturnValueOnce(JSON.stringify([]));

    const result = sitemap();

    const homepage = result.find((entry) => entry.url === 'https://www.zamiang.com');
    expect(homepage?.changeFrequency).toBe('daily');

    // Recent post (< 6 months) -> weekly
    const recentPost = result.find((entry) => entry.url.includes('recent-post'));
    expect(recentPost?.changeFrequency).toBe('weekly');

    // Medium age post (6-12 months) -> monthly
    const mediumPost = result.find((entry) => entry.url.includes('medium-post'));
    expect(mediumPost?.changeFrequency).toBe('monthly');

    // Old post (> 12 months) -> never
    const oldPost = result.find((entry) => entry.url.includes('old-post'));
    expect(oldPost?.changeFrequency).toBe('never');
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

  it('should use dateModified when available for lastModified', () => {
    const postsWithDateModified = [
      {
        ...mockPosts[0],
        dateModified: '2024-01-20T10:30:00.000Z',
      },
    ];

    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(postsWithDateModified))
      .mockReturnValueOnce(JSON.stringify([]));

    const result = sitemap();

    const post = result.find((entry) => entry.url.includes('test-post-1'));
    expect(post?.lastModified).toEqual(new Date('2024-01-20T10:30:00.000Z'));
  });

  it('should fall back to date when dateModified is not present', () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(mockPosts))
      .mockReturnValueOnce(JSON.stringify([]));

    const result = sitemap();

    const post = result.find((entry) => entry.url.includes('test-post-1'));
    expect(post?.lastModified).toEqual(new Date('2023-06-15'));
  });

  it('should include images array for posts with cover images', () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(mockPosts))
      .mockReturnValueOnce(JSON.stringify(mockPhotos));

    const result = sitemap();

    const post1 = result.find((entry) => entry.url.includes('test-post-1'));
    expect(post1?.images).toEqual(['https://www.zamiang.com/images/cover1.jpg']);

    const post2 = result.find((entry) => entry.url.includes('test-post-2'));
    expect(post2?.images).toEqual(['https://www.zamiang.com/images/cover2.jpg']);
  });

  it('should include images array for photos', () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(mockPosts))
      .mockReturnValueOnce(JSON.stringify(mockPhotos));

    const result = sitemap();

    const photo = result.find((entry) => entry.url.includes('photo-1'));
    expect(photo?.images).toEqual(['https://www.zamiang.com/images/photo1.jpg']);
  });

  it('should return empty images array for posts without cover image', () => {
    const postsWithoutCover: Post[] = [
      {
        id: '1',
        title: 'Post Without Cover',
        slug: 'no-cover',
        coverImage: '',
        date: '2023-06-15',
        excerpt: 'Excerpt',
        content: 'Content',
        author: 'Brennan Moore',
        section: 'All',
      },
    ];

    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(postsWithoutCover))
      .mockReturnValueOnce(JSON.stringify([]));

    const result = sitemap();

    const post = result.find((entry) => entry.url.includes('no-cover'));
    expect(post?.images).toEqual([]);
  });

  it('should give recent posts (< 6 months old) priority 0.8', () => {
    // Create a post that is 3 months old (recent)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const recentPosts: Post[] = [
      {
        id: '1',
        title: 'Recent Post',
        slug: 'recent-post',
        coverImage: 'cover.jpg',
        date: threeMonthsAgo.toISOString(),
        excerpt: 'Recent excerpt',
        content: 'Content',
        author: 'Brennan Moore',
        section: 'All',
      },
    ];

    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(recentPosts))
      .mockReturnValueOnce(JSON.stringify([]));

    const result = sitemap();

    const recentPost = result.find((entry) => entry.url.includes('recent-post'));
    expect(recentPost?.priority).toBe(0.8);
  });

  it('should give old posts (>= 6 months old) priority 0.6', () => {
    // Create a post that is 8 months old
    const eightMonthsAgo = new Date();
    eightMonthsAgo.setMonth(eightMonthsAgo.getMonth() - 8);

    const oldPosts: Post[] = [
      {
        id: '1',
        title: 'Old Post',
        slug: 'old-post',
        coverImage: 'cover.jpg',
        date: eightMonthsAgo.toISOString(),
        excerpt: 'Old excerpt',
        content: 'Content',
        author: 'Brennan Moore',
        section: 'All',
      },
    ];

    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(oldPosts))
      .mockReturnValueOnce(JSON.stringify([]));

    const result = sitemap();

    const oldPost = result.find((entry) => entry.url.includes('old-post'));
    expect(oldPost?.priority).toBe(0.6);
  });

  it('should give VBC posts priority 0.9 regardless of age', () => {
    // Create an old VBC post
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const vbcPosts: Post[] = [
      {
        id: '1',
        title: 'Old VBC Post',
        slug: 'old-vbc-post',
        coverImage: 'cover.jpg',
        date: oneYearAgo.toISOString(),
        excerpt: 'VBC excerpt',
        content: 'Content',
        author: 'Brennan Moore',
        section: 'VBC',
      },
    ];

    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify(vbcPosts))
      .mockReturnValueOnce(JSON.stringify([]));

    const result = sitemap();

    const vbcPost = result.find((entry) => entry.url.includes('old-vbc-post'));
    expect(vbcPost?.priority).toBe(0.9);
  });
});
