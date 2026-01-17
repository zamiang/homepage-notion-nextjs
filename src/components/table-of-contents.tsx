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
    <nav
      aria-label="Table of contents"
      className="toc mb-8 p-5 bg-accent/10 border border-accent/20 rounded-lg"
    >
      <p className="section-label mb-2" aria-hidden="true">
        In This Article
      </p>
      <ul className="space-y-2 m-0 p-0 list-none">
        {items.map((item) => (
          <li
            key={item.id}
            className="text-muted-foreground m-0"
            style={{ marginLeft: `${(item.level - minLevel) * 1}rem` }}
          >
            <a
              href={`#${item.id}`}
              className="text-sm text-muted-foreground hover:text-accent transition-colors duration-150 !border-none !no-underline"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
