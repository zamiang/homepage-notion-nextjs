import { Post } from '@/lib/notion';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
  isPast?: boolean;
  isCurrent?: boolean;
  isNext?: boolean;
}

export default function SeriesPostCard({
  post,
  isPast = false,
  isCurrent = false,
  isNext = false,
}: PostCardProps) {
  const classNames = [
    'post',
    isPast && 'past-post',
    isCurrent && 'current-post',
    isNext && 'next-post',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames}>
      {isNext && (
        <Link
          href={`/writing/${post.slug}`}
          aria-label={`Next post: ${post.title}`}
          className="next-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
        >
          Next
        </Link>
      )}
      <h4 className="mt-0">
        <Link
          href={`/writing/${post.slug}`}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
        >
          {post.title}
        </Link>
      </h4>
      {!isPast && !isCurrent && <p className="truncated-text">{post.excerpt}</p>}
    </div>
  );
}
