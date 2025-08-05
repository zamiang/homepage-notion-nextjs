import * as notion from '@/lib/notion';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import PhotoPage from '../src/app/photos/[slug]/page';

// Mock the notFound function from next/navigation
const notFound = vi.fn();
vi.mock('next/navigation', () => ({
  notFound: () => {
    notFound();
    throw new Error('NEXT_NOT_FOUND'); // Simulate Next.js throwing an error
  },
}));

// Top-level mock for @/lib/notion
vi.mock('@/lib/notion', async (importOriginal) => {
  const actual = await importOriginal<typeof notion>();
  return {
    ...actual,
    getPhotosFromCache: vi.fn(),
    getPostsFromCache: vi.fn(),
  };
});

describe('Photo Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing when slug matches a photo', async () => {
    // Mock getPhotosFromCache to return a valid post
    vi.mocked(notion).getPhotosFromCache.mockReturnValue([
      {
        id: 'foo',
        slug: 'spring-birds',
        title: 'Flowers',
        date: '2023-01-01',
        excerpt: 'test',
        content: 'test',
        author: 'test',
        coverImage: 'test',
      },
    ]);

    const params = Promise.resolve({ slug: 'spring-birds' });
    render(await PhotoPage({ params }));
    expect(notFound).not.toHaveBeenCalled();
  });

  it('renders 404 when slug does not match any photo', async () => {
    // Mock getPhotosFromCache to return an empty array
    vi.mocked(notion).getPhotosFromCache.mockReturnValue([]);

    const params = Promise.resolve({ slug: 'not-real-slug' });
    await expect(PhotoPage({ params })).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});
