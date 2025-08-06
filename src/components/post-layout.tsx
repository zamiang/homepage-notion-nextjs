import { Post } from '@/lib/notion';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

import { components } from './mdx-component';

interface PostLayoutProps {
  post: Post;
  headerContent?: React.ReactNode;
  subHeaderContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

export default function PostLayout({
  post,
  headerContent,
  subHeaderContent,
  footerContent,
}: PostLayoutProps) {
  return (
    <>
      <article className="max-w-2xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            <time>{format(new Date(post.date), 'MMMM d, yyyy')}</time>
            {headerContent}
          </div>
          {subHeaderContent}
          <h1 className="text-4xl font-bold mb-4 text-foreground">{post.title}</h1>
          <div className="excerpt text-muted-foreground">{post.excerpt}</div>
          <div className="divider"></div>
        </header>
        <div className="max-w-none">
          <ReactMarkdown
            components={components}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
        {footerContent}
      </article>
    </>
  );
}
