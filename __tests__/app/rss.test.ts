import { GET } from '@/app/rss.xml/route';
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

describe('RSS Feed Route', () => {
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
      date: '2023-06-01',
      excerpt: 'This is a VBC post.',
      content: 'Content of VBC post',
      author: 'Brennan Moore',
      section: 'VBC',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    process.env.NEXT_PUBLIC_BASE_URL = 'https://www.zamiang.com';
  });

  it('should return RSS XML with correct content-type header', async () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();

    expect(response.headers.get('content-type')).toBe('application/xml');
  });

  it('should return valid RSS 2.0 XML structure', async () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const xml = await response.text();

    // Check for RSS 2.0 structure
    expect(xml).toContain('<?xml version="1.0" ?>');
    expect(xml).toContain('<rss');
    expect(xml).toContain('version="2.0"');
    expect(xml).toContain('<channel>');
    expect(xml).toContain('</channel>');
    expect(xml).toContain('</rss>');
  });

  it('should include required RSS channel elements', async () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain('<title><![CDATA[Articles by Brennan Moore]]></title>');
    expect(xml).toContain('<link>https://www.zamiang.com</link>');
    expect(xml).toContain('<description>');
    expect(xml).toContain('<language>en</language>');
    expect(xml).toContain('<lastBuildDate>');
  });

  it('should include atom:link for self-reference', async () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    expect(xml).toContain(
      '<atom:link href="https://www.zamiang.com/rss.xml" rel="self" type="application/rss+xml"',
    );
  });

  it('should include all posts regardless of section', async () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const xml = await response.text();

    // Should include all posts (both "All" and "VBC" sections)
    expect(xml).toContain('<title><![CDATA[Test Post 1]]></title>');
    expect(xml).toContain('<title><![CDATA[Test Post 2]]></title>');
    expect(xml).toContain('<title><![CDATA[VBC Post]]></title>');
    expect(xml).toContain('https://www.zamiang.com/writing/test-post-1');
    expect(xml).toContain('https://www.zamiang.com/writing/test-post-2');
    expect(xml).toContain('https://www.zamiang.com/writing/vbc-post');
  });

  it('should include post excerpts in descriptions', async () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain('<![CDATA[This is the first test post excerpt.]]>');
    expect(xml).toContain('<![CDATA[This is the second test post excerpt.]]>');
  });

  it('should include pubDate for each item', async () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain('<pubDate>');
    // Should contain UTC formatted dates
    expect(xml).toMatch(/<pubDate>.*GMT<\/pubDate>/);
  });

  it('should include guid for each item', async () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain('<guid isPermaLink="false">');
    expect(xml).toContain('https://www.zamiang.com/writing/test-post-1</guid>');
  });

  it('should set lastBuildDate to the latest post date', async () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const xml = await response.text();

    // The latest post is from 2023-06-15
    const latestDate = new Date('2023-06-15').toUTCString();
    expect(xml).toContain(`<lastBuildDate>${latestDate}</lastBuildDate>`);
  });

  it('should handle empty posts cache', async () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify([]));

    const response = await GET();
    const xml = await response.text();

    // Should still have valid RSS structure
    expect(xml).toContain('<channel>');
    expect(xml).toContain('</channel>');
    // But no items
    expect(xml).not.toContain('<item>');
  });

  it('should properly escape special characters in CDATA', async () => {
    const postsWithSpecialChars: Post[] = [
      {
        id: '1',
        title: 'Test & Special <Characters>',
        slug: 'test-special',
        coverImage: 'cover.jpg',
        date: '2023-06-15',
        excerpt: 'Excerpt with "quotes" and <tags>',
        content: 'Content',
        author: 'Brennan Moore',
        section: 'All',
      },
    ];

    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify(postsWithSpecialChars));

    const response = await GET();
    const xml = await response.text();

    // CDATA should contain the raw content
    expect(xml).toContain('<![CDATA[Test & Special <Characters>]]>');
    expect(xml).toContain('<![CDATA[Excerpt with "quotes" and <tags>]]>');
  });

  it('should use fallback URL when NEXT_PUBLIC_BASE_URL is not set', async () => {
    delete process.env.NEXT_PUBLIC_BASE_URL;

    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain('https://www.zamiang.com');
  });

  it('should include posts from both "All" and "VBC" sections', async () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const xml = await response.text();

    // Should include VBC post as well as "All" posts
    expect(xml).toContain('<title><![CDATA[VBC Post]]></title>');
    expect(xml).toContain('https://www.zamiang.com/writing/vbc-post');
    expect(xml).toContain('<title><![CDATA[Test Post 1]]></title>');
    expect(xml).toContain('<title><![CDATA[Test Post 2]]></title>');
  });

  it('should include dc:creator with author name', async () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain('<dc:creator><![CDATA[Brennan Moore]]></dc:creator>');
  });

  it('should include content:encoded with full content', async () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain('<content:encoded><![CDATA[Content of test post 1]]></content:encoded>');
    expect(xml).toContain('<content:encoded><![CDATA[Content of test post 2]]></content:encoded>');
    expect(xml).toContain('<content:encoded><![CDATA[Content of VBC post]]></content:encoded>');
  });

  it('should include category tags for section and type', async () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const xml = await response.text();

    // Section categories
    expect(xml).toContain('<category><![CDATA[All]]></category>');
    expect(xml).toContain('<category><![CDATA[Value-Based Care]]></category>');

    // Type categories
    expect(xml).toContain('<category><![CDATA[Writing]]></category>');
  });

  it('should include enclosure for posts with cover images', async () => {
    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify(mockPosts));

    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain('<enclosure url="https://www.zamiang.com/images/cover1.jpg" type="image/jpeg" length="0"/>');
    expect(xml).toContain('<enclosure url="https://www.zamiang.com/images/cover2.jpg" type="image/jpeg" length="0"/>');
  });

  it('should use correct MIME type for different image extensions', async () => {
    const postsWithDifferentImages: Post[] = [
      {
        id: '1',
        title: 'PNG Image Post',
        slug: 'png-post',
        coverImage: 'cover.png',
        date: '2023-06-15',
        excerpt: 'PNG excerpt',
        content: 'Content',
        author: 'Brennan Moore',
        section: 'All',
      },
      {
        id: '2',
        title: 'WebP Image Post',
        slug: 'webp-post',
        coverImage: 'cover.webp',
        date: '2023-06-14',
        excerpt: 'WebP excerpt',
        content: 'Content',
        author: 'Brennan Moore',
        section: 'All',
      },
    ];

    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify(postsWithDifferentImages));

    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain('type="image/png"');
    expect(xml).toContain('type="image/webp"');
  });

  it('should not include enclosure for posts without cover image', async () => {
    const postsWithoutCover: Post[] = [
      {
        id: '1',
        title: 'No Cover Post',
        slug: 'no-cover',
        coverImage: '',
        date: '2023-06-15',
        excerpt: 'No cover excerpt',
        content: 'Content',
        author: 'Brennan Moore',
        section: 'All',
      },
    ];

    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify(postsWithoutCover));

    const response = await GET();
    const xml = await response.text();

    // Should have item but no enclosure
    expect(xml).toContain('<item>');
    expect(xml).not.toContain('<enclosure');
  });

  it('should include Photography category for photo items', async () => {
    const mockPhotos: Post[] = [
      {
        id: '1',
        title: 'Test Photo',
        slug: 'test-photo',
        coverImage: 'photo.jpg',
        date: '2023-06-15',
        excerpt: 'Photo excerpt',
        content: 'Photo content',
        author: 'Brennan Moore',
      },
    ];

    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    // Mock returns photos on both calls (posts and photos cache)
    readFileSyncMock
      .mockReturnValueOnce(JSON.stringify([]))
      .mockReturnValueOnce(JSON.stringify(mockPhotos));

    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain('<category><![CDATA[Photography]]></category>');
    expect(xml).toContain('https://www.zamiang.com/photos/test-photo');
  });

  it('should handle posts with default author when author is missing', async () => {
    const postsWithoutAuthor: Post[] = [
      {
        id: '1',
        title: 'No Author Post',
        slug: 'no-author',
        coverImage: 'cover.jpg',
        date: '2023-06-15',
        excerpt: 'Excerpt',
        content: 'Content',
        author: '', // Empty author
        section: 'All',
      },
    ];

    const existsSyncMock = fs.existsSync as Mock;
    const readFileSyncMock = fs.readFileSync as Mock;

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockReturnValue(JSON.stringify(postsWithoutAuthor));

    const response = await GET();
    const xml = await response.text();

    // Should default to "Brennan Moore"
    expect(xml).toContain('<dc:creator><![CDATA[Brennan Moore]]></dc:creator>');
  });
});
