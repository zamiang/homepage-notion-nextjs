import { Post } from '@/lib/notion';
import { format } from 'date-fns';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const postDate = new Date(post.date);

  return (
    <div className="post group rounded-lg -mx-3 px-3 py-3 transition-colors duration-200 ease-out hover:bg-muted/40">
      <div className="post-meta">
        <p className="post-date text-sm">
          <time dateTime={postDate.toISOString().split('T')[0]}>
            {format(postDate, 'MMM d, yyyy')}
          </time>
        </p>
      </div>
      <h3 className="post-title">
        <Link
          href={`/writing/${post.slug}`}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 group-hover:text-accent transition-colors duration-150"
        >
          {post.title}
        </Link>
      </h3>
      <p className="truncated-text text-muted-foreground">{post.excerpt}</p>
    </div>
  );
}
