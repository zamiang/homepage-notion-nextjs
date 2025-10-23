import PhotoCard from '@/components/photo-card';
import { Post } from '@/lib/notion';
import { render, screen } from '@testing-library/react';

const mockPhotoPost: Post = {
  id: '1',
  title: 'Test Photo Title',
  slug: 'test-photo',
  coverImage: 'photo.jpg',
  date: '2023-08-20',
  excerpt: 'A beautiful landscape photo.',
  content: '',
  author: 'Test Photographer',
  section: 'All',
};

describe('PhotoCard', () => {
  it('should render photo image', () => {
    render(<PhotoCard post={mockPhotoPost} />);
    const image = screen.getByRole('img', { name: 'Test Photo Title' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'Test Photo Title');
  });

  it('should render image with correct src', () => {
    render(<PhotoCard post={mockPhotoPost} />);
    const image = screen.getByRole('img', { name: 'Test Photo Title' });
    expect(image).toHaveAttribute('src', expect.stringContaining('photo.jpg'));
  });

  it('should render photo title when shouldHideText is false', () => {
    render(<PhotoCard post={mockPhotoPost} shouldHideText={false} />);
    expect(screen.getByText('Test Photo Title')).toBeInTheDocument();
  });

  it('should render formatted date when shouldHideText is false', () => {
    render(<PhotoCard post={mockPhotoPost} shouldHideText={false} />);
    // Date may vary by timezone, so check for date pattern
    expect(screen.getByText(/Aug (19|20), 2023/)).toBeInTheDocument();
  });

  it('should not render title when shouldHideText is true', () => {
    render(<PhotoCard post={mockPhotoPost} shouldHideText={true} />);
    expect(screen.queryByText('Test Photo Title')).not.toBeInTheDocument();
  });

  it('should not render date when shouldHideText is true', () => {
    render(<PhotoCard post={mockPhotoPost} shouldHideText={true} />);
    expect(screen.queryByText(/Aug (19|20), 2023/)).not.toBeInTheDocument();
  });

  it('should render links to photo page', () => {
    render(<PhotoCard post={mockPhotoPost} shouldHideText={false} />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(2); // Image link, date link, title link
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', '/photos/test-photo');
      expect(link).toHaveAttribute('aria-label', 'Test Photo Title');
    });
  });

  it('should render only image link when shouldHideText is true', () => {
    render(<PhotoCard post={mockPhotoPost} shouldHideText={true} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1); // Only image link
    expect(links[0]).toHaveAttribute('href', '/photos/test-photo');
  });

  it('should have correct aspect ratio class', () => {
    const { container } = render(<PhotoCard post={mockPhotoPost} />);
    const aspectRatioDiv = container.querySelector('.aspect-\\[1\\/1\\]');
    expect(aspectRatioDiv).toBeInTheDocument();
  });

  it('should match snapshot with text visible', () => {
    const { container } = render(<PhotoCard post={mockPhotoPost} shouldHideText={false} />);
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with text hidden', () => {
    const { container } = render(<PhotoCard post={mockPhotoPost} shouldHideText={true} />);
    expect(container).toMatchSnapshot();
  });
});
