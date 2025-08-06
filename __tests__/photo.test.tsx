import * as notion from '@/lib/notion';
import { render, screen } from '@testing-library/react';
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

  it('renders the photo page when a valid slug is provided', async () => {
    // Mock getPhotosFromCache to return a valid photo
    vi.mocked(notion).getPhotosFromCache.mockReturnValue([
      {
        id: 'foo',
        slug: 'spring-birds',
        title: 'Spring Birds',
        date: '2023-05-15',
        excerpt: 'Photos of birds in the spring.',
        content: '<p>Some content</p>',
        author: 'John Doe',
        coverImage: '/images/spring-birds.jpg',
      },
    ]);

    const params = Promise.resolve({ slug: 'spring-birds' });
    render(await PhotoPage({ params }));

    // Verify that the page content is rendered
    expect(screen.getByRole('heading', { level: 1, name: /Spring Birds/i })).toBeInTheDocument();
    expect(screen.getByText('May 14, 2023')).toBeInTheDocument();
    expect(screen.getByText('Spring Birds')).toBeInTheDocument();
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
