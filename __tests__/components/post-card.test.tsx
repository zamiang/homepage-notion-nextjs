import PostCard from '@/components/post-card';
import { Post } from '@/lib/notion';
import { render, screen } from '@testing-library/react';

const mockPost: Post = {
  id: '1',
  title: 'Test Post Title',
  slug: 'test-post',
  coverImage: 'cover.jpg',
  date: '2023-06-15',
  excerpt: 'This is a test post excerpt that should be displayed.',
  content: 'This is the full content. '.repeat(50), // ~250 words
  author: 'Test Author',
  section: 'All',
};

describe('PostCard', () => {
  it('should render post title', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
  });

  it('should render formatted date', () => {
    render(<PostCard post={mockPost} />);
    // Date may vary by timezone, so check for date pattern
    expect(screen.getByText(/Jun (14|15), 2023/)).toBeInTheDocument();
  });

  it('should render excerpt', () => {
    render(<PostCard post={mockPost} />);
    expect(
      screen.getByText('This is a test post excerpt that should be displayed.'),
    ).toBeInTheDocument();
  });

  it('should render reading time', () => {
    render(<PostCard post={mockPost} />);
    // 250 words (50 repeats * 5 words) at 225 wpm = 2 min read
    expect(screen.getByText('2 min read')).toBeInTheDocument();
  });

  it('should render links to post', () => {
    render(<PostCard post={mockPost} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1); // Title link only
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '/writing/test-post');
      expect(link).toHaveAttribute('aria-label', 'Test Post Title');
    });
  });

  it('should handle post with no content', () => {
    const postWithoutContent = { ...mockPost, content: '' };
    render(<PostCard post={postWithoutContent} />);
    expect(screen.getByText('0 min read')).toBeInTheDocument();
  });

  it('should handle post with undefined content', () => {
    const postWithUndefinedContent = { ...mockPost, content: undefined as unknown as string };
    render(<PostCard post={postWithUndefinedContent} />);
    expect(screen.getByText('0 min read')).toBeInTheDocument();
  });

  it('should calculate correct reading time for longer content', () => {
    // Create content with ~600 words (3 min read)
    const longContent = 'word '.repeat(600);
    const postWithLongContent = { ...mockPost, content: longContent };
    render(<PostCard post={postWithLongContent} />);
    expect(screen.getByText('3 min read')).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<PostCard post={mockPost} />);
    expect(container).toMatchSnapshot();
  });
});
