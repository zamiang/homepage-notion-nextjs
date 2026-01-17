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
  tocContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

export default function PostLayout({
  post,
  headerContent,
  subHeaderContent,
  tocContent,
  footerContent,
}: PostLayoutProps) {
  const postDate = new Date(post.date);

  return (
    <>
      <article className="max-w-2xl mx-auto">
        <header className="mb-8">
          {subHeaderContent}
          <div className="section-label flex items-center gap-2 mb-3">
            <time dateTime={postDate.toISOString().split('T')[0]}>
              {format(postDate, 'MMMM d, yyyy')}
            </time>
            {headerContent && (
              <>
                <span className="text-border" aria-hidden="true">
                  ·
                </span>
                {headerContent}
              </>
            )}
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-normal italic leading-tight mb-4 text-foreground">
            {post.title}
          </h1>
          <p className="section-subtitle text-lg">{post.excerpt}</p>
          <div className="section-rule mt-6" aria-hidden="true"></div>
        </header>
        {tocContent}
        <div className="prose prose-slate max-w-none mb-12 prose-headings:font-serif prose-a:text-accent prose-a:no-underline hover:prose-a:text-accent/80">
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
