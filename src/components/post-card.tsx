import { Post, getWordCount } from '@/lib/notion';
import { calculateReadingTime } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const wordCount = post.content ? getWordCount(post.content) : 0;
  const readingTime = calculateReadingTime(wordCount);
  return (
    <div className="post group rounded-lg -mx-3 px-3 py-2 transition-colors duration-200 hover:bg-muted/40">
      <div className="post-meta">
        <p className="post-date">{format(new Date(post.date), 'MMM d, yyyy')}</p>
        <p className="post-reading-time">{readingTime}</p>
      </div>
      <h3 className="post-title">
        <Link
          href={`/writing/${post.slug}`}
          aria-label={post.title}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
        >
          {post.title}
        </Link>
      </h3>
      <p className="truncated-text">{post.excerpt}</p>
    </div>
  );
}
