import PostLayout from '@/components/post-layout';
import { Post } from '@/lib/notion';
import { render, screen } from '@testing-library/react';

const mockPost: Post = {
  id: '1',
  title: 'Test Post',
  slug: 'test-post',
  coverImage: 'cover.jpg',
  date: '2023-01-01',
  excerpt: 'This is a test post.',
  content: 'This is the content of the test post.',
  author: 'Test Author',
};

describe('PostLayout', () => {
  it('should render the post content', () => {
    render(<PostLayout post={mockPost} />);
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('December 31, 2022')).toBeInTheDocument();
    expect(screen.getByText('This is the content of the test post.')).toBeInTheDocument();
  });

  it('should render header and footer content', () => {
    const headerContent = <div>Header</div>;
    const footerContent = <div>Footer</div>;
    render(
      <PostLayout post={mockPost} headerContent={headerContent} footerContent={footerContent} />,
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { container } = render(<PostLayout post={mockPost} />);
    expect(container).toMatchSnapshot();
  });
});
