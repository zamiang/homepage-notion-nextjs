import * as notion from '@/lib/notion';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import WritingPage from '../src/app/writing/[slug]/page';

// Mock the notFound function from next/navigation
const notFound = vi.fn();
vi.mock('next/navigation', () => ({
  notFound: () => {
    notFound();
    throw new Error('NEXT_NOT_FOUND'); // Simulate Next.js throwing an error
  },
}));

vi.mock('../src/app/writing/[slug]/page', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: vi.fn((props) => {
      // Call the original component logic, which might call notFound()
      return (actual as any).default(props);
    }),
  };
});

// Top-level mock for @/lib/notion
vi.mock('@/lib/notion', async (importOriginal) => {
  const actual = await importOriginal<typeof notion>();
  return {
    ...actual,
    getPhotosFromCache: vi.fn(),
    getPostsFromCache: vi.fn(),
  };
});

describe('Writing Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', async () => {
    // Mock getPostsFromCache to return a valid post
    vi.mocked(notion).getPhotosFromCache.mockReturnValue([]);
    vi.mocked(notion).getPostsFromCache.mockReturnValue([
      {
        id: 'foo',
        slug: 'hiring-awesome-engineers',
        title: 'hiring',
        date: '2023-01-01',
        excerpt: 'test',
        content: 'test',
        author: 'test',
        coverImage: 'test',
      },
    ]);
    const params = { slug: 'hiring-awesome-engineers' } as any;
    render(await WritingPage({ params }));
    expect(notFound).not.toHaveBeenCalled();
  });

  it('renders 404 if slug does not match', async () => {
    // Mock getPostsFromCache to return an empty array
    vi.mocked(notion).getPostsFromCache.mockReturnValue([]);
    const params = { slug: 'not-real-slug' } as any;
    await expect(WritingPage({ params })).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});
