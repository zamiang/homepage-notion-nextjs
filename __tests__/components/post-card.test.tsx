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

  it('should render links to post', () => {
    render(<PostCard post={mockPost} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1); // Title link only
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '/writing/test-post');
      // Link text "Test Post Title" provides sufficient accessible name
      expect(link).not.toHaveAttribute('aria-label');
    });
  });

  it('should match snapshot', () => {
    const { container } = render(<PostCard post={mockPost} />);
    expect(container).toMatchSnapshot();
  });
});
