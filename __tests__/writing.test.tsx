import WritingPage, { generateMetadata, generateStaticParams } from '@/app/writing/[slug]/page';
import { getPostsFromCache } from '@/lib/notion';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Import the utility functions
import { createMockPost, createMockPosts } from './utils';

vi.mock('@/lib/notion', () => ({
  getPostsFromCache: vi.fn(),
  getWordCount: vi.fn(() => 100),
  getAllSectionPostsFromCache: vi.fn(() => []),
  getPhotosFromCache: vi.fn(() => []),
}));

const notFound = vi.fn();
vi.mock('next/navigation', () => ({
  notFound: () => {
    notFound();
    throw new Error('NEXT_NOT_FOUND'); // Simulate Next.js throwing an error
  },
}));

// Mock fetch for API calls to simulate network errors
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: vi.fn(),
    text: vi.fn(),
  } as unknown as Response),
) as any;

describe('WritingPage', () => {
  const mockPosts = createMockPosts(1);

  beforeEach(() => {
    (getPostsFromCache as ReturnType<typeof vi.fn>).mockReturnValue(mockPosts);
  });

  describe('rendering', () => {
    it('renders the writing page with correct content', async () => {
      const page = await WritingPage({ params: Promise.resolve({ slug: 'test-post' }) });
      render(page);

      expect(screen.getByText('Test Post')).toBeInTheDocument();
      expect(screen.getByText('December 31, 2022')).toBeInTheDocument();
      expect(screen.getByText('This is a test post.')).toBeInTheDocument();
    });

    it('generates correct metadata', async () => {
      const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'test-post' }) });
      expect(metadata.title).toBe('Test Post');
      expect(metadata.description).toBe('This is a test post.');
    });

    it('generates static params correctly', async () => {
      const params = await generateStaticParams();
      expect(params).toEqual([{ slug: 'test-post' }]);
    });
  });

  describe('edge cases', () => {
    it('handles missing photo gracefully', async () => {
      (getPostsFromCache as ReturnType<typeof vi.fn>).mockReturnValue([]);
      await expect(
        WritingPage({ params: Promise.resolve({ slug: 'non-existent' }) }),
      ).rejects.toThrow('NEXT_NOT_FOUND');

      expect(notFound).toHaveBeenCalled();
    });
  });
});
