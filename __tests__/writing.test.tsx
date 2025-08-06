import * as notion from '@/lib/notion';
import { render, screen } from '@testing-library/react';
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

  it('renders the writing page when a valid slug is provided', async () => {
    // Mock getPostsFromCache to return a valid post
    vi.mocked(notion).getPhotosFromCache.mockReturnValue([]);
    vi.mocked(notion).getPostsFromCache.mockReturnValue([
      {
        id: 'foo',
        slug: 'hiring-awesome-engineers',
        title: 'Hiring Awesome Engineers',
        date: '2023-01-01',
        excerpt: 'Tips for hiring great engineers.',
        content: '<h1>Hiring Awesome Engineers</h1><p>Here are some tips...</p>',
        author: 'John Doe',
        coverImage: '/images/hiring.jpg',
      },
    ]);
    const params = Promise.resolve({ slug: 'hiring-awesome-engineers' });
    render(await WritingPage({ params }));

    // Verify that the page content is rendered
    expect(
      screen.getByRole('heading', { level: 1, name: /Hiring Awesome Engineers/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('December 31, 2022')).toBeInTheDocument();
    expect(screen.getByText('Here are some tips...')).toBeInTheDocument();
    expect(notFound).not.toHaveBeenCalled();
  });

  it('renders 404 if slug does not match', async () => {
    // Mock getPostsFromCache to return an empty array
    vi.mocked(notion).getPostsFromCache.mockReturnValue([]);
    const params = Promise.resolve({ slug: 'not-real-slug' });
    await expect(WritingPage({ params })).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalled();
  });
});
