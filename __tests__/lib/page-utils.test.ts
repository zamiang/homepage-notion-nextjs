import { Post } from '@/lib/notion';
import { generateJsonLd } from '@/lib/page-utils';

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Test Post 1',
    slug: 'test-post-1',
    coverImage: 'cover1.jpg',
    date: '2023-01-01',
    excerpt: 'This is a test post.',
    content: 'This is the content of the test post.',
    author: 'Test Author',
    section: 'All',
  },
  {
    id: '2',
    title: 'Test Post 2',
    slug: 'test-post-2',
    coverImage: 'cover2.jpg',
    date: '2023-01-02',
    excerpt: 'This is another test post.',
    content: 'This is the content of another test post.',
    author: 'Test Author',
    section: 'VBC',
  },
];

describe('page-utils', () => {
  describe('generateJsonLd', () => {
    it('should generate correct JSON-LD for a writing post', () => {
      const jsonLd = generateJsonLd(mockPosts[0], 'writing');
      expect(jsonLd.headline).toBe('Test Post 1');
      expect(jsonLd.mainEntityOfPage['@id']).toBe('https://www.zamiang.com/writing/test-post-1');
    });

    it('should generate correct JSON-LD for a photos post', () => {
      const jsonLd = generateJsonLd(mockPosts[0], 'photos');
      expect(jsonLd.headline).toBe('Test Post 1');
      expect(jsonLd.mainEntityOfPage['@id']).toBe('https://www.zamiang.com/photos/test-post-1');
    });

    it('should generate BlogPosting type for writing posts', () => {
      const jsonLd = generateJsonLd(mockPosts[0], 'writing');
      expect(jsonLd['@type']).toBe('BlogPosting');
    });

    it('should generate Photograph type for photo posts', () => {
      const jsonLd = generateJsonLd(mockPosts[0], 'photos');
      expect(jsonLd['@type']).toBe('Photograph');
    });

    it('should include wordCount for writing posts', () => {
      const jsonLd = generateJsonLd(mockPosts[0], 'writing') as any;
      expect(jsonLd.wordCount).toBeGreaterThan(0);
      expect(typeof jsonLd.wordCount).toBe('number');
    });

    it('should include articleSection for VBC posts', () => {
      const jsonLd = generateJsonLd(mockPosts[1], 'writing') as any;
      expect(jsonLd.articleSection).toBe('Value-Based Care');
    });

    it('should include keywords based on section', () => {
      const jsonLd = generateJsonLd(mockPosts[0], 'writing') as any;
      expect(jsonLd.keywords).toEqual(['All']);
    });

    it('should include enhanced image object', () => {
      const jsonLd = generateJsonLd(mockPosts[0], 'writing');
      expect(jsonLd.image['@type']).toBe('ImageObject');
      expect(jsonLd.image.url).toContain('/images/cover1.jpg');
      expect(jsonLd.image.caption).toBe('Test Post 1');
    });

    it('should include author URL', () => {
      const jsonLd = generateJsonLd(mockPosts[0], 'writing');
      expect(jsonLd.author.url).toBe('https://www.zamiang.com');
    });

    it('should include publisher URL', () => {
      const jsonLd = generateJsonLd(mockPosts[0], 'writing');
      expect(jsonLd.publisher.url).toBe('https://www.zamiang.com');
    });

    it('should throw error for invalid dates', () => {
      const invalidPost = { ...mockPosts[0], date: 'invalid-date' };
      expect(() => generateJsonLd(invalidPost, 'writing')).toThrow(
        'Invalid date format for post: 1',
      );
    });

    it('should handle posts without content', () => {
      const postWithoutContent = { ...mockPosts[0], content: '' };
      const jsonLd = generateJsonLd(postWithoutContent, 'writing') as any;
      // Should not have wordCount if no content
      expect(jsonLd.wordCount).toBeUndefined();
    });

    it('should handle posts without section', () => {
      const postWithoutSection = { ...mockPosts[0], section: undefined };
      const jsonLd = generateJsonLd(postWithoutSection, 'writing') as any;
      expect(jsonLd.keywords).toBeUndefined();
      expect(jsonLd.articleSection).toBeUndefined();
    });

    it('should include absolute image URLs', () => {
      const jsonLd = generateJsonLd(mockPosts[0], 'writing');
      expect(jsonLd.image.url).toMatch(/^https?:\/\//);
    });

    it('should include dateModified', () => {
      const jsonLd = generateJsonLd(mockPosts[0], 'writing');
      expect(jsonLd.dateModified).toBeDefined();
      expect(jsonLd.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should use actual dateModified when present', () => {
      const postWithDateModified = {
        ...mockPosts[0],
        dateModified: '2024-06-15T10:30:00.000Z',
      };
      const jsonLd = generateJsonLd(postWithDateModified, 'writing');
      expect(jsonLd.dateModified).toBe('2024-06-15T10:30:00.000Z');
    });

    it('should fall back to date when dateModified is not present', () => {
      const postWithoutDateModified = { ...mockPosts[0] };
      delete (postWithoutDateModified as any).dateModified;
      const jsonLd = generateJsonLd(postWithoutDateModified, 'writing');
      expect(jsonLd.dateModified).toBe(new Date(mockPosts[0].date).toISOString());
    });
  });
});
