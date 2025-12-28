import TableOfContents from '@/components/table-of-contents';
import { TocItem } from '@/lib/toc';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('TableOfContents', () => {
  const mockItems: TocItem[] = [
    { id: 'introduction', text: 'Introduction', level: 2 },
    { id: 'background', text: 'Background', level: 3 },
    { id: 'methodology', text: 'Methodology', level: 3 },
    { id: 'results', text: 'Results', level: 2 },
    { id: 'conclusion', text: 'Conclusion', level: 2 },
  ];

  it('should render the table of contents with heading', () => {
    render(<TableOfContents items={mockItems} />);

    expect(screen.getByRole('heading', { name: 'Contents' })).toBeInTheDocument();
  });

  it('should render all items as links', () => {
    render(<TableOfContents items={mockItems} />);

    mockItems.forEach((item) => {
      const link = screen.getByRole('link', { name: item.text });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `#${item.id}`);
    });
  });

  it('should not render when fewer than 3 items', () => {
    const fewItems: TocItem[] = [
      { id: 'intro', text: 'Intro', level: 2 },
      { id: 'outro', text: 'Outro', level: 2 },
    ];

    const { container } = render(<TableOfContents items={fewItems} />);

    expect(container.firstChild).toBeNull();
  });

  it('should render when exactly 3 items', () => {
    const threeItems: TocItem[] = [
      { id: 'one', text: 'One', level: 2 },
      { id: 'two', text: 'Two', level: 2 },
      { id: 'three', text: 'Three', level: 2 },
    ];

    render(<TableOfContents items={threeItems} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });

  it('should apply indentation based on heading level relative to minimum', () => {
    render(<TableOfContents items={mockItems} />);

    const listItems = screen.getAllByRole('listitem');

    // minLevel is 2, so:
    // Level 2 headings: (2 - 2) * 1 = 0rem
    // Level 3 headings: (3 - 2) * 1 = 1rem
    expect(listItems[0]).toHaveStyle({ marginLeft: '0rem' }); // level 2
    expect(listItems[1]).toHaveStyle({ marginLeft: '1rem' }); // level 3
    expect(listItems[2]).toHaveStyle({ marginLeft: '1rem' }); // level 3
    expect(listItems[3]).toHaveStyle({ marginLeft: '0rem' }); // level 2
    expect(listItems[4]).toHaveStyle({ marginLeft: '0rem' }); // level 2
  });

  it('should handle mixed h1 and h2 headings with correct indentation', () => {
    const mixedItems: TocItem[] = [
      { id: 'intro', text: 'Introduction', level: 2 },
      { id: 'main', text: 'Main Section', level: 1 },
      { id: 'sub', text: 'Subsection', level: 2 },
    ];

    render(<TableOfContents items={mixedItems} />);

    const listItems = screen.getAllByRole('listitem');

    // minLevel is 1, so:
    // Level 1: (1 - 1) * 1 = 0rem
    // Level 2: (2 - 1) * 1 = 1rem
    expect(listItems[0]).toHaveStyle({ marginLeft: '1rem' }); // level 2
    expect(listItems[1]).toHaveStyle({ marginLeft: '0rem' }); // level 1
    expect(listItems[2]).toHaveStyle({ marginLeft: '1rem' }); // level 2
  });

  it('should not render for empty items array', () => {
    const { container } = render(<TableOfContents items={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it('should render navigation landmark', () => {
    render(<TableOfContents items={mockItems} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    render(<TableOfContents items={mockItems} />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('toc', 'mb-8', 'p-4', 'bg-muted', 'rounded-lg');
  });
});
