import { Post } from '@/lib/notion';

// Photo type is the same as Post in this context
export type Photo = Post;

export const createMockPost = (overrides?: Partial<Post>): Post => ({
  id: '1',
  slug: 'test-post',
  title: 'Test Post',
  date: '2023-01-01',
  coverImage: 'test-image.jpg',
  excerpt: 'This is a test post.',
  content: '## Test Post Content',
  author: 'Test Author',
  section: 'All',
  ...overrides,
});

export const createMockPhoto = (overrides?: Partial<Post>): Post => ({
  id: '1',
  slug: 'test-photo',
  title: 'Test Photo',
  date: '2023-01-01',
  coverImage: 'test-image.jpg',
  excerpt: 'This is a test photo.',
  content: '## Test Photo Content',
  author: 'Test Author',
  ...overrides,
});

export const createMockPosts = (count: number = 1): Post[] =>
  Array.from({ length: count }, (_, i) =>
    createMockPost({
      id: `${i + 1}`,
      slug: `test-post`,
      title: `Test Post`,
    }),
  );

export const createMockPhotos = (count: number = 1): Post[] =>
  Array.from({ length: count }, (_, i) =>
    createMockPhoto({
      id: `${i + 1}`,
      slug: `test-photo`,
      title: `Test Photo`,
    }),
  );
