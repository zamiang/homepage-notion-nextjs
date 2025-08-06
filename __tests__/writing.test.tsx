import WritingPage, { generateMetadata, generateStaticParams } from '@/app/writing/[slug]/page';
import { getPostsFromCache } from '@/lib/notion';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/notion', () => ({
  getPostsFromCache: vi.fn(),
  getWordCount: vi.fn(() => 100),
  getAllSectionPostsFromCache: vi.fn(() => []),
  getPhotosFromCache: vi.fn(() => []),
}));

const mockPosts = [
  {
    id: '1',
    slug: 'test-post',
    title: 'Test Post',
    date: '2023-01-01',
    coverImage: 'test-image.jpg',
    excerpt: 'This is a test post.',
    content: '## Test Post Content',
    author: 'Test Author',
    section: 'All',
  },
];

describe('WritingPage', () => {
  beforeEach(() => {
    (getPostsFromCache as ReturnType<typeof vi.fn>).mockReturnValue(mockPosts);
  });

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
