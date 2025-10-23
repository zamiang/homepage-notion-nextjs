import SeriesPostCard from '@/components/series-post-card';
import { Post } from '@/lib/notion';
import { render, screen } from '@testing-library/react';

const mockPost: Post = {
  id: '1',
  title: 'Test Series Post',
  slug: 'test-series-post',
  coverImage: 'cover.jpg',
  date: '2023-09-10',
  excerpt: 'This is part of a series.',
  content: 'Series post content.',
  author: 'Test Author',
  section: 'VBC',
};

describe('SeriesPostCard', () => {
  it('should render post title', () => {
    render(<SeriesPostCard post={mockPost} />);
    expect(screen.getByText('Test Series Post')).toBeInTheDocument();
  });

  it('should render link to post', () => {
    render(<SeriesPostCard post={mockPost} />);
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/writing/test-series-post');
    expect(links[0]).toHaveAttribute('aria-label', 'Test Series Post');
  });

  it('should render excerpt by default', () => {
    render(<SeriesPostCard post={mockPost} />);
    expect(screen.getByText('This is part of a series.')).toBeInTheDocument();
  });

  it('should not render excerpt when isPast is true', () => {
    render(<SeriesPostCard post={mockPost} isPast={true} />);
    expect(screen.queryByText('This is part of a series.')).not.toBeInTheDocument();
  });

  it('should not render excerpt when isCurrent is true', () => {
    render(<SeriesPostCard post={mockPost} isCurrent={true} />);
    expect(screen.queryByText('This is part of a series.')).not.toBeInTheDocument();
  });

  it('should apply past-post class when isPast is true', () => {
    const { container } = render(<SeriesPostCard post={mockPost} isPast={true} />);
    const postDiv = container.querySelector('.past-post');
    expect(postDiv).toBeInTheDocument();
  });

  it('should apply current-post class when isCurrent is true', () => {
    const { container } = render(<SeriesPostCard post={mockPost} isCurrent={true} />);
    const postDiv = container.querySelector('.current-post');
    expect(postDiv).toBeInTheDocument();
  });

  it('should apply next-post class when isNext is true', () => {
    const { container } = render(<SeriesPostCard post={mockPost} isNext={true} />);
    const postDiv = container.querySelector('.next-post');
    expect(postDiv).toBeInTheDocument();
  });

  it('should render Next button when isNext is true', () => {
    render(<SeriesPostCard post={mockPost} isNext={true} />);
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toHaveAttribute('href', '/writing/test-series-post');
    expect(nextButton).toHaveAttribute('aria-label', 'Next post: Test Series Post');
  });

  it('should not render Next button when isNext is false', () => {
    render(<SeriesPostCard post={mockPost} isNext={false} />);
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('should apply multiple classes when multiple flags are true', () => {
    const { container } = render(<SeriesPostCard post={mockPost} isPast={true} isCurrent={true} />);
    const postDiv = container.querySelector('.post');
    expect(postDiv).toHaveClass('past-post');
    expect(postDiv).toHaveClass('current-post');
  });

  it('should only apply post class by default', () => {
    const { container } = render(<SeriesPostCard post={mockPost} />);
    const postDiv = container.querySelector('.post');
    expect(postDiv).toBeInTheDocument();
    expect(postDiv).not.toHaveClass('past-post');
    expect(postDiv).not.toHaveClass('current-post');
    expect(postDiv).not.toHaveClass('next-post');
  });

  it('should match snapshot for default state', () => {
    const { container } = render(<SeriesPostCard post={mockPost} />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot for past post', () => {
    const { container } = render(<SeriesPostCard post={mockPost} isPast={true} />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot for current post', () => {
    const { container } = render(<SeriesPostCard post={mockPost} isCurrent={true} />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot for next post', () => {
    const { container } = render(<SeriesPostCard post={mockPost} isNext={true} />);
    expect(container).toMatchSnapshot();
  });
});
