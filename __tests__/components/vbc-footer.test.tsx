import VBCFooter from '@/components/vbc-footer';
import * as notionModule from '@/lib/notion';
import { Post } from '@/lib/notion';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the notion module
vi.mock('@/lib/notion', async () => {
  const actual = await vi.importActual<typeof notionModule>('@/lib/notion');
  return {
    ...actual,
    getVBCSectionPostsFromCache: vi.fn(),
  };
});

const mockVBCPosts: Post[] = [
  {
    id: '1',
    title: 'A First Post',
    slug: 'first-post',
    coverImage: 'cover1.jpg',
    date: '2023-01-01',
    excerpt: 'First VBC post.',
    content: 'Content 1',
    author: 'Test Author',
    section: 'VBC',
  },
  {
    id: '2',
    title: 'B Second Post',
    slug: 'second-post',
    coverImage: 'cover2.jpg',
    date: '2023-01-02',
    excerpt: 'Second VBC post.',
    content: 'Content 2',
    author: 'Test Author',
    section: 'VBC',
  },
  {
    id: '3',
    title: 'C Third Post',
    slug: 'third-post',
    coverImage: 'cover3.jpg',
    date: '2023-01-03',
    excerpt: 'Third VBC post.',
    content: 'Content 3',
    author: 'Test Author',
    section: 'VBC',
  },
];

describe('VBCFooter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(notionModule.getVBCSectionPostsFromCache).mockReturnValue(mockVBCPosts);
  });

  it('should render VBC series title', () => {
    render(<VBCFooter slug="second-post" />);
    expect(
      screen.getByText('Why Value-Based Care is Harder Than Rocket Science'),
    ).toBeInTheDocument();
  });

  it('should render VBC series description', () => {
    render(<VBCFooter slug="second-post" />);
    expect(
      screen.getByText(/This series argues that U\.S\. healthcare is "harder than rocket science"/),
    ).toBeInTheDocument();
  });

  it('should render all VBC posts', () => {
    render(<VBCFooter slug="second-post" />);
    expect(screen.getByText('A First Post')).toBeInTheDocument();
    expect(screen.getByText('B Second Post')).toBeInTheDocument();
    expect(screen.getByText('C Third Post')).toBeInTheDocument();
  });

  it('should sort posts alphabetically by title', () => {
    render(<VBCFooter slug="second-post" />);
    const postTitles = screen
      .getAllByRole('heading', { level: 4 })
      .map((h) => h.textContent)
      .filter((t) => t && !t.includes('wide business')); // Exclude future post

    expect(postTitles).toEqual(['A First Post', 'B Second Post', 'C Third Post']);
  });

  it('should mark correct post as current', () => {
    const { container } = render(<VBCFooter slug="second-post" />);
    const currentPost = container.querySelector('.current-post');
    expect(currentPost).toBeInTheDocument();
    expect(currentPost?.textContent).toContain('B Second Post');
  });

  it('should mark posts before current as past', () => {
    const { container } = render(<VBCFooter slug="second-post" />);
    const pastPosts = container.querySelectorAll('.past-post');
    expect(pastPosts).toHaveLength(1);
    expect(pastPosts[0]?.textContent).toContain('A First Post');
  });

  it('should mark post after current as next', () => {
    const { container } = render(<VBCFooter slug="second-post" />);
    const nextPost = container.querySelector('.next-post');
    expect(nextPost).toBeInTheDocument();
    expect(nextPost?.textContent).toContain('C Third Post');
  });

  it('should handle first post in series', () => {
    const { container } = render(<VBCFooter slug="first-post" />);
    const currentPost = container.querySelector('.current-post');
    expect(currentPost?.textContent).toContain('A First Post');

    const pastPosts = container.querySelectorAll('.past-post');
    expect(pastPosts).toHaveLength(0);

    const nextPost = container.querySelector('.next-post');
    expect(nextPost?.textContent).toContain('B Second Post');
  });

  it('should handle last post in series', () => {
    const { container } = render(<VBCFooter slug="third-post" />);
    const currentPost = container.querySelector('.current-post');
    expect(currentPost?.textContent).toContain('C Third Post');

    const pastPosts = container.querySelectorAll('.past-post');
    expect(pastPosts).toHaveLength(2);

    const nextPost = container.querySelector('.next-post');
    expect(nextPost).toBeNull();
  });

  it('should handle empty VBC posts', () => {
    vi.mocked(notionModule.getVBCSectionPostsFromCache).mockReturnValue([]);

    render(<VBCFooter slug="any-slug" />);
    expect(
      screen.getByText('Why Value-Based Care is Harder Than Rocket Science'),
    ).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<VBCFooter slug="second-post" />);
    expect(container).toMatchSnapshot();
  });
});
