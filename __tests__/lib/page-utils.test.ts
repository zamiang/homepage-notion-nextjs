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
  });
});
