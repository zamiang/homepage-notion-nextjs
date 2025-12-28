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
    <div className="post">
      <div className="post-meta">
        <p className="post-date">{format(new Date(post.date), 'MMM d, yyyy')}</p>
        <p className="post-reading-time">{readingTime}</p>
      </div>
      <h3 className="post-title">
        <Link href={`/writing/${post.slug}`} aria-label={post.title}>
          {post.title}
        </Link>
      </h3>
      <p className="truncated-text">{post.excerpt}</p>
    </div>
  );
}
