import Link from 'next/link';
import { Post } from '@/lib/notion';

interface PostCardProps {
  post: Post;
}

export default function SeriesPostCard({ post }: PostCardProps) {
  return (
    <div className="post">
      <h4 style={{ marginTop: 0 }}>
        <Link href={`/writing/${post.slug}`} aria-label={post.title}>
          {post.title}
        </Link>
      </h4>
      <p className="truncated-text">{post.excerpt}</p>
    </div>
  );
}
