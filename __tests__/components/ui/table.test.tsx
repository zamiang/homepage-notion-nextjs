import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { render, screen } from '@testing-library/react';

describe('Table components', () => {
  describe('Table', () => {
    it('should render table element', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute('data-slot', 'table');
    });

    it('should have overflow container', () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      const tableContainer = container.querySelector('[data-slot="table-container"]');
      expect(tableContainer).toBeInTheDocument();
      expect(tableContainer).toHaveClass('overflow-x-auto');
    });

    it('should apply custom className', () => {
      render(
        <Table className="custom-class">
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      const table = screen.getByRole('table');
      expect(table).toHaveClass('custom-class');
    });
  });

  describe('TableHeader', () => {
    it('should render thead element', () => {
      const { container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>,
      );
      const thead = container.querySelector('thead');
      expect(thead).toBeInTheDocument();
      expect(thead).toHaveAttribute('data-slot', 'table-header');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Table>
          <TableHeader className="custom-header">
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>,
      );
      const thead = container.querySelector('thead');
      expect(thead).toHaveClass('custom-header');
    });
  });

  describe('TableBody', () => {
    it('should render tbody element', () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      const tbody = container.querySelector('tbody');
      expect(tbody).toBeInTheDocument();
      expect(tbody).toHaveAttribute('data-slot', 'table-body');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Table>
          <TableBody className="custom-body">
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      const tbody = container.querySelector('tbody');
      expect(tbody).toHaveClass('custom-body');
    });
  });

  describe('TableFooter', () => {
    it('should render tfoot element', () => {
      const { container } = render(
        <Table>
          <TableFooter>
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
        </Table>,
      );
      const tfoot = container.querySelector('tfoot');
      expect(tfoot).toBeInTheDocument();
      expect(tfoot).toHaveAttribute('data-slot', 'table-footer');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Table>
          <TableFooter className="custom-footer">
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
        </Table>,
      );
      const tfoot = container.querySelector('tfoot');
      expect(tfoot).toHaveClass('custom-footer');
    });
  });

  describe('TableRow', () => {
    it('should render tr element', () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      const tr = container.querySelector('tr');
      expect(tr).toBeInTheDocument();
      expect(tr).toHaveAttribute('data-slot', 'table-row');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow className="custom-row">
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      const tr = container.querySelector('tr');
      expect(tr).toHaveClass('custom-row');
    });
  });

  describe('TableHead', () => {
    it('should render th element', () => {
      const { container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header Text</TableHead>
            </TableRow>
          </TableHeader>
        </Table>,
      );
      const th = container.querySelector('th');
      expect(th).toBeInTheDocument();
      expect(th).toHaveAttribute('data-slot', 'table-head');
      expect(th).toHaveTextContent('Header Text');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="custom-head">Header</TableHead>
            </TableRow>
          </TableHeader>
        </Table>,
      );
      const th = container.querySelector('th');
      expect(th).toHaveClass('custom-head');
    });
  });

  describe('TableCell', () => {
    it('should render td element', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Cell Text</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      const td = screen.getByText('Cell Text');
      expect(td).toBeInTheDocument();
      expect(td.tagName).toBe('TD');
      expect(td).toHaveAttribute('data-slot', 'table-cell');
    });

    it('should apply custom className', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="custom-cell">Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      const td = screen.getByText('Cell');
      expect(td).toHaveClass('custom-cell');
    });
  });

  describe('TableCaption', () => {
    it('should render caption element', () => {
      const { container } = render(
        <Table>
          <TableCaption>Table Caption</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      const caption = container.querySelector('caption');
      expect(caption).toBeInTheDocument();
      expect(caption).toHaveAttribute('data-slot', 'table-caption');
      expect(caption).toHaveTextContent('Table Caption');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Table>
          <TableCaption className="custom-caption">Caption</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      const caption = container.querySelector('caption');
      expect(caption).toHaveClass('custom-caption');
    });
  });

  describe('Complete table', () => {
    it('should render complete table with all components', () => {
      render(
        <Table>
          <TableCaption>Employee Data</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>Developer</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane Smith</TableCell>
              <TableCell>Designer</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>2 employees</TableCell>
            </TableRow>
          </TableFooter>
        </Table>,
      );

      expect(screen.getByText('Employee Data')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('2 employees')).toBeInTheDocument();
    });

    it('should match snapshot', () => {
      const { container } = render(
        <Table>
          <TableCaption>Test Table</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Header 1</TableHead>
              <TableHead>Header 2</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Data 1</TableCell>
              <TableCell>Data 2</TableCell>
            </TableRow>
          </TableBody>
        </Table>,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
