import Link from 'next/link';
import { format } from 'date-fns';
import { Post, getWordCount } from '@/lib/notion';
import { calculateReadingTime } from '@/lib/utils';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const wordCount = post.content ? getWordCount(post.content) : 0;
  const readingTime = calculateReadingTime(wordCount);
  return (
    <div className="post">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <p>
            <Link href={`/writing/${post.slug}`} aria-label={post.title}>
              {format(new Date(post.date), 'MMM d, yyyy')}
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <p className="text-muted-foreground">{readingTime}</p>
        </div>
      </div>
      <h4 style={{ marginTop: 0 }}>
        <Link href={`/writing/${post.slug}`} aria-label={post.title}>
          {post.title}
        </Link>
      </h4>
      <p className="truncated-text">{post.excerpt}</p>
    </div>
  );
}
