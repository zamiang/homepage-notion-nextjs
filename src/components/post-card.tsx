import { Post } from '@/lib/notion';
import { format } from 'date-fns';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const postDate = new Date(post.date);

  return (
    <div className="post group rounded-lg -mx-3 px-3 py-2 transition-colors duration-200 hover:bg-muted/40">
      <div className="post-meta">
        <p className="post-date">
          <time dateTime={postDate.toISOString().split('T')[0]}>
            {format(postDate, 'MMM d, yyyy')}
          </time>
        </p>
      </div>
      <h3 className="post-title">
        <Link
          href={`/writing/${post.slug}`}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm"
        >
          {post.title}
        </Link>
      </h3>
      <p className="truncated-text">{post.excerpt}</p>
    </div>
  );
}
