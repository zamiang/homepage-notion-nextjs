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
          className="next-button"
        >
          Next
        </Link>
      )}
      <h4 style={{ marginTop: 0 }}>
        <Link href={`/writing/${post.slug}`} aria-label={post.title}>
          {post.title}
        </Link>
      </h4>
      {!isPast && !isCurrent && <p className="truncated-text">{post.excerpt}</p>}
    </div>
  );
}
