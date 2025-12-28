import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { slugify } from '@/lib/toc';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { isValidElement, ReactNode } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { Badge } from './ui/badge';

function getTextContent(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(getTextContent).join('');
  if (isValidElement(children)) {
    return getTextContent((children.props as { children?: ReactNode }).children);
  }
  return '';
}

const components = {
  p: ({ children }: { children?: React.ReactNode }) => <p>{children}</p>,
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a href={href}>{children}</a>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => <ul>{children}</ul>,
  ol: ({ children }: { children?: React.ReactNode }) => <ol>{children}</ol>,
  li: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
  blockquote: ({ children }: { children?: React.ReactNode }) => <blockquote>{children}</blockquote>,
  code: ({ className, children, ...props }: { className?: string; children?: React.ReactNode }) => {
    const match = /language-(\w+)/.exec(className || '');
    return match ? (
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        {...props}
        className="rounded-md [&>code]:bg-transparent [&>code]:p-2 [&>code]:rounded-md"
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <Badge variant="pre" className="font-mono">
        {children}
      </Badge>
    );
  },
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    return <pre className={cn('bg-transparent p-0', className)} {...props} />;
  },
  img: ({ src, alt }: { src?: string | Blob; alt?: string }) => {
    const imageUrl = src ? (typeof src === 'string' ? src : URL.createObjectURL(src)) : '';
    return (
      <Image
        src={imageUrl}
        alt={alt || ''}
        className="h-auto w-full"
        width={1200}
        height={800}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
        quality={85}
      />
    );
  },
  h1: ({ children }: { children?: React.ReactNode }) => {
    const id = slugify(getTextContent(children));
    return <h2 id={id}>{children}</h2>;
  },
  h2: ({ children }: { children?: React.ReactNode }) => {
    const id = slugify(getTextContent(children));
    return <h3 id={id}>{children}</h3>;
  },
  h3: ({ children }: { children?: React.ReactNode }) => {
    const id = slugify(getTextContent(children));
    return <h4 id={id}>{children}</h4>;
  },
  h4: ({ children }: { children?: React.ReactNode }) => {
    const id = slugify(getTextContent(children));
    return <h5 id={id}>{children}</h5>;
  },
  h5: ({ children }: { children?: React.ReactNode }) => {
    const id = slugify(getTextContent(children));
    return <h5 id={id}>{children}</h5>;
  },
  h6: ({ children }: { children?: React.ReactNode }) => {
    const id = slugify(getTextContent(children));
    return <h6 id={id}>{children}</h6>;
  },
  table: ({ children }: { children?: React.ReactNode }) => <Table>{children}</Table>,
  thead: ({ children }: { children?: React.ReactNode }) => <TableHeader>{children}</TableHeader>,
  tbody: ({ children }: { children?: React.ReactNode }) => <TableBody>{children}</TableBody>,
  tr: ({ children }: { children?: React.ReactNode }) => <TableRow>{children}</TableRow>,
  td: ({ children }: { children?: React.ReactNode }) => <TableCell>{children}</TableCell>,
  th: ({ children }: { children?: React.ReactNode }) => <TableHead>{children}</TableHead>,
};

export { components };
