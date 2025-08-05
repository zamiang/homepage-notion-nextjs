import * as notion from '@/lib/notion';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import PhotoPage from '../src/app/photos/[slug]/page';
import WritingPage from '../src/app/writing/[slug]/page';

// Mock the notFound function from next/navigation
const notFound = vi.fn();
vi.mock('next/navigation', () => ({
  notFound: () => {
    notFound();
    throw new Error('NEXT_NOT_FOUND'); // Simulate Next.js throwing an error
  },
}));

// Mock the page components to avoid actual rendering issues
vi.mock('../src/app/photos/[slug]/page', async (importOriginal) => {
  const actual = await importOriginal<typeof notion>();
  return {
    ...(actual as any),
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

describe('Photo Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', async () => {
    // Mock getPhotosFromCache to return a valid post
    vi.mocked(notion).getPostsFromCache.mockReturnValue([]);
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
    const params = { slug: 'spring-birds' } as any;
    render(await PhotoPage({ params }));
    expect(notFound).not.toHaveBeenCalled();
  });

  it('renders 404 if slug does not match', async () => {
    // Mock getPhotosFromCache to return an empty array
    vi.mocked(notion).getPhotosFromCache.mockReturnValue([]);
    const params = { slug: 'not-real-slug' } as any;
    await expect(PhotoPage({ params })).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});
