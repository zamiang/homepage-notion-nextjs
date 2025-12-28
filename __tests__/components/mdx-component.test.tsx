import { components } from '@/components/mdx-component';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// Extract components for testing
const {
  p: Paragraph,
  a: Anchor,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  blockquote: Blockquote,
  code: Code,
  pre: Pre,
  img: ImageComponent,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  table: Table,
  thead: TableHead,
  tbody: TableBody,
  tr: TableRow,
  td: TableCell,
  th: TableHeader,
} = components;

describe('MDX Components', () => {
  describe('Basic elements', () => {
    it('should render paragraph', () => {
      render(<Paragraph>Test paragraph content</Paragraph>);
      expect(screen.getByText('Test paragraph content')).toBeInTheDocument();
    });

    it('should render anchor with href', () => {
      render(<Anchor href="https://example.com">Link text</Anchor>);
      const link = screen.getByRole('link', { name: 'Link text' });
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('should render unordered list', () => {
      render(
        <UnorderedList>
          <li>Item 1</li>
        </UnorderedList>,
      );
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('should render ordered list', () => {
      render(
        <OrderedList>
          <li>Item 1</li>
        </OrderedList>,
      );
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('should render list item', () => {
      render(
        <ul>
          <ListItem>List item content</ListItem>
        </ul>,
      );
      expect(screen.getByRole('listitem')).toHaveTextContent('List item content');
    });

    it('should render blockquote', () => {
      render(<Blockquote>Quote content</Blockquote>);
      expect(screen.getByText('Quote content')).toBeInTheDocument();
    });
  });

  describe('Code component', () => {
    it('should render inline code with Badge when no language specified', () => {
      render(<Code>inline code</Code>);
      const badge = screen.getByText('inline code');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('font-mono');
    });

    it('should render syntax highlighted code when language is specified', () => {
      const { container } = render(<Code className="language-javascript">const x = 1;</Code>);
      // SyntaxHighlighter renders code inside a div with code element
      const codeElement = container.querySelector('code');
      expect(codeElement).toBeInTheDocument();
      expect(container.textContent).toContain('const x = 1;');
    });

    it('should render syntax highlighted code for TypeScript', () => {
      const { container } = render(<Code className="language-typescript">interface Props</Code>);
      // SyntaxHighlighter tokenizes the code into spans
      expect(container.textContent).toContain('interface');
      expect(container.textContent).toContain('Props');
    });

    it('should use different renderers for inline vs block code', () => {
      // Inline code (no language) uses Badge
      const { container: inlineContainer } = render(<Code>inline</Code>);
      expect(inlineContainer.querySelector('[class*="font-mono"]')).toBeInTheDocument();

      // Block code (with language) uses SyntaxHighlighter
      const { container: blockContainer } = render(<Code className="language-js">block</Code>);
      expect(blockContainer.querySelector('code')).toBeInTheDocument();
    });
  });

  describe('Pre component', () => {
    it('should render pre element with correct classes', () => {
      const { container } = render(<Pre>preformatted content</Pre>);
      const pre = container.querySelector('pre');
      expect(pre).toBeInTheDocument();
      expect(pre).toHaveClass('bg-transparent', 'p-0');
    });

    it('should preserve additional classes', () => {
      const { container } = render(<Pre className="custom-class">content</Pre>);
      const pre = container.querySelector('pre');
      expect(pre).toHaveClass('bg-transparent', 'p-0', 'custom-class');
    });
  });

  describe('Image component', () => {
    it('should render image with src and alt', () => {
      render(<ImageComponent src="/test-image.jpg" alt="Test alt text" />);
      const img = screen.getByRole('img', { name: 'Test alt text' });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('alt', 'Test alt text');
    });

    it('should handle empty alt text', () => {
      render(<ImageComponent src="/test-image.jpg" alt="" />);
      // Next.js Image with empty alt still renders as img
      const { container } = render(<ImageComponent src="/test-image.jpg" alt="" />);
      const img = container.querySelector('img');
      expect(img).toHaveAttribute('alt', '');
    });

    it('should have responsive sizing', () => {
      render(<ImageComponent src="/test-image.jpg" alt="Responsive" />);
      const img = screen.getByRole('img', { name: 'Responsive' });
      expect(img).toHaveAttribute(
        'sizes',
        '(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px',
      );
    });

    it('should render with correct dimensions', () => {
      render(<ImageComponent src="/test-image.jpg" alt="Sized image" />);
      const img = screen.getByRole('img', { name: 'Sized image' });
      expect(img).toHaveAttribute('width', '1200');
      expect(img).toHaveAttribute('height', '800');
    });
  });

  describe('Heading components', () => {
    it('should render h1 as h2 (semantic downgrade)', () => {
      render(<H1>Heading 1</H1>);
      expect(screen.getByRole('heading', { level: 2, name: 'Heading 1' })).toBeInTheDocument();
    });

    it('should render h2 as h3', () => {
      render(<H2>Heading 2</H2>);
      expect(screen.getByRole('heading', { level: 3, name: 'Heading 2' })).toBeInTheDocument();
    });

    it('should render h3 as h4', () => {
      render(<H3>Heading 3</H3>);
      expect(screen.getByRole('heading', { level: 4, name: 'Heading 3' })).toBeInTheDocument();
    });

    it('should render h4 as h5', () => {
      render(<H4>Heading 4</H4>);
      expect(screen.getByRole('heading', { level: 5, name: 'Heading 4' })).toBeInTheDocument();
    });

    it('should render h5 as h5', () => {
      render(<H5>Heading 5</H5>);
      expect(screen.getByRole('heading', { level: 5, name: 'Heading 5' })).toBeInTheDocument();
    });

    it('should render h6 as h6', () => {
      render(<H6>Heading 6</H6>);
      expect(screen.getByRole('heading', { level: 6, name: 'Heading 6' })).toBeInTheDocument();
    });
  });

  describe('Table components', () => {
    it('should render complete table structure', () => {
      render(
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Header 1</TableHeader>
              <TableHeader>Header 2</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Cell 1</TableCell>
              <TableCell>Cell 2</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('Header 1')).toBeInTheDocument();
      expect(screen.getByText('Header 2')).toBeInTheDocument();
      expect(screen.getByText('Cell 1')).toBeInTheDocument();
      expect(screen.getByText('Cell 2')).toBeInTheDocument();
    });

    it('should render table row', () => {
      render(
        <table>
          <tbody>
            <TableRow>
              <td>Row content</td>
            </TableRow>
          </tbody>
        </table>,
      );
      expect(screen.getByRole('row')).toBeInTheDocument();
    });
  });
});
