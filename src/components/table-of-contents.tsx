import { TocItem } from '@/lib/toc';

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length < 3) {
    return null; // Don't show TOC for short posts
  }

  // Find the minimum heading level to use as baseline for indentation
  const minLevel = Math.min(...items.map((item) => item.level));

  return (
    <nav className="toc mb-4 p-4 bg-muted rounded-lg">
      <h4 className="text-lg mt-0 pt-0" style={{ background: 'transparent' }}>
        Contents
      </h4>
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            className="text-muted-foreground"
            style={{ marginLeft: `${(item.level - minLevel) * 1}rem` }}
          >
            <a
              href={`#${item.id}`}
              className="text-muted-foreground hover:text-foreground transition-colors no-underline border-none"
              style={{ textDecoration: 'none', borderBottom: 'none' }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
