import PhotoPage, { generateMetadata, generateStaticParams } from '@/app/photos/[slug]/page';
import { getPhotosFromCache } from '@/lib/notion';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/notion', () => ({
  getPhotosFromCache: vi.fn(),
  getAllSectionPostsFromCache: vi.fn(() => []),
  getPostsFromCache: vi.fn(() => []),
}));

const mockPhotos = [
  {
    id: '1',
    slug: 'test-photo',
    title: 'Test Photo',
    date: '2023-01-01',
    coverImage: 'test-image.jpg',
    excerpt: 'This is a test photo.',
    content: '## Test Photo Content',
    author: 'Test Author',
  },
];

describe('PhotoPage', () => {
  beforeEach(() => {
    (getPhotosFromCache as ReturnType<typeof vi.fn>).mockReturnValue(mockPhotos);
  });

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
