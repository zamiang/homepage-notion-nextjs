import PhotoPage, { generateMetadata, generateStaticParams } from '@/app/photos/[slug]/page';
import { getPhotosFromCache } from '@/lib/notion';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Import the utility functions
import { createMockPhoto, createMockPhotos } from './utils';

// Mock all external dependencies at the top level
vi.mock('@/lib/notion', async () => {
  const actual = await vi.importActual('@/lib/notion');
  return {
    ...actual,
    getPhotosFromCache: vi.fn(),
    getAllSectionPostsFromCache: vi.fn(() => []),
    getPostsFromCache: vi.fn(() => []),
  };
});

const notFound = vi.fn();
vi.mock('next/navigation', () => ({
  notFound: () => {
    notFound();
    throw new Error('NEXT_NOT_FOUND'); // Simulate Next.js throwing an error
  },
}));

describe('PhotoPage', () => {
  const mockPhoto = createMockPhoto();
  const mockPhotos = createMockPhotos(1);

  beforeEach(() => {
    (getPhotosFromCache as ReturnType<typeof vi.fn>).mockReturnValue(mockPhotos);
  });

  describe('rendering', () => {
    it('renders the photo page with correct content', async () => {
      const page = await PhotoPage({ params: Promise.resolve({ slug: 'test-photo' }) });
      render(page);

      expect(screen.getByText('Test Photo')).toBeInTheDocument();
      expect(screen.getByText('December 31, 2022')).toBeInTheDocument();
      expect(screen.getByText('This is a test photo.')).toBeInTheDocument();
    });

    it('generates correct metadata', async () => {
      const metadata = await generateMetadata({ params: Promise.resolve({ slug: 'test-photo' }) });
      expect(metadata.title).toBe('Test Photo');
      expect(metadata.description).toBe('This is a test photo.');
    });

    it('generates static params correctly', async () => {
      const params = await generateStaticParams();
      expect(params).toEqual([{ slug: 'test-photo' }]);
    });
  });

  describe('edge cases', () => {
    it('handles missing photo gracefully', async () => {
      (getPhotosFromCache as ReturnType<typeof vi.fn>).mockReturnValue([]);
      await expect(
        PhotoPage({ params: Promise.resolve({ slug: 'non-existent' }) }),
      ).rejects.toThrow('NEXT_NOT_FOUND');

      expect(notFound).toHaveBeenCalled();
    });
  });
});
