import { Post } from '@/lib/notion';
import { generateJsonLd, generatePostMetadata, generatePostStaticParams } from '@/lib/page-utils';

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

const getMockPosts = () => mockPosts;

describe('page-utils', () => {
  describe('generatePostMetadata', () => {
    it('should generate correct metadata for a writing post', async () => {
      const metadata = await generatePostMetadata(getMockPosts, 'writing', 'test-post-1');
      expect(metadata.title).toBe('Test Post 1');
      expect(metadata.description).toBe('This is a test post.');
      expect(metadata.alternates?.canonical).toBe('https://www.zamiang.com/writing/test-post-1');
    });

    it('should generate correct metadata for a photos post', async () => {
      const metadata = await generatePostMetadata(getMockPosts, 'photos', 'test-post-1');
      expect(metadata.title).toBe('Test Post 1');
      expect(metadata.description).toBe('This is a test post.');
      expect(metadata.alternates?.canonical).toBe('https://www.zamiang.com/photos/test-post-1');
    });

    it('should handle post not found', async () => {
      const metadata = await generatePostMetadata(getMockPosts, 'writing', 'not-found');
      expect(metadata.title).toBe('Post Not Found');
    });
  });

  describe('generatePostStaticParams', () => {
    it('should generate correct static params', () => {
      const params = generatePostStaticParams(getMockPosts);
      expect(params).toEqual([{ slug: 'test-post-1' }, { slug: 'test-post-2' }]);
    });
  });

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
        'Invalid date format for post: 1'
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
  });
});
